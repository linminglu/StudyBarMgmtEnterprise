package db_koala

import "time"

type TSchedule struct {
	ChainID                   string    `orm:"column(ChainID);size(64);null"`
	ClinicUniqueID            string    `orm:"column(ClinicUniqueID);size(64)"`
	ScheduleIdentity          string    `orm:"column(ScheduleIdentity);size(40)"`
	StudyIdentity             string    `orm:"column(StudyIdentity);size(40);null"`
	Date                      time.Time `orm:"column(Date);type(datetime);null"`
	StartTime                 time.Time `orm:"column(StartTime);type(datetime);null"`
	EndTime                   time.Time `orm:"column(EndTime);type(datetime);null"`
	DoctorID                  string    `orm:"column(DoctorID);size(40);null"`
	DoctorName                string    `orm:"column(DoctorName);size(128);null"`
	Status                    int8      `orm:"column(Status);null"`
	Confirm                   int8      `orm:"column(Confirm)"`
	Items                     string    `orm:"column(Items);size(255);null"`
	Remark                    string    `orm:"column(Remark);null"`
	ArriveTime                time.Time `orm:"column(ArriveTime);type(datetime);null"`
	CustomerID                string    `orm:"column(CustomerID);size(40);null"`
	CustomerName              string    `orm:"column(CustomerName);null"`
	DataStatus                int8      `orm:"column(DataStatus);null"`
	Updatetime                time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	LastOperator              string    `orm:"column(LastOperator);size(10);null"`
	VisitStatus               int8      `orm:"column(VisitStatus);null"`
	TeethInfo                 string    `orm:"column(TeethInfo);null"`
	ScheduleManId             string    `orm:"column(ScheduleManId);size(20);null"`
	ScheduleMan               string    `orm:"column(ScheduleMan);size(64);null"`
	LostMemo                  string    `orm:"column(LostMemo);size(255);null"`
	FirstScheduleDate         time.Time `orm:"column(FirstScheduleDate);type(datetime);null"`
	FirstScheduleDoctIdentity string    `orm:"column(FirstScheduleDoctIdentity);size(20);null"`
	DataSource                int       `orm:"column(DataSource);null"`
	FBSCHIdentity             string    `orm:"column(FBSCHIdentity);size(20);null"`
}
