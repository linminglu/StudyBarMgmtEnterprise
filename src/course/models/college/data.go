package college

import (
	"course/gutils"
	"course/gutils/conf"
	"course/models/protocols"

	"crypto/hmac"
	"crypto/sha1"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"regexp"
	//"course/gutils/gredis"
	"hash"
	"io"
	"strconv"
	"strings"
	"time"

	"github.com/astaxie/beego/config"
	//	"github.com/astaxie/beego/logs"

	"github.com/astaxie/beego/orm"
)

type LCollege struct {
	protocols.Protocol
}

//Login 用户登录
func (t *LCollege) Login(params *config.LJSON) (result config.LJSON, err gutils.LError) {

	username := params.Get("username").String()
	passwd := params.Get("password").String()
	code := params.Get("code").String()

	flag := params.Get("flag").Int()
	
	o := orm.NewOrm()

	var obj config.LJSON
	sql := ` select d.isanchor,u.userid,u.password,d.picture,d.name as docname,
			 d.roomname,d.roompicture,d.anchorintroduction as anchorintro,
			 u.userid as anchorid,u.mobile,d.openid as bingwechat,d.incomefee as totalfee,
			 d.surplusfee as money,ifnull(t.rate,0) as platformrate 
			 from db_flybear.t_user u inner join 
			 db_flybear.t_doctor d on u.userid=d.doctorid
			 left join db_flybear.t_college_employrate t on t.employrateid=d.EmployRateID
			 where u.mobile=? `
	_, err.Msg = o.Raw(sql, username).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		panic("用户不存在")
	}

	if flag == 0 { //密码登陆
		dbPw := obj.Item(0).Get("password").String()
		if passwd != dbPw {
			panic("密码错误")
		}
	} else if flag == 1 { //验证码登录

		if code == "" {
			err.Errorf(gutils.DBError, "验证码不能为空")
			return
		}

		sql := "SELECT Code,Updatetime,mobile FROM t_sys_code WHERE UserID=? AND FuncID=? AND Code=?"
		var obj config.LJSON
		num, _ := o.Raw(sql, username, gutils.FUNC_ID_COURSE_LOGIN, code).ValuesJSON(&obj)
		if num <= 0 {
			err.Errorf(gutils.DBError, "验证码错误")
			return
		}
		sendtime := obj.Item(0).Get("Updatetime").Time().Unix()
		now := time.Now().Unix() - 3600
		if now > sendtime {
			err.Errorf(gutils.DBError, "验证码过期")
			return
		}
	} else {
		panic("标记错误")
	}

	isanchor := obj.Item(0).Get("isanchor").Int64()
	userid := obj.Item(0).Get("userid").String()
	picture := obj.Item(0).Get("picture").String()
	docname := obj.Item(0).Get("docname").String()
	session := gutils.CreateSTRGUID()

	result.Set("userid").SetString(userid)
	result.Set("picture").SetString(picture)
	result.Set("docname").SetString(docname)
	result.Set("session").SetString(session)
	result.Set("isanchor").SetInt64(isanchor)

	var list config.LJSON
	sql = ` select d.roomname,d.roompicture,d.anchorintroduction as anchorintro,
			u.userid as anchorid,u.mobile,d.openid as bingwechat,d.incomefee as totalfee,
			d.surplusfee as money,ifnull(t.rate,0) as platformrate 
			from db_flybear.t_college_room r inner join db_flybear.t_user u on 
			r.userid=u.userid 
			inner join db_flybear.t_doctor d on d.doctorid=u.userid
			left join db_flybear.t_college_employrate t on t.employrateid=d.EmployRateID
	 		where r.belongid=? and d.isanchor=1`
	_, err.Msg = o.Raw(sql, userid).ValuesJSON(&list)
	if list.ItemCount() == 0 && isanchor == 0 { //没有直播间
		return
	}

	liverooms := result.Set("liverooms")

	if list.ItemCount() != 0 {
		liverooms.SetObject(list)
	}

	if isanchor == 1 {
		item := liverooms.AddItem()
		item.SetObject(*obj.Item(0))
	}

	if list.ItemCount() == 0 && isanchor != 1 {
		panic("该账号已停用或删除")
	}

	return
}

//SendCode 发送验证码
func (t *LCollege) SendCode(params *config.LJSON) (result config.LJSON, err gutils.LError) {

	mobile := params.Get("mobile").String() //手机号
	res := false
	res, err.Msg = regexp.Match("^((1[3|4|5|6|7|8|9][0-9]{9})|(15[89][0-9]{8}))$", []byte(mobile))
	if err.Msg != nil {
		return
	}

	if res == false {
		err.Errorf(gutils.DBError, "手机号无效")
		return
	}

	o := orm.NewOrm()

	sql := ` select userid from db_flybear.t_user where mobile=? `
	var obj config.LJSON
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.DBError, "账号不存在")
		return
	}

	//发送验证码
	var data config.LJSON
	data.Set("funcid").SetInt(20100)
	data.Set("mobile").SetString(mobile)
	data.Set("funcidverify").SetInt(gutils.FUNC_ID_COURSE_LOGIN) //随便用个
	api := gutils.FlybearCPlus(data)
	code := api.Get("code").Int()
	if code == 0 {
		err.Errorf(gutils.DBError, "验证码发送失败")
		return
	}

	return result, err
}

