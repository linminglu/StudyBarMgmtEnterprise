package db_koala

import "time"

type TStudy struct {
	ClinicUniqueID     string    `orm:"column(ClinicUniqueID);size(64)"`
	ChainID            string    `orm:"column(ChainID);size(64)"`
	StudyIdentity      string    `orm:"column(StudyIdentity);size(40)"`
	StudyUID           string    `orm:"column(StudyUID);size(64);null"`
	HasImage           int8      `orm:"column(HasImage);null"`
	Status             int       `orm:"column(Status);null"`
	Description        string    `orm:"column(Description);size(100);null"`
	CreateUserIdentity string    `orm:"column(CreateUserIdentity);size(40);null"`
	CreateDate         time.Time `orm:"column(CreateDate);type(datetime);null"`
	DoctorIDExpected   string    `orm:"column(DoctorIDExpected);size(40);null"`
	Type               string    `orm:"column(Type);null"`
	IsFirstVisit       int8      `orm:"column(IsFirstVisit);null"`
	DoctorIDExam       string    `orm:"column(DoctorIDExam);size(40);null"`
	ExamDate           time.Time `orm:"column(ExamDate);type(datetime);null"`
	RegistrationTime   time.Time `orm:"column(RegistrationTime);type(datetime);null"`
	StartTime          time.Time `orm:"column(StartTime);type(datetime);null"`
	FinishTime         time.Time `orm:"column(FinishTime);type(datetime);null"`
	CustomerID         string    `orm:"column(CustomerID);size(40);null"`
	DataStatus         int8      `orm:"column(DataStatus);null"`
	Updatetime         time.Time `orm:"column(Updatetime);type(timestamp);null;auto_now"`
	StudyID            string    `orm:"column(StudyID);size(64);null"`
	Age                string    `orm:"column(Age);size(10);null"`
	LastOperator       string    `orm:"column(LastOperator);size(10);null"`
	ExpectDoctIdentity string    `orm:"column(ExpectDoctIdentity);size(20);null"`
	ExpectDoct         string    `orm:"column(ExpectDoct);size(20);null"`
	ExamDoct           string    `orm:"column(ExamDoct);size(64);null"`
	StudyStatus        int       `orm:"column(StudyStatus);null"`
	Triagetime         time.Time `orm:"column(Triagetime);type(datetime);null"`
	ArriveTime         time.Time `orm:"column(ArriveTime);type(datetime);null"`
	HospitalNo         string    `orm:"column(HospitalNo);size(255);null"`
	FinishDate         time.Time `orm:"column(FinishDate);type(datetime);null"`
	TriageUserID       string    `orm:"column(TriageUserID);size(20);null"`
}
