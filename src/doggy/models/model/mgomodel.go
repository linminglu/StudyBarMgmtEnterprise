//author:  曾文 2017-01-13
//purpose： 统计数据到mongodb相关操作
package model

import (
	"doggy/gutils"
	"fmt"
	"strings"
	"time"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
	mgo "gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

var RefreshAll bool = false

//var RefreshClinic bool = false
var RefreshBeginDate = ""

func PipeExce(pipe *mgo.Pipe, result *config.LJSON) (err error) {
	iter := pipe.Iter()
	var r []map[string]interface{}

	err = iter.All(&r)
	if err == nil {
		result.LoadFrom(&r)
	}
	return
}

func StatToday(param config.LJSON, sfunc func(param config.LJSON) (result gutils.LResultModel, err gutils.LError), statname string, keysWhere string) (err error) {
	clinicid := param.Get("data").Get("clinicid").String() //诊所ID
	if clinicid == "" {
		err = fmt.Errorf("%s", "clinicid不能为空!")
		return
	}
	edate := param.Get("data").Get("enddate").String()
	if edate != "" {
		e := gutils.DateStrToTime(edate)
		if e.Before(time.Now()) {
			return
		}
	} else {
		edate = gutils.TimeToDateStr(time.Now().AddDate(0, 0, 1))
	}

	cidlist := strings.Replace(clinicid, "'", "", -1)
	cl := strings.Split(cidlist, ",")
	session := gutils.GetMongoSession()
	defer session.Close()
	c := session.DB(gutils.MG_KOALA).C(statname)

	begindate := gutils.TimeToDateStr(time.Now())
	//enddate := gutils.TimeToDateStr(time.Now().AddDate(0, 0, 1))

	var param1 config.LJSON
	param1.Set("data").Set("clinicid").SetString(clinicid)
	param1.Set("data").Set("begindate").SetString(begindate)
	param1.Set("data").Set("enddate").SetString(edate)
	param1.Set("data").Set("stattoday").SetString("1")

	start := time.Now()
	result, er := sfunc(param1)
	if er.Msg != nil {
		err = fmt.Errorf("%s", "查询失败!"+er.Msg.Error())
		return
	}

	dis := time.Now().Sub(start).Seconds()
	if dis > 2 {
		beego.Info("查询MYSQL", dis, statname)
	}
	if keysWhere == "" {
		keysWhere = "clinicuniqueid,date"
	}
	datefield := "date"
	if strings.Contains(keysWhere, "studydate") {
		datefield = "studydate"
	}

	//先删除这个时间范围内诊所的数据
	start = time.Now()
	t := gutils.DateStrToTime(begindate)
	e := gutils.DateStrToTime(edate)
	for x := 0; x < len(cl); x++ {
		var m2 map[string]interface{}
		m2 = make(map[string]interface{})
		m2["clinicuniqueid"] = cl[x]
		m2[datefield] = bson.M{"$gte": t, "$lt": e}
		fmt.Println(m2)
		//if result.List.ItemCount() > 0 {
		_, err := c.RemoveAll(m2)
		if err != nil {
			println(err.Error())
		}
		//}
	}

	dis = time.Now().Sub(start).Seconds()
	if dis > 1 {
		beego.Info("删除MONGO", dis, statname)
	}

	start = time.Now()
	for i := 0; i < result.List.ItemCount(); i++ {
		err = c.Insert(result.List.Item(i).Interface())
	}
	dis = time.Now().Sub(start).Seconds()
	if dis > 1 {
		beego.Info("插入MONGO", dis, statname)
	}
	limiter := time.Tick(time.Millisecond * 20) //删除数据生重新插入,延时一定时间,要不查不到新插入的数据
	<-limiter                                   //延时20毫秒
	return
}

//取最后统计时间
func GetLastDate(clinicid string, statname string) string {
	if RefreshAll == true {
		return ""
	}
	//if RefreshClinic == true {
	//	return ""
	//}

	session := gutils.GetMongoSession()
	defer session.Close()
	s := fmt.Sprintf("%s_token", statname)
	c := session.DB(gutils.MG_KOALA).C(s)
	m := bson.M{"clinicid": clinicid, "statname": statname}
	query := c.Find(m)
	i, _ := query.Count()
	lastdate := ""
	if i > 0 {
		var m1 map[string]string
		m1 = make(map[string]string)
		e := query.One(m1)
		if e != nil {
			print(e.Error())
		}
		lastdate = m1["enddate"]
	}

	if RefreshBeginDate != "" {
		t := gutils.DateStrToTime(RefreshBeginDate)
		if t.Before(gutils.DateStrToTime(lastdate)) {
			lastdate = RefreshBeginDate
		}
	}

	return lastdate
}

//更新最后统计时间
func UpdateToken(clinicid string, statname string, enddate string) (err error) {
	session := gutils.GetMongoSession()
	defer session.Close()

	if enddate == "" {
		enddate = time.Now().Format("2006-01-02")
	}
	//更新诊所刷新时间
	var updatejs config.LJSON
	updatejs.Set("clinicid").SetString(clinicid)
	updatejs.Set("enddate").SetString(enddate)
	updatejs.Set("statname").SetString(statname)
	s := fmt.Sprintf("%s_token", statname)
	c := session.DB(gutils.MG_KOALA).C(s)

	m := bson.M{"clinicid": clinicid, "statname": statname}

	query := c.Find(m)
	i, _ := query.Count()
	if i == 0 {
		err = c.Insert(updatejs.Interface())
	} else {
		err = c.Update(m, updatejs.Interface())
	}

	if err != nil {
		println(err.Error())
	}
	return err
}

func Stat(param config.LJSON, sfunc func(param config.LJSON) (result gutils.LResultModel, err gutils.LError), statname string, keysWhere string) (err error) {
	clinicid := param.Get("data").Get("clinicid").String() //诊所ID
	if clinicid == "" {
		err = fmt.Errorf("%s", "clinicid不能为空!")
		return
	}

	o := orm.NewOrm()
	o.Using("db_koala")

	lastdate := GetLastDate(clinicid, statname)
	if lastdate == "" {
		var js config.LJSON
		sql := ` select ExamDate from t_study t where t.clinicuniqueid = ?  and examdate>='2001-01-01' order by examdate limit 1 `
		_, err = o.Raw(sql, clinicid).ValuesJSON(&js)

		if err != nil || js.ItemCount() == 0 || js.Item(0).Get("examdate").String() == "" {
			err = fmt.Errorf("%s", "获取最后更新时间失败!")
			return
		}
		lastdate = gutils.SubString(js.Item(0).Get("examdate").String(), 0, 10)
	}
	t := gutils.DateStrToTime(lastdate)
	if t.Before(gutils.DateStrToTime("2000-01-01")) {
		t = gutils.DateStrToTime("2000-01-01")
	}

	if param.Get("data").Get("diff").IsNULL() {
		t = gutils.TimeAddDay(t, -15)
	} else {
		diff := param.Get("data").Get("diff").Int()
		if diff <= 0 {
			diff = 15
		}
		t = gutils.TimeAddDay(t, 0-diff)
	}

	e := t
	session := gutils.GetMongoSession()
	defer session.Close()
	c := session.DB(gutils.MG_KOALA).C(statname)
	c.EnsureIndexKey("clinicuniqueid")
	//先删除这个时间范围内诊所的数据
	if keysWhere == "" {
		keysWhere = "clinicuniqueid,date"
	}
	datefield := "date"
	if strings.Contains(keysWhere, "studydate") {
		datefield = "studydate"
	}
	c.EnsureIndexKey("clinicuniqueid", datefield)

	for {
		//每次查询20天,直到当天为止
		if t.After(time.Now()) {
			break
		}

		e = gutils.TimeAddDay(t, 20)
		if e.After(time.Now()) {
			e = time.Now()
			e = gutils.TimeAddDay(e, 1)
		}

		begindate := gutils.TimeToDateStr(t)
		enddate := gutils.TimeToDateStr(e)

		fmt.Println(clinicid + " " + statname + " " + begindate + " " + enddate)
		param.Set("data").Set("begindate").SetString(begindate)
		param.Set("data").Set("enddate").SetString(enddate)

		result, er := sfunc(param)
		if er.Msg != nil {
			err = fmt.Errorf("%s", "查询失败!"+er.Msg.Error())
			return
		}

		var m2 map[string]interface{}
		m2 = make(map[string]interface{})
		m2["clinicuniqueid"] = clinicid
		m2[datefield] = bson.M{"$gte": t, "$lt": e} // tt //  result.List.Item(i).Get(datefield).Time()
		_, err := c.RemoveAll(m2)
		if err != nil {
			println(err.Error())
			break
		}

		for i := 0; i < result.List.ItemCount(); i++ {
			tmp := strings.Split(keysWhere, ",")
			var m1 map[string]interface{}
			cid := "-1"
			m1 = make(map[string]interface{})
			for x := 0; x < len(tmp); x++ {
				if tmp[x] == "date" || tmp[x] == "studydate" {
					m1[tmp[x]] = result.List.Item(i).Get(tmp[x]).Time()
				} else {
					m1[tmp[x]] = result.List.Item(i).Get(tmp[x]).String()
				}

				if tmp[x] == "clinicuniqueid" {
					cid = result.List.Item(i).Get(tmp[x]).String()
				} else {
					c.EnsureIndexKey(tmp[x])
				}
			}

			if cid == "" { //表示关键字有clinicuniqueid 但为空
				break
			}
			query := c.Find(m1)
			j, _ := query.Count()
			if j == 0 {
				err = c.Insert(result.List.Item(i).Interface())
			} else {
				err = c.Update(m1, result.List.Item(i).Interface())
			}
			lastdate = result.List.Item(i).Get("date").String()
			if err != nil {
				println(err.Error())
				break
			}
		}
		UpdateToken(clinicid, statname, gutils.TimeToDateStr(e))
		t = e
	}
	//更新诊所刷新时间
	UpdateToken(clinicid, statname, gutils.DateStr())
	return
}

// LoadClinicList 获取专业版诊所列表
func ClinicList() (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "LoadClinicList"
	var param config.LJSON
	t := gutils.TimeAddDay(time.Now(), -5)
	tname := t.Format("db_log.t_new_stastics_20060102")
	ct := t.Format("2006-01-02")
	sql := `SELECT   ClinicID,c.Name  FROM   t_clinic c LEFT JOIN t_user u ON c.ClinicID = u.UserID 
	LEFT JOIN ` + tname + ` l on l.userid = c.clinicid 
	 WHERE  u.Version  LIKE '%.%.900.%' 
	 and (  l.uploadday > 0  or c.CreateTime>'` + ct + `') 
	 order by u.Version desc `

	o := orm.NewOrm()
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)

	if err.Msg != nil {
		sql = `SELECT   ClinicID,c.Name  FROM   t_clinic c LEFT JOIN t_user u ON c.ClinicID = u.UserID 
		WHERE  u.Version LIKE '%.%.900.%'  order by u.Version desc`
		_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	}
	return result, err
}

