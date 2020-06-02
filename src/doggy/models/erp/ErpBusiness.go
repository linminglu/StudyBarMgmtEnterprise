package models

import (
	"doggy/gutils"

	"time"

	"fmt"
	"strconv"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

func SearchUser(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SearchUser"

	mobile := param.Get("mobile").String()
	if mobile == "" {
		err.Errorf(gutils.ParamError, "手机号不能为空")
		return
	}

	o := orm.NewOrm()

	sql := ` select d.name,u.userid,d.picture,u.mobile,d.isanchor 
			from t_user u inner join t_doctor d on 
			u.userid=d.doctorid where u.mobile=? and u.roleid=3 `
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&result.List)

	return result, err
}

func SetUser2Anchor(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SetUser2Anchor"
	userid := param.Get("userid").String()
	if userid == "" {
		err.Errorf(gutils.ParamError, "用户ID不能为空")
		return
	}
	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select roompicture,roomname from t_doctor where doctorid=? `
	_, err.Msg = o.Raw(sql, userid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "用户不存在")
		return
	}
	roompicture := obj.Item(0).Get("roompicture").String()
	roomname := obj.Item(0).Get("roomname").String()

	sql = " update t_doctor set isanchor=1,updatetime=?,anchortime=? "

	if roompicture == "" {
		sql = sql + ",roompicture=picture"
	}
	if roomname == "" {
		sql = sql + ",roomname=name"
	}

	sql += " where doctorid=? "

	_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02 15:04:05"), time.Now().Format("2006-01-02 15:04:05"), userid).Exec()
	return result, err
}

func AnchorList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AnchorList"

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

	sql := `SELECT d.doctorid AS anchorid,d.roompicture,
			u.mobile,d.roomname,d.name,u.username, IFNULL(d.surplusfee,0) AS surplusfee, 
			IFNULL(d.incomefee,0) AS incomefee, IFNULL(d.consumefee,0) AS consumefee,
			isanchor,ifnull(r.issuper,0) as issuper
			FROM t_doctor d
			INNER JOIN t_user u ON d.doctorid=u.userid
			left join t_college_star r on r.anchorid=d.DoctorID
			WHERE 1=1  `

	if condition != "" {
		sql = fmt.Sprintf("%s and u.mobile like '%%%s%%' ", sql, condition)
	}

	issuper := param.Get("issuper").String()
	if issuper != "" {
		sql = fmt.Sprintf(" %s and r.issuper=%s ", sql, issuper)
	}

	isanchor := param.Get("isanchor").String()
	if isanchor != "" {
		sql = fmt.Sprintf(" %s and d.isanchor=%s ", sql, isanchor)
	}else{
		sql = fmt.Sprintf(" %s %s ", sql, "AND d.IsAnchor")
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

	sql = fmt.Sprintf("%s limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func ModifyAnchorInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ModifyAnchorInfo"

	anchorid := param.Get("anchorid").String()
	username := param.Get("username").String()
	if anchorid == "" {
		err.Errorf(gutils.ParamError, "修改主播内容")
		return
	}

	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select employrateid from t_doctor where doctorid=? `
	_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)

	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "主播不存在")
		return
	}

	oldemployrateid := obj.Item(0).Get("employrateid").String()

	newemployrateid := param.Get("employrateid").String()

	if oldemployrateid == "" {

		if oldemployrateid != newemployrateid {
			sql = ` update t_college_employrate set usernum=usernum+1,updatetime=? where employrateid=? `
			_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02 15:04:05"), newemployrateid).Exec()
		}
	} else {
		if oldemployrateid != newemployrateid {
			sql = ` update t_college_employrate a,t_college_employrate b set a.usernum=a.usernum+1,b.usernum=b.usernum-1,a.updatetime=?,b.updatetime=? where a.employrateid=? and b.employrateid=?`
			_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02 15:04:05"), time.Now().Format("2006-01-02 15:04:05"), newemployrateid, oldemployrateid).Exec()
		}
	}

	if username != ""{
		sql = `  update t_user set username=? where userid=? `
		_, err.Msg = o.Raw(sql,username,anchorid).Exec()
	}

	sql = `  update t_doctor set roompicture=:picture,roomname=:roomname,employrateid=:employrateid,updatetime=:updatetime,anchorintroduction=:anchorintroduction where doctorid=:anchorid `
	_, err.Msg = o.RawJSON(sql, param).Exec()

	return result, err
}

func AnchorInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AnchorInfo"
	doctorid := param.Get("anchorid").String()
	if doctorid == "" {
		err.Errorf(gutils.ParamError, "医生ID不能为空")
		return
	}
	//抽佣比率 表示平台得到的比率
	o := orm.NewOrm()
	//EmployRateID
	sql := `select d.doctorid as anchorid,u.mobile,d.roomname,d.roompicture as picture,d.name,u.username,
			d.openid,ifnull(d.surplusfee,0) as surplusfee,
		ifnull(d.incomefee,0) as incomefee,ifnull(d.consumefee,0) as consumefee,isanchor,anchorintroduction,
			u.createtime,concat(convert(ifnull(e.rate,0)*100,decimal(10,2)),'%') as rate,
			u.lastlogintime,d.anchortime,d.employrateid
	 from t_doctor d inner join t_user u on d.doctorid=u.userid 
	 left join t_college_employrate e on e.EmployRateID=d.EmployRateID and e.datastatus=1
	 where doctorid=? `
	var info config.LJSON
	_, err.Msg = o.Raw(sql, doctorid).ValuesJSON(&info)
	if info.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "主播不存在")
		return
	}
	var res config.LJSON
	//粉丝数量
	sql = ` select sum(1) as fans from t_college_fans where AnchorID=? and datastatus=1`
	_, err.Msg = o.Raw(sql, doctorid).ValuesJSON(&res)
	info.Item(0).Set("fans").SetInt(res.Item(0).Get("fans").Int())
	//关注的人数量
	sql = ` select sum(1) as num from t_college_fans where  FollowerID=? and datastatus=1 `
	_, err.Msg = o.Raw(sql, doctorid).ValuesJSON(&res)
	info.Item(0).Set("num").SetInt(res.Item(0).Get("num").Int())
	result.List.Set("info").SetObject(info)

	return result, err
}

func AnchorSetting(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AnchorSetting"
	doctorid := param.Get("anchorid").String()
	if doctorid == "" {
		err.Errorf(gutils.ParamError, "医生ID不能为空")
		return
	}

	//0 关闭 1设置为主播(激活) 2 停用
	isanchor := param.Get("isanchor").Int()
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	o := orm.NewOrm()
	err.Msg = o.Begin()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	sql := ""
	var obj config.LJSON
	//停用主播
	if isanchor == 2 {
		sql = ` select sum(1) as num from db_flybear.t_college_signle where anchorid=? and  datastatus=1 and status=1 `
		_, err.Msg = o.Raw(sql, doctorid).ValuesJSON(&obj)
		num := obj.Item(0).Get("num").Int()
		if num > 0 {
			o.Rollback()
			err.Errorf(gutils.ParamError, "有直播中的课程，请先停播")
			return
		}

		sql = ` update db_flybear.t_college_signle set Status=2,datastatus=2,updatetime=? where anchorid=? and datastatus=1 and status=0 `
		_, err.Msg = o.Raw(sql, Updatetime, doctorid).Exec()
		if err.Msg != nil {
			o.Rollback()
			return
		}
	} else if isanchor == 0 { //关闭主播
		sql = ` select sum(1) as num from db_flybear.t_college_signle where anchorid=? and  datastatus=1 and status=1 `
		_, err.Msg = o.Raw(sql, doctorid).ValuesJSON(&obj)
		num := obj.Item(0).Get("num").Int()
		if num > 0 {
			o.Rollback()
			err.Errorf(gutils.ParamError, "有直播中的课程，请先停播")
			return
		}

		sql = ` update db_flybear.t_college_signle set Status=2,datastatus=0,updatetime=? where anchorid=? and datastatus > 0 and status < 2 `
		_, err.Msg = o.Raw(sql, Updatetime, doctorid).Exec()
		if err.Msg != nil {
			o.Rollback()
			return
		}

		sql = ` update db_flybear.t_college_series set datastatus=0,updatetime=? where anchorid=? and datastatus > 0 `
		_, err.Msg = o.Raw(sql, Updatetime, doctorid).Exec()
		if err.Msg != nil {
			o.Rollback()
			return
		}
	}

	sql = ` update t_doctor set isanchor=?,updatetime=? where doctorid=? `
	_, err.Msg = o.Raw(sql, isanchor, Updatetime, doctorid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	return result, err
}

func AnchorIncome(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AnchorIncome"
	anchorid := param.Get("anchorid").String()
	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()
	sql := ` select buytime,orderid,originalfee,paidfee,earnings,platformfee,paystyle,
			case classtype when '单课程' then (select Title from t_college_signle where signleid=classid limit 1) else 
			(select title from t_college_series where seriesid=classid limit 1) 
			end as title 
	 		from t_college_order where anchorid=? and datastatus=1 order by buytime desc `
	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql = fmt.Sprintf("%s limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数

	return result, err
}

func AnchorPayout(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AnchorPayout"

	anchorid := param.Get("anchorid").String()
	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()
	sql := ` select payment_time,payment_no,openid,convert(amount/100.0,decimal(10,2)) as amount,partner_trade_no
			 from t_college_withdrawal where userid=? and datastatus=1 order by payment_time desc `

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql = fmt.Sprintf("%s limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func SignleList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SignleList"

	anchorid := param.Get("anchorid").String()
	isall := param.Get("isall").String()
	if anchorid == "" && isall == "" {
		err.Errorf(gutils.ParamError, "用户ID不能为空")
		return
	}
	condition := param.Get("condition").String() //手机号
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量
	lessontype := param.Get("lessontype").String() //课程类型 0 线上课程(默认) ,1   线下课程 
	o := orm.NewOrm()
	sql := ` select s.*,ifnull(s.orifee,0) as orifee,
		ifnull(s.fee,0) as fee,d.roomname as anchorname from t_college_signle s inner join t_doctor d on d.doctorid = s.anchorid where (s.datastatus > 0 or s.datastatus = -1)`

	if condition != "" {
		sql = fmt.Sprintf("%s and (s.title like '%%%s%%' or d.roomname like '%%%s%%')", sql, condition, condition)
	}
	if isall == "" {
		sql = fmt.Sprintf("%s and s.anchorid=? ", sql)
	} else if isall == "1" {
		sql = fmt.Sprintf("%s and s.signleid not in (select signleid from t_college_signle_home h where h.datastatus > 0 )", sql)
	} else {

	}
	if lessontype != "" {
		sql = fmt.Sprintf("%s and s.lessontype=%s ", sql,lessontype)
	}
	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		if isall == "" {
			_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&result.List)
		} else {
			_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
		}

		totalcount = int64(result.List.ItemCount())
	}
	if page == 0 {
		sql = fmt.Sprintf("%s order by s.begintime", sql)
	} else {
		sql = fmt.Sprintf("%s order by s.begintime desc  limit %d,%d", sql, perpage*(page-1), perpage)
	}

	if isall == "" {
		_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&result.List)
	} else {
		_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	}
	// _, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func Seriesofsignlelist(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "Seriesofsignlelist"

	anchorid := param.Get("anchorid").String()
	seriesid := param.Get("seriesid").String()
	if anchorid == "" || seriesid == "" {
		err.Errorf(gutils.ParamError, "主键ID不能为空")
		return
	}
	condition := param.Get("condition").String() //标题
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量
	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()

	sql := ` select title,banner,status,fee,orifee,signleid
	 from t_college_signle where anchorid=? and datastatus>0 and signleid not in (select signleid from t_college_series_child where seriesid=? ) `

	if condition != "" {
		sql = fmt.Sprintf("%s and title like '%%%s%%' ", sql, condition)
	}

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, anchorid, seriesid).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql = fmt.Sprintf("%s order by begintime desc limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql, anchorid, seriesid).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err

}
func SignleSetting(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SignleSetting"
	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	datastatus := param.Get("datastatus").Int()
	signleid := param.Get("signleid").String()
	o := orm.NewOrm()
	sql := ""
	var num int64 = 0
	if datastatus == 0 {
		var obj config.LJSON
		sql = ` select * from t_college_series_child where SignleID=? `
		num, err.Msg = o.Raw(sql, signleid).ValuesJSON(&obj)
		if num > 0 {
			err.Errorf(gutils.ParamError, "单课程归属于系列课,无法删除")
			return result, err
		}
	}
     sql = ` update t_college_signle set datastatus=:datastatus,applystatus=:applystatus,updatetime=:updatetime where signleid=:signleid `
	_, err.Msg = o.RawJSON(sql, param).Exec()

	// //更新 home表
	// sql2 := "update t_college_signle_home h set datastatus = (select datastatus from t_college_signle s where s.signleid=?)"
	// if datastatus != 0 {
	// 	_, err.Msg = o.Raw(sql2,signleid).Exec()
	// }
	return result, err
}

func AddCode(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AddCode"

	o := orm.NewOrm()
	sql := ` insert into t_college_code (codeid,CodeValue,num,DataStatus,UpdateTime) 
			values (?,?,?,1,?) `

	_, err.Msg = o.Raw(sql, gutils.CreateGUID(), param.Get("codevalue").String(), param.Get("num").Int(), time.Now().Format("2006-01-02 15:04:05")).Exec()

	return result, err

}

func CodeList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {

	err.Caption = "CodeList"

	all := param.Get("all").Int64()
	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()
	sql := ` select * from t_college_code where datastatus=1  `

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
	if all != 1 {
		sql = fmt.Sprintf("%s limit %d,%d", sql, perpage*(page-1), perpage)
	}
	fmt.Println(sql)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func DelCodeSignle(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DelCodeSignle"

	relid := param.Get("relid").String()

	if relid == "" {
		err.Errorf(gutils.ParamError, "主键ID不能为空")
		return
	}

	o := orm.NewOrm()
	sql := " delete from t_college_code_rel where relid=? "
	_, err.Msg = o.Raw(sql, relid).Exec()

	return result, err
}

//获取兑换码 对应 单课程列表
func CodeSignleList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CodeSignleList"

	codeid := param.Get("codeid").String()
	if codeid == "" {
		err.Errorf(gutils.ParamError, "兑换码ID")
		return
	}

	condition := param.Get("condition").String() //课程名
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量
	if page == 0 {
		page = 1
	}

	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()
	sql := ` select * from t_college_code_rel r inner join t_college_signle s on 
			 r.signleid=s.signleid
			 where r.codeid=? `

	if condition != "" {
		sql = fmt.Sprintf("%s and s.title like '%%%s%%' ", sql, condition)
	}
	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, codeid).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql = fmt.Sprintf("%s limit %d,%d", sql, perpage*(page-1), perpage)
	fmt.Println(sql)
	_, err.Msg = o.Raw(sql, codeid).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err

}

