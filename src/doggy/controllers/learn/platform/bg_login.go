/*
	学习吧后台登录
*/
package platform

import (
	"doggy/controllers/base"
	"doggy/gutils"
	"doggy/models/learn/platforms"
)

type PLoginController struct {
	base.LBaseController
}

func (t *PLoginController) LoginPage() {
	t.TplName = "erp/collegenew/studybar_login.html"
}

//UserLogin 账号密码登录
func (t *PLoginController) UserLogin() {
	var data gutils.LResultAjax
	param := t.GetRequestJ()
	res, err := platforms.UserLogin(param)
	if err.Msg != nil {
		data.Code = 0
		data.Info = err.Msg.Error()
	} else {
		userid := res.List.Get("userid").String()
		roleDesc := res.List.Get("roledesc").String()
		role := res.List.Get("role").String()
		sessionStr := userid + "|" + role + "|" + roleDesc
		t.SetSession("learn_session", sessionStr)
		data.Code = 1
		data.Info = "ok"
		data.List = res.List.Interface()
		if res.TotalList.Interface() != nil {
			data.Main = res.TotalList.Interface()
		}
		data.Command = res.Command
		data.PageNo = res.PageNo
		data.PageSize = res.PageSize
		data.TotalCount = res.TotalCount
	}
	t.Data["json"] = data
	t.ServeJSON()
}

//SendCode 发送验证码
func (t *PLoginController) SendCode() {
	param := t.GetRequestJ()
	res := t.CheckJ(platforms.SendCode(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//CodeLogin 验证码登录
func (t *PLoginController) CodeLogin() {
	var data gutils.LResultAjax
	param := t.GetRequestJ()
	res, err := platforms.CodeLogin(param)
	if err.Msg != nil {
		data.Code = 0
		data.Info = err.Msg.Error()
	} else {
		userid := res.List.Get("userid").String()
		roleDesc := res.List.Get("roledesc").String()
		role := res.List.Get("role").String()
		sessionStr := userid + "|" + role + "|" + roleDesc
		t.SetSession("learn_session", sessionStr)
		data.Code = 1
		data.Info = "ok"
		data.List = res.List.Interface()
		if res.TotalList.Interface() != nil {
			data.Main = res.TotalList.Interface()
		}
		data.Command = res.Command
		data.PageNo = res.PageNo
		data.PageSize = res.PageSize
		data.TotalCount = res.TotalCount
	}
	t.Data["json"] = data
	t.ServeJSON()
}
