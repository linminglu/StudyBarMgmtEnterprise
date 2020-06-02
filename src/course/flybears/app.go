package flybears

import (
	models "course/models"
	"course/models/app"
)

func init() {
	models.AddMap(FUNC_ID_APPSYS_GET_LOGIN, &app.LApp{}, "Login")
	models.AddMap(FUNC_ID_APPSYS_SENDCODE, &app.LApp{}, "SendCode")
	models.AddMap(FUNC_ID_APPSYS_LOGOUT, &app.LApp{}, "LogOut")
	
	models.AddMap(FUNC_ID_APPSYS_BANNER_LIST, &app.LApp{}, "GetBannerList")
	models.AddMap(FUNC_ID_APPSYS_BANNER_DETAIL, &app.LApp{}, "GetBannerDetail")
	models.AddMap(FUNC_ID_APPSYS_ADD_AND_MOD_BANNER, &app.LApp{}, "AddOrModBanner")
	models.AddMap(FUNC_ID_APPSYS_HOME_MODULE_LIST, &app.LApp{}, "GetModuleList")
	models.AddMap(FUNC_ID_APPSYS_MOD_HOME_MODULE, &app.LApp{}, "ModOrMoveModule")
	models.AddMap(FUNC_ID_APPSYS_HOME_BOUTIQUE_CLASS_LIST, &app.LApp{}, "BoutiqueClasssList")
	models.AddMap(FUNC_ID_APPSYS_GET_HOME_BOUTIQUE_DETAIL, &app.LApp{}, "GetBoutiqueDetail")
	models.AddMap(FUNC_ID_APPSYS_ADD_AND_MOD_HOME_BOUTIQUE, &app.LApp{}, "AddOrModBoutiqueClass")

	models.AddMap(FUNC_ID_COLLEGE_ALL_SIGNLE_LIST, &app.LApp{}, "SignleList")
	models.AddMap(FUNC_ID_COLLEGE_ALL_SERIES_LIST, &app.LApp{}, "SeriesList")
}
