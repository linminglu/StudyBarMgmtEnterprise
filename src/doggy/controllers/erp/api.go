//author:  罗云鹏 17-03-15
//purpose： 运营后台－接口
package erp

import (
	"doggy/gutils"
	models "doggy/models/erp"
)

// MessageAPIController ERP关于消息推送管理的模块
type MessageAPIController struct {
	BaseERPFrontController
}

func authAPI(username, password string) bool {
	DituiUser, _ := models.GetLoginInfo(username, password)
	if DituiUser.List.ItemCount() <= 0 {
		return false
	}

	return true

}

// APIAPPDoctor 手机APP获取信息
func (t *MessageAPIController) APIAPPDoctor() {

	param := t.GetRequestJ()
	var data gutils.LResultAjax

	username := param.Get("username").String()
	password := param.Get("password").String()
	isLogin := authAPI(username, password)

	if !isLogin {
		data.Code = 0
		data.Info = "请填写正确用户名和密码"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}

	result := t.CheckJ(models.GetAPIAPPDoctor(param))

	t.Data["json"] = result
	t.ServeJSON()
}

// APIPCDoctor PC获取信息
func (t *MessageAPIController) APIPCDoctor() {

	param := t.GetRequestJ()
	var data gutils.LResultAjax

	username := param.Get("username").String()
	password := param.Get("password").String()
	isLogin := authAPI(username, password)

	if !isLogin {
		data.Code = 0
		data.Info = "请填写正确用户名和密码"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}

	result := t.CheckJ(models.GetAPIPCDoctor(param))
	t.Data["json"] = result
	t.ServeJSON()
}

// APIPCDental 手机APP获取信息
func (t *MessageAPIController) APIPCDental() {

	param := t.GetRequestJ()
	var data gutils.LResultAjax

	username := param.Get("username").String()
	password := param.Get("password").String()
	isLogin := authAPI(username, password)

	if !isLogin {
		data.Code = 0
		data.Info = "请填写正确用户名和密码"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}

	result := t.CheckJ(models.GetAPIPCDental(param))
	t.Data["json"] = result
	t.ServeJSON()
}

// APIClicked 标注用户已经点击
func (t *MessageAPIController) APIClicked() {

	param := t.GetRequestJ()

	result := t.CheckJ(models.APIClick(param))
	t.Data["json"] = result
	t.ServeJSON()
}
