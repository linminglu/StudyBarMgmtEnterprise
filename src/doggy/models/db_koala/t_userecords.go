package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TUserecords struct {
	Id         int       `orm:"column(recordsidentity);pk"`
	Giftid     string    `orm:"column(giftid);size(20);null"`
	Usermen    string    `orm:"column(usermen);size(20);null"`
	Doctors    string    `orm:"column(doctors);size(20);null"`
	Nurse      string    `orm:"column(nurse);size(20);null"`
	Consultant string    `orm:"column(consultant);size(20);null"`
	Usagedate  time.Time `orm:"column(usagedate);type(datetime);null"`
	Datastatus int       `orm:"column(datastatus);null"`
	Updatetime time.Time `orm:"column(updatetime);type(timestamp);null"`
}

func (t *TUserecords) TableName() string {
	return "t_userecords"
}

func init() {
	orm.RegisterModel(new(TUserecords))
}
