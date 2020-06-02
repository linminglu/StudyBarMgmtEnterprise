package app

import (
	"course/gutils"
	"course/models/protocols"

	// "crypto/hmac"
	// "crypto/sha1"
	// "encoding/base64"
	// "encoding/json"
	"fmt"
	"regexp"
	// "course/gutils/gredis"
	// "hash"
	// "io"
	// "strconv"
	// "strings"
	"time"

	"github.com/astaxie/beego/config"
	// "github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
)

type LApp struct {
	protocols.Protocol
}

//Login 用户登录
func (t *LApp) Login(params *config.LJSON) (result config.LJSON, err gutils.LError) {

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
			 from db_flybear.t_user u inner join db_flybear.t_college_bg_user bu on 
			 u.userid=bu.userid  inner join 
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

	if isanchor != 1 {
		panic("该账号已停用或删除")
	}

	return
}

//SendCode 发送验证码
func (t *LApp) SendCode(params *config.LJSON) (result config.LJSON, err gutils.LError) {

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
func (t *LApp) LogOut(params *config.LJSON) (result config.LJSON, err gutils.LError) {
	//userid := params.Get("userid").String()
	t.CheckSession(params)
	return
}
//获取App首页banner列表
func (t *LApp) GetBannerList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	o := orm.NewOrm()
	sql := ` select * FROM t_app_home_banner where datastatus > 0 order by displayorder asc ` 
	var obj config.LJSON
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)

	result.Set("records").SetObject(obj)
	return result, err
}
//获取App首页banner详情
func (t *LApp) GetBannerDetail(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)

	o := orm.NewOrm()
	sql := `select *from t_app_home_banner where BannerID=:BannerID `
	var obj config.LJSON
	_, err.Msg = o.RawJSON(sql, *param).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "该Banner不存在")
		return result, err
	}
	result.SetObject(*obj.Item(0))
	return
}

//App首页banner：新增修改，上移下移 操作
func (t *LApp) AddOrModBanner(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "AddOrModBanner"
	o := orm.NewOrm()
	o.Begin()
	bannerid := param.Get("bannerid").String()
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	// up 上移  down 下移 (移动传参)
	operation := param.Get("operation").String()
	displayorder := param.Get("displayorder").Int()
	param.Set("updatetime").SetString(Updatetime)
	sql := ""
	if bannerid == "" { //新增
		bannerid = gutils.CreateSTRGUID()
		param.Set("bannerid").SetString(bannerid)
		var obj config.LJSON
		sql = " select (max(ifnull(displayorder,0)) +1) as displayorder from t_app_home_banner "
		_, err.Msg = o.Raw(sql).ValuesJSON(&obj)
		param.Set("displayorder").SetInt(obj.Item(0).Get("displayorder").Int())

		sql = ` insert into t_app_home_banner (bannerid,bannername,url,displayorder,detailurl,courseid,coursename,coursetype,type,datastatus,updatetime)
		values (:bannerid,:bannername,:url,:displayorder,:detailurl,:courseid,:coursename,:coursetype,:type,2,:updatetime)`
	} else { 
		if operation == "" { //修改
			sql = " update t_app_home_banner set bannername=:bannername,url=:url,detailurl=:detailurl,courseid=:courseid,coursename=:coursename,coursetype=:coursetype,type=:type,datastatus=:datastatus,updatetime=:updatetime where bannerid=:bannerid "
		}
	}
	if sql != "" { //新增或修改
		_, err.Msg = o.RawJSON(sql, *param).Exec()
		if err.Msg != nil {
			o.Rollback()
			return
		}
	} else { //上移下移 
		if bannerid == "" {
			err.Errorf(gutils.ParamError, "主键ID不能为空")
			return
		}
		if operation == "up" {
			sql = " select * from t_app_home_banner where datastatus>0 and displayorder < ? and bannerid<>? order by displayorder desc limit 1"
		}else if operation == "down" {
			sql = " select * from t_app_home_banner where datastatus>0 and displayorder > ? and bannerid <>? order by displayorder asc limit 1"
		} else {
			err.Errorf(gutils.ParamError, "未指定操作")
			return
		}

		var obj config.LJSON
		_, err.Msg = o.Raw(sql, displayorder, bannerid).ValuesJSON(&obj)
		if obj.ItemCount() == 0 {
			if operation == "up" {
				err.Errorf(gutils.ParamError, "已置顶")
			} else {
				err.Errorf(gutils.ParamError, "已置底")
			}
			return
		}
	
		banneridnew := obj.Item(0).Get("bannerid").String()
		sql = ` update t_app_home_banner a,t_app_home_banner b set a.DisplayOrder=b.DisplayOrder,b.DisplayOrder=a.DisplayOrder where 
				a.bannerid=? and b.bannerid=? `
		_, err.Msg = o.Raw(sql, bannerid, banneridnew).Exec()
	}
	o.Commit()
	return result, err
}


