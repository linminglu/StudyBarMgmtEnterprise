//author:  曾文 2016-11-07
//purpose： 用户注册相关操作
package accountmodels

import (
	"fmt"
	"math/rand"
	"strconv"
	"strings"
	"time"
	"regexp"

	"doggy/gutils"
	"doggy/models/model"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

//取用户诊所密码
func GetKuserPsw(param config.LJSON) (psw string, err gutils.LError) {
	err.Caption = "GetKuserPsw"
	fmt.Println(param.ToString())
	sql := " select Password from t_doctor d where d.ClinicUniqueID = :clinicid and d.DoctorID =:koalaid "
	o := orm.NewOrm()
	o.Using("db_koala")
	var rs config.LJSON
	o.RawJSON(sql, param).ValuesJSON(&rs)

	if rs.ItemCount() > 0 {
		psw1 := rs.Item(0).Get("password").String()
		var param1 config.LJSON
		param1.Set("funcid").SetInt(gutils.FUNC_ID_CIPHERKEY_DECRYPT)
		param1.Set("key").SetString(gutils.AESKey)
		param1.Set("val").SetString(psw1)
		res := gutils.FlybearCPlus(param1)
		if res.Get("code").Int() != 1 {
			err.Errorf(gutils.ParamError, "密码处理失败")
			return psw, err
		}
		psw = res.Get("info").String()
	}

	return
}

//用户注册
func UserReg(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UserReg"
	mobile := param.Get("mobile").String()
	//code:=param.Get("code").String()
	//密码复杂度的预留
	PasswordComplexity := param.Get("passwordcomplexity").String()
	password := param.Get("password").String()
	fmt.Println(password)
	uid := strconv.FormatInt(gutils.CreateGUID(), 10)
	DataStatus := 1
	Stopped := 0
	source := 2
	roleid := 3
	Updatetime := time.Now().Format("2006-01-02 15:04:05")

	var param1 config.LJSON
	param1.Set("funcid").SetInt(gutils.FUNC_ID_CIPHERKEY_ENCRYPT)
	param1.Set("key").SetString(gutils.AESKey)
	param1.Set("val").SetString(password)
	res := gutils.FlybearCPlus(param1)
	if res.Get("code").Int() != 1 {
		err.Errorf(gutils.ParamError, "密码处理失败")
		return result, err
	}
	psw := res.Get("info").String()

	o := orm.NewOrm()
	o.Begin()
	sql1 := "insert into t_doctor(DoctorID,Mobile,Stopped,DataStatus,Updatetime,Age,Picture) Values(?,?,?,?,?,1,'')"
	_, err.Msg = o.Raw(sql1, uid, mobile, Stopped, DataStatus, Updatetime).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	sql2 := "insert into t_user(UserID,Password,ReservePassword ,RoleID,Mobile,source,CreateTime,LastLoginTime,Updatetime,PasswordComplexity) Values(?,?,?,?,?,?,?,?,?,?)"
	_, err.Msg = o.Raw(sql2, uid, strings.ToLower(gutils.Md5(password)), psw, roleid, mobile, source, Updatetime, Updatetime, Updatetime, PasswordComplexity).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	result.List.Set("userid").SetString(uid)
	return
}


func SendMobileCode(mobile string, funcidverify int, funcid int) bool {
	var param config.LJSON
	param.Set("funcid").SetInt(funcid) //注册验证码
	param.Set("mobile").SetString(mobile)
	param.Set("funcidverify").SetInt(funcidverify)
	gutils.FlybearCPlus(param)
	return true
}

func SendCode(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SendCode"

	mobile := param.Get("mobile").String() //手机号
	res := false
	res, err.Msg = regexp.Match("^((1[3|4|5|6|7|8|9][0-9]{9})|(15[89][0-9]{8}))$", []byte(mobile))
	if err.Msg != nil {
		return
	}

	if res == false {
		err.Errorf(gutils.ParamError, "手机号无效")
		return
	}

	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select userid from t_user where mobile=? and roleid=3 `
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "账号不存在")
		return
	}
	//发送验证码
	var data config.LJSON
	data.Set("funcid").SetInt(20100)
	data.Set("mobile").SetString(mobile)
	funcidverify := param.Get("funcidverify").Int()
	if funcidverify == 0 {
		funcidverify = 20113
	}
	data.Set("funcidverify").SetInt(funcidverify) 
	api := gutils.FlybearCPlus(data)
	code := api.Get("code").Int()
	if code == 0 {
		err.Errorf(gutils.ParamError, "验证码发送失败")
		return
	}

	return result, err
}


//验证手机的验证码
func CheckMobileCode(mobile string, code string, funcidverify int) (bool, string) {
	var result gutils.LResultModel
	sql := "SELECT Code,Updatetime,mobile FROM t_sys_code WHERE UserID=? AND FuncID=? AND Code=?"
	o := orm.NewOrm()
	num, _ := o.Raw(sql, mobile, funcidverify, code).ValuesJSON(&result.List)
	if num <= 0 {
		return false, "验证码错误"
	}
	sendtime := result.List.Item(0).Get("Updatetime").Time().Unix()
	now := time.Now().Unix() - 3600
	if now > sendtime {
		return false, "验证码过期"
	}
	return true, "验证码通过"
}

//创建诊所
func CreateClinic(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CreateClinic"
	//取管家号
	var idlist config.LJSON
	o := orm.NewOrm()
	o.Begin()

	sql := " select dentalid from t_dentalid where state = 0 limit 10 for update "
	_, err.Msg = o.Raw(sql).ValuesJSON(&idlist)
	if err.Msg != nil {
		o.Rollback()
		return
	}

	k := idlist.ItemCount()
	r := rand.New(rand.NewSource(time.Now().UnixNano()))
	i := r.Intn(k)
	dentalid := idlist.Item(i).Get("dentalid").String()
	//todo dentalid为0异常处理
	sql = " Update t_dentalid Set State = 1,UpdateTime = ? Where DentalID = ? "
	_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02 15:04:05"), dentalid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	//取用户信息
	var userinfo config.LJSON
	sql = " select u.userid,u.password,u.mobile,u.Username,u.userno,u.DataStatus,u.ReservePassword from t_user u where userid =:userid "
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&userinfo)
	if userinfo.ItemCount() == 0 {
		o.Rollback()
		err.Errorf(gutils.ParamError, "未找到用户信息")
		return result, err
	}
	password := userinfo.Item(0).Get("password").String()
	rspwd := userinfo.Item(0).Get("reservepassword").String()
	mobile := userinfo.Item(0).Get("mobile").String()
	if rspwd == "" {
		rspwd = "DqZm3OF04Z"
	}

	clinicid := param.Get("clinicid").String()
	var data config.LJSON
	var mo model.LModel
	data.Set("ClinicID").SetString(clinicid)
	data.Set("UserID").SetString(clinicid)
	data.Set("dentalid").SetString(dentalid)
	data.Set("chatid").SetString("")
	data.Set("username").SetString(clinicid)
	data.Set("password").SetString(password)
	data.Set("roleid").SetInt(2)
	data.Set("datastatus").SetInt(1)
	data.Set("name").SetString(param.Get("clinicname").String())
	data.Set("hospitalicon").SetString(param.Get("hospitalicon").String())
	data.Set("contact").SetString(param.Get("doctorname").String())
	data.Set("cliniccity").SetString(param.Get("cliniccity").String())
	data.Set("clinicprovince").SetString(param.Get("clinicprovince").String())
	data.Set("clinicarea").SetString(param.Get("clinicarea").String())
	data.Set("address").SetString(param.Get("address").String())
	data.Set("phone").SetString(param.Get("phone").String())
	data.Set("info").SetString(param.Get("info").String())
	data.Set("SoftWareType").SetInt(1)
	data.Set("firstversion").SetString("3.3.900.70")
	data.Set("bindmobile").SetString(mobile)
	data.Set("mobile").SetString(mobile)
	data.Set("version").SetString("3.3.900.70")
	data.Set("createtime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	data.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	data.Set("lastoperator").SetString("WEB")

	err.Msg = mo.SetORM(o).SetTable("t_clinic").Save(data)
	if err.Msg != nil {
		o.Rollback()
		return
	}
	err.Msg = mo.SetORM(o).SetTable("t_user").Save(data)
	if err.Msg != nil {
		o.Rollback()
		return
	}
	sql = ` insert into t_clinic_register_msg (clinicid,createtime,updatetime) values  (?,?,?)  `
	_, err.Msg = o.Raw(sql, clinicid, time.Now().Format("2006-01-02 15:04:05"), time.Now().Format("2006-01-02 15:04:05")).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	sql = ` INSERT INTO t_sms_user(UserID,Total,Used) VALUES(?, 500, 0) `
	_, err.Msg = o.Raw(sql, clinicid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	sql = ` INSERT INTO T_ClinicEX(clinicid,FirstVersion,MachineCode) VALUES(?,'3.3.900.70',?) `
	_, err.Msg = o.Raw(sql, clinicid, "").Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	koalaid := ""
	doctorname := param.Get("doctorname").String()
	mobile1 := mobile
	age := ""
	sex := ""
	//如果些账户在其他诊所已经有账号,直接用其他诊所相同的ID作koalaid
	var docinfo config.LJSON
	sql = ` select u.koalaid,d.name,d.Age,d.Sex from t_user_data  u left join t_clinic c on u.ClinicID = c.ClinicID   
		left join t_chainclinic ch on ch.ClinicID = c.ClinicID
		left join db_koala.t_doctor d on d.DoctorID = u.KoalaID
		where u.userid =:userid and koalaid <>'' and chainguid=:chainid  `

	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&docinfo)
	if docinfo.ItemCount() > 0 {
		koalaid = docinfo.Item(0).Get("koalaid").String()
		doctorname = docinfo.Item(0).Get("name").String()
		age = docinfo.Item(0).Get("age").String()
		sex = docinfo.Item(0).Get("sex").String()
	} else {
		koalaid = strconv.FormatInt(gutils.CreateGUID(), 10)
	}

	var docdata config.LJSON

	chainid := param.Get("chainid").String()
	IsSupper := 0 //默认不是超级管理员
	level := 0
	if chainid == "" { //还没有连锁店
		//添加连锁信息
		IsSupper = 1 //创建连锁的用户为超级管理员
		level = 1
		chainid = strconv.FormatInt(gutils.CreateGUID(), 10)
	}

	//获取汉字首字母
	var parampy config.LJSON
	parampy.Set("funcid").SetInt(gutils.FUNC_ID_GET_NAME_PINYIN)
	parampy.Set("name").SetString(doctorname)
	rpy := gutils.FlybearCPlus(parampy)
	if rpy.Get("code").Int() != 1 {
		o.Rollback()
		return
	}

	//添加诊所用户
	docdata.Set("ClinicUniqueID").SetString(clinicid)
	docdata.Set("chainid").SetString(chainid)
	docdata.Set("doctorid").SetString(koalaid)
	docdata.Set("name").SetString(doctorname)
	docdata.Set("phone").SetString(mobile1)
	docdata.Set("mobile").SetString(mobile1)
	docdata.Set("duty").SetString("管理员")
	docdata.Set("webduty").SetString("超级管理员CH")
	docdata.Set("age").SetString(age)
	docdata.Set("sex").SetString(sex)
	docdata.Set("usernum").SetString("001")
	docdata.Set("password").SetString(rspwd)
	docdata.Set("type").SetInt(1)
	docdata.Set("habit").SetInt(2)
	docdata.Set("stopped").SetInt(0)
	docdata.Set("lastoperator").SetString("WEB")
	docdata.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	docdata.Set("namepy").SetString(rpy.Get("pinyin").String())
	//密码校验码
	sign := fmt.Sprintf("KU=%s&6090UserID=%s&password=%sUl9g2c0&b3H", clinicid, koalaid, rspwd)
	pswsign := strings.ToUpper(gutils.Md5(sign))
	docdata.Set("signature").SetString(pswsign)
	err.Msg = mo.SetORM(o).SetTable("db_koala.t_doctor").Save(docdata)
	if err.Msg != nil {
		o.Rollback()
		return
	}
	var userdata config.LJSON
	userdata.Set("UserDataID").SetString(strconv.FormatInt(gutils.CreateGUID(), 10))
	userdata.Set("userid").SetString(param.Get("userid").String())
	userdata.Set("role").SetInt(3)
	userdata.Set("clinicid").SetString(clinicid)
	userdata.Set("chainid").SetString(chainid)
	userdata.Set("koalaid").SetString(koalaid)
	userdata.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	err.Msg = mo.SetORM(o).SetTable("t_user_data").Save(userdata)
	if err.Msg != nil {
		o.Rollback()
		return
	}
	if IsSupper == 1 { //还没有连锁店
		//添加连锁信息
		IsSupper = 1 //创建连锁的用户为超级管理员
		var chaindata config.LJSON
		chaindata.Set("ChainGUID").SetString(chainid)
		chaindata.Set("ChainName").SetString(param.Get("clinicname").String())
		chaindata.Set("Mobile").SetString(mobile)
		chaindata.Set("Contact").SetString(param.Get("doctorname").String())
		chaindata.Set("DataStatus").SetString("2") //2表示未开通连锁
		chaindata.Set("CreateID").SetString(param.Get("userid").String())
		chaindata.Set("clinicid").SetString(clinicid)
		chaindata.Set("kuserid").SetString(koalaid)
		chaindata.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
		err.Msg = mo.SetORM(o).SetTable("t_chain").Save(chaindata)
		if err.Msg != nil {
			o.Rollback()
			return
		}
	}

	sql = ` INSERT INTO t_chainclinic(ChainClinicGUID,ChainGUID,ClinicID,level,DataStatus) VALUES(?,?,?,?,1) `
	_, err.Msg = o.Raw(sql, strconv.FormatInt(gutils.CreateGUID(), 10), chainid, clinicid, level).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	//添加连锁用户
	var chainuserdata config.LJSON

	chainuserdata.Set("ChainUserGUID").SetString(gutils.CreateSTRGUID())
	chainuserdata.Set("ChainGUID").SetString(chainid)
	chainuserdata.Set("clinicid").SetString(clinicid)
	chainuserdata.Set("kuserid").SetString(koalaid)
	chainuserdata.Set("userid").SetString(param.Get("userid").String())
	chainuserdata.Set("Privileges").SetString("1")
	chainuserdata.Set("PrivilegesPat").SetString("1")
	chainuserdata.Set("PrivilegesStat").SetString("1")
	chainuserdata.Set("IsSupper").SetInt(IsSupper)
	chainuserdata.Set("DataStatus").SetString("1")
	chainuserdata.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	err.Msg = mo.SetORM(o).SetTable("t_chainuser").Save(chainuserdata)
	if err.Msg != nil {
		o.Rollback()
		return
	}

	//解绑模拟诊所
	var uidjs config.LJSON
	uidjs.Set("userid1").SetString(param.Get("userid").String())
	uidjs.Set("userid21").SetString("588888")
	uidjs.Set("userid22").SetString("599999")
	sql = " delete from t_share_user where userid1=:userid1 and (userid2=:userid21 or userid2=:userid22) and type=0 "
	_, err.Msg = o.RawJSON(sql, uidjs).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql = `INSERT INTO db_koala.t_usergroup (ChainID, ClinicUniqueID, UserGroupID, UserGroupName, GroupDesc, UserPrivileges, DisplayOrder, RtType,  AppPrivileges,lastoperator) 
	SElECT ? AS CHainID,  ? AS ClinicUniqueID, UserGroupID, UserGroupName, GroupDesc, UserPrivileges, DisplayOrder, RtType,  AppPrivileges,'WEB' FROM db_koala.t_usergroup WHERE ClinicUniqueID ='0' `
	_, err.Msg = o.Raw(sql, chainid, clinicid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql = `INSERT INTO db_koala.t_scheduleitem ( ClinicUniqueID, ScheduleItemIdentity, ScheduleItem, WorkMinute,DisplayOrder,lastoperator) 
	SElECT ? AS ClinicUniqueID, ScheduleItemIdentity, ScheduleItem, WorkMinute,DisplayOrder,'WEB' FROM db_koala.t_scheduleitem WHERE ClinicUniqueID ='0' `
	_, err.Msg = o.Raw(sql, clinicid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	return result, err
}
