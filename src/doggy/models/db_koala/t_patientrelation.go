package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TPatientrelation struct {
	ChainID              string    `orm:"column(ChainID);size(64);null"`
	ClinicUniqueID       string    `orm:"column(ClinicUniqueID);size(64)"`
	Id                   int       `orm:"column(PRelationIdentity);pk"`
	PPatientIdentity     string    `orm:"column(PPatientIdentity);size(20);null"`
	PPatRelationIdentity string    `orm:"column(PPatRelationIdentity);size(20);null"`
	PRelationType        string    `orm:"column(PRelationType);size(100);null"`
	PRelationMark        string    `orm:"column(PRelationMark);size(100);null"`
	Updatetime           time.Time `orm:"column(Updatetime);type(timestamp);auto_now"`
	DataStatus           uint8     `orm:"column(DataStatus);null"`
	LastOperator         string    `orm:"column(LastOperator);size(10)"`
}

func (t *TPatientrelation) TableName() string {
	return "t_patientrelation"
}

func init() {
	orm.RegisterModel(new(TPatientrelation))
}
