//author:  罗云鹏 17-03-15
//purpose： 运营后台－诊所管理
package erp

import models "doggy/models/erp"

// ClinicController ERP关于用户管理的模块
type ClinicController struct {
	BaseERPController
}

// ERPClinicList 门诊列表
func (t *ClinicController) ERPClinicList() {
	if t.Ctx.Input.IsPost() {
		param := t.GetRequestJ()
		userslist := t.CheckJ(models.GetClinicList(param))
		t.Data["json"] = userslist
		t.ServeJSON()
	} else {
		t.TplName = "erp/dental/clinic_list.html"
	}
}

// ERPClinicView 会员查看详情
func (t *AccountController) ERPClinicView() {
	id := t.GetString(":id")
	info, _ := models.GetClinicInfo(id)
	t.Data["info"] = info.List.Item(0).Map()
	t.TplName = "erp/dental/clinic_detail.html"
}
