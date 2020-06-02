//------------------------
// 收入组件
//------------------------
var income_pcom = {
    delimiters: ['<{', '}>'],
    template: "#income_id",
    data: function () {
        return {
            msg1: '分拥比例管理',
            test: 'this is test',
            download_data_list:[],
            data_list: [],
            data_list_gather: [],//汇总列表数据源
            data_list_turnover: [],//流水列表数据源
            reserveApi: {},
            swhereObj_allanchors: null,
            date: '',
            date1: '',
            anchor: '',
            anchor_mobile: '',
            anchorarr: [],
            sizeparam: {
                width: '180px',
                height: '25px',
                lineheight: '25px',
                voffset: '0px',
                isReadOnly: true
            },
            current_page: 0,//汇总和流水切换, 0代表汇总， 1代表流水
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
            last_number_of_data_per_page: 10,
        }
    },
    components: {
        'addedtModal': vueModal_com,
        'yayigjDownlist': yayigjDownListCom,
        'yayigjDatesel': vyayigjDateSelcom,
    },
    methods: {
        //处理主播下拉菜单选中关系
        setChdAdsSeledVal(v) {
            var _that = this;
            console.log(v);
            _that.anchor_mobile = v;
            for (const ele in _that.anchorarr) {
                if (_that.anchorarr.hasOwnProperty(ele)) {
                    const element = _that.anchorarr[ele];
                    if (element.val == v) {
                        if (element.key.length > 0) {
                            _that.anchor = element.key;//没有名字的情况优化处理显示手机号
                        } else {
                            _that.anchor = element.val;
                        }

                        break;
                    }
                }
            }

            this.searchData();
        },


        //查找数据
        searchData() {
            this.details.cur = 1;
            if (this.current_page == 0) {
                this.getIncomeGatherData();

            } else if (this.current_page == 1) {
                this.getIncomeTurnoverData();
                this.getallIncomeData()
            }
        },

        //获取收入数据
        getIncomeGatherData() {
            var _that = this;
            var endtime_tmp = this.date1 + ' 23:59:59';
            $.ajax({
                url: '/butlerp/business/anchorstatlist',
                type: 'post',
                dataType: 'json',
                data: {
                    begintime: this.date,
                    endtime: endtime_tmp,
                    // condition: this.anchor_mobile,
                    condition: this.anchor,
                    page: this.details.cur,
                    per_page: this.details.number_of_data_per_page
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        _that.data_list_gather = json.list;
                        _that.data_list = _that.data_list_gather;
                        _that.details.all = Math.ceil(json.totalcount / _that.details.number_of_data_per_page);
                        // _that.refreshDownloadData()
                    }
                }
            });
        },
        refreshDownloadData(){
            var arr = this.download_data_list;
            if(!arr){
                return
            }
            var title='主播名称,时间,交易编号,课程名称,购买用户,总金额,主播分佣,平台分佣\n'
            var data = ''
            var totalPaidfee = 0
            var totalEarnings = 0
            var totalPlatformfee = 0
            for(let i = 0;i<arr.length;i++){
               var item = arr[i]
               data = data + item.anchorname +','+item.buytime +','
               +"\t"+item.orderid.toString() +','+item.title +','+item.mobile.toString() +','+
               item.paidfee +','+ item.earnings +','+item.platformfee +'\n';
               totalPaidfee += parseFloat(item.paidfee)
               totalEarnings += parseFloat(item.earnings)
               totalPlatformfee += parseFloat(item.platformfee)
            }
            var totalItem = '合计' +','+'' +','
            +'' +','+'' +','+'' +','+
            totalPaidfee +','+ totalEarnings +','+totalPlatformfee +'\n';
            data = title + data + totalItem;
            var filename = '主播收入流水'+'('+this.date+'~'+this.date1+')' + '.csv'
            if (this.date == ""){
                filename = '主播收入流水.csv'
            }
            this.downloadData("#downloadCsv",data,filename);
        },
        getallIncomeData(){
            var _that = this;
            var endtime_tmp = this.date1 + ' 23:59:59';
            $.ajax({
                url: '/butlerp/business/anchorincomelist',
                type: 'post',
                dataType: 'json',
                data: {
                    begintime: this.date,
                    endtime: endtime_tmp,
                    // condition: this.anchor_mobile,
                    condition: this.anchor,
                    searchall:'1'
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        _that.download_data_list = json.list
                        _that.refreshDownloadData()
                    }
                }
            });
        },
        //获取流水数据
        getIncomeTurnoverData() {
            var _that = this;
            var endtime_tmp = this.date1 + ' 23:59:59';
            $.ajax({
                url: '/butlerp/business/anchorincomelist',
                type: 'post',
                dataType: 'json',
                data: {
                    begintime: this.date,
                    endtime: endtime_tmp,
                    // condition: this.anchor_mobile,
                    condition: this.anchor,
                    page: this.details.cur,
                    per_page: this.details.number_of_data_per_page
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        _that.data_list_turnover = json.list;
                        _that.data_list = _that.data_list_turnover;
                        _that.details.all = Math.ceil(json.totalcount / _that.details.number_of_data_per_page);
                        _that.refreshDownloadData()
                    }
                }
            });
        },

        // 所有主播
        getallanchors: function () {
            var _that = this;
            var data = this.param;
            var url = '/butlerp/business/anchorlist';
            $.ajax({
                type: 'post',
                url: url,
                data: data,
                dataType: "json",
                success: function (data) {
                    var anchorArr_tmp = [];  //申明数组变量
                    anchorArr_tmp.push({  //拼接一个所有人选项
                        'key': "全部",
                        'val': "",
                    });
                    for (const ele in data.list) {
                        if (data.list.hasOwnProperty(ele)) {
                            const element = data.list[ele];


                            //如果名字为空， 显示手机号
                            if (element.name.length > 0) {
                                anchorArr_tmp.push({   //类似于JS添加JSON的字典方法，Key对应键值，value对应值
                                    'key': element.name,
                                    'val': element.mobile,
                                });
                            } else {
                                anchorArr_tmp.push({   //类似于JS添加JSON的字典方法，Key对应键值，value对应值
                                    'key': element.mobile,
                                    'val': element.mobile,
                                });
                            }
                        }
                    }

                    _that.anchorarr = anchorArr_tmp;
                    if (anchorArr_tmp.length > 0) {
                        _that.anchor = anchorArr_tmp[0].key;
                        _that.anchor_mobile = anchorArr_tmp[0].val;
                    }

                }
            });
        },

        //统计总收入
        getTotalEarnings() {
            if (this.current_page == 0) {
                var _that = this;
                if (_that.data_list != null && _that.data_list instanceof Array) {
                    var tmp = 0.0;
                    for (const ele in _that.data_list) {
                        if (_that.data_list.hasOwnProperty(ele)) {
                            const element = _that.data_list[ele];
                            var f = parseFloat(element.earnings);
                            tmp += f;
                        }
                    }
                    return tmp.toFixed(2);
                } else {
                    return 0;
                }
            }
        },

        //统计总金额
        getTotalTurnoverPaidfee() {
            if (this.current_page == 1) {
                if (this.data_list != null && this.data_list instanceof Array) {
                    var tmp = 0.0;
                    for (const ele in this.data_list) {
                        if (this.data_list.hasOwnProperty(ele)) {
                            const element = this.data_list[ele];
                            var f = parseFloat(element.paidfee);
                            tmp += f;
                        }
                    }
                    return tmp.toFixed(2);
                } else {
                    return 0;
                }
            }
        },

        //统计主播分佣
        getTotalTurnoverEarnings() {
            if (this.current_page == 1) {
                if (this.data_list != null && this.data_list instanceof Array) {
                    var tmp = 0.0;
                    for (const ele in this.data_list) {
                        if (this.data_list.hasOwnProperty(ele)) {
                            const element = this.data_list[ele];
                            var f = parseFloat(element.earnings);
                            tmp += f;
                        }
                    }
                    return tmp.toFixed(2);
                } else {
                    return 0;
                }
            }
        },

        //统计平台分佣
        getTotalTurnoverPlatformfee() {
            if (this.current_page == 1) {
                if (this.data_list != null && this.data_list instanceof Array) {
                    var tmp = 0.0;
                    for (const ele in this.data_list) {
                        if (this.data_list.hasOwnProperty(ele)) {
                            const element = this.data_list[ele];
                            var f = parseFloat(element.platformfee);
                            tmp += f;
                        }
                    }
                    return tmp.toFixed(2);
                } else {
                    return 0;
                }
            }
        },

        //获取当期时间字符串
        dateToString(now) {
            var year = now.getFullYear();
            var month = (now.getMonth() + 1).toString();
            var day = (now.getDate()).toString();
            // var hour = (now.getHours()).toString();
            // var minute = (now.getMinutes()).toString();
            // var second = (now.getSeconds()).toString();

            if (month.length == 1) {
                month = "0" + month;
            }
            if (day.length == 1) {
                day = "0" + day;
            }

            // var dateTime = year + "-" + month + "-" + day + ' ' + hour + ':' + minute + ':' + second;
            var dateTime = year + "-" + month + "-" + day;
            return dateTime;
        },

        //切换汇总和流水
        switchPageToGather() {
            //处理按钮状态
            $("#turnover").removeClass("inc_solid");
            $("#turnover").addClass("inc_hollow");
            $("#gather").removeClass("inc_hollow");
            $("#gather").addClass("inc_solid");
            this.current_page = 0;//切换状态控制
            this.data_list = this.data_list_gather;
            var tmp = this.details.number_of_data_per_page;
            this.details.number_of_data_per_page = this.last_number_of_data_per_page;
            this.last_number_of_data_per_page = tmp;

            //交替显示table
            $("#gather_table").css("display", "table");
            $("#turnover_table").css("display", "none");
        },
        switchPageToTurnover() {
            //处理按钮状态
            $("#gather").removeClass("inc_solid");
            $("#gather").addClass("inc_hollow");
            $("#turnover").removeClass("inc_hollow");
            $("#turnover").addClass("inc_solid");
            this.current_page = 1;//切换状态控制
            this.data_list = this.data_list_turnover;
            var tmp = this.details.number_of_data_per_page;
            this.details.number_of_data_per_page = this.last_number_of_data_per_page;
            this.last_number_of_data_per_page = tmp;

            //交替显示table
            $("#turnover_table").css("display", "table");
            $("#gather_table").css("display", "none");
        },


        //分页事件 
        listenpage: function (data) {
            var index = data;
            this.details.cur = index;
            if (this.current_page == 0) {
                this.getIncomeGatherData();

            } else if (this.current_page == 1) {
                this.getIncomeTurnoverData();
            }
        },

        //分页控件下拉选择每页多少
        setNumberOfDataPerPage(number) {
            this.details.number_of_data_per_page = number;
            console.log(number);

            this.details.cur = 1;
            // 总页数

            if (this.current_page == 0) {
                this.getIncomeGatherData();
            } else if (this.current_page == 1) {
                this.getIncomeTurnoverData();
            }
        }
    },

    //生命周期方法
    created() {
        // this.getallanchors();//获取主播下拉菜单

        $.ajaxSetup({
            beforeSend: function(){
                jQuery.loading('加载中',1);
            },
            complete:function(){
                jQuery.loading_close();
            }	
        });
        
        var myDate = new Date();
        this.date = this.dateToString(myDate);
        this.date1 = this.dateToString(myDate);
        this.searchData();//刷新收入列表


    }

};