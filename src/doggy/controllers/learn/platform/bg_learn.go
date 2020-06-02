/*
	学习吧后台业务逻辑
*/
package platform

import (
	"doggy/controllers/base"
	"doggy/gutils"
	models "doggy/models/erp"
	"fmt"
	"os"

	"strings"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/utils"
)

type PCommonController struct {
	base.LBaseController
}

func (t *PCommonController) SignleList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

type PLearnController struct {
	base.LBaseController
	Role     string //用户角色
	RoleDesc string //角色描述
	UserID   string //用户账号
}

func (t *PLearnController) Prepare() {
	learn_session := t.GetSession("learn_session")
	if learn_session != nil {
		//sessionStr = userid + "|" + role + "|" + roleDesc
		tmp := strings.Split(learn_session.(string), "|")
		t.UserID = tmp[0]
		t.Role = tmp[1]
		t.RoleDesc = tmp[2]
	} else {
		if t.Ctx.Input.IsPost() {
			var data gutils.LResultAjax
			data.Code = 2
			data.Info = "ok"
			t.Data["json"] = data
			t.ServeJSON()
			t.StopRun()
		} else {
			t.Redirect("/learn/platform/login", 302)
		}
	}
}

//UserLoginOut 登出
func (t *PLearnController) UserLoginOut() {
	t.DelSession("learn_session")
	var data gutils.LResultAjax
	data.Code = 1
	data.Info = "ok"
	t.Data["json"] = data
	t.ServeJSON()
}

