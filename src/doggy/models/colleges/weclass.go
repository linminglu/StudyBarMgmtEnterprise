package colleges

import (
	"doggy/gutils"
	"fmt"

	"time"

	"doggy/gutils/conf"
	"doggy/gutils/gredis"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

func MainData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "MainData"

	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量
	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()
	sql := ` select * from t_weclass_class where dispark=1 and datastatus=1 `

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

func MainShare(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "MainShare"

	domain := ""
	panip, _ := conf.SvrConfig.String("server", "PANIP")                 //根据IP判断测试
	if panip == "" || panip == "47.104.183.133" || panip == "127.0.0.1" { //测试服务器
		domain = "http://47.104.183.133:8100/college/weclassauth"
	} else { //正式服务器
		domain = "http://115.29.37.174:8089/college/weclassauth"
	}

	result.List.Set("description").SetString("牙医管家微课堂强势来袭，干货满满~~~")
	result.List.Set("picurl").SetString("http://dtcollege.oss-cn-qingdao.aliyuncs.com/wxpic.jpg")
	result.List.Set("title").SetString("微课堂")
	result.List.Set("shareurl").SetString(domain + "?classid=college")
	return result, err
}

func MainBanner(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "MainBanner"
	o := orm.NewOrm()
	sql := ` select * from t_weclass_banner where datastatus=1 order by displayorder asc`
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	return result, err
}

func CourseData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CourseData"
	classid := param.Get("classid").String()
	if classid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}

	userid := param.Get("userid").String() //这个是userid

	o := orm.NewOrm()
	sql := ` select w.*,ifnull((select datastatus from t_weclass_likes where userid=? and guid=w.classid),0) as islike 
			from t_weclass_class w where w.classid=? and w.datastatus=1 and w.dispark=1 `
	var obj1 config.LJSON
	_, err.Msg = o.Raw(sql, userid, classid).ValuesJSON(&obj1)
	if obj1.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "课程不存在")
		return
	}
	result.List.Set("class").SetObject(obj1) //课程信息

	domain := ""
	panip, _ := conf.SvrConfig.String("server", "PANIP")                 //根据IP判断测试
	if panip == "" || panip == "47.104.183.133" || panip == "127.0.0.1" { //测试服务器
		domain = "http://47.104.183.133:8100/college/weclassauth"
	} else { //正式服务器
		domain = "http://115.29.37.174:8089/college/weclassauth"
	}
	result.List.Set("class").Item(0).Set("description").SetString("牙医管家微课堂强势来袭，干货满满~~~")
	result.List.Set("class").Item(0).Set("picurl").SetString("http://dtcollege.oss-cn-qingdao.aliyuncs.com/wxpic.jpg")
	result.List.Set("class").Item(0).Set("title").SetString(obj1.Item(0).Get("classtitle").String())
	result.List.Set("class").Item(0).Set("shareurl").SetString(domain + "?classid=" + classid)

	//最新评论

	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	//评论是否可以删除以及是否有点过赞
	sql = ` select c.*,ifnull((select datastatus from t_weclass_likes where userid=? and guid=c.commentid),0) as islike,if(c.userid=?,1,0) as isdelete
			 from t_weclass_comments c where c.relationid=? and c.datastatus=1 `

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		var obj config.LJSON
		_, err.Msg = o.Raw(sql, userid, userid, classid).ValuesJSON(&obj)
		totalcount = int64(obj.ItemCount())
	}

	if totalcount >= 10 { //总记录超过10条,才返回最热评论
		//最热评论
		var hot config.LJSON

		sql1 := ` select c.*,ifnull((select datastatus from t_weclass_likes where userid=? and guid=c.commentid),0) as islike,if(c.userid=?,1,0) as isdelete
			 from t_weclass_comments c where c.relationid=? and c.datastatus=1 order by c.likenum desc limit 0,3 `
		_, err.Msg = o.Raw(sql1, userid, userid, classid).ValuesJSON(&hot)
		//		hostCount := hot.ItemCount()
		//		if hostCount != 0 {
		//			for i := 0; i < hostCount; i++ {
		//				var obj config.LJSON
		//				commentid := hot.Item(i).Get("commentid").String() //评论的作者回复
		//				o.Raw(" select * from t_weclass_comment where relationid=? and datastatus=1 ", commentid).ValuesJSON(&obj)
		//				if obj.ItemCount() != 0 {
		//					hot.Item(i).Set("reply").SetObject(obj)
		//				}
		//			}
		//		}
		result.List.Set("hot").SetObject(hot)
	}

	var newC config.LJSON
	sql = fmt.Sprintf("%s order by c.commentdate desc LIMIT %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql, userid, userid, classid).ValuesJSON(&newC)

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

func CoursListen(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CoursListen"
	classid := param.Get("classid").String()
	if classid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}
	o := orm.NewOrm()
	//播放次数+1
	updatetime := time.Now().Format("2006-01-02 15:04:05")
	sql := ` update t_weclass_class set playnum=playnum+1,updatetime=? where classid=? `
	_, err.Msg = o.Raw(sql, updatetime, classid).Exec()

	return result, err
}
func Comment(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "Comment"
	classid := param.Get("classid").String()
	if classid == "" {
		err.Errorf(gutils.ParamError, "课程ID不能为空")
		return
	}

	updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("commentid").SetString(gutils.CreateSTRGUID())
	param.Set("relationid").SetString(classid)
	param.Set("commentdate").SetString(updatetime)
	param.Set("likenum").SetInt(0)
	param.Set("datastatus").SetInt(1)
	param.Set("updatetime").SetString(updatetime)
	o := orm.NewOrm()
	err.Msg = o.Begin()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql := ` insert into t_weclass_comment (commentid,relationid,commentinfo,commentdate,picture,nickname,likenum,datastatus,comefrom,updatetime) 
			values (:commentid,:relationid,:commentinfo,:commentdate,:picture,:nickname,:likenum,:datastatus,:comefrom,:updatetime) `
	_, err.Msg = o.RawJSON(sql, param).Exec()

	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql = `update t_weclass_class set commentnum=commentnum+1,updatetime=? where classid=? `
	_, err.Msg = o.Raw(sql, updatetime, classid).Exec() //评论数+1
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

func Like(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "Like"
	updatetime := time.Now().Format("2006-01-02 15:04:05")
	o := orm.NewOrm()
	islike := param.Get("islike").Int() // +1  或 -1
	guid := param.Get("guid").String()
	comefrom := param.Get("comefrom").String()

	commentid := param.Get("commentid").String()
	if commentid != "" {
		sql := " update t_weclass_comment set likenum=likenum+?,updatetime='" + updatetime + "' where commentid=?"
		_, err.Msg = o.Raw(sql, islike, commentid).Exec()

		if islike == 1 {
			sql = ` insert into t_weclass_like (likeid,weclassid,guid,type,datastatus,updatetime,comefrom) 
					values (?,?,?,1,1,?,?)
					`
			_, err.Msg = o.Raw(sql, gutils.CreateSTRGUID(), commentid, guid, updatetime, comefrom).Exec()
		} else {
			sql = ` delete from t_weclass_like where weclassid=? and guid=? `
			_, err.Msg = o.Raw(sql, commentid, guid).Exec()
		}
	}

	classid := param.Get("classid").String()
	if classid != "" {
		sql := " update t_weclass_class set likenum=likenum+?,updatetime=? where classid=? "
		_, err.Msg = o.Raw(sql, islike, updatetime, classid).Exec()

		if islike == 1 {
			sql = ` insert into t_weclass_like (likeid,weclassid,guid,type,datastatus,updatetime,comefrom) 
					values (?,?,?,0,1,?,?)
					`
			_, err.Msg = o.Raw(sql, gutils.CreateSTRGUID(), classid, guid, updatetime, comefrom).Exec()
		} else {
			sql = ` delete from t_weclass_like where weclassid=? and guid=? `
			_, err.Msg = o.Raw(sql, classid, guid).Exec()
		}
	}

	return result, err
}

func Follow(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "Follow"
	guid := param.Get("guid").String()
	classid := param.Get("classid").String()
	if classid == "" {
		classid = "college"
	}
	//是否关注了公众号
	var obj config.LJSON
	o := orm.NewOrm()
	sql := ` select datastatus from t_weixin_user where openid=? and datastatus =1`
	_, err.Msg = o.Raw(sql, guid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 { //未关注
		result.List.Set("isfollow").SetInt(0)

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
	} else { //已关注
		result.List.Set("isfollow").SetInt(1)
	}
	return result, err
}

func BindOpenID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "BindOpenID"

	mobile := param.Get("mobile").String()
	code := param.Get("code").String()
	if mobile == "" || code == "" {
		err.Errorf(gutils.ParamError, "手机号或验证码不能为空")
		return
	}

	openid := param.Get("openid").String()
	if openid == "" {
		err.Errorf(gutils.ParamError, "openid不能为空")
		return
	}

	pic := param.Get("headimgurl").String()
	nickname := param.Get("nickname").String()
	//验证验证码
	o := orm.NewOrm()
	sql := "SELECT Code,Updatetime,mobile FROM t_sys_code WHERE UserID=? AND FuncID=? AND Code=?"
	var obj config.LJSON
	num, _ := o.Raw(sql, mobile, 977, code).ValuesJSON(&obj)
	if num <= 0 {
		err.Errorf(gutils.ParamError, "验证码错误")
		return
	}
	sendtime := obj.Item(0).Get("Updatetime").Time().Unix()
	now := time.Now().Unix() - 3600
	if now > sendtime {
		err.Errorf(gutils.ParamError, "验证码过期")
		return
	}

	updatetime := time.Now().Format("2006-01-02 15:04:05")
	userid := ""
	//判断是否有绑定关系
	var res config.LJSON
	sql = ` select uo.userid,d.name,d.picture,uo.useropenid,ifnull(uo.datastatus,0) as datastatus 
			from t_user_open uo left join t_doctor d on uo.userid=d.doctorid
			where uo.openid=? and uo.roleid=3 `
	_, err.Msg = o.Raw(sql, openid).ValuesJSON(&res)
	datastatus := res.Item(0).Get("datastatus").Int()
	if datastatus == 0 { //无绑定关系
		useropenid := res.Item(0).Get("useropenid").String() //用于判断是否已经有记录
		if useropenid == "" {
			useropenid = gutils.CreateSTRGUID()
		}

		var resStr config.LJSON
		sql = ` select u.userid,d.name,d.picture from t_user u inner join t_doctor d on 
				u.userid=d.doctorid where u.mobile=? and u.roleid=3 `
		_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&resStr)
		if resStr.ItemCount() == 0 { //手机号注册
			sql = ` insert into t_user (userid,password,reservepassword,mobile,roleid,updatetime)  values (?,?,?,?,?,?) `
			userid = gutils.CreateSTRGUID()
			password := "e10adc3949ba59abbe56e057f20f883e"
			reservepassword := ",$<;gka$$wz;dSsslE;e"
			_, err.Msg = o.Raw(sql, userid, password, reservepassword, mobile, 3, updatetime).Exec()

			sql = ` insert into t_doctor (doctorid,name,picture,mobile,phone,datastatus,updatetime) values (?,?,?,?,?,?,?) `
			_, err.Msg = o.Raw(sql, userid, nickname, pic, mobile, mobile, 1, updatetime).Exec()

			//添加绑定关系
			sql = ` replace into t_user_open (useropenid,userid,roleid,openid,datastatus,updatetime) values 
				(?,?,?,?,?,?) `
			_, err.Msg = o.Raw(sql, useropenid, userid, 3, openid, 1, updatetime).Exec()

		} else { //手机号已注册
			userid = resStr.Item(0).Get("userid").String()
			name := resStr.Item(0).Get("name").String()
			picture := resStr.Item(0).Get("picture").String()

			//更新头像

			if name == "" {
				name = nickname
			} else {
				nickname = name
			}

			if picture == "" {
				picture = pic
			} else {
				pic = picture
			}

			sql = ` update t_doctor set name=?,picture=?,updatetime=? where doctorid=? `
			_, err.Msg = o.Raw(sql, name, picture, updatetime, userid).Exec()

			//添加绑定关系
			sql = ` replace into t_user_open (useropenid,userid,roleid,openid,datastatus,updatetime) values 
				(?,?,?,?,?,?) `
			_, err.Msg = o.Raw(sql, useropenid, userid, 3, openid, 1, updatetime).Exec()
		}

	} else { //已经有关联关系
		userid = obj.Item(0).Get("userid").String()
		name := obj.Item(0).Get("name").String()
		picture := obj.Item(0).Get("picture").String()

		if name == "" {
			name = nickname
		} else {
			nickname = name
		}

		if picture == "" {
			picture = pic
		} else {
			pic = picture
		}

		sql = ` update t_doctor set name=?,picture=?,updatetime=? where doctorid=? `
		_, err.Msg = o.Raw(sql, name, picture, updatetime, userid).Exec()
	}

	result.List.Set("headimgurl").SetString(pic)
	result.List.Set("nickname").SetString(nickname)
	result.List.Set("userid").SetString(userid)
	return result, err
}

