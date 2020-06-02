//author:  易祖平 2017-03-09
//purpose： 后台产品管理模块
package models

import (
	"doggy/gutils"
	"time"

	"strconv"

	//	"doggy/gutils/gredis"
	"fmt"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

func GetClinicData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetClinicData"

	dentalid := param.Get("dentalid").String()
	if dentalid == "" {
		err.Errorf(gutils.ParamError, "管家号不能为空")
		return
	}

	o := orm.NewOrm()

	sql := ` select u.dentalid,
		c.clinicid,
		c.entecode,
		c.bindmobile,
		c.name as clinicname,
		c.createtime,
		c.contact,
		c.phone as clinicphone,
		c.address,
		c.clinicprovince,
		c.cliniccity,
		c.clinicarea,
		d.*
		from db_flybear.t_user u inner join db_flybear.t_clinic c on u.userid=c.clinicid left join db_flybear.t_clinic_detail d on c.clinicid=d.clinicid 
		where u.dentalid=:dentalid `
	var obj config.LJSON
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&obj)
	//诊所基本信息
	result.List.Set("info").SetObject(obj)

	//已办理业务
	var res config.LJSON
	clinicid := obj.Item(0).Get("clinicid").String()
	entecode := obj.Item(0).Get("entecode").String()
	//金服侠
	if entecode == "" {
		res.Set("isjfx").SetInt(0)
	} else {
		res.Set("isjfx").SetInt(1)
	}
	//度金贷
	sql = ` select datastatus from db_flybear.t_djd_apply_info where clinicid=? and checkstatus=1 and datastatus=1 limit 1`
	_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&obj)
	res.Set("isdjd").SetInt(obj.Item(0).Get("datastatus").Int())
	//平安
	sql = ` select datastatus from db_flybear.t_clinic_apply_info where clinicid=? and datastatus=1 and checkstatus=5 limit 1 `
	_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&obj)
	res.Set("ispa").SetInt(obj.Item(0).Get("datastatus").Int())
	//医保
	sql = ` select sum(1) as count from db_koala.t_yb_cardinfo where ClinicUniqueID=? and datastatus=1 limit 1 `
	_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&obj)
	res.Set("isyb").SetInt(obj.Item(0).Get("count").Int())
	//微信支付
	sql = ` select datastatus from db_flybear.t_weixin_clinic_token where clinicid=? and datastatus=1 limit 1`
	_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&obj)
	res.Set("iswxpay").SetInt(obj.Item(0).Get("datastatus").Int())
	//支付宝支付
	sql = ` select datastatus from db_flybear.t_ali_auth_token_clinic where clinicid=? and datastatus=1 limit 1`
	_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&obj)
	res.Set("isailpay").SetInt(obj.Item(0).Get("datastatus").Int())

	return result, err
}

func ModClinicData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ModClinicData"

	param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	param.Set("datastatus").SetInt(1)
	keys := `InstitutionName,LicenseID,LegalPersonPic,LicenseEffect,LicenseExpiry,IsLicensePermanent,
	ClinicPrincipal,PrincipalQQ,PrincipalWechat,PrincipalPhone,PrincipalIDNum,PrincipalSex,PrincipalPositon,PrincipalFront,
	PrincipalReverse,ShareholderName,ShareholderPhone,ShareholderIDNum,ShareholderFront,ShareholderReverse,MedicalLicenOriginal
	,MedicalLicenDuplicate,MedicalLicenCheck,PhysicianPracticeCert,RisDiagnosisLicense,ChairNum,LicenseProperty,HighestTitle,PhysicianNum
	,ScheduleProcess,MonthPatientNum,BusinessMonth,ClinicArea,ChainNum,EntrancePhoto,ReceptionPhotos,ClinicRoomPhoto,MedicalTemplate,ThePriceList
	,PriceTemplate,PhysicianHonorCert,PhysicianHonorCertLevel,ClinicHonorCert,ClinicHonorCertLevel,PhysicianDuty,PhysicianDutyLevel,EmployeeNum,
	ClinicComputers,UsedSoftware,ClinicNetWork,ClinicDeviceBrand,ClinicPracticeDocter,ClinicAssistantDocter,ClinicNurse,ClinicFront,MedicarePlatform,
	ClinicIsMain,LargeProjects,OnlinePurchase,DentureMaker,SuppliesPartners,ClinicContacts,ClinicDecoration,Concerns,HealthPermit,RadiologyRoomPhoto`
	o := orm.NewOrm()
	o.Begin()
	sql := " select datastatus from db_flybear.t_clinic_detail where clinicid=:clinicid "
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 {
		//插入
		insertSql := gutils.InsertSql(&param, keys+",clinicid,updatetime,datastatus")
		if insertSql != "" {
			insertSql = " insert into db_flybear.t_clinic_detail " + insertSql
			_, err.Msg = o.RawJSON(insertSql, param).Exec()
		}
	} else {
		//更新
		updateSql := gutils.UpdateSql(&param, keys)
		if updateSql != "" {
			updateSql = " update db_flybear.t_clinic_detail set " + updateSql + ",updatetime=:updatetime,datastatus=:datastatus where clinicid=:clinicid "
			_, err.Msg = o.RawJSON(updateSql, param).Exec()
		}
	}
	if err.Msg != nil {
		o.Rollback()
		return
	}
	o.Commit()

	sql = " update db_flybear.t_clinic_detail set clinicprovince=:clinicprovince,cliniccity=:cliniccity,clinicarea=:clinicarea,address=:address where clinicid=:clinicid "
	_, err.Msg = o.RawJSON(sql, param).Exec()
	return result, err
}

func GetAdminInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetAdminInfo"
	o := orm.NewOrm()
	sql := ` select u.userid as userid,u.username as username,u.nickname as nickname,u.mobile as mobile,r.RoleID as roleid,r.ActionGUIDS as actionguids from t_ditui_user as u left join t_ditui_role_property as r on r.RoleID=u.usertype where datastatus=1 and username='admin' `
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	return result, err
}

//诊所信息
func ClinicInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ClinicInfo"
	o := orm.NewOrm()
	sql := ` select max(c.checkstatus) as checkstatus,c.* from t_clinic_apply_info c  where c.dentalid=:dentalid   `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	return result, err
}

//消费明细
func ConsumeData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ConsumeData"

	begintime := param.Get("begintime").String() //核销时间
	endtime := param.Get("endtime").String()
	condition := param.Get("condition").String() //平安编号或验证码
	status := param.Get("status").String()       //核销状态 0表示待处理 1表示验证ok, 100表示菲森内部错误  1000表示平安错误
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("perpage").Int64()      //每页数量
	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}
	o := orm.NewOrm()
	sql1 := `select * from t_package_code where 1=1 `
	if begintime != "" {
		begintime += " 00:00:00"
		sql1 = fmt.Sprintf("%s and updatetime>='%s'", sql1, begintime)
	}
	if endtime != "" {
		endtime += " 23:59:59"
		sql1 = fmt.Sprintf("%s and updatetime<='%s'", sql1, endtime)
	}
	if status != "" {
		val, _ := strconv.Atoi(status)
		if val == 0 || val == 1 {
			sql1 = fmt.Sprintf("%s and status='%s'", sql1, status)
		} else {
			sql1 = fmt.Sprintf("%s and status<>0 and status <>1 ", sql1)
		}

	}
	if condition != "" {
		sql1 = fmt.Sprintf("%s and (serveid like '%%%s%%' or code like '%%%s%%' ) ", sql1, condition, condition)
	}
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql1).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}

	sql1 = fmt.Sprintf("%s order by updatetime desc LIMIT %d,%d", sql1, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql1).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

