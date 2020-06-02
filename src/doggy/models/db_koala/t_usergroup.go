package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TUsergroup struct {
	ChainID        string    `orm:"column(ChainID);size(64);null"`
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);size(50)"`
	Id             int       `orm:"column(UserGroupID);pk"`
	UserGroupName  string    `orm:"column(UserGroupName);size(50);null"`
	GroupDesc      string    `orm:"column(GroupDesc);null"`
	UserPrivileges string    `orm:"column(UserPrivileges);null"`
	DisplayOrder   int       `orm:"column(DisplayOrder);null"`
	UpdateTime     time.Time `orm:"column(UpdateTime);type(datetime);null;auto_now"`
	Rttype         string    `orm:"column(rttype);size(16);null"`
	AppPrivileges  string    `orm:"column(AppPrivileges);null"`
	WebPrivileges  string    `orm:"column(WebPrivileges);null"`
	DataStatus     int8      `orm:"column(DataStatus)"`
	LastOperator   string    `orm:"column(LastOperator);size(20)"`
}

func (t *TUsergroup) TableName() string {
	return "t_usergroup"
}

func init() {
	orm.RegisterModel(new(TUsergroup))
}
