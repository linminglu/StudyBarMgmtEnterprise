package college

import (
	"doggy/controllers/base"
	"doggy/gutils"
	"doggy/gutils/gredis"
	colleges "doggy/models/colleges"
	"strings"

	"github.com/astaxie/beego/config"
)

type WeClassController struct {
	base.LBaseController
	NickName string
	Picture  string
	ComeFrom string
	GUID     string //openid
	UserID   string
}

//微课堂总共两个模块:一个列表,一个课程详情
func (t *WeClassController) SaveModule(classid string) {
	//记录session对应的模块
	InputsessionID := t.Ctx.Input.Cookie(base.SvrSession.SessionName)
	CrusessionID := t.Ctx.Input.CruSession.SessionID()
	if InputsessionID != CrusessionID {
		gredis.Set(CrusessionID+"_weclass", classid)
	}
	gredis.Set(InputsessionID+"_weclass", classid)
}

/*
	比如用户现在在某篇文章,记录下session和文章id的对应关系,当session过期以后,我们其实是不知道
	用户当前看的是哪篇文件，那么用户刷新以后,就会有问题。如果记录下来，我们就用session得到当时
	记录的文章ID,那么跳转的时候,就直接跳转到这篇文章，而对用户是透明的
*/
func (t *WeClassController) Prepare() { //判断session是否过期
	authinfo := t.GetSession("authinfo")
	if authinfo == nil { //session过期,获取不到信息,需要重新跳转授权,一旦授权以后,还需要跳转到正确的页面
		InputSession := t.Ctx.Input.Cookie(base.SvrSession.SessionName)
		p, _ := gredis.Get(InputSession + "_weclass")
		p = "?classid=" + p
		t.Redirect("/college/weclassauth"+p, 302)
	} else {
		tmp := strings.Split(authinfo.(string), "|")
		t.NickName = tmp[0]
		t.Picture = tmp[1]
		t.ComeFrom = tmp[2]
		t.GUID = tmp[3]
		t.UserID = tmp[4]
	}

	//	t.NickName = "模拟昵称"
	//	t.Picture = "http://image.zjg.js.cn/upload/editor/2014-2-18/20142181348342961u3jd.jpg"
	//	t.ComeFrom = "wx"
	//	t.GUID = "owjlkv0ErtJjvKvJ6qA8738VXQCM"
}

func (t *WeClassController) MainPage() {
	t.SaveModule("college")
	t.TplName = "weixin/college/weclass/weclasspage.html"
}

