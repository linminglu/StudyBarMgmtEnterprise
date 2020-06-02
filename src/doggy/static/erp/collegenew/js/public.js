/*************************************************************************************
 * 全局分页组件
 * <div id="page">
        <vue-nav :cur.sync="cur" :all.sync="all" v-on:btn-click="listenDate"></vue-nav>
        <p style="margin-left:40px;">{{msg}}</p>
    </div>
 *************************************************************************************/

Vue.component('page-bar', {
    template: '<div class="page-bar">' +
        '<ul>' +
        '<li v-if="cur>1"><a v-on:click="cur--,pageClick()">上一页</a></li>' +
        '<li v-if="cur==1"><a class="banclick">上一页</a></li>' +
        '<li v-for="index in indexs"  v-bind:class="{ \'active\': cur == index}">' +
        '<a v-on:click="btnClick(index)" v-html="index"></a>' +
        '</li>' +
        '<li v-if="cur!=all"><a v-on:click="cur++,pageClick()">下一页</a></li>' +
        '<li v-if="cur == all"><a class="banclick">下一页</a></li>' +
        '<li><a>共<i v-html="all"></i>页</a></li>' +
        '</ul>' +
        '</div>',
    props: ['all', 'cur'],
    data: function () {
        return {}
    },
    methods: {
        btnClick: function (data) { //页码点击事件
            if (data != this.cur) {
                this.cur = data
            }
        },
        pageClick: function () {
            // console.log('现在在' + this.cur + '页');
            // this.$emit('btnclick', this.cur)
        }
    },
    watch: {
        cur: function (oldValue, newValue) {
            // console.log(arguments);
            this.$emit('btnclick', this.cur)
        }
    },
    computed: {
        indexs: function () {
            var left = 1;
            var right = this.all;
            var ar = [];
            if (this.all >= 5) {
                if (this.cur > 3 && this.cur < this.all - 2) {
                    left = this.cur - 2
                    right = this.cur + 2
                } else {
                    if (this.cur <= 3) {
                        left = 1
                        right = 5
                    } else {
                        right = this.all
                        left = this.all - 4
                    }
                }
            }
            while (left <= right) {
                ar.push(left)
                left++
            }
            return ar
        }
    }
})

/*-------------------------------------
    下拉复选框全局插件
    ---------------------------------------*/
