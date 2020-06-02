package models

import (
	"doggy/gutils"
	"fmt"

	"github.com/astaxie/beego/orm"

	"github.com/astaxie/beego/config"
)

// 获取设备信息
// 当前设备信息只能查看,不能修改, 新增,删除
func GetDeviceList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetDeviceList"

	pagesize := param.Get("pagesize").Int() // 当前页总条数
	pageno := param.Get("pageno").Int()     //页码
	if pagesize == 0 {
		pagesize = 10
	}
	if pageno == 0 {
		pageno = 1
	}
	totalcount := param.Get("TotalCount").Int()

	o := orm.NewOrm()
	o.Using("db_flybear")
	if totalcount == 0 {
		sql1 := ` select count(1) as totalcount from db_flybear.t_nx_deviceid ns`
		var tmp config.LJSON
		_, err.Msg = o.Raw(sql1).ValuesJSON(&tmp)
		totalcount = tmp.Item(0).Get("totalcount").Int()
	}

	sql := ` select * from db_flybear.t_nx_deviceid ns limit ?,?`

	_, err.Msg = o.Raw(sql, pagesize*(pageno-1), pagesize).ValuesJSON(&result.List)
	fmt.Println(result.List.ToString())

	result.TotalCount = int64(totalcount)
	result.PageNo = int64(pageno)
	result.PageSize = int64(pagesize)
	return
}

// 获取设备,患者信息
// 该信息是用该设备的患者
func GetDevicePatient(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetDevicePatient"

	pagesize := param.Get("pagesize").Int() // 当前页总条数
	pageno := param.Get("pageno").Int()     //页码
	if pagesize == 0 {
		pagesize = 10
	}
	if pageno == 0 {
		pageno = 1
	}
	totalcount := param.Get("TotalCount").Int()
	startdate := param.Get("start_time").String()
	enddate := param.Get("end_time").String()

	startdate += " 00:00:00"
	enddate += " 23:59:59"
	o := orm.NewOrm()
	o.Using("db_flybear")
	if totalcount == 0 {
		sql1 := ` select count(1) as totalcount from db_flybear.t_nx_study ns where ns.CreateTime >= ? and ns.CreateTime <= ?`
		var tmp config.LJSON
		_, err.Msg = o.Raw(sql1, startdate, enddate).ValuesJSON(&tmp)
		totalcount = tmp.Item(0).Get("totalcount").Int()
	}

	sql := ` select * from db_flybear.t_nx_study ns where ns.CreateTime >= ? and ns.CreateTime <= ? limit ?,?`

	_, err.Msg = o.Raw(sql, startdate, enddate, pagesize*(pageno-1), pagesize).ValuesJSON(&result.List)
	fmt.Println(result.List.ToString())

	result.TotalCount = int64(totalcount)
	result.PageNo = int64(pageno)
	result.PageSize = int64(pagesize)
	return
}

//GetDevicePatientImg

// 获取设备,患者信息
// 患者影像
func GetDevicePatientImg(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetDevicePatient"
	orderuid := param.Get("orderuid").String()

	o := orm.NewOrm()
	o.Using("db_flybear")

	sql := ` select * from db_flybear.t_nx_image ns where ns.orderuid = ? `
	_, err.Msg = o.Raw(sql, orderuid).ValuesJSON(&result.List)
	fmt.Println(result.List.ToString())

	return
}

// 下载影像

func DownloadImage(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DownloadImage"
	orderuid := param.Get("orderuid").String()
	sopuid := param.Get("sopuid").String()
	imageType := param.Get("imageType").String()

	var Fparam config.LJSON

	Fparam.Set("funcid").SetInt(952)
	Fparam.Set("orderuid").SetString(orderuid)
	Fparam.Set("sopuid").SetString(sopuid)
	Fparam.Set("imageType").SetString(imageType)

	Fimg := gutils.FlybearCPlus(Fparam)

	if Fimg.Get("info").String() != "ok" {
		err.Errorf(gutils.ParamError, "图片获取失败!")
		return
	}
	url := Fimg.Get("url").String()
	result.List.Set("url").SetString(url)
	// // 获取图片
	// str, er := http.Get(url)
	// if er != nil {
	// 	panic(err)
	// }
	// defer str.Body.Close()
	// //转换成二进制流
	// buf, _ := ioutil.ReadAll(str.Body)
	// img := base64.StdEncoding.EncodeToString(buf)

	// result.List.Set("img").SetString("data:image/" + imageType + ";base64," + img)

	return
}
