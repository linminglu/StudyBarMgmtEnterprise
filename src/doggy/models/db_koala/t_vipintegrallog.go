package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TVipintegrallog struct {
	ClinicUniqueID  string    `orm:"column(ClinicUniqueID);size(40)"`
	Id              int       `orm:"column(VipIntLogIdentity);pk"`
	Integral        int       `orm:"column(Integral);null"`
	TotalIntegral   int       `orm:"column(TotalIntegral);null"`
	PayFee          float64   `orm:"column(PayFee);null"`
	IntegralType    int       `orm:"column(IntegralType);null"`
	IntegralMemo    string    `orm:"column(IntegralMemo);null"`
	IntegralDate    time.Time `orm:"column(IntegralDate);type(datetime);null"`
	RelateIdentity  string    `orm:"column(RelateIdentity);size(20);null"`
	VipCardIdentity string    `orm:"column(VipCardIdentity);size(20);null"`
	PatIdentity     string    `orm:"column(PatIdentity);size(20);null"`
	RowNO           int       `orm:"column(RowNO);null"`
	RelationUser    string    `orm:"column(RelationUser);size(255);null"`
	DataStatus      int       `orm:"column(DataStatus);null"`
	UpdateTime      time.Time `orm:"column(UpdateTime);type(timestamp);auto_now"`
	LastOperator    string    `orm:"column(LastOperator);size(10)"`
}

func (t *TVipintegrallog) TableName() string {
	return "t_vipintegrallog"
}

func init() {
	orm.RegisterModel(new(TVipintegrallog))
}
