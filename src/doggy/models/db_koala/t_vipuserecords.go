package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TVipuserecords struct {
	Id              int       `orm:"column(RecordsIdentity);pk"`
	ChainID         string    `orm:"column(ChainID);size(20);null"`
	VipGiftRecordId string    `orm:"column(VipGiftRecordId);size(20);null"`
	VipCardId       string    `orm:"column(VipCardId);size(20);null"`
	CustomerId      string    `orm:"column(CustomerId);size(20);null"`
	Doctors         string    `orm:"column(Doctors);size(20);null"`
	Nurse           string    `orm:"column(Nurse);size(20);null"`
	Consultant      string    `orm:"column(Consultant);size(20);null"`
	UsageDate       time.Time `orm:"column(UsageDate);type(datetime);null"`
	RemCount        int       `orm:"column(RemCount);null"`
	DataStatus      int       `orm:"column(DataStatus);null"`
	Updatetime      time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	ClinicUniqueID  string    `orm:"column(ClinicUniqueID);size(20)"`
	LastOperator    string    `orm:"column(LastOperator);size(10);null"`
}

func (t *TVipuserecords) TableName() string {
	return "t_vipuserecords"
}

func init() {
	orm.RegisterModel(new(TVipuserecords))
}
