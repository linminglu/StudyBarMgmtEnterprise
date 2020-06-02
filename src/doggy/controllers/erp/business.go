package erp

import (
	"doggy/gutils"
	models "doggy/models/erp"
	"fmt"
	"os"
	"time"

	"strings"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/utils"
)

// BusinessController ERP关于商学院的模块
type BusinessController struct {
	BaseERPController
}

// Prepare 是BaseERP控制器运行前的预备方法
func (t *BusinessController) Prepare() {
	t.PrepareTime = time.Now()
	admin := t.GetSession("admin")
	if admin == nil {
		t.Redirect("/butlerp", 302)
		// t.Redirect("/studybar/login", 302)
	} else {
		tmp := strings.Split(admin.(string), "|")
		t.UserID = tmp[0]
		t.UserName = tmp[1]
		t.NickName = tmp[2]
		t.Mobile = tmp[3]
		t.RoleID = tmp[4]
		t.ActionGuids = tmp[5]
		t.NoticeAuth = true
		t.ClinicAuth = true
		t.ProAuth = true
		t.UserAuth = true
		t.CollegeAuth = true
		t.MallAuth = true
		t.BusinessAuth = true
		// fmt.Println("=====")
		// fmt.Println(t.ActionGuids, t.NoticeAuth, t.ClinicAuth, t.ProAuth, t.UserAuth)
		// fmt.Println("=====")
		if t.ActionGuids != "" {
			t.NoticeAuth = CheckAuth(NoticeAuthID, t.ActionGuids)
			t.ClinicAuth = CheckAuth(ClinicAuthID, t.ActionGuids)
			t.ProAuth = CheckAuth(ProAuthID, t.ActionGuids)
			t.UserAuth = CheckAuth(UserAuthID, t.ActionGuids)
		}
		//拆分这个字段选取权限节点  设置结构体字段值
	}
}

func (t *BusinessController) Index() {
	t.TplName = "erp/collegenew/index.html"
}
func (t *BusinessController) NewIndex() {
	t.TplName = "erp/collegenew/main_index.html"
}

func (t *BusinessController) StudyAppMgt() {
	t.TplName = "erp/studybarmgt/index.html"
}

