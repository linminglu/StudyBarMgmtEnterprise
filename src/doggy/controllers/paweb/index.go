// author: 于绍纳 2017-03-16
// purpose: 平安诊所加盟申请索引页

package paweb

import (
	"doggy/controllers/base"
	"doggy/gutils"
	"doggy/gutils/gredis"
	"doggy/models/pawebs"
	"fmt"

	"os"
	"strings"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/utils"
)

type Sizer interface {
	Size() int64
}

type LApplyIndexController struct {
	base.LBaseController
	UserID string
}

//首页(介绍加盟相关信息)
func (t *LApplyIndexController) HomePage() {
	t.TplName = "account/PAweb/index.html"
}

func (t *LApplyIndexController) ClinicNum() {

	var result gutils.LResultAjax
	result.Code = 1
	result.Info = "ok"

	num := pawebs.ClinicSignNum()

	iSize := len(num)
	if iSize < 5 {
		i := 5 - iSize
		switch i {
		case 1:
			{
				num = "0" + num
				break
			}
		case 2:
			{
				num = "00" + num
				break
			}
		case 3:
			{
				num = "000" + num
				break
			}
		case 4:
			{
				num = "0000" + num
				break
			}
		case 5:
			{
				num = "00000" + num
				break
			}
		}
		iSize = len(num)
	}

	des := []rune(num)
	var obj config.LJSON
	for i := 0; i < iSize; i++ {
		obj.AddItem().Set("value").SetString(string(des[i]))
	}

	result.List = obj.Interface()
	t.Data["json"] = result
	t.ServeJSON()
}

func (t *LApplyIndexController) Prepare() {
	userinfo := t.GetSession("userinfo")
	if userinfo != nil {
		tmp := strings.Split(userinfo.(string), "|")
		t.UserID = tmp[3]
	} else {
		t.UserID = ""
	}
}

// 上传图片，返回图片的地址
func (t *LApplyIndexController) UploadImg() {

	var param config.LJSON
	param.Set("picdata").SetString(t.GetString("picdata"))
	param.Set("ext").SetString(t.GetString("ext"))
	result := t.CheckJ(pawebs.UploadImage(param))
	t.Data["json"] = result
	t.ServeJSON()
}

func (t *LApplyIndexController) UploadPage() {
	t.TplName = "app/upload_image.html"
}

//存储内窥镜影像
func (t *LApplyIndexController) UploadEndoscopic() {
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
		deviceid := param.Get("deviceid").String()
		photodate := param.Get("photodate").String()

		if deviceid == "" {
			var data gutils.LResultAjax
			data.Code = 0
			data.Info = "图片设备ID不能为空"
			t.Data["json"] = data
			t.ServeJSON()
			return
		}
		if photodate == "" {
			var data gutils.LResultAjax
			data.Code = 0
			data.Info = "图片生成时间不能为空"
			t.Data["json"] = data
			t.ServeJSON()
			return
		}

		fileType := param.Get("type").String()
		fileType = strings.ToLower(fileType)
		if fileType == "jpeg" {
			fileType = "jpg"
		}
		if fileType != "jpg" {
			var data gutils.LResultAjax
			data.Code = 0
			data.Info = "图片类型错误"
			t.Data["json"] = data
			t.ServeJSON()
			return
		} else {
			var fileSize int64
			if sizeInterface, ok := f.(Sizer); ok {
				fileSize = sizeInterface.Size()
				//				if comefrom == "合影" || comefrom == "名片" || comefrom == "X光片" || comefrom == "签名" {
				//					if fileSize > 500*1024 {
				//						var data gutils.LResultAjax
				//						data.Code = 0
				//						data.Info = "图片大小超过500KiB"
				//						t.Data["json"] = data
				//						t.ServeJSON()
				//						return
				//					}
				//				}
			}
			path := utils.GetApplicationFullName()
			dir := utils.ExtractFileDir(path) + "\\Cache\\"
			utils.ForceDirectories(dir)
			imageid := gutils.CreateSTRGUID()
			dest := imageid + "." + fileType
			src := dir + dest
			err = t.SaveToFile("file", src)
			if err != nil {
				var data gutils.LResultAjax
				data.Code = 0
				data.Info = "内窥镜图片存储失败"
				t.Data["json"] = data
				t.ServeJSON()
				return
			}

			var flyParam config.LJSON
			flyParam.Set("funcid").SetInt(gutils.FUNC_ID_UPLOAD_ENCOSCOPIC)
			flyParam.Set("filename").SetString(src)
			flyParam.Set("cloudname").SetString(dest)
			flyParam.Set("imageid").SetString(imageid)
			flyParam.Set("deviceid").SetString(deviceid)
			flyParam.Set("photodate").SetString(photodate)
			flyParam.Set("filetype").SetString(fileType)
			flyParam.Set("filesize").SetInt64(fileSize)
			res := gutils.FlybearCPlus(flyParam)
			code := res.Get("code").Int()
			if code == 0 {
				var data gutils.LResultAjax
				data.Code = 1
				data.Info = res.Get("info").String()
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
			obj.Set("imageid").SetString(imageid)
			data.List = obj.Interface()
			t.Data["json"] = data
			t.ServeJSON()
		}
	}
	return
}

