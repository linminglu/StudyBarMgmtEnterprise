//author:  曾文 2016-11-07
//purpose： 日期时间通用函数
package gutils

import (
	"fmt"
)

import
//"fmt"

"time"

/*
func GetDate(timestamp int64) string {
	tm := time.Unix(timestamp, 0)
	return tm.Format("2006-01-02 15:04")
}
func GetDateMH(timestamp int64) string {
	tm := time.Unix(timestamp, 0)
	return tm.Format("01-02 03:04")
}*/
func GetDate(timestamp int64) string {
	if timestamp <= 0 {
		return ""
	}
	tm := time.Unix(timestamp, 0)
	return tm.Format("2006-01-02")
}

func GetDateMH(timestamp int64) string {
	if timestamp <= 0 {
		return ""
	}
	tm := time.Unix(timestamp, 0)
	return tm.Format("2006-01-02 15:04")
}

func GetTimeParse(times string) int64 {
	if "" == times {
		return 0
	}
	loc, _ := time.LoadLocation("Local")
	parse, _ := time.ParseInLocation("2006-01-02 15:04", times, loc)
	return parse.Unix()
}

func GetTime(times string) time.Time {
	if "" == times {
		return time.Now()
	}
	loc, _ := time.LoadLocation("Local")
	parse, _ := time.ParseInLocation("2006-01-02 15:04:05", times, loc)
	return parse
}

func GetDateAsTime() time.Time {
	times := time.Now().Format("2006-01-02 00:00:00")
	loc, _ := time.LoadLocation("Local")
	parse, _ := time.ParseInLocation("2006-01-02 00:00:00", times, loc)
	return parse
}

func GetDateParse(dates string) int64 {
	if "" == dates {
		return 0
	}
	loc, _ := time.LoadLocation("Local")
	parse, _ := time.ParseInLocation("2006-01-02", dates, loc)
	return parse.Unix()
}

func DateStr() string {
	return time.Now().Format("2006-01-02")
}

func NowStr() string {
	return time.Now().Format("2006-01-02 15:04:05")
}

func TimeToStr(t time.Time) string {
	return t.Format("2006-01-02 15:04:05")
}

func TimeToDateStr(t time.Time) string {
	return t.Format("2006-01-02")
}

func DateStrToTime(d string) time.Time {
	loc, _ := time.LoadLocation("Local")
	t, err := time.ParseInLocation("2006-1-2", d, loc)
	if err != nil {
		t, err = time.ParseInLocation("2006/1/2", d, loc)
		if err != nil {
			t, _ = time.ParseInLocation("2006-01-02 15:04:05", d, loc)
		}
	}
	return t
}




func DateStrToTimeEx(d string) time.Time {
	loc, _ := time.LoadLocation("Local")
	t, err := time.ParseInLocation("2006/1/2", d, loc)
	if err != nil {
		t, _ = time.ParseInLocation("2006/1/2 15:04:05", d, loc)
	}
	return t
}

func TimeStrToTime(d string) time.Time {
	loc, _ := time.LoadLocation("Local")
	t, err := time.ParseInLocation("2006-01-02 15:04:05", d, loc)
	if err!=nil {
		fmt.Println(err.Error())
	}
	return t
}

//对字符的日期进行加减,并返回字符
func DateStrAddDay(d string, i int) string {
	if d == "" {
		return d
	}

	loc, _ := time.LoadLocation("Local")
	k, err := time.ParseInLocation("2006-01-02", d, loc)
	if err != nil {
		return ""
	}

	/*s := fmt.Sprintf("%dh", i*24)
	d1, _ := time.ParseDuration(s)
	t1 := k.Add(d1)
	*/
	t1 := k.AddDate(0, 0, i)
	d = t1.Format("2006-01-02")
	return d
}


//对年进行加减,并返回时间
func YearsAdd(t time.Time, i int) string {

	t1 := t.AddDate(i, 0, 0)
	d:= t1.Format("2006-01-02")
	return d
}
//对时间进行加减,并返回时间
func TimeAddDay(t time.Time, i int) time.Time {

	//s := fmt.Sprintf("%dh", i*24)
	//d1, _ := time.ParseDuration(s)
	//t1 := t.Add(d1)
	t1 := t.AddDate(0, 0, i)
	return t1
}

//两个日期相差的天数
func GetDayDiffer(start_time, end_time string) int64 {
	var day int64
	t1, err := time.ParseInLocation("2006-01-02", start_time, time.Local)
	t2, err := time.ParseInLocation("2006-01-02", end_time, time.Local)
	if err == nil && t1.Before(t2) {
		diff := t2.Unix() - t1.Unix() //
		day = diff / 3600 / 24
		return day
	} else {
		return day
	}
}

//两个日期相差的小时
func GetHourDiffer(start_time, end_time string) int64 {
	var hour int64
	t1, err := time.ParseInLocation("2006-01-02", start_time, time.Local)
	t2, err := time.ParseInLocation("2006-01-02", end_time, time.Local)
	if err == nil && t1.Before(t2) {
		diff := t2.Unix() - t1.Unix() //
		hour = diff / 3600
		return hour
	} else {
		return hour
	}
}
