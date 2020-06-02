//	author:		邓良远 2016-12-02
//	purpose:	redis操作接口

package gredis

import (
	"time"

	"fmt"

	"course/gutils/conf"

	"errors"
	"strconv"

	"github.com/astaxie/beego"
	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/logs"
	"github.com/garyburd/redigo/redis"
)

type REDIS_TYPE string

const (
	LOGREDIS     REDIS_TYPE = "logredis"     //日志redis
	GENERALREDIS REDIS_TYPE = "generalredis" //业务redis
)

const REDIS_MAX int = 8
const LOG_REDIS_MAX int = 2

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

	LogRedisClient [LOG_REDIS_MAX]*redis.Pool
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

	//Log Reids配置读取
	for i := 0; i < LOG_REDIS_MAX; i++ {
		redisHost, _ := conf.SvrConfig.String("server", "LogRedisHost"+strconv.Itoa(i))
		redisPort, _ := conf.SvrConfig.String("server", "LogRedisPort"+strconv.Itoa(i))
		redisPasswd, _ := conf.SvrConfig.String("server", "LogRedisPass"+strconv.Itoa(i))
		fmt.Println("redisHost:" + redisHost + "redisPort:" + redisPort + "redisPasswd:" + redisPasswd)
		RedisCli := &redis.Pool{
			// 从配置文件获取maxidle以及maxactive，取不到则用后面的默认值
			MaxIdle:     maxIdle,
			MaxActive:   maxActive,
			IdleTimeout: idleTimeout,
			Dial: func() (redis.Conn, error) {
				c, err := redis.Dial("tcp", redisHost+":"+redisPort)
				if err != nil {
					return nil, err
				}
				if redisPasswd != "" {
					if _, err := c.Do("AUTH", redisPasswd); err != nil {
						c.Close()
						return nil, err
					}
				}
				return c, nil
			},
		}
		LogRedisClient[i] = RedisCli
	}

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

func getLogRedis(key string) redis.Conn {
	h := getHash(LOG_REDIS_MAX, key)
	return LogRedisClient[h].Get()
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

func Expire(key, value string) (err error) {
	tb := time.Now()
	rc := getRedis(key)
	_, err = rc.Do("EXPIRE", key, value)
	defer rc.Close()

	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis expire 耗时:%.3f秒,%s", tlen, key)
		logs.Warn(msg)
	}
	return
}

func HGet(hkey, key string) (value string, err error) {
	tb := time.Now()
	rc := getRedis(hkey)
	value, err = redis.String(rc.Do("HGET", hkey, key))
	defer rc.Close()
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis hget 耗时:%.3f秒,%s", tlen, key)
		logs.Warn(msg)
	}
	return
}

//HSetMap 设置map分组
func HSetMap(hkey string, keys map[string]string) (err error) {
	tb := time.Now()
	rc := getRedis(hkey)
	defer rc.Close()
	for k, v := range keys {
		_, err = rc.Do("HSET", hkey, k, v)
	}
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis hset 耗时:%.3f秒,%s", tlen, hkey)
		logs.Warn(msg)
	}
	return
}

//HGetAll 获取HSet的所有的键值对
func HGetAll(hkey string) (value map[string]string, err error) {
	tb := time.Now()
	rc := getRedis(hkey)
	value, err = redis.StringMap(rc.Do("HGETALL", hkey))
	defer rc.Close()
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis hget 耗时:%.3f秒,%s", tlen, hkey)
		logs.Warn(msg)
	}
	return
}

//HGetAllJSON 获取HSet的所有的键值对
func HGetAllJSON(hkey string) (res config.LJSON, err error) {
	tb := time.Now()
	rc := getRedis(hkey)
	values, err1 := redis.Values(rc.Do("HGETALL", hkey))
	err = err1
	defer rc.Close()
	if err != nil {
		return
	}
	if len(values)%2 != 0 {
		err = errors.New("redigo: StringMap expects even number of values result")
		return
	}

	for i := 0; i < len(values); i += 2 {
		key, okKey := values[i].([]byte)
		value, okValue := values[i+1].([]byte)
		if !okKey || !okValue {
			err = errors.New("redigo: ScanMap key not a bulk string value")
			return
		}
		item := res.AddItem()
		item.Set("key").SetString(string(key))
		item.Set("value").SetString(string(value))
	}
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis HGetAllJSON 耗时:%.3f秒,%s", tlen, hkey)
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

/*******有序redis的集合获取和删除********/
//设置有序序列的值
func ZSet(zkey string, sortid float64, key string) (err error) {
	tb := time.Now()
	rc := getRedis(zkey)
	_, err = rc.Do("ZADD", zkey, sortid, key)
	defer rc.Close()

	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis ZSet 耗时:%.3f秒,%s", tlen, zkey)
		logs.Warn(msg)
	}
	return
}

