//author:  罗云鹏 17-03-15
//purpose： 运营后台－账户管理
package erp

import (
	"doggy/gutils"
	models "doggy/models/erp"
)

// AccountController ERP关于用户管理的模块
type AccountController struct {
	BaseERPController
}

// Prepare 是BaseERP控制器运行前的预备方法
func (t *AccountController) Prepare() {
	t.BaseERPController.Prepare()
	//检测权限
	if t.UserAuth == false {
		t.Abort("401")
	}
}

// ERPAccountSwitchPassword 用户密码修改页面
func (t *AccountController) ERPAccountSwitchPassword() {
	if t.Ctx.Input.IsPost() {
		var data gutils.LResultAjax
		param := t.GetRequestJ()
		password := param.Get("password").String()
		passagain := param.Get("passagain").String()
		userid := t.UserID

		if password == "" || passagain == "" {
			data.Code = 0
			data.Info = "请确认已填写新密码"
			t.Data["json"] = data
			t.ServeJSON()
			return
		}

		if password != passagain {
			data.Code = 0
			data.Info = "请确认重复输入密码一致"
			t.Data["json"] = data
			t.ServeJSON()
			return
		}
		data.Code, data.Info = models.ModifyPassword(userid, password)
		t.Data["json"] = data
		t.ServeJSON()
	} else {
		t.Data["usercode"] = t.UserID
		t.Data["username"] = t.UserName
		t.TplName = "erp/account/swicthpass.html"
	}
}

// ERPAccountsList 会员管理列表
func (t *AccountController) ERPAccountsList() {
	if t.Ctx.Input.IsPost() {
		param := t.GetRequestJ()
		userslist := t.CheckJ(models.GetUsersList(param))
		t.Data["json"] = userslist
		t.ServeJSON()
	} else {
		t.TplName = "erp/account/userslist.html"
	}
}

// ERPAccountView 会员查看详情
func (t *AccountController) ERPAccountView() {
	id := t.GetString(":id")
	userinfo, _ := models.GetUserInfo(id)
	t.Data["info"] = userinfo.List.Item(0).Map()
	t.TplName = "erp/account/userinfo.html"
}