//GetMemberList 获取成员列表
func (t *PLearnController) GetMemberList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetMemberList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//SettingsMember 设置成员状态
func (t *PLearnController) SettingsMember() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SettingsMember(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//GetRoleList
func (t *PLearnController) GetRoleList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetRoleList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//AddMemober
func (t *PLearnController) AddMemober() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddMemober(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//CheckMemober
func (t *PLearnController) CheckMemober() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.CheckMemober(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//AllSignleList
func (t *PLearnController) AllSignleList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AllSignleList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//AllSeiesList
func (t *PLearnController) AllSeiesList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AllSeiesList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) MainPage() {
	t.TplName = "erp/collegenew/main_index.html"
}

func (t *PLearnController) Index() {
	t.TplName = "erp/collegenew/index.html"
}
func (t *PLearnController) NewIndex() {
	t.TplName = "erp/collegenew/main_index.html"
}

func (t *PLearnController) StudyAppMgt() {
	t.TplName = "erp/studybarmgt/index.html"
}

//添加主播 -- 手机号搜索功能
func (t *PLearnController) SearchUser() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SearchUser(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//添加主播 -- 将指定用户添加为主播
func (t *PLearnController) SetUser2Anchor() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SetUser2Anchor(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播列表
func (t *PLearnController) AnchorList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播详情
func (t *PLearnController) AnchorInfo() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorInfo(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//修改主播详情
func (t *PLearnController) ModifyAnchorInfo() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModifyAnchorInfo(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播详情页面
func (t *PLearnController) AnchorInfoPage() {
	t.TplName = "erp/collegenew/anchorinfopage.html"
}

//主播收入
func (t *PLearnController) AnchorIncome() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorIncome(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//收入列表页面
func (t *PLearnController) AnchorIncomePage() {
	t.TplName = "erp/collegenew/anchorincomepage.html"
}

//主播支出
func (t *PLearnController) AnchorPayout() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorPayout(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//支出列表页面
func (t *PLearnController) AnchorPayoutPage() {
	t.TplName = "erp/collegenew/anchorpayoutpage.html"
}

//停用、激活、关闭 主播功能
func (t *PLearnController) AnchorSetting() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorSetting(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【系列课】 -- 选择框中的单课程列表
func (t *PLearnController) Seriesofsignlelist() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.Seriesofsignlelist(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【单课程】 -- 单课程列表页面
func (t *PLearnController) SignleListPage() {
	t.TplName = "erp/collegenew/signlelistpage.html"
}

//【单课程】--单课程列表
func (t *PLearnController) SignleList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【单课程】 -- 获取单课程详情页面
func (t *PLearnController) SignleDetailPage() {
	t.TplName = "erp/collegenew/signledetailpage.html"
}

//【单课程】 -- 获取单课程详情
func (t *PLearnController) SignleDetail() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleDetail(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//单课程设置
func (t *PLearnController) SignleSetting() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleSetting(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【单课程】 -- 单课程编辑(新增或者修改)  页面
func (t *PLearnController) AddOrModSignlePage() {
	t.TplName = "erp/collegenew/addormodsignlepage.html"
}

//单课程编辑(新增或者修改)
func (t *PLearnController) AddOrModSignle() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddOrModSignle(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//获取推流地址
func (t *PLearnController) GetPushUrl() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetPushUrl(param))
	t.Data["json"] = res
	t.ServeJSON()
}


//获取播流地址
func (t *PLearnController) GetPlayUrl() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetPlayUrl(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//获取点播列表
func (t *PLearnController) GetVodList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetVodList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//获取点播播放列表
func (t *PLearnController) GetVodPlayUrlList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetVodPlayUrlList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//获取视频上传凭证
func (t *PLearnController) GetVideoUploadInfo() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetVideoUploadInfo(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//刷新视频上传凭证
func (t *PLearnController) RefreshVideoUploadInfo() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.RefreshVideoUploadInfo(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//系列课列表页面
func (t *PLearnController) SeriesListPage() {
	t.TplName = "erp/collegenew/serieslistpage.html"
}

//系列课列表
func (t *PLearnController) SeriesList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//系列课设置
func (t *PLearnController) SeriesSetting() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesSetting(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//获取系列课详情 页面
func (t *PLearnController) SeriesDetailPage() {
	t.TplName = "erp/collegenew/seriesdetailpage.html"
}

//获取系列课详情 (获取系列课中的单课程列表)
func (t *PLearnController) SeriesDetail() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesDetail(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//获取系列课详情
func (t *PLearnController) SeriesInfo() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesInfo(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//设置系列课中所有单课程上架
func (t *PLearnController) SetAllSignle() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SetAllSignle(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//系列课【添加单课程】
func (t *PLearnController) SeriesDetailAddSignle() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesDetailAddSignle(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//系列课【删除单课程】
func (t *PLearnController) SeriesDetailDel() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesDetailDel(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//系列课【移动单课程】
func (t *PLearnController) SeriesDetailMove() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesDetailMove(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//分佣比例列表页面
func (t *PLearnController) EmployRateListPage() {
	t.TplName = "erp/collegenew/employratelistpage.html"
}

//兑换码列表
func (t *PLearnController) CodeList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.CodeList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//添加兑换码
func (t *PLearnController) AddCode() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddCode(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//兑换码中的单课程列表
func (t *PLearnController) CodeSignleList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.CodeSignleList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//删除兑换码中的单课程
func (t *PLearnController) DelCodeSignle() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DelCodeSignle(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//分佣比例列表
func (t *PLearnController) EmployRateList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.EmployRateList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//添加分佣比例
func (t *PLearnController) EmployRateAdd() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.EmployRateAdd(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//分佣比例详情列表 页面
func (t *PLearnController) EmployRateUserListPage() {
	t.TplName = "erp/collegenew/employrateuserlistpage.html"
}

//分佣比例详情列表
func (t *PLearnController) EmployRateUserList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.EmployRateUserList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//修改主播的雇佣比例
func (t *PLearnController) ModifyUserEmploy() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModifyUserEmploy(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【首页管理】BANNER 显示列表 页面
func (t *PLearnController) BannerListPage() {
	t.TplName = "erp/collegenew/bannerlistpage.html"
}

//【首页管理】BANNER 显示列表
func (t *PLearnController) BannerList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.BannerList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【首页管理】 新增或修改
func (t *PLearnController) AddOrModBanner() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddOrModBanner(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【首页管理】 删除 0 和下架   2
func (t *PLearnController) BannerSetting() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.BannerSetting(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【首页管理】 移动
func (t *PLearnController) MoveBanner() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.MoveBanner(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【系列课管理】 列表页面
func (t *PLearnController) SeriesHomeListPage() {
	t.TplName = "erp/collegenew/serieshomelistpage.html"
}

// 【系列课管理】 列表
func (t *PLearnController) SeriesHomeList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesHomeList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【系列课管理】移动
func (t *PLearnController) SeriesHomeMove() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesHomeMove(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【系列课管理】上架1、下架2、删除0、 取消置顶0
func (t *PLearnController) SeriesHomeSetting() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesHomeSetting(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【系列课管理】置顶 -- 将当前SignleHomeID 的istop设置为最大值
func (t *PLearnController) SeriesHomeTop() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesHomeTop(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【系列课管理】添加 系列课到主页
func (t *PLearnController) SeriesHomeAddCourse() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesHomeAddCourse(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【系列课】 -- 【新增系列课】
func (t *PLearnController) AddSeries() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddSeries(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【系列课】 -- 【修改系列课】
func (t *PLearnController) ModSeries() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModSeries(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【单课程管理】 列表页面
func (t *PLearnController) SignleHomeListPage() {
	t.TplName = "erp/collegenew/signlehomelistpage.html"
}

// 【单课程管理】 列表
func (t *PLearnController) SignleHomeList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleHomeList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【单课程管理】移动
func (t *PLearnController) SignleHomeMove() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleHomeMove(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【单课程管理】上架1、下架2、删除0、置顶 1 取消置顶0
func (t *PLearnController) SignleHomeSetting() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleHomeSetting(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【单课程管理】置顶单课程
func (t *PLearnController) SignleHomeTop() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleHomeTop(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【单课程管理】添加 单课程到主页
func (t *PLearnController) SignleHomeAddCourse() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleHomeAddCourse(param))
	t.Data["json"] = res
	t.ServeJSON()
}

///////////////////////////////////统计///////////////////////////////

func (t *PLearnController) TotalStatPage() {
	t.TplName = "erp/collegenew/totalstatpage.html"
}

//概述
func (t *PLearnController) TotalStat() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.TotalStat(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//课程列表
func (t *PLearnController) TotalStatList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.TotalStatList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播收入列表页面
func (t *PLearnController) AnchorStatListPage() {
	t.TplName = "erp/collegenew/anchorstatlistpage.html"
}

//主播收入列表
func (t *PLearnController) AnchorStatList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorStatList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播收入流水页面
func (t *PLearnController) AnchorIncomeListPage() {
	t.TplName = "erp/collegenew/anchorincomelistpage.html"
}

//主播收入流水
func (t *PLearnController) AnchorIncomeList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorIncomeList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播支出页面

func (t *PLearnController) AnchorStatPayOutPage() {
	t.TplName = "erp/collegenew/anchorstatpayoutpage.html"
}

//主播支出
func (t *PLearnController) AnchorStatPayOut() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorStatPayOut(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播支出明细页面
func (t *PLearnController) AnchorPayOutListPage() {
	t.TplName = "erp/collegenew/anchorpayoutlistpage.html"
}

//主播支出明细
func (t *PLearnController) AnchorPayOutList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorPayOutList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//开通直播间申请列表
func (t *PLearnController) ApplyList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ApplyList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//修改申请状态
func (t *PLearnController) ModApply() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModApply(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//获取分类列表
func (t *PLearnController) Taglist() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.Taglist(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//获取直播间是否有正在直播的课程
func (t *PLearnController) IsLive() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.IsLive(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//限时低价课程列表
func (t *PLearnController) DiscountList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DiscountList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//免费课程列表
func (t *PLearnController) FreeList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.FreeList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//选择课程弹窗的 课程列表
func (t *PLearnController) PopUpSignle() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.PopUpSignle(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) AddDiscount() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddDiscount(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) ModDisState() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModDisState(param))
	t.Data["json"] = res
	t.ServeJSON()
}
func (t *PLearnController) ModDiscount() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModDiscount(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) ModFreeCourse() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModFreeCourse(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) StarList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.StarList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) StarHandle() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.StarHandle(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) StarMove() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.StarMove(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) GreatList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GreatList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) GreatMod() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GreatMod(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//AddFreeCourse 新增免费课程
func (t *PLearnController) AddFreeCourse() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddFreeCourse(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) AddStar() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddStar(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) StatMain() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.StatMain(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) StatRoom() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.StatRoom(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//上传图片
func (t *PLearnController) UploadPic() {
	f, _, err := t.GetFile("file")

	if err != nil {
		fmt.Println("getfile err", err)
		var data gutils.LResultAjax
		data.Code = 0
		data.Info = "获取文件失败"
		t.Data["json"] = data
		t.ServeJSON()
	} else {
		param := t.GetRequestJ()
		//fmt.Println(param.ToString())
		fileType := param.Get("filetype").String()
		fileType = strings.ToLower(fileType)
		if fileType == "jpeg" {
			fileType = "jpg"
		}
		if fileType != "jpg" && fileType != "png" {
			var data gutils.LResultAjax
			data.Code = 0
			data.Info = "图片类型错误"
			t.Data["json"] = data
			t.ServeJSON()
			return
		} else {
			//			var fileSize int64
			//			if sizeInterface, ok := f.(Sizer); ok {
			//				fileSize = sizeInterface.Size()
			//			}
			path := utils.GetApplicationFullName()
			dir := utils.ExtractFileDir(path) + "\\Cache\\"
			utils.ForceDirectories(dir)
			imageid := gutils.CreateSTRGUID()
			dest := imageid + "." + fileType
			src := dir + dest
			err = t.SaveToFile("file", src)
			if err != nil {
				var data gutils.LResultAjax
				data.Code = 0
				data.Info = "图片存储失败"
				t.Data["json"] = data
				t.ServeJSON()
				return
			}

			var flyParam config.LJSON
			flyParam.Set("funcid").SetInt(gutils.FUNC_ID_UPLOAD_IMAGE)
			flyParam.Set("src").SetString(src)
			flyParam.Set("dest").SetString(dest)
			res := gutils.FlybearCPlus(flyParam)
			code := res.Get("code").Int()
			if code == 0 {
				var data gutils.LResultAjax
				data.Code = 1
				data.Info = res.Get("info").String()
				t.Data["json"] = data
				t.ServeJSON()
				return
			}
			f.Close()
			url := res.Get("data").Get("records").Item(0).Get("url").String()
			os.Remove(src) //删除文件
			var data gutils.LResultAjax
			data.Code = 1
			data.Info = "ok"
			var obj config.LJSON
			obj.Set("url").SetString(url)
			data.List = obj.Interface()
			t.Data["json"] = data
			t.ServeJSON()
		}
	}
	return
}

//查询user（不在客服表中）
func (t *PLearnController) SearchUsers() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SearchUsers(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//客服列表
func (t *PLearnController) GetConsultantList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetConsultantList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//删除指定客服
func (t *PLearnController) AddOrDelConsultant() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddOrDelConsultant(param))
	t.Data["json"] = res
	t.ServeJSON()
}



func (t *PLearnController) SearchConsultSignle() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SearchConsultSignle(param))
	t.Data["json"] = res
	t.ServeJSON()
}

func (t *PLearnController) SearchConsultSeries() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SearchConsultSeries(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//客服的课程列表
func (t *PLearnController) GetConsultCourseList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetConsultCourseList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//客服的课程列表
func (t *PLearnController) AddOrDelConsultCourse() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddOrDelConsultCourse(param))
	t.Data["json"] = res
	t.ServeJSON()
}
