package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TStockinventorymain struct {
	Id              string    `orm:"column(InventoryIdentity);pk"`
	ClinicUniqueID  string    `orm:"column(ClinicUniqueID);pk"`
	InventoryNo     string    `orm:"column(InventoryNo);size(20);null"`
	InventoryDate   time.Time `orm:"column(InventoryDate);type(date);null"`
	InventoryMan    string    `orm:"column(InventoryMan);size(20);null"`
	InventoryStatus int       `orm:"column(InventoryStatus);null"`
	InventoryRemark string    `orm:"column(InventoryRemark);size(200);null"`
	DataStatus      int       `orm:"column(DataStatus);null"`
	LastOperator    string    `orm:"column(LastOperator);size(20);null"`
	Updatetime      time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	IsDeleted       int       `orm:"column(isDeleted);null"`
	SubClinicID     string    `orm:"column(SubClinicID);size(64);null"`
}

func (t *TStockinventorymain) TableName() string {
	return "t_stockinventorymain"
}

func init() {
	orm.RegisterModel(new(TStockinventorymain))
}

// AddTStockinventorymain insert a new TStockinventorymain into database and returns
// last inserted Id on success.
func AddTStockinventorymain(m *TStockinventorymain) (id string, err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	i, err := o.Insert(m)
	id = string(i)
	return
}

// GetTStockinventorymainById retrieves TStockinventorymain by Id. Returns error if
// Id doesn't exist
func GetTStockinventorymainById(id string, clinicUniqueID string) (v *TStockinventorymain, err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	v = &TStockinventorymain{Id: id}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

//删除初盘单
func UpdateTStockinventorymainById(m *TStockinventorymain, cols ...string) (err error) {

	o := orm.NewOrm()
	o.Using("db_koala")
	_, err = o.Update(m, cols...)
	return

}

func SaveTStockinventorymain(m *TStockinventorymain, cols ...string) (err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	v := TStockinventorymain{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	} else {
		_, err = o.Insert(m)

	}
	return
}
