package colleges

import (
	"doggy/gutils"
	"fmt"
	"regexp"
	"strings"
	"time"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

//根据openid获取账单体系中的unionID
func OpenID2UnionID(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "OpenID2UnionID"

	openid := param.Get("openid").String()
	pic := param.Get("headimgurl").String()
	nickname := param.Get("nickname").String()
	userid := ""
	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select uo.userid,d.name,d.picture from t_user_open uo left join t_doctor d on 
			uo.userid=d.doctorid
			where uo.openid=? and uo.datastatus=1 and uo.roleid=3 `
	_, err.Msg = o.Raw(sql, openid).ValuesJSON(&obj)
	if obj.ItemCount() != 0 {
		userid = obj.Item(0).Get("userid").String()
		name := obj.Item(0).Get("name").String()
		picture := obj.Item(0).Get("picture").String()

		if name == "" {
			name = nickname
		} else {
			nickname = name
		}

		if picture == "" {
			picture = pic
		} else {
			pic = picture
		}

		sql = ` update t_doctor set name=?,picture=?,updatetime=? where doctorid=? `
		_, err.Msg = o.Raw(sql, name, picture, time.Now().Format("2006-01-02 15:04:05"), userid).Exec()
	}

	result.List.Set("headimgurl").SetString(pic)
	result.List.Set("nickname").SetString(nickname)
	result.List.Set("userid").SetString(userid)
	return result, err
}

func AppLogin(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "AppLogin"
	userid := param.Get("userid").String()
	if userid == "" {
		err.Errorf(gutils.ParamError, "用户ID不能为空")
		return
	}

	o := orm.NewOrm()
	sql := ` select picture,name from t_doctor where doctorid=? `
	_, err.Msg = o.Raw(sql, userid).ValuesJSON(&result.List)
	return result, err
}
func SendCode(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SendCode"

	mobile := param.Get("mobile").String() //手机号
	res := false
	res, err.Msg = regexp.Match("^((1[3|4|5|6|7|8|9][0-9]{9})|(15[89][0-9]{8}))$", []byte(mobile))
	if err.Msg != nil {
		return
	}

	if res == false {
		err.Errorf(gutils.ParamError, "手机号无效")
		return
	}

	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select userid from t_user where mobile=? and roleid=3 `
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&obj)
	if obj.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "账号不存在")
		return
	}
	//发送验证码
	var data config.LJSON
	data.Set("funcid").SetInt(20100)
	data.Set("mobile").SetString(mobile)
	funcidverify := param.Get("funcidverify").Int()
	if funcidverify == 0 {
		funcidverify = 20113
	}
	data.Set("funcidverify").SetInt(funcidverify) //随便用个
	api := gutils.FlybearCPlus(data)
	code := api.Get("code").Int()
	if code == 0 {
		err.Errorf(gutils.ParamError, "验证码发送失败")
		return
	}

	return result, err
}

func BindApp(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "BindApp"
	mobile := param.Get("mobile").String()
	code := param.Get("code").String()
	if mobile == "" || code == "" {
		err.Errorf(gutils.ParamError, "手机号或验证码不能为空")
		return
	}

	openid := param.Get("openid").String()
	if openid == "" {
		err.Errorf(gutils.ParamError, "openid不能为空")
		return
	}

	o := orm.NewOrm()
	sql := "SELECT Code,Updatetime,mobile FROM t_sys_code WHERE UserID=? AND FuncID=? AND Code=?"
	var obj config.LJSON
	num, _ := o.Raw(sql, mobile, 20113, code).ValuesJSON(&obj)
	if num <= 0 {
		err.Errorf(gutils.ParamError, "验证码错误")
		return
	}
	sendtime := obj.Item(0).Get("Updatetime").Time().Unix()
	now := time.Now().Unix() - 3600
	if now > sendtime {
		err.Errorf(gutils.ParamError, "验证码过期")
		return
	}
	sql = ` select d.isanchor,d.doctorid
		from t_user u inner join t_doctor d on u.userid=d.doctorid where u.mobile=? and u.roleid=3 `
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "APP账号不存在")
		return
	}
	isanchor := result.List.Item(0).Get("isanchor").Int()
	if isanchor == 0 {
		err.Errorf(gutils.ParamError, "非主播账户,无法绑定")
		return
	}
	doctorid := result.List.Item(0).Get("doctorid").String()
	updatetime := time.Now().Format("2006-01-02")
	sql = ` update t_doctor set openid=?,wxnickname=?,wximgurl=?,updatetime=? where doctorid=? `
	_, err.Msg = o.Raw(sql, openid, param.Get("nickname").String(), param.Get("headimgurl").String(), updatetime, doctorid).Exec()
	return result, err
}