// ClinicListStd 获取标准版诊所列表
func ClinicListStd(allclinic int) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ClinicListStd"
	var param config.LJSON
	var sql string
	if allclinic == 1 {
		t := gutils.TimeAddDay(time.Now(), -5)
		tname := t.Format("db_log.t_new_stastics_20060102")
		ct := t.Format("2006-01-02")
		sql = `SELECT   ClinicID,c.Name  FROM   t_clinic c LEFT JOIN t_user u ON c.ClinicID = u.UserID 
		LEFT JOIN ` + tname + ` l on l.userid = c.clinicid 
		 WHERE  u.Version not LIKE '%.%.900.%'  
		 and (  l.uploadday > 0  or c.CreateTime>'` + ct + `') 
		 order by u.Version desc `

	} else if allclinic == 2 {
		sql = `SELECT   ClinicID,c.Name  FROM   t_clinic c LEFT JOIN t_user u ON c.ClinicID = u.UserID 
		WHERE  u.Version not LIKE '%.%.900.%' and c.DataStatus = 1  order by u.Version desc `
	} else {
		sql = `SELECT   ClinicID,c.Name  FROM   t_clinic c LEFT JOIN t_user u ON c.ClinicID = u.UserID
		 WHERE  u.Version not LIKE '%.%.900.%' and c.DataStatus = 1  AND  clinicid NOT IN ( SELECT clinicid FROM t_refreshclinic) order by u.Version desc
		  `
	}
	/*


			SELECT   ClinicID,c.Name  FROM   t_clinic c LEFT JOIN t_user u ON c.ClinicID = u.UserID
				 WHERE  u.Version not LIKE '%.%.900.%' and c.DataStatus = 1
				 and (c.ClinicID  in (select userid from  ` + tname + `) or c.CreateTime>'`+ ct +`')
				 order by u.Version desc


			sELECT   c.ClinicID,c.Name,l.count  FROM   t_clinic c
		LEFT JOIN t_user u ON c.ClinicID = u.UserID
		left join  db_log.t_log_count_20171017  l on l.clinicid = c.ClinicID and l.funcid='3600'
				 WHERE  u.Version not LIKE '%.%.900.%' and c.DataStatus = 1
				 and (c.ClinicID  in (select userid from  db_log.t_new_stastics_20171017) or c.createtime> '2017-10-16' )
				 group by c.ClinicID
				 order by l.count desc, u.Version desc



				 sELECT   c.ClinicID,c.Name FROM   t_clinic c
		LEFT JOIN t_user u ON c.ClinicID = u.UserID
		left join  db_log.t_new_stastics_20171017 l on l.userid = c.clinicid
				 WHERE  u.Version not LIKE '%.%.900.%' and c.DataStatus = 1
				 and ( l.uploadday > 0 or c.createtime> '2017-10-16' )
				 group by c.ClinicID
				 order by  u.Version desc
		;
		;
	*/

	o := orm.NewOrm()
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)

	if allclinic == 1 && err.Msg != nil {
		sql = `SELECT   ClinicID,c.Name  FROM   t_clinic c LEFT JOIN t_user u ON c.ClinicID = u.UserID 
		WHERE  u.Version not LIKE '%.%.900.%' and c.DataStatus = 1  order by u.Version desc `
		_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	}
	return result, err
}

