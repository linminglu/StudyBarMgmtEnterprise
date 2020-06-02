//author:  罗云鹏 17-03-15
//purpose： 运营后台－消息推送
package models

import (
	"github.com/astaxie/beego/logs"
	"doggy/gutils"
	"doggy/gutils/gredis"
	"errors"
	"time"

	"fmt"

	"strconv"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

// ChannelID 是渠道的ID
type ChannelID int

func channelID2Name(i int) string {
	switch i {
	case 1:
		return "PC登陆海报"
	case 2:
		return "PC消息中心"
	case 3:
		return "PC弹窗"
	case 7:
		return "手机APP消息中心"
	case 8:
		return "Web系统消息"
	case 9:
		return "Web个人消息中心"
	case 10:
		return "手机APP启动广告"
	case 11:
		return "Web活动中心"
	case 12:
		return "手机诊所内广告"
	case 13:
		return "PC服务器弹窗"
	case 14:
		return "官网首页海报"
	case 15:
		return "官网登录页海报"
	}

	return "未知渠道"
}

// GetMessagesList 是获取信息列表的函数
func GetMessagesList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetMessagesList"
	starttime := param.Get("start_time").String() //起始时间
	endtime := param.Get("end_time").String()     //结束时间
	perpage := param.Get("per_page").Int()        //每页数量
	page := param.Get("page").Int()               //页数
	status := param.Get("status").String()        //状态
	msgtype := param.Get("type").String()         //消息类型
	channel := param.Get("channel").String()      //发送平台
	conditon := param.Get("condition").String()   //输入框收索条件
	if perpage == 0 {
		perpage = 10
	}
	if page == 0 {
		page = 1
	}
	var val []interface{}
	o := orm.NewOrm()

	var count config.LJSON
	sqlc := `SELECT COUNT(*) AS count
	FROM t_system_notify AS n
	LEFT JOIN t_system_notify_to_channel as c ON c.NotifyID=n.NotifyID
	WHERE 1`
	sql := `select n.NotifyID as notify_id, n.MsgType as msg_type, n.Title as title, n.Content as content, n.PushDate as push_date,
	(SELECT GROUP_CONCAT(D_Channel_Name) FROM t_system_notify_to_channel WHERE NotifyID=n.NotifyID) AS channels,
	n.PushedDentalNum as dental_num, n.PushedDeviceNum as device_num, n.ReadNum as read_num, n.ClickedNum as click_num,SendState
	FROM t_system_notify AS n
	LEFT JOIN t_system_notify_to_channel as c ON c.NotifyID=n.NotifyID
	WHERE 1`
	// if status == "1" { //只有查询已发送状态才计算发送时间
	// 	sqlc += " and n.PushDate is not null"
	// 	sql += " and n.PushDate is not null"
	// 	if starttime != "" {
	// 		starttime += " 00:00:00"
	// 		sqlc += " and n.PushDate>=? "
	// 		sql += " and n.PushDate>=? "
	// 		val = append(val, starttime)
	// 	}
	// 	if endtime != "" {
	// 		endtime += " 23:59:59"
	// 		sqlc += " and n.PushDate<=? "
	// 		sql += " and n.PushDate<=? "
	// 		val = append(val, endtime)
	// 	}
	// } else { //全部以及未发送
	// 	if status == "0" {
	// 		sqlc += " and n.PushDate is null"
	// 		sql += " and n.PushDate is null"
	// 	}
	// }
	sqlc += " and n.PushDate is not null"
	sql += " and n.PushDate is not null"
	if starttime != "" {
		starttime += " 00:00:00"
		sqlc += " and n.PushDate>=? "
		sql += " and n.PushDate>=? "
		val = append(val, starttime)
	}
	if endtime != "" {
		endtime += " 23:59:59"
		sqlc += " and n.PushDate<=? "
		sql += " and n.PushDate<=? "
		val = append(val, endtime)
	}
	if status != "" { //只有查询已发送状态 时间段内的已发送 status = 1 已发送， status = 2 未发送
		sqlc += " and n.SendState=? "
		sql += " and n.SendState=? "
		val = append(val, status)
	}
	if msgtype != "" {
		sqlc += " and n.MsgType=? "
		sql += " and n.MsgType=? "
		val = append(val, msgtype)
	}
	if channel != "" {
		sqlc += " and c.ChannelID=? "
		sql += " and c.ChannelID=? "
		val = append(val, channel)
	}
	if conditon != "" {
		conditon = fmt.Sprintf("%%%s%%", conditon)
		sqlc += " and (n.NotifyID like ? or n.Title like ?)"
		sql += " and (n.NotifyID like ? or n.Title like ?)"
		val = append(val, conditon, conditon)
	}
	sql += " group by n.NotifyID"
	sqlc += " group by n.NotifyID"

	_, err.Msg = o.Raw(sqlc, val...).ValuesJSON(&count)
	if err.Msg != nil {
		return
	}

	offset := (page - 1) * perpage
	limit := perpage
	sql += " order by n.UpdateDateTime desc limit ?,?"
	val = append(val, offset, limit)
	_, err.Msg = o.Raw(sql, val...).ValuesJSON(&result.List)
	if err.Msg != nil {
		return
	}
	result.TotalCount = int64(count.ItemCount()) //总条数
	result.PageNo = int64(page)                  //页码
	result.PageSize = int64(perpage)             //每页条数
	return
}