func Login(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "Login"
	mobile := param.Get("mobile").String()
	code := param.Get("code").String()
	if mobile == "" || code == "" {
		err.Errorf(gutils.ParamError, "手机号或验证码不能为空")
		return
	}

	openid := param.Get("openid").String()
	if openid == "" {
		err.Errorf(gutils.ParamError, "openid不能为空")
		return
	}

	o := orm.NewOrm()
	sql := "SELECT Code,Updatetime,mobile FROM t_sys_code WHERE UserID=? AND FuncID=? AND Code=?"
	var obj config.LJSON
	num, _ := o.Raw(sql, mobile, 20113, code).ValuesJSON(&obj)
	if num <= 0 {
		err.Errorf(gutils.ParamError, "验证码错误")
		return
	}
	sendtime := obj.Item(0).Get("Updatetime").Time().Unix()
	now := time.Now().Unix() - 3600
	if now > sendtime {
		err.Errorf(gutils.ParamError, "验证码过期")
		return
	}

	sql = ` select u.userid,u.openid,d.name,d.picture
		from t_user u inner join t_doctor d on u.userid=d.doctorid where u.mobile=? and u.roleid=3 `
	_, err.Msg = o.Raw(sql, mobile).ValuesJSON(&result.List)

	userid := result.List.Item(0).Get("userid").String()
	updatetime := time.Now().Format("2006-01-02")
	if result.List.Item(0).Get("openid").String() != openid {
		sql = ` update t_user set openid=?,updatetime=? where userid=? `
		_, err.Msg = o.Raw(sql, openid, updatetime, userid).Exec()
	}

	name := result.List.Item(0).Get("name").String()
	if name == "" {
		name = param.Get("name").String()
	}

	picture := result.List.Item(0).Get("picture").String()

	if picture == "" {
		picture = param.Get("picture").String()
	}

	sql = ` update t_doctor set name=?,picture=?,updatetime=? where doctorid=? `
	_, err.Msg = o.Raw(sql, name, picture, updatetime, userid).Exec()

	return result, err
}

func PersonInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "PersonInfo"

	userid := param.Get("userid").String()
	if userid == "" {
		err.Errorf(gutils.ParamError, "UserID不能为空")
		return
	}

	o := orm.NewOrm()
	sql := ` select d.picture,d.name,u.mobile,ifnull(d.integral,0) as integral
			from t_user u inner join t_doctor d on u.userid=d.doctorid where u.userid=:userid `

	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	return result, err
}

func IntegralData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "IntegralData"
	page := param.Get("page").Int64()        //页码
	perpage := param.Get("per_page").Int64() //每页数量

	if page == 0 {
		page = 1
	}
	if perpage == 0 {
		perpage = 10
	}

	o := orm.NewOrm()
	sql := ` select * from t_user_integral where userid=:userid `
	//目的是避免每次翻页重复读取总数量
	var totalcount int64
	totalcount = -1
	if param.Get("totalcount").IsNULL() == false {
		totalcount = param.Get("totalcount").Int64()
	}
	if totalcount <= 0 {
		_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
		totalcount = int64(result.List.ItemCount())
	}

	sql = fmt.Sprintf("%s order by  ConsumeDate desc LIMIT %d,%d", sql, perpage*(page-1), perpage)
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	result.TotalCount = int64(totalcount) //总条数
	result.PageNo = int64(page)           //页码
	result.PageSize = int64(perpage)      //每页条数
	return result, err
}

func IntegralDetailData(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "IntegralData"
	o := orm.NewOrm()
	sql := ` select * from t_user_integral where integralid=:integralid `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	return result, err
}

//登出
func Logout(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "Logout"

	userid := param.Get("userid").String()
	if userid == "" {
		err.Errorf(gutils.ParamError, "用户ID不能为空")
		return
	}
	o := orm.NewOrm()
	sql := ` update t_user set openid='',updatetime=? where userid=? `
	_, err.Msg = o.Raw(sql, time.Now().Format("2006-01-02"), userid).Exec()
	return result, err
}

