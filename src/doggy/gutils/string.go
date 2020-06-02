//author:  曾文 2016-11-07
//purpose： 字符类通用函数和常量定义
package gutils

import (
	"crypto/rand"
	"fmt"
	"math/big"
	"os"

	"net/smtp"
	"regexp"
	"strconv"
	"strings"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
	"github.com/zheng-ji/goSnowFlake"
)

const (
	LOG_MOD_HOME       = "我的首页"
	LOG_MOD_PATIENT    = "患者中心"
	LOG_MOD_SCHEDULE   = "预约中心"
	LOG_MOD_FINANCE    = "财务管理"
	LOG_MOD_REPORT     = "运营中心"
	LOG_MOD_VISIT      = "回访中心"
	LOG_MOD_MARKET     = "市场营销"
	LOG_MOD_NETCONSULT = "电网中心"
	LOG_MOD_SYSTEM     = "系统管理"
	LOG_MOD_ATTE       = "考勤排班"
	LOG_MOD_PAYOUT     = "支出管理"
	LOG_MOD_STORE      = "库房管理"

	UG_WEB_ADMIN      = "超级管理员"
	UG_CLI_ADMIN      = "管理员"
	UG_STD_ADMIN      = "主任"
	RT_WEB_ADMIN      = "admin"
	RT_WEB_CONSULT    = "10000" //电网中心权限
	RT_WEB_MARKET     = "20000" //市场营销权限
	RT_WEB_SENDWECHAT = "20001" //发送微信权限
	//RT_WEB_SENDMSG             = "20002" //市场营销--短信模板  权限  yzp
	// RT_WEB_PICTURE             = "20003" //图文列表
	RT_WEB_REPORT              = "30000" //运营中心权限
	RT_WEB_FINANCE             = "40000" //财务统计权限
	RT_WEB_STORE               = "50000" //库房管理权限
	RT_WEB_MANAGE              = "60000" //系统管理权限
	RT_WEB_MANAGE_MEMLIST      = "60001" //员工列表浏览查看权限
	RT_WEB_MANAGE_MEMEXPORT    = "60002" //导出员工列表权限
	RT_WEB_MANAGE_MEMMASSMES   = "60003" //群发短信权限
	RT_WEB_MANAGE_MEMACTIVEMES = "60004" //发送激活短信权限
	RT_WEB_MANAGE_MEMMANAGE    = "60005" //管理员工信息权限(新增/编辑/删除)
	RT_WEB_DEPTINFO            = "60006" //部门管理浏览查看权限
	RT_WEB_DEPTMANAGE          = "60007" //管理部门权限(新增/编辑/删除)
	RT_WEB_PRIVILEGEINFO       = "60008" //权限管理浏览查看
	RT_WEB_PRIVILEGEMANAGE     = "60009" //权限设置管理权限(新增/编辑/删除)
	RT_WEB_CLINICINFO          = "60010" //门诊管理浏览查看权限
	RT_WEB_CLINICMANAGE        = "60011" //管理门诊权限(新增/编辑/删除)

	//原有库房权限
	RT_WEB_STORE_TOTAL          = "1803" //统计库存(查询当前库存中药品等消耗品数量)
	RT_WEB_STORE_BRWAREHOUS     = "1801" //浏览入库单(查看入库单所有数据)
	RT_WEB_STORE_ENWAREHOUS     = "1807" //录入入库单(录入入库单数据)
	RT_WEB_STORE_DELWAREHOUS    = "1808" //删除入库单(删除自己的入库单数据)
	RT_WEB_STORE_REWAREHOUS     = "1805" //审核入库单(入库审核权限)
	RT_WEB_STORE_REDISKALONE    = "1823" //审核盘盈单(盘盈审核权限)
	RT_WEB_STORE_CAWAREHOUS     = "1821" //取消入库单(取消入库单的审核)
	RT_WEB_STORE_UPALLWAREHOUS  = "1809" //修改所有入库单(能修改所有人的入库单数据)
	RT_WEB_STORE_DELALLWAREHOUS = "1810" //删除所有入库单(能删除所有人的入库单数据)
	RT_WEB_STORE_BRINHOUS       = "1802" //浏览出库单(查看出库单所有数据)
	RT_WEB_STORE_ENINHOUS       = "1811" //录入出库单(录入出库单数据)
	RT_WEB_STORE_DELINHOUS      = "1812" //删除出库单(删除自己的出库单数据)
	RT_WEB_STORE_REINHOUS       = "1806" //审核出库单(出库审核权限)
	RT_WEB_STORE_RELOSS         = "1824" //审核盘亏单(盘亏审核权限)
	RT_WEB_STORE_CAINHOUS       = "1822" //取消出库单(取消出库单的审核)
	RT_WEB_STORE_UPALLINHOUS    = "1813" //修改所有出库单(能修改所有人的出库单数据)
	RT_WEB_STORE_DELALLINHOUS   = "1814" //删除所有出库单(能删除所有人的出库单数据)
	RT_WEB_STORE_STORECHUPAN    = "1815" //库房初盘(药品等消耗品的初盘录入)
	RT_WEB_STORE_ENCHUPAN       = "1816" //录入初盘单(录入初盘单数据)
	RT_WEB_STORE_DELCHUPAN      = "1817" //删除初盘单(删除自己的初盘单数据)
	RT_WEB_STORE_ADDCHUPAN      = "1820" //生成盘盈盘亏(生成盘盈盘亏权限)
	RT_WEB_STORE_UPALLCHUPAN    = "1818" //修改所有初盘单(能修改所有人的初盘单数据)
	RT_WEB_STORE_DELALLCHUPAN   = "1819" //删除所有初盘单(能删除所有人的初盘单数据)
	RT_WEB_STORE_STORESET       = "1804" //设置库房基础项(包括供应商、物品资料、物品分类等)

	//新增库房权限
	RT_WEB_STORE_ENTRANSFER     = "1825" //录入调拔单(可以录入调拔单数据)
	RT_WEB_STORE_DELTRANSFER    = "1826" //删除调拔单(可以删除自己录入的调拔单)
	RT_WEB_STORE_DELALLTRANSFER = "1827" //删除所有调拔单(可以删除所有的调拔单)
	RT_WEB_STORE_UPALLTRANSFER  = "1828" //修改所有调拔单(可以修改所有调拔单)
	RT_WEB_STORE_RETRANSFER     = "1829" //审核调拔单(可以审核调拔单)
	RT_WEB_STORE_CONRECEIPT     = "1830" //确认收货(调拔单确认收货)
	RT_WEB_STORE_ADDCOLLAR      = "1831" //新增领用(可以新增领用类型的出库单)
	RT_WEB_STORE_ADDRETURN      = "1832" //新增退货(可以新增退货类型的入库单)
	RT_WEB_STORE_ADDPRJ         = "1833" //新增物品(可以新增物品资料)
	RT_WEB_STORE_UPPRJ          = "1834" //修改物品(可以修改物品资料)
	RT_WEB_STORE_DELPRJ         = "1835" //删除物品(可以删除物品资料)
	RT_WEB_STORE_SETPRJTYPE     = "1836" //设置物品分类(可以设置物品分类)
	RT_WEB_STORE_SETSUPPLIER    = "1837" //设置供应商(可以设置供应商)
	RT_WEB_STORE_PRICESET       = "1838" //出库单价等于入库单价

	RT_WEB_SET_SMSTEMPLATE = "3007" // 设置短信模板

	RT_WEB_SEND_SMS        = "1010" // 发送短信
	RT_WEB_VIEW_PATTEL     = "1012" //查看电话号码
	RT_WEB_VIEW_ALLPATIENT = "1003" // 浏览所有患者
	RT_WEB_EXPORTDATA_2XLS = "2103" //导出数据
	RT_WEB_SCHEDULE_SELF   = "1201" // 接受预约

	//财务统计权限
	RT_WEB_STAT_DOCTWORK        = "40001" //查看医生工作统计
	RT_WEB_STAT_NURSE           = "40002" //查看护士工作统计
	RT_WEB_STAT_ASSISTANT       = "40003" //查看助理工作统计
	RT_WEB_STAT_COUNSELOR       = "40004" //查看咨询统计
	RT_WEB_STAT_NETCONSULT      = "40005" //查看电网统计
	RT_WEB_STAT_CLINICPAYIN     = "40006" //查看诊疗实收统计
	RT_WEB_STAT_ADVANCEPAY      = "40007" //查看预交款统计
	RT_WEB_STAT_VIPCARD         = "40008" //查看会员卡统计
	RT_WEB_STAT_RETAIL          = "40009" //查看零售统计
	RT_WEB_STAT_PAYOUTDETAIL    = "40010" //查看支出明细统计
	RT_WEB_STAT_ARREARS         = "40011" //查看欠费患者统计
	RT_WEB_STAT_ARREARSBLAME    = "40012" //查看欠费责任统计
	RT_WEB_STAT_FREEITEMS       = "40013" //查看免费项目统计
	RT_WEB_STAT_DISCOUNTITEMS   = "40014" //查看折扣项目统计
	RT_WEB_STAT_REFUNDFEE       = "40015" //查看退费单统计
	RT_WEB_STAT_PAYBILLINVALID  = "40016" //查看收费单作废统计
	RT_WEB_STAT_ALIPAYDEBIT     = "40017" //查看支付宝对账统计
	RT_WEB_STAT_WEIXINDEBIT     = "40018" //查看微信对账统计
	RT_WEB_STAT_PAYSTREAM       = "40019" //查看流水单查询统计
	RT_WEB_STAT_CHARGELIST      = "40020" //查看收银查询统计
	RT_WEB_STAT_DAYSREPORT      = "40021" //查看日结报表统计
	RT_WEB_STAT_VISITLIST       = "40022" //查看就诊流水统计
	RT_WEB_STAT_OUTPROCESS      = "40023" //查看外加工查询
	RT_WEB_STAT_OUTPROCESSLIST  = "40024" //查看外加工统计
	RT_WEB_STAT_TREATMENTPLAN   = "40025" //查看治疗计划
	RT_WEB_STAT_PLANTOUSE       = "40026" //查看计划使用
	RT_WEB_STAT_PROCONTOTAL     = "40027" //查看项目消费
	RT_WEB_STAT_FINANCEINCOME   = "40028" //查看收入统计
	RT_WEB_STAT_PATIENTPAGE     = "40029" //查看患者分析统计
	RT_WEB_STAT_PROCONDETAIL    = "40030" //查看消费明细
	RT_WEB_STAT_PATIENTPRATEAGE = "40031" //查看成交率
	RT_WEB_STAT_LOANDATA        = "40032" //查看贷款统计
	RT_WEB_STAT_QCITEMREPORT    = "40033" //查看质控质检报表
	RT_WEB_STAT_QCPLANREPORT    = "40034" //查看质控计划报表
	RT_WEB_STAT_VIPINTEGRAL     = "40035" //查看会员积分

	//电网权限
	RT_WEB_SET_SERVERCTN       = "3013" //客服中心
	RT_WEB_CANCEL_NETCONSULT   = "3015" //取消网电（客服--网电界面）
	RT_WEB_CANCEL_NETSCHEDULE  = "3016" //取消预约（客服--网电界面）
	RT_WEB_VIEW_ALLNETSCHEDULE = "3017" //查看所有网电录入信息（客服--网电界面）
	RT_WEB_SET_CONSULTMAN      = "3018" //设定电网受理人
	RT_WEB_VIEW_ALLCONSULTMAN  = "3019" //查看所有受理人的电网信息

	RT_WEB_MODID_PATIENTID = "1005" // 设置病历号规则
	RT_WEB_SET_PRACTICE    = "3001" /// 设置诊所信息
	RT_WEB_VIEW_BILL             = "1401" /// 查看收费信息
	//电网新权限
	RT_WEB_CONSULT_IDROLE     = "10001" // 设置电网病历号规则
	RT_WEB_CONSULT_DICTIONSET = "10002" // 设置电网基础数据
	RT_WEB_CONSULT_STATNET    = "10003" // 查看电网咨询报表
	RT_WEB_CONSULT_STATARRIVE = "10004" // 查看电网上门报表
	RT_WEB_CONSULT_STATITEM   = "10005" // 查看咨询项目报表
	RT_WEB_CONSULT_STATPERF   = "10006" // 查看客服业绩报表
	RT_WEB_CONSULT_STATCOMFRM = "10007" // 查看客服业绩报表
	RT_WEB_CONSULT_PATLIST    = "10008" // 查看电网患者列表

	//版本常量
	VR_NEW_VIPLEVEl = "3.9.900.1" //新会员开始使用版本

)