//LogOut 登出
func (t *LCollege) LogOut(params *config.LJSON) (result config.LJSON, err gutils.LError) {
	//userid := params.Get("userid").String()
	t.CheckSession(params)
	return
}

func (t *LCollege) SignleList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	anchorid := param.Get("anchorid").String()
	if anchorid == "" {
		err.Errorf(gutils.DBError, "主播ID不能为空")
		return
	}
	condition := param.Get("condition").String() //条件
	tag := param.Get("tag").String() //分类
	page := param.Get("page").Int64()            //页码
	pagesize := param.Get("pagesize").Int64()    //每页数量
	if page == 0 {
		page = 1
	}
	if pagesize == 0 {
		pagesize = 10
	}

	// -1 隐藏 0 已删除 1 已上架 2 已下架
	datastatus := param.Get("datastatus").String()

	o := orm.NewOrm()
	sql := ` select s.signleid,s.banner,s.tag,s.title,s.type,s.alterdata,s.applystatus,s.status,ifnull(s.fee,0) as fee,
			 d.name as anchorname ,s.buynum,s.clicknum,s.begintime,s.autoendtime,s.datastatus
	 		 from t_college_signle s 
			 inner join t_doctor d on d.doctorid = s.anchorid 
			 where s.AnchorID=? `
	//搜索条件
	if condition != "" {
		sql = fmt.Sprintf("%s and s.title like '%%%s%%' ", sql, condition)
	}

	if  tag!= "" {
		sql = fmt.Sprintf("%s and s.tag = %s ", sql, tag)
	}

	//
	if datastatus != "" {
		sql = fmt.Sprintf("%s and s.datastatus= %s ", sql, datastatus)
	}else{
		sql = fmt.Sprintf("%s and s.datastatus <> 0 ",sql)
	}

	//开播时间
	starttime := param.Get("starttime").String()
	endtime := param.Get("endtime").String()
	if starttime != "" {
		sql = fmt.Sprintf("%s and s.begintime > '%s' ", sql, starttime)
	}

	if endtime != "" {
		sql = fmt.Sprintf("%s and s.begintime < '%s' ", sql, endtime)
	}

	var obj config.LJSON
	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}

	sql = fmt.Sprintf("%s order by s.begintime desc  limit %d,%d", sql, pagesize*(page-1), pagesize)

	_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)

	result.Set("totalcount").SetInt64(totalcount)
	result.Set("page").SetInt64(page)
	result.Set("pagesize").SetInt64(pagesize)
	result.Set("records").SetObject(obj)
	return result, err
}

func (t *LCollege) SeriesList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	anchorid := param.Get("anchorid").String()
	if anchorid == "" {
		err.Errorf(gutils.ParamError, "主播ID不能为空")
		return
	}
	condition := param.Get("condition").String() //条件
	page := param.Get("page").Int64()            //页码
	pagesize := param.Get("pagesize").Int64()    //每页数量

	datastatus := param.Get("datastatus").String()

	if page == 0 {
		page = 1
	}
	if pagesize == 0 {
		pagesize = 10
	}

	o := orm.NewOrm()
	sql := ` select seriesid,title,banner,anchorid,fee,alterdata,applystatus,
			ifnull(discount,0) as discount,
			d.name as anchorname,ifnull(fee,0) as fee,clicknum,buynum,s.datastatus
			from t_college_series s inner join t_doctor d on d.doctorid=s.anchorid 
			where s.AnchorID=? `

	if condition != "" {
		sql = fmt.Sprintf("%s and (s.title like '%%%s%%' or d.name like '%%%s%%')", sql, condition, condition)
	}

	if datastatus != "" {
		sql = fmt.Sprintf("%s and s.datastatus = %s ", sql, datastatus)
	}else{
		sql = fmt.Sprintf("%s and s.datastatus <> 0 ",sql)
	}
	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	var obj config.LJSON
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}

	sql = fmt.Sprintf("%s order by s.createtime desc  limit %d,%d", sql, pagesize*(page-1), pagesize)
	_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)

	result.Set("totalcount").SetInt64(totalcount)
	result.Set("page").SetInt64(page)
	result.Set("pagesize").SetInt64(pagesize)
	result.Set("records").SetObject(obj)
	return result, err
}