//获取App首页模块列表
func (t *LApp) GetModuleList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	o := orm.NewOrm()
	sql := ` select * FROM t_app_home_module where datastatus > 0 order by displayorder asc ` 
	var obj config.LJSON
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)

	result.Set("records").SetObject(obj)
	return result, err
}

// 移动，启用(停用) 首页模块
func (t *LApp) ModOrMoveModule(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "ModOrMoveModule"
	o := orm.NewOrm()
	moduleid := param.Get("moduleid").String()
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	// up 上移  down 下移 (移动传参)
	operation := param.Get("operation").String()
	displayorder := param.Get("displayorder").Int()
	param.Set("updatetime").SetString(Updatetime)
	sql := ""
	if moduleid == "" { 
		err.Errorf(gutils.ParamError, "主键ID不能为空")
			return
	}

	if operation == "" { //修改
		sql = " update t_app_home_module set datastatus=:datastatus,updatetime=:updatetime where moduleid=:moduleid "
		_, err.Msg = o.RawJSON(sql, *param).Exec()
		if err.Msg != nil {
			o.Rollback()
			return
		}
	}else{
		if operation == "up" {
			sql = " select * from t_app_home_module where datastatus>0 and displayorder < ? and moduleid <>? order by displayorder desc limit 1"
		}else if operation == "down" {
			sql = " select * from t_app_home_module where datastatus>0 and displayorder > ? and moduleid <>? order by displayorder asc limit 1"
		} else {
			err.Errorf(gutils.ParamError, "未指定操作")
			return
		}

		var obj config.LJSON
		_, err.Msg = o.Raw(sql, displayorder, moduleid).ValuesJSON(&obj)
		if obj.ItemCount() == 0 {
			if operation == "up" {
				err.Errorf(gutils.ParamError, "已置顶")
			} else {
				err.Errorf(gutils.ParamError, "已置底")
			}
			return
		}
	
		moduleidnew := obj.Item(0).Get("moduleid").String()
		sql = ` update t_app_home_module a,t_app_home_module b set a.DisplayOrder=b.DisplayOrder,b.DisplayOrder=a.DisplayOrder where 
				a.moduleid=? and b.moduleid=? `
		_, err.Msg = o.Raw(sql, moduleid, moduleidnew).Exec()
	}

	return result, err
}

// 获取精品课程列表
func (t *LApp) BoutiqueClasssList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	page := param.Get("page").Int64()            //页码
	pagesize := param.Get("pagesize").Int64()    //每页数量
	if page == 0 {
		page = 1
	}
	if pagesize == 0 {
		pagesize = 10
	}
	o := orm.NewOrm()
	sql := ` select h.url,h.courseType,h.coursename,h.courseid,h.displayOrder,h.updatetime,h.dataStatus,h.hotclassId,
			 ifnull(sr.title,sg.title) as title,ifnull(sr.anchorid,sg.anchorid) as anchorid,
			 ifnull(d.roomname,dd.roomname) as roomname,
			 ifnull(sr.datastatus,sg.datastatus) as coursestatus
	 		 from t_app_home_hotclass h 
			 left join t_college_series sr on sr.seriesid = h.courseid
			 left join t_college_signle sg on sg.signleid = h.courseid
			 left join t_doctor d on d.doctorid=sr.anchorid 
			 left join t_doctor dd on dd.doctorid=sg.anchorid 
			 where h.datastatus > 0
			 `

	var obj config.LJSON
	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}

	sql = fmt.Sprintf("%s order by h.displayorder asc limit %d,%d", sql, pagesize*(page-1), pagesize)

	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)

	result.Set("totalcount").SetInt64(totalcount)
	result.Set("page").SetInt64(page)
	result.Set("pagesize").SetInt64(pagesize)
	result.Set("records").SetObject(obj)
	return result, err
}

// 获取精品课程详情
func (t *LApp) GetBoutiqueDetail(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)

	o := orm.NewOrm()
	sql := `select *from t_app_home_hotclass where hotclassId=:hotclassid `
	var obj config.LJSON
	_, err.Msg = o.RawJSON(sql, *param).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "")
		return result, err
	}
	result.SetObject(*obj.Item(0))
	return
}


