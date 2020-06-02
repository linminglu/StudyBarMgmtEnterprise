//author:  曾文 2016-01-07
//purpose： mogodb初始化
package gutils

import (
	"doggy/gutils/conf"
	"fmt"

	"github.com/astaxie/beego/logs"
	mgo "gopkg.in/mgo.v2"
)

const (
	MG_KOALA = "koala"
)

var (
	mgoSession *mgo.Session
	dataBase   string
	url        string
	mongouser  string
	mongopwd   string
	mongourl   string
)

func init() {
	var err error
	url, err = conf.SvrConfig.String("server", "MongoHost")
	if err != nil {
		logs.Error("mongo::init MongoHost not configed,", err)
	}
	var port string
	port, err = conf.SvrConfig.String("server", "MongoPort")
	if err != nil {
		logs.Error("mongo::init MongoPort not configed,", err)
	}
	url = url + ":" + port
	mongouser, err = conf.SvrConfig.String("server", "MongoUser")
	if err != nil {
		logs.Error("mongo::init MongoUser not configed,", err)
	}
	mongopwd, err = conf.SvrConfig.String("server", "MongoPass")
	if err != nil {
		logs.Error("mongo::init MongoPass not configed,", err)
	}

	mongourl, err = conf.SvrConfig.String("server", "MongoUri")
	if err != nil {
		logs.Error("mongo::init mongourl not configed,", err)
	}

	logs.Debug("mongo::init,mongo host: ", url, mongouser, mongopwd)
	logs.Debug("mongo::init,mongourl: ", mongourl)
}

/**
 *  获取session，如果存在则拷贝一份
 */
func GetMongoSession() *mgo.Session {
	if mgoSession == nil {
		var err error
		if mongourl != "" {
			//mongodb://myuser:mypass@localhost:40001,otherhost:40001/mydb
			murl := fmt.Sprintf("mongodb://%s:%s@%s", mongouser, mongopwd, mongourl)
			mgoSession, err = mgo.Dial(murl)
			//logs.Info("mgo.Dial: ", murl)
		} else {
			var mongoConf mgo.DialInfo
			mongoConf.Addrs = []string{url}
			mongoConf.Username = mongouser
			mongoConf.Password = mongopwd
			mgoSession, err = mgo.DialWithInfo(&mongoConf)
		}
		// Optional. Switch the session to a monotonic behavior.
		mgoSession.SetMode(mgo.Monotonic, true)
		if err != nil {
			panic(err) //直接终止程序运行
		}
	}
	//最大连接池默认为4096
	return mgoSession.Clone()
}