// SaveMessage 会根据增加和编辑不同采用不同的流程
func SaveMessage(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SaveMessage"
	var sql string

	messageID := param.Get("MessageID").String()

	fmt.Println(param.ToString())

	o := orm.NewOrm()

	o.Using("db_flybear")
	o.Begin()

	defer func() {
		if err.Msg != nil {
			o.Rollback()
		} else {
			o.Commit()
		}
	}()

	if messageID != "" {
		messageIDInt, merr := strconv.ParseInt(messageID, 10, 64)
		if merr != nil {
			err.Errorf(gutils.ParamError, merr.Error())
			return
		}
		param.Set("NotifyID").SetInt64(messageIDInt)

		var currentMessage config.LJSON
		sql = `select * from t_system_notify where NotifyID = :NotifyID`
		_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&currentMessage)

		if currentMessage.ItemCount() < 1 {
			err.Errorf(gutils.ParamError, "根本没有这个ID的记录可以更新")
			return
		}

		param.Set("UpdateDateTime").SetString(time.Now().Format("2006-01-02 15:04:05"))
		sql = ` update t_system_notify set Title =:Title , Content =:Content,
				DetailUrl = :DetailUrl, PushType = :PushType,
				PushTiming = :PushTiming, MsgType =:MsgType, UpdateDateTime =:UpdateDateTime,RecieveUser=:RecieveUser
				where NotifyID = :NotifyID `
		_, err.Msg = o.RawJSON(sql, param).Exec()

		sql = ` update t_system_notify_rule set PCVersion =:PCVersion , PCMerchantID =:PCMerchantID,
				PCCreatedDateBegin = :PCCreatedDateBegin, PCCreatedDateEnd = :PCCreatedDateEnd,
				PCProvinces = :PCProvinces, PCCities =:PCCities, PCRoles =:PCRoles ,
				ExceptAlreadyDay = :ExceptAlreadyDay, ExceptAlreadySent =:ExceptAlreadySent 
				where NotifyID = :NotifyID `
		_, err.Msg = o.RawJSON(sql, param).Exec()

	} else {
		param.Set("NotifyID").SetInt64(gutils.CreateGUID())
		param.Set("UpdateDateTime").SetString(time.Now().Format("2006-01-02 15:04:05"))
		sql = ` insert into t_system_notify 
			(NotifyID, Title, Content, DetailUrl, PushType, PushTiming, MsgType, UpdateDateTime ,SendState,pushdate,RecieveUser) values
			(:NotifyID, :Title, :Content, :DetailUrl, :PushType, :PushTiming, :MsgType, :UpdateDateTime, 0,now(),:RecieveUser)`

		_, err.Msg = o.RawJSON(sql, param).Exec()

		fmt.Println(param.ToString())

		sql = `insert into t_system_notify_rule 
			(NotifyID, PCVersion, PCMerchantID, PCCreatedDateBegin, PCCreatedDateEnd, PCProvinces, PCCities, PCRoles, ExceptAlreadyDay, ExceptAlreadySent) 
			values (:NotifyID, :PCVersion, :PCMerchantID, :PCCreatedDateBegin, :PCCreatedDateEnd, :PCProvinces, :PCCities, :PCRoles, :ExceptAlreadyDay, :ExceptAlreadySent)`

		_, err.Msg = o.RawJSON(sql, param).Exec()

		if err.Msg != nil {
			fmt.Println(err.Msg)
			return
		}
	}

	notifyID := param.Get("NotifyID").Int64()

	var channels config.LJSON
	channels.Load(param.Get("Channels").String())

	// 删除所有相关的渠道
	sql = `delete from t_system_notify_to_channel where NotifyID = :NotifyID`
	var deleteParams config.LJSON
	deleteParams.Set("NotifyID").SetInt64(notifyID)
	_, err.Msg = o.RawJSON(sql, deleteParams).Exec()

	// 再把渠道信息加进来
	for k := range channels.Map() {
		channel := channels.Get(k)
		fmt.Println(channel.ToString())
		channel.Set("NotifyID").SetInt64(notifyID)
		channel.Set("ChannelID").SetString(k)
		channelInt, _ := strconv.Atoi(k)
		channel.Set("D_Channel_Name").SetString(channelID2Name(channelInt))
		fmt.Println(channel.ToCaseString())

		sql = `insert into t_system_notify_to_channel (NotifyID, ChannelID, D_Channel_Name, MainImage, ExtraText, DateBegin, DateEnd)
			values (:NotifyID, :ChannelID, :D_Channel_Name, :mainimage, :extratext, :datebegin, :dateend)`

		_, err.Msg = o.RawJSON(sql, *channel).Exec()
	}

	var dentals config.LJSON
	dentals.Load(param.Get("Dentals").String())

	// 删除所有的关联用户
	sql = `delete from t_system_notify_userbase where NotifyID = :NotifyID`
	_, err.Msg = o.RawJSON(sql, deleteParams).Exec()

	// 添加用户列表
	var userParam config.LJSON
	userParam.Set("NotifyID").SetInt64(notifyID)
	sql = "insert into t_system_notify_userbase (NotifyID, DentalID) values (:NotifyID, :DentalID)"
	for i := 0; i < dentals.ItemCount(); i++ {
		dentalID, _ := dentals.Item(i).ToString()
		dentalIDInt, atoierr := strconv.Atoi(dentalID)
		if atoierr != nil {
			err.Errorf(gutils.ParamError, atoierr.Error())
			return
		}
		userParam.Set("DentalID").SetInt(dentalIDInt)
		_, err.Msg = o.RawJSON(sql, userParam).Exec()
	}

	if err.Msg != nil {
		return result, err
	}

	return result, err
}

