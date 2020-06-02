package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TStockjournal struct {
	Id                string    `orm:"column(StockJournalId);pk"`
	ClinicUniqueID    string    `orm:"column(ClinicUniqueID);pk"`
	InOutType         int       `orm:"column(InOutType)"`
	InOutDetailId     string    `orm:"column(InOutDetailId);size(20)"`
	InNo              string    `orm:"column(InNo);size(40)"`
	StockItemIdentity string    `orm:"column(StockItemIdentity);size(20)"`
	BatchNo           string    `orm:"column(BatchNo);size(40);null"`
	InNum             float64   `orm:"column(InNum);null"`
	OutNum            float64   `orm:"column(OutNum);null"`
	Price             float64   `orm:"column(Price);null;digits(10);decimals(2)"`
	Amt               float64   `orm:"column(Amt);null;digits(10);decimals(2)"`
	Stockvalidity     time.Time `orm:"column(Stockvalidity);type(datetime)"`
	InOutMainId       string    `orm:"column(InOutMainId);size(20);null"`
	InOutNo           string    `orm:"column(InOutNo);size(20);null"`
	Type              string    `orm:"column(Type);size(20);null"`
	Man               string    `orm:"column(Man);size(20);null"`
	DataStatus        int       `orm:"column(DataStatus);null"`
	Updatetime        time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	SubClinicID       string    `orm:"column(SubClinicID);size(64);null"`
}

func (t *TStockjournal) TableName() string {
	return "t_stockjournal"
}

func init() {
	orm.RegisterModel(new(TStockjournal))
}

// AddTStockjournal insert a new TStockjournal into database and returns
// last inserted Id on success.
func AddTStockjournal(m *TStockjournal) (id int64, err error) {
	o := orm.NewOrm()
	id, err = o.Insert(m)
	return
}

// GetTStockjournalById retrieves TStockjournal by Id. Returns error if
// Id doesn't exist
func GetTStockjournalById(id string) (v *TStockjournal, err error) {
	o := orm.NewOrm()
	v = &TStockjournal{Id: id}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateTStockjournal updates TStockjournal by Id and returns error if
// the record to be updated doesn't exist
func UpdateTStockjournalById(m *TStockjournal, cols ...string) (err error) {
	o := orm.NewOrm()
	v := TStockjournal{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	}
	return
}

func SaveTStockjournal(m *TStockjournal, cols ...string) (err error) {
	o := orm.NewOrm()
	v := TStockjournal{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	} else {
		_, err = o.Insert(m)

	}
	return
}
