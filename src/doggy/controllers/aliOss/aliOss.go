//author:  黎智勇 2016-11-07
//purpose： 上传文件到阿里云
package aliOss

import (
	"doggy/gutils"
	"doggy/gutils/conf"
	"fmt"
	"io"

	"github.com/aliyun/aliyun-oss-go-sdk/oss"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/logs"
)

var s_AccessKeyID string
var s_AccessKeySecret string
var s_Endpoint string
var OSS_Bucket string
var OSS_Domain string
var OSS_Package string
var OSS_Public string

//初始化
func init() {
	s_AccessKeyID, _ = conf.SvrConfig.String("server", "OSSAccessKey")
	s_AccessKeySecret, _ = conf.SvrConfig.String("server", "OSSAccessSecret")
	s_Endpoint, _ = conf.SvrConfig.String("server", "OSSDomain")
	OSS_Bucket, _ = conf.SvrConfig.String("server", "OSSBucketCommon")
	OSS_Domain, _ = conf.SvrConfig.String("server", "OSSDomain")
	OSS_Package, _ = conf.SvrConfig.String("server", "OSSPackage")
	OSS_Public, _ = conf.SvrConfig.String("server", "OSSPublic")

	if OSS_Bucket == "" {
		OSS_Bucket = "dental360"
	}
	if OSS_Domain == "" {
		OSS_Domain = "oss-cn-qingdao.aliyuncs.com"
	}
	if OSS_Public == "" {
		OSS_Public = "oss-cn-qingdao.aliyuncs.com"
	}
	if s_Endpoint == "" {
		s_Endpoint = "oss-cn-qingdao.aliyuncs.com"
	}
	if OSS_Package == "" {
		OSS_Package = "test"
	}
}

//查看Bucket列表
func AliOssGetBucketList() (result oss.ListBucketsResult, err error) {
	client, err := oss.New(s_Endpoint, s_AccessKeyID, s_AccessKeySecret)
	if err != nil {
		fmt.Println(err)
		return result, err
	}

	lsRes, err := client.ListBuckets()
	if err != nil {
		fmt.Println(err)
		return result, err
	}

	return lsRes, nil
}

//创建Bucket 由于存储空间的名字是全局唯一的，所以必须保证您的Bucket名字不与别人的重复 bucket不能超过10个
func AliOssAddBucket(bucketName string) (err error) {
	client, err := oss.New(s_Endpoint, s_AccessKeyID, s_AccessKeySecret)
	if err != nil {
		fmt.Println(err)
		return err
	}

	err = client.CreateBucket(bucketName)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}

//列出bucket中的文件
func AliOssBucketGetFile(bucketName string) (err error) {
	client, err := oss.New(s_Endpoint, s_AccessKeyID, s_AccessKeySecret)
	if err != nil {
		fmt.Println(err)
		return err
	}

	bucket, err := client.Bucket(bucketName)
	if err != nil {
		fmt.Println(err)
		return err
	}

	lsRes, err := bucket.ListObjects()
	if err != nil {
		fmt.Println(err)
		return err
	}

	fmt.Println("Objects:", lsRes.Objects)
	for _, object := range lsRes.Objects {
		fmt.Println("Objects:", object.Key)
	}
	return nil
}

//上传文件
func AliOssUploadFileByFile(fileName string, file io.Reader) (err error) {
	fileName = OSS_Package + "/" + fileName
	client, err := oss.New(s_Endpoint, s_AccessKeyID, s_AccessKeySecret)
	if err != nil {
		fmt.Println(err)
		return err
	}

	bucket, err := client.Bucket(OSS_Bucket)
	if err != nil {
		fmt.Println(err)
		return err
	}

	//CacheControl	指定该Object被下载时的网页的缓存行为。
	//ContentDisposition	指定该Object被下载时的名称。
	//ContentEncoding	指定该Object被下载时的内容编码格式。
	//Expires	指定过期时间。用户自定义格式，建议使用http.TimeFormat格式。
	//ServerSideEncryption	指定oss创建object时的服务器端加密编码算法。合法值：AES256。
	//ObjectACL	指定oss创建object时的访问权限。
	//Meta	自定义参数，以"X-Oss-Meta-"为前缀的参数。
	options := []oss.Option{
		oss.ContentDisposition(fileName),
	}

	err = bucket.PutObject(fileName, file, options...)
	if err != nil {
		fmt.Println(err)
		return err
	}

	return nil
}

