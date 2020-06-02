//author:  曾文 2016-11-07
//purpose： 用户登录相关

package account

import (
	"doggy/controllers/aliOss"
	"doggy/controllers/base"
	"doggy/gutils"
	"doggy/gutils/gredis"
	"doggy/models/account"
	"fmt"
	"net"
	"strings"
	"time"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/utils"
)

//用于前端调试页面
func (t *LPreController) TestView() {
	temp := t.GetString(":path")
	ext := t.GetString(":ext")
	if temp == "" {
		temp = "index.html"
	}
	t.TplName = temp + "." + ext
}

//查看stl
func (t *LPreController) ViewSTL() {
	name := t.GetString("modelName")
	path := utils.GetApplicationFullName()
	dir := utils.ExtractFileDir(path) + "\\static\\stlf\\"
	utils.ForceDirectories(dir)
	local := dir + name
	aliOss.AliOssDownload(name, local)
	t.TplName = "3dview/3dview.html"
}

func (t *LPreController) Video() {

	name := t.GetString("name")
	videoUrl, err := aliOss.AliOssSignURL(name)
	code := t.GetString("fussen")
	if code == "1" {
		t.Redirect(videoUrl, 302)
		return
	}

	// 获取视频名字,图片
	jpg := utils.ChangeFileExt(name, "jpg")
	jpgUrl, err := aliOss.AliOssSignURL(jpg)
	if err != nil {
		t.ErrorJ(fmt.Sprint(err))
		return
	}
	if err != nil {
		t.ErrorJ(fmt.Sprint(err))
		return
	}
	t.Data["name"] = ""
	t.Data["imgsrc"] = jpgUrl
	t.Data["uri"] = videoUrl
	t.TplName = "wechat/other/video.html"
}

func (t *LPreController) RedirectURI() {
	ruri := t.GetString("r")
	if ruri == "" {
		ruri = "http://www.yayibang.com"
	}
	t.Redirect(ruri, 302)
}

//登录页面
func (t *LPreController) UserLogin() {

	InputSession := t.Ctx.Input.Cookie(base.SvrSession.SessionName)

	url, _ := gredis.Get(InputSession + "_login")
	if url == "" || url == "/login" {
		//获取后台设置的banner  带入模板变量
		banner := t.CheckJ(accountmodels.Getbanner())
		t.Data["banner"] = banner
		t.TplName = "account/Login/login.html"
	} else if url == "/paweb/index" {
		t.TplName = "account/PAweb/index.html"
	}
}

//激活个人账号
func (t *LAccountController) ActivPerAccount() {
	t.TplName = "account/Login/activ_per_account.html"
}

//关联诊所
func (t *LAccountController) BindClinicView() {
	t.TplName = "account/Login/bind_clinic.html"
}

//重置密码
func (t *LAccountController) ResetPasswordView() {
	t.TplName = "account/Login/reset_password.html"
}

//重定向登录
func (t *LPreController) RedirectLogin() {
	t.DelSession("userinfo")
	t.DelSession("mchainid")
	t.DelSession("cliniclist")
	t.DelSession("chainusername")
	t.DelSession("webright")
	t.DelSession("chainsupper")
	t.DelSession("defaulchainid")
	t.DelSession("defaultclinicid")
	t.DelSession("MsgClinicId")
	param := t.GetRequestJ()
	loginID := param.Get("loginID").String()
	if loginID == "" {
		logs.Error("redirect login error:loginID is empty!")
		t.Redirect("/login", 302)
		return
	}
	userid, err := gredis.Get("redirect_login_" + loginID)
	if err != nil {
		logs.Error("redirect login error:loginID not exist!", loginID, err)
		t.Redirect("/login", 302)
		return
	}
	defaulchainid, err := gredis.Get("defaulchainid_" + loginID)
	defaultclinicid, err := gredis.Get("defaultclinicid_" + loginID)
	t.SetSession("defaulchainid", defaulchainid)
	t.SetSession("defaultclinicid", defaultclinicid)

	var js config.LJSON
	js.Set("userid").SetString(userid)
	t.SaveUserSession(js)

	//添加入口页的头像
	gredis.Del("redirect_login_" + loginID)
	gredis.Del("defaulchainid_" + loginID)
	gredis.Del("defaultclinicid_" + loginID)
	t.Redirect("/reindex", 302)
	return
}

