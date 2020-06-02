//author:  龙智鹏 2019-1-17
//purpose： 义齿主业务
package dxaccount


import (
	"doggy/gutils"
	"doggy/models/dxaccount"
)

//获取诊所列表
func  (t *LDxDocController) GetClinicList()  {
	var data gutils.LResultAjax
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	if mobile == "" {
		data.Code = 0
		data.Info = "手机号不能为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	if gutils.CheckSign(param, t.AccessKeySecret, "mobile") == false {
		t.ErrorJ("AccessKey验证失败")
		return
	} 
	res := t.CheckJ(dxaccountmodels.GetClinicList(param))
	t.Data["json"] = res
	t.ServeJSON()
	return
}

//根据医生获取医生今日患者
func (t *LDxDocController) GetTodayPat(){
	param := t.GetRequestJ()
	if gutils.CheckSign(param, t.AccessKeySecret, "clinicid","userid","pageno","pagesize","patientlist") == false {
		t.ErrorJ("AccessKey验证失败")
		return
	} 
	res:=t.CheckJ(dxaccountmodels.GetTodayPatList(param))
	t.Data["json"] =res
	t.ServeJSON()
	return
}
//根据账号密码管家号绑定已知诊所
func (t *LDxDocController) BindClinicByDentalID(){
	param := t.GetRequestJ()
	if gutils.CheckSign(param, t.AccessKeySecret, "dentalid","doctorname","password") == false {
		t.ErrorJ("AccessKey验证失败")
		return
	} 
	res:=t.CheckJ(dxaccountmodels.BindClinicByDentalID(param))
	t.Data["json"] =res
	t.ServeJSON()
	return
}

//修改医生基本信息
func (t *LDxDocController) UpdateDocBaseInfo(){
	param := t.GetRequestJ()
	if gutils.CheckSign(param, t.AccessKeySecret, "doctorid","name","Sex","Age") == false {
		t.ErrorJ("AccessKey验证失败")
		return
	} 
	res:=t.CheckJ(dxaccountmodels.UpdateDocBaseInfo(param))
	t.Data["json"] =res
	t.ServeJSON()
	return
}

//查询医生基本信息
func (t *LDxDocController) GetDocBaseInfo(){
	param := t.GetRequestJ()
	if gutils.CheckSign(param, t.AccessKeySecret, "doctorid") == false {
		t.ErrorJ("AccessKey验证失败")
		return
	} 
	res:=t.CheckJ(dxaccountmodels.GetDocBaseInfo(param))
	t.Data["json"] =res
	t.ServeJSON() 
	return
}

//获取安装包下载url
func (t *LDxDocController) GetInstallPack() {
	param := t.GetRequestJ()
	clinicids := t.CheckJM(dxaccountmodels.GetBetaClinicID(param))
	isbeta := 0
	if clinicids.List.ItemCount() != 0 { //诊所是公测版
		isbeta = 1
	}
	res:=t.CheckJ(dxaccountmodels.GetInstallPack(isbeta))
	t.Data["json"] = res
	t.ServeJSON()
} 