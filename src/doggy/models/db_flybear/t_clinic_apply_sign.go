package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TClinicApplySign struct {
	Id            int       `orm:"column(SignID);pk"`
	ClinicID      string    `orm:"column(ClinicID);size(50)"`
	DentalID      string    `orm:"column(DentalID);size(10)"`
	ClinicName    string    `orm:"column(ClinicName);size(128)"`
	StartDate     time.Time `orm:"column(StartDate);type(date);null"`
	EndDate       time.Time `orm:"column(EndDate);type(date);null"`
	SignDocuments string    `orm:"column(SignDocuments);null"`
	DataStatus    int8      `orm:"column(DataStatus);null"`
	Updatetime    time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
}

func (t *TClinicApplySign) TableName() string {
	return "t_clinic_apply_sign"
}

func init() {
	orm.RegisterModel(new(TClinicApplySign))
}
