/*
	author:  于绍纳 2017-06-27
	purpose: 商学院后台管理
*/

package models

import (
	"github.com/astaxie/beego/config"
	"doggy/gutils"
	"doggy/gutils/conf"
	"strings"
	"time"

	"fmt"

	"encoding/base64"

	"doggy/gutils/gredis"
	"io/ioutil"
	"os"

	"crypto/hmac"
	"crypto/sha1"
	"encoding/json"
	"hash"
	"io"


	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/utils"
	"github.com/tealeg/xlsx"
)

func UserData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UserData"

	condition := param.Get("condition").String() //手机号
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	//isintegral 积分账户标记 1
	o := orm.NewOrm()
	sql := `select u.userid,u.mobile,d.name as doctorname,ifnull(d.integral,0) as integral from t_user u inner join t_doctor d on u.userid=d.doctorid
	 		where u.roleid=3 and d.isintegral=1 `

	if condition != "" {
		sql = fmt.Sprintf("%s and u.mobile like '%%%s%%' ", sql, condition)
	}

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}

	sql = fmt.Sprintf("%s LIMIT %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func UserAdd(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UserAdd"
	mobile := param.Get("mobile").String()
	if mobile == "" {
		err.Errorf(gutils.ParamError, "手机号不能为空!")
		return
	}
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	o := orm.NewOrm()
	var res config.LJSON
	_, err.Msg = o.Raw(" select d.doctorid,d.isintegral from t_user u inner join t_doctor d on u.userid=d.doctorid where u.roleid=3 and u.mobile=? ", mobile).ValuesJSON(&res)
	if res.ItemCount() != 0 {
		err.Errorf(gutils.ParamError, "手机号已存在!")
		isintegral := res.Item(0).Get("integral").Int()
		doctorid := res.Item(0).Get("doctorid").String()
		if isintegral == 0 {
			_, err.Msg = o.Raw(" update t_doctor set isintegral=1,updatetime=? where doctorid=?", Updatetime, doctorid).Exec()
		}
		result.List.Set("userid").SetString(doctorid)
		return
	}

	//password := "123456"
	md5 := "e10adc3949ba59abbe56e057f20f883e"
	psw := ",$<;gka$$wz;dSsslE;e"

	userid := gutils.CreateSTRGUID()
	DataStatus := 1
	Stopped := 0
	source := 2
	roleid := 3
	name := param.Get("name").String()

	o.Begin()
	sql1 := "insert into t_doctor(DoctorID,name,Mobile,Stopped,DataStatus,Updatetime,Age,Picture,isintegral) Values(?,?,?,?,?,?,1,'',1)"
	_, err.Msg = o.Raw(sql1, userid, name, mobile, Stopped, DataStatus, Updatetime).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	sql2 := "insert into t_user(UserID,Password,ReservePassword ,RoleID,Mobile,source,CreateTime,LastLoginTime,Updatetime) Values(?,?,?,?,?,?,?,?,?)"
	_, err.Msg = o.Raw(sql2, userid, md5, psw, roleid, mobile, source, Updatetime, Updatetime, Updatetime).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	result.List.Set("userid").SetString(userid)
	return result, err
}

