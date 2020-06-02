
//author:  龙智鹏 2019-1-8
//purpose： 义齿账号注册

package dxaccount

import (
	"doggy/gutils"
	"doggy/models/dxaccount"
	"github.com/astaxie/beego/config"
)



//注册之发送验证码
func (t *LDxDocController) SendRegCode() {
	var data gutils.LResultAjax
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()

	if mobile == "" {
		data.Code = 0
		data.Info = "手机号码不能为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	if gutils.CheckSign(param, t.AccessKeySecret, "mobile") == false {
		t.ErrorJ("AccessKey验证失败")
		return
	} 
	var checkparam config.LJSON
	checkparam.Set("mobile").SetString(mobile)
	users, err := dxaccountmodels.GetMobileUserInfo(checkparam)
	if err.Msg != nil {
		data.Code = 0
		data.Info =err.Msg.Error()
		t.Data["json"] = data
		t.ServeJSON()
		return
		
	}
	user := users.List
	if user.ItemCount() >= 1 {
		data.Code = 0
		data.Info = "该手机号已注册，请更换其他手机号"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}

	funcidverify := gutils.FUNC_DX_DOC_REGISTER
	funcid := 20100
	sendstatus := dxaccountmodels.SendMobileCode(mobile, funcidverify, funcid)
	if sendstatus {
		data.Code = 1
		data.Info = "发送成功"
	} else {
		data.Code = 0
		data.Info = "发送失败"
	}
	t.Data["json"] = data
	t.ServeJSON()

}

//验证注册手机验证码
func (t *LDxDocController) CheckRegCode() {
	//手机号 验证码
	var data gutils.LResultAjax
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	code := param.Get("code").String()
	if mobile == "" {
		data.Code = 0
		data.Info = "手机号码不能为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	if code == "" {
		data.Code = 0
		data.Info = "验证码为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	if gutils.CheckSign(param, t.AccessKeySecret, "mobile","code") == false {
		t.ErrorJ("AccessKey验证失败")
		return
	} 
	funcidverify := 20105
	checkStatus, info := dxaccountmodels.CheckMobileCode(mobile, code, funcidverify)
	if !checkStatus {
		data.Code = 0
		data.Info = "验证码错误"
	} else {
		data.Code = 1
		data.Info = "验证码正确"
	}
	data.Info = info
	t.Data["json"] = data
	t.ServeJSON()
}

//判断手机号是否注册
func (t *LDxDocController) CheckUserExist() {
	//验证手机号的账号是否存在
	var data gutils.LResultAjax
	param := t.GetRequestJ()
	users, err := dxaccountmodels.GetMobileUserInfo(param)
	if err.Msg != nil {
		data.Code = 0
		data.Info = err.Msg.Error()
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	user := users.List
	if user.ItemCount() >= 1 {
		data.Code = 0
		data.Info = "该手机号已注册，请更换其他手机号"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}

	data.Code = 1
	data.Info = "用户未注册"
	t.Data["json"] = data
	t.ServeJSON()
	return
}

//注册，生成账号 判断是否重复 验证码验证
func (t *LDxDocController) Register()  {
	var data gutils.LResultAjax
	var checkparam config.LJSON
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	code := param.Get("code").String()
	password := param.Get("password").String()

	if mobile == "" {
		data.Code = 0
		data.Info = "手机号不能为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	if password == "" {
		data.Code = 0
		data.Info = "密码不能为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	if code == "" {
		data.Code = 0
		data.Info = "验证码不能为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	} 
	if gutils.CheckSign(param, t.AccessKeySecret, "mobile","code","password") == false {
		t.ErrorJ("AccessKey验证失败")
		return
	} 
	//验证验证码
	funcidverify := gutils.FUNC_DX_DOC_REGISTER
	checkStatus, _ := dxaccountmodels.CheckMobileCode(mobile, code, funcidverify)
	if !checkStatus {
		data.Code = 0
		data.Info = "验证码错误"
		t.Data["json"] = data
		t.ServeJSON()
		return
	} 

	//验证手机号的账号是否存在
	checkparam.Set("mobile").SetString(mobile)
	users, err := dxaccountmodels.GetMobileUserInfo(checkparam)
	if err.Msg != nil {
		data.Code = 0
		data.Info =err.Msg.Error()
		t.Data["json"] = data
		t.ServeJSON()
		return
		
	}
	user := users.List
	if user.ItemCount() >= 1 {
		data.Code = 0
		data.Info ="该手机号已注册，请更换其他手机号"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}

	//条件通过之后，进行数据库的写入
	newuser := t.CheckJM(dxaccountmodels.UserReg(param))
	data.Code = 1
	data.Info ="注册成功"
	data.List = newuser.List.Interface()
	t.Data["json"] = data
	t.ServeJSON()

}