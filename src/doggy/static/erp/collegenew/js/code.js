// jQuery.createAniCss();
//------------------------
// 所有主播组件
//------------------------
var code_pcom = {
    delimiters: ['<{', '}>'],
    template: "#code_id",
    data: function () {
        var _that = this;
        return {
            msg1: '分拥比例管理',
            test: 'this is test',
            data_list: [],
            anchor_list: [],
            reserveApi: {},
            condition: '',
            dataindex: -1,
            swhereObj_allanchors: null,
            addCodeText:'',
            addRateText: 0,
            addRateText_Flag:false,
            addproportiontext: '', //用户当前的分佣比例
            addproportiontextid: '',//用户当前的分佣比例对应的ID
            anchorid: '',
            selectEmployID: '',//用户当前选中的分佣比例ID
            pgetroportionarr: [{
                'key': '10%', 'val': '1'
            }, {
                'key': '20%', 'val': '2'
            }, {
                'key': '30%', 'val': '3'
            }, {
                'key': '40%', 'val': '4'
            }, {
                'key': '50%', 'val': '5'
            }
            ],
            //主播抽佣比例添加
            sizeparam: {
                width: '180px',
                height: '25px',
                lineheight: '25px',
                voffset: '0px',
                isReadOnly: true
            },
            //选择单课程加入 <兑换码列表>
            model_add_signle: {
                isShow: true,
                isActive: false,
                showHeader: true,
                showFooter: true,
                showCancel: true,
                showOk: true,
                transition: 'fade',
                backdrop: false,
                title: '选择单课程',
                okText: '确定',
                cancelText: '取消',
                width: 980,
                height: 540,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                okLoading: false,
                onOk: function(param) {
                    console.log('param= OkBtn', param)
                },
                onCancel: function(param) {
                    console.log('param canBtn=', param)
                    _that.SeriesAddSignleList = [];
                }
            },
            addproportion: {
                isShow: true,
                isActive: false,
                showHeader: true,
                showFooter: true,
                showCancel: true,
                showOk: true,
                transition: 'fade',
                backdrop: false,
                title: '添加抽佣比例',
                okText: '确定',
                cancelText: '取消',
                width: 470,
                height: 200,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                okLoading: false,
                onOk: function (param) {
                    console.log('param= OkBtn', param)
                    if (_that.addRateText_Flag == true) {
                        jQuery.postFail('','数量设置错误');
                        return;
                    }
                    $.ajax({
                        data: {
                            codevalue: _that.addCodeText,
                            num: _that.addRateText
                        },
                        url: '/butlerp/business/addcode',
                        dataType: 'json',
                        type: 'post',
                        success: function (json) {
                            console.log(json);
                            _that.backmainpage();
                        },
                    });
                },
                onCancel: function (param) {
                    console.log('param canBtn=', param)
                }
            },
            //修改抽佣比例
            modifyproportion: {
                isShow: true,
                isActive: false,
                showHeader: true,
                showFooter: true,
                showCancel: true,
                showOk: true,
                transition: 'fade',
                backdrop: false,
                title: '修改比例',
                okText: '确定',
                cancelText: '取消',
                width: 580,
                height: 230,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                okLoading: false,
                onOk: function (param) {
                    console.log('param= OkBtn', param);
                    if (_that.selectEmployID == _that.addproportiontextid) {
                        return;
                    } else {
                        $.ajax({
                            data: {
                                oldemployrateid: _that.addproportiontextid,
                                newemployrateid: _that.selectEmployID,
                                anchorid: _that.anchorid
                            },
                            dataType: 'json',
                            type: 'post',
                            url: '/butlerp/business/modifyuseremploy',
                            success: function (json) {
                                if (json.code == 1) {
                                    _that.seeclassinfo(_that.dataindex);
                                }
                            },
                        });
                    }
                },
                onCancel: function (param) {
                    console.log('param canBtn=', param)
                }
            },
            current_page: 0, //0代表分拥比例管理页面， 1代表详情页面
            number_of_data_per_page_arr: [{ 'key': '10', 'val': '10' }, { 'key': '20', 'val': '20' }, { 'key': '50', 'val': '50' }, { 'key': '100', 'val': '100' }],//分页控制器分页大小
            sizepageparam: {
                width: '50px',
                height: '37px',
                lineheight: '35px',
                voffset: '0px',
                isReadOnly: true
            },
            details: {      //所数据列表 翻页
                all: 0,
                cur: 1,
                number_of_data_per_page: 10,
            },
            userDetails:{
                all:0,
                cur:1,
                number_of_data_per_page:10
            },
        }
    },
    // computed: {
    //     theRate: {
    //         get: function () {
    //             return this.addRateText;
    //         },
    //         set: function (newValue) {
    //             this.addRateText = newValue.replace(/[0](\.\d{1,2})?$/, ''); //
    //             //  /^\d+(\.\d{1,2})?$/
    //         }
    //     }
    // },
    components: {
        'addedtModal': vueModal_com,
        'yayigjDownlist': yayigjDownListCom
    },
    methods: {
        focusRate:function(){
            var _that = this;
            _that.addRateText_Flag = false; 
        },

        isRateOk:function(s){
            var reg = /(^[1-9]\d*$)/;
            return reg.test(s);
        },
        blurRate:function(){
            var _that = this;
            if(_that.addRateText == ""){
                _that.addRateText = 0;
                _that.addRateText_Flag = false;
            }else{
                if(_that.isRateOk(_that.addRateText) == true){
                    _that.addRateText_Flag = false;
                }else{
                    _that.addRateText_Flag = true;
                }
            }
        },
        setChdAdsSeledVal: function (v) {
            console.log(v)
            var _that = this;
            _that.selectEmployID = v;
        },
        getpageinfo() {
            var _that = this;
            _that.data_list = [];
            // _that.getid('setmanage').style.display='block';
            // _that.getid('seemanage').style.display='none';
            // this.getid("setmanage").appendChild("<div class='loading'></div>");
            $.ajax({
                data: {
                    page: _that.details.cur,
                    per_page: _that.details.number_of_data_per_page
                },
                dataType: 'json',
                type: 'post',
                url: '/butlerp/business/codelist',
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];
                        _that.data_list = tmp;
                        _that.details.all = Math.ceil(json.totalcount / _that.details.number_of_data_per_page);
                    }
                    _that.refreshNavigation();
                },

                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (json) {
                    // this.getid("setmanage").find(".loading").remove();
                    jQuery.loading_close();
                },
            });
        },

        // 添加分佣比例弹窗
        addpoproportion() {
            var _that = this
            _that.addproportion.isActive = true;
            _that.addCodeText = '';
            _that.addRateText = 0;
            _that.addRateText_Flag = false;
        },

        refreshNavigation() {
            if (this.current_page == 0) {
                var next_span = document.getElementById("detail_span");
                if (next_span) {
                    this.getid('back_main_navi').removeChild(next_span);
                }
                this.getid('backmainpage').onclick = function () {
                    window.location.reload();
                };

            } else if (this.current_page == 1) {
                this.getid('backmainpage').style.cursor = 'pointer';
                this.getid('backmainpage').onclick = this.backmainpage;

                var next_span = document.getElementById("detail_span");
                if (next_span) {
                    return;
                }
                var next_span = document.createElement("span");
                next_span.innerText = " > 详情";
                next_span.id = "detail_span";
                this.getid('back_main_navi').appendChild(next_span);
            }

        },
        seeclassinfo(index) {
            var _that = this;

            if (index >= 0) {
                _that.dataindex = index;
                _that.condition = '';
            }
            _that.anchor_list = [];
            _that.current_page = 1;
            _that.getid('setmanage').style.display = 'none';
            _that.getid('seemanage').style.display = 'block';
            _that.refreshNavigation();
            $.ajax({
                url: '/butlerp/business/codesignlelist',
                data: {
                    codeid: _that.data_list[_that.dataindex].codeid,
                    condition: _that.condition,
                    page: _that.userDetails.cur,
                    per_page: _that.userDetails.number_of_data_per_page
                },
                dataType: 'json',
                type: 'post',
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];
                        _that.anchor_list = tmp;
                        _that.userDetails.all = Math.ceil(json.totalcount / _that.userDetails.number_of_data_per_page);
                    }
                }
            });
        },
        backmainpage() {
            var _that = this;
            this.current_page = 0;
            _that.getid('setmanage').style.display = 'block';
            _that.getid('seemanage').style.display = 'none';
            _that.getpageinfo();
            _that.getid('backmainpage').style.cursor = 'text';
            this.refreshNavigation();
        },
        deleteSignle(index){
            var _that = this;
            $.ajax({
                dataType: 'json',
                type: 'post',
                url: '/butlerp/business/delcodesignle',
                data: {
                    relid: _that.anchor_list[index].relid
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        jQuery.postOk("","删除成功");
                        _that.seeclassinfo(-1);
                    }else{
                        jQuery.postFail("",json.info);
                    }
                }
            });
        },
        modifyset(index) {
            var _that = this;
            _that.pgetroportionarr = [];
            _that.addproportiontext = "";
            _that.addproportiontextid = _that.anchor_list[index].employrateid;
            _that.selectEmployID = "";
            _that.anchorid = _that.anchor_list[index].anchorid;
            $.ajax({
                dataType: 'json',
                type: 'post',
                url: '/butlerp/business/employratelist',
                data: {
                    all: 1
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];
                        for (var i = 0; i < tmp.length; i++) {
                            var temp = {
                                "key": tmp[i].rate,
                                "val": tmp[i].employrateid
                            };
                            _that.pgetroportionarr.push(temp);
                            if (_that.addproportiontextid == tmp[i].employrateid) {
                                _that.addproportiontext = tmp[i].rate;
                                _that.selectEmployID = tmp[i].employrateid;
                            }
                        }
                    }
                }
            });
            _that.modifyproportion.isActive = true
        },
        getid(id) {
            return document.getElementById(id)
        },
        //分页控件下拉选择每页多少
        setNumberOfDataPerPage(number) {
            this.details.number_of_data_per_page = number;
            console.log(number);

            this.details.cur = 1;
            // 总页数

            if (this.current_page == 0) {
                this.getpageinfo();
            } else if (this.current_page == 1) {
                this.seeclassinfo(this.dataindex);
            }
        },

         //分页控件下拉选择每页多少
         UsersetNumberOfDataPerPage(number) {
            this.userDetails.number_of_data_per_page = number;
            this.userDetails.cur = 1;
            // 总页数
            this.seeclassinfo(this.dataindex);
            
        },

        //分页事件 
        listenpage: function (data) {
            var index = data;
            this.details.cur = index;
            if (this.current_page == 0) {
                this.getpageinfo();
            } else if (this.current_page == 1) {
                this.seeclassinfo(this.dataindex);
            }
        },
        //分页事件 
        userlistenpage: function (data) {
            var index = data;
            this.seeclassinfo(this.dataindex);
        },
    },
    mounted() {
        var _that = this;
        _that.getid('setmanage').style.display = 'block';
        _that.getid('seemanage').style.display = 'none';
    },
    created() {
       
        $.ajaxSetup({
            beforeSend: function(){
                jQuery.loading('加载中',1);
            },
            complete:function(){
                jQuery.loading_close();
            }	
        });

        this.getpageinfo();
    }
};