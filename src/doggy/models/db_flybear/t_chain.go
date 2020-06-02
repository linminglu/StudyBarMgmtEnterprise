package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TChain struct {
	Id         int       `orm:"column(ChainGUID);pk"`
	ChainName  string    `orm:"column(ChainName);size(100)"`
	Clinicid   string    `orm:"column(clinicid);size(100)"`
	Kuserid    string    `orm:"column(kuserid);size(100)"`
	Mobile     string    `orm:"column(Mobile);size(32);null"`
	Contact    string    `orm:"column(Contact);size(32);null"`
	DataStatus int8      `orm:"column(DataStatus);null"`
	Updatetime time.Time `orm:"column(Updatetime);type(datetime);null"`
	CreateID   string    `orm:"column(CreateID);size(40);null"`
	Logo       string    `orm:"column(Logo);null"`
	Province   string    `orm:"column(Province);size(50);null"`
	City       string    `orm:"column(City);size(50);null"`
	Area       string    `orm:"column(Area);size(50);null"`
	Address    string    `orm:"column(Address);null"`
	Info       string    `orm:"column(Info);null"`
}

func (t *TChain) TableName() string {
	return "t_chain"
}

func init() {
	orm.RegisterModel(new(TChain))
}