//手机登录
func (t *LPreController) MobileLogin() {
	t.DelSession("userinfo")
	t.DelSession("mchainid")
	t.DelSession("cliniclist")
	t.DelSession("chainusername")
	t.DelSession("webright")
	t.DelSession("chainsupper")
	t.DelSession("defaulchainid")
	t.DelSession("defaultclinicid")
	t.DelSession("MsgClinicId")
	param := t.GetRequestJ()
	password := param.Get("password").String()
	mobile := param.Get("mobile").String()
	if mobile == "" {
		t.ErrorJ("手机号不能为空")
		return
	}
	if password == "" {
		t.ErrorJ("密码不能为空，请输入密码")
		return
	}

	users := t.CheckJM(accountmodels.GetMobileUserInfo(param))
	var user config.LJSON
	user = users.List
	pwd := strings.ToLower(user.Item(0).Get("password").String())
	rspwd := strings.ToLower(user.Item(0).Get("reservepassword").String())

	if user.ItemCount() <= 0 {
		t.ErrorJ("用户名或密码错误")
		return
	}
	if pwd != gutils.Md5(password) {
		t.ErrorJ("用户名或密码错误")
		return
	}

	userid := user.Item(0).Get("userid").String()
	//mobile := user.Item(0).Get("mobile").String()
	datastatus := user.Item(0).Get("datastatus").String()

	var result config.LJSON
	result.Set("userstatus").SetString(datastatus)

	if datastatus == "1" {
		//cliniclist := t.CheckJM(accountmodels.GetClinicInofByMobile(param))
		cliniccount := 1    // cliniclist.List.ItemCount()
		samepassword := "1" // cliniclist.TotalList.Get("samepassword").String()
		result.Set("cliniccount").SetInt(cliniccount)
		result.Set("samepassword").SetString(samepassword)
	}

	//写入登入记录 //终端 1网站 2手机 3PC客户 端
	//ip := t.Ctx.Request.RemoteAddr
	ip := t.Ctx.Input.IP()
	//tmp :=ip // strings.Split(ip, ":")
	t.CheckJ(accountmodels.AddLoginLog(ip, userid, 1, mobile, 1))

	if rspwd == "" { //reservepassword为空的情况下,要把当前密码加密后放到reservepassword

		t.CheckJ(accountmodels.UpdateReservePassword(userid, password))
	}

	var js config.LJSON
	js.Set("userid").SetString(userid)
	t.SaveUserSession(js)

	var data gutils.LResultAjax
	data.List = result.Interface()
	data.Code = 1
	data.Info = "登录成功"
	t.Data["json"] = data
	t.ServeJSON()
	return

}

//诊所加盟登录接口(使用手机号进行登录)
func (t *LPreController) ClinicMobileLogin() {
	t.DelSession("userinfo")
	t.DelSession("mchainid")
	t.DelSession("cliniclist")
	t.DelSession("chainusername")
	t.DelSession("webright")
	t.DelSession("chainsupper")
	param := t.GetRequestJ()
	password := param.Get("password").String()
	mobile := param.Get("mobile").String()
	if mobile == "" {
		t.ErrorJ("手机号不能为空")
		return
	}
	if password == "" {
		t.ErrorJ("密码不能为空，请输入密码")
		return
	}

	users := t.CheckJM(accountmodels.GetMobileUserInfo(param))
	var user config.LJSON
	user = users.List
	pwd := strings.ToLower(user.Item(0).Get("password").String())
	rspwd := strings.ToLower(user.Item(0).Get("reservepassword").String())

	if user.ItemCount() <= 0 {
		t.ErrorJ("用户名或密码错误")
		return
	}
	if pwd != gutils.Md5(password) {
		t.ErrorJ("用户名或密码错误")
		return
	}

	userid := user.Item(0).Get("userid").String()
	//mobile := user.Item(0).Get("mobile").String()

	//判断密码是否一致(无用)
	//	result.Set("userstatus").SetString(datastatus)

	//	if datastatus == "1" {
	//		cliniclist := t.CheckJM(accountmodels.GetClinicInofByMobile(param))
	//		cliniccount := cliniclist.List.ItemCount()
	//		samepassword := "1" // cliniclist.TotalList.Get("samepassword").String()
	//		result.Set("cliniccount").SetInt(cliniccount)
	//		result.Set("samepassword").SetString(samepassword)
	//	}

	//写入登入记录 //终端 1网站 2手机 3PC客户 端
	//	ip := t.Ctx.Request.RemoteAddr
	//	tmp := strings.Split(ip, ":")
	//	t.CheckJ(accountmodels.AddLoginLog(tmp[0], userid, 1, mobile, 1))

	if rspwd == "" { //reservepassword为空的情况下,要把当前密码加密后放到reservepassword

		t.CheckJ(accountmodels.UpdateReservePassword(userid, password))
	}

	var js config.LJSON
	js.Set("userid").SetString(userid)
	t.SaveUserSession(js)
	apply := t.CheckJM(accountmodels.IsCommitApply(js))
	IsCommit := apply.List.Get("iscommit").Int()

	var result config.LJSON
	if IsCommit == 0 {
		result.Set("url").SetString("/paweb/applypage")
	} else { //跳转个人中心
		result.Set("url").SetString("/member/applyprogress")
	}
	gredis.Set(t.Ctx.Input.CruSession.SessionID()+"_login", "/paweb/index")
	var data gutils.LResultAjax
	data.List = result.Interface()
	data.Code = 1
	data.Info = "登录成功"
	t.Data["json"] = data
	t.ServeJSON()
	return
}

