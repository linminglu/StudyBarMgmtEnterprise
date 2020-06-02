package models

import (
	"doggy/gutils"
	"fmt"

	"strings"
	"time"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

func SearchData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SearchData"
	condition := param.Get("condition").String() //手机号/管家号/诊所名
	startdate := param.Get("startdate").String()
	enddate := param.Get("enddate").String()
	status := param.Get("status").String()
	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()
	sql := `select * from t_djd_apply_info where datastatus=1 `

	if condition != "" {
		sql = fmt.Sprintf("%s and (clinicmobile like '%%%s%%' or dentalid like '%%%s%%' or clinicname like '%%%s%%' ) ", sql, condition, condition, condition)
	}

	if startdate != "" {
		sql = fmt.Sprintf("%s and createtime > '%s' ", sql, startdate)
	}

	if enddate != "" {
		sql = fmt.Sprintf(" %s and createtime < '%s' ", sql, enddate)
	}
	fmt.Println("status:" + status)
	if status != "" {

		if status == "0" || status == "未处理" {
			sql = sql + " and checkstatus=0 "
		} else if status == "1" || status == "已通过" {
			sql = sql + " and checkstatus=1 "
		} else if status == "2" || status == "未达标" {
			sql = sql + " and checkstatus=2  "
		} else if status == "3" || status == "已拒绝" {
			sql = sql + " and checkstatus=3 "
		}
	}

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql = fmt.Sprintf(" %s order by createtime desc ", sql)

	if param.Get("fieldName").Interface() == nil {
		sql = fmt.Sprintf("%s LIMIT %d,%d", sql, perpage*(page-1), perpage)
	}

	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.List.SetColumnFormat("maxmoney", "1,234.56")
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func SearchData1(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SearchData"
	condition := param.Get("condition").String() //手机号/管家号/诊所名
	startdate := param.Get("startdate").String()
	enddate := param.Get("enddate").String()
	status := param.Get("status").String()
	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()
	sql := `select clinicmobile,dentalid,clinicname,maxmoney,items,
			case checkstatus when 0 then '未处理' when 1 then '已通过' when 2 then '未达标' when 3 then '已拒绝' else '未处理' end as checkstatus,
			createtime from t_djd_apply_info where datastatus=1 `

	if condition != "" {
		sql = fmt.Sprintf("%s and (clinicmobile like '%%%s%%' or dentalid like '%%%s%%' or clinicname like '%%%s%%' ) ", sql, condition, condition, condition)
	}

	if startdate != "" {
		sql = fmt.Sprintf("%s and createtime > '%s' ", sql, startdate)
	}

	if enddate != "" {
		sql = fmt.Sprintf(" %s and createtime < '%s' ", sql, enddate)
	}
	if status != "" {

		if status == "0" || status == "未处理" {
			sql = sql + " and checkstatus=0 "
		} else if status == "1" || status == "已通过" {
			sql = sql + " and checkstatus=1 "
		} else if status == "2" || status == "未达标" {
			sql = sql + " and checkstatus=2  "
		} else if status == "3" || status == "已拒绝" {
			sql = sql + " and checkstatus=3 "
		}
	}

	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}
	sql = fmt.Sprintf(" %s order by createtime desc ", sql)

	if param.Get("fieldName").Interface() == nil {
		sql = fmt.Sprintf("%s LIMIT %d,%d", sql, perpage*(page-1), perpage)
	}

	_, err.Msg = o.Raw(sql).ValuesJSON(&result.List)
	result.List.SetColumnFormat("maxmoney", "1,234.56")
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}
func DelData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DelData"

	infoid := param.Get("infoid").String()
	if infoid == "" {
		err.Errorf(gutils.ParamError, "记录ID不能为空")
		return
	}
	o := orm.NewOrm()
	now := time.Now().Format("2006-01-02 15:04:05")
	_, err.Msg = o.Raw(" update t_djd_apply_info set datastatus=0,updatetime=? where infoid=? ", now, infoid).Exec()
	return result, err
}

func RemoveData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "RemoveData"

	infoid := param.Get("infoid").String()
	if infoid == "" {
		err.Errorf(gutils.ParamError, "记录ID不能为空")
		return
	}
	o := orm.NewOrm()
	//人工失败
	now := time.Now().Format("2006-01-02 15:04:05")
	_, err.Msg = o.Raw(" update t_djd_apply_info set checkstatus=3,remark='条件不符',updatetime=? where infoid=? ", now, infoid).Exec()
	return result, err
}

//判断网页跳转的函数
func DataDetailPage(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DataDetailPage"
	infoid := param.Get("infoid").String()
	if infoid == "" {
		err.Errorf(gutils.ParamError, "记录ID不能为空")
		return
	}
	o := orm.NewOrm()
	sql := ` select checkstatus from t_djd_apply_info where infoid=? and datastatus=1 `

	_, err.Msg = o.Raw(sql, infoid).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "申请信息不存在")
		return
	}
	return result, err
}

