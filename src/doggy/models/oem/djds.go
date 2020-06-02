package oem

import (
	"doggy/gutils"
	"regexp"
	"strings"

	"strconv"
	"time"

	//"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

func ClinicSignNum() string {
	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select djdnum as num from t_clinic_apply_simulate limit ? `
	o.Raw(sql, 1).ValuesJSON(&obj)

	num := obj.Item(0).Get("num").Int()
	num = num + 20

	str := strconv.Itoa(num)
	return str
}

func GetCode(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetCode"
	dentalid := param.Get("dentalid").String()
	mobile := param.Get("mobile").String()

	if dentalid == "" || mobile == "" {
		err.Errorf(gutils.ParamError, "管家号和手机号不能为空")
		return
	}

	o := orm.NewOrm()
	var obj config.LJSON
	_, err.Msg = o.Raw(" select c.bindmobile from t_user u inner join t_clinic c on u.userid=c.clinicid where u.dentalid=?", dentalid).ValuesJSON(&obj)
	bindmobile := obj.Item(0).Get("bindmobile").String()
	if bindmobile != mobile {
		err.Errorf(gutils.ParamError, "诊所绑定手机号填写错误")
		return
	}

	//发送验证码
	res := false
	res, err.Msg = regexp.Match("^((1[3|4|5|6|7|8|9][0-9]{9})|(15[89][0-9]{8}))$", []byte(mobile))
	if err.Msg != nil {
		return
	}

	if res == false {
		err.Errorf(gutils.ParamError, "手机号无效")
		return
	}

	//发送验证码
	var data config.LJSON
	data.Set("funcid").SetInt(20100)
	data.Set("mobile").SetString(mobile)
	data.Set("funcidverify").SetInt(gutils.FUNC_ID_VERIFY_DJD_LOGIN)
	api := gutils.FlybearCPlus(data)
	code := api.Get("code").Int()
	if code == 0 {
		err.Errorf(gutils.ParamError, "验证码发送失败")
		return
	}
	return
}

func GetApplyInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetApplyInfo"
	dentalid := param.Get("dentalid").String()
	if dentalid == "" {
		err.Errorf(gutils.ParamError, "管家号不能为空")
		return
	}

	o := orm.NewOrm()
	sql := ` select * from t_djd_apply_info where dentalid=:dentalid and datastatus=1 `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	return result, err
}

func SignUp(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SignUp"

	code := param.Get("code").String()
	dentalid := param.Get("dentalid").String()
	mobile := param.Get("mobile").String()

	o := orm.NewOrm()

	sql := "SELECT Code,Updatetime,mobile FROM t_sys_code WHERE UserID=? AND FuncID=? AND Code=?"
	var obj1 config.LJSON
	num, _ := o.Raw(sql, mobile, gutils.FUNC_ID_VERIFY_DJD_LOGIN, code).ValuesJSON(&obj1)
	if num <= 0 {
		err.Errorf(gutils.ParamError, "验证码错误")
		return
	}
	sendtime := obj1.Item(0).Get("Updatetime").Time().Unix()
	now := time.Now().Unix() - 3600
	if now > sendtime {
		err.Errorf(gutils.ParamError, "验证码过期")
		return
	}

	var obj config.LJSON
	sql = ` select c.bindmobile from t_user u inner join t_clinic c on u.userid=c.clinicid where u.dentalid=?`
	_, err.Msg = o.Raw(sql, dentalid).ValuesJSON(&obj)

	if mobile != obj.Item(0).Get("bindmobile").String() {
		err.Errorf(gutils.ParamError, "手机号和绑定手机号不一致")
		return
	}
	return result, err
}

//获取当前管家号的申请状态
func RedirectUrl(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "RedirectUrl"
	o := orm.NewOrm()
	sql := ` select checkstatus from t_djd_apply_info where dentalid=:dentalid and datastatus=1 `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	return result, err
}

func GetData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetData"
	o := orm.NewOrm()
	sql := ` select infoid,
	dentalid,
	clinicid,
	clinicname,
	clinicmobile,
	applyerrole,
	applyername,
	applyermobile,
	cliniccreatetime,
	idnumber,
	idcardfrontpic,
	idcardreversepic,
	licenseid,
	licensepic,
	remark
	from t_djd_apply_info where dentalid=:dentalid and datastatus=1 `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 {
		sql = ` select '' as infoid,
			u.dentalid,
			c.clinicid,
			c.name as clinicname,
			c.createtime as cliniccreatetime,
			c.bindmobile as clinicmobile,
			'' as applyerrole,
			'' as applyername,
			'' as applyermobile,
			'' as idnumber,
			'' as idcardfrontpic,
			'' as idcardreversepic,
			'' as licenseid,
			'' as licensepic,
			'' as remark from t_user u inner join t_clinic c on u.userid=c.clinicid where u.dentalid=:dentalid `
		_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	}
	return result, err
}

func CommitApply(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CommitApply"
	o := orm.NewOrm()
	infoid := param.Get("infoid").String()
	dentalid := param.Get("dentalid").String()
	if dentalid == "" {
		err.Errorf(gutils.ParamError, "管家号不能为空")
		return
	}
	sql := ""
	updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("updatetime").SetString(updatetime)
	if infoid == "" { //无记录新增
		var obj config.LJSON
		sql = ` select datastatus from t_djd_apply_info where dentalid=? and datastatus=1 `
		_, err.Msg = o.Raw(sql, dentalid).ValuesJSON(&obj)
		if obj.ItemCount() == 0 {
			param.Set("infoid").SetString(gutils.CreateSTRGUID())
			param.Set("createtime").SetString(updatetime)
			clinicid := param.Get("clinicid").String()
			sql = ` select createtime,bindmobile as clinicmobile from db_flybear.t_clinic where clinicid=? `
			var clinic config.LJSON
			_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&clinic)
			param.Set("cliniccreatetime").SetString(clinic.Item(0).Get("createtime").String())
			if param.Get("clinicmobile").IsNULL() {
				param.Set("clinicmobile").SetString(clinic.Item(0).Get("clinicmobile").String())
			}
			sql = ` insert into t_djd_apply_info (infoid,dentalid,clinicid,clinicname,clinicmobile,cliniccreatetime,applyerrole,applyername,applyermobile,idnumber,idcardfrontpic,idcardreversepic,licenseid,licensepic,checkstatus,datastatus,createtime,updatetime)
			values (:infoid,:dentalid,:clinicid,:clinicname,:clinicmobile,:cliniccreatetime,:applyerrole,:applyername,:applyermobile,:idnumber,:idcardfrontpic,:idcardreversepic,:licenseid,:licensepic,0,1,:createtime,:updatetime)  
			`
			_, err.Msg = o.RawJSON(sql, param).Exec()
		} else {
			err.Errorf(gutils.ParamError, "管家号已申请")
			return
		}
	} else { //有记录修改
		var obj config.LJSON
		sql = ` select checkstatus from t_djd_apply_info where infoid=? and datastatus=1 `
		_, err.Msg = o.Raw(sql, infoid).ValuesJSON(&obj)
		if obj.ItemCount() == 0 {
			err.Errorf(gutils.ParamError, "申请记录不存在")
			return
		} else {
			checkstatus := obj.Item(0).Get("checkstatus").Int()
			if checkstatus == 3 { //人工审核失败,才能修改
				sql = ` update t_djd_apply_info set clinicmobile=:clinicmobile,clinicname=:clinicname,applyerrole=:applyerrole,applyername=:applyername,applyermobile=:applyermobile,idnumber=:idnumber,
				idcardfrontpic=:idcardfrontpic,idcardreversepic=:idcardreversepic,licenseid=:licenseid,licensepic=:licensepic,checkstatus=0,updatetime=:updatetime where infoid=:infoid `
				_, err.Msg = o.RawJSON(sql, param).Exec()
			} else {
				err.Errorf(gutils.ParamError, "申请信息已锁定,无法修改")
				return
			}
		}
	}

	var obj config.LJSON
	sql = ` select * from t_website_reservation where dentalid=:dentalid and reservationdemotype='百度分期' `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {

		var res config.LJSON

		sql = ` select c.name,c.clinicid,u.version,c.contact from t_user u inner join t_clinic c on u.userid=c.clinicid where u.dentalid=? `
		_, err.Msg = o.Raw(sql, dentalid).ValuesJSON(&obj)
		clinicname := obj.Item(0).Get("name").String()
		clinicid := obj.Item(0).Get("clinicid").String()
		version := obj.Item(0).Get("version").String()
		contact := obj.Item(0).Get("contact").String()

		if strings.Contains(version, "900") == true {
			res.Set("softwaretype").SetString("1")
		} else {
			res.Set("softwaretype").SetString("0")
		}
		res.Set("reservationperson").SetString(contact)
		res.Set("reservationid").SetString(gutils.CreateSTRGUID())
		res.Set("reservationtime").SetString(time.Now().Format("2006-01-02 15:04:05"))
		res.Set("reservationtel").SetString(param.Get("applyermobile").String())
		res.Set("reservationclinicname").SetString(clinicname)
		res.Set("reservationdemotype").SetString("百度分期")
		res.Set("reservationfromtype").SetString("PC")
		res.Set("dentalid").SetString(dentalid)
		res.Set("clinicid").SetString(clinicid)
		res.Set("currentversion").SetString(version)
		res.Set("usertype").SetString("0")

		sql = ` insert into t_website_reservation (reservationid,reservationtime,reservationtel,reservationclinicname,reservationdemotype,reservationfromtype,dentalid,clinicid,currentversion,usertype,softwaretype)
			values (:reservationid,:reservationtime,:reservationtel,:reservationclinicname,:reservationdemotype,:reservationfromtype,:dentalid,:clinicid,:currentversion,:usertype,:softwaretype) `
		_, err.Msg = o.RawJSON(sql, res).Exec()
	}

	return result, err
}