//获取产品包列表
func DoGetProList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {

	err.Caption = "DoGetProList"
	begintime := param.Get("begintime").String()
	endtime := param.Get("endtime").String()
	condition := param.Get("condition").String() //产品名称和编号
	platform := param.Get("platform").String()   //发布平台
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("per_page").Int64()     //每页数量
	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}
	o := orm.NewOrm()
	sql1 := `select PackageInfoID,PackageName,paserialnum,Price,CreateTime,Platform from t_package_info where 1=1 `
	if begintime != "" {
		begintime += " 00:00:00"
		sql1 = fmt.Sprintf("%s and CreateTime>='%s'", sql1, begintime)
	}
	if endtime != "" {
		endtime += " 23:59:59"
		sql1 = fmt.Sprintf("%s and CreateTime<='%s'", sql1, endtime)
	}
	if platform != "" {
		sql1 = fmt.Sprintf("%s and platform='%s'", sql1, platform)
	}
	if condition != "" {
		sql1 = fmt.Sprintf("%s and (paserialnum like '%%%s%%' or PackageInfoID like '%%%s%%' or PackageName like '%%%s%%') ", sql1, condition, condition, condition)
	}
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql1).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}

	sql1 = fmt.Sprintf("%s order by CreateTime desc LIMIT %d,%d", sql1, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql1).ValuesJSON(&result.List)
	for i := 0; i < result.List.ItemCount(); i++ {
		packageinfoid := result.List.Item(i).Get("packageinfoid").String()
		sql2 := `select handlename,displayorder from t_package_handle where  PackageInfoID=? ORDER BY Displayorder ASC`
		var res config.LJSON
		_, err.Msg = o.Raw(sql2, packageinfoid).ValuesJSON(&res)
		result.List.Item(i).Set("handleinfo").SetObject(res)
	}
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

//查看产品包
func DoViewPro(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DoViewPro"
	o := orm.NewOrm()
	sql1 := `select PackageInfoID,PackageName,paserialnum,Price,CreateTime,Platform from t_package_info where PackageInfoID=:PackageInfoID `
	_, err.Msg = o.RawJSON(sql1, param).ValuesJSON(&result.List)

	packageinfoid := param.Get("PackageInfoID").String()
	if packageinfoid != "" {
		//		//查询包分发给了多少诊所
		//		sql1 = ` select count(*) as count from t_package_clinic where packageinfoid=? and datastatus=1 `
		//		var obj config.LJSON
		//		_, err.Msg = o.Raw(sql1, packageinfoid).ValuesJSON(&obj)
		//		result.List.Item(0).Set("signnum").SetInt64(obj.Item(0).Get("count").Int64())
		//		//查询包平安卖了多少份  BillState 要剔除退款的
		//		sql1 = ` select count(*) as count from t_package_bill where PackageInfoID=? and datastatus=1 `
		//		var obj1 config.LJSON
		//		_, err.Msg = o.Raw(sql1, packageinfoid).ValuesJSON(&obj1)
		//		result.List.Item(0).Set("sellnum").SetInt64(obj1.Item(0).Get("count").Int64())

		sql1 = ` select handlename,handleprice,uom,displayorder,namepy from t_package_handle where packageinfoid=? 
				 and datastatus=1 order by displayorder asc  `
		var obj2 config.LJSON
		_, err.Msg = o.Raw(sql1, packageinfoid).ValuesJSON(&obj2)
		result.List.Item(0).Set("handleinfo").SetObject(obj2)
	}
	return
}

//新增产品包
func DoAddNewPro(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	var params config.LJSON
	err.Caption = "DoAddNewPro"
	//t_package_info  insert

	paserialnum := param.Get("PaSerialNum").String()
	if paserialnum == "" {
		err.Errorf(gutils.ParamError, "平安编号不能为空")
		return
	}

	packageinfoid := ""

	if param.Get("PackageInfoID").IsNULL() {
		packageinfoid = gutils.CreateSTRGUID()
		param.Set("PackageInfoID").SetString(packageinfoid)
	} else {
		packageinfoid = param.Get("PackageInfoID").String()
	}

	createtime := time.Now().Format("2006-01-02 15:04:05")
	if param.Get("CreateTime").IsNULL() {
		param.Set("CreateTime").SetString(createtime)
	}
	param.Set("Updatetime").SetString(createtime)

	o := orm.NewOrm()
	var obj config.LJSON

	sql := ` select * from t_package_info where paserialnum=? `
	_, err.Msg = o.Raw(sql, paserialnum).ValuesJSON(&obj)
	if obj.ItemCount() != 0 {
		err.Errorf(gutils.ParamError, "平安编号已被使用")
		return
	}

	err.Msg = o.Begin()

	sql1 := `INSERT INTO t_package_info(PackageInfoID,PackageName,PaSerialNum,CreateTime,
			 Price,Platform,DataStatus,Updatetime)
			 VALUES (:PackageInfoID,:PackageName,:PaSerialNum,:CreateTime,
			 :Price,:Platform,1,:Updatetime)`
	_, err.Msg = o.RawJSON(sql1, param).Exec()
	if err.Msg != nil {
		err.Errorf(gutils.ParamError, err.Msg.Error())
		o.Rollback()
		return
	}
	//t_package_handle  insert
	params.Set("handledata").SetObject(*param.Get("handledata"))
	for i := 0; i < params.Get("handledata").ItemCount(); i++ {
		PackageHandleID := gutils.CreateSTRGUID()
		params.Get("handledata").Item(i).Set("PackageInfoID").SetString(packageinfoid)
		params.Get("handledata").Item(i).Set("PackageHandleID").SetString(PackageHandleID)
		params.Get("handledata").Item(i).Set("Updatetime").SetString(createtime)
		sql2 := `INSERT INTO t_package_handle(PackageHandleID,PackageInfoID,HandleName,Uom,HandlePrice,NamePY,Displayorder,datastatus,Updatetime)
					 VALUES (:PackageHandleID,:PackageInfoID,:HandleName,:Uom,:HandlePrice,:NamePY,:Displayorder,1,:Updatetime) `
		_, err.Msg = o.RawJSON(sql2, *params.Get("handledata").Item(i)).Exec()
		if err.Msg != nil {
			err.Errorf(gutils.ParamError, err.Msg.Error())
			o.Rollback()
			return
		}
	}
	o.Commit()
	return
}

