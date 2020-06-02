//author:  唐海军 2016-11-13
//purpose： 记录操作日志

package model

import (
	"doggy/gutils"
	"net"
	"time"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

//获取IP地址
func GetClinicLoginIP() string {
	addrs, err := net.InterfaceAddrs()
	ip := ""
	if err != nil {
		ip = ""
	}
	for _, a := range addrs {
		if ipnet, ok := a.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				ip = ipnet.IP.String()
			}
		}
	}
	return ip
}

//根据ip去获取地址gutils.InSlice
func GetIpaddress(ip string) string {
	var err gutils.LError
	var address gutils.LResultModel
	o := orm.NewOrm()
	_, err.Msg = o.Raw("select CONCAT(province,city) as addr from `t_ipcity` where `ipaddr` = ?", ip).ValuesJSON(&address.List)
	ipaddress := ""
	if address.List.ItemCount() > 0 {
		ipaddress = address.List.Item(0).Get("addr").String()
	}
	return ipaddress
}

func AddFuncLog(param config.LJSON, actionstr string, funcid string, terminal int) (err gutils.LError) {
	param.Set("funcid").SetString(funcid)
	param.Set("terminal").SetInt(terminal)
	return AddOperationLog(param, actionstr)
}

//增加 操作日志
func AddOperationLog(param config.LJSON, actionstr string) (err gutils.LError) {
	err.Caption = "AddOperationLog"
	//获取ip和ip地址
	// ip := GetClinicLoginIP()
	ip := param.Get("remoteip").String()
	actionrecordid := param.Get("actionrecordid").String()
	addr := GetIpaddress(ip)
	clinicid := ""
	if param.Get("ClinicID").IsNULL() == false {
		clinicid = param.Get("ClinicID").String()
	} else {
		clinicid = param.Get("ClinicUniqueID").String()
	}
	if clinicid == "" {
		clinicid = "1"
	}

	terminal := param.Get("terminal").Int()
	if terminal == 0 {
		terminal = 1
	}

	var param1 config.LJSON
	if actionrecordid == "" {
		param1.Set("actionrecordid").SetInt64(gutils.CreateGUID())
	} else {
		param1.Set("actionrecordid").SetInt64(param.Get("actionrecordid").Int64())
	}

	//clinicdocid :=param.Get("clinicdocid").String()
	clinicdocname := param.Get("clinicdocname").String()
	if clinicdocname == "" {
		clinicdocname = param.Get("chainusername").String()
	}

	if param.Get("funcid").String() != "" && param.Get("funcmodule").String() == "" {
		param.Set("funcmodule").SetString(gutils.FuncMap[param.Get("funcid").String()])
	}

	param1.Set("action").SetString(actionstr)
	param1.Set("terminal").SetInt(terminal)
	param1.Set("funcid").SetString(param.Get("funcid").String())
	param1.Set("funcmodule").SetString(param.Get("funcmodule").String())
	param1.Set("address").SetString(addr)
	param1.Set("ipaddr").SetString(ip)
	param1.Set("operator").SetString(param.Get("userid").String())
	param1.Set("chainid").SetString(param.Get("chainid").String())
	param1.Set("clinicid").SetString(clinicid)
	param1.Set("operatedatetime").SetTime(time.Now())
	param1.Set("clinicdocid").SetString(param.Get("clinicdocid").String())
	param1.Set("clinicdocname").SetString(clinicdocname)
	param1.Set("customerid").SetString(param.Get("customerid").String())
	o := orm.NewOrm()
	o.Using("db_koala")
	sql3 := ` insert into t_action_log (ActionRecordID,action,terminal,Address,IpAddr,operator,ChainID,ClinicID,OperateDatetime,LastOperator,funcid,funcModule,customerid,clinicdocid,clinicdocname) 
	         Values (:actionrecordid,:action,:terminal,:address,:ipaddr,:operator,:chainid,:clinicid,now(),"WEB",:funcid,:funcmodule,:customerid,:clinicdocid,:clinicdocname) `
	_, err.Msg = o.RawJSON(sql3, param1).Exec()
	if err.Msg != nil {
		err.Errorf(gutils.ParamError, "插入操作记录失败")
	}
	return
}

//取系统参数
func GetSysConfig(clinicid string, configgroup string, configvalue string, defaultvalue string) (result string) {
	result = defaultvalue
	if clinicid == "" {
		return
	}
	var js config.LJSON
	sql := ` select configvalue from t_sysconfig s where s.ClinicUniqueID=? and s.ConfigGroup =? and s.ConfigName =?  `
	o := orm.NewOrm()
	o.Using("db_koala")
	_, err := o.Raw(sql, clinicid, configgroup, configvalue).ValuesJSON(&js)
	if err == nil && js.ItemCount() > 0 {
		result = js.Item(0).Get("configvalue").String()
	}
	return result
}

//患者信息操作日志
func CustomerOperationLog(param config.LJSON) (err gutils.LError) {
	err.Caption = "CustomerOperationLog"

	//操作记录
	cid := param.Get("subclinicid").String()
	if cid == "" {
		cid = param.Get("clinicuniqueid").String()
	}
	actionstr := param.Get("actionstr").String()
	param.Set("clinicid").SetString(cid)
	param.Set("actionrecordid").SetInt64(gutils.CreateGUID())

	if param.Get("clinicdocname").String() == "" {
		param.Set("clinicdocname").SetString(param.Get("chainusername").String())
	}

	AddOperationLog(param, actionstr)

	//操作日志明细
	var par config.LJSON
	par.Set("customerlogid").SetInt64(gutils.CreateGUID())
	par.Set("actionlogid").SetString(param.Get("actionrecordid").String())
	par.Set("chainid").SetString(param.Get("chainid").String())
	par.Set("clinicid").SetString(cid)
	par.Set("uniqueidentity").SetString(param.Get("uniqueidentity").String())
	par.Set("action").SetString(param.Get("action").String())
	par.Set("actiontype").SetString(param.Get("actiontype").String())
	par.Set("doctorid").SetString(param.Get("clinicdocid").String())
	par.Set("doctorname").SetString(param.Get("clinicdocname").String())
	par.Set("customerid").SetString(param.Get("customerid").String())
	par.Set("operatorid").SetString(param.Get("userid").String())
	par.Set("actiondescribe").SetString(param.Get("actiondescribe").String())

	sql := ` insert into t_customerlog (customerlogid,actionlogid,chainid,clinicid,uniqueidentity,action,actiondescribe,actiontype,doctorid,
							doctorname,customerid,operatorid,operatedatetime,lastoperator) 
						values (:customerlogid,:actionlogid,:chainid,:clinicid,:uniqueidentity,:action,:actiondescribe,:actiontype,:doctorid,
							 :doctorname,:customerid,:operatorid,now(),'WEB')  `
	o := orm.NewOrm()
	o.Using("db_koala")
	_, err.Msg = o.RawJSON(sql, par).Exec()
	if err.Msg != nil {
		err.Errorf(gutils.ParamError, "插入操作记录失败")
	}

	return
}
