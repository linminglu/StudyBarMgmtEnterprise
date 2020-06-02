package db_flybear

import (
	"time"

	"github.com/astaxie/beego/orm"
)

type TWxaliAlipayInfo struct {
	Id                              int       `orm:"column(uid);pk"`
	Type                            string    `orm:"column(type);size(64)"`
	OutBizNo                        string    `orm:"column(out_biz_no);size(64);null"`
	LoginId                         string    `orm:"column(login_id);size(64);null"`
	SpecialLicensePic               string    `orm:"column(special_license_pic);size(512);null"`
	LogoPic                         string    `orm:"column(logo_pic);size(128);null"`
	WebAddress                      string    `orm:"column(web_address);size(256);null"`
	WebAuthPic                      string    `orm:"column(web_auth_pic);size(128);null"`
	MccCode                         string    `orm:"column(mcc_code);size(64);null"`
	ContactName                     string    `orm:"column(contact_name);size(64);null"`
	ContactMobile                   string    `orm:"column(contact_mobile);size(64);null"`
	ContactEmail                    string    `orm:"column(contact_email);size(64);null"`
	CompanyName                     string    `orm:"column(company_name);size(64);null"`
	CompanyAddress                  string    `orm:"column(company_address);size(128);null"`
	BusinessLicenseNo               string    `orm:"column(business_license_no);size(32);null"`
	BusinessLicenseIndateStart      string    `orm:"column(business_license_indate_start);size(32);null"`
	BusinessLicenseIndateEnd        string    `orm:"column(business_license_indate_end);size(32);null"`
	BusinessLicensePic              string    `orm:"column(business_license_pic);size(128);null"`
	BusinessScope                   string    `orm:"column(business_scope);size(512);null"`
	BusinessLicenseProvince         string    `orm:"column(business_license_province);size(512);null"`
	BusinessLicenseCity             string    `orm:"column(business_license_city);size(512);null"`
	BusinessLicenseIsThreeInOne     string    `orm:"column(business_license_is_three_in_one);size(4);null"`
	OrgCodeCertificateNo            string    `orm:"column(org_code_certificate_no);size(16);null"`
	OrgCodeCertificatePic           string    `orm:"column(org_code_certificate_pic);size(128);null"`
	BusinessLicenseAuthPic          string    `orm:"column(business_license_auth_pic);size(128);null"`
	LegalRepresentativeName         string    `orm:"column(legal_representative_name);size(128);null"`
	LegalRepresentativeCertType     string    `orm:"column(legal_representative_cert_type);size(16);null"`
	LegalRepresentativeCertNo       string    `orm:"column(legal_representative_cert_no);size(32);null"`
	LegalRepresentativeCertIndate   string    `orm:"column(legal_representative_cert_indate);size(32);null"`
	LegalRepresentativeCertPicFront string    `orm:"column(legal_representative_cert_pic_front);size(128);null"`
	LegalRepresentativeCertPicBack  string    `orm:"column(legal_representative_cert_pic_back);size(128);null"`
	BusinessBankCardNo              string    `orm:"column(business_bank_card_no);size(32);null"`
	BusinessBankAccountName         string    `orm:"column(business_bank_account_name);size(64);null"`
	BusinessBankSub                 string    `orm:"column(business_bank_sub);size(64);null"`
	BusinessBankName                string    `orm:"column(business_bank_name);size(32);null"`
	BusinessBankProvince            string    `orm:"column(business_bank_province);size(32);null"`
	BusinessBankCity                string    `orm:"column(business_bank_city);size(32);null"`
	OperatorName                    string    `orm:"column(operator_name);size(32);null"`
	OperatorCertType                string    `orm:"column(operator_cert_type);size(32);null"`
	OperatorCertNo                  string    `orm:"column(operator_cert_no);size(32);null"`
	OperatorCertIndate              string    `orm:"column(operator_cert_indate);size(32);null"`
	OperatorCertPicFront            string    `orm:"column(operator_cert_pic_front);size(128);null"`
	OperatorCertPicBack             string    `orm:"column(operator_cert_pic_back);size(128);null"`
	PersonalBankCardNo              string    `orm:"column(personal_bank_card_no);size(64);null"`
	PersonalBankAccountMobile       string    `orm:"column(personal_bank_account_mobile);size(64);null"`
	PersonalBankHolderName          string    `orm:"column(personal_bank_holder_name);size(64);null"`
	PersonalBankHolderCertno        string    `orm:"column(personal_bank_holder_certno);size(64);null"`
	ShopName                        string    `orm:"column(shop_name);size(64);null"`
	ShopSignBoardPic                string    `orm:"column(shop_sign_board_pic);size(256);null"`
	ShopScenePicOne                 string    `orm:"column(shop_scene_pic_one);size(128);null"`
	ShopScenePicTwo                 string    `orm:"column(shop_scene_pic_two);size(128);null"`
	ShopScenePicThree               string    `orm:"column(shop_scene_pic_three);size(128);null"`
	AppName                         string    `orm:"column(app_name);size(64);null"`
	AppPlatform                     string    `orm:"column(app_platform);size(64);null"`
	Promocode                       string    `orm:"column(promocode);size(64);null"`
	Createtime                      time.Time `orm:"column(createtime);type(datetime);null;auto_now_add"`
	Status                          int       `orm:"column(status)"`
}

func (t *TWxaliAlipayInfo) TableName() string {
	return "t_wxali_alipay_info"
}

func init() {
	orm.RegisterModel(new(TWxaliAlipayInfo))
}