func Comments(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "Comments"
	//评论类型
	commentid := gutils.CreateSTRGUID()
	updatetime := time.Now().Format("2006-01-02 15:04:05")
	commenttype := param.Get("commenttype").String()
	relationid := param.Get("relationid").String()
	param.Set("commentid").SetString(commentid)
	param.Set("commentdate").SetString(updatetime)
	param.Set("updatetime").SetString(updatetime)
	param.Set("datastatus").SetInt(1)
	param.Set("likenum").SetInt(0)
	param.Set("relationtype").SetInt(0)
	o := orm.NewOrm()
	if commenttype == "0" { //普通评论

		sql := ` insert into t_weclass_comments (commentid,relationid,relationtype,userid,userpicture,usernickname,commentinfo,commentdate,likenum,comefrom,commenttype,datastatus,updatetime) 
				values (:commentid,:relationid,:relationtype,:userid,:userpicture,:usernickname,:commentinfo,:commentdate,:likenum,:comefrom,:commenttype,:datastatus,:updatetime)	`
		_, err.Msg = o.RawJSON(sql, param).Exec()
	} else if commenttype == "1" { //回复评论--需要通知记录
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
		return
	}

	sql1 := `update t_weclass_class set commentnum=commentnum+1,updatetime=? where classid=? `
	_, err.Msg = o.Raw(sql1, updatetime, relationid).Exec() //评论数+1

	return result, err
}

