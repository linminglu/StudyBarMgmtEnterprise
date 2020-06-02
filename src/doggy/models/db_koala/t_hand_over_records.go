package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type THandOverRecords struct {
	Id             int       `orm:"column(HandOverId);pk"`
	DoctorID       string    `orm:"column(DoctorID);size(40)"`
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);size(64)"`
	HandDoctorID   string    `orm:"column(HandDoctorID);size(40)"`
	DataStatus     int8      `orm:"column(DataStatus)"`
	UpdateTime     time.Time `orm:"column(UpdateTime);type(timestamp);auto_now"`
}

func (t *THandOverRecords) TableName() string {
	return "t_hand_over_records"
}

func init() {
	orm.RegisterModel(new(THandOverRecords))
}
