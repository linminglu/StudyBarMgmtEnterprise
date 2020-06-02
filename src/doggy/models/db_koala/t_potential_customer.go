package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TPotentialCustomer struct {
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);size(50);null"`
	Id             int       `orm:"column(PotentialID);pk"`
	CustomerID     string    `orm:"column(CustomerID);size(50);null"`
	Name           string    `orm:"column(Name);size(100);null"`
	Mobile         string    `orm:"column(Mobile);size(32)"`
	ComeType       int8      `orm:"column(ComeType)"`
	MarketingID    string    `orm:"column(MarketingID);size(50);null"`
	CreateTime     time.Time `orm:"column(CreateTime);type(datetime);null"`
	IsDelete       int8      `orm:"column(IsDelete)"`
	DataStatus     int8      `orm:"column(DataStatus)"`
	UpdateTime     time.Time `orm:"column(UpdateTime);type(timestamp);auto_now"`
	ChainID        string    `orm:"column(ChainID);size(64);null"`
	Remarks        string    `orm:"column(Remarks);size(100);null"`
	LastOperator   string    `orm:"column(LastOperator);size(10);null"`
	PCUpdateTime   time.Time `orm:"column(PCUpdateTime);type(datetime);null"`
}

func (t *TPotentialCustomer) TableName() string {
	return "t_potential_customer"
}

func init() {
	orm.RegisterModel(new(TPotentialCustomer))
}
