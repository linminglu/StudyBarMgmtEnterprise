// Copyright 2014 beego Author. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package config

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"os"
	"reflect"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/astaxie/beego/utils/gstring"
)

// JSONConfig is a json config parser and implements Config interface.
type JSONConfig struct {
}

//json编码解码类型 fussen dylan
type LJSON struct {
	arg     *interface{}
	parent  map[string]interface{}
	param   string
	caseMap map[string]string
	keyc    string
}

// Parse returns a ConfigContainer with parsed json config map.
func (js *JSONConfig) Parse(filename string) (Configer, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, err
	}
	defer file.Close()
	content, err := ioutil.ReadAll(file)
	if err != nil {
		return nil, err
	}

	return js.ParseData(content)
}

// ParseData returns a ConfigContainer with json string
func (js *JSONConfig) ParseData(data []byte) (Configer, error) {
	x := &JSONConfigContainer{
		data: make(map[string]interface{}),
	}
	err := json.Unmarshal(data, &x.data)
	if err != nil {
		var wrappingArray []interface{}
		err2 := json.Unmarshal(data, &wrappingArray)
		if err2 != nil {
			return nil, err
		}
		x.data["rootArray"] = wrappingArray
	}

	x.data = ExpandValueEnvForMap(x.data)

	return x, nil
}

// JSONConfigContainer A Config represents the json configuration.
// Only when get value, support key as section:name type.
type JSONConfigContainer struct {
	data map[string]interface{}
	sync.RWMutex
}

// Bool returns the boolean value for a given key.
func (c *JSONConfigContainer) Bool(key string) (bool, error) {
	val := c.getData(key)
	if val != nil {
		return ParseBool(val)
	}
	return false, fmt.Errorf("not exist key: %q", key)
}

// DefaultBool return the bool value if has no error
// otherwise return the defaultval
func (c *JSONConfigContainer) DefaultBool(key string, defaultval bool) bool {
	if v, err := c.Bool(key); err == nil {
		return v
	}
	return defaultval
}

// Int returns the integer value for a given key.
func (c *JSONConfigContainer) Int(key string) (int, error) {
	val := c.getData(key)
	if val != nil {
		if v, ok := val.(float64); ok {
			return int(v), nil
		}
		return 0, errors.New("not int value")
	}
	return 0, errors.New("not exist key:" + key)
}

// DefaultInt returns the integer value for a given key.
// if err != nil return defaltval
func (c *JSONConfigContainer) DefaultInt(key string, defaultval int) int {
	if v, err := c.Int(key); err == nil {
		return v
	}
	return defaultval
}

// Int64 returns the int64 value for a given key.
func (c *JSONConfigContainer) Int64(key string) (int64, error) {
	val := c.getData(key)
	if val != nil {
		if v, ok := val.(float64); ok {
			return int64(v), nil
		}
		return 0, errors.New("not int64 value")
	}
	return 0, errors.New("not exist key:" + key)
}

// DefaultInt64 returns the int64 value for a given key.
// if err != nil return defaltval
func (c *JSONConfigContainer) DefaultInt64(key string, defaultval int64) int64 {
	if v, err := c.Int64(key); err == nil {
		return v
	}
	return defaultval
}

// Float returns the float value for a given key.
func (c *JSONConfigContainer) Float(key string) (float64, error) {
	val := c.getData(key)
	if val != nil {
		if v, ok := val.(float64); ok {
			return v, nil
		}
		return 0.0, errors.New("not float64 value")
	}
	return 0.0, errors.New("not exist key:" + key)
}

// DefaultFloat returns the float64 value for a given key.
// if err != nil return defaltval
func (c *JSONConfigContainer) DefaultFloat(key string, defaultval float64) float64 {
	if v, err := c.Float(key); err == nil {
		return v
	}
	return defaultval
}

// String returns the string value for a given key.
func (c *JSONConfigContainer) String(key string) string {
	val := c.getData(key)
	if val != nil {
		if v, ok := val.(string); ok {
			return v
		}
	}
	return ""
}

// DefaultString returns the string value for a given key.
// if err != nil return defaltval
func (c *JSONConfigContainer) DefaultString(key string, defaultval string) string {
	// TODO FIXME should not use "" to replace non existence
	if v := c.String(key); v != "" {
		return v
	}
	return defaultval
}

