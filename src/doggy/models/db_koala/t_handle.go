package db_koala

import "time"

type THandle struct {
	ChainID              string    `orm:"column(ChainID);size(64);null"`
	ClinicUniqueID       string    `orm:"column(ClinicUniqueID);size(64)"`
	HandleIdentity       string    `orm:"column(HandleIdentity);size(40)"`
	StudyIdentity        string    `orm:"column(StudyIdentity);size(40)"`
	DoctorID             string    `orm:"column(DoctorID);size(40)"`
	CustomerID           string    `orm:"column(CustomerID);size(40)"`
	Name                 string    `orm:"column(Name)"`
	LT                   string    `orm:"column(LT);size(64);null"`
	LB                   string    `orm:"column(LB);size(64);null"`
	RT                   string    `orm:"column(RT);size(64);null"`
	RB                   string    `orm:"column(RB);size(64);null"`
	Fee                  float32   `orm:"column(Fee);null"`
	Date                 time.Time `orm:"column(Date);type(datetime)"`
	Remark               string    `orm:"column(Remark)"`
	DataStatus           int8      `orm:"column(DataStatus);null"`
	Updatetime           time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	Billfeetype          string    `orm:"column(billfeetype);size(64);null"`
	UnitPrice            float32   `orm:"column(UnitPrice);null"`
	BillNumber           int       `orm:"column(BillNumber);null"`
	BHBillIdentity       string    `orm:"column(BHBillIdentity);size(32);null"`
	BhHandlesetIdentity  string    `orm:"column(BhHandlesetIdentity);size(32);null"`
	BHRowNO              int       `orm:"column(BHRowNO);null"`
	BHHandleCode         string    `orm:"column(BHHandleCode);size(20);null"`
	BHUom                string    `orm:"column(BHUom);size(20);null"`
	BHBillType           int8      `orm:"column(BHBillType);null"`
	BHCalByVIP           string    `orm:"column(BHCalByVIP);size(64);null"`
	LastOperator         string    `orm:"column(LastOperator);size(10);null"`
	ToothFace            string    `orm:"column(ToothFace);size(100);null"`
	BHPriced             uint64    `orm:"column(BHPriced);size(1);null"`
	IsRefund             uint64    `orm:"column(IsRefund);size(1);null"`
	BHNurse              string    `orm:"column(BHNurse);size(128);null"`
	HandleType           int8      `orm:"column(HandleType);null"`
	BHPlanIdentity       string    `orm:"column(BHPlanIdentity);size(20);null"`
	BHDoct               string    `orm:"column(BHDoct);size(64);null"`
	BHDoctIdentity       string    `orm:"column(BHDoctIdentity);size(20);null"`
	BHPlanHandleIdentity string    `orm:"column(BHPlanHandleIdentity);size(20);null"`
}
