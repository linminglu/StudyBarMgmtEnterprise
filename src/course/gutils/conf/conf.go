//	author:		邓良远 2016-12-02
//	purpose:	服务配置参数

package conf

import (
	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/utils"
	"github.com/robfig/config"
)

var (
	// SvrConfig is the instance of Config, store the config information from file
	SvrConfig *config.Config
)

func init() {
	path := beego.AppConfig.String("ConfigFile")
	if path == "" {
		path = utils.ExtractFileDir(utils.GetApplicationFullName()) + "\\conf\\server.ini"
		if utils.FileExist(path) == false {
			logs.Error("ConfigFile not set!")
			return
		}
	}
	SvrConfig, _ = config.ReadDefault(path)
}
