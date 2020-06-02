package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TClinic struct {
	Id             int       `orm:"column(ClinicID);pk"`
	DBID           int       `orm:"column(DBID)"`
	Name           string    `orm:"column(Name);size(64);null"`
	Type           uint64    `orm:"column(Type);size(2);null"`
	Picture        string    `orm:"column(Picture);null"`
	Video          string    `orm:"column(Video);size(256);null"`
	VideoThumb     string    `orm:"column(VideoThumb);size(256);null"`
	Phone          string    `orm:"column(Phone);size(256);null"`
	Mobile         string    `orm:"column(Mobile);size(32);null"`
	BindMobile     string    `orm:"column(BindMobile);size(32);null"`
	Contact        string    `orm:"column(Contact);size(32);null"`
	QQ             string    `orm:"column(QQ);size(32);null"`
	Address        string    `orm:"column(Address);null"`
	Info           string    `orm:"column(Info);null"`
	ChatGroupID    string    `orm:"column(ChatGroupID);size(40)"`
	CreateTime     time.Time `orm:"column(CreateTime);type(datetime);null"`
	DataStatus     int8      `orm:"column(DataStatus);null"`
	Updatetime     time.Time `orm:"column(Updatetime);type(timestamp);null;auto_now"`
	FansNum        int       `orm:"column(FansNum);null"`
	Commentgood    int       `orm:"column(commentgood);null"`
	Commentcommon  int       `orm:"column(commentcommon);null"`
	Commentbad     int       `orm:"column(commentbad);null"`
	Logo           string    `orm:"column(Logo);null"`
	ChatID         string    `orm:"column(ChatID);size(64);null"`
	Introduce      string    `orm:"column(introduce);size(256);null"`
	Event          string    `orm:"column(event);size(256);null"`
	StartBussTime  time.Time `orm:"column(StartBussTime);type(time);null"`
	EndBussTime    time.Time `orm:"column(EndBussTime);type(time);null"`
	Tplno          int8      `orm:"column(Tplno);null"`
	MallID         string    `orm:"column(MallID);size(50);null"`
	ComeFrom       string    `orm:"column(ComeFrom);size(20)"`
	Hospitalicon   string    `orm:"column(hospitalicon);null"`
	ClinicCity     string    `orm:"column(ClinicCity);size(50);null"`
	ClinicProvince string    `orm:"column(ClinicProvince);size(50);null"`
	ClinicArea     string    `orm:"column(ClinicArea);size(50);null"`
	SoftWareType   int8      `orm:"column(SoftWareType);null"`
	InstalledPC    int       `orm:"column(InstalledPC);null"`
	CreateID       string    `orm:"column(CreateID);size(40);null"`
	LastOperator   string    `orm:"column(LastOperator);size(10);null"`
}

func (t *TClinic) TableName() string {
	return "t_clinic"
}

func init() {
	orm.RegisterModel(new(TClinic))
}
