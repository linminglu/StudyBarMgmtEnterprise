//author:  曾文 2016-11-07
//purpose： 控制器基类,记录用户登录信息,权限校验和参数处理

package base

import (
	"encoding/json"
	"log"
	"strconv"
	"strings"
	"time"

	"doggy/gutils"
	"doggy/gutils/gredis"
	//models "doggy/models/clinic"
	"fmt"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/logs"
	"github.com/tealeg/xlsx"
)

//EagleSession
type EagleSession struct {
	Sessionon       bool
	SessionName     string
	SessionProvider string
	SessionHashKey  string
}

var SvrSession EagleSession

func init() {
	SvrSession.Sessionon, _ = beego.AppConfig.Bool("sessionon")
	sessionname := beego.AppConfig.String("sessionname")
	if sessionname == "" {
		sessionname = "beegosessionID"
	}
	SvrSession.SessionName = sessionname
	SvrSession.SessionProvider = beego.AppConfig.String("sessionprovider")
	SvrSession.SessionHashKey = beego.AppConfig.String("sessionhashkey")
}

//基础结构
type LErrorController struct {
	beego.Controller
}

//基础结构
type LBaseController struct {
	beego.Controller
}

//诊所基础结构
type LEagleBaseController struct {
	LBaseController
	UserID        string       //用户ID
	UserName      string       //用户名
	Email         string       //邮箱
	HeadImg       string       //头像
	UserNo        string       //BBs的ID
	Mobile        string       //手机号
	ChainID       string       //连锁店ID
	ChainName     string       //连锁店名称
	ClinicIDList  string       //连锁店下诊所列表 以","隔开
	ChainUserName string       //连锁店内用户名
	ChainWebRight string       //连锁店WEB权限
	ChainSupper   string       //超级管理员
	Mtype         string       //连锁是否开通
	RemoteIP      string       //外网IP
	LastLoginTime string       //上次登录时间
	RightJson     config.LJSON //权限表
	ChainView     string       //是否有浏览整个连锁的权限
	RigthValue    string       //按模块校验的值
	PrepareTime   time.Time    //请求的开始时间
}

//库房基础结构
type LStoreBaseController struct {
	LEagleBaseController
	SubClinicID  string //分店诊所ID
	DisplyModel  int    //诊所ID和传来的集团ID一致的情况下,不显示调整拔功能
	Level        int    //1为主诊所
	CuClinicName string //当前诊所名称
	IsShared     string //库房是否共用,1是,0否
}

//pc会员基础结构
type LPCVIPBaseController struct {
	LEagleBaseController
	SubClinicID string //分店诊所ID
	ClinicName  string //分店诊所名字
}

//蚂蚁金服结构
type LAntBaseController struct {
	LBaseController
	UserID   string //用户ID
	UserName string //用户名
	Email    string //邮箱
	HeadImg  string //头像
	UserNo   string //BBs的ID
	Mobile   string //手机号
	ChainID  string //连锁店ID
	IsLogin  bool   //是否登入
}

//蚂蚁金服后台结构Antmanage
type LAntmangeBaseController struct {
	LBaseController
	UserID      string //用户ID
	UserName    string //用户名
	PrepareTime time.Time
}

//营销权限
type LMarketControllerMAuth struct {
	LEagleBaseController
	Std string
}

//营销小权限]
type LMarketControllerSmarMtAut struct {
	AuthMsg bool //发送权限
	LMarketControllerMAuth
}

//市场营销权限分支  短信模板  权限  yzp  20170213
type LMarketControllerMsgSendtAut struct {
	AuthMsgSend   bool //市场营销--短信模板  权限  yzp
	AuthSetSMStpl bool //市场营销--短信模板设置  权限  yzp
	AnthSendSMS   bool //市场营销--发送短信  权限  yzp
	LMarketControllerMAuth
}

func (t *LBaseController) CheckSJ(err gutils.LError) {
	if err.Msg != nil {
		var data gutils.LResultAjax
		data.Code = 0
		data.Info = err.Msg.Error()
		t.Data["json"] = data
		t.ServeJSON()
		t.StopRun()
		//panic("")
	}
}

//检验处理任务是否有错误
func (t *LBaseController) Check(param gutils.LResultModel, err gutils.LError) gutils.LResultModel {
	if err.Msg != nil {
		logs.Error(err.Caption, ",", err.Msg)
		//panic("501")
		s := err.Msg.Error()
		t.Redirect("/errmsg/"+s, 302)
		t.StopRun()
		//panic("")
	}
	// if err.Msg != nil {
	// 	// last panic user string
	// 	panic("404")
	// }
	return param
}

//检验处理任务是否有错误
func (t *LBaseController) CheckJ(param gutils.LResultModel, err gutils.LError) (result gutils.LResultAjax) {
	/*if err.Code == gutils.ParamError {
		result.Code = 0
		result.Info = err.Msg.Error()
		return result
	}*/
	if err.Msg != nil {
		var data gutils.LResultAjax
		data.Code = 0
		data.Info = err.Msg.Error()
		t.Data["json"] = data
		t.ServeJSON()
		t.StopRun()
		//panic("")
	}
	result.Code = 1
	result.Info = "ok"
	result.List = param.List.Interface()
	if param.TotalList.Interface() != nil {
		result.Main = param.TotalList.Interface()
	}
	result.Command = param.Command
	result.PageNo = param.PageNo
	result.PageSize = param.PageSize
	result.TotalCount = param.TotalCount
	return result
}

//检查移动端扫描二维码后，登录是否错误
func (t *LBaseController) CheckJScan(param gutils.LResultModel, err gutils.LError) (result gutils.LResultModel) {
	if err.Msg != nil {
		var data gutils.LResultAjax
		data.Code = 0
		data.Info = err.Msg.Error()
		t.SetSession("error", err.Msg.Error())
		t.Redirect("/report/mobile/loginerror", 302)
		t.Data["json"] = data
		t.ServeJSON()
		t.StopRun()
		//panic("")
	}
	return param
}

