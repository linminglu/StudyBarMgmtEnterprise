package oem

import (
	"doggy/controllers/base"
	"doggy/gutils"
	models "doggy/models/oem"
	"strings"

	"github.com/astaxie/beego/config"

	"fmt"

	"os"

	"github.com/astaxie/beego/utils"
)

//引导页面
type LDjdIntroduceControllor struct {
	base.LBaseController
}

func (t *LDjdIntroduceControllor) Introduce() {
	t.TplName = "oem/djd/introduce.html"
}

func (t *LDjdIntroduceControllor) ClinicNum() {
	var result gutils.LResultAjax
	result.Code = 1
	result.Info = "ok"

	num := models.ClinicSignNum()

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

//获取管家号的申请信息 -- 罗云鹏要求--他那边调用
func (t *LDjdIntroduceControllor) GetApplyInfo() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetApplyInfo(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//get请求--申请登录首页
func (t *LDjdIntroduceControllor) Index() {
	t.TplName = "oem/djd/index.html"
}

func (t *LDjdIntroduceControllor) GetCode() {
	param := t.GetRequestJ() //   dentalid/mobile/
	res := t.CheckJ(models.GetCode(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//校验验证码
func (t *LDjdIntroduceControllor) SignUp() {
	param := t.GetRequestJ() //dentalid mobile code
	dentalid := param.Get("dentalid").String()
	res := t.CheckJM(models.SignUp(param))

	t.SetSession("djd_login", dentalid)
	var result gutils.LResultAjax
	result.Code = 1
	result.Info = "ok"
	result.List = res.List.Interface()
	if res.TotalList.Interface() != nil {
		result.Main = res.TotalList.Interface()
	}
	result.PageNo = res.PageNo
	result.PageSize = res.PageSize
	result.TotalCount = res.TotalCount
	t.Data["json"] = result
	t.ServeJSON()
}

type LDjdApplyControllor struct {
	base.LBaseController
	DentalID string
}

//
func (t *LDjdApplyControllor) Prepare() {
	djd_login := t.GetSession("djd_login")
	if djd_login == nil {
		t.Redirect("/djd/index", 302)
	} else {
		tmp := strings.Split(djd_login.(string), "|")
		t.DentalID = tmp[0]
	}
}

//根据申请状态跳转不同页面  -- dentalid是必填项目
func (t *LDjdApplyControllor) RedirectUrl() {
	var param config.LJSON
	param.Set("dentalid").SetString(t.DentalID)
	res := t.CheckJM(models.RedirectUrl(param))
	if res.List.ItemCount() == 0 { //没有申请过
		t.TplName = "oem/djd/applypage.html"
	} else {
		checkstatus := res.List.Item(0).Get("checkstatus").Int()
		if checkstatus == 3 { //申请人工失败
			t.TplName = "oem/djd/applypage.html"
		} else {
			t.TplName = "oem/djd/waitpage.html" //0 1 2 都需要等待
		}
	}
}

//获取申请的历史信息
func (t *LDjdApplyControllor) GetData() {
	var param config.LJSON
	param.Set("dentalid").SetString(t.DentalID)
	res := t.CheckJ(models.GetData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//提交申请
func (t *LDjdApplyControllor) CommitApply() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.CommitApply(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *LDjdApplyControllor) UploadPage() {
	t.TplName = "app/upload_djd.html"
}

//上传度金贷图片
func (t *LDjdApplyControllor) UploadDjdPic() {
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
		//fmt.Println(param.ToString())
		fileType := param.Get("filetype").String()
		fileType = strings.ToLower(fileType)
		if fileType == "jpeg" {
			fileType = "jpg"
		}
		if fileType != "jpg" && fileType != "png" {
			var data gutils.LResultAjax
			data.Code = 0
			data.Info = "图片类型错误"
			t.Data["json"] = data
			t.ServeJSON()
			return
		} else {
			//			var fileSize int64
			//			if sizeInterface, ok := f.(Sizer); ok {
			//				fileSize = sizeInterface.Size()
			//			}
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
				data.Info = "度金贷图片存储失败"
				t.Data["json"] = data
				t.ServeJSON()
				return
			}

			var flyParam config.LJSON
			flyParam.Set("funcid").SetInt(gutils.FUNC_ID_UPLOAD_IMAGE)
			flyParam.Set("src").SetString(src)
			flyParam.Set("dest").SetString(dest)
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
			url := res.Get("data").Get("records").Item(0).Get("url").String()
			os.Remove(src) //删除文件
			var data gutils.LResultAjax
			data.Code = 1
			data.Info = "ok"
			var obj config.LJSON
			obj.Set("url").SetString(url)
			data.List = obj.Interface()
			t.Data["json"] = data
			t.ServeJSON()
		}
	}
	return
}