//App首页精品课程：新增修改，上移下移 操作
func (t *LApp) AddOrModBoutiqueClass(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	err.Caption = "AddOrModBoutiqueClass"
	o := orm.NewOrm()

	hotclassid := param.Get("hotclassid").String()
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	// up 上移  down 下移 (移动传参)
	operation := param.Get("operation").String()
	displayorder := param.Get("displayorder").Int()
	// roomname := param.Get("roomname").String()
	// anchorid := param.Get("anchorid").String()
	param.Set("updatetime").SetString(Updatetime)
	sql := ""
	if hotclassid == "" { //新增
		hotclassid = gutils.CreateSTRGUID()
		param.Set("hotclassid").SetString(hotclassid)
		var obj config.LJSON
		sql = " select (max(ifnull(displayorder,0)) +1) as displayorder from t_app_home_hotclass "
		_, err.Msg = o.Raw(sql).ValuesJSON(&obj)
		param.Set("displayorder").SetInt(obj.Item(0).Get("displayorder").Int())

		sql = ` insert into t_app_home_hotclass (hotclassid,url,anchorid,roomname,coursename,coursetype,courseid,displayorder,datastatus,updatetime)
		values (:hotclassid,:url,:anchorid,:roomname,:coursename,:coursetype,:courseid,:displayorder,2,:updatetime)`
	} else { 
		if operation == "" { //修改
			sql = " update t_app_home_hotclass set url=:url,anchorid=:anchorid,roomname=:roomname,coursename=:coursename,coursetype=:coursetype,courseid=:courseid,updatetime=:updatetime,dataStatus=:dataStatus where hotclassid=:hotclassid "
		}
	}
	if sql != "" { //新增或修改
		_, err.Msg = o.RawJSON(sql, *param).Exec()
		if err.Msg != nil {
			o.Rollback()
			return
		}

	// 	//修改doctor表
	// if roomname != "" && anchorid != ""{
	// 	sql = " update t_doctor set roomname=? where doctorid=? "
	// 	_, err.Msg = o.Raw(sql,roomname,anchorid).Exec()
	// }
	} else { //上移下移 
		if hotclassid == "" {
			err.Errorf(gutils.ParamError, "主键ID不能为空")
			return
		}
		if operation == "up" {
			sql = " select * from t_app_home_hotclass where datastatus>0 and displayorder < ? and hotclassid<>? order by displayorder desc limit 1"
		}else if operation == "down" {
			sql = " select * from t_app_home_hotclass where datastatus>0 and displayorder > ? and hotclassid <>? order by displayorder asc limit 1"
		} else {
			err.Errorf(gutils.ParamError, "未指定操作")
			return
		}

		var obj config.LJSON
		_, err.Msg = o.Raw(sql, displayorder, hotclassid).ValuesJSON(&obj)
		if obj.ItemCount() == 0 {
			if operation == "up" {
				err.Errorf(gutils.ParamError, "已置顶")
			} else {
				err.Errorf(gutils.ParamError, "已置底")
			}
			return
		}
	
		hotclassidnew := obj.Item(0).Get("hotclassid").String()
		sql = ` update t_app_home_hotclass a,t_app_home_hotclass b set a.DisplayOrder=b.DisplayOrder,b.DisplayOrder=a.DisplayOrder where 
				a.hotclassid=? and b.hotclassid=? `
		_, err.Msg = o.Raw(sql, hotclassid, hotclassidnew).Exec()
	}

	return result, err
}

//获取所有单课程
func (t *LApp) SignleList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	anchorid := param.Get("anchorid").String()
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
	sql := ` select s.signleid,s.banner,s.tag,s.title,s.type,s.status,ifnull(s.fee,0) as fee,
			 d.name as anchorname,d.roomname,s.anchorid,s.buynum,s.clicknum,s.begintime,s.autoendtime,s.datastatus
	 		 from t_college_signle s 
			 inner join t_doctor d on d.doctorid = s.anchorid 
			 where 1=1 `
	if anchorid != "" {
		sql = fmt.Sprintf("%s and s.AnchorID = %s ", sql, anchorid)
	}
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
		sql = fmt.Sprintf("%s and s.datastatus>0 ",sql)
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
		_, err.Msg = o.Raw(sql).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}

	sql = fmt.Sprintf("%s order by s.begintime desc  limit %d,%d", sql, pagesize*(page-1), pagesize)

	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)

	result.Set("totalcount").SetInt64(totalcount)
	result.Set("page").SetInt64(page)
	result.Set("pagesize").SetInt64(pagesize)
	result.Set("records").SetObject(obj)
	return result, err
}

//获取所有系列课
func (t *LApp) SeriesList(param *config.LJSON) (result config.LJSON, err gutils.LError) {
	t.CheckSession(param)
	anchorid := param.Get("anchorid").String()

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
	sql := ` select seriesid,title,banner,anchorid,fee,
			ifnull(discount,0) as discount,
			d.name as anchorname,d.roomname,ifnull(fee,0) as fee,clicknum,buynum,s.datastatus
			from t_college_series s inner join t_doctor d on d.doctorid=s.anchorid 
			where 1=1 `
	if anchorid != "" {
		sql = fmt.Sprintf("%s and s.AnchorID = %s ", sql, anchorid)
	}

	if condition != "" {
		sql = fmt.Sprintf("%s and (s.title like '%%%s%%' or d.name like '%%%s%%')", sql, condition, condition)
	}

	if datastatus != "" {
		sql = fmt.Sprintf("%s and s.datastatus = %s ", sql, datastatus)
	}else{
		sql = fmt.Sprintf("%s and s.datastatus > 0", sql)
	}
	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	var obj config.LJSON
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}

	sql = fmt.Sprintf("%s order by s.createtime desc  limit %d,%d", sql, pagesize*(page-1), pagesize)
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj)

	result.Set("totalcount").SetInt64(totalcount)
	result.Set("page").SetInt64(page)
	result.Set("pagesize").SetInt64(pagesize)
	result.Set("records").SetObject(obj)
	return result, err
}