func (t *LCollege) SignleDetail(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "SignleDetail"
	signleid := param.Get("signleid").String()
	if signleid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}

	o := orm.NewOrm()

	var obj config.LJSON

	sql := ` select alterdata,applystatus,tag,title,banner,banner1,type,comment,fee,begintime,signleid,ifnull(autoendtime,'') as autoendtime 
			from t_college_signle where signleid=? `
	_, err.Msg = o.Raw(sql, signleid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "课程不存在")
		return
	}
	result.SetObject(*obj.Item(0))
	sql = ` select * from t_college_signle_ppt where signleid=? and datastatus=1  order by displayorder asc `
	_, err.Msg = o.Raw(sql, signleid).ValuesJSON(&obj)
	result.Set("ppt").SetObject(obj)

	sql = ` select * from t_college_detail where courseid=? and datastatus=1  order by displayorder asc `
	_, err.Msg = o.Raw(sql, signleid).ValuesJSON(&obj)
	result.Set("detail").SetObject(obj)

	return result, err
}

func (t *LCollege) AddOrModSignle(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "AddAnchorSignle"
	o := orm.NewOrm()
	
	signleid := param.Get("signleid").String()
	// alterData := params.Get("alterdata").string()
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("updatetime").SetString(Updatetime)
	sql := ""
	isAdd := false 
	if signleid == "" { //新增
		isAdd = true
		signleid = gutils.CreateSTRGUID()
		param.Set("signleid").SetString(signleid)
		sql = ` insert into t_college_signle (signleid,title,banner,banner1,type,anchorid,comment,fee,clicknum,buynum,begintime,autoendtime,status,datastatus,applystatus,updatetime,tag)
		values (:signleid,:title,:banner,:banner1,:type,:anchorid,:comment,:fee,0,0,:begintime,:autoendtime,0,-3,1,:updatetime,:tag)`
	} else { //修改
		isAdd = false
		// sql = " update t_college_signle set tag=:tag,title=:title,banner=:banner,banner1=:banner1,comment=:comment,fee=:fee,begintime=:begintime,autoendtime=:autoendtime,updatetime=:updatetime where signleid=:signleid "
		sql =" update t_college_signle set alterdata=:alterdata,applystatus=0 where signleid=:signleid "
	}
	_, err.Msg = o.RawJSON(sql, *param).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	if isAdd == false {
		return
	}
	signleType := param.Get("type").Int64()

	if signleType != 2 {
		//删除所有的记录
		sql = ` delete from t_college_signle_ppt where signleid=? `
		_, err.Msg = o.Raw(sql, signleid).Exec()
		if err.Msg != nil {
			o.Rollback()
			return
		}
		pptNum := param.Get("ppt").ItemCount()
		for i := 0; i < pptNum; i++ {
			sql = "insert into t_college_signle_ppt(pptid,signleid,url,displayorder,datastatus,updatetime) values ('" + gutils.CreateSTRGUID() + "','" + signleid + "',:url," + strconv.Itoa(i) + ",1,'" + Updatetime + "')  "
			_, err.Msg = o.RawJSON(sql, *param.Get("ppt").Item(i)).Exec()
		}
		if err.Msg != nil {
			o.Rollback()
			return
		}
	}

	//删除所有的记录
	sql = ` delete from t_college_detail where courseid=? `
	_, err.Msg = o.Raw(sql, signleid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	detailNum := param.Get("detail").ItemCount()
	for i := 0; i < detailNum; i++ {
		sql = "insert into t_college_detail(DetailID,courseid,url,displayorder,datastatus,updatetime) values ('" + gutils.CreateSTRGUID() + "','" + signleid + "',:url," + strconv.Itoa(i) + ",1,'" + Updatetime + "')  "
		_, err.Msg = o.RawJSON(sql, *param.Get("detail").Item(i)).Exec()
	}
	if err.Msg != nil {
		o.Rollback()
		return
	}

	return result, err
}

func (t *LCollege) SeriesInfo(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "SeriesInfo"
	seriesid := param.Get("seriesid").String()
	o := orm.NewOrm()
	sql := ` select alterdata,applystatus,seriesid,title,comment,banner,banner1,anchorid,fee,ifnull(discount,0) as discount,
	ifnull(fee,0) as fee,clicknum,buynum,s.datastatus
	from t_college_series s where s.seriesid=? `
	var obj config.LJSON
	_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&obj)

	if obj.ItemCount() > 0 {
		var json config.LJSON
		//查询系列课原价
		sql = ` select sum(ifnull(l.Fee,0)) as totalfee from db_flybear.t_college_series_child c  
			left join db_flybear.t_college_signle l on c.SignleID=l.SignleID 
			where c.seriesid=? `
		_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&json)
		obj.Item(0).Set("totalfee").SetString(json.Item(0).Get("totalfee").String())
	}

	result.Set("records").SetObject(obj)
	sql = ` select * from t_college_detail where courseid=? and datastatus=1  order by displayorder asc `
	_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&obj)
	result.Set("detail").SetObject(obj)
	return
}

