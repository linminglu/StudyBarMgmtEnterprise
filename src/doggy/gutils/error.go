package gutils

import (
	"fmt"

	"github.com/astaxie/beego/config"
)

//金服侠的返回结果

type LJFXResult struct {
	Result int    `json:"result"` //返回码 100成功 101失败
	Msg    string `json:"msg"`    //信息
}

//ajax的返回结果
type LResultAjax struct {
	Code       int         `json:"code"`       //返回码 1成功 0失败
	Info       string      `json:"info"`       //信息
	PageNo     int64       `json:"pageno"`     //页码
	PageSize   int64       `json:"pagesize"`   //每页记录数
	TotalCount int64       `json:"totalcount"` //总记录数
	List       interface{} `json:"list"`       //数组
	Main       interface{} `json:"main"`       //主表数组
	Command    string      `json:"command"`    //打印
}

//model的返回结果
type LResultModel struct {
	PageNo     int64        //页码
	PageSize   int64        //每页记录数
	TotalCount int64        //总记录数
	List       config.LJSON //数组
	TotalList  config.LJSON //合计
	Command    string       // 打印
}

type LErrorCode int

const (
	DBError    LErrorCode = iota //数据库读写错误
	NetError                     //网络访问错误
	FileError                    //读写文件错误
	AuthError                    //授权验证错误
	ParamError                   //参数不合法
)

//错误信息
type LError struct {
	Code    LErrorCode
	Caption string
	Msg     error
}

//错误格式化输出
func (t *LError) Errorf(code LErrorCode, format string, a ...interface{}) {
	t.Code = code
	t.Msg = fmt.Errorf(format, a...)
}