func SignleDetail(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SignleDetail"
	signleid := param.Get("signleid").String()
	if signleid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}

	o := orm.NewOrm()

	sql := ` select s.*,s.tag as tagid,ifnull(s.applystatus,0) as applystatus,d.roomname as anchorname,ifnull(autoendtime,'') as autoendtime,ifnull(alterdata,'') as alterdata from t_college_signle s left join t_doctor d on d.doctorid=s.anchorid where s.signleid=?`
	_, err.Msg = o.Raw(sql, signleid).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "课程不存在")
		return
	}

	var obj config.LJSON
	sql = ` select * from t_college_signle_ppt where signleid=? and datastatus=1  order by displayorder asc `
	_, err.Msg = o.Raw(sql, signleid).ValuesJSON(&obj)
	result.List.Item(0).Set("ppt").SetObject(obj)

	sql = ` select * from t_college_detail where courseid=? and datastatus=1  order by displayorder asc `
	_, err.Msg = o.Raw(sql, signleid).ValuesJSON(&obj)
	result.List.Item(0).Set("detail").SetObject(obj)

	return result, err
}

func AddOrModSignle(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AddAnchorSignle"
	o := orm.NewOrm()
	o.Begin()
	signleid := param.Get("signleid").String()
	datastatus := param.Get("datastatus").String()
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	// isApply := param.Get("isapply").String()
	param.Set("updatetime").SetString(Updatetime)
// lessontype,duration,enrollendtime,province,city,district,address,maxenroll,teachername
	isAdd := (signleid == "")
	var optionParamMap map[string]string /*创建集合 */
	optionParamMap = make(map[string]string)
	optionParamMap["lessontype"] = param.Get("lessontype").String()
	optionParamMap["duration"] = param.Get("duration").String()
	optionParamMap["enrollendtime"] = param.Get("enrollendtime").String()
	optionParamMap["province"] = param.Get("province").String()
	optionParamMap["city"] = param.Get("city").String()
	optionParamMap["district"] = param.Get("district").String()
	optionParamMap["address"] = param.Get("address").String()
	optionParamMap["maxenroll"] = param.Get("maxenroll").String()
	optionParamMap["teachername"] = param.Get("teachername").String()
	optionParamMap["videoid"] = param.Get("videoid").String()
	insertSql:="insert into t_college_signle (istovod,signleid,title,banner,banner1,type,anchorid,comment,fee,clicknum,buynum,begintime,autoendtime,status,datastatus,applystatus,updatetime,tag"
	insertValueSql:="values (:istovod,:signleid,:title,:banner,:banner1,:type,:anchorid,:comment,:fee,0,0,:begintime,:autoendtime,0,2,2,:updatetime,:tagid"
	alterSql := "update t_college_signle set videoid=:videoid,title=:title,alterdata=:alterdata,banner=:banner,banner1=:banner1,comment=:comment,applystatus=:applystatus,fee=:fee,begintime=:begintime,autoendtime=:autoendtime,updatetime=:updatetime,tag=:tagid"

	sql:=""
	for key, value := range optionParamMap {
		if(value != ""){
			insertSql += ","+key
			insertValueSql += ",:"+key 
			alterSql += ","+key+"=:"+key
		}else{
			alterSql += ","+key+"=''"
		}
	}
	//新增单课
	if(isAdd){
		signleid = gutils.CreateSTRGUID()
		param.Set("signleid").SetString(signleid)
		insertSql += ")"
		insertValueSql += ")"
		sql = insertSql + insertValueSql
	}else{
		if (datastatus == "1"){
			alterSql += ",datastatus=:datastatus where signleid=:signleid"
		}else{
			alterSql += " where signleid=:signleid"
		}
		sql = alterSql
	}
	

	// sql := ""
	// if signleid == "" { //新增
	// 	signleid = gutils.CreateSTRGUID()
	// 	param.Set("signleid").SetString(signleid)
	// 	sql = ` insert into t_college_signle (signleid,title,banner,banner1,type,anchorid,comment,fee,OriFee,clicknum,buynum,begintime,autoendtime,status,datastatus,applystatus,updatetime,tag,coursetype,coursetype,duration,enrollendtime,province,city,district,address,maxenroll,teachername)
	// 	values (:signleid,:title,:banner,:banner1,:type,:anchorid,:comment,:fee,:orifee,0,0,:begintime,:autoendtime,0,2,2,:updatetime,:tagid)`
	// } else { //修改
	// 	if (datastatus == "1"){
	// 		sql = " update t_college_signle set title=:title,alterdata=:alterdata,banner=:banner,banner1=:banner1,comment=:comment,applystatus=:applystatus,fee=:fee,orifee=:orifee,begintime=:begintime,autoendtime=:autoendtime,updatetime=:updatetime,tag=:tagid,datastatus=:datastatus where signleid=:signleid "
	// 	}else{
	// 		sql = " update t_college_signle set title=:title,alterdata=:alterdata,banner=:banner,banner1=:banner1,comment=:comment,applystatus=:applystatus,fee=:fee,orifee=:orifee,begintime=:begintime,autoendtime=:autoendtime,updatetime=:updatetime,tag=:tagid where signleid=:signleid "
	// 	}
	// }
	_, err.Msg = o.RawJSON(sql, param).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	signleType := param.Get("type").Int64()
	pptNum := param.Get("ppt").ItemCount()
	
	if signleType != 2 && param.Get("ppt").IsNULL() == false {
		//删除所有的记录
		sql = ` delete from t_college_signle_ppt where signleid=? `
		_, err.Msg = o.Raw(sql, signleid).Exec()
		if err.Msg != nil {
			o.Rollback()
			return
		}
		// pptNum := param.Get("ppt").ItemCount()
		for i := 0; i < pptNum; i++ {
			sql = "insert into t_college_signle_ppt(pptid,signleid,url,displayorder,datastatus,updatetime) values ('" + gutils.CreateSTRGUID() + "','" + signleid + "',:url," + strconv.Itoa(i) + ",1,'" + Updatetime + "')  "
			_, err.Msg = o.RawJSON(sql, *param.Get("ppt").Item(i)).Exec()
		}
		if err.Msg != nil {
			o.Rollback()
			return
		}
	}

	//审批不用更新简介图片
	if param.Get("detail").IsNULL() == true {
		err.Msg = o.Commit()
		return
	}

	//课程简介
	sql = ` delete from t_college_detail where courseid=? `
		_, err.Msg = o.Raw(sql, signleid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	
	detailNum := param.Get("detail").ItemCount()
	for i := 0; i < detailNum; i++ {
			sql = "insert into t_college_detail(detailid,courseid,url,displayorder,datastatus,updatetime) values ('" + gutils.CreateSTRGUID() + "','" + signleid + "',:url," + strconv.Itoa(i) + ",1,'" + Updatetime + "')  "
			_, err.Msg = o.RawJSON(sql, *param.Get("detail").Item(i)).Exec()
	}
	if err.Msg != nil {
			o.Rollback()
			return
	}
	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	return result, err
}

func SeriesList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SeriesList"

	anchorid := param.Get("anchorid").String()
	isall := param.Get("isall").String()
	if anchorid == "" && isall == "" {
		err.Errorf(gutils.ParamError, "主播ID不能为空")
		return result, err
	}
	condition := param.Get("condition").String() //手机号
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量
	o := orm.NewOrm()
	sql := ` select seriesid,title,banner,anchorid,fee,ifnull(discount,0) as discount,d.roomname as anchorname,ifnull(fee,0) as fee,clicknum,buynum,s.datastatus,s.applystatus,s.alterdata
			 from t_college_series s inner join t_doctor d on d.doctorid=s.anchorid where s.datastatus > 0 `

	if isall == "" {
		sql = fmt.Sprintf("%s and s.anchorid=? ", sql)
	} else if isall == "1" {
		sql = fmt.Sprintf("%s  and s.seriesid not in (select seriesid from t_college_series_home h where h.datastatus > 0) ", sql)
	} else {

	}
	if condition != "" {
		sql = fmt.Sprintf("%s and (s.title like '%%%s%%' or d.roomname like '%%%s%%')", sql, condition, condition)
	}

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		if isall == "" {
			_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&result.List)
		} else {
			_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
		}
		totalcount = int64(result.List.ItemCount())
	}
	if page == 0 {
		sql = fmt.Sprintf("%s order by s.createtime", sql)
	} else {
		sql = fmt.Sprintf("%s order by s.createtime desc  limit %d,%d", sql, perpage*(page-1), perpage)
	}

	if isall == "" {
		_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&result.List)
	} else {
		_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	}
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func SeriesSetting(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SeriesSetting"

	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	datastatus := param.Get("datastatus").Int()
	seriesid := param.Get("seriesid").String()
	o := orm.NewOrm()
	var sql string
	if datastatus == 0 {
		var res config.LJSON
		sql = ` select * from t_college_series_child where seriesid=? `
		_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&res)
		if res.ItemCount() != 0 {
			err.Errorf(gutils.ParamError, "系列课中含有单课程，无法删除")
			return
		}
	}

	//设置系列课状态
	sql = ` update t_college_series set datastatus=:datastatus,applystatus=:applystatus,updatetime=:updatetime where seriesid=:seriesid `
	_, err.Msg = o.RawJSON(sql, param).Exec()
	//更新 home表
	sql2 := "update t_college_series_home h set datastatus = (select datastatus from t_college_series s where s.seriesid=?) where h.seriesid=?"
	if datastatus != 0 {
		_, err.Msg = o.Raw(sql2, seriesid, seriesid).Exec()
	}
	return result, err
}

func SetAllSignle(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SetAllSignle"

	condition := param.Get("condition").String()
	seriesid := param.Get("seriesid").String()
	datastatus := 0
	if condition == "up" {
		datastatus = 1
	} else if condition == "down" {
		datastatus = 2
	} else {
		err.Errorf(gutils.ParamError, "上下架条件错误")
		return
	}
	o := orm.NewOrm()
	o.Begin()
	sql := " update t_college_signle set datastatus=?,updatetime=? where signleid in ( select signleid from t_college_series_child where seriesid=?)"
	_, err.Msg = o.Raw(sql, datastatus, time.Now().Format("2006-01-02 15:04:05"), seriesid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
	}
	return result, err
}

func ModSeries(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ModSeries"
	o := orm.NewOrm()
	o.Begin()
	datastatus := param.Get("datastatus").String()
	feetype := param.Get("feetype").String()
	fixprice := param.Get("fixprice").Double()
	keys := "title,banner,discount,comment,fee,banner1,feetype,fixprice"
	if datastatus == "1"{
		keys = "datastatus,title,banner,discount,comment,fee,banner1,feetype,fixprice"
	}
	sql := gutils.UpdateSql(&param, keys)
	if sql != "" {
		sql = " update db_flybear.t_college_series set " + sql+",applystatus=:applystatus,alterdata=:alterdata" + " where SeriesID=:seriesid "
		_, err.Msg = o.RawJSON(sql, param).Exec()
		if err.Msg != nil {
			o.Rollback()
			return
		}
	}
	now := time.Now().Format("2006-01-02 15:04:05")
	//重算单课程定价
	discount := param.Get("discount").Double() / 100
	// discount1 := strconv.FormatFloat(discount, 'E', -1, 64)
	discount1 := fmt.Sprintf("%.3f", discount)
	seriesid := param.Get("seriesid").String()
	var obj config.LJSON
	sql = ` select fee*` + discount1 + ` as fee,signleid from db_flybear.t_college_signle where signleid in 
			(  select signleid from db_flybear.t_college_series_child where seriesid=? ) `
	_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&obj)
	if err.Msg != nil {
		o.Rollback()
		return
	}
	var totalSoldfee float64 
	for i := 0; i < obj.ItemCount(); i++ {
		signleid := obj.Item(i).Get("signleid").String()
		soldfee := obj.Item(i).Get("fee").Double()
		//所有价格保留两位小数
		soldfee,_ = strconv.ParseFloat(fmt.Sprintf("%.2f",soldfee),64)
		//最后一个单课程
		if(obj.ItemCount() - 1 == i && feetype == "1"){
			soldfee = fixprice - totalSoldfee
		}else{
			totalSoldfee += soldfee
		}
		sql = ` update db_flybear.t_college_series_child set soldfee=?,updatetime=? where seriesid=? and signleid=? `
		_, err.Msg = o.Raw(sql, soldfee, now, seriesid, signleid).Exec()
	}

	if err.Msg != nil {
		o.Rollback()
		return
	}
	
	//审批不用更新详情图片
	if param.Get("detail").IsNULL()==true {
		err.Msg = o.Commit()
		return
	}
	sql = ` delete from t_college_detail where courseid=? `
	_, err.Msg = o.Raw(sql, seriesid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	detailNum := param.Get("detail").ItemCount()
	for i := 0; i < detailNum; i++ {
		sql = "insert into t_college_detail(detailid,courseid,url,displayorder,datastatus,updatetime) values ('" + gutils.CreateSTRGUID() + "','" + seriesid + "',:url," + strconv.Itoa(i) + ",1,'" + now + "')  "
		_, err.Msg = o.RawJSON(sql, *param.Get("detail").Item(i)).Exec()
	}
	if err.Msg != nil {
		o.Rollback()
		return
	}
	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	return
}

