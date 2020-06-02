//purpose:公共函数
//author :于绍纳
package gutils

import (
	"strings"

	"github.com/astaxie/beego/config"
)

//更新sql 根据val生成更新sql
func UpdateSql(param *config.LJSON, val string) (keys string) {

	x, y := param.Interface().(map[string]interface{})
	if y == false {
		panic("update param parse failed")
	}
	val = strings.ToLower(val)
	if val == "" {
		return keys
	}
	res := strings.Split(val, ",")
	//遍历字符串
	for _, v := range res {
		if _, ok := x[v]; ok {
			if keys == "" {
				keys = v + "=:" + v
			} else {
				keys += "," + v + "=:" + v
			}
		}
	}
	return
}

//插入sql 根据val生成插入sql
func InsertSql(param *config.LJSON, val string) (keys string) {
	x, y := param.Interface().(map[string]interface{})
	if y == false {
		panic("insert param parse failed")
	}
	val = strings.ToLower(val)
	if val == "" {
		return keys
	}
	res := strings.Split(val, ",")
	var keystr, valuestr string
	//遍历字符串
	for _, v := range res {
		if _, ok := x[v]; ok {
			if keystr == "" {
				keystr = v
				valuestr = ":" + v
			} else {
				keystr += "," + v
				valuestr += ",:" + v
			}
		}
	}
	if keystr == "" {
		return keys
	}
	keys = " (" + keystr + ") values (" + valuestr + ") "
	return keys
}
