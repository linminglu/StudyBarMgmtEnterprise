package utils

import (
	"crypto/md5"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"io"
	"os"
	"strings"
	"syscall"
	"unicode/utf16"
	"unsafe"

	"github.com/astaxie/beego/utils/gstring"
)

//验证文件是否存在。
func FileExist(filename string) bool {
	var exist = true
	if _, err := os.Stat(filename); os.IsNotExist(err) {
		exist = false
	}
	return exist
}

//在全路径文件名中提取文件名。
func ExtractFileName(fileName string) string {
	size := gstring.LastIndex(fileName, "\\")
	if size == -1 {
		return fileName
	}
	size++
	return gstring.SubString(fileName, size, gstring.Length(fileName)-size+1)
}

//在全路径文件名中提取文件扩展名。
func ExtractFileExt(fileName string) string {
	size := gstring.LastIndex(fileName, ".")
	if size == -1 {
		return ""
	}
	size++
	return gstring.SubString(fileName, size, gstring.Length(fileName)-size+1)
}

//在全路径文件名中提取文件路径。
func ExtractFileDir(fileName string) string {
	fileName = strings.Replace(fileName, "/", "\\", -1)
	pos := gstring.LastIndex(fileName, "\\")
	if pos == -1 {
		return ""
	}
	return gstring.SubString(fileName, 0, pos)
}

//在全路径文件名中提取磁盘号。
func ExtractFileDrive(fileName string) string {
	pos := gstring.Find(fileName, ":")
	if pos == -1 {
		return ""
	}
	return gstring.SubString(fileName, 0, pos+1)
}

//自动在当前目录最后加上\\
func AdjustDir(dir string) string {
	path := gstring.Trim(dir)
	if path == "" {
		return ""
	}
	if path[len(path)-1] != '\\' {
		path += "\\"
	}
	return path
}

//验证目录是否存在。
func DirectoryExists(dir string) bool {
	path := gstring.Trim(dir)
	fi, err := os.Stat(path)
	if err != nil {
		return os.IsExist(err)
	} else {
		return fi.IsDir()
	}
	return false
}

//清空目录
func ClearDir(dir string) error {
	err := os.RemoveAll(dir)
	if err != nil {
		return err
	}
	return os.Mkdir(dir, 0)
}

//删除指定目录
func RemoveDir(dir string) bool {
	if DirectoryExists(dir) == false {
		return true
	}
	err := syscall.Rmdir(dir)
	if err != nil {
		return false
	}
	return true
}

//创建一个新目录
func ForceDirectories(dir string) bool {
	if dir == "" {
		return false
	}
	path := ExtractFileDir(dir)
	if DirectoryExists(path) == false {
		if path[len(path)-1] != ':' {
			ForceDirectories(path)
		}
	}
	if DirectoryExists(dir) != true {
		err := syscall.Mkdir(dir, 0)
		if err != nil {
			return false
		}
	}
	return true
}

//替换文件扩展名(extension不带.)
func ChangeFileExt(fileName, extension string) string {
	pos := gstring.LastIndex(fileName, ".")
	if pos == -1 {
		return fileName + extension
	}
	name := fileName[0:pos+1] + extension
	return name
}

// 得到当前执行的exe的全路径文件名，如果失败返回""
func GetApplicationFullName() string {
	var sysproc = syscall.MustLoadDLL("kernel32.dll").MustFindProc("GetModuleFileNameW")
	b := make([]uint16, syscall.MAX_PATH)
	r, _, _ := sysproc.Call(0, uintptr(unsafe.Pointer(&b[0])), uintptr(len(b)))
	n := uint32(r)
	if n == 0 {
		return ""
	}
	return string(utf16.Decode(b[0:n]))
}

//生成32位md5字串
func GetMd5String(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

//生成Guid字串
func GetGuid() string {
	b := make([]byte, 48)

	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		return ""
	}
	return GetMd5String(base64.URLEncoding.EncodeToString(b))
}