Vue.component('yayigjDownCkListCom', {
    //const yayigjDownCkListCom = {
    template: '<div class="yayigjDownlist">' +
        '<div class="showValue" @click="openDownCklist"><input type="text" v-model="currentValue" ref="yayigjDownListCkVobj" readonly/></div>' +
        '<div class="top_ht_line" ref="top_ht_line" v-show="showCkList"></div>' +
        '<div class="downArea vplus_item"  v-show="showCkList" ref="plus_downCk_list_area">  ' +
        '    <p v-for="(item,index) in arrslist" @click.stop="noticefather(item,index)"  :class="{\'active\':item.active,\'unactive\':!item.active}"><input type="checkbox" v-model="item.selected"/><{item.key}></p>' +
        ' </div>' +
        '</div>',
    delimiters: ['<{', '}>'],
    props: {
        arrslist: {
            type: Array,
            default: function () {
                return []
            }
        },
        sizeparam: {
            type: Object,
            default: function () {
                return {
                    width: '150px',
                    height: '25px',
                    lineheight: '25px'
                }
            }
        },
        value: {
            type: String,
            default: function () {
                return ''
            }
        }
    },
    created: function () {
        //alert(this.initval)
    },
    mounted: function () {
        this.initSetDlistStyle()
        this.eventBind()
        this.initData()
    },
    computed: {
        currentValue: {
            get: function () {
                return this.value
            },
            set: function (val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        eventBind: function () {
            var _vm = this;
            document.documentElement.addEventListener('click', function (e) {
                let cssNameObj = e.target.parentElement
                if (cssNameObj === null || cssNameObj.className !== 'showValue') {
                    if (_vm.showCkList === true) {
                        _vm.showCkList = false;
                    }
                }
            }, false);
        },
        noticefather: function (item, index) {
            // this.showCkList = true
            item.selected = !item.selected
            this.selectStyle(item, index)
            let keys = [],
                vals = []
            this.arrslist.forEach(function (el) {
                if (el.selected === true) {
                    keys.push(el.key)
                    vals.push(el.val)
                }
            });
            this.currentValue = keys.join(',')
            this.$emit('getseled', keys.join(','), vals.join(','))
            // console.log('this.arrlist=', this.arrslist)  
        },
        openDownCklist: function () {
            if (this.arrslist.length > 0) {
                var _vm = this
                window.setTimeout(function () {
                    // console.log(_vm.$refs['plus_downCk_list_area'].offsetWidth)
                }, 50)
                this.showCkList = true
            }
        },
        initSetDlistStyle: function () {
            var obj = this.$refs['plus_downCk_list_area']
            var vObj = this.$refs['yayigjDownListCkVobj']
            var tWidth = parseInt(this.sizeparam.width) - 1,
                tHeight = parseInt(this.sizeparam.height) - 1
            var lineObj = this.$refs['top_ht_line']
            obj.setAttribute("style", "display:none;min-width:" + this.sizeparam.width + ";line-height:" + this.sizeparam.height)
            vObj.setAttribute("style", "width:" + tWidth + "px;height:" + this.sizeparam.height)
            lineObj.setAttribute("style", "display:none;top:2px;width:" + (tWidth - 2) + "px;top:" + tHeight + 'px')
        },
        selectStyle: function (item, index) {
            this.$nextTick(function () {
                this.arrslist.forEach(function (item) {
                    Vue.set(item, 'active', false);
                });
                Vue.set(item, 'active', true);
            });
        }
    },
    data: function () {
        return {
            showCkList: false
        }
    }
});

/*-------------------------------------
    城市选择器
    ---------------------------------------*/
const selectCitysCom =  {
    template: '<div class="yayigjDownlistOut" style="display:inline-block;">'+
        '<div class="yayigjDownlist">' +
        '<div class="showValue" @click="openDownCklist(0)"><input type="text" v-model="provinceObjc.value" ref="yayigjDownListCkVobj1" readonly/></div>' +
        '<div class="top_ht_line" ref="top_ht_line1" v-show="showCkList1"></div>' +
        '<div class="downArea vplus_item"  v-show="showCkList1" ref="plus_downCk_list_area1">  ' +
        '    <p v-for="(item,index) in arrslist1" @click.stop="noticefather(item,index,0)"  :class="{\'active\':item.active,\'unactive\':!item.active}"><input type="checkbox" v-model="item.selected"/><{item.value}></p>' +
        '</div>' +
        '</div>' + 
        '<div class="yayigjDownlist" style="margin-left:10px">' +
        '<div class="showValue" @click="openDownCklist(1)"><input type="text" v-model="cityObjc.value" ref="yayigjDownListCkVobj2" readonly/></div>' +
        '<div class="top_ht_line" ref="top_ht_line2" v-show="showCkList2"></div>' +
        '<div style="position:absolute;top:0;min-width: 87px;line-height: 30px;" class="downArea vplus_item" v-show="showCkList2" ref="plus_downCk_list_area2">  ' +
        '    <p v-for="(item,index) in arrslist2" @click.stop="noticefather(item,index,1)"  :class="{\'active\':item.active,\'unactive\':!item.active}"><input type="checkbox" v-model="item.selected"/><{item.value}></p>' +
        ' </div>' +
        '</div>'+
        '<div class="yayigjDownlist" style="margin-left:10px">' +
        '<div class="showValue" @click="openDownCklist(2)"><input type="text" v-model="areaObjc.value" ref="yayigjDownListCkVobj3" readonly/></div>' +
        '<div class="top_ht_line" ref="top_ht_line3" v-show="showCkList3"></div>' +
        '<div class="downArea vplus_item"  v-show="showCkList3" ref="plus_downCk_list_area3">  ' +
        '    <p v-for="(item,index) in arrslist3" @click.stop="noticefather(item,index,2)"  :class="{\'active\':item.active,\'unactive\':!item.active}"><input type="checkbox" v-model="item.selected"/><{item.value}></p>' +
        ' </div>' +
        '</div>' +
        '</div>',
    delimiters: ['<{', '}>'],
    props: {
        sizeparam: {
            type: Object,
            default: function () {
                return {
                    width: '175px',
                    height: '25px',
                    lineheight: '25px'
                }
            }
        },
        province: {
            type: String,
            default: function () {
                return ''
            }
        },
        city: {
            type: String,
            default: function () {
                return ''
            }
        },
        area: {
            type: String,
            default: function () {
                return ''
            }
        }
    },
    data:function(){
        return {
            showCkList1: false,
            showCkList2: false,
            showCkList3: false,
            allCityData:{}, // 所有省市区对象
            allCityArr:[],  //树状结构{key:'',value:'',children:[{key:'',value:'',children:[]},...],...}
            arrslist1:[],   // 省
            arrslist2:[],   // 市
            arrslist3:[],   // 区
            provinceObjc:{},  //当前选择省
            cityObjc:{},      //当前选择市
            areaObjc:{}       //当前选择区
        }
    },
    created: function () {
        //alert(this.initval)
    },
    watch: {
        province: function (newVal, oldVal) {
           
            this.refreshProsData()
        },
        city: function (newVal, oldVal) {
            this.refreshProsData()
        },
        area: function (newVal, oldVal) {
            this.refreshProsData()
        },
    },
    mounted: function () {
        var _this = this;
        this.initSetDlistStyle()
        this.eventBind()
        //匹配传入地址
        this.initData(()=>{
            
           _this.refreshProsData()
        })
    },
    computed: {
        currentValue: {
            get: function () {
                return this.value
            },
            set: function (val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        refreshProsData:function(){
            var _this = this
            _this.provinceObjc = {};
            _this.cityObjc = {};
            _this.areaObjc = {};
            for(key in _this.allCityData){
                var name = _this.allCityData[key];
            if(name == _this.province){
                _this.provinceObjc = {key:key,value:name}
            }
            if(name == _this.city){
                _this.cityObjc = {key:key,value:name}
            }
            if(name == _this.area){
                _this.areaObjc = {key:key,value:name}
            }
            }
            _this.refreshDatas();
        },
        initData:function(callback){
            var _this = this;
            this.allCityData = allCityData;
            if(callback){
                callback()
               }
            _this.processCityArr();
            // $.ajax({
			// 	url: "static/erp/collegenew/js/course/area.json",//json文件位置，文件名
			// 	type: "GET",//请求方式为get
			// 	dataType: "json", //返回数据格式为json
			// 	success: function(data) {//请求成功完成后要执行的方法 
			// 	   //给info赋值给定义好的变量
            //        _this.allCityData = data;
            //        if(callback){
            //         callback()
            //        }
            //        _this.processCityArr();
			// 	}
			// })
        },
        processCityArr(){
            // var citysArr=[];
            var originalData = this.allCityData;
            var tempProvinceDic = {};  //所有地区key的树状结构{key:{key:{key:{}}}}
            for (var key in originalData) {
                var start = key.substring(0,2);
                var middle = key.substring(2,4);
                var end = key.substring(4,6);
                //所有省
                if( middle + end == '0000'){
                    var object = {};
                    tempProvinceDic[key]= object;
                    //省和区同一个的数据需要构建
                    if(start=='81'||start=='82'||start=='00'||start=='11'||start=="12"||start=='31'||start=='50'){
                        object[key]= {};
                    }              
                } else {
                    //市
                    if(tempProvinceDic.hasOwnProperty(start+'0000')){
                        var obj =  tempProvinceDic[start+'0000'];
                        //省和区同一个的数据需要偏移
                        if(start=='81'||start=='82'||start=='00'||start=='11'||start=="12"||start=='31'||start=='50'){
                           //区
                           if (obj.hasOwnProperty(start+'0000')){
                               obj[start+'0000'][key] = {};
                           }
                        }else{
                         //区
                         if (obj.hasOwnProperty(start+middle+'00')){
                            var obj2 = obj[start+middle+'00'];
                            obj2[key] = {};
                          }else {
                            obj[key] = {};
                          }
                        }
                     
                    }
                }
            }
            //构建省市区层级数据 . [{key:key,value:value,children:[{key:key,value:value,children:[]},{},...]}]
            //所有省
            for(key in tempProvinceDic){
                var data = tempProvinceDic[key];
                var datalength = Object.keys(data).length;
                var object = {key:key,value:originalData[key],children:[]};
                if(datalength > 0){
                    //所有市
                    for(key2 in data){
                        var data2 = data[key2];
                        var data2length = Object.keys(data2).length;

                        var object2 = {key:key2,value:originalData[key2],children:[]};
                        object.children.push(object2)
                       
                        //所有区
                        if(data2length > 0) {
                            for(key3 in data2){
                                var object3 = {key:key3,value:originalData[key3],children:[]};
                                object2.children.push(object3)
                            }
                        }
                    }
                }
                this.allCityArr.push(object)
            }
            this.refreshDatas()
        },
        refreshDatas(){
            var _this = this;
            /*
            provinceObjc:{},  //当前选择省
            cityObjc:{},      //当前选择市
            areaObjc:{}  
            */

           if(Object.keys(this.provinceObjc) == 0){
            for(var i = 0;i<_this.allCityArr.length;i++){
              var province = _this.allCityArr[i];
               _this.arrslist1.push(Object.assign({},province))
            }
         
            _this.arrslist2 = [];
            _this.arrslist3 = [];
           }else{
            if(Object.keys(_this.cityObjc) == 0){
                var provinceArr = [];
                for(var i = 0;i<_this.arrslist1.length;i++){
                    var province = _this.arrslist1[i];
                    if(province.key == _this.provinceObjc.key){
                        provinceArr = province.children;
                        break;
                    }  
                }
                this.arrslist2 = provinceArr;
                this.arrslist3 = [];
            }else{
                if(Object.keys(this.areaObjc) == 0){
                    var areaArr = [];
                    for(var i = 0;i<_this.arrslist2.length;i++){
                        var city = _this.arrslist2[i];
                        if(city.key == _this.cityObjc.key){
                            areaArr = city.children;
                            break;
                        }
                    }
                    _this.arrslist3 = areaArr;
                }
            }
           }

           //设置选中
        if(this.provinceObjc&&this.provinceObjc.key&&this.provinceObjc.key.length > 0){
            for(var i = 0;i<_this.arrslist1.length;i++){
                var province = _this.arrslist1[i];
                if(province.key == _this.provinceObjc.key){
                    Vue.set(province, 'active', true);
                    Vue.set(province, 'selected', true);
                  }else{
                   Vue.set(province, 'active', false);
                   Vue.set(province, 'selected', false);
                  }
            }
        }else{
            for(var i = 0;i<_this.arrslist1.length;i++){
                var province = _this.arrslist1[i];
                Vue.set(province, 'active', false);
                Vue.set(province, 'selected', false);
            }
        }

        //Object.keys(this.cityObjc) > 0
        if(this.cityObjc&&this.cityObjc.key&&this.cityObjc.key.length > 0){
            for(var i = 0;i<_this.arrslist2.length;i++){
                var city = _this.arrslist2[i];
                if(city.key == _this.cityObjc.key){
                    Vue.set(city, 'active', true);
                    Vue.set(city, 'selected', true);
                  }else{
                    Vue.set(city, 'active', false);
                    Vue.set(city, 'selected', false);
                  }
            }
  
        }else{
            for(var i = 0;i<_this.arrslist2.length;i++){
                var city = _this.arrslist2[i];
                Vue.set(city, 'active', false);
                Vue.set(city, 'selected', false);
            }
        }
        //Object.keys(_this.areaObjc) > 0
        if(this.areaObjc&&this.areaObjc.key&&this.areaObjc.key.length > 0){
            for(var i = 0;i<_this.arrslist3.length;i++){
                var area = _this.arrslist3[i];
                if(area.key == _this.areaObjc.key){
                    Vue.set(area, 'active', true);
                    Vue.set(area, 'selected', true);
                  }else{
                   Vue.set(area, 'active', false);
                   Vue.set(area, 'selected', false);
                  }
            }
        }else{
            for(var i = 0;i<_this.arrslist3.length;i++){
                var area = _this.arrslist3[i];
                Vue.set(area, 'active', false);
                Vue.set(area, 'selected', false);
            }
        }
        },
        eventBind: function () {
            var _vm = this;
            document.documentElement.addEventListener('click', function (e) {
                let cssNameObj = e.target.parentElement
                if (cssNameObj === null || cssNameObj.className !== 'showValue') {
                    if (_vm.showCkList1 === true) {
                        _vm.showCkList1 = false;
                    }
                    if (_vm.showCkList2 === true) {
                        _vm.showCkList2 = false;
                    }
                    if (_vm.showCkList3 === true) {
                        _vm.showCkList3 = false;
                    }
                }
            }, false);
        },
        noticefather: function (item, index,tag) {
            // this.showCkList = true
            item.selected = true;
            
            if(item.selected){
                if(tag == 0){
                    this.provinceObjc =  item;
                    this.cityObjc = {};
                    this.areaObjc = {};
                    this.showCkList1 = false;
                    this.$emit('province',item.value)
                    this.$emit('city',"")
                    this.$emit('area',"")
                }else if (tag == 1){
                    this.cityObjc =  item;
                    this.areaObjc = {};
                    this.showCkList2 = false;
                    this.$emit('city',item.value)
                    this.$emit('area',"")
                }else{
                    this.areaObjc =  item;
                    this.showCkList3 = false;
                    this.$emit('area',item.value)
                }
            }
            this.refreshDatas();
            this.selectStyle(item, index,tag);
        },
        //点击弹出下拉框
        openDownCklist:function (tag) {  
            if(tag == 0){
                if (this.arrslist1.length > 0) {
                    this.showCkList1 = true
                }
            }else if (tag == 1){
                if (this.arrslist2.length > 0) {
                    this.showCkList2 = true
                }
            }else{
                if (this.arrslist3.length > 0) {
                    this.showCkList3 = true
                }
            }
        },
        initSetDlistStyle: function () {
            setTimeout(() => {
                var obj = this.$refs['plus_downCk_list_area1']
                var vObj = this.$refs['yayigjDownListCkVobj1']
                var tWidth = parseInt(this.sizeparam.width) - 1,
                    tHeight = parseInt(this.sizeparam.height) - 1
                var lineObj = this.$refs['top_ht_line1']
                obj.setAttribute("style", "position:absolute;display:none;width:" + (tWidth-2) + "px;line-height:" + this.sizeparam.height)
                vObj.setAttribute("style", "width:" + tWidth + "px;height:" + this.sizeparam.height)
                lineObj.setAttribute("style", "display:none;top:2px;width:" + (tWidth - 2) + "px;top:" + tHeight + 'px')
    
    
                var obj2 = this.$refs['plus_downCk_list_area2']
                var vObj2= this.$refs['yayigjDownListCkVobj2']
                var lineObj2 = this.$refs['top_ht_line2']
                obj2.setAttribute("style", "position:absolute;display:none;width:" + (tWidth-2) + "px;line-height:" + this.sizeparam.height)
                vObj2.setAttribute("style", "width:" + tWidth + "px;height:" + this.sizeparam.height)
                lineObj2.setAttribute("style", "display:none;top:2px;width:" + (tWidth - 2) + "px;top:" + tHeight + 'px')
    
                var obj3 = this.$refs['plus_downCk_list_area3']
                var vObj3 = this.$refs['yayigjDownListCkVobj3']
                var lineObj3 = this.$refs['top_ht_line3']
                obj3.setAttribute("style", "position:absolute;display:none;width:" + (tWidth-2) + "px;line-height:" + this.sizeparam.height)
                vObj3.setAttribute("style", "width:" + tWidth + "px;height:" + this.sizeparam.height)
                lineObj3.setAttribute("style", "display:none;top:2px;width:" + (tWidth - 2) + "px;top:" + tHeight + 'px')
            }, 0);
  
        },
        selectStyle: function (item, index,tag) {
            this.$nextTick(function () {
                if(tag == 0){
                    this.arrslist1.forEach(function (item) {
                        Vue.set(item, 'active', false);
                        Vue.set(item, 'selected', false);
                    });
                    Vue.set(item, 'active', true);
                    Vue.set(item, 'selected', true);
                }else if (tag == 1){
                    this.arrslist2.forEach(function (item) {
                        Vue.set(item, 'active', false);
                        Vue.set(item, 'selected', false);
                    });
                    Vue.set(item, 'active', true);
                    Vue.set(item, 'selected', true);
                }else{
                    this.arrslist3.forEach(function (item) {
                        Vue.set(item, 'active', false);
                        Vue.set(item, 'selected', false);
                    });
                    Vue.set(item, 'active', true);
                    Vue.set(item, 'selected', true);
                }
            });
        }
    }
}

Vue.prototype.showAlert = function (title, callback) {
    jQuery.showDel(title, '提示',
        function () {
            if (callback) {
                callback()
            }
            jQuery.loading();
            jQuery.pop_window_modal_dialog_close({ _closemothod: 'fadeOutUp' });
        }, function () {
            jQuery.pop_window_modal_dialog_close({ _closemothod: 'fadeOutUp' });
        })

}

Vue.prototype.showError = function (title, content, callback) {
    jQuery.showError(content, title);
}


Vue.prototype.downloadData = function (linkid,data,fileName) {
    data = "\ufeff"+data;  
    var blob = new Blob([data], { type: 'text/csv,charset=UTF-8'});  
    var csvUrl = URL.createObjectURL(blob);
    var link = $(linkid);
    link.attr("href",csvUrl); 
    link.attr("download",fileName); 
}


Vue.prototype.uploadVodVideo = function(uplodProcess){
    let param = {}
    // $.post('/butler/collage/ossparam',param,function(data){
    //     //debugger;
    //     if(data.code == 1){
    //         set_upload_param(uploader,data.list);
    //         uploader.start(data.list);
    //     }else{
    //         console.log(data.info);
    //     }
    // })
        let self = this
        let uploader = new AliyunUpload.Vod({
          timeout: 60000 ,
          partSize: 1048576,
          parallel:  5,
          retryCount: 3,
          retryDuration: 2,
          region: "cn-shanghai",
          userId: "1860883548208263",
          // 添加文件成功
          addFileSuccess: function (uploadInfo) {
            console.log("addFileSuccess: " + uploadInfo.file.name)
          },
          // 开始上传
          onUploadstarted: function (uploadInfo) {
            // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
            // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
            // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
            // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
            // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
            // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
            if (!uploadInfo.videoId) {
                $.post('/butlerp/business/getvideouploadinfo',param,function(data){
                    let uploadAuth = data.UploadAuth
                    let uploadAddress = data.UploadAddress
                    let videoId = data.VideoId
                    uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId)
                })
            //   self.statusText = '文件开始上传...'
              console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object)
            } else {
                $.post('/butlerp/business/refreshvideouploadinfo',param,function(data){
                    let uploadAuth = data.UploadAuth
                    let uploadAddress = data.UploadAddress
                    let videoId = data.VideoId
                    uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress,videoId)
                })
            }
          },
          // 文件上传成功
          onUploadSucceed: function (uploadInfo) {
            console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object)
            self.statusText = '文件上传成功!'
          },
          // 文件上传失败
          onUploadFailed: function (uploadInfo, code, message) {
            console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message)
    
          },
          // 取消文件上传
          onUploadCanceled: function (uploadInfo, code, message) {
            console.log("Canceled file: " + uploadInfo.file.name + ", code: " + code + ", message:" + message)
    
          },
          // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
          onUploadProgress: function (uploadInfo, totalSize, progress) {
            console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(progress * 100) + "%")
            let progressPercent = Math.ceil(progress * 100)
            if(uplodProcess){
                uplodProcess(progressPercent)
            }
          },
          // 上传凭证超时
          onUploadTokenExpired: function (uploadInfo) {
            // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
            // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
            // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
            $.post('/butlerp/business/refreshvideouploadinfo',param,function(data){
                let uploadAuth = data.UploadAuth
                uploader.resumeUploadWithAuth(uploadAuth)
                console.log('upload expired and resume upload with uploadauth ' + uploadAuth)
            })
          },
          // 全部文件上传结束
          onUploadEnd: function (uploadInfo) {
            console.log("onUploadEnd: uploaded all the files")
         
          }
        })
        return uploader
} 