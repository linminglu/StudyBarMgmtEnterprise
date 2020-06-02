package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TWxaliOrder struct {
	Id             int       `orm:"column(uid);pk"`
	Userid         string    `orm:"column(userid);size(64)"`
	Ordertype      int       `orm:"column(ordertype)"`
	Datastatus     int       `orm:"column(datastatus);null"`
	Status         int       `orm:"column(status);null"`
	Malldatastatus int       `orm:"column(malldatastatus);null"`
	Createtime     time.Time `orm:"column(createtime);type(datetime);null"`
	Updatetime     time.Time `orm:"column(updatetime);type(datetime);null;auto_now"`
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);size(64);null"`
	DentalID       string    `orm:"column(DentalID);size(64);null"`
	Mallid         string    `orm:"column(mallid);size(64);null"`
	Mallstatus     string    `orm:"column(mallstatus);size(64);null"`
	Message        string    `orm:"column(message);size(64);null"`
	IsPaid         int       `orm:"column(is_paid);null"`
	RealPrice      string    `orm:"column(real_price);size(50);null"`
	Receiver       string    `orm:"column(receiver);size(64);null"`
	Address        string    `orm:"column(address);null"`
	Telephone      string    `orm:"column(telephone);null"`
	Mobile         string    `orm:"column(mobile);null"`
	Summary        string    `orm:"column(summary);null"`
	ExtraInfo      string    `orm:"column(extra_info);null"`
	PayMethod      string    `orm:"column(pay_method);size(64);null"`
}

func (t *TWxaliOrder) TableName() string {
	return "t_wxali_order"
}

func init() {
	orm.RegisterModel(new(TWxaliOrder))
}