//员工登录
func (t *LPreController) EmployeeLogin() {
	t.DelSession("userinfo")
	t.DelSession("mchainid")
	t.DelSession("cliniclist")
	t.DelSession("chainusername")
	t.DelSession("webright")
	t.DelSession("chainsupper")
	t.DelSession("defaulchainid")
	t.DelSession("defaultclinicid")
	t.DelSession("MsgClinicId")
	param := t.GetRequestJ()
	param.Set("nocheckpsw").SetString("0") //一定要密码判断 ,防止前端传了个参数过来
	user := t.CheckJM(accountmodels.GetDoctorInfoByDentalID(param))
	param.Set("koalaid").SetString(user.List.Item(0).Get("doctorid").String())
	param.Set("clinicid").SetString(user.List.Item(0).Get("clinicuniqueid").String())
	param.Set("chainid").SetString(user.List.Item(0).Get("chainid").String())

	t.SetSession("defaulchainid", user.List.Item(0).Get("chainid").String())          //要记当前诊所所在的ChainID,刷新诊所列表时要用
	t.SetSession("defaultclinicid", user.List.Item(0).Get("clinicuniqueid").String()) //记住当前登录的诊所

	var data gutils.LResultAjax
	var result config.LJSON
	//cliniclist := t.CheckJM(accountmodels.GetClinicInofByKoalaID(param))
	cliniclist := t.CheckJM(accountmodels.GetUserIDByKoalaID(param))
	cliniccount := cliniclist.List.ItemCount()
	samepassword := "1" //cliniclist.TotalList.Get("samepassword").String()
	result.Set("cliniccount").SetInt(cliniccount)
	result.Set("samepassword").SetString(samepassword)
	if cliniccount == 0 {
		result.Set("koalaid").SetString(user.List.Item(0).Get("doctorid").String())
		result.Set("clinicid").SetString(user.List.Item(0).Get("clinicuniqueid").String())
	}

	userid := cliniclist.List.Item(0).Get("userid").String()
	mobile := cliniclist.List.Item(0).Get("mobile").String()
	//ip := t.Ctx.Request.RemoteAddr
	ip := t.Ctx.Input.IP()
	//tmp :=ip// strings.Split(ip, ":")
	t.CheckJ(accountmodels.AddLoginLog(ip, userid, 1, mobile, 1))
	fmt.Println(userid)
	if userid != "" {
		var js config.LJSON
		js.Set("userid").SetString(userid)
		t.SaveUserSession(js)
	} else {
		email := cliniclist.List.Item(0).Get("email").String()
		name := cliniclist.List.Item(0).Get("name").String()
		picture := cliniclist.List.Item(0).Get("picture").String()
		bbsid := cliniclist.List.Item(0).Get("userno").String()
		t.SetSession("userinfo", email+"|"+name+"|"+picture+"|"+userid+"|"+bbsid+"|"+mobile)
	}
	data.List = result.Interface()

	data.Code = 1
	data.Info = "登录成功"
	t.Data["json"] = data
	t.ServeJSON()
}