func AddSeries(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AddSeries"

	seriesid := gutils.CreateSTRGUID()
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("seriesid").SetString(seriesid)
	param.Set("createtime").SetString(Updatetime)
	param.Set("updatetime").SetString(Updatetime)
	o := orm.NewOrm()

	o.Begin()
	sql := ` insert into t_college_series(seriesid,title,banner,banner1,discount,anchorid,comment,createtime,fee,buynum,clicknum,datastatus,applystatus,updatetime,feetype,fixprice) 
		values (:seriesid,:title,:banner,:banner1,:discount,:anchorid,:comment,:createtime,0,0,0,2,2,:updatetime,:feetype,:fixprice) `
	_, err.Msg = o.RawJSON(sql, param).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql = ` delete from t_college_detail where courseid=? `
	_, err.Msg = o.Raw(sql, seriesid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	detailNum := param.Get("detail").ItemCount()
	for i := 0; i < detailNum; i++ {

		sql = "insert into t_college_detail(detailid,courseid,url,displayorder,datastatus,updatetime) values ('" + gutils.CreateSTRGUID() + "','" + seriesid + "',:url," + strconv.Itoa(i) + ",1,'" + Updatetime + "')  "
		_, err.Msg = o.RawJSON(sql, *param.Get("detail").Item(i)).Exec()
	}
	if err.Msg != nil {
		o.Rollback()
		return
	}
	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	return result, err
}

func SeriesDetail(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SeriesDetail"
	seriesid := param.Get("seriesid").String()
	if seriesid == "" {
		err.Errorf(gutils.ParamError, "系列课ID不能为空")
		return
	}

	condition := param.Get("condition").String() //手机号
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量

	//fee表示 单课程原价 soldfee 单课程在系列课中的售价
	o := orm.NewOrm()
	sql := ` select csc.childid,s.title,s.banner,s.type,s.status,ifnull(s.orifee,0) as orifee,ifnull(s.fee,0) as fee,ifnull(csc.soldfee,0) as soldfee,csc.displayorder,s.signleid,csc.seriesid,ifnull(s.datastatus,0) as datastatus,ifnull(s.applystatus,0) as applystatus,ifnull(s.alterdata,'') as alterdata
		 	from t_college_series_child csc left join t_college_signle s on 
			csc.signleid=s.signleid 
	 		where csc.seriesid=? `

	if condition != "" {
		sql = fmt.Sprintf("%s and s.title like '%%%s%%' ", sql, condition)
	}

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql = fmt.Sprintf("%s order by csc.displayorder asc limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}
func SeriesInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SeriesInfo"
	seriesid := param.Get("seriesid").String()
	o := orm.NewOrm()
	sql := ` select seriesid,title,comment,banner,banner1,anchorid,ifnull(discount,0) as discount,
	ifnull(fee,0) as fee,clicknum,buynum,s.datastatus,s.applystatus,ifnull(alterdata,'') as alterdata
	from t_college_series s where s.seriesid=? `
	_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&result.List)
	var obj config.LJSON
	if result.List.ItemCount() > 0 {

		//查询系列课原价
		sql = ` select sum(ifnull(l.Fee,0)) as totalfee from db_flybear.t_college_series_child c  
			left join db_flybear.t_college_signle l on c.SignleID=l.SignleID 
			where c.seriesid=? `
		_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&obj)
		result.List.Item(0).Set("totalfee").SetString(obj.Item(0).Get("totalfee").String())
	}

	//查询系列课中的课程详情(简介图片)

	sql = ` select * from t_college_detail where courseid=? and datastatus=1  order by displayorder asc `
	_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&obj)
	result.List.Item(0).Set("detail").SetObject(obj)

	return
}

//系列课中追加单课程
func SeriesDetailAddSignle(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SeriesDetailAddSignle"

	seriesid := param.Get("seriesid").String()
	if seriesid == "" {
		err.Errorf(gutils.ParamError, "系列课ID不能为空")
		return
	}
	o := orm.NewOrm()
	num := param.Get("signlelist").ItemCount()
	for i := 0; i < num; i++ {
		signleid := param.Get("signlelist").Item(i).Get("signleid").String()
		var obj config.LJSON
		sql := ` select ifnull(max(displayorder),0)+1 as displayorder from t_college_series_child where seriesid=? `
		_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&obj)
		displayorder := obj.Item(0).Get("displayorder").Int()

		sql = ` insert into t_college_series_child(childid,seriesid,signleid,soldfee,displayorder,updatetime) 
				values (?,?,?,?,?,?) `
		_, err.Msg = o.Raw(sql, gutils.CreateSTRGUID(), seriesid, signleid, param.Get("signlelist").Item(i).Get("soldfee").Double(), displayorder, time.Now().Format("2006-01-02 15:04:05")).Exec()
	}

	sql1 := ` update t_college_series set fee=fee+?,updatetime=? where seriesid=? `
	_, err.Msg = o.Raw(sql1, param.Get("addfee").Double(), time.Now().Format("2006-01-02 15:04:05"), seriesid).Exec()
	return result, err
}

//删除系列课中的单课程
func SeriesDetailDel(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SeriesDetailDel"
	childid := param.Get("childid").String()
	seriesid := param.Get("seriesid").String()
	if childid == "" {
		err.Errorf(gutils.ParamError, "参数不全")
		return
	}
	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select * from t_college_series_child where childid=? and seriesid=? `
	_, err.Msg = o.Raw(sql, childid, seriesid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "系列课中该单课程不存在,请刷新页面")
		return
	}
	soldfee := obj.Item(0).Get("soldfee").Double()
	err.Msg = o.Begin()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql = ` delete from t_college_series_child where childid=? `
	_, err.Msg = o.Raw(sql, childid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql = " update t_college_series set fee=fee - ?,updatetime=? where seriesid=? "
	_, err.Msg = o.Raw(sql, soldfee, time.Now().Format("2006-01-02 15:04:05"), seriesid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	return result, err
}

//交换displayorder
func SeriesDetailMove(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {

	err.Caption = "SeriesDetailMove"

	do := param.Get("do").String()
	displayorder := param.Get("displayorder").Int()
	seriesid := param.Get("seriesid").String()
	childid := param.Get("childid").String()
	if childid == "" {
		err.Errorf(gutils.ParamError, "主键ID不能为空")
		return
	}

	if seriesid == "" {
		err.Errorf(gutils.ParamError, "系列课ID不能为空")
		return
	}

	o := orm.NewOrm()
	sql := ""
	if do == "up" {
		sql = " select childid from t_college_series_child where seriesid=? and  displayorder < ? and childid<>? order by displayorder desc limit 1"
	} else if do == "down" {
		sql = " select childid from t_college_series_child where seriesid=? and displayorder > ? and childid <>? order by displayorder asc limit 1"
	} else {
		err.Errorf(gutils.ParamError, "未指定操作")
		return
	}

	_, err.Msg = o.Raw(sql, seriesid, displayorder, childid).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 {
		if do == "up" {
			err.Errorf(gutils.ParamError, "已置顶")
		} else {
			err.Errorf(gutils.ParamError, "已置底")
		}
		return
	}

	childidnew := result.List.Item(0).Get("childid").String()
	sql = ` update t_college_series_child a,t_college_series_child b set a.DisplayOrder=b.DisplayOrder,b.DisplayOrder=a.DisplayOrder where
				a.ChildID=? and b.ChildID=? `
	_, err.Msg = o.Raw(sql, childid, childidnew).Exec()
	return result, err
}

func EmployRateList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "EmployRateList"

	all := param.Get("all").Int64()
	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()
	sql := ` select employrateid,concat(convert(ifnull(rate,0)*100,decimal(10,2)),'%') as rate,remark,ifnull(usernum,0) as usernum,datastatus,updatetime from t_college_employrate where datastatus=1  `

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
	if all != 1 {
		sql = fmt.Sprintf("%s limit %d,%d", sql, perpage*(page-1), perpage)
	}
	fmt.Println(sql)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func EmployRateAdd(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "EmployRateAdd"

	o := orm.NewOrm()
	sql := ` insert into t_college_employrate (EmployRateID,Rate,Remark,UserNum,DataStatus,UpdateTime) 
			values (?,?,?,0,1,?) `

	_, err.Msg = o.Raw(sql, gutils.CreateGUID(), param.Get("rate").Double(), param.Get("remark").String(), time.Now().Format("2006-01-02 15:04:05")).Exec()

	return result, err
}

func EmployRateUserList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "EmployRateUserList"
	employrateid := param.Get("employrateid").String()
	if employrateid == "" {
		err.Errorf(gutils.ParamError, "分佣比例ID不能为空")
		return
	}
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
	sql := ` select d.name,u.mobile,concat(convert(ifnull(e.rate,0)*100,decimal(10,2)),'%') as rate,d.doctorid as anchorid,d.employrateid
			from t_doctor d 
			inner join t_User u on d.doctorid=u.userid
			inner join t_college_employrate e on e.employrateid=d.employrateid 
			where d.EmployRateID=? `

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
		_, err.Msg = o.Raw(sql, employrateid).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql = fmt.Sprintf("%s limit %d,%d", sql, perpage*(page-1), perpage)
	fmt.Println(sql)
	_, err.Msg = o.Raw(sql, employrateid).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func ModifyUserEmploy(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ModifyUserEmploy"

	oldemployrateid := param.Get("oldemployrateid").String()
	newemployrateid := param.Get("newemployrateid").String()
	anchorid := param.Get("anchorid").String()
	if oldemployrateid == "" || newemployrateid == "" || anchorid == "" {
		err.Errorf(gutils.ParamError, "必填参数不能为空")
		return
	}
	o := orm.NewOrm()

	sql := ` update t_doctor set EmployRateID=?,updatetime=? where doctorid=? `

	_, err.Msg = o.Raw(sql, newemployrateid, time.Now().Format("2006-01-02 15:04:05"), anchorid).Exec()

	sql = " update t_college_employrate set usernum=usernum+1,updatetime=? where employrateid=? "
	_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02 15:04:05"), newemployrateid).Exec()

	sql = " update t_college_employrate set usernum=usernum-1,updatetime=? where employrateid=? and usernum > 0 "
	_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02 15:04:05"), oldemployrateid).Exec()
	return result, err
}

func BannerList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "BannerList"

	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()
	sql := ` select * from t_college_banner where datastatus>0 `

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
	sql = fmt.Sprintf("%s order by displayorder asc limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数

	return result, err
}

func AddOrModBanner(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AddOrModBanner"

	bannerid := param.Get("bannerid").String()
	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))

	if param.Get("coursetype").IsNULL() {
		param.Get("coursetype").SetInt(0)
	}

	o := orm.NewOrm()
	sql := ""
	if bannerid == "" {
		bannerid = gutils.CreateSTRGUID()
		param.Set("bannerid").SetString(bannerid)

		var obj config.LJSON
		sql = " select (max(ifnull(displayorder,0)) +1) as displayorder from t_college_banner "
		_, err.Msg = o.Raw(sql).ValuesJSON(&obj)

		param.Set("displayorder").SetInt(obj.Item(0).Get("displayorder").Int())

		sql = ` insert into t_college_banner (coursename,courseid, bannerid,bannername,url,displayorder,detailurl,datastatus,updatetime,coursetype) 
		values (:coursename,:courseid,:bannerid,:bannername,:url,:displayorder,:detailurl,2,:updatetime,:coursetype)`
		_, err.Msg = o.RawJSON(sql, param).Exec()

	} else {
		sql = " update t_college_banner set coursetype=:coursetype,coursename=:coursename,courseid=:courseid,bannername=:bannername,url=:url,detailurl=:detailurl,updatetime=:updatetime where bannerid=:bannerid "
		_, err.Msg = o.RawJSON(sql, param).Exec()
	}

	return result, err
}

func BannerSetting(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "BannerSetting"

	bannerid := param.Get("bannerid").String()
	if bannerid == "" {
		err.Errorf(gutils.ParamError, "BannerID不能为空")
		return
	}
	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	o := orm.NewOrm()
	sql := ` update t_college_banner set datastatus=:datastatus,updatetime=:updatetime where bannerid=:bannerid `
	_, err.Msg = o.RawJSON(sql, param).Exec()
	return result, err
}

func MoveBanner(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "MoveBanner"

	do := param.Get("do").String()
	displayorder := param.Get("displayorder").Int()

	bannerid := param.Get("bannerid").String()
	if bannerid == "" {
		err.Errorf(gutils.ParamError, "主键ID不能为空")
		return
	}

	o := orm.NewOrm()
	sql := ""
	if do == "up" {
		sql = " select * from t_college_banner where datastatus>0 and displayorder < ? and bannerid<>? order by displayorder desc limit 1"
	} else if do == "down" {
		sql = " select * from t_college_banner where datastatus>0 and displayorder > ? and bannerid <>? order by displayorder asc limit 1"
	} else {
		err.Errorf(gutils.ParamError, "未指定操作")
		return
	}

	_, err.Msg = o.Raw(sql, displayorder, bannerid).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 {
		if do == "up" {
			err.Errorf(gutils.ParamError, "已置顶")
		} else {
			err.Errorf(gutils.ParamError, "已置底")
		}
		return
	}

	banneridnew := result.List.Item(0).Get("bannerid").String()
	sql = ` update t_college_banner a,t_college_banner b set a.DisplayOrder=b.DisplayOrder,b.DisplayOrder=a.DisplayOrder where 
			a.bannerid=? and b.bannerid=? `
	_, err.Msg = o.Raw(sql, bannerid, banneridnew).Exec()
	return result, err
}

func SeriesHomeList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SeriesHomeList"

	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量
	o := orm.NewOrm()
	sql := ` select h.*,s.banner,s.title,s.clicknum,s.buynum,s.fee,s.anchorid,d.name as anchorname,s.datastatus as seriesstatus
			from t_college_series_home h
			inner join t_college_series s
			on h.SeriesID=s.SeriesID
			inner join t_doctor d on d.doctorid = s.anchorid 
			where h.datastatus>0
			`
	var temp config.LJSON
	_, err.Msg = o.Raw(sql).ValuesJSON(&temp)
	//目的是避免每次翻页重复读取总数量  -- istop倒序 displayorder 正序
	sql = fmt.Sprintf("%s order by h.istop desc,h.displayorder asc limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)

	totalcount := result.List.ItemCount()
	if totalcount > 0 {
		for i := 0; i < totalcount; i++ {
			clicknum := 0
			seriesid := result.List.Item(i).Get("seriesid").String()
			// signleid := result.List.Item(i).Get("signleid").String()
			sql = ` select s.clicknum
			from t_college_series_child h
			inner join t_college_signle s
			on h.SignleID=s.SignleID
			where h.seriesid=?`
			var subResult gutils.LResultModel
			var rowCount int
			_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&subResult.List)
			rowCount = subResult.List.ItemCount()
			if rowCount > 0 {
				for j := 0; j < rowCount; j++ {
					rowClicknum := subResult.List.Item(j).Get("clicknum").Int()
					clicknum += rowClicknum
				}
			}
			result.List.Item(i).Set("clicknum").SetInt(clicknum)
		}
	}
	result.TotalCount = int64(temp.ItemCount()) //总条数
	result.PageNo = int64(page)                 //页码
	result.PageSize = int64(perpage)            //每页条数
	return result, err
}

//上、下移动课程
func SeriesHomeMove(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SeriesHomeMove"

	//被移动的课程的ID
	serieshomeid := param.Get("serieshomeid").String()
	if serieshomeid == "" {
		err.Errorf(gutils.ParamError, "主键ID不能为空")
		return
	}

	//判断是否首页展示的课程
	var obj config.LJSON
	sql := ` select istop,displayorder from db_flybear.t_college_series_home where serieshomeid = ? `
	o := orm.NewOrm()
	_, err.Msg = o.Raw(sql, serieshomeid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "课程不存在")
		return
	}

	//获取课程的置顶类型
	displayorder := obj.Item(0).Get("displayorder").Int()
	istop := obj.Item(0).Get("istop").Int()

	do := param.Get("do").String()
	if do != "up" && do != "down" {
		err.Errorf(gutils.ParamError, "未指定操作")
		return
	}

	if istop == 0 { //非置顶课程,上下移动

		//查找和当前ID相邻的ID
		if do == "up" {
			sql = " select serieshomeid from t_college_series_home where datastatus>0 and  displayorder < ? and istop = 0 order by displayorder desc limit 1"
		} else if do == "down" {
			sql = " select serieshomeid from t_college_series_home where datastatus>0 and  displayorder > ? and istop = 0 order by displayorder asc limit 1"
		}
		_, err.Msg = o.Raw(sql, displayorder).ValuesJSON(&obj)

		if obj.ItemCount() == 0 {
			if do == "up" {
				err.Errorf(gutils.ParamError, "已置顶")
			} else {
				err.Errorf(gutils.ParamError, "已置底")
			}
			return
		}

		//互换displayorder
		serieshomeidnew := obj.Item(0).Get("serieshomeid").String()
		sql = ` update t_college_series_home a,t_college_series_home b set a.DisplayOrder=b.DisplayOrder,b.DisplayOrder=a.DisplayOrder where 
			a.serieshomeid=? and b.serieshomeid=? `
		_, err.Msg = o.Raw(sql, serieshomeid, serieshomeidnew).Exec()

	} else { //已置顶课程，上下移动

		//查找和当前ID相邻的ID
		if do == "up" {
			sql = " select serieshomeid from t_college_series_home where datastatus>0 and istop > ? and istop > 0 order by istop asc limit 1"
		} else if do == "down" {
			sql = " select serieshomeid from t_college_series_home where datastatus>0 and istop < ? and istop > 0 order by istop desc limit 1"
		}
		_, err.Msg = o.Raw(sql, istop).ValuesJSON(&obj)

		if obj.ItemCount() == 0 {
			if do == "up" {
				err.Errorf(gutils.ParamError, "已置顶")
			} else {
				err.Errorf(gutils.ParamError, "已置底")
			}
			return
		}

		//互换istop
		serieshomeidnew := obj.Item(0).Get("serieshomeid").String()
		sql = ` update t_college_series_home a,t_college_series_home b set a.istop=b.istop,b.istop=a.istop where 
			a.serieshomeid=? and b.serieshomeid=? `
		_, err.Msg = o.Raw(sql, serieshomeid, serieshomeidnew).Exec()
	}
	return
	//---------------------------------------------------------------------------
	//	var isTop int64
	//	isTop = 0
	//	if param.Get("istop").IsNULL() == false {
	//		isTop = param.Get("istop").Int64()
	//	}

	//	do := param.Get("do").String()
	//	displayorder := param.Get("displayorder").Int()

	//	//被移动的课程的ID
	//	serieshomeid := param.Get("serieshomeid").String()
	//	if serieshomeid == "" {
	//		err.Errorf(gutils.ParamError, "主键ID不能为空")
	//		return
	//	}

	//	o := orm.NewOrm()
	//	sql := ""
	//	if do == "up" {
	//		sql = " select * from t_college_series_home where datastatus>0 and displayorder < ? and serieshomeid<>? and istop = ? order by displayorder desc limit 1"
	//	} else if do == "down" {
	//		sql = " select * from t_college_series_home where datastatus>0 and displayorder > ? and serieshomeid <>? and istop = ? order by displayorder asc limit 1"
	//	} else {
	//		err.Errorf(gutils.ParamError, "未指定操作")
	//		return
	//	}

	//	_, err.Msg = o.Raw(sql, displayorder, serieshomeid, isTop).ValuesJSON(&result.List)
	//	if result.List.ItemCount() == 0 {
	//		if do == "up" {
	//			err.Errorf(gutils.ParamError, "已置顶")
	//		} else {
	//			err.Errorf(gutils.ParamError, "已置底")
	//		}
	//		return
	//	}

	//	serieshomeidnew := result.List.Item(0).Get("serieshomeid").String()
	//	sql = ` update t_college_series_home a,t_college_series_home b set a.DisplayOrder=b.DisplayOrder,b.DisplayOrder=a.DisplayOrder where
	//			a.serieshomeid=? and b.serieshomeid=? `
	//	_, err.Msg = o.Raw(sql, serieshomeid, serieshomeidnew).Exec()
	//	return result, err
}
func SeriesHomeTop(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SeriesHomeTop"
	serieshomeid := param.Get("serieshomeid").String()
	if serieshomeid == "" {
		err.Errorf(gutils.ParamError, "主键ID不能为空")
		return
	}
	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	var obj config.LJSON
	o := orm.NewOrm()
	//查询最大值
	sql := ` select max(istop)+1 as maxtop from t_college_series_home where istop > 0 `
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)
	maxtop := obj.Item(0).Get("maxtop").Int()
	param.Set("istop").SetInt(maxtop)
	//更新当前值为最大值
	sql = " update t_college_series_home set updatetime=:updatetime,istop=:istop where serieshomeid=:serieshomeid "
	_, err.Msg = o.RawJSON(sql, param).Exec()
	return
}

