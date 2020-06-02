//author:  龙智鹏 2019-1-17
//purpose： 义齿主业务
package dxaccountmodels


import (
	"doggy/gutils"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
	"fmt"
	"time"
)


//获取诊所列表
func GetClinicList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetClinicList"
	o := orm.NewOrm()
	sql:=`select u.dentalid, a.name,a.clinicid from  t_clinic a left join t_user u 
			on a.clinicid=u.UserID  where a.Mobile=:Mobile  group by  a.clinicid `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
   
	return

}

//获取今日患者根据医生ID
func GetTodayPatList(param config.LJSON) (result gutils.LResultModel,err gutils.LError) {
	err.Caption ="GetTodayPatList"
	clinicid:=param.Get("clinicid").String()
	// userid:=param.Get("userid").String()
	if clinicid==""{
		err.Errorf(gutils.ParamError, "clinicid不能为空")
		return
	}


	sDate := time.Now().Format("2006-01-02")
	eDate := time.Now().AddDate(0, 0, 1).Format("2006-01-02")
	param.Set("begintime").SetString(sDate)
	param.Set("endtime").SetString(eDate)
	pageno := param.Get("pageno").Int()
	pagesize := param.Get("pagesize").Int()
	if pageno == 0 {
		pageno = 1
	}
	if pagesize == 0 {
		pagesize = 10
	}

	size := (pageno - 1) * pagesize
	where :=""
	limit := fmt.Sprintf(" limit %d,%d ", size, pagesize)
	patientlist := param.Get("patientlist").String()
	if patientlist != "" {
		where += " AND (cus.name like '%" + patientlist + "%' or cus.pinyin like '%" + patientlist + "%' or cus.phone like '%" + patientlist + "%')  "
	}

	o:=orm.NewOrm()
	o.Using("db_koala")
	
	sql:=` select cus.clinicuniqueid,cus.CustomerID,cus.Name,cus.sex,if(cus.birthday,TIMESTAMPDIFF(YEAR,cus.birthday,CURDATE()),'') as age ,
		   cus.birthday,cus.phone,PatientID  from t_customer cus 
		   left join  t_study st  on st.ClinicUniqueID=cus.ClinicUniqueID and st.CustomerID=cus.CustomerID 
		   where cus.clinicuniqueid=:clinicid and examdate>=:begintime and examdate<:endtime 
		     `+where+ " group by   cus.CustomerID order by examdate desc  "+limit  	  // and examdate>=:begintime and examdate<:endtime 
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	result.PageNo = int64(pageno)
	result.PageSize = int64(pagesize)
	sqlc:=` select cus.Name,cus.sex,if(cus.birthday,TIMESTAMPDIFF(YEAR,cus.birthday,CURDATE()),'') as age ,
			cus.birthday,cus.phone,PatientID  from t_customer cus 
			left join  t_study st  on st.ClinicUniqueID=cus.ClinicUniqueID and st.CustomerID=cus.CustomerID 
			where cus.clinicuniqueid=:clinicid   and examdate>=:begintime and examdate<:endtime `+where  //and examdate>=:begintime and examdate<:endtime
	var Ctot config.LJSON
	_, err.Msg = o.RawJSON(sqlc, param).ValuesJSON(&Ctot)
	result.TotalCount = int64(Ctot.ItemCount())
	return
}


//根据管家号 用户名 密码 绑定诊所
func BindClinicByDentalID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "BindClinicByDentalID"
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


	//查询对应诊所
	sql := " SELECT  c.* FROM db_flybear.t_user u left join  db_flybear.t_clinic c on c.ClinicID=u.UserID WHERE u.DentalID =? AND RoleID=2 "
	var clinicjs config.LJSON

	o := orm.NewOrm()
	o.Using("db_koala")
	_, err.Msg = o.Raw(sql, dentalid).ValuesJSON(&clinicjs)

	if clinicjs.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "未找到管家号对应诊所")
		return result, err
	}
	clinicid := clinicjs.Item(0).Get("ClinicID").String()
	cname:= clinicjs.Item(0).Get("name").String() //诊所名称
	param.Set("clinicid").SetString(clinicid)
	sql = " SELECT ClinicUniqueID,UserID,Password FROM t_doctor d WHERE d.ClinicUniqueID =:clinicid AND d.Name = :doctorname AND d.DataStatus = 1    AND d.Stopped = 0 "
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
	result.List.Set("ClinicName").SetString(cname)
	result.List.Set("ClinicID").SetString(clinicid)
	return result, err
}

//修改医生基本信息
func UpdateDocBaseInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UpdateDocBaseInfo"
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	Sex := param.Get("Sex").String()  
	Name := param.Get("Name").String() 
	Age:=param.Get("Age").Int()*-1     
	DoctorID := param.Get("DoctorID").String()
	Birthday:=gutils.YearsAdd(time.Now(), Age)
	if DoctorID=="" {
		err.Errorf(gutils.ParamError, "DoctorID不能为空")
		return result, err
	}
	o := orm.NewOrm()
	sql := ` update  t_doctor set Birthday=?, Name=? ,Sex=?,Updatetime=? where DoctorID=? `
	_, err.Msg = o.Raw(sql, Birthday, Name, Sex, Updatetime, DoctorID ).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	return
}

//获取医生基本信息
func GetDocBaseInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption="GetDocBaseInfo"
	DoctorID := param.Get("DoctorID").String()
	if DoctorID=="" {
		err.Errorf(gutils.ParamError, "DoctorID不能为空")
		return result, err
	}
	o := orm.NewOrm()
	sql:=` select d.DoctorID,d.Name,d.Sex,u.Mobile,
		   if(d.birthday,TIMESTAMPDIFF(YEAR,d.birthday,CURDATE()),'') as age from t_doctor
		   d left join t_user u on u.UserID=d.DoctorID and u.RoleID=3
	       where d.DoctorID=? limit 1  `
	_, err.Msg = o.Raw(sql, DoctorID).ValuesJSON(&result.List)
    
	return
} 

//判断是不是在公测里面
func GetBetaClinicID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetBetaClinicID"
	o := orm.NewOrm()
	DxUserGUID :=param.Get("DxUserGUID").String()
	sql := `select 1 from t_version_dx v where  DxUserGUID=? and  v.VersionType in ('alpha-dx','beta-dx') `
	_, err.Msg = o.Raw(sql, DxUserGUID).ValuesJSON(&result.List)
	return
}

// 获取升级包
func GetInstallPack(isbeta int) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetInstallPack"
	verstr := "release-dx"
	if isbeta == 1 {
		verstr = "beta-dx"
	}
	sql := ` select urlinstall from db_image.t_versioninfo v where v.VersionType = ? `
	o := orm.NewOrm()
	o.Using("db_flybear")
	_, err.Msg = o.Raw(sql,verstr).ValuesJSON(&result.List)
	return
}
	
	