//产品包上架、下架(上下架只是用来校核的时候作为产品包是否售卖的标记)
func ProUpOrDown(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ProUpOrDown"
	packageinfoid := param.Get("PackageInfoID").String()
	if packageinfoid == "" {
		err.Errorf(gutils.ParamError, "产品包ID不能为空")
		return
	}

	flag := param.Get("flag").String()
	if flag == "" {
		err.Errorf(gutils.ParamError, "上下架参数不存在")
		return
	}

	sql := ``
	c, _ := strconv.Atoi(flag)
	switch c {
	case 0: //下架
		{
			sql = ` update t_package_info set ispublish=0,updatetime=? where packageinfoid=? `
			break
		}
	case 1: //上架(一旦上架datastatus始终要为1)
		{
			sql = ` update t_package_info set datastatus=1,ispublish=1,updatetime=? where packageinfoid=? `
			break
		}
	default:
		{
			err.Errorf(gutils.ParamError, "上下架标记错误")
			return
		}

	}
	nowtime := time.Now().Format("2006-01-02 15:04:05")
	o := orm.NewOrm()
	_, err.Msg = o.Raw(sql, nowtime, packageinfoid).Exec()
	return result, err
}

//门诊产品 查询出签约的门诊列表
func GetClinicPro(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetClinicPro"
	begintime := param.Get("begintime").String() //表示合同的有效期是begintime-endtime时间段的诊所
	endtime := param.Get("endtime").String()
	condition := param.Get("condition").String() //产品名称和编号
	//	isstopped := param.Get("IsStopped").String() //在售状态
	page := param.Get("page").Int64()       //页码
	perpage := param.Get("perpage").Int64() //每页数量
	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	//查询签约的门诊列表
	o := orm.NewOrm()
	sql1 := `select s.clinicid,s.SignID,s.StartDate,s.ClinicName,s.DentalID,i.Province,i.City,i.Area,i.Address,i.StarRating
			from t_clinic_apply_sign s inner join t_clinic_apply_info i 
			on s.clinicid=i.clinicid			
			where s.datastatus=1 ` //只查询签约的诊所
	if begintime != "" {
		begintime += " 00:00:00"
		sql1 = fmt.Sprintf("%s and s.StartDate>='%s'", sql1, begintime)
	}
	if endtime != "" {
		endtime += " 23:59:59"
		sql1 = fmt.Sprintf("%s and s.StartDate<='%s'", sql1, endtime)
	}

	//	if isstopped != "" {
	//		sql1 = fmt.Sprintf("%s and s.isstopped='%s'", sql1, isstopped)
	//	}

	if condition != "" {
		sql1 = fmt.Sprintf("%s and (s.DentalID like '%%%s%%' or s.ClinicName like '%%%s%%') ", sql1, condition, condition)
	}

	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql1).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}

	sql1 = fmt.Sprintf("%s LIMIT %d,%d", sql1, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql1).ValuesJSON(&result.List)

	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

