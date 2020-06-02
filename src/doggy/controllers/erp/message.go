//author:  罗云鹏 17-03-15
//purpose： 运营后台－消息推送
package erp

import (
	"doggy/gutils"
	"doggy/models/erp"
	"fmt"
)

// MessageController ERP关于消息推送管理的模块
type MessageController struct {
	BaseERPController
}

// Prepare 是BaseERP控制器运行前的预备方法
func (t *MessageController) Prepare() {
	t.BaseERPController.Prepare()
	//检测权限
	if t.NoticeAuth == false {
		t.Abort("401")
	}
}

// ERPMessagesList 消息管理列表
func (t *MessageController) ERPMessagesList() {
	if t.Ctx.Input.IsPost() {
		param := t.GetRequestJ()
		result := t.CheckJ(models.GetMessagesList(param))
		t.Data["json"] = result
		t.ServeJSON()
	} else {
		t.TplName = "erp/message/messageslist.html"
	}
}

// GetData 获取了所有的信息模板
func (t *MessageController) GetData() {
	param := t.GetRequestJ()

	result := t.CheckJ(models.GetMessagesList(param))
	t.Data["json"] = result
	t.ServeJSON()
}

// ERPMessagesAddition 消息添加
func (t *MessageController) ERPMessagesAddition() {
	t.TplName = "erp/message/messagesform.html"
}

// ERPMessagesDoAdd 消息添加
func (t *MessageController) ERPMessagesDoAdd() {
	param := t.GetRequestJ()

	fmt.Println(param.ToString())
	result := t.CheckJ(models.SaveMessage(param))

	t.Data["json"] = result
	t.ServeJSON()
}

// ERPMessagesEdition 消息添加
func (t *MessageController) ERPMessagesEdition() {
	t.TplName = "erp/message/messagesform.html"
}

// ERPMessagesDoEdit 消息添加
func (t *MessageController) ERPMessagesDoEdit() {
	param := t.GetRequestJ()

	notifyID := t.GetString(":id")
	param.Set("MessageID").SetString(notifyID)
	fmt.Println(param.ToString())
	result := t.CheckJ(models.SaveMessage(param))

	t.Data["json"] = result
	t.ServeJSON()
}

// ERPMessagesDoc 前端文档
func (t *MessageController) ERPMessagesDoc() {
	t.TplName = "erp/message/messagesdoc.html"
}

// ERPMessageViewDetail 消息查看详情
func (t *MessageController) ERPMessageViewDetail() {
	if t.Ctx.Input.IsPost() {
		id := t.GetString(":id")
		detail, _ := models.GetMessageDetail(id)
		var result gutils.LResultAjax
		result.Code = 1
		result.Info = id
		result.List = detail.Interface()
		t.Data["json"] = result
		t.ServeJSON()
	} else {
		t.TplName = "erp/message/messagesview.html"
	}
}

// UploadExcel 通过Excel导入诊所
func (t *MessageController) UploadExcel() {
	var result gutils.LResultAjax
	var err gutils.LError
	var src string

	filedata := t.GetString("filedata")
	extname := t.GetString("extname") //后缀名字的判断
	notifyID := t.GetString("notifyid")

	src, err = t.SaveFile(filedata, extname)
	if err.Msg != nil {
		result.Code = 0
		result.Info = err.Msg.Error()
		t.Data["json"] = result
		t.ServeJSON()
		return
	}

	// 读取Excel
	excelFileName := src
	res, err := t.ReadExcel(excelFileName)
	if err.Msg != nil {
		result.Code = 0
		result.Info = err.Msg.Error()
		t.Data["json"] = result
		t.ServeJSON()
		return
	}

	fmt.Println(res)

	dentalsList, err3 := models.ImportDentals(res, notifyID) //这里格式化导入数据

	if err3.Msg != nil {
		//获取数据有问题提示
		result.Code = 0
		result.Info = err3.Msg.Error()
		result.List = dentalsList.Interface()
		t.Data["json"] = result
		t.ServeJSON()
	} else {
		//没有问题提交了
		result.Code = 1
		result.Info = notifyID
		result.List = dentalsList.Interface()
		t.Data["json"] = result
		t.ServeJSON()
	}

}

// GetMerchant 获取系统中的经销商
func (t *MessageController) GetMerchant() {
	param := t.GetRequestJ()

	result := t.CheckJ(models.GetMerchantList(param))

	t.Data["json"] = result
	t.ServeJSON()
}

// SendMessage 消息推送出去
func (t *MessageController) SendMessage() {
	param := t.GetRequestJ()

	notifyID := t.GetString(":id")
	param.Set("MessageID").SetString(notifyID)
	result := t.CheckJ(models.SendMessage(param))

	t.Data["json"] = result
	t.ServeJSON()
}

// DentalName 获取诊所名
func (t *MessageController) DentalName() {
	param := t.GetRequestJ()

	result := t.CheckJ(models.DentalName(param))

	t.Data["json"] = result
	t.ServeJSON()
}

//推送渠道列表入口页
func (t *MessageController) PushEntryIndex() {
	t.TplName = "erp/message/pushrntryindex.html"
}

//推送渠道列表入口页  PushList
func (t *MessageController) PushList() {
	t.TplName = "erp/message/pushlist.html"
}

//对应推送渠道banner列表  带分页信息
//1官网首页 2官网登录页 3app端牙医管家首页 4 pc专业版登入 5pc标准版登入 6官网个人中心活动 7官网牙医社区 8 各平台消息中心/各平台弹窗提醒'
func (t *MessageController) GetPushlist() {
	param := t.GetRequestJ()
	param.Set("banner_type").SetString("2")
	result := t.CheckJ(models.ChannelBannerList(param))

	t.Data["json"] = result
	t.ServeJSON()
}

//对应数据详情
func (t *MessageController) GetPushlistDetail() {
	fileID := t.GetString(":id")
	result := t.CheckJ(models.ChannelBannerListDetail(fileID))
	t.Data["detail"] = result
	t.TplName = "erp/message/pushlistdetail.html"
}

//状态更新   1下架 2上移 3下移 4删除
func (t *MessageController) UpdateId() {
	param := t.GetRequestJ()
	result := t.CheckJ(models.DoUpdateId(param))

	t.Data["json"] = result
	t.ServeJSON()
}