//添加主播 -- 手机号搜索功能
func (t *BusinessController) SearchUser() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SearchUser(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//添加主播 -- 将指定用户添加为主播
func (t *BusinessController) SetUser2Anchor() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SetUser2Anchor(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播列表
func (t *BusinessController) AnchorList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播详情
func (t *BusinessController) AnchorInfo() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorInfo(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//修改主播详情
func (t *BusinessController) ModifyAnchorInfo() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModifyAnchorInfo(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播详情页面
func (t *BusinessController) AnchorInfoPage() {
	t.TplName = "erp/collegenew/anchorinfopage.html"
}

//主播收入
func (t *BusinessController) AnchorIncome() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorIncome(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//收入列表页面
func (t *BusinessController) AnchorIncomePage() {
	t.TplName = "erp/collegenew/anchorincomepage.html"
}

//主播支出
func (t *BusinessController) AnchorPayout() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorPayout(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//支出列表页面
func (t *BusinessController) AnchorPayoutPage() {
	t.TplName = "erp/collegenew/anchorpayoutpage.html"
}

//停用、激活、关闭 主播功能
func (t *BusinessController) AnchorSetting() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorSetting(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【系列课】 -- 选择框中的单课程列表
func (t *BusinessController) Seriesofsignlelist() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.Seriesofsignlelist(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【单课程】 -- 单课程列表页面
func (t *BusinessController) SignleListPage() {
	t.TplName = "erp/collegenew/signlelistpage.html"
}

//【单课程】--单课程列表
func (t *BusinessController) SignleList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【单课程】 -- 获取单课程详情页面
func (t *BusinessController) SignleDetailPage() {
	t.TplName = "erp/collegenew/signledetailpage.html"
}

//【单课程】 -- 获取单课程详情
func (t *BusinessController) SignleDetail() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleDetail(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//单课程设置
func (t *BusinessController) SignleSetting() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleSetting(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【单课程】 -- 单课程编辑(新增或者修改)  页面
func (t *BusinessController) AddOrModSignlePage() {
	t.TplName = "erp/collegenew/addormodsignlepage.html"
}

//单课程编辑(新增或者修改)
func (t *BusinessController) AddOrModSignle() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddOrModSignle(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//系列课列表页面
func (t *BusinessController) SeriesListPage() {
	t.TplName = "erp/collegenew/serieslistpage.html"
}

//系列课列表
func (t *BusinessController) SeriesList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//系列课设置
func (t *BusinessController) SeriesSetting() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesSetting(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//获取系列课详情 页面
func (t *BusinessController) SeriesDetailPage() {
	t.TplName = "erp/collegenew/seriesdetailpage.html"
}

//获取系列课详情 (获取系列课中的单课程列表)
func (t *BusinessController) SeriesDetail() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesDetail(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//设置系列课中所有单课程上架
func (t *BusinessController) SetAllSignle() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SetAllSignle(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//系列课【添加单课程】
func (t *BusinessController) SeriesDetailAddSignle() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesDetailAddSignle(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//系列课【删除单课程】
func (t *BusinessController) SeriesDetailDel() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesDetailDel(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//系列课【移动单课程】
func (t *BusinessController) SeriesDetailMove() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesDetailMove(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//分佣比例列表页面
func (t *BusinessController) EmployRateListPage() {
	t.TplName = "erp/collegenew/employratelistpage.html"
}

//兑换码列表
func (t *BusinessController) CodeList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.CodeList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//添加兑换码
func (t *BusinessController) AddCode() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddCode(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//兑换码中的单课程列表
func (t *BusinessController) CodeSignleList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.CodeSignleList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//删除兑换码中的单课程
func (t *BusinessController) DelCodeSignle() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DelCodeSignle(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//分佣比例列表
func (t *BusinessController) EmployRateList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.EmployRateList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//添加分佣比例
func (t *BusinessController) EmployRateAdd() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.EmployRateAdd(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//分佣比例详情列表 页面
func (t *BusinessController) EmployRateUserListPage() {
	t.TplName = "erp/collegenew/employrateuserlistpage.html"
}

//分佣比例详情列表
func (t *BusinessController) EmployRateUserList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.EmployRateUserList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//修改主播的雇佣比例
func (t *BusinessController) ModifyUserEmploy() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModifyUserEmploy(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【首页管理】BANNER 显示列表 页面
func (t *BusinessController) BannerListPage() {
	t.TplName = "erp/collegenew/bannerlistpage.html"
}

//【首页管理】BANNER 显示列表
func (t *BusinessController) BannerList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.BannerList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【首页管理】 新增或修改
func (t *BusinessController) AddOrModBanner() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddOrModBanner(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【首页管理】 删除 0 和下架   2
func (t *BusinessController) BannerSetting() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.BannerSetting(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【首页管理】 移动
func (t *BusinessController) MoveBanner() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.MoveBanner(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【系列课管理】 列表页面
func (t *BusinessController) SeriesHomeListPage() {
	t.TplName = "erp/collegenew/serieshomelistpage.html"
}

// 【系列课管理】 列表
func (t *BusinessController) SeriesHomeList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesHomeList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【系列课管理】移动
func (t *BusinessController) SeriesHomeMove() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesHomeMove(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【系列课管理】上架1、下架2、删除0、 取消置顶0
func (t *BusinessController) SeriesHomeSetting() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesHomeSetting(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【系列课管理】置顶 -- 将当前SignleHomeID 的istop设置为最大值
func (t *BusinessController) SeriesHomeTop() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesHomeTop(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【系列课管理】添加 系列课到主页
func (t *BusinessController) SeriesHomeAddCourse() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SeriesHomeAddCourse(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【系列课】 -- 【新增系列课】
func (t *BusinessController) AddSeries() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AddSeries(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【单课程管理】 列表页面
func (t *BusinessController) SignleHomeListPage() {
	t.TplName = "erp/collegenew/signlehomelistpage.html"
}

// 【单课程管理】 列表
func (t *BusinessController) SignleHomeList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleHomeList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【单课程管理】移动
func (t *BusinessController) SignleHomeMove() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleHomeMove(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【单课程管理】上架1、下架2、删除0、置顶 1 取消置顶0
func (t *BusinessController) SignleHomeSetting() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleHomeSetting(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//【单课程管理】置顶单课程
func (t *BusinessController) SignleHomeTop() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleHomeTop(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 【单课程管理】添加 单课程到主页
func (t *BusinessController) SignleHomeAddCourse() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SignleHomeAddCourse(param))
	t.Data["json"] = res
	t.ServeJSON()
}

///////////////////////////////////统计///////////////////////////////

func (t *BusinessController) TotalStatPage() {
	t.TplName = "erp/collegenew/totalstatpage.html"
}

//概述
func (t *BusinessController) TotalStat() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.TotalStat(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//课程列表
func (t *BusinessController) TotalStatList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.TotalStatList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播收入列表页面
func (t *BusinessController) AnchorStatListPage() {
	t.TplName = "erp/collegenew/anchorstatlistpage.html"
}

//主播收入列表
func (t *BusinessController) AnchorStatList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorStatList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播收入流水页面
func (t *BusinessController) AnchorIncomeListPage() {
	t.TplName = "erp/collegenew/anchorincomelistpage.html"
}

//主播收入流水
func (t *BusinessController) AnchorIncomeList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorIncomeList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播支出页面

func (t *BusinessController) AnchorStatPayOutPage() {
	t.TplName = "erp/collegenew/anchorstatpayoutpage.html"
}

//主播支出
func (t *BusinessController) AnchorStatPayOut() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorStatPayOut(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//主播支出明细页面
func (t *BusinessController) AnchorPayOutListPage() {
	t.TplName = "erp/collegenew/anchorpayoutlistpage.html"
}

//主播支出明细
func (t *BusinessController) AnchorPayOutList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.AnchorPayOutList(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//上传图片
func (t *BusinessController) UploadPic() {
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
