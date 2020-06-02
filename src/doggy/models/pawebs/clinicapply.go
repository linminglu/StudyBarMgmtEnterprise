// author: 于绍纳 2017-03-16
// purpose: 平安诊所加盟
package pawebs

import (
	"doggy/gutils"

	"strconv"
	"time"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

//获取用户绑定管家号
func GetClinicApplyInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetClinicApplyInfo"
	o := orm.NewOrm()
	//读取用户未提交申请的诊所列表
	sql := `
		select u.dentalid,c.name as clinicname from t_user_data ud 
		inner join t_user u on ud.clinicid=u.userid 
		inner join t_clinic c on ud.clinicid=c.clinicid
		left join t_clinic_apply_info s on u.DentalID=s.DentalID 
		where ud.userid=:userid  and ud.Role=3 and ud.clinicid<>'1' 
		and (s.CheckStatus is null or s.CheckStatus=0) `
	var dentals config.LJSON
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&dentals)

	result.List.Set("dentals").SetObject(dentals)
	//获取用户保存的资料
	var info config.LJSON
	sql = ` select * from t_clinic_apply_info where userid=:userid `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&info)
	result.List.Set("info").SetObject(info)
	return
}

/*
	用户进入申请资料填写界面,说明肯定没有提交过数据;有提交数据会提前跳转到<<个人中心>>界面
*/

//保存申请资料
func SaveApply(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SaveApply"
	userid := param.Get("userid").String()
	if userid == "" {
		err.Errorf(gutils.ParamError, "userid不能为空")
		return
	}
	dentalid := param.Get("dentalid").String()
	if dentalid == "" {
		err.Errorf(gutils.ParamError, "管家号不能为空")
		return
	}
	o := orm.NewOrm()

	var user config.LJSON
	sql := ` select userid from t_user where dentalid=? `
	_, err.Msg = o.Raw(sql, dentalid).ValuesJSON(&user)
	clinicid := user.Item(0).Get("userid").String()

	err.Msg = o.Begin()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql = ` select datastatus,checkstatus from t_clinic_apply_info where userid=? `
	var obj config.LJSON
	_, err.Msg = o.Raw(sql, userid).ValuesJSON(&obj)
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("updatetime").SetString(Updatetime)
	param.Set("createtime").SetString(Updatetime)
	param.Set("clinicid").SetString(clinicid)
	if param.Get("latitude").IsNULL() {
		param.Set("latitude").SetDouble(0)
	}
	if param.Get("longitude").IsNULL() {
		param.Set("longitude").SetDouble(0)
	}
	if obj.ItemCount() == 0 { //插入
		sql = `
			insert into t_clinic_apply_info (infoid,userid,clinicid,dentalid,clinicname,institutionname,
			province,city,area,address,mobile,licenseid,legalpersonpic,
			medicallicenoriginal,medicallicenduplicate,medicallicencheck,physicianpracticecert,chairnum,licenseproperty,
			highesttitle,physiciannum,scheduleprocess,monthpatientnum,businessmonth,clinicarea,chainnum,physicianhonorcert,
			clinichonorcert,physicianduty,checkstatus,datastatus,updatetime,createtime,latitude,longitude) values 
			(
				:infoid,:userid,:clinicid,:dentalid,:clinicname,:institutionname,
			:province,:city,:area,:address,:mobile,:licenseid,:legalpersonpic,
			:medicallicenoriginal,:medicallicenduplicate,:medicallicencheck,:physicianpracticecert,:chairnum,:licenseproperty,
			:highesttitle,:physiciannum,:scheduleprocess,:monthpatientnum,:businessmonth,:clinicarea,:chainnum,:physicianhonorcert,
			:clinichonorcert,:physicianduty,:checkstatus,:datastatus,:updatetime,:createtime,:latitude,:longitude
			)
		`
		param.Set("infoid").SetString(strconv.FormatInt(gutils.CreateGUID(), 10))
		param.Set("datastatus").SetInt(1)
		param.Set("checkstatus").SetInt(0) //临时保存

	} else { //更新

		checkstatus := obj.Item(0).Get("checkstatus").Int()
		if checkstatus != 0 {
			err.Errorf(gutils.ParamError, "该账号已有待审核数据,无法保存")
			o.Rollback()
			return
		}
		sql = ` update t_clinic_apply_info set clinicid=:clinicid,dentalid=:dentalid,clinicname=:clinicname,institutionname=:institutionname,
		province=:province,city=:city,area=:area,address=:address,mobile=:mobile,licenseid=:licenseid,legalpersonpic=:legalpersonpic,
		medicallicenoriginal=:medicallicenoriginal,medicallicenduplicate=:medicallicenduplicate,medicallicencheck=:medicallicencheck,
		physicianpracticecert=:physicianpracticecert,chairnum=:chairnum,licenseproperty=:licenseproperty,highesttitle=:highesttitle,
		physiciannum=:physiciannum,scheduleprocess=:scheduleprocess,monthpatientnum=:monthpatientnum,businessmonth=:businessmonth,
		clinicarea=:clinicarea,chainnum=:chainnum,physicianhonorcert=:physicianhonorcert,clinichonorcert=:clinichonorcert,
		physicianduty=:physicianduty,updatetime=:updatetime,longitude=:longitude,latitude=:latitude where userid=:userid `

	}
	_, err.Msg = o.RawJSON(sql, param).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
	}
	return
}