//导入用户
func UserImport(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UserImport"
	picdata := param.Get("picdata").String()
	extname := param.Get("ext").String()
	if extname != "xls" && extname != "xlsx" {
		err.Errorf(gutils.ParamError, "文件格式不对!")
		return
	}
	if picdata == "" {
		err.Errorf(gutils.ParamError, "Excel数据不能为空!")
		return
	}
	buf, _ := base64.StdEncoding.DecodeString(picdata) //文件写入到buffer
	path := utils.GetApplicationFullName()
	dir := utils.ExtractFileDir(path) + "\\Cache\\"
	utils.ForceDirectories(dir)
	dest := fmt.Sprintf("%d", gutils.CreateGUID()) + ".xls"
	src := dir + dest
	err.Msg = ioutil.WriteFile(src, buf, 0666) //buffer输出到xls文件中（不做处理，直接写到文件）
	if err.Msg != nil {
		return
	}
	//打开excel
	var xlFile *xlsx.File
	xlFile, err.Msg = xlsx.OpenFile(src)
	if err.Msg != nil {
		os.Remove(src) //删除文件
		return
	}
	var resinfo config.LJSON
	for _, sheet := range xlFile.Sheets {
		r := 0
		for _, row := range sheet.Rows { //行
			if r > 1 {
				i := 0
				item := resinfo.AddItem()
				for _, cell := range row.Cells { //列
					s, _ := cell.String()
					item.Set("cells" + fmt.Sprintf("%d", i)).SetString(s)
					i = i + 1
				}
			}
			r = r + 1
		}
	}
	os.Remove(src) //删除文件
	itemcount := resinfo.ItemCount()
	for i := 0; i < itemcount; i++ {
		var obj config.LJSON
		obj.Set("mobile").SetString(resinfo.Item(i).Get("cells0").String())
		obj.Set("name").SetString(resinfo.Item(i).Get("cells1").String())
		UserAdd(obj)
	}
	return
}

func UserDetailData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UserDetailData"
	userid := param.Get("userid").String()
	if userid == "" {
		err.Errorf(gutils.ParamError, "userid is empty")
		return
	}
	o := orm.NewOrm()

	sql := ` select u.createtime,u.mobile,d.name as doctorname,d.integral,d.consumefee 
		from t_user u inner join t_doctor d on u.userid=d.doctorid where u.userid=? `
	_, err.Msg = o.Raw(sql, userid).ValuesJSON(&result.List)

	mobile := result.List.Item(0).Get("mobile").String()

	//查询TA推荐人
	sql = ` select sendermobile from t_user_referrer where receivermobile=? `
	var sender config.LJSON
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&sender)
	result.List.Item(0).Set("sender").SetObject(sender)

	//查询被TA推荐人
	var receiver config.LJSON
	sql = ` select receivermobile from t_user_referrer where sendermobile=? `
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&receiver)
	result.List.Item(0).Set("receiver").SetObject(receiver)
	return result, err
}

