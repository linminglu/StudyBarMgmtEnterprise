package db_koala

import (
	"time"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

type TStockoutmain struct {
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);size(64)"`
	Id             string    `orm:"column(StockOutIdentity);pk"`
	StockOutDate   time.Time `orm:"column(StockOutDate);type(datetime);null"`
	RecipientMan   string    `orm:"column(RecipientMan);size(40);null"`
	StockOutTotal  float32   `orm:"column(StockOutTotal);null"`
	StockOutMan    string    `orm:"column(StockOutMan);size(20);null"`
	UpdateDateTime time.Time `orm:"column(UpdateDateTime);type(datetime);null;auto_now"`
	StockOutRemark string    `orm:"column(StockOutRemark);size(200);null"`
	StockOutNo     string    `orm:"column(StockOutNo);size(20);null"`
	OutType        string    `orm:"column(OutType);size(20);null"`
	OutIsDeleted   int       `orm:"column(OutIsDeleted);null"`
	StockOutStatus int       `orm:"column(StockOutStatus);null"`
	LastOperator   string    `orm:"column(LastOperator);size(20);null"`
	UpdateTime     time.Time `orm:"column(UpdateTime);type(timestamp);null;auto_now"`
	SubClinicID    string    `orm:"column(SubClinicID);size(64);null"`
}

func (t *TStockoutmain) TableName() string {
	return "t_stockoutmain"
}

func init() {
	orm.RegisterModel(new(TStockoutmain))
}

// AddTStockoutmain insert a new TStockoutmain into database and returns
// last inserted Id on success.
func AddTStockoutmain(m *TStockoutmain) (id int64, err error) {
	o := orm.NewOrm()
	id, err = o.Insert(m)
	return
}

// GetTStockoutmainById retrieves TStockoutmain by Id. Returns error if
// Id doesn't exist
func GetTStockoutmainById(id string) (v *TStockoutmain, err error) {
	o := orm.NewOrm()
	v = &TStockoutmain{Id: id}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateTStockoutmain updates TStockoutmain by Id and returns error if
// the record to be updated doesn't exist
func UpdateTStockoutmainById(m *TStockoutmain, cols ...string) (err error) {

	o := orm.NewOrm()
	o.Using("db_koala")
	_, err = o.Update(m, cols...)

	return
}

func SaveTStockoutmain(param config.LJSON, m *TStockoutmain, cols ...string) (err error) {

	o := orm.NewOrm()
	o.Using("db_koala")
	var res config.LJSON
	param.Set("StockOutIdentity").SetString(m.Id)
	sql := ` select count(1) as num from t_stockoutmain 
	  where  ClinicUniqueID=:ChainID
	        and  StockOutIdentity=:StockOutIdentity
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
