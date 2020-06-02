//author:  邓良远 2016-11-07
//purpose： C++接口定义
package gutils

import (
	"syscall"
	"unsafe"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
	_ "github.com/go-sql-driver/mysql"
)

const (
	AESKey = "%1Aa" //PC端用户密码Key

	FUNC_ID_SYSTEN_LOCATION      = 1  //定位用户地理位置
	FUNC_ID_SYSTEM_UPGRADE       = 4  //获取软件更新包
	FUNC_ID_SYSTEM_GET_SERVERURL = 6  //获取服务器URL
	FUNC_ID_SYSTEM_ECHO          = 10 //Echo

	//app发布接口
	FUNC_ID_VERISION_UPGRADE = 11 // app 版本信息发布
	FUNC_ID_APP_STORE        = 12 //IOS AppStore发布临时接口

	//Android内测用户管理
	FUNC_ID_APP_VERSION_MANAGER_GET  = 13 //app版本管理获取
	FUNC_ID_APP_VERSION_MANAGER_SAVE = 14 //app版本管理保存
	//手机和平板日志记录接口
	FUNC_ID_PAD_LOGGER_RECORD  = 15 //记录日志到数据库
	FUNC_ID_GATHER_ARTICLE_NUM = 16 //采集App营销文章转发量
	FUNC_ID_APP_LOGIN_TIME     = 17 //app在线时长
	FUNC_ID_GET_NAME_PINYIN    = 18 //获取拼音

	//视频直播接口区域
	FUNC_ID_TEACHER_LOGIN     = 20 //讲师登陆接口
	FUNC_ID_TEACHER_LIVE_LIST = 21 //获取直播列表
	FUNC_ID_GET_ROOM_ID       = 22 //获取房间号
	FUNC_ID_SET_LIVE_STATE    = 23 //修改直播状态
	FUNC_ID_GET_TEACHER_INFO  = 24 //获取讲师信息

	FUNC_ID_TEACHER_LIVE_TEST        = 25 //测试接口
	FUNC_ID_TEACHER_LIVE_SIGN_GET    = 26 //获取sign接口
	FUNC_ID_TEACHER_LIVE_SIGN_VERIFY = 27 //验证sign接口
	FUNC_ID_PUSH_STREAM_STATE        = 28 //阿里云推流状态回调消
	FUNC_ID_GET_PUSH_STREAM_URL      = 29 //获取推流链接
	FUNC_ID_GET_LIVESHOW_URL         = 30 //获取播放URL
	FUNC_ID_RECORDING_INDEX          = 31 //录播索引
	FUNC_ID_RECORDING_LIST           = 32 //录播列表
	FUNC_ID_FORBID_STREAM            = 33 //恢复、禁止推流
	FUNC_ID_TEST_AUDIENCE_NUMBER     = 34 //观众人数
	FUNC_ID_GET_LIVESHOW_H5_URL      = 35 //获取播放URL

	FUNC_ID_TEST_COMMOND    = 99 //测试命令号
	FUNC_ID_TEST_REDPACKAGE = 98 //临时分发奖品

	// 用户信息获取和修改
	FUNC_ID_USER_ACCOUNT_INFO           = 100 //根据koalaID获取飞熊信息
	FUNC_ID_USER_REGISTER               = 101 //PC端用户注册(包含APP旧版本注册)
	ABORT_FUNC_ID_USER_LOGIN            = 102 //(停用)用户登录
	FUNC_ID_USER_LOGOUT                 = 103 //用户登出
	FUNC_ID_USER_CHECK_SESSION          = 104 //校验session是否有效
	ABORT_FUNC_ID_USER_MODIFY_PASSWORD  = 105 //(停用)修改密码跟用户名，换FUNC_ID_USER_MOD_PASSWORD=154
	FUNC_ID_DOC_GET_USERINFO            = 106 //医生APP获取用户信息
	FUNC_ID_DOC_MOD_USERINFO            = 107 //医生APP修改用户信息
	ABORT_FUNC_ID_USER_RELATIONSHIP_GET = 109 //(停用)获取用户的关系
	FUNC_ID_CLINIC_REGISTER             = 110 //PC端注册诊所
	FUNC_ID_CLINIC_REGISTER_WEB         = 111 //网页申请注册诊所
	//app重置密码
	FUNC_ID_USER_RESET_PW_REQUEST = 114 //医生APP请求重置密码
	FUNC_ID_USER_RESET_PW_SUBMIT  = 115 //医生APP重置密码
	//app老版本绑定手机
	FUNC_ID_USER_MOBILE_REQUEST = 117 //医生APP获取绑定的验证码
	FUNC_ID_USER_MOBILE_SUBMIT  = 118 //医生APP手机绑定请求
	//手机解绑PC
	FUNC_ID_DATA_BINDDATA_DEL = 123 //医生APP用户与诊所内医生解除关联

	ABORT_FUNC_ID_DATA_BINDDATA_GET   = 124 //(停用)获取用户数据
	ABORT_FUNC_ID_USER_LOGIN_GET_CODE = 130 //(停用)获取登录码
	ABORT_FUNC_ID_USER_UNBIND_REQUEST = 132 //(停用)解绑手机或邮箱请求
	ABORT_FUNC_ID_USER_UNBIND_SUBMIT  = 133 //(停用)解绑手机提交
	ABORT_FUNC_ID_USER_LOGIN_THIRD    = 134 //(停用)第三方帐号登录
	FUNC_ID_IOS_USER_SUB_TOKEN        = 135 //医生APP的ios用户提交推送串码
	FUNC_ID_USER_MOD_LOCATION         = 137 //修改用户地理位置信息(PC和APP通用)

	//PC端绑定手机
	FUNC_ID_CLINIC_BIND_MOBILE         = 139 //PC端诊所绑定手机 session|code|mobile
	FUNC_ID_CLINIC_BIND_REQUEST        = 140 //PC端获取诊所绑定手机的验证码
	FUNC_ID_Clinic_RESET_PW_REQUEST    = 141 //PC端诊所请求重置密码
	FUNC_ID_Clinic_RESET_PW_SUBMIT     = 142 //PC端诊所重置密码
	ABORT_FUNC_ID_CLINIC_GET_BY_MOBILE = 143 //PC端绑定该手机号码的诊所列表（停用）

	//app 验证码、登录、扫描绑定、医生诊所列表、修改密码、
	FUNC_ID_GET_VERIFY_CODE        = 144 //获取短信验证码mobile|reqfuncid (PC和APP通用)
	FUNC_ID_DOC_LOGIN_WECHAT       = 145 //医生app微信登录
	FUNC_ID_DOC_LOGIN_USERNAME     = 146 //医生app登录（通过用户名密码）
	FUNC_ID_DOC_LOGIN_USERID       = 147 //医生app用户ID登录
	FUNC_ID_DOC_LOGIN_VERIFYCODE   = 148 //手机app短信验证码登录
	FUNC_ID_DOC_LOGIN_QRCODE       = 149 //医生app扫描二维登录
	FUNC_ID_CLINIC_AND_DOCTOR_INFO = 150 //医生app获取诊所信息以及诊所内医生列表
	FUNC_ID_DOC_BIND_CLINIC_QRCODE = 151 //医生app扫描二维码绑定诊所医生
	FUNC_ID_DOC_GET_CLINIC         = 152 //医生app获取医生关联的诊所列表
	FUNC_ID_USER_MOD_PASSWORD      = 154 //修改密码(PC和APP通用)
	//PC端忘记密码 恢复数据159
	FUNC_ID_CLINIC_LOGIN_DENTALID    = 155 //PC端管家号登录
	FUNC_ID_CLINIC_LOGIN_USERID      = 156 //PC端用户ID登录
	FUNC_ID_CLINIC_GET_BY_MOBILE     = 157 //PC端绑定该手机号码的诊所列表
	FUNC_ID_VERIFY_VERIFY_CODE       = 158 //验证验证码
	FUNC_ID_CLINIC_VERIFY_CODE_LOGIN = 159 //诊所验证码登录
	//app新版注册、登录、添加虚拟诊所
	FUNC_ID_DOC_REGISTER_AND_LOGIN = 160 //医生app注册并登录
	FUNC_ID_DOC_ADD_VIRTUAL_CLINIC = 161 //添加虚拟诊所
	FUNC_ID_DOC_GET_DOC_INFO       = 162 //医生APP获取诊所内指定的医生信息
	FUNC_ID_DOC_ADD_SHARE_ACCOUNT  = 163 //添加共享账户
	FUNC_ID_DOC_DEL_SHARE_ACCOUNT  = 164 //解除共享账户

	// 预约项目
	FUNC_ID_SCHEDULE_ITEM_SET = 201 //添加预约项目
	FUNC_ID_SCHEDULE_ITEM_DEL = 202 //删除预约项目
	FUNC_ID_SCHEDULE_ITEM_MOD = 203 //修改预约项目
	FUNC_ID_SCHEDULE_ITEM_GET = 204 //获取预约项目
	//预约
	FUNC_ID_SCHEDULE_ADD        = 205 //新增预约
	FUNC_ID_SCHEDULE_MOD        = 206 //修改预约
	FUNC_ID_SCHEDULE_GET        = 207 //查询预约
	FUNC_ID_SCHEDULE_CONFIRM    = 208 //确认预约
	FUNC_ID_SCHEDULE_CANCEL     = 209 //取消预约
	FUNC_ID_SCHEDULE_MOD_DOCTOR = 210 //修改预约医生
	//排班
	FUNC_ID_WORKSHIFT_SET        = 211 //设置班次
	FUNC_ID_WORKSHIFT_DEL        = 212 //删除班次
	FUNC_ID_WORKSHIFT_GET        = 213 //获取班次
	FUNC_ID_WORKSHIFT_DOCTOR_SET = 214 //保存用户排班表
	FUNC_ID_WORKSHIFT_DOCTOR_GET = 215 //获取用户排班表

	FUNC_ID_CLINIC_ATTENDANCE_SET_PC    = 221 //新增排班
	FUNC_ID_CLINIC_ATTENDANCE_DEL_PC    = 222 //删除排班
	FUNC_ID_CLINIC_ATTENDANCE_GET_PHONE = 224 //获取排班
	//诊所配置信息
	FUNC_ID_CLINIC_SAVE_SETTING_PC = 225 //保存诊所配置信息
	FUNC_ID_CLINIC_GET_SETTING_PC  = 226 //获取诊所配置信息

	// 诊所内用户管理
	FUNC_ID_CLINIC_USER_ADD = 231 //新增Koala用户
	FUNC_ID_CLINIC_USER_DEL = 232 //删除Koala用户
	FUNC_ID_CLINIC_USER_MOD = 233 //修改Koala用户
	FUNC_ID_CLINIC_USER_GET = 234 //获取Koala用户

	// 诊所内医生管理
	FUNC_ID_CLINIC_DOCTOR_SET = 241 //诊所新增医生
	FUNC_ID_CLINIC_DOCTOR_DEL = 242 //诊所删除医生
	FUNC_ID_CLINIC_DOCTOR_MOD = 243 //诊所修改医生
	FUNC_ID_CLINIC_DOCTOR_GET = 244 //诊所获取医生

	FUNC_ID_CLINIC_DOCTOR_HABIT = 245 //保存医生习惯

	// 诊所内顾客管理
	FUNC_ID_CLINIC_CUSTOMER_SET      = 251 //新增Koala患者
	FUNC_ID_CLINIC_CUSTOMER_DEL      = 252 //删除Koala患者
	FUNC_ID_CLINIC_CUSTOMER_MOD      = 253 //修改Koala患者
	FUNC_ID_CLINIC_CUSTOMER_GET      = 254 //获取Koala患者
	FUNC_ID_CLINIC_CUSTOMER_FAVORITE = 255 //收藏诊所顾客

	// 诊所内用户关系管理
	FUNC_ID_CLINIC_RELATIONSHIP_SET = 261 //诊所添加用户关系
	FUNC_ID_CLINIC_RELATIONSHIP_DEL = 262 //诊所删除用户关系
	FUNC_ID_CLINIC_RELATIONSHIP_GET = 263 //获取诊所内用户关系
	//连锁店管理
	FUNC_ID_CHAIN_SAVE                   = 271 //保存连锁店信息
	FUNC_ID_CHAIN_CHAINCLINIC_SAVE_ABORT = 272 //连锁店增加分店(弃用)
	FUNC_ID_CHAIN_CHAINCLINIC_DEL        = 273 //连锁店删除分店
	FUNC_ID_CHAIN_CHAINCLINIC_GET        = 274 //获取连锁店的分店
	FUNC_ID_CHAIN_CHAINCUSER_SAVE        = 275 //连锁店增加用户
	FUNC_ID_CHAIN_CHAINCUSER_DEL         = 276 //连锁店删除用户
	FUNC_ID_CHAIN_CUSTOMER_GET           = 278 //获取连锁店的患者列表
	FUNC_ID_CHAIN_HANDLE_GET             = 279 //获取连锁店中顾客的处置信息
	FUNC_ID_CHAIN_GET                    = 280 //获取连锁店信息

	FUNC_ID_CHAIN_CHAINCDOCTOR_GET = 281 //获取连锁店的有权限的医生
	FUNC_ID_CHAIN_CHAINHANDLE_GET  = 282 //获取连锁店患者的处置
	FUNC_ID_CHAIN_CHAINEMR_GET     = 283 //获取连锁店患者的病历
	FUNC_ID_CHAIN_CHAINVISIT_GET   = 284 //获取连锁店患者的回访
	FUN_ID_CHAIN_CHAINEXAMLIST_GET = 285 //获取就诊列表
	FUN_ID_CHAIN_CHAINBILL_GET     = 286 //获取连锁店费用列表
	FUNC_ID_CHAIN_DOCTOR_GET       = 287 //获取连锁店的所有医生

	FUN_ID_CHAIN_CHAINGETREPORT    = 290 //获取连锁店报表
	FUN_ID_CHAIN_CHAININSERTREPORT = 291 //加入连锁店报表
	FUN_ID_CHAIN_CHAINMODIFYREPORT = 292 //修改连锁店报表状态
	FUNC_ID_CHAIN_CLINICLIST_GET   = 293 //查询连锁店列表信息/诊所信息

	FUNC_ID_CHAIN_CHAINCLINIC_SAVE    = 294 //连锁店增加分店
	FUNC_ID_CHAIN_VERIFYCODE_GET      = 295 //连锁店获取验证码
	FUN_ID_CHAIN_NEWCHAINEXAMLIST_GET = 296 //获取就诊列表(新)

	// 客户历史资料
	FUNC_ID_HISTORY_STUDY_ADD = 301 //新增就诊信息
	FUNC_ID_HISTORY_STUDY_DEL = 302 //删除就诊信息
	FUNC_ID_HISTORY_STUDY_MOD = 303 //修改就诊信息
	FUNC_ID_HISTORY_STUDY_GET = 304 //获取就诊信息
	//患者病历
	FUNC_ID_HISTORY_MEDIARECORD_SET = 311 //新增病历
	FUNC_ID_HISTORY_MEDIARECORD_DEL = 312 //删除病历
	FUNC_ID_HISTORY_MEDIARECORD_MOD = 313 //修改病历
	FUNC_ID_HISTORY_MEDIARECORD_GET = 314 //获取病历
	//患者回访
	FUNC_ID_HISTORY_VISIT_SET = 321 //新增回访
	FUNC_ID_HISTORY_VISIT_DEL = 322 //删除回访
	FUNC_ID_HISTORY_VISIT_MOD = 323 //修改回访
	FUNC_ID_HISTORY_VISIT_GET = 324 //获取回访
	//患者账单
	FUNC_ID_HISTORY_BILL_SET        = 331 //新增帐单
	FUNC_ID_HISTORY_BILL_DEL        = 332 //删除帐单
	FUNC_ID_HISTORY_BILL_MOD        = 333 //修改账单
	FUNC_ID_HISTORY_BILL_GET        = 334 //获取账单
	FUNC_ID_HISTORY_BILL_SUB_SET    = 335 //新增帐单类别
	FUNC_ID_HISTORY_BILL_DETAIL_SET = 336 //新增账单详情
	FUNC_ID_HISTORY_BILL_SUB_GET    = 337 //获取账单子项
	FUNC_ID_HISTORY_BILL_DETAIL_GET = 338 //获取账单详情
	//患者处置
	FUNC_ID_HISTORY_HANDLE_SET = 341 //新增处置
	FUNC_ID_HISTORY_HANDLE_DEL = 342 //删除处置
	FUNC_ID_HISTORY_HANDLE_MOD = 343 //修改处置
	FUNC_ID_HISTORY_HANDLE_GET = 344 //获取处置信息
	FUNC_ID_HISTORY_AGENDA_SET = 345 //保存日程
	//患者图像
	FUNC_ID_HISTORY_IMAGE_SET     = 351 //增加图像
	FUNC_ID_HISTORY_IMAGE_DEL     = 352 //删除图像信息
	FUNC_ID_HISTORY_IMAGE_MOD     = 353 //修改图像信息
	FUNC_ID_HISTORY_IMAGE_GET     = 354 //获取图像信息
	FUNC_ID_HISTORY_IMAGE_NEW_GET = 355 //获取图像完整记录索引
	FUNC_ID_HISTORY_IMAGE_FLAG    = 356 //删除图像标记
	FUNC_ID_HISTORY_IMAGE_DELETE  = 357 //删除图像，同时同步到本地
	FUNC_ID_HISTORY_BUSINESS_GET  = 361 //(待停用)获取管家指数

	//添加预存款
	FUNC_ID_CLINIC_ADVANCEPAY_SET = 371 //添加预存款
	FUNC_ID_CLINIC_ADVANCEPAY_DEL = 372 //删除预存款信息
	FUNC_ID_CLINIC_ADVANCEPAY_MOD = 373 //修改预存款信息
	FUNC_ID_CLINIC_ADVANCEPAY_GET = 374 //获取预存款信息

	//新闻资讯营销
	FUNC_ID_SERVER_INFO_GET     = 415 //获取信息
	FUNC_ID_SERVER_INFO_GET_NEW = 416 //获取新信息

	//PC端模板
	fUNC_ID_SERVER_SMS_SEND_PLAN_NEW = 450 //创建短信发送计划,无限制
	FUNC_ID_SERVER_SMS_TEMPLATE_ADD  = 451 //添加短信模版
	FUNC_ID_SERVER_SMS_TEMPLATE_DEL  = 452 //删除短信模版
	FUNC_ID_SERVER_SMS_TEMPLATE_GET  = 453 //获取短信模版
	FUNC_ID_SERVER_SMS_USERINFO_GET  = 454 //获取用户短信账户信息
	FUNC_ID_SERVER_SMS_SEND          = 455 //发送即时短信
	FUNC_ID_SERVER_SMS_TEMPLATE_MOD  = 456 //修改短信模版
	FUNC_ID_SERVER_SMS_SEND_PLAN     = 457 //创建短信发送计划
	FUNC_ID_SERVER_SMS_STATUS        = 458 //获取短信发送状态
	FUNC_ID_SERVER_SMS_FEEDBACK      = 459 //获取短信回复
	FUNC_ID_SERVER_SMS_SEND_STABLE   = 460 //发送即时短信
	FUNC_ID_SERVER_SMS_COUNT_SET     = 461 //更新用户短信条数

	FUNC_ID_CLINIC_STATISTICS_ADD = 462 //添加诊所运行统计

	FUNC_ID_SERVER_COMMUNICATE_ADD     = 471 // 添加医患沟通资源
	FUNC_ID_SERVER_COMMUNICATE_CONFIRM = 472 // 审批医患沟通资源
	FUNC_ID_SERVER_COMMUNICATE_MOD     = 473 // 修改医患沟通资源
	FUNC_ID_SERVER_COMMUNICATE_DEL     = 474 // 删除医患沟通资源
	FUNC_ID_SERVER_COMMUNICATE_GET     = 475 // 获取医患沟通资源
	FUNC_ID_SERVER_COMMUNICATE_ACCOUNT = 476 // 播放视频记数
	//视频
	FUNC_ID_SERVER_VIDEO_GET = 477 // 获取视频资源

	FUNC_ID_SERVER_SEARCH_DOCTOR        = 491 // 搜索医生
	FUNC_ID_SERVER_SEARCH_CLINIC        = 492 // 搜索诊所
	FUNC_ID_SERVER_SEARCH_DOCTOR_BIND   = 493 //获取内诊所里的有绑定飞熊用户的医生
	FUNC_ID_SERVER_SEARCH_DOCTOR_CLINIC = 494 // 获取医生的诊所信息
	FUNC_ID_SERVER_COVER_GET            = 495 //获取活动封面信息
	FUNC_ID_GET_QRCODE                  = 496 //获取二维码
	FUNC_ID_GET_CLINICID_BY_DENTAL      = 497 //获取诊所ID
	//PC端web网页登录,需要医生有云端账号
	FUNC_ID_DOC_BIND_MOBILE_PC  = 498 //PC端的医生绑定手机号
	FUNC_ID_DOC_CHECK_MOBILE_PC = 499 //PC端医生获取云端账号
	// 维护
	FUNC_ID_CHAT_MANAGE_CHECK_DATA = 601
	FUNC_ID_MANAGE_DICTIONARY_DATA = 602

	//app抽奖营销活动
	FUNC_ID_ADD_LOTTERY_ACTIVITY        = 621 //增加活动
	FUNC_ID_GET_LOTTERY_ACTIVITY        = 622 //获取活动信息
	FUNC_ID_LOTTERY                     = 623 //抽奖动作
	FUNC_ID_GET_LOTTERY_INFO            = 624 //获取中奖信息
	FUNC_ID_COMPLETE_LOTTERY_INFO       = 625 //完善中奖信息
	FUNC_ID_CONFIRM_LOTTERY_INFO        = 626 //确认中奖信息
	FUNC_ID_PARSE_CODE_URL              = 631 //解析二维码URL
	FUNC_ID_USER_SIGN_LOTTERY           = 632 //用户签到
	FUNC_ID_USER_SIGN_SHARE_LOTTERY     = 633 //用户签到分享有礼
	FUNC_ID_USER_SIGN_SHARE_RECEIVE     = 634 //签到分享领取
	FUNC_ID_USER_SIGN_SHARE_LOTTERY_NEW = 635 //签到分享领取,将验证码的校验直接和奖品领取在一起

	//图像
	FUNC_ID_ECHO = 901 //echo

	FUNC_ID_SAVE_CLINICINFO  = 902 //保存诊所信息
	FUNC_ID_SAVE_VERSIONINFO = 904 //保存版本信息

	FUNC_ID_SAVE_VERSION_LOG = 906 //保存版本更新记录

	FUNC_ID_SAVE_FEEDBACK = 908 //保存反馈记录

	FUNC_ID_GET_FILELIST = 910 //获取日志文件列表
	//诊所和app影像同步
	FUNC_ID_ADD_SYNC_IMAGE  = 911 //新建图像同步的任务
	FUNC_ID_LOAD_SYNC_IMAGE = 912 //获取需要同步的图像

	FUNC_ID_SAVE_CLINIC_IPADDR = 913 //保存诊所服务器IP地址
	FUNC_ID_GET_CLINIC_IPADDR  = 914 //根据诊所GUID获取诊所服务器IP

	FUNC_ID_GET_LATEST_VERSION = 915 //获取最新版本信息
	FUNC_ID_GET_UPDATE         = 916 //获取更新信息

	FUNC_ID_SAVE_LOGIN_LOG = 917 //保存登录记录

	FUNC_ID_SAVE_UNINSTALL_LOG = 918 //保存卸载记录

	FUNC_ID_SAVE_SENDFLYBEAR = 920 //生成导入koala数据到云端的任务

	FUNC_ID_UPLOAD_FILE            = 923 //上传文件的记录
	FUNC_ID_MERGE_FILE             = 924 //合并文件（上传大文件时，先上传切割的文件，再合并成一个文件）
	FUNC_ID_LOAD_IMAGE             = 925 //获取顾客影像uid
	FUNC_ID_LOAD_OSSKEY            = 926 //获取阿里云参数
	FUNC_ID_PROCESS_SYNCIMAGE      = 927 //用于任务管理处理APP提交的图像
	FUNC_ID_SET_SYNC_IMAGE         = 928 //保存图像同步的任务
	ABORT_FUNC_ID_SAVE_SYNC_IMAGE  = 929 //（旧版本）新建图像同步的任务
	FUNC_ID_QUERY_SOFT_VERSIONINFO = 930 //查询版本信息
	FUNC_ID_SAVE_SOFT_VERSIONINFO  = 931 //版本包上传阿里云服务器后更新数据库
	FUNC_ID_GET_IMAGE_CHAIN        = 932 //获取获取连锁店患者的图像索引
	FUNC_ID_SAVE_VERSIONUPDATE     = 933 //保存版本更新信息

	//!1700 - 1799 支付宝接口
	FUNC_ID_ALI_FOLLOW_LIST_GET       = 1700 //支付宝获取关注者列表
	FUNC_ID_ALI_OPEN_TEMP_MSG_GET     = 1701 //获取消息模板
	FUNC_ID_ALIPAY_SYSTEM_OAUTH_TOKEN = 1702 //根据code获取用户信息
	FUNC_ID_ALI_PUBLIC_MENU_CREATE    = 1703
	FUNC_ID_ALI_APP_KEYS_GET          = 1704 //根据APPID获取相关密钥
	FUNC_ID_ALI_OPEN_AUTH_TOKEN_APP   = 1705 //根据授权获取授权信息
	FUNC_ID_ALI_OPEN_MSG_SEND         = 1710 //发送模板消息

	////////////////////APP支付宝支付///////////////////////////
	FUNC_ID_APPALI_CREATEORDER = 1720 //APP端生成支付宝请求订单

	FUNC_ID_APPALI_QUERYORDER = 1721 //APP端查询支付宝订单状态

	FUNC_ID_APPALI_ORDERMANAGE = 1722 //支付宝后台订单轮询

	/////////////////////////////////////////////////////////////////

	FUNC_ID_ALI_TADE_PRECREATE      = 1750 //提交支付宝获取支付二维码请求
	FUNC_ID_ALI_ORDER_QUERY         = 1751 //获取支付宝订单支付情况管理
	FUNC_ID_ALI_ORDER_MANAGE        = 1752 //支付宝订单管理
	FUNC_ID_ALI_TRAD_PAY            = 1753 //提交支付宝授权码支付请求
	FUNC_ID_ALI_TRADER_REFUND_MANGE = 1754 //支付宝退款管理
	FUNC_ID_ALI_ORDER_REFUND        = 1755 //提交退款订单
	FUNC_ID_ALI_ODER_STATE_GET      = 1756 //获取支付宝支付订单详情
	FUNC_ID_ALI_REFUND_STATE_GET    = 1757 //获取支付宝退款订单详情
	//GetImageTableIndex
	FUNC_ID_GET_IMG_TAB_INDEX         = 1800 //获取图像列表的标记
	FUNC_ID_CUSTOMER_SERVICE_REGISTER = 1810 //管理窗口注册修改客服用户信息
	FUNC_ID_CUSTOMER_SERVICE_LOGIN    = 1811 //客服用户登录
	FUNC_ID_CUSTOMER_SERVICE_MOD      = 1812 //修改客服用户信息
	FUNC_ID_DENTAL_SHOP_INFO_GET      = 1850 //获取商城订单信息
	FUNC_ID_PAD_UNIONID_CREATE        = 1851 //生成PAD序列号
	FUNC_ID_ELEVEN_UNIONID_CREATE     = 1852 //生成11位唯一ID
	FUNC_ID_DENTAL_SHOP_BEE_GET       = 1853 //获取商城优惠券

	//!1900-1997 微信接口事件
	FUNC_ID_GET_HASH_ID                 = 1900 //!获取诊所hash数据库id
	FUNC_ID_WEIXIN_VERIFY               = 1901 //微信手机绑定获取验证码
	FUNC_ID_WX_FUNC                     = 1902 //weixinAPI类的外接接口
	FUNC_ID_WX_CALLBACK                 = 1903 //微信回调接口
	FUNC_ID_WX_GET_OAUTH                = 1904 //微信获取OAUTH相关信息
	FUNC_ID_WEIXIN_CREATE_QR_BY_PARAMS  = 1905 //根据输入的qrinfo和filename生成二维码，返回二维码地址。
	FUNC_ID_WEIXIN_MSG_TODAY            = 1906 //医生端微信每日提醒计划的配置信息
	FUNC_ID_WEIXIN_BIND_WECHAT_KUSER_PC = 1907 //PC端问诊平台直接绑定微信和koala用户接口
	FUNC_ID_WEIXIN_CHECK_STATUS         = 1908 //pc端根据诊所ID判断对接公众号和商户号是否第三方。
	FUNC_ID_WEIXIN_VERIFY_CHECK         = 1911 //微信手机绑定验证验证码
	FUNC_ID_WX_COMPONET_CALLBACK        = 1912 //微信授权回调
	FUNC_ID_WX_COMPONET_PREAUTHCODE_GET = 1913 //获取微信预授权
	FUNC_ID_WX_CANCEL_NETSCHEDULE       = 1914 //取消微信预约
	//1920-1939 微信支付接口
	FUNC_ID_WEIXIN_MCH_QR_GET       = 1920 //获取支付二维码接口
	FUNC_ID_WEIXIN_MCH_PAY_STAT_GET = 1921 //获取支付状态
	FUNC_ID_WEIXIN_MCH_PAY_INFO_SET = 1922 //微信发送过来的支付通知消息处理
	FUNC_ID_WEIXIN_MICRO_PAY_SET    = 1923 //刷卡支付

	FUNC_ID_WEIXIN_PAY_MANAGE         = 1924 //数据管理获取微信支付的信息
	FUNC_ID_WEIXIN_COMMIT_ORDER_PC    = 1925 //PC端提交微信支付订单
	FUNC_ID_WEIXIN_GET_ORDER_PC       = 1926 //PC端获取微信订单信息
	FUNC_ID_WEIXIN_USER_SUM_GET       = 1927 //获取微信的用户统计数据
	FUNC_ID_WEIXIN_RED_PACK_SEND      = 1928 //发送微信红包
	FUNC_ID_WEIXIN_REDPACK_BY_SUBSRIB = 1929 //提交微信扫码活动红包

	////////////////////APP微信支付接口///////////////////////////////
	FUNC_ID_WEIXIN_COMMIT_ORDER_APP    = 1930 //APP端提交预支付订单生成请求
	FUNC_ID_WEIXIN_MSG_SEND_ORDERQUERY = 1931 //后台发送微信查询信息
	FUNC_ID_WINXIN_QUERY_ORDER_APP     = 1933 //APP端查询微信订单支付状态
	FUNC_ID_WEIXIN_REDPACK_COMMIT      = 1934 //直接提交微信红包进行发放
	FUNC_ID_WEIXIN_REDPACK_MANAGE      = 1935 //红包发送接口
	FUNC_ID_WEIXIN_REDPACK_QUERY       = 1936 //红包发送情况查询

	FUNC_ID_WALLECTRECHARGE_ITEM = 1940 //获取钱包充值子项
	FUNC_ID_WALLECT_CONSUME      = 1941 //钱包消费行为
	FUNC_ID_WALLECTRECHARGE_LIST = 1942 //钱包充值记录列表
	FUNC_ID_WALLECT_CONSUME_LIST = 1943 //钱包消费纪录列表

	FUNC_ID_PURCHASEPAY_COMMITORDER = 1944 //内购订单提交
	FUNC_ID_PURCHASEPAY_QUERYORDER  = 1945 //内购订单查询
	FUNC_ID_PURCHASEPAY_LIST        = 1946 //内购钱包流水
	FUNC_ID_GET_PURCHASEPAY         = 1947 //内购钱包余额

	FUNC_ID_QUERY_PURCHASEPAY_MANAGE = 1948 //后台管理内购订单

	////////////////////////////////////////
	FUNC_ID_WEIXIN_SUM_DATE_GET   = 1957 //获取按照天数计算的微信用户统计数量
	FUNC_ID_WEIWEB_SERVICES_CHECK = 1958 //删除本地数据库没有额微网站收费项目
	FUNC_ID_WEIWEB_DOCTORS_CHECK  = 1959 //删除本地数据库没有的网站医生
	FUNC_ID_WEIWEB_DOCTOR_ADD     = 1960 //插入微网站医生
	FUNC_ID_WEIWEB_DOCTOR_MOD     = 1961 //修改微网站医生
	FUNC_ID_WEIWEB_DOCTOR_DEL     = 1962 //删除微网站医生
	FUNC_ID_WEIWEB_DOCTOR_GET     = 1963 //获取微网站医生

	FUNC_ID_WEIWEB_SERVICE_ADD = 1964 //插入微网站收费项目
	FUNC_ID_WEIWEB_SERVICE_MOD = 1965 //修改微网站收费项目
	FUNC_ID_WEIWEB_SERVICE_DEL = 1966 //删除微网站收费项目
	FUNC_ID_WEIWEB_SERVICE_GET = 1967 ///获取微网站收费项目

	FUNC_ID_WEIXIN_LOAD_SUBSCRIBE     = 1968 //获取微信新关注顾客信息
	FUNC_ID_WEIXIN_LOAD_USER_INFO     = 1969 //获取微信用户信息
	FUNC_ID_WEIXIN_MSG_LOAD_U2C       = 1970 //微信问诊，用户到诊所
	FUNC_ID_WEIXIN_MSG_LOAD_C2U       = 1971 //微信问诊，诊所到用户
	FUNC_ID_WEIXIN_MSG_SAVE_C2U       = 1972 //发送微信信息
	FUNC_ID_WEIXIN_MSG_SEND_C2U       = 1973 //发送微信信息到微信服务器
	FUNC_ID_WXMSG_C2U_GET_PHONE       = 1974 //手机端微信问诊，诊所到用户
	FUNC_ID_WXMSG_U2C_GET_PHONE       = 1975 //手机端微信问诊，用户到诊所
	FUNC_ID_WX_USERINFO_GET_PHONE     = 1976 //手机端最近联系微信用户信息
	FUNC_ID_WXMSG_GET_PHONE           = 1977 //手机端加载信息
	FUNC_ID_WXMSG_SAVE_C2U_PHONE      = 1978 //手机端发送微信消息,诊所到用户
	FUNC_ID_WXMSG_PUSH_PHONE          = 1979 //手机端消息推送
	FUNC_ID_WEIXIN_SAVE_SYSTEM_NOTIFY = 1980 //提交管家提醒
	FUNC_ID_WEIXIN_GET_SERVERTIME     = 1981 //获取系统时间
	FUNC_ID_WEIXIN_SEND_SYSTEM_NOTIFY = 1982 //发送管家提醒
	FUNC_ID_WEIXIN_OTHER_QR_CODE      = 1983 //获取诊所文章或者活动二维码
	FUNC_ID_WEIXIN_MSG_SEND_TEMP      = 1994 //!自动推送消息接口
	FUNC_ID_WEIXIN_MSG_SAVE_TEMP      = 1995 //!推送消息模板接口
	FUNC_ID_WEIXIN_QR_CODE            = 1996 //!获取微信二维码
	FUNC_ID_WEIXIN_SCAN               = 1997 //!微信扫码事件
	//!异步处理发送短信
	FUNC_ID_SMS_SEND_IN_PLAN = 1998 //!根据t_sms_send表中的信息发送相应的短信
	//!导入ip对应地理城市专用
	FUNC_ID_GET_POS_BY_IP = 1999 //根据Log中的IP将地理位置导入的ipcitytable表中
	//异步处理任务的命令范围 2000-2500
	FUNC_ID_CHAIN_IMPORT_CUSTOMER = 2001 //诊所的顾客导入到连锁店中

	//与口腔88的交换命令2600-2700
	FUNC_ID_KQ88_LOGIN       = 2601 //口腔88的登录验证
	FUNC_ID_KQ88_IMPORT_DATA = 2602 //导入口腔88的课程列表
	FUNC_ID_KQ88_INFO_ADD    = 2603 //手动提交资讯内容

	//与商城交互的接口2701-2999
	FUNC_ID_MALL_CLINIC_GET       = 2701 //获取诊所信息列表
	FUNC_ID_MALL_CLINICINFO_GET   = 2702 //获取诊所信息
	FUNC_ID_MALL_WX_USER_INFO_GET = 2703 //根据传入的商城用户ID获取用户的微信信息

	FUNC_ID_SCHEDULE_GET_PC                      = 3000 //查询预约
	FUNC_ID_CLINIC_DOCTOR_DEL_PC                 = 3001 //诊所删除医生
	FUNC_ID_HISTORY_STUDY_SET_PC                 = 3002 //新增就诊信息
	FUNC_ID_HISTORY_STUDY_GET_PC                 = 3003 //获取就诊信息
	FUNC_ID_HISTORY_MEDIARECORD_SET_PC           = 3004 //新增病历
	FUNC_ID_HISTORY_MEDIARECORD_GET_PC           = 3005 //获取病历
	FUNC_ID_HISTORY_VISIT_SET_PC                 = 3006 //新增回访
	FUNC_ID_HISTORY_VISIT_GET_PC                 = 3007 //获取回访
	FUNC_ID_HISTORY_BILL_SET_PC                  = 3008 //新增帐单
	FUNC_ID_HISTORY_BILL_GET_PC                  = 3009 //获取账单
	FUNC_ID_HISTORY_HANDLE_SET_PC                = 3010 //新增处置
	FUNC_ID_HISTORY_HANDLE_GET_PC                = 3011 //获取处置信息
	FUNC_ID_CLINIC_CUSTOMER_GET_PC               = 3012 //获取Koala患者
	FUNC_ID_SCHEDULE_SET_PC                      = 3013 //新增预约
	FUNC_ID_CHAIN_SCHEDULE_GET_PC                = 3014 //连锁店获取预约
	FUNC_ID_CLINIC_CUSTOMER_SET_PC               = 3015 //新增Koala患者
	FUNC_ID_CLINIC_SET_USERINFO_PC               = 3016 //保存诊所信息
	FUNC_ID_CLINIC_GET_USERINFO_PC               = 3017 //获取诊所信息
	FUNC_ID_CLINIC_UPDATE_PATGROUP_PC            = 3018 //批量修改患者分组，修改或删除分组时调用
	FUNC_ID_CLINIC_SET_DICTIONARY_PC             = 3019 //PC端保存字典信息
	FUNC_ID_CLINIC_UPDATE_PATGROUP_PC_NEW        = 3020 //新的 批量修改患者分组，修改或删除分组时调用
	FUNC_ID_DATA_BINDDATA_DEL_PC                 = 3021 //用户解绑数据
	FUNC_ID_WEIXIN_BIND_GET_PC                   = 3022 //获取诊所内医生关联的微信信息
	FUNC_ID_SET_USERGROUP_PC                     = 3023 //保存诊所内用户权限
	FUNC_ID_CLINIC_DOCTOR_SET_PC                 = 3024 //诊所新增医生
	FUNC_ID_CLINIC_SYSCONFIG_PC                  = 3025 //PC端同步预约日程起止时间
	FUNC_ID_CLINIC_GET_DICTIONARY_PC             = 3026 //PC端获取字典信息
	FUNC_ID_SCHEDULE_STATUS_SET_PC               = 3027 //设置预约状态
	FUNC_ID_SCHEDULE_DAY_COUNT_PC                = 3028 //按照时间范围返回每一天预约患者个数
	FUNC_ID_CHAIN_SCHEDULE_MONTH_GET_PC          = 3029 //连锁店获取月预约
	FUNC_ID_SCHEDULE_SELECT_GET_PC               = 3030 //连锁店的条件查询
	ABORT_FUNC_ID_GROUP_INFO_GET_PC              = 3031 //医生获取分组信息
	ABORT_FUNC_ID_SCHEDULE_DEL_PC                = 3032 //预约回收站操作
	ABORT_FUNC_ID_NETSCHEDULE_SELECT_PC          = 3033 //查询网络预约
	ABORT_FUNC_ID_NETSCHEDULE_UPDATE_PC          = 3034 //修改网络预约
	ABORT_FUNC_ID_NEWSCHEDULE_SHOWPATIENT        = 3035 //显示类似患者
	ABORT_FUNC_ID_CONSULT_GET_PC                 = 3036 ///获取网电信息
	ABORT_FUNC_ID_CONSULT_SET_PC                 = 3037 //新增修改删除网电信息
	ABORT_FUNC_ID_ALLMSG_SET_PC                  = 3038 //新增修改网点电，预约和回访还有患者信息，全套信息了
	ABORT_FUNC_ID_ALLMSG_GET_PC                  = 3039 //PC端同步网电数据到本地数据库
	ABORT_FUNC_ID_CHAIN_RETURNVISIT_MONTH_GET_PC = 3040 //连锁店获取月回访
	ABORT_FUNC_ID_CHAIN_PATSTUDY_GET_PC          = 3041 //患者首页获取就诊信息
	ABORT_FUNC_ID_CHAIN_RELATIONSHIP_GET_PC      = 3042 //获取患者关系
	ABORT_FUNC_ID_CUSTOMER_INFO_GET_PC           = 3050 //获取分组患者信息
	ABORT_FUNC_ID_CUSTOMER_DETAIL_GET_PC         = 3051 //获取详细患者信息
	ABORT_FUNC_ID_RETURNVISIT_HANDLE_GET_PC      = 3052 //获取需要回访的处置信息
	ABORT_FUNC_ID_RETURNVISIT_GE_PC              = 3053 //获取回访信息
	ABORT_FUNC_ID_RECOVER_CUSTOMER_MOD_PC        = 3054 //PC端患者删除后，从回收站中恢复
	ABORT_FUNC_ID_RETURNVISIT_CHAINEMR           = 3055 //获取连锁店病历
	ABORT_FUNC_ID_RETURNVISIT_UPDATE             = 3056 //修改或新增回访
	ABORT_FUNC_ID_HANDLEITEM_SET_PC              = 3057 //PC端新增处置项目和修改
	ABORT_FUNC_ID_SMSTEMPLATE_SET_PC             = 3058 //PC端新增短信和微信模板
	FUNC_ID_SAVE_STUDY_IMAGE_PC                  = 3059 //PC端保存检查影像信息
	ABORT_FUNC_ID_GET_STUDY_IMAGE_PC             = 3060 //PC端获取检查影像信息
	ABORT_FUNC_ID_GET_STUDY_VISIT_PC             = 3061 //PC端获取检查回访
	ABORT_FUNC_ID_GET_CUSTOMER_CONSULT_PC        = 3062 //PC端获取咨询信息
	FUNC_ID_GET_MERGE_CUSTOMER_INFO              = 3063 //PC端合并患者
	FUNC_ID_GET_CLINIC_TOKEN_PC                  = 3064 //PC端获取Token
	ABORT_FUNC_ID_GET_CUSTOMER_RELATION_PC       = 3065 //PC端获取咨询信息
	ABORT_FUNC_ID_GET_CUSTOMER_BILLINFO_PC       = 3066 //PC端获取收费信息
	FUNC_ID_GET_CLINIC_TOKEN_VERIFY_PC           = 3067 //PC端通过短信验证码获取Token
	FUNC_ID_STAT_CHAINCLINIC_PC                  = 3068 //PC端连锁店统计某个诊所中数据(收入分类/就诊人数/营业收入/患者来源/收费分类/预约人数/预约项目/预约状态)
	FUNC_ID_DEL_PATIENT_BILL_INFO                = 3069 //PC端重算账单信息时，删除云端对应患者数据(董海滨要求增加)
	FUNC_ID_GET_CLINIC_DEBTS_PC                  = 3070 //获取诊所期初，期末欠款
	FUNC_ID_DELETE_USERGROUP_PC                  = 3071 //删除云端医生权限
	//在患者、医生、回访、预约、处置、检查、病历、账单中新增字段LastOperator字段用来记录，当前数据的最后的操作人
	//PC 表示电脑  APP表示 手机和平板  WEIXIN  表示微信
	//当PC端同步数据的时候，只需要查询LastOperator不等于PC的数据

	//PC端信息上传和下载
	FUNC_ID_SYNC_DATA_PC      = 3211 //PC端提交数据到云端
	FUNC_ID_SYNC_DATA_DOWN_PC = 3212 //PC端下载数据到本地

	FUNC_ID_SYNC_DOWN_DATA_PC = 3213 //PC端下载数据，最新通用接口

	FUNC_ID_VERIFY_DATA = 3214 //校验数据

	FUNC_ID_SYNC_DOWN_DATA_NEW_PC = 3215 //PC端下载数据
	FUNC_ID_SYNC_RESTRORE_INFO    = 3216 //PC端获取需同步的数据信息
	FUNC_ID_SYNC_RESTRORE_DATA    = 3217 //PC端下载需同步的数据
	FUNC_ID_SYNC_ChAIN_ADVANCEPAY = 3218 //连锁店患者的预交款同步到本地

	FUNC_ID_SYNC_CHAIN_SMS_TEMP_PC = 3220 //PC端同步连锁店消息模板
	FUNC_ID_SYNC_CHAIN_EMR_TEMP_PC = 3221 //PC端同步连锁店病例模板

	FUNC_ID_SCHEDULE_GET_PHONE            = 3500 //医生APP查询预约       只有预约信息
	FUNC_ID_CLINIC_DOCTOR_DEL_PHONE       = 3501 //医生APP诊所删除医生
	FUNC_ID_HISTORY_STUDY_SET_PHONE       = 3502 //医生APP新增就诊信息
	FUNC_ID_HISTORY_STUDY_GET_PHONE       = 3503 //医生APP获取就诊信息
	FUNC_ID_HISTORY_MEDIARECORD_SET_PHONE = 3504 //医生APP新增病历
	FUNC_ID_HISTORY_MEDIARECORD_GET_PHONE = 3505 //医生APP获取病历       返回字符串格式
	FUNC_ID_HISTORY_VISIT_SET_PHONE       = 3506 //医生APP新增回访       doctorid是云端的userid
	FUNC_ID_HISTORY_VISIT_GET_PHONE       = 3507 //医生APP获取回访
	FUNC_ID_HISTORY_BILL_GET_PHONE        = 3509 //医生APP获取账单
	FUNC_ID_HISTORY_HANDLE_GET_PHONE      = 3511 //医生APP获取处置信息
	FUNC_ID_CLINIC_CUSTOMER_GET_PHONE     = 3512 //医生APP获取Koala患者
	FUNC_ID_SCHEDULE_SET_PHONE            = 3513 //医生APP新增预约--     doctorid是云端的userid
	FUNC_ID_CLINIC_CUSTOMER_SET_PHONE     = 3515 //医生APP新增患者
	FUNC_ID_GET_GROUP_INFO_PHONE          = 3516 //医生APP获取分组信息
	FUNC_ID_GET_CUSTOMER_BY_GROUP_PHONE   = 3517 //医生APP按分组获取患者信息
	FUNC_ID_SEARCH_CUSTOMER_BY_GROUP      = 3518 //医生APP搜索患者，返回信息按照习惯记录
	FUNC_ID_SCHEDULE_INFO_BY_DAY          = 3519 //医生APP按照时间范围返回每一天预约患者个数
	FUNC_ID_SCHEDULE_SEARCH               = 3520 //医生APP按照条件搜索预约患者

	FUNC_ID_SCHEDULE_FILTER_PHONE             = 3521 //新版app过滤预约
	FUNC_ID_HISTORY_MEDIARECORD_GET_PHONE_NEW = 3522 //医生APP获取病历        返回JSON格式
	FUNC_ID_HISTORY_VISIT_DEL_PHONE           = 3523 //医生APP删除回访
	FUNC_ID_HISTORY_VISIT_MOD_PHONE           = 3524 //医生APP修改回访
	FUNC_ID_HISTORY_MEDIARECORD_DEL_PHONE     = 3525 //医生APP删除病历
	FUNC_ID_HISTORY_MEDIARECORD_MOD_PHONE     = 3526 //医生APP修改病历
	FUNC_ID_CLINIC_CUSTOMER_MOD_PHONE         = 3527 //医生APP修改Koala患者

	FUNC_ID_SCHEDULE_GET_INCREMENT_PHONE = 3528 //医生APP获取预约(增量获取)

	FUNC_ID_GET_CLINIC_QRCODE_PHONE      = 3530 //获取诊所二维码
	FUNC_ID_GET_DOC_VIRTUAL_CLINIC_PHONE = 3531 //获取用户注册过的虚拟诊所
	FUNC_ID_GET_CLINIC_DOC_INFO          = 3532 //获取诊所内医生列表信息

	//----------------------------APP专业版业务统计------------------------------------------
	//app业务统计接口
	FUNC_ID_CLINIC_BUSINESS_GET_PHONE        = 3533 //诊所业绩概要
	FUNC_ID_CLINIC_BUSINESS_DETAIL_GET_PHONE = 3534 //诊所业绩明细
	FUNC_ID_TODAY_JOB_GET_PHONE              = 3535 //今日工作
	FUNC_ID_HISTORY_DEBTS_GET_PHONE          = 3536 //历史欠款
	FUNC_ID_DOCTOR_RANK_GET_PHONE            = 3537 //医生排名
	FUNC_ID_DOCTOR_BUSINESS_GET_PHONE        = 3538 //医生业绩概要
	FUNC_ID_DOCTOR_BUSINESS_DETAIL_GET_PHONE = 3539 //医生业绩明细
	FUNC_ID_POPULAR_PROJECT_GET_PHONE        = 3540 //热门项目
	FUNC_ID_CLINIC_BILLINESS_TYPE_GET_PHONE  = 3541 //诊所业绩类型

	FUNC_ID_TODAY_JOG_GET_SCHEDULE_PHONE = 3542 //预约未到
	FUNC_ID_TODAY_JOB_GET_STUDY_PHONE    = 3543 //待分诊、治疗中、代缴费、已完成、未成交
	FUNC_ID_TODAY_JOB_GET_BIRTH_PHONE    = 3544 //今日生日
	FUNC_ID_DEBTS_DETAIL_PHONE           = 3545 //欠费详情
	//修改影像信息
	FUNC_ID_MODIFY_IMAGE_INFO = 3546 //修改影像(牙位、备注、治疗状态)

	//处置接口
	FUNC_ID_DOC_HANDLESET_MOD_PHONE = 3547 //编辑处置项模板
	FUNC_ID_DOC_DEL_HANDLE_PHONE    = 3548 //删除整条处置
	FUNC_ID_DOC_HANDLESET_GET_PHONE = 3549 //获取处置项目
	FUNC_ID_DOC_HANDLE_GET_PHONE    = 3550 //处置接口

	//病历
	FUNC_ID_DOC_MEDIARECORD_GET = 3551 //获取病历
	FUNC_ID_DOC_MEDIARECORD_SET = 3552 //新增和修改病历

	//处置新增和修改
	FUNC_ID_DOC_HANDLE_ADD = 3553 //新增处置
	FUNC_ID_DOC_HANDLE_MOD = 3554 //修改处置
	//收费
	FUNC_ID_DOC_BILL_GET_PHONE         = 3560 //收费接口
	FUNC_ID_DOC_BILL_DETAIL_GET_PHONE  = 3561 //收费详细
	FUNC_ID_DOC_BILL_HISTORY_GET_PHONE = 3562 //收费历史
	//患者资料
	FUNC_ID_DOC_CUSTOMER_INFO_GET_PHONE = 3570 //患者资料
	FUNC_ID_DOC_TRIAGE_DOCT_GET_PHONE   = 3571 //分诊医生列表
	FUNC_ID_DOC_TRIAGE_STUDY_PHONE      = 3572 //患者分诊
	FUNC_ID_DOC_CUSTOMER_ADD_PHONE      = 3573 //新增患者
	//患者分组和患者信息
	FUNC_ID_DOC_GET_GROUP_INFO_PHONE        = 3574 //医生APP获取分组信息
	FUNC_ID_DOC_GET_CUSTOMER_BY_GROUP_PHONE = 3575 //医生APP按分组获取患者信息
	FUNC_ID_DOC_SEARCH_CUSTOMER_BY_GROUP    = 3576 //医生APP搜索患者，返回信息按照习惯记录
	FUNC_ID_DOC_FILTER_CUSTOMER             = 3577 //搜索患者，按照复诊时间、患者类型、会员等级、用户
	FUNC_ID_DOC_GET_CUSTOMER_INFO           = 3578 //获取koala患者
	FUNC_ID_DOC_GET_CUSTOMER_INTRODUCTION   = 3579 //获取koala患者概要信息
	//回访
	FUNC_ID_DOC_VISIT_INFO_GET_PHONE   = 3580 //获取回访
	FUNC_ID_DOC_VISIT_SET_PHONE        = 3581 //新增回访
	FUNC_ID_DOC_VISIT_GET_NUM_PHONE    = 3582 //获取回访数量
	FUNC_ID_DOC_VISIT_DETAIL_GET_PHONE = 3583 //获取回访详情
	//预约
	FUNC_ID_DOC_SCHEDULE_GET_LIST_NEW_PHONE = 3588 //获取预约列表新接口，要返回DataStatus
	FUNC_ID_SCHEDULE_BY_DAY                 = 3589 //获取每一天预约的数量
	FUNC_ID_DOC_SCHEDULE_GET_LIST_PHONE     = 3590 //获取预约列表
	FUNC_ID_DOC_SCHEDULE_GET_DETAIL_PHONE   = 3591 //获取预约详情
	FUNC_ID_DOC_SCHEDULE_SET_PHONE          = 3592 //新增预约
	FUNC_ID_DOC_SCHEDULE_MOD_NEW            = 3593 //修改预约

	FUNC_ID_DOC_SHARE_ARTICLE   = 3594 //分享文章(点赞)
	FUNC_ID_DOC_HAVE_WEBSITE    = 3595 //是否开通微官网
	FUNC_ID_DOC_GET_EMRTEMPLATE = 3596 //获取病历模板树结构
	FUNC_ID_DOC_GET_EMR_INFO    = 3597 //获取病历模板内容
	//---------------------------------------APP标准版业务统计----------------------------------------------------
	//业务接口
	//今日工作
	FUNC_ID_DOC_STANDARD_CLINIC_SUMMARY = 3600 //获取诊所实际业绩概要

	FUNC_ID_DOC_STANDARD_TODAY_LIST   = 3601 //获取专业和标准版中今日工作中列表
	FUNC_ID_DOC_STANDARD_TODAY_DETAIL = 3602 //获取今日工作中的患者列表

	FUNC_ID_STANDARD_CLINIC_BUSINESS_DETAIL = 3603 //诊所业绩明细
	FUNC_ID_STANDARD_CLINIC_BILLINESS_TYPE  = 3604 //诊所业绩类型
	FUNC_ID_STANDARD_DOCTOR_RANK            = 3605 //医生排名
	FUNC_ID_STANDARD_POPULAR_PROJECT        = 3606 //热门项目
	FUNC_ID_STANDARD_DOCTOR_BUSINESS        = 3607 //医生业绩概要
	FUNC_ID_STANDARD_DOCTOR_BUSINESS_DETAIL = 3608 //医生业绩明细

	//----------------------------------------------------------------------------------------------------
	//营销的接口
	FUNC_ID_DOC_ARTICLE_CHANNEL_GET = 3610 //营销通道
	FUNC_ID_DOC_ARTICLE_GET         = 3611 //营销内容

	//---------------------------------------------------简易版业务统计------------------------------------
	FUNC_ID_DOC_SIMPLE_CLINIC_SUMMARY = 3615 //业务统计接口

	//PAD权限分配和校验
	FUNC_ID_CLINIC_BIND_PAD    = 3620 //诊所绑定PAD
	FUNC_ID_VERIFY_PAD_ID      = 3621 //验证PADID是不是合法授权的
	FUNC_ID_DISTRIBUTION_TOKEN = 3622 //登录分配Token
	FUNC_ID_VERIFY_TOKEN       = 3623 //验证TOKEN是否已经被顶掉

	//---------------------------------
	//app收费接口--标准版六种收费方式
	//---------------------------------

	//////////////////不启动划价//////////////////
	///////////////////共用接口///////////////////
	FUNC_ID_CHARGE_DETAIL_LIST         = 3630 //收费明细列表
	FUNC_ID_CHARGE_LASTDEBTS_GET_PHONE = 3631 //收费时，获取上次欠费
	FUNC_ID_CHARGE_TYPE_LIST           = 3632 //收费分类列表
	FUNC_ID_CHARGE_REFUND_PHONE        = 3633 //退费
	FUNC_ID_CHARGE_CHANNEL_PHONE       = 3634 //收费通用通道
	FUNC_ID_CHARGE_MODIFY_STATE_PC     = 3635 //PC修改数据处理状态
	FUNC_ID_CHARGE_DOWN_DATA_PC        = 3636 //PC端下载数据到本地进行处理
	//咨询
	FUNC_ID_CONSULT_SET_PHONE = 3640 //添加咨询
	FUNC_ID_CONSULT_GET_PHONE = 3641 //获取咨询
	FUNC_ID_CONSULT_DEL_PHONE = 3642 //删除咨询

	//预交款
	FUNC_ID_ADVANCE_PAY_SET_PHONE = 3650 //添加预交款
	FUNC_ID_ADVANCE_PAY_GET_PHONE = 3651 //获取预交款

	////////////LX////////////
	FUNC_ID_QUERY_ADVPAYRECORDSNUM    = 3644 //查询时获取所有的记录数
	FUNC_ID_GET_ADVPAY_TOTALNUM       = 3645 //获取总记录数
	FUNC_ID_ADVANCE_PAY_GET_CHAINGUID = 3646 //获取连锁ID
	FUNC_ID_STATIS_CLINICADVANCEPAY   = 3647 //诊所预交款统计
	FUNC_ID_MODIFY_ADVANCEPAY         = 3648 //预交款修改
	FUNC_ID_CANCLECHECK_ADVANCEPAY    = 3649 //取消审核
	FUNC_ID_CONTROL_ADVANCEPAY        = 3652 //预交款操作
	FUNC_ID_GET_ONE_ADVANCE_PAY       = 3653 //获取某个用户预交款余额
	FUNC_ID_GET_CHAIN_ALLCUSTOMER     = 3654 //获取所有连锁店的所有患者信息
	FUNC_ID_GET_ADVANCE_PAY_NUM       = 3655 //获取指定患者预交款余额和流水
	FUNC_ID_COMBINE_ADVANCEPAY        = 3656 //预交款合并
	FUNC_ID_CHECK_ADVANCEPAY          = 3657 //预交款审核
	FUNC_ID_QUERY_CHAINADVANCEPAY     = 3658 //获取所有预交款流水
	FUNC_ID_STATIS_ADVANCEPAY         = 3659 //XS
	FUNC_ID_LOAD_CHAINPAYSTYLE        = 3680 //连锁店支付方式查询
	FUNC_ID_SAVE_CHAINPAYSTYLE        = 3681 //连锁店支付方式维护

	////////////////////

	//排班
	FUNC_ID_WORKSHIFT_SET_PHONE      = 3660 //添加修改排班医生
	FUNC_ID_WORKSHIFT_GET_PHONE      = 3661 //获取排班医生
	FUNC_ID_WORKSHIFT_TYPE_GET_PHONE = 3662 //获取排班类型
	//app微信预约
	FUNC_ID_NET_SCHEDULE_GET_PHONE     = 3670 //获取网络预约
	FUNC_ID_CANCEL_SCHEDULE_PHONE      = 3671 //取消网络预约
	FUNC_ID_CONFIRM_NET_SCHEDULE_PHONE = 3672 //确认网络预约
	//app社区
	FUNC_ID_FOLLOW_PLATE_PHONE   = 3700 //关注版块
	FUNC_ID_UNFOLLOW_PLATE_PHONE = 3701 //取消关注版块
	FUNC_ID_GET_PLATE_PHONE      = 3702 //获取版块列表

	//app V3.4.0版本新增功能
	FUNC_ID_SEARCH_SCHEDULE_PHONE = 3703 //搜索预约
	FUNC_ID_SEARCH_VISIT_PHONE    = 3704 //搜索回访

	//app权限共享
	FUNC_ID_SET_SHARE_RIGHT    = 3721 //添加共享权限将SenderID的权限共享给ReciverID
	FUNC_ID_GET_SHARE_RIGHT    = 3722 //获取共享给的用户或共享给我的用户
	FUNC_ID_CANCLE_SHARE_RIGTH = 3723 //取消共享

	//app模板消息
	FUNC_ID_SMSTEMPLATE_SET            = 3730 //医生APP添加模板(修改模板和节点)
	FUNC_ID_SMSTEMPLATE_GET            = 3731 //医生APP获取模板内容
	FUNC_ID_GET_CHAIN_ADVANCEPAY_STATE = 3732 //查询整个连锁店预交款是否都导入完毕
	FUNC_ID_GET_VIPSHARE               = 3733 //会员卡详情(主卡,副卡(被共享卡))
	FUNC_ID_GET_VIPLIST                = 3734 //会员卡共享列表
	FUNC_ID_GET_VIPSHARELIST           = 3735 //会员卡交易流水

	//////////////////////////李享////////////////////////

	//牙医管家后台信息
	FUNC_ID_ENTER_COLLAGE     = 3740 //APP用户从首页点击学院
	FUNC_ID_COLLECTCOURSE     = 3741 //收藏课程
	FUNC_ID_ENTER_CHANNEL     = 3743 //频道入口和猜你喜欢
	FUNC_ID_COLLOGE_COURSE    = 3744 //学院界面中点击“课程”按钮，进入课程预告列表
	FUNC_ID_TEACHERTEAMLIST   = 3745 //教师团队列表
	FUNC_ID_TEACHERCOURSELIST = 3746 //讲师课程列表
	FUNC_ID_LOADCOURSE        = 3748 //下载课程
	FUNC_ID_ADD_TEACHER       = 3749 //添加讲师并绑定到APP医生账户
	FUNC_ID_GET_TEACHER       = 3750 //提取教师信息
	FUNC_ID_SET_TEACHER       = 3751 //修改讲师信息

	FUNC_ID_ORGANIZA_DETIAL = 3765 //机构详情
	FUNC_ID_TEACHER_DETIAL  = 3770 //讲师详细信息

	FUNC_ID_CURSE_PLAY         = 3803 //课程播放
	FUNC_ID_ADDMYSELF          = 3804 //课程浏览人数自增
	FUNC_ID_MY_COURSE          = 3805 //获取我的课程信息
	FUNC_ID_MY_COLLECTCOURSE   = 3807 //获取我的收藏信息
	FUNC_ID_MY_VIEWHISTORY     = 3809 //获取观看历史信息
	FUNC_ID_FEEDBACK           = 3810 //提交意见反馈
	FUNC_ID_WRITEVIEWHISTORY   = 3811 //写入、更新观看历史纪录
	FUNC_ID_UPDATAADBROWSENUM  = 3812 //更新预告课程的浏览人数
	FUNC_ID_LOADPATBYTEL       = 3813 //来电时根据电话号码搜寻连锁店患者信息
	FUNC_ID_FACECONSULT_SET_PC = 3814 //保存咨询沟通
	FUNC_ID_GET_H5_SHAREDATA   = 3815 //获取h5分享页面课程信息

	//支付外部调用的命令范围：4001-4100
	FUNC_ID_PAY_PUBLIC_MIN = 4000
	FUNC_ID_PAY_PUBLIC_MAX = 4099

	FUNC_ID_PAY_COMMIT_ORDER    = 4002 //提交订单
	FUNC_ID_PAY_COMPLETE_PAY    = 4006 //完成付款
	FUNC_ID_PAY_REFUND_ORDER    = 4007 //申请退单
	FUNC_ID_PAY_CASHOUT         = 4008 //取现
	FUNC_ID_PAY_COMPLETE_REFUND = 4010 //完成退单

	//支付内部调用的命令范围：4101-4199
	FUNC_ID_PAY_PRIVATE_MIN = 4100
	FUNC_ID_PAY_PRIVATE_MAX = 4199

	//微信服务号功能命令范围(编号区段只用于统计,无须具体命令号对应函数实现)
	FUNC_ID_WEIXIN_SERVICE_MIN = 4200
	FUNC_ID_WEIXIN_SERVICE_MAX = 4299
	/*
	   [微官网]
	   4200	//微网站首页
	   4201	//医生团队
	   4202	//治疗项目
	   4203	//预约
	   4204	//地图
	   4205	//诊所活动
	   4206	//口腔百科
	   4220	//诊所介绍
	    [我的中心]
	    4207	//预交款
	    4208	//账单
	    4209	//预约
	    4210	//医嘱
	    4211	//图像
	    4221	//我的中心首页
	    [今日工作]
	    4215	//今日工作
	    [业务统计]
	    4212	主任当天统计
	    4213	主任当月统计
	    4214   医生当月统计
	    4216   医生当天统计
	*/
	//医患沟通的视频接口
	FUNC_ID_CATEGORY_GET             = 5000 ////获取医患沟通目录列表
	FUNC_ID_CATEGORY_SET             = 5001 //用于对目录树的结点增改
	FUNC_ID_EDU_VIDEO_GET_BYID       = 5002 //获取对应目录id的文件名(PAD)
	FUNC_ID_EDU_VIDEO_DELETE         = 5003 //用于对目录树的结点删除
	FUNC_ID_EDU_VIDEO_COUNTER        = 5004 //播放时用于计数的(PAD)
	FUNC_ID_EDU_VIDEO_SET            = 5005 //保存视频文件信息
	FUNC_ID_EDU_VIDEO_CHECKNEWFILE   = 5006 //检查视频文件有没有新的(根据时间戳)(PAD)
	FUNC_ID_EDU_VIDEO_CHECK_PROPERTY = 5007 //校验机器码标识录入
	FUNC_ID_EDU_VIDEO_GET_MANAGE     = 5008 //数据维护时获取视频列表
	FUNC_ID_EDU_VIDEO_DEL            = 5009 //删除视频信息
	FUNC_ID_EDU_VIDEO_GET_PC         = 5010 //PC端获取医患沟通视频列表
	FUNC_ID_EDU_VIDEO_GET_AUTH_PC    = 5011 //PC端获取医患沟通视频的权限
	FUNC_ID_EDU_VIDEO_SET_AUTH       = 5012 //设置诊所已购买的医患沟通视频（给商城调用）
	FUNC_ID_EDU_GET_AUTH             = 5013 //PC端获取已购买的医患沟通视频列表

	//移动新命令范围：6000-7000
	FUNC_ID_PHONE_PAD_MIN = 6000
	FUNC_ID_PHONE_PAD_MAX = 7000

	//手机命令专区 6000---6500
	FUNC_ID_PHONE_CHANGE_MOBILE_REQUEST = 6001 //医生APP获取手机号的验证码
	FUNC_ID_PHONE_CHAGE_MOBILE_SUBMIT   = 6002 //医生APP修改用户的手机号,如果已经存在对应的手机号用户，需将对应的账号信息合并到当前账号
	FUNC_ID_PHONE_SCHEDULE_TIME_GET     = 6003 //医生APP手机获取日程时刻
	FUNC_ID_PHONE_SEARCH_VISIT          = 6004 //医生APP搜索回访
	FUNC_ID_DICTIONARY_GET_PHONE        = 6005 //医生APP获取回访常用语模板
	FUNC_ID_PHONE_SCHEDULE_VISIT_GET    = 6006 //医生APP获取预约和回访  返回预约和回访  新版本
	FUNC_ID_PHONE_GET_CUSTOMER_BY_GROUP = 6007 //医生APP按分组获取患者信息
	FUNC_ID_PHONE_CLINIC_CUSTOMER_GET   = 6008 //医生APP获取Koala患者

	FUNC_ID_HISTORY_HANDLE_SET_PHONE = 6009 //新增处置
	FUNC_ID_HISTORY_HANDLE_DEL_PHONE = 6010 //删除处置
	FUNC_ID_HISTORY_HANDLE_MOD_PHONE = 6011 //修改处置
	FUNC_ID_HANDLEITEM_GET_PHONE     = 6012 //处置项目的获取
	FUNC_ID_SMSTEMPLATE_GET_PHONE    = 6013 //获取短信和微信模板
	FUNC_ID_FINDCUSTOMER_GET_PHONE   = 6014 //搜索患者，按照复诊时间、患者类型、会员等级、用户
	//手机端预约
	FUNC_ID_SCHEDULE_SET_PHONE_NEW            = 6015 //医生APP新增预约  doctorid,传诊所内的医生唯一标识
	FUNC_ID_HISTORY_VISIT_SET_PHONE_NEW       = 6016 //医生APP新增回访  doctorid,传诊所内的医生唯一标识
	FUNC_ID_HISTORY_MEDIARECORD_SET_PHONE_NEW = 6017 //医生APP新增病历  doctorid,传诊所内的医生唯一标识
	FUNC_ID_DOCTORLIST_GET_PHONE              = 6018 //医生APP根据权限返回医生列表
	FUNC_ID_WEIXIN_MSG_SAVE_TEMP_PHONE        = 6030 //医生APP提交微信模板消息
	FUNC_ID_DOCTOR_AUTHORITY_GET_PHONE        = 6031 //医生APP提交微信模板消息

	FUNC_ID_WX_USERINFO_GET_PHONE_NEW = 6040 //手机端最近联系微信用户信息
	FUNC_ID_WXMSG_GET_PHONE_NEW       = 6041 //手机端加载信息
	FUNC_ID_WXMSG_SAVE_C2U_PHONE_NEW  = 6042 //手机端发送微信消息,诊所到用户

	FUNC_ID_IMPORT_BAIDU_CLINIC           = 6043 //导入百度诊所列表
	FUNC_ID_WX_USER_LOAD_PHONE_NEW        = 6044 //手机端加载最近关注/最近咨询/最近关联
	FUNC_ID_WX_USER_SEARCH_PHONE_NEW      = 6045 //手机端搜索联系人
	FUNC_ID_WX_PATIENT_IMAGE_SEND         = 6046 //手机端微信发送影像
	FUNC_ID_WX_SAVE_BIRTH_NOTIFY_NEW      = 6047 //手机端微信发送生日祝福提醒
	FUNC_ID_WXMSG_AUTHORITY_GET_PHONE_NEW = 6048 //手机端通过权限加载信息
	FUNC_ID_WXMSG_NUM_GET_PHONE           = 6049 //手机端获取诊所消息总数
	//----------------------------------------------------------------------------------------------------------------------------
	//新版APP接口命令区域，单用户模式
	//app登录接口
	FUNC_ID_DOC_COMMON_LOGIN    = 6100 //通用登录(KQ88和手机号登录)
	FUNC_ID_DOC_WECHAT_LOGIN    = 6101 //微信登录
	FUNC_ID_DOC_MOBILE_REGISTER = 6102 //手机号注册
	FUNC_ID_DOC_USERID_LOGIN    = 6103 //用户ID登录(静默登录)
	//FUNC_ID_DOC_DocChangePW						=		 6104;//修改密码
	FUNC_ID_DOC_FORGETPW = 6109 //忘记密码

	//app预约接口
	FUNC_ID_DOC_SCHEDULE_ADD_PHONE     = 6104 //新增预约
	FUNC_ID_DOC_SCHEDULE_MOD_PHONE     = 6105 //修改预约
	FUNC_ID_DOC_SCHEDULE_GET_PHONE     = 6106 //获取预约
	FUNC_ID_DOC_SCHEDULE_GET_NUM_PHONE = 6107 //获取预约数量
	FUNC_ID_DOC_SCHEDULE_CANCEL_PHONE  = 6108 //取消预约
	//app获取其他信息
	FUNC_ID_DOC_CLINIC_GET_PHONE      = 6110 //获取诊所列表
	FUNC_ID_DOC_SMSTEMPLETE_GET_PHONE = 6111 //获取医嘱模板
	FUNC_ID_DOC_CUSTYPE_GET_PHONE     = 6112 //获取患者类型
	//app患者接口
	FUNC_ID_DOC_PATIENT_GET_PHONE          = 6113 //获取患者列表
	FUNC_ID_DOC_PATIENT_SET_FAVORITE_PHONE = 6114 //标星患者
	FUNC_ID_DOC_PATIENT_SET_PHONE          = 6115 //添加患者、修改患者
	FUNC_ID_DOC_PATIENT_SEARCH_PHONE       = 6116 //搜索患者
	FUNC_ID_DOC_PATIENT_DELETE_PHONE       = 6117 //删除患者
	//app个人信息接口
	FUNC_ID_DOC_INFO_GET          = 6118 //获取用户基本信息
	FUNC_ID_DOC_INFO_MOD          = 6119 //修改用户基本信息
	FUNC_ID_DOC_CERTIFICATION_GET = 6120 //医生获取认证信息
	FUNC_ID_DOC_CERTIFICATION_SET = 6121 //医生提交认证信息
	FUNC_ID_DOC_APPLYCARD_SET     = 6122 //医生提交申请名片信息
	FUNC_ID_DOC_APPLYCARD_GET     = 6123 //医生获取申请名片信息
	//app获取学校列表
	FUNC_ID_DOC_UNIVERSITY_GET_PHONE = 6124 //获取学校列表
	FUNC_ID_DOC_GET_QRCODE           = 6125 //医生获取我的二维码
	FUNC_ID_DOC_DocChangePW          = 6126 //修改密码
	FUNC_ID_DOC_INFO_TYPE_GET        = 6127 //获取资讯类型
	FUNC_ID_GET_EDU_PAD              = 6128 //获取医患沟通视频信息
	FUNC_ID_GET_EDU_UPDATETIME_PAD   = 6129 //获取医患沟通视频信息

	//----------------------------------------------------------------------------------------
	//---------------------------------------多账号登录体系-----------------------------------
	//----------------------------------------------------------------------------------------
	FUNC_ID_MUTILATE_ACCOUNT_LOGIN = 6200 //多账号通用登录接口

	//网电及客户中心的命令范围：7001-7500
	FUNC_ID_CHAIN_MIN = 7001
	FUNC_ID_CHAIN_MAX = 7500

	FUNC_ID_GROUP_INFO_GET_PC              = 7001 //医生获取分组信息
	FUNC_ID_SCHEDULE_DEL_PC                = 7002 //预约回收站操作
	FUNC_ID_NETSCHEDULE_SELECT_PC          = 7003 //查询网络预约
	FUNC_ID_NETSCHEDULE_UPDATE_PC          = 7004 //修改网络预约
	FUNC_ID_NEWSCHEDULE_SHOWPATIENT        = 7005 //显示类似患者
	FUNC_ID_CONSULT_GET_PC                 = 7006 ///获取网电信息
	FUNC_ID_CONSULT_SET_PC                 = 7007 //新增修改删除网电信息
	FUNC_ID_ALLMSG_SET_PC                  = 7008 //新增修改网点电，预约和回访还有患者信息，全套信息了
	FUNC_ID_ALLMSG_GET_PC                  = 7009 //PC端同步网电数据到本地数据库
	FUNC_ID_CHAIN_RETURNVISIT_MONTH_GET_PC = 7010 //连锁店获取月回访
	FUNC_ID_CHAIN_PATSTUDY_GET_PC          = 7012 //患者首页获取就诊信息
	FUNC_ID_CHAIN_RELATIONSHIP_GET_PC      = 7013 //获取患者关系
	FUNC_ID_CUSTOMER_INFO_GET_PC           = 7014 //获取分组患者信息
	FUNC_ID_CUSTOMER_DETAIL_GET_PC         = 7015 //获取详细患者信息
	FUNC_ID_RETURNVISIT_HANDLE_GET_PC      = 7016 //获取需要回访的处置信息
	FUNC_ID_RETURNVISIT_GE_PC              = 7017 //获取回访信息
	FUNC_ID_RECOVER_CUSTOMER_MOD_PC        = 7018 //PC端患者删除后，从回收站中恢复
	FUNC_ID_RETURNVISIT_CHAINEMR           = 7019 //获取连锁店病历
	FUNC_ID_RETURNVISIT_UPDATE             = 7020 //修改或新增回访
	FUNC_ID_HANDLEITEM_SET_PC              = 7021 //PC端新增处置项目和修改
	FUNC_ID_SMSTEMPLATE_SET_PC             = 7022 //PC端新增短信和微信模板
	FUNC_ID_GET_STUDY_IMAGE_PC             = 7024 //PC端获取检查影像信息
	FUNC_ID_GET_STUDY_VISIT_PC             = 7025 //PC端获取检查回访
	FUNC_ID_GET_CUSTOMER_CONSULT_PC        = 7026 //PC端获取咨询信息

	//更改库存数据
	FUNC_ID_UPDATE_STOCK_PRICE              = 7100 //更新库存价格和数量
	FUNC_ID_UPDATE_STOCK_TOTAL              = 7101 //更新库存总量
	FUNC_ID_UPDATE_STOCK_DESC_NUM           = 7102 //更新库存剩余量
	FUNC_ID_UPDATE_STOCKINDETAIL_STATUS     = 7103 //更新IN状态
	FUNC_ID_UPDATE_STOCKOUTDETAIL_STATUS    = 7104 //更新OUT状态
	FUNC_ID_UPDATE_STOCK_NUM                = 7105 //更新数量
	FUNC_ID_UPDATE_STOCKINMAIN              = 7106 //更新inmain状态
	FUNC_ID_UPDATE_STOCKOUTMAIN             = 7107 //更新outmain状态
	FUNC_ID_UPDATE_STOCKITEMCATEGORY_STATUS = 7108 //更新类别删除状态
	FUNC_ID_UPDATE_STOCKITEMCATEGORY        = 7109 //更新类别名称和拼音

	FUNC_ID_LOAD_ITEMCATEGORY   = 7110 //获取物品类型
	FUNC_ID_DELETE_ITEMCATEGORY = 7111 //删除物品类型
	FUNC_ID_UPDATE_ITEMCATEGORY = 7112 //修改物品类型
	FUNC_ID_INSERT_ITEMCATEGORY = 7113 //插入物品类型
	FUNC_ID_LOAD_STOCKITEM      = 7114 //获取物品资料
	FUNC_ID_INSERT_STOCKITEM    = 7115 //插入物品资料
	FUNC_ID_UPDATE_STOCKITEM    = 7116 //修改物品资料
	FUNC_ID_SAVE_STOCKITEM      = 7117 //批量保存物品资料

	FUNC_ID_LOAD_STOCKINMAIN   = 7118 //获取入库单主表
	FUNC_ID_LOAD_STOCKINDETAIL = 7119 //获取入库单明细表
	FUNC_ID_UPDATE_STOCKIN     = 7120 //修改入库单主表
	FUNC_ID_SAVE_STOCKIN       = 7121 //保存入库单
	FUNC_ID_LOAD_USER_LIST     = 7122 //获取用户列表
	FUNC_ID_CONFIRM_INSTOCK    = 7123 //入库单审核

	FUNC_ID_LOAD_STOCKOUTMAIN         = 7124 //出库单主表 查询
	FUNC_ID_LOAD_STOCKOUTDETAIL       = 7125 //出库单明细  查询
	FUNC_ID_UPDATE_STOCKOUT           = 7126 //修改出库单主表
	FUNC_ID_SAVE_STOCKOUT             = 7127 //保存出库单
	FUNC_ID_CREATE_ID                 = 7128 //获取单据序号 入库单号，出库单号
	FUNC_ID_VERIFY_STOCKOUT_INVERTORY = 7129 //出库单 检验库存是否足够
	FUNC_ID_CONFIRM_OUTSTOCK          = 7130 //出库审核，生成流水账，减库存。

	FUNC_ID_LOAD_STOCKINVENTORYMAIN   = 7131 //初盘主表 查询
	FUNC_ID_LOAD_STOCKINVENTORYDETAIL = 7132 //初盘明细表 查询
	FUNC_ID_UPDATE_INVENTORY          = 7133 //修改删除初盘
	FUNC_ID_SAVE_INVENTORY            = 7134 //保存初盘
	FUNC_ID_MAKE_INV_PROFIT           = 7135 //初盘 生成 盘盈盘亏
	FUNC_ID_LOAD_STOCKINVENTORY       = 7153 //获取所有库存（包含没库存的物品

	FUNC_ID_LOAD_STOCK_COUNT   = 7136 //库存汇总
	FUNC_ID_LOAD_STOCK_BATCH   = 7137 //批次号库存
	FUNC_ID_LOAD_STOCK_JOURNAL = 7138 //流水账库存
	FUNC_ID_LOAD_STOCKWARN     = 7139 //库存预警

	FUNC_ID_LOAD_INSTOCKINFO   = 7140 //查询入库单以及明细
	FUNC_ID_LOAD_STOCKINCOUNT  = 7141 //入库统计
	FUNC_ID_LOAD_OUTSTOCKINFO  = 7142 //查询出库单以及明细
	FUNC_ID_LOAD_STOCKOUTCOUNT = 7143 //出库统计

	FUNC_ID_SAVE_SUPPLIER        = 7144 //保存供应商
	FUNC_ID_LOAD_SUPPLIER        = 7145 //查询供应商
	FUNC_ID_LOAD_STOCKITEM_SUM   = 7146 //库存汇总-退库单领用-选择物品
	FUNC_ID_LOAD_STOCKITEM_BATCH = 7147 //批次号库存-退库单退料-选择物品

	FUNC_ID_LOAD_STOCKTRANSFERSMAIN    = 7148 //获取调拨单主表
	FUNC_ID_LOAD_STOCKTRANSFERSDETAIL  = 7149 //获取调拨单明细表
	FUNC_ID_UPDATE_STOCKTRANSFERS      = 7150 //修改调拨单主表
	FUNC_ID_SAVE_STOCKTRANSFERS        = 7151 //保存调拨单
	FUNC_ID_CONFIRM_STOCKTRANSFERS_OUT = 7152 //调拨单审核出库
	FUNC_ID_CONFIRM_STOCKTRANSFERS_IN  = 7154 //调拨单审核入库
	FUNC_ID_LOAD_STOCKTRANSFERSINFO    = 7155 //查询调拨单以及明细
	FUNC_ID_LOAD_STOCKTRANSFERSCOUNT   = 7156 //调拨单汇总
	FUNC_ID_SAVE_ADDSUPPLIER           = 7157 //保存新增的供应商
	FUNC_ID_SAVE_EDITSUPPLIER          = 7158 //保存修改的供应商
	FUNC_ID_SAVE_JUDGEEXISTENT         = 7159 //新增/修改物品时判断该物品是否已经存在
	FUNC_ID_VERIFY_STOCKTRANSFERS      = 7160 //调拨单 检验库存是否足够
	FUNC_ID_VERIFY_GOODS_ISUSE         = 7161 //物品是否被使用

	//连锁店报表
	FUNC_ID_LOAD_CLINICLIST    = 7300 //查询连锁店列表信息/诊所信息
	FUNC_ID_STAT_BILLCHECKLIST = 7301 //取收费流水
	FUNC_ID_STAT_PAYFEESTYLE   = 7302 //统计收费类型汇总
	FUNC_ID_STAT_PAGINGPATIENT = 7303 //分页查询欠费患者
	FUNC_ID_LOAD_DICTIONARY    = 7304 //获取字典表
	FUNC_ID_LOAD_PAGINGADVPAY  = 7305 //分页查询预交款
	FUNC_ID_LOAD_STATVIPPAY    = 7306 //统计会员卡交易
	FUNC_ID_LOAD_VIPLEVEL      = 7307 //获取会员等级

	FUNC_ID_STAT_DOCT_VISITTYPE_PAYIN = 7371 //诊所运营-统计医生 各个就诊类型人数及收入
	FUNC_ID_STAT_ACCOUNTS_DAY_SUM     = 7372 //诊所运营-应收实收
	FUNC_ID_STAT_FIRST_COUNT          = 7373 //诊所运营-初诊人次趋势图
	FUNC_ID_STAT_SUMPAIDFEE           = 7374 //诊所运营-实收金额统计
	FUNC_ID_STAT_NEEDPAY              = 7375 //诊所运营-查询应收费用
	FUNC_ID_STAT_SUMPADIFEEANDADVANCE = 7376 //诊所运营-实收金额统计包含预交款
	FUNC_ID_STAT_COMEFROMPAIDFEE      = 7377 //诊所运营-按患者来源统计患者消费
	FUNC_ID_STAT_DMONTHFEETYPE        = 7378 //诊所运营-统计实收费用分类
	FUNC_ID_STAT_SCHEDULEALLCOUNT     = 7379 //诊所运营-查询预约初复诊
	FUNC_ID_LOAD_SCHEDULEITEM         = 7380 //查找预约项目
	FUNC_ID_STAT_SCHEDULEITEMCOUNT    = 7381 //统计预约项目
	FUNC_ID_STAT_COMEFROMCOUNT        = 7382 ///按患者来源统计患者数
	FUNC_ID_STAT_SCHEDULESTATE        = 7383 //查询预约状态

	//私有命令范围区域 8000 - 9000,不允许通过网络请求调用
	FUNC_ID_PRIVATE_MIN = 8000
	FUNC_ID_PRIVATE_MAX = 9000

	FUNC_ID_IMPORT_DB_TO_CLOUD            = 8001 //导入AccessDB到云端表中
	FUNC_ID_DELETE_DB                     = 8002 //删除云端数据库中数据
	FUNC_ID_UPDATE_SIMULATE_DATA          = 8003 //更新模拟诊所数据
	FUNC_ID_STAT_CLINIC_DATA              = 8004 //统计专业版诊所数据
	FUNC_ID_STAT_CLINIC_INCOME_DATA       = 8005 //统计诊所实收
	FUNC_ID_STAT_DOCTOR_DATA              = 8006 //统计医生欠款
	FUNC_ID_STAT_DOCTOR_INCOME_DATA       = 8007 //统计医生实收
	FUNC_ID_GET_RECORDING_INDEX           = 8008 //遍历查询直播完成视频的录播索引
	FUNC_ID_CHAIN_ADVANCEPAY_IMPORT_STATE = 8009 //更新预交款云端导入状态
	FUNC_ID_ASYN_PROCESS                  = 8010 //异步处理任务
	FUNC_ID_SVR_MONITOR                   = 8011 //服务器监控
	FUNC_ID_AUDIENCE_NUMBER               = 8012 //获取直播在线人数GetAudienceNumber
	FUNC_ID_DISTRIBUTE_REDPACKAGE         = 8013 //分发红包
	FUNC_ID_SEND_CLINIC_MSG               = 8014 //给新注册的诊所发送通知短信
	//9001 -9500 后台系统命令号，其他命令禁用
	FUNC_ID_DITUI_LOGIN            = 9001 //系统登录接口;
	FUNC_ID_DITUI_CHECK_SESSION    = 9002 //系统校验session
	FUNC_ID_DITUI_CLINIC_GRAGE_GET = 9003 //获取诊所的等级（高频，低频等）
	FUNC_ID_DITUI_VERYFY_CODE      = 9004 //校验手机验证码
	FUNC_ID_DITUI_REDIS_CLEAR      = 9005 //清理redis

	//20001-29999 PHP内部调用的命令号范围
	FUNC_ID_WEB_MIN = 20001
	FUNC_ID_WEB_MAX = 29999

	FUNC_ID_LOGIN_WEB                      = 20001 //登录
	FUNC_ID_GET_LOGIN_RECORD_WEB           = 20002 //获取登录记录
	FUNC_ID_SAVE_ACTIONRECORD_WEB          = 20003 //保存操作记录(web端的请求，暂时不用)
	FUNC_ID_GETVERIFYCODE_WEB              = 20004 //获取验证码
	FUNC_ID_SET_PASSWORD_WEB               = 20005 //设置密码
	FUNC_ID_REGISTER_WEB                   = 20006 //注册用户
	FUNC_ID_Get_UserInfo_Web               = 20007 //获取用户信息
	FUNC_ID_GET_ACTIONRECORD               = 20008 //获取操作记录
	FUNC_ID_GET_VERIFY_CODE_WEB_REGISTER   = 20100 //获取WebAccount的验证码
	FUNC_ID_CHECK_VERIFY_CODE_WEB_REGISTER = 20101 //注册时候的验证码的检验
	FUNC_ID_WEB_MOBILE_REGISTER            = 20102 //注册web版用户
	FUNC_ID_WEB_CHANGE_PASSWORD            = 20103 //忘记密码的时候重置密码
	FUNC_ID_GET_DB_NAME                    = 20104 //根据诊所ID获取数据库名
	FUNC_ID_UPLOAD_IMAGE                   = 20105 //上传图片
	FUNC_ID_GET_MALL_ENCRYPT               = 20106 //商城加密

	FUNC_ID_MALL_RSA_ENCRYPT  = 20113 //app端访问商城加密
	FUNC_ID_GET_IMAGE_HASH    = 20114
	FUNC_ID_GET_STUDY_UID     = 20115 //获取图像检查UID
	FUNC_ID_UPLOAD_SOURCE     = 20116 //上传商学院视频、音频资源到OSS
	FUNC_ID_DECODE_SECRET     = 20117 //解码secret
	FUNC_ID_UPLOAD_JFX_IMAGE  = 20119 //保存金服侠图片
	FUNC_ID_GET_CLOUND_PATH   = 20124
	FUNC_ID_UPLOAD_ENCOSCOPIC = 20125

	FUNC_ID_GET_ACTIVITY_INFO    = 20333 //测试用
	FUNC_ID_GET_PERSONAL_MSG     = 20334 //我的消息
	FUNC_ID_GET_SECRITY_QUESTION = 20335 //我的密保 暂时不用
	FUNC_ID_CREATE_CLINIC        = 20336 //测试 失败

	FUNC_ID_CREATE_MAIN_CLINIC  = 20337 //创建诊所
	FUNC_ID_CREATE_UOIN_CLINIC  = 20338 //创建连锁
	FUNC_ID_CREATE_SON_CLINIC   = 20339 //创建分诊所
	FUNC_ID_GET_CLINIC_INFOLIST = 20340 //获取连锁店的信息  连锁版的
	FUNC_ID_GET_CLINIC_INFO     = 20341 //获取单店的诊所信息
	FUNC_ID_SAVE_CLINIC_INFO    = 20342 //保存单店的诊所信息
	FUNC_ID_GET_CREDIT_INFO     = 20343 //保存单店的诊所资质信息

	FUNC_ID_CHANGE_WEB_BINDPHONE = 20345 //更新绑定的手机号码

	FUNC_ID_USER_GET_INFO                  = 20201 //获得医生个人信息
	FUNC_ID_USER_SAVE_INFO                 = 20202 //保存医生个人信息
	FUNC_ID_USER_BIND_MOBILE               = 20203 //修改绑定手机
	FUNC_ID_USER_CHANGE_PASSWORD           = 20204 //修改密码
	FUNC_ID_USER_SET_PW_PROTECT            = 20205 //修改密保
	FUNC_ID_WEB_AUTO_LOGIN                 = 20206 //PC端网页自助登录
	FUNC_ID_SET_CLINIC_MEDAL               = 20207 //设置诊所勋章
	FUNC_ID_GET_CLINIC_WEIXIN_TOKEN        = 21100 //获取诊所微信token
	FUNC_ID_CIPHERKEY_ENCRYPT              = 20107 //CipherKey加密
	FUNC_ID_CIPHERKEY_DECRYPT              = 20108 //CipherKey解密
	FUNC_ID_CIPHERWEB_ENCRYPT              = 20110 //Cipherweb加密 密文没有/号
	FUNC_ID_CIPHERWEB_DECRYPT              = 20111 //Cipherweb解密
	FUNC_ID_BEEGO_SEND_VERIFY_CODE         = 20112 //商学院APP发送验证码
	FUNC_ID_GET_CLINIC_WEIXIN_ACCESS_TOKEN = 21101 //获取微信accesstoken
	FUNC_ID_WX_WEB_OTHER_QR_CODE           = 21108 //WEB获取诊所其他二维码
	FUNC_WX_WEB_MENU_CREATE                = 21109 //WEB自定义菜单
	FUNC_ID_REDIS_DELETE                   = 21112 //清理根据redisid清理redis
	FUNC_ID_WX_MENU_CREATE                 = 21114 //WEB 生成菜单
	FUNC_ID_WX_MENU_DEFAULT                = 21115 //WEB 生成默认菜单

	FUNC_ID_WX_CHAIN_TOKENS_GET    = 21125 //获取连锁店下的公众号
	FUNC_ID_WX_CLINIC_GET_BY_TOKEN = 21126 //获取连锁店公众号的诊所
	FUNC_ID_WX_MAINSTORE_SET       = 21127 //设置公众号主店
	FUNC_ID_WX_CLINIC_ADD          = 21128 //公众号添加绑定诊所
	FUNC_ID_WX_CLINIC_DEL          = 21129 //公众号解绑绑定诊所

	FUNC_ID_WX_SUMMERY_GET       = 21131 //获取微信用户统计数据
	FUNC_ID_WX_SUMMERY_GET_HaoYa = 21132 //获取微信用户统计数据-好牙

	FUNC_ID_WX_AUTHDOMAIN_GET    = 21120 //获取授权域名
	FUNC_ID_WX_GETLOCATION_BY_IP = 21116 //取IP对应地址
	FUNC_ID_SYS_RSA_ENCRYPT      = 21118 //RSA系统加密
	FUNC_ID_SYS_RAS_DECRYPT      = 21119 //RSA系统解密
	//------------------------------新版顾客端命令10000-15000---------------------------------//
	//登录接口
	//发送验证码用144命令号
	FUNC_ID_CUSTOMER_WEIXIN_LOGIN  = 10000 //顾客微信登录
	FUNC_ID_CUSTOMER_MOBILE_LOGIN  = 10001 //顾客手机登录
	FUNC_ID_CUSTOMER_BIND_MOBILE   = 10002 //顾客绑定手机
	FUNC_ID_CUSTOMER_VERIFY_MOBILE = 10003 //顾客验证原始手机号(更换手机)
	FUNC_ID_CUSTOMER_CHANGE_WEIXIN = 10004 //顾客更换微信
	FUNC_ID_CUSTOMER_USER_LOGIN    = 10021 //顾客静默登陆

	//扫描绑定、解除诊所
	FUNC_ID_CUSTOMER_SCAN_CLINIC = 10005 //扫描绑定诊所、患者
	FUNC_ID_CUSTOMER_SCAN        = 10016 //诊所绑定患者
	FUNC_ID_CUSTOMER_DEL_CLINIC  = 10006 //解绑诊所
	//诊所管理
	FUNC_ID_CUSTOMER_GET_CLINICLIST = 10007 //获取诊所列表
	//扫描绑定、解除家庭成员
	FUNC_ID_CUSTOMER_DEL_PATIENT      = 10008 //解绑家庭成员
	FUNC_ID_CUSTOMER_MODIFY_PATIENT   = 10009 //修改家庭成员信息
	FUNC_ID_CUSTOMER_GET_PATIENT_LIST = 10010 //获取家庭成员列表
	FUNC_ID_CUSTOMER_GET_PATIENT_INFO = 10011 //获取家庭成员详细信息

	//获取banner
	FUNC_ID_CUSTOMER_GET_BANNER = 10012 //获取banner
	//获取热门资讯
	FUNC_ID_CUSTOMER_GET_INFO = 10013 //获取热门资讯

	//获取诊所所有医生
	FUNC_ID_CUSTOMER_GET_DOCTOR = 10014 //获取诊所医生列表
	//项目
	FUNC_ID_CUSTOMER_GET_ITEMS = 10015 //获取项目列表及项目详情
	//FUNC_ID_CUSTOMER_GET_ITEMS_DETAIL				=		 10016;//获取项目详情

	//修改牙管家个人信息
	//FUNC_ID_CUSTOMER_GET							=		 10016;//获取个人信息
	FUNC_ID_CUSTOMER_MODIFY = 10017 //修改个人信息

	//预约
	FUNC_ID_CUSTOMER_GET_LIST            = 10018 //预约列表
	FUNC_ID_CUSTOMER_ADD_SCHEDULE        = 10019 //新增预约/修改预约
	FUNC_ID_CUSTOMER_CANCEL_SCHEDULE     = 10022 //取消预约
	FUNC_ID_CUSTOMER_GET_SCHEDULE_DOCTOR = 10020 //获取预约医生排班列表
	FUNC_ID_CUSTOMER_GET_GRADE           = 10026 //获取排班类型
	FUNC_ID_CUSTOMER_GET_SYMPTOM         = 10025 //病人预约症状

	//意见反馈
	FUNC_ID_CUSTOMER_FEEDBACK = 10024 //意见反馈

	//费用
	FUNC_ID_CUSTOMER_GET_BILLLIST = 10030 //获取所有病人账单
	FUNC_ID_CUSTOMER_GET_BILLSUM  = 10031 //获取账单列表

	//VIP卡管理
	FUNC_ID_CUSTOMER_GET_VIPCARD     = 10032 //获取会员卡信息
	FUNC_ID_CUSTOMER_GET_VIPCARDLIST = 10033 //会员卡交易记录
	//FUNC_ID_CUSTOMER_GET_VIPCARDDETALL			=		10034;//会员卡交易明细
	FUNC_ID_CUSTOMER_GET_VIPCARDRECHARGE = 10035 //会员卡充值
	FUNC_ID_CUSTOMER_ADD_VIPCARD         = 10036 //会员卡申请共享
	FUNC_ID_CUSTOMER_DEL_VIPCARD         = 10037 //同意/终止共享
	//FUNC_ID_CUSTOMER_GET_VIPSHAREDNEWS			=		10038;//共享消息
	FUNC_ID_CUSTOMER_GET_VIPCARDSHLIST = 10039 //获取共享列表
	FUNC_ID_CUSTOMER_DEL_VIPCARDSHLIST = 10040 //清除共享申请列表
	FUNC_ID_CUSTOMER_GET_VIPSHARELIST  = 10041 //未绑定共享卡获取
	////代金券管理
	//FUNC_ID_CUSTOMER_GET_COUPON					=		10042;//代金券列表
	//FUNC_ID_CUSTOMER_ADD_COUPON					=		10043;//代金券获取
	//FUNC_ID_CUSTOMER_GET_COUPONLIST				=		10044;//个人代金券列表
	//FUNC_ID_CUSTOMER_SAVE_COUPON					=		10045;//代金券使用

	FUNC_ID_CUSTOMER_GET_DEPOSITLIST = 10050 //获取牙管家用户的预交款流水
	FUNC_ID_CUSTOMER_ADD_DEPOSIT     = 10051 //获取牙管家用户的预交款充值

	//10200 - 10300 问诊聊天接口
	FUNC_ID_CUSTOMER_GET_CHAT_USER_LIST_PHONE = 10200 //获取牙管家问诊聊天用户列表
	FUNC_ID_CUSTOMER_GET_MSG_PHONE            = 10201 ///获取牙管家医生聊天记录
	FUNC_ID_CUSTOMER_SAVE_MSG_PHONE           = 10202 //发送牙管家消息

	FUNC_ID_DOCTOR_GET_CHAT_USER_LIST_PHONE = 10210 //获取牙医管家文章聊天用户列表
	FUNC_ID_DOCTOR_GET_MSG_PHONE            = 10211 //获取牙医管家患者的聊天记录
	FUNC_ID_DOCTOR_SAVE_MSG_PHONE           = 10212 //发送牙医管家消息

	//内部接口，不使用json作为参数协议
	FUNC_ID_GO_DECRYPT = 50001 //字符串解密
	FUNC_ID_GO_ENCRYPT = 50002 //字符串加密

	//义齿端接口
	FUNC_DX_DOC_REGISTER = 600001 //义齿注册发送验证码
	FUNC_DX_DOC_CODELOGIN = 600002 //义齿注册验证码登陆
	FUNC_DX_DOC_FORGETPASSWORD=600003 //忘记密码发送验证码
	//加工厂发送验证码
	FUNC_DX_FAC_FORGETPASSWORD=600004 //加工厂忘记密码发送验证码

)

