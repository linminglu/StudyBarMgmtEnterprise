package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TMarketPromotion struct {
	Id              int       `orm:"column(PromotionID);pk"`
	ChainID         string    `orm:"column(ChainID);size(20)"`
	ClinicUniqueID  string    `orm:"column(ClinicUniqueID);size(20);null"`
	PromotionName   string    `orm:"column(PromotionName);size(128)"`
	Banner          string    `orm:"column(banner);size(128);null"`
	Money           float64   `orm:"column(money);null;digits(10);decimals(2)"`
	Count           int       `orm:"column(count);null"`
	IsLimit         int       `orm:"column(IsLimit)"`
	PerNum          int       `orm:"column(PerNum)"`
	StartDate       time.Time `orm:"column(StartDate);type(datetime)"`
	EndDate         time.Time `orm:"column(EndDate);type(datetime)"`
	Ready           int8      `orm:"column(ready);null"`
	ExpireStartDate time.Time `orm:"column(ExpireStartDate);type(datetime)"`
	ExpireEndDate   time.Time `orm:"column(ExpireEndDate);type(datetime)"`
	DataStatus      int8      `orm:"column(DataStatus)"`
	Rules           string    `orm:"column(rules);null"`
	ViewNum         int       `orm:"column(ViewNum);null"`
	ReceiveNum      int       `orm:"column(ReceiveNum);null"`
	UseNum          int       `orm:"column(UseNum);null"`
	CreateTime      time.Time `orm:"column(CreateTime);type(datetime)"`
	UpdateTime      time.Time `orm:"column(UpdateTime);type(datetime);null"`
	LastOperator    string    `orm:"column(LastOperator);size(10);null"`
	PCUpdateTime    time.Time `orm:"column(PCUpdateTime);type(datetime);null"`
}

func (t *TMarketPromotion) TableName() string {
	return "t_market_promotion"
}

func init() {
	orm.RegisterModel(new(TMarketPromotion))
}