var FINANCE_RIGHT = []string{RT_WEB_FINANCE,
	RT_WEB_STAT_DOCTWORK,
	RT_WEB_STAT_NURSE,
	RT_WEB_STAT_ASSISTANT,
	RT_WEB_STAT_COUNSELOR,
	RT_WEB_STAT_NETCONSULT,
	RT_WEB_STAT_CLINICPAYIN,
	RT_WEB_STAT_ADVANCEPAY,
	RT_WEB_STAT_VIPCARD,
	RT_WEB_STAT_RETAIL,
	RT_WEB_STAT_PAYOUTDETAIL,
	RT_WEB_STAT_ARREARS,
	RT_WEB_STAT_ARREARSBLAME,
	RT_WEB_STAT_FREEITEMS,
	RT_WEB_STAT_DISCOUNTITEMS,
	RT_WEB_STAT_REFUNDFEE,
	RT_WEB_STAT_PAYBILLINVALID,
	RT_WEB_STAT_ALIPAYDEBIT,
	RT_WEB_STAT_WEIXINDEBIT,
	RT_WEB_STAT_PAYSTREAM,
	RT_WEB_STAT_CHARGELIST,
	RT_WEB_STAT_DAYSREPORT,
	RT_WEB_STAT_VISITLIST,
	RT_WEB_STAT_OUTPROCESS,
	RT_WEB_STAT_OUTPROCESSLIST,
	RT_WEB_STAT_FINANCEINCOME,
	RT_WEB_STAT_PATIENTPAGE,
	RT_WEB_STAT_PATIENTPRATEAGE}