//移动端登录商场
func (t *LPreController) MallLogin() {
	clinicid := t.GetString("clinicid")
	userid := t.GetString("userid")
	session := t.GetString("session")
	redirect := t.GetString("redirect")
	if clinicid == "" || userid == "" || session == "" {
		t.ErrorMall("参数错误")
	}

	var param config.LJSON
	param.Set("clinicid").SetString(clinicid)
	param.Set("userid").SetString(userid)
	param.Set("session").SetString(session)

	clinic := t.CheckMall(accountmodels.VerifySessionIsOK(param))
	token := clinic.List.Item(0).Get("token").String()

	var authObj config.LJSON
	authObj.Set("funcid").SetInt(gutils.FUNC_ID_MALL_RSA_ENCRYPT)
	authObj.Set("clinicid").SetString(clinicid)
	authObj.Set("token").SetString(token)
	authObj.Set("pubkey").SetString("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgAQOiHgVAZ5dHFaPC2XZOEwbkdf9aISC1yCLyV94SJ+EAum2dkCM5E9XYNwxyYiTzcSIMhoCZ8DiO8HVsBDhHmGjDVaEg2uTu0l8q3ZuOuD1mToTOrb7sP+xrjEQiRFZ/mv4n3pcQ+XNG+k8buPw7vxl+boUG3sC1mE4U2AizUQIDAQAB")
	res := gutils.FlybearCPlus(authObj)
	fmt.Println(res.ToString())
	if res.Get("code").Int() != 1 {
		t.ErrorMall("加密失败")
	}

	tk := res.Get("res").String()

	url := `https://minishop.dental360.cn/mobile/user?uid=` + clinicid + "&token=" + tk
	if redirect != "" {
		url += "&redirect=" + redirect
	}
	fmt.Println(url)
	t.Redirect(url, 302)

	var data gutils.LResultAjax
	data.Code = 1
	data.Info = "登录成功"
	t.Data["json"] = data
	t.ServeJSON()

}

//微信授权加密登录
func (t *LPreController) WXLogin() {
	auth := t.GetString("auth")
	if auth == "" {
		t.ErrorJScan("授权参数不能为空")
	}
	//授权解密
	var authObj config.LJSON
	authObj.Set("funcid").SetInt(gutils.FUNC_ID_SYS_RAS_DECRYPT)
	authObj.Set("str").SetString(auth)
	result := gutils.FlybearCPlus(authObj)
	fmt.Println(result.ToString())
	if result.Get("code").Int() != 1 {
		t.ErrorJScan("授权参数解密失败")
	}

	decryptstr := result.Get("decryptstr").String()
	var value config.LJSON
	value.Load(decryptstr)
	clinicid := value.Get("clinicid").String()
	userid := value.Get("userid").String()
	if clinicid == "" || userid == "" {
		t.ErrorJScan("参数错误")
	}

	var param config.LJSON
	param.Set("clinicid").SetString(clinicid)
	param.Set("userid").SetString(userid)

	user := t.CheckJScan(accountmodels.GetKoalaIDByUserID(param))
	koalaid := user.List.Item(0).Get("koalaid").String()
	param.Set("koalaid").SetString(koalaid)

	t.SetSession("reportright", "0")
	chaininfo := t.CheckJScan(accountmodels.GetChainID(param))

	chainid := chaininfo.List.Item(0).Get("chainid").String()
	clinicname := chaininfo.List.Item(0).Get("clinicname").String()

	param.Set("chainid").SetString(chainid)
	t.CheckJScan(accountmodels.CheckReportRight(param))
	t.SetSession("reportright", "1")
	t.SetSession("logininfo", chainid)
	t.SetSession("choosedate", time.Now().Format("2006-01-02"))

	var chooseclinic map[string]interface{}
	chooseclinic = make(map[string]interface{})

	chooseclinic["name"] = clinicname
	chooseclinic["clinicid"] = clinicid

	t.SetSession("mobileclinic", chooseclinic)

	t.Redirect("/report/mobile/center", 302)
	var data gutils.LResultAjax
	data.Code = 1
	data.Info = "登录成功"
	t.Data["json"] = data
	t.ServeJSON()
}

//app查看运营中心网页

