package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TUser struct {
	Id                 int       `orm:"column(UserID);pk"`
	Username           string    `orm:"column(Username);size(32);null"`
	Password           string    `orm:"column(Password);size(32);null"`
	RoleID             int8      `orm:"column(RoleID)"`
	Session            string    `orm:"column(Session);null"`
	Mobile             string    `orm:"column(Mobile);size(32);null"`
	DataStatus         int       `orm:"column(DataStatus);null"`
	Email              string    `orm:"column(Email);size(128);null"`
	Openid             string    `orm:"column(openid);size(40);null"`
	Token              string    `orm:"column(token);size(128);null"`
	Source             int8      `orm:"column(source);null"`
	Status             int8      `orm:"column(Status);null"`
	Device             int8      `orm:"column(Device);null"`
	IosToken           string    `orm:"column(IosToken);size(128);null"`
	IsOnline           int8      `orm:"column(IsOnline);null"`
	DentalID           string    `orm:"column(DentalID);size(16);null"`
	ChatUserID         string    `orm:"column(ChatUserID);size(40);null"`
	ChatUserPassword   string    `orm:"column(ChatUserPassword);size(40);null"`
	ChatID             string    `orm:"column(ChatID);size(40);null"`
	ChatPassword       string    `orm:"column(ChatPassword);size(40);null"`
	Longitude          float64   `orm:"column(Longitude);null;digits(10);decimals(6)"`
	Latitude           float64   `orm:"column(Latitude);null;digits(10);decimals(6)"`
	Geohash            string    `orm:"column(geohash);size(20);null"`
	CreateTime         time.Time `orm:"column(CreateTime);type(datetime)"`
	LastLoginTime      time.Time `orm:"column(LastLoginTime);type(datetime)"`
	Version            string    `orm:"column(Version);size(32);null"`
	Updatetime         time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	Key                string    `orm:"column(Key);size(64)"`
	IsOfficial         int8      `orm:"column(IsOfficial)"`
	SoftWareType       int8      `orm:"column(SoftWareType);null"`
	UserNo             int       `orm:"column(UserNo)"`
	PasswordComplexity uint8     `orm:"column(PasswordComplexity);null"`
}

func (t *TUser) TableName() string {
	return "t_user"
}

func init() {
	orm.RegisterModel(new(TUser))
}
