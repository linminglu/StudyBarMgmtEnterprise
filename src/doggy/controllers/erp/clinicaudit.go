//author:  于绍纳 2017-03-09
//purpose： 后台诊所审核模块
package erp

import (
	models "doggy/models/erp"

	"github.com/astaxie/beego/config"
)

// ClinicAuditController ERP关于用户管理的模块
type ClinicAuditController struct {
	BaseERPController
}

// Prepare 是BaseERP控制器运行前的预备方法
func (t *ClinicAuditController) Prepare() {
	t.BaseERPController.Prepare()
	//检测权限
	if t.ClinicAuth == false {
		//t.Abort("401")
		t.Redirect("/butlerp/dashboard", 302)
	}
}

//---------------------------------------------------------------------
func (t *ClinicAuditController) ImportPage() {
	t.TplName = "erp/clinicaudit/importpage.html"
}

//批量导入诊所
func (t *ClinicAuditController) ImportClinic() {
	var param config.LJSON
	param.Set("picdata").SetString(t.GetString("picdata"))
	param.Set("ext").SetString(t.GetString("ext"))
	result := t.CheckJ(models.ImportClinic(param))
	t.Data["json"] = result
	t.ServeJSON()
}

//删除待完善数据
func (t *ClinicAuditController) DelClinic() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DelClinic(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//待完善页
func (t *ClinicAuditController) FinishPage() {
	t.TplName = "erp/clinicaudit/finishpage.html"
}

//待完善页数据
func (t *ClinicAuditController) FinishPageData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.FinishPageData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//待审核诊所进行修改(微调)
func (t *ClinicAuditController) ModifyApply() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModifyApply(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//门诊添加网页
func (t *ClinicAuditController) AddClinic() {
	t.TplName = "erp/clinicaudit/addclinic.html"
}

//获取管家号列表
func (t *ClinicAuditController) GetDental() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetDental(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//后台-客服(提交审核)
func (t *ClinicAuditController) CommitApply() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.CommitApply(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//平安验证(已经签约的诊所网页)
func (t *ClinicAuditController) SignClinic() {
	t.TplName = "erp/clinicaudit/signclinic.html"
}

//平安验证(已经签约的诊所数据)
func (t *ClinicAuditController) SignClinicData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignClinicData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//平安验证(平安key和伙伴ID)
func (t *ClinicAuditController) ModifyData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModifyData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// ERPClinicAuditList 门诊审核列表
func (t *ClinicAuditController) ERPClinicAuditList() {
	if t.Ctx.Input.IsPost() {
		param := t.GetRequestJ()
		cliniclist := t.CheckJ(models.GetClinicAuditList(param))
		t.Data["json"] = cliniclist
		t.ServeJSON()
	} else {
		t.TplName = "erp/clinicaudit/clinicauditlist.html"
	}
}

//审核  重审 页面
func (t *ClinicAuditController) ExamineEnter() {
	param := t.GetRequestJ()
	recordlist := t.Check(models.DoExamineEnter(param))
	t.Data["infolist"] = recordlist.List.Interface()
	t.TplName = "erp/clinicaudit/ExamineEnter.html"
}

//审核  重审 结果提交
func (t *ClinicAuditController) ExamineResult() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DoExamineResult(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//签约 1  取消签约 2  重新签约 3  type
func (t *ClinicAuditController) SignUp() {
	param := t.GetRequestJ()
	cliniclist := t.CheckJ(models.DoSignUp(param))
	t.Data["json"] = cliniclist
	t.ServeJSON()
}

//查看页面
func (t *ClinicAuditController) ViewAuditEnter() {
	t.TplName = "erp/clinicaudit/viewaudit.html"
}

//查看数据
func (t *ClinicAuditController) ViewAudit() {
	param := t.GetRequestJ()
	cliniclist := t.CheckJ(models.DoViewAudit(param))
	t.Data["json"] = cliniclist
	t.ServeJSON()
}
