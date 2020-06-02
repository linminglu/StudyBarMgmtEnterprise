package models

import (
	"doggy/models/protocols"
	"reflect"
)

var (
	NewMap map[int]*ProtocolMap
)

type ProtocolMap struct {
	Val      reflect.Value
	FuncName string
}

func AddMap(funcid int, p protocols.ProtocolInterface, funcname string) {
	reflectVal := reflect.ValueOf(p)
	if val := reflectVal.MethodByName(funcname); val.IsValid() {
		tmpMap := &ProtocolMap{}
		tmpMap.FuncName = funcname
		tmpMap.Val = reflectVal
		NewMap[funcid] = tmpMap
	} else {
		t := reflect.Indirect(reflectVal).Type()
		panic("'" + funcname + "' method doesn't exist in the customer " + t.Name())
	}
}

func init() {
	NewMap = make(map[int]*ProtocolMap)
}
