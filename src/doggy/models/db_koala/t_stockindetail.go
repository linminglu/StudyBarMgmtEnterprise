package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TStockindetail struct {
	Id                  string    `orm:"column(StockInDetailIdentity);pk"`
	ClinicUniqueID      string    `orm:"column(ClinicUniqueID);pk"`
	StmIdentity         string    `orm:"column(StmIdentity);size(20);null"`
	StStockItemIdentity string    `orm:"column(StStockItemIdentity);size(40);null"`
	StStockUom          string    `orm:"column(StStockUom);size(20);null"`
	InPrice             float32   `orm:"column(InPrice);null"`
	StockInNum          float32   `orm:"column(StockInNum);null"`
	StockInNumTotal     float64   `orm:"column(StockInNumTotal);null"`
	StockInMoney        float64   `orm:"column(StockInMoney);null"`
	StStockInTotal      float32   `orm:"column(stStockInTotal);null"`
	StdStockInRemark    string    `orm:"column(StdStockInRemark);size(200);null"`
	StdIsDeleted        int       `orm:"column(StdIsDeleted);null"`
	StdStockBatch       string    `orm:"column(stdStockBatch);size(40);null"`
	StdStockvalidity    time.Time `orm:"column(StdStockvalidity);type(datetime);null"`
	LastOperator        string    `orm:"column(LastOperator);size(20);null"`
	UpdateTime          time.Time `orm:"column(UpdateTime);type(timestamp);null;auto_now"`
	SubClinicID         string    `orm:"column(SubClinicID);size(64);null"`
}

func (t *TStockindetail) TableName() string {
	return "t_stockindetail"
}

func init() {
	orm.RegisterModel(new(TStockindetail))
}

// AddTStockindetail insert a new TStockindetail into database and returns
// last inserted Id on success.
func AddTStockindetail(m *TStockindetail) (id int64, err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	id, err = o.Insert(m)
	return
}

// GetTStockindetailById retrieves TStockindetail by Id. Returns error if
// Id doesn't exist
func GetTStockindetailById(id string) (v *TStockindetail, err error) {
	o := orm.NewOrm()
	v = &TStockindetail{Id: id}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateTStockindetail updates TStockindetail by Id and returns error if
// the record to be updated doesn't exist
func UpdateTStockindetailById(m *TStockindetail, cols ...string) (err error) {
	o := orm.NewOrm()
	v := TStockindetail{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	}
	return
}

func SaveTStockindetail(m *TStockindetail, cols ...string) (err error) {

	o := orm.NewOrm()
	o.Using("db_koala")
	v := TStockindetail{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	} else {
		_, err = o.Insert(m)
	}
	return
}
