var studybarstatistics_pcom = {
    delimiters: ['<{', '}>'],
    template: "#studybarstatistics_id",
    data: function () {
        // var _that = this
        return {
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
            download_data_list:[],
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
        refreshDownloadData(){
            var _that = this
            var arr = this.download_data_list;
            if(!arr){
                return
            }
            var title='日期,app访问人次,微信访问人次,app访问人数,微信访问人数,访问人次汇总,访问人数汇总\n'
            var data = ''
            for(let i = 0;i<arr.length;i++){
               var item = arr[i]
               data = data + item.visitdate +','+item.appnum +','
               +item.wechatnum +','+item.appcount +','+item.wechatcount +','+
               item.totalnum +','+ item.totalcount +'\n';
            }
            data = title + data;
            var filename = '学习吧统计' +'('+_that.condition.begintime+'~'+_that.condition.endtime+')' +'.csv';
            if (_that.condition.begintime == "") {
                filename = '学习吧统计.csv' 
            }
            
            this.downloadData("#downloadCsv",data,filename);
        },
        resetSearchData() {
            this.condition.begintime = ''
            this.condition.endtime = ''
        },
        goback() {
            this.$router.go(-1)
        },
        getAllData(){
            var _that = this
            var url = '/butlerp/business/statmain';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {
                    'begintime': _that.condition.begintime,
                    'endtime': _that.condition.endtime,
                    searchall:"1"
                },
                success: function (json) {
                    var list = json.list;
                    if (list instanceof Array) {
                        _that.download_data_list = list;
                    
                        var totalObject = { 'visitdate': '页汇总',appnum:0,wechatnum:0,appcount:0,wechatcount:0,totalnum:0,totalcount:0 }
                        for (let i = 0; i < _that.download_data_list.length; i++) {
                            var item = _that.download_data_list[i]
                            totalObject.appnum += parseInt(item.appnum);
                            totalObject.wechatnum += parseInt(item.wechatnum);
                            totalObject.appcount += parseInt(item.appcount);
                            totalObject.wechatcount += parseInt(item.wechatcount);
                            totalObject.totalnum += parseInt(item.totalnum);
                            totalObject.totalcount += parseInt(item.totalcount);
                        }
                        _that.download_data_list.push(totalObject)
                        _that.refreshDownloadData()
                    } else {
                        _that.download_data_list = [];
                    }
                }
            });

        },
        searchAction(){
            this.refrehHomeList()
            this.getAllData()
        },
        refrehHomeList() {
            var _that = this
            var page = this.homeparam.page;
            var per_page = this.homeparam.pagesize;
            var url = '/butlerp/business/statmain';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {
                    'begintime': _that.condition.begintime,
                    'endtime': _that.condition.endtime,
                    "page": page,
                    "per_page": per_page,
                },
                success: function (json) {
                    var list = json.list;
                    var total = json.totalcount;
                    if (list instanceof Array) {
                        _that.data_list = list;
                        // if (_that.data_list.indexOf(_that.lastitem) == -1) {
                        //     _that.data_list.push(_that.lastitem)
                        // }
                        var totalObject = { 'visitdate': '页汇总',appnum:0,wechatnum:0,appcount:0,wechatcount:0,totalnum:0,totalcount:0 }
                        for (let i = 0; i < _that.data_list.length; i++) {
                            var item = _that.data_list[i]
                            totalObject.appnum += parseInt(item.appnum);
                            totalObject.wechatnum += parseInt(item.wechatnum);
                            totalObject.appcount += parseInt(item.appcount);
                            totalObject.wechatcount += parseInt(item.wechatcount);
                            totalObject.totalnum += parseInt(item.totalnum);
                            totalObject.totalcount += parseInt(item.totalcount);
                        }
                        _that.data_list.push(totalObject)
                        _that.refreshDownloadData()
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
        }
    },
    mounted() {
        this.refrehHomeList()
        this.getAllData()
    }
};