//度金贷 经营流水
func getStatData(begintime, endtime time.Time, clinicid string) (result config.LJSON) {
	return result
	o := orm.NewOrm()
	o.Using("db_koala")
	var res config.LJSON
	sql := " select version from db_flybear.t_user where userid=? "
	o.Raw(sql, clinicid).ValuesJSON(&res)
	version := res.Item(0).Get("version").String()
	isPro := strings.Contains(version, "900")

	stime := begintime.Format("2006-01-02 15:04:05")
	etime := endtime.Format("2006-01-02 15:04:05")
	result.Set("recorddate").SetString(begintime.Format("2006-01"))
	//微信
	sql = ` select sum(ifnull(total_fee,0)) as totalfee from db_flybear.t_weixin_order where datastatus=1 and bkdatastatus=1 and clinicid=?
	 		and createtime between ? and ? `

	o.Raw(sql, clinicid, stime, etime).ValuesJSON(&res)
	result.Set("wxfee").SetDouble(res.Item(0).Get("totalfee").Double() / 100.00)
	//支付宝
	sql = ` select sum(round(t_alipay_order,2)) as totalfee from db_flybear.t_alipay_order where datastatus=1 and bkdatastatus=1 and clinicid=? 
		and createtime between ? and ? `
	o.Raw(sql, clinicid, stime, etime).ValuesJSON(&res)
	result.Set("alifee").SetDouble(res.Item(0).Get("totalfee").Double())

	//实收
	if isPro {
		sql = `select sum(ifnull(p.payfee,0)) as payfee from t_pay p inner join t_billinfo b on p.billidentity=b.billidentity and b.datastatus=1   
		 and p.clinicuniqueid=b.clinicuniqueid 
		 inner join t_customer c on b.BillPatIdentity=c.customerid and b.clinicuniqueid=c.clinicuniqueid and c.datastatus=1 
		 where p.paystate<>900 and p.clinicuniqueid=? and p.datastatus=1 and p.PayDate between ? and ? `
	} else {
		sql = ` select sum(b.paidfee) as payfee from t_bill b 
		 inner join t_customer c on b.customerid=c.customerid and c.datastatus=1 and b.clinicuniqueid=c.clinicuniqueid 
		 where b.clinicuniqueid=? and b.date between ? and ? and b.datastatus=1 
		 and (b.state=1 or b.state=2 or b.state=3)  `
	}
	o.Raw(sql, clinicid, stime, etime).ValuesJSON(&res)
	result.Set("monthfee").SetDouble(res.Item(0).Get("payfee").Double())

	//就诊人次
	sql = `  SELECT SUM(1) AS visitcount 
					 FROM ( 
					 SELECT cus.ClinicUniqueID 
					 FROM t_customer cus 
					 INNER JOIN t_study s ON cus.customerid=s.customerid AND cus.clinicuniqueid=s.clinicuniqueid AND  s.datastatus=1 
					 and s.DoctorIDExam<>'0' AND c.DataStatus=1  AND LENGTH(TRIM(s.ISFirstVisit))>0
					 WHERE cus.ClinicUniqueID=? AND cus.datastatus=1 AND s.ExamDate between ? and ? 
					 GROUP BY s.customerid, DATE,s.doctoridexam) a `
	o.Raw(sql, clinicid, stime, etime).ValuesJSON(&res)
	visitcount := res.Item(0).Get("visitcount").Int()
	result.Set("patient").SetInt(visitcount)

	//患者人均频率
	sql = ` SELECT SUM(1) AS visitcount 
					 FROM ( 
					 SELECT cus.ClinicUniqueID 
					 FROM t_customer cus 
					 INNER JOIN t_study s ON cus.customerid=s.customerid AND cus.clinicuniqueid=s.clinicuniqueid AND  s.datastatus=1 
					 AND c.DataStatus=1  AND LENGTH(TRIM(s.ISFirstVisit))>0
					 WHERE cus.ClinicUniqueID=? AND cus.datastatus=1 AND s.ExamDate between ? and ? 
					 GROUP BY s.customerid, DATE) a`
	patientnum := res.Item(0).Get("visitcount").Int()
	if patientnum == 0 {
		result.Set("patientrate").SetInt(0)
	} else {
		result.Set("patientrate").SetInt(int(visitcount / patientnum))
	}

	//登录次数
	sql = ` select sum(1) as count from db_image.t_loginlog where clinicguid=? and actionname='login' and updatetime between ? and ? `
	o.Raw(sql, clinicid, stime, etime).ValuesJSON(&res)
	result.Set("login").SetInt(res.Item(0).Get("count").Int())

	//新增患者
	sql = ` select sum(1) as count from t_customer where clinicuniqueid=? and CreateTime between ? and ? and datastatus=1 `
	o.Raw(sql, clinicid, stime, etime).ValuesJSON(&res)
	result.Set("addcustomer").SetInt(res.Item(0).Get("count").Int())

	//预约量
	sql = `  select sum(1) as count  from t_schedule 
	 		 where clinicuniqueid=? and starttime between ? and ? and datastatus=1 `
	o.Raw(sql, clinicid, stime, etime).ValuesJSON(&res)
	result.Set("schedule").SetInt(res.Item(0).Get("count").Int())
	//库房出库金额
	sql = ` select sum(ifnull(StockOutTotal,0)) as num from t_stockoutmain where clinicuniqueid=? and StockOutDate between ? and ? and OutIsDeleted=0 `
	o.Raw(sql, clinicid, stime, etime).ValuesJSON(&res)
	result.Set("stockoutfee").SetDouble(res.Item(0).Get("num").Double())
	return result

}

