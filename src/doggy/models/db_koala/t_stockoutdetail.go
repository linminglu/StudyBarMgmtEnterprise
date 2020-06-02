package db_koala

import (
	"time"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

type TStockoutdetail struct {
	Id               string    `orm:"column(OutDetailIdentity);pk"`
	ClinicUniqueID   string    `orm:"column(ClinicUniqueID);pk"`
	OutMainIdentity  string    `orm:"column(OutMainIdentity);size(20);null"`
	OutItemIdentity  string    `orm:"column(OutItemIdentity);size(20);null"`
	OutUom           string    `orm:"column(OutUom);size(20);null"`
	OutPrice         float32   `orm:"column(OutPrice);null"`
	OutNum           float32   `orm:"column(OutNum);null"`
	OutTotal         float32   `orm:"column(OutTotal);null"`
	StockOutNumTotal float32   `orm:"column(StockOutNumTotal);null"`
	StockOutMoney    float32   `orm:"column(StockOutMoney);null"`
	OutRemark        string    `orm:"column(OutRemark);size(200);null"`
	OutIsDeleted     int       `orm:"column(OutIsDeleted);null"`
	OutStockBatch    string    `orm:"column(OutStockBatch);size(40);null"`
	InNo             string    `orm:"column(InNo);size(20);null"`
	LastOperator     string    `orm:"column(LastOperator);size(20);null"`
	UpdateTime       time.Time `orm:"column(UpdateTime);type(timestamp);null;auto_now"`
	SubClinicID      string    `orm:"column(SubClinicID);size(64);null"`
}

func (t *TStockoutdetail) TableName() string {
	return "t_stockoutdetail"
}

func init() {
	orm.RegisterModel(new(TStockoutdetail))
}

// AddTStockoutdetail insert a new TStockoutdetail into database and returns
// last inserted Id on success.
func AddTStockoutdetail(m *TStockoutdetail) (id int64, err error) {
	o := orm.NewOrm()
	id, err = o.Insert(m)
	return
}

// GetTStockoutdetailById retrieves TStockoutdetail by Id. Returns error if
// Id doesn't exist
func GetTStockoutdetailById(id string) (v *TStockoutdetail, err error) {
	o := orm.NewOrm()
	v = &TStockoutdetail{Id: id}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateTStockoutdetail updates TStockoutdetail by Id and returns error if
// the record to be updated doesn't exist
func UpdateTStockoutdetailById(m *TStockoutdetail, cols ...string) (err error) {
	o := orm.NewOrm()
	v := TStockoutdetail{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	}
	return
}

func SaveTStockoutdetail(param config.LJSON, m *TStockoutdetail, cols ...string) (err error) {

	o := orm.NewOrm()
	o.Using("db_koala")
	var res config.LJSON
	param.Set("OutDetailIdentity").SetString(m.Id)
	sql := ` select count(1) as num from t_stockoutdetail 
	  where   OutDetailIdentity=:OutDetailIdentity
	         and ClinicUniqueID=:ChainID
			 and SubClinicID=:SubClinicID  `
	o.RawJSON(sql, param).ValuesJSON(&res)
	nu := res.Item(0).Get("num").Int()
	if nu == 1 {
		_, err = o.Update(m, cols...)
	} else {
		_, err = o.Insert(m)

	}
	return
}