func Likes(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "Likes"
	liketype := param.Get("liketype").String()
	islike := param.Get("islike").Int()
	guid := param.Get("guid").String()
	userid := param.Get("userid").String()
	if guid == "" || userid == "" {
		err.Errorf(gutils.ParamError, "guid和userid不能为空!")
		return
	}

	isFirst := false
	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select likeid,datastatus from t_weclass_likes where guid=? and userid =? ` //一个人对一个评论或课程只能有且仅有一条点赞记录
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&obj)
	likeid := obj.Item(0).Get("likeid").String()
	if likeid == "" {
		likeid = gutils.CreateSTRGUID()
		isFirst = true //说明是第一次点赞,这个课程或评论
	} else {
		datastatus := obj.Item(0).Get("datastatus").Int()
		if datastatus == 1 && islike == 1 {
			err.Errorf(gutils.ParamError, "已点赞!")
			return
		}

		if datastatus == 0 && islike == -1 {
			err.Errorf(gutils.ParamError, "已取消点赞!")
			return
		}
	}

	updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("likeid").SetString(likeid)
	param.Set("updatetime").SetString(updatetime)
	param.Set("relationtype").SetInt(0)

	if liketype == "0" { //点赞或取消点赞-课程
		sql = " update t_weclass_class set likenum=likenum+?,updatetime=? where classid=? "
		_, err.Msg = o.Raw(sql, islike, updatetime, guid).Exec()

		if islike == 1 {
			param.Set("datastatus").SetInt(1)
		} else {
			param.Set("datastatus").SetInt(0)
		}
		param.Set("relationid").SetString(guid)
		sql = ` replace into t_weclass_likes(likeid,relationid,relationtype,guid,userid,usernickname,userpicture,liketype,comefrom,datastatus,updatetime)
				values (:likeid,:relationid,:relationtype,:guid,:userid,:usernickname,:userpicture,:liketype,:comefrom,:datastatus,:updatetime)
					`
		_, err.Msg = o.RawJSON(sql, param).Exec()
	} else if liketype == "1" { //点赞、取消点赞 评论

		sql = " update t_weclass_comments set likenum=likenum+?,updatetime='" + updatetime + "' where commentid=?"
		_, err.Msg = o.Raw(sql, islike, guid).Exec()

		if islike == 1 {
			param.Set("datastatus").SetInt(1)
		} else {
			param.Set("datastatus").SetInt(0)
		}

		//写入通知消息
		if isFirst == true { //第一次点赞,需要插入数据
			var comObj config.LJSON
			sql = ` select commentinfo,userid,relationid,relationtype from t_weclass_comments where commentid=? ` //查询被点赞评论 人和内容/归属的文章和文章类型
			_, err.Msg = o.Raw(sql, guid).ValuesJSON(&comObj)
			ocommentinfo := comObj.Item(0).Get("commentinfo").String()
			ouserid := comObj.Item(0).Get("userid").String()
			relationid := comObj.Item(0).Get("relationid").String()
			relationtype := comObj.Item(0).Get("relationtype").String()

			param.Set("commentinfo").SetString(ocommentinfo)
			param.Set("relationid").SetString(relationid)
			param.Set("relationtype").SetString(relationtype)

			sql = ` insert into t_weclass_likes (likeid,relationid,relationtype,guid,userid,usernickname,userpicture,liketype,comefrom,commentinfo,datastatus,updatetime)
				values (:likeid,:relationid,:relationtype,:guid,:userid,:usernickname,:userpicture,:liketype,:comefrom,:commentinfo,:datastatus,:updatetime) `

			_, err.Msg = o.RawJSON(sql, param).Exec()
			//点赞消息
			sql = ` insert into t_weclass_msg (msgid,userid,identity,type,datastatus,updatetime) 
				values (?,?,?,?,?,?) `
			_, err.Msg = o.Raw(sql, gutils.CreateGUID(), ouserid, likeid, 1, 1, updatetime).Exec()
			keys := "weclass_msg_1" + ouserid
			gredis.Set(keys, updatetime)
		} else { //重复点赞只需要更新数据
			sql = ` update t_weclass_likes set usernickname=:usernickname,userpicture=:userpicture,comefrom=:comefrom,datastatus=:datastatus,liketype=:liketype,
					updatetime=:updatetime where likeid=:likeid `
			_, err.Msg = o.RawJSON(sql, param).Exec()
		}

	} else {
		err.Errorf(gutils.ParamError, "点赞类型错误")
	}
	return result, err
}

func DelComments(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DelComments"
	o := orm.NewOrm()
	var obj config.LJSON
	commentid := param.Get("commentid").String()
	if commentid == "" {
		err.Errorf(gutils.ParamError, "评论ID不能为空")
		return
	}
	sql := ` select userid from t_weclass_comments where commentid=? `
	_, err.Msg = o.Raw(sql, commentid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "评论不存在")
		return
	}
	userid := param.Get("userid").String()         //评论人
	userid_O := obj.Item(0).Get("userid").String() //删除人
	if userid != userid_O {
		err.Errorf(gutils.ParamError, "评论人非本人,无权删除!")
		return
	}

	sql = ` update t_weclass_comments set datastatus=0,updatetime=? where commentid=? `
	_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02 15:04:05"), commentid).Exec()
	return result, err
}
