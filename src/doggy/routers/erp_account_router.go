package routers

import (
	"doggy/controllers/erp"

	"github.com/astaxie/beego"
)

func init() {
	version, _ := beego.AppConfig.Int("version")
	if version == 0 {
		version = 99999 //不设置的时候默认为开发版本，发布所有路由
	}
	if version <= 1001 {
		return
	}

	beego.Router("/butlerp/account/switchpass", &erp.AccountController{}, "get,post:ERPAccountSwitchPassword") // 账号修改密码
	beego.Router("/butlerp/users", &erp.AccountController{}, "get,post:ERPAccountsList")                       // 用户列表
	beego.Router("/butlerp/users/:id/info", &erp.AccountController{}, "get:ERPAccountView")                    // 用户查看详情

	beego.Router("/butlerp/clinics", &erp.ClinicController{}, "get,post:ERPClinicList")      // 门诊列表
	beego.Router("/butlerp/clinics/:id/info", &erp.AccountController{}, "get:ERPClinicView") //门诊详情
}
