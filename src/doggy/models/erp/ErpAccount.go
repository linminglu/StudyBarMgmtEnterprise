//author:  罗云鹏 17-03-15
//purpose： 运营后台－账户管理
package models

import (
	"doggy/gutils"
	"fmt"
	"strings"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

// GetLoginInfo 登录获得信息
func GetLoginInfo(username string, password string) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "GetDituiUserInfo"
	o := orm.NewOrm()
	pwd := gutils.Md5(password)
	_, err.Msg = o.Raw("select u.userid as userid,u.username as username,u.nickname as nickname,u.mobile as mobile,r.RoleID as roleid,r.ActionGUIDS as actionguids from t_ditui_user as u left join t_ditui_role_property as r on r.RoleID=u.usertype where datastatus=1 and username=? and password=?", username, strings.ToLower(pwd)).ValuesJSON(&result.List)
	return
}

// ModifyPassword 修改密码
func ModifyPassword(userid string, password string) (int, string) {
	var err gutils.LError
	err.Caption = "ErpModifyPassword"
	pwd := gutils.Md5(password)
	o := orm.NewOrm()
	sql := "update t_ditui_user set password=? where userid=?"
	_, err.Msg = o.Raw(sql, strings.ToLower(pwd), userid).Exec()
	if err.Msg != nil {
		return 0, "修改失败"
	}
	return 1, "修改成功"
}

// GetUsersList 获取用户列表
func GetUsersList(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ErpGetUsersList"
	starttime := param.Get("start_time").String() //起始时间
	endtime := param.Get("end_time").String()     //结束时间
	perpage := param.Get("per_page").Int()        //每页数量
	page := param.Get("page").Int()               //页数
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
	FROM t_user AS u
	LEFT JOIN t_doctor AS d ON d.DoctorID=u.UserID
	WHERE u.DataStatus=1 AND u.UserID!="" AND u.CreateTime!="0000-00-00 00:00:00"`
	sql := `SELECT u.UserID AS uid, u.UserNo AS user_no, d.Picture AS picture, d.Name AS name, d.Mobile AS mobile, d.Sex AS sex,
	(SELECT GROUP_CONCAT(Chainname) FROM t_chain WHERE CreateID=u.Userid) AS found_clinic,
	(SELECT GROUP_CONCAT(_c.Name) FROM t_chainclinic AS cc LEFT join t_clinic AS _c ON _c.ClinicID=cc.ClinicID WHERE ChainGUID IN (SELECT ChainGUID FROM t_chain WHERE CreateID=u.Userid)) AS connected_clinic,
	d.Area AS area, u.source AS source, ip.ipaddr AS ip_addr, u.CreateTime AS regist_time
	FROM t_user AS u
	LEFT JOIN t_doctor AS d ON d.DoctorID=u.UserID
	LEFT JOIN t_userip AS ip ON u.UserID=ip.userid
	WHERE u.DataStatus=1 AND u.UserID!=""`
	if starttime != "" {
		starttime += " 00:00:00"
		sqlc += " and u.CreateTime>=? "
		sql += " and u.CreateTime>=? "
		val = append(val, starttime)
	}
	if endtime != "" {
		endtime += " 23:59:59"
		sqlc += " and u.CreateTime<=? "
		sql += " and u.CreateTime<=? "
		val = append(val, endtime)
	}
	if conditon != "" {
		conditon = fmt.Sprintf("%%%s%%", conditon)
		sqlc += " and (d.Mobile like ? or d.Name like ?)"
		sql += " and (d.Mobile like ? or d.Name like ?)"
		val = append(val, conditon, conditon)
	}

	_, err.Msg = o.Raw(sqlc, val...).ValuesJSON(&count)
	if err.Msg != nil {
		return
	}

	offset := (page - 1) * perpage
	limit := perpage
	sql += " order by regist_time asc limit ?,?"
	val = append(val, offset, limit)
	_, err.Msg = o.Raw(sql, val...).ValuesJSON(&result.List)
	if err.Msg != nil {
		return
	}
	result.TotalCount = count.Item(0).Get("count").Int64() //总条数
	result.PageNo = int64(page)                            //页码
	result.PageSize = int64(perpage)                       //每页条数
	return
}

// GetUserInfo 获取用户信息
func GetUserInfo(id string) (result gutils.LResultModel, err gutils.LError) {
	err.Caption = "ErpGetUserInfo"
	o := orm.NewOrm()
	sql := `select u.UserID as uid, u.UserNo as user_no, u.CreateTime as regist_time,
	d.Picture as picture, d.Name as name, d.Mobile as mobile, d.Sex as sex, d.Age as age,
	d.Area as area, d.Grade as grade, d.WorkYear as work_year, d.Confirmation as confirmation, d.Expert as expert,
	(SELECT GROUP_CONCAT(Chainname) FROM t_chain WHERE CreateID=u.Userid) AS found_clinic,
	(SELECT GROUP_CONCAT(_c.Name) FROM t_chainclinic AS cc LEFT join t_clinic AS _c ON _c.ClinicID=cc.ClinicID WHERE ChainGUID IN (SELECT ChainGUID FROM t_chain WHERE CreateID=u.Userid)) AS connected_clinic
	from t_user as u
	left join t_doctor as d on d.DoctorID=u.UserID
	where u.UserID=? limit 1`
	_, err.Msg = o.Raw(sql, id).ValuesJSON(&result.List)
	return
}
