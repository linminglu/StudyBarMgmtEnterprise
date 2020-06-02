//author:  易祖平 2017-03-09
//purpose： 后台产品管理功能
package erp

import (
	"doggy/controllers/base"
	"doggy/gutils"

	"doggy/gutils/gredis"
	models "doggy/models/erp"
	"strings"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/logs"
)

//外链跳转本后台 结构体

type ExternController struct {
	base.LBaseController
}

func (t *ExternController) ClinicPage() {

	//	dentalid := t.GetString("dentalid")
	//	sign := t.GetString("sign")
	//	val, _ := gredis.Get("reservation_login")
	//	if val == "" {
	//		logs.Error("redirect nodata:redis为空!")
	//		t.Redirect("/college/nodata", 302)
	//	} else {
	//		val = val + dentalid
	//		val = strings.ToLower(gutils.Md5(val))
	//		sign = strings.ToLower(sign)
	//		if val != sign {
	//			logs.Error("redirect nodata:签名校验失败!")
	//			t.Redirect("/college/nodata", 302)
	//		}
	//	}

	t.TplName = "erp/clinicaudit/clinicpage.html"
}

func (t *ExternController) GetClinicData() { //管家号
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetClinicData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *ExternController) ModClinicData() { //clinicid -- 和修改的字段信息
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModClinicData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *ExternController) ClinicInfo() {
	dentalid := t.GetString("dentalid")
	sign := t.GetString("sign")
	val, _ := gredis.Get("reservation_login")
	if val == "" {
		logs.Error("redirect nodata:redis为空!")
		t.Redirect("/college/nodata", 302)
	} else {
		val = val + dentalid
		val = strings.ToLower(gutils.Md5(val))
		sign = strings.ToLower(sign)
		if val != sign {
			logs.Error("redirect nodata:签名校验失败!")
			t.Redirect("/college/nodata", 302)
		}
	}
	var param config.LJSON
	param.Set("dentalid").SetString(dentalid)
	res := t.CheckData(models.ClinicInfo(param))

	InfoID := res.List.Item(0).Get("infoid").String()
	UserID := res.List.Item(0).Get("userid").String()
	DentalID := res.List.Item(0).Get("dentalid").String()
	if InfoID == "" {
		t.Redirect("/butlerp/clinic/addclinic?dentalid="+dentalid+"&sign="+sign, 302)
	} else {
		t.Redirect("/butlerp/clinic/examineenter?infoid="+InfoID+"&userid="+UserID+"&dentalid="+DentalID, 302)
	}

}

//添加诊所
func (t *ExternController) AddClinic() {
	var param config.LJSON
	dentalid := t.GetString("dentalid")
	sign := t.GetString("sign")
	val, _ := gredis.Get("reservation_login")
	if val == "" {
		logs.Error("redirect nodata:redis为空!")
		t.Redirect("/college/nodata", 302)
	} else {
		val = val + dentalid
		val = strings.ToLower(gutils.Md5(val))
		sign = strings.ToLower(sign)
		if val != sign {
			logs.Error("redirect nodata:签名校验失败!")
			t.Redirect("/college/nodata", 302)
		} else {
			param.Set("dentalid").SetString(t.GetString("dentalid"))
			info := t.Check(models.AddClinic(param))
			t.Data["info"] = info.List.Interface()
			t.TplName = "erp/clinicaudit/addclinic_ext.html"
		}
	}
}

//后台-客服(提交审核)
func (t *ExternController) CommitApply() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.CommitApply(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//审核  重审 页面
func (t *ExternController) ExamineEnter() {
	param := t.GetRequestJ()
	recordlist := t.Check(models.DoExamineEnter(param))
	t.Data["infolist"] = recordlist.List.Interface()
	t.TplName = "erp/clinicaudit/ExamineEnter_ext.html"
}

//审核  重审 结果提交
func (t *ExternController) ExamineResult() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DoExamineResult(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//待完善页
func (t *ExternController) FinishPage() {
	t.TplName = "erp/clinicaudit/finishpage_ext.html"
}

//待完善页数据
func (t *ExternController) FinishPageData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.FinishPageData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//待审核诊所进行修改(微调)
func (t *ExternController) ModifyApply() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModifyApply(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//查看页面
func (t *ExternController) ViewAuditEnter() {
	t.TplName = "erp/clinicaudit/viewaudit_ext.html"
}

//查看数据
func (t *ExternController) ViewAudit() {
	param := t.GetRequestJ()
	cliniclist := t.CheckJ(models.DoViewAudit(param))
	t.Data["json"] = cliniclist
	t.ServeJSON()
}

// ClinicAuditController ERP关于用户管理的模块
type ProductController struct {
	BaseERPController
}

// Prepare 是BaseERP控制器运行前的预备方法
func (t *ProductController) Prepare() {
	t.BaseERPController.Prepare()
	//检测权限
	if t.ProAuth == false {
		t.Abort("401")
	}
}

//消费网页
func (t *ProductController) ConsumePage() {
	t.TplName = "erp/product/consumepage.html"
}

//消费数据
func (t *ProductController) ConsumeData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ConsumeData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//产品包列表
func (t *ProductController) GetProList() {
	if t.Ctx.Input.IsPost() {
		param := t.GetRequestJ()
		res := t.CheckJ(models.DoGetProList(param))
		t.Data["json"] = res
		t.ServeJSON()
	} else {
		t.TplName = "erp/product/prolist.html"
	}
}

//新增产品 静态网页
func (t *ProductController) AddNewProTpl() {
	t.TplName = "erp/product/addprotpl.html"
}

//新增产品
func (t *ProductController) AddNewPro() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DoAddNewPro(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//修改产品
func (t *ProductController) UpdatePro() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DoUpdatePro(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//删除产品
func (t *ProductController) DelPro() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DoDelPro(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//查看产品包
func (t *ProductController) ViewPro() {
	if t.Ctx.Input.IsPost() {
		param := t.GetRequestJ()
		res := t.CheckJ(models.DoViewPro(param))
		t.Data["json"] = res
		t.ServeJSON()
	} else {
		t.TplName = "erp/product/proview.html"
	}
}

//门诊管理
func (t *ProductController) CliManage() {
	t.TplName = "erp/product/clinicManagelist.html"
}

//门诊管理  查询出已经加入该产品的门诊
func (t *ProductController) CliAndProYesRelation() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.CliAndProYesRelation(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//门诊管理  查出已签约未加入该产品的门诊
func (t *ProductController) CliAndProNoRelation() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.CliAndProNoRelation(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//解除诊所产品关系
func (t *ProductController) DelRelation() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DoDelRelation(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//添加诊所产品关系
func (t *ProductController) AddRelation() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DoAddRelation(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//门诊产品 静态网页
func (t *ProductController) ClinicPro() {
	t.TplName = "erp/product/clinicpro.html"
}

//门诊产品 数据
func (t *ProductController) GetClinicPro() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetClinicPro(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//门诊产品详情 静态网页
func (t *ProductController) ClinicProDetail() {
	t.TplName = "erp/product/clinicprodetail.html"
}

//门诊产品详情 数据
func (t *ProductController) GetClinicProDetail() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetClinicProDetail(param))
	t.Data["json"] = res
	t.ServeJSON()
}
