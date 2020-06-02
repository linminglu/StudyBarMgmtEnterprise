package gstring

import (
	"encoding/base64"
	"fmt"
	"strconv"
	"strings"
)

//当前字符串长度
func Length(s string) int {
	return len([]rune(s))
}

//修剪非可见字符
func Trim(s string) string {
	Replace(s, "\t", "")
	Replace(s, " ", "")
	Replace(s, "\n", "")
	Replace(s, "\r", "")
	return s
}

//转换为Unicode编码格式
func Unicode(s string) string {
	var json string
	for _, r := range s {
		rint := int(r)
		if rint < 128 {
			json += string(r)
		} else {
			json += "\\u" + strconv.FormatInt(int64(rint), 16)
		}
	}
	return json
}

//返回子串索引
func Find(s, sep string) int {
	return strings.Index(s, sep)
}

//字符串判断是否包含
func Contains(s, sep string) bool {
	return strings.Contains(s, sep)
}

//字符串替换
func Replace(s, form, to string) string {
	return strings.Replace(s, form, to, -1)
}

//字符串分割
func Split(s, sep string) []string {
	return strings.Split(s, sep)
}

// 子串在字符串的字节位置 按字数算
func LastIndex(str, substr string) int {
	result := strings.LastIndex(str, substr)
	if result >= 0 {
		// 获得子串之前的字符串并转换成[]byte
		prefix := []byte(str)[0:result]
		// 将子串之前的字符串转换成[]rune
		rs := []rune(string(prefix))
		// 获得子串之前的字符串的长度，便是子串在字符串的字符位置
		result = len(rs)
	}
	return result
}

//中文字符串截取
func SubString(str string, begin, length int) (substr string) {
	// 将字符串的转换成[]rune
	rs := []rune(str)
	lth := len(rs)
	// 简单的越界判断
	if begin < 0 {
		begin = 0
	}
	if begin >= lth {
		begin = lth
	}
	end := begin + length
	if end > lth {
		end = lth
	}
	// 返回子串
	return string(rs[begin:end])
}

//转换小写字母
func ToLower(s string) string {
	return strings.ToLower(s)
}

//转换大写字母
func ToUpper(s string) string {
	return strings.ToUpper(s)
}

//转换成浮点数
func ToFloat(s string) float64 {
	pos := Find(s, "%")
	if pos != -1 {
		y := SubString(s, pos+1, Length(s)-pos-1)
		x := ToFloat(y) / 100
		return x
	}
	fv, _ := strconv.ParseFloat(s, 64)
	return fv
}

//转换成整数
func ToInt(s string) int {
	iv, _ := strconv.ParseInt(s, 0, 64)
	return int(iv)
}

//转换成无符号整数
func ToUint(s string) uint {
	uv, _ := strconv.ParseUint(s, 0, 64)
	return uint(uv)
}

const (
	base64Table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
)

//Base64编码
func Base64Encode(s string) string {
	b64 := base64.NewEncoding(base64Table)
	return b64.EncodeToString([]byte(s))
}

//Base64解码
func Base64Decode(val string) string {
	b64 := base64.NewEncoding(base64Table)
	s, _ := b64.DecodeString(val)
	return string(s)
}

//浮点数格式化输出 如1,234,456.78
func FloatToFormatStr(val float64, scale int) string {
	//var v1 int = int(val)
	//v2 := val - float64(v1)
	//p := "%." + strconv.Itoa(scale) + "f"
	//str := fmt.Sprintf(p, v2)
	//var msg string
	//msg = IntToFormatStr(v1)
	//pos := Find(str, ".")
	//if v1 == 0 && val < 0 {
	//	msg = "-" + msg
	//}
	//msg += SubString(str, pos, len(str)-1)
	//return msg

	// 先格式化一次数据,保证数据准确.
	ts := fmt.Sprintf("%." + strconv.Itoa(scale) + "f", val) //格式化结果是字符串
	v1,_ := strconv.Atoi(ts[0:Find(ts, ".")])
	msg := IntToFormatStr(v1)
	if int(val) == 0 && val < 0 {
		msg = "-" + msg
	}
	msg += SubString(ts, Find(ts, "."), len(ts)-1)
	return msg

}

//无符号整数格式化输出 如1,234,456
func UintToFormatStr(val uint) string {
	return intToFormatStr(strconv.FormatUint(uint64(val), 10))
}

//整数格式化输出 如1,234,456
func IntToFormatStr(val int) string {
	return intToFormatStr(strconv.Itoa(val))
}
func intToFormatStr(val string) string {
	if len(val) <= 3 {
		return val
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
		return val
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
	return string(des)
}