func (t *LBaseController) CheckPerson(param gutils.LResultModel, err gutils.LError) (result gutils.LResultModel) {
	if err.Msg != nil {
		t.Redirect("/college/error", 302)
	}
	return param
}

func (t *LBaseController) CheckData(param gutils.LResultModel, err gutils.LError) (result gutils.LResultModel) {
	if err.Msg != nil {
		t.Redirect("/college/nodata", 302)
	}
	return param
}

func (t *LBaseController) CheckMall(param gutils.LResultModel, err gutils.LError) (result gutils.LResultModel) {
	if err.Msg != nil {
		var data gutils.LResultAjax
		data.Code = 0
		data.Info = err.Msg.Error()
		t.SetSession("error", err.Msg.Error())
		t.Redirect("/report/mobile/mallerror", 302)
		t.Data["json"] = data
		t.ServeJSON()
		t.StopRun()
		//panic("")
	}
	return param
}

//检验处理任务是否有错误,如果没有错误,还是返回LResultModel
func (t *LBaseController) CheckJM(param gutils.LResultModel, err gutils.LError) (result gutils.LResultModel) {
	if err.Msg != nil {
		var data gutils.LResultAjax
		data.Code = 0
		data.Info = err.Msg.Error()
		t.Data["json"] = data
		t.ServeJSON()
		t.StopRun()
		//panic("")
	}
	return param
}

//输出错误信息
func (t *LBaseController) ErrorJ(msg string) {
	var data gutils.LResultAjax
	data.Code = 0
	data.Info = msg
	t.Data["json"] = data
	t.ServeJSON()
}

//输出登录错误信息
func (t *LBaseController) ErrorJScan(msg string) {
	var data gutils.LResultAjax
	data.Code = 0
	data.Info = msg
	t.SetSession("error", msg)
	t.Redirect("/report/mobile/loginerror", 302)
	t.Data["json"] = data
	t.ServeJSON()
	t.StopRun()
	//panic("")
}

//商城登录错误提示页
func (t *LBaseController) ErrorMall(msg string) {
	var data gutils.LResultAjax
	data.Code = 0
	data.Info = msg
	t.SetSession("error", msg)
	t.Redirect("/report/mobile/mallerror", 302)
	t.Data["json"] = data
	t.ServeJSON()
	t.StopRun()
	//panic("")
}

//输出成功信息
func (t *LBaseController) SuccessJ(msg string) {
	var data gutils.LResultAjax
	data.Code = 1
	data.Info = msg
	t.Data["json"] = data
	t.ServeJSON()
}

func (c *LErrorController) Error404() {
	c.Data["content"] = "page not found"
	c.TplName = "404.html"
}

func (c *LErrorController) Error401() {
	c.Data["content"] = "not permission"
	c.TplName = "401.html"
}

func (c *LErrorController) Error501() {
	c.Data["content"] = "server error"
	c.TplName = "501.html"
}

func (c *LErrorController) ErrorDb() {
	c.Data["content"] = "database is now down"
	c.TplName = "dberror.html"
}
func (c *LBaseController) parseRequest(txt string, obj *config.LJSON) *config.LJSON {
	s := txt
	for {
		start := strings.Index(s, "[")
		if start == -1 {
			if s != "" {
				obj = obj.Set(s)
			}
			return obj
		} else {
			end := strings.Index(s, "]")
			if end <= start {
				obj = obj.Set(s)
				return obj
			}
			main := s[:start]
			if main != "" {
				obj = obj.Set(main)
			}
			item := s[start+1 : end]
			i, err := strconv.Atoi(item)
			if err == nil {
				for {
					if obj.ItemCount() > i {
						break
					}
					obj.AddItem()
				}
				obj = obj.Item(i)
			} else {
				obj = obj.Set(item)
			}
			s = s[end+1:]
		}
	}
	return obj
}

//获取前端请求参数
func (t *LBaseController) GetRequestJ() (result config.LJSON) {
	if t.Ctx.Request.Form == nil {
		t.Ctx.Request.ParseForm()
	}
	for k, v := range t.Ctx.Request.Form {
		x := ""
		if len(v) > 0 {
			x = v[0]
		}
		t.parseRequest(k, &result).SetString(x)
	}
	result.ToString()
	//fmt.Println(" Parse Request: " + str)
	return result
}

//获取传送值
func (t *LBaseController) GetRequest() (result map[string]string) {
	result = make(map[string]string)
	if t.Ctx.Request.Form == nil {
		t.Ctx.Request.ParseForm()
	}
	for k, v := range t.Ctx.Request.Form {
		x := ""
		if len(v) > 0 {
			x = v[0]
		}
		result[k] = x
	}
	//fmt.Println(result)
	return result
}

