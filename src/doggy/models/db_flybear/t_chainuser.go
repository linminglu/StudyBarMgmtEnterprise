package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TChainuser struct {
	Id             int       `orm:"column(ChainUserGUID);pk"`
	ChainGUID      string    `orm:"column(ChainGUID);size(40)"`
	Clinicid       string    `orm:"column(clinicid);size(40)"`
	KUserID        string    `orm:"column(KUserID);size(40)"`
	UserID         string    `orm:"column(UserID);size(40)"`
	Privileges     int8      `orm:"column(Privileges)"`
	DataStatus     int8      `orm:"column(DataStatus);null"`
	Updatetime     time.Time `orm:"column(Updatetime);type(datetime);null"`
	PrivilegesPat  int8      `orm:"column(PrivilegesPat);null"`
	PrivilegesStat int8      `orm:"column(PrivilegesStat);null"`
	IsSupper       int8      `orm:"column(IsSupper)"`
}

func (t *TChainuser) TableName() string {
	return "t_chainuser"
}

func init() {
	orm.RegisterModel(new(TChainuser))
}
