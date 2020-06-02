package db_koala

import (
	"time"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

type TStocktransfersdetail struct {
	Id              string    `orm:"column(DetailIdentity);pk"`
	ClinicUniqueID  string    `orm:"column(ClinicUniqueID);pk"`
	TransfersMainID string    `orm:"column(transfersMainID);size(20);null"`
	ItemID          string    `orm:"column(ItemID);size(40);null"`
	Price           float32   `orm:"column(Price);null;digits(10);decimals(2)"`
	Num             float32   `orm:"column(Num);null"`
	Um              string    `orm:"column(Um);size(20);null"`
	Total           float32   `orm:"column(Total);null"`
	DtlRemark       string    `orm:"column(DtlRemark);size(100);null"`
	LastOperator    string    `orm:"column(LastOperator);size(100);null"`
	DataStatus      int       `orm:"column(DataStatus);null"`
	Updatetime      time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
}

func (t *TStocktransfersdetail) TableName() string {
	return "t_stocktransfersdetail"
}

func init() {
	orm.RegisterModel(new(TStocktransfersdetail))
}

// AddTStocktransfersdetail insert a new TStocktransfersdetail into database and returns
// last inserted Id on success.
func AddTStocktransfersdetail(m *TStocktransfersdetail) (id int64, err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	id, err = o.Insert(m)
	return
}

// GetTStocktransfersdetailById retrieves TStocktransfersdetail by Id. Returns error if
// Id doesn't exist
func GetTStocktransfersdetailById(id string) (v *TStocktransfersdetail, err error) {
	o := orm.NewOrm()
	v = &TStocktransfersdetail{Id: id}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateTStocktransfersdetail updates TStocktransfersdetail by Id and returns error if
// the record to be updated doesn't exist
func UpdateTStocktransfersdetailById(m *TStocktransfersdetail, cols ...string) (err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	v := TStocktransfersdetail{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	}
	return
}

func SaveTStocktransfersdetail(param config.LJSON, m *TStocktransfersdetail, orm orm.Ormer, cols ...string) (err error) {

	var res config.LJSON
	param.Set("DetailIdentity").SetString(m.Id)
	param.Set("TransfersMainID").SetString(m.TransfersMainID)

	sql := ` select count(1) as num from t_stocktransfersdetail 
	  where   DetailIdentity=:DetailIdentity
	          and transfersMainID=:TransfersMainID
	         and ClinicUniqueID=:NChainID `

	orm.RawJSON(sql, param).ValuesJSON(&res)
	nu := res.Item(0).Get("num").Int()

	if nu == 1 {
		_, err = orm.Update(m, cols...)
	} else {
		_, err = orm.Insert(m)
	}
	return
}