// ImportDentals 将从Excel表格中提取的数据插入数据库中，并返回TempID
func ImportDentals(data config.LJSON, notifyid string) (result config.LJSON, err gutils.LError) {
	err.Caption = "SaveMessage"

	var param config.LJSON
	param.Set("NotifyID").SetString(notifyid)

	//o := orm.NewOrm()
	//o.Using("db_flybear")
	//sql := "insert into t_system_notify_userbase (NotifyID, DentalID) values (:NotifyID, :DentalID)"

	for i := 0; i < data.ItemCount(); i++ {
		row := data.Item(i)
		fmt.Println(row.ToString())
		param.Set("DentalID").SetString(row.Get("cells0").String())

		//_, err.Msg = o.RawJSON(sql, param).Exec()

		if err.Msg != nil {
			return
		}

		var dentalInfo config.LJSON
		dentalInfo.Set("name").SetString(row.Get("cells1").String())
		dentalInfo.Set("id").SetString(row.Get("cells0").String())

		result.AddItem().SetObject(dentalInfo)
	}

	return
}

// GetMerchantList 获取经销商列表信息
func GetMerchantList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetMerchantList"

	sql := `select * from t_channel_merchant`

	o := orm.NewOrm()
	o.Using("db_flybear")
	var merchantList config.LJSON
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&merchantList)

	for j := 0; j < merchantList.ItemCount(); j++ {
		merchantObj := merchantList.Item(j)
		result.List.AddItem().SetObject(*merchantObj)
		fmt.Println(result.List.ToString())
	}

	return result, err
}