var FuncMap = map[string]string{
	"10000": "电网统计",
	"60001": "连锁管理",
	"80000": "会员列表",
	"80001": "会员权益",
	"80002": "会员充值",
	"80003": "会员开卡",
	"80004": "会员卡权益",
	"80005": "会员账单",
	"30001": "运营(APP)",
	"10003": "预约中心",
	"10002": "新增预约",
	"10001": "电网首页",
	"20000": "市场营销",
	"20001": "短信发送",
	"20002": "微官网",
	"20003": "图文列表",
	"20004": "诊所位置",
	"30000": "运营中心",
	"40000": "财务管理",
	"50000": "库房管理",
	"60000": "系统管理",
}

/*
func AjaxMsg(code int, message string) {
	this.Data["json"] = map[string]interface{}{"code": code, "message": message}
	this.ServeJSON()
	return
}
*/
//字串截取
func SubString(s string, pos, length int) string {
	runes := []rune(s)
	l := pos + length
	if l > len(runes) {
		l = len(runes)
	}
	return string(runes[pos:l])
}

func GetFileSuffix(s string) string {
	re, _ := regexp.Compile(".(jpg|jpeg|png|gif|exe|doc|docx|ppt|pptx|xls|xlsx)")
	suffix := re.ReplaceAllString(s, "")
	return suffix
}

