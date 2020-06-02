package flybears

import (
	models "course/models"
	"course/models/college"
)

func init() {
	models.AddMap(FUNC_ID_COLLEGE_LOGIN, &college.LCollege{}, "Login")
	models.AddMap(FUNC_ID_COLLEGE_SENDCODE, &college.LCollege{}, "SendCode")
	models.AddMap(FUNC_ID_COLLEGE_LOGOUT, &college.LCollege{}, "LogOut")
	models.AddMap(FUNC_ID_COLLEGE_SIGNLE_LIST, &college.LCollege{}, "SignleList")
	models.AddMap(FUNC_ID_COLLEGE_SERIES_LIST, &college.LCollege{}, "SeriesList")
	models.AddMap(FUNC_ID_COLLEGE_SINGLE_DETAIL, &college.LCollege{}, "SignleDetail")
	models.AddMap(FUNC_ID_COLLEGE_SINGLE_MOD, &college.LCollege{}, "AddOrModSignle")
	models.AddMap(FUNC_ID_COLLEGE_SERIES_INFO, &college.LCollege{}, "SeriesInfo")
	models.AddMap(FUNC_ID_COLLEGE_SERIES_MOD_INFO, &college.LCollege{}, "ModSeries")
	models.AddMap(FUNC_ID_COLLEGE_SERIES_ADD_SINGLE, &college.LCollege{}, "SeriesDetailAddSignle")
	models.AddMap(FUNC_ID_COLLEGE_SERIES_DEL_SINGLE, &college.LCollege{}, "SeriesDetailDel")
	models.AddMap(FUNC_ID_COLLEGE_SERIES_ADD, &college.LCollege{}, "AddSeries")
	models.AddMap(FUNC_ID_COLLEGE_SERIES_SINGLE_LIST, &college.LCollege{}, "SeriesDetailList")
	models.AddMap(FUNC_ID_COLLEGE_MOD_ROOM_INFO, &college.LCollege{}, "ModRoomInfo")
	models.AddMap(FUNC_ID_COLLEGE_USER_LIST, &college.LCollege{}, "UserList")
	models.AddMap(FUNC_ID_COLLEGE_USER_ADD, &college.LCollege{}, "UserAdd")
	models.AddMap(FUNC_ID_COLLEGE_USER_DEL, &college.LCollege{}, "UserDel")
	models.AddMap(FUNC_ID_COLLEGE_SIGNLE_SETTINGS, &college.LCollege{}, "SignleSetting")

	models.AddMap(FUNC_ID_COLLEGE_SEARCH_USER, &college.LCollege{}, "SearchUser")

	models.AddMap(FUNC_ID_COLLEGE_STAT, &college.LCollege{}, "AnchorStatList")
	models.AddMap(FUNC_ID_COLLEGE_CHECKLIST_INCOME, &college.LCollege{}, "AnchorIncomeList")
	models.AddMap(FUNC_ID_COLLEGE_CHECKLIST_PAYOUT, &college.LCollege{}, "AnchorPayOutList")
	models.AddMap(FUNC_ID_COLLEGE_OSS_PARAM, &college.LCollege{}, "OssParam")
	models.AddMap(FUNC_ID_COLLEGE_GET_ROOMINFO, &college.LCollege{}, "GetRoomInfo")

	models.AddMap(FUNC_ID_COLLEGE_SERIES_SETTINGS, &college.LCollege{}, "SeriesSetting")
	models.AddMap(FUNC_ID_COLLEGE_GET_PUSHURL, &college.LCollege{}, "GetPushUrl")
	models.AddMap(FUNC_ID_COLLEGE_SETALLSINGLE, &college.LCollege{}, "SetAllSignle")

	models.AddMap(FUNC_ID_COLLEGE_SERIESOFSIGNLE_LIST, &college.LCollege{}, "Seriesofsignlelist")
	models.AddMap(FUNC_ID_COLLEGE_GET_ROOMINFO, &college.LCollege{}, "GetRoomInfo")
	models.AddMap(FUNC_ID_COLLEGE_GET_TAGLIST, &college.LCollege{}, "GetTagList")


	models.AddMap(FUNC_ID_COLLEGE_SUBMIT_SIGNLE_ALTERDATA, &college.LCollege{}, "SubmitSignleApplyData")
	models.AddMap(FUNC_ID_COLLEGE_SUBMIT_SERIES_ALTERDATA, &college.LCollege{}, "SubmitSeriesApplyData")
	models.AddMap(FUNC_ID_COLLEGE_GET_ROOMINFO, &college.LCollege{}, "GetRoomInfo")
	models.AddMap(FUNC_ID_COLLEGE_GET_ROOMINFO, &college.LCollege{}, "GetRoomInfo")
	models.AddMap(FUNC_ID_COLLEGE_GET_ROOMINFO, &college.LCollege{}, "GetRoomInfo")
	models.AddMap(FUNC_ID_COLLEGE_GET_ROOMINFO, &college.LCollege{}, "GetRoomInfo")
	models.AddMap(FUNC_ID_COLLEGE_GET_ROOMINFO, &college.LCollege{}, "GetRoomInfo")
	models.AddMap(FUNC_ID_COLLEGE_GET_ROOMINFO, &college.LCollege{}, "GetRoomInfo")

}
