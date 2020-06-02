package initial

import (
	"doggy/gutils/conf"
	"fmt"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

func InitSql() {
	user, _ := conf.SvrConfig.String("server", "MysqlUser")
	passwd, _ := conf.SvrConfig.String("server", "MysqlPass")
	host, _ := conf.SvrConfig.String("server", "MysqlHost")
	port, err := conf.SvrConfig.Int("server", "MysqlPort")
	dbname := "db_flybear"
	if nil != err {
		port = 2789
	}
	if beego.AppConfig.String("runmode") == "dev" {
		orm.Debug = true
	}
	logs.Debug(fmt.Sprintf("InitSql,connection = %s:%s@tcp(%s:%d)/%s?charset=utf8&interpolateParams=1&loc=Asia%%2FShanghai", user, passwd, host, port, dbname))
	orm.RegisterDriver("mysql", orm.DRMySQL)
	orm.RegisterDataBase("default", "mysql", fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8&interpolateParams=1&loc=Asia%%2FShanghai", user, passwd, host, port, dbname))
	orm.RegisterDataBase("db_koala", "mysql", fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8&interpolateParams=1&loc=Asia%%2FShanghai", user, passwd, host, port, "db_koala"))
	orm.RegisterDataBase("ultrax", "mysql", fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8&interpolateParams=1&loc=Asia%%2FShanghai", user, passwd, host, port, "ultrax"))
}
