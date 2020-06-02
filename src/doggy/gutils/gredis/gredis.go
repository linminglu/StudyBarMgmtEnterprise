//	author:		邓良远 2016-12-02
//	purpose:	redis操作接口

package gredis

import (
	"time"

	"fmt"

	"doggy/gutils/conf"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/logs"
	"github.com/garyburd/redigo/redis"
)

const REDIS_MAX int = 8

var (
	// 定义常量
	RedisClient0 *redis.Pool
	RedisClient1 *redis.Pool
	RedisClient2 *redis.Pool
	RedisClient3 *redis.Pool
	RedisClient4 *redis.Pool
	RedisClient5 *redis.Pool
	RedisClient6 *redis.Pool
	RedisClient7 *redis.Pool
)

func init() {
	// 从配置文件获取redis的ip以及db
	redisHost0, _ := conf.SvrConfig.String("server", "RedisHost0")
	redisHost1, _ := conf.SvrConfig.String("server", "RedisHost1")
	redisHost2, _ := conf.SvrConfig.String("server", "RedisHost2")
	redisHost3, _ := conf.SvrConfig.String("server", "RedisHost3")
	redisHost4, _ := conf.SvrConfig.String("server", "RedisHost4")
	redisHost5, _ := conf.SvrConfig.String("server", "RedisHost5")
	redisHost6, _ := conf.SvrConfig.String("server", "RedisHost6")
	redisHost7, _ := conf.SvrConfig.String("server", "RedisHost7")

	redisPort0, _ := conf.SvrConfig.String("server", "RedisPort0")
	redisPort1, _ := conf.SvrConfig.String("server", "RedisPort1")
	redisPort2, _ := conf.SvrConfig.String("server", "RedisPort2")
	redisPort3, _ := conf.SvrConfig.String("server", "RedisPort3")
	redisPort4, _ := conf.SvrConfig.String("server", "RedisPort4")
	redisPort5, _ := conf.SvrConfig.String("server", "RedisPort5")
	redisPort6, _ := conf.SvrConfig.String("server", "RedisPort6")
	redisPort7, _ := conf.SvrConfig.String("server", "RedisPort7")

	redisPass0, _ := conf.SvrConfig.String("server", "RedisPass0")
	redisPass1, _ := conf.SvrConfig.String("server", "RedisPass1")
	redisPass2, _ := conf.SvrConfig.String("server", "RedisPass2")
	redisPass3, _ := conf.SvrConfig.String("server", "RedisPass3")
	redisPass4, _ := conf.SvrConfig.String("server", "RedisPass4")
	redisPass5, _ := conf.SvrConfig.String("server", "RedisPass5")
	redisPass6, _ := conf.SvrConfig.String("server", "RedisPass6")
	redisPass7, _ := conf.SvrConfig.String("server", "RedisPass7")
	logs.Debug(redisHost0, ":", redisPort0)
	// 建立连接池
	maxIdle := beego.AppConfig.DefaultInt("redis.maxidle", 10)
	maxActive := beego.AppConfig.DefaultInt("redis.maxactive", 30)
	idleTimeout := 180 * time.Second
	RedisClient0 = &redis.Pool{
		// 从配置文件获取maxidle以及maxactive，取不到则用后面的默认值
		MaxIdle:     maxIdle,
		MaxActive:   maxActive,
		IdleTimeout: idleTimeout,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", redisHost0+":"+redisPort0)
			if err != nil {
				return nil, err
			}
			if redisPass0 != "" {
				if _, err := c.Do("AUTH", redisPass0); err != nil {
					c.Close()
					return nil, err
				}
			}
			return c, nil
		},
	}
	RedisClient1 = &redis.Pool{
		// 从配置文件获取maxidle以及maxactive，取不到则用后面的默认值
		MaxIdle:     maxIdle,
		MaxActive:   maxActive,
		IdleTimeout: idleTimeout,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", redisHost1+":"+redisPort1)
			if err != nil {
				return nil, err
			}
			if redisPass1 != "" {
				if _, err := c.Do("AUTH", redisPass1); err != nil {
					c.Close()
					return nil, err
				}
			}
			return c, nil
		},
	}
	RedisClient2 = &redis.Pool{
		// 从配置文件获取maxidle以及maxactive，取不到则用后面的默认值
		MaxIdle:     maxIdle,
		MaxActive:   maxActive,
		IdleTimeout: idleTimeout,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", redisHost2+":"+redisPort2)
			if err != nil {
				return nil, err
			}
			if redisPass2 != "" {
				if _, err := c.Do("AUTH", redisPass2); err != nil {
					c.Close()
					return nil, err
				}
			}
			return c, nil
		},
	}
	RedisClient3 = &redis.Pool{
		// 从配置文件获取maxidle以及maxactive，取不到则用后面的默认值
		MaxIdle:     maxIdle,
		MaxActive:   maxActive,
		IdleTimeout: idleTimeout,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", redisHost3+":"+redisPort3)
			if err != nil {
				return nil, err
			}
			if redisPass3 != "" {
				if _, err := c.Do("AUTH", redisPass3); err != nil {
					c.Close()
					return nil, err
				}
			}
			return c, nil
		},
	}
	RedisClient4 = &redis.Pool{
		// 从配置文件获取maxidle以及maxactive，取不到则用后面的默认值
		MaxIdle:     maxIdle,
		MaxActive:   maxActive,
		IdleTimeout: idleTimeout,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", redisHost4+":"+redisPort4)
			if err != nil {
				return nil, err
			}
			if redisPass4 != "" {
				if _, err := c.Do("AUTH", redisPass4); err != nil {
					c.Close()
					return nil, err
				}
			}
			return c, nil
		},
	}
	RedisClient5 = &redis.Pool{
		// 从配置文件获取maxidle以及maxactive，取不到则用后面的默认值
		MaxIdle:     maxIdle,
		MaxActive:   maxActive,
		IdleTimeout: idleTimeout,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", redisHost5+":"+redisPort5)
			if err != nil {
				return nil, err
			}
			if redisPass5 != "" {
				if _, err := c.Do("AUTH", redisPass5); err != nil {
					c.Close()
					return nil, err
				}
			}
			return c, nil
		},
	}
	RedisClient6 = &redis.Pool{
		// 从配置文件获取maxidle以及maxactive，取不到则用后面的默认值
		MaxIdle:     maxIdle,
		MaxActive:   maxActive,
		IdleTimeout: idleTimeout,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", redisHost6+":"+redisPort6)
			if err != nil {
				return nil, err
			}
			if redisPass6 != "" {
				if _, err := c.Do("AUTH", redisPass6); err != nil {
					c.Close()
					return nil, err
				}
			}
			return c, nil
		},
	}
	RedisClient7 = &redis.Pool{
		// 从配置文件获取maxidle以及maxactive，取不到则用后面的默认值
		MaxIdle:     maxIdle,
		MaxActive:   maxActive,
		IdleTimeout: idleTimeout,
		Dial: func() (redis.Conn, error) {
			c, err := redis.Dial("tcp", redisHost7+":"+redisPort7)
			if err != nil {
				return nil, err
			}
			if redisPass7 != "" {
				if _, err := c.Do("AUTH", redisPass7); err != nil {
					c.Close()
					return nil, err
				}
			}
			return c, nil
		},
	}
}

