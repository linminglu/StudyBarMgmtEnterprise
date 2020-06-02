package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TViplevel struct {
	Id              string    `orm:"column(VipLevelIdentity);pk"`
	ChainID         string    `orm:"column(ChainID);size(20);null"`
	ClinicUniqueID  string    `orm:"column(ClinicUniqueID);size(64);pk"`
	VipType         string    `orm:"column(VipType);size(20);null"`
	VIPIcon         int8      `orm:"column(VIPIcon);null"`
	Discount        float64   `orm:"column(Discount);null"`
	GiftAmount      float64   `orm:"column(GiftAmount);null;digits(10);decimals(2)"`
	PresentIntegral float64   `orm:"column(PresentIntegral);null"`
	Stopped         int8      `orm:"column(Stopped);null"`
	Mark            string    `orm:"column(Mark);size(255);null"`
	DataStatus      int8      `orm:"column(DataStatus);null"`
	DisplayOrder    int16     `orm:"column(DisplayOrder);null"`
	LastOperator    string    `orm:"column(LastOperator);size(10)"`
	Updatetime      time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	RecAmount       float64   `orm:"column(RecAmount);null;digits(10);decimals(2)"`
	ConAmount       float64   `orm:"column(ConAmount);null;digits(10);decimals(2)"`
	CondSet         int       `orm:"column(CondSet);null"`
	DeAmount        float64   `orm:"column(DeAmount);null"`
	StartMeter      int       `orm:"column(StartMeter);null"`
	IsShared        int       `orm:"column(IsShared);null"`
	DiscountType    int       `orm:"column(DiscountType);null"`
	StoreType       int       `orm:"column(StoreType);null"`
	ImageUrl        string    `orm:"column(ImageUrl);size(200);null"`
}

func (t *TViplevel) TableName() string {
	return "t_viplevel"
}

func init() {
	orm.RegisterModel(new(TViplevel))
}

//保存会员设置信息
func SaveVipCard(m *TViplevel, cols ...string) (err error) {

	o := orm.NewOrm()
	o.Using("db_koala")
	v := TViplevel{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	} else {
		_, err = o.Insert(m)
	}
	return
}