func IntegralData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "IntegralData"

	condition := param.Get("condition").String() //手机号
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	sql := ` select * from t_user_integral where 1=1  `
	o := orm.NewOrm()
	if condition != "" {
		sql = fmt.Sprintf("%s and (mobile like '%%%s%%' or referrermobile like '%%%s%%') ", sql, condition, condition)
	}

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}

	sql = fmt.Sprintf("%s order by consumedate desc LIMIT %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func IntegralType(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "IntegralType"

	var integral config.LJSON
	item := integral.AddItem()
	item.Set("type").SetString("推荐奖励")
	item.Set("displayorder").SetInt(0)

	item = integral.AddItem()
	item.Set("type").SetString("购买课程")
	item.Set("displayorder").SetInt(1)

	item = integral.AddItem()
	item.Set("type").SetString("兑换课程")
	item.Set("displayorder").SetInt(2)

	result.List.Set("integraltype").SetObject(integral)

	var course config.LJSON
	item = course.AddItem()
	item.Set("type").SetString("单课时")
	item.Set("displayorder").SetInt(0)

	item = course.AddItem()
	item.Set("type").SetString("会员课时")
	item.Set("displayorder").SetInt(1)

	item = course.AddItem()
	item.Set("type").SetString("美国种植课时")
	item.Set("displayorder").SetInt(2)

	result.List.Set("coursetype").SetObject(course)

	return result, err
}
func IntegralAdd(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "IntegralAdd"

	mobile := param.Get("mobile").String()
	if mobile == "" {
		err.Errorf(gutils.ParamError, "手机号不能为空!")
		return
	}

	o := orm.NewOrm()
	userid := "" //用来更新积分和金额
	updatetime := time.Now().Format("2006-01-02 15:04:05")
	//兑换课程--积分为负数
	integraltype := param.Get("integraltype").String()
	if integraltype == "兑换课程" {
		param.Set("integral").SetInt(0 - param.Get("integral").Int()) //负数
	}

	if integraltype == "推荐奖励" { //推荐奖励--手机号必须存在
		param.Set("referrermobile").SetString("") //这个手机号肯定为空
		var obj config.LJSON
		sql := ` select datastatus,userid from t_user where mobile=? and roleid=3 `
		_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&obj)
		if obj.ItemCount() == 0 {
			err.Errorf(gutils.ParamError, "推荐奖励的手机号不存在,无法新增!")
			return
		}
		userid = obj.Item(0).Get("userid").String()
	} else {
		result, err = UserAdd(param) //新增或修改账号
		userid = result.List.Get("userid").String()
		if userid == "" {
			err.Errorf(gutils.ParamError, "账号添加错误!")
			return
		}

		//添加 推荐人和被推荐人关系
		referrermobile := param.Get("referrermobile").String()
		if referrermobile != "" {
			var obj config.LJSON
			o.Raw(" select * from t_user_referrer where receivermobile=? and sendermobile=? ", mobile, referrermobile).ValuesJSON(&obj)
			if obj.ItemCount() == 0 {
				o.Raw(" insert into t_user_referrer (referrerid,receivermobile,sendermobile,updatetime) values (?,?,?,?) ", gutils.CreateSTRGUID(), mobile, referrermobile, updatetime).Exec()
			}

		}

	}
	//记录明细
	integralID := gutils.CreateSTRGUID()
	param.Set("updatetime").SetString(updatetime)
	param.Set("integralid").SetString(integralID)
	param.Set("userid").SetString(userid)
	sql := ` insert into t_user_integral (integralid,userid,consumedate,mobile,name,integraltype,coursetype,coursename,consumefee,integral,referrermobile,updatetime) 
		values (:integralid,:userid,:consumedate,:mobile,:name,:integraltype,:coursetype,:coursename,:consumefee,:integral,:referrermobile,:updatetime)	`
	_, err.Msg = o.RawJSON(sql, param).Exec()

	//更改总积分和总消费金额
	if userid != "" {
		consumefee := param.Get("consumefee").Double()
		integral := param.Get("integral").Int()
		_, err.Msg = o.Raw(" update t_doctor set consumefee=ifnull(consumefee,0)+?,integral=ifnull(integral,0)+?,updatetime=? where doctorid=? ", consumefee, integral, updatetime, userid).Exec()
	}

	return result, err
}

func IntegralImport(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "IntegralImport"
	picdata := param.Get("picdata").String()
	extname := param.Get("ext").String()
	if extname != "xls" && extname != "xlsx" {
		err.Errorf(gutils.ParamError, "文件格式不对!")
		return
	}
	if picdata == "" {
		err.Errorf(gutils.ParamError, "Excel数据不能为空!")
		return
	}
	buf, _ := base64.StdEncoding.DecodeString(picdata) //文件写入到buffer
	path := utils.GetApplicationFullName()
	dir := utils.ExtractFileDir(path) + "\\Cache\\"
	utils.ForceDirectories(dir)
	dest := fmt.Sprintf("%d", gutils.CreateGUID()) + ".xls"
	src := dir + dest
	err.Msg = ioutil.WriteFile(src, buf, 0666) //buffer输出到xls文件中（不做处理，直接写到文件）
	if err.Msg != nil {
		return
	}
	//打开excel
	var xlFile *xlsx.File
	xlFile, err.Msg = xlsx.OpenFile(src)
	if err.Msg != nil {
		os.Remove(src) //删除文件
		return
	}
	var resinfo config.LJSON
	for _, sheet := range xlFile.Sheets {
		r := 0
		for _, row := range sheet.Rows { //行
			if r > 1 {
				i := 0
				item := resinfo.AddItem()
				for _, cell := range row.Cells { //列
					s, _ := cell.String()
					item.Set("cells" + fmt.Sprintf("%d", i)).SetString(s)
					i = i + 1
				}
			}
			r = r + 1
		}
	}
	os.Remove(src) //删除文件
	itemcount := resinfo.ItemCount()
	for i := 0; i < itemcount; i++ {
		var obj config.LJSON
		obj.Set("consumedate").SetString(resinfo.Item(i).Get("cells0").String())
		obj.Set("mobile").SetString(resinfo.Item(i).Get("cells1").String())
		obj.Set("name").SetString(resinfo.Item(i).Get("cells2").String())
		obj.Set("integraltype").SetString(resinfo.Item(i).Get("cells3").String())
		obj.Set("coursetype").SetString(resinfo.Item(i).Get("cells4").String())
		obj.Set("coursename").SetString(resinfo.Item(i).Get("cells5").String())
		obj.Set("consumefee").SetString(resinfo.Item(i).Get("cells6").String())
		obj.Set("integral").SetString(resinfo.Item(i).Get("cells7").String())
		obj.Set("referrermobile").SetString(resinfo.Item(i).Get("cells8").String())
		IntegralAdd(obj)
	}

	return result, err
}