func RandInt64(min, max int64) int64 {
	maxBigInt := big.NewInt(max)
	i, _ := rand.Int(rand.Reader, maxBigInt)
	if i.Int64() < min {
		RandInt64(min, max)
	}
	return i.Int64()
}

func Strim(str string) string {
	str = strings.Replace(str, "\t", "", -1)
	str = strings.Replace(str, " ", "", -1)
	str = strings.Replace(str, "\n", "", -1)
	str = strings.Replace(str, "\r", "", -1)
	return str
}

func Unicode(rs string) string {
	json := ""
	for _, r := range rs {
		rint := int(r)
		if rint < 128 {
			json += string(r)
		} else {
			json += "\\u" + strconv.FormatInt(int64(rint), 16)
		}
	}
	return json
}

func HTMLEncode(rs string) string {
	html := ""
	for _, r := range rs {
		html += "&#" + strconv.Itoa(int(r)) + ";"
	}
	return html
}

/**
 *  to: example@example.com;example1@163.com;example2@sina.com.cn;...
 *  subject:The subject of mail
 *  body: The content of mail
 */
func SendMail(to string, subject string, body string) error {
	user := beego.AppConfig.String("mailfrom")
	password := beego.AppConfig.String("mailpassword")
	host := beego.AppConfig.String("mailhost")

	hp := strings.Split(host, ":")
	auth := smtp.PlainAuth("", user, password, hp[0])
	var content_type string
	content_type = "Content-type:text/html;charset=utf-8"

	msg := []byte("To: " + to + "\r\nFrom: " + user + "<" + user + ">\r\nSubject: " + subject + "\r\n" + content_type + "\r\n\r\n" + body)
	send_to := strings.Split(to, ";")
	err := smtp.SendMail(host, auth, user, send_to, msg)
	return err
}

