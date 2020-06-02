package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TCoupons struct {
	Id             string    `orm:"column(CouponsIdentity);pk"`
	AddCouponId    string    `orm:"column(AddCouponId);size(20);null"`
	ChainID        string    `orm:"column(ChainID);size(20);null;pk"`
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);size(20);null"`
	VipLevelId     string    `orm:"column(VipLevelId);size(20);null"`
	CouponName     string    `orm:"column(CouponName);size(200);null"`
	CouponAmount   float64   `orm:"column(CouponAmount);null;digits(10);decimals(2)"`
	ClinicName     string    `orm:"column(ClinicName);size(20);null"`
	StartDate      time.Time `orm:"column(StartDate);type(datetime);null"`
	EndDate        time.Time `orm:"column(EndDate);type(datetime);null"`
	Status         int       `orm:"column(Status);null"`
	DataStatus     int       `orm:"column(DataStatus);null"`
	UpdateTime     time.Time `orm:"column(UpdateTime);type(timestamp);null"`
	LastOperator   string    `orm:"column(LastOperator);size(10);null"`
}

func (t *TCoupons) TableName() string {
	return "t_coupons"
}

func init() {
	orm.RegisterModel(new(TCoupons))
}

//保存优惠券
func SaveCoupons(m *TCoupons, cols ...string) (err error) {

	o := orm.NewOrm()
	o.Using("db_koala")
	v := TCoupons{Id: m.Id, ChainID: m.ChainID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	} else {
		_, err = o.Insert(m)
	}
	return
}