func SeriesHomeSetting(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SeriesHomeSetting"

	serieshomeid := param.Get("serieshomeid").String()
	// datastatus := param.Get("datastatus").String()
	if serieshomeid == "" {
		err.Errorf(gutils.ParamError, "主键ID不能为空")
		return
	}
	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	o := orm.NewOrm()
	sql := " update t_college_series_home set updatetime=:updatetime"
	if param.Get("datastatus").IsNULL() == false {
		sql += `,datastatus=:datastatus  `

	}

	if param.Get("istop").IsNULL() == false {
		sql += `,istop=:istop  `
	}

	sql += " where serieshomeid=:serieshomeid "
	_, err.Msg = o.RawJSON(sql, param).Exec()

	// sql2 := "update t_college_series a left outer join t_college_series_home b on a.SeriesID=b.SeriesID set a.DataStatus=b.DataStatus where b.SeriesHomeID=?"
	// if datastatus != "0" {
	// 	_, err.Msg = o.Raw(sql2, serieshomeid).Exec()
	// }
	return result, err
}

func SeriesHomeAddCourse(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SeriesHomeAddCourse"

	var obj config.LJSON
	o := orm.NewOrm()
	sql := ` select max(ifnull(displayorder,0)) +1 as displayorder from t_college_series_home `
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)

	displayorder := obj.Item(0).Get("displayorder").Int()

	count := param.Get("serieslist").ItemCount()
	fmt.Println(param.ToString())
	if count > 0 {
		for i := 0; i < count; i++ {
			seriesid := param.Get("serieslist").Item(i).Get("seriesid").String()
			sql = ` insert into t_college_series_home (serieshomeid,seriesid,displayorder,istop,datastatus,updatetime) 
			 		values (?,?,?,0,2,?) `
			_, err.Msg = o.Raw(sql, gutils.CreateSTRGUID(), seriesid, displayorder, time.Now().Format("2006-01-02 15:04:05")).Exec()
			displayorder++
		}
	}
	return result, err
}

func SignleHomeList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SignleHomeList"

	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量
	o := orm.NewOrm()
	sql := ` select h.*,s.banner,s.title,s.clicknum,s.buynum,s.anchorid,d.name as anchorname,s.orifee,s.fee,s.datastatus as signlestatus
			from t_college_signle_home h 
			inner join t_college_signle s
			on h.signleid=s.signleid
			inner join t_doctor d on d.doctorid = s.anchorid
			where h.datastatus > 0`

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
	sql = fmt.Sprintf("%s order by h.istop desc,h.displayorder asc limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数

	return result, err
}

func SignleHomeMove(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SignleHomeMove"

	//被移动的课程的ID
	signlehomeid := param.Get("signlehomeid").String()
	if signlehomeid == "" {
		err.Errorf(gutils.ParamError, "主键ID不能为空")
		return
	}

	//判断是否首页展示的课程
	var obj config.LJSON
	sql := ` select istop,displayorder from db_flybear.t_college_signle_home where signlehomeid = ? `
	o := orm.NewOrm()
	_, err.Msg = o.Raw(sql, signlehomeid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "课程不存在")
		return
	}

	//获取课程的置顶类型
	displayorder := obj.Item(0).Get("displayorder").Int()
	istop := obj.Item(0).Get("istop").Int()

	do := param.Get("do").String()
	if do != "up" && do != "down" {
		err.Errorf(gutils.ParamError, "未指定操作")
		return
	}

	if istop == 0 { //非置顶课程,上下移动

		//查找和当前ID相邻的ID
		if do == "up" {
			sql = " select signlehomeid from t_college_signle_home where datastatus>0 and  displayorder < ? and istop = 0 order by displayorder desc limit 1"
		} else if do == "down" {
			sql = " select signlehomeid from t_college_signle_home where datastatus>0 and  displayorder > ? and istop = 0 order by displayorder asc limit 1"
		}
		_, err.Msg = o.Raw(sql, displayorder).ValuesJSON(&obj)

		if obj.ItemCount() == 0 {
			if do == "up" {
				err.Errorf(gutils.ParamError, "已置顶")
			} else {
				err.Errorf(gutils.ParamError, "已置底")
			}
			return
		}

		//互换displayorder
		signlehomeidnew := result.List.Item(0).Get("signlehomeid").String()
		sql = ` update t_college_signle_home a,t_college_signle_home b set a.DisplayOrder=b.DisplayOrder,b.DisplayOrder=a.DisplayOrder where 
			a.signlehomeid=? and b.signlehomeid=? `
		_, err.Msg = o.Raw(sql, signlehomeid, signlehomeidnew).Exec()

	} else { //已置顶课程，上下移动

		//查找和当前ID相邻的ID
		if do == "up" {
			sql = " select signlehomeid from t_college_signle_home where datastatus>0 and istop > ? and istop > 0 order by istop asc limit 1"
		} else if do == "down" {
			sql = " select signlehomeid from t_college_signle_home where datastatus>0 and istop < ? and istop > 0 order by istop desc limit 1"
		}
		_, err.Msg = o.Raw(sql, istop).ValuesJSON(&obj)

		if obj.ItemCount() == 0 {
			if do == "up" {
				err.Errorf(gutils.ParamError, "已置顶")
			} else {
				err.Errorf(gutils.ParamError, "已置底")
			}
			return
		}

		//互换istop
		signlehomeidnew := obj.Item(0).Get("signlehomeid").String()
		sql = ` update t_college_signle_home a,t_college_signle_home b set a.istop=b.istop,b.istop=a.istop where 
			a.signlehomeid=? and b.signlehomeid=? `
		_, err.Msg = o.Raw(sql, signlehomeid, signlehomeidnew).Exec()
	}
	return

	//-------------------------------------------------------------------------
	//	var isTop int64
	//	isTop = 0
	//	if param.Get("istop").IsNULL() == false {
	//		isTop = param.Get("istop").Int64()
	//	}
	//	do := param.Get("do").String()
	//	displayorder := param.Get("displayorder").Int()

	//	signlehomeid := param.Get("signlehomeid").String()
	//	if signlehomeid == "" {
	//		err.Errorf(gutils.ParamError, "主键ID不能为空")
	//		return
	//	}

	//	o := orm.NewOrm()
	//	sql := ""

	//	if do == "up" {
	//		sql = " select * from t_college_signle_home where datastatus>0 and displayorder < ? and signlehomeid<>? and istop = ? order by displayorder desc limit 1"
	//	} else if do == "down" {
	//		sql = " select * from t_college_signle_home where datastatus>0 and displayorder > ? and signlehomeid <>? and istop = ? order by displayorder asc limit 1"
	//	} else {
	//		err.Errorf(gutils.ParamError, "未指定操作")
	//		return
	//	}

	//	_, err.Msg = o.Raw(sql, displayorder, signlehomeid, isTop).ValuesJSON(&result.List)
	//	if result.List.ItemCount() == 0 {
	//		if do == "up" {
	//			err.Errorf(gutils.ParamError, "已置顶")
	//		} else {
	//			err.Errorf(gutils.ParamError, "已置底")
	//		}
	//		return
	//	}

	//	signlehomeidnew := result.List.Item(0).Get("signlehomeid").String()
	//	sql = ` update t_college_signle_home a,t_college_signle_home b set a.DisplayOrder=b.DisplayOrder,b.DisplayOrder=a.DisplayOrder where
	//			a.signlehomeid=? and b.signlehomeid=? `
	//	_, err.Msg = o.Raw(sql, signlehomeid, signlehomeidnew).Exec()
	//	return result, err
}

