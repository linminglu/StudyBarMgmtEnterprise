//author:  罗云鹏 17-03-15
//purpose： 运营后台－消息推送接口
package models

import (
	"doggy/gutils"
	"fmt"
	"time"

	"gopkg.in/mgo.v2/bson"

	"encoding/json"

	"strconv"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/utils/gstring"
)

// MessageDoctor 存入Mongo的结构
type MessageDoctor struct {
	ID             bson.ObjectId `bson:"_id"`
	ClinicUniqueID int64
	DoctorID       int64
	APPUserID      int64
	Duty           string
	DentalID       int
	IsRead         string
	IsClicked      string
}

// MessageDoctorString 存入Mongo的结构
type MessageDoctorString struct {
	ID             bson.ObjectId `bson:"_id"`
	ClinicUniqueID string
	DoctorID       string
	APPUserID      string
	Duty           string
	DentalID       int
	IsRead         string
	IsClicked      string
}

// MessageDental 存入Mongo的结构
type MessageDental struct {
	ID             bson.ObjectId `bson:"_id"`
	ClinicUniqueID int64
	DentalID       int
	IsRead         string
	IsClicked      string
}

// MsgDoc2Str 转变成数组
func MsgDoc2Str(doctor MessageDoctor) (doctorStr MessageDoctorString) {

	doctorStr.ID = doctor.ID
	doctorStr.ClinicUniqueID = strconv.FormatInt(doctor.ClinicUniqueID, 10)
	doctorStr.DoctorID = strconv.FormatInt(doctor.DoctorID, 10)
	doctorStr.APPUserID = strconv.FormatInt(doctor.APPUserID, 10)
	doctorStr.Duty = doctor.Duty
	doctorStr.DentalID = doctor.DentalID
	doctorStr.IsRead = doctor.IsRead
	doctorStr.IsClicked = doctor.IsClicked

	return
}

// GetAPIAPPDoctor 获取了API所需要的信息
func GetAPIAPPDoctor(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetAPIAPPDoctor"

	session := gutils.GetMongoSession()
	defer session.Close()

	db := session.DB("notify")
	var sql string

	param.Set("NowTime").SetString(time.Now().Format("2006-01-02 15:04:05"))
	notifySelected := param.Get("NotifySelected").Int64()

	imagePrefix := beego.AppConfig.String("imageprefix")
	param.Set("ImagePrefix").SetString(imagePrefix)

	if notifySelected > 0 {
		sql = `select *, concat(:ImagePrefix, MainImage) as mainimageurl from t_system_notify_to_channel 
        where NotifyID = :NotifySelected and ChannelID = :ChannelID and DateBegin <= :NowTime and DateEnd >= :NowTime and PushedTime is not null 
        order by PushedTime desc`
	} else {
		sql = `select *, concat(:ImagePrefix, MainImage) as mainimageurl from t_system_notify_to_channel 
        where ChannelID = :ChannelID and DateBegin <= :NowTime and DateEnd >= :NowTime and PushedTime is not null 
        order by PushedTime desc`
	}

	o := orm.NewOrm()
	o.Using("db_flybear")
	var channelsList config.LJSON
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&channelsList)

	//fmt.Println(channelsList.ToString())
	fmt.Println(channelsList.Interface())

	appUserID := param.Get("APPUserID").Int64()
	clinicUniqueID := param.Get("ClinicUniqueID").Int64()
	onlyUnread := param.Get("OnlyUnread").Int()
	limitNum := param.Get("LimitNum").Int()
	rowLimitNum := param.Get("RowLimitNum").Int()
	rowOffsetNum := param.Get("RowOffsetNum").Int()
	currentNum := 0

	for j := 0; j < channelsList.ItemCount(); j++ {
		channelObj := channelsList.Item(j)

		var collectionName string
		notifyID := channelObj.Get("notifyid").String()
		collectionName = "notify_pc_" + notifyID + "_" + channelObj.Get("channelid").String()
		collection := db.C(collectionName)

		existMsgs := []MessageDoctor{}
		var condition bson.M
		if appUserID == 0 {
			condition = bson.M{}
		} else {
			if onlyUnread > 0 {
				condition = bson.M{"appuserid": appUserID, "clinicuniqueid": clinicUniqueID, "isread": "N"}
			} else {
				condition = bson.M{"appuserid": appUserID, "clinicuniqueid": clinicUniqueID}
			}
		}

		totalNum, TCerr := collection.Count()
		if TCerr != nil {
			fmt.Println(TCerr.Error())
		}

		var errM error
		if rowLimitNum > 0 {
			errM = collection.Find(condition).Skip(rowOffsetNum).Limit(rowLimitNum).All(&existMsgs)
		} else {
			errM = collection.Find(condition).One(&existMsgs)
		}

		if errM != nil {
			fmt.Println(errM.Error(), "==========================")
			continue
		}

		if len(existMsgs) <= 0 {
			continue
		} else {
			stringMsgs := []MessageDoctorString{}
			for _, item := range existMsgs {
				stringmsg := MsgDoc2Str(item)
				stringMsgs = append(stringMsgs, stringmsg)
			}
			var notifyInfo config.LJSON
			param.Set("NotifyID").SetString(notifyID)
			sqlNotify := `select * from t_system_notify where notifyID = :NotifyID`
			_, err.Msg = o.RawJSON(sqlNotify, param).ValuesJSON(&notifyInfo)

			var msgInfo config.LJSON
			msgjson, _ := json.Marshal(stringMsgs)
			msgInfo.Load(string(msgjson))

			var singleNotify config.LJSON
			singleNotify.Set("MsgInfo").SetObject(msgInfo)
			singleNotify.Set("Notify").SetObject(*notifyInfo.Item(0))
			singleNotify.Set("Channel").SetObject(*channelObj)
			singleNotify.Set("MsgCount").SetInt(totalNum)
			result.List.AddItem().SetObject(singleNotify)

			for i := 0; i < len(existMsgs); i++ {
				errM = collection.Update(bson.M{"_id": existMsgs[i].ID}, bson.M{"$set": bson.M{"isread": "Y"}})
			}

			currentNum++

			if limitNum > 0 && currentNum >= limitNum {
				return
			}

		}

	}

	return result, err
}

