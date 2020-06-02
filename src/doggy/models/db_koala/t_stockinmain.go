package db_koala

import (
	"time"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

type TStockinmain struct {
	Id             string    `orm:"column(StockInIdentity);pk"`
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);pk"`
	StSuppier      string    `orm:"column(StSuppier);size(40);null"`
	StockInDate    time.Time `orm:"column(StockInDate);type(datetime);null"`
	StockInMan     string    `orm:"column(StockInMan);size(20);null"`
	StockInTotal   float32   `orm:"column(StockInTotal);null"`
	UpdateDateTime time.Time `orm:"column(UpdateDateTime);type(datetime);null;auto_now"`
	StockInRemark  string    `orm:"column(StockInRemark);size(200);null"`
	StockInNo      string    `orm:"column(StockInNo);size(20);null"`
	IsDeleted      int       `orm:"column(IsDeleted);null"`
	StockInType    string    `orm:"column(StockInType);size(20);null"`
	StockInStatus  int       `orm:"column(StockInStatus);null"`
	StBackMan      string    `orm:"column(StBackMan);size(20);null"`
	InReviewer     string    `orm:"column(InReviewer);size(20);null"`
	LastOperator   string    `orm:"column(LastOperator);size(20);null"`
	UpdateTime     time.Time `orm:"column(UpdateTime);type(timestamp);null;auto_now"`
	SubClinicID    string    `orm:"column(SubClinicID);size(64);null"`
}

func (t *TStockinmain) TableName() string {
	return "t_stockinmain"
}

func init() {
	orm.RegisterModel(new(TStockinmain))
}

// AddTStockinmain insert a new TStockinmain into database and returns
// last inserted Id on success.
func AddTStockinmain(m *TStockinmain) (id string, err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	i, err := o.Insert(m)
	id = string(i)
	return
}

// GetTStockinmainById retrieves TStockinmain by Id. Returns error if
// Id doesn't exist
func GetTStockinmainById(id string) (v *TStockinmain, err error) {
	o := orm.NewOrm()
	v = &TStockinmain{Id: id}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateTStockinmain updates TStockinmain by Id and returns error if
// the record to be updated doesn't exist
func UpdateTStockinmainById(m *TStockinmain, cols ...string) (err error) {

	o := orm.NewOrm()
	o.Using("db_koala")
	_, err = o.Update(m, cols...)

	return
}

//删除入库单
func DelStockinmainById(param config.LJSON) (err error) {

	o := orm.NewOrm()
	o.Using("db_koala")
	sql := ` UPDATE  t_stockinmain  SET  IsDeleted  = 1,
	                                     LastOperator='WEB',
										 UpdateTime=now()
						WHERE  StockInIdentity  = :stockInIdentity  
						and ClinicUniqueID=:chainid 
						and SubClinicID=:clinicid `
	o.RawJSON(sql, param).Exec()

	return
}

func SaveTStockinmain(m *TStockinmain, cols ...string) (err error) {

	o := orm.NewOrm()
	o.Using("db_koala")
	v := TStockinmain{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	} else {
		_, err = o.Insert(m)
	}

	return
}
