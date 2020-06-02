//author:  邓良远 2016-11-13
//purpose： ORM操作
package model

import (
	_ "doggy/models/db_flybear"
	_ "doggy/models/db_koala"

	"fmt"
	"strings"

	"github.com/astaxie/beego/config"
	"github.com/astaxie/beego/orm"
)

type LModel struct {
	table string
	orm   orm.Ormer
}

func (t *LModel) SetTable(table string) *LModel {
	t.table = table
	return t
}

func (t *LModel) SetORM(orm orm.Ormer) *LModel {
	t.orm = orm
	return t
}

func (t *LModel) Add(params config.LJSON) error {
	if t.orm == nil {
		err := fmt.Errorf("LModel::Add, orm not set! table : %s", t.table)
		return err
	}
	maps := params.Map()
	if maps == nil {
		err := fmt.Errorf("LModel::Update, params is nil! table : %s", t.table)
		return err
	}
	fields := t.orm.GetCols(strings.ToLower(t.table))
	if len(fields) == 0 {
		err := fmt.Errorf("LModel::Add, model not register %s", t.table)
		return err
	}
	var cols, vals string
	var param []interface{}
	for key, value := range maps {
		exist := false
		for i := 0; i < len(fields); i++ {
			if strings.ToLower(key) == strings.ToLower(fields[i]) {
				exist = true
				break
			}
		}
		if exist == false {
			continue
		}
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

func (t *LModel) Update(params config.LJSON, keysWhere ...string) error {
	if t.orm == nil {
		err := fmt.Errorf("LModel::Update, orm not set! table : %s", t.table)
		return err
	}
	maps := params.Map()
	if maps == nil {
		err := fmt.Errorf("LModel::Update, params is nil! table : %s", t.table)
		return err
	}
	fields := t.orm.GetCols(strings.ToLower(t.table))
	if len(fields) == 0 {
		err := fmt.Errorf("model not register %s", t.table)
		return err
	}
	var cols string
	var param []interface{}
	pk := t.orm.GetPK(t.table)
	for key, value := range maps {
		exist := false
		for i := 0; i < len(fields); i++ {
			if strings.ToLower(key) == strings.ToLower(fields[i]) {
				exist = true
				break
			}
		}
		if exist == false {
			continue
		}
		isPK := false
		for i := 0; i < len(pk); i++ {
			if strings.ToLower(key) == strings.ToLower(pk[i]) {
				isPK = true
				break
			}
		}
		if isPK == true {
			continue
		}
		if cols == "" {
			cols = key + "=?"
		} else {
			cols += "," + key + "=?"
		}
		param = append(param, value)
	}
	var where string
	if len(keysWhere) == 0 {
		keysWhere = append(keysWhere, pk...)
	}
	if len(keysWhere) == 0 {
		err := fmt.Errorf("LModel::Update where key not set! table : %s", t.table)
		return err
	}
	for _, key := range keysWhere {
		if where == "" {
			where = key + "=?"
		} else {
			where += fmt.Sprintf(" and %s=? ", key)
		}
		param = append(param, maps[strings.ToLower(key)])
	}
	sql := fmt.Sprintf("Update %s set %s where %s ", t.table, cols, where)
	_, err := t.orm.Raw(sql, param...).Exec()
	return err
}

func (t *LModel) Save(params config.LJSON, keysWhere ...string) error {
	if t.orm == nil {
		err := fmt.Errorf("LModel::Save, orm not set! table : %s", t.table)
		return err
	}
	var arg []interface{}
	var where string
	if len(keysWhere) == 0 {
		pk := t.orm.GetPK(t.table)
		keysWhere = append(keysWhere, pk...)
	}
	if len(keysWhere) == 0 {
		err := fmt.Errorf("LModel::Save, where key not set! table : %s", t.table)
		return err
	}
	for _, key := range keysWhere {
		if where == "" {
			where = key + "=?"
		} else {
			where += fmt.Sprintf(" and %s=? ", key)
		}
		arg = append(arg, params.Get(key).String())
		fmt.Println(arg...)
	}
	sql := fmt.Sprintf("select * from %s where %s ", t.table, where)
	var res config.LJSON
	num, err := t.orm.Raw(sql, arg...).ValuesJSON(&res)
	if num == 0 {
		err = t.Add(params)
	} else {
		err = t.Update(params, keysWhere...)
	}
	return err
}