// GetAPIPCDental 获取了API所需要的信息
func GetAPIPCDental(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetAPIPCDental"

	session := gutils.GetMongoSession()
	defer session.Close()

	db := session.DB("notify")

	param.Set("NowTime").SetString(time.Now().Format("2006-01-02 15:04:05"))

	imagePrefix := beego.AppConfig.String("imageprefix")
	param.Set("ImagePrefix").SetString(imagePrefix)

	sql := `select *, concat(:ImagePrefix, MainImage) as mainimageurl from t_system_notify_to_channel 
        where ChannelID = :ChannelID and DateBegin < :NowTime and DateEnd > :NowTime and PushedTime is not null 
        order by PushedTime desc`

	o := orm.NewOrm()
	o.Using("db_flybear")
	var channelsList config.LJSON
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&channelsList)

	fmt.Println(channelsList.ToString())

	clinicUniqueID := param.Get("ClinicUniqueID").Int64()

	for j := 0; j < channelsList.ItemCount(); j++ {
		channelObj := channelsList.Item(j)

		var collectionName string
		notifyID := channelObj.Get("notifyid").String()
		collectionName = "notify_pc_" + notifyID + "_" + channelObj.Get("channelid").String()
		collection := db.C(collectionName)

		existMsg := MessageDoctor{}
		errM := collection.Find(bson.M{"clinicuniqueid": clinicUniqueID, "isread": "N"}).One(&existMsg)

		if errM != nil {
			if errM.Error() == "not found" {
				continue
			} else {
				fmt.Println(errM.Error())
			}
		} else {
			var notifyInfo config.LJSON
			param.Set("NotifyID").SetString(notifyID)
			sqlNotify := `select * from t_system_notify where notifyID = :NotifyID`
			_, err.Msg = o.RawJSON(sqlNotify, param).ValuesJSON(&notifyInfo)

			var msgInfo config.LJSON
			msgjson, _ := json.Marshal(existMsg)
			msgInfo.Load(string(msgjson))
			result.List.Set("MsgInfo").SetObject(msgInfo)
			result.List.Set("Notify").SetObject(*notifyInfo.Item(0))
			result.List.Set("Channel").SetObject(*channelObj)

			errM = collection.Update(bson.M{"_id": existMsg.ID}, bson.M{"$set": bson.M{"isread": "Y"}})
			return
		}

	}

	return result, err
}

