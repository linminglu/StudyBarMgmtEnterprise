package db_koala

import "time"

type TBilldetail struct {
	ClinicUniqueID        string    `orm:"column(ClinicUniqueID);size(64)"`
	BillDetailIdentity    int64     `orm:"column(BillDetailIdentity)"`
	BillIdentity          int64     `orm:"column(BillIdentity)"`
	HandleNo              string    `orm:"column(HandleNo);size(16)"`
	HandleName            string    `orm:"column(HandleName)"`
	HandleFee             float32   `orm:"column(HandleFee)"`
	HandleNum             int       `orm:"column(HandleNum)"`
	HandleTotal           float32   `orm:"column(HandleTotal)"`
	FeeType               string    `orm:"column(FeeType);size(32);null"`
	DataStatus            int8      `orm:"column(DataStatus)"`
	Updatetime            time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	Billfeetype           string    `orm:"column(billfeetype);size(64);null"`
	BdHandlesetIdentity   string    `orm:"column(BdHandlesetIdentity);size(20);null"`
	BdBillHandleIdentity  string    `orm:"column(BdBillHandleIdentity);size(20);null"`
	BDRowNO               int       `orm:"column(BDRowNO);null"`
	BdPatIdentityShowFLag int8      `orm:"column(BdPatIdentityShowFLag);null"`
	BDUom                 string    `orm:"column(BDUom);size(20);null"`
	BDBillType            string    `orm:"column(BDBillType);size(10);null"`
	BdDiscount            int       `orm:"column(BdDiscount);null"`
	BdCalByVIP            int       `orm:"column(BdCalByVIP);null"`
	LastOperator          string    `orm:"column(LastOperator);size(10);null"`
	BdPatIdentity         string    `orm:"column(BdPatIdentity);size(20);null"`
	BillDetailCRC         string    `orm:"column(BillDetailCRC);size(100);null"`
	IsRefund              uint64    `orm:"column(IsRefund);size(1);null"`
	Discmoney             float64   `orm:"column(Discmoney);null;digits(10);decimals(2)"`
	RealPay               float64   `orm:"column(RealPay);null;digits(10);decimals(2)"`
	DetailType            string    `orm:"column(DetailType);size(32);null"`
	Lt                    string    `orm:"column(lt);size(64);null"`
	Lb                    string    `orm:"column(lb);size(64);null"`
	Rt                    string    `orm:"column(rt);size(64);null"`
	Rb                    string    `orm:"column(rb);size(64);null"`
	BdDiscountFee         float64   `orm:"column(BdDiscountFee);null;digits(10);decimals(2)"`
	BdPayTotalFee         float64   `orm:"column(BdPayTotalFee);null;digits(10);decimals(2)"`
	RelateBDIdentity      string    `orm:"column(RelateBDIdentity);size(64);null"`
	ChainID               string    `orm:"column(ChainID);size(64);null"`
	DisChargeFee          float64   `orm:"column(DisChargeFee);null;digits(10);decimals(0)"`
	BDDoct                string    `orm:"column(BDDoct);size(64);null"`
	BDDoctIdentity        string    `orm:"column(BDDoctIdentity);size(20);null"`
	BDFree                int8      `orm:"column(BDFree);null"`
}