func (t *LCollege) ModSeries(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "ModSeries"
	o := orm.NewOrm()
	keys := "title,banner,banner1,discount,comment,fee"
	sql := gutils.UpdateSql(param, keys)
	// if sql != "" {
	// 	// sql = " update db_flybear.t_college_series set " + sql + " where SeriesID=:seriesid "
	// 	sql = " update db_flybear.t_college_series set alterdata:=alterdata where SeriesID=:seriesid "
	// 	_, err.Msg = o.RawJSON(sql, *param).Exec()
	// }

	sql = " update db_flybear.t_college_series set alterdata=:alterdata,applystatus=0 where SeriesID=:seriesid "
		_, err.Msg = o.RawJSON(sql, *param).Exec()

	// now := time.Now().Format("2006-01-02 15:04:05")
	// //重算单课程定价
	// discount := param.Get("discount").Double() / 100
	// discount1 := strconv.FormatFloat(discount, 'E', -1, 64)
	// seriesid := param.Get("seriesid").String()
	// var obj config.LJSON
	// sql = ` select fee*` + discount1 + ` as fee,signleid from db_flybear.t_college_signle where signleid in 
	// 		(  select signleid from db_flybear.t_college_series_child where seriesid=? ) `
	// _, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&obj)

	// for i := 0; i < obj.ItemCount(); i++ {
	// 	signleid := obj.Item(i).Get("signleid").String()
	// 	soldfee := obj.Item(i).Get("fee").Double()
	// 	sql = ` update db_flybear.t_college_series_child set soldfee=?,updatetime=? where seriesid=? and signleid=? `
	// 	_, err.Msg = o.Raw(sql, soldfee, now, seriesid, signleid).Exec()
	// }

	// //删除所有的记录
	// sql = ` delete from t_college_detail where courseid=? `
	// _, err.Msg = o.Raw(sql, seriesid).Exec()
	// if err.Msg != nil {
	// 	o.Rollback()
	// 	return
	// }
	// detailNum := param.Get("detail").ItemCount()
	// for i := 0; i < detailNum; i++ {
	// 	sql = "insert into t_college_detail(DetailID,courseid,url,displayorder,datastatus,updatetime) values ('" + gutils.CreateSTRGUID() + "','" + seriesid + "',:url," + strconv.Itoa(i) + ",1,'" + now + "')  "
	// 	_, err.Msg = o.RawJSON(sql, *param.Get("detail").Item(i)).Exec()
	// }

	return
}