func IntegralDel(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "IntegralDel"
	integralid := param.Get("integralid").String()
	if integralid == "" {
		err.Errorf(gutils.ParamError, "integralid不能为空!")
		return
	}

	o := orm.NewOrm()
	var obj config.LJSON
	_, err.Msg = o.Raw(" select * from t_user_integral where integralid=? ", integralid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "记录不存在")
		return
	}
	integral := 0 - obj.Item(0).Get("integral").Int()
	consumefee := 0 - obj.Item(0).Get("consumefee").Double()
	userid := obj.Item(0).Get("userid").String()
	mobile := obj.Item(0).Get("mobile").String()
	referrermobile := obj.Item(0).Get("referrermobile").String()
	if referrermobile != "" {
		var res config.LJSON
		_, err.Msg = o.Raw(" select * from t_user_integral where mobile=? and referrermobile=? ", mobile, referrermobile).ValuesJSON(&res)
		if res.ItemCount() == 0 {
			o.Raw(" delete from t_user_referrer where receivermobile=? and sendermobile =? ", mobile, referrermobile).Exec()
		}
	}

	err.Msg = o.Begin()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	updatetime := time.Now().Format("2006-01-02 15:04:05")
	o.Raw(" update t_doctor set integral=ifnull(integral,0)+?,consumefee=ifnull(consumefee,0)+?,updatetime=? where doctorid=? ", integral, consumefee, updatetime, userid).Exec()
	o.Raw(" delete from t_user_integral where integralid=? ", integralid).Exec()

	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
	}
	return result, err
}

func WeClassData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "WeClassData"

	condition := param.Get("condition").String() //手机号
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量
	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()
	sql := `select * from t_weclass_class where datastatus=1 `

	if condition != "" {
		sql = fmt.Sprintf("%s and classtitle like '%%%s%%' ", sql, condition)
	}

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}

	sql = fmt.Sprintf("%s order by createdate desc LIMIT %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func WeClassMod(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "WeClassMod"
	classid := param.Get("classid").String()
	updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("updatetime").SetString(updatetime)
	o := orm.NewOrm()
	sql := ""
	if classid == "" { //insert
		param.Set("classid").SetString(gutils.CreateSTRGUID())
		param.Set("createdate").SetString(updatetime)

		sql = ` insert into t_weclass_class(classid,classtype,classtitle,createdate,playnum,commentnum,likenum,url,dispark,datastatus,filesize,updatetime) 
			values (:classid,:classtype,:classtitle,:createdate,0,0,0,:url,0,1,:filesize,:updatetime) `
	} else { //update

		sql = ` update t_weclass_class set classtype=:classtype,classtitle=:classtitle,url=:url,filesize=:filesize,updatetime=:updatetime 
			where classid=:classid
			`
	}
	_, err.Msg = o.RawJSON(sql, param).Exec()
	return result, err
}

