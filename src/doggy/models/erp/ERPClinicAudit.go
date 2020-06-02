//author:  于绍纳 2017-03-09
//purpose： 后台诊所审核模块
package models

import (
	"doggy/gutils"
	"doggy/models/model"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"os"
	"strconv"
	"time"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/utils"
	"github.com/tealeg/xlsx"
)

func ImportInfo(param *config.LJSON) (err error) {
	usermobile := param.Get("usermobile").String()
	if usermobile == "" {
		err = fmt.Errorf("%s", "手机号不能为空")
		return
	}
	dentalid := param.Get("dentalid").String()
	if dentalid == "" {
		err = fmt.Errorf("%s", "管家号不能为空")
		return
	}
	o := orm.NewOrm()
	timenow := time.Now().Format("2006-01-02 15:04:05")

	sql := ` select userid from t_user where mobile=? and roleid=3 `
	userid := gutils.CreateSTRGUID()
	var user config.LJSON
	_, err = o.Raw(sql, usermobile).ValuesJSON(&user)
	if user.ItemCount() == 0 {
		err = o.Begin()
		if err != nil {
			o.Rollback()
			return
		}

		sql = `insert into t_user (userid,password,reservepassword,roleid,mobile,datastatus,createtime,updatetime) 
				values (?,?,?,?,?,?,?,?) `
		_, err = o.Raw(sql, userid, "e10adc3949ba59abbe56e057f20f883e", ",$<;gka$$wz;dSsslE;e", 3, usermobile, 1, timenow, timenow).Exec()
		if err != nil {
			o.Rollback()
			return
		}

		sql = ` insert into t_doctor (doctorid,name,phone,mobile,datastatus,updatetime) 
				values (?,?,?,?,?,?)
				`
		_, err = o.Raw(sql, userid, "未命名", usermobile, usermobile, 1, timenow).Exec()
		if err != nil {
			o.Rollback()
			return
		}
		err = o.Commit()
		if err != nil {
			o.Rollback()
			return
		}
	} else {
		userid = user.Item(0).Get("userid").String()
	}
	param.Set("userid").SetString(userid)
	var clinic config.LJSON
	sql = ` select u.userid,c.name as clinicname from t_user  u inner join t_clinic c on 
			u.userid=c.clinicid 
			where u.dentalid=? and u.roleid=2 `
	_, err = o.Raw(sql, dentalid).ValuesJSON(&clinic)
	if clinic.ItemCount() == 0 {
		err = fmt.Errorf("%s", "管家号不存在")
		return
	}
	clinicid := clinic.Item(0).Get("userid").String()
	clinicname := clinic.Item(0).Get("name").String()
	param.Set("clinicid").SetString(clinicid)
	param.Set("clinicname").SetString(clinicname)

	//临时保存数据

	err = o.Begin()
	if err != nil {
		o.Rollback()
		return
	}

	sql = ` select datastatus,checkstatus from t_clinic_apply_info where userid=? `
	var obj config.LJSON
	_, err = o.Raw(sql, userid).ValuesJSON(&obj)
	param.Set("updatetime").SetString(timenow)
	param.Set("createtime").SetString(timenow)
	if param.Get("latitude").IsNULL() {
		param.Set("latitude").SetDouble(0)
	}
	if param.Get("longitude").IsNULL() {
		param.Set("longitude").SetDouble(0)
	}
	if obj.ItemCount() == 0 { //插入
		sql = `
			insert into t_clinic_apply_info (infoid,userid,clinicid,dentalid,clinicname,institutionname,
			province,city,area,address,mobile,licenseid,chairnum,licenseproperty,
			highesttitle,physiciannum,scheduleprocess,monthpatientnum,businessmonth,clinicarea,chainnum,
			checkstatus,datastatus,updatetime,createtime,latitude,longitude) values 
			(
				:infoid,:userid,:clinicid,:dentalid,:clinicname,:institutionname,
			:province,:city,:area,:address,:mobile,:licenseid,:chairnum,:licenseproperty,
			:highesttitle,:physiciannum,:scheduleprocess,:monthpatientnum,:businessmonth,:clinicarea,:chainnum,
			:checkstatus,:datastatus,:updatetime,:createtime,:latitude,:longitude
			)
		`
		param.Set("infoid").SetString(gutils.CreateSTRGUID())
		param.Set("datastatus").SetInt(1)
		param.Set("checkstatus").SetInt(0) //临时保存

	} else { //更新
		checkstatus := obj.Item(0).Get("checkstatus").Int()
		if checkstatus != 0 {
			err = fmt.Errorf("%s", "该账号已有待审核数据,无法保存")
			o.Rollback()
			return
		}
		sql = ` update t_clinic_apply_info set clinicid=:clinicid,dentalid=:dentalid,clinicname=:clinicname,institutionname=:institutionname,
		province=:province,city=:city,area=:area,address=:address,mobile=:mobile,licenseid=:licenseid,chairnum=:chairnum,
		licenseproperty=:licenseproperty,highesttitle=:highesttitle,
		physiciannum=:physiciannum,scheduleprocess=:scheduleprocess,monthpatientnum=:monthpatientnum,businessmonth=:businessmonth,
		clinicarea=:clinicarea,chainnum=:chainnum,updatetime=:updatetime,longitude=:longitude,latitude=:latitude where userid=:userid `

	}
	_, err = o.RawJSON(sql, *param).Exec()
	if err != nil {
		o.Rollback()
		return
	}
	err = o.Commit()
	if err != nil {
		o.Rollback()
	}
	return
}

