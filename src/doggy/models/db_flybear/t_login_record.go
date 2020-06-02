package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TLoginRecord struct {
	Id            int       `orm:"column(LoginRecordID);pk"`
	Userid        string    `orm:"column(userid);size(24);null"`
	LoginMode     int8      `orm:"column(LoginMode);null"`
	UserName      string    `orm:"column(UserName);size(64);null"`
	Terminal      int8      `orm:"column(terminal);null"`
	Address       string    `orm:"column(address);size(64);null"`
	IpAddr        string    `orm:"column(IpAddr);size(32);null"`
	LoginDatetime time.Time `orm:"column(LoginDatetime);type(datetime);null"`
	Browser       string    `orm:"column(browser);size(32);null"`
}

func (t *TLoginRecord) TableName() string {
	return "t_login_record"
}

func init() {
	orm.RegisterModel(new(TLoginRecord))
}
