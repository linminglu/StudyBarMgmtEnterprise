//author:  曾文 2016-11-07
//purpose： 用户登录相关操作
package accountmodels

import (
	"fmt"
	"strconv"
	"time"

	"doggy/gutils"
	"doggy/gutils/gredis"
	"doggy/models/model"
	"strings"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/logs"
	"github.com/astaxie/beego/orm"
)

//根据手机号码获取信息  //拷贝自members 待优化
func GetMobileUserInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetMobileUserInfo"
	o := orm.NewOrm()
	_, err.Msg = o.RawJSON("select u.userid,u.password,u.mobile,u.userno,d.name,d.email,d.picture,u.DataStatus,u.ReservePassword from t_user as u left join t_doctor as d on u.UserID=d.DoctorID where u.mobile = :mobile and u.roleid=3 and d.DataStatus=1", param).ValuesJSON(&result.List)
	//_, err.Msg = o.RawJSON("select * from t_doctor where mobile = :mobile", param).ValuesJSON(&result.List)
	//通过手机号判断是否存在BBS中
	return
}

//获取连锁店内是内测或者公测的诊所ID
func GetBetaClinicID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetBetaClinicID"
	o := orm.NewOrm()
	sql := ` select a.ClinicID from db_flybear.t_chainclinic a left join db_image.t_version v on a.ClinicID = v.ClinicGUID
 where a.chainguid = :chainguid and a.DataStatus = 1 
 and v.VersionType in ('alpha','beta','alpha-plus','beta-plus') `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	return
}