func (t *LPreController) AppLogin() {
	var param config.LJSON
	clinicid := t.GetString("clinicid")
	param.Set("clinicid").SetString(clinicid)
	param.Set("userid").SetString(t.GetString("userid"))

	user := t.CheckJScan(accountmodels.GetKoalaIDByUserID(param))
	koalaid := user.List.Item(0).Get("koalaid").String()
	param.Set("koalaid").SetString(koalaid)

	t.SetSession("reportright", "0")
	chaininfo := t.CheckJScan(accountmodels.GetChainID(param))

	chainid := chaininfo.List.Item(0).Get("chainid").String()
	clinicname := chaininfo.List.Item(0).Get("clinicname").String()

	param.Set("chainid").SetString(chainid)
	t.CheckJScan(accountmodels.CheckReportRight(param))
	t.SetSession("reportright", "1")
	t.SetSession("logininfo", chainid)
	t.SetSession("choosedate", time.Now().Format("2006-01-02"))

	var chooseclinic map[string]interface{}
	chooseclinic = make(map[string]interface{})

	chooseclinic["name"] = clinicname
	chooseclinic["clinicid"] = clinicid

	t.SetSession("mobileclinic", chooseclinic)

	t.Redirect("/report/mobile/center", 302)
	var data gutils.LResultAjax
	data.Code = 1
	data.Info = "登录成功"
	t.Data["json"] = data
	t.ServeJSON()
}

//移动端员工登录
func (t *LPreController) ReportEmployeeLogin() {
	param := t.GetRequestJ()
	user := t.CheckJM(accountmodels.GetDoctorInfoByDentalID(param))
	clinicid := user.List.Item(0).Get("clinicuniqueid").String()
	koalaid := user.List.Item(0).Get("doctorid").String()

	param.Set("clinicid").SetString(clinicid)
	param.Set("koalaid").SetString(koalaid)
	t.SetSession("reportright", "0")
	chaininfo := t.CheckJM(accountmodels.GetChainID(param))

	chainid := chaininfo.List.Item(0).Get("chainid").String()
	clinicname := chaininfo.List.Item(0).Get("clinicname").String()

	param.Set("chainid").SetString(chainid)
	t.CheckJM(accountmodels.CheckReportRight(param))
	t.SetSession("reportright", "1")
	t.SetSession("logininfo", chainid)
	t.SetSession("choosedate", time.Now().Format("2006-01-02"))

	var chooseclinic map[string]interface{}
	chooseclinic = make(map[string]interface{})

	chooseclinic["name"] = clinicname
	chooseclinic["clinicid"] = clinicid

	t.SetSession("mobileclinic", chooseclinic)

	var data gutils.LResultAjax
	data.Code = 1
	data.Info = "登录成功"
	t.Data["json"] = data
	t.ServeJSON()
}

//移动端手机登录
func (t *LPreController) ReportMobileLogin() {
	param := t.GetRequestJ()
	password := param.Get("password").String()
	mobile := param.Get("mobile").String()
	if mobile == "" {
		t.ErrorJScan("手机号不能为空")
		return
	}
	if password == "" {
		t.ErrorJScan("密码不能为空，请输入密码")
		return
	}

	users := t.CheckJScan(accountmodels.GetMobileUserInfo(param))
	var user config.LJSON
	user = users.List
	pwd := strings.ToLower(user.Item(0).Get("password").String())
	rspwd := strings.ToLower(user.Item(0).Get("reservepassword").String())

	if user.ItemCount() <= 0 {
		t.ErrorJScan("用户名或密码错误")
		return
	}
	if pwd != gutils.Md5(password) {
		t.ErrorJScan("用户名或密码错误")
		return
	}
	email := user.Item(0).Get("email").String()
	name := user.Item(0).Get("name").String()
	picture := user.Item(0).Get("picture").String()
	userid := user.Item(0).Get("userid").String()
	bbsid := user.Item(0).Get("userno").String()
	//mobile := user.Item(0).Get("mobile").String()
	datastatus := user.Item(0).Get("datastatus").String()

	var result config.LJSON
	result.Set("userstatus").SetString(datastatus)

	if datastatus == "1" {
		cliniclist := t.CheckJScan(accountmodels.GetClinicInofByMobile(param))
		cliniccount := cliniclist.List.ItemCount()
		samepassword := cliniclist.TotalList.Get("samepassword").String()
		result.Set("cliniccount").SetInt(cliniccount)
		result.Set("samepassword").SetString(samepassword)
	}

	//写入登入记录 //终端 1网站 2手机 3PC客户 端
	//ip := t.Ctx.Request.RemoteAddr
	ip := t.Ctx.Input.IP()
	//tmp :=ip// strings.Split(ip, ":")
	t.CheckJScan(accountmodels.AddLoginLog(ip, userid, 1, mobile, 1))
	t.SetSession("logininfo", email+"|"+name+"|"+picture+"|"+userid+"|"+bbsid+"|"+mobile)
	if rspwd == "" { //reservepassword为空的情况下,要把当前加密后放到reservepassword

		t.CheckJScan(accountmodels.UpdateReservePassword(userid, password))
	}
	var data gutils.LResultAjax
	data.List = result.Interface()
	data.Code = 1
	data.Info = "登录成功"
	t.Data["json"] = data
	t.ServeJSON()
	return
}