//返回url
func AliOssReturnUrl(fileName string) string {
	fileName = OSS_Package + "/" + fileName
	return "http://" + OSS_Bucket + "." + OSS_Public + "/" + fileName
}

//下载文件 暂时保存在当前文件夹a.jpg
func AliOssDownLoadFile(fileName string) (err error) {
	fileName = OSS_Package + "/" + fileName
	client, err := oss.New(s_Endpoint, s_AccessKeyID, s_AccessKeySecret)
	if err != nil {
		fmt.Println(err)
		return err
	}

	bucket, err := client.Bucket(OSS_Bucket)
	if err != nil {
		fmt.Println(err)
		return err
	}

	err = bucket.GetObjectToFile(fileName, "./a.jpg")
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}

//删除图片
func AliOssDelFile(fileName string) (err error) {
	fileName = OSS_Package + "/" + fileName
	client, err := oss.New(s_Endpoint, s_AccessKeyID, s_AccessKeySecret)
	if err != nil {
		return err
	}

	bucket, err := client.Bucket(OSS_Bucket)
	if err != nil {
		return err
	}

	err = bucket.DeleteObject(fileName)
	if err != nil {
		return err
	}
	return nil
}

//获取oss bucket
func AliOssGetBucket(bucketName string) (*oss.Bucket, error) {
	client, err := oss.New(s_Endpoint, s_AccessKeyID, s_AccessKeySecret)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	bucket, err := client.Bucket(bucketName)
	return bucket, err
}

//获取oss bucket 公网可以访问
func AliOssGetPubBucket(bucketName string) (*oss.Bucket, error) {
	client, err := oss.New(OSS_Public, s_AccessKeyID, s_AccessKeySecret)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}
	bucket, err := client.Bucket(bucketName)
	return bucket, err
}

//判断文件是否存在
func AliOssExit(fileName string) (bool, error) {
	client, err := oss.New(s_Endpoint, s_AccessKeyID, s_AccessKeySecret)
	if err != nil {
		return false, err
	}

	bucket, err := client.Bucket(OSS_Bucket)
	if err != nil {
		return false, err
	}

	isExist, err := bucket.IsObjectExist(fileName)
	if err != nil {
		return false, err
	}
	return isExist, nil
}

//下载文件 bucket为配置参数OSSBucket的值
func AliOssDownload(ossFile string, local string) (err error) {
	var flyParam config.LJSON
	flyParam.Set("funcid").SetInt(gutils.FUNC_ID_GET_CLOUND_PATH)
	flyParam.Set("filename").SetString(ossFile)
	data := gutils.FlybearCPlus(flyParam)
	code := data.Get("code").Int()
	if code == 0 {
		logs.Error("获取Oss路径失败")
		return
	}
	//云端上传路径
	ossPath := data.Get("path").String() + ossFile

	OSS_Bucket, _ := conf.SvrConfig.String("server", "OSSBucket")
	bucket, err := AliOssGetBucket(OSS_Bucket)
	if err != nil {
		logs.Error(err)
		return err
	}
	err = bucket.GetObjectToFile(ossPath, local)
	if err != nil {
		logs.Error(err)
		return err
	}
	return
}

//下载文件
func AliDownloadDcm(studyuid string, seriesuid string, sopuid string, local string) (err error) {
	ossFile := studyuid + "/" + seriesuid + "/" + sopuid + ".dcm"
	err = AliOssDownload(ossFile, local)
	return
}

//授权下载url
func AliOssSignURL(ossFile string) (url string, err error) {
	var flyParam config.LJSON
	flyParam.Set("funcid").SetInt(gutils.FUNC_ID_GET_CLOUND_PATH)
	flyParam.Set("filename").SetString(ossFile)
	data := gutils.FlybearCPlus(flyParam)
	code := data.Get("code").Int()
	if code == 0 {
		logs.Error("获取Oss路径失败")
		return
	}
	//云端路径
	ossPath := data.Get("path").String() + ossFile

	OSS_Bucket, _ := conf.SvrConfig.String("server", "OSSBucket")
	bucket, err := AliOssGetPubBucket(OSS_Bucket)
	if err != nil {
		logs.Error(err)
		return "", err
	}
	url, err = bucket.SignURL(ossPath, oss.HTTPGet, 3600)
	if err != nil {
		logs.Error(err)
		return
	}
	return
}
