/*
	purpose:命令号常量
	author:于绍纳
*/
package flybears

//接口命令号
const (
	FUNC_ID_COLLEGE_LOGIN               = 1000 //登录接口
	FUNC_ID_COLLEGE_SENDCODE            = 1001 //发送验证码
	FUNC_ID_COLLEGE_LOGOUT              = 1002 //登出接口
	FUNC_ID_COLLEGE_SIGNLE_LIST         = 1003 //单课程列表
	FUNC_ID_COLLEGE_SERIES_LIST         = 1004 //系列课列表
	FUNC_ID_COLLEGE_SINGLE_DETAIL       = 1005 //获取单课程详情
	FUNC_ID_COLLEGE_SINGLE_MOD          = 1006 //编辑单课程: (新增,修改)
	FUNC_ID_COLLEGE_SERIES_INFO         = 1007 //系列课详情
	FUNC_ID_COLLEGE_SERIES_MOD_INFO     = 1008 //修改系列课详情
	FUNC_ID_COLLEGE_SERIES_ADD_SINGLE   = 1009 //系列课新增单课程
	FUNC_ID_COLLEGE_SERIES_DEL_SINGLE   = 1010 //系列课移除单课程
	FUNC_ID_COLLEGE_SERIES_ADD          = 1011 //新增系列课
	FUNC_ID_COLLEGE_SERIES_SINGLE_LIST  = 1012 //查询系列课下的单课程列表
	FUNC_ID_COLLEGE_MOD_ROOM_INFO       = 1013 //修改直播间信息
	FUNC_ID_COLLEGE_USER_LIST           = 1014 //管理员列表
	FUNC_ID_COLLEGE_USER_ADD            = 1015 //添加管理员
	FUNC_ID_COLLEGE_USER_DEL            = 1016 //删除管理员
	FUNC_ID_COLLEGE_SEARCH_USER         = 1017 //查询是否是牙医管家账号
	FUNC_ID_COLLEGE_STAT                = 1018 //统计概要
	FUNC_ID_COLLEGE_CHECKLIST_INCOME    = 1019 //课程对应的收入流水列表
	FUNC_ID_COLLEGE_CHECKLIST_PAYOUT    = 1020 //课程对应的支出流水列表
	FUNC_ID_COLLEGE_SIGNLE_SETTINGS     = 1021 //删除 上下架单课程
	FUNC_ID_COLLEGE_OSS_PARAM           = 1022 //阿里云参数
	FUNC_ID_COLLEGE_GET_ROOMINFO        = 1023 //查询直播间的接口
	FUNC_ID_COLLEGE_SERIES_SETTINGS     = 1024 //系列课设置
	FUNC_ID_COLLEGE_GET_PUSHURL         = 1025 //获取推流地址
	FUNC_ID_COLLEGE_SETALLSINGLE        = 1026 //一键上架(下架)系列课的所有单课
	FUNC_ID_COLLEGE_SERIESOFSIGNLE_LIST = 1027 //【系列课】 -- 【选择框中的单课程列表】
	FUNC_ID_COLLEGE_UPLOAD_PICTURE      = 1028 //上传图片
	FUNC_ID_COLLEGE_GET_TAGLIST      = 1029 	//获取单课程列表
	//App后台管理系统
	FUNC_ID_APPSYS_GET_LOGIN           = 1100  //app后台登陆
	FUNC_ID_APPSYS_SENDCODE            = 1101  //发送验证码
	FUNC_ID_APPSYS_LOGOUT              = 1102  //登出接口
	FUNC_ID_APPSYS_BANNER_LIST         = 1103  //首页banner列表
	FUNC_ID_APPSYS_BANNER_DETAIL       = 1104  //首页banner详情
	FUNC_ID_APPSYS_ADD_AND_MOD_BANNER          = 1105  //新增,修改,上下移动首页banner
	FUNC_ID_APPSYS_HOME_MODULE_LIST    = 1106  //首页模块列表
	FUNC_ID_APPSYS_MOD_HOME_MODULE     = 1107  // 修改首页模块状态
	FUNC_ID_APPSYS_HOME_BOUTIQUE_CLASS_LIST    = 1108  //首页精品课列表
	FUNC_ID_APPSYS_GET_HOME_BOUTIQUE_DETAIL    = 1109  //首页精品课程详情
	FUNC_ID_APPSYS_ADD_AND_MOD_HOME_BOUTIQUE   		   = 1110  //首页精品课程修改(新增)

	FUNC_ID_COLLEGE_ALL_SIGNLE_LIST         = 1111 //所有单课程列表
	FUNC_ID_COLLEGE_ALL_SERIES_LIST         = 1112 //所有系列课列表
	FUNC_ID_COLLEGE_SUBMIT_SIGNLE_ALTERDATA         = 1113 //单课程提交修改
	FUNC_ID_COLLEGE_SUBMIT_SERIES_ALTERDATA        = 1114 //系列课提交修改
)