func SignleHomeTop(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {

	err.Caption = "SignleHomeTop"
	signlehomeid := param.Get("signlehomeid").String()
	if signlehomeid == "" {
		err.Errorf(gutils.ParamError, "主键ID不能为空")
		return
	}

	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	var obj config.LJSON
	o := orm.NewOrm()
	//查询最大值
	sql := ` select max(istop)+1 as maxtop from t_college_signle_home where istop > 0 `
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)
	maxtop := obj.Item(0).Get("maxtop").Int()
	param.Set("istop").SetInt(maxtop)
	//更新当前值为最大值
	sql = " update t_college_signle_home set updatetime=:updatetime,istop=:istop where signlehomeid=:signlehomeid "
	_, err.Msg = o.RawJSON(sql, param).Exec()
	return
}
func SignleHomeSetting(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SignleHomeSetting"

	signlehomeid := param.Get("signlehomeid").String()
	// datastatus := param.Get("datastatus").String()
	if signlehomeid == "" {
		err.Errorf(gutils.ParamError, "主键ID不能为空")
		return
	}
	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	o := orm.NewOrm()
	sql := " update t_college_signle_home set updatetime=:updatetime"
	if param.Get("datastatus").IsNULL() == false {
		sql += `,datastatus=:datastatus  `

	}

	if param.Get("istop").IsNULL() == false {
		sql += `,istop=:istop  `
	}

	sql += " where signlehomeid=:signlehomeid "
	_, err.Msg = o.RawJSON(sql, param).Exec()

	// sql2 := "update t_college_signle a left outer join t_college_signle_home b on a.SignleID=b.SignleID set a.DataStatus=b.DataStatus where b.SignleHomeID=?"
	// if datastatus != "0" {
	// 	_, err.Msg = o.Raw(sql2, signlehomeid).Exec()
	// }

	return result, err
}

func SignleHomeAddCourse(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SignleHomeAddCourse"

	var obj config.LJSON
	o := orm.NewOrm()
	sql := ` select max(ifnull(displayorder,0)) +1 as displayorder from t_college_signle_home `
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)

	displayorder := obj.Item(0).Get("displayorder").Int()

	count := param.Get("signlelist").ItemCount()
	if count > 0 {
		for i := 0; i < count; i++ {
			signleid := param.Get("signlelist").Item(i).Get("signleid").String()
			sql = ` insert into t_college_signle_home (signlehomeid,signleid,displayorder,istop,datastatus,updatetime) 
			 		values (?,?,?,0,2,?) `
			_, err.Msg = o.Raw(sql, gutils.CreateSTRGUID(), signleid, displayorder, time.Now().Format("2006-01-02 15:04:05")).Exec()
			displayorder++
		}
	}
	return result, err
}

func TotalStat(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "TotalStat"
	o := orm.NewOrm()
	sql := ` select sum(IFNULL(PaidFee,0)) AS paidfee,
					sum(IFNULL(earnings,0)) AS earnings, 
					sum(IFNULL(PlatFormfee,0)) AS platformfee
	 				from t_college_order where datastatus=1 `
	var obj config.LJSON
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)

	result.List.Set("totafee").SetDouble(obj.Item(0).Get("paidfee").Double())
	result.List.Set("anchorfee").SetDouble(obj.Item(0).Get("earnings").Double())
	result.List.Set("platformfee").SetDouble(obj.Item(0).Get("platformfee").Double())

	sql = ` select sum(IFNULL(PlatFormfee,0)) AS platformfee from t_college_order where datastatus=1 and buytime between ? and ? `

	_, err.Msg = o.Raw(sql, gutils.DateStr(), gutils.DateStrAddDay(gutils.DateStr(), 1)).ValuesJSON(&obj)
	result.List.Set("todayfee").SetDouble(obj.Item(0).Get("platformfee").Double())

	sql = ` select sum(IFNULL(PlatFormfee,0)) AS platformfee from t_college_order where datastatus=1 and buytime between ? and ? `

	_, err.Msg = o.Raw(sql, gutils.DateStrAddDay(gutils.DateStr(), -1), gutils.DateStr()).ValuesJSON(&obj)
	result.List.Set("yesterdayfee").SetDouble(obj.Item(0).Get("platformfee").Double())

	return result, err
}

func TotalStatList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "TotalStatList"

	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()

	sql := ` 	SELECT classid,
				classtype, 
				sum(IFNULL(PaidFee,0)) AS paidfee, 
				sum(IFNULL(earnings,0)) AS earnings, 
				sum(IFNULL(PlatFormfee,0)) AS platformfee
				FROM t_college_order
				WHERE datastatus=1  group by classid `

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

	sql = ` select a.*, CASE a.classtype WHEN '系列课' THEN (
			SELECT CONCAT(title,'||',clicknum,'||',buynum)
			FROM t_college_series
			WHERE seriesid=classid) ELSE (
			SELECT CONCAT(title,'||',clicknum,'||',buynum)
			FROM t_college_signle
			WHERE signleid=classid) END AS title
			FROM (` + sql + ` ) a `

	sql = fmt.Sprintf("%s limit %d,%d", sql, perpage*(page-1), perpage)
	fmt.Println(sql)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func AnchorStatList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AnchorStatList"

	begintime := param.Get("begintime").String()
	endtime := param.Get("endtime").String()

	condition := param.Get("condition").String() //名字
	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()

	sql := ` SELECT SUM(IFNULL(o.earnings,0)) AS earnings,d.roomname as name
			 FROM t_college_order o left join t_doctor d on o.anchorid=d.doctorid
			 WHERE o.datastatus=1 AND o.buytime BETWEEN ? AND ? 
			  `
	if condition != "" {
		sql = fmt.Sprintf("%s and d.roomname like '%%%s%%' ", sql, condition)
	}

	sql = sql + " GROUP BY o.anchorid "

	fmt.Println(sql)

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, begintime, endtime).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql = fmt.Sprintf("%s limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql, begintime, endtime).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数

	return result, err
}
func AnchorIncomeList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AnchorIncomeList"
	begintime := param.Get("begintime").String()
	endtime := param.Get("endtime").String()

	condition := param.Get("condition").String() //名字
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量
	searchall := param.Get("searchall").String() //查询全部
	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()

	sql := ` select 
			CASE o.classtype WHEN '系列课' THEN (
			SELECT title
			FROM t_college_series
			WHERE seriesid=classid) ELSE (
			SELECT title
			FROM t_college_signle
			WHERE signleid=classid) END AS title,
			o.classtype,o.buytime,o.orderid,d.roomname as anchorname,
			u.mobile,o.paidfee,o.earnings,o.platformfee,o.paystyle	
			from t_college_order o 
			left join t_doctor d on d.doctorid=o.anchorid
			left join t_user u on u.userid=o.userid
			where o.datastatus=1 and o.buytime between ? and ? `

	if condition != "" {
		sql = fmt.Sprintf("%s and d.roomname like '%%%s%%' ", sql, condition)
	}

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, begintime, endtime).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	if param.Get("searchall").IsNULL() == false && searchall == "1" {
		sql = fmt.Sprintf("%s order by buytime", sql)
	}else {
		sql = fmt.Sprintf("%s order by buytime desc limit %d,%d", sql, perpage*(page-1), perpage)
	}
	
	_, err.Msg = o.Raw(sql, begintime, endtime).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func AnchorStatPayOut(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AnchorStatPayOut"

	begintime := param.Get("begintime").String()
	endtime := param.Get("endtime").String()

	condition := param.Get("condition").String() //名字
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()

	sql := ` SELECT d.name,SUM(CONVERT(IFNULL(amount,0)/100, DECIMAL(10,2))) AS amount
			FROM t_college_withdrawal w
			left join t_doctor d on w.userid=d.doctorid
			WHERE w.datastatus=1 AND 
			w.payment_time BETWEEN ? AND ? `
	if condition != "" {
		sql = fmt.Sprintf("%s and d.name like '%%%s%%' ", sql, condition)
	}

	sql = sql + " GROUP BY w.userid "

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, begintime, endtime).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql = fmt.Sprintf("%s limit %d,%d ", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql, begintime, endtime).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数

	return result, err
}

func AnchorPayOutList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AnchorPayOutList"
	begintime := param.Get("begintime").String()
	endtime := param.Get("endtime").String()
	condition := param.Get("condition").String() //名字
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()

	sql := ` SELECT d.roomname as anchorname,w.partner_trade_no,w.payment_time,w.openid, 
			CONVERT(w.amount/100, DECIMAL(10,2)) AS amount,u.mobile
			FROM t_college_withdrawal w
			LEFT JOIN t_doctor d ON w.userid= d.DoctorID
			LEFT JOIN t_user u ON u.userid=w.userid
			WHERE w.datastatus=1 and w.payment_time between ? and ? `

	if condition != "" {
		sql = fmt.Sprintf("%s and d.name like '%%%s%%' ", sql, condition)
	}

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, begintime, endtime).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql = fmt.Sprintf("%s order by w.payment_time desc limit %d,%d", sql, perpage*(page-1), perpage)
	fmt.Println(sql)
	_, err.Msg = o.Raw(sql, begintime, endtime).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

//GetMemberList
func GetMemberList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetMemberList"

	condition := param.Get("condition").String() //手机号
	role := param.Get("role").Int()
	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()
	sql := ` select u.mobile,r.RoleDesc,r.Role,u.UserID,bu.LastLoginTime,d.Name,bu.datastatus
			from db_flybear.t_user u inner join db_flybear.t_college_bg_user bu on 
			u.userid=bu.userid  
			inner join db_flybear.t_doctor d on d.DoctorID=u.UserID
			left join db_flybear.t_college_bg_role r on bu.role=r.role where 1=1 `

	if condition != "" {
		sql = fmt.Sprintf("%s and u.mobile='%s' ", sql, condition)
	}
	if role != -1 {
		sql = fmt.Sprintf("%s and bu.role=%d ", sql, role)
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
	sql = fmt.Sprintf("%s order by bu.role desc limit %d,%d", sql, perpage*(page-1), perpage)
	fmt.Println(sql)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)
	return
}

//SettingsMember datastatus =1 =0
func SettingsMember(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SettingsMember"
	userid := param.Get("userid").String()
	if userid == "" {
		err.Errorf(gutils.ParamError, "用户ID不能为空")
		return
	}

	datastatus := param.Get("datastatus").Int()
	o := orm.NewOrm()
	if datastatus == 2 {
		sql := `delete from db_flybear.t_college_bg_user where userid=? `
		_, err.Msg = o.Raw(sql, userid).Exec()
	} else {
		sql := ` update db_flybear.t_college_bg_user set datastatus=? where userid=? `
		_, err.Msg = o.Raw(sql, datastatus, userid).Exec()
	}

	return
}

//GetRoleList
func GetRoleList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetRoleList"

	o := orm.NewOrm()
	sql := ` select * from db_flybear.t_college_bg_role `
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	return
}

//AddMemober
func AddMemober(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AddMemober"
	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	o := orm.NewOrm()
	sql := ` insert into db_flybear.t_college_bg_user (userid,role,datastatus,updatetime) 
		values (:userid,:role,1,:updatetime) `
	_, err.Msg = o.RawJSON(sql, param).Exec()
	return
}

//CheckMemober
func CheckMemober(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CheckMemober"
	o := orm.NewOrm()
	mobile := param.Get("mobile").String()
	if mobile == "" {
		err.Errorf(gutils.ParamError, "手机号不能为空")
		return
	}
	var obj config.LJSON
	sql := ` select * from db_flybear.t_user where mobile=? and roleid=3 `
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&obj)
	if obj.ItemCount() != 1 {
		err.Errorf(gutils.ParamError, "手机账号不存在")
		return
	}

	userid := obj.Item(0).Get("userid").String()

	sql = ` select * from db_flybear.t_college_bg_user where userid=? `
	_, err.Msg = o.Raw(sql, userid).ValuesJSON(&obj)
	if obj.ItemCount() == 1 {
		err.Errorf(gutils.ParamError, "账号已添加为管理账号")
		return
	}
	return
}

