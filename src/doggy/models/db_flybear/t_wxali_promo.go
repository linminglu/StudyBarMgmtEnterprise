package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TWxaliPromo struct {
	Id         int       `orm:"column(promoid);pk"`
	Area       string    `orm:"column(area);size(50);null"`
	Staff      string    `orm:"column(staff);size(50);null"`
	Code       string    `orm:"column(code);size(50);null"`
	IsDelete   string    `orm:"column(isDelete);size(50);null"`
	Createtime time.Time `orm:"column(createtime);type(datetime);null;auto_now_add"`
	Updatetime time.Time `orm:"column(updatetime);type(datetime);null;auto_now"`
}

func (t *TWxaliPromo) TableName() string {
	return "t_wxali_promo"
}

func init() {
	orm.RegisterModel(new(TWxaliPromo))
}
