//author:  龙智鹏 2019-1-8
//purpose： 义齿注册请求

package dxaccountmodels

import (
	"fmt"
	"strconv"
	"strings"
	"time"
	"regexp"
	"doggy/gutils"
	"doggy/gutils/gredis"
	"doggy/models/model"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)



//SendCode 发送验证码
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

	sql := ` select userid from t_user where mobile=? and roleid=3 `
	var obj config.LJSON
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "账号不存在")
		return
	}

	//发送验证码
	var data config.LJSON
	data.Set("funcid").SetInt(20100)
	data.Set("mobile").SetString(mobile)
	data.Set("funcidverify").SetInt(gutils.FUNC_ID_LEARN_LOGIN) //随便用个
	api := gutils.FlybearCPlus(data)
	code := api.Get("code").Int()
	if code == 0 {
		err.Errorf(gutils.ParamError, "验证码发送失败")
		return
	}

	return result, err
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
	source := 7
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

//发送验证码
func SendMobileCode(mobile string, funcidverify int, funcid int) bool {
	var param config.LJSON
	param.Set("funcid").SetInt(funcid) //注册验证码
	param.Set("mobile").SetString(mobile)
	param.Set("funcidverify").SetInt(funcidverify)
	apis:=gutils.FlybearCPlus(param)
	code :=apis.Get("code").Int()
	if code == 0{
		return false
	}
	return true
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

	sql3 := ` UPDATE db_koala.t_doctor SET PASSWORD =?,LastOperator='DX', Signature=? WHERE clinicuniqueid=? AND DoctorID=? `
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
