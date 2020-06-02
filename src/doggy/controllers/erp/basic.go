//author:  罗云鹏 17-03-15
//purpose： 运营后台－基础
package erp

import (
	"doggy/controllers/base"
	"doggy/gutils"
	"doggy/gutils/conf"
	"doggy/gutils/gredis"
	models "doggy/models/erp"
	"encoding/base64"
	"io/ioutil"
	"os"
	"regexp"
	"strings"
	"time"

	"fmt"

	"net/http"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/utils"
	"github.com/tealeg/xlsx"
)

const (
	NoticeAuthID  = "73" //消息推送权限
	ClinicAuthID  = "74" //门诊审核权限
	ProAuthID     = "75" //产品管理权限
	UserAuthID    = "76" //用户管理权限
	CollegeAuthID = "85" //商学院后台权限
	MallAuthID    = ""   //商城后台权限
)

// BaseERPController 是ERP后台都要继承的控制器
type BaseERPController struct {
	base.LBaseController
	UserID       string //用户ID
	UserName     string //用户名
	NickName     string //昵称(?)
	Mobile       string //手机
	RoleID       string //角色
	ActionGuids  string //权限
	NoticeAuth   bool   //消息推送权限
	ClinicAuth   bool   //门诊审核权限
	ProAuth      bool   //产品管理权限
	UserAuth     bool   //用户管理权限
	CollegeAuth  bool   //商学院后台权限
	MallAuth     bool   //商城后台权限
	BusinessAuth bool   //app商学院后台权限
	PrepareTime  time.Time
}

// BaseERPFrontController 是ERP后台不需要登陆页面所需要继承的控制器
type BaseERPFrontController struct {
	base.LBaseController
}

// Prepare 是BaseERP控制器运行前的预备方法
func (t *BaseERPController) Prepare() {
	t.PrepareTime = time.Now()
	admin := t.GetSession("admin")
	if admin == nil {
		t.Redirect("/butlerp", 302)
	} else {
		tmp := strings.Split(admin.(string), "|")
		t.UserID = tmp[0]
		t.UserName = tmp[1]
		t.NickName = tmp[2]
		t.Mobile = tmp[3]
		t.RoleID = tmp[4]
		t.ActionGuids = tmp[5]
		t.NoticeAuth = true
		t.ClinicAuth = true
		t.ProAuth = true
		t.UserAuth = true
		t.CollegeAuth = true
		t.MallAuth = true
		t.BusinessAuth = true
		// fmt.Println("=====")
		// fmt.Println(t.ActionGuids, t.NoticeAuth, t.ClinicAuth, t.ProAuth, t.UserAuth)
		// fmt.Println("=====")
		if t.ActionGuids != "" {
			t.NoticeAuth = CheckAuth(NoticeAuthID, t.ActionGuids)
			t.ClinicAuth = CheckAuth(ClinicAuthID, t.ActionGuids)
			t.ProAuth = CheckAuth(ProAuthID, t.ActionGuids)
			t.UserAuth = CheckAuth(UserAuthID, t.ActionGuids)
		}
		//拆分这个字段选取权限节点  设置结构体字段值
	}
}

//统计耗时 by dylan
func (t *BaseERPController) Finish() {
	si := time.Since(t.PrepareTime)
	tlen := si.Seconds() * 1000
	dateStr := time.Now().Format("2006-01-02")
	key := "func_time_" + dateStr + "_" + t.Ctx.Input.URL()
	val, err := gredis.Get(key)
	fcount := 1
	var ftime int
	ftime = int(tlen)
	if err == nil {
		list := strings.Split(val, "|")
		if len(list) == 2 {
			fcount += gutils.StrToInt(list[0], 0)
			ftime += gutils.StrToInt(list[1], 0)
		}
	}
	gredis.Set(key, fmt.Sprint(fcount)+"|"+fmt.Sprint(ftime))
}

//权限校验
func CheckAuth(AuthID string, AuthString string) bool {
	reg := regexp.MustCompile(AuthID)
	str := reg.MatchString(AuthString)
	if str == false {
		return false
	}
	return true
}

