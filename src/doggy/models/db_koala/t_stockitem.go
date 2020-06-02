package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TStockitem struct {
	Id               string    `orm:"column(StockItemIdentity);pk"`
	ClinicUniqueID   string    `orm:"column(ClinicUniqueID);pk"`
	StockItemCode    string    `orm:"column(StockItemCode);size(20);null"`
	StockBarCode     string    `orm:"column(StockBarCode);size(20);null"`
	StockItemPYM     string    `orm:"column(StockItemPYM);size(256);null"`
	StockItemName    string    `orm:"column(StockItemName);size(256);null"`
	StockItemType    string    `orm:"column(StockItemType);size(20);null"`
	StockItemSpec    string    `orm:"column(StockItemSpec);size(20);null"`
	StockItemUom     string    `orm:"column(StockItemUom);size(20);null"`
	StockItemPrice   float32   `orm:"column(StockItemPrice);null"`
	Stopped          int       `orm:"column(Stopped);null"`
	DisplayOrder     int       `orm:"column(DisplayOrder);null"`
	StIsDeleted      int       `orm:"column(StIsDeleted);null"`
	IsPaused         int       `orm:"column(IsPaused);null"`
	StockItemRemark  string    `orm:"column(StockItemRemark);size(200);null"`
	UpdateDateTime   time.Time `orm:"column(UpdateDateTime);type(datetime);null;auto_now"`
	Upperlimit       int       `orm:"column(Upperlimit);null"`
	Lowerlimit       int       `orm:"column(lowerlimit);null"`
	StockItemTypeId  string    `orm:"column(StockItemTypeId);size(20);null"`
	NetServerGoodsID string    `orm:"column(NetServerGoodsID);size(20);null"`
	MallItemID       string    `orm:"column(MallItemID);size(64);null"`
	StockItemBrand   string    `orm:"column(StockItemBrand);size(64);null"`
	ManuFactory      string    `orm:"column(ManuFactory);size(40);null"`
	LicenseNum       string    `orm:"column(LicenseNum);size(20);null"`
	SalePrice        float64   `orm:"column(SalePrice);null;digits(10);decimals(2)"`
	StockItemModel   string    `orm:"column(StockItemModel);size(64);null"`
	PurchasingUnit   string    `orm:"column(PurchasingUnit);size(20);null"`
	UnitHex          float64   `orm:"column(UnitHex);null;digits(10);decimals(3)"`
	LastOperator     string    `orm:"column(LastOperator);size(20);null"`
	UpdateTime       time.Time `orm:"column(UpdateTime);type(timestamp);null;auto_now"`
}

func (t *TStockitem) TableName() string {
	return "t_stockitem"
}

func init() {
	orm.RegisterModel(new(TStockitem))
}

// AddTStockitem insert a new TStockitem into database and returns
// last inserted Id on success.
func AddTStockitem(m *TStockitem) (id int64, err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	id, err = o.Insert(m)
	return
}

// GetTStockitemById retrieves TStockitem by Id. Returns error if
// Id doesn't exist
func GetTStockitemById(id string) (v *TStockitem, err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	v = &TStockitem{Id: id}
	if err = o.Read(v); err == nil {
		return v, nil
	}
	return nil, err
}

// UpdateTStockitem updates TStockitem by Id and returns error if
// the record to be updated doesn't exist
func UpdateTStockitemById(m *TStockitem, cols ...string) (err error) {
	o := orm.NewOrm()
	o.Using("db_koala")
	v := TStockitem{Id: m.Id, ClinicUniqueID: m.ClinicUniqueID}
	// ascertain id exists in the database
	if err = o.Read(&v); err == nil {
		_, err = o.Update(m, cols...)
	}
	return
}

func SaveTStockitem(bo bool, m *TStockitem, cols ...string) (err error) {
	o := orm.NewOrm()
	o.Using("db_koala")

	if bo {
		m.Id += "1"
		_, err = o.Insert(m)
	} else {
		_, err = o.Update(m, cols...)
	}

	return
}
