package db_koala

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TUserRelationship struct {
	Id             int       `orm:"column(ClinicUniqueID);pk"`
	RelationshipID string    `orm:"column(RelationshipID);size(40)"`
	UserID1        string    `orm:"column(UserID1);size(40)"`
	UserID2        string    `orm:"column(UserID2);size(40)"`
	Type           int8      `orm:"column(Type)"`
	Favorite       int8      `orm:"column(Favorite);null"`
	Authentication int8      `orm:"column(Authentication)"`
	DataStatus     int8      `orm:"column(DataStatus);null"`
	Updatetime     time.Time `orm:"column(Updatetime);type(timestamp);null;auto_now"`
}

func (t *TUserRelationship) TableName() string {
	return "t_user_relationship"
}

func init() {
	orm.RegisterModel(new(TUserRelationship))
}