//学习吧登录
func (t *BaseERPFrontController) ERPCollegeIndex() {
	// admin := t.GetSession("admin")
	// if admin != nil {
	// 	// t.Redirect("/butlerp/dashboard", 302)
	// 	t.Redirect("/butlerp/business/newindex#/allanchors", 302)
	// }
	// if t.Ctx.Input.IsPost() {
	// 	var data gutils.LResultAjax
	// 	param := t.GetRequestJ()
	// 	username := param.Get("username").String()
	// 	password := param.Get("password").String()
	// 	if username == "" {
	// 		data.Code = 0
	// 		data.Info = "请填写用户名"
	// 		t.Data["json"] = data
	// 		t.ServeJSON()
	// 		return
	// 	}
	// 	if password == "" {
	// 		data.Code = 0
	// 		data.Info = "请填写密码"
	// 		t.Data["json"] = data
	// 		t.ServeJSON()
	// 		return
	// 	}
	// 	DituiUser, _ := models.GetLoginInfo(username, password)
	// 	if DituiUser.List.ItemCount() <= 0 {
	// 		data.Code = 0
	// 		data.Info = "请填写正确用户名和密码"
	// 		t.Data["json"] = data
	// 		t.ServeJSON()
	// 		return
	// 	}
	// 	user := DituiUser.List.Item(0)
	// 	uid := user.Get("userid").String()
	// 	uname := user.Get("username").String()
	// 	unickname := user.Get("nickname").String()
	// 	umobile := user.Get("mobile").String()
	// 	uroleid := user.Get("roleid").String()
	// 	uactionguids := user.Get("actionguids").String()
	// 	t.SetSession("admin", uid+"|"+uname+"|"+unickname+"|"+umobile+"|"+uroleid+"|"+uactionguids)
	// 	data.Code = 1
	// 	data.Info = "登录成功"
	// 	t.Data["json"] = data
	// 	t.ServeJSON()
	// } else {
	// 	t.TplName = "erp/collegenew/studybar_login.html"
	// }
	t.TplName = "erp/collegenew/studybar_login.html"
}

// ERPAdminIndex 是后台的总登陆页
func (t *BaseERPFrontController) ERPAdminIndex() {
	admin := t.GetSession("admin")
	if admin != nil {
		t.Redirect("/butlerp/dashboard", 302)
	}
	if t.Ctx.Input.IsPost() {
		var data gutils.LResultAjax
		param := t.GetRequestJ()
		username := param.Get("username").String()
		password := param.Get("password").String()
		if username == "" {
			data.Code = 0
			data.Info = "请填写用户名"
			t.Data["json"] = data
			t.ServeJSON()
			return
		}
		if password == "" {
			data.Code = 0
			data.Info = "请填写密码"
			t.Data["json"] = data
			t.ServeJSON()
			return
		}
		DituiUser, _ := models.GetLoginInfo(username, password)
		if DituiUser.List.ItemCount() <= 0 {
			data.Code = 0
			data.Info = "请填写正确用户名和密码"
			t.Data["json"] = data
			t.ServeJSON()
			return
		}
		user := DituiUser.List.Item(0)
		uid := user.Get("userid").String()
		uname := user.Get("username").String()
		unickname := user.Get("nickname").String()
		umobile := user.Get("mobile").String()
		uroleid := user.Get("roleid").String()
		uactionguids := user.Get("actionguids").String()
		t.SetSession("admin", uid+"|"+uname+"|"+unickname+"|"+umobile+"|"+uroleid+"|"+uactionguids)
		data.Code = 1
		data.Info = "登录成功"
		t.Data["json"] = data
		t.ServeJSON()
	} else {
		t.TplName = "erp/base/login.html"
	}

}

// Dashboard 可以让用户登出
func (t *BaseERPController) Dashboard() {
	t.TplName = "erp/base/dashboard.html"
}

// ERPLogout 可以让用户登出
func (t *BaseERPController) ERPLogout() {
	t.SetSession("admin", nil)
	var data gutils.LResultAjax
	data.Code = 1
	data.Info = "登出成功"
	t.Data["json"] = data
	t.ServeJSON()
}

// ERPUploadImg 只有登陆才可以上传图片，返回图片的地址
func (t *BaseERPController) ERPUploadImg() {
	var result gutils.LResultAjax
	//filename := t.GetString("filename")
	picdata := t.GetString("picdata")
	ext := gutils.SubString(t.GetString("ext"), 6, 4)
	if ext == "jpeg" {
		ext = "jpg"
	}
	fmt.Println(ext)
	if picdata == "" {
		result.Code = 0
		result.Info = "picdata不能为空"
		t.Data["json"] = result
		t.ServeJSON()
		return
	}
	if (ext != "png") && (ext != "jpg") {
		result.Code = 0
		result.Info = "图片格式错误"
		t.Data["json"] = result
		t.ServeJSON()
		return
	}
	buf, _ := base64.StdEncoding.DecodeString(picdata) //成图片文件并把文件写入到buffer
	path := utils.GetApplicationFullName()
	dir := utils.ExtractFileDir(path) + "\\Cache\\"
	fmt.Println(dir)
	utils.ForceDirectories(dir)
	dest := fmt.Sprintf("%d", gutils.CreateGUID()) + "." + ext
	src := dir + dest
	err2 := ioutil.WriteFile(src, buf, 0666) //buffer输出到jpg文件中（不做处理，直接写到文件）
	if err2 != nil {
		result.Code = 0
		result.Info = err2.Error()
	}
	var param config.LJSON
	param.Set("funcid").SetInt(gutils.FUNC_ID_UPLOAD_IMAGE)
	param.Set("src").SetString(src)
	param.Set("dest").SetString(dest)
	res := gutils.FlybearCPlus(param)
	url := res.Get("data").Get("records").Item(0).Get("url").String()

	var imageData config.LJSON

	imageData.Set("url").SetString(url)
	imageData.Set("id").SetString(dest)
	result.Code = 1
	//imageDataStr, _ := imageData.ToString()
	//fmt.Println(imageDataStr)
	result.List = imageData.Interface()
	fmt.Println(url)
	t.Data["json"] = result
	t.ServeJSON()
}

