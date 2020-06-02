//author:  龙智鹏 2019-1-8
//purpose： 义齿账号登陆
package dxaccount
import (
	"doggy/controllers/base"
	"doggy/gutils"
	"doggy/gutils/conf"
	"github.com/astaxie/beego"
	"time"
)


type LDxDocController struct {
	base.LBaseController
	UserID        string       //用户ID
	UserName      string       //用户名
	AccessKeySecret string   
}

func (t *LDxDocController) Prepare() {
	param := t.GetRequestJ()
	pstr, _ := param.ToCaseString()
	beego.Info("====DX平台调用===", t.Ctx.Input.URL(), pstr)

	oprdate := param.Get("date").String()
	if oprdate == "" {
		t.ErrorJ("date不能为空")
		return
	}

	k := time.Now()
	d1, _ := time.ParseDuration("-15m")
	d2, _ := time.ParseDuration("15m")
	t1 := k.Add(d1)
	t2 := k.Add(d2)
	oprtime := gutils.GetTimeEx(oprdate)

	if oprtime.Before(t1) || oprtime.After(t2) {
		t.ErrorJ("操作时间已过期")
		return
	}
	t.AccessKeySecret = conf.DentalDxAppSecret
}