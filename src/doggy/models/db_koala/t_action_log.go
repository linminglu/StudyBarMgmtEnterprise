package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TActionLog struct {
	Id              int       `orm:"column(ActionRecordID);pk"`
	Action          string    `orm:"column(action);null"`
	Terminal        int8      `orm:"column(terminal);null"`
	Address         string    `orm:"column(Address);size(64);null"`
	IpAddr          string    `orm:"column(IpAddr);size(32);null"`
	Operator        string    `orm:"column(operator);size(24);null"`
	ChainID         string    `orm:"column(ChainID);size(24);null"`
	ClinicID        string    `orm:"column(ClinicID);size(24);null"`
	OperateDatetime time.Time `orm:"column(OperateDatetime);type(datetime);null"`
}

func (t *TActionLog) TableName() string {
	return "t_action_log"
}

func init() {
	orm.RegisterModel(new(TActionLog))
}
