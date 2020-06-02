/*
	登录接口
*/

package platforms

import (
	"doggy/gutils"
	//"fmt"

	"regexp"
	"time"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

//UserLogin 牙医管家APP的账号体系
func UserLogin(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UserLogin"
	mobile := param.Get("mobile").String()
	if mobile == "" {
		err.Errorf(gutils.ParamError, "手机号不能为空")
		return
	}
	o := orm.NewOrm()  
	
	sql := ` select u.password,bu.userid,r.roledesc,bu.role,bu.datastatus,u.mobile,ifnull(d.roomname,d.name) as name,ifnull(d.roompicture,d.picture) as picture
			from db_flybear.t_user u inner join db_flybear.t_college_bg_user bu on 
			u.userid=bu.userid 
			inner join db_flybear.t_doctor d on d.doctorid = u.userid 
			left join db_flybear.t_college_bg_role r on bu.role=r.role
	 		where u.mobile=? and u.roleid=3 `
	var obj config.LJSON
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&obj)

	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "账号不存在,请联系管理员添加")
		return
	}

	datastatus := obj.Item(0).Get("datastatus").Int()

	if datastatus == 0 {
		err.Errorf(gutils.ParamError, "账号已停用,请联系管理员解禁")
		return
	}

	dbPasswd := obj.Item(0).Get("password").String()
	password := param.Get("password").String()

	if dbPasswd != password {
		err.Errorf(gutils.ParamError, "密码错误")
		return
	}
	userid := obj.Item(0).Get("userid").String()
	sql = ` update db_flybear.t_college_bg_user set lastlogintime=?,updatetime=? where userid=? `
	_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02 15:04:05"), time.Now().Format("2006-01-02 15:04:05"), userid).Exec()
	result.List.SetObject(*obj.Item(0))
	return
}

//CodeLogin
func CodeLogin(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CodeLogin"
	mobile := param.Get("mobile").String()
	if mobile == "" {
		err.Errorf(gutils.ParamError, "手机号不能为空")
		return
	}

	code := param.Get("code").String()
	if code == "" {
		err.Errorf(gutils.ParamError, "验证码不能为空")
		return
	}

	o := orm.NewOrm()
	sql := "SELECT Code,Updatetime,mobile FROM t_sys_code WHERE UserID=? AND FuncID=? AND Code=?"
	var obj config.LJSON
	num, _ := o.Raw(sql, mobile, gutils.FUNC_ID_LEARN_LOGIN, code).ValuesJSON(&obj)
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

	sql = ` select u.password,bu.userid,r.roledesc,bu.role,bu.datastatus,u.mobile,d.name,d.picture
	from db_flybear.t_user u inner join db_flybear.t_college_bg_user bu on 
	u.userid=bu.userid 
	inner join db_flybear.t_doctor d on d.doctorid = u.userid 
	left join db_flybear.t_college_bg_role r on bu.role=r.role
	 where u.mobile=? and u.roleid=3 `
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&obj)

	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "账号不存在,请联系管理员添加")
		return
	}

	datastatus := obj.Item(0).Get("datastatus").Int()

	if datastatus == 0 {
		err.Errorf(gutils.ParamError, "账号已停用,请联系管理员解禁")
		return
	}

	userid := obj.Item(0).Get("userid").String()
	sql = ` update db_flybear.t_college_bg_user set lastlogintime=?,updatetime=? where userid=? `
	_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02 15:04:05"), time.Now().Format("2006-01-02 15:04:05"), userid).Exec()

	result.List.SetObject(*obj.Item(0))
	return
}

//SendCode 发送验证码
func SendCode(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SendCode"

	mobile := param.Get("mobile").String() //手机号
	res := false
	res, err.Msg = regexp.Match("^((1[3|4|5|6|7|8|9][0-9]{9})|(15[89][0-9]{8}))$", []byte(mobile))
	if err.Msg != nil {
		return
	}

	if res == false {
		err.Errorf(gutils.ParamError, "手机号无效")
		return
	}

	o := orm.NewOrm()

	sql := ` select u.password,bu.userid,r.roledesc,bu.role,bu.datastatus
			from db_flybear.t_user u inner join db_flybear.t_college_bg_user bu on 
			u.userid=bu.userid 
			left join db_flybear.t_college_bg_role r on bu.role=r.role
	 		where u.mobile=? and u.roleid=3 `
	var obj config.LJSON
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "账号不存在")
		return
	}

	//发送验证码
	var data config.LJSON
	data.Set("funcid").SetInt(20100)
	data.Set("mobile").SetString(mobile)
	data.Set("funcidverify").SetInt(gutils.FUNC_ID_LEARN_LOGIN) //随便用个
	api := gutils.FlybearCPlus(data)
	code := api.Get("code").Int()
	if code == 0 {
		err.Errorf(gutils.ParamError, "验证码发送失败")
		return
	}

	return result, err
}