func (t *LEagleBaseController) Prepare() {
	t.PrepareTime = time.Now()
	userinfo := t.GetSession("userinfo")
	if userinfo == nil {
		beegosessionID := t.Ctx.Input.Cookie(SvrSession.SessionName)
		url, _ := gredis.Get(beegosessionID) //获取请求页sessionID
		if url == "" {
			if strings.ToUpper(t.Ctx.Request.Method) == "POST" {
				t.ErrorJ("登录后超过时间未操作,请重新登录")
			} else {
				t.Redirect("/login", 302)
			}
		} else {
			t.Redirect(url, 302)
		}

	} else {
		tmp := strings.Split(userinfo.(string), "|")
		t.Email = tmp[0]
		t.UserName = tmp[1]
		t.HeadImg = tmp[2]
		t.UserID = tmp[3]
		t.UserNo = tmp[4]
		t.Mobile = tmp[5]
		t.ChainID, _ = t.GetSession("mchainid").(string)
		t.ChainName, _ = t.GetSession("mname").(string)

		t.ChainUserName, _ = t.GetSession("chainusername").(string)
		t.ChainWebRight, _ = t.GetSession("webright").(string)
		t.ChainSupper, _ = t.GetSession("chainsupper").(string)
		t.Mtype, _ = t.GetSession("mtype").(string)
		t.RemoteIP = t.GetClientIP()
		t.LastLoginTime, _ = t.GetSession("lastlogintime").(string)
		s, _ := t.GetSession("chainright").(string)
		t.RightJson.Load(s)
		t.ChainView, _ = t.GetSession("chainview").(string)
		t.ClinicIDList, _ = t.GetSession("cliniclist").(string)
		if t.RigthValue != "" {
			cid := t.GetRightClinic(t.RigthValue)
			if cid != "1" {
				t.ClinicIDList = cid
			}
		}
		t.Data["UserName"] = t.UserName           //昵称
		t.Data["ChainUserName"] = t.ChainUserName //诊所内名称
		t.Data["HeadImg"] = t.HeadImg             //头像
		t.Data["ChainName"] = t.ChainName         //诊所名称
		t.Data["Mtype"] = t.Mtype                 // 诊所类型 0 单店 1 连锁
		t.Data["LastLoginTime"] = t.LastLoginTime
		t.Data["RightList"], _ = t.GetSession("rightlist").(string)
		t.Data["PCLoad"], _ = t.GetSession("pcload").(string)
	}

	t.ProStdCheck()
}

//统计耗时 by dylan
func (t *LEagleBaseController) Finish() {
	si := time.Since(t.PrepareTime)
	tlen := si.Seconds() * 1000
	dateStr := time.Now().Format("2006-01-02")
	key := "func_time_" + dateStr + "_" + t.Ctx.Input.URL()
	val, err := gredis.Get(key)
	fcount := 1
	var ftime int
	ftime = int(tlen)
	if err == nil {
		list := strings.Split(val, "|")
		if len(list) == 2 {
			fcount += gutils.StrToInt(list[0], 0)
			ftime += gutils.StrToInt(list[1], 0)
		}
	}
	gredis.Set(key, fmt.Sprint(fcount)+"|"+fmt.Sprint(ftime))
}

func (t *LPCVIPBaseController) Prepare() {
	t.LEagleBaseController.Prepare()
	t.ChainID, _ = t.GetSession("mchainid").(string)
	t.ClinicName, _ = t.GetSession("clinicname").(string)
	t.SubClinicID, _ = t.GetSession("clinicid").(string)
}

//获取外网IP
func (t *LBaseController) GetClientIP() string {
	//ip := t.Ctx.Request.RemoteAddr
	ip := t.Ctx.Input.IP()
	//index := strings.Index(ip, ":")
	//ip = ip[:index]
	return ip
}

//获取传送值
func (t *LEagleBaseController) GetRequestJ() (result config.LJSON) {
	result = t.LBaseController.GetRequestJ()
	result.Set("chainid").SetString(t.ChainID)
	result.Set("cliniclist").SetString(t.ClinicIDList)
	result.Set("userid").SetString(t.UserID)
	result.Set("chainusername").SetString(t.ChainUserName)
	result.Set("remoteip").SetString(t.RemoteIP)
	nl, _ := t.GetSession("namelist").(string)
	result.Set("namelist").SetString(nl)
	return result
}

//获取平安传送值
func (t *LEagleBaseController) GetRequestPA() (result config.LJSON) {
	result = t.LBaseController.GetRequestJ()
	result.Set("userid").SetString(t.UserID)
	return result
}

//获取传送值
func (t *LPCVIPBaseController) GetRequestJ() (result config.LJSON) {
	result = t.LEagleBaseController.GetRequestJ()
	result.Set("ChainID").SetString(t.ChainID)
	result.Set("SubClinicID").SetString(t.SubClinicID)
	result.Set("ClinicName").SetString(t.ClinicName)
	result.Set("UserID").SetString(t.UserID)
	result.Set("ChainName").SetString(t.ChainName)
	return result
}

//校验权限 如果没有权限直接跑到错误页 如果传入多个权限,只要有其中一个就认为是有
func (t *LEagleBaseController) CheckRightA(RightValues ...string) (result bool) {
	if t.GetRightClinic(RightValues...) == "" {
		t.Abort("401")
		return false
	}
	return true
}

//校验权限
func (t *LEagleBaseController) CheckRight(RightValue string) (result bool) {
	if t.GetRightClinic(RightValue) == "" {
		return false
	}
	return true
}

//财务管理权限
func (t *LEagleBaseController) CheckFinanceRight() (result string) {

	for _, value := range gutils.FINANCE_RIGHT {
		if t.GetRightClinic(value) != "" {
			return value
		}
	}
	return ""
}

//校验诊所权限
func (t *LEagleBaseController) CheckClinicRight(ClinicID string, RightValue string) (result bool) {
	s := t.GetRightClinic(RightValue)
	//管理员
	if s == "1" {
		return true
	}
	return strings.Contains(s, "'"+ClinicID+"'")
}

//新的校验权限
func (t *LEagleBaseController) GetRightClinic(RightValues ...string) (result string) {
	if t.ChainSupper == "1" {
		return "1"
	}
	s := ""
	for _, v := range RightValues {

		if t.RightJson.Get(v).ItemCount() > 0 {
			if t.ChainView == "1" {
				return "1"
			}

			//fmt.Println(t.RightJson.Get(RightValue).ToString())
			for i := 0; i < t.RightJson.Get(v).ItemCount(); i++ {
				cid, _ := t.RightJson.Get(v).Item(i).ToString()
				cid = strings.Replace(cid, "\"", "", -1)
				if cid == "1" {
					return "1"
				}
				cid = "'" + cid + "'"
				if strings.Contains(s, cid) == false {
					if s != "" {
						s = s + ","
					}
					s = s + cid
				}
			}
		}
	}

	for i := 0; i < t.RightJson.Get(gutils.RT_WEB_ADMIN).ItemCount(); i++ {
		if t.ChainView == "1" {
			return "1"
		}
		cid, _ := t.RightJson.Get(gutils.RT_WEB_ADMIN).Item(i).ToString()
		cid = strings.Replace(cid, "\"", "", -1)
		cid = "'" + cid + "'"
		if strings.Contains(s, cid) == false {
			if s != "" {
				s = s + ","
			}
			s = s + cid
		}
	}
	return s
}

