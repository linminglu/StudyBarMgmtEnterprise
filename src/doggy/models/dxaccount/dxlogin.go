//author:  龙智鹏 2019-1-8
//purpose： 义齿登陆主业务
package dxaccountmodels

import (
	"doggy/gutils"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)


func UserLogin(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	mobile := param.Get("mobile").String()
	o :=orm.NewOrm()
	sql :=` select u.userid,u.password,u.mobile,u.userno,d.name,d.email,d.picture,u.DataStatus,
			u.ReservePassword from t_user as u left join t_doctor as d on u.UserID=d.DoctorID where 
			  u.mobile = ? and u.roleid=3 and d.DataStatus=1 ` 
	var obj config.LJSON
	_,err.Msg=o.Raw(sql,mobile).ValuesJSON(&obj)	
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "手机号未注册")
		return
	}

	datastatus := obj.Item(0).Get("datastatus").Int()

	if datastatus == 0 {
		err.Errorf(gutils.ParamError, "账号已停用,请联系管理员解禁")
		return
	}

	dbPasswd := obj.Item(0).Get("password").String()
	password := param.Get("password").String()
	if dbPasswd != gutils.Md5(password) {
		err.Errorf(gutils.ParamError, "用户名或密码错误")
		return
	}	
	result.List.SetObject(*obj.Item(0))
	return 
}

func GetMobileUserInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetMobileUserInfo"
	o := orm.NewOrm()
	_, err.Msg = o.RawJSON("select u.userid,u.password,u.mobile,u.userno,d.name,d.email,d.picture,u.DataStatus,u.ReservePassword from t_user as u left join t_doctor as d on u.UserID=d.DoctorID where u.mobile = :mobile and u.roleid=3 and d.DataStatus=1", param).ValuesJSON(&result.List)
   
	return
}