// Strings returns the []string value for a given key.
func (c *JSONConfigContainer) Strings(key string) []string {
	stringVal := c.String(key)
	if stringVal == "" {
		return nil
	}
	return strings.Split(c.String(key), ";")
}

// DefaultStrings returns the []string value for a given key.
// if err != nil return defaltval
func (c *JSONConfigContainer) DefaultStrings(key string, defaultval []string) []string {
	if v := c.Strings(key); v != nil {
		return v
	}
	return defaultval
}

// GetSection returns map for the given section
func (c *JSONConfigContainer) GetSection(section string) (map[string]string, error) {
	if v, ok := c.data[section]; ok {
		return v.(map[string]string), nil
	}
	return nil, errors.New("nonexist section " + section)
}

// SaveConfigFile save the config into file
func (c *JSONConfigContainer) SaveConfigFile(filename string) (err error) {
	// Write configuration file by filename.
	f, err := os.Create(filename)
	if err != nil {
		return err
	}
	defer f.Close()
	b, err := json.MarshalIndent(c.data, "", "  ")
	if err != nil {
		return err
	}
	_, err = f.Write(b)
	return err
}

// Set writes a new value for key.
func (c *JSONConfigContainer) Set(key, val string) error {
	c.Lock()
	defer c.Unlock()
	c.data[key] = val
	return nil
}

// DIY returns the raw value by a given key.
func (c *JSONConfigContainer) DIY(key string) (v interface{}, err error) {
	val := c.getData(key)
	if val != nil {
		return val, nil
	}
	return nil, errors.New("not exist key")
}

// section.key or key
func (c *JSONConfigContainer) getData(key string) interface{} {
	if len(key) == 0 {
		return nil
	}

	c.RLock()
	defer c.RUnlock()

	sectionKeys := strings.Split(key, "::")
	if len(sectionKeys) >= 2 {
		curValue, ok := c.data[sectionKeys[0]]
		if !ok {
			return nil
		}
		for _, key := range sectionKeys[1:] {
			if v, ok := curValue.(map[string]interface{}); ok {
				if curValue, ok = v[key]; !ok {
					return nil
				}
			}
		}
		return curValue
	}
	if v, ok := c.data[key]; ok {
		return v
	}
	return nil
}

func init() {
	Register("json", &JSONConfig{})
}

//json加载 fussen dylan
func (t *LJSON) Load(txt string) error {
	t.caseMap = make(map[string]string)
	t.arg = new(interface{})
	var obj interface{}
	err := json.Unmarshal(([]byte)(txt), &obj)
	var key string
	t.CopyLower(&obj, t.arg, key)
	return err
}

//复制对象 将key转成小写
func (t *LJSON) CopyLower(src *interface{}, dest *interface{}, keyc string) error {
	val := reflect.ValueOf(*src)
	kind := val.Kind()
	switch kind {
	case reflect.String:
		*dest = *src
	case reflect.Float64:
		*dest = *src
	case reflect.Int64:
		*dest = *src
	case reflect.Array, reflect.Slice:
		data, ok := (*src).([]interface{})
		if ok == false {
			err := fmt.Errorf(fmt.Sprint("LJSON::CopyLower,Array convert error ", *src))
			return err
		}
		var x []interface{}
		for i := 0; i < len(data); i++ {
			var child interface{}
			keyk := keyc + "-" + fmt.Sprint(i)
			t.CopyLower(&data[i], &child, keyk)
			x = append(x, child)
			*dest = x
		}
	case reflect.Map:
		data, ok := (*src).(map[string]interface{})
		if ok == false {
			err := fmt.Errorf(fmt.Sprint("LJSON::CopyLower,Map convert error ", *src))
			return err
		}
		x := make(map[string]interface{})
		for k, v := range data {
			klower := strings.ToLower(k)
			var tmp interface{}
			keyk := keyc + "-" + klower
			t.CopyLower(&v, &tmp, keyk)
			x[klower] = tmp
			*dest = x
			t.caseMap[keyk] = k
		}
	}
	return nil
}