//AllSignleList 单课程列表
func AllSignleList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AllSignleList"

	condition := param.Get("condition").String() //手机号
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量
	lessontype := param.Get("lessontype").String()  //0 线上课程(默认) type : 1   线下课程  
	o := orm.NewOrm()
	sql := ` select s.*,s.tag as tagid,ifnull(s.orifee,0) as orifee,
					ifnull(s.fee,0) as fee,d.roomname as anchorname,
					IFNULL((SELECT sum(num) AS visitcount FROM t_college_stat_room WHERE SignleID=s.signleid GROUP BY signleid LIMIT 1),0) AS visitcount,
					IFNULL((SELECT count( 1 ) AS visitnum FROM t_college_stat_room where SignleID=s.signleid GROUP BY signleid LIMIT 1),0) as visitnum,
					ifnull(t.tagname,'其他') as tagname 
			 		from t_college_signle s join t_doctor d on d.doctorid = s.anchorid
					left join t_college_tag t on s.tag=t.tagid where 1=1 `

	//主播名或者课程标题
	if condition != "" {
		sql = fmt.Sprintf("%s and (s.title like '%%%s%%' or d.roomname like '%%%s%%')", sql, condition, condition)
	}

	if lessontype != "" {
		sql = fmt.Sprintf(" %s and s.lessontype=%s ", sql, lessontype)
	}

	tag := param.Get("tag").String()
	if tag != "" {
		sql = fmt.Sprintf(" %s and s.tag=%s ", sql, tag)
	}

	//上架状态
	datastatus := param.Get("datastatus").Int()
	if datastatus != -2 {
		sql = fmt.Sprintf(" %s and s.datastatus=%d ", sql, datastatus)
	} else {
		sql = fmt.Sprintf(" %s and (s.datastatus>0 or s.datastatus =-1 or s.datastatus=-2 or s.datastatus=-4) ", sql)
	}
	//审批状态
	applystatus := param.Get("applystatus").Int()
	if applystatus!=-2{
	    sql = fmt.Sprintf(" %s and s.applystatus=%d ", sql, applystatus)
	 }

	//开播时间
	begintime := param.Get("begintime").String()
	if begintime != "" {
		sql = fmt.Sprintf(" %s and s.begintime > '%s' ", sql, begintime)
	}
	endtime := param.Get("endtime").String()

	if endtime != "" {
		sql = fmt.Sprintf(" %s and s.endtime <= '%s' ", sql, endtime)
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

	sql = fmt.Sprintf("%s order by s.begintime desc limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return
}

//AllSeriesList 系列课列表
func AllSeiesList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AllSeriesList"

	condition := param.Get("condition").String() //手机号
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量
	o := orm.NewOrm()
	sql := ` select seriesid,title,comment,
					banner,anchorid,banner1,
					fee,ifnull(discount,0) as discount,
					d.roomname as anchorname,ifnull(fee,0) as fee,
					clicknum,buynum,s.datastatus,s.applystatus,s.alterdata
			 from t_college_series s inner join t_doctor d on d.doctorid=s.anchorid where 1=1 `

	if condition != "" {
		sql = fmt.Sprintf("%s and (s.title like '%%%s%%' or d.roomname like '%%%s%%')", sql, condition, condition)
	}
	//上架状态
	datastatus := param.Get("datastatus").Int()
	if datastatus != -2 {
		sql = fmt.Sprintf(" %s and s.datastatus=%d ", sql, datastatus)
	} else {
		sql = fmt.Sprintf(" %s and (s.datastatus> 0 or s.datastatus=-1 or s.datastatus=-2)", sql)
	}
	//审批状态
	applystatus := param.Get("applystatus").Int()
	if applystatus!=-2{
		sql = fmt.Sprintf(" %s and s.applystatus=%d ", sql, applystatus)
	}
	//开播时间
	begintime := param.Get("begintime").String()
	if begintime != "" {
		sql = fmt.Sprintf(" %s and s.createtime > '%s' ", sql, begintime)
	}
	endtime := param.Get("endtime").String()

	if endtime != "" {
		sql = fmt.Sprintf(" %s and s.createtime <= '%s' ", sql, endtime)
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

	sql = fmt.Sprintf("%s order by s.createtime desc limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)

	itemNum := result.List.ItemCount()

	for i := 0; i < itemNum; i++ {
		sql := `select sum(s.ClickNum)  as num from t_college_series_child d inner join t_college_signle s on d.SignleID=s.SignleID
				where d.seriesid=?  `
		var json config.LJSON
		seriesid := result.List.Item(i).Get("seriesid").String()
		_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&json)
		result.List.Item(i).Set("clicknum").SetInt(json.Item(0).Get("num").Int())
	}

	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

//GetPushUrl 获取推流地址  6376;//直播推流地址
func GetPushUrl(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {

	signleid := param.Get("signleid").String()
	istovod := param.Get("istovod").String()
	if signleid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}

	var param1 config.LJSON
	param1.Set("funcid").SetInt(6376)
	param1.Set("signleid").SetString(signleid)
	param1.Set("istovod").SetString(istovod)
	res := gutils.FlybearCPlus(param1)

	if res.Get("code").Int() != 1 {
		err.Errorf(gutils.ParamError, res.Get("info").String())
		return
	}
	result.List.Set("url").SetString(res.Get("edgeurl").String())
	return
}

//GetPlayUrl 获取播流地址  6375;//直播播流地址
func GetPlayUrl(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	signleid := param.Get("signleid").String()
	//播放流地址 默认0原始画质 1 流畅画质 2标清 3高清 4超清
	quality := param.Get("quality").String()
	if signleid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}
	var param1 config.LJSON
	param1.Set("funcid").SetInt(6375)
	param1.Set("signleid").SetString(signleid)
	param1.Set("istovod").SetString("1")
	param1.Set("quality").SetString(quality)
	res := gutils.FlybearCPlus(param1)
	if res.Get("code").Int() != 1 {
		err.Errorf(gutils.ParamError, res.Get("info").String())
		return
	}
	result.List.SetObject(*(res.Get("data")))
	return
}

//GetVodList 获取点播列表  40;//获取点播列表
func GetVodList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	signleid := param.Get("signleid").String()
	if signleid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}
	var param1 config.LJSON
	param1.Set("funcid").SetInt(40)
	param1.Set("signleid").SetString(signleid)
	
	res := gutils.FlybearCPlus(param1)
	if res.Get("code").Int() != 1 {
		err.Errorf(gutils.ParamError, res.Get("info").String())
		return
	}
	result.List.SetObject(*(res.Get("data").Get("records")))
	return
}

//GetVodPlayUrlList 获取播放地址列表  41;//获取点播播放列表
func GetVodPlayUrlList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	videoid := param.Get("videoid").String()
		/*
	- FD（流畅）
	- LD（标清）
	- SD（高清）
	- HD（超清）
	- OD（原画）
	- 2K（2K）
	- 4K（4K）
	- SQ（普通音质）
	- HQ（高音质）
	- AUTO（自适应码率)  (多个逗号分隔)
	*/
	definition := param.Get("videoid").String()
	/*
	mp4
	m3u8
	mp3
	mpd (多个逗号分隔)
	*/
	formats := param.Get("formats").String()
	if videoid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}
	var param1 config.LJSON
	param1.Set("funcid").SetInt(41)
	param1.Set("videoid").SetString(videoid)
	param1.Set("definition").SetString(definition)
	param1.Set("formats").SetString(formats)
	
	res := gutils.FlybearCPlus(param1)
	if res.Get("code").Int() != 1 {
		err.Errorf(gutils.ParamError, res.Get("info").String())
		return
	}
	result.List.SetObject(*(res.Get("data").Get("records")))
	return
}

// GetVideoUploadInfo 刷新上传视频凭证
func GetVideoUploadInfo(param config.LJSON)(result gutils.LResultModel, err gutils.LError){
	//视频名
	title := param.Get("title").String()
	//文件名 带后缀
	filename := param.Get("filename").String()
	//文件大小 字节
	filesize := param.Get("filesize").String()
	if title == "" {
		err.Errorf(gutils.ParamError, "视频名不能为空")
		return
	}
	var param1 config.LJSON
	param1.Set("funcid").SetInt(42)
	param1.Set("title").SetString(title)
	param1.Set("filename").SetString(filename)
	param1.Set("filesize").SetString(filesize)
	
	res := gutils.FlybearCPlus(param1)
	if res.Get("code").Int() != 1 {
		err.Errorf(gutils.ParamError, res.Get("info").String())
		return
	}
	result.List.SetObject(*(res.Get("data")))
	return
}

// RefreshVideoUploadInfo 刷新上传视频凭证
func RefreshVideoUploadInfo(param config.LJSON)(result gutils.LResultModel, err gutils.LError){
	videoid := param.Get("videoid").String()
	if videoid == "" {
		err.Errorf(gutils.ParamError, "视频ID不能为空")
		return
	}
	var param1 config.LJSON
	param1.Set("funcid").SetInt(43)
	param1.Set("videoid").SetString(videoid)

	res := gutils.FlybearCPlus(param1)
	if res.Get("code").Int() != 1 {
		err.Errorf(gutils.ParamError, res.Get("info").String())
		return
	}
	result.List.SetObject(*(res.Get("data")))
	return
}


//ApplyList 申请列表
func ApplyList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ApplyList"

	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量
	o := orm.NewOrm()
	sql := ` select * from t_college_apply where 1=1 `

	status := param.Get("status").String()
	if status != "" {
		sql = fmt.Sprintf("%s and status=%s ", sql, status)
	}

	condition := param.Get("condition").String()
	if condition != "" {
		sql = fmt.Sprintf("%s and (anchorname like '%%%s%%' or phone like '%%%s%%') ", sql, condition, condition)
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

	sql = fmt.Sprintf("%s order by ApplyTime asc limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

//ModApply 修改状态
func ModApply(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ModApply"
	applyid := param.Get("applyid").String()
	status := param.Get("status").Int()
	if param.Get("remark").IsNULL() {
		err.Errorf(gutils.ParamError, "原因不能为空")
		return
	}
	remark := param.Get("remark").String()
	o := orm.NewOrm()
	var obj config.LJSON
	sql1 := ` select roomname,roompicture,anchorid,comment from db_flybear.t_college_apply where applyid=? `
	_, err.Msg = o.Raw(sql1, applyid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "申请记录不存在")
		return
	}

	RoomName := obj.Item(0).Get("roomname").String()
	RoomPicture := obj.Item(0).Get("roompicture").String()
	userid := obj.Item(0).Get("anchorid").String()
	Comment := obj.Item(0).Get("comment").String()

	sql := ` update db_flybear.t_college_apply set status=?,remark=? where applyid=? `
	_, err.Msg = o.Raw(sql, status, remark, applyid).Exec()
	if err.Msg != nil {
		return
	}

	if status == 1 {
		sql = ` update t_doctor set isanchor=1,
			updatetime=?,
			anchortime=?,
			RoomName=?,
			RoomPicture=?,
			AnchorIntroduction=? where doctorid=? `
		_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02 15:04:05"), time.Now().Format("2006-01-02 15:04:05"), RoomName, RoomPicture, Comment, userid).Exec()

	}

	return
}

//Taglist 分类列表
func Taglist(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "Taglist"

	o := orm.NewOrm()
	var obj config.LJSON
	sql1 := ` select * from db_flybear.t_college_tag order by tagid desc `
	_, err.Msg = o.Raw(sql1).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		item := obj.AddItem()
		item.Set("tagid").SetString("0")
		item.Set("tagname").SetString("其他")
	}
	result.List.SetObject(obj)
	return
}

//IsLive 获取直播间中是否有正在直播的课程
func IsLive(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "IsLive"

	var obj config.LJSON
	o := orm.NewOrm()
	sql := ` select sum(1) as num  from db_flybear.t_college_signle where anchorid=:anchorid and status=1 and datastatus =1 `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&obj)
	result.List.Set("num").SetInt(obj.Item(0).Get("num").Int())
	return
}

// status = 0 下架 status=1上架 status =-1 删除记录  status =2 置顶 status =3 取消置顶
func ModFreeCourse(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ModFreeCourse"
	status := param.Get("status").Int()
	signleid := param.Get("signleid").String()
	displayorder := param.Get("displayorder").Int()
	istop := param.Get("istop").Int()
	nowDate := time.Now().Format("2006-01-02 15:04:05")
	condition := param.Get("condition").String()
	state := param.Get("state").String()

	o := orm.NewOrm()
	sql := ""
	switch status {
	case 0:
		sql = ` update db_flybear.t_college_free set state=0 where signleid =? `
		_, err.Msg = o.Raw(sql,signleid).Exec()
		break
	case 1:
		sql = ` update db_flybear.t_college_free set state=1 where signleid =? `
		_, err.Msg = o.Raw(sql,signleid).Exec()
		break
	case -1:
		sql = ` delete from  db_flybear.t_college_free where signleid =? `
		_, err.Msg = o.Raw(sql, signleid).Exec()
		break
	case 2://置顶
		var obj config.LJSON
		sql = `select *from db_flybear.t_college_free order by istop desc limit 1`
		_, err.Msg = o.Raw(sql).ValuesJSON(&obj)
		isTop := obj.Item(0).Get("istop").Int()
		
		sql = ` update db_flybear.t_college_free set istop=?,updatetime=? where signleid =? `
		_, err.Msg = o.Raw(sql,isTop+1,nowDate,signleid).Exec()
		break
	case 3://取消置顶
		sql = ` update db_flybear.t_college_free set istop=0,updatetime=? where signleid =? `
		_, err.Msg = o.Raw(sql,nowDate,signleid).Exec()
		break
	case 4,5:// 4 下移 5 上移
	sql =  " select * from db_flybear.t_college_free f inner join db_flybear.t_college_signle s on f.signleid=s.signleid  where s.signleid <>? "
	if condition != "" {
		sql = fmt.Sprintf(" %s and (s.title like '%%%s%%' or d.roomname like '%%%s%%' )  ", sql, condition, condition)
	}
	if state != "" {
		sql = fmt.Sprintf(" %s and f.state=%s ", sql, state)
	}

	if status == 5 {
		if istop > 0 {
			ss := " f.istop>? order by f.istop asc limit 1"
			sql = fmt.Sprintf(" %s and %s ", sql,ss)
		}else{
			ss := " f.displayorder < ? and f.istop=0 order by f.displayorder desc limit 1"
			sql = fmt.Sprintf(" %s and %s ", sql,ss)
		}
	}else if status == 4 {
		if istop > 0 {
			ss := " f.istop<? and f.istop>0 order by f.istop desc limit 1 "
			sql = fmt.Sprintf(" %s and %s ", sql,ss)
		}else{
			ss := " f.displayorder > ? and f.istop=0 order by f.displayorder asc limit 1  "
			sql = fmt.Sprintf(" %s and %s ", sql,ss)
		}
	} else {
		err.Errorf(gutils.ParamError, "未指定操作")
		return
	}
	var obj config.LJSON
	if (status == 4 || status == 5) && istop > 0{
		_, err.Msg = o.Raw(sql,signleid,istop).ValuesJSON(&obj)
	}else{
		_, err.Msg = o.Raw(sql,signleid, displayorder).ValuesJSON(&obj)
	}

	if obj.ItemCount() == 0 {
		if status == 5 && istop > 0 {
			err.Errorf(gutils.ParamError, "已置顶")
		}
	    if status == 4 && istop == 0 {
			err.Errorf(gutils.ParamError, "已置底")
		}
		return
	}

	signleidnew := obj.Item(0).Get("signleid").String()
	sql = ` update db_flybear.t_college_free a,db_flybear.t_college_free b set a.DisplayOrder=b.DisplayOrder,b.DisplayOrder=a.DisplayOrder,a.istop=b.istop,b.istop=a.istop where 
			a.signleid=? and b.signleid=? `
	_, err.Msg = o.Raw(sql, signleid, signleidnew).Exec()
		break
	default:
		err.Errorf(gutils.ParamError, "状态值错误")
	}
	return
}

//AddFreeCourse 新增免费课程  一次添加多条记录
func AddFreeCourse(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AddFreeCourse"

	list := param.Get("list")

	num := list.ItemCount()
	o := orm.NewOrm()
	var obj config.LJSON
	sql := `select *from db_flybear.t_college_free order by displayorder desc limit 1`
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)
	displayorder := 0 
	if obj.ItemCount()>0 {
		displayorder = obj.Item(0).Get("displayorder").Int()
	}
	for i := 0; i < num; i++ {
		o := orm.NewOrm()
		timeUnix:=time.Now().Unix()  
		updatetime:=time.Unix(timeUnix,0).Format("2006-01-02 15:04:05")
		// updatetime := time.Now().Format("2006-01-02 15:04:05")
		signleid := list.Item(i).Get("signleid").String()
		sql := ` insert into t_college_free (signleid,state,istop,updatetime,displayorder) values (?,0,0,?,?) `
		_, err.Msg = o.Raw(sql,signleid,updatetime,displayorder+1+i).ValuesJSON(&result.List)
		if err.Msg != nil {
			return
		}
	}

	return
}

