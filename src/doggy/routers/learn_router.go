/*
	学习吧新后台
*/

package routers

import (
	platform "doggy/controllers/learn/platform"

	"doggy/controllers/learn/anchor"

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

	//平台管理后台
	beego.Router("/learn/platform/login", &platform.PLoginController{}, "get:LoginPage")      //登录网页
	beego.Router("/learn/platform/userlogin", &platform.PLoginController{}, "post:UserLogin") //账号登录
	beego.Router("/learn/platform/codelogin", &platform.PLoginController{}, "post:CodeLogin") //验证码登录
	beego.Router("/learn/platform/sendcode", &platform.PLoginController{}, "post:SendCode")   //发送验证码
	beego.Router("/learn/platform/index", &platform.PLearnController{}, "get:MainPage")       //学习吧业务网页

	//主播管理后台
	beego.Router("/learn/anchor/login", &anchor.ALoginControllers{}, "get:Login")
	beego.Router("/learn/anchor/index", &anchor.ALearnControllers{}, "get:Index")

}
