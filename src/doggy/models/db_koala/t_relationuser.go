package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TRelationuser struct {
	ClinicUniqueID   string    `orm:"column(ClinicUniqueID);size(64)"`
	RelaIdentity     string    `orm:"column(RelaIdentity);size(20)"`
	RelaUserIdentity string    `orm:"column(RelaUserIdentity);size(20);null"`
	RelaUserName     string    `orm:"column(RelaUserName);size(128);null"`
	RelaType         int8      `orm:"column(RelaType);null"`
	Id               int       `orm:"column(RuIdentity);pk"`
	RelaUserCount    int       `orm:"column(RelaUserCount);null"`
	UpdateTime       time.Time `orm:"column(UpdateTime);type(timestamp);auto_now"`
	LastOperator     string    `orm:"column(LastOperator);size(10)"`
}

func (t *TRelationuser) TableName() string {
	return "t_relationuser"
}

func init() {
	orm.RegisterModel(new(TRelationuser))
}
