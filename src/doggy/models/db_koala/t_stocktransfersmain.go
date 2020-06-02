package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TStocktransfersmain struct {
	Id              string    `orm:"column(TransfersIdentity);pk"`
	ClinicUniqueID  string    `orm:"column(ClinicUniqueID);pk"`
	FromClinicID    string    `orm:"column(FromClinicID);size(64);null"`
	FromClinicName  string    `orm:"column(FromClinicName);size(64);null"`
	ToClinicID      string    `orm:"column(ToClinicID);size(64);null"`
	ToClinicName    string    `orm:"column(ToClinicName);size(20)"`
	TransfersNo     string    `orm:"column(TransfersNo);size(20);null"`
	TransfersDate   time.Time `orm:"column(TransfersDate);type(datetime);null"`
	TransfersMan    string    `orm:"column(TransfersMan);size(20);null"`
	TransfersOutMan string    `orm:"column(TransfersOutMan);size(20);null"`
	TransfersInMan  string    `orm:"column(TransfersInMan);size(20);null"`
	HandleMan       string    `orm:"column(handleMan);size(20);null"`
	TransfersStatus int       `orm:"column(TransfersStatus);null"`
	TransfersTotal  float32   `orm:"column(TransfersTotal);size(20);null"`
	LastOperator    string    `orm:"column(LastOperator);size(20);null"`
	DataStatus      int       `orm:"column(DataStatus);null"`
	Updatetime      time.Time `orm:"column(Updatetime);type(timestamp);null;auto_now"`
	TransfersRemark string    `orm:"column(TransfersRemark);size(200);null"`
}

func (t *TStocktransfersmain) TableName() string {
	return "t_stocktransfersmain"
}

func init() {
	orm.RegisterModel(new(TStocktransfersmain))
}

// AddTStocktransfersmain insert a new TStocktransfersmain into database and returns
// last inserted Id on success.
func AddTStocktransfersmain(m *TStocktransfersmain, orm orm.Ormer) (id string, err error) {
	// o := orm.NewOrm()
	// o.Using("db_koala")
	i, err := orm.Insert(m)
	id = string(i)
	return
}

// GetTStocktransfersmainById retrieves TStocktransfersmain by Id. Returns error if
// Id doesn't exist
func GetTStocktransfersmainById(id string) (v *TStocktransfersmain, err error) {
	o := orm.NewOrm()
	v = &TStocktransfersmain{Id: id}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateTStocktransfersmain updates TStocktransfersmain by Id and returns error if
// the record to be updated doesn't exist
func UpdateTStocktransfersmainById(m *TStocktransfersmain, um orm.Ormer, cols ...string) (err error) {

	_, err = um.Update(m, cols...)
	return
}

func SaveTStocktransfersmain(m *TStocktransfersmain, cols ...string) (err error) {
	o := orm.NewOrm()
	v := TStocktransfersmain{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	} else {
		_, err = o.Insert(m)

	}
	return
}
