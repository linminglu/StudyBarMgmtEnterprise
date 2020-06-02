//author:  曾文 2016-11-07
//purpose： 用户注册相关

package account

import (
	//	"bytes"
	//	"doggy/controllers/aliOss"
	"doggy/controllers/base"
	"doggy/gutils"
	"doggy/gutils/conf"
	"doggy/gutils/gredis"
	"doggy/models/account"
	//	"doggy/models/clinic"
	"doggy/models/model"
	//	"encoding/base64"
	"fmt"
	"strings"
	"time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/logs"
)

//注册页面
func (t *LPreController) UserReg() {
	t.DelSession("userinfo")
	t.DelSession("mchainid")
	t.DelSession("cliniclist")
	t.DelSession("mchainid")
	t.DelSession("cliniclist")
	t.DelSession("chainusername")
	t.DelSession("webright")
	t.DelSession("chainsupper")
	t.DelSession("defaulchainid")
	t.DelSession("defaultclinicid")
	param := t.GetString("param")

	if param == "pa" {
		InputsessionID := t.Ctx.Input.Cookie(base.SvrSession.SessionName)
		CrusessionID := t.Ctx.Input.CruSession.SessionID()
		if InputsessionID != CrusessionID {
			gredis.Set(CrusessionID+"_login", "/paweb/index")
		}
		gredis.Set(InputsessionID+"_login", "/paweb/index")
	} else {
		InputsessionID := t.Ctx.Input.Cookie(base.SvrSession.SessionName)
		CrusessionID := t.Ctx.Input.CruSession.SessionID()
		if InputsessionID != CrusessionID {
			gredis.Set(CrusessionID+"_login", "/login")
		}
		gredis.Set(InputsessionID+"_login", "/login")
	}

	t.TplName = "account/Register/index.html"
}

//注册协议
func (t *LPreController) ServiceTerms() {
	t.TplName = "account/Register/service_terms.html"
}

//设置密码
func (t *LPreController) RegSetPswView() {
	t.TplName = "account/Register/reg_set_pw.html"
}

//选择创建或关联
func (t *LAccountController) RegCliniciSel() {
	t.TplName = "account/Register/reg_clinici_sel.html"
}

//创建诊所
func (t *LAccountController) RegCreateClinic() {
	t.TplName = "account/Register/reg_cre_clinic.html"
}

//创建诊所 其他
func (t *LAccountController) RegrelclinicAnother() {
	t.TplName = "account/Register/reg_rel_clinic_another.html"
}

//关联诊所
func (t *LAccountController) RegRelaClinic() {
	t.TplName = "account/Register/reg_rel_clinic.html"
}

//注册成功
func (t *LAccountController) RegSuccess() {
	t.TplName = "account/Register/reg_success.html"
}

//服务入口 首页
func (t *LAccountController) ServiceIndex() {
	//添加入口页的头像
	var param config.LJSON
	param.Set("mobile").SetString(t.Mobile)
	users := t.CheckJM(accountmodels.GetMobileUserInfo(param))
	t.Data["headimg"] = users.List.Item(0).Get("picture").String()
	fmt.Println(t.Data["headimg"])

	loginID := gutils.CreateSTRGUID()
	gredis.Set("redirect_login_"+loginID, t.UserID)

	if t.ChainID == "" {
		t.TplName = "account/ChainStrom/service_entrance.html"
		return
	}
	var paramx config.LJSON
	paramx.Set("chainguid").SetString(t.ChainID)
	clinicids := t.CheckJM(accountmodels.GetBetaClinicID(paramx))
	isBeta, _ := conf.SvrConfig.String("server", "IsBeta")
	if clinicids.List.ItemCount() != 0 { //诊所是公测版
		if isBeta != "1" { //当前服务器是发布版，需要重定向
			betaUrl, _ := conf.SvrConfig.String("server", "SaasBeta")
			if betaUrl == "" {
				logs.Error("LAccountController::ServiceIndex, betaUrl is not configed")
			}
			defaulchainid, _ := t.GetSession("defaulchainid").(string)     //PC调用或员工登录所在连锁
			defaultclinicid, _ := t.GetSession("defaultclinicid").(string) //PC调用所在诊所
			gredis.Set("defaulchainid_"+loginID, defaulchainid)
			gredis.Set("defaultclinicid_"+loginID, defaultclinicid)
			t.Redirect(betaUrl+"/redirect?loginID="+loginID, 302)
			return
		}
	}
	t.TplName = "account/ChainStrom/service_entrance.html"
}

