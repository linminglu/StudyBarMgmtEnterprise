package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TVipgiftrecord struct {
	Id             int       `orm:"column(RecordIdentity);pk"`
	ChainID        string    `orm:"column(ChainID);size(20);null"`
	VipLevelId     string    `orm:"column(VipLevelId);size(20);null"`
	VipCardId      string    `orm:"column(VipCardId);size(20);null"`
	ReuserId       string    `orm:"column(ReuserId);size(20);null"`
	CardNo         string    `orm:"column(CardNo);size(20);null"`
	GiftAmount     float64   `orm:"column(GiftAmount);null;digits(10);decimals(2)"`
	GiftIntegral   int       `orm:"column(GiftIntegral);null"`
	GiftPrjid      string    `orm:"column(GiftPrjid);size(20);null"`
	GiftPrj        string    `orm:"column(GiftPrj);size(200);null"`
	GiftPrjAmount  float64   `orm:"column(GiftPrjAmount);null;digits(10);decimals(2)"`
	GiftDiscount   float64   `orm:"column(GiftDiscount);null;digits(10);decimals(2)"`
	GiftPrjType    int       `orm:"column(GiftPrjType);null"`
	AllCount       int       `orm:"column(AllCount);null"`
	UsedCount      int       `orm:"column(UsedCount);null"`
	RemCount       int       `orm:"column(RemCount);null"`
	RecordDate     time.Time `orm:"column(RecordDate);type(datetime);null"`
	GiftType       int       `orm:"column(GiftType);null"`
	Status         int       `orm:"column(Status);null"`
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);size(20);null;pk"`
	GiftClinicID   string    `orm:"column(GiftClinicID);size(20);null;"`
	ClinicName     string    `orm:"column(ClinicName);size(20);null"`
	DataStatus     int       `orm:"column(DataStatus);null"`
	UpdateTime     time.Time `orm:"column(UpdateTime);type(timestamp);null"`
	LastOperator   string    `orm:"column(LastOperator);size(10);null"`
}

func (t *TVipgiftrecord) TableName() string {
	return "t_vipgiftrecord"
}

func init() {
	orm.RegisterModel(new(TVipgiftrecord))
}
