package routers

import (
	"course/controllers/app"

	"time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/toolbox"
)

func init() {

	toolbox.StatisticsMap.AddStatistics("POST", "/service11/func.php", "&app.LAppController", time.Duration(2000))
	toolbox.StatisticsMap.AddStatistics("GET", "/service11/func.php", "&app.LAppController", time.Duration(2000))
	//通用路由
	beego.Router("/course/func", &app.LAppController{}, "post,get:HandleData")
	//上传图片
	beego.Router("/course/uploadimage", &app.LAppController{}, "post:UploadPic")
	//登录页面
	beego.Router("/course/index", &app.LMainController{}, "get:Index")
	//主播后台	 
	beego.Router("/appsys/index", &app.LMainController{}, "get:IndexOfApp")
}