// SendMessage 发送消息
func SendMessage(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "SendMessage"

	notifyID := param.Get("MessageID").Int64()

	sql := `select * from t_system_notify where NotifyID = :MessageID`

	o := orm.NewOrm()
	o.Using("db_flybear")
	var res config.LJSON
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&res)
	if err.Msg != nil {
		return
	}

	if res.Item(0).Get("SendState").String() != "0" { //发送过
		err.Msg = errors.New("已经发送过,请刷新页面")
		return
	}
	o.Begin()
	sql = `UPDATE t_system_notify SET SendState=1 WHERE NotifyID=:MessageID`
	_, err.Msg = o.RawJSON(sql, param).Exec()
	if err.Msg != nil {
		o.Rollback()
		logs.Error(err.Msg.Error())
		return
	}
	

	redisR, redisE := gredis.Do("RPUSH", "notify_queue", notifyID)
	if redisE != nil {
		o.Rollback()
		err.Errorf(gutils.ParamError, redisE.Error())
		logs.Error(redisE.Error())
		return
	}
	o.Commit()

	fmt.Println(redisR)

	if err.Msg != nil {
		return
	}

	return result, err
}

// DentalName 通过管家号获取诊所名称
func DentalName(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "DentalName"

	sql := `select c.Name from t_clinic c, t_user u where c.ClinicID = u.UserID and u.DentalID = :DentalID`

	o := orm.NewOrm()
	o.Using("db_flybear")
	var dentalList config.LJSON
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&dentalList)

	result.List.AddItem().Set("name").SetString(dentalList.Item(0).Get("name").String())

	return result, err
}

// GetMessageDetail 查看
func GetMessageDetail(id string) (result config.LJSON, err gutils.LError) {
	err.Caption = "ErpGetMessageDetail"
	o := orm.NewOrm()

	var info config.LJSON
	sql := `select n.RecieveUser, n.NotifyID as notify_id, n.MsgType as msg_type, n.Title as title, n.Content as content, n.DetailUrl as detail_url,
	r.PCMerchantID as merchant_id, m.MerchantName as merchant_name, n.PushDate as push_date,
	r.PCCreatedDateBegin as c_created_begin, r.PCCreatedDateEnd as c_created_end, r.PCProvinces as c_provinces, r.PCCities as c_cities,r.PCRoles as c_roles,
	r.ExceptAlreadyDay as except_already_day, r.ExceptAlreadySent as except_already_sent
	from t_system_notify as n
	left join t_system_notify_rule as r on r.NotifyID=n.NotifyID
	left join t_channel_merchant as m on m.PromoteCode=r.PCMerchantID
	where n.NotifyID=? limit 1`
	_, err.Msg = o.Raw(sql, id).ValuesJSON(&info)
	if err.Msg != nil {
		return result, err
	}
	result.Set("info").SetObject(info)

	var channels config.LJSON
	imagePrefix := beego.AppConfig.String("imageprefix")
	sql = `select ChannelID, D_Channel_Name, concat(?, MainImage) as mainImage, MainImage as nameImage, DateBegin, DateEnd 
	from t_system_notify_to_channel
	where NotifyID=?`
	_, err.Msg = o.Raw(sql, imagePrefix, id).ValuesJSON(&channels)
	if err.Msg != nil {
		return result, err
	}
	result.Set("channels").SetObject(channels)

	var dentals config.LJSON
	sql = `select nu.DentalID as dental_id, c.Name as dental_name
	from t_system_notify_userbase as nu
	left join t_user as u on u.DentalID =nu.DentalID
	left join t_clinic as c on c.ClinicID=u.UserID
	where nu.NotifyID=?`
	_, err.Msg = o.Raw(sql, id).ValuesJSON(&dentals)
	if err.Msg != nil {
		return result, err
	}
	result.Set("dentals").SetObject(dentals)
	return
}