//激活账号
func (t *LAccountController) ActiveAccount() {
	param := t.GetRequestJ()
	param.Set("userid").SetString(t.UserID)
	cliniclist := t.CheckJM(accountmodels.ActiveAccountByDentalID(param))
	var data gutils.LResultAjax
	data.Code = 1
	data.Info = "激活成功"
	data.List = cliniclist.List.Interface()
	data.Main = cliniclist.TotalList.Interface()
	t.Data["json"] = data
	t.ServeJSON()
}

//关联诊所
func (t *LAccountController) BindClinic() {
	param := t.GetRequestJ()
	param.Set("userid").SetString(t.UserID)
	param.Set("mobile").SetString(t.Mobile)
	data := t.CheckJ(accountmodels.BindClinicByDentalID(param))

	cliniclist := t.CheckJM(accountmodels.GetClinicInofByMobile(param))
	cliniccount := cliniclist.List.ItemCount()
	samepassword := cliniclist.TotalList.Get("samepassword").String()
	var result config.LJSON
	result.Set("cliniccount").SetInt(cliniccount)
	result.Set("samepassword").SetString(samepassword)

	data.List = result.Interface()
	data.Code = 1
	data.Info = "关联成功"
	t.Data["json"] = data
	t.ServeJSON()
}

//重置诊所密码
func (t *LAccountController) ResetPassword() {
	param := t.GetRequestJ()
	param.Set("userid").SetString(t.UserID)
	param.Set("mobile").SetString(t.Mobile)

	password := param.Get("password").String()
	passwordconfirm := param.Get("password_confirm").String()

	if password == "" {
		t.ErrorJ("密码不能为空，请输入密码")
		return
	}

	if password != passwordconfirm {
		t.ErrorJ("两次输入密码不一致，请重新输入")
		return
	}
	data := t.CheckJ(accountmodels.ResetAllPassword(param))
	data.Code = 1
	data.Info = "重置成功"
	t.Data["json"] = data
	t.ServeJSON()
}

//忘记密码
func (t *LPreController) ForgetPassword() {
	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	if mobile == "" {
		t.ErrorJ("手机号不能为空")
		return
	}
	users := t.CheckJM(accountmodels.GetMobileUserInfo(param))
	var user config.LJSON
	user = users.List
	userid := user.Item(0).Get("userid").String()
	param.Set("userid").SetString(userid)
	password := param.Get("password").String()
	passwordconfirm := param.Get("password_confirm").String()

	if password == "" {
		t.ErrorJ("密码不能为空，请输入密码")
		return
	}

	if password != passwordconfirm {
		t.ErrorJ("两次输入密码不一致，请重新输入")
		return
	}
	data := t.CheckJ(accountmodels.ResetAllPassword(param))
	data.Code = 1
	data.Info = "重置成功"
	t.Data["json"] = data
	t.ServeJSON()
}

