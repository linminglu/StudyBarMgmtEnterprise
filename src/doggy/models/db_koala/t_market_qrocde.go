package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TMarketQrocde struct {
	Id             int       `orm:"column(QRCodeID);pk"`
	PromotionID    string    `orm:"column(PromotionID);size(20)"`
	ChainID        string    `orm:"column(ChainID);size(20);null"`
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);size(20)"`
	ExtendedID     string    `orm:"column(ExtendedID);size(20);null"`
	SceneID        string    `orm:"column(SceneID);size(20)"`
	QRUrl          string    `orm:"column(QRUrl);size(200)"`
	PromoteType    int8      `orm:"column(PromoteType)"`
	Title          string    `orm:"column(title);size(128)"`
	PeopleNum      int64     `orm:"column(PeopleNum)"`
	UseNum         int64     `orm:"column(UseNum)"`
	IsPublic       int8      `orm:"column(IsPublic)"`
	DataStatus     int8      `orm:"column(DataStatus)"`
	UpdateTime     time.Time `orm:"column(UpdateTime);type(datetime);null"`
	Teamid         string    `orm:"column(Teamid);size(64)"`
	LastOperator   string    `orm:"column(LastOperator);size(10);null"`
	PCUpdateTime   time.Time `orm:"column(PCUpdateTime);type(datetime);null"`
}

func (t *TMarketQrocde) TableName() string {
	return "t_market_qrocde"
}

func init() {
	orm.RegisterModel(new(TMarketQrocde))
}
