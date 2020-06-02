package gutils

import (
	"net"
	"os"
)

//这个ip地址的获取有待考量  我觉得是错的
func GetIp() string {
	addrs, err := net.InterfaceAddrs()

	if err != nil {
		return "error"
	}

	for _, address := range addrs {

		// 检查ip地址判断是否回环地址
		if ipnet, ok := address.(*net.IPNet); ok && !ipnet.IP.IsLoopback() {
			if ipnet.IP.To4() != nil {
				return ipnet.IP.String()
			}

		}
	}
	return "error"
}
func GetBorwer() string {
	return "go_test"
}

func PathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
}
