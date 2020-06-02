package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type THandleprj struct {
	Id             string    `orm:"column(HandlePrjIdentity);pk"`
	AddHandId      string    `orm:"column(AddHandId);size(20);null;pk"`
	ChainID        string    `orm:"column(ChainID);size(20);null"`
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);size(20);null"`
	VipLevelId     string    `orm:"column(VipLevelId);size(20);null"`
	HandName       string    `orm:"column(HandName);size(200)"`
	Discount       float64   `orm:"column(Discount);null;digits(10);decimals(2)"`
	HandType       int       `orm:"column(HandType);null"`
	PrjType        int       `orm:"column(PrjType);null"`
	GiftCount      int       `orm:"column(GiftCount);null"`
	GiftAmount     float64   `orm:"column(GiftAmount);null;digits(10);decimals(2)"`
	EffDate        time.Time `orm:"column(EffDate);type(datetime);null"`
	ValidDate      int       `orm:"column(ValidDate);null"`
	DataStatus     int       `orm:"column(DataStatus);null"`
	UpdateTime     time.Time `orm:"column(UpdateTime);type(timestamp);null"`
	LastOperator   string    `orm:"column(LastOperator);size(10);null"`
	DiscoutAmount  float64   `orm:"column(DiscoutAmount);null;digits(10);decimals(2)"`
	LimitTimes     int       `orm:"column(LimitTimes);null"`
	DiscoutType    int       `orm:"column(DiscoutType);null"`
	ApplyTo        int       `orm:"column(ApplyTo);null"`
}

func (t *THandleprj) TableName() string {
	return "t_handleprj"
}

func init() {
	orm.RegisterModel(new(THandleprj))
}

//保存处置项目
func SaveHandlePrj(m *THandleprj, cols ...string) (err error) {

	o := orm.NewOrm()
	o.Using("db_koala")
	v := THandleprj{Id: m.Id, ChainID: m.ChainID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	} else {
		_, err = o.Insert(m)
	}
	return
}