//存储金服侠影像
func (t *LApplyIndexController) UploadJFX() {

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
		clinicid := param.Get("clinicid").String()
		comefrom := param.Get("comefrom").String()
		if comefrom == "" || clinicid == "" {
			var data gutils.LResultAjax
			data.Code = 0
			data.Info = "图片来源不能为空"
			t.Data["json"] = data
			t.ServeJSON()
			return
		}
		fileType := param.Get("type").String()
		fileType = strings.ToLower(fileType)
		if fileType == "jpeg" {
			fileType = "jpg"
		}
		if fileType != "jpg" {
			var data gutils.LResultAjax
			data.Code = 0
			data.Info = "图片类型错误"
			t.Data["json"] = data
			t.ServeJSON()
			return
		} else {
			var fileSize int64
			if sizeInterface, ok := f.(Sizer); ok {
				fileSize = sizeInterface.Size()
				if comefrom == "合影" || comefrom == "名片" || comefrom == "X光片" || comefrom == "签名" {
					if fileSize > 500*1024 {
						var data gutils.LResultAjax
						data.Code = 0
						data.Info = "图片大小超过500KiB"
						t.Data["json"] = data
						t.ServeJSON()
						return
					}
				}
			}
			path := utils.GetApplicationFullName()
			dir := utils.ExtractFileDir(path) + "\\Cache\\"
			utils.ForceDirectories(dir)
			imageid := gutils.CreateSTRGUID()
			dest := imageid + "." + fileType
			src := dir + dest
			err = t.SaveToFile("file", src)
			if err != nil {
				var data gutils.LResultAjax
				data.Code = 0
				data.Info = "文件存储失败"
				t.Data["json"] = data
				t.ServeJSON()
				return
			}

			var flyParam config.LJSON
			flyParam.Set("funcid").SetInt(gutils.FUNC_ID_UPLOAD_JFX_IMAGE)
			flyParam.Set("filename").SetString(src)
			flyParam.Set("cloudname").SetString(dest)
			flyParam.Set("imageid").SetString(imageid)
			flyParam.Set("clinicid").SetString(clinicid)
			flyParam.Set("comefrom").SetString(comefrom)
			flyParam.Set("filetype").SetString(fileType)
			flyParam.Set("latitude").SetString(param.Get("latitude").String())
			flyParam.Set("longitude").SetString(param.Get("longitude").String())
			res := gutils.FlybearCPlus(flyParam)
			code := res.Get("code").Int()
			if code == 0 {
				var data gutils.LResultAjax
				data.Code = 1
				data.Info = res.Get("info").String()
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
			obj.Set("imageid").SetString(imageid)
			data.List = obj.Interface()
			t.Data["json"] = data
			t.ServeJSON()
		}
	}
	return

	//这种是按照数组的形式上传,可以一次性接收多张图片
	//	files, _ := t.GetFiles("xpic")
	//	for i, _ := range files {
	//		file, _ := files[i].Open()
	//		defer file.Close()
	//		dst, _ := os.Create("D:\\nash\\" + files[i].Filename)
	//		defer dst.Close()
	//		if _, err := io.Copy(dst, file); err != nil {
	//			io
	//		}
	//	}
}

//是否已经登录
func (t *LApplyIndexController) IsLogin() {

	var result gutils.LResultAjax
	result.Code = 1
	result.Info = "ok"
	var obj config.LJSON

	islogin := 1
	inputSession := t.Ctx.Input.Cookie(base.SvrSession.SessionName)
	CurSession := t.Ctx.Input.CruSession.SessionID()
	//Session已经过期
	if inputSession != CurSession {
		islogin = 0 //需要重新登录
	} else {
		url, _ := gredis.Get(inputSession)
		if url == "" {
			islogin = 0
		}
	}

	//说明处于登录状态
	if islogin == 1 {
		if t.UserID == "" { //退出登陆，session被主动清空
			islogin = 0 //还是需要重新登录
		} else {
			var param config.LJSON
			param.Set("userid").SetString(t.UserID)
			url := pawebs.GetUrl(param)
			obj.Set("url").SetString(url)
		}
	}
	obj.Set("islogin").SetInt(islogin)
	result.List = obj.Interface()
	t.Data["json"] = result
	t.ServeJSON()
}
