//------------------------
// 概述组件
//------------------------
function Course() {
    var course_tmp = new Object;
    course_tmp.classid = '';
    course_tmp.classtype = '';
    course_tmp.paidfee = '';
    course_tmp.earnings = '';
    course_tmp.platformfee = '';
    course_tmp.title = '';
    course_tmp.clicknum = '';
    course_tmp.buynum = '';
    course_tmp.changeRate = '';
    return course_tmp;
};

var summary_pcom = {
    delimiters: ['<{', '}>'],
    template: "#summary_id",
    data: function () {
        return {
            msg1: '',
            test: 'this is test',
            data_list: [],
            statistic_datas: {//累计统计数据
                anchorfee: '',//主播累计分佣
                platformfee: '',//平台累计分佣
                todayfee: '',//今日平台分佣
                totafee: '',//累计总收入
                yesterdayfee: '',//昨日平台分佣
            },
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
        }
    },
    components: {
        'addedtModal': vueModal_com,
        'yayigjDownlist': yayigjDownListCom,
        'yayigjDatesel': vyayigjDateSelcom,
    },
    methods: {
        //获取累计统计数据
        getStatisticsData(){
            var _that = this;
            $.ajax({
                url: '/butlerp/business/totalstat',
                type: 'post',
                dataType: 'json',
                data: {
                },
                success: function (json) {
                    console.log(json);
                    _that.statistic_datas.anchorfee = '￥' + json.list.anchorfee;
                    _that.statistic_datas.platformfee = '￥' + json.list.platformfee;
                    _that.statistic_datas.todayfee = '￥' + json.list.todayfee;
                    _that.statistic_datas.totafee = '￥' + json.list.totafee;
                    _that.statistic_datas.yesterdayfee = '￥' + json.list.yesterdayfee;
                }
            });
        },

        //获取课程数据
        getCourseData(){
            var _that = this;
            $.ajax({
                url: '/butlerp/business/totalstatlist',
                type: 'post',
                dataType: 'json',
                data: {
                    page: this.details.cur,
                    per_page: this.details.number_of_data_per_page
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {

                        _that.data_list = [];

                        for (const ele in json.list) {
                            if (json.list.hasOwnProperty(ele)) {
                                const element = json.list[ele];
                                var arr = element.title.split("||");
                                var title = arr[0];
                                var clicknum = arr[1];
                                var buynum = arr[2];

                                var course = Course();
                                course.classid = element.classid;
                                course.classtype = element.classtype;
                                course.paidfee = element.paidfee;
                                course.earnings = element.earnings;
                                course.platformfee = element.platformfee;
                                course.title = title;
                                course.clicknum = clicknum;
                                course.buynum = buynum;
                                course.changeRate = (buynum / clicknum * 100).toFixed(2)+ '%';
                                if (!(buynum / clicknum >= 0)) {
                                    course.changeRate = '0.00%';
                                }
                                if (!(course.clicknum >= 0)) {
                                    course.clicknum = 0;
                                }
                                if (!(course.buynum >= 0)) {
                                    course.buynum = 0;
                                }

                                _that.data_list.push(course);
                            }
                        }
                        _that.details.all = Math.ceil(json.totalcount / _that.details.number_of_data_per_page);
                    }
                }
            });
        },

        //分页控件下拉选择每页多少
        setNumberOfDataPerPage(number) {
            this.details.number_of_data_per_page = number;
            console.log(number);

            this.details.cur = 1;
            // 总页数

            this.getCourseData();
        },

        //分页事件 
        listenpage: function (data) {
            var index = data;
            this.details.cur = index;
            this.getCourseData();
        },
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
        
        this.getStatisticsData();

        this.getCourseData();
    }
};