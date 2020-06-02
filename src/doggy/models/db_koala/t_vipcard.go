package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TVipcard struct {
	Id                   int       `orm:"column(VipCardIdentity);pk"`
	ChainID              string    `orm:"column(ChainID);size(20);null"`
	ClinicUniqueID       string    `orm:"column(ClinicUniqueID);size(64)"`
	VIPNumber            string    `orm:"column(VIPNumber);size(64);null"`
	CardVipLevelIdentity string    `orm:"column(CardVipLevelIdentity);size(20)"`
	Deposit              float64   `orm:"column(Deposit);null;digits(10);decimals(2)"`
	Bonus                float64   `orm:"column(Bonus);null;digits(10);decimals(2)"`
	TotalIntegral        float64   `orm:"column(TotalIntegral);digits(10);decimals(2)"`
	StartDate            time.Time `orm:"column(StartDate);type(datetime);null"`
	EndDate              time.Time `orm:"column(EndDate);type(datetime);null"`
	Mark                 string    `orm:"column(Mark);size(255);null"`
	DataStatus           int8      `orm:"column(DataStatus);null"`
	CardPatIdentity      string    `orm:"column(CardPatIdentity);size(20);null"`
	TotalReCharge        float64   `orm:"column(TotalReCharge);null;digits(10);decimals(2)"`
	TotalPay             float64   `orm:"column(TotalPay);null;digits(10);decimals(2)"`
	Arrearage            float64   `orm:"column(Arrearage);null;digits(10);decimals(2)"`
	DevelopDoct          string    `orm:"column(DevelopDoct);size(64);null"`
	DevelopDoctIdentity  string    `orm:"column(DevelopDoctIdentity);size(20);null"`
	Updatetime           time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	UpgradeDate          time.Time `orm:"column(UpgradeDate);type(datetime);null"`
	LastOperator         string    `orm:"column(LastOperator);size(10)"`
}

func (t *TVipcard) TableName() string {
	return "t_vipcard"
}

func init() {
	orm.RegisterModel(new(TVipcard))
}