//复制对象 重置key为原始大小写
func (t *LJSON) CopyCase(src *interface{}, dest *interface{}, keyc string) error {
	val := reflect.ValueOf(*src)
	kind := val.Kind()
	switch kind {
	case reflect.String:
		*dest = *src
	case reflect.Float64:
		*dest = *src
	case reflect.Int64:
		*dest = *src
	case reflect.Array, reflect.Slice:
		data, ok := (*src).([]interface{})
		if ok == false {
			err := fmt.Errorf(fmt.Sprint("LJSON::CopyLower,Array convert error ", src))
			return err
		}
		var x []interface{}
		for i := 0; i < len(data); i++ {
			var child interface{}
			keycc := keyc + "-" + fmt.Sprint(i)
			t.CopyCase(&data[i], &child, keycc)
			x = append(x, child)
			*dest = x
		}
	case reflect.Map:
		data, ok := (*src).(map[string]interface{})
		if ok == false {
			err := fmt.Errorf(fmt.Sprint("LJSON::CopyLower,Map convert error ", *src))
			return err
		}
		x := make(map[string]interface{})
		for k, v := range data {
			keycc := keyc + "-" + k
			keyCase, ok := t.caseMap[keycc]
			if ok == false {
				keyCase = k
			}
			var tmp interface{}
			t.CopyCase(&v, &tmp, keycc)
			x[keyCase] = tmp
			*dest = x
		}
	}
	return nil
}

//从[]param加载
func (t *LJSON) LoadFrom(maps *[]map[string]interface{}) {
	x, err := json.Marshal(*maps)
	if err == nil {
		t.Load(string(x))
	}
}

func (t *LJSON) IsNULL() bool {
	if t.arg == nil {
		if t.parent == nil {
			return true
		} else {
			_, ok := t.parent[t.param]
			if ok == false {
				return true
			}
		}
	}
	return false
}

//GetElement
func (t *LJSON) Get(param string) (result *LJSON) {
	param = strings.ToLower(param)
	var js LJSON
	js.caseMap = t.caseMap
	if t.parent != nil {
		x, ok := (t.parent[t.param]).(map[string]interface{})
		if ok == true {
			js.parent = x
			js.param = param

		}
	} else {
		if t.arg == nil {
			return &js
		}
		data, ok := (*t.arg).(map[string]interface{})
		if ok == false {
			return &js
		}
		if data == nil {
			return &js
		}
		js.parent = data
		js.param = param
	}
	return &js
}

func (t LJSON) String() string {
	if t.parent != nil {
		val := reflect.ValueOf(t.parent[t.param])
		kind := val.Kind()
		res := ""
		switch kind {
		case reflect.String:
			res = val.String()
		case reflect.Float64:
			res = fmt.Sprintf("%f", val.Float())
		case reflect.Int64:
			res = fmt.Sprintf("%d", val.Int())
		default:
			{
				k, ok := (t.parent[t.param]).(time.Time)
				if ok == true {
					res = k.Format("2006-01-02 15:04:05")
				}
			}
		}
		return res
	} else {
		if t.arg == nil {
			return ""
		}
		val := reflect.ValueOf(t.parent[t.param])
		kind := val.Kind()
		res := ""
		switch kind {
		case reflect.String:
			res = val.String()
		case reflect.Float64:
			res = fmt.Sprintf("%f", val.Float())
		case reflect.Int64:
			res = fmt.Sprintf("%d", val.Int())
		}
		return res
	}
	return ""
}

func (t *LJSON) SetString(val string) {
	if t.parent != nil {
		t.parent[t.param] = val
	} else {
		if t.arg == nil {
			t.arg = new(interface{})
			t.parent = nil
		}
		*t.arg = val
		t.parent = nil
	}
}

//传yyyy-mm-dd格式字符,实际存储为时间
/*func (t *LJSON) SetDate(val string) {
	loc, _ := time.LoadLocation("Local")
	parse, err := time.ParseInLocation("2006-01-02", val, loc)
	if err != nil {
		parse, _ = time.ParseInLocation("2006-01-02 15:04:05", val, loc)
	}
	if t.parent != nil {
		t.parent[t.param] = parse
	} else {
		if t.arg == nil {
			t.arg = new(interface{})
			t.parent = nil
		}
		*t.arg = parse
		t.parent = nil
	}
} */

