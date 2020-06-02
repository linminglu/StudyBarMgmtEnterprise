/*
	author : 于绍纳
	date : 2017/07/01
	purpose:微信端商学院路由

	https://mp.weixin.qq.com/wiki?t=resource/res_main&id=mp1421140842
	微信开发参考文档链接
*/

package routers

import (
	"doggy/controllers/college"

	"github.com/astaxie/beego"
)

func init() {
	version, _ := beego.AppConfig.Int("version")
	if version == 0 {
		version = 99999 //不设置的时候默认为开发版本，发布所有路由
	}
	if version <= 1001 {
		return
	}
	beego.Router("/college/error", &college.ErrorController{}, "get:Error401") //公共错误页
	beego.Router("/jfx/error", &college.ErrorController{}, "get:JFXError")     //金服侠申请分期介绍页

	//校验session
	beego.Router("/college/person/mainpage", &college.PersonController{}, "get:MainPage")                      //<个人中心>主页
	beego.Router("/college/person/personinfo", &college.PersonController{}, "post:PersonInfo")                 //<个人中心>获取个人信息
	beego.Router("/college/person/integralpage", &college.PersonController{}, "get:IntegralPage")              //<个人中心>获取积分列表页面
	beego.Router("/college/person/integraldata", &college.PersonController{}, "post:IntegralData")             //<个人中心>获取积分列表数据
	beego.Router("/college/person/integraldetailpage", &college.PersonController{}, "get:IntegralDetailPage")  //<个人中心>获取积分详情页面
	beego.Router("/college/person/integraldetaildata", &college.PersonController{}, "post:IntegralDetailData") //<个人中心>获取积分详情数据
	beego.Router("/college/person/integralrule", &college.PersonController{}, "get:IntegralRule")              //<个人中心>积分规则
	beego.Router("/college/person/integralreward", &college.PersonController{}, "get:IntegralReward")          //<个人中心>积分推荐有奖
	beego.Router("/college/person/setting", &college.PersonController{}, "get:Setting")                        //<个人中心>设置
	beego.Router("/college/person/logout", &college.PersonController{}, "get:Logout")                          //<个人中心>退出登录

	//无需校验
	beego.Router("/college/personauth", &college.AuthController{}, "get:PersonAuth")    //<个人中心>微信授权
	beego.Router("/college/weclassauth", &college.AuthController{}, "get:WeClassAuth")  //<微课堂>微信授权
	beego.Router("/college/mobile/applogin", &college.AuthController{}, "get:AppLogin") //手机端静默登录微课堂
	beego.Router("/jfx/jfxauth", &college.AuthController{}, "get:JFXAuth")              //金服侠申请分期微信授权
	//app提现绑定页面
	beego.Router("/college/withdrawalauth", &college.AuthController{}, "get:WithdrawalAuth")       //app提现微信账号授权-绑定
	beego.Router("/college/withdrawal/bindpage", &college.WithdrawalController{}, "get:BindPage")  //绑定页面
	beego.Router("/college/withdrawal/sendcode", &college.WithdrawalController{}, "post:SendCode") //发送验证码
	beego.Router("/college/withdrawal/bindapp", &college.WithdrawalController{}, "post:BindApp")   //绑定APP

	beego.Router("/college/person/loginpage", &college.LoginController{}, "get:LoginPage") //<个人中心>登录页
	beego.Router("/college/person/sendcode", &college.LoginController{}, "post:SendCode")  //<个人中心>发送验证码
	beego.Router("/college/person/login", &college.LoginController{}, "post:Login")        //<个人中心>登录

	//微课程
	beego.Router("/college/weclass/follow", &college.WeClassController{}, "post:Follow")            //<微课堂>是否关注了公众号,如果没有必须要先关注(识别二维码,关注公众号,并推送一个消息)
	beego.Router("/college/weclass/mainpage", &college.WeClassController{}, "get:MainPage")         //<微课堂>首页页面
	beego.Router("/college/weclass/maindata", &college.WeClassController{}, "post:MainData")        //<微课堂>首页数据
	beego.Router("/college/weclass/mainshare", &college.WeClassController{}, "post:MainShare")      //<微课堂>首页分享参数
	beego.Router("/college/weclass/mainbanner", &college.WeClassController{}, "post:MainBanner")    //<微课堂>banner
	beego.Router("/college/weclass/coursepage", &college.WeClassController{}, "get:CoursePage")     //<微课堂>课程页面
	beego.Router("/college/weclass/coursedata", &college.WeClassController{}, "post:CourseData")    //<微课堂>课程数据
	beego.Router("/college/weclass/courselisten", &college.WeClassController{}, "post:CoursListen") //<微课堂>课程数据(收听次数+1)

	//beego.Router("/college/weclass/comment", &college.WeClassController{}, "post:Comment") //<微课堂>写留言(课程留言数+1)
	//beego.Router("/college/weclass/like", &college.WeClassController{}, "post:Like") //<微课堂>(评论或课程)点赞+1

	beego.Router("/college/weclass/commentpage", &college.WeClassController{}, "get:CommentPage")      //<微课堂>留言网页
	beego.Router("/college/weclass/replypage", &college.WeClassController{}, "get:ReplyPage")          //<微课堂>回复网页
	beego.Router("/college/weclass/bindpage", &college.WeClassController{}, "get:BindPage")            //<微课堂>绑定手机号页面
	beego.Router("/college/weclass/isbind", &college.WeClassController{}, "post:IsBind")               //<微课堂>判断是否需要弹,手机号绑定页面,绑定openid和userid
	beego.Router("/college/weclass/sendcheckcode", &college.WeClassController{}, "post:SendCheckCode") //<微课堂>发送验证码
	beego.Router("/college/weclass/bindopenid", &college.WeClassController{}, "post:BindOpenID")       //<微课堂>绑定openid和userid
	beego.Router("/college/weclass/comments", &college.WeClassController{}, "post:Comments")           //<微课堂>写评论
	beego.Router("/college/weclass/delcomments", &college.WeClassController{}, "post:DelComments")     //<微课堂>删评论
	beego.Router("/college/weclass/likes", &college.WeClassController{}, "post:Likes")                 //<微课堂>(评论或课程)点赞+1
}