//导入诊所
func ImportClinic(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ImportClinic"
	picdata := param.Get("picdata").String()
	extname := param.Get("ext").String()
	if extname != "xls" && extname != "xlsx" {
		err.Errorf(gutils.ParamError, "文件格式不对!")
		return
	}
	if picdata == "" {
		err.Errorf(gutils.ParamError, "Excel数据不能为空!")
		return
	}
	buf, _ := base64.StdEncoding.DecodeString(picdata) //文件写入到buffer
	path := utils.GetApplicationFullName()
	dir := utils.ExtractFileDir(path) + "\\Cache\\"
	utils.ForceDirectories(dir)
	dest := fmt.Sprintf("%d", gutils.CreateGUID()) + ".xls"
	src := dir + dest
	err.Msg = ioutil.WriteFile(src, buf, 0666) //buffer输出到xls文件中（不做处理，直接写到文件）
	if err.Msg != nil {
		return
	}
	//打开excel
	var xlFile *xlsx.File
	xlFile, err.Msg = xlsx.OpenFile(src)
	if err.Msg != nil {
		os.Remove(src) //删除文件
		return
	}
	var resinfo config.LJSON
	for _, sheet := range xlFile.Sheets {
		r := 0
		for _, row := range sheet.Rows { //行
			if r > 1 {
				i := 0
				item := resinfo.AddItem()
				for _, cell := range row.Cells { //列
					s, _ := cell.String()
					item.Set("cells" + fmt.Sprintf("%d", i)).SetString(s)
					i = i + 1
				}
			}
			r = r + 1
		}
	}
	os.Remove(src) //删除文件
	itemcount := resinfo.ItemCount()
	for i := 0; i < itemcount; i++ {
		var obj config.LJSON
		obj.Set("usermobile").SetString(resinfo.Item(i).Get("cells0").String())
		obj.Set("dentalid").SetString(resinfo.Item(i).Get("cells1").String())
		obj.Set("institutionname").SetString(resinfo.Item(i).Get("cells2").String())
		obj.Set("province").SetString(resinfo.Item(i).Get("cells3").String())
		obj.Set("city").SetString(resinfo.Item(i).Get("cells4").String())
		obj.Set("area").SetString(resinfo.Item(i).Get("cells5").String())
		obj.Set("address").SetString(resinfo.Item(i).Get("cells6").String())
		obj.Set("mobile").SetString(resinfo.Item(i).Get("cells7").String())
		obj.Set("licenseid").SetString(resinfo.Item(i).Get("cells8").String())
		obj.Set("chairnum").SetString(resinfo.Item(i).Get("cells9").String())
		obj.Set("licenseproperty").SetString(resinfo.Item(i).Get("cells10").String())
		obj.Set("highesttitle").SetString(resinfo.Item(i).Get("cells11").String())
		obj.Set("physiciannum").SetString(resinfo.Item(i).Get("cells12").String())
		obj.Set("scheduleprocess").SetString(resinfo.Item(i).Get("cells13").String())
		obj.Set("monthpatientnum").SetString(resinfo.Item(i).Get("cells14").String())
		obj.Set("businessmonth").SetString(resinfo.Item(i).Get("cells15").String())
		obj.Set("clinicarea").SetString(resinfo.Item(i).Get("cells16").String())
		obj.Set("chainnum").SetString(resinfo.Item(i).Get("cells17").String())
		ImportInfo(&obj)
	}
	return
}

//删除待完善的诊所
func DelClinic(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DelClinic"
	infoid := param.Get("infoid").String()

	if infoid == "" {
		err.Errorf(gutils.ParamError, "info不能为空")
		return
	}

	sql := ` select checkstatus from t_clinic_apply_info where infoid=? `
	o := orm.NewOrm()
	var obj config.LJSON
	_, err.Msg = o.Raw(sql, infoid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		return
	}
	checkstatus := obj.Item(0).Get("checkstatus").Int()
	if checkstatus != 0 {
		err.Errorf(gutils.ParamError, "状态非待完善,无法删除 ")
		return
	}
	sql = ` delete from t_clinic_apply_info where infoid=? `
	_, err.Msg = o.Raw(sql, infoid).Exec()
	return
}

//待完善页面数据
func FinishPageData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "FinishPageData"
	infoid := param.Get("infoid").String()
	if infoid == "" {
		err.Errorf(gutils.ParamError, "info不能为空")
		return
	}
	o := orm.NewOrm()
	sql := ` select i.*,u.mobile as usermobile from t_clinic_apply_info i inner join t_user u on 
			i.userid = u.userid and u.roleid=3 where i.infoid=? `
	var info config.LJSON
	_, err.Msg = o.Raw(sql, infoid).ValuesJSON(&info)
	result.List.Set("info").SetObject(info)
	return
}

