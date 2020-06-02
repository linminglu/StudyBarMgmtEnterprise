package models

import (
	"course/gutils"
	"course/models/protocols"
	"encoding/base64"
	"fmt"
	"io/ioutil"
	"os"
	"reflect"
	"time"

	"github.com/astaxie/beego/utils"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

var (
	NewMap map[int]*ProtocolMap
)

type ProtocolMap struct {
	Val      reflect.Value
	FuncName string
}

//添加映射关系
func AddMap(funcid int, p protocols.ProtocolInterface, funcname string) {
	reflectVal := reflect.ValueOf(p)
	if val := reflectVal.MethodByName(funcname); val.IsValid() {
		tmpMap := &ProtocolMap{}
		tmpMap.FuncName = funcname
		tmpMap.Val = reflectVal
		NewMap[funcid] = tmpMap
	} else {
		t := reflect.Indirect(reflectVal).Type()
		panic("'" + funcname + "' method doesn't exist in the models " + t.Name())
	}
}

func init() {
	NewMap = make(map[int]*ProtocolMap)
}

//函数执行体
func Execute(funcid int, param *config.LJSON) (result interface{}, err gutils.LError) {

	defer func() {
		if r := recover(); r != nil {
			msg, _ := r.(string)
			err.Msg = fmt.Errorf("%s", msg)
		}
	}()

	if value, ok := NewMap[funcid]; ok {
		in := make([]reflect.Value, 1)
		in[0] = reflect.ValueOf(param)
		funcRes := value.Val.MethodByName(value.FuncName).Call(in)
		result = funcRes[0].Interface()
		err, _ = funcRes[1].Interface().(gutils.LError)

		return
	} else {
		fmt.Println("命令号功能未定义 %d", funcid)
		err.Code = 0
		err.Msg = fmt.Errorf("命令号功能未定义 %d", funcid)
		return
	}
}

func Portrait(param *config.LJSON) (result interface{}, err gutils.LError) {

	beegosession := param.Get("beegosession").String()
	userid := param.Get("userid").String()
	if beegosession == "" {
		err.Msg = fmt.Errorf("%s", "会话鉴权失败1")
		return
	} else {
		o := orm.NewOrm()
		var obj config.LJSON
		sql := ` select userid from t_user where beegosession=? `
		o.Raw(sql, beegosession).ValuesJSON(&obj)
		sessionUserid := obj.Item(0).Get("userid").String()
		if sessionUserid == "" {
			err.Msg = fmt.Errorf("%s", "会话鉴权失败2")
			return
		} else {
			if userid != sessionUserid {
				err.Msg = fmt.Errorf("%s", "会话鉴权失败3")
				return
			}
		}
	}
	picdata := param.Get("picdata").String()
	if picdata == "" {
		err.Msg = fmt.Errorf("%s", "图片数据不能为空")
		return
	}
	ext := param.Get("ext").String()
	if ext == "jpeg" {
		ext = "jpg"
	}

	if (ext != "png") && (ext != "jpg") {
		err.Msg = fmt.Errorf("%s", "仅支持png和jpg格式")
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
	if url == "" {
		err.Msg = fmt.Errorf("%s", "图片上传阿里云失败")
		return
	}
	o := orm.NewOrm()
	sql := ` update t_doctor set picture=?,updatetime=? where doctorid=? `
	_, err.Msg = o.Raw(sql, url, time.Now().Format("2006-01-02 15:04:05"), userid).Exec()
	var obj, data config.LJSON
	obj.Set("url").SetString(url)
	data.Set("records").AddItem().SetObject(obj)
	result = data
	return
}
