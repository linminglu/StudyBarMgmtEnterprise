package main

import (
	"fmt"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
	_ "github.com/go-sql-driver/mysql"
)

func main() {

	user := "root"
	passwd := "y1y2g3j4fussen"
	host := "115.28.139.39"
	port := "2789"

	orm.RegisterDriver("mysql", orm.DRMySQL)
	orm.RegisterDataBase("default", "mysql", fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8&interpolateParams=1&loc=Asia%%2FShanghai", user, passwd, host, port, "db_flybear"))
	o := orm.NewOrm()
	sql := ` select * from db_build.t_build where soft = 'eagle' and status = 1 s `
	var datas, x config.LJSON
	_, err := o.Raw(sql).ValuesJSON(&datas)
	if err != nil {
		logs.Error(err)
	}

	sql = ` select * from db_build.t_build where soft = 'eagle' and status = 1 `
	_, err = o.Raw(sql).ValuesJSON(&x)
	if err != nil {
		logs.Error(err)
	}

	sql = ` insert into db_build.t_build  `
	_, err = o.Raw(sql, "11", "23234").Exec()
	if err != nil {
		logs.Error(err)
	}

}