//校验权限
func (t *LEagleBaseController) CheckRightJ(RightValue string) (result bool) {
	if t.GetRightClinic(RightValue) == "" {
		var data gutils.LResultAjax
		data.Code = 2
		data.Info = "没有此操作权限"
		t.Data["json"] = data
		t.ServeJSON()
		t.StopRun()
		//panic("")
	}
	return true
}

func (t *LStoreBaseController) Prepare() {
	t.RigthValue = gutils.RT_WEB_STORE
	t.LEagleBaseController.Prepare()
	s, _ := t.GetSession("store").(string)
	if s == "" {
		return
	}
	tmp := strings.Split(s, "|")
	t.SubClinicID = tmp[0]
	t.Level, _ = strconv.Atoi(tmp[4])
	t.CuClinicName = tmp[5]
	if t.ChainID == t.SubClinicID {
		t.DisplyModel = 0
	} else {
		t.DisplyModel = 1
	}
	t.IsShared, _ = t.GetSession("isShared").(string)
}

//获取传送值
func (t *LStoreBaseController) GetRequestJ() (result config.LJSON) {
	result = t.LEagleBaseController.GetRequestJ()
	if t.IsShared == "1" {
		result.Set("ChainID").SetString(t.SubClinicID)
		result.Set("ids").SetString(t.SubClinicID)
	} else {
		result.Set("ChainID").SetString(t.ChainID)
		result.Set("ids").SetString(t.ChainID)
	}
	result.Set("NChainID").SetString(t.ChainID)
	result.Set("SubClinicID").SetString(t.SubClinicID)
	result.Set("isShared").SetString(t.IsShared)
	return result
}

//获取传送值
func (t *LStoreBaseController) GetRequest() (result map[string]string) {
	result = t.LBaseController.GetRequest()
	result["ChainID"] = t.ChainID
	result["SubClinicID"] = t.SubClinicID
	return result
}

// 处理字符串中特殊字符 ,将去除所有特殊字符
/* 	var param config.LJSON
obj = base.StrRePlaces(param)
fmt.Println(obj.ToString())
*/
// 字符串去特殊字符 temp 传空,将去除该字符串所有特索字符
func StrRePlace(str, temp string) string {
	if temp == "" {
		temp = "~!@#$%^&*()`{}[]|\\ ;:'<>?,./"
	}
	cli := strings.Split(temp, "")
	if len(cli) > 0 {
		for i := 0; i < len(cli); i++ {
			str = strings.Replace(str, cli[i], "", -1)
		}
	}
	return str
}

// func (t *LAntBaseController) Prepare() { //
// 	userinfo := t.GetSession("userinfo")
// 	if userinfo == nil {
// 		t.IsLogin = false
// 	} else {
// 		t.IsLogin = true
// 		tmp := strings.Split(userinfo.(string), "|")
// 		t.Email = tmp[0]
// 		t.UserName = tmp[1]
// 		t.HeadImg = tmp[2]
// 		t.UserID = tmp[3]
// 		t.UserNo = tmp[4]
// 		t.Mobile = tmp[5]
// 	}
// }

func (t *LAntmangeBaseController) Prepare() {
	admin := t.GetSession("admin")
	if admin == nil {
		t.Redirect("/member/AntAdminIndex", 302)
	} else {
		tmp := strings.Split(admin.(string), "|")
		t.UserID = tmp[0]
		t.UserName = tmp[1]
	}
}

//统计耗时 by dylan
func (t *LAntmangeBaseController) Finish() {
	si := time.Since(t.PrepareTime)
	tlen := si.Seconds() * 1000
	dateStr := time.Now().Format("2006-01-02")
	key := "func_time_" + dateStr + "_" + t.Ctx.Input.URL()
	val, err := gredis.Get(key)
	fcount := 1
	var ftime int
	ftime = int(tlen)
	if err == nil {
		list := strings.Split(val, "|")
		if len(list) == 2 {
			fcount += gutils.StrToInt(list[0], 0)
			ftime += gutils.StrToInt(list[1], 0)
		}
	}
	gredis.Set(key, fmt.Sprint(fcount)+"|"+fmt.Sprint(ftime))
}

//将传过来的json数组解析到struct
func (t *LBaseController) UnmarshalJson(v interface{}) (err error) {

	info := t.GetRequestJ()

	str, err := info.ToString()
	if err != nil {
		return err
	}

	err = json.Unmarshal([]byte(str), v)
	if err != nil {
		return err
	}
	return nil
}