// GetAPIPCDoctor 获取了API所需要的信息
func GetAPIPCDoctor(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetAPIPCDoctor"

	session := gutils.GetMongoSession()
	defer session.Close()

	db := session.DB("notify")

	param.Set("NowTime").SetString(time.Now().Format("2006-01-02 15:04:05"))

	imagePrefix := beego.AppConfig.String("imageprefix")
	param.Set("ImagePrefix").SetString(imagePrefix)

	sql := `select *, concat(:ImagePrefix, MainImage) as mainimageurl from t_system_notify_to_channel 
        where ChannelID = :ChannelID and DateBegin < :NowTime and DateEnd > :NowTime and PushedTime is not null 
        order by PushedTime desc`

	o := orm.NewOrm()
	o.Using("db_flybear")
	var channelsList config.LJSON
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&channelsList)

	fmt.Println(channelsList.ToString())

	doctorID := param.Get("DoctorID").Int64()
	clinicUniqueID := param.Get("ClinicUniqueID").Int64()

	for j := 0; j < channelsList.ItemCount(); j++ {
		channelObj := channelsList.Item(j)

		var collectionName string
		notifyID := channelObj.Get("notifyid").String()
		collectionName = "notify_pc_" + notifyID + "_" + channelObj.Get("channelid").String()
		collection := db.C(collectionName)

		existMsg := MessageDoctor{}
		errM := collection.Find(bson.M{"doctorid": doctorID, "clinicuniqueid": clinicUniqueID, "isread": "N"}).One(&existMsg)

		if errM != nil {
			if errM.Error() == "not found" {
				continue
			} else {
				fmt.Println(errM.Error())
			}
		} else {
			var notifyInfo config.LJSON
			param.Set("NotifyID").SetString(notifyID)
			sqlNotify := `select * from t_system_notify where notifyID = :NotifyID`
			_, err.Msg = o.RawJSON(sqlNotify, param).ValuesJSON(&notifyInfo)

			var msgInfo config.LJSON
			msgjson, _ := json.Marshal(existMsg)
			msgInfo.Load(string(msgjson))
			result.List.Set("MsgInfo").SetObject(msgInfo)
			result.List.Set("Notify").SetObject(*notifyInfo.Item(0))
			result.List.Set("Channel").SetObject(*channelObj)

			errM = collection.Update(bson.M{"_id": existMsg.ID}, bson.M{"$set": bson.M{"isread": "Y"}})
			return
		}

	}

	return result, err
}

// APIClick 当用户点击MSG时调用该API
func APIClick(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	if param.Get("notifyid").String() == "" ||  param.Get("channelid").String() == "" ||  param.Get("messageid").String() == ""{
		return
	}
	if param.Get("recieveuser").Int() == 2 {
		o := orm.NewOrm()
		sql := "update t_system_notify_push_app set isclick=1 where NotifyID=:notifyid and ChannelID=:channelid and FuserID=:messageid "
		_,err.Msg = o.RawJSON(sql,param).Exec()
		return
	}
	err.Caption = "GetAPIPCDoctor"

	session := gutils.GetMongoSession()
	defer session.Close()

	db := session.DB("notify")

	x := param.Get("MessageID").String()
	messageID := gstring.Trim(x)
	//logs.Debug("MessageID:", x, ",after trim :", messageID)
	channelID := param.Get("ChannelID").String()
	notifyID := param.Get("NotifyID").String()

	var collectionName string
	collectionName = "notify_pc_" + notifyID + "_" + channelID
	collection := db.C(collectionName)

	errM := collection.Update(bson.M{"_id": bson.ObjectIdHex(messageID)}, bson.M{"$set": bson.M{"isclicked": "Y"}})

	if errM != nil {
		err.Errorf(gutils.ParamError, errM.Error())
		return
	}

	return result, err
}

// GetNotifyURL 得到重定向链接
func GetNotifyURL(id string) (url string, err gutils.LError) {

	var param config.LJSON
	param.Set("NotifyID").SetString(id)

	o := orm.NewOrm()
	o.Using("db_flybear")
	var notinfo config.LJSON
	sql := `select * from t_system_notify where NotifyID = :NotifyID`
	_, errD := o.RawJSON(sql, param).ValuesJSON(&notinfo)

	if errD != nil {
		err.Errorf(gutils.ParamError, errD.Error())
		return
	}

	url = notinfo.Item(0).Get("DetailUrl").String()
	return
}

//获取PC服务器弹窗相关信息
func GetNotifyPopup(id string) (result gutils.LResultModel, err gutils.LError) {
	var param config.LJSON
	param.Set("NotifyID").SetString(id)
	o := orm.NewOrm()
	o.Using("db_flybear")
	sql := `select mainimage from t_system_notify_to_channel where NotifyID = :NotifyID and channelID = 13 `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	return result, err
}
