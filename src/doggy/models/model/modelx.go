//author:  邓良远 2016-11-13
//purpose： ORM操作
package model

import (
	_ "doggy/models/db_flybear"
	_ "doggy/models/db_koala"

	"github.com/astaxie/beego/logs"

	"fmt"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

type LModelX struct {
	table string
	orm   orm.Ormer
}

func (t *LModelX) SetTable(table string) *LModelX {
	t.table = table
	return t
}

func (t *LModelX) SetORM(orm orm.Ormer) *LModelX {
	t.orm = orm
	return t
}

func (t *LModelX) Add(params config.LJSON) error {
	if t.orm == nil {
		err := fmt.Errorf("LModelX::Add, orm not set! table : %s", t.table)
		return err
	}
	maps := params.Map()
	if maps == nil {
		err := fmt.Errorf("LModelX::Add, params is nil! table : %s", t.table)
		return err
	}
	var cols, vals string
	var param []interface{}
	for key, value := range maps {
		if cols == "" {
			cols = key
			vals = "?"
		} else {
			cols += "," + key
			vals += ",?"
		}
		param = append(param, value)
	}
	sql := fmt.Sprintf("insert into %s (%s) values(%s) ", t.table, cols, vals)

	_, err := t.orm.Raw(sql, param...).Exec()
	return err
}

func (t *LModelX) Update(params config.LJSON, keysWhere config.LJSON) error {
	if t.orm == nil {
		err := fmt.Errorf("LModelX::Update, orm not set! table : %s", t.table)
		return err
	}
	maps := params.Map()
	if maps == nil {
		err := fmt.Errorf("LModelX::Update, params is nil! table : %s", t.table)
		return err
	}
	var cols string
	var param []interface{}
	for key, value := range maps {
		if cols == "" {
			cols = key + "=?"
		} else {
			cols += "," + key + "=?"
		}
		param = append(param, value)
	}
	var where string
	mapKey := keysWhere.Map()
	for key, val := range mapKey {
		if where == "" {
			where = key + "=?"
		} else {
			where += fmt.Sprintf(" and %s=? ", key)
		}
		param = append(param, val)
	}
	if where == "" {
		err := fmt.Errorf("LModelX::Update where key not set! table : %s", t.table)
		return err
	}
	sql := fmt.Sprintf("Update %s set %s where %s ", t.table, cols, where)
	_, err := t.orm.Raw(sql, param...).Exec()
	return err
}

func (t *LModelX) Save(params config.LJSON, keysWhere config.LJSON) error {
	if t.orm == nil {
		err := fmt.Errorf("LModelX::Save, orm not set! table : %s", t.table)
		return err
	}
	var arg []interface{}
	var where string
	mapKey := keysWhere.Map()
	for key, val := range mapKey {
		if where == "" {
			where = key + "=?"
		} else {
			where += fmt.Sprintf(" and %s=? ", key)
		}
		arg = append(arg, val)
		fmt.Println(arg...)
	}
	sql := fmt.Sprintf("select * from %s where %s ", t.table, where)
	var res config.LJSON
	num, err := t.orm.Raw(sql, arg...).ValuesJSON(&res)

	if num == 0 {
		mapParam := params.Map()
		for key, val := range mapKey {
			skey := fmt.Sprintf("%s", key)
			mapParam[skey] = val
		}
		msg, _ := params.ToString()
		logs.Debug("LModelX::Save", msg)
		err = t.Add(params)
	} else {
		err = t.Update(params, keysWhere)
	}
	return err
}
