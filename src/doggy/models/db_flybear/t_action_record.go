package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TActionRecord struct {
	Id              int       `orm:"column(ActionRecordID);pk"`
	Action          string    `orm:"column(action);null"`
	Terminal        int8      `orm:"column(terminal);null"`
	Address         string    `orm:"column(Address);size(64);null"`
	IpAddr          string    `orm:"column(IpAddr);size(32);null"`
	Operator        string    `orm:"column(operator);size(24);null"`
	Chainid         string    `orm:"column(Chainid);size(24);null"`
	Clinicid        string    `orm:"column(Clinicid);size(24);null"`
	OperateDatetime time.Time `orm:"column(OperateDatetime);type(datetime);null"`
}

func (t *TActionRecord) TableName() string {
	return "t_action_record"
}

func init() {
	orm.RegisterModel(new(TActionRecord))
}
