package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TEduPromotion struct {
	Id               int       `orm:"column(PromotionIdentity);pk"`
	ClinicID         string    `orm:"column(ClinicID);size(20);null"`
	CategoryIdentity string    `orm:"column(CategoryIdentity);size(20);null"`
	TermTime         time.Time `orm:"column(TermTime);type(datetime);null"`
	UpdateTime       time.Time `orm:"column(UpdateTime);type(datetime);null;auto_now"`
	DataStatus       int8      `orm:"column(DataStatus);null"`
	Operator         string    `orm:"column(Operator);size(50);null"`
}

func (t *TEduPromotion) TableName() string {
	return "t_edu_promotion"
}

func init() {
	orm.RegisterModel(new(TEduPromotion))
}