func WeClassDel(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "WeClassDel"
	classid := param.Get("classid").String()
	if classid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}

	o := orm.NewOrm()
	sql := " update t_weclass_class set datastatus=0,updatetime=? where classid=? "
	_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02 15:04:05"), classid).Exec()

	return result, err
}

func WeClassOpen(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "WeClassOpen"
	classid := param.Get("classid").String()
	if classid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}

	o := orm.NewOrm()
	sql := " update t_weclass_class set dispark=?,updatetime=? where classid=? "
	_, err.Msg = o.Raw(sql, param.Get("dispark").Int(), time.Now().Format("2006-01-02 15:04:05"), classid).Exec()

	return result, err
}

func WeClassDetailData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "WeClassDetailData"
	classid := param.Get("classid").String()
	if classid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}

	//最热评论
	var hot config.LJSON
	o := orm.NewOrm()
	sql := ` select * from t_weclass_comments where relationid=? and relationtype=0 and datastatus=1 order by likenum desc limit 0,3 `
	_, err.Msg = o.Raw(sql, classid).ValuesJSON(&hot)
	//	hostCount := hot.ItemCount()
	//	if hostCount != 0 {
	//		for i := 0; i < hostCount; i++ {
	//			var obj config.LJSON
	//			commentid := hot.Item(i).Get("commentid").String() //评论的作者回复
	//			o.Raw(" select * from t_weclass_comment where relationid=? and datastatus=1 ", commentid).ValuesJSON(&obj)
	//			if obj.ItemCount() != 0 {
	//				hot.Item(i).Set("reply").SetObject(obj)
	//			}
	//		}
	//	}

	result.List.Set("hot").SetObject(hot)
	//最新评论

	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	sql = ` select * from t_weclass_comments where relationid=? and relationtype=0 and datastatus=1 `

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		var obj config.LJSON
		_, err.Msg = o.Raw(sql, classid).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}
	var newC config.LJSON
	sql = fmt.Sprintf("%s order by CommentDate desc LIMIT %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql, classid).ValuesJSON(&newC)

	//	newCount := newC.ItemCount()
	//	if newCount != 0 {
	//		for i := 0; i < newCount; i++ {
	//			var obj config.LJSON
	//			commentid := newC.Item(i).Get("commentid").String()
	//			o.Raw(" select * from t_weclass_comment where relationid=? and datastatus=1 ", commentid).ValuesJSON(&obj)
	//			if obj.ItemCount() != 0 {
	//				newC.Item(i).Set("reply").SetObject(obj)
	//			}
	//		}
	//	}
	result.List.Set("news").SetObject(newC)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func WeClassDetailDel(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "WeClassDetailDel"

	commentid := param.Get("commentid").String()
	if commentid == "" {
		err.Errorf(gutils.ParamError, "评论ID不能为空")
		return
	}

	o := orm.NewOrm()

	sql := ` update t_weclass_comments set datastatus=0,updatetime=? where commentid=? `
	_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02 15:04:05"), commentid).Exec()
	return result, err
}

//回复评论
func WeClassDetailComment(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	//	err.Caption = "WeClassDetailComment"
	//	commentid := param.Get("commentid").String()
	//	if commentid == "" {
	//		err.Errorf(gutils.ParamError, "被评论的评论ID不能为空")
	//		return
	//	}

	//	o := orm.NewOrm()
	//	updatetime := time.Now().Format("2006-01-02 15:04:05")
	//	sql := `insert into t_weclass_comment (commentid,relationid,commentinfo,commentdate,nickname,likenum,datastatus,updatetime,comefrom)
	//			values (?,?,?,?,?,?,?,?,?)	`
	//	_, err.Msg = o.Raw(sql, gutils.CreateSTRGUID(), commentid, param.Get("commentinfo").String(), updatetime, "作者回复", 0, 1, updatetime, "author").Exec()
	//	return result, err

	err.Caption = "WeClassDetailComment"
	//评论类型
	commentid := gutils.CreateSTRGUID()
	updatetime := time.Now().Format("2006-01-02 15:04:05")
	commenttype := param.Get("commenttype").String()
	param.Set("commentid").SetString(commentid)
	param.Set("commentdate").SetString(updatetime)
	param.Set("updatetime").SetString(updatetime)
	param.Set("datastatus").SetInt(1)
	param.Set("likenum").SetInt(0)
	param.Set("comefrom").SetString("author")
	param.Set("relationtype").SetInt(0)
	//后台作者
	param.Set("userid").SetString("fussen")
	param.Set("usernickname").SetString("牙医管家客服")
	param.Set("userpicture").SetString("http://dtcollege.oss-cn-qingdao.aliyuncs.com/wxpic.jpg")
	o := orm.NewOrm()
	if commenttype == "0" { //普通评论

		sql := ` insert into t_weclass_comments (commentid,relationid,relationtype,userid,userpicture,usernickname,commentinfo,commentdate,likenum,comefrom,commenttype,datastatus,updatetime) 
				values (:commentid,:relationid,:relationtype,:userid,:userpicture,:usernickname,:commentinfo,:commentdate,:likenum,:comefrom,:commenttype,:datastatus,:updatetime)	`
		_, err.Msg = o.RawJSON(sql, param).Exec()
	} else if commenttype == "1" { //回复评论

		ocommentid := param.Get("ocommentid").String()
		if ocommentid == "" {
			err.Errorf(gutils.ParamError, "被回复评论ID不能为空")
			return
		}

		//被回复评论
		var obj config.LJSON
		sql := ` select userid,usernickname,commentinfo,datastatus from t_weclass_comments where commentid=? `
		_, err.Msg = o.Raw(sql, ocommentid).ValuesJSON(&obj)
		if obj.ItemCount() == 0 {
			err.Errorf(gutils.ParamError, "被回复评论不存在")
			return
		}
		if obj.Item(0).Get("datastatus").Int() == 0 {
			err.Errorf(gutils.ParamError, "被回复评论已删除,无法回复!")
			return
		}
		ouserid := obj.Item(0).Get("userid").String()
		param.Set("ousernickname").SetString(obj.Item(0).Get("usernickname").String())
		param.Set("ocommentinfo").SetString(obj.Item(0).Get("commentinfo").String())
		param.Set("ouserid").SetString(ouserid)

		sql = ` insert into t_weclass_comments (commentid,relationid,relationtype,userid,userpicture,usernickname,commentinfo,commentdate,likenum,comefrom,commenttype,ouserid,ousernickname,ocommentifno,ocommentid,datastatus,updatetime) 
			values (:commentid,:relationid,:relationtype,:userid,:userpicture,:usernickname,:commentinfo,:commentdate,:likenum,:comefrom,:commenttype,:ouserid,:ousernickname,:ocommentinfo,:ocommentid,:datastatus,:updatetime)	`
		_, err.Msg = o.RawJSON(sql, param).Exec()

		//通知消息
		sql = ` insert into t_weclass_msg (msgid,userid,identity,type,datastatus,updatetime) 
				values (?,?,?,?,?,?) `
		_, err.Msg = o.Raw(sql, gutils.CreateGUID(), ouserid, commentid, 0, 1, updatetime).Exec()
		keys := "weclass_msg_0" + ouserid
		gredis.Set(keys, updatetime)
	} else {
		err.Errorf(gutils.ParamError, "评论类型错误")
	}
	return result, err
}

func ImageUpload(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ImageUpload"

	picdata := param.Get("picdata").String()
	ext := gutils.SubString(param.Get("ext").String(), 6, 4)
	if ext == "jpeg" {
		ext = "jpg"
	}
	if picdata == "" {
		err.Errorf(gutils.ParamError, "图片数据不能为空")
		return
	}
	if (ext != "png") && (ext != "jpg") {
		err.Errorf(gutils.ParamError, "图片格式错误")
		return
	}
	buf, _ := base64.StdEncoding.DecodeString(picdata) //成图片文件并把文件写入到buffer
	path := utils.GetApplicationFullName()
	dir := utils.ExtractFileDir(path) + "\\Cache\\"
	utils.ForceDirectories(dir)
	dest := fmt.Sprintf("%d", gutils.CreateGUID()) + "." + ext
	src := dir + dest
	if buf == nil {
		err.Errorf(gutils.ParamError, "buf为空")
		return
	}
	err2 := ioutil.WriteFile(src, buf, 0666) //buffer输出到jpg文件中（不做处理，直接写到文件）
	if err2 != nil {
		err.Errorf(gutils.ParamError, "写入缓存数据错误")
		return
	}
	var flyParam config.LJSON
	flyParam.Set("funcid").SetInt(gutils.FUNC_ID_UPLOAD_IMAGE)
	flyParam.Set("src").SetString(src)
	flyParam.Set("dest").SetString(dest)
	res := gutils.FlybearCPlus(flyParam)
	url := res.Get("data").Get("records").Item(0).Get("url").String()
	os.Remove(src) //删除文件
	fmt.Println(url)
	result.List.Set("url").SetString(url)
	result.List.Set("id").SetString(dest)
	return result, err
}

func SaveBanner(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SaveBanner"
	o := orm.NewOrm()
	sql := ` select * from t_weclass_banner `
	var obj config.LJSON
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		sql = ` insert into t_weclass_banner (bannerid,url,displayorder,datastatus,updatetime) 
				values (?,?,?,?,?)
			  `
		_, err.Msg = o.Raw(sql, gutils.CreateSTRGUID(), param.Get("url").String(), 0, 1, time.Now().Format("2006-01-02 15:04:05")).Exec()
	} else {
		sql = ` update t_weclass_banner set url=?,updatetime=?,datastatus=1 where bannerid=? `
		_, err.Msg = o.Raw(sql, param.Get("url").String(), time.Now().Format("2006-01-02 15:04:05"), obj.Item(0).Get("bannerid").String()).Exec()
	}
	return result, err
}