//待审核诊所数据修改
func ModifyApply(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ModifyApply"
	infoid := param.Get("infoid").String()
	if infoid == "" {
		err.Errorf(gutils.ParamError, "info不能为空")
		return
	}

	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select checkstatus from t_clinic_apply_info where infoid=? `
	_, err.Msg = o.Raw(sql, infoid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "申请数据不存在")
		return
	}
	//	checkstatus := obj.Item(0).Get("checkstatus").Int()
	//	if checkstatus != 1 {
	//		err.Errorf(gutils.ParamError, "目前仅支持待审核数据修改")
	//		return
	//	}

	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("updatetime").SetString(Updatetime)
	if param.Get("latitude").IsNULL() {
		param.Set("latitude").SetDouble(0)
	}
	if param.Get("longitude").IsNULL() {
		param.Set("longitude").SetDouble(0)
	}

	sql = ` update t_clinic_apply_info set institutionname=:institutionname,
	province=:province,city=:city,area=:area,address=:address,mobile=:mobile,licenseid=:licenseid,legalpersonpic=:legalpersonpic,
	medicallicenoriginal=:medicallicenoriginal,medicallicenduplicate=:medicallicenduplicate,medicallicencheck=:medicallicencheck,
	physicianpracticecert=:physicianpracticecert,chairnum=:chairnum,licenseproperty=:licenseproperty,highesttitle=:highesttitle,
	physiciannum=:physiciannum,scheduleprocess=:scheduleprocess,monthpatientnum=:monthpatientnum,businessmonth=:businessmonth,
	clinicarea=:clinicarea,chainnum=:chainnum,physicianhonorcert=:physicianhonorcert,clinichonorcert=:clinichonorcert,
	physicianduty=:physicianduty,updatetime=:updatetime,latitude=:latitude,longitude=:longitude,clinicprincipal=:clinicprincipal,
	principalqq=:principalqq,principalwechat=:principalwechat,principalphone=:principalphone,principalidnum=:principalidnum,
	principalsex=:principalsex,principalpositon=:principalpositon,cliniccontacts=:cliniccontacts,healthpermit=:healthpermit,
	entrancephoto=:entrancephoto,receptionphotos=:receptionphotos,clinicroomphoto=:clinicroomphoto,radiologyroomphoto=:radiologyroomphoto,
	concerns=:concerns,clinicurl=:clinicurl,businessprincipal=:businessprincipal,licenseexpiry=:licenseexpiry,employeenum=:employeenum,
	cliniccomputers=:cliniccomputers,usedsoftware=:usedsoftware,clinicnetwork=:clinicnetwork,clinicdevicebrand=:clinicdevicebrand,
	clinicpracticedocter=:clinicpracticedocter,clinicassistantdocter=:clinicassistantdocter,clinicnurse=:clinicnurse,clinicfront=:clinicfront,
	isopenmedicare=:isopenmedicare,medicareplatform=:medicareplatform,clinicismain=:clinicismain,largeprojects=:largeprojects,
	onlinepurchase=:onlinepurchase,denturemaker=:denturemaker,suppliespartners=:suppliespartners,
	clinicdecoration=:clinicdecoration where infoid=:infoid `
	_, err.Msg = o.RawJSON(sql, param).Exec()
	if err.Msg != nil {
		return
	}
	return
}

//后台添加诊所
func GetDental(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetDental"
	usermobile := param.Get("usermobile").String()
	if usermobile == "" {
		err.Errorf(gutils.ParamError, "用户手机号不能为空")
		return
	}

	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select userid from t_user where mobile=? and roleid=3 `
	_, err.Msg = o.Raw(sql, usermobile).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "手机号账户不存在")
		return
	}
	userid := obj.Item(0).Get("userid").String()
	if userid == "" {
		err.Errorf(gutils.ParamError, "用户ID不能为空")
		return
	}
	var obj_a config.LJSON
	sql = ` select checkstatus from t_clinic_apply_info where userid=? `
	_, err.Msg = o.Raw(sql, userid).ValuesJSON(&obj_a)
	if obj_a.ItemCount() != 0 {
		checkstatus := obj_a.Item(0).Get("checkstatus").Int()
		if checkstatus != 0 {
			err.Errorf(gutils.ParamError, "手机号已提交过诊所")
			return
		}
	}

	sql = `
		select u.dentalid,c.name as clinicname from t_user_data ud 
		inner join t_user u on ud.clinicid=u.userid 
		inner join t_clinic c on ud.clinicid=c.clinicid
		left join t_clinic_apply_info s on u.DentalID=s.DentalID 
		where ud.userid=?  and ud.Role=3 and ud.clinicid<>'1' 
		and (s.CheckStatus is null or s.CheckStatus=0) `
	_, err.Msg = o.Raw(sql, userid).ValuesJSON(&result.List)
	return result, err
}

func AddClinic(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AddClinic"

	o := orm.NewOrm()
	sql := ` select c.bindmobile as mobile,c.name as clinicname,c.ClinicProvince as province,c.ClinicCity as city,c.clinicarea as area,c.address,u.dentalid 
	
			 from t_user u inner join t_clinic c on u.userid=c.clinicid where u.dentalid=:dentalid `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	return result, err
}