func GetDataDetail(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetDataDetail"
	infoid := param.Get("infoid").String()
	if infoid == "" {
		err.Errorf(gutils.ParamError, "记录ID不能为空")
		return
	}
	o := orm.NewOrm()
	sql := ` select d.*,c.contact,concat(c.ClinicProvince,c.ClinicCity,c.ClinicArea,c.Address) as clinicaddress,
			c.phone as clinicphone 
			 from t_djd_apply_info d inner join t_clinic c on d.clinicid=c.clinicid 
			where d.infoid=? and d.datastatus=1 `
	var obj config.LJSON
	_, err.Msg = o.Raw(sql, infoid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "申请信息不存在")
		return
	}
	clinicid := obj.Item(0).Get("clinicid").String()
	result.List.Set("applyinfo").SetObject(obj)
	clinicinfo := result.List.Set("clinicinfo")
	//当前时间
	nowtime := time.Now()
	//当月的月初
	begintime := time.Date(nowtime.Year(), nowtime.Month(), 1, 0, 0, 0, 0, time.UTC)

	//终止时间  往前推5个月
	endtime := begintime.AddDate(0, -5, 0)
	i := 0
	for begintime.After(endtime) || begintime.Equal(endtime) {
		if i == 0 {
			clinicinfo.AddItem().SetObject(getStatData(begintime, nowtime, clinicid))
			i++
		} else {
			clinicinfo.AddItem().SetObject(getStatData(begintime, begintime.AddDate(0, 1, 0), clinicid))
		}
		begintime = begintime.AddDate(0, -1, 0)
	}

	return result, err
}

func ModifyDetailData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ModifyDetailData"
	infoid := param.Get("infoid").String()
	if infoid == "" {
		err.Errorf(gutils.ParamError, "记录ID不能为空")
		return
	}
	o := orm.NewOrm()
	updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("updatetime").SetString(updatetime)
	sql := ` update t_djd_apply_info set clinicname=:clinicname,applyerrole=:applyerrole,applyername=:applyername,applyermobile=:applyermobile,idnumber=:idnumber,
				idcardfrontpic=:idcardfrontpic,idcardreversepic=:idcardreversepic,licenseid=:licenseid,licensepic=:licensepic,updatetime=:updatetime,items=:items,
				maxmoney=:maxmoney where infoid=:infoid `
	_, err.Msg = o.RawJSON(sql, param).Exec()
	return result, err
}

func PassData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "PassData"
	infoid := param.Get("infoid").String()
	if infoid == "" {
		err.Errorf(gutils.ParamError, "记录ID不能为空")
		return
	}
	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select checkstatus from t_djd_apply_info where infoid=? and datastatus=1 `
	_, err.Msg = o.Raw(sql, infoid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "申请记录不存在")
		return
	}

	checkstatus := obj.Item(0).Get("checkstatus").Int()
	if checkstatus == 1 {
		err.Errorf(gutils.ParamError, "记录已通过审核")
		return
	}
	updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("updatetime").SetString(updatetime)
	sql = ` update t_djd_apply_info set checkstatus=1,remark='',updatetime=:updatetime,items=:items,maxmoney=:maxmoney,isimport=1 where infoid=:infoid `
	_, err.Msg = o.RawJSON(sql, param).Exec()
	return result, err
}

func RefuseData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "RefuseData"
	infoid := param.Get("infoid").String()
	if infoid == "" {
		err.Errorf(gutils.ParamError, "记录ID不能为空")
		return
	}
	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select checkstatus from t_djd_apply_info where infoid=? and datastatus=1 `
	_, err.Msg = o.Raw(sql, infoid).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "申请记录不存在")
		return
	}

	checkstatus := obj.Item(0).Get("checkstatus").Int()
	if checkstatus == 3 {
		err.Errorf(gutils.ParamError, "已人工拒绝")
		return
	}
	updatetime := time.Now().Format("2006-01-02 15:04:05")
	param.Set("updatetime").SetString(updatetime)
	sql = ` update t_djd_apply_info set checkstatus=3,updatetime=:updatetime,remark=:remark where infoid=:infoid `
	_, err.Msg = o.RawJSON(sql, param).Exec()
	return result, err
}