//判断用户是否已经提交
func IsCommitApply(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "IsCommitApply"
	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select checkstatus from t_clinic_apply_info where userid=:userid `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&obj)
	if obj.ItemCount() == 0 { //用户未申请
		result.List.Set("iscommit").SetInt(0)
	} else { //
		status := obj.Item(0).Get("checkstatus").String()

		if status == "0" { //用户只保存,未提交
			result.List.Set("iscommit").SetInt(0)
		} else { //用户已经提交
			result.List.Set("iscommit").SetInt(1)
		}
	}
	return
}

//根据KoalaID取用户信息
func GetUserInfoByKoalaID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetUserInfoByKoalaID"
	clinicid := param.Get("clinicid").String()
	if clinicid == "" {
		err.Errorf(gutils.ParamError, "诊所ID不能为空")
		return result, err
	}
	/*chainid := param.Get("chainid").String()
	if chainid == "" {
		err.Errorf(gutils.ParamError, "chainid不能为空")
		return result, err
	}*/
	koalaid := param.Get("koalaid").String()
	if koalaid == "" {
		err.Errorf(gutils.ParamError, "koalaid不能为空")
		return result, err
	}

	sql := ` select u.*,dd.name,dd.email,dd.picture from t_user u inner join t_user_data ud  on u.UserID = ud.UserID 
		left join t_doctor dd  on u.UserID=dd.DoctorID
		left join db_koala.t_doctor d on d.DoctorID = ud.KoalaID  and d.ClinicUniqueID = ud.ClinicID
		where d.DoctorID = :koalaid and d.ClinicUniqueID = :clinicid ` //and d.ChainID = :chainid
	o := orm.NewOrm()
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)

	if result.List.ItemCount() == 0 && param.Get("version").String() == "std" { //标准版可不绑定手机账号使用
		sql = ` select d.doctorid as userid ,d.Name as Name from db_koala.t_doctor d 
		where d.DoctorID = :koalaid and d.ClinicUniqueID = :clinicid  ` //and d.ChainID = :chainid
		_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	}
	return
}

//根据KoalaID取用户ID
func GetUserIDByKoalaID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetUserIDByKoalaID"
	clinicid := param.Get("clinicid").String()
	if clinicid == "" {
		err.Errorf(gutils.ParamError, "诊所ID不能为空")
		return result, err
	}

	koalaid := param.Get("koalaid").String()
	if koalaid == "" {
		err.Errorf(gutils.ParamError, "koalaid不能为空")
		return result, err
	}

	sql := ` select u.userid from t_user u inner join t_user_data ud  on u.UserID = ud.UserID 
		left join db_koala.t_doctor d on d.DoctorID = ud.KoalaID and  d.ClinicUniqueID = ud.ClinicID
		where d.DoctorID = :koalaid and d.ClinicUniqueID = :clinicid  `
	o := orm.NewOrm()
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)

	if result.List.ItemCount() == 0 && param.Get("version").String() == "std" { //标准版可不绑定手机账号使用
		sql = ` select d.doctorid as userid ,d.Name as Name from db_koala.t_doctor d 
		where d.DoctorID = :koalaid and d.ClinicUniqueID = :clinicid `
		_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	}
	return
}

//写入登入历史 //拷贝自members 待优化
func AddLoginLog(ip string, userid string, LoginMode int, UserName string, terminal int) (result gutils.LResultModel, err gutils.LError) {
	o := orm.NewOrm()
	Ipaddr := model.GetIpaddress(ip) //根据ip去获取地址 ？？？
	LoginDatetime := time.Now().Format("2006-01-02 15:04:05")
	borwser := gutils.GetBorwer() //浏览器类型？？？
	//??????? 获取访问的浏览器类型
	sql := "insert into t_login_record(LoginRecordID,userid,LoginMode,UserName,terminal,address,IpAddr,LoginDatetime,browser) Values(?,?,?,?,?,?,?,?,?)"
	_, err.Msg = o.Raw(sql, gutils.CreateGUID(), userid, LoginMode, UserName, terminal, Ipaddr, ip, LoginDatetime, borwser).Exec()
	return
}

//写入登入记录
func AddLoginRecord(userid string, LoginMode int, UserName string, terminal int) (result gutils.LResultModel, err gutils.LError) {
	o := orm.NewOrm()
	regip := gutils.GetIp()             //获取访问的ip地址 ？？？
	Ipaddr := model.GetIpaddress(regip) //根据ip去获取地址 ？？？
	LoginDatetime := time.Now().Format("2006-01-02 15:04:05")
	borwser := gutils.GetBorwer() //浏览器类型？？？
	//??????? 获取访问的浏览器类型
	sql := "insert into t_login_record(LoginRecordID,userid,LoginMode,UserName,terminal,address,IpAddr,LoginDatetime,browser) Values(?,?,?,?,?,?,?,?,?)"
	_, err.Msg = o.Raw(sql, gutils.CreateGUID(), userid, LoginMode, UserName, terminal, Ipaddr, regip, LoginDatetime, borwser).Exec()
	return
}

//手机端、微信查看运营中心，进行权限判断
/*
1.单店 --如果是管理员角色就有所有权限 否则按照角色获取权限
2.连锁店 --如果是超级管理员就有所有权限 否则按照角色获取权限
*/
func CheckReportRight(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	o := orm.NewOrm()
	o.Using("db_koala")
	var obj1 config.LJSON
	//先查询是否超级管理员
	sql := ` select * from t_doctor where clinicuniqueid=? and doctorid=? and datastatus=1 and stopped=0 and duty='超级管理员' `
	_, err.Msg = o.Raw(sql, "1", param.Get("koalaid").String()).ValuesJSON(&obj1)
	if obj1.ItemCount() != 0 {
		return result, err
	}
	//再查询是否管理员
	var obj config.LJSON
	sql = ` select * from t_doctor where clinicuniqueid=? and doctorid=? and datastatus=1 and stopped=0 and duty='管理员' `
	_, err.Msg = o.Raw(sql, param.Get("clinicid").String(), param.Get("koalaid").String()).ValuesJSON(&obj)

	if obj.ItemCount() == 0 {
		var tmp config.LJSON
		sql = ` select g.WebPrivileges,g.UserPrivileges from db_koala.t_doctor d left join t_usergroup g on 
				d.clinicuniqueid=g.clinicuniqueid and d.chainid=g.chainid and d.duty=g.UserGroupName 
				where  d.doctorid=? and d.chainid=? order by d.ClinicUniqueID asc limit 1  `
		_, err.Msg = o.Raw(sql, param.Get("koalaid").String(), param.Get("chainid").String()).ValuesJSON(&tmp)
		if tmp.ItemCount() == 0 {
			err.Errorf(gutils.ParamError, "未配置Web权限")
		} else {
			WebPrivileges := tmp.Item(0).Get("webprivileges").String()
			UserPrivileges := tmp.Item(0).Get("userprivileges").String()
			WebPrivileges = WebPrivileges + ";" + UserPrivileges
			if strings.Contains(WebPrivileges, gutils.RT_WEB_REPORT) == false {
				err.Errorf(gutils.ParamError, "暂无运营中心权限")
			}
		}
	}
	return result, err
}

func VerifySessionIsOK(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "VerifySessionIsOK"
	session := param.Get("session").String()
	userid := param.Get("userid").String()
	clinicid := param.Get("clinicid").String()

	o := orm.NewOrm()
	sql := ` select u.session,r.token from t_user_data ud inner join t_user u on ud.userid=u.userid and u.roleid=3 
	inner join t_user r on ud.clinicid=r.userid and r.roleid=2 where ud.userid=? and ud.clinicid=?
	
	`
	_, err.Msg = o.Raw(sql, userid, clinicid).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "用户和诊所未关联")
		return result, err
	}

	usession := result.List.Item(0).Get("session").String()
	if session != usession {
		err.Errorf(gutils.ParamError, "鉴权失效")
	}
	return result, err
}

//根据clinicid和userid获取诊所内的koalaid
func GetKoalaIDByUserID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetKoalaIDByUserID"
	clinicid := param.Get("clinicid").String()
	userid := param.Get("userid").String()
	if clinicid == "" {
		err.Errorf(gutils.ParamError, "诊所ID不能为空")
		return result, err
	}

	if userid == "" {
		err.Errorf(gutils.ParamError, "用户ID不能为空")
		return result, err
	}

	sql := ` select koalaid from t_user_data where clinicid=? and userid=? and datastatus=1 `
	o := orm.NewOrm()
	o.Using("db_flybear")
	_, err.Msg = o.Raw(sql, clinicid, userid).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "未关联诊所内用户")
	}
	return result, err
}

//获取诊所的连锁店ID
func GetChainID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetChainID"
	clinicid := param.Get("clinicid").String()
	if clinicid == "" {
		err.Errorf(gutils.ParamError, "诊所ID不能为空")
		return result, err
	}
	sql := ` select cc.chainguid as chainid,c.chainname,cl.name as clinicname from t_chainclinic cc inner join t_chain c on
	 cc.chainguid=c.chainguid and c.datastatus<> 0 inner join t_clinic cl on cl.clinicid=cc.clinicid  
	 where cc.clinicid=:clinicid and cc.datastatus=1 `
	o := orm.NewOrm()
	o.Using("db_flybear")
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "诊所连锁店ID不存在")
		return result, err
	}
	return
}

//根据管家号和诊所内ID获取诊所账号信息
func GetDoctorInfoByDentalID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {

	err.Caption = "GetDoctorInfoByDentalID"
	dentalid := param.Get("dentalid").String()
	doctorname := param.Get("doctorname").String()
	password := param.Get("password").String()
	if dentalid == "" {
		err.Errorf(gutils.ParamError, "管家号不能为空")
		return result, err
	}
	if doctorname == "" {
		err.Errorf(gutils.ParamError, "用户名不能为空")
		return result, err
	}

	//查诊所信息
	sql := " SELECT * FROM db_flybear.t_user u WHERE u.DentalID = :dentalid AND RoleID=2 "
	var clinicjs config.LJSON

	o := orm.NewOrm()
	o.Using("db_koala")
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&clinicjs)

	if clinicjs.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "未找到管家号对应诊所")
		return result, err
	}

	clinicid := clinicjs.Item(0).Get("userid").String()
	param.Set("clinicid").SetString(clinicid)
	sql = " SELECT * FROM t_doctor d WHERE d.ClinicUniqueID =:clinicid AND d.Name = :doctorname   AND d.DataStatus = 1   AND  IFNULL( d.Stopped,0) = 0  "
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)

	if result.List.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "用户名或密码错误")
		return result, err
	}

	if result.List.Item(0).Get("chainid").String() == "" { //后台数据没有升级 ,进行升级
		r, _ := UpdateClinicInfo(param)
		if r.List.ItemCount() > 0 {
			result.List.Item(0).Set("chainid").SetString(r.List.Item(0).Get("chainid").String())
		}
	}

	if param.Get("nocheckpsw").String() != "1" {
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
		//beego.Info("PC", "pc-password1", psw)
		//beego.Info("PC", "cloud-password1", result.List.Item(0).Get("password").String())

		if psw != result.List.Item(0).Get("password").String() {
			err.Errorf(gutils.ParamError, "用户名或密码错误")
			return result, err
		}
	}

	return
}

//根据用户诊所ID取所有绑定诊所及诊所内密码
func GetClinicInofByKoalaID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetClinicInofByKoalaID"
	koalaid := param.Get("koalaid").String()
	clinicid := param.Get("clinicid").String()

	if koalaid == "" {
		err.Errorf(gutils.ParamError, "koalaid不能为空")
		return result, err
	}

	if clinicid == "" {
		err.Errorf(gutils.ParamError, "clinicid不能为空")
		return result, err
	}

	sql := `SELECT d.ChainID, d.ClinicUniqueID, d.DoctorID, d.NAME,d.Password,u.UserID, u.Username, u.PASSWORD as MobilePassword ,
	    u.mobile,u.userno,d.name,d.email,d.picture,u.DataStatus
		FROM t_doctor d 
		INNER JOIN (SELECT * FROM db_flybear.t_user_data d 
		WHERE userid IN ( SELECT userid FROM db_flybear.t_user_data WHERE koalaid = :koalaid AND clinicid=:clinicid  ) 
		AND d.Role = 3 ) t 
		ON d.ClinicUniqueID = t.ClinicID AND d.DoctorID = t.koalaid 
		INNER JOIN db_flybear.t_user u ON u.UserID = t.UserID 
		WHERE IFNULL(d.Stopped, 0) = 0 AND IFNULL(d.DataStatus, 1) = 1 `

	o := orm.NewOrm()
	o.Using("db_koala")
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)

	/*if result.List.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "未绑定账号")
		return result, err
	} */
	/*samepsw := true
	psw := ""
	for i := 0; i < result.List.ItemCount(); i++ {
		if i == 0 {
			psw = result.List.Item(i).Get("password").String()
			mobilepsw := result.List.Item(i).Get("mobilepassword").String() //判断诊所内密码与云端密码是否一致

			var param1 config.LJSON
			param1.Set("funcid").SetInt(gutils.FUNC_ID_CIPHERKEY_DECRYPT)
			param1.Set("key").SetString(gutils.AESKey)
			param1.Set("val").SetString(psw)
			res := gutils.FlybearCPlus(param1)
			if res.Get("code").Int() != 1 {
				err.Errorf(gutils.ParamError, "密码处理失败")
				return result, err
			}
			p := res.Get("info").String() //解密密码后财MD5,才能和云端密码比较
			p2 := gutils.Md5(p)
			fmt.Println(p2)
			if strings.ToLower(mobilepsw) != strings.ToLower(gutils.Md5(p)) {
				samepsw = false
				break
			}
		} else if psw != result.List.Item(i).Get("password").String() {
			samepsw = false
			break
		}
	}
	if samepsw == true {
		result.TotalList.Set("samepassword").SetString("1")
	} else {
		result.TotalList.Set("samepassword").SetString("0")
	}*/

	return result, err
}

//根据userid和dentalid查是否有绑定
func GetBindClinicDoc(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetClinicInofByMobile"
	userid := param.Get("userid").String()

	if userid == "" {
		err.Errorf(gutils.ParamError, "userid!")
		return result, err
	}

	sql := `SELECT d.ClinicUniqueID, d.DoctorID, d.NAME,d.Password,d.chainid 
		FROM t_doctor d 
		INNER JOIN db_flybear.t_user_data u ON d.ClinicUniqueID = u.ClinicID AND d.DoctorID = u.koalaid 
		INNER JOIN db_flybear.t_user t on t.RoleID =2 and t.userid = u.clinicid 
		WHERE IFNULL(d.Stopped, 0) = 0 AND IFNULL(d.DataStatus, 1) = 1 and u.userid =:userid  and t.dentalid=:dentalid `

	o := orm.NewOrm()
	o.Using("db_koala")
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	return
}

//根据手机号码取所有绑定诊所及诊所内密码
func GetClinicInofByMobile(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetClinicInofByMobile"
	mobile := param.Get("mobile").String()

	if mobile == "" {
		err.Errorf(gutils.ParamError, "mobile不能为空!")
		return result, err
	}

	sql := `SELECT d.ClinicUniqueID, d.DoctorID, d.NAME,d.Password,u.UserID, u.Username, u.PASSWORD as MobilePassword 
		FROM t_doctor d 
		INNER JOIN (SELECT * FROM db_flybear.t_user_data d 
		WHERE userid IN ( SELECT userid FROM db_flybear.t_user WHERE mobile = :mobile    ) 
		  ) t 
		ON d.ClinicUniqueID = t.ClinicID AND d.DoctorID = t.koalaid 
		INNER JOIN db_flybear.t_chain c ON t.ChainID=c.ChainGUID and c.DataStatus !=0
		INNER JOIN db_flybear.t_user u ON u.UserID = t.UserID 
		WHERE IFNULL(d.Stopped, 0) = 0 AND IFNULL(d.DataStatus, 1) = 1 `

	o := orm.NewOrm()
	o.Using("db_koala")
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)

	/*if result.List.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "未关联诊所!")
		return result, err
	}*/

	/*samepsw := true
	psw := ""
	for i := 0; i < result.List.ItemCount(); i++ {
		if i == 0 {
			psw = result.List.Item(i).Get("password").String()
			mobilepsw := result.List.Item(i).Get("mobilepassword").String() //判断诊所内密码与云端密码是否一致

			var param1 config.LJSON
			param1.Set("funcid").SetInt(gutils.FUNC_ID_CIPHERKEY_DECRYPT)
			param1.Set("key").SetString(gutils.AESKey)
			param1.Set("val").SetString(psw)
			res := gutils.FlybearCPlus(param1)
			if res.Get("code").Int() != 1 {
				err.Errorf(gutils.ParamError, "密码处理失败")
				return result, err
			}
			p := res.Get("info").String() //解密密码后财MD5,才能和云端密码比较
			p2 := gutils.Md5(p)
			fmt.Println(p2)
			if strings.ToLower(mobilepsw) != strings.ToLower(gutils.Md5(p)) {
				samepsw = false
				break
			}
		} else if psw != result.List.Item(i).Get("password").String() {
			samepsw = false
			break
		}
	}

	if samepsw == true {
		result.TotalList.Set("samepassword").SetString("1")
	} else {
		result.TotalList.Set("samepassword").SetString("0")
	}
	*/
	return result, err
}

//根据管家号激活手机账号
func ActiveAccountByDentalID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ActiveAccountByDentalID"
	userid := param.Get("userid").String()
	dentalid := param.Get("dentalid").String()
	if userid == "" {
		err.Errorf(gutils.ParamError, "userid不能为空")
		return result, err
	}
	if dentalid == "" {
		err.Errorf(gutils.ParamError, "dentalid不能为空")
		return result, err
	}

	sql := `SELECT u.UserDataID,u.UserID,u.ClinicID,u.KoalaID,u.DataStatus,c.DentalID FROM db_flybear.t_user_data u
		INNER JOIN db_flybear.t_user c ON c.UserID = u.ClinicID AND c.RoleID =2
		WHERE u.userid = :userid and c.DentalID = :dentalid `

	var clinicjs config.LJSON
	o := orm.NewOrm()
	//o.Using("db_koala")
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&clinicjs)

	if clinicjs.ItemCount() == 0 {
		sql = ` SELECT * FROM db_flybear.t_user_data u WHERE u.userid =:userid and u.ClinicID = '1' `
		var js config.LJSON
		_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&js)
		if js.ItemCount() == 0 || js.Item(0).Get("chainid").String() == "" {
			err.Errorf(gutils.ParamError, "账户未绑定到指定的管家号")
			return result, err

		}
		chainid := js.Item(0).Get("chainid").String()
		sql = ` SELECT * FROM t_user u INNER JOIN t_chainclinic c ON u.UserID = c.ClinicID
			WHERE  c.ChainGUID = ? AND u.DentalID = ? `
		var js1 config.LJSON
		_, err.Msg = o.Raw(sql, chainid, dentalid).ValuesJSON(&js1)
		if js1.ItemCount() == 0 {
			err.Errorf(gutils.ParamError, "账户未绑定到指定的管家号")
			return result, err
		}
	}

	//设置账号为激活
	var data config.LJSON
	data.Set("UserID").SetString(userid)
	data.Set("DataStatus").SetString("1")
	var mo model.LModel
	err.Msg = mo.SetORM(o).SetTable("t_user").Save(data)
	return result, err
}

//绑定诊所
func BindClinicByDentalID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "BindClinicByDentalID"
	userid := param.Get("userid").String()
	dentalid := param.Get("dentalid").String()
	doctorname := param.Get("doctorname").String()
	password := param.Get("password").String()
	if userid == "" {
		err.Errorf(gutils.ParamError, "userid不能为空")
		return result, err
	}
	if dentalid == "" {
		err.Errorf(gutils.ParamError, "dentalid不能为空")
		return result, err
	}
	if doctorname == "" {
		err.Errorf(gutils.ParamError, "用户名不能为空")
		return result, err
	}
	if password == "" {
		err.Errorf(gutils.ParamError, "密码不能为空，请输入密码")
		return result, err
	}

	//查询对应诊所
	sql := " SELECT * FROM db_flybear.t_user u WHERE u.DentalID = :dentalid AND RoleID=2 "
	var clinicjs config.LJSON

	o := orm.NewOrm()
	o.Using("db_koala")
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&clinicjs)

	if clinicjs.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "未找到管家号对应诊所")
		return result, err
	}

	clinicid := clinicjs.Item(0).Get("userid").String()
	param.Set("clinicid").SetString(clinicid)
	sql = " SELECT * FROM t_doctor d WHERE d.ClinicUniqueID =:clinicid AND d.Name = :doctorname AND d.DataStatus = 1    AND d.Stopped = 0 "
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)

	if result.List.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "用户名错误")
		return result, err
	}

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
	if psw != result.List.Item(0).Get("password").String() {
		err.Errorf(gutils.ParamError, "密码错误")
		return result, err
	}

	//判断这个手机账号是不是已经跟这家诊所其他账号关联
	sql = `SELECT u.Userid,u.KoalaID,d.DataStatus From   db_flybear.t_user_data u  
		left join db_koala.t_doctor d on 
		u.ClinicID = d.ClinicUniqueID and u.KoalaID = d.DoctorID  
	    Where u.clinicid =:clinicid and u.userid =:userid  and d.DataStatus = 1 and d.Stopped =0  `

	var userdatajs config.LJSON
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&userdatajs)
	if userdatajs.ItemCount() > 0 {
		err.Errorf(gutils.ParamError, "已经绑定过此诊所的账号")
		return result, err
	}

	//判断这个诊所内账号是否已经绑定有手机账号,如果有绑定,还判断绑定的是不是现在提交的这个账号
	var userjs config.LJSON
	koalaid := result.List.Item(0).Get("doctorid").String()
	param.Set("koalaid").SetString(koalaid)
	sql = `SELECT u.Userid, u.Mobile FROM db_flybear.t_user u 
	INNER JOIN db_flybear.t_user_data d ON u.userid = d.userid WHERE d.koalaid = :koalaid `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&userjs)
	if userjs.ItemCount() > 0 && userjs.Item(0).Get("userid").String() != userid {
		err.Errorf(gutils.ParamError, "输入的诊所账号已绑定其他手机账号")
		return result, err
	} else if userjs.ItemCount() == 0 {
		//添加到t_user_data
		var data config.LJSON
		id := strconv.FormatInt(gutils.CreateGUID(), 10)
		data.Set("UserDataID").SetString(id)
		data.Set("UserID").SetString(userid)
		data.Set("Role").SetString("3")
		data.Set("ClinicID").SetString(clinicid)
		data.Set("KoalaID").SetString(result.List.Item(0).Get("doctorid").String())
		chainid := result.List.Item(0).Get("chainid").String()
		data.Set("ChainID").SetString(chainid)
		var mo model.LModel
		o1 := orm.NewOrm()
		o1.Using("db_flybear")
		err.Msg = mo.SetORM(o1).SetTable("t_user_data").Save(data)
	}

	return result, err
}

//绑定诊所
func BindMobileByKoalaID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "BindMobileByKoalaID"
	//判断这个手机账号是不是已经跟这家诊所其他账号关联
	o1 := orm.NewOrm()
	sql := `SELECT u.Userid,u.KoalaID,d.DataStatus From   db_flybear.t_user_data u  
		left join db_koala.t_doctor d on 
		u.ClinicID = d.ClinicUniqueID and u.KoalaID = d.DoctorID  
	    Where u.clinicid =:clinicid and u.userid =:userid  and d.DataStatus = 1 and d.Stopped =0  `
	var userdatajs config.LJSON
	_, err.Msg = o1.RawJSON(sql, param).ValuesJSON(&userdatajs)
	if userdatajs.ItemCount() > 0 {
		//err.Errorf(gutils.ParamError, "已经绑定过此诊所的账号")
		//return result, err
		sql = " DELETE FROM db_flybear.t_user_data WHERE clinicid =:clinicid and  userid =:userid "
		_, err.Msg = o1.RawJSON(sql, param).Exec()

		sql = " update db_koala.t_doctor d set d.phone ='' ,LastOperator='WEB' where d.doctorid = ? and d.ClinicUniqueID =? "
		_, err.Msg = o1.Raw(sql, userdatajs.Item(0).Get("koalaid").String(), param.Get("clinicid").String()).Exec()
		gredis.SetSyncTime(param.Get("clinicid").String(), "doctor", time.Now())
	}

	//取koalaid对应chainid
	var chainjs config.LJSON
	sql = " SELECT * FROM t_chainclinic c WHERE c.ClinicID = :clinicid AND DataStatus <> 0  "
	_, err.Msg = o1.RawJSON(sql, param).ValuesJSON(&chainjs)
	chainid := chainjs.Item(0).Get("chainguid").String()

	id := strconv.FormatInt(gutils.CreateGUID(), 10)
	param.Set("UserDataID").SetString(id)
	param.Set("Role").SetString("3")
	param.Set("ChainID").SetString(chainid)
	var mo model.LModel
	err.Msg = mo.SetORM(o1).SetTable("t_user_data").Save(param)

	sql = " update db_koala.t_doctor d set d.phone =:mobile ,LastOperator='WEB' where d.doctorid = :koalaid and d.ClinicUniqueID =:clinicid  "
	_, err.Msg = o1.RawJSON(sql, param).Exec()

	return result, err
}

//重置密码
func ResetAllPassword(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ResetAllPassword"
	password := param.Get("password").String()
	mobile := param.Get("mobile").String()
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
	mobilepassword := gutils.Md5(password)
	userid := param.Get("userid").String()
	passwordcomplexity := param.Get("passwordcomplexity").String()

	o := orm.NewOrm()
	o.Begin()
	sql1 := " UPDATE db_flybear.t_user SET PASSWORD =?, ReservePassword=? ,passwordComplexity = ?  WHERE userid = ? "
	_, err.Msg = o.Raw(sql1, mobilepassword, psw, passwordcomplexity, userid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	var docjs config.LJSON
	sql2 := ` SELECT * FROM db_koala.t_doctor  WHERE (doctorid,clinicuniqueid) IN
		( SELECT KoalaID,clinicid FROM   db_flybear.t_user_data u 
		WHERE role = 3 AND u.userid =? AND KoalaID<>'') `
	_, err.Msg = o.Raw(sql2, userid).ValuesJSON(&docjs)
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql3 := ` UPDATE db_koala.t_doctor SET PASSWORD =?,LastOperator='WEB', Signature=? WHERE clinicuniqueid=? AND DoctorID=? `
	for i := 0; i < docjs.ItemCount(); i++ {
		ku := docjs.Item(i).Get("clinicuniqueid").String()
		docid := docjs.Item(i).Get("doctorid").String()
		sign := fmt.Sprintf("KU=%s&6090UserID=%s&password=%sUl9g2c0&b3H", ku, docid, psw)
		pswsign := strings.ToUpper(gutils.Md5(sign))
		_, err.Msg = o.Raw(sql3, psw, pswsign, ku, docid).Exec()
		if err.Msg != nil {
			o.Rollback()
			return
		}
		gredis.SetSyncTime(ku, "doctor", time.Now())
	}

	// 发送提醒短信
	if mobile != "" {
		var smsparam config.LJSON
		senddate := time.Now().Format("2006-01-02 15:04:05")
		content := "您于%s重置账号统一登录密码成功。此密码可用于登录App、PC端和Web端的已绑定或已关联的诊所管理系统。【牙医管家】"
		content = fmt.Sprintf(content, senddate)
		smsparam.Set("SMSSendGuid").SetString(gutils.CreateSTRGUID())
		//smsparam.Set("clinicID").SetString(uid)
		smsparam.Set("MSGType").SetInt(0) //0通知类短信,1广告类短信
		smsparam.Set("mobile").SetString(mobile)
		smsparam.Set("content").SetString(content)
		smsparam.Set("msgid").SetString("")
		smsparam.Set("msgCount").SetInt(len(content))
		smsparam.Set("senddate").SetString(senddate)
		smsparam.Set("createDate").SetString(senddate)
		smsparam.Set("SendStatus").SetInt(0)

		var mo model.LModel
		err.Msg = mo.SetORM(o).SetTable("t_sms_send").Save(smsparam) //插入短信记录
	}

	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	return
}

//更新可逆密码
func UpdateReservePassword(userid, password string) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UpdateReservePassword"
	var param1 config.LJSON
	param1.Set("funcid").SetInt(gutils.FUNC_ID_CIPHERKEY_ENCRYPT)
	param1.Set("key").SetString(gutils.AESKey)
	param1.Set("val").SetString(password)
	res := gutils.FlybearCPlus(param1)
	if res.Get("code").Int() != 1 {
		err.Errorf(gutils.ParamError, "密码处理失败")
		return result, err
	}

	rsdpsw := res.Get("info").String()
	o := orm.NewOrm()
	sql1 := " UPDATE db_flybear.t_user SET ReservePassword =?  WHERE userid = ? "
	_, err.Msg = o.Raw(sql1, rsdpsw, userid).Exec()
	return
}

func Getbanner() (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "Getbanner"
	timenow := time.Now().Format("2006-01-02")
	o := orm.NewOrm()
	sql1 := `SELECT * FROM t_website_banner_manage WHERE banner_type = 2 AND datastatus = 1 AND activetime_start <= ? 
	AND activetime_end >= ? ORDER BY displayorder asc `
	_, err.Msg = o.Raw(sql1, timenow, timenow).ValuesJSON(&result.List)
	return
}

func UpdateClinicInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UpdateClinicInfo"
	//chaintype := 0 //0表示还不是连锁
	dentalid := param.Get("dentalid").String()
	if dentalid == "" {
		err.Errorf(gutils.ParamError, "dentalid不能为空")
		return
	}
	o := orm.NewOrm()
	o.Begin()
	var mo model.LModel

	var js config.LJSON

	sql := " SELECT * FROM t_clinic c INNER JOIN t_user u ON c.ClinicID = u.UserID WHERE u.DentalID = :dentalid "
	i, e := o.RawJSON(sql, param).ValuesJSON(&js)
	err.Msg = e
	if i == 0 {
		err.Errorf(gutils.ParamError, "未找到管家号对应诊所")
		return
	}

	clinicid := js.Item(0).Get("clinicid").String()
	clinicname := js.Item(0).Get("name").String()
	chainid := clinicid

	var chainjs config.LJSON
	sql = " SELECT * FROM t_chainclinic c WHERE c.ClinicID = ?  AND c.dataStatus =1 "
	i, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&chainjs)
	if i == 0 {
		var chaindata config.LJSON
		chaindata.Set("ChainGUID").SetString(chainid)
		chaindata.Set("ChainName").SetString(clinicname)
		chaindata.Set("clinicid").SetString(clinicid)
		chaindata.Set("datastatus").SetString("2")
		chaindata.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
		err.Msg = mo.SetORM(o).SetTable("t_chain").Save(chaindata)
		if err.Msg != nil {
			o.Rollback()
			return
		}

		sql = ` INSERT INTO t_chainclinic(ChainClinicGUID,ChainGUID,ClinicID,level,DataStatus) VALUES(?,?,?,1,1) `
		_, err.Msg = o.Raw(sql, strconv.FormatInt(gutils.CreateGUID(), 10), chainid, clinicid).Exec()
		if err.Msg != nil {
			o.Rollback()
			return
		}
	} else {
		chainid = chainjs.Item(0).Get("chainguid").String()
		//chaintype = 1 //1表示是连锁
		//已经是连锁的,要升
	}

	sql = ` UPDATE t_user_data  u SET ChainID=? WHERE u.Clinicid =? `
	_, err.Msg = o.Raw(sql, chainid, clinicid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	sql = ` UPDATE db_koala.t_usergroup g Set g.ChainID=? ,lastoperator='WEB' WHERE g.ClinicUniqueID =? `
	_, err.Msg = o.Raw(sql, chainid, clinicid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	sql = ` UPDATE db_koala.t_doctor d Set d.ChainID=?,lastoperator='WEB' WHERE d.ClinicUniqueID =? `
	_, err.Msg = o.Raw(sql, chainid, clinicid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	sql = ` UPDATE db_koala.t_department d Set d.ChainID=?,lastoperator='WEB' WHERE d.ClinicUniqueID =? `
	_, err.Msg = o.Raw(sql, chainid, clinicid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql = ` UPDATE db_koala.t_vipcard d Set d.ChainID=?,lastoperator='WEB' WHERE d.ClinicUniqueID =? `
	_, err.Msg = o.Raw(sql, chainid, clinicid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql = ` UPDATE db_koala.t_viplevel d Set d.ChainID=?,lastoperator='WEB' WHERE d.ClinicUniqueID =? `
	_, err.Msg = o.Raw(sql, chainid, clinicid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql = ` UPDATE db_koala.t_vipfeelist d Set d.ChainID=?,lastoperator='WEB' WHERE d.ClinicUniqueID =? `
	_, err.Msg = o.Raw(sql, chainid, clinicid).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	if err.Msg != nil {
		o.Rollback()
		return
	}

	o.Commit()
	result.List.AddItem().Set("chainid").SetString(chainid)
	return
}

//检查诊所数据完整性
func CheckClinicData(clinicid string, dentalid string, chainid string) (newchainid string, err gutils.LError) {
	err.Caption = "CheckClinicData"
	if clinicid == "" {
		err.Errorf(gutils.ParamError, "clinicid不能为空")
		return
	}
	//newid := false
	var js config.LJSON
	o := orm.NewOrm()
	o.Begin()
	sql := `select ChainGUID from t_chainclinic c where c.ClinicID = ? and c.DataStatus <>0 `

	_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&js)

	if js.ItemCount() == 0 {
		//添加 t_chainclinic
		chainid = gutils.CreateSTRGUID()
		//newid = true
		sql = ` INSERT INTO t_chainclinic
		(ChainClinicGUID, ChainGUID, ClinicID, Level, DataStatus, Updatetime)
		VALUES (?, ?, ?, 0, 1, NOW()) `
		uid := gutils.CreateSTRGUID()
		_, err.Msg = o.Raw(sql, uid, chainid, clinicid).Exec()
		if err.Msg != nil {
			logs.Error(err.Msg)
			o.Rollback()
			return
		}
	} else {
		chainguid := js.Item(0).Get("ChainGUID").String()
		if chainid != chainguid || chainid == "" {
			chainid = chainguid
			//newid = true
		}
	}

	sql = `select ChainGUID from t_chain c where c.ChainGUID = ? and c.DataStatus<>0 `
	var js1 config.LJSON
	_, err.Msg = o.Raw(sql, chainid).ValuesJSON(&js1)
	if js1.ItemCount() == 0 {
		sql = ` INSERT INTO t_chain
		(ChainGUID, ChainName, clinicid, kuserid, Mobile, Contact, DataStatus, Updatetime, CreateID)
		VALUES (?, ?, ?, ?, '', '', 2, NOW(), ?) `
		_, err.Msg = o.Raw(sql, chainid, chainid, clinicid, "", "").Exec()
		if err.Msg != nil {
			logs.Error(err.Msg)
			o.Rollback()
			return
		}
	}
	var param config.LJSON
	o.Commit()
	param.Set("dentalid").SetString(dentalid)
	UpdateClinicInfo(param)
	return chainid, err
}
