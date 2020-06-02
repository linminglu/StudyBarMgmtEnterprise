package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TDoctor struct {
	ChainID              string    `orm:"column(ChainID);size(20)"`
	Id                   int       `orm:"column(ClinicUniqueID);pk"`
	DoctorID             string    `orm:"column(DoctorID);size(40)"`
	UserID               string    `orm:"column(UserID);size(40);null"`
	Username             string    `orm:"column(Username);size(32);null"`
	Password             string    `orm:"column(Password);size(45);null"`
	Name                 string    `orm:"column(Name);size(64);null"`
	NickName             string    `orm:"column(NickName);size(64);null"`
	Type                 int8      `orm:"column(Type);null"`
	Picture              string    `orm:"column(Picture)"`
	Sex                  string    `orm:"column(Sex);null"`
	Age                  int8      `orm:"column(Age);null"`
	Birthday             time.Time `orm:"column(Birthday);type(datetime);null"`
	Phone                string    `orm:"column(Phone);size(32);null"`
	Mobile               string    `orm:"column(Mobile);size(32)"`
	Duty                 string    `orm:"column(duty);size(32);null"`
	Grade                string    `orm:"column(Grade);null"`
	Department           string    `orm:"column(Department);null"`
	Email                string    `orm:"column(Email);null"`
	Expert               string    `orm:"column(Expert);null"`
	Overview             string    `orm:"column(Overview);null"`
	IDNumber             string    `orm:"column(IDNumber);null"`
	Stopped              int8      `orm:"column(Stopped);null"`
	StopedComments       string    `orm:"column(StopedComments);null"`
	Expdate              time.Time `orm:"column(Expdate);type(datetime);null"`
	Privileges           string    `orm:"column(Privileges);null"`
	WorkStatus           int8      `orm:"column(WorkStatus);null"`
	StartFreeTime        time.Time `orm:"column(StartFreeTime);type(datetime);null"`
	Experience           int       `orm:"column(Experience);null"`
	DataStatus           int8      `orm:"column(DataStatus)"`
	Updatetime           time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	Habit                int8      `orm:"column(habit);null"`
	AllowMobile          int8      `orm:"column(AllowMobile);null"`
	FirstUse             int8      `orm:"column(FirstUse);null"`
	LoginDateTime        time.Time `orm:"column(LoginDateTime);type(datetime);null"`
	CurrentStudyIdentity string    `orm:"column(CurrentStudyIdentity);size(24);null"`
	FreeDateTime         time.Time `orm:"column(FreeDateTime);type(datetime);null"`
	ChainPrivileges      int8      `orm:"column(ChainPrivileges);null"`
	DisplayOrder         int8      `orm:"column(DisplayOrder);null"`
	LastOperator         string    `orm:"column(LastOperator);size(10);null"`
	Signature            string    `orm:"column(Signature);size(64);null"`
	WeixinQR             string    `orm:"column(WeixinQR);size(255);null"`
	UserNum              string    `orm:"column(UserNum);size(20);null"`
	DepartmentID         string    `orm:"column(DepartmentID);size(50);null"`
	UserIDCardNo         string    `orm:"column(UserIDCardNo);size(20);null"`
	UserMedicalNo        string    `orm:"column(UserMedicalNo);size(20);null"`
	WebDuty              string    `orm:"column(WebDuty);size(20);null"`
	NamePY               string    `orm:"column(NamePY);size(64);null"`
}

func (t *TDoctor) TableName() string {
	return "db_koala.t_doctor"
}

func init() {
	orm.RegisterModel(new(TDoctor))
}