func UploadSource(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UploadSource"
	picdata := param.Get("picdata").String()
	ext := gutils.SubString(param.Get("ext").String(), 6, 4)

	if picdata == "" {
		err.Errorf(gutils.ParamError, "数据不能为空")
		return
	}
	if (ext != "mp3") && (ext != "mp4") {
		err.Errorf(gutils.ParamError, "音视频格式错误")
		return
	}
	buf, _ := base64.StdEncoding.DecodeString(picdata)
	path := utils.GetApplicationFullName()
	dir := utils.ExtractFileDir(path) + "\\Cache\\"
	utils.ForceDirectories(dir)
	dest := fmt.Sprintf("%d", gutils.CreateGUID()) + "." + ext
	src := dir + dest
	if buf == nil {
		err.Errorf(gutils.ParamError, "buf为空")
		return
	}
	err2 := ioutil.WriteFile(src, buf, 0666)
	if err2 != nil {
		err.Errorf(gutils.ParamError, "写入缓存数据错误")
		return
	}
	var flyParam config.LJSON
	flyParam.Set("funcid").SetInt(gutils.FUNC_ID_UPLOAD_SOURCE)
	flyParam.Set("filename").SetString(src)
	flyParam.Set("cloudname").SetString(dest)
	res := gutils.FlybearCPlus(flyParam)
	code := res.Get("code").Int()
	if code == 0 {
		err.Errorf(gutils.ParamError, "文件上传失败")
		return
	}
	url := res.Get("url").String()
	os.Remove(src) //删除文件
	fmt.Println(url)
	result.List.Set("url").SetString(url)
	return result, err
}