//FreeList
func FreeList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "FreeList"

	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	o := orm.NewOrm()
	sql := ` select  f.istop,f.state,s.signleid,s.banner,f.displayorder,
			 s.tag,s.title,s.type,s.status,ifnull(s.fee,0) as fee,
			 ifnull(s.orifee,0) as orifee,
			 d.roomname as anchorname,s.buynum,s.clicknum,
			 s.begintime,s.autoendtime,s.datastatus
		     from db_flybear.t_college_free f
			 inner join db_flybear.t_college_signle s on f.signleid=s.signleid 
			 inner join db_flybear.t_doctor d on d.doctorid = s.anchorid
			 where  1=1 `

	condition := param.Get("condition").String()
	if condition != "" {
		sql = fmt.Sprintf(" %s and (s.title like '%%%s%%' or d.roomname like '%%%s%%' )  ", sql, condition, condition)
	}

	state := param.Get("state").String()
	if state != "" {
		sql = fmt.Sprintf(" %s and f.state=%s ", sql, state)
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

	sql = fmt.Sprintf("%s order by f.istop desc,f.displayorder asc limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err

}

//DiscountList
func DiscountList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DiscountList"

	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	o := orm.NewOrm()
	sql := ` select  cd.istop,cd.state,cd.disfee,cd.disstarttime,cd.disendtime,cd.displayorder,
			 s.signleid,s.banner,s.tag,s.title,s.type,s.status,ifnull(s.fee,0) as fee,ifnull(s.orifee,0) as orifee,
			 d.roomname as anchorname,s.buynum,s.clicknum,
			 s.begintime,s.autoendtime,s.datastatus
		     from db_flybear.t_college_discount cd
			 inner join db_flybear.t_college_signle s on cd.signleid=s.signleid 
			 inner join db_flybear.t_doctor d on d.doctorid = s.anchorid
			 where  1=1 `

	condition := param.Get("condition").String()
	if condition != "" {
		sql = fmt.Sprintf(" %s and (s.title like '%%%s%%' or d.roomname like '%%%s%%' )  ", sql, condition, condition)
	}

	begintime := param.Get("begintime").String()
	if begintime != "" {
		sql = fmt.Sprintf(" %s and cd.disstarttime >= '%s' ", sql, begintime)
	}

	endtime := param.Get("endtime").String()
	if endtime != "" {
		sql = fmt.Sprintf(" %s and cd.disendtime < '%s' ", sql, endtime)
	}

	state := param.Get("state").String()
	if state != "" {
		sql = fmt.Sprintf(" %s and cd.state=%s ", sql, state)
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

	sql = fmt.Sprintf("%s order by cd.istop desc,cd.displayorder asc limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err

}

func PopUpSignle(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "PopUpSignle"

	//筛选单课程列表  1 免费  2 限时低价
	optype := param.Get("optype").String()

	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	sql := `  select s.signleid,s.banner,s.tag,s.title,s.type,s.status,ifnull(s.OriFee,0) as orifee,
				  ifnull(s.fee,0) as fee,d.roomname as anchorname,s.buynum,s.clicknum,
				  s.begintime,s.autoendtime,s.datastatus,ifnull(t.tagname,'其他') as tagname
				  from t_college_signle s inner join t_doctor d on d.doctorid = s.anchorid 
				  left join t_college_tag t on s.tag=t.tagid
				  where (s.datastatus = 1 or s.datastatus = -1)  `

	if optype == "2" { //限时低价

		o := orm.NewOrm()

		sql += `  and s.signleid not in (select signleid from t_college_discount ) `
		condition := param.Get("condition").String()
		if condition != "" {
			sql = fmt.Sprintf(" %s and (s.title like '%%%s%%' or d.roomname like '%%%s%%' )  ", sql, condition, condition)
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

		sql = fmt.Sprintf("%s order by s.begintime desc limit %d,%d", sql, perpage*(page-1), perpage)
		_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
		result.TotalCount = int64(totalcount) //总条数
		result.PageNo = int64(page)           //页码
		result.PageSize = int64(perpage)      //每页条数

	} else if optype == "1" { //免费
		o := orm.NewOrm()

		sql += `  and s.Fee = 0 and s.signleid not in (select signleid from t_college_free ) `
		condition := param.Get("condition").String()
		if condition != "" {
			sql = fmt.Sprintf(" %s and (s.title like '%%%s%%' or d.roomname like '%%%s%%' )  ", sql, condition, condition)
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

		sql = fmt.Sprintf("%s order by s.begintime desc limit %d,%d", sql, perpage*(page-1), perpage)
		_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
		result.TotalCount = int64(totalcount) //总条数
		result.PageNo = int64(page)           //页码
		result.PageSize = int64(perpage)      //每页条数

	} else if optype == "3" {
		coursetype := param.Get("coursetype").String()
		if coursetype == "0" { //查询单课程列表
			o := orm.NewOrm()
			condition := param.Get("condition").String()
			if condition != "" {
				sql = fmt.Sprintf(" %s and (s.title like '%%%s%%' or d.roomname like '%%%s%%' )  ", sql, condition, condition)
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

			sql = fmt.Sprintf("%s order by s.begintime desc limit %d,%d", sql, perpage*(page-1), perpage)
			_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
			result.TotalCount = int64(totalcount) //总条数
			result.PageNo = int64(page)           //页码
			result.PageSize = int64(perpage)      //每页条数
		} else if coursetype == "1" { //查询系列课列表
			o := orm.NewOrm()
			sql = `
				  select s.seriesid,s.title,s.banner,s.createtime,
				  ifnull(s.fee,0) as fee,d.roomname as anchorname,s.datastatus
				  from t_college_series s inner join t_doctor d on d.doctorid = s.anchorid 
				  where (s.datastatus > 0 or s.datastatus = -1)  `

			condition := param.Get("condition").String()
			if condition != "" {
				sql = fmt.Sprintf(" %s and (s.title like '%%%s%%' or d.roomname like '%%%s%%' )  ", sql, condition, condition)
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

			sql = fmt.Sprintf("%s order by s.createtime desc limit %d,%d", sql, perpage*(page-1), perpage)
			_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
			result.TotalCount = int64(totalcount) //总条数
			result.PageNo = int64(page)           //页码
			result.PageSize = int64(perpage)      //每页条数

		} else {
			err.Errorf(gutils.ParamError, "课程类型未指定")
			return
		}
	} else {
		err.Errorf(gutils.ParamError, "optype类型错误")
		return
	}
	return
}

//AddDiscount
func AddDiscount(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {

	err.Caption = "AddDiscount"
	// o := orm.NewOrm()

	// sql := ` insert into  db_flybear.t_college_discount 
	// 		(signleid,disstarttime,disendtime,disfee,state,isrefresh,istop)
	// 		 values 
	// 		 (:signleid,:disstarttime,:disendtime,:disfee,0,0,0)  `
	// _, err.Msg = o.RawJSON(sql, param).Exec()

	var obj config.LJSON
	o := orm.NewOrm()
	list := param.Get("list")
	num := list.ItemCount()
	sql := `select *from db_flybear.t_college_discount order by displayorder desc limit 1`
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)
	displayorder := 0 
	if obj.ItemCount()>0 {
		displayorder = obj.Item(0).Get("displayorder").Int()
	}
	for i := 0; i < num; i++ {
		o := orm.NewOrm()
		signleid := list.Item(i).Get("signleid").String()
		sql := ` insert into db_flybear.t_college_discount (signleid,state,isrefresh,istop,displayorder) values (?,0,0,0,?) `
		_, err.Msg = o.Raw(sql,signleid,displayorder+1+i).Exec()
		if err.Msg != nil {
			return
		}
	}

	return
}

//ModDiscount
func ModDiscount(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ModDiscount"
	signleid := param.Get("signleid").String()
	if signleid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}
	o := orm.NewOrm()
	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	sql := ` update db_flybear.t_college_discount 
			 set updatetime=:updatetime,disstarttime=:disstarttime,disendtime=:disendtime,disfee=:disfee,isrefresh=0
			 where signleid =:signleid `
	_, err.Msg = o.RawJSON(sql, param).Exec()
	return
}

//ModDisState operation =1 置顶  operation=2取消置顶 operation =3删除
func ModDisState(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ModDisState"
	signleid := param.Get("signleid").String()
	displayorder := param.Get("displayorder").Int()
	istop := param.Get("istop").Int()
	updatetime := time.Now().Format("2006-01-02 15:04:05")

	condition := param.Get("condition").String()
	begintime := param.Get("begintime").String()
	endtime := param.Get("endtime").String()
	state := param.Get("state").String()
	operation := param.Get("operation").Int()
	if signleid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}
	o := orm.NewOrm()
	param.Set("updatetime").SetString(updatetime)

	sql := ""
	switch operation {
	case 1:
		var obj config.LJSON
		sql = " select *from db_flybear.t_college_discount order by istop desc limit 1 "
		_, err.Msg = o.Raw(sql).ValuesJSON(&obj)
		isTop := obj.Item(0).Get("istop").Int()

		sql = ` update db_flybear.t_college_discount set istop=?,updatetime=? where signleid =? `
		_, err.Msg = o.Raw(sql, isTop+1,updatetime,signleid).Exec()
	case 2:
		sql = ` update db_flybear.t_college_discount set istop=0,updatetime=? where signleid =? `
		_, err.Msg = o.Raw(sql,updatetime,signleid).Exec()
	case 3:
		sql = ` delete from db_flybear.t_college_discount where signleid =? `
		_, err.Msg = o.Raw(sql,signleid).Exec()
	case 4,5:

	sql = " select * from db_flybear.t_college_discount cd inner join db_flybear.t_college_signle s on cd.signleid=s.signleid where cd.signleid <>? "

	if condition != "" {
		sql = fmt.Sprintf(" %s and (s.title like '%%%s%%' or d.roomname like '%%%s%%' )  ", sql, condition, condition)
	}
	if begintime != "" {
		sql = fmt.Sprintf(" %s and cd.disstarttime >= '%s' ", sql, begintime)
	}

	if endtime != "" {
		sql = fmt.Sprintf(" %s and cd.disendtime < '%s' ", sql, endtime)
	}

	if state != "" {
		sql = fmt.Sprintf(" %s and cd.state=%s ", sql, state)
	}

	if operation == 5 {//上移
		if istop > 0 {
			ss := " cd.istop > ? and cd.istop>0 order by cd.istop asc limit 1 "
			sql = fmt.Sprintf(" %s and %s ", sql, ss)
		}else {
			ss := " cd.displayorder < ? and cd.istop=0 order by cd.displayorder desc limit 1 "
			sql = fmt.Sprintf(" %s and %s ", sql, ss)
		}
	}else if operation == 4 {//下移
			if istop > 0 {
				ss := " cd.istop<? and cd.istop>0 order by cd.istop desc limit 1 "
				sql = fmt.Sprintf(" %s and %s ", sql, ss)
			}else {
				ss := " cd.displayorder > ? and cd.istop=0 order by cd.displayorder asc limit 1 "
				sql = fmt.Sprintf(" %s and %s ", sql, ss)
			}
		} else {
			err.Errorf(gutils.ParamError, "未指定操作")
			return
		}
		var obj config.LJSON
		if (operation == 4 || operation == 5)&&istop>0{
			_, err.Msg = o.Raw(sql,signleid,istop).ValuesJSON(&obj)
		}else{
			_, err.Msg = o.Raw(sql,signleid,displayorder).ValuesJSON(&obj)
		}
		
		if obj.ItemCount() == 0 {
			if operation == 5 && istop>0 {
				err.Errorf(gutils.ParamError, "已置顶")
			} 
			if operation == 4 && istop==0 {
				err.Errorf(gutils.ParamError, "已置底")
			}
			return
		}
		signleidnew := obj.Item(0).Get("signleid").String()
		sql = ` update db_flybear.t_college_discount a,db_flybear.t_college_discount b set a.DisplayOrder=b.DisplayOrder,b.DisplayOrder=a.DisplayOrder,a.istop=b.istop,b.istop=a.istop where 
				a.signleid=? and b.signleid=? `
		_, err.Msg = o.Raw(sql, signleid, signleidnew).Exec()
	default:
		err.Errorf(gutils.ParamError, "状态值错误")
		return
	}
	return
}

//AddStar 新增明星主播
func AddStar(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AddStar"

	list := param.Get("list")

	num := list.ItemCount()
	for i := 0; i < num; i++ {
		o := orm.NewOrm()
		sql := ` insert into t_college_star (anchorid,issuper) values (:anchorid,0) `
		_, err.Msg = o.RawJSON(sql, *list.Item(i)).Exec()
		if err.Msg != nil {
			return
		}
	}
	return
}
func StarList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "StarList"
	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量
	sql := ` select s.*,d.roompicture,d.roomname,d.isanchor,u.mobile,d.name
			 from t_college_star s inner join t_doctor d on s.anchorid=d.doctorid 
			 inner join t_user u on u.userid=d.doctorid
			 where 1=1	`

	o := orm.NewOrm()
	condition := param.Get("condition").String()
	if condition != "" {
		sql = fmt.Sprintf(" %s and d.roomname like '%%%s%%' ", sql, condition)
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

	sql = fmt.Sprintf("%s order by s.starid desc limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return
}

//state = 0下架 1上架   2  移除
func StarHandle(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "StarHandle"

	sql := ""
	o := orm.NewOrm()
	state := param.Get("state").String()
	if state == "0" {
		sql = " update db_flybear.t_college_star set issuper=0 where starid=:starid "
	} else if state == "1" {
		sql = " update db_flybear.t_college_star set issuper=1 where starid=:starid "
	} else if state == "2" {
		sql = " delete from  db_flybear.t_college_star where starid=:starid "
	} else {
		err.Errorf(gutils.ParamError, "状态值错误")
		return
	}
	_, err.Msg = o.RawJSON(sql, param).Exec()
	return
}

// state = "up" or "down"
func StarMove(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "StarMove"

	starid := param.Get("starid").String()
	if starid == "" {
		err.Errorf(gutils.ParamError, "主键ID不能为空")
		return
	}
	o := orm.NewOrm()
	sql := ""
	newStarID := ""
	state := param.Get("state").String()
	var obj config.LJSON
	if state == "up" {
		sql = ` select starid from t_college_star where starid > ? order by starid asc limit 0,1 `
		_, err.Msg = o.Raw(sql, starid).ValuesJSON(&obj)
		if obj.ItemCount() == 0 {
			err.Errorf(gutils.ParamError, "已移动到顶端")
			return
		}

		newStarID = obj.Item(0).Get("starid").String()

	} else if state == "down" {
		sql = ` select starid from t_college_star where starid < ? order by starid desc limit 0,1 `
		_, err.Msg = o.Raw(sql, starid).ValuesJSON(&obj)
		if obj.ItemCount() == 0 {
			err.Errorf(gutils.ParamError, "已移动到底部")
			return
		}

		newStarID = obj.Item(0).Get("starid").String()

	} else {
		err.Errorf(gutils.ParamError, "未指定移动状态")
		return
	}

	sql = ` update t_college_star a,t_college_star b set a.starid=b.starid,b.starid=a.starid where
				a.starid=? and b.starid=?  `
	_, err.Msg = o.Raw(sql, newStarID, starid).Exec()
	return
}

func GreatList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GreatList"
	o := orm.NewOrm()
	sql := ` select * from (SELECT g.*,s.title,d.roomname,s.datastatus as coursestate
							FROM t_college_great g
							INNER JOIN t_college_signle s ON g.courseid=s.SignleID
							INNER JOIN t_doctor d ON s.AnchorID=d.DoctorID
							WHERE g.coursetype=0 
							UNION ALL
							SELECT g.*,s.title,d.roomname,s.datastatus as coursestate
							FROM t_college_great g
							INNER JOIN t_college_series s ON g.courseid=s.seriesid
							INNER JOIN t_doctor d ON s.AnchorID=d.DoctorID
							WHERE g.coursetype=1) a 
			order by a.greatid asc `
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	return
}

func GreatMod(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GreatMod"

	state := param.Get("state").String()
	if state == "0" { //下架
		o := orm.NewOrm()
		sql := ` update t_college_great set datastatus=0  `
		_, err.Msg = o.Raw(sql).Exec()
	} else if state == "1" {

		if !param.Get("list").IsNULL() {
			count := param.Get("list").ItemCount()
			o := orm.NewOrm()
			for i := 0; i < count; i++ {

				sql := ` replace into t_college_great (greatid,showbanner,coursetype,courseid,datastatus) 
				 values 
				 (:greatid,:showbanner,:coursetype,:courseid,1) `
				_, err.Msg = o.RawJSON(sql, *param.Get("list").Item(i)).Exec()
			}
		}
	}
	return
}

//StatMain 统计首页数据
func StatMain(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "StatMain"

	begintime := param.Get("begintime").String()
	endtime := param.Get("endtime").String()
	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量
	searchall := param.Get("searchall").String()
	o := orm.NewOrm()                        //count 人次 num 人数 ，时间 visitdate ,来源source
	sql := ` SELECT sum(CASE source WHEN 1 THEN count ELSE 0 END) AS wechatcount,sum(CASE source WHEN 1 THEN num ELSE 0 END) AS wechatnum,sum(CASE source WHEN 0 THEN count ELSE 0 END) AS appcount,sum(CASE source WHEN 0 THEN num ELSE 0 END) AS appnum,SUM(a.num) AS totalnum,SUM(a.count) AS totalcount,visitdate FROM (
		SELECT SUM(num) AS num,SUM(1) AS COUNT,visitdate,source FROM t_college_stat_main  `

	//_, err.Msg = o.Raw(sql, begintime, endtime).ValuesJSON(&result.list)
	if(begintime == `` || endtime == ``){
	sql = sql + `GROUP BY visitdate,source) a GROUP BY a.visitdate`
	}else{
	sql = sql + `WHERE visitdate BETWEEN ? AND ? GROUP BY visitdate,source) a GROUP BY a.visitdate`
	}
	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}

	if totalcount <= 0 {
		if(begintime == `` || endtime == ``){
			_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
		}else{
			_, err.Msg = o.Raw(sql, begintime, endtime).ValuesJSON(&result.List)
		}
	
		totalcount = int64(result.List.ItemCount())
	}

	if param.Get("searchall").IsNULL() == false && searchall == "1" {
		sql = fmt.Sprintf("%s order by a.visitdate", sql)
	}else {
		sql = fmt.Sprintf("%s order by a.visitdate desc limit %d,%d", sql, perpage*(page-1), perpage)
	}

	
	if(begintime == `` || endtime == ``){
		_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	}else{
		_, err.Msg = o.Raw(sql, begintime, endtime).ValuesJSON(&result.List)
	}
	
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return
}

//StatRoom 统计直播间数据
func StatRoom(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "StatRoom"

	signleid := param.Get("signleid").String()
	if signleid == "" {
		err.Errorf(gutils.ParamError, "单课程ID不能为空")
		return
	}
	begintime := param.Get("begintime").String()
	endtime := param.Get("endtime").String()
	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	o := orm.NewOrm()
	sql := ` SELECT sum(CASE state WHEN 1 THEN count ELSE 0 END) AS onlinecount,sum(CASE state WHEN 1 THEN num ELSE 0 END) AS onlinenum,sum(CASE state WHEN 0 THEN count WHEN 2 THEN count ELSE 0 END) AS offlinecount,sum(CASE state WHEN 0 THEN num WHEN 2 THEN num ELSE 0 END) AS offlinenum,SUM(a.num) AS totalnum,SUM(a.count) AS totalcount,visitdate FROM (
		SELECT SUM(num) AS COUNT,SUM(1) AS num,visitdate,state FROM t_college_stat_room
			`
	if(begintime == `` || endtime == ``){
		sql = sql + `WHERE SignleID=? GROUP BY visitdate,state) a GROUP BY a.visitdate`
		}else{
		sql = sql + `WHERE SignleID=? visitdate BETWEEN ? AND ? GROUP BY visitdate,state) a GROUP BY a.visitdate`
		}
		//目的是避免每次翻页重复读取总数量
		var totalcount int64
		totalcount = -1
		if param.Get("totalcount").IsNULL() == false {
			totalcount = param.Get("totalcount").Int64()
		}
	
		if totalcount <= 0 {
			if(begintime == `` || endtime == ``){
				_, err.Msg = o.Raw(sql,signleid).ValuesJSON(&result.List)
			}else{
				_, err.Msg = o.Raw(sql,signleid, begintime, endtime).ValuesJSON(&result.List)
			}
		
			totalcount = int64(result.List.ItemCount())
		}


	// sql = fmt.Sprintf("%s order by a.visitdate desc limit %d,%d", sql, perpage*(page-1), perpage)
	// _, err.Msg = o.Raw(sql, begintime, endtime, signleid).ValuesJSON(&result.List)
	sql = fmt.Sprintf("%s order by a.visitdate desc limit %d,%d", sql, perpage*(page-1), perpage)
	if(begintime == `` || endtime == ``){
		_, err.Msg = o.Raw(sql,signleid).ValuesJSON(&result.List)
	}else{
		_, err.Msg = o.Raw(sql,signleid, begintime, endtime).ValuesJSON(&result.List)
	}
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return
}

//查询用户列表
func SearchUsers(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SearchUsers"

	mobile := param.Get("mobile").String()
	if mobile == "" {
		err.Errorf(gutils.ParamError, "手机号不能为空")
		return
	}

	o := orm.NewOrm()

	var obj config.LJSON
	sql := ` select * from t_college_consultant where consultid = (select u.userid
		from t_user u inner join t_doctor d on 
		u.userid=d.doctorid where u.mobile=?) `
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&obj)

	if obj.ItemCount() > 0 {
		err.Errorf(gutils.ParamError, "该客服已存在")
		return
	}

	sql = ` select d.name,u.userid,d.picture,u.mobile,d.isanchor 
			from t_user u inner join t_doctor d on 
			u.userid=d.doctorid where u.mobile=? and u.roleid=3 and not exists (select * from t_college_consultant where consultid = u.userid )`
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&result.List)

	return result, err
}

func AddOrDelConsultant(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AddOrDelConsultant"
	// 0 新增 1 删除
	optype := param.Get("optype").String()
	o := orm.NewOrm()
	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	
	sql := ""
	if optype == "0" {
		sql = ` delete from t_college_consultant where consultid=:consultid `
		_, err.Msg = o.RawJSON(sql, param).Exec()
		sql = ` delete from t_college_consultant_extra where consultid=:consultid `
		_, err.Msg = o.RawJSON(sql, param).Exec()
		sql = ` insert into t_college_consultant (consultid,username,mobile,datastatus,updatetime) values (:consultid,:username,:mobile,1,:updatetime) `
		_, err.Msg = o.RawJSON(sql, param).Exec()
	}else {
		sql = ` delete from t_college_consultant where consultid=:consultid `
		_, err.Msg = o.RawJSON(sql, param).Exec()
		sql = " update t_college_consultant_extra set datastatus=0 where consultid=:consultid "
		_, err.Msg = o.RawJSON(sql, param).Exec()
	}
	return
}


//客服列表
func GetConsultantList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetConsultantList"

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

	sql := `SELECT c.consultid,c.username,c.mobile,c.datastatus,c.updatetime,(select count(*) from t_college_consultant_extra cx where cx.consultid = c.consultid) as coursenum from  t_college_consultant c WHERE 1=1  `
			

	if condition != "" {
		sql = fmt.Sprintf("%s and c.mobile like '%%%s%%' ", sql, condition)
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

	sql = fmt.Sprintf("%s limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

//所有没有咨询人的单课程
func SearchConsultSignle(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SearchConsultSignle"

	condition := param.Get("condition").String() //手机号
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量

	o := orm.NewOrm()
	sql := ` select s.*,ifnull(s.orifee,0) as orifee,
		ifnull(s.fee,0) as fee,d.roomname as anchorname 
	 from t_college_signle s inner join t_doctor d on d.doctorid = s.anchorid where (s.datastatus > 0 or s.datastatus = -1) and s.signleid not in (select courseid from t_college_consultant_extra ccx where ccx.courseid = s.signleid ) `

	if condition != "" {
		sql = fmt.Sprintf("%s and (s.title like '%%%s%%' or d.roomname like '%%%s%%')", sql, condition, condition)
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
	if page == 0 {
		sql = fmt.Sprintf("%s order by s.begintime", sql)
	} else {
		sql = fmt.Sprintf("%s order by s.begintime desc  limit %d,%d", sql, perpage*(page-1), perpage)
	}

	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

//所有没有咨询人的系列课程
func SearchConsultSeries(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SearchConsultSeries"
	condition := param.Get("condition").String() //手机号
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量
	o := orm.NewOrm()
	sql := ` select s.*,ifnull(discount,0) as discount,d.roomname as anchorname,ifnull(fee,0) as fee,clicknum,buynum,s.datastatus,s.applystatus,s.alterdata
			 from t_college_series s inner join t_doctor d on d.doctorid=s.anchorid where s.datastatus > 0 and s.seriesid not in (select courseid from t_college_consultant_extra ccx where ccx.courseid = s.seriesid ) `


	if condition != "" {
		sql = fmt.Sprintf("%s and (s.title like '%%%s%%' or d.roomname like '%%%s%%')", sql, condition, condition)
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
	if page == 0 {
		sql = fmt.Sprintf("%s order by s.createtime", sql)
	} else {
		sql = fmt.Sprintf("%s order by s.createtime desc  limit %d,%d", sql, perpage*(page-1), perpage)
	}

	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

//新增or删除指定咨询的课程
func AddOrDelConsultCourse(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AddOrDelConsultCourse"
	// 0 新增 1 删除
	optype := param.Get("optype").String()
	o := orm.NewOrm()
	updatetime := time.Now().Format("2006-01-02 15:04:05")
	consultid := param.Get("consultid").String()
	param.Set("updatetime").SetString(updatetime)
	
	sql := ""
	if optype == "0" {
		count := param.Get("signlelist").ItemCount()
		count2 := param.Get("serieslist").ItemCount()
		
		if count > 0 {
			for i := 0; i < count; i++ {
				course:= param.Get("signlelist").Item(i)
				course.Set("updatetime").SetString(updatetime)
				course.Set("consultid").SetString(consultid)
				sql = ` insert into t_college_consultant_extra (courseid,coursetype,consultid,anchorid,datastatus,updatetime) 
						values (:courseid,:coursetype,:consultid,:anchorid,1,:updatetime) `
				_, err.Msg = o.RawJSON(sql, *course).Exec()
			}
		}
		if count2 > 0 {
			for i := 0; i < count2; i++ {
				course:= param.Get("serieslist").Item(i)
				course.Set("updatetime").SetString(updatetime)
				course.Set("consultid").SetString(consultid)
				sql = ` insert into t_college_consultant_extra (courseid,coursetype,consultid,anchorid,datastatus,updatetime) 
				values (:courseid,1,:consultid,:anchorid,1,:updatetime) `
				_, err.Msg = o.RawJSON(sql, *course).Exec()
			}
	
		}
	}else {
		courseid := param.Get("courseid").String()
		if courseid == "" {
			err.Errorf(gutils.ParamError, "课程id不能为空")
			return
		}
		if consultid == "" {
			err.Errorf(gutils.ParamError, "咨询人id不能为空")
			return
		}
		 sql = ` delete from t_college_consultant_extra where consultid=:consultid and courseid=:courseid `
		 _, err.Msg = o.RawJSON(sql, param).Exec()
	}
	
	return
}


//客服列表
func GetConsultCourseList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetConsultCourseList"

	condition := param.Get("condition").String() //手机号
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量
	consultid := param.Get("consultid").String()

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()

	sql := ` SELECT cx.*,IFNULL(sig.Title,ses.Title) as coursename,d.RoomName AS anchorname FROM t_college_consultant_extra cx LEFT JOIN t_college_signle sig ON sig.signleid=cx.courseid LEFT JOIN t_college_series ses ON ses.SeriesID=cx.courseid INNER JOIN t_doctor d ON d.doctorid=cx.anchorid WHERE 1=1 `
			
	if consultid != "" {
		sql = fmt.Sprintf("%s and cx.consultid = %s ", sql, consultid)
	}
	if condition != "" {
		sql = fmt.Sprintf("%s and IFNULL(sig.Title,ses.Title) like '%%%s%%' ", sql, condition)
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

	sql = fmt.Sprintf("%s limit %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}