//服务入口 首页
func (t *LAccountController) ServiceReIndex() {
	//添加入口页的头像
	var param config.LJSON
	param.Set("mobile").SetString(t.Mobile)
	users := t.CheckJM(accountmodels.GetMobileUserInfo(param))
	t.Data["headimg"] = users.List.Item(0).Get("picture").String()
	t.TplName = "account/ChainStrom/service_entrance.html"
}

//注册之发送验证码
func (t *LPreController) SendRegCode() {
	var data gutils.LResultAjax
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	funcidverify := 20105
	funcid := 20100

	sendstatus := accountmodels.SendMobileCode(mobile, funcidverify, funcid)
	if sendstatus {
		data.Code = 1
		data.Info = "发送成功"
	} else {
		data.Code = 0
		data.Info = "发送失败"
	}
	t.Data["json"] = data
	t.ServeJSON()
}

//验证注册手机验证码
func (t *LPreController) CheckRegCode() {
	//手机号 验证码
	var data gutils.LResultAjax
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	code := param.Get("code").String()
	if mobile == "" {
		data.Code = 0
		data.Info = "手机号码不能为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	if code == "" {
		data.Code = 0
		data.Info = "验证码为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	funcidverify := 20105
	checkStatus, info := accountmodels.CheckMobileCode(mobile, code, funcidverify)
	if !checkStatus {
		data.Code = 0
		data.Info = "验证码错误"
	} else {
		data.Code = 1
		data.Info = "验证码正确"
	}
	data.Info = info
	t.Data["json"] = data
	t.ServeJSON()
}

//判断手机号是否注册
func (t *LPreController) CheckUserExist() {
	//验证手机号的账号是否存在
	var data gutils.LResultAjax
	param := t.GetRequestJ()
	users, err := accountmodels.GetMobileUserInfo(param)
	if err.Msg != nil {
		data.Code = 0
		data.Info = err.Msg.Error()
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	user := users.List
	if user.ItemCount() >= 1 {
		data.Code = 0
		data.Info = "该手机号已注册，请更换其他手机号"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}

	data.Code = 1
	data.Info = "用户未注册"
	t.Data["json"] = data
	t.ServeJSON()
	return
}

//注册，生成账号 判断是否重复 验证码验证
func (t *LPreController) Register() {
	var data gutils.LResultAjax
	var checkparam config.LJSON
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	//code := param.Get("code").String()
	password := param.Get("password").String()
	passwordconfirm := param.Get("password_confirm").String()
	if password != passwordconfirm {
		data.Code = 0
		data.Info = "两次输入密码不一致，请重新输入"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	if mobile == "" {
		data.Code = 0
		data.Info = "手机号不能为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	if password == "" {
		data.Code = 0
		data.Info = "密码不能为空，请输入密码"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	//验证手机号的账号是否存在
	checkparam.Set("mobile").SetString(mobile)
	users, err := accountmodels.GetMobileUserInfo(checkparam)
	if err.Msg != nil {
		data.Code = 0
		data.Info = err.Msg.Error()
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	user := users.List
	if user.ItemCount() >= 1 {
		data.Code = 0
		data.Info = "该手机号已注册，请更换其他手机号"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}

	//条件通过之后，进行数据库的写入
	newuser := t.CheckJM(accountmodels.UserReg(param))

	data.Code = 1
	data.Info = "注册成功"
	data.List = newuser.List.Interface()
	t.Data["json"] = data

	//设置为登录
	email := ""
	name := ""
	picture := ""
	userid := newuser.List.Get("userid").String()
	bbsid := ""
	t.SetSession("userinfo", email+"|"+name+"|"+picture+"|"+userid+"|"+bbsid+"|"+mobile)
	t.SetSession("psw", password) //由于MD5密码不可逆,暂时这样处理
	t.ServeJSON()
}

//新建诊所
func (t *LAccountController) NewClinic() {
	//	param := t.GetRequestJ()
	//	img := param.Get("imgdata").String()
	//	clinicid := gutils.CreateSTRGUID()

	//	if img != "" && strings.Contains(img, ".png") == false && strings.Contains(img, "http") == false {
	//		buf, _ := base64.StdEncoding.DecodeString(img) //成图片文件并把文件写入到buffer
	//		f := bytes.NewReader(buf)
	//		picname := models.MD5FileName(clinicid) + ".jpg"
	//		err := aliOss.AliOssUploadFileByFile(picname, f)
	//		if err != nil {
	//			t.ErrorJ("上传诊所图像失败")
	//			return
	//		}
	//		filePath := aliOss.AliOssReturnUrl(picname)
	//		param.Set("hospitalicon").SetString(filePath)
	//		param.Set("imgdata").SetString("")
	//	}

	//	param.Set("userid").SetString(t.UserID)
	//	param.Set("clinicid").SetString(clinicid)
	//	t.CheckJ(accountmodels.CreateClinic(param))

	//	if t.ChainID != "" {
	//		cliniclist := ""
	//		clinicjs := t.CheckJM(models.LoadClinicList(t.ChainID))
	//		for i := 0; i < clinicjs.List.ItemCount(); i++ {
	//			if cliniclist != "" {
	//				cliniclist += ","
	//			}
	//			cliniclist += fmt.Sprintf("'%s'", clinicjs.List.Item(i).Get("clinicid").String())
	//		}
	//		t.SetSession("cliniclist", cliniclist)
	//		t.ClinicIDList = cliniclist
	//	}

	//	var data gutils.LResultAjax
	//	data.Code = 1
	//	data.Info = "创建成功"
	//	t.Data["json"] = data
	//	t.ServeJSON()
	//	var js1 config.LJSON
	//	js1.Set("userid").SetString(t.UserID)
	//	t.SaveUserSession(js1)
}

//校验权限
func (t *LPreController) CheckRight(ChainWebRight string, RightValue string, ChainSupper string) (result bool) {
	if strings.Contains(ChainWebRight, RightValue) == false && ChainSupper != "1" {
		return false
	}
	return true
}

func (t *LPreController) PCLoginView() {
	if t.GetString("isBind", "0") == "1" {
		t.Data["isBind"] = "1"
		t.Data["clinicid"] = t.GetString("cid", "")
		t.Data["koalaid"] = t.GetString("kid", "")
	}

	t.Data["dentalid"], _ = t.GetSession("tmpdentalid").(string)
	t.Data["docname"], _ = t.GetSession("tmpdocname").(string)

	t.TplName = "account/Login/login_pc.html"
}

func (t *LPreController) ERRMSG() {
	t.Data["errmsg"] = t.GetString(":splat")
	t.TplName = "errormsg.html"
}

//PC调用  旧的加密方式
func (t *LPreController) PC() {
	param := t.GetRequestJ()
	s, _ := t.GetSession("pcload").(string)
	token := param.Get("v").String()
	if token == "" {
		token = t.GetString(":splat")
	}

	if token == "sync" { //只是为了保持登录
		t.SuccessJ("OK")
		return
	}

	if token == "" {
		t.Redirect("/errmsg/"+"参数错误", 302)
		return
	}

	if token == "back" && s == "1" {
		token, _ = t.GetSession("pcparam").(string)
	} else {
		t.SetSession("pcparam", token) //记住请求参数,用于登录或绑定手机后再跳转回原来的请求
	}

	//s := "13295|医生72|123456|10000"
	var param1 config.LJSON
	param1.Set("funcid").SetInt(gutils.FUNC_ID_CIPHERKEY_DECRYPT)
	param1.Set("key").SetString(gutils.AESKey)
	param1.Set("val").SetString(token)
	res := gutils.FlybearCPlus(param1)

	if res.Get("code").Int() != 1 {
		t.Redirect("/errmsg/"+"参数分析失败", 302)
		return
	}

	v := res.Get("info").String()

	if v == "ok" {
		token = token + "/"
		param1.Set("funcid").SetInt(gutils.FUNC_ID_CIPHERKEY_DECRYPT)
		param1.Set("key").SetString(gutils.AESKey)
		param1.Set("val").SetString(token)
		res := gutils.FlybearCPlus(param1)
		if res.Get("code").Int() != 1 {
			t.Redirect("/errmsg/"+"参数分析失败", 302)
			return
		}
		v = res.Get("info").String()
	}
	t.ProcessPC(v, param)
}

//PC调用  标准版调用
func (t *LPreController) STDPCWEB() {
	t.SetSession("pcversion", "std")
	t.PCWEB()
}

//PC调用  专业版调用
func (t *LPreController) PCWEB() {
	param := t.GetRequestJ()
	s, _ := t.GetSession("pcload").(string)
	token := param.Get("v").String()
	if token == "" {
		token = t.GetString(":splat")
	}

	if token == "sync" { //只是为了保持登录
		t.SuccessJ("OK")
		return
	}

	if token == "" {
		t.Redirect("/errmsg/"+"参数错误", 302)
		return
	}

	if token == "back" && s == "1" {
		token, _ = t.GetSession("pcparam").(string)
	} else {
		t.SetSession("pcparam", token) //记住请求参数,用于登录或绑定手机后再跳转回原来的请求
	}

	//s := "13295|医生72|123456|10000"
	var param1 config.LJSON
	param1.Set("funcid").SetInt(gutils.FUNC_ID_CIPHERWEB_DECRYPT)
	param1.Set("key").SetString(gutils.AESKey)
	param1.Set("val").SetString(token)
	res := gutils.FlybearCPlus(param1)

	if res.Get("code").Int() != 1 {
		t.Redirect("/errmsg/"+"参数分析失败", 302)
		beego.Info("PC", "原始参数", token)
		return
	}

	v := res.Get("info").String()
	if v == "ok" {
		t.Redirect("/errmsg/"+"参数分析失败", 302)
		beego.Info("PC", "原始参数", token)
		return
	}
	t.ProcessPC(v, param)
}

func (t *LPreController) ProcessPC(v string, param config.LJSON) {
	val := strings.Split(v, "|")
	if len(val) < 5 {
		t.Redirect("/errmsg/"+"参数版本错误", 302)
		//beego.Info("PC", "原始参数", token)
		beego.Info("PC", "参数版本错误", v)
		return
	}
	dentalid := val[0]
	docname := val[1]
	psw := val[2]
	psw = strings.Replace(psw, "<<-->>", "|", -1)
	funid := val[3]
	pct := val[4]
	s, _ := t.GetSession("pcload").(string)
	if s != "1" {
		t.SetSession("tmpdentalid", dentalid) //记住请求参数,用于登录或绑定手机
		t.SetSession("tmpdocname", docname)
		t.SetSession("tmppsw", psw)

		k := time.Now()
		d1, _ := time.ParseDuration("-2h")
		d2, _ := time.ParseDuration("2h")
		t1 := k.Add(d1)
		t2 := k.Add(d2)
		pctime := gutils.GetTime(pct)

		if (pct == "") || pctime.Before(t1) || pctime.After(t2) {
			t.Redirect("/errmsg/"+"请求已失效,请确认电脑时间是否正确", 302)
			return
		}

		param.Set("dentalid").SetString(dentalid)
		param.Set("doctorname").SetString(docname)
		param.Set("password").SetString(psw)
		param.Set("nocheckpsw").SetString("1")

		user, err1 := accountmodels.GetDoctorInfoByDentalID(param)
		if err1.Msg != nil {
			if err1.Msg.Error() == "未找到管家号对应诊所" {
				t.Redirect("/errmsg/"+err1.Msg.Error(), 302)
			} else {
				t.Redirect("/pcloginview", 302)
			}

			return
		}
		clinicid := user.List.Item(0).Get("clinicuniqueid").String()
		mchainID := user.List.Item(0).Get("chainid").String()
		//检查数据完整性
		newid, _ := accountmodels.CheckClinicData(clinicid, dentalid, mchainID)
		if newid != "" {
			mchainID = newid
		}

		param.Set("koalaid").SetString(user.List.Item(0).Get("doctorid").String())
		param.Set("clinicid").SetString(user.List.Item(0).Get("clinicuniqueid").String())
		param.Set("chainid").SetString(mchainID)

		t.SetSession("koalaid", user.List.Item(0).Get("doctorid").String())

		version, _ := t.GetSession("pcversion").(string)
		param.Set("version").SetString(version)
		userinfo, er := accountmodels.GetUserInfoByKoalaID(param)
		if er.Msg != nil {
			t.Redirect("/errmsg/"+er.Msg.Error(), 302)
			return
		}
		if userinfo.List.ItemCount() == 0 {
			kid := user.List.Item(0).Get("doctorid").String()
			cid := user.List.Item(0).Get("clinicuniqueid").String()
			u := fmt.Sprintf("/pcloginview?isBind=1&kid=%s&cid=%s", kid, cid)
			t.Redirect(u, 302)
			return
		}
		userid := userinfo.List.Item(0).Get("userid").String()
		t.SetSession("defaultclinicid", clinicid) //记住PC调用的诊所
		t.SetSession("defaulchainid", mchainID)   //要记当前诊所所在的ChainID,刷新诊所列表时要用

		t.SetSession("pcload", "1") //标记为PC调用并能已经通过验证
		var js config.LJSON
		js.Set("userid").SetString(userid)
		t.SaveUserSession(js)
	}

	cid, _ := t.GetSession("defaultclinicid").(string)
	chainid, _ := t.GetSession("defaulchainid").(string)
	uinfo, _ := t.GetSession("userinfo").(string)
	tmp := strings.Split(uinfo, "|")
	uid := tmp[3]
	param.Set("ClinicID").SetString(cid)
	param.Set("chainid").SetString(chainid)
	param.Set("funcid").SetString(funid)
	param.Set("userid").SetString(uid)
	param.Set("remoteip").SetString(t.GetClientIP())
	model.AddFuncLog(param, "PC调用功能:"+funid+","+gutils.FuncMap[funid]+","+docname+","+dentalid, funid, 11)

	//取对应连锁店ID 和 诊所ID
	switch funid {
	case "10000":
		t.Redirect("/netconsult/netconsult", 302)
	case "10001":
		t.Redirect("/netconsult/todayconsulthtml", 302)
	case "10002":
		t.SetSession("newnetconsult", "1")
		t.Redirect("/netconsult/todayconsulthtml", 302)
	case "20000":
		t.Redirect("/market/index", 302)
	case "20001":
		t.Redirect("/market/massage/masssms", 302)
	case "20002":
		t.Redirect("/VWeb/Index", 302)
	case "20003":
		t.Redirect("/VWeb/pcmesslist?dentalid="+dentalid, 302) // PC 图文列表
	case "20004":
		t.Redirect("/VWeb/Index?showmap=1&cid="+cid, 302) //诊所地图
	case "30000":
		t.Redirect("/report/today", 302)
	case "40000":
		t.Redirect("/finance/index", 302)
	case "50000":
		t.Redirect("/store", 302)
	case "60000":
		t.Redirect("/clinic/index", 302)
	case "60001":
		t.Redirect("/clinicmember/linkmanage", 302) //连锁管理
	case "80000":
		t.Redirect("/market/viplist", 302)
	case "80001":
		id := ""
		if len(val) >= 6 {
			id = val[5]
		}
		t.Redirect("/market/vipright?vipcardid="+id, 302)
	case "80002":
		id := ""
		customerid := ""
		if len(val) >= 6 {
			id = val[5]
		}
		if len(val) >= 7 {
			customerid = val[6]
		}
		t.Redirect("/market/vipcharge?vipcardid="+id+"&customerid="+customerid, 302)
	case "80003":
		id := ""
		if len(val) >= 6 {
			id = val[5]
		}
		t.Redirect("/market/addvip?customerid="+id, 302)
	case "80004":
		id := ""
		if len(val) >= 6 {
			id = val[5]
		}
		t.Redirect("/market/viplevelright?viplevelid="+id, 302)
	case "80005":
		id := ""
		if len(val) >= 6 {
			id = val[5]
		}
		t.Redirect("/market/vipfeelist?vipcardid="+id, 302)

	default:
		t.Redirect("/index", 302)

	}

}

//后台调用 患者详细信息
func (t *LPreController) PatInfo() {
	param := t.GetRequestJ()
	str, _ := gredis.Get("dituiusersession")
	mdrstr := str + param.Get("cid").String()
	sign := gutils.Md5(mdrstr)
	if str != "" && sign == param.Get("sign").String() {
		if time.Now().Format("2006-01-02") != str {
			t.Ctx.WriteString("超时，请刷新主页面重新进入")
			return
		}
		t.SetSession("userinfo", "|||1||")
		t.TplName = "patient/person_info_inc.html"
	} else {
		t.Ctx.WriteString("没有相应权限，或session超时")
	}

}