//设置有序序列的值
func ZAdd(zkey, sortid, key string, redisType REDIS_TYPE) (err error) {
	tb := time.Now()
	var rc redis.Conn
	if redisType == LOGREDIS {
		rc = getLogRedis(zkey)
	} else {
		rc = getRedis(zkey)
	}
	_, err = rc.Do("ZADD", zkey, sortid, key)
	defer rc.Close()

	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis ZAdd 耗时:%.3f秒,%s", tlen, zkey)
		logs.Warn(msg)
	}
	return
}

//获取有序序列的所有元素的数量
func ZCrad(zkey string) (value int, err error) {
	tb := time.Now()
	rc := getRedis(zkey)
	value, err = redis.Int(rc.Do("ZCARD", zkey))
	defer rc.Close()
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis ZCrad 耗时:%.3f秒,%s", tlen, zkey)
		logs.Warn(msg)
	}
	return
}

//对键值列表中的排序值增加分数，如果想减少，则将分数设置为负值
func ZIncrby(zkey string, increment float64, key string) (err error) {
	tb := time.Now()
	rc := getRedis(zkey)
	_, err = rc.Do("ZINCRBY", zkey, increment, key)
	defer rc.Close()

	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis ZIncrby 耗时:%.3f秒,%s", tlen, zkey)
		logs.Warn(msg)
	}
	return
}

//ZRank 返回指定成员的排名 从小到大
func ZRank(zkey string, key string) (rvalue int, err error) {
	tb := time.Now()
	rc := getRedis(zkey)
	rvalue, err = redis.Int(rc.Do("ZRANK", zkey, key))
	defer rc.Close()
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis ZRank 耗时:%.3f秒,%s", tlen, zkey)
		logs.Warn(msg)
	}
	return
}

//ZCount 计算在有序集合中指定区间分数的成员数
func ZCount(zkey, min, max string, redisType REDIS_TYPE) (rvalue int, err error) {
	tb := time.Now()
	var rc redis.Conn
	if redisType == LOGREDIS {
		rc = getLogRedis(zkey)
	} else {
		rc = getRedis(zkey)
	}
	rvalue, err = redis.Int(rc.Do("ZCOUNT", zkey, min, max))
	defer rc.Close()
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis ZCount 耗时:%.3f秒,%s", tlen, zkey)
		logs.Warn(msg)
	}
	return
}

//返回从小到大的指定序列的的承运列表 当end 为-1时返回所有的 (map是无序的，需要用json格式)
func ZRangeWithScores(zkey string, start string, end string) (res config.LJSON, err error) {
	tb := time.Now()
	rc := getRedis(zkey)
	values, err1 := redis.Values(rc.Do("ZRANGE", zkey, start, end, "WITHSCORES"))
	defer rc.Close()
	if err1 != nil {
		err = err1
		return
	}
	if len(values)%2 != 0 {
		err = errors.New("redigo: StringMap expects even number of values result")
		return
	}

	for i := 0; i < len(values); i += 2 {
		key, okKey := values[i].([]byte)
		value, okValue := values[i+1].([]byte)
		if !okKey || !okValue {
			err = errors.New("redigo: ScanMap key not a bulk string value")
			return
		}
		item := res.AddItem()
		item.Set("key").SetString(string(key))
		item.Set("value").SetString(string(value))
	}
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis ZRangeWithScores 耗时:%.3f秒,%s", tlen, zkey)
		logs.Warn(msg)
	}
	return
}

//Zrevrank 返回指定成员的排名 从大到小
func Zrevrank(zkey string, key string) (rvalue int, err error) {
	tb := time.Now()
	rc := getRedis(zkey)
	rvalue, err = redis.Int(rc.Do("ZREVRANK", zkey, key))
	defer rc.Close()
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis ZREVRANK  耗时:%.3f秒,%s", tlen, zkey)
		logs.Warn(msg)
	}
	return
}

//ZREVRANGEBYSCORE 返回有序集 key 中， score 值介于 max 和 min 之间(默认包括等于 max 或 min )的所有的成员。有序集成员按 score 值递减(从大到小)的次序排列。 - 倒序
func ZRevrangeByScore(zkey, max, min, start, count string, redisType REDIS_TYPE) (res config.LJSON, err error) {

	tb := time.Now()
	var rc redis.Conn
	if redisType == LOGREDIS {
		rc = getLogRedis(zkey)
	} else {
		rc = getRedis(zkey)
	}
	values, err := redis.Values(rc.Do("ZREVRANGEBYSCORE", zkey, max, min, "limit", start, count))
	defer rc.Close()
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	for i := 0; i < len(values); i++ {
		v, okKey := values[i].([]byte)
		if !okKey {
			err = errors.New("ZRevrangeByScore assert convert to byte slice error")
			return
		}

		var tmpObj config.LJSON
		tmpObj.Load(string(v))
		res.AddItem().SetObject(tmpObj)
	}

	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis ZRevrangeByScore  耗时:%.3f秒,%s", tlen, zkey)
		logs.Warn(msg)
	}
	return
}

