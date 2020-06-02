package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TMarketCoupon struct {
	Id              int       `orm:"column(CouponID);pk"`
	QRCodeID        string    `orm:"column(QRCodeID);size(20)"`
	PromotionID     string    `orm:"column(PromotionID);size(20)"`
	OpenID          string    `orm:"column(OpenID);size(64)"`
	UserID          string    `orm:"column(UserID);size(50)"`
	CouponCode      string    `orm:"column(CouponCode);size(20)"`
	ChainID         string    `orm:"column(ChainID);size(20)"`
	ClinicUniqueID  string    `orm:"column(ClinicUniqueID);size(20);null"`
	VipCardIdentity string    `orm:"column(VipCardIdentity);size(20);null"`
	Money           float64   `orm:"column(money);null;digits(10);decimals(2)"`
	ReceiveDate     time.Time `orm:"column(ReceiveDate);type(datetime);null"`
	StartDate       time.Time `orm:"column(StartDate);type(datetime);null"`
	EndDate         time.Time `orm:"column(EndDate);type(datetime);null"`
	UseDate         time.Time `orm:"column(UseDate);type(datetime);null"`
	UseStatus       int8      `orm:"column(UseStatus);null"`
	CustomerName    string    `orm:"column(CustomerName);size(20);null"`
	CustomerMobile  string    `orm:"column(CustomerMobile);size(20);null"`
	DataStatus      int8      `orm:"column(DataStatus)"`
	ComsumerID      string    `orm:"column(ComsumerID);size(20);null"`
	UseDoctor       string    `orm:"column(UseDoctor);size(20);null"`
	CustomerID      string    `orm:"column(CustomerID);size(50);null"`
	UpdateTime      time.Time `orm:"column(UpdateTime);type(datetime);null"`
	LastOperator    string    `orm:"column(LastOperator);size(10);null"`
	PCUpdateTime    time.Time `orm:"column(PCUpdateTime);type(datetime);null"`
	CouponWay       int8      `orm:"column(CouponWay)"`
}

func (t *TMarketCoupon) TableName() string {
	return "t_market_coupon"
}

func init() {
	orm.RegisterModel(new(TMarketCoupon))
}
