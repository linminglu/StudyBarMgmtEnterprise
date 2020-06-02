var onlineroomstatistic_pcom = {
    delimiters: ['<{', '}>'],
    template: "#onlineroomstatistic_id",
    data: function () {
        // var _that = this
        return {
            signleid:'',
            course:'',
            condition: {
                begintime: '',
                endtime: '',
                showstatus: '全部', //展示用
                state: '', //提交数据用
                content: '',
                attribute: {
                    width: '80px',
                    height: '30px',
                    lineheight: '30px',
                    voffset: '0px',
                    isReadOnly: true
                },
                valueList:
                    [{ 'key': '全部', 'val': '' },
                    { 'key': '正常', 'val': '1' },
                    { 'key': '下架', 'val': '0' }]
            },
            data_list: [],
            lastitem: { 'title': '页汇总', 'num': 0 }, //页面统计
            homeparam: {
                page: 1,
                pagesize: 10,
                total: 10,
                attribute: {
                    width: '50px',
                    height: '37px',
                    lineheight: '35px',
                    voffset: '0px',
                    isReadOnly: true
                },
                valueList:
                    [{ 'key': '10', 'val': '10' },
                    { 'key': '20', 'val': '20' },
                    { 'key': '30', 'val': '30' },
                    { 'key': '50', 'val': '50' }]
            }
        }
    },
    components: {
        'addedtModal': vueModal_com,
        'yayigjDownlist': yayigjDownListCom,
        'yayigjDatesel': vyayigjDateSelcom
    },
    filters: {

    },
    computed: {


    },
    watch: {

    },
    methods: {
        resetSearchData() {
            this.condition.begintime = ''
            this.condition.endtime = ''
        },
        goback() {
            this.$router.go(-1)
        },
        refrehHomeList() {
            var _that = this
            var page = this.homeparam.page;
            var per_page = this.homeparam.pagesize;
            var url = '/butlerp/business/statroom';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {
                    signleid:_that.signleid,
                    starttime: _that.condition.begintime,
                    endttime: _that.condition.endtime,
                    page: page,
                    per_page: per_page,
                },
                success: function (json) {
                    var list = json.list;
                    var total = json.totalcount;
                    if (list instanceof Array) {
                        _that.data_list = list;
                        var totalObject = { 'visitdate': '页汇总',onlinecount:0,onlinenum:0,offlinecount:0,offlinenum:0,totalnum:0,totalcount:0 }
                        for (let i = 0; i < _that.data_list.length; i++) {
                            var item = _that.data_list[i]
                            totalObject.onlinecount += parseInt(item.onlinecount);
                            totalObject.onlinenum += parseInt(item.onlinenum);
                            totalObject.offlinecount += parseInt(item.offlinecount);
                            totalObject.offlinenum += parseInt(item.offlinenum);
                            totalObject.totalnum += parseInt(item.totalnum);
                            totalObject.totalcount += parseInt(item.totalcount);
                        }
                        _that.data_list.push(totalObject)
                        //总页数
                        _that.homeparam.total = total;
                    } else {
                        _that.data_list = [];
                        //总页数
                        _that.homeparam.total = 0;

                    }
                }
            });
        },
        homePageChange(page) {
            this.homeparam.page = page;
            this.refrehHomeList()
        },
        homePagesizeChange(pagesize) {
            var param = this.homeparam
            param.page = 1;
            param.pagesize = pagesize;
            this.refrehHomeList()
        },
        //获取单课程详情
        getSingleDetail() {
            var _that = this;
            if (!_that.signleid) {
                return
            }
            $.ajax({
                url: '/butlerp/business/signledetail',
                data: {
                    signleid: _that.signleid
                },
                dataType: 'json',
                type: 'post',
                success: function (json) {
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];
                        if (tmp.length == 0) {
                            jQuery.postFail("", "获取单课程信息失败");
                            return;
                        }
                        var course = tmp[0];
                        _that.course = course
                    } else {
                        jQuery.postFail('', json.info);
                    }
                }
            });

        },
    },
    mounted() {
        var data = this.$route.query
        this.signleid = data.signleid
        this.refrehHomeList()
        this.getSingleDetail()
    }
};