// NeedStatClinic 获取需要刷新的诊所
func NeedStatClinic(clinictype string) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "NeedStatClinic"
	var param config.LJSON
	var sql string
	sql = ` select * from t_appstat s where s.DataStatus=0 order by updatetime `
	o := orm.NewOrm()
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	return result, err
}

func UpdateNeddStat(clinicid string) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UpdateNeddStat"
	sql := ` update t_appstat set datastatus=1 where clinicid =? `
	o := orm.NewOrm()
	_, err.Msg = o.Raw(sql, clinicid).Exec()
	return result, err
}

func AddRefClinic(clinicid string) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AddRefClinic"
	sql := `insert into  t_refreshclinic(clinicid) values(?)   `
	o := orm.NewOrm()
	_, err.Msg = o.Raw(sql, clinicid).Exec()
	return result, err
}

func CheckCliniDeltePat(clinicid string) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CheckCliniDeltePat"
	o := orm.NewOrm()
	sql := ` select * from db_flybear.t_webstat w where w.ClinicID=? and w.DataStatus =0 `
	_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&result.List)
	if result.List.ItemCount() > 0 {
		sql = ` update db_flybear.t_webstat set DataStatus=1 where ClinicID=? `
		o.Raw(sql, clinicid).Exec()

		sql = ` select ExamDate as CreateTime from db_koala.t_study t where t.clinicuniqueid = ?  and examdate>='2001-01-01' order by examdate limit 1 `
		_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&result.List)

		return
	}
	e := time.Now()
	t := gutils.TimeAddDay(e, -1)
	begindate := gutils.TimeToStr(t)
	enddate := gutils.TimeToStr(e)
	sql = ` select c.CustomerID ,c.UpdateTime, date(c.CreateTime) CreateTime  from db_koala.t_customer c where c.ClinicUniqueID =? and c.DataStatus=0 and c.UpdateTime >=? and c.UpdateTime <?  order by c.CreateTime   `

	_, err.Msg = o.Raw(sql, clinicid, begindate, enddate).ValuesJSON(&result.List)
	return result, err
}