//导出EXCEL
func (t *LBaseController) ConvertToExcelFile(list, totalrow config.LJSON) {
	param := t.GetRequestJ()
	fileTitle := param.Get("fileTitle").String()
	fieldName := strings.Split(param.Get("fieldName").String(), ",")
	titleName := strings.Split(param.Get("titleName").String(), ",")
	//配置EXCEL文件
	t.EnableRender = false
	var file *xlsx.File
	var sheet *xlsx.Sheet
	var row *xlsx.Row
	var cell *xlsx.Cell
	var err error
	file = xlsx.NewFile()
	sheet, err = file.AddSheet(fileTitle)
	if err != nil {
		log.Fatal(err)
	}

	row = sheet.AddRow()
	for _, v := range titleName {
		cell = row.AddCell()
		cell.Value = v
	}

	for i := 0; i < list.ItemCount(); i++ {
		row = sheet.AddRow()
		for _, v := range fieldName {
			cell = row.AddCell()
			if list.Item(i).Get(v).Interface() != nil {
				//cell.Value = list.Item(i).Get(v).String()
				cell.SetValue(list.Item(i).Get(v).Interface())
			} else {
				cell.Value = ""
			}
		}
	}

	if totalrow.Interface() != nil {
		row = sheet.AddRow()
		cell = row.AddCell()
		cell.Value = "合计"                     //第一列
		for i := 1; i < len(fieldName); i++ { //从第二列开始
			cell = row.AddCell()
			if totalrow.Item(0).Get(fieldName[i]).Interface() != nil {
				//cell.Value = totalrow.Item(0).Get(fieldName[i]).String()
				cell.SetValue(totalrow.Item(0).Get(fieldName[i]).Interface())
			} else {
				cell.Value = ""
			}
		}
	}

	w := t.Ctx.ResponseWriter
	w.Header().Set("Content-Type", "application/vnd.ms-excel;charset=UTF-8")
	w.Header().Set("Pragma", "public")
	w.Header().Set("Expires", "0")
	w.Header().Set("Cache-Control", "must-revalidate, post-check=0, pre-check=0")
	w.Header().Set("Content-Type", "application/force-download")
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Content-Type", "application/download")
	w.Header().Set("Content-Disposition", "attachment;filename="+sheet.Name+time.Now().Format("2006-01-02")+".xlsx")
	w.Header().Set("Content-Transfer-Encoding", "binary")
	err = file.Write(w)
	//err = file.Save("./aa.xlsx")
	if err != nil {
		fmt.Printf(err.Error())
		t.Abort("501")
	}
}

//模板页面导出EXCEL
func (t *LBaseController) ConvertToExcelFileMu(list, totalrow config.LJSON, fileTitle, fielName, titleTitle string) {

	fieldName := strings.Split(fielName, ",")
	titleName := strings.Split(titleTitle, ",")

	//配置EXCEL文件
	t.EnableRender = false
	var file *xlsx.File
	var sheet *xlsx.Sheet
	var row *xlsx.Row
	var cell *xlsx.Cell
	var err error
	file = xlsx.NewFile()
	sheet, err = file.AddSheet(fileTitle)
	if err != nil {
		log.Fatal(err)
	}
	row = sheet.AddRow()
	for _, v := range titleName {
		cell = row.AddCell()
		cell.Value = v
	}
	for i := 0; i < list.ItemCount(); i++ {
		row = sheet.AddRow()
		for _, v := range fieldName {
			cell = row.AddCell()
			if list.Item(i).Get(v).Interface() != nil {
				cell.SetValue(list.Item(i).Get(v).Interface())
			} else {
				cell.Value = ""
			}
		}
	}
	if totalrow.Interface() != nil {
		row = sheet.AddRow()
		cell = row.AddCell()
		cell.Value = "合计"                     //第一列
		for i := 1; i < len(fieldName); i++ { //从第二列开始
			cell = row.AddCell()
			if totalrow.Get(fieldName[i]).Interface() != nil {
				cell.SetValue(totalrow.Get(fieldName[i]).Interface())
			} else {
				cell.Value = ""
			}
		}
	}
	w := t.Ctx.ResponseWriter
	w.Header().Set("Content-Type", "application/vnd.ms-excel;charset=UTF-8")
	w.Header().Set("Pragma", "public")
	w.Header().Set("Expires", "0")
	w.Header().Set("Cache-Control", "must-revalidate, post-check=0, pre-check=0")
	w.Header().Set("Content-Type", "application/force-download")
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Content-Type", "application/download")
	w.Header().Set("Content-Disposition", "attachment;filename="+sheet.Name+time.Now().Format("2006-01-02")+".xlsx")
	w.Header().Set("Content-Transfer-Encoding", "binary")
	err = file.Write(w)
	//err = file.Save("./aa.xlsx")
	if err != nil {
		fmt.Printf(err.Error())
		t.Abort("501")
	}
}

//导出EXCEL
func (t *LBaseController) ConvertToExcelFileEX(list, totalrow config.LJSON, fileTitle, fielName, titleTitle, str, str0 string) {
	fieldName := strings.Split(fielName, ",")
	titleName := strings.Split(titleTitle, ",")
	//配置EXCEL文件
	t.EnableRender = false
	var file *xlsx.File
	var sheet *xlsx.Sheet
	var row *xlsx.Row
	var cell *xlsx.Cell
	var err error
	file = xlsx.NewFile()
	sheet, err = file.AddSheet(fileTitle)
	if err != nil {
		log.Fatal(err)
	}
	row = sheet.AddRow()
	for _, v := range titleName {
		cell = row.AddCell()
		cell.Value = v
	}
	for i := 0; i < list.ItemCount(); i++ {
		row = sheet.AddRow()
		for _, v := range fieldName {
			cell = row.AddCell()
			if list.Item(i).Get(v).Interface() != nil {
				val := list.Item(i).Get(v).String()
				//根据数字判断状态
				if strings.Contains(str0, v) && str0 != "" && str != "" {
					strAr := strings.Split(str, ",")
					for _, s := range strAr {
						if strings.Contains(s, v) {
							sar := strings.Split(s, "|")
							if sar[0] == v+val {
								val = sar[1]
							}
						}
					}
				}
				cell.Value = val
			} else {
				cell.Value = ""
			}
		}
	}
	if totalrow.Interface() != nil {
		row = sheet.AddRow()
		cell = row.AddCell()
		cell.Value = "合计"                     //第一列
		for i := 1; i < len(fieldName); i++ { //从第二列开始
			cell = row.AddCell()
			if totalrow.Get(fieldName[i]).Interface() != nil {
				cell.Value = totalrow.Get(fieldName[i]).String()
			} else {
				cell.Value = ""
			}
		}
	}
	w := t.Ctx.ResponseWriter
	w.Header().Set("Content-Type", "application/vnd.ms-excel;charset=UTF-8")
	w.Header().Set("Pragma", "public")
	w.Header().Set("Expires", "0")
	w.Header().Set("Cache-Control", "must-revalidate, post-check=0, pre-check=0")
	w.Header().Set("Content-Type", "application/force-download")
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Content-Type", "application/download")
	w.Header().Set("Content-Disposition", "attachment;filename="+sheet.Name+time.Now().Format("2006-01-02")+".xlsx")
	w.Header().Set("Content-Transfer-Encoding", "binary")
	err = file.Write(w)
	//err = file.Save("./aa.xlsx")
	if err != nil {
		fmt.Printf(err.Error())
		t.Abort("501")
	}
}