var iw *goSnowFlake.IdWorker

func CreateGUID() int64 {
	if iw == nil {
		pid := int64(os.Getpid())
		pid = pid % 100
		iw, _ = goSnowFlake.NewIdWorker(pid)
	}

	if id, err := iw.NextId(); err != nil {
		return 0
	} else {
		return id
	}
}

func CreateSTRGUID() string {
	return strconv.FormatInt(CreateGUID(), 10)
}

func CreateUID() (val string, err error) {
	var param config.LJSON
	param.Set("funcid").SetInt(FUNC_ID_GET_STUDY_UID)
	res := FlybearCPlus(param)
	if res.Get("code").Int() == 1 {
		val = res.Get("res").String()
	} else {
		err = fmt.Errorf("%s", "Create UID Failed!")
	}
	return val, err
}

//返回PC版本  //是否专业版  0标准版 1 专业版 2简易版
func GetPCVersion(version string) int {
	if version == "" {
		return 0
	}

	v := strings.Split(version, ".")
	if len(v) < 4 {
		return 2
	}
	if v[2] == "900" || v[2] == "800" {
		return 1
	}
	if v[0] == "2" {
		return 2
	}
	if v[0] == "3" {
		return 2
	}
	return 0
}

//返回  1:前面版本号比后面版本号新或相等 ,0:前面版本号比后面版本号旧, -1 不是相同类型版本(如一个是专业版,一个是标准版)
func VersionCompare(version1 string, version2 string) int {
	v1 := strings.Split(version1, ".")
	v2 := strings.Split(version2, ".")

	if len(v1) < 4 {
		return 0
	}
	if len(v2) < 4 {
		return 1
	}

	//不同类型版本
	if v1[2] != v2[2] {
		return -1
	}
	//主版本号小
	if StrToInt(v1[0], 0) < StrToInt(v2[0], 0) {
		return 0
	}
	//主版本号大
	if StrToInt(v1[0], 0) > StrToInt(v2[0], 0) {
		return 1
	}
	//次版本号小
	if StrToInt(v1[1], 0) < StrToInt(v2[1], 0) {
		return 0
	}
	//次版本号大
	if StrToInt(v1[1], 0) > StrToInt(v2[1], 0) {
		return 1
	}

	//编译号小
	if StrToInt(v1[3], 0) < StrToInt(v2[3], 0) {
		return 0
	}

	//编译号大或相等
	return 1
}

func StrToInt(s string, v int) int {
	i, error := strconv.Atoi(s)
	if error != nil { //出错,用默认值
		i = v
	}
	return i
}

func inttostr(i int) string {
	return strconv.Itoa(i)
}

func StrToInt64(s string, v int64) int64 {
	i, error := strconv.ParseInt(s, 10, 64)
	if error != nil { //出错,用默认值
		i = v
	}
	return i
}

func int64tostr(i int64) string {
	return strconv.FormatInt(i, 10)
}

func toString(a interface{}) string {

	if v, p := a.(int); p {
		return strconv.Itoa(v)
	}

	if v, p := a.(float64); p {
		return strconv.FormatFloat(v, 'f', -1, 64)
	}

	if v, p := a.(float32); p {
		return strconv.FormatFloat(float64(v), 'f', -1, 32)
	}

	if v, p := a.(int16); p {
		return strconv.Itoa(int(v))
	}
	if v, p := a.(uint); p {
		return strconv.Itoa(int(v))
	}
	if v, p := a.(int32); p {
		return strconv.Itoa(int(v))
	}
	return ""
}

func strtofloat(s string, v float64) float64 {
	f, error := strconv.ParseFloat(s, 64)
	if error != nil { //出错,用默认值
		f = v
	}
	return f
}
func IntToHtmlColor(color int) (result string) {
	if color < 0 {
		color = 0
	}
	blue := color >> 16
	green := (color & 0x00FF00) >> 8
	red := color & 0x0000FF
	result = fmt.Sprintf("#%02X%02X%02X", red, green, blue)
	return
}
