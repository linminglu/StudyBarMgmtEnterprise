package erp

import (
	"doggy/gutils"
	models "doggy/models/erp"
	"fmt"
	"log"
	"os"
	"strings"
	"time"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/utils"
	"github.com/tealeg/xlsx"
)

type ERPDJDController struct {
	BaseERPController
}

func (t *ERPDJDController) Prepare() {
	t.BaseERPController.Prepare()
	//商学院权限
	if t.MallAuth == false {
		t.Abort("401")
	}
}

//主页
func (t *ERPDJDController) Index() {
	t.TplName = "erp/oem/djd/index.html"
}

//查询列表
func (t *ERPDJDController) SearchData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.SearchData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//删除
func (t *ERPDJDController) DelData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.DelData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//移除白名单
func (t *ERPDJDController) RemoveData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.RemoveData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//导出EXCEL
func (t *ERPDJDController) ConvertToExcelFile(param, list, totalrow config.LJSON) {

	fileTitle := param.Get("fileTitle").String()
	fieldName := strings.Split(param.Get("fieldName").String(), ",")
	titleName := strings.Split(param.Get("titleName").String(), ",")
	//配置EXCEL文件
	t.EnableRender = false
	var file *xlsx.File
	var sheet *xlsx.Sheet
	var row *xlsx.Row
	var cell *xlsx.Cell
	var err error
	file = xlsx.NewFile()
	sheet, err = file.AddSheet(fileTitle)
	if err != nil {
		log.Fatal(err)
	}

	row = sheet.AddRow()
	for _, v := range titleName {
		cell = row.AddCell()
		cell.Value = v
	}

	for i := 0; i < list.ItemCount(); i++ {
		row = sheet.AddRow()
		for _, v := range fieldName {
			cell = row.AddCell()
			if list.Item(i).Get(v).Interface() != nil {
				//cell.Value = list.Item(i).Get(v).String()
				cell.SetValue(list.Item(i).Get(v).Interface())
			} else {
				cell.Value = ""
			}
		}
	}

	if totalrow.Interface() != nil {
		row = sheet.AddRow()
		cell = row.AddCell()
		cell.Value = "合计"                     //第一列
		for i := 1; i < len(fieldName); i++ { //从第二列开始
			cell = row.AddCell()
			if totalrow.Item(0).Get(fieldName[i]).Interface() != nil {
				//cell.Value = totalrow.Item(0).Get(fieldName[i]).String()
				cell.SetValue(totalrow.Item(0).Get(fieldName[i]).Interface())
			} else {
				cell.Value = ""
			}
		}
	}

	w := t.Ctx.ResponseWriter
	w.Header().Set("Content-Type", "application/vnd.ms-excel;charset=UTF-8")
	w.Header().Set("Pragma", "public")
	w.Header().Set("Expires", "0")
	w.Header().Set("Cache-Control", "must-revalidate, post-check=0, pre-check=0")
	w.Header().Set("Content-Type", "application/force-download")
	w.Header().Set("Content-Type", "application/octet-stream")
	w.Header().Set("Content-Type", "application/download")
	w.Header().Set("Content-Disposition", "attachment;filename="+sheet.Name+time.Now().Format("2006-01-02")+".xlsx")
	w.Header().Set("Content-Transfer-Encoding", "binary")
	err = file.Write(w)
	//err = file.Save("./aa.xlsx")
	if err != nil {
		fmt.Printf(err.Error())
		t.Abort("501")
	}
}

//导出excel
func (t *ERPDJDController) ExportExcel() {

	var param config.LJSON
	if t.Ctx.Input.IsPost() {
		param = t.GetRequestJ()
	} else {
		param.Set("condition").SetString(t.GetString("condition"))
		param.Set("startdate").SetString(t.GetString("startdate"))
		param.Set("enddate").SetString(t.GetString("enddate"))
		param.Set("status").SetString(t.GetString("status"))
		param.Set("page").SetInt64(1)
		param.Set("per_page").SetInt64(10)
	}

	param.Set("fileTitle").SetString("度金贷名单列表")
	param.Set("fieldName").SetString("clinicmobile,dentalid,clinicname,maxmoney,items,checkstatus,createtime")
	param.Set("titleName").SetString("诊所绑定手机号,管家号,诊所名,额度,期数,申请状态,申请时间")
	res, _ := models.SearchData1(param)

	str := "maxmoney"
	res.List.SetColumnFormatInt(str)
	t.ConvertToExcelFile(param, res.List, res.TotalList)
}

//数据详情页
func (t *ERPDJDController) DataDetailPage() {
	param := t.GetRequestJ()
	res := t.CheckJM(models.DataDetailPage(param))
	checkstatus := res.List.Item(0).Get("checkstatus").Int()
	if checkstatus == 1 { //已通过，只能修改
		t.TplName = "erp/oem/djd/agreepage.html"
	} else { //未通过
		t.TplName = "erp/oem/djd/modifypage.html"
	}
}

//获取数据详情
func (t *ERPDJDController) GetDataDetail() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.GetDataDetail(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//修改数据 单纯的修改数据，不修改状态
func (t *ERPDJDController) ModifyDetailData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.ModifyDetailData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//通过数据--前提没有通过的
func (t *ERPDJDController) PassData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.PassData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//拒绝数据
func (t *ERPDJDController) RefuseData() {
	param := t.GetRequestJ()
	res := t.CheckJ(models.RefuseData(param))
	t.Data["json"] = res
	t.ServeJSON()
}

//上传图片
func (t *ERPDJDController) UploadImg() {

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
				data.Info = "度金贷图片存储失败"
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