//发送验证码时候 需要设置的命令号
const (
	FUNC_ID_VERIFY_DJD_LOGIN = 1000000 //度金贷立即报名时的命令号
	FUNC_ID_STD_PUBLIC_USER  = 1000001 //标准版 成为公测用户发送的验证码
	FUNC_ID_PRO_PUBLIC_USER  = 1000002 //专业版预约升级
	FUNC_ID_LEARN_LOGIN      = 1000003 //平台后台登录
)

var FlyBear_Execute *syscall.Proc
var FlyBear_Execute_GO *syscall.Proc

//调用c++中FlybearAPI的接口
func FlybearCPlus(param config.LJSON) config.LJSON {
	if FlyBear_Execute == nil {
		cplusbin := beego.AppConfig.String("cplusbin")
		FlyBear_Execute = syscall.MustLoadDLL(cplusbin + `FlyBearAPIX64.dll`).MustFindProc("IFlyBear_Execute_PHP")
		if FlyBear_Execute == nil {
			var val config.LJSON
			return val
		}
	}
	var size int
	str, _ := param.ToString()
	ret, _, _ := FlyBear_Execute.Call(uintptr(unsafe.Pointer(syscall.StringToUTF16Ptr(str))), 0, 0, 0)
	for {
		size++
		x := *(*uint16)(unsafe.Pointer(ret + uintptr(size*2)))
		if x == 0 {
			break
		}
	}
	s := make([]uint16, size+1)
	for i := range s {
		s[i] = *(*uint16)(unsafe.Pointer(ret + uintptr(i*2)))
		if s[i] == 0 {
			break
		}
	}
	data := syscall.UTF16ToString(s)
	var res config.LJSON
	res.Load(data)
	return res
}

//调用c++中FlybearAPI的Flybear_Execute_GO接口
func CPlusExecuteGO(funcid int, param string) string {
	if FlyBear_Execute_GO == nil {
		cplusbin := beego.AppConfig.String("cplusbin")
		FlyBear_Execute_GO = syscall.MustLoadDLL(cplusbin + `FlyBearAPIX64.dll`).MustFindProc("IFlyBear_Execute_GO")
		if FlyBear_Execute_GO == nil {
			var val string
			return val
		}
	}
	var size int
	ret, _, _ := FlyBear_Execute_GO.Call(uintptr(funcid), uintptr(unsafe.Pointer(syscall.StringBytePtr(param))), 0, 0, 0)
	for {
		size++
		x := *(*byte)(unsafe.Pointer(ret + uintptr(size)))
		if x == 0 {
			break
		}
	}
	s := make([]byte, size+1)
	for i := range s {
		s[i] = *(*byte)(unsafe.Pointer(ret + uintptr(i)))
		if s[i] == 0 {
			break
		}
	}
	data := string(s)
	return data
}
