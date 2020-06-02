package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TCredit struct {
	Id             int       `orm:"column(CreditID);pk"`
	ClinicID       string    `orm:"column(ClinicID);size(40)"`
	CompanyName    string    `orm:"column(CompanyName);size(100)"`
	LicenseID      string    `orm:"column(LicenseID);size(40)"`
	Scanningfile   string    `orm:"column(Scanningfile)"`
	IDcardfile     string    `orm:"column(IDcardfile)"`
	Experience     int       `orm:"column(Experience)"`
	Chairnumber    int       `orm:"column(Chairnumber)"`
	Spaceroom      string    `orm:"column(Spaceroom);size(40);null"`
	Createtime     time.Time `orm:"column(Createtime);type(datetime)"`
	Lastupdatetime time.Time `orm:"column(Lastupdatetime);type(datetime)"`
	Overtime       time.Time `orm:"column(Overtime);type(datetime);null"`
	OpreateID      string    `orm:"column(OpreateID);size(40);null"`
	DataStatus     int8      `orm:"column(DataStatus)"`
}

func (t *TCredit) TableName() string {
	return "t_credit"
}

func init() {
	orm.RegisterModel(new(TCredit))
}