func (t *LJSON) SetTime(val time.Time) {
	//str := val.Format("2006-01-02 15:04:05")
	//t.SetString(str)
	if t.parent != nil {
		t.parent[t.param] = val
	} else {
		if t.arg == nil {
			t.arg = new(interface{})
			t.parent = nil
		}
		*t.arg = val
		t.parent = nil
	}
}

func (t *LJSON) Time() time.Time {
	if t.parent != nil {
		k, ok := (t.parent[t.param]).(time.Time)
		if ok == true {
			return k
		}

	}

	str := t.String()
	res, err := time.Parse("2006-01-02 15:04:05", str)
	if err != nil {
		res, err = time.Parse("2006-01-02T15:04:05.999999999+08:00", str)
		if err != nil {
			fmt.Println("LJSON.Time," + err.Error())
		}
	}
	return res
}

func (t LJSON) Int64() int64 {
	if t.parent != nil {
		val := reflect.ValueOf(t.parent[t.param])
		kind := val.Kind()
		var res int64
		switch kind {
		case reflect.String:
			s := strings.Replace(val.String(), ",", "", -1)
			res, _ = strconv.ParseInt(strings.Replace(s, ".00", "", 1), 10, 64)
		case reflect.Float64:
			res = int64(val.Float())
		case reflect.Int64:
			res = val.Int()
		}
		return res
	} else {
		if t.arg == nil {
			return 0
		}
		val := reflect.ValueOf(t.parent[t.param])
		kind := val.Kind()
		var res int64
		switch kind {
		case reflect.String:
			s := strings.Replace(val.String(), ",", "", -1)
			res, _ = strconv.ParseInt(strings.Replace(s, ".00", "", 1), 10, 64)
		case reflect.Float64:
			res = int64(val.Float())
		case reflect.Int64:
			res = val.Int()
		}
		return res
	}
	return 0
}

func (t LJSON) Int() int {
	if t.parent != nil {
		val := reflect.ValueOf(t.parent[t.param])
		kind := val.Kind()
		var res int
		switch kind {
		case reflect.String:
			s := strings.Replace(val.String(), ",", "", -1)
			res, _ = strconv.Atoi(strings.Replace(s, ".00", "", 1))
		case reflect.Float64:
			res = int(val.Float())
		case reflect.Int64:
			res = int(val.Int())
		}
		return res
	} else {
		if t.arg == nil {
			return 0
		}
		val := reflect.ValueOf(t.parent[t.param])
		kind := val.Kind()
		var res int
		switch kind {
		case reflect.String:
			s := strings.Replace(val.String(), ",", "", -1)
			res, _ = strconv.Atoi(strings.Replace(s, ".00", "", 1))
		case reflect.Float64:
			res = int(val.Float())
		case reflect.Int64:
			res = int(val.Int())
		}
		return res
	}
	return 0
}

func (t *LJSON) SetInt64(val int64) {
	if t.parent != nil {
		t.parent[t.param] = val
	} else {
		if t.arg == nil {
			t.arg = new(interface{})
			t.parent = nil
		}
		*t.arg = val
		t.parent = nil
	}
}

func (t *LJSON) SetInt(val int) {
	t.SetInt64(int64(val))
}

func (t LJSON) Double() float64 {
	if t.parent != nil {
		val := reflect.ValueOf(t.parent[t.param])
		kind := val.Kind()
		var res float64
		switch kind {
		case reflect.String:
			res, _ = strconv.ParseFloat(strings.Replace(val.String(), ",", "", -1), 64)
		case reflect.Float64:
			res = val.Float()
		case reflect.Int64:
			res = float64(val.Int())
		}
		return res
	} else {
		if t.arg == nil {
			return 0.0
		}
		val := reflect.ValueOf(*t.arg)
		kind := val.Kind()
		var res float64
		switch kind {
		case reflect.String:
			res, _ = strconv.ParseFloat(strings.Replace(val.String(), ",", "", -1), 64)
		case reflect.Float64:
			res = val.Float()
		case reflect.Int64:
			res = float64(val.Int())
		}
		return res
	}
	return 0.0
}

