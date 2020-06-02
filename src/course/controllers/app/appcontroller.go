/*
	purpose:app控制器统一入口
	author:于绍纳
*/
package app

import (
	_ "course/flybears"
	"course/gutils"
	"fmt"
	"os"
	"strconv"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
	//"github.com/astaxie/beego/logs"
	"course/gutils/gredis"
	models "course/models"
	"strings"

	"github.com/astaxie/beego/utils"
)

//LMainController 网页代码入口
type LMainController struct {
	beego.Controller
}

func (t *LMainController) Index() {
	t.TplName = "studybar/index.html"
}

func (t *LMainController) IndexOfApp() {
	t.TplName = "appmanagersys/index.html"
}

//LAppController 接口代码
type LAppController struct {
	beego.Controller
	UserID  string
	Session string
}

func (t *LAppController) Prepare() {
	collegeSession := t.GetSession("collegeSession")
	if collegeSession != nil {
		tmp := strings.Split(collegeSession.(string), "|")
		t.UserID = tmp[0]
		t.Session = tmp[1]
	}
}

//检查返回的结果错误状态
func (t *LAppController) CheckJ(param interface{}, err gutils.LError) (result config.LJSON) {
	tmp, _ := param.(config.LJSON)
	if err.Msg != nil {
		info := err.Msg.Error()
		if info == "会话鉴权失败" {
			result.Set("code").SetInt(2)
		} else {
			result.Set("code").SetInt(0)
		}
		result.Set("info").SetString(err.Msg.Error())
		return result
	}
	result.Set("code").SetInt(1)
	result.Set("info").SetString("ok")
	if tmp.IsNULL() == false {
		result.Set("data").SetObject(tmp)
	}

	return result
}

func (t *LAppController) UploadPic2Oss(fileType string) (url string, m4aurl string, err gutils.LError) {

	if fileType == "" {
		err.Errorf(gutils.ParamError, "文件类型不能为空")
		return
	}
	f, _, errInfo := t.GetFile("file")
	if errInfo != nil {
		err.Errorf(gutils.ParamError, "获取文件失败")
		return "", m4aurl, err
	} else {

		if fileType == "jpeg" {
			fileType = "jpg"
		}
		path := utils.GetApplicationFullName()
		dir := utils.ExtractFileDir(path) + "\\Data\\"
		utils.ForceDirectories(dir)
		imageid := gutils.CreateSTRGUID()
		dest := imageid + "." + fileType
		src := dir + dest
		err.Msg = t.SaveToFile("file", src)
		if err.Msg != nil {
			err.Errorf(gutils.ParamError, "图片保存失败")
			return "", m4aurl, err
		}

		var flyParam config.LJSON
		flyParam.Set("funcid").SetInt(gutils.FUNC_ID_UPLOAD_SOURCE)
		flyParam.Set("filename").SetString(src)
		flyParam.Set("cloudname").SetString(dest)
		res := gutils.FlybearCPlus(flyParam)
		code := res.Get("code").Int()
		if code == 0 {
			err.Errorf(gutils.ParamError, res.Get("info").String())
			return "", m4aurl, err
		}
		f.Close()
		os.Remove(src)
		url := res.Get("url").String()
		m4aurl = res.Get("m4aurl").String()
		//		logs.Info("url", url)
		return url, m4aurl, err
	}
}

func (t *LAppController) HandleData() {
	param := t.GetString("param")
	var result config.LJSON
	if param == "" {
		result.Set("code").SetInt(0)
		result.Set("info").SetString("请求参数不能为空")
		t.Data["json"] = result.Interface()
		t.ServeJSON()
		panic("")
	}
	var obj config.LJSON
	obj.Load(param)

	item := obj.Get("params")
	funcid := item.Get("funcid").Int()
	if funcid == 0 {
		var tmp config.LJSON
		tmp.Set("code").SetInt(0)
		tmp.Set("info").SetString("funcid不能为空")
		result.SetObject(tmp)
	} else {

		if funcid == 1028 {
			fileType := item.Get("fileType").String()
			url, _, errorInfo := t.UploadPic2Oss(fileType)
			if errorInfo.Msg != nil {
				var res config.LJSON
				res.Set("code").SetInt(0)
				res.Set("info").SetString(errorInfo.Msg.Error())
				result.SetObject(res)
			} else {
				result.Set("code").SetInt(1)
				result.Set("info").SetString("ok")
				result.Set("data").Set("url").SetString(url)
			}
		} else {
			item.Set("userid").SetString(t.UserID)
			item.Set("session").SetString(t.Session)
			result.SetObject(t.CheckJ(models.Execute(funcid, item)))
			if funcid == 1000 || funcid == 1100 {
				//保存session - userid
				code := result.Get("code").Int()
				if code == 1 { //更新 redis和session
					userid := result.Get("data").Get("userid").String()
					session := result.Get("data").Get("session").String()
					fmt.Println(userid)
					fmt.Println(session)
					t.SetSession("collegeSession", userid+"|"+session)
					gredis.Set("college_"+userid, session)
				}
			} else if funcid == 1002 {
				code := result.Get("code").Int()
				if code == 1 {
					t.DelSession("collegeSession")
					gredis.Del("college_" + t.UserID)
				}
			}
		}
	}
	t.Data["json"] = result.Interface()
	t.ServeJSON()
}

//获取前端请求参数
func (t *LAppController) GetRequestJ() (result config.LJSON) {
	if t.Ctx.Request.Form == nil {
		t.Ctx.Request.ParseForm()
	}
	for k, v := range t.Ctx.Request.Form {
		x := ""
		if len(v) > 0 {
			x = v[0]
		}
		t.parseRequest(k, &result).SetString(x)
	}
	result.ToString()
	//fmt.Println(" Parse Request: " + str)
	return result
}

func (c *LAppController) parseRequest(txt string, obj *config.LJSON) *config.LJSON {
	s := txt
	for {
		start := strings.Index(s, "[")
		if start == -1 {
			if s != "" {
				obj = obj.Set(s)
			}
			return obj
		} else {
			end := strings.Index(s, "]")
			if end <= start {
				obj = obj.Set(s)
				return obj
			}
			main := s[:start]
			if main != "" {
				obj = obj.Set(main)
			}
			item := s[start+1 : end]
			i, err := strconv.Atoi(item)
			if err == nil {
				for {
					if obj.ItemCount() > i {
						break
					}
					obj.AddItem()
				}
				obj = obj.Item(i)
			} else {
				obj = obj.Set(item)
			}
			s = s[end+1:]
		}
	}
	return obj
}

func (t *LAppController) UploadPic() {
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
				data.Info = "图片存储失败"
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
