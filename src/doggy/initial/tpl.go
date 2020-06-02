package initial

import (
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"path/filepath"
	"strings"

	"github.com/astaxie/beego/config"
)

var TplString = ""

//初始化模板数据
func InitTpl() {
	dat, err := ioutil.ReadFile(getCurrentDirectory() + "/conf/tpl.conf")
	if err != nil {
		log.Println(err, "\ntpl.conf读取失败")
	}

	var param config.LJSON
	err = param.Load(string(dat))
	if err != nil {
		log.Println(err, "\ntpl.conf读取失败")
	}

	for i := 0; i < param.ItemCount(); i++ {
		if param.Item(i).Get("No").String() == "" {
			log.Println(fmt.Sprintf("第%d行的No为空", i+1))
		}
		if param.Item(i).Get("Path").String() == "" {
			log.Println(fmt.Sprintf("第%d行的Path为空", i+1))
		}
		if param.Item(i).Get("Picurl").String() == "" {
			log.Println(fmt.Sprintf("第%d行的Picurl为空", i+1))
		}
	}

	TplString = string(dat)
}

//获取当前路径
func getCurrentDirectory() string {
	dir, err := filepath.Abs(filepath.Dir(os.Args[0]))
	if err != nil {
		log.Fatal(err)
	}
	return strings.Replace(dir, "\\", "/", -1)
}