func getHash(count int, str string) int {
	value := 0
	buffer := []byte(str)
	length := len(buffer)
	for i := 0; i < length; i++ {
		value = value + int(buffer[i])
	}
	value %= count
	if value < 0 {
		value = value + count
	}
	if value < 0 {
		value = 0
	}
	if value >= count {
		value = count - 1
	}
	return value
}

func getRedis(key string) redis.Conn {
	h := getHash(8, key)
	switch h {
	case 0:
		return RedisClient0.Get()
	case 1:
		return RedisClient1.Get()
	case 2:
		return RedisClient2.Get()
	case 3:
		return RedisClient3.Get()
	case 4:
		return RedisClient4.Get()
	case 5:
		return RedisClient5.Get()
	case 6:
		return RedisClient6.Get()
	case 7:
		return RedisClient7.Get()
	}
	return RedisClient0.Get()
}

//获取key对应的value
func Get(key string) (value string, err error) {
	tb := time.Now()
	rc := getRedis(key)
	value, err = redis.String(rc.Do("GET", key))
	defer rc.Close()
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis get 耗时:%.3f秒,%s", tlen, key)
		logs.Warn(msg)
	}
	return
}

//写入key，value
func Set(key, value string) (err error) {
	tb := time.Now()
	rc := getRedis(key)
	_, err = rc.Do("SET", key, value)
	defer rc.Close()

	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis set 耗时:%.3f秒,%s", tlen, key)
		logs.Warn(msg)
	}
	return
}

func HGet(hkey, key string) (value string, err error) {
	tb := time.Now()
	rc := getRedis(key)
	value, err = redis.String(rc.Do("GET", hkey, key))
	defer rc.Close()
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis hget 耗时:%.3f秒,%s", tlen, key)
		logs.Warn(msg)
	}
	return
}

//HSET key field value
func HSet(hkey, key, value string) (err error) {
	tb := time.Now()
	rc := getRedis(hkey)
	_, err = rc.Do("HSET", hkey, key, value)
	defer rc.Close()

	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis hset 耗时:%.3f秒,%s", tlen, key)
		logs.Warn(msg)
	}
	return
}

func SetSyncTime(clinicid, table string, timev time.Time) (err error) {
	err = HSet("synctime_"+clinicid, table, timev.Format("2006-01-02 15:04:05"))
	return
}

//删除key
func Del(key string) (err error) {
	rc := getRedis(key)
	_, err = rc.Do("DEL", key)
	defer rc.Close()
	return
}

//是否存在
func Exists(key string) (exists bool, err error) {
	rc := getRedis(key)
	exists, err = redis.Bool(rc.Do("Exists", key))
	defer rc.Close()
	return
}

//执行redis命令，command是redis命令，args是命令参数
func Do(command string, args ...interface{}) (reply interface{}, err error) {
	if len(args) == 0 {
		err = fmt.Errorf("redis::Do, no args")
		return nil, err
	}
	key := args[0].(string)
	rc := getRedis(key)
	reply, err = rc.Do(command, args...)
	defer rc.Close()
	return
}
