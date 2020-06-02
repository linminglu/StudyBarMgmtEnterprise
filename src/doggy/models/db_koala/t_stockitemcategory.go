package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TStockitemcategory struct {
	Id             string    `orm:"column(categoryIdentity);pk"`
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);pk"`
	CategoryPId    string    `orm:"column(categoryPId);size(20);null"`
	CategoryName   string    `orm:"column(categoryName);size(40);null"`
	CategoryPY     string    `orm:"column(categoryPY);size(20);null"`
	CategoryType   string    `orm:"column(categoryType);size(20);null"`
	DisplayOrder   int       `orm:"column(displayOrder);null"`
	Stopped        int       `orm:"column(Stopped);null"`
	DataStatus     int       `orm:"column(DataStatus);null"`
	Updatetime     time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	LastOperator   string    `orm:"column(LastOperator);size(40);null"`
	IsDeleted      int       `orm:"column(IsDeleted);null"`
}

func (t *TStockitemcategory) TableName() string {
	return "t_stockitemcategory"
}

func init() {
	orm.RegisterModel(new(TStockitemcategory))
}

// AddTStockitemcategory insert a new TStockitemcategory into database and returns
// last inserted Id on success.
func AddTStockitemcategory(m *TStockitemcategory) (id int64, err error) {
	o := orm.NewOrm()
	id, err = o.Insert(m)
	return
}

// GetTStockitemcategoryById retrieves TStockitemcategory by Id. Returns error if
// Id doesn't exist
func GetTStockitemcategoryById(id string) (v *TStockitemcategory, err error) {
	o := orm.NewOrm()
	v = &TStockitemcategory{Id: id}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateTStockitemcategory updates TStockitemcategory by Id and returns error if
// the record to be updated doesn't exist
func UpdateTStockitemcategoryById(m *TStockitemcategory, cols ...string) (err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	v := TStockitemcategory{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	}
	return
}

func SaveTStockitemcategory(m *TStockitemcategory, cols ...string) (err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	v := TStockitemcategory{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database

	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	} else {
		_, err = o.Insert(m)

	}
	return
}