//门诊产品  停售和在售
func DoIsStoppedClinic(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DoIsStoppedClinic"
	signid := param.Get("SignID").String()
	if signid == "" {
		err.Errorf(gutils.ParamError, "signID不能为空")
		return
	}

	flag := param.Get("flag").String()
	if flag == "" {
		err.Errorf(gutils.ParamError, "停售/在售未指定")
		return
	}

	sql := " select enddate,datastatus,isstopped from t_clinic_apply_sign where signid=? "
	o := orm.NewOrm()
	var obj config.LJSON
	_, err.Msg = o.Raw(sql, signid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "签约记录不存在")
		return
	}
	datastatus := param.Get("datastatus").Int()
	if datastatus == 0 {
		err.Errorf(gutils.ParamError, "已解约,无法修改停售状态")
		return
	}
	nowtime := time.Now().Format("2006-01-02 15:04:05")
	enddate := param.Get("enddate").String()
	isstopped := param.Get("isstopped").Int()

	c, _ := strconv.Atoi(flag)
	switch c {
	case 0: //停售
		{
			if isstopped == 0 {
				err.Errorf(gutils.ParamError, "产品已停售,无法再停售")
				return
			}
			sql = " update t_clinic_apply_sign set IsStopped=0,updatetime=? where signid=? "
			break
		}
	case 1: //在售
		{
			t1, _ := time.Parse("2006-01-02 15:04:05", nowtime)
			t2, _ := time.Parse("2006-01-02 15:04:05", enddate)

			if t2.Before(t1) { //过期
				if isstopped == 1 { //说明产品
					sql = " update t_clinic_apply_sign set IsStopped=0,updatetime=? where signid=? "
				} else {
					err.Errorf(gutils.ParamError, "产品已过期,无法在售")
					return
				}
			} else {
				if isstopped == 1 {
					err.Errorf(gutils.ParamError, "产品已在售,无法再在售")
					return
				} else {
					sql = " update t_clinic_apply_sign set IsStopped=1,updatetime=? where signid=? "
				}
			}
			break
		}
	default:
		{
			err.Errorf(gutils.ParamError, "销售状态指定错误")
			return
		}
	}

	_, err.Msg = o.Raw(sql, nowtime, signid).Exec()
	return result, err
}

//门诊产品  查看签约诊所的详细信息
func GetClinicProDetail(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetClinicProDetail"
	signid := param.Get("signid").String()
	clinicid := param.Get("clinicid").String()

	o := orm.NewOrm()
	sql := ` select * from t_clinic_apply_sign where signid=? and clinicid=? `
	var obj config.LJSON
	_, err.Msg = o.Raw(sql, signid, clinicid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "签约诊所不存在")
		return
	}

	sql = ` select i.clinicid,i.clinicname,i.dentalid,c.contact,c.bindmobile,i.starrating
			,i.province,i.city,i.address,i.area,i.longitude,i.latitude,s.startdate,s.enddate 
			from t_clinic_apply_info i inner join t_clinic c 
			on i.clinicid=c.clinicid	
			inner join t_clinic_apply_sign s on i.clinicid=s.clinicid
			where i.clinicid=? `

	_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&result.List)

	starthour := "07"
	startminute := "00"
	endhour := "23"
	endminute := "00"
	sql = " select ConfigName,ConfigValue from t_sysconfig where clinicuniqueid='" + clinicid + "' and ConfigGroup='Schedule' " +
		" and ( ConfigName='StartHour' or ConfigName='StartMinute' or ConfigName='EndHour' or ConfigName='EndMinute' )"

	var obj1 config.LJSON
	_, err.Msg = o.Raw(sql).ValuesJSON(&obj1)
	itemCount := obj1.ItemCount()
	for i := 0; i < itemCount; i++ {
		configname := obj1.Item(i).Get("configname").String()
		switch configname {
		case "StartHour":
			{
				starthour = obj1.Item(i).Get("configvalue").String()
				break
			}
		case "StartMinute":
			{
				startminute = obj1.Item(i).Get("configvalue").String()
				break
			}
		case "EndHour":
			{
				endhour = obj1.Item(i).Get("configvalue").String()
				break
			}
		case "EndMinute":
			{
				endminute = obj1.Item(i).Get("configvalue").String()
				break
			}
		}
	}

	result.List.Item(0).Set("starthour").SetString(starthour)
	result.List.Item(0).Set("startminute").SetString(startminute)
	result.List.Item(0).Set("endhour").SetString(endhour)
	result.List.Item(0).Set("endminute").SetString(endminute)

	//查询包的就诊人数
	var totalNum int64
	totalNum = 0
	sql = ` select sum(i.datastatus) as num,i.packagename
			from t_package_code c
			inner join t_package_info i on c.packageinfoid=i.packageinfoid
			 where c.clinicid=? and c.status=1 group by c.clinicid,c.packageinfoid 
			`
	var obj2 config.LJSON
	_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&obj2)
	count := obj2.ItemCount()
	for j := 0; j < count; j++ {
		totalNum += obj2.Item(j).Get("num").Int64()
	}
	tmp := obj2.AddItem()
	tmp.Set("packagename").SetString("合计")
	tmp.Set("num").SetInt64(totalNum)

	result.List.Item(0).Set("usedpackage").SetObject(obj2)

	//查询分发给诊所的包

	sql = ` select i.packageinfoid,c.clinicid,i.packagename,c.datastatus from t_package_clinic c 
			inner join t_package_info i on c.packageinfoid=i.packageinfoid 
			where clinicid=? `

	var obj3 config.LJSON
	_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&obj3)

	result.List.Item(0).Set("clinicpackage").SetObject(obj3)

	return result, err
}