func (t *LJSON) SetDouble(val float64) {
	if t.parent != nil {
		t.parent[t.param] = val
	} else {
		if t.arg == nil {
			t.arg = new(interface{})
			t.parent = nil
		}
		*t.arg = val
		t.parent = nil
	}
}

//SetElement
func (t *LJSON) Set(param string) *LJSON {
	parami := param
	param = strings.ToLower(param)
	if t.caseMap == nil {
		t.caseMap = make(map[string]string)
	}
	var child LJSON
	if t.parent != nil {
		x, ok := (t.parent[t.param]).(map[string]interface{})
		if ok == false {
			x = make(map[string]interface{})
		}
		t.parent[t.param] = x
		child.parent = x
		child.param = param
		child.caseMap = t.caseMap
		child.keyc = t.keyc + "-" + param
		t.caseMap[child.keyc] = parami
		return &child
	}
	var data map[string]interface{}
	var ok bool
	if t.arg == nil {
		ok = false
		t.arg = new(interface{})
	} else {
		data, ok = (*t.arg).(map[string]interface{})
	}
	if ok == false {
		x := make(map[string]interface{})
		*t.arg = x
		child.parent = x
		child.param = param
		child.caseMap = t.caseMap
		child.keyc = t.keyc + "-" + param
		t.caseMap[child.keyc] = parami
		return &child
	}
	child.parent = data
	child.param = param
	child.caseMap = t.caseMap
	child.keyc = t.keyc + "-" + param
	t.caseMap[child.keyc] = parami
	return &child
}

//复制对象
func (t *LJSON) SetObject(obj LJSON) {
	if t.caseMap == nil {
		t.caseMap = make(map[string]string)
	}
	if t.parent != nil {
		t.parent[t.param] = obj.Interface()
		for k, v := range obj.caseMap {
			t.caseMap[t.keyc+k] = v
		}
	} else {
		if t.arg == nil {
			t.arg = new(interface{})
			t.parent = nil
		}
		*t.arg = obj.Interface()
		t.parent = nil
		for k, v := range obj.caseMap {
			t.caseMap[t.keyc+k] = v
		}
	}
}

//数组长度
func (t *LJSON) ItemCount() int {
	if t.parent != nil {
		data, ok := t.parent[t.param].([]interface{})
		if ok == false {
			return 0
		}
		if data == nil {
			return 0
		}
		return len(data)
	}
	if t.arg == nil {
		return 0
	}
	data, ok := (*t.arg).([]interface{})
	if ok == false {
		return 0
	}
	if data == nil {
		return 0
	}
	return len(data)
}

//Map长度
func (t *LJSON) MapCount() int {
	if t.parent != nil {
		data, ok := t.parent[t.param].(map[string]interface{})
		if ok == false {
			return 0
		}
		if data == nil {
			return 0
		}
		return len(data)
	}
	if t.arg == nil {
		return 0
	}
	data, ok := (*t.arg).(map[string]interface{})
	if ok == false {
		return 0
	}
	if data == nil {
		return 0
	}
	return len(data)
}

// 获取数组第index个元素
func (t *LJSON) Item(index int) (result *LJSON) {
	var child LJSON
	child.caseMap = t.caseMap
	if t.parent != nil {
		data, ok := t.parent[t.param].([]interface{})
		if ok == false {
			return &child
		}
		if data == nil {
			return &child
		}
		child.arg = &data[index]
		child.parent = nil
		return &child
	}
	var data []interface{}
	var ok bool
	if t.arg == nil {
		return &child
	}
	data, ok = (*t.arg).([]interface{})
	if ok == false {
		return &child
	}
	if data == nil {
		return &child
	}
	child.arg = &data[index]
	child.parent = nil
	return &child
}

