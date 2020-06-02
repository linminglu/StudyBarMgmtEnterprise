package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TCustomerRel struct {
	VipShareGUID    string    `orm:"column(VipShareGUID);size(50);pk"`
	CustomerID      string    `orm:"column(CustomerID);size(50)"`
	CustomerShareID string    `orm:"column(CustomerShareID);size(50)"`
	VipType         int8      `orm:"column(VipType)"`
	ChainID         string    `orm:"column(ChainID);size(50)"`
	ClinicUniqueID  string    `orm:"column(ClinicUniqueID)"`
	VipCardNO       string    `orm:"column(VipCardNO);size(50)"`
	VipCardID       string    `orm:"column(VipCardID);size(50)"`
	ShareStatus     int8      `orm:"column(ShareStatus)"`
	DataStatus      int8      `orm:"column(DataStatus)"`
	UpdateTime      time.Time `orm:"column(UpdateTime);type(timestamp);null;auto_now_add"`
	StartTime       time.Time `orm:"column(StartTime);type(timestamp);null"`
	EndTime         time.Time `orm:"column(EndTime);type(timestamp);null"`
	DisplayOrder    int       `orm:"column(DisplayOrder);null"`
	LastOperator    string    `orm:"column(LastOperator);size(10)"`
}

func (t *TCustomerRel) TableName() string {
	return "t_customer_rel"
}

func init() {
	orm.RegisterModel(new(TCustomerRel))
}
