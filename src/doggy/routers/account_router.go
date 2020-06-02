//author:  曾文 2016-11-13
//purpose： 登录注册路由

package routers

import (
	"doggy/controllers/account"

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

	beego.Router("/", &account.LPreController{}, "get:UserLogin")                 //登录页
	beego.Router("/index", &account.LAccountController{}, "get:ServiceIndex")     //登录页
	beego.Router("/reindex", &account.LAccountController{}, "get:ServiceReIndex") //登录页
	beego.Router("/redirect", &account.LPreController{}, "Get:RedirectLogin")     //重定向登录
	beego.Router("/views/*.*", &account.LPreController{}, "Get:TestView")         //供前端测试页面用

	beego.Router("/viewstl", &account.LPreController{}, "Get:ViewSTL") //stl浏览
	beego.Router("/red", &account.LPreController{}, "Get:RedirectURI")
	beego.Router("/video", &account.LPreController{}, "Get:Video") //视频浏览

	//账号相关 zengw

	beego.Router("/login", &account.LPreController{}, "get:UserLogin")                  //登录页
	beego.Router("/logout", &account.LAccountController{}, "get:UserLogOut")            //登出
	beego.Router("/member/userreg", &account.LPreController{}, "get:UserReg")           //注册页
	beego.Router("/member/serviceterms", &account.LPreController{}, "get:ServiceTerms") //注册协议
	beego.Router("/member/regsetpsw", &account.LPreController{}, "get:RegSetPswView")   //设置密码

	beego.Router("/member/sendregcode", &account.LPreController{}, "post:SendRegCode")       //发送注册验证码
	beego.Router("/member/checkregcode", &account.LPreController{}, "post:CheckRegCode")     //校验注册验证码
	beego.Router("/member/checkuserexist", &account.LPreController{}, "post:CheckUserExist") //判断用户是否已注册
	beego.Router("/member/register", &account.LPreController{}, "post:Register")             //注册提交
	beego.Router("/member/employeelogin", &account.LPreController{}, "post:EmployeeLogin")   //员工登录
	beego.Router("/member/mobilelogin", &account.LPreController{}, "post:MobileLogin")       //手机登录
	beego.Router("/member/fogetpsw", &account.LPreController{}, "post:ForgetPassword")       //忘记密码

	beego.Router("/member/regclinicisel", &account.LAccountController{}, "get:RegCliniciSel")     //选择创建或关联
	beego.Router("/member/regcreateclinic", &account.LAccountController{}, "get:RegCreateClinic") //创建诊所
	beego.Router("/member/regrelaclinic", &account.LAccountController{}, "get:RegRelaClinic")     //关联诊所

	beego.Router("/member/regrelclinicanother", &account.LAccountController{}, "get:RegrelclinicAnother") //关联诊所 其他  yzp

	beego.Router("/member/regsuccess", &account.LAccountController{}, "get:RegSuccess")           //注册成功
	beego.Router("/member/activperaccount", &account.LAccountController{}, "get:ActivPerAccount") //激活个人账号
	beego.Router("/member/blindclinic", &account.LAccountController{}, "get:BindClinicView")      //关联诊所
	beego.Router("/member/resetpassword", &account.LAccountController{}, "get:ResetPasswordView") //重置密码
	beego.Router("/member/resetpsw", &account.LAccountController{}, "post:ResetPassword")         //重置密码

	beego.Router("/member/activeaccount", &account.LAccountController{}, "post:ActiveAccount") //首次登录激活账号
	beego.Router("/member/bindclinic", &account.LAccountController{}, "post:BindClinic")       //关联诊所

	beego.Router("/member/newclinic", &account.LAccountController{}, "post:NewClinic")   //新建诊所
	beego.Router("/member/bindmobile", &account.LAccountController{}, "post:BindMobile") //关联手机
	beego.Router("/member/precheck", &account.LAccountController{}, "post:PreCheck")     //判官是否有权限

	beego.Router("/member/pcbindmobile", &account.LPreController{}, "post:PCBindMobile") //PC调用的关联手机

	//beego.Router("/pc", &account.LPreController{}, "get:PC")
	beego.Router("/pc/*", &account.LPreController{}, "Get:PC")             //供PC调用 旧的加密方式
	beego.Router("/pcweb/*", &account.LPreController{}, "Get:PCWEB")       //供PC调用 新的加密方式
	beego.Router("/stdpcweb/*", &account.LPreController{}, "Get:STDPCWEB") //供标准版调用 新的加密方式

	beego.Router("/ispcload", &account.LAccountController{}, "post:ISPCLoad")  //是否PC调用
	beego.Router("/svrip", &account.LAccountController{}, "get:SVRIP")         //当前运行服务器IP
	beego.Router("/pcloginview", &account.LPreController{}, "get:PCLoginView") //PC登录
	beego.Router("/pclogin", &account.LPreController{}, "post:PCLogin")        //PC登录
	beego.Router("/errmsg/*", &account.LPreController{}, "get:ERRMSG")         //PC消息提示

	//	//正雅接口
	//	beego.Router("/smartee/register", &smartee.LSmartAPIController{}, "get,post:Register")           //正雅注册
	//	beego.Router("/smartee/login", &smartee.LSmartAPIController{}, "get,post:Login")                 //正雅登录
	//	beego.Router("/smartee/pushdata", &smartee.LSmartAPIController{}, "get,post:PushData")           //正雅提交检查数据
	//	beego.Router("/smartee/getauth", &smartee.LSmartAPIController{}, "get,post:GetPatientCheckAuth") //获取患者检查图片上传的权限
	//	beego.Router("/smartee/pushimage", &smartee.LSmartAPIController{}, "get,post:PushImage")         //获取患者检查图片上传的权限
	//后台查看患者信息
	beego.Router("/patinfo", &account.LPreController{}, "Get:PatInfo")

}
