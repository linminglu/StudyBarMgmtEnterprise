package utils

import (
	"encoding/base64"
	"fmt"
	"strconv"
	"strings"
)

type LString string

//返回系统默认字符串类型值
func (t *LString) Str() string {
	return string(*t)
}

//设置字符串内容
func (t *LString) Set(s string) {
	*t = LString(s)
}

//当前字符串长度
func (t *LString) Length() int {
	return len(t.Str())
}

//修剪非可见字符
func (t *LString) Trim() LString {
	str := *t
	str.Replace("\t", "")
	str.Replace(" ", "")
	str.Replace("\n", "")
	str.Replace("\r", "")
	return str
}

//转换为Unicode编码格式
func (t *LString) Unicode() LString {
	var json LString
	for _, r := range *t {
		rint := int(r)
		if rint < 128 {
			json += LString(r)
		} else {
			json += "\\u" + LString(strconv.FormatInt(int64(rint), 16))
		}
	}
	return json
}

//返回子串索引
func (t *LString) Find(s string) int {
	return strings.Index(t.Str(), s)
}

//字符串判断是否包含
func (t *LString) Contains(s string) bool {
	return strings.Contains(t.Str(), s)
}

//字符串替换
func (t *LString) Replace(form, to string) LString {
	return LString(strings.Replace(t.Str(), form, to, -1))
}

//字符串分割
func (t *LString) Separate(sep string) []string {
	return strings.Split(t.Str(), sep)
}

//字符串提取
func (t *LString) SubString(pos, length int) LString {
	runes := []rune(t.Str())
	l := pos + length
	if l > len(runes) {
		l = len(runes)
	}
	return LString(runes[pos:l])
}

//转换小写字母
func (t *LString) LowerCase() LString {
	return LString(strings.ToLower(t.Str()))
}

//转换大写字母
func (t *LString) UpperCase() LString {
	return LString(strings.ToUpper(t.Str()))
}

//转换成浮点数
func (t *LString) ToFloat() float64 {
	pos := t.Find("%")
	if pos != -1 {
		s := t.SubString(pos+1, t.Length()-pos-1)
		x := s.ToFloat() / 100
		return x
	}
	fv, _ := strconv.ParseFloat(t.Str(), 64)
	return fv
}

//转换成整数
func (t *LString) ToInt() int {
	iv, _ := strconv.ParseInt(t.Str(), 0, 64)
	return int(iv)
}

//转换成无符号整数
func (t *LString) ToUint() uint {
	uv, _ := strconv.ParseUint(t.Str(), 0, 64)
	return uint(uv)
}

//格式化输出
func (t *LString) Printf(format string, a ...interface{}) {
	*t = LString(fmt.Sprintf(format, a...))
}

const (
	base64Table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
)

//Base64编码
func (t *LString) Base64Encode() LString {
	b64 := base64.NewEncoding(base64Table)
	return LString(b64.EncodeToString([]byte(*t)))
}

//Base64解码
func (t *LString) Base64Decode() LString {
	b64 := base64.NewEncoding(base64Table)
	s, _ := b64.DecodeString(t.Str())
	return LString(s)
}

//浮点数格式化输出 如1,234,456.78
func (t *LString) FloatToFormatStr(val float64, scale int) {
	var v1 int = int(val)
	v2 := val - float64(v1)
	p := "%." + strconv.Itoa(scale) + "f"
	var str LString
	str.Printf(p, v2)
	var msg LString
	msg.IntToFormatStr(v1)
	pos := str.Find(".")
	if v1 == 0 && val < 0 {
		msg = "-" + msg
	}
	msg += str.SubString(pos, str.Length()-1)
	*t = msg
}

//无符号整数格式化输出 如1,234,456
func (t *LString) UintToFormatStr(val uint) {
	t.intToFormatStr(strconv.FormatUint(uint64(val), 10))
}

//整数格式化输出 如1,234,456
func (t *LString) IntToFormatStr(val int) {
	t.intToFormatStr(strconv.Itoa(val))
}
func (t *LString) intToFormatStr(val string) {
	if len(val) <= 3 {
		t.Set(val)
		return
	}
	x := 0
	y := 0
	if val[0] == '-' {
		x = (len(val) - 1) / 3
		y = (len(val) - 1) % 3
	} else {
		x = len(val) / 3
		y = len(val) % 3
	}
	if y == 0 && x != 0 {
		x--
	}
	if x == 0 {
		t.Set(val)
		return
	}
	iSize := len(val) + x
	des := make([]rune, iSize)
	src := []rune(val)
	j := len(src) - 1
	k := 0
	for i := iSize - 1; i >= 0; i-- {
		if k == 3 && x != 0 {
			des[i] = ','
			x--
			k = 0
		} else {
			des[i] = src[j]
			j--
			k++
		}
	}
	t.Set(string(des))
}