// SaveFile 将上传的东西保存到服务器，返回存储的链接
func (t *BaseERPController) SaveFile(filedata, extname string) (result string, err gutils.LError) {
	if extname != "xls" && extname != "xlsx" {
		err.Errorf(gutils.ParamError, "文件类型不符合要求")
		return
	}

	if filedata == "" {
		err.Errorf(gutils.ParamError, "文件内容为空")
		return
	}
	buf, _ := base64.StdEncoding.DecodeString(filedata) //文件写入到buffer
	path := utils.GetApplicationFullName()
	dir := utils.ExtractFileDir(path) + "\\Cache\\"
	utils.ForceDirectories(dir)
	dest := fmt.Sprintf("%d", gutils.CreateGUID()) + ".xls"
	src := dir + dest
	err2 := ioutil.WriteFile(src, buf, 0666) //buffer输出到xls文件中（不做处理，直接写到文件）
	if err2 != nil {
		err.Errorf(gutils.ParamError, err2.Error())
		return
	}

	result = src
	return
}

// ReadExcel 读取Excel的内容放入JSON之中
func (t *BaseERPController) ReadExcel(excelFileName string) (result config.LJSON, err gutils.LError) {
	xlFile, ferr := xlsx.OpenFile(excelFileName)
	if ferr != nil {
		os.Remove(excelFileName) //删除文件
		err.Errorf(gutils.ParamError, "Excel文件解析失败")
		return
	}

	for _, sheet := range xlFile.Sheets {
		k := 0
		for _, row := range sheet.Rows {
			i := 0
			item := result.AddItem()
			for _, cell := range row.Cells {
				s, _ := cell.String()
				item.Set("cells" + fmt.Sprintf("%d", i)).SetString(s)
				i = i + 1
			}
			k = k + 1
		}
	}
	fmt.Println(result.ToString())
	os.Remove(excelFileName) //删除文件
	return
}

// MessagePopupSvr 专门展示服务器弹窗消息
func (t *BaseERPFrontController) MessagePopupSvr() {
	notifyID := t.GetString(":id")
	msgID := t.GetString(":msgid")
	t.TplName = "erp/message/msgpopup.html"
	res := t.Check(models.GetNotifyPopup(notifyID))
	image := res.List.Item(0).Get("mainimage").String()
	t.Data["image"] = image
	t.Data["notifyid"] = notifyID
	t.Data["msgid"] = msgID
	t.Data["domain"], _ = conf.SvrConfig.String("server", "domain")
	t.Data["SaasDomain"], _ = conf.SvrConfig.String("server", "SaasDomain")
}

// MessagePopup 专门展示弹窗消息
func (t *BaseERPFrontController) MessagePopup() {
	fileID := t.GetString(":id")
	t.TplName = "erp/notifybanners/" + fileID
}

// MessageRedirect 消息点击重定向
func (t *BaseERPFrontController) MessageRedirect() {
	param := t.GetRequestJ()
	notifyID := param.Get("NotifyID").String()
	if notifyID == "" {
		t.Ctx.WriteString("unkown notify")
		return
	}
	_ = t.CheckJ(models.APIClick(param))

	

	url, err := models.GetNotifyURL(notifyID)

	//加上需要参数
	param.Set("url").SetString(url)
	url = t.MessageAddParam(param)

	if err.Msg != nil {
		err.Errorf(gutils.ParamError, err.Msg.Error())
		return
	}

	//t.Redirect(url, 302)
	http.Redirect(t.Ctx.ResponseWriter, t.Ctx.Request, url, 302)
}

//在url后加上参数 lzy
func (t *BaseERPFrontController) MessageAddParam(param config.LJSON) string {
	url := param.Get("url").String()
	channelID := param.Get("ChannelID").String()
	notifyID := param.Get("NotifyID").String()
	id := param.Get("MessageID").String()

	collection := "notify_pc_" + notifyID + "_" + channelID
	if t.MessageIsNotParam(url) {
		url = url + "&collection=" + collection + "&_id=" + id
	} else {
		url = url + "?collection=" + collection + "&_id=" + id
	}

	return url
}

//判断url后有没有参数
func (t *BaseERPFrontController) MessageIsNotParam(url string) bool {
	return strings.Contains(url, "?")
}
