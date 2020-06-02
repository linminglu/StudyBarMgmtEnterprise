//author:  龙智鹏 2019-1-8
//purpose： 义齿账号登陆
package dxaccount

import (
	"doggy/gutils"
	"doggy/models/dxaccount"
	"github.com/astaxie/beego/config"
	"regexp"
)

//医生密码登陆
func  (t *LDxDocController)  DxDocLogin() {
		var data gutils.LResultAjax
		var checkparam config.LJSON
		param := t.GetRequestJ()
		mobile := param.Get("mobile").String()
		password:=param.Get("password").String()
		if mobile == "" {
			data.Code = 0
			data.Info = "手机号不能为空"
			t.Data["json"] = data
			t.ServeJSON()
			return
		}
		if gutils.CheckSign(param, t.AccessKeySecret, "mobile","password") == false {
			t.ErrorJ("AccessKey验证失败")
			return
		} 
		checkparam.Set("mobile").SetString(mobile)
		checkparam.Set("password").SetString(password)
		users, err := dxaccountmodels.UserLogin(checkparam)
		if err.Msg != nil {
			data.Code = 0
			data.Info =err.Msg.Error()
			t.Data["json"] = data
			t.ServeJSON()
		} else {
			data.Code=1
			data.Info="登陆成功"
			data.List = users.List.Interface()
			t.Data["json"] = data
			t.ServeJSON()
		}
		
	return
}

// 验证码登陆发送验证码
func (t *LDxDocController) DxDocCodeLoginSendCode() {
	var data gutils.LResultAjax
	var checkparam config.LJSON
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	if mobile == ""{
		t.ErrorJ("手机号不能为空")
		return
	} 	
	res := false
	res, _ = regexp.Match("^((1[3|4|5|6|7|8|9][0-9]{9})|(15[89][0-9]{8}))$", []byte(mobile))

	if res == false {
		t.ErrorJ("手机号无效")
		return
	}
	if gutils.CheckSign(param, t.AccessKeySecret, "mobile") == false {
		t.ErrorJ("AccessKey验证失败")
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
	if user.ItemCount() == 0 {
		data.Code = 0
		data.Info ="该手机账号不存在，请先注册"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}

	funcidverify := gutils.FUNC_DX_DOC_CODELOGIN
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
	return
}



//验证码登陆
func (t *LDxDocController) DxDocCodeLogin() {
	var data gutils.LResultAjax
	var checkparam config.LJSON
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	code := param.Get("code").String()
	if mobile == ""{
		t.ErrorJ("手机号不能为空")
	} 

	if code == "" {
		data.Code = 0
		data.Info = "验证码不能为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	} 
	if gutils.CheckSign(param, t.AccessKeySecret, "mobile","code") == false {
		t.ErrorJ("AccessKey验证失败")
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
	user:= users.List
	if user.ItemCount() == 0 {
		data.Code = 0
		data.Info ="账号不存在"
		t.Data["json"] = data
		t.ServeJSON()
		return	
	}
	//验证验证码
	funcidverify := gutils.FUNC_DX_DOC_CODELOGIN
	checkStatus, err1 := dxaccountmodels.CheckMobileCode(mobile, code, funcidverify)
	if !checkStatus {
		data.Code = 0
		if err1==""{
		   err1="验证码错误"
		}
		data.Info = err1
		t.Data["json"] = data
		t.ServeJSON()
		return
	} 

	data.Code = 1
	data.Info = "登陆成功"
	data.List =users.List.Item(0).Interface() 
	t.Data["json"] = data
	t.ServeJSON()
	return 
}


//忘记密码
func (t *LDxDocController) ForgetPasswordSend()  {

	var data gutils.LResultAjax
	var checkparam config.LJSON
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	if mobile == ""{
		t.ErrorJ("手机号不能为空")
		return
	} 	
	if gutils.CheckSign(param, t.AccessKeySecret, "mobile") == false {
		t.ErrorJ("AccessKey验证失败")
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
	if user.ItemCount() == 0 {
		data.Code = 0
		data.Info ="该账号不存在"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}

	funcidverify := gutils.FUNC_DX_DOC_FORGETPASSWORD
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
	return
}

//忘记密码确认
func (t *LDxDocController) ForgetPasswordConform () {
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
	if user.ItemCount() == 0 {
		data.Code = 0
		data.Info ="账号不存在"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	//验证验证码
	userid:=users.List.Item(0).Get("userid").String()
	funcidverify := gutils.FUNC_DX_DOC_FORGETPASSWORD
	checkStatus, _ := dxaccountmodels.CheckMobileCode(mobile, code, funcidverify)
	if !checkStatus {
		data.Code = 0
		data.Info = "验证码错误"
		t.Data["json"] = data
		t.ServeJSON()
		return
	} 
	param.Set("userid").SetString(userid)
	res := t.CheckJ(dxaccountmodels.ResetAllPassword(param))
	t.Data["json"] = res
	t.ServeJSON()
	return
}

// 加工厂忘记密码发送
func (t *LDxDocController) FacForgetPassSend()  {

	var data gutils.LResultAjax
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	if mobile == ""{
		t.ErrorJ("手机号不能为空")
		return
	} 	
	if gutils.CheckSign(param, t.AccessKeySecret, "mobile") == false {
		t.ErrorJ("AccessKey验证失败")
		return
	} 
	funcidverify := gutils.FUNC_DX_FAC_FORGETPASSWORD
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
	return
}
//修改密码确认
func (t *LDxDocController) FacUpdatepass()  {
	var data gutils.LResultAjax
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	code := param.Get("code").String()
	if mobile == ""{
		t.ErrorJ("手机号不能为空")
		return
	} 
	if code == ""{
		t.ErrorJ("验证码不能为空")
		return
	} 
	if gutils.CheckSign(param, t.AccessKeySecret, "mobile","code") == false {
		t.ErrorJ("AccessKey验证失败")
		return
	} 
	funcidverify := gutils.FUNC_DX_FAC_FORGETPASSWORD
	checkStatus, _ := dxaccountmodels.CheckMobileCode(mobile, code, funcidverify)
	if !checkStatus {
		data.Code = 0
		data.Info = "验证码错误"
		t.Data["json"] = data
		t.ServeJSON()
		return
	} 
	data.Code = 1
	data.Info = "发送成功"
	t.Data["json"] = data
	t.ServeJSON()
	return
}
 
