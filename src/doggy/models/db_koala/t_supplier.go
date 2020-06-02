package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TSupplier struct {
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);size(64)"`
	Id             int       `orm:"column(SupplierIdentity);pk"`
	SupplierName   string    `orm:"column(SupplierName);size(20);null"`
	SupplierTel    string    `orm:"column(SupplierTel);size(20);null"`
	SupplierMan    string    `orm:"column(supplierMan);size(20);null"`
	DisplayOrder   int       `orm:"column(DisplayOrder);null"`
	DataStatus     int       `orm:"column(DataStatus);null"`
	Updatetime     time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	SubClinicID    string    `orm:"column(SubClinicID);size(64);null"`
}

func (t *TSupplier) TableName() string {
	return "t_supplier"
}

func init() {
	orm.RegisterModel(new(TSupplier))
}
