package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TSmsSend struct {
	Id         int       `orm:"column(SMSSendGuid);pk"`
	ClinicID   string    `orm:"column(clinicID);size(64)"`
	MSGType    int8      `orm:"column(MSGType)"`
	Content    string    `orm:"column(content);size(300);null"`
	MsgCount   int8      `orm:"column(msgCount);null"`
	Mobile     string    `orm:"column(mobile)"`
	Msgid      string    `orm:"column(msgid);size(30);null"`
	CreateDate time.Time `orm:"column(createDate);type(datetime);null"`
	Senddate   time.Time `orm:"column(senddate);type(datetime);null"`
	SendStatus int       `orm:"column(SendStatus);null"`
	ErrorMsg   string    `orm:"column(ErrorMsg);size(128);null"`
}

func (t *TSmsSend) TableName() string {
	return "t_sms_send"
}

func init() {
	orm.RegisterModel(new(TSmsSend))
}