//添加数组元素
func (t *LJSON) AddItem() (result *LJSON) {
	var child LJSON
	var data []interface{}
	if t.caseMap == nil {
		t.caseMap = make(map[string]string)
	}
	if t.parent != nil {
		data, _ = t.parent[t.param].([]interface{})
		var x interface{}
		data = append(data, x)
		t.parent[t.param] = data
		child.arg = &data[len(data)-1]
		child.parent = nil
		child.caseMap = t.caseMap
		child.keyc = t.keyc + "-" + fmt.Sprint(len(data)-1)
		return &child
	}
	if t.arg == nil {
		t.arg = new(interface{})
	} else {
		data, _ = (*t.arg).([]interface{})
	}
	var x interface{}
	data = append(data, x)
	*t.arg = data
	child.arg = &data[len(data)-1]
	child.parent = nil
	child.caseMap = t.caseMap
	child.keyc = t.keyc + "-" + fmt.Sprint(len(data)-1)
	return &child
}

//编码成json字符串 key统一为小写
func (t *LJSON) ToString() (v string, err error) {
	if t.parent != nil {
		x, err1 := json.Marshal(t.parent[t.param])
		result := string(x)
		return result, err1
	}
	if t.arg == nil {
		return "", nil
	}
	x, err1 := json.Marshal(*t.arg)
	result := string(x)
	return result, err1
}

//编码成json字符串 key区分大小写，性能比ToString略差
func (t *LJSON) ToCaseString() (v string, err error) {
	var keyc string
	if t.parent != nil {
		var obj interface{}
		mapx := t.parent[t.param]
		t.CopyCase(&mapx, &obj, keyc)
		x, err1 := json.Marshal(obj)
		result := string(x)
		return result, err1
	}
	if t.arg == nil {
		return "", nil
	}
	var obj interface{}
	t.CopyCase(t.arg, &obj, keyc)
	x, err1 := json.Marshal(obj)
	result := string(x)
	return result, err1
}

//编码成json字符串 key统一为小写
func (t *LJSON) ToStyleString() (v string, err error) {
	if t.parent != nil {
		x, err1 := json.MarshalIndent(t.parent[t.param], " ", "\t")
		result := string(x)
		return result, err1
	}
	if t.arg == nil {
		return "", nil
	}
	x, err1 := json.MarshalIndent(*t.arg, " ", "\t")
	result := string(x)
	return result, err1
}

//获取内部数据
func (t *LJSON) Interface() interface{} {
	if t.parent != nil {
		return t.parent[t.param]
	}
	if t.arg == nil {
		return nil
	}
	return *t.arg
}

func (t *LJSON) InterfaceCase() interface{} {
	var keyc string
	if t.parent != nil {
		var obj interface{}
		mapx := t.parent[t.param]
		t.CopyCase(&mapx, &obj, keyc)
		return obj
	}
	if t.arg == nil {
		return nil
	}
	var obj interface{}
	t.CopyCase(t.arg, &obj, keyc)
	return obj
}

//获取数据类型
func (t *LJSON) Type() reflect.Kind {
	if t.parent != nil {
		val := reflect.ValueOf(t.parent[t.param])
		kind := val.Kind()
		return kind
	} else {
		if t.arg == nil {
			return reflect.Invalid
		}
		val := reflect.ValueOf(*t.arg)
		kind := val.Kind()
		return kind
	}
	return reflect.Invalid
}

//设置数据类型为整形
func (t *LJSON) SetTypeInt() {
	t.SetInt64(t.Int64())
}

//设置数据类型为字符串
func (t *LJSON) SetTypeString() {
	t.SetString(t.String())
}

//设置数据类型为日期
func (t *LJSON) SetTypeDate() {
	val := t.String()
	loc, _ := time.LoadLocation("Local")
	parse, err := time.ParseInLocation("2006-01-02", val, loc)
	if err != nil {
		parse, _ = time.ParseInLocation("2006-01-02 15:04:05", val, loc)
	}
	t.SetTime(parse)
}

//设置数据类型为浮点型
func (t *LJSON) SetTypeDouble() {
	t.SetDouble(t.Double())
}

//获取内部数据
func (t *LJSON) Map() map[string]interface{} {
	if t.parent != nil {
		data, ok := t.parent[t.param].(map[string]interface{})
		if ok == false {
			return nil
		}
		if data == nil {
			return nil
		}
		return data
	}
	if t.arg == nil {
		return nil
	}
	data, ok := (*t.arg).(map[string]interface{})
	if ok == false {
		return nil
	}
	if data == nil {
		return nil
	}
	return data
}