//系列课中追加单课程
func (t *LCollege) SeriesDetailAddSignle(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
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
func (t *LCollege) SeriesDetailDel(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
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

func (t *LCollege) AddSeries(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "AddSeries"
	seriesid := gutils.CreateSTRGUID()
	now := time.Now().Format("2006-01-02 15:04:05")
	param.Set("seriesid").SetString(seriesid)
	param.Set("createtime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	o := orm.NewOrm()
	sql := ` insert into t_college_series(seriesid,title,banner,banner1,discount,anchorid,comment,createtime,fee,buynum,clicknum,datastatus,applystatus,updatetime) 
		values (:seriesid,:title,:banner,:banner1,:discount,:anchorid,:comment,:createtime,0,0,0,-3,1,:updatetime) `
	_, err.Msg = o.RawJSON(sql, *param).Exec()

	//删除所有的记录
	sql = ` delete from t_college_detail where courseid=? `
	_, err.Msg = o.Raw(sql, seriesid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	detailNum := param.Get("detail").ItemCount()
	for i := 0; i < detailNum; i++ {
		sql = "insert into t_college_detail(DetailID,courseid,url,displayorder,datastatus,updatetime) values ('" + gutils.CreateSTRGUID() + "','" + seriesid + "',:url," + strconv.Itoa(i) + ",1,'" + now + "')  "
		_, err.Msg = o.RawJSON(sql, *param.Get("detail").Item(i)).Exec()
	}
	return result, err
}

func (t *LCollege) SeriesDetailList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "SeriesDetailList"
	seriesid := param.Get("seriesid").String()
	if seriesid == "" {
		err.Errorf(gutils.ParamError, "系列课ID不能为空")
		return
	}

	page := param.Get("page").Int64()         //页码
	pagesize := param.Get("pagesize").Int64() //每页数量
	if page == 0 {
		page = 1
	}
	if pagesize == 0 {
		pagesize = 10
	}

	begintime := param.Get("begintime").String()
	endtime := param.Get("endtime").String()
	condition := param.Get("condition").String()
	datastatus := param.Get("datastatus").String()

	//fee表示 单课程原价 soldfee 单课程在系列课中的售价
	o := orm.NewOrm()
	sql := ` select csc.childid,s.title,s.tag,s.banner,s.type,
			s.status,ifnull(s.fee,0) as fee,
			ifnull(csc.soldfee,0) as soldfee,csc.displayorder,
			s.signleid,csc.seriesid,ifnull(s.datastatus,0) as datastatus,
			s.clicknum,s.begintime,s.endtime,s.status
		 	from t_college_series_child csc inner join t_college_signle s on 
			csc.signleid=s.signleid 
	 		where csc.seriesid=? `

	if condition != "" {
		sql = fmt.Sprintf("%s and s.title like  '%%%s%%' ", sql, condition)
	}

	if begintime != "" {
		sql = fmt.Sprintf("%s and s.begintime > '%s' ", sql, begintime)
	}

	if endtime != "" {
		sql = fmt.Sprintf("%s and s.begintime < '%s' ", sql, endtime)
	}

	if datastatus != "" {
		sql = fmt.Sprintf("%s and s.datastatus = %s ", sql, datastatus)
	}

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	var obj config.LJSON
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}

	sql = fmt.Sprintf("%s order by csc.displayorder asc limit %d,%d", sql, pagesize*(page-1), pagesize)
	_, err.Msg = o.Raw(sql, seriesid).ValuesJSON(&obj)

	result.Set("totalcount").SetInt64(totalcount)
	result.Set("page").SetInt64(page)
	result.Set("pagesize").SetInt64(pagesize)
	result.Set("records").SetObject(obj)
	return result, err
}

func (t *LCollege) SubmitSignleApplyData(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "SubmitSignleApplyData"
	o := orm.NewOrm()
	signleid := param.Get("signleid").String()
	if signleid == "" {
		err.Errorf(gutils.ParamError, "单课程ID不能为空")
		return
	}
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("updatetime").SetString(Updatetime)
	param.Set("applystatus").SetString("1")
	sql := " update t_college_signle set applystatus=:applystatus,updatetime=:updatetime where signleid=:signleid "
	_, err.Msg = o.RawJSON(sql, *param).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	return
}

func (t *LCollege) SubmitSeriesApplyData(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "SubmitSeriesApplyData"
	o := orm.NewOrm()
	seriesid := param.Get("seriesid").String()
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	if seriesid == "" {
		err.Errorf(gutils.ParamError, "系列课ID不能为空")
		return
	}
	param.Set("updatetime").SetString(Updatetime)
	param.Set("applystatus").SetString("1")
	sql := " update t_college_series set applystatus=:applystatus,updatetime=:updatetime where seriesid=:seriesid "
	_, err.Msg = o.RawJSON(sql, *param).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	return
}


func (t *LCollege) ModRoomInfo(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	o := orm.NewOrm()
	sql := ` update db_flybear.t_doctor set roompicture=:roompicture,roomname=:roomname,AnchorIntroduction=:anchorintro where 
		doctorid=:anchorid `
	_, err.Msg = o.RawJSON(sql, *param).Exec()
	return
}

func (t *LCollege) UserList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	anchorid := param.Get("anchorid").String()
	if anchorid == "" {
		err.Errorf(gutils.ParamError, "用户列表")
		return
	}

	page := param.Get("page").Int64()         //页码
	pagesize := param.Get("pagesize").Int64() //每页数量
	if page == 0 {
		page = 1
	}
	if pagesize == 0 {
		pagesize = 10
	}

	o := orm.NewOrm()
	sql := ` select r.userid,r.belongid,d.name,u.mobile,u.lastlogintime 
			 from db_flybear.t_college_room r 
			 inner join db_flybear.t_doctor d on r.belongid=d.doctorid
			 inner join db_flybear.t_user u on d.doctorid=u.userid			
			 where r.userid=? `

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	var obj config.LJSON
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}

	sql = fmt.Sprintf("%s order by r.displayorder desc limit %d,%d", sql, pagesize*(page-1), pagesize)
	_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)
	result.Set("records").SetObject(obj)

	result.Set("totalcount").SetInt64(totalcount)
	result.Set("page").SetInt64(page)
	result.Set("pagesize").SetInt64(pagesize)
	return
}

func (t *LCollege) UserAdd(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)

	o := orm.NewOrm()
	sql := ` select * from db_flybear.t_college_room where  userid=:anchorid and belongid=:belongid `
	var obj config.LJSON
	_, err.Msg = o.RawJSON(sql, *param).ValuesJSON(&obj)
	if obj.ItemCount() > 0 {
		err.Errorf(gutils.ParamError, "用户已存在")
		return
	}

	sql = ` insert into db_flybear.t_college_room (userid,belongid,updatetime) 
	values (:anchorid,:belongid,:updatetime) `
	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))

	_, err.Msg = o.RawJSON(sql, *param).Exec()
	return
}

func (t *LCollege) UserDel(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	o := orm.NewOrm()
	sql := ` delete from  db_flybear.t_college_room where userid=:anchorid and belongid=:belongid `
	_, err.Msg = o.RawJSON(sql, *param).Exec()
	return
}

