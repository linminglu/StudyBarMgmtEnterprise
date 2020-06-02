package main

import (
	"doggy/controllers/base"
	"doggy/gutils/conf"
	_ "doggy/initial"
	_ "doggy/routers"
	"encoding/json"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	_ "github.com/astaxie/beego/session/redis"
	"github.com/astaxie/beego/utils"
)

//日志参数
type LLogConfig struct {
	FileName string `json:"filename"`
	Level    int    `json:"level"`
	MaxLines int    `json:"maxlines"`
	MaxSize  int    `json:"maxsize"`
	Daily    bool   `json:"daily"`
	MaxDays  int    `json:"maxdays"`
}

func main() {
	path := utils.ExtractFileDir(utils.GetApplicationFullName())
	beego.SetViewsPath(path + "\\views")
	beego.SetStaticPath("static", path+"\\static")
	var config LLogConfig
	config.FileName = beego.AppConfig.String("logfile")
	config.Level, _ = beego.AppConfig.Int("loglevel")
	config.Daily = true
	config.MaxDays, _ = beego.AppConfig.Int("logmaxdays")
	data, _ := json.Marshal(config)
	logs.SetLogger(logs.AdapterFile, string(data))
	logs.SetLogger("file")
	beego.ErrorController(&base.LErrorController{})
	redisHost, _ := conf.SvrConfig.String("server", "RedisHost0")
	redisPort, _ := conf.SvrConfig.String("server", "RedisPort0")
	redisPass, _ := conf.SvrConfig.String("server", "RedisPass0")
	if beego.BConfig.WebConfig.Session.SessionProvider == "redis" {
		beego.BConfig.WebConfig.Session.SessionProviderConfig = redisHost + ":" + redisPort
		if redisPass != "" {
			beego.BConfig.WebConfig.Session.SessionProviderConfig = redisHost + ":" + redisPort + ",0," + redisPass
		}
	}
	beego.Run()
}
