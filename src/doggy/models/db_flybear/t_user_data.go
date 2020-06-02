package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TUserData struct {
	Id         int       `orm:"column(UserDataID);pk"`
	UserID     string    `orm:"column(UserID);size(40)"`
	ChainID    string    `orm:"column(ChainID);size(40)"`
	Role       int8      `orm:"column(Role)"`
	ClinicID   string    `orm:"column(ClinicID);size(40);null"`
	KoalaID    string    `orm:"column(KoalaID);size(40)"`
	DataStatus int8      `orm:"column(DataStatus);null"`
	Updatetime time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
}

func (t *TUserData) TableName() string {
	return "t_user_data"
}

func init() {
	orm.RegisterModel(new(TUserData))
}