//根据token获取域名
func Token2Domain(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	o := orm.NewOrm()
	//根据token获取域名和密钥
	sql := ` select secret,domain from t_weixin_token where token=:token `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	if result.List.ItemCount() == 0 {
		err.Errorf(gutils.ParamError, "token网页授权回调域名未配置")
		return
	}
	secret := result.List.Item(0).Get("secret").String()
	if secret == "" {
		result.List.Item(0).Set("secret").SetString(param.Get("secret").String())
		return result, err
	}

	var obj config.LJSON
	obj.Set("secret").SetString(secret)
	obj.Set("appid").SetString(param.Get("appid").String())
	obj.Set("funcid").SetInt(gutils.FUNC_ID_DECODE_SECRET)
	res := gutils.FlybearCPlus(obj)
	result.List.Item(0).Set("secret").SetString(res.Get("secret").String())
	return result, err
}

//根据openid获取koalaid
func OpenID2KoalaID(param *config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "Open2KoalaID"
	o := orm.NewOrm()

	sql := ` select kuserid from t_weixin_relation where openid=:openid and clinicid=:clinicid and token=:token and datastatus=1 `
	_, err.Msg = o.RawJSON(sql, *param).ValuesJSON(&result.List)
	return result, err
}

//根据openid获取userid
func OpenID2UserID(param *config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	openid := param.Get("openid").String()
	if openid == "" {
		err.Errorf(gutils.ParamError, "openid不能为空")
		return result, err
	}
	o := orm.NewOrm()
	sql := ` select u.userid,d.name,d.picture 
			from t_user u inner join t_doctor d on u.userid=d.doctorid where u.openid=? and u.roleid=3 `
	_, err.Msg = o.Raw(sql, openid).ValuesJSON(&result.List)
	userid := result.List.Item(0).Get("userid").String()
	if userid != "" {
		name := result.List.Item(0).Get("name").String()
		if name == "" {
			name = param.Get("nickname").String()
		}

		picture := result.List.Item(0).Get("picture").String()
		if picture == "" {
			picture = param.Get("headimgurl").String()
		}

		sql = ` update t_doctor set name=?,picture=?,updatetime=? where doctorid=? `
		_, err.Msg = o.Raw(sql, name, picture, time.Now().Format("2006-01-02 15:04:05"), userid).Exec()
	}
	return result, err
}

//根据openid获取微信信息
func OpenID2BaseInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {

	o := orm.NewOrm()
	sql := ` select nickname,headimgurl from t_weixin_user where openid=:openid and token=:token `
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&result.List)
	return
}

//插入sql 根据val生成插入sql
func InsertSql(param *config.LJSON, val string) (keys string) {
	x, y := param.Interface().(map[string]interface{})
	if y == false {
		panic("insert param parse failed")
	}
	val = strings.ToLower(val)
	if val == "" {
		return keys
	}
	res := strings.Split(val, ",")
	var keystr, valuestr string
	//遍历字符串
	for _, v := range res {
		if _, ok := x[v]; ok {
			if keystr == "" {
				keystr = v
				valuestr = ":" + v
			} else {
				keystr += "," + v
				valuestr += ",:" + v
			}
		}
	}
	if keystr == "" {
		return keys
	}
	keys = " (" + keystr + ") values (" + valuestr + ") "
	return keys
}

//保存基本信息
func SaveBaseInfo(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {

	keys := "token,openid,nickname,sex,city,useridentity,country,province,language,headimgurl,unionid,remark,groupid,datastatus,updatetime,clinicid,pinyin"
	res := InsertSql(&param, keys)
	if res != "" {
		param.Set("useridentity").SetString(param.Get("token").String() + "_" + param.Get("openid").String())
		param.Set("datastatus").SetInt(1)
		param.Set("updatetime").SetString(time.Now().Format("2006-01-02 15:04:05"))
		var parampy config.LJSON
		parampy.Set("funcid").SetInt(gutils.FUNC_ID_GET_NAME_PINYIN)
		parampy.Set("name").SetString(param.Get("nickname").String())
		rpy := gutils.FlybearCPlus(parampy)
		param.Set("pinyin").SetString(rpy.Get("pinyin").String())
		o := orm.NewOrm()

		sql := " insert into t_weixin_user " + res
		_, err.Msg = o.RawJSON(sql, param).Exec()
	}
	return
}
