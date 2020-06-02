package protocols

import (
	"doggy/gutils"
	"fmt"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

//协议公共接口
type ProtocolInterface interface {
	Init()
}
type Protocol struct {
}

func (t *Protocol) Init() {
	fmt.Println("Protocol Init")
}

func (t *Protocol) CheckDocSession(params *config.LJSON, err *gutils.LError) {
	userid := params.Get("userid").String()
	session := params.Get("session").String()
	if session == "" {
		err.Code = gutils.AuthError
	} else {
		o := orm.NewOrm()
		var obj config.LJSON
		sql := ` select userid from t_user where session=? `
		_, err.Msg = o.Raw(sql, session).ValuesJSON(&obj)
		sessionUserid := obj.Item(0).Get("userid").String()
		if sessionUserid == "" {
			err.Code = gutils.AuthError
		} else {
			if userid != sessionUserid {
				err.Code = gutils.AuthError
			}
		}
	}
}