func CheckCliniUpdateBill(clinicid string) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CheckCliniUpdateBill"
	e := time.Now()
	t := gutils.TimeAddDay(e, -1)
	begindate := gutils.TimeToStr(t)
	enddate := gutils.TimeToStr(e)
	sql := ` SELECT  Date(c.BillDate) BillDate  
		FROM db_koala.t_billinfo c 
		WHERE c.ClinicUniqueID =? AND c.DiscountFee>0 AND c.DisChargeFee>0  AND c.billdate< ? AND c.UpdateTime >= ? AND c.UpdateTime <?
		ORDER BY c.billdate   `
	o := orm.NewOrm()
	_, err.Msg = o.Raw(sql, clinicid, begindate, begindate, enddate).ValuesJSON(&result.List)
	return result, err
}

//取最的更新检查表的时间
func GetLastStudyTime(clinicid string) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "CheckLastStudyTime"
	sql := `  select * from t_study s where s.ClinicUniqueID =? order by s.UpdateTime desc limit 1    `
	o := orm.NewOrm()
	o.Using("db_koala")
	_, err.Msg = o.Raw(sql, clinicid).ValuesJSON(&result.List)
	return result, err
}

//患者信息有修改时,刷新已有数据中相应的姓名 ID
func UpdatePatInfo(clinicid string) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "UpdatePatInfo"
	e := time.Now()
	t := gutils.TimeAddDay(e, -1)
	begindate := gutils.TimeToStr(t)
	enddate := gutils.TimeToStr(e)
	sql := ` select c.Name,c.CustomerID,c.PatientID from db_koala.t_customer c where c.ClinicUniqueID =? and c.DataStatus=1 and c.UpdateTime >=? and c.UpdateTime <? and  date(c.CreateTime) <> date(c.UpdateTime) `
	o := orm.NewOrm()
	_, err.Msg = o.Raw(sql, clinicid, begindate, enddate).ValuesJSON(&result.List)
	if err.Msg != nil {
		return
	}
	session := gutils.GetMongoSession()
	defer session.Close()
	c := session.DB(gutils.MG_KOALA).C("DaysReport")
	c1 := session.DB(gutils.MG_KOALA).C("ChargeOperList")
	for i := 0; i < result.List.ItemCount(); i++ {
		customerid := result.List.Item(i).Get("customerid").String()
		name := result.List.Item(i).Get("name").String()
		patientid := result.List.Item(i).Get("patientid").String()
		m1 := bson.M{"clinicuniqueid": clinicid, "customerid": customerid}
		m2 := bson.M{"$set": bson.M{"name": name, "patientid": patientid}}
		c.Update(m1, m2)
		c1.Update(m1, m2)
	}
	return result, err
}
