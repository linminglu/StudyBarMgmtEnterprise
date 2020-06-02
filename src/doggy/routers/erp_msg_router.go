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

	beego.Router("/butlerp/message/doc", &erp.MessageController{}, "get:ERPMessagesDoc") // 消息路由文档界面

	beego.Router("/butlerp/message", &erp.MessageController{}, "get,post:ERPMessagesList")                     // 消息列表
	beego.Router("/butlerp/message/addition", &erp.MessageController{}, "get:ERPMessagesAddition")             // 添加消息的页面
	beego.Router("/butlerp/message/doadd", &erp.MessageController{}, "post:ERPMessagesDoAdd")                  // 消息插入
	beego.Router("/butlerp/message/:id/edition", &erp.MessageController{}, "get:ERPMessagesEdition")           // 编辑消息
	beego.Router("/butlerp/message/:id/doedit", &erp.MessageController{}, "post:ERPMessagesDoEdit")            // 更新消息
	beego.Router("/butlerp/message/dentalexcel", &erp.MessageController{}, "post:UploadExcel")                 // 通过Excel上传
	beego.Router("/butlerp/message/:id/viewdetail", &erp.MessageController{}, "get,post:ERPMessageViewDetail") // 查看详情
	beego.Router("/butlerp/message/getmerchant", &erp.MessageController{}, "post:GetMerchant")                 // 获取经销商列表
	beego.Router("/butlerp/message/:id/send", &erp.MessageController{}, "post:SendMessage")                    // 发送消息
	beego.Router("/butlerp/message/dentalname", &erp.MessageController{}, "post:DentalName")                   // 发送消息

	beego.Router("/butlerp/message/api/pcdoctor", &erp.MessageAPIController{}, "post:APIPCDoctor")   // PC医生获取
	beego.Router("/butlerp/message/api/pcdental", &erp.MessageAPIController{}, "post:APIPCDental")   // PC诊所获取
	beego.Router("/butlerp/message/api/appdoctor", &erp.MessageAPIController{}, "post:APIAPPDoctor") // APP获取
	beego.Router("/butlerp/message/api/clicked", &erp.MessageAPIController{}, "post:APIClicked")     // 点击事件

	//推送渠道管理 yzp
	beego.Router("/butlerp/message/pushentry", &erp.MessageController{}, "get:PushEntryIndex")          //渠道列表入口
	beego.Router("/butlerp/message/pushlist", &erp.MessageController{}, "get:PushList")                 //单渠道列表入口
	beego.Router("/butlerp/message/getpushlist", &erp.MessageController{}, "get:GetPushlist")           //单渠道列表数据
	beego.Router("/butlerp/message/getpushlist/:id", &erp.MessageController{}, "get:GetPushlistDetail") //单渠道列表数据
	beego.Router("/butlerp/message/updateid", &erp.MessageController{}, "get:UpdateId")                 //更新对应id状态
}