//格式化数组的字段
//keys 字段名，同时设置多个字段用","隔开
//format 格式: 千分位小数1,234.56，千分位整数123,456,日期格式2006年01月02日等
//示例 SetColumnFormat("price,amount","1,234.56");
func (t *LJSON) SetColumnFormat(keys, format string) {
	keylist := gstring.Split(keys, ",")
	count := t.ItemCount()
	if count == 0 {
		count = 1
	}
	for i := 0; i < count; i++ {
		item := t.Item(i)
		if t.Item(i).IsNULL() {
			item = t
		}
		if item.IsNULL() {
			continue
		}
		keyLen := len(keylist)
		for j := 0; j < keyLen; j++ {
			key := keylist[j]
			if format == "1,234.56" {
				if item.Get(key).IsNULL() == false {
					val := item.Get(key).Double()
					str := gstring.FloatToFormatStr(val, 2)
					item.Set(key).SetString(str)
				}
				//扣留小数点4位或是6位
			} else if format == "1,234.567" || format == "1,234.5678" {
				len := 0
				if format == "1,234.567" {
					len = 3
				} else {
					len = 4
				}
				if item.Get(key).IsNULL() == false {
					val := item.Get(key).Double()
					str := gstring.FloatToFormatStr(val, len)
					item.Set(key).SetString(str)
				}
			} else if format == "123,456" {
				if item.Get(key).IsNULL() == false {
					val := item.Get(key).Int()
					str := gstring.IntToFormatStr(val)
					item.Set(key).SetString(str)
				}
			} else if gstring.Contains(format, "2006") || gstring.Contains(format, "15") {
				//时间格式
				if item.Get(key).IsNULL() == false {
					if item.Get(key).String() != "" {
						val := item.Get(key).Time()
						str := val.Format(format)
						item.Set(key).SetString(str)
					}
				}
			} else if format == "****" {
				val := item.Get(key).String()
				if val != "" {
					mob1 := gstring.SubString(val, 0, 3)
					mob2 := gstring.SubString(val, 7, 4)
					str := mob1 + "****" + mob2
					item.Set(key).SetString(str)
				}

			} else if format == "#1,234.56" { //空不用0.00表示,保持空值
				if item.Get(key).IsNULL() == false {
					if item.Get(key).String() != "" {
						val := item.Get(key).Double()
						str := gstring.FloatToFormatStr(val, 2)
						item.Set(key).SetString(str)
					}

				}
			} else if format == "#1,234.567" || format == "#1,234.5678" { //空不用0.00表示,保持空值
				len := 0
				if format == "#1,234.567" {
					len = 3
				} else {
					len = 4
				}
				if item.Get(key).IsNULL() == false {
					if item.Get(key).String() != "" {
						val := item.Get(key).Double()
						str := gstring.FloatToFormatStr(val, len)
						item.Set(key).SetString(str)
					}

				}
			} else if format == "#123,456" { //空不用0表示,保持空值
				if item.Get(key).IsNULL() == false {
					if item.Get(key).String() != "" {
						val := item.Get(key).Int()
						str := gstring.IntToFormatStr(val)
						item.Set(key).SetString(str)
					}
				}
			} else if format == "01,234.56" { //key不存在也用0.00表示
				val := item.Get(key).Double()
				str := gstring.FloatToFormatStr(val, 2)
				item.Set(key).SetString(str)
			} else if format == "0123,456" { //key不存在也用0表示
				val := item.Get(key).Int()
				str := gstring.IntToFormatStr(val)
				item.Set(key).SetString(str)
			} else if format == "cndate" { //消息日期显示
				if item.Get(key).IsNULL() == false {
					if item.Get(key).String() != "" {
						t := item.Get(key).Time()
						yt := time.Now().AddDate(0, 0, -1)
						datestr := ""
						if t.Format("2006-01-02") == time.Now().Format("2006-01-02") {
							hs := t.Format("15")
							h, _ := strconv.Atoi(hs)
							if h >= 6 && h < 8 {
								datestr = t.Format("早上15:04")
							} else if h >= 8 && h < 12 {
								datestr = t.Format("上午15:04")
							} else if h >= 12 && h < 13 {
								datestr = t.Format("中午15:04")
							} else if h >= 13 && h < 18 {
								datestr = t.Format("下午15:04")
							} else if h >= 18 && h < 24 {
								datestr = t.Format("晚上15:04")
							} else {
								datestr = t.Format("凌晨15:04")
							}
						} else if t.Format("2006-01-02") == yt.Format("2006-01-02") {
							datestr = "昨天"
							th := t.Format("15:04")
							if th != "00:00" {
								datestr += th
							}
						} else {
							datestr = t.Format("2006-01-02")
						}
						item.Set(key).SetString(datestr)
					}
				}
			}
		}

	}
}

