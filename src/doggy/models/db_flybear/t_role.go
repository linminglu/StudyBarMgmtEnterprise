package db_flybear

type TRole struct {
	Rttype string `orm:"column(rttype);size(16)"`
	Name   string `orm:"column(name)"`
}
