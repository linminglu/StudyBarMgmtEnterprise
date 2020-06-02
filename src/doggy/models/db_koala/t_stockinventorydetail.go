package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TStockinventorydetail struct {
	Id              string    `orm:"column(InventoryDetailIdentity);pk"`
	ClinicUniqueID  string    `orm:"column(ClinicUniqueID);pk"`
	InventoryMainID string    `orm:"column(InventoryMainID);size(20);null"`
	InventoryItmID  string    `orm:"column(InventoryItmID);size(40);null"`
	InventoryUom    string    `orm:"column(InventoryUom);size(20);null"`
	InNo            string    `orm:"column(InNo);size(20);null"`
	InventoryBathNo string    `orm:"column(InventoryBathNo);size(40);null"`
	StockPrice      string    `orm:"column(StockPrice);null;digits(10);decimals(2)"`
	StockNum        string    `orm:"column(StockNum);null"`
	InventoryNum    string    `orm:"column(InventoryNum);null"`
	ProfitNum       string    `orm:"column(ProfitNum);null"`
	InvDtlRemark    string    `orm:"column(InvDtlRemark);size(100);null"`
	DataStatus      int       `orm:"column(DataStatus);null"`
	Updatetime      time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	SubClinicID     string    `orm:"column(SubClinicID);size(64);null"`
}

func (t *TStockinventorydetail) TableName() string {
	return "t_stockinventorydetail"
}

func init() {
	orm.RegisterModel(new(TStockinventorydetail))
}

// AddTStockinventorydetail insert a new TStockinventorydetail into database and returns
// last inserted Id on success.
func AddTStockinventorydetail(m *TStockinventorydetail) (id int64, err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	id, err = o.Insert(m)
	return
}

// GetTStockinventorydetailById retrieves TStockinventorydetail by Id. Returns error if
// Id doesn't exist
func GetTStockinventorydetailById(id string, clinicUniqueID string) (v *TStockinventorydetail, err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	v = &TStockinventorydetail{Id: id, ClinicUniqueID: clinicUniqueID}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateTStockinventorydetail updates TStockinventorydetail by Id and returns error if
// the record to be updated doesn't exist
func UpdateTStockinventorydetailById(m *TStockinventorydetail, cols ...string) (err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	v := TStockinventorydetail{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	}
	return
}

func SaveTStockinventorydetail(m *TStockinventorydetail, cols ...string) (err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	v := TStockinventorydetail{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	} else {
		_, err = o.Insert(m)

	}
	return
}
