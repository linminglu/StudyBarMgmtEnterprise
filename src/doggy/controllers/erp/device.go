// 李晨曦
// 2017-09-05
// 设备管理
package erp

import models "doggy/models/erp"

type DeviceController struct {
	BaseERPController
}

// DeviceManage
// 获取页面
func (t *DeviceController) DeviceManageView() {
	t.TplName = "erp/device/devicemanage.html"
}

// DeviceImageView
// 获取页面
func (t *DeviceController) DeviceImageView() {
	t.TplName = "erp/device/deviceimageview.html"
}

// 设备管理接口
func (t *DeviceController) GetDeviceList() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetDeviceList(param))
	t.Data["json"] = res
	t.ServeJSON()

}

// 患者就诊使用
func (t *DeviceController) GetDevicePatient() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetDevicePatient(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 影像
func (t *DeviceController) GetDevicePatientImg() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetDevicePatientImg(param))
	t.Data["json"] = res
	t.ServeJSON()
}

// 下载影像
func (t *DeviceController) DownloadImage() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DownloadImage(param))
	t.Data["json"] = res
	t.ServeJSON()
}