//返回错误信息
func (t *LBaseController) ReturnErrorMsg(errMsg string) {
	var data gutils.LResultAjax
	data.Code = 0
	data.Info = errMsg
	t.Data["json"] = data
	t.ServeJSON()
	t.StopRun()
	//panic("")
}

//判断营销权限
func (t *LMarketControllerMAuth) Prepare() {
	t.AuthorizeIndex()
}

//处理index权限
func (t *LMarketControllerMAuth) AuthorizeIndex() {
	t.RigthValue = gutils.RT_WEB_MARKET
	t.LEagleBaseController.Prepare()
	b := t.CheckRight(gutils.RT_WEB_MARKET)
	if b == false {
		t.Abort("401")
	}
}

//判断营销权限
func (t *LMarketControllerSmarMtAut) Prepare() {
	t.AuthorizeIndex()
}

//处理index权限
func (t *LMarketControllerSmarMtAut) AuthorizeIndex() {
	//t.RigthValue = gutils.RT_WEB_MARKET
	t.LEagleBaseController.Prepare()
	b := t.CheckRight(gutils.RT_WEB_MARKET) || t.CheckRight(gutils.RT_WEB_SENDWECHAT)
	t.AuthMsg = t.CheckRight(gutils.RT_WEB_MARKET)
	if b == false {
		t.Abort("401")
	}
}

//判断营销权限 短信模板  yzp
func (t *LMarketControllerMsgSendtAut) Prepare() {
	t.LEagleBaseController.Prepare()
	t.AuthorizeIndex()
}

//处理index权限 短信模板 yzp
func (t *LMarketControllerMsgSendtAut) AuthorizeIndex() {
	t.RigthValue = gutils.RT_WEB_MARKET
	b := t.CheckRight(gutils.RT_WEB_MARKET) || t.CheckRight(gutils.RT_WEB_SEND_SMS)
	t.AuthMsgSend = t.CheckRight(gutils.RT_WEB_MARKET)
	//	AuthSetSMStpl bool //市场营销--短信模板设置  权限  yzpAnthSendSMS

	t.AuthSetSMStpl = t.CheckRight(gutils.RT_WEB_SET_SMSTEMPLATE)
	t.AnthSendSMS = t.CheckRight(gutils.RT_WEB_SEND_SMS)

	clist := t.GetRightClinic(gutils.RT_WEB_MARKET, gutils.RT_WEB_SEND_SMS)
	if clist != "1" {
		t.ClinicIDList = clist
	} else {
		t.ClinicIDList, _ = t.GetSession("cliniclist").(string)
	}
	if b == false {
		t.Abort("401")
	}
}