//订单中心 获取订单列表

func DoGetBillList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DoGetBillList"

	begintime := param.Get("begintime").String()
	endtime := param.Get("endtime").String()
	condition := param.Get("condition").String() //产品名称和编号

	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量
	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	sql := ` select b.billid,b.BillCreateDate,b.BillUser,i.packagename,b.BillPlatform,b.BillPrice,
		b.BillPayWay,d.clinicname,d.customername,b.ConsumeDate,b.BillState
		from t_package_bill b left join t_package_use_detail d on 
		b.billid=d.billid
		left join t_package_info i on b.packageinfoid=i.packageinfoid
		where 1=1
	`

	if begintime != "" {
		begintime += " 00:00:00"
		sql = fmt.Sprintf("%s and b.BillCreateDate>='%s'", sql, begintime)
	}
	if endtime != "" {
		endtime += " 23:59:59"
		sql = fmt.Sprintf("%s and b.BillCreateDate<='%s'", sql, endtime)
	}

	packageinfoid := param.Get("packageinfoid").String()
	if packageinfoid != "" {
		sql = fmt.Sprintf("%s and b.PackageInfoID='%s'", sql, packageinfoid)
	}

	billstate := param.Get("billstate").String()
	if billstate != "" {
		sql = fmt.Sprintf("%s and b.BillState='%s'", sql, billstate)
	}

	platform := param.Get("platform").String()
	if platform != "" {
		sql = fmt.Sprintf("%s and b.BillPlatform='%s'", sql, platform)
	}

	billpayway := param.Get("billpayway").String()
	if billpayway != "" {
		sql = fmt.Sprintf("%s and b.BillPayWay='%s'", sql, billpayway)
	}

	if condition != "" {
		sql = fmt.Sprintf("%s and (b.billid like '%%%s%% or b.billuser like '%%%s%%') ", sql, condition, condition)
	}

	o := orm.NewOrm()

	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}

	sql = fmt.Sprintf("%s LIMIT %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)

	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数

	return result, err
}

//订单中心 获取过滤条件 包名

func GetPackageName(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetPackageName"

	packagename := param.Get("packagename").String()
	//包名为空,不进行查询
	if packagename == "" {
		err.Errorf(gutils.ParamError, "包名不能为空")
		return result, err
	}

	sql := ` select packageinfoid,packagename from t_package_info where 1=1 and datastatus=1 and packagename like '%?%'`

	o := orm.NewOrm()

	_, err.Msg = o.Raw(sql, packagename).ValuesJSON(&result.List)

	return result, err
}

//订单中心  查看订单详情
func GetBillDetail(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetBillDetail"

	billid := param.Get("billid").String()

	o := orm.NewOrm()
	sql := ` select * from t_package_bill b inner join t_package_use_detail d 
				on b.billid=d.billid where b.billid=? `
	_, err.Msg = o.Raw(sql, billid).ValuesJSON(&result.List)

	return result, err
}

