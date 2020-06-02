// author: 于绍纳 2017-03-16
// purpose: 平安诊所加盟申请索引页

package paweb

import (
	"doggy/controllers/base"
	"doggy/gutils"
	"doggy/models/pawebs"

	"github.com/astaxie/beego/config"
)

//官网诊所申请处理接口

type LClinicApplyController struct {
	base.LEagleBaseController
}

//申请页
func (t *LClinicApplyController) ApplyPage() {
	userid := t.UserID
	var param config.LJSON
	param.Set("userid").SetString(userid)

	flag := pawebs.CheckTempSave(param)
	if flag == 1 {
		t.TplName = "account/PAweb/subData.html"
	} else {
		t.TplName = "account/MemberCenter/applyprogress.html"
	}

}

//申请页数据
func (t *LClinicApplyController) ApplyPageData() {
	var param config.LJSON
	UserID := t.UserID
	param.Set("userid").SetString(UserID)
	users := t.CheckJ(pawebs.GetClinicApplyInfo(param))
	t.Data["json"] = users
	t.ServeJSON()
}

//临时保存申请
func (t *LClinicApplyController) SaveApply() {
	param := t.GetRequestJ()
	param.Set("userid").SetString(t.UserID)
	result := t.CheckJ(pawebs.SaveApply(param))
	t.Data["json"] = result
	t.ServeJSON()
}

//提交申请
func (t *LClinicApplyController) CommitApply() {
	param := t.GetRequestJ()
	param.Set("userid").SetString(t.UserID)
	result := t.CheckJ(pawebs.CommitApply(param))
	t.Data["json"] = result
	t.ServeJSON()
}

//判断用户是否已经登录

func (t *LClinicApplyController) IsLogin() {
	userinfo := t.GetSession("userinfo")
	IsLogin := 1 //已经登录
	if userinfo == nil {
		IsLogin = 0 //未登录
	}
	var obj config.LJSON
	obj.Set("islogin").SetInt(IsLogin)

	var result gutils.LResultAjax
	result.Code = 1
	result.Info = "ok"
	result.List = obj.Interface()
	t.Data["json"] = result
	t.ServeJSON()
}
