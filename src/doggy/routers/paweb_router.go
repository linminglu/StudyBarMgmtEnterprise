package routers

import (
	"doggy/controllers/account"
	"doggy/controllers/paweb"

	"github.com/astaxie/beego"
)

/*
	诊所加盟申请接口
*/
func init() {
	version, _ := beego.AppConfig.Int("version")
	if version == 0 {
		version = 99999 //不设置的时候默认为开发版本，发布所有路由
	}
	if version <= 1001 {
		return
	}

	beego.Router("/paweb/index", &paweb.LApplyIndexController{}, "get:HomePage")                //加盟主页
	beego.Router("/paweb/clinicnum", &paweb.LApplyIndexController{}, "post:ClinicNum")          //加盟诊所数量
	beego.Router("/paweb/islogin", &paweb.LApplyIndexController{}, "post:IsLogin")              //是否登录
	beego.Router("/paweb/login", &account.LPreController{}, "post:ClinicMobileLogin")           //登录接口
	beego.Router("/paweb/applypage", &paweb.LClinicApplyController{}, "get:ApplyPage")          //用户申请页
	beego.Router("/paweb/applypagedata", &paweb.LClinicApplyController{}, "post:ApplyPageData") //用户申请页数据
	beego.Router("/paweb/saveapply", &paweb.LClinicApplyController{}, "post:SaveApply")         //用户临时保存
	beego.Router("/paweb/commitapply", &paweb.LClinicApplyController{}, "post:CommitApply")     //用户提交申请
	beego.Router("/paweb/uploadimage", &paweb.LApplyIndexController{}, "post:UploadImg")        //上传影像
	//金服侠app端数据提交
	beego.Router("/app/uploadpage", &paweb.LApplyIndexController{}, "get:UploadPage")
	beego.Router("/app/upload_jfx", &paweb.LApplyIndexController{}, "post:UploadJFX")               //上传金服侠影像
	beego.Router("/app/upload_endoscopic", &paweb.LApplyIndexController{}, "post:UploadEndoscopic") //上传内窥镜影像

}