//后台提交审核
func CommitApply(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CommitApply"
	usermobile := param.Get("usermobile").String()
	if usermobile == "" {
		err.Errorf(gutils.ParamError, "用户手机号不能为空")
		return
	}

	dentalid := param.Get("dentalid").String()
	if dentalid == "" {
		err.Errorf(gutils.ParamError, "管家号不能为空!")
		return
	}
	userid := gutils.CreateSTRGUID()
	timenow := time.Now().Format("2006-01-02 15:04:05")
	o := orm.NewOrm()
	var obj1 config.LJSON
	sql := ` select userid from t_user where mobile=? and roleid=3 `
	_, err.Msg = o.Raw(sql, usermobile).ValuesJSON(&obj1)
	if obj1.ItemCount() == 0 {

		sql = `insert into t_user (userid,password,reservepassword,roleid,mobile,datastatus,createtime,updatetime) 
				values (?,?,?,?,?,?,?,?) `
		_, err.Msg = o.Raw(sql, userid, "e10adc3949ba59abbe56e057f20f883e", ",$<;gka$$wz;dSsslE;e", 3, usermobile, 1, timenow, timenow).Exec()

		sql = ` insert into t_doctor (doctorid,name,phone,mobile,datastatus,updatetime) 
				values (?,?,?,?,?,?)
				`
		_, err.Msg = o.Raw(sql, userid, "未命名", usermobile, usermobile, 1, timenow).Exec()
	} else {
		userid = obj1.Item(0).Get("userid").String()
	}
	if userid == "" {
		err.Errorf(gutils.ParamError, "用户ID不能为空")
		return
	}

	sql = ` select u.userid,c.name as clinicname from t_user  u inner join t_clinic c on 
			u.userid=c.clinicid 
			where u.dentalid=? and u.roleid=2 `
	var user config.LJSON
	_, err.Msg = o.Raw(sql, dentalid).ValuesJSON(&user)

	clinicid := user.Item(0).Get("userid").String()
	if clinicid == "" {
		err.Errorf(gutils.ParamError, "管家号不存在")
		return
	}
	clinicname := user.Item(0).Get("clinicname").String()
	param.Set("clinicname").SetString(clinicname)

	sql = ` select * from t_clinic_apply_info where (userid=? or dentalid=?) and checkstatus<>'0' `
	var info config.LJSON
	_, err.Msg = o.Raw(sql, userid, dentalid).ValuesJSON(&info)
	if info.ItemCount() != 0 { //说明用户或者管家号暂无审核记录
		err.Errorf(gutils.ParamError, "诊所或用户已有在审数据...")
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
	param.Set("userid").SetString(userid)

	InfoID := gutils.CreateSTRGUID()
	if obj.ItemCount() == 0 { //插入
		sql = `
			insert into t_clinic_apply_info (infoid,userid,clinicid,dentalid,clinicname,institutionname,
			province,city,area,address,mobile,licenseid,legalpersonpic,
			medicallicenoriginal,medicallicenduplicate,medicallicencheck,physicianpracticecert,chairnum,licenseproperty,
			highesttitle,physiciannum,scheduleprocess,monthpatientnum,businessmonth,clinicarea,chainnum,physicianhonorcert,
			clinichonorcert,physicianduty,checkstatus,datastatus,updatetime,createtime,latitude,longitude,clinicprincipal,
			principalqq,principalwechat,principalphone,principalidnum,principalsex,principalpositon,clinicurl,businessprincipal,
			licenseexpiry,employeenum,cliniccomputers,usedsoftware,clinicnetwork,clinicdevicebrand,clinicpracticedocter,
			clinicassistantdocter,clinicnurse,clinicfront,isopenmedicare,medicareplatform,clinicismain,largeprojects,
			onlinepurchase,denturemaker,suppliespartners,cliniccontacts,clinicdecoration,concerns,healthpermit,
			entrancephoto,receptionphotos,clinicroomphoto,radiologyroomphoto
			) values 
			(
			:infoid,:userid,:clinicid,:dentalid,:clinicname,:institutionname,
			:province,:city,:area,:address,:mobile,:licenseid,:legalpersonpic,
			:medicallicenoriginal,:medicallicenduplicate,:medicallicencheck,:physicianpracticecert,:chairnum,:licenseproperty,
			:highesttitle,:physiciannum,:scheduleprocess,:monthpatientnum,:businessmonth,:clinicarea,:chainnum,:physicianhonorcert,
			:clinichonorcert,:physicianduty,:checkstatus,:datastatus,:updatetime,:createtime,:latitude,:longitude,:clinicprincipal,
			:principalqq,:principalwechat,:principalphone,:principalidnum,:principalsex,:principalpositon,:clinicurl,:businessprincipal,
			:licenseexpiry,:employeenum,:cliniccomputers,:usedsoftware,:clinicnetwork,:clinicdevicebrand,:clinicpracticedocter,
			:clinicassistantdocter,:clinicnurse,:clinicfront,:isopenmedicare,:medicareplatform,:clinicismain,:largeprojects,
			:onlinepurchase,:denturemaker,:suppliespartners,:cliniccontacts,:clinicdecoration,:concerns,:healthpermit,
			:entrancephoto,:receptionphotos,:clinicroomphoto,:radiologyroomphoto
			)
		`
		param.Set("infoid").SetString(InfoID)
		param.Set("datastatus").SetInt(1)

	} else { //更新

		InfoID = obj.Item(0).Get("infoid").String()
		sql = ` update t_clinic_apply_info set clinicid=:clinicid,dentalid=:dentalid,clinicname=:clinicname,institutionname=:institutionname,
		province=:province,city=:city,area=:area,address=:address,mobile=:mobile,licenseid=:licenseid,legalpersonpic=:legalpersonpic,
		medicallicenoriginal=:medicallicenoriginal,medicallicenduplicate=:medicallicenduplicate,medicallicencheck=:medicallicencheck,
		physicianpracticecert=:physicianpracticecert,chairnum=:chairnum,licenseproperty=:licenseproperty,highesttitle=:highesttitle,
		physiciannum=:physiciannum,scheduleprocess=:scheduleprocess,monthpatientnum=:monthpatientnum,businessmonth=:businessmonth,
		clinicarea=:clinicarea,chainnum=:chainnum,physicianhonorcert=:physicianhonorcert,clinichonorcert=:clinichonorcert,
		physicianduty=:physicianduty,updatetime=:updatetime,checkstatus=:checkstatus,clinicprincipal =:clinicprincipal,
		principalqq =:principalqq,principalwechat =:principalwechat,principalphone =:principalphone,principalidnum =:principalidnum,
		principalsex =:principalsex,principalpositon =:principalpositon,clinicurl =:clinicurl,businessprincipal =:businessprincipal,l
		icenseexpiry =:licenseexpiry,employeenum =:employeenum,cliniccomputers =:cliniccomputers,usedsoftware =:usedsoftware,
		clinicnetwork =:clinicnetwork,clinicdevicebrand =:clinicdevicebrand,clinicpracticedocter =:clinicpracticedocter,
		clinicassistantdocter =:clinicassistantdocter,clinicnurse =:clinicnurse,clinicfront =:clinicfront,isopenmedicare =:isopenmedicare,
		medicareplatform =:medicareplatform,clinicismain =:clinicismain,largeprojects =:largeprojects,onlinepurchase =:onlinepurchase,
		denturemaker =:denturemaker,suppliespartners =:suppliespartners,cliniccontacts =:cliniccontacts,clinicdecoration =:clinicdecoration,
		concerns =:concerns,healthpermit =:healthpermit,entrancephoto =:entrancephoto,receptionphotos =:receptionphotos,
		clinicroomphoto =:clinicroomphoto,radiologyroomphoto =:radiologyroomphoto,latitude=:latitude,longitude=:longitude where userid=:userid `

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
	result.List.Set("userid").SetString(userid)
	result.List.Set("dentalid").SetString(dentalid)
	result.List.Set("infoid").SetString(InfoID)
	return
}

//平安验证列表数据
func SignClinicData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SignClinicData"
	conditon := param.Get("condition").String()
	Updatetime := time.Now().Format("2006-01-02 15:04:05")

	perpage := param.Get("per_page").Int() //每页数量
	page := param.Get("page").Int()

	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if perpage == 0 {
		perpage = 10
	}
	if page == 0 {
		page = 1
	}

	o := orm.NewOrm()
	sql := fmt.Sprintf(` select signid,dentalid,clinicname,pakey,partnerid from t_clinic_apply_sign 	
	 					where datastatus=1 and enddate >= "%s" `, Updatetime)
	if conditon != "" {
		sql = fmt.Sprintf(`%s AND (clinicname  like '%%%s%%' or dentalid like '%%%s%%') `, sql, conditon, conditon)
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	offset := (page - 1) * perpage
	limit := perpage
	sql = fmt.Sprintf("%s LIMIT %d,%d", sql, offset, limit)
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	if err.Msg != nil {
		return
	}
	result.TotalCount = totalcount   //总条数
	result.PageNo = int64(page)      //页码
	result.PageSize = int64(perpage) //每页条数
	return
}

//ModifyData
func ModifyData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ModifyData"
	signid := param.Get("signid").String()
	if signid == "" {
		err.Errorf(gutils.ParamError, "签约ID不能为空")
		return
	}

	pakey := param.Get("pakey").String()
	partnerid := param.Get("partnerid").String()
	if pakey == "" || partnerid == "" {
		err.Errorf(gutils.ParamError, "平安数据不能为空")
		return
	}

	o := orm.NewOrm()
	err.Msg = o.Begin()
	if err.Msg != nil {
		o.Rollback()
		return
	}
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	sql := ` update t_clinic_apply_sign set pakey=?,partnerid=?,updatetime=? where signid=? `

	_, err.Msg = o.Raw(sql, pakey, partnerid, Updatetime, signid).Exec()
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

// GetClinicList 获取门诊列表
func GetClinicAuditList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetClinicAuditList"
	starttime := param.Get("start_time").String() + " 00:00:00" //起始时间
	endtime := param.Get("end_time").String() + " 23:59:59"     //结束时间
	perpage := param.Get("per_page").Int()                      //每页数量
	page := param.Get("page").Int()                             //页数
	province := param.Get("province").String()                  //省份
	city := param.Get("city").String()                          //城市
	conditon := param.Get("condition").String()                 //输入框搜索条件   门诊名称或者管家号
	status := param.Get("status").String()                      //状态
	starlevel := param.Get("starlevel").String()                //门诊星级
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if perpage == 0 {
		perpage = 10
	}
	if page == 0 {
		page = 1
	}
	o := orm.NewOrm()
	sql := fmt.Sprintf(`SELECT a.InfoID,a.DentalID,CONCAT(a.Province,a.City,a.Area,a.Address) AS diqu,a.UserID,a.CreateTime,a.CheckStatus,a.UserRating,a.BasicScore,a.StarRating,
            a.Mobile,d.Name AS clinicname,d.ClinicID
            FROM t_clinic_apply_info AS a 
            LEFT JOIN t_user AS c ON c.DentalID=a.DentalID
            LEFT JOIN t_clinic AS d ON c.UserID=d.ClinicID WHERE 1=1 AND a.CreateTime<="%s" AND a.CreateTime>="%s" `, endtime, starttime)

	if status != "" {
		if status == "1" { //申请中
			sql = fmt.Sprintf(`%s AND (a.CheckStatus ="%s" or a.CheckStatus ="%s") `, sql, "1", "2")
		} else {
			sql = fmt.Sprintf(`%s AND a.CheckStatus  ="%s" `, sql, status)
		}
	}
	/*else { 待完善的数据显示
		sql = fmt.Sprintf(`%s AND a.CheckStatus  !="%s" `, sql, "0")
	}*/
	if starlevel != "" {
		sql = fmt.Sprintf(`%s AND a.StarRating ="%s"`, sql, starlevel)
	}
	if conditon != "" {
		sql = fmt.Sprintf(`%s AND (d.Name  like '%%%s%%' or a.DentalID like '%%%s%%') `, sql, conditon, conditon)
	}
	if province != "" {
		sql = fmt.Sprintf(`%s AND a.Province ="%s"`, sql, province)
	}
	if city != "" {
		sql = fmt.Sprintf(`%s AND a.City ="%s"`, sql, city)
	}
	if totalcount <= 0 {
		_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	offset := (page - 1) * perpage
	limit := perpage
	sql = fmt.Sprintf("%s LIMIT %d,%d", sql, offset, limit)
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	if err.Msg != nil {
		return
	}
	result.TotalCount = totalcount   //总条数
	result.PageNo = int64(page)      //页码
	result.PageSize = int64(perpage) //每页条数
	return
}

//审核  重审  页面数据
func DoExamineEnter(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DoExamineEnter"
	o := orm.NewOrm()
	err.Msg = o.Begin()
	//打开页面  更新状态正在审核 同时写记录
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("progressid").SetString(strconv.FormatInt(gutils.CreateGUID(), 10))
	//param.Set("userid").SetString(param.Get("userid").String())
	param.Set("progressdate").SetString(Updatetime)
	param.Set("progressstatus").SetString("正在审核")
	param.Set("updatetime").SetString(Updatetime)
	param.Set("RemarkType").SetString("1")
	param.Set("datastatus").SetString("1")
	param.Set("Remark").SetString("")
	param.Set("SignDocuments").SetString("")
	param.Set("StartDate").SetString("0000-00-00")
	param.Set("EndDate").SetString("0000-00-00")
	//_, err = InsertOperaRecord(param)
	// if err.Msg != nil {
	// 	o.Rollback()
	// 	return
	// }
	// sql1 := `UPDATE t_clinic_apply_info a SET a.CheckStatus="2"
	//         WHERE 1=1 AND a.InfoID=:InfoID AND a.UserID=:UserID AND a.DentalID=:DentalID AND a.CheckStatus!="2"`
	// _, err.Msg = o.RawJSON(sql1, param).ValuesJSON(&result.List)
	// if err.Msg != nil {
	// 	o.Rollback()
	// 	return
	// }
	sql := `SELECT a.*,c.*,((YEAR(NOW()) - YEAR(b.CreateTime))*12 + (MONTH(NOW()) - MONTH(b.CreateTime))) AS months
            FROM t_clinic_apply_info AS a 
            LEFT JOIN t_user AS b ON b.UserID=a.UserID
            LEFT JOIN t_clinic_apply_hygiene c ON c.InfoID=a.InfoID
            WHERE 1=1 AND a.InfoID=:InfoID AND a.UserID=:UserID AND a.DentalID=:DentalID`

	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	if err.Msg != nil {
		o.Rollback()
		return
	}
	o.Commit()
	return
}

//写入审核记录
func InsertOperaRecord(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "InsertOperaRecord"
	o := orm.NewOrm()
	sql := `insert into t_clinic_apply_progress (progressid,userid,progressdate,progressstatus,RemarkType,datastatus,updatetime,Remark,StartDate,EndDate,SignDocument)
		values (:progressid,:userid,:progressdate,:progressstatus,:RemarkType,:datastatus,:updatetime,:Remark,:StartDate,:EndDate,:SignDocuments)`
	_, err.Msg = o.RawJSON(sql, param).Exec()
	return
}

//写入环境评分或者更新
func UpsertEnvRecord(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UpsertEnvRecord"
	var sql2 string
	o := orm.NewOrm()
	sql := `select * from t_clinic_apply_hygiene a  WHERE 1=1 AND a.InfoID=:InfoID AND a.UserID=:UserID AND a.DentalID=:DentalID`
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 { //插入
		sql2 = `insert into t_clinic_apply_hygiene (InfoID,UserID,DentalID,Hygiene,Identification,GarbageDisposa,Privacy,Safe,Staff,MedicalQuality,Other)
		values (:InfoID,:UserID,:DentalID,:Hygiene,:Identification,:GarbageDisposa,:Privacy,:Safe,:Staff,:MedicalQuality,:Other)`
		_, err.Msg = o.RawJSON(sql, param).Exec()
	} else { //更新
		sql2 = `UPDATE t_clinic_apply_hygiene a SET Hygiene=:Hygiene,Identification=:Identification,GarbageDisposa=:GarbageDisposa,
                Privacy=:Privacy,Safe=:Safe,Staff=:Staff,MedicalQuality=:MedicalQuality,Other=:Other
            WHERE 1=1 AND a.InfoID=:InfoID AND a.UserID=:UserID AND a.DentalID=:DentalID`
	}
	_, err.Msg = o.RawJSON(sql2, param).Exec()
	return
}

//审核  重审 结果提交
func DoExamineResult(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DoExamineResult"
	o := orm.NewOrm()

	errsult := param.Get("errsult").String()
	param.Set("isimport").SetInt(0)
	if errsult == "" { //空的表示审核通过
		var obj config.LJSON
		_, err.Msg = o.RawJSON(" select checkstatus from t_clinic_apply_info where infoid=:InfoID ", param).ValuesJSON(&obj)
		checkstatus := obj.Item(0).Get("checkstatus").Int()
		if checkstatus < 4 {
			param.Set("CheckStatus").SetString("4")
			param.Set("isimport").SetInt(1)
		} else {
			param.Set("CheckStatus").SetString(strconv.Itoa(checkstatus))
		}

		param.Set("progressstatus").SetString("审核通过")
	} else { //审核失败
		param.Set("CheckStatus").SetString("3")
		param.Set("progressstatus").SetString("审核失败")
	}
	err.Msg = o.Begin()
	sql1 := `UPDATE t_clinic_apply_info a SET isimport=:isimport,CheckStatus=:CheckStatus,BasicScore=:BasicScore,OperatingScore=:OperatingScore
            ,SocialScore=:SocialScore,EnvironmentalScore=:EnvironmentalScore,StarRating=:StarRating,Remark=:errsult,RatingRemarks=:RatingRemarks,
            PhysicianHonorCertLevel=:PhysicianHonorCertLevel,ClinicHonorCertLevel=:ClinicHonorCertLevel,PhysicianDutyLevel=:PhysicianDutyLevel
            WHERE 1=1 AND a.InfoID=:InfoID AND a.UserID=:UserID AND a.DentalID=:DentalID`
	_, err.Msg = o.RawJSON(sql1, param).ValuesJSON(&result.List)
	if err.Msg != nil {
		o.Rollback()
		return
	}
	_, err = UpsertEnvRecord(param) //写入环境评分

	if err.Msg != nil {
		o.Rollback()
		return
	}
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("progressid").SetString(strconv.FormatInt(gutils.CreateGUID(), 10))
	param.Set("progressdate").SetString(Updatetime)
	param.Set("updatetime").SetString(Updatetime)
	param.Set("RemarkType").SetString("1")
	param.Set("Remark").SetString("")
	param.Set("datastatus").SetString("1")
	param.Set("StartDate").SetString("0000-00-00")
	param.Set("SignDocuments").SetString("")
	param.Set("EndDate").SetString("0000-00-00")
	_, err = InsertOperaRecord(param) //写入记录
	if err.Msg != nil {
		o.Rollback()
		return
	}
	o.Commit()
	return
}

//签约 1  取消签约 2  重新签约 3
func DoSignUp(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	//ctype  1.签约(审核通过状态)  2.取消签约(签约状态)  3.重新签约(签约替换文件)
	//以上所有操作先判断申请是否通过状态
	var mo model.LModel
	err.Caption = "DoSignUp"
	o := orm.NewOrm()
	err.Msg = o.Begin()
	sql1 := `select * from t_clinic_apply_info a WHERE 1=1 AND a.InfoID=:InfoID AND a.UserID=:UserID AND 
             a.DentalID=:DentalID AND (a.CheckStatus="4" or a.CheckStatus="5")`
	_, err.Msg = o.RawJSON(sql1, param).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "该申请还未被通过")
		return
	}
	Updatetime := time.Now().Format("2006-01-02 15:04:05")
	ctype := param.Get("type").String()
	if ctype == "1" || ctype == "3" { //签约
		param.Set("SignID").SetString(strconv.FormatInt(gutils.CreateGUID(), 10))
		if ctype == "1" {
			param.Set("progressstatus").SetString("签约成功")
		} else {
			param.Set("progressstatus").SetString("重新签约")
		}
		param.Set("CheckStatus").SetString("5")
		param.Set("DataStatus").SetString("1")
		mo.SetORM(o)
		mo.SetTable("t_clinic_apply_sign")
		err.Msg = mo.Save(param, "ClinicID", "DentalID")
		if err.Msg != nil {
			err.Errorf(gutils.ParamError, err.Msg.Error())
			o.Rollback()
			return
		}
		//更新申请表状态
		sqll1 := `UPDATE t_clinic_apply_info AS a SET CheckStatus="5"
            WHERE 1=1 AND a.InfoID=:InfoID AND a.UserID=:UserID AND a.DentalID=:DentalID`
		_, err.Msg = o.RawJSON(sqll1, param).ValuesJSON(&result.List)
		if err.Msg != nil {
			err.Errorf(gutils.ParamError, err.Msg.Error())
			o.Rollback()
			return
		}
		//写入签约记录

		param.Set("progressid").SetString(strconv.FormatInt(gutils.CreateGUID(), 10))
		param.Set("progressdate").SetString(Updatetime)
		param.Set("updatetime").SetString(Updatetime)
		param.Set("RemarkType").SetString("2")
		param.Set("datastatus").SetString("1")
		//param.Set("Remark").SetString("")
		_, err = InsertOperaRecord(param) //写入记录
		if err.Msg != nil {
			err.Errorf(gutils.ParamError, err.Msg.Error())
			o.Rollback()
			return
		}
		o.Commit()
	} else if ctype == "2" {
		param.Set("DataStatus").SetString("0")
		//更新申请表状态
		sqll1 := `UPDATE t_clinic_apply_info AS a SET a.CheckStatus="4"
            WHERE 1=1 AND a.InfoID=:InfoID AND a.UserID=:UserID AND a.DentalID=:DentalID`
		_, err.Msg = o.RawJSON(sqll1, param).ValuesJSON(&result.List)
		if err.Msg != nil {
			err.Errorf(gutils.ParamError, err.Msg.Error())
			o.Rollback()
			return
		}
		//更新签约表
		sqll2 := `UPDATE t_clinic_apply_sign AS a SET DataStatus="0"
            WHERE 1=1  AND a.DentalID=:DentalID `
		_, err.Msg = o.RawJSON(sqll2, param).ValuesJSON(&result.List)
		if err.Msg != nil {
			err.Errorf(gutils.ParamError, err.Msg.Error())
			o.Rollback()
			return
		}
		//写入签约记录
		param.Set("progressid").SetString(strconv.FormatInt(gutils.CreateGUID(), 10))
		param.Set("progressstatus").SetString("取消签约")
		param.Set("progressdate").SetString(Updatetime)
		param.Set("updatetime").SetString(Updatetime)
		param.Set("RemarkType").SetString("2")
		param.Set("datastatus").SetString("1")
		param.Set("StartDate").SetString("0000-00-00")
		param.Set("EndDate").SetString("0000-00-00")
		//param.Set("SignDocument").SetString("")
		//param.Set("Remark").SetString("")
		_, err = InsertOperaRecord(param) //写入记录
		if err.Msg != nil {
			err.Errorf(gutils.ParamError, err.Msg.Error())
			o.Rollback()
			return
		}
		o.Commit()
	} else {
		err.Errorf(gutils.ParamError, "操作类型不符合规范")
		return
	}
	return
}