//获取二维码
func GetQRCode(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetQRCode"
	classid := param.Get("classid").String()
	if classid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}
	var request config.LJSON
	request.Set("clinicid").SetString(`yayiguanjia2015`)
	request.Set("funcid").SetInt(21108)
	request.Set("roleid").SetInt(17)
	request.Set("qrtype").SetString("QR_LIMIT_STR_SCENE")
	request.Set("otherid").SetString(classid)

	res := gutils.FlybearCPlus(request)
	if res.Get("code").String() != "1" {
		err.Errorf(gutils.ParamError, res.Get("info").String())
	} else {
		result.List.Set("url").SetString(res.Get("data").Get("records").Item(0).Get("url").String())
		result.List.Set("qr_url").SetString(res.Get("data").Get("records").Item(0).Get("qr_url").String())
	}
	return result, err
}

//type PolicyToken struct {
//	AccessKeyId string `json:"accessid"`
//	Host        string `json:"host"`
//	Expire      int64  `json:"expire"`
//	Signature   string `json:"signature"`
//	Policy      string `json:"policy"`
//	Directory   string `json:"dir"`
//	FileName    string `json:"filename"`
//}

type ConfigStruct struct {
	Expiration string     `json:"expiration"`
	Conditions [][]string `json:"conditions"`
}

