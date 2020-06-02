package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TDoctor struct {
	ChatID            string    `orm:"column(ChatID);size(64);null"`
	ClinicUniqueID    string    `orm:"column(ClinicUniqueID);size(64)"`
	Id                int       `orm:"column(DoctorID);pk"`
	Name              string    `orm:"column(Name);size(64);null"`
	Type              int8      `orm:"column(Type);null"`
	Picture           string    `orm:"column(Picture)"`
	Video1            string    `orm:"column(Video1);null"`
	Video             string    `orm:"column(Video);null"`
	Videothumb        string    `orm:"column(Videothumb);null"`
	Sex               string    `orm:"column(Sex);null"`
	Age               int8      `orm:"column(Age)"`
	Birthday          time.Time `orm:"column(Birthday);type(datetime);null"`
	Phone             string    `orm:"column(Phone);size(32);null"`
	Mobile            string    `orm:"column(Mobile);size(32);null"`
	Duty              string    `orm:"column(Duty);null"`
	Grade             string    `orm:"column(Grade);null"`
	WalletSurplus     float64   `orm:"column(WalletSurplus);null;digits(10);decimals(2)"`
	PurcharseWallet   float64   `orm:"column(PurcharseWallet);null;digits(10);decimals(2)"`
	Department        string    `orm:"column(Department);null"`
	Email             string    `orm:"column(Email);null"`
	Expert            string    `orm:"column(Expert);null"`
	Overview          string    `orm:"column(Overview);null"`
	Education         string    `orm:"column(Education);null"`
	WorkYear          string    `orm:"column(WorkYear);null"`
	Degree            string    `orm:"column(Degree);null"`
	IDNumber          string    `orm:"column(IDNumber);null"`
	Stopped           int8      `orm:"column(Stopped);null"`
	StopedComments    string    `orm:"column(StopedComments);null"`
	Expdate           time.Time `orm:"column(Expdate);type(datetime);null"`
	Privileges        string    `orm:"column(Privileges);null"`
	WorkStatus        uint8     `orm:"column(WorkStatus);null"`
	StartFreeTime     time.Time `orm:"column(StartFreeTime);type(datetime);null"`
	Experience        int       `orm:"column(Experience);null"`
	DataStatus        int8      `orm:"column(DataStatus)"`
	Updatetime        time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	Signature         string    `orm:"column(signature);size(32);null"`
	Openticket        int       `orm:"column(Openticket);null"`
	DefaultClinicID   string    `orm:"column(DefaultClinicID);size(64);null"`
	DefaultClinicName string    `orm:"column(DefaultClinicName);size(64);null"`
	FansNum           int       `orm:"column(FansNum);null"`
	Commentgood       int       `orm:"column(commentgood);null"`
	Commentcommon     int       `orm:"column(commentcommon);null"`
	Commentbad        int       `orm:"column(commentbad);null"`
	Area              string    `orm:"column(Area);size(64);null"`
	Confirmation      string    `orm:"column(Confirmation);null"`
}

func (t *TDoctor) TableName() string {
	return "t_doctor"
}

func init() {
	orm.RegisterModel(new(TDoctor))
}
