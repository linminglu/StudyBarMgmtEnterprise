//author:  曾文 2016-11-07
//purpose： 加密相关函数
package gutils

import (
	"crypto/md5"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"encoding/pem"
	"errors"
	"fmt"
	"io"
	"time"
)

//md5方法
func Md5(s string) string {
	h := md5.New()
	h.Write([]byte(s))
	return hex.EncodeToString(h.Sum(nil))
}

//Guid方法
func GetGuid() string {
	b := make([]byte, 48)

	if _, err := io.ReadFull(rand.Reader, b); err != nil {
		return ""
	}
	return Md5(base64.URLEncoding.EncodeToString(b))
}

const (
	base64Table = "123QRSTUabcdVWXYZHijKLAWDCABDstEFGuvwxyzGHIJklmnopqr234560178912"
)

var coder = base64.NewEncoding(base64Table)

func base64Encode(src []byte) []byte {
	return []byte(base64.StdEncoding.EncodeToString(src))
}
func base64Decode(src []byte) ([]byte, error) {
	return base64.StdEncoding.DecodeString(string(src))
}

// 加密
func RsaEncrypt(origData []byte) ([]byte, error) {
	var publicKey = []byte(`
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCgAQOiHgVAZ5dHFaPC2XZOEwbk
df9aISC1yCLyV94SJ+EAum2dkCM5E9XYNwxyYiTzcSIMhoCZ8DiO8HVsBDhHmGjD
VaEg2uTu0l8q3ZuOuD1mToTOrb7sP+xrjEQiRFZ/mv4n3pcQ+XNG+k8buPw7vxl+
boUG3sC1mE4U2AizUQIDAQAB
-----END PUBLIC KEY-----
`)
	block, _ := pem.Decode(publicKey)
	if block == nil {
		return nil, errors.New("public key error")
	}
	pubInterface, err := x509.ParsePKIXPublicKey(block.Bytes)
	if err != nil {
		return nil, err

	}

	pub := pubInterface.(*rsa.PublicKey)

	return rsa.EncryptPKCS1v15(rand.Reader, pub, origData)

}


 
//商城验证信息RSA加密
func AuthEncryption() (string, error) {
	js := make(map[string]interface{})
	js["username"] = "hegel"
	js["password"] = "fussen168"
	js["timestamp"] = time.Now().Unix()
	body, _ := json.Marshal(js)
	fmt.Println(string(body))
	data, err := RsaEncrypt(body)
	if err != nil {
		return "", err
	}
	debyte := base64Encode(data)

	return string(debyte), err

}


//商城订单链接加密
func OrderAuthEncryption(js map[string]interface{}) (string, error) {

	body, _ := json.Marshal(js)
	fmt.Println(string(body))
	data, err := RsaEncrypt(body)
	if err != nil {
		return "", err
	}
	debyte := base64Encode(data)

	return string(debyte), err

}