//获取阿里云上传数据存储凭证
func OssParam(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "OssParam"
	filename := param.Get("filename").String()
	if filename == "" {
		err.Errorf(gutils.ParamError, "文件名不能为空")
		return
	}

	pos := strings.LastIndexByte(filename, '.')
	if pos == -1 {
		err.Errorf(gutils.ParamError, "文件名不合法")
		return
	}
	ext := strings.ToLower(filename[pos+1:])
	//	if ext != "mp3" && ext != "mp4"{

	//	}
	filename = gutils.CreateSTRGUID() + "." + ext

	//计算hash路径

	var flyParam config.LJSON
	flyParam.Set("funcid").SetInt(gutils.FUNC_ID_GET_CLOUND_PATH)
	flyParam.Set("filename").SetString(filename)
	data := gutils.FlybearCPlus(flyParam)
	code := data.Get("code").Int()
	if code == 0 {
		err.Errorf(gutils.ParamError, "获取Oss路径失败")
		return
	}
	//云端上传路径
	upload_dir := data.Get("path").String()

	//	accessKeyID := "LTAIXUxozaqB17nz"
	//	accessKeySecret := "Qrlqi1rxBzlII4VQ6xSiogkO7UXzI7"
	//	host := "http://dtcollage.oss-cn-qingdao.aliyuncs.com"

	accessKeyID, _ := conf.SvrConfig.String("server", "OSSAccessKey")
	accessKeySecret, _ := conf.SvrConfig.String("server", "OSSAccessSecret")
	host := "http://dtcollege.oss-cn-qingdao.aliyuncs.com"

	var expire_time int64 = 300 //超时间隔时间 300s == 5min

	now := time.Now().Unix()
	expire_end := now + expire_time
	//超时时间
	tokenExpire := time.Unix(expire_end, 0).Format("2006-01-02T15:04:05Z")

	//policy 结构
	var conf ConfigStruct
	conf.Expiration = tokenExpire
	var condition []string
	condition = append(condition, "starts-with")
	condition = append(condition, "$key")
	condition = append(condition, upload_dir)
	conf.Conditions = append(conf.Conditions, condition)
	res, e := json.Marshal(conf)
	if e != nil {
		err.Errorf(gutils.ParamError, "configStruct convert to json get a error")
		return
	}
	//把policy json 字符串进行base64
	debyte := base64.StdEncoding.EncodeToString(res)

	//对base64 policy  获取hmac(摘要数据)
	h := hmac.New(func() hash.Hash { return sha1.New() }, []byte(accessKeySecret))
	io.WriteString(h, debyte)
	signedStr := base64.StdEncoding.EncodeToString(h.Sum(nil))

	result.List.Set("accessid").SetString(accessKeyID)
	result.List.Set("host").SetString(host)
	result.List.Set("expire").SetInt64(expire_end)
	result.List.Set("signature").SetString(signedStr)
	result.List.Set("policy").SetString(debyte)
	result.List.Set("dir").SetString(upload_dir)
	result.List.Set("cloudname").SetString(filename)

	return result, err
}