//ZRANGEBYSCORE 通过分数返回有序集合指定区间内的成员 - 正序
func ZRangeByScore(zkey, min, max, start, count string, redisType REDIS_TYPE) (res config.LJSON, err error) {

	tb := time.Now()
	var rc redis.Conn
	if redisType == LOGREDIS {
		rc = getLogRedis(zkey)
	} else {
		rc = getRedis(zkey)
	}
	values, err := redis.Values(rc.Do("ZRANGEBYSCORE", zkey, min, max, "limit", start, count))
	defer rc.Close()
	if err != nil {
		fmt.Println(err.Error())
		return
	}

	for i := 0; i < len(values); i++ {
		v, okKey := values[i].([]byte)
		if !okKey {
			err = errors.New("ZRangeByScore assert convert to byte slice error")
			return
		}

		var tmpObj config.LJSON
		tmpObj.Load(string(v))
		res.AddItem().SetObject(tmpObj)
	}

	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis ZRANGEBYSCORE  耗时:%.3f秒,%s", tlen, zkey)
		logs.Warn(msg)
	}
	return
}

//ZrevrangeWithScores 返回从大到小的指定序列的的承运列表 当end 为-1时返回所有的(map是无序的，需要用json格式)
func ZrevrangeWithScores(zkey string, start string, end string) (res config.LJSON, err error) {
	tb := time.Now()
	rc := getRedis(zkey)
	values, err1 := redis.Values(rc.Do("ZREVRANGE", zkey, start, end, "WITHSCORES"))
	defer rc.Close()
	if err1 != nil {
		err = err1
		return
	}
	if len(values)%2 != 0 {
		err = errors.New("redigo: StringMap expects even number of values result")
		return
	}

	for i := 0; i < len(values); i += 2 {
		key, okKey := values[i].([]byte)
		value, okValue := values[i+1].([]byte)
		if !okKey || !okValue {
			err = errors.New("redigo: ScanMap key not a bulk string value")
			return
		}
		item := res.AddItem()
		item.Set("key").SetString(string(key))
		item.Set("value").SetString(string(value))
	}
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis ZrevrangeWithScores 耗时:%.3f秒,%s", tlen, zkey)
		logs.Warn(msg)
	}
	return
}

//ZScore 返回成员的分
func ZScore(zkey string, key string) (rvalue string, err error) {
	tb := time.Now()
	rc := getRedis(zkey)
	rvalue, err = redis.String(rc.Do("ZSCORE", zkey, key))
	defer rc.Close()
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis ZScore  耗时:%.3f秒,%s", tlen, zkey)
		logs.Warn(msg)
	}
	return
}

//LPop 从列表值中 获取key对应的一个value
func LPop(key string) (value string, err error) {
	tb := time.Now()
	rc := getRedis(key)
	value, err = redis.String(rc.Do("LPOP", key))
	defer rc.Close()
	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis LPop 耗时:%.3f秒,%s", tlen, key)
		logs.Warn(msg)
	}
	return
}

//写入key，中的一个value
func LPush(key, value string) (err error) {
	tb := time.Now()
	rc := getRedis(key)
	_, err = rc.Do("LPUSH", key, value)
	defer rc.Close()

	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis LPush 耗时:%.3f秒,%s", tlen, key)
		logs.Warn(msg)
	}
	return
}
func HLEN(hkey string) (hlen int, err error) {
	tb := time.Now()
	rc := getRedis(hkey)

	hlen, err = redis.Int(rc.Do("HLEN", hkey))

	defer rc.Close()

	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis HLEN 耗时:%.3f秒,%s", tlen)
		logs.Warn(msg)
	}
	return
}

//判断键值是否存在
func Hexists(hkey, key string) (isexist bool, err error) {
	tb := time.Now()
	rc := getRedis(hkey)
	isexist = false
	tt := 0
	tt, err = redis.Int(rc.Do("Hexists", hkey, key))
	if tt == 1 {
		isexist = true
	}
	defer rc.Close()

	si := time.Since(tb)
	tlen := si.Seconds()
	if tlen >= 1 {
		msg := fmt.Sprintf("redis Hexists 耗时:%.3f秒,%s", tlen, key)
		logs.Warn(msg)
	}
	return
}