//格式化数组的字段,去掉千分位
//keys 字段名，同时设置多个字段用","隔开
//示例 SetColumnFormat("price,amount");
func (t *LJSON) SetColumnFormatInt(keys string) {
	keylist := gstring.Split(keys, ",")
	count := t.ItemCount()
	if count > 0 {
		for i := 0; i < count; i++ {
			item := t.Item(i)
			for j := 0; j < len(keylist); j++ {
				key := keylist[j]
				if item.Get(key).IsNULL() == false {
					val := item.Get(key).String()
					if strings.Contains(val, "."); true {
						str, _ := strconv.ParseFloat(strings.Replace(val, ",", "", -1), 64)
						item.Set(key).SetDouble(str)
					} else {
						str, _ := strconv.Atoi(strings.Replace(val, ",", "", -1))
						item.Set(key).SetInt(str)
					}
				}
			}
		}
	} else {
		for j := 0; j < len(keylist); j++ {
			key := keylist[j]
			val := t.Get(key).String()
			if strings.Contains(val, "."); true {
				str, _ := strconv.ParseFloat(strings.Replace(val, ",", "", -1), 64)
				t.Set(key).SetDouble(str)
			} else {
				str, _ := strconv.Atoi(strings.Replace(val, ",", "", -1))
				t.Set(key).SetInt(str)
			}
		}
	}
}

//求某个字段的和(整数或者浮点数)
func (t *LJSON) CalculateColumn(key, format string) (total string) {
	total = ""
	if format == "1,234.56" {
		var val float64 = 0.0
		count := t.ItemCount()
		for i := 0; i < count; i++ {
			item := t.Item(i)
			s := item.Get(key).String()
			s = strings.Replace(s, ",", "", -1)
			vv, _ := strconv.ParseFloat(s, 64)
			val += vv
		}
		total = gstring.FloatToFormatStr(val, 2)

	} else if format == "1,234.567" || format == "1,234.5678" {
		val := 0.0
		len := 0
		if format == "1,234.567" {
			len = 3
		} else {
			len = 4
		}
		count := t.ItemCount()
		for i := 0; i < count; i++ {
			item := t.Item(i)
			s := item.Get(key).String()
			s = strings.Replace(s, ",", "", -1)
			vv, _ := strconv.ParseFloat(s, 64)
			val += vv
		}
		total = gstring.FloatToFormatStr(val, len)

	} else if format == "123,456" {
		var val int = 0
		count := t.ItemCount()
		for i := 0; i < count; i++ {
			item := t.Item(i)
			s := item.Get(key).String()
			s = strings.Replace(s, ",", "", -1)
			vv, _ := strconv.Atoi(s)
			val += vv
		}
		total = gstring.IntToFormatStr(val)
	}
	return
}

//设置数组字段类型
//keys 字段名，同时设置多个字段用","隔开
//types 字段类型: int date  double ,用","隔开,必须是与字段名相同数量
//示例 SetColumnType("price,amount","int,double");
func (t *LJSON) SetColumnType(keys, types string) {
	keylist := gstring.Split(keys, ",")
	typelist := gstring.Split(types, ",")
	if len(keylist) != len(typelist) {
		return
	}
	count := t.ItemCount()
	for i := 0; i < count; i++ {
		item := t.Item(i)
		keyLen := len(keylist)
		for j := 0; j < keyLen; j++ {
			key := keylist[j]
			typ := typelist[j]
			if typ == "int" {
				item.Get(key).SetTypeInt()
			} else if typ == "date" {
				item.Get(key).SetTypeDate()
			} else if typ == "double" {
				item.Get(key).SetTypeDouble()
			}
		}
	}
}
