// author: 于绍纳 2017-03-16
// purpose: 平安诊所加盟
package pawebs

import (
	"doggy/gutils"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"strconv"

	"os"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
	"github.com/astaxie/beego/utils"
)

func ClinicSignNum() string {
	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select num from t_clinic_apply_simulate limit ? `
	o.Raw(sql, 1).ValuesJSON(&obj)

	num := obj.Item(0).Get("num").Int()
	num = num + 20

	str := strconv.Itoa(num)
	return str
}

func GetUrl(param config.LJSON) string {
	o := orm.NewOrm()
	var obj config.LJSON
	sql := ` select checkstatus from t_clinic_apply_info where userid=:userid `
	o.RawJSON(sql, param).ValuesJSON(&obj)
	if obj.ItemCount() == 0 { //用户未申请
		return "/paweb/applypage"
	} else { //
		status := obj.Item(0).Get("checkstatus").String()

		if status == "0" { //用户只保存,未提交
			return "/paweb/applypage"
		} else { //用户已经提交
			return "/member/applyprogress"
		}
	}
}

func UploadImage(param config.LJSON) (result gutils.LResultModel, err gutils.LError) {

	picdata := param.Get("picdata").String()
	ext := gutils.SubString(param.Get("ext").String(), 6, 4)
	if ext == "jpeg" {
		ext = "jpg"
	}
	if picdata == "" {
		err.Errorf(gutils.ParamError, "图片数据不能为空")
		return
	}
	if (ext != "png") && (ext != "jpg") {
		err.Errorf(gutils.ParamError, "图片格式错误")
		return
	}
	buf, _ := base64.StdEncoding.DecodeString(picdata) //成图片文件并把文件写入到buffer
	path := utils.GetApplicationFullName()
	dir := utils.ExtractFileDir(path) + "\\Cache\\"
	utils.ForceDirectories(dir)
	dest := fmt.Sprintf("%d", gutils.CreateGUID()) + "." + ext
	src := dir + dest
	if buf == nil {
		err.Errorf(gutils.ParamError, "buf为空")
		return
	}
	err2 := ioutil.WriteFile(src, buf, 0666) //buffer输出到jpg文件中（不做处理，直接写到文件）
	if err2 != nil {
		err.Errorf(gutils.ParamError, "写入缓存数据错误")
		return
	}
	var flyParam config.LJSON
	flyParam.Set("funcid").SetInt(gutils.FUNC_ID_UPLOAD_IMAGE)
	flyParam.Set("src").SetString(src)
	flyParam.Set("dest").SetString(dest)
	res := gutils.FlybearCPlus(flyParam)
	url := res.Get("data").Get("records").Item(0).Get("url").String()
	os.Remove(src) //删除文件
	fmt.Println(url)
	result.List.Set("url").SetString(url)
	result.List.Set("id").SetString(dest)
	return
}
