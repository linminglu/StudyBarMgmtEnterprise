//author:  邓良远 2017-03-01
//purpose： PC端调用接口
package apis

import (
	"doggy/gutils"
	"doggy/models"
	"doggy/models/customer"
	"fmt"
	"reflect"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/logs"
)

const (
	FUNC_ID_GO_GET_VIP = 100001
	FUNC_ID_GO_GET_PAY = 100002

	//会员相关
	FUNC_ID_GO_GET_VIPLEVEL      = 110001 //取会员卡列表
	FUNC_ID_GO_SAVE_VIPCARD      = 110002 //会员开卡
	FUNC_ID_GO_SAVE_VIPRECHARGE  = 110003 //会员充值
	FUNC_ID_GO_SAVE_VIPCHRETURN  = 110004 //会员退费
	FUNC_ID_GO_SAVE_VIPCANCEL    = 110005 //会员注销
	FUNC_ID_GO_SAVE_VIPUPGRADE   = 110006 //会员升级
	FUNC_ID_GO_SAVE_VIPGIVEINT   = 110007 //赠送积分
	FUNC_ID_GO_SAVE_VIPPROMOTION = 110008 //开卡优惠券
	FUNC_ID_GO_GET_WARINGSTORE   = 110009 //预警物品
	FUNC_ID_GO_UPDATE_VIPCARD    = 110010 //修改会员卡
	FUNC_ID_GO_UPDATE_STORE      = 110011 //升级库房

	//FUNC_ID_GO_SAVE_ = 11000 //会员

)

//命令号与功能映射关系
func init() {
	models.AddMap(FUNC_ID_GO_GET_PAY, &customer.LPay{}, "GetPay")
	models.AddMap(FUNC_ID_GO_GET_VIP, &customer.LVip{}, "GetVip")
	models.AddMap(FUNC_ID_GO_GET_VIPLEVEL, &customer.LVip{}, "GetVipLevel")         //取会员卡列表
	models.AddMap(FUNC_ID_GO_SAVE_VIPCARD, &customer.LVip{}, "SaveCustomerVIP")     //会员开卡
	models.AddMap(FUNC_ID_GO_SAVE_VIPRECHARGE, &customer.LVip{}, "VIPRecharge")     //会员充值
	models.AddMap(FUNC_ID_GO_SAVE_VIPCHRETURN, &customer.LVip{}, "VIPChargeReturn") //会员退费
	models.AddMap(FUNC_ID_GO_SAVE_VIPCANCEL, &customer.LVip{}, "VipCardCancel")     //会员注销
	models.AddMap(FUNC_ID_GO_SAVE_VIPUPGRADE, &customer.LVip{}, "VipUpgrade")       //会员升级
	models.AddMap(FUNC_ID_GO_SAVE_VIPGIVEINT, &customer.LVip{}, "VipGiveIntegral")  //赠送积分
	models.AddMap(FUNC_ID_GO_SAVE_VIPPROMOTION, &customer.LVip{}, "VipPromotion")   //开卡优惠券
	models.AddMap(FUNC_ID_GO_GET_WARINGSTORE, &customer.LVip{}, "GetStockWarn")     //预警物品
	models.AddMap(FUNC_ID_GO_UPDATE_VIPCARD, &customer.LVip{}, "VipCardUpdate")     //修改会员卡
	models.AddMap(FUNC_ID_GO_UPDATE_STORE, &customer.LVip{}, "WebStoreUpdate")      //升级库房

}

//函数执行体
func ExecuteAPI(funcid int, param *config.LJSON) (result interface{}, err gutils.LError) {
	if value, ok := models.NewMap[funcid]; ok {
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

type LApiController struct {
	beego.Controller
}

//检查返回的结果错误状态
func (t *LApiController) CheckJ(param interface{}, err gutils.LError) (result config.LJSON) {
	tmp, _ := param.(config.LJSON)
	if err.Code == gutils.AuthError {
		result.Set("code").SetInt(2)
		result.Set("info").SetString("会话鉴权失败")
		return result
	}
	if err.Msg != nil {
		result.Set("code").SetInt(0)
		result.Set("info").SetString(err.Msg.Error())
		return result
	}
	result.Set("data").SetObject(tmp)
	result.Set("code").SetInt(1)
	result.Set("info").SetString("ok")
	return result
}

func (t *LApiController) Echo() {
	var data gutils.LResultAjax
	data.Code = 1
	data.Info = "OK"
	t.Data["json"] = data
	t.ServeJSON()
}

func (t *LApiController) HandleData() {
	param := t.GetString("param")
	var result config.LJSON
	if param == "" {
		additem := result.AddItem()
		additem.Set("code").SetInt(0)
		additem.Set("info").SetString("请求参数不能为空")
		t.Data["json"] = result.Interface()
		t.ServeJSON()
		panic("")
	}
	var obj config.LJSON
	if param[0] == '*' {
		str := param[1:]
		request := gutils.CPlusExecuteGO(gutils.FUNC_ID_GO_DECRYPT, str)
		var err error
		if request[len(request)-1] == 0 {
			x := request[0 : len(request)-1]
			logs.Debug(x)
			err = obj.Load(x)
		} else {
			err = obj.Load(request)
		}

		if err != nil {
			logs.Error("LAppController::HandleData", err)
		}
	} else {
		obj.Load(param)
	}
	count := obj.ItemCount()
	if count == 0 {
		additem := result.AddItem()
		additem.Set("code").SetInt(0)
		additem.Set("info").SetString("参数解析异常")
		t.Data["json"] = result.Interface()
		t.ServeJSON()
		panic("")
	} else {
		for i := 0; i < count; i++ {
			item := obj.Item(i).Get("params")
			funcid := item.Get("funcid").Int()
			if funcid == 0 {
				var tmp config.LJSON
				tmp.Set("code").SetInt(0)
				tmp.Set("info").SetString("funcid不能为空")
				result.AddItem().SetObject(tmp)
				continue
			}

			result.AddItem().SetObject(t.CheckJ(ExecuteAPI(funcid, item)))
		}
	}
	if param[0] == '*' {
		val, err := result.ToString()
		if err != nil {
			logs.Error("LAppController::HandleData", err)
		}
		response := gutils.CPlusExecuteGO(gutils.FUNC_ID_GO_ENCRYPT, val)
		content := []byte(response)
		t.Ctx.Output.Body(content)
		return
	}
	t.Data["json"] = result.Interface()
	t.ServeJSON()
}
