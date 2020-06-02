package erp

import (
	"doggy/gutils"
	models "doggy/models/erp"
	"fmt"
	"os"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/utils"
)

type Sizer interface {
	Size() int64
}

// CollegeController ERP关于商学院的模块
type CollegeController struct {
	BaseERPController
}

func (t *CollegeController) Prepare() {
	//	t.BaseERPController.Prepare()
	//	//商学院权限
	//	if t.CollegeAuth == false {
	//		t.Abort("401")
	//	}
}

func (t *CollegeController) Ysn() {
	t.TplName = "report/test2.html"
}

//<用户管理>页面
func (t *CollegeController) UserPage() {
	t.TplName = "erp/college/account/userslist.html"
}

//<用户管理>数据
func (t *CollegeController) UserData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.UserData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//<用户管理>添加用户
func (t *CollegeController) UserAdd() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.UserAdd(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//<用户管理>导入用户
func (t *CollegeController) UserImport() {
	var param config.LJSON
	param.Set("picdata").SetString(t.GetString("picdata"))
	param.Set("ext").SetString(t.GetString("ext"))
	result := t.CheckJ(models.UserImport(param))
	t.Data["json"] = result
	t.ServeJSON()
}

//<用户管理>详情页面
func (t *CollegeController) UserDetailPage() {
	t.TplName = "erp/college/account/userinfo.html"
}

//<用户管理>详情数据
func (t *CollegeController) UserDetailData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.UserDetailData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//<积分管理>页面
func (t *CollegeController) IntegralPage() {
	t.TplName = "erp/college/integral/integrallist.html"
}

//<积分管理>数据
func (t *CollegeController) IntegralData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.IntegralData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//<积分管理>添加
func (t *CollegeController) IntegralAdd() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.IntegralAdd(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *CollegeController) IntegralType() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.IntegralType(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//<积分管理>导入
func (t *CollegeController) IntegralImport() {
	var param config.LJSON
	param.Set("picdata").SetString(t.GetString("picdata"))
	param.Set("ext").SetString(t.GetString("ext"))
	res := t.CheckJ(models.IntegralImport(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//<积分管理>删除
func (t *CollegeController) IntegralDel() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.IntegralDel(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *CollegeController) WeClassPage() {
	t.TplName = "erp/college/micro/curriculum.html"
}

func (t *CollegeController) WeClassData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.WeClassData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *CollegeController) WeClassMod() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.WeClassMod(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *CollegeController) WeClassDel() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.WeClassDel(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *CollegeController) WeClassOpen() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.WeClassOpen(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *CollegeController) WeClassDetailPage() {
	t.TplName = "erp/college/micro/see.html"
}

//只获取评论数据
func (t *CollegeController) WeClassDetailData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.WeClassDetailData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *CollegeController) WeClassDetailDel() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.WeClassDetailDel(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *CollegeController) WeClassDetailComment() {
	param := t.GetRequestJ() //课程ID relationid
	res := t.CheckJ(models.WeClassDetailComment(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *CollegeController) BannerPage() {
	t.TplName = "erp/college/micro/micro_upload.html"
}

func (t *CollegeController) ImageUpload() {
	var param config.LJSON
	param.Set("picdata").SetString(t.GetString("picdata"))
	param.Set("ext").SetString(t.GetString("ext"))
	result := t.CheckJ(models.ImageUpload(param))
	t.Data["json"] = result
	t.ServeJSON()
}

func (t *CollegeController) SaveBanner() {
	var param config.LJSON
	result := t.CheckJ(models.SaveBanner(param))
	t.Data["json"] = result
	t.ServeJSON()
}

//func (t *CollegeController) UploadSource() {
//	var param config.LJSON
//	param.Set("picdata").SetString(t.GetString("picdata"))
//	param.Set("ext").SetString(t.GetString("ext"))
//	result := t.CheckJ(models.UploadSource(param))
//	t.Data["json"] = result
//	t.ServeJSON()
//}

func (t *CollegeController) Upload() {
	t.TplName = "erp/college/uploadvideo.html"
}

func (t *CollegeController) UploadSource() {
	f, _, err := t.GetFile("file")

	if err != nil {
		fmt.Println("getfile err", err)
		var data gutils.LResultAjax
		data.Code = 0
		data.Info = "获取文件失败"
		t.Data["json"] = data
		t.ServeJSON()
	} else {
		param := t.GetRequestJ()
		fileType := param.Get("type").String()
		if fileType != "mp3" && fileType != "mp4" {
			var data gutils.LResultAjax
			data.Code = 0
			data.Info = "文件类型错误"
			t.Data["json"] = data
			t.ServeJSON()
			return
		} else {
			var fileSize int64
			if sizeInterface, ok := f.(Sizer); ok {
				fileSize = sizeInterface.Size()
				fmt.Println("文件大小", fileSize)
			}
			path := utils.GetApplicationFullName()
			dir := utils.ExtractFileDir(path) + "\\Cache\\"
			utils.ForceDirectories(dir)
			dest := fmt.Sprintf("%d", gutils.CreateGUID()) + "." + fileType
			src := dir + dest
			err = t.SaveToFile("file", src)
			if err != nil {
				fmt.Println("文件保存失败")
				var data gutils.LResultAjax
				data.Code = 0
				data.Info = "文件存储失败"
				t.Data["json"] = data
				t.ServeJSON()
				return
			}

			var flyParam config.LJSON
			flyParam.Set("funcid").SetInt(gutils.FUNC_ID_UPLOAD_SOURCE)
			flyParam.Set("filename").SetString(src)
			flyParam.Set("cloudname").SetString(dest)
			res := gutils.FlybearCPlus(flyParam)
			code := res.Get("code").Int()
			if code == 0 {
				var data gutils.LResultAjax
				data.Code = 1
				data.Info = "文件上传阿里云失败"
				t.Data["json"] = data
				t.ServeJSON()
				return
			}
			f.Close()
			url := res.Get("url").String()
			os.Remove(src) //删除文件
			var data gutils.LResultAjax
			data.Code = 1
			data.Info = "ok"
			var obj config.LJSON
			obj.Set("url").SetString(url)
			obj.Set("filesize").SetInt64(fileSize)
			data.List = obj.Interface()
			t.Data["json"] = data
			t.ServeJSON()
		}
	}
	return
}

func (t *CollegeController) GetQRCode() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetQRCode(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *CollegeController) OssParam() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.OssParam(param))
	t.Data["json"] = res
	t.ServeJSON()
}