func (t *LCollege) SearchUser(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	o := orm.NewOrm()
	sql := ` select u.userid,d.name,d.picture,u.mobile from db_flybear.t_user u inner join db_flybear.t_doctor d on 
	u.userid=d.doctorid where u.mobile=:mobile  `
	var obj config.LJSON
	_, err.Msg = o.RawJSON(sql, *param).ValuesJSON(&obj)
	if obj.ItemCount() != 0 {
		result.SetObject(*obj.Item(0))
	}
	return
}

func (t *LCollege) AnchorStatList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "AnchorStatList"
	//begintime := param.Get("begintime").String()
	//endtime := param.Get("endtime").String()

	anchorid := param.Get("anchorid").String() //名字

	page := param.Get("page").Int64()         //页码
	pagesize := param.Get("pagesize").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if pagesize == 0 {
		pagesize = 10
	}

	o := orm.NewOrm()

	sql := ""

	sql = ` select sum(1) as fans from t_college_fans where AnchorID=? and datastatus=1 `
	var obj config.LJSON
	_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)
	//粉丝数
	fans := obj.Item(0).Get("fans").Int64()

	sql = `  select incomefee,surplusfee from db_flybear.t_doctor d where d.doctorid=? `
	_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)
	//累积收入
	incomefee := obj.Item(0).Get("incomefee").Double()
	//剩余金额
	surplusfee := obj.Item(0).Get("surplusfee").Double()

	//目的是避免每次翻页重复读取总数量

	sql = ` SELECT o.classtype, SUM(o.earnings) AS earnings,s.buynum,
			(select sum(s.ClickNum)  from t_college_series_child c inner join t_college_signle s on 
			c.signleid=s.signleid where seriesid=o.classid) as clicknum,s.title,o.classid
			FROM t_college_order o
			INNER JOIN 
			t_college_series s ON o.classid=s.seriesid
			WHERE o.datastatus=1 AND o.anchorid=? AND o.classtype = '系列课'
			GROUP BY o.ClassID
						
			union all
			
			SELECT o.classtype, SUM(o.earnings) AS earnings,s.buynum,s.clicknum,s.title,o.classid
			FROM t_college_order o
			INNER JOIN 			
			t_college_signle s ON o.classid=s.signleid
			WHERE o.datastatus=1 AND o.anchorid=? AND o.classtype = '单课程'
			GROUP BY o.ClassID	  `

	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, anchorid, anchorid).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}
	sql = fmt.Sprintf("%s limit %d,%d", sql, pagesize*(page-1), pagesize)
	_, err.Msg = o.Raw(sql, anchorid, anchorid).ValuesJSON(&obj)
	result.Set("records").SetObject(obj)
	result.Set("fans").SetInt64(fans)
	result.Set("incomefee").SetDouble(incomefee)
	result.Set("surplusfee").SetDouble(surplusfee)
	result.Set("totalcount").SetInt64(totalcount)
	result.Set("page").SetInt64(page)
	result.Set("pagesize").SetInt64(pagesize)

	return result, err
}

func (t *LCollege) AnchorIncomeList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "AnchorIncomeList"

	anchorid := param.Get("anchorid").String() //名字
	classid := param.Get("classid").String()

	if anchorid == "" || classid == "" {
		panic("主播或课程ID不能为空")
	}

	page := param.Get("page").Int64()         //页码
	pagesize := param.Get("pagesize").Int64() //每页数量
	if page == 0 {
		page = 1
	}
	if pagesize == 0 {
		pagesize = 10
	}

	sql := ""
	classtype := param.Get("classtype").String()
	if classtype == "系列课" {
		sql = ` SELECT o.earnings,s.Title,o.OrderID,o.PayStyle,o.BuyTime
				FROM t_college_order o
				INNER JOIN 
				t_college_series s ON o.classid=s.seriesid
				WHERE o.datastatus=1 AND o.anchorid=? AND o.classtype = '系列课'
				and o.classid=?  `

	} else if classtype == "单课程" {
		sql = `
			SELECT  o.earnings,s.Title,o.OrderID,o.PayStyle,o.BuyTime
			FROM t_college_order o
			INNER JOIN 			
			t_college_signle s ON o.classid=s.signleid
			WHERE o.datastatus=1 AND o.anchorid=? AND o.classtype = '单课程'
			and o.classid=?  `
	} else {
		panic("课程类型为空")
	}

	o := orm.NewOrm()

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	var obj config.LJSON
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, anchorid, classid).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}
	sql = fmt.Sprintf("%s order by buytime desc limit %d,%d", sql, pagesize*(page-1), pagesize)
	_, err.Msg = o.Raw(sql, anchorid, classid).ValuesJSON(&obj)
	result.Set("records").SetObject(obj)
	result.Set("totalcount").SetInt64(totalcount)
	result.Set("page").SetInt64(page)
	result.Set("pagesize").SetInt64(pagesize)
	return result, err
}

