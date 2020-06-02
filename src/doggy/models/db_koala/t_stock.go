package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TStock struct {
	Id                int       `orm:"column(StockIdentity);pk"`
	ClinicUniqueID    int       `orm:"column(ClinicUniqueID);pk"`
	StockItemIdentity string    `orm:"column(StockItemIdentity);size(20)"`
	StockName         string    `orm:"column(StockName);size(256);null"`
	StockPYM          string    `orm:"column(StockPYM);size(256);null"`
	StockSpec         string    `orm:"column(StockSpec);size(20);null"`
	StockUom          string    `orm:"column(StockUom);size(20);null"`
	StockNum          float64   `orm:"column(StockNum);null"`
	StockTypeName     string    `orm:"column(StockTypeName);size(20);null"`
	StockPrice        float32   `orm:"column(StockPrice);null"`
	StockTotal        float32   `orm:"column(StockTotal);null"`
	Stockvalidity     time.Time `orm:"column(Stockvalidity);type(datetime);null"`
	StockBatch        string    `orm:"column(StockBatch);size(40);null"`
	StockTypIdentity  string    `orm:"column(StockTypIdentity);size(20);null"`
	ManuFactory       string    `orm:"column(ManuFactory);size(40);null"`
	LicenseNum        string    `orm:"column(LicenseNum);size(20);null"`
	InNo              string    `orm:"column(InNo);size(20);null"`
	UpdateTime        time.Time `orm:"column(UpdateTime);type(timestamp);null;auto_now"`
	SubClinicID       string    `orm:"column(SubClinicID);size(64);null"`
}

func (t *TStock) TableName() string {
	return "t_stock"
}

func init() {
	orm.RegisterModel(new(TStock))
}

// AddTStock insert a new TStock into database and returns
// last inserted Id on success.
func AddTStock(m *TStock) (id int64, err error) {
	o := orm.NewOrm()
	id, err = o.Insert(m)
	return
}

// GetTStockById retrieves TStock by Id. Returns error if
// Id doesn't exist
func GetTStockById(id int) (v *TStock, err error) {
	o := orm.NewOrm()
	v = &TStock{Id: id}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateTStock updates TStock by Id and returns error if
// the record to be updated doesn't exist
func UpdateTStockById(m *TStock, cols ...string) (err error) {
	o := orm.NewOrm()
	v := TStock{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	}
	return
}

func SaveTStock(m *TStock, cols ...string) (err error) {
	o := orm.NewOrm()
	v := TStock{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	} else {
		_, err = o.Insert(m)

	}
	return
}
