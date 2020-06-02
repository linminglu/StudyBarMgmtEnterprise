//author:  曾文 2016-11-07
//purpose： 用户控制器基类

package account

import "doggy/controllers/base"

//未登录前,不用验证用
type LPreController struct {
	base.LBaseController
}

type LAccountController struct {
	base.LEagleBaseController
}
