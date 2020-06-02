package protocols

import (
	"fmt"

	"course/gutils/gredis"

	"github.com/astaxie/beego/config"
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

//校验session
func (t *Protocol) CheckSession(params *config.LJSON) {

	userid := params.Get("userid").String()
	session := params.Get("session").String()

	if userid == "" || session == "" {
		panic("会话鉴权失败")
	}

	saveSession, err := gredis.Get("college_" + userid)
	if err != nil {
		panic("会话鉴权失败")
	} else {
		if saveSession == "" {
			panic("会话鉴权失败")
		} else {
			if session != saveSession {
				panic("会话鉴权失败")
			}
		}
	}
}