//查看
func DoViewAudit(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DoViewAudit"
	var res, res1, res2 config.LJSON
	o := orm.NewOrm()
	sql := `SELECT a.InfoID,a.DentalID,CONCAT(a.Province,a.City,a.Area,a.Address) AS addr,a.UserID,a.CreateTime,a.StarRating,
	        a.Mobile as usermobile,d.Name AS clinicname,d.ClinicID,d.Contact
            FROM t_clinic_apply_info AS a 
            LEFT JOIN t_user AS b ON b.UserID=a.UserID
            LEFT JOIN t_user AS c ON c.DentalID=a.DentalID
            LEFT JOIN t_clinic AS d ON c.UserID=d.ClinicID 
            WHERE 1=1 AND a.InfoID=:InfoID AND a.UserID=:UserID AND a.DentalID=:DentalID`
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&res1)
	sql2 := `SELECT * FROM t_package_combo b WHERE b.DataStatus="1" AND b.PackageComboID
                IN(SELECT a.PackageComboID FROM t_package_clinic a WHERE a.ClinicID=:ClinicID AND a.DataStatus=1)`
	_, err.Msg = o.RawJSON(sql2, param).ValuesJSON(&res)
	sql3 := `SELECT b.* FROM t_clinic_apply_progress b WHERE b.UserID=:UserID AND b.DataStatus=1 AND b.RemarkType="2" ORDER BY b.Updatetime DESC`
	_, err.Msg = o.RawJSON(sql3, param).ValuesJSON(&res2)
	result.List.Set("basedata").SetObject(res1)
	result.List.Set("Combo").SetObject(res)
	result.List.Set("SignHistory").SetObject(res2)
	return
}
