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

	// 项目重构Alias
	beego.Router("/butlerp", &erp.BaseERPFrontController{}, "get,post:ERPAdminIndex")
	beego.Router("/message/popup/:id", &erp.BaseERPFrontController{}, "get:MessagePopup")              // PC弹窗
	beego.Router("/message/popupsvr/:id/:msgid", &erp.BaseERPFrontController{}, "get:MessagePopupSvr") // PC服务器弹窗
	beego.Router("/message/redirect", &erp.BaseERPFrontController{}, "get:MessageRedirect")            // 重定向

	// 后台基本操作
	beego.Router("/butlerp/dashboard", &erp.BaseERPController{}, "get:Dashboard")
	beego.Router("/butlerp/logout", &erp.BaseERPController{}, "post:ERPLogout")

	// 通用操作
	beego.Router("/butlerp/uploadimage", &erp.BaseERPController{}, "post:ERPUploadImg")
}