func (t *LCollege) AnchorPayOutList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "AnchorPayOutList"

	anchorid := param.Get("anchorid").String() //名字
	page := param.Get("page").Int64()          //页码
	pagesize := param.Get("pagesize").Int64()  //每页数量

	if page == 0 {
		page = 1
	}
	if pagesize == 0 {
		pagesize = 10
	}

	o := orm.NewOrm()

	sql := ` SELECT d.name as anchorname,w.partner_trade_no,w.payment_time,w.openid, 
			CONVERT(w.amount/100, DECIMAL(10,2)) AS amount,u.mobile
			FROM t_college_withdrawal w
			LEFT JOIN t_doctor d ON w.userid= d.DoctorID
			LEFT JOIN t_user u ON u.userid=w.userid
			WHERE w.datastatus=1  and w.userid=? `

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	var obj config.LJSON
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}
	sql = fmt.Sprintf("%s order by w.payment_time desc limit %d,%d", sql, pagesize*(page-1), pagesize)
	fmt.Println(sql)
	_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)
	result.Set("records").SetObject(obj)
	result.Set("totalcount").SetInt64(totalcount)
	result.Set("page").SetInt64(page)
	result.Set("pagesize").SetInt64(pagesize)
	return result, err
}

func (t *LCollege) SignleSetting(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "SignleSetting"
	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	datastatus := param.Get("datastatus").Int()
	signleid := param.Get("signleid").String()
	// alterdata := param.Get("alterdata").String()
	// applystatus := param.Get("applystatus").String()
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

	sql = ` update t_college_signle set datastatus=:datastatus,updatetime=:updatetime ` 
	if param.Get("alterdata").IsNULL() == false {
		sql = fmt.Sprintf("%s,alterdata=:alterdata", sql)
	}
	if param.Get("applystatus").IsNULL() == false {
		sql = fmt.Sprintf("%s,applystatus=:applystatus", sql)
	}	
	sql = fmt.Sprintf("%s where signleid=:signleid", sql)
	_, err.Msg = o.RawJSON(sql, *param).Exec()

	return result, err
}

func (t *LCollege) GetRoomInfo(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)

	o := orm.NewOrm()

	sql := `select d.isanchor,u.userid,u.password,d.picture,d.name as docname,
			 d.roomname,d.roompicture,d.anchorintroduction as anchorintro,
			 u.userid as anchorid,u.mobile,d.openid as bingwechat,d.incomefee as totalfee,
			 d.surplusfee as money,ifnull(t.rate,0) as platformrate 
			 from db_flybear.t_user u inner join 
			 db_flybear.t_doctor d on u.userid=d.doctorid
			 left join db_flybear.t_college_employrate t on t.employrateid=d.EmployRateID
			 where d.doctorid=:anchorid `

	var obj config.LJSON
	_, err.Msg = o.RawJSON(sql, *param).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "直播间不存在")
		return result, err
	}
	result.SetObject(*obj.Item(0))

	var res config.LJSON
	//粉丝数量
	sql = ` select sum(1) as fans from t_college_fans where AnchorID=:anchorid and datastatus=1`
	_, err.Msg = o.RawJSON(sql, *param).ValuesJSON(&res)
	result.Set("fans").SetInt(res.Item(0).Get("fans").Int())
	//关注的人数量
	sql = ` select sum(1) as num from t_college_fans where  FollowerID=:anchorid and datastatus=1 `
	_, err.Msg = o.RawJSON(sql, *param).ValuesJSON(&res)
	result.Set("num").SetInt(res.Item(0).Get("num").Int())

	return
}

func (t *LCollege) GetTagList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	o := orm.NewOrm()
	sql := ` select * FROM t_college_tag  ` 
	var obj config.LJSON
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)

	result.Set("records").SetObject(obj)
	return result, err
}




type ConfigStruct struct {
	Expiration string     `json:"expiration"`
	Conditions [][]string `json:"conditions"`
}

func (t *LCollege) OssParam(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
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

	// accessKeyID := "WlZWPVisjOXliOAs"
	// accessKeySecret := "LsVjn2JN2PoYZqJTshTWMas20IlrX1"
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

	result.Set("accessid").SetString(accessKeyID)
	result.Set("host").SetString(host)
	result.Set("expire").SetInt64(expire_end)
	result.Set("signature").SetString(signedStr)
	result.Set("policy").SetString(debyte)
	result.Set("dir").SetString(upload_dir)
	result.Set("cloudname").SetString(filename)

	return result, err
}