//读取当前用户信息并保存到session  由于多个地方要用,所以这里写到basecontroller
func (t *LBaseController) SaveUserSession(param config.LJSON) {
	//	t.DelSession("scheduleclinicid")
	//	t.DelSession("isShared")
	//	gredis.Set(t.Ctx.Input.CruSession.SessionID()+"_chooseclinic", "")
	//	userid := param.Get("userid").String()
	//	userinfo := t.CheckJM(models.GetUserInfoByUserID(param))
	//	email := userinfo.List.Item(0).Get("email").String()
	//	name := userinfo.List.Item(0).Get("name").String()
	//	picture := userinfo.List.Item(0).Get("picture").String()
	//	bbsid := userinfo.List.Item(0).Get("userno").String()
	//	mobile := userinfo.List.Item(0).Get("mobile").String()

	//	t.SetSession("userinfo", email+"|"+name+"|"+picture+"|"+userid+"|"+bbsid+"|"+mobile)

	//	defaulchainid, _ := t.GetSession("defaulchainid").(string)     //PC调用或员工登录所在连锁
	//	defaultclinicid, _ := t.GetSession("defaultclinicid").(string) //PC调用所在诊所
	//	if defaulchainid != "" {
	//		param.Set("defaulchainid").SetString(defaulchainid)
	//	}
	//	chaininfo := t.CheckJM(models.GetUserChainInfo(param))
	//	if chaininfo.List.ItemCount() == 0 {
	//		beego.Info("GetUserChainInfo", "未找到用户信息", userid)
	//		return
	//	}
	//	mchainID := chaininfo.List.Item(0).Get("chainguid").String()
	//	mchainame := chaininfo.List.Item(0).Get("chainname").String()
	//	mtype := "1"
	//	if chaininfo.List.Item(0).Get("datastatus").String() == "2" {
	//		mtype = "0"
	//	}

	//	t.SetSession("mchainid", mchainID) //连锁id存session
	//	t.SetSession("mname", mchainame)   //连锁anme
	//	t.SetSession("mtype", mtype)       //连锁是否开通

	//	//取诊所列表
	//	level := "0"
	//	clinicname := ""
	//	clinicdentalid := ""
	//	cliniclist := ""
	//	cversion := ""
	//	clinicjs := t.CheckJM(models.LoadClinicList(mchainID))

	//	mainclinicid := ""                               //连锁主诊所ID
	//	for i := 0; i < clinicjs.List.ItemCount(); i++ { //这里取所有诊所ID
	//		if cliniclist != "" {
	//			cliniclist += ","
	//		}
	//		cliniclist += fmt.Sprintf("'%s'", clinicjs.List.Item(i).Get("clinicid").String())
	//		if defaultclinicid == clinicjs.List.Item(i).Get("clinicid").String() {
	//			level = clinicjs.List.Item(i).Get("level").String()
	//			clinicname = clinicjs.List.Item(i).Get("name").String()
	//			clinicdentalid = clinicjs.List.Item(i).Get("dentalid").String()
	//		}
	//		if clinicjs.List.Item(i).Get("level").String() == "1" {
	//			mainclinicid = clinicjs.List.Item(i).Get("clinicid").String()
	//		}
	//		//取诊所版本
	//		cv := clinicjs.List.Item(i).Get("version").String()
	//		if gutils.VersionCompare(cv, cversion) == 1 {
	//			cversion = cv
	//		}

	//	}

	//	if mtype == "0" && clinicjs.List.ItemCount() == 1 { //未开连锁的还要记住诊所ID
	//		t.SetSession("c_clinicid", clinicjs.List.Item(0).Get("clinicid").String())
	//	} else {
	//		t.SetSession("c_clinicid", "")
	//	}
	//	t.SetSession("cliniclist", cliniclist)

	//	pcload, _ := t.GetSession("pcload").(string)

	//	//取当前用户在此连锁店权限和名称
	//	param.Set("userid").SetString(userid)
	//	param.Set("chainid").SetString(mchainID)
	//	param.Set("defaultclinicid").SetString(defaultclinicid)
	//	userjs := t.CheckJM(models.LoadChainUserInfo(param))
	//	chainusername := ""
	//	chainsupper := "0"
	//	webright := ""
	//	forbidlogweb := 0 //是否禁止网页访问
	//	clinicuserid := ""
	//	clinicusername := ""
	//	clinicrttype := ""
	//	var rightjs config.LJSON //存所有权限
	//	var namejs config.LJSON  //存当前用户在各个诊所的名称和ID
	//	if userjs.List.ItemCount() > 0 {
	//		l := -1           //连锁诊所索引
	//		mainclinic := -1  //主诊所的索引
	//		loginclinic := -1 //登录依据的索引  这几个索引的目的是为了以页面右上角显示的名字 及权限
	//		for j := 0; j < userjs.List.ItemCount(); j++ {
	//			cid := userjs.List.Item(j).Get("clinicuniqueid").String()
	//			namejs.Set(cid).Set("docname").SetString(userjs.List.Item(j).Get("name").String())
	//			namejs.Set(cid).Set("docid").SetString(userjs.List.Item(j).Get("doctorid").String())
	//			if cid == "1" && mtype == "1" { //如果是连锁,WEB权限只能去clinicid是1的上面去取
	//				l = j
	//			}
	//			if cid == defaultclinicid {
	//				loginclinic = j
	//				clinicuserid = userjs.List.Item(j).Get("doctorid").String()
	//				clinicusername = userjs.List.Item(j).Get("name").String()
	//				clinicrttype = userjs.List.Item(j).Get("rttype").String()
	//				if clinicrttype == "" && userjs.List.Item(j).Get("UserGroupName").String() == gutils.UG_CLI_ADMIN {
	//					clinicrttype = "1"
	//				}
	//			}
	//			if cid == mainclinicid {
	//				mainclinic = j
	//			}

	//			//判断是不是只能通过PC端访问
	//			if pcload != "1" && userjs.List.Item(j).Get("forbidlogweb").String() == "1" { //不是PC调用,并且禁止WWW访问
	//				forbidlogweb = 1
	//				continue
	//			}
	//			pcversion, _ := t.GetSession("pcversion").(string)

	//			if userjs.List.Item(j).Get("UserGroupName").String() == gutils.UG_CLI_ADMIN { //管理员有所有权限
	//				rightjs.Set(gutils.RT_WEB_ADMIN).AddItem().SetString(cid)
	//			} else if userjs.List.Item(j).Get("UserGroupName").String() == gutils.UG_STD_ADMIN && pcversion == "std" { //标准版主任有所有权限
	//				rightjs.Set(gutils.RT_WEB_ADMIN).AddItem().SetString(cid)
	//			} else {
	//				userprivileges := userjs.List.Item(j).Get("userprivileges").String()
	//				//if cid == "1" && userprivileges == "" {
	//				webprivileges := userjs.List.Item(j).Get("webprivileges").String()
	//				//}
	//				if webprivileges != "" {
	//					if userprivileges != "" {
	//						userprivileges = userprivileges + ";"
	//					}
	//					userprivileges = userprivileges + webprivileges
	//				}
	//				val := strings.Split(userprivileges, ";")
	//				for k := 0; k < len(val); k++ {
	//					s := val[k]
	//					rightjs.Set(s).AddItem().SetString(cid)

	//				}
	//			}
	//		}
	//		fmt.Println(rightjs.ToString())
	//		fmt.Println(namejs.ToString())

	//		if l == -1 { //没有clinicid=1的诊所 ,那么取主诊所或登录的诊所
	//			if loginclinic > -1 { //员工登录或PC调用 ,取当前登录诊所
	//				l = loginclinic
	//			} else if mainclinic > -1 { //手机登录,取主诊所
	//				l = mainclinic
	//			} else {
	//				l = 0
	//			}
	//		}

	//		chainusername = userjs.List.Item(l).Get("name").String()
	//		webright = userjs.List.Item(l).Get("webprivileges").String()
	//		group := userjs.List.Item(l).Get("UserGroupName").String()
	//		t.SetSession("chainusername", chainusername)
	//		t.SetSession("webright", webright)
	//		s1, _ := rightjs.ToString()
	//		t.SetSession("chainright", s1)
	//		n1, _ := namejs.ToString()
	//		t.SetSession("namelist", n1)

	//		if (mtype == "1" && group == gutils.UG_WEB_ADMIN) || (mtype == "0" && group == gutils.UG_CLI_ADMIN) {
	//			t.SetSession("chainsupper", "1")
	//			chainsupper = "1"
	//		} else {
	//			t.SetSession("chainsupper", "0")
	//			chainsupper = "0"
	//		}
	//	} else {
	//		t.SetSession("chainusername", "")
	//		t.SetSession("webright", "")
	//		t.SetSession("chainsupper", "0")
	//		chainsupper = "0"
	//	}
	//	t.SetSession("chainview", "0")
	//	chainright := t.CheckJM(models.LoadChainRight(param))
	//	for i := 0; i < chainright.List.ItemCount(); i++ {
	//		if chainright.List.Item(i).Get("privileges").String() == "1" {
	//			t.SetSession("chainsupper", "1")
	//			chainsupper = "1"
	//		} else if chainright.List.Item(i).Get("privileges").String() == "2" {
	//			t.SetSession("chainview", "1")
	//		}
	//	}
	//	if forbidlogweb == 1 {
	//		t.SetSession("chainview", "0")
	//	}

	//	if defaultclinicid != "" { //PC调用 ,存PC所在诊所的一些信息
	//		t.SetSession("clinicid", defaultclinicid)
	//		t.SetSession("clinicname", clinicname) //分店诊所名字
	//		t.SetSession("clinicdocid", clinicuserid)
	//		t.SetSession("clinicdocname", clinicusername)
	//		t.SetSession("clinicrttype", clinicrttype)
	//		t.SetSession("subdentalid", clinicdentalid)
	//		t.SetSession("store", defaultclinicid+"|"+mchainID+"|"+userid+"|"+chainusername+"|"+level+"|"+clinicname)
	//	}
	//	t.SetSession("cversion", cversion)
	//	lastlogintime := ""
	//	logrc := t.CheckJM(models.GetUserLoginRecord(param))
	//	if logrc.List.ItemCount() > 0 {
	//		lastlogintime = logrc.List.Item(0).Get("logindatetime").String()
	//	}
	//	t.SetSession("lastlogintime", lastlogintime)

	//	rightlist := "" //按电网中心,市场营销,运营中心,财务管理,库房管理,系统管理 存0或1 ,传给前端
	//	if t.CheckRightJ(&rightjs, gutils.RT_WEB_CONSULT, chainsupper) == true {
	//		rightlist = rightlist + "1"
	//	} else {
	//		rightlist = rightlist + "0"
	//	}
	//	if t.CheckRightJ(&rightjs, gutils.RT_WEB_MARKET, chainsupper) == true || t.CheckRightJ(&rightjs, gutils.RT_WEB_SENDWECHAT, chainsupper) == true || t.CheckRightJ(&rightjs, gutils.RT_WEB_SEND_SMS, chainsupper) == true {
	//		rightlist = rightlist + ",1"
	//	} else {
	//		rightlist = rightlist + ",0"
	//	}
	//	if t.CheckRightJ(&rightjs, gutils.RT_WEB_REPORT, chainsupper) == true {
	//		rightlist = rightlist + ",1"
	//	} else {
	//		rightlist = rightlist + ",0"
	//	}
	//	if t.CheckFinanceRight(&rightjs, chainsupper) != "" {
	//		rightlist = rightlist + ",1"
	//	} else {
	//		rightlist = rightlist + ",0"
	//	}
	//	if t.CheckRightJ(&rightjs, gutils.RT_WEB_STORE, chainsupper) == true {
	//		rightlist = rightlist + ",1"
	//	} else {
	//		rightlist = rightlist + ",0"
	//	}
	//	if t.CheckRightJ(&rightjs, gutils.RT_WEB_MANAGE, chainsupper) == true {
	//		rightlist = rightlist + ",1"
	//	} else {
	//		rightlist = rightlist + ",0"
	//	}

	//	t.SetSession("rightlist", rightlist)

	//	gredis.Set(t.Ctx.Input.CruSession.SessionID()+"_login", "/login") //记录session和用户登录页

}

