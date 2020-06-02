package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TWxaliWeixinInfo struct {
	Id                    int       `orm:"column(uid);pk"`
	Contactname           string    `orm:"column(contactname);size(64);null"`
	Contactmobile         string    `orm:"column(contactmobile);size(64);null"`
	Contactemail          string    `orm:"column(contactemail);size(64);null"`
	Shopshortname         string    `orm:"column(shopshortname);size(64);null"`
	Shoptype1             string    `orm:"column(shoptype1);size(64);null"`
	Shoptype2             string    `orm:"column(shoptype2);size(64);null"`
	Shoptype3             string    `orm:"column(shoptype3);size(64);null"`
	BusinessSpecialPic    string    `orm:"column(business_special_pic);size(64);null"`
	Telphone              string    `orm:"column(telphone);size(64);null"`
	Netaddress            string    `orm:"column(netaddress);size(64);null"`
	CompanyName           string    `orm:"column(company_name);size(64);null"`
	CompanyAddress        string    `orm:"column(company_address);size(64);null"`
	BusinessLicenseNo     string    `orm:"column(business_license_no);size(64);null"`
	BusinessScope         string    `orm:"column(business_scope);null"`
	BusinessLicenseIndate string    `orm:"column(business_license_indate);size(50);null"`
	BusinessLicensePic    string    `orm:"column(business_license_pic);size(64);null"`
	OperatorName          string    `orm:"column(operator_name);size(64);null"`
	OperatorCertNo        string    `orm:"column(operator_cert_no);size(64);null"`
	OperatorCertIndate    string    `orm:"column(operator_cert_indate);size(64);null"`
	OperatorCertPicFront  string    `orm:"column(operator_cert_pic_front);size(64);null"`
	OperatorCertPicBack   string    `orm:"column(operator_cert_pic_back);size(64);null"`
	PersonalBankCardNo    string    `orm:"column(personal_bank_card_no);size(64);null"`
	PersonalBankName      string    `orm:"column(personal_bank_name);size(64);null"`
	PersonalBankProvince  string    `orm:"column(personal_bank_province);size(64);null"`
	PersonalBankCity      string    `orm:"column(personal_bank_city);size(64);null"`
	PersonalBankAddress   string    `orm:"column(personal_bank_address);size(64);null"`
	Wechatid              string    `orm:"column(wechatid);size(50);null"`
	MerchantNo            string    `orm:"column(merchant_no);size(50);null"`
	Apikey                string    `orm:"column(apikey);size(50);null"`
	Status                int       `orm:"column(status);null"`
	Createtime            time.Time `orm:"column(createtime);type(timestamp);null;auto_now_add"`
	Updatetime            time.Time `orm:"column(updatetime);type(timestamp);null;auto_now"`
}

func (t *TWxaliWeixinInfo) TableName() string {
	return "t_wxali_weixin_info"
}

func init() {
	orm.RegisterModel(new(TWxaliWeixinInfo))
}