//提交申请资料
/*
	一个手机号只能有一个审核记录或者一个保存记录
	一个诊所也只能有一个审核记录或者多个保存记录
*/
func CommitApply(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CommitApply"
	dentalid := param.Get("dentalid").String()
	userid := param.Get("userid").String()
	if dentalid == "" || userid == "" {
		err.Errorf(gutils.ParamError, "用户ID或管家号不能为空!")
		return
	}

	o := orm.NewOrm()
	sql := ` select * from t_clinic_apply_info where (userid=? or dentalid=?) and checkstatus<>'0' `
	var info config.LJSON
	_, err.Msg = o.Raw(sql, userid, dentalid).ValuesJSON(&info)
	if info.ItemCount() != 0 { //说明用户或者管家号暂无审核记录
		err.Errorf(gutils.ParamError, "诊所或用户已有在审数据...")
		return
	}

	sql = ` select userid from t_user where dentalid=? `
	var user config.LJSON
	_, err.Msg = o.Raw(sql, dentalid).ValuesJSON(&user)

	clinicid := user.Item(0).Get("userid").String()
	if clinicid == "" {
		err.Errorf(gutils.ParamError, "管家号不存在")
		return
	}
	err.Msg = o.Begin()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql = ` select * from t_clinic_apply_info where userid=? `
	var obj config.LJSON
	_, err.Msg = o.Raw(sql, userid).ValuesJSON(&obj)
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("updatetime").SetString(Updatetime)
	param.Set("checkstatus").SetInt(1) //提交审核
	param.Set("createtime").SetString(Updatetime)
	param.Set("clinicid").SetString(clinicid)
	if param.Get("latitude").IsNULL() {
		param.Set("latitude").SetDouble(0)
	}
	if param.Get("longitude").IsNULL() {
		param.Set("longitude").SetDouble(0)
	}
	if obj.ItemCount() == 0 { //插入
		sql = `
			insert into t_clinic_apply_info (infoid,userid,clinicid,dentalid,clinicname,institutionname,
			province,city,area,address,mobile,licenseid,legalpersonpic,
			medicallicenoriginal,medicallicenduplicate,medicallicencheck,physicianpracticecert,chairnum,licenseproperty,
			highesttitle,physiciannum,scheduleprocess,monthpatientnum,businessmonth,clinicarea,chainnum,physicianhonorcert,
			clinichonorcert,physicianduty,checkstatus,datastatus,updatetime,createtime,latitude,longitude) values 
			(
				:infoid,:userid,:clinicid,:dentalid,:clinicname,:institutionname,
			:province,:city,:area,:address,:mobile,:licenseid,:legalpersonpic,
			:medicallicenoriginal,:medicallicenduplicate,:medicallicencheck,:physicianpracticecert,:chairnum,:licenseproperty,
			:highesttitle,:physiciannum,:scheduleprocess,:monthpatientnum,:businessmonth,:clinicarea,:chainnum,:physicianhonorcert,
			:clinichonorcert,:physicianduty,:checkstatus,:datastatus,:updatetime,:createtime,:latitude,:longitude
			)
		`
		param.Set("infoid").SetString(strconv.FormatInt(gutils.CreateGUID(), 10))
		param.Set("datastatus").SetInt(1)

	} else { //更新
		sql = ` update t_clinic_apply_info set clinicid=:clinicid,dentalid=:dentalid,clinicname=:clinicname,institutionname=:institutionname,
		province=:province,city=:city,area=:area,address=:address,mobile=:mobile,licenseid=:licenseid,legalpersonpic=:legalpersonpic,
		medicallicenoriginal=:medicallicenoriginal,medicallicenduplicate=:medicallicenduplicate,medicallicencheck=:medicallicencheck,
		physicianpracticecert=:physicianpracticecert,chairnum=:chairnum,licenseproperty=:licenseproperty,highesttitle=:highesttitle,
		physiciannum=:physiciannum,scheduleprocess=:scheduleprocess,monthpatientnum=:monthpatientnum,businessmonth=:businessmonth,
		clinicarea=:clinicarea,chainnum=:chainnum,physicianhonorcert=:physicianhonorcert,clinichonorcert=:clinichonorcert,
		physicianduty=:physicianduty,updatetime=:updatetime,checkstatus=:checkstatus,latitude=:latitude,longitude=:longitude where userid=:userid `

	}
	_, err.Msg = o.RawJSON(sql, param).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	//记录用户审核进度表

	sql = ` insert into t_clinic_apply_progress (progressid,userid,progressdate,progressstatus,remarktype,datastatus,updatetime)
		values (:progressid,:userid,:progressdate,:progressstatus,:remarktype,1,:updatetime) `
	var pro config.LJSON
	pro.Set("progressid").SetString(strconv.FormatInt(gutils.CreateGUID(), 10))
	pro.Set("userid").SetString(userid)
	pro.Set("progressdate").SetString(Updatetime)
	pro.Set("progressstatus").SetString("提交审核")
	pro.Set("remarktype").SetInt(1)
	pro.Set("updatetime").SetString(Updatetime)
	_, err.Msg = o.RawJSON(sql, pro).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
	}
	return
}

//判断用户是否临时保存
func CheckTempSave(param config.LJSON) int {
	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select checkstatus from t_clinic_apply_info where userid=:userid `
	o.RawJSON(sql, param).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		return 1
	} else {
		checkstatus := obj.Item(0).Get("checkstatus").Int()
		if checkstatus == 0 {
			return 1
		}
	}
	return 0
}
