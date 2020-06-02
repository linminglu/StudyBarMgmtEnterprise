//author:  于绍纳 17-07-17
//purpose： 微信授权->个人中心

/*describe: 设计的核心思想:必须经微信跳转过来

AuthController -> 与微信对接-> 授权成功后 ->回调接口 -> 记录下微信的信息openid
LoginController -> 先判断session中时候有openid,没有说明没有授权,再来一次 ->有，将openid和userid进行绑定 ->记录下userid
PersonController ->通过userid -> 进行基本的数据拉取业务 ->在过程中出现什么问题,就重新授权 -> 授权成功后,判断openid是否已经绑定userid -> 无 跳转登录页  有 跳转中心页
这样设计整套逻辑就没有死角
*/
package college

import (
	"doggy/controllers/base"
	"doggy/gutils"
	"doggy/gutils/conf"
	colleges "doggy/models/colleges"
	"io/ioutil"
	"math/rand"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
)

var r = rand.New(rand.NewSource(time.Now().UnixNano()))
var userAgent = [...]string{"Mozilla/5.0 (compatible, MSIE 10.0, Windows NT, DigExt)",
	"Mozilla/4.0 (compatible, MSIE 7.0, Windows NT 5.1, 360SE)",
	"Mozilla/4.0 (compatible, MSIE 8.0, Windows NT 6.0, Trident/4.0)",
	"Mozilla/5.0 (compatible, MSIE 9.0, Windows NT 6.1, Trident/5.0,",
	"Opera/9.80 (Windows NT 6.1, U, en) Presto/2.8.131 Version/11.11",
	"Mozilla/4.0 (compatible, MSIE 7.0, Windows NT 5.1, TencentTraveler 4.0)",
	"Mozilla/5.0 (Windows, U, Windows NT 6.1, en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
	"Mozilla/5.0 (Macintosh, Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11",
	"Mozilla/5.0 (Macintosh, U, Intel Mac OS X 10_6_8, en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50",
	"Mozilla/5.0 (Linux, U, Android 3.0, en-us, Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13",
	"Mozilla/5.0 (iPad, U, CPU OS 4_3_3 like Mac OS X, en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
	"Mozilla/4.0 (compatible, MSIE 7.0, Windows NT 5.1, Trident/4.0, SE 2.X MetaSr 1.0, SE 2.X MetaSr 1.0, .NET CLR 2.0.50727, SE 2.X MetaSr 1.0)",
	"Mozilla/5.0 (iPhone, U, CPU iPhone OS 4_3_3 like Mac OS X, en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
	"MQQBrowser/26 Mozilla/5.0 (Linux, U, Android 2.3.7, zh-cn, MB200 Build/GRJ22, CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1"}

//错误
type ErrorController struct {
	base.LErrorController
}

func (t *ErrorController) Error401() {
	t.TplName = "weixin/college/404.html"
}

func (t *ErrorController) JFXError() {
	t.TplName = "weixin/jfx/m_overdue.html"
}

// PersonController 商学院个人中心模块
type PersonController struct {
	base.LBaseController
	UserID string
}

func (t *PersonController) Prepare() {
	personinfo := t.GetSession("personinfo")
	if personinfo == nil {
		t.Redirect("/college/personauth", 302) //跳转到个人中心授权功能
	} else {
		tmp := strings.Split(personinfo.(string), "|")
		t.UserID = tmp[0]
	}
}

func (t *PersonController) MainPage() {
	t.TplName = "weixin/college/person/mainpage.html"
}