//关联手机
func (t *LAccountController) BindMobile() {
	var data gutils.LResultAjax

	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	//password := param.Get("password").String()

	if mobile == "" {
		data.Code = 0
		data.Info = "手机号不能为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	//验证手机号的账号是否存在

	users, err := accountmodels.GetMobileUserInfo(param)
	if err.Msg != nil {
		data.Code = 0
		data.Info = err.Msg.Error()
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	user := users.List
	var userid string
	if user.ItemCount() >= 1 { //手机账号已经存在
		userid = user.Item(0).Get("userid").String()
		param.Set("userid").SetString(userid)
	} else {
		newuser := t.CheckJM(accountmodels.UserReg(param))
		userid = newuser.List.Get("userid").String()
		param.Set("userid").SetString(userid)
	}
	t.CheckJ(accountmodels.BindMobileByKoalaID(param))

	cliniclist := t.CheckJM(accountmodels.GetClinicInofByMobile(param))
	cliniccount := cliniclist.List.ItemCount()
	samepassword := cliniclist.TotalList.Get("samepassword").String()
	var result config.LJSON
	result.Set("cliniccount").SetInt(cliniccount)
	result.Set("samepassword").SetString(samepassword)

	data.List = result.Interface()

	//条件通过之后，进行数据库的写入

	data.Code = 1
	data.Info = "绑定手机成功"
	t.Data["json"] = data

	//设置为登录
	email := ""
	name := ""
	picture := ""
	//userid := newuser.List.Get("userid").String()
	bbsid := ""
	t.SetSession("userinfo", email+"|"+name+"|"+picture+"|"+userid+"|"+bbsid+"|"+mobile)
	t.ServeJSON()
}

//关联手机
func (t *LPreController) PCBindMobile() {
	var data gutils.LResultAjax

	param := t.GetRequestJ()
	mobile := param.Get("mobile").String()
	//password := param.Get("password").String()

	if mobile == "" {
		data.Code = 0
		data.Info = "手机号不能为空"
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	//验证手机号的账号是否存在

	users, err := accountmodels.GetMobileUserInfo(param)
	if err.Msg != nil {
		data.Code = 0
		data.Info = err.Msg.Error()
		t.Data["json"] = data
		t.ServeJSON()
		return
	}
	user := users.List
	var userid string
	if user.ItemCount() >= 1 { //手机账号已经存在
		userid = user.Item(0).Get("userid").String()
		param.Set("userid").SetString(userid)
	} else {
		//todo 取账号密码
		psw, _ := accountmodels.GetKuserPsw(param)
		param.Set("password").SetString(psw)
		newuser := t.CheckJM(accountmodels.UserReg(param))
		userid = newuser.List.Get("userid").String()
		param.Set("userid").SetString(userid)
	}
	t.CheckJ(accountmodels.BindMobileByKoalaID(param))
	t.SuccessJ("绑定成功")
}

//退出
func (t *LAccountController) UserLogOut() {
	t.DelSession("userinfo")
	t.DelSession("mchainid")
	t.DelSession("cliniclist")
	t.DelSession("chainusername")
	t.DelSession("webright")
	t.DelSession("chainsupper")
	t.DelSession("defaulchainid")
	t.DelSession("defaultclinicid")
	t.DelSession("defaulchainid")
	t.DelSession("defaultclinicid")
	t.DelSession("MsgClinicId")
	t.DelSession("scheduleclinicid")
	gredis.Set(t.Ctx.Input.CruSession.SessionID()+"_chooseclinic", "")
	t.Redirect("/login", 302)
}

//判断是否有权限
func (t *LAccountController) PreCheck() {
	id := t.GetString("id")
	if id == "" {
		t.ErrorJ("id不能为空")
	}
	t.CheckRightJ(id)
	var result gutils.LResultAjax
	result.Code = 1
	result.Info = "OK"
	t.Data["json"] = result
	t.ServeJSON()
}

//服务器内部IP
func (t *LAccountController) SVRIP() {
	addrs, err := net.InterfaceAddrs()
	if err != nil {
		t.ErrorJ("error")
	}
	for _, a := range addrs {
		if ipnet, ok := a.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				t.SuccessJ(ipnet.IP.String())
			}
		}
	}

}

//判断是PC调用
func (t *LAccountController) ISPCLoad() {
	var result gutils.LResultAjax
	result.Code = 1
	result.Info = "OK"
	var js config.LJSON
	s, _ := t.GetSession("pcload").(string)
	js.Set("pcload").SetString(s)
	result.List = js.Interface()
	t.Data["json"] = result
	t.ServeJSON()
}

//PC端登录
func (t *LPreController) PCLogin() {
	param := t.GetRequestJ()
	logintype := param.Get("logintype").String()
	tmpdentalid, _ := t.GetSession("tmpdentalid").(string)
	tmpdocname, _ := t.GetSession("tmpdocname").(string)
	password := ""
	userid := ""
	var users gutils.LResultModel
	if logintype == "1" {
		dentalid := param.Get("dentalid").String()
		doctorname := param.Get("doctorname").String()
		password = param.Get("password").String()
		if password == "<bINDLogin>" {
			password, _ = t.GetSession("tmppsw").(string)
			param.Set("password").SetString(password)
		}

		if dentalid != tmpdentalid || doctorname != tmpdocname {
			t.ErrorJ("与当前PC端登录用户不一致")
			return
		}
		param.Set("nocheckpsw").SetString("1")
		users = t.CheckJM(accountmodels.GetDoctorInfoByDentalID(param))
		param.Set("koalaid").SetString(users.List.Item(0).Get("doctorid").String())
		param.Set("clinicid").SetString(users.List.Item(0).Get("clinicuniqueid").String())
		t.SetSession("koalaid", users.List.Item(0).Get("doctorid").String())
		cliniclist := t.CheckJM(accountmodels.GetClinicInofByKoalaID(param))
		if cliniclist.List.ItemCount() == 0 {
			t.SetSession("tmppsw", password) //绑定手机后重新登录用
			var result gutils.LResultAjax
			result.Code = 1
			result.Info = "OK"
			var r config.LJSON
			r.Set("cliniccount").SetString("0") //未绑定手机
			r.Set("clinicid").SetString(users.List.Item(0).Get("clinicuniqueid").String())
			r.Set("koalaid").SetString(users.List.Item(0).Get("doctorid").String())
			result.List = r.Interface()
			t.Data["json"] = result
			t.ServeJSON()
		}
		/*cliniccount := cliniclist.List.ItemCount()
		samepassword := cliniclist.TotalList.Get("samepassword").String()
		result.Set("cliniccount").SetInt(cliniccount)
		result.Set("samepassword").SetString(samepassword)
		if cliniccount == 0 {
			var data gutils.LResultAjax
			var result config.LJSON
			result.Set("koalaid").SetString(user.List.Item(0).Get("doctorid").String())
			result.Set("clinicid").SetString(user.List.Item(0).Get("clinicuniqueid").String())

		}*/

		userid = cliniclist.List.Item(0).Get("userid").String()

		t.SetSession("defaultclinicid", users.List.Item(0).Get("clinicuniqueid").String()) //记住PC调用的诊所
		t.SetSession("defaulchainid", users.List.Item(0).Get("chainid").String())          //要记当前诊所所在的ChainID,刷新诊所列表时要用

	} else {
		users = t.CheckJM(accountmodels.GetMobileUserInfo(param))
		var user config.LJSON
		user = users.List
		pwd := strings.ToLower(user.Item(0).Get("password").String())
		passwd := param.Get("password").String()
		if user.ItemCount() <= 0 {
			t.ErrorJ("用户名或密码错误")
			return
		}
		if pwd != gutils.Md5(passwd) {
			t.ErrorJ("用户名或密码错误")
			return
		}
		userid = user.Item(0).Get("userid").String()
		var p config.LJSON
		p.Set("userid").SetString(userid)
		p.Set("dentalid").SetString(tmpdentalid)
		doc := t.CheckJM(accountmodels.GetBindClinicDoc(p))
		if doc.List.ItemCount() == 0 || doc.List.Item(0).Get("name").String() != tmpdocname {
			t.ErrorJ("与当前PC端登录用户不一致")
			return
		}
		//password = doc.List.Item(0).Get("password").String()
		t.SetSession("koalaid", doc.List.Item(0).Get("doctorid").String())
		t.SetSession("defaultclinicid", doc.List.Item(0).Get("clinicuniqueid").String()) //记住PC调用的诊所
		t.SetSession("defaulchainid", doc.List.Item(0).Get("chainid").String())          //要记当前诊所所在的ChainID,刷新诊所列表时要用

	}

	var js config.LJSON
	t.SetSession("pcload", "1") //标记为PC调用并能已经通过验证
	js.Set("userid").SetString(userid)
	t.SaveUserSession(js)

	url := "/pcweb/back"

	var result gutils.LResultAjax
	result.Code = 1
	result.Info = "OK"
	var r config.LJSON
	r.Set("ref").SetString(url)
	r.Set("cliniccount").SetString("1") //已绑定手机
	result.List = r.Interface()
	t.Data["json"] = result
	t.ServeJSON()

}
