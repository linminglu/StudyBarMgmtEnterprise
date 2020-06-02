//author:  于绍纳 2017-06-27
//purpose：商学院后台模块
package routers

import (
	"doggy/controllers/erp"
	platform "doggy/controllers/learn/platform"

	"github.com/astaxie/beego"
)

func init() {
	version, _ := beego.AppConfig.Int("version")
	if version == 0 {
		version = 99999 //不设置的时候默认为开发版本，发布所有路由
	}
	if version <= 1001 {
		return
	}

	beego.Router("/butlerp/college/userpage", &erp.CollegeController{}, "get:UserPage")              //<用户管理>页面
	beego.Router("/butlerp/college/userdata", &erp.CollegeController{}, "post:UserData")             //<用户管理>数据
	beego.Router("/butlerp/college/useradd", &erp.CollegeController{}, "post:UserAdd")               //<用户管理>添加用户
	beego.Router("/butlerp/college/userimport", &erp.CollegeController{}, "post:UserImport")         //<用户管理>导入用户
	beego.Router("/butlerp/college/userdetailpage", &erp.CollegeController{}, "get:UserDetailPage")  //<用户管理>详情页面
	beego.Router("/butlerp/college/userdetaildata", &erp.CollegeController{}, "post:UserDetailData") //<用户管理>详情数据

	beego.Router("/butlerp/college/integralpage", &erp.CollegeController{}, "get:IntegralPage")      //<积分管理>页面
	beego.Router("/butlerp/college/integraldata", &erp.CollegeController{}, "post:IntegralData")     //<积分管理>数据
	beego.Router("/butlerp/college/integraladd", &erp.CollegeController{}, "post:IntegralAdd")       //<积分管理>添加
	beego.Router("/butlerp/college/integraltype", &erp.CollegeController{}, "post:IntegralType")     //<积分管理>获取类型列表
	beego.Router("/butlerp/college/integralimport", &erp.CollegeController{}, "post:IntegralImport") //<积分管理>导入
	beego.Router("/butlerp/college/integraldel", &erp.CollegeController{}, "post:IntegralDel")       //<积分管理>删除

	beego.Router("/butlerp/college/weclasspage", &erp.CollegeController{}, "get:WeClassPage")                    //<微课堂>页面
	beego.Router("/butlerp/college/weclassdata", &erp.CollegeController{}, "post:WeClassData")                   //<微课堂>数据
	beego.Router("/butlerp/college/weclassmod", &erp.CollegeController{}, "post:WeClassMod")                     //<微课堂>新增或修改
	beego.Router("/butlerp/college/weclassdel", &erp.CollegeController{}, "post:WeClassDel")                     //<微课堂>删除
	beego.Router("/butlerp/college/weclassopen", &erp.CollegeController{}, "post:WeClassOpen")                   //<微课堂>上下架(开放)
	beego.Router("/butlerp/college/weclassdetailpage", &erp.CollegeController{}, "get:WeClassDetailPage")        //<微课堂详情>页面
	beego.Router("/butlerp/college/weclassdetaildata", &erp.CollegeController{}, "post:WeClassDetailData")       //<微课堂详情>数据
	beego.Router("/butlerp/college/weclassdetaildel", &erp.CollegeController{}, "post:WeClassDetailDel")         //<微课堂详情>删除评论
	beego.Router("/butlerp/college/weclassdetailcomment", &erp.CollegeController{}, "post:WeClassDetailComment") //<微课堂详情>作者回复

	//beego.Router("/butlerp/college/uploadsource", &erp.CollegeController{}, "post:UploadSource") //<微课堂>上传视频、音频资源
	beego.Router("/butlerp/college/bannerpage", &erp.CollegeController{}, "get:BannerPage")    //<微课堂>banner网页
	beego.Router("/butlerp/college/imageupload", &erp.CollegeController{}, "post:ImageUpload") //<微课堂>图片上传
	beego.Router("/butlerp/college/savebanner", &erp.CollegeController{}, "post:SaveBanner")   //<微课堂>保存banner

	beego.Router("/butlerp/college/upload", &erp.CollegeController{}, "get:Upload")
	beego.Router("/butlerp/college/uploadsource", &erp.CollegeController{}, "post:UploadSource")
	beego.Router("/butlerp/ysn", &erp.CollegeController{}, "get:Ysn")
	beego.Router("/butler/collage/ossparam", &erp.CollegeController{}, "post:OssParam")
	beego.Router("/butlerp/college/qrcode", &erp.CollegeController{}, "post:GetQRCode") //<微课堂>获取二维码

	//APP商学院后台
	// beego.Router("/butlerp/business/login", &erp.BusinessController{}, "get,post:StudyBarLogin") //新版登录

	beego.Router("/butlerp/business/searchuser", &platform.PLearnController{}, "post:SearchUser")            //【添加主播】手机号搜索功能
	beego.Router("/butlerp/business/setanchor", &platform.PLearnController{}, "post:SetUser2Anchor")         //【添加主播】设置为主播
	beego.Router("/butlerp/business/index", &platform.PLearnController{}, "get:Index")                       //【主播管理】 -- 静态页面
	beego.Router("/butlerp/business/anchorlist", &platform.PLearnController{}, "post:AnchorList")            //【主播管理】 -- 主播列表
	beego.Router("/butlerp/business/modanchorinfo", &platform.PLearnController{}, "post:ModifyAnchorInfo")   //【主播管理】 -- 修改主播内容
	beego.Router("/butlerp/business/anchorinfo", &platform.PLearnController{}, "post:AnchorInfo")            //【主播管理】 -- 主播详情
	beego.Router("/butlerp/business/anchorinfopage", &platform.PLearnController{}, "get:AnchorInfoPage")     //【主播管理】 -- 主播详情页面
	beego.Router("/butlerp/business/anchorsetting", &platform.PLearnController{}, "post:AnchorSetting")      //【主播管理】 -- 设置主播状态
	beego.Router("/butlerp/business/anchorincomepage", &platform.PLearnController{}, "get:AnchorIncomePage") //【主播管理】 -- 收入列表页面
	beego.Router("/butlerp/business/anchorincome", &platform.PLearnController{}, "post:AnchorIncome")        //【主播管理】 -- 收入列表
	beego.Router("/butlerp/business/anchorpayoutpage", &platform.PLearnController{}, "get:AnchorPayoutPage") //【主播管理】 -- 支出列表页面
	beego.Router("/butlerp/business/anchorpayout", &platform.PLearnController{}, "post:AnchorPayout")        //【主播管理】 -- 支出列表

	beego.Router("/butlerp/business/signlelistpage", &platform.PLearnController{}, "get:SignleListPage")         //【单课程】 -- 列表页面
	beego.Router("/butlerp/business/signlelist", &platform.PCommonController{}, "post:SignleList")               //【单课程】 -- 列表
	beego.Router("/butlerp/business/signledetailpage", &platform.PLearnController{}, "get:SignleDetailPage")     //【单课程】 -- 详情页面
	beego.Router("/butlerp/business/signledetail", &platform.PLearnController{}, "post:SignleDetail")            //【单课程】 -- 详情
	beego.Router("/butlerp/business/signlesetting", &platform.PLearnController{}, "post:SignleSetting")          //【单课程】 -- 状态设置
	beego.Router("/butlerp/business/addormodsignlepage", &platform.PLearnController{}, "get:AddOrModSignlePage") //【单课程】 --  单课程编辑(新增或者修改) 页面
	beego.Router("/butlerp/business/addormodsignle", &platform.PLearnController{}, "post:AddOrModSignle")        //【单课程】 --  单课程编辑(新增或者修改)
	beego.Router("/butlerp/business/getpushurl", &platform.PLearnController{}, "post:GetPushUrl")                //【单课程】-- 获取推流地址

	//2020-1-08 wy新增
	beego.Router("/butlerp/business/getplayurl", &platform.PLearnController{}, "post:GetPlayUrl")                //【单课程】-- 获取推流地址
	beego.Router("/butlerp/business/getvodlist", &platform.PLearnController{}, "post:GetVodList") 
	beego.Router("/butlerp/business/getvodplayurllist", &platform.PLearnController{}, "post:GetVodPlayUrlList") 

	beego.Router("/butlerp/business/getvideouploadinfo", &platform.PLearnController{}, "post:GetVideoUploadInfo") 
	beego.Router("/butlerp/business/refreshvideouploadinfo", &platform.PLearnController{}, "post:RefreshVideoUploadInfo") 

	beego.Router("/butlerp/business/serieslistpage", &platform.PLearnController{}, "get:SeriesListPage")                //【系列课】 -- 列表页面
	beego.Router("/butlerp/business/serieslist", &platform.PLearnController{}, "post:SeriesList")                       //【系列课】 -- 列表
	beego.Router("/butlerp/business/seriessetting", &platform.PLearnController{}, "post:SeriesSetting")                 //【系列课】 -- 状态设置
	beego.Router("/butlerp/business/seriesdetailpage", &platform.PLearnController{}, "get:SeriesDetailPage")            // 【系列课】-- 获取系列课详情 页面
	beego.Router("/butlerp/business/seriesdetail", &platform.PLearnController{}, "post:SeriesDetail")                   // 【系列课】 -- 获取系列课详情 (获取系列课中的单课程列表)
	beego.Router("/butlerp/business/seriesinfo", &platform.PLearnController{}, "post:SeriesInfo")                       // 【系列课】 -- 获取系列课详情 (获取系列课中的单课程列表)
	beego.Router("/butlerp/business/setallsignle", &platform.PLearnController{}, "post:SetAllSignle")                   // 【系列课】 -- 批量上下架 所有单课程
	beego.Router("/butlerp/business/seriesdetailaddsignle", &platform.PLearnController{}, "post:SeriesDetailAddSignle") // 【系列课】 -- 【添加单课程】
	beego.Router("/butlerp/business/seriesofsignlelist", &platform.PLearnController{}, "post:Seriesofsignlelist")       //【系列课】 -- 【选择框中的单课程列表】

	beego.Router("/butlerp/business/addseries", &platform.PLearnController{}, "post:AddSeries") //【系列课】 -- 【新增系列课】
	beego.Router("/butlerp/business/modseries", &platform.PLearnController{}, "post:ModSeries") //【系列课】 -- 【修改系列课】

	beego.Router("/butlerp/business/seriesdetaildel", &platform.PLearnController{}, "post:SeriesDetailDel")   // 【系列课】 -- 【删除单课程】
	beego.Router("/butlerp/business/seriesdetailmove", &platform.PLearnController{}, "post:SeriesDetailMove") // 【系列课】 -- 【移动单课程】

	beego.Router("/butlerp/business/employratelistpage", &platform.PLearnController{}, "get:EmployRateListPage") // 分佣比例管理 页面
	beego.Router("/butlerp/business/employratelist", &platform.PLearnController{}, "post:EmployRateList")        // 分佣比例管理 列表数据
	beego.Router("/butlerp/business/employrateadd", &platform.PLearnController{}, "post:EmployRateAdd")          // 添加分佣比例

	beego.Router("/butlerp/business/codelist", &platform.PLearnController{}, "post:CodeList")             // 兑换码 列表数据
	beego.Router("/butlerp/business/addcode", &platform.PLearnController{}, "post:AddCode")               // 添加 兑换码
	beego.Router("/butlerp/business/codesignlelist", &platform.PLearnController{}, "post:CodeSignleList") //兑换码中的单课程列表
	beego.Router("/butlerp/business/delcodesignle", &platform.PLearnController{}, "post:DelCodeSignle")   //兑换码中的单课程列表

	beego.Router("/butlerp/business/employrateuserlistpage", &platform.PLearnController{}, "get:EmployRateUserListPage") //分佣比例详情列表 页面
	beego.Router("/butlerp/business/employrateuserlist", &platform.PLearnController{}, "post:EmployRateUserList")        //分佣比例详情列表
	beego.Router("/butlerp/business/modifyuseremploy", &platform.PLearnController{}, "post:ModifyUserEmploy")            //修改主播的雇佣比例
	beego.Router("/butlerp/business/bannerlistpage", &platform.PLearnController{}, "get:BannerListPage")                 // 【首页管理】BANNER 显示列表 页面
	beego.Router("/butlerp/business/bannerlist", &platform.PLearnController{}, "post:BannerList")                        // 【首页管理】BANNER 显示列表
	beego.Router("/butlerp/business/addormodbanner", &platform.PLearnController{}, "post:AddOrModBanner")                // 【首页管理】 新增或修改
	beego.Router("/butlerp/business/bannersetting", &platform.PLearnController{}, "post:BannerSetting")                  //【首页管理】 删除 0 和 上架 1  下架   2
	beego.Router("/butlerp/business/movebanner", &platform.PLearnController{}, "post:MoveBanner")                        // 【首页管理】 移动

	beego.Router("/butlerp/business/serieshomelistpage", &platform.PLearnController{}, "get:SeriesHomeListPage")    // 【系列课管理】 列表页面
	beego.Router("/butlerp/business/serieshomelist", &platform.PLearnController{}, "post:SeriesHomeList")           // 【系列课管理】 列表
	beego.Router("/butlerp/business/serieshomemove", &platform.PLearnController{}, "post:SeriesHomeMove")           // 【系列课管理】上下移动
	beego.Router("/butlerp/business/serieshomesetting", &platform.PLearnController{}, "post:SeriesHomeSetting")     // 【系列课管理】上架1、下架2、删除0、 取消置顶0
	beego.Router("/butlerp/business/serieshometop", &platform.PLearnController{}, "post:SeriesHomeTop")             // 【系列课管理】置顶系列课
	beego.Router("/butlerp/business/serieshomeaddcourse", &platform.PLearnController{}, "post:SeriesHomeAddCourse") //  【系列课管理】添加 系列课到主页

	beego.Router("/butlerp/business/signlehomelistpage", &platform.PLearnController{}, "get:SignleHomeListPage")    // 【单课程管理】 列表页面
	beego.Router("/butlerp/business/signlehomelist", &platform.PLearnController{}, "post:SignleHomeList")           // 【单课程管理】 列表
	beego.Router("/butlerp/business/signlehomemove", &platform.PLearnController{}, "post:SignleHomeMove")           // 【单课程管理】移动
	beego.Router("/butlerp/business/signlehomesetting", &platform.PLearnController{}, "post:SignleHomeSetting")     // 【单课程管理】上架1、下架2、删除0、取消置顶0
	beego.Router("/butlerp/business/signlehometop", &platform.PLearnController{}, "post:SignleHomeTop")             // 【单课程管理】置顶单课程
	beego.Router("/butlerp/business/signlehomeaddcourse", &platform.PLearnController{}, "post:SignleHomeAddCourse") // 【单课程管理】添加 单课程到主页

	beego.Router("/butlerp/business/totalstatpage", &platform.PLearnController{}, "get:TotalStatPage")  // 【概述】统计页面
	beego.Router("/butlerp/business/totalstat", &platform.PLearnController{}, "post:TotalStat")         // 【概述】 累积统计信息
	beego.Router("/butlerp/business/totalstatlist", &platform.PLearnController{}, "post:TotalStatList") // 【概述】课程列表

	beego.Router("/butlerp/business/anchorstatlistpage", &platform.PLearnController{}, "get:AnchorStatListPage")     // 主播收入列表页面
	beego.Router("/butlerp/business/anchorstatlist", &platform.PLearnController{}, "post:AnchorStatList")            // 主播收入列表
	beego.Router("/butlerp/business/anchorincomelistpage", &platform.PLearnController{}, "get:AnchorIncomeListPage") // 主播收入流水页面
	beego.Router("/butlerp/business/anchorincomelist", &platform.PLearnController{}, "post:AnchorIncomeList")        // 主播收入流水

	beego.Router("/butlerp/business/anchorstatpayoutpage", &platform.PLearnController{}, "get:AnchorStatPayOutPage") //主播支出页面
	beego.Router("/butlerp/business/anchorstatpayout", &platform.PLearnController{}, "post:AnchorStatPayOut")        //主播支出
	beego.Router("/butlerp/business/anchorpayoutlistpage", &platform.PLearnController{}, "get:AnchorPayOutListPage") //主播支出明细页面
	beego.Router("/butlerp/business/anchorpayoutlist", &platform.PLearnController{}, "post:AnchorPayOutList")        //主播支出明细

	//------------------------------------------------改版新功能------------------------------------------------------------

	beego.Router("/butlerp/business/allsignlelist", &platform.PLearnController{}, "post:AllSignleList") //获取单课程列表
	beego.Router("/butlerp/business/allserieslist", &platform.PLearnController{}, "post:AllSeiesList")  //获取系列课列表

	beego.Router("/butlerp/business/taglist", &platform.PLearnController{}, "post:Taglist")             //获取课程分类列表
	beego.Router("/butlerp/business/islive", &platform.PLearnController{}, "post:IsLive")               //是否有课程正在直播中
	beego.Router("/butlerp/business/discountlist", &platform.PLearnController{}, "post:DiscountList")   //限时低价列表
	beego.Router("/butlerp/business/moddiscount", &platform.PLearnController{}, "post:ModDiscount")     //修改限时低价表信息(活动价、开始时间、结束时间)
	beego.Router("/butlerp/business/adddiscount", &platform.PLearnController{}, "post:AddDiscount")     //新增限时低价表信息(活动价、开始时间、结束时间)
	beego.Router("/butlerp/business/moddisstate", &platform.PLearnController{}, "post:ModDisState")     //修改限时低价表状态 (置顶、移除、取消置顶)
	beego.Router("/butlerp/business/popupsignle", &platform.PLearnController{}, "post:PopUpSignle")     //筛选单课程列表  optype = 1 免费  2 限时低价 3精品好课 coursetype=0单课程 1系列课
	beego.Router("/butlerp/business/freelist", &platform.PLearnController{}, "post:FreeList")           //免费课程列表
	beego.Router("/butlerp/business/modfreecourse", &platform.PLearnController{}, "post:ModFreeCourse") //修改免费课程 status = 0 下架 status=1上架 status =-1 删除记录  status =2 置顶 status =3 取消置顶
	beego.Router("/butlerp/business/addfreecourse", &platform.PLearnController{}, "post:AddFreeCourse") //新增 免费课程(一次新增多条记录)
	beego.Router("/butlerp/business/starlist", &platform.PLearnController{}, "post:StarList")           //明星主播列表
	beego.Router("/butlerp/business/starhandle", &platform.PLearnController{}, "post:StarHandle")       //明星操作 state = 0下架 1上架   2  移除
	beego.Router("/butlerp/business/starmove", &platform.PLearnController{}, "post:StarMove")           //上下移动 明星直播间   state = "up" or "down"
	beego.Router("/butlerp/business/addstar", &platform.PLearnController{}, "post:AddStar")             //新增明星主播(一次新增多条记录)
	beego.Router("/butlerp/business/greatlist", &platform.PLearnController{}, "post:GreatList")         //精品好课列表
	beego.Router("/butlerp/business/greatmod", &platform.PLearnController{}, "post:GreatMod")           //精品好课 上下架 state = 0下架  state =1上架  (传list数组 greatid,showbanner,coursetype,courseid)
	beego.Router("/butlerp/business/statmain", &platform.PLearnController{}, "post:StatMain")           //学习吧首页统计
	beego.Router("/butlerp/business/statroom", &platform.PLearnController{}, "post:StatRoom")           //直播间统计数据
	//------------------------------------------------------------------------------------------------------------
	beego.Router("/butlerp/business/applylist", &platform.PLearnController{}, "post:ApplyList") //开通直播间申请列表
	beego.Router("/butlerp/business/modapply", &platform.PLearnController{}, "post:ModApply")   //修改申请状态

	beego.Router("/butlerp/business/getmemberlist", &platform.PLearnController{}, "post:GetMemberList")   //获取成员列表
	beego.Router("/butlerp/business/settingsmember", &platform.PLearnController{}, "post:SettingsMember") //设置成员状态
	beego.Router("/butlerp/business/getrolelist", &platform.PLearnController{}, "post:GetRoleList")       //获取角色列表
	beego.Router("/butlerp/business/addmember", &platform.PLearnController{}, "post:AddMemober")          //添加用户  必填 userid role
	beego.Router("/butlerp/business/checkmember", &platform.PLearnController{}, "post:CheckMemober")      //查询校验用户是否可添加
	beego.Router("/butlerp/business/loginout", &platform.PLearnController{}, "post:UserLoginOut")         //登出

	beego.Router("/butlerp/business/uploadpic", &platform.PLearnController{}, "post:UploadPic") //图片上传


	//---------------------------------------------2019-11-25 wy新增---------------------------------------------------------------

	beego.Router("/butlerp/business/searchUsers", &platform.PLearnController{}, "post:SearchUsers")
	beego.Router("/butlerp/business/getConsultantList", &platform.PLearnController{}, "post:GetConsultantList") //客服列表
	beego.Router("/butlerp/business/addOrDelConsultant", &platform.PLearnController{}, "post:AddOrDelConsultant")


	beego.Router("/butlerp/business/searchConsultSignle", &platform.PLearnController{}, "post:SearchConsultSignle")
	beego.Router("/butlerp/business/searchConsultSeries", &platform.PLearnController{}, "post:SearchConsultSeries")
	beego.Router("/butlerp/business/getConsultCourseList", &platform.PLearnController{}, "post:GetConsultCourseList")
	beego.Router("/butlerp/business/addOrDelConsultCourse", &platform.PLearnController{}, "post:AddOrDelConsultCourse")
}