//门诊管理  查询出已经加入该产品的门诊
func CliAndProYesRelation(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CliAndProYesRelation"
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("perpage").Int64()      //每页数量
	condition := param.Get("condition").String() //查询条件
	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}
	//查询出已经加入该产品的门诊
	o := orm.NewOrm()
	sql1 := `SELECT a.Name AS clinicname,b.DentalID,a.ClinicID FROM t_clinic a 
			 LEFT JOIN t_User b ON a.ClinicID=b.UserID
			 WHERE a.ClinicID IN (SELECT DISTINCT(clinicID) FROM t_package_clinic WHERE PackageInfoID=:PackageInfoID AND Datastatus=1) AND a.ClinicID!="" `

	if condition != "" {
		sql1 = fmt.Sprintf(` %s AND (a.Name LIKE '%%%s%%' OR b.DentalID LIKE '%%%s%%' ) `, sql1, condition, condition)
	}
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.RawJSON(sql1, param).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql1 = fmt.Sprintf("%s limit %d,%d ", sql1, perpage*(page-1), perpage)
	_, err.Msg = o.RawJSON(sql1, param).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

//门诊管理  查出已签约未加入该产品的门诊
func CliAndProNoRelation(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CliAndProNoRelation"
	page := param.Get("page").Int64()            //页码
	perpage := param.Get("perpage").Int64()      //每页数量
	condition := param.Get("condition").String() //条件
	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}
	//查询出已经加入该产品的门诊
	o := orm.NewOrm()
	//查出已签约未加入该产品的门诊
	sql1 := `select c.DentalID,b.Name as clinicname,b.ClinicID from t_clinic_apply_sign a 
			 left join t_clinic b on a.ClinicID=b.ClinicID
             LEFT JOIN t_user c on a.ClinicID=c.UserID
			 where a.DataStatus=1 and a.ClinicID not in(
			SELECT DISTINCT(clinicID) FROM t_package_clinic WHERE PackageInfoID=:PackageInfoID AND Datastatus=1) AND a.ClinicID!="" `
	if condition != "" {
		sql1 = fmt.Sprintf(` %s AND (b.Name LIKE '%%%s%%' OR c.DentalID LIKE '%%%s%%' ) `, sql1, condition, condition)
	}
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.RawJSON(sql1, param).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql1 = fmt.Sprintf("%s LIMIT %d,%d", sql1, perpage*(page-1), perpage)
	_, err.Msg = o.RawJSON(sql1, param).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

//添加诊所产品关系
func DoAddRelation(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	var res2 config.LJSON
	err.Caption = "DoAddRelation"
	packageinfoid := param.Get("PackageInfoID").String()
	createtime := time.Now().Format("2006-01-02 15:04:05")
	clinicids := param.Get("Clinicids")
	if packageinfoid == "" || clinicids.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "未选择套餐或者未选择诊所")
		return
	}
	o := orm.NewOrm()
	err.Msg = o.Begin()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	for i := 0; i < clinicids.ItemCount(); i++ {
		clinicid := clinicids.Item(i).Get("clinicid").String()
		sql2 := `select * from t_package_clinic where ClinicID=? and PackageInfoID=?`
		_, err.Msg = o.Raw(sql2, clinicid, packageinfoid).ValuesJSON(&res2)
		if res2.ItemCount() == 0 {
			sql3 := fmt.Sprintf(`insert into t_package_clinic (ClinicID,PackageInfoID,Updatetime)
			VALUES(%s,%s,"%s")`, clinicid, packageinfoid, createtime)
			_, err.Msg = o.Raw(sql3).Exec()

		} else {
			sql4 := fmt.Sprintf(`UPDATE t_package_clinic SET DataStatus="1",Updatetime="%s" 
									where ClinicID="%s" and PackageInfoID="%s" and DataStatus="0"`, createtime, clinicid, packageinfoid)
			_, err.Msg = o.Raw(sql4).Exec()
		}
		if err.Msg != nil {
			err.Errorf(gutils.ParamError, err.Msg.Error())
			o.Rollback()
			return
		}
	}
	o.Commit()
	return
}

