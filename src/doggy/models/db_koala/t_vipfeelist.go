package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TVipfeelist struct {
	Id                 int       `orm:"column(VipFeeListIdentity);pk"`
	ChainID            string    `orm:"column(ChainID);size(20);null"`
	ClinicUniqueID     string    `orm:"column(ClinicUniqueID);size(64)"`
	VipCardIdentity    string    `orm:"column(VipCardIdentity);size(20);null"`
	AdvPayBillIdentity string    `orm:"column(AdvPayBillIdentity);size(20);null"`
	FeePatientIdentity string    `orm:"column(FeePatientIdentity);size(20);null"`
	PayStyle           string    `orm:"column(PayStyle);size(20);null"`
	FeePayIn           float64   `orm:"column(FeePayIn);null;digits(10);decimals(2)"`
	FeePayOut          float64   `orm:"column(FeePayOut);null;digits(10);decimals(2)"`
	TotalFee           float64   `orm:"column(TotalFee);null;digits(10);decimals(2)"`
	FeeStyle           string    `orm:"column(FeeStyle);size(20);null"`
	FeeListRemark      string    `orm:"column(FeeListRemark);size(20);null"`
	VipFeeDatetime     time.Time `orm:"column(VipFeeDatetime);type(datetime);null"`
	RelationUser       string    `orm:"column(RelationUser);size(255);null"`
	DataStatus         int8      `orm:"column(DataStatus);null"`
	Updatetime         time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	PrincipalBa        float64   `orm:"column(PrincipalBa);null;digits(10);decimals(2)"`
	Principal          float64   `orm:"column(Principal);null;digits(10);decimals(2)"`
	BonusBa            float64   `orm:"column(BonusBa);null;digits(10);decimals(2)"`
	Bonus              float64   `orm:"column(Bonus);null;digits(10);decimals(2)"`
	LastOperator       string    `orm:"column(LastOperator);size(10)"`
}

func (t *TVipfeelist) TableName() string {
	return "t_vipfeelist"
}

func init() {
	orm.RegisterModel(new(TVipfeelist))
}
