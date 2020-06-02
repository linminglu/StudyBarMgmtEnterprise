package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TMarketFullcut struct {
	Id             int       `orm:"column(FullCutID);pk"`
	ChainID        string    `orm:"column(ChainID);size(20)"`
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);size(20)"`
	FullMoney      int64     `orm:"column(FullMoney)"`
	CutMoney       int64     `orm:"column(CutMoney)"`
	StartDate      time.Time `orm:"column(StartDate);type(datetime)"`
	EndDate        time.Time `orm:"column(EndDate);type(datetime)"`
	Rules          time.Time `orm:"column(rules);type(datetime);null"`
	Operator       string    `orm:"column(operator);size(50);null"`
	UpdateTime     time.Time `orm:"column(UpdateTime);type(datetime);null;auto_now"`
	LastOperator   string    `orm:"column(LastOperator);size(20);null"`
}

func (t *TMarketFullcut) TableName() string {
	return "t_market_fullcut"
}

func init() {
	orm.RegisterModel(new(TMarketFullcut))
}
