package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TDepartment struct {
	Id             int       `orm:"column(DepartmentID);pk"`
	ChainID        string    `orm:"column(ChainID);size(50)"`
	ClinicUniqueID string    `orm:"column(ClinicUniqueID);size(50)"`
	DepartmentName string    `orm:"column(DepartmentName);size(100)"`
	DataStatus     int8      `orm:"column(DataStatus);null"`
	UpdateTime     time.Time `orm:"column(UpdateTime);type(timestamp);auto_now"`
	LastOperator   string    `orm:"column(LastOperator);size(10)"`
}

func (t *TDepartment) TableName() string {
	return "t_department"
}

func init() {
	orm.RegisterModel(new(TDepartment))
}
