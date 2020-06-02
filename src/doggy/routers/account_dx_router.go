//author:  龙智鹏 2019-1-8
//purpose： 义齿账号路由

package routers

import (
	"doggy/controllers/dxaccount"
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

	beego.Router("/dx/sendregcode", &dxaccount.LDxDocController{}, "post:SendRegCode")  //注册发送验证码 
	beego.Router("/dx/register", &dxaccount.LDxDocController{}, "post:Register")                 //登录页
    beego.Router("/dx/userlogin", &dxaccount.LDxDocController{}, "post:DxDocLogin")  //医生密码登陆
	beego.Router("/dx/sendlogcode", &dxaccount.LDxDocController{}, "post:DxDocCodeLoginSendCode")  //医生验证码登陆发送验证码
	beego.Router("/dx/codelogin", &dxaccount.LDxDocController{}, "post:DxDocCodeLogin")  //医生验证码登陆
	beego.Router("/dx/forgetpasscode", &dxaccount.LDxDocController{}, "post:ForgetPasswordSend")  //医生忘记密码发送验证码
	beego.Router("/dx/forgetpass", &dxaccount.LDxDocController{}, "post:ForgetPasswordConform")  //医生忘记密码确认
	beego.Router("/dx/getcliniclist", &dxaccount.LDxDocController{}, "post:GetClinicList")  //获取诊所绑定列表
	beego.Router("/dx/getpatlist", &dxaccount.LDxDocController{}, "post:GetTodayPat")  //获取诊所绑定今日患者
	beego.Router("/dx/bindclinic", &dxaccount.LDxDocController{}, "post:BindClinicByDentalID")  //根据管家号账号绑定诊所
	beego.Router("/dx/updatedocbase", &dxaccount.LDxDocController{}, "post:UpdateDocBaseInfo")  //修改医生基本信息
	beego.Router("/dx/getdocbase", &dxaccount.LDxDocController{}, "post:GetDocBaseInfo")  //获取医生基本信息
	beego.Router("/fac/sendpasscode", &dxaccount.LDxDocController{}, "post:FacForgetPassSend")  //加工厂忘记密码
	beego.Router("/fac/updatepass", &dxaccount.LDxDocController{}, "post:FacUpdatepass")  //加工厂忘记密码
	beego.Router("/fac/getinstallpack", &dxaccount.LDxDocController{}, "post:GetInstallPack")  //获取版本
}