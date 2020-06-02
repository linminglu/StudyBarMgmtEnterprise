package routers

import (
	"doggy/controllers/erp"

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

	beego.Router("/butlerp/djd/index", &erp.ERPDJDController{}, "get:Index")                        //度金贷首页
	beego.Router("/butlerp/djd/searchdata", &erp.ERPDJDController{}, "post:SearchData")             //度金贷列表数据
	beego.Router("/butlerp/djd/deldata", &erp.ERPDJDController{}, "post:DelData")                   //度金贷删除
	beego.Router("/butlerp/djd/removedata", &erp.ERPDJDController{}, "post:RemoveData")             //度金贷移除白名单
	beego.Router("/butlerp/djd/exportexcel", &erp.ERPDJDController{}, "get:ExportExcel")            //度金贷导出excel
	beego.Router("/butlerp/djd/datadetailpage", &erp.ERPDJDController{}, "get:DataDetailPage")      //度金贷 申请信息页面
	beego.Router("/butlerp/djd/getdatedetail", &erp.ERPDJDController{}, "post:GetDataDetail")       //获取诊所申请详细信息
	beego.Router("/butlerp/djd/modifydetaildata", &erp.ERPDJDController{}, "post:ModifyDetailData") //度金贷 修改数据
	beego.Router("/butlerp/djd/passdata", &erp.ERPDJDController{}, "post:PassData")                 //度金贷 同意申请
	beego.Router("/butlerp/djd/refusedata", &erp.ERPDJDController{}, "post:RefuseData")             //度金贷 拒绝申请
	beego.Router("/butlerp/djd/uploadimg", &erp.ERPDJDController{}, "post:UploadImg")               //度金贷上传图片

}