//解除诊所产品关系
func DoDelRelation(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	var clinicidlist string
	err.Caption = "DoDelRelation"
	packageinfoid := param.Get("PackageInfoID").String()
	clinicids := param.Get("Clinicids")
	createtime := time.Now().Format("2006-01-02 15:04:05")
	if packageinfoid == "" || clinicids.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "未选择套餐或者未选择诊所")
		return
	}
	for i := 0; i < clinicids.ItemCount(); i++ {
		clinicid := clinicids.Item(i).Get("clinicid").String()
		clinicidlist += clinicid + ","
	}
	clinicidlist = clinicidlist[:len(clinicidlist)-1]
	sql := fmt.Sprintf(`UPDATE t_package_clinic SET DataStatus="0",Updatetime="%s"
						WHERE ClinicID IN(%s) AND PackageInfoID=:PackageInfoID`, createtime, clinicidlist)
	o := orm.NewOrm()
	err.Msg = o.Begin()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	_, err.Msg = o.RawJSON(sql, param).Exec()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	err.Msg = o.Commit()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	return
}

//修改产品
func DoUpdatePro(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DoUpdatePro"

	o := orm.NewOrm()
	err.Msg = o.Begin()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	PackageInfoID := param.Get("PackageInfoID").String()
	if PackageInfoID == "" {
		err.Errorf(gutils.ParamError, "未选择产品")
		return
	}

	var obj config.LJSON
	sql := ` select createtime from t_package_info where packageinfoid =? `
	_, err.Msg = o.Raw(sql, PackageInfoID).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "项目包不存在")
		return
	}
	param.Set("CreateTime").SetString(obj.Item(0).Get("createtime").String())

	paserialnum := param.Get("PaSerialNum").String()

	sql = ` select packageinfoid from t_package_info where paserialnum=? `
	var obj1 config.LJSON
	_, err.Msg = o.Raw(sql, paserialnum).ValuesJSON(&obj1)
	if obj.ItemCount() != 0 {
		packageid := obj1.Item(0).Get("packageinfoid").String()
		if packageid != PackageInfoID {
			err.Errorf(gutils.ParamError, "平安编号已被占用")
			return
		}
	}

	//删除 t_package_info
	sql2 := `DELETE  FROM  t_package_info WHERE  PackageInfoID=:PackageInfoID`
	_, err.Msg = o.RawJSON(sql2, param).Exec()
	if err.Msg != nil {
		err.Errorf(gutils.ParamError, err.Msg.Error())
		o.Rollback()
		return
	}

	//删除 t_package_handle
	sql4 := `DELETE  FROM  t_package_handle WHERE  PackageInfoID=:PackageInfoID`
	_, err.Msg = o.RawJSON(sql4, param).Exec()
	if err.Msg != nil {
		err.Errorf(gutils.ParamError, err.Msg.Error())
		o.Rollback()
		return
	}
	o.Commit()
	DoAddNewPro(param)
	return
}

func DoDelPro(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DoDelPro"
	PackageInfoID := param.Get("PackageInfoID").String()
	if PackageInfoID == "" {
		err.Errorf(gutils.ParamError, "未选择产品")
		return
	}

	o := orm.NewOrm()

	err.Msg = o.Begin()
	if err.Msg != nil {
		o.Rollback()
		return
	}

	sql1 := `SELECT * FROM t_package_clinic a WHERE a.PackageInfoID=:PackageInfoID AND a.DataStatus="1" limit 1`
	_, err.Msg = o.RawJSON(sql1, param).ValuesJSON(&result.List)
	if result.List.ItemCount() != 0 {
		err.Errorf(gutils.ParamError, "该产品已经有签约,不能删除")
		return
	}

	//删除 t_package_info
	sql2 := `DELETE  FROM  t_package_info WHERE  PackageInfoID=:PackageInfoID`
	_, err.Msg = o.RawJSON(sql2, param).Exec()
	if err.Msg != nil {
		err.Errorf(gutils.ParamError, err.Msg.Error())
		o.Rollback()
		return
	}

	//删除 t_package_handle
	sql4 := `DELETE  FROM  t_package_handle WHERE  PackageInfoID=:PackageInfoID`
	_, err.Msg = o.RawJSON(sql4, param).Exec()
	if err.Msg != nil {
		err.Errorf(gutils.ParamError, err.Msg.Error())
		o.Rollback()
		return
	}
	o.Commit()

	return
}

//门诊产品列表数据
func ClinicProData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ClinicProData"

	return
}
