package db_koala

import "time"

type TPaydetail struct {
	ChainID              string    `orm:"column(ChainID);size(64);null"`
	PayDetailIdentity    string    `orm:"column(PayDetailIdentity);size(20)"`
	ClinicUniqueID       string    `orm:"column(ClinicUniqueID);size(64)"`
	PDBillDetailIdentity string    `orm:"column(PDBillDetailIdentity);size(20);null"`
	PDHandlesetIdentity  string    `orm:"column(PDHandlesetIdentity);size(20);null"`
	PDBillIdentity       string    `orm:"column(PDBillIdentity);size(20);null"`
	PDPayIdentity        string    `orm:"column(PDPayIdentity);size(20);null"`
	PDPayFee             float64   `orm:"column(PDPayFee);null;digits(10);decimals(2)"`
	PDPayDateTime        time.Time `orm:"column(PDPayDateTime);type(datetime);null"`
	PayDetailCRC         string    `orm:"column(PayDetailCRC);size(100);null"`
	DataStatus           int16     `orm:"column(DataStatus)"`
	Updatetime           time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	LastOperator         string    `orm:"column(LastOperator);size(10);null"`
}