func (t *LCollege) TotalStatList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "TotalStatList"

	page := param.Get("page").Int64()          //页码
	pagesize := param.Get("pagesize").Int64()  //每页数量
	anchorid := param.Get("anchorid").String() //直播间

	if page == 0 {
		page = 1
	}
	if pagesize == 0 {
		pagesize = 10
	}

	o := orm.NewOrm()

	sql := ` 	SELECT classid,
				classtype, 
				sum(IFNULL(PaidFee,0)) AS paidfee, 
				sum(IFNULL(earnings,0)) AS earnings, 
				sum(IFNULL(PlatFormfee,0)) AS platformfee
				FROM t_college_order
				WHERE datastatus=1 and AnchorID=?  group by classid `

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	var obj config.LJSON
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}

	sql = ` select a.*, CASE a.classtype WHEN '系列课' THEN (
			SELECT CONCAT(title,'||',clicknum,'||',buynum)
			FROM t_college_series
			WHERE seriesid=classid) ELSE (
			SELECT CONCAT(title,'||',clicknum,'||',buynum)
			FROM t_college_signle
			WHERE signleid=classid) END AS title
			FROM (` + sql + ` ) a `

	sql = fmt.Sprintf("%s limit %d,%d", sql, pagesize*(page-1), pagesize)
	fmt.Println(sql)
	_, err.Msg = o.Raw(sql, anchorid).ValuesJSON(&obj)

	result.Set("records").SetObject(obj)
	result.Set("totalcount").SetInt64(totalcount)
	result.Set("page").SetInt64(page)
	result.Set("pagesize").SetInt64(pagesize)
	return result, err
}
func (t *LCollege) SeriesSetting(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "SeriesSetting"

	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	datastatus := param.Get("datastatus").Int()
	seriesid := param.Get("seriesid").String()
	// alterdata := param.Get("alterdata").String()
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
	// if alterdata == ""{
	// 	sql = ` update t_college_series set datastatus=:datastatus,updatetime=:updatetime where seriesid=:seriesid `
	// }else{
	// 	sql = ` update t_college_series set alterdata=:alterdata,datastatus=:datastatus,updatetime=:updatetime where seriesid=:seriesid `
	// }

	sql = ` update t_college_series set datastatus=:datastatus,updatetime=:updatetime ` 
	if param.Get("alterdata").IsNULL() == false {
		sql = fmt.Sprintf("%s,alterdata=:alterdata", sql)
	}
	if param.Get("applystatus").IsNULL() == false {
		sql = fmt.Sprintf("%s,applystatus=:applystatus", sql)
	}	
	sql = fmt.Sprintf("%s where seriesid=:seriesid", sql)



	_, err.Msg = o.RawJSON(sql, *param).Exec()
	//更新 home表
	sql2 := "update t_college_series_home h set datastatus = (select datastatus from t_college_series s where s.seriesid=?) where h.seriesid=?"
	if datastatus != 0 {
		_, err.Msg = o.Raw(sql2, seriesid, seriesid).Exec()
	}
	return result, err
}

func (t *LCollege) GetPushUrl(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)

	signleid := param.Get("signleid").String()
	if signleid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}

	var param1 config.LJSON
	param1.Set("funcid").SetInt(6376)
	param1.Set("signleid").SetString(signleid)
	res := gutils.FlybearCPlus(param1)

	if res.Get("code").Int() != 1 {
		err.Errorf(gutils.ParamError, res.Get("info").String())
		return
	}
	result.Set("url").SetString(res.Get("edgeurl").String())
	return
}

func (t *LCollege) SetAllSignle(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
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

func (t *LCollege) Seriesofsignlelist(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "Seriesofsignlelist"

	anchorid := param.Get("anchorid").String()
	seriesid := param.Get("seriesid").String()
	if anchorid == "" || seriesid == "" {
		err.Errorf(gutils.ParamError, "主键ID不能为空")
		return
	}
	condition := param.Get("condition").String() //标题
	page := param.Get("page").Int64()            //页码
	pagesize := param.Get("pagesize").Int64()    //每页数量
	if page == 0 {
		page = 1
	}
	if pagesize == 0 {
		pagesize = 10
	}

	o := orm.NewOrm()

	sql := ` select title,banner,status,fee,signleid
	 from t_college_signle where anchorid=? and datastatus>0 and signleid not in (select signleid from t_college_series_child where seriesid=? ) `

	if condition != "" {
		sql = fmt.Sprintf("%s and title like '%%%s%%' ", sql, condition)
	}

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	var obj config.LJSON
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql, anchorid, seriesid).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}
	sql = fmt.Sprintf("%s order by begintime desc limit %d,%d", sql, pagesize*(page-1), pagesize)
	_, err.Msg = o.Raw(sql, anchorid, seriesid).ValuesJSON(&obj)

	result.Set("records").SetObject(obj)
	result.Set("totalcount").SetInt64(totalcount)
	result.Set("page").SetInt64(page)
	result.Set("pagesize").SetInt64(pagesize)
	return result, err
}