func (t *WeClassController) MainData() {
	param := t.GetRequestJ()
	res := t.CheckJ(colleges.MainData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *WeClassController) MainShare() {
	param := t.GetRequestJ()
	res := t.CheckJ(colleges.MainShare(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *WeClassController) MainBanner() {
	param := t.GetRequestJ()
	res := t.CheckJ(colleges.MainBanner(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *WeClassController) CoursePage() {
	classid := t.GetString("classid")
	if classid != "" {
		t.SaveModule(classid)
	}
	t.TplName = "weixin/college/weclass/coursepage.html"
}

func (t *WeClassController) CourseData() {
	param := t.GetRequestJ()
	param.Set("userid").SetString(t.UserID) //传入当前查看人,用来判断是否已经点过赞
	res := t.CheckJ(colleges.CourseData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//调用一次加一次
func (t *WeClassController) CoursListen() {
	param := t.GetRequestJ()
	res := t.CheckJ(colleges.CoursListen(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//---------------------------------------------------------
func (t *WeClassController) CommentPage() {
	t.TplName = "weixin/college/weclass/commentpage.html"
}

func (t *WeClassController) ReplyPage() {
	t.TplName = "weixin/college/weclass/commentpage.html"
}

//判断是否需要 弹登录框，绑定openid和userid
func (t *WeClassController) IsBind() {
	if t.UserID == "" {
		var info config.LJSON
		info.Set("openid").SetString(t.GUID)
		info.Set("nickname").SetString(t.NickName)
		info.Set("headimgurl").SetString(t.Picture)
		str := t.CheckJM(colleges.OpenID2UnionID(info))
		userid := str.List.Get("userid").String()
		if userid != "" { //刚绑定
			headimgurl := str.List.Get("headimgurl").String()
			nickname := str.List.Get("nickname").String()
			t.SetSession("authinfo", nickname+"|"+headimgurl+"|wx|"+t.GUID+"|"+userid)
			var result gutils.LResultAjax
			result.Code = 1
			result.Info = "ok"
			t.Data["json"] = result
			t.ServeJSON()
		} else { //未绑定
			var result gutils.LResultAjax
			result.Code = 0
			result.Info = "ok"
			t.Data["json"] = result
			t.ServeJSON()
		}
	} else { //已绑定
		var result gutils.LResultAjax
		result.Code = 1
		result.Info = "ok"
		t.Data["json"] = result
		t.ServeJSON()
	}
}

func (t *WeClassController) BindPage() {
	t.TplName = "weixin/college/weclass/bindpage.html"
}

//发送验证码
func (t *WeClassController) SendCheckCode() {
	param := t.GetRequestJ() //手机号
	param.Set("funcidverify").SetInt(977)
	res := t.CheckJ(colleges.SendCode(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//绑定 openid和手机号
func (t *WeClassController) BindOpenID() {

	if t.UserID == "" {
		param := t.GetRequestJ()
		param.Set("openid").SetString(t.GUID)
		param.Set("nickname").SetString(t.NickName)
		param.Set("headimgurl").SetString(t.Picture)
		res := t.CheckJM(colleges.BindOpenID(param))
		nickname := res.List.Get("nickname").String()
		headimgurl := res.List.Get("headimgurl").String()
		userid := res.List.Get("userid").String()
		t.SetSession("authinfo", nickname+"|"+headimgurl+"|wx|"+t.GUID+"|"+userid)
	}

	var result gutils.LResultAjax
	result.Code = 1
	result.Info = "ok"
	t.Data["json"] = result
	t.ServeJSON()
}

//写评论
func (t *WeClassController) Comments() {
	param := t.GetRequestJ() //评论类型 、评论内容、课程ID、原评论ID
	param.Set("userid").SetString(t.UserID)
	param.Set("userpicture").SetString(t.Picture)
	param.Set("usernickname").SetString(t.NickName)
	param.Set("comefrom").SetString(t.ComeFrom)
	res := t.CheckJ(colleges.Comments(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//删除评论
func (t *WeClassController) DelComments() {
	param := t.GetRequestJ() //评论ID
	param.Set("userid").SetString(t.UserID)
	res := t.CheckJ(colleges.DelComments(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//点赞 +1  取消点赞-1
func (t *WeClassController) Likes() {
	param := t.GetRequestJ()                //点赞类型/被点赞的记录ID
	param.Set("userid").SetString(t.UserID) //点赞人信息
	param.Set("usernickname").SetString(t.NickName)
	param.Set("userpicture").SetString(t.Picture)
	param.Set("comefrom").SetString(t.ComeFrom)
	res := t.CheckJ(colleges.Likes(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//---------------------------------------------------------
func (t *WeClassController) Comment() {
	param := t.GetRequestJ()
	param.Set("picture").SetString(t.Picture)
	param.Set("nickname").SetString(t.NickName)
	param.Set("comefrom").SetString(t.ComeFrom)
	res := t.CheckJ(colleges.Comment(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *WeClassController) Like() {
	param := t.GetRequestJ()
	param.Set("guid").SetString(t.GUID)
	param.Set("comefrom").SetString(t.ComeFrom)
	res := t.CheckJ(colleges.Like(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *WeClassController) Follow() {
	param := t.GetRequestJ()
	//这个地方可以根据comefrom来识别是否从微信引入(根据来源实现后续是否需要关注公众号的逻辑)
	param.Set("guid").SetString(t.GUID)
	res := t.CheckJ(colleges.Follow(param))
	t.Data["json"] = res
	t.ServeJSON()
}
