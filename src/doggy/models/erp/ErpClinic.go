//author:  罗云鹏 17-03-15
//purpose： 运营后台－诊所列表
package models

import (
	"doggy/gutils"
	"fmt"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

// GetClinicList 获取门诊列表
func GetClinicList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ErpGetClinicList"
	starttime := param.Get("start_time").String() //起始时间
	endtime := param.Get("end_time").String()     //结束时间
	perpage := param.Get("per_page").Int()        //每页数量
	page := param.Get("page").Int()               //页数
	province := param.Get("province").String()    //省份
	city := param.Get("city").String()            //城市
	conditon := param.Get("condition").String()   //输入框搜索条件
	if perpage == 0 {
		perpage = 10
	}
	if page == 0 {
		page = 1
	}
	var val []interface{}
	o := orm.NewOrm()

	var count config.LJSON
	sqlc := `SELECT COUNT(*) AS count
	FROM t_clinic AS c
	WHERE 1`
	sql := `SELECT *
	FROM t_clinic AS c
	WHERE 1`
	if starttime != "" {
		starttime += " 00:00:00"
		sqlc += " and c.CreateTime>=? "
		sql += " and c.CreateTime>=? "
		val = append(val, starttime)
	}
	if endtime != "" {
		endtime += " 23:59:59"
		sqlc += " and c.CreateTime<=? "
		sql += " and c.CreateTime<=? "
		val = append(val, endtime)
	}
	if province != "" {
		sqlc += " and c.ClinicProvince<=? "
		sql += " and c.ClinicProvince<=? "
		val = append(val, province)
	}
	if city != "" {
		sqlc += " and c.ClinicCity<=? "
		sql += " and c.ClinicCitye<=? "
		val = append(val, city)
	}
	if conditon != "" {
		conditon = fmt.Sprintf("%%%s%%", conditon)
		sqlc += " and (c.Mobile like ? or c.Name like ?)"
		sql += " and (c.Mobile like ? or c.Name like ?)"
		val = append(val, conditon, conditon)
	}

	_, err.Msg = o.Raw(sqlc, val...).ValuesJSON(&count)
	if err.Msg != nil {
		return
	}

	offset := (page - 1) * perpage
	limit := perpage
	sql += " order by c.CreateTime asc limit ?,?"
	val = append(val, offset, limit)
	_, err.Msg = o.Raw(sql, val...).ValuesJSON(&result.List)
	if err.Msg != nil {
		return
	}
	result.TotalCount = count.Item(0).Get("count").Int64() //总条数
	result.PageNo = int64(page)                            //页码
	result.PageSize = int64(perpage)                       //每页条数
	return
}

// GetClinicInfo 获取用户信息
func GetClinicInfo(id string) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ErpGetClinicInfo"
	o := orm.NewOrm()
	sql := `select * from t_clinic as c
	where c.ClinicID=? limit 1`
	_, err.Msg = o.Raw(sql, id).ValuesJSON(&result.List)
	return
}
