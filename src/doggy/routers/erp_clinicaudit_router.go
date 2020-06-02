//author:  易祖平 2017-03-09
//purpose： 后台诊所审核模块  产品管理模块
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

	//门诊审核 批量导入
	beego.Router("/butlerp/clinicaudit/importpage", &erp.ClinicAuditController{}, "get:ImportPage")          //导入网页
	beego.Router("/butlerp/clinicaudit/importclinic", &erp.ClinicAuditController{}, "post:ImportClinic")     //批量导入诊所checkstatus=0
	beego.Router("/butlerp/clinicaudit/delclinic", &erp.ClinicAuditController{}, "post:DelClinic")           //删除待完善的诊所
	beego.Router("/butlerp/clinicaudit/finishpage", &erp.ClinicAuditController{}, "get:FinishPage")          //待完善网页(修改复用)
	beego.Router("/butlerp/clinicaudit/finishpagedata", &erp.ClinicAuditController{}, "post:FinishPageData") //待完善网页数据(修改复用)
	beego.Router("/butlerp/clinicaudit/modifyapply", &erp.ClinicAuditController{}, "post:ModifyApply")       //针对未审核通过的诊所0<checkstatus<4，后台可以对内容进行微调

	//门诊审核 路由
	beego.Router("/butlerp/clinicaudit/addclinic", &erp.ClinicAuditController{}, "get:AddClinic")             //后台添加门诊网页
	beego.Router("/butlerp/clinicaudit/commitapply", &erp.ClinicAuditController{}, "post:CommitApply")        //后台门诊数据提交
	beego.Router("/butlerp/clinicaudit/getdental", &erp.ClinicAuditController{}, "post:GetDental")            //根据手机号,获取改手机号下绑定的诊所
	beego.Router("/butlerp/clinicaudit/clinics", &erp.ClinicAuditController{}, "get,post:ERPClinicAuditList") // 门诊审核列表
	beego.Router("/butlerp/clinicaudit/examineenter", &erp.ClinicAuditController{}, "get:ExamineEnter")       // 审核页面
	beego.Router("/butlerp/clinicaudit/examineresult", &erp.ClinicAuditController{}, "Post:ExamineResult")    // 审核结果提交
	beego.Router("/butlerp/clinicaudit/signup", &erp.ClinicAuditController{}, "Post:SignUp")                  // 签约操作
	beego.Router("/butlerp/clinicaudit/viewauditenter", &erp.ClinicAuditController{}, "get:ViewAuditEnter")   // 查看页面
	beego.Router("/butlerp/clinicaudit/viewaudit", &erp.ClinicAuditController{}, "get:ViewAudit")             // 查看数据
	//平安诊所key和partnerid录入页面
	beego.Router("/butlerp/clinicaudit/signclinic", &erp.ClinicAuditController{}, "get:SignClinic")          //已签约并未过期诊所列表页面
	beego.Router("/butlerp/clinicaudit/signclinicdata", &erp.ClinicAuditController{}, "post:SignClinicData") //列表数据
	beego.Router("/butlerp/clinicaudit/modifydata", &erp.ClinicAuditController{}, "post:ModifyData")         //修改签约诊所平安key和partnerid
	//产品管理 路由
	beego.Router("/butlerp/product/GetProList", &erp.ProductController{}, "get,post:GetProList") // 产品列表
	beego.Router("/butlerp/product/AddNewProTpl", &erp.ProductController{}, "get:AddNewProTpl")  // 添加新产品 静态网页
	beego.Router("/butlerp/product/AddNewPro", &erp.ProductController{}, "post:AddNewPro")       // 添加新产品 提交数据
	beego.Router("/butlerp/product/UpdatePro", &erp.ProductController{}, "post:UpdatePro")       //	更新产品包 提交数据
	beego.Router("/butlerp/product/DelPro", &erp.ProductController{}, "post:DelPro")             //	删除产品包 提交数据
	beego.Router("/butlerp/product/ViewPro", &erp.ProductController{}, "get,post:ViewPro")       // 查看产品包

	beego.Router("/butlerp/product/CliAndProYesRelation", &erp.ProductController{}, "post:CliAndProYesRelation") // 已经加入该产品的诊所
	beego.Router("/butlerp/product/CliAndProNoRelation", &erp.ProductController{}, "post:CliAndProNoRelation")   // 已经签约未加入该产品的诊所

	beego.Router("/butlerp/product/CliManage", &erp.ProductController{}, "get:CliManage")      // 门诊管理
	beego.Router("/butlerp/product/AddRelation", &erp.ProductController{}, "post:AddRelation") // 添加产品诊所关系
	beego.Router("/butlerp/product/DelRelation", &erp.ProductController{}, "post:DelRelation") // 解除产品诊所关系
	//门诊产品 通过门诊查看产品

	beego.Router("/butlerp/product/clinicpro", &erp.ProductController{}, "get:ClinicPro")                    //门诊产品 静态网页
	beego.Router("/butlerp/product/getclinicpro", &erp.ProductController{}, "post:GetClinicPro")             ///门诊产品数据
	beego.Router("/butlerp/product/clinicprodetail", &erp.ProductController{}, "get:ClinicProDetail")        //门诊产品查看详情 静态网页
	beego.Router("/butlerp/product/getclinicprodetail", &erp.ProductController{}, "post:GetClinicProDetail") //门诊产品详情数据
	//消费明细
	beego.Router("/butlerp/product/consumepage", &erp.ProductController{}, "get:ConsumePage")  //消费网页
	beego.Router("/butlerp/product/consumedata", &erp.ProductController{}, "post:ConsumeData") //消费数据

	//外部接口
	beego.Router("/butlerp/clinicaudit/clinicinfo", &erp.ExternController{}, "get:ClinicInfo")
	beego.Router("/butlerp/clinic/addclinic", &erp.ExternController{}, "get:AddClinic")            //后台添加门诊网页
	beego.Router("/butlerp/clinic/commitapply", &erp.ExternController{}, "post:CommitApply")       //后台门诊数据提交
	beego.Router("/butlerp/clinic/examineenter", &erp.ExternController{}, "get:ExamineEnter")      //审核页面
	beego.Router("/butlerp/clinic/examineresult", &erp.ExternController{}, "Post:ExamineResult")   //审核结果提交
	beego.Router("/butlerp/clinic/finishpage", &erp.ExternController{}, "get:FinishPage")          //待完善网页(修改复用)
	beego.Router("/butlerp/clinic/finishpagedata", &erp.ExternController{}, "post:FinishPageData") //待完善网页数据(修改复用)
	beego.Router("/butlerp/clinic/modifyapply", &erp.ExternController{}, "post:ModifyApply")       //针对未审核通过的诊所0<checkstatus<4，后台可以对内容进行微调

	//诊所信息汇总页面  http://115.28.139.39:8100/paweb/uploadimage
	beego.Router("/butlerp/info/clinicpage", &erp.ExternController{}, "get:ClinicPage")        //诊所基本资料页面
	beego.Router("/butlerp/info/getclinicdata", &erp.ExternController{}, "post:GetClinicData") //获取基本资料数据
	beego.Router("/butlerp/info/modclinicdata", &erp.ExternController{}, "post:ModClinicData") //修改基本资料数据
	//暂时不用
	beego.Router("/butlerp/clinic/viewauditenter", &erp.ExternController{}, "get:ViewAuditEnter") // 查看页面
	beego.Router("/butlerp/clinic/viewaudit", &erp.ExternController{}, "get:ViewAudit")           // 查看数据

	// 2017-09-05 BY 李晨曦 设备影像中心
	beego.Router("/butlerp/device/devicemanageview", &erp.DeviceController{}, "get:DeviceManageView")        // 查看设备页面
	beego.Router("/butlerp/device/getdevicelist", &erp.DeviceController{}, "post:GetDeviceList")             // 查看页面
	beego.Router("/butlerp/device/getdevicepatient", &erp.DeviceController{}, "post:GetDevicePatient")       // 查看患者就诊数据页面
	beego.Router("/butlerp/device/getdevicepatientimg", &erp.DeviceController{}, "post:GetDevicePatientImg") // 查看患者就诊数据页面
	beego.Router("/butlerp/device/deviceimageview", &erp.DeviceController{}, "get:DeviceImageView")          // 查看影像页面
	beego.Router("/butlerp/device/downloadimage", &erp.DeviceController{}, "Post:DownloadImage")             // 影像下载

}