//对应推送渠道banner列表
func ChannelBannerList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ChannelBannerList"
	starttimes := param.Get("start_time").String() //起始时间
	endtime := param.Get("end_time").String()      //结束时间
	perpage := param.Get("per_page").Int()         //每页数量
	page := param.Get("page").Int()                //页数
	status := param.Get("status").String()         //状态
	conditon := param.Get("conditon").String()     //输入框收索条件
	bannertype := param.Get("banner_type").String()
	if perpage == 0 {
		perpage = 10
	}
	if page == 0 {
		page = 1
	}
	var val []interface{}
	o := orm.NewOrm()
	sql := `SELECT * FROM t_website_banner_manage as a WHERE a.datastatus=1 AND a.banner_type=?`
	val = append(val, bannertype)
	if starttimes != "" {
		sql += " and a.activetime_start>=? "
		val = append(val, starttimes)
	}
	if endtime != "" {
		sql += " and a.activetime_end<=? "
		val = append(val, endtime)
	}
	if status != "" {
		sql += " and a.datastatus=? "
		val = append(val, status)
	}
	if conditon != "" {
		conditon = fmt.Sprintf("%%%s%%", conditon)
		sql += " and (a.msg_title like ? )"
		val = append(val, conditon)
	}
	_, err.Msg = o.Raw(sql, val...).ValuesJSON(&result.List)
	datacount := result.List.ItemCount()
	offset := (page - 1) * perpage
	limit := perpage
	sql += " order by a.displayorder asc,a.updatetime desc limit ?,?"
	val = append(val, offset, limit)
	_, err.Msg = o.Raw(sql, val...).ValuesJSON(&result.List)
	result.TotalCount = int64(datacount) //总条数
	result.PageNo = int64(page)          //页码
	result.PageSize = int64(perpage)     //每页条数
	return
}

//获取详情
func ChannelBannerListDetail(id string) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ChannelBannerListDetail"
	o := orm.NewOrm()
	sql := `SELECT * FROM t_website_banner_manage as a WHERE a.datastatus=1 AND a.id=?`
	_, err.Msg = o.Raw(sql, id).ValuesJSON(&result.List)
	return
}

//更新状态  1下架 2上移 3下移 4删除
func DoUpdateId(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	var sql1, sql2 string
	err.Caption = "ChannelBannerListDetail"
	o := orm.NewOrm()
	contype := param.Get("type").String()
	order := param.Get("order").Int()             //当前位置
	banner_type := param.Get("banner_type").Int() //渠道类型
	uporder := order - 1
	downorder := order + 1
	if contype == "1" {
		sql1 = `UPDATE t_website_banner_manage SET datastatus=3 WHERE id=:id`
		_, err.Msg = o.RawJSON(sql1, param).ValuesJSON(&result.List)
	} else if contype == "2" {
		sql1 = `UPDATE t_website_banner_manage SET displayorder=? WHERE banner_type=? AND displayorder=?`
		sql2 = `UPDATE t_website_banner_manage SET displayorder=? WHERE banner_type=? AND displayorder=?`
		_, err.Msg = o.Raw(sql1, uporder, banner_type, order).ValuesJSON(&result.List)
		_, err.Msg = o.Raw(sql2, order, banner_type, uporder).ValuesJSON(&result.List)
	} else if contype == "3" {
		sql1 = `UPDATE t_website_banner_manage SET displayorder=? WHERE banner_type=? AND displayorder=?`
		sql2 = `UPDATE t_website_banner_manage SET displayorder=? WHERE banner_type=? AND displayorder=?`
		_, err.Msg = o.Raw(sql1, downorder, banner_type, order).ValuesJSON(&result.List)
		_, err.Msg = o.Raw(sql2, order, banner_type, downorder).ValuesJSON(&result.List)
	} else if contype == "4" {
		sql1 = `UPDATE t_website_banner_manage SET datastatus=4 WHERE id=:id`
		_, err.Msg = o.RawJSON(sql1, param).ValuesJSON(&result.List)
	} else {
		err.Errorf(gutils.ParamError, "未选择操作类型")
		return result, err
	}

	return
}

// NotifyRedirect 记录并且重定向
func NotifyRedirect(id string) (url string, err gutils.LError) {

	o := orm.NewOrm()

	var param config.LJSON
	param.Set("NotifyID").SetString(id)

	var currentMessage config.LJSON
	sql := `select * from t_system_notify where NotifyID = :NotifyID`
	_, err.Msg = o.RawJSON(sql, param).ValuesJSON(&currentMessage)

	url = currentMessage.Item(0).Get("DetailUrl").String()
	return
}