//校验权限
func (t *LBaseController) CheckRightJ(RightJson *config.LJSON, RightValue string, ChainSupper string) (result bool) {
	if ChainSupper == "1" {
		return true
	}
	if RightJson.Get(RightValue).ItemCount() > 0 || RightJson.Get(gutils.RT_WEB_ADMIN).ItemCount() > 0 {
		return true
	}
	return false
}

//校验财务权限
func (t *LBaseController) CheckFinanceRight(RightJson *config.LJSON, ChainSupper string) (result string) {
	if ChainSupper == "1" {
		return "1"
	}

	for _, value := range gutils.FINANCE_RIGHT {
		if RightJson.Get(value).ItemCount() > 0 || RightJson.Get(gutils.RT_WEB_ADMIN).ItemCount() > 0 {
			return value
		}

	}
	return ""
}

//判断是否是专业版
func (t *LBaseController) ProStdCheck() {
	//t.SetSession("pcversion", "std")
	//	if t.GetSession("pcversion") != nil {
	//		if t.GetSession("pcversion").(string) == "std" {
	//			t.Data["pcversion"] = "std" //标准版
	//		} else {
	//			t.Data["pcversion"] = "pro" //专业版
	//		}
	//	} else {
	//		t.Data["pcversion"] = "pro" //专业版
	//	}
	//t.SetSession("pcversion", "std")
	if t.ProCheck() {
		t.Data["pcversion"] = "pro" //专业版
	} else {
		t.Data["pcversion"] = "std" //标准版
	}
}

//判断是否是专业版 返回bool
func (t *LBaseController) ProCheck() bool {
	if t.GetSession("pcversion") != nil {
		if t.GetSession("pcversion").(string) == "std" {
			return false
		} else {
			return true
		}
	} else {
		return true
	}

}