func (t *PersonController) PersonInfo() {
	param := t.GetRequestJ()
	param.Set("userid").SetString(t.UserID)
	res := t.CheckJ(colleges.PersonInfo(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PersonController) IntegralPage() {
	t.TplName = "weixin/college/person/integralpage.html"
}

func (t *PersonController) IntegralData() {
	param := t.GetRequestJ()
	param.Set("userid").SetString(t.UserID)
	res := t.CheckJ(colleges.IntegralData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PersonController) IntegralDetailPage() {
	t.TplName = "weixin/college/person/integraldetailpage.html"
}

func (t *PersonController) IntegralDetailData() {
	param := t.GetRequestJ()
	param.Set("userid").SetString(t.UserID)
	res := t.CheckJ(colleges.IntegralDetailData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PersonController) IntegralRule() {
	t.TplName = "weixin/college/person/integralrule.html"
}

func (t *PersonController) IntegralReward() {
	t.TplName = "weixin/college/person/integralreward.html"
}

func (t *PersonController) Setting() {
	t.TplName = "weixin/college/person/setting.html"
}

func (t *PersonController) Logout() {
	param := t.GetRequestJ()
	param.Set("userid").SetString(t.UserID)
	t.CheckJ(colleges.Logout(param))
	t.DelSession("personinfo")
	t.DelSession("collegeperson")
	t.Redirect("/college/personauth", 302) //跳转到个人中心授权功能
}

type WithdrawalController struct {
	base.LBaseController
	OpenID     string
	Headimgurl string
	Nickname   string
}

func (t *WithdrawalController) Prepare() {
	withdrawalauth := t.GetSession("withdrawalauth")
	if withdrawalauth == nil {
		t.Redirect("/college/withdrawalauth", 302) //跳转到个人中心授权功能
	} else {
		tmp := strings.Split(withdrawalauth.(string), "|")
		t.OpenID = tmp[0]
		t.Nickname = tmp[1]
		t.Headimgurl = tmp[2]
	}
}

func (t *WithdrawalController) BindPage() {
	//t.TplName = "weixin/college/withdrawal/bindpage.html"
	t.TplName = "weixin/college/404.html"
}

func (t *WithdrawalController) SendCode() {
	param := t.GetRequestJ() // 手机号 mobile
	param.Set("funcidverify").SetInt(20114)
	res := t.CheckJ(colleges.SendCode(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *WithdrawalController) BindApp() {
	param := t.GetRequestJ() // 手机号 mobile 验证码code
	param.Set("openid").SetString(t.OpenID)
	param.Set("nickname").SetString(t.Nickname)
	param.Set("headimgurl").SetString(t.Headimgurl)
	res := t.CheckJ(colleges.BindApp(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//登录
type AuthController struct {
	base.LBaseController
}

func (t *AuthController) AppLogin() {
	var obj config.LJSON
	userid := t.GetString("userid")
	obj.Set("userid").SetString(userid)
	res := t.CheckPerson(colleges.AppLogin(obj))
	headimgurl := res.List.Item(0).Get("picture").String()
	nickname := res.List.Item(0).Get("name").String()
	t.SetSession("authinfo", nickname+"|"+headimgurl+"|app|"+userid)
	t.Redirect("/college/weclass/mainpage", 302)
}

func GetRandomUserAgent() string {
	return userAgent[r.Intn(len(userAgent))]
}

//商学院个人中心页授权scope=snsapi_base

func (t *AuthController) PersonAuth() {
	FUrl := "https://api.weixin.qq.com"
	AppID := ""
	Token := ""
	Secret := ""
	DoMain := ""
	panip, _ := conf.SvrConfig.String("server", "PANIP")                 //根据IP判断测试
	if panip == "" || panip == "47.104.183.133" || panip == "127.0.0.1" { //测试服务器
		AppID = "wxa097f76208612a82"
		Token = "fussen2015"
		Secret = "faab2d4392722942a88cd85eda256966"

	} else { //正式服务器
		AppID = "wx64500038d2e964ac"
		Token = "yayiguanjia2015"
		Secret = "2b0631afbf86561c2b60ccdc417be2ee"

	}
	var flyparam config.LJSON
	flyparam.Set("token").SetString(Token)
	flyparam.Set("appid").SetString(AppID)
	flyparam.Set("secret").SetString(Secret)
	res := t.CheckJM(colleges.Token2Domain(flyparam))

	DoMain = res.List.Item(0).Get("domain").String()
	Secret = res.List.Item(0).Get("secret").String()

	code := t.GetString("code")
	state := t.GetString("state")
	if code == "" {
		callUrl := ""
		callUrl = "http://" + DoMain + "/college/personauth"
		callUrl = url.QueryEscape(callUrl)
		codeUrl := "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + AppID + "&redirect_uri=" + callUrl + "&response_type=code&scope=snsapi_userinfo&state=nash#wechat_redirect"
		beego.Info("获取code授权url-->>" + codeUrl)
		t.Redirect(codeUrl, 302)
	} else {
		if state != "nash" {
			beego.Info("PersonAuth回调请求来源不明!")
			t.Redirect("/college/error", 302)
		}
		beego.Info("回调成功")
		tokenUrl := FUrl + "/sns/oauth2/access_token?appid=" + AppID + "&secret=" + Secret + "&code=" + code + "&grant_type=authorization_code"
		beego.Info("tokenUrl" + tokenUrl)
		req, _ := http.NewRequest("GET", tokenUrl, nil)
		req.Header.Set("User-Agent", GetRandomUserAgent())
		client := http.DefaultClient
		res, e := client.Do(req)
		if e != nil || res.StatusCode != 200 {
			beego.Info("授权失败!")
			t.Redirect("/college/error", 302)
		} else {
			//			beego.Info("获取授权信息ok")
			//			body := res.Body
			//			defer body.Close()
			//			bodyByte, _ := ioutil.ReadAll(body)
			//			resStr := string(bodyByte)
			//			beego.Info("获取授权信息resStr" + resStr)
			//			var obj config.LJSON
			//			obj.Load(resStr)
			//			beego.Info("跳转url")
			//			user := t.CheckPerson(colleges.OpenID2UserID(&obj))
			//			userid := user.List.Item(0).Get("userid").String()
			//			beego.Info("userid:" + userid)
			//			if userid == "" {
			//				beego.Info("loginpage跳转")
			//				openid := obj.Get("openid").String()
			//				t.SetSession("collegeperson", openid)
			//				t.Redirect("/college/person/loginpage", 302) //跳转到登录
			//			} else {
			//				beego.Info("mainpage跳转")
			//				t.SetSession("personinfo", userid)
			//				t.Redirect("/college/person/mainpage", 302) //跳转到个人中心
			//			}
			beego.Info("获取授权信息ok")
			body := res.Body
			defer body.Close()
			bodyByte, _ := ioutil.ReadAll(body)
			resStr := string(bodyByte)
			var obj config.LJSON
			obj.Load(resStr)
			openid := obj.Get("openid").String()
			access_token := obj.Get("access_token").String()
			if openid == "" || access_token == "" {
				beego.Info("openid或access_token为空")
				t.Redirect("/college/error", 302)
			} else {
				infoUrl := FUrl + "/sns/userinfo?access_token=" + access_token + "&openid=" + openid + "&lang=zh_CN"

				req1, _ := http.NewRequest("GET", infoUrl, nil)
				req1.Header.Set("User-Agent", GetRandomUserAgent())
				client1 := http.DefaultClient
				res1, e1 := client1.Do(req1)
				if e1 != nil || res1.StatusCode != 200 {
					beego.Info("获取用户个人信息失败!")
					t.Redirect("/college/error", 302)
				} else {
					body := res1.Body
					defer body.Close()
					bodyByte, _ := ioutil.ReadAll(body)
					resStr := string(bodyByte)
					var info config.LJSON
					info.Load(resStr)
					info.Set("openid").SetString(openid)
					user := t.CheckPerson(colleges.OpenID2UserID(&info))
					userid := user.List.Item(0).Get("userid").String()
					beego.Info("userid:" + userid)
					if userid == "" {
						beego.Info("loginpage跳转")
						headimgurl := info.Get("headimgurl").String()
						nickname := info.Get("nickname").String()
						t.SetSession("collegeperson", openid+"|"+headimgurl+"|"+nickname)
						t.Redirect("/college/person/loginpage", 302) //跳转到登录
					} else {
						beego.Info("mainpage跳转")
						t.SetSession("personinfo", userid)
						t.Redirect("/college/person/mainpage", 302) //跳转到个人中心
					}
				}
			}
		}
	}
}

//商学院-微课堂授权scope=snsapi_userinfo
func (t *AuthController) WeClassAuth() {
	//给微信推送消息,带入课程ID
	classid := t.GetString("classid")
	FUrl := "https://api.weixin.qq.com"
	AppID := ""
	Token := ""
	Secret := ""
	DoMain := ""
	panip, _ := conf.SvrConfig.String("server", "PANIP")                 //根据IP判断测试
	if panip == "" || panip == "47.104.183.133" || panip == "127.0.0.1" { //测试服务器

		AppID = "wxa097f76208612a82"
		Token = "fussen2015"
		Secret = "faab2d4392722942a88cd85eda256966"

	} else { //正式服务器
		AppID = "wx64500038d2e964ac"
		Token = "yayiguanjia2015"
		Secret = "2b0631afbf86561c2b60ccdc417be2ee"

	}

	var flyparam config.LJSON
	flyparam.Set("token").SetString(Token)
	flyparam.Set("appid").SetString(AppID)
	flyparam.Set("secret").SetString(Secret)
	res := t.CheckJM(colleges.Token2Domain(flyparam))

	DoMain = res.List.Item(0).Get("domain").String()
	Secret = res.List.Item(0).Get("secret").String()

	//回调URL地址
	code := t.GetString("code")
	state := t.GetString("state")
	if code == "" {
		//回调url地址
		callUrl := "http://" + DoMain + "/college/weclassauth?classid=" + classid
		callUrl = url.QueryEscape(callUrl) //urlEncode
		codeUrl := "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + AppID + "&redirect_uri=" + callUrl + "&response_type=code&scope=snsapi_userinfo&state=nash#wechat_redirect"
		beego.Info("获取code授权url-->>" + codeUrl)
		t.Redirect(codeUrl, 302)
	} else {
		if state != "nash" {
			beego.Info("WeClassAuth回调请求来源不明!")
			t.Redirect("/college/error", 302)
		}
		beego.Info("Secret->" + Secret)
		tokenUrl := FUrl + "/sns/oauth2/access_token?appid=" + AppID + "&secret=" + Secret + "&code=" + code + "&grant_type=authorization_code"
		req, _ := http.NewRequest("GET", tokenUrl, nil)
		req.Header.Set("User-Agent", GetRandomUserAgent())
		client := http.DefaultClient
		res, e := client.Do(req)
		if e != nil || res.StatusCode != 200 {
			beego.Info("获取网页授权access_token失败!")
			t.Redirect("/college/error", 302)
		} else {
			body := res.Body
			defer body.Close()
			bodyByte, _ := ioutil.ReadAll(body)
			resStr := string(bodyByte)
			beego.Info("resStr->" + resStr)
			var obj config.LJSON
			obj.Load(resStr)
			openid := obj.Get("openid").String()
			access_token := obj.Get("access_token").String()
			if openid == "" || access_token == "" {
				beego.Info("openid或access_token为空")
				t.Redirect("/college/error", 302)
			} else {
				infoUrl := FUrl + "/sns/userinfo?access_token=" + access_token + "&openid=" + openid + "&lang=zh_CN"

				req1, _ := http.NewRequest("GET", infoUrl, nil)
				req1.Header.Set("User-Agent", GetRandomUserAgent())
				client1 := http.DefaultClient
				res1, e1 := client1.Do(req1)
				if e1 != nil || res1.StatusCode != 200 {
					beego.Info("获取用户个人信息失败!")
					t.Redirect("/college/error", 302)
				} else {
					body := res1.Body
					defer body.Close()
					bodyByte, _ := ioutil.ReadAll(body)
					resStr := string(bodyByte)
					var info config.LJSON
					info.Load(resStr)
					headimgurl := info.Get("headimgurl").String()
					nickname := info.Get("nickname").String()
					info.Set("openid").SetString(openid)

					str := t.CheckJM(colleges.OpenID2UnionID(info))
					headimgurl = str.List.Get("headimgurl").String()
					nickname = str.List.Get("nickname").String()
					userid := str.List.Get("userid").String()

					t.SetSession("authinfo", nickname+"|"+headimgurl+"|wx|"+openid+"|"+userid)

					if classid == "college" || classid == "" {
						t.Redirect("/college/weclass/mainpage", 302) //跳转到课堂列表
					} else { //(或者是具体的某个课程)
						t.Redirect("/college/weclass/coursepage?classid="+classid, 302)
					}
				}
			}
		}
	}
}

//金服侠错误跳转
func (t *AuthController) jfxError() {
	t.Redirect("/jfx/error", 302)
}

//APP提现授权绑定接口
func (t *AuthController) WithdrawalAuth() {

	//测试服务器 - 【美牙在线】公众号授权   正式服务器 - 【好牙】公众号授权
	officialID := "meiyafuwu2015" //haoya2015
	code := t.GetString("code")
	token := t.GetString("token") //code回调 中会自动拼接token
	appid := t.GetString("appid")
	if code == "" {
		//获取token
		var obj config.LJSON
		obj.Set("clinicid").SetString(officialID)
		obj.Set("funcid").SetInt(gutils.FUNC_ID_GET_CLINIC_WEIXIN_TOKEN)
		res := gutils.FlybearCPlus(obj)
		if res.Get("code").Int() != 1 {
			t.Redirect("/college/error", 302)
		}
		token = res.Get("token").String()

		//获取appid
		var appObj config.LJSON
		appObj.Set("clinicid").SetString(officialID)
		appObj.Set("funcid").SetInt(21122)
		appRes := gutils.FlybearCPlus(appObj)
		if appRes.Get("code").Int() != 1 {
			t.jfxError()
		}
		appid = appRes.Get("appid").String()

		//微信授权回调
		var auth config.LJSON
		auth.Set("token").SetString(token)
		auth.Set("funcid").SetInt(1951)
		auth.Set("path").SetString("/college/withdrawalauth?")
		auth.Set("inurl").SetString("appid=" + appid)
		auth.Set("scope").SetString("snsapi_userinfo") //获取授权用户的头像和昵称
		authres := gutils.FlybearCPlus(auth)
		if authres.Get("code").Int() != 1 {
			t.Redirect("/college/error", 302)
		}
		codeUrl := authres.Get("gourl").String()
		beego.Info("app支付授权绑定url-->>" + codeUrl) //这个回调url中已自动拼接了token
		t.Redirect(codeUrl, 302)
	} else { //
		beego.Info("app支付授权code-->>" + code)
		var info config.LJSON
		info.Set("funcid").SetInt(1904)
		info.Set("token").SetString(token)
		info.Set("code").SetString(code)
		res := gutils.FlybearCPlus(info)
		if res.Get("code").Int() != 1 {
			t.Redirect("/college/error", 302)
		}
		openid := res.Get("openid").String()
		nickname := res.Get("userinfo").Get("nickname").String()
		headimgurl := res.Get("userinfo").Get("headimgurl").String()
		beego.Info("app支付获取用户openid-->>" + openid)
		beego.Info("app支付获取用户nickname-->>" + nickname)
		beego.Info("app支付获取用户headimgurl-->>" + headimgurl)

		beego.Info("微信授权成功,进行跳转主页")
		t.SetSession("withdrawalauth", openid+"|"+nickname+"|"+headimgurl)
		t.Redirect("/college/withdrawal/bindpage", 302) //提供页面 进行app账户和 微信用户信息绑定

	}
}

//金服侠微信授权并校验
func (t *AuthController) JFXAuth() {
	sign := t.GetString("sign")
	clinicid := t.GetString("clinicid")
	applyid := t.GetString("applyid")
	redirect_uri := t.GetString("redirect_uri")
	if sign == "" || clinicid == "" || applyid == "" {
		t.jfxError()
	}
	token := t.GetString("token") //code回调 中会自动拼接token
	appid := t.GetString("appid")

	code := t.GetString("code")
	if code == "" { //需要微信授权
		//获取token
		var obj config.LJSON
		obj.Set("clinicid").SetString(clinicid)
		obj.Set("funcid").SetInt(gutils.FUNC_ID_GET_CLINIC_WEIXIN_TOKEN)
		res := gutils.FlybearCPlus(obj)
		if res.Get("code").Int() != 1 {
			t.jfxError()
		}
		token = res.Get("token").String()

		//获取appid
		var appObj config.LJSON
		appObj.Set("clinicid").SetString(clinicid)
		appObj.Set("funcid").SetInt(21122)
		appRes := gutils.FlybearCPlus(appObj)
		if appRes.Get("code").Int() != 1 {
			t.jfxError()
		}
		appid = appRes.Get("appid").String()
		//微信授权回调

		var auth config.LJSON
		auth.Set("token").SetString(token)
		auth.Set("funcid").SetInt(1951)
		auth.Set("path").SetString("/jfx/jfxauth?")
		auth.Set("inurl").SetString("sign=" + sign + "&clinicid=" + clinicid + "&applyid=" + applyid + "&appid=" + appid + "&redirect_uri=" + redirect_uri)
		auth.Set("scope").SetString("snsapi_base") //仅仅只要授权后的openid
		authres := gutils.FlybearCPlus(auth)
		if authres.Get("code").Int() != 1 {
			t.jfxError()
		}
		codeUrl := authres.Get("gourl").String()
		beego.Info("获取code授权url-->>" + codeUrl) //这个回调url中已自动拼接了token
		t.Redirect(codeUrl, 302)
	} else { //获取openid
		beego.Info("微信授权成功code-->>" + code)
		var info config.LJSON
		info.Set("funcid").SetInt(1904)
		info.Set("token").SetString(token)
		info.Set("code").SetString(code)
		res := gutils.FlybearCPlus(info)
		if res.Get("code").Int() != 1 {
			t.jfxError()
		}
		openid := res.Get("openid").String()
		beego.Info("微信授权成功openid-->>" + openid)
		var flyparam config.LJSON
		flyparam.Set("openid").SetString(openid)
		flyparam.Set("clinicid").SetString(clinicid)
		flyparam.Set("token").SetString(token)
		result, err := colleges.OpenID2KoalaID(&flyparam)
		if err.Msg != nil {
			t.jfxError()
		}

		if redirect_uri == "" {
			koalaid := result.List.Item(0).Get("kuserid").String()
			beego.Info("微信授权成功koalaid-->>" + koalaid)
			if strings.ToLower(sign) != strings.ToLower(gutils.Md5(openid+koalaid)) {
				t.jfxError()
			} else {
				beego.Info("微信授权成功,进行跳转主页")
				t.SetSession("jfxauth", sign+"|"+clinicid+"|"+token+"|"+openid+"|"+applyid+"|"+appid)
				t.SetSession("openid", openid)
				t.Redirect("/jfx/completepage", 302)
			}
		} else {
			t.SetSession("openid", openid)
			t.Redirect(redirect_uri, 302)
		}

	}

}

//个人中心登录页,必须是微信授权跳转过来,否则需要授权->如果不授权,openid就无法和userid进行绑定关系
//不绑定，那么下次微信再登陆就不知到该openid是和哪个userid绑定过，主要是为了绑定userid和openid
type LoginController struct {
	base.LBaseController
	OpenID   string
	Picture  string
	Nickname string
}

func (t *LoginController) Prepare() {
	collegeperson := t.GetSession("collegeperson")
	if collegeperson == nil {
		t.Redirect("/college/personauth", 302) //跳转到个人中心授权功能
	} else {
		tmp := strings.Split(collegeperson.(string), "|")
		t.OpenID = tmp[0]
		t.Picture = tmp[1]
		t.Nickname = tmp[2]
	}

	//	t.OpenID = "owjlkv0ErtJjvKvJ6qA8738VXQCM"
	//	t.Picture = "http://wx.qlogo.cn/mmopen/aA6qVd9nYiaOLIkIicP0JqPQ1sfnv2Bx6hUD88Osa4J5pIBicA4412mBBYic4iciake5cdsFAJS1LwoMfkVyMRtk3Ue1CLYQhjsviaC/0"
	//	t.Nickname = "你大哥"

}

//登录页
func (t *LoginController) LoginPage() {
	t.TplName = "weixin/college/person/loginpage.html"
}

func (t *LoginController) SendCode() {
	param := t.GetRequestJ()
	res := t.CheckJ(colleges.SendCode(param))
	t.Data["json"] = res
	t.ServeJSON()

}

func (t *LoginController) Login() { //验证验证码并登录
	param := t.GetRequestJ()
	param.Set("openid").SetString(t.OpenID)
	param.Set("name").SetString(t.Nickname)
	param.Set("picture").SetString(t.Picture)
	res := t.CheckJM(colleges.Login(param))
	t.SetSession("personinfo", res.List.Item(0).Get("userid").String())

	var data gutils.LResultAjax
	data.Code = 1
	data.Info = "登录成功"
	t.Data["json"] = data
	t.ServeJSON()
}
