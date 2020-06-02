var courselist_pcom = {
    delimiters: ['<{', '}>'],
    template: "#courselist_id",
    data: function () {
        var _that = this;
        return {
            anchorcondition: "",
            data_list: {},
            curIndex: 0, //0 单课 1 系列课
            condition: {
                startDate: '',
                endDate: '',
                status: '',
                searchkey: ''
            },
            stateList: [
                { 'key': '全部', 'val': '-1' },
                { 'key': '已删除', 'val': '0' },
                { 'key': '已上架', 'val': '1' },
                { 'key': '已下架', 'val': '2' },
            ],
            sizepageparam1: {
                width: '75px',
                height: '30px',
                lineheight: '30px',
                voffset: '0px',
                isReadOnly: true
            },
            pageValueList:
                [{ 'key': '10', 'val': '1' },
                { 'key': '20', 'val': '2' },
                { 'key': '30', 'val': '5' },
                { 'key': '50', 'val': '10' }],
            sizepageparam: {
                width: '55px',
                height: '37px',
                lineheight: '35px',
                voffset: '0px',
                isReadOnly: true
            },
            sizeparam: {
                width: '180px',
                height: '25px',
                lineheight: '25px',
                voffset: '0px',
                isReadOnly: true
            },
            //翻页参数(单课程)
            details: {
                totalPage: 10,  //总页数
                curPage: 1,     //当前页
                maxPageNum: 10, //每页最大值
            },
            //翻页参数(系列课)
            details2: {
                totalPage: 10,  //总页数
                curPage: 1,     //当前页
                maxPageNum: 10, //每页最大值
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
    watch: {
        curIndex(newValue) {
            this.refreshList()
        },
    },
    methods: {
        //所有主播， 修改按钮
        seeallanchorstollege: function (index) {
            var _that = this
            _that.anchorinfo = {};
            _that.tabclasstype('allanchorstollege', index);
            var url = '/butlerp/business/anchorinfo';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {
                    anchorid: _that.data_list[index].anchorid
                },
                beforeSend: function () {
                    jQuery.loading();
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.anchorinfo = json.list.info[0];   //主播基本信息
                        _that.getid('modificationratio').style.display = 'inline-block';
                    }
                },
                complete: function (json) {
                    jQuery.loading_close();
                }
            });
        },
        //查询主播列表
        getallanchors: function () {
            var _that = this;
            var url = '/butlerp/business/anchorlist';
            $.ajax({
                type: 'post',
                url: url,
                data: {
                    condition: _that.anchorcondition,
                    page: _that.details.cur,
                    per_page: _that.details.anchorspage,
                    totalcount: _that.details.totalcount
                },
                dataType: "json",
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];
                        _that.data_list = tmp;

                        if (json.totalcount % _that.details.anchorspage == 0) {
                            _that.details.all = json.totalcount / _that.details.anchorspage;
                        } else {
                            _that.details.all = parseInt(json.totalcount / _that.details.anchorspage) + 1;
                        }
                        _that.details.totalcount = json.totalcount;
                    } else {
                        jQuery.postFail("fadeInup", json.info);
                    }
                }
            });
        }
        ,
        clickStatus() {

        },
        searchData() {

        },
        //点击页数
        listenpage(index) {
            var _that = this;
            if (_that.curIndex == 1) {
                _that.details2.curPage = index;
            }else{
                _that.details.curPage = index;
            }
            _that.refreshList()
        },
        //刷新当前页
        refreshList(selPage) {
            var _that = this;
            if (selPage > 0) {
                _that.details.curPage = selPage
            }
            var page = _that.details.curPage;
            var per_page = _that.details.maxPageNum;
            var url = '/butlerp/business/allsignlelist'
            if (_that.curIndex == 1) {
                if (selPage > 0) {
                    _that.details2.curPage = selPage
                }
                page = _that.details2.curPage;
                per_page = _that.details2.maxPageNum;
                url = '/butlerp/business/allserieslist'
            }
            $.ajax({
                data: {
                    page: page,
                    per_page: per_page,
                    role: -1
                },
                dataType: 'json',
                type: 'post',
                url: url,
                success: function (json) {
                    if (json.code == 1) {
                        _that.refreshData(json);
                    }
                }
            });
        },
        //处理网络数据
        refreshData(json) {
            var list = json.list;
            var total = json.totalcount;
            var _that = this;

            if (list instanceof Array) {
                _that.data_list = list;
                var totalPage = Math.ceil(total / _that.details.maxPageNum)
                //总页数
                if (_that.curIndex == 1) {
                    totalPage = Math.ceil(total / _that.details2.maxPageNum)
                }
                _that.details.totalPage = totalPage;
                $('#allanchorstollegehomepage').css('display', 'flex');
            } else {
                _that.data_list = [];
                //总页数
                _that.details.totalPage = 0;
                $('#allanchorstollegehomepage').css('display', 'none');
            }
        },
    },
    mounted() {
        var _that = this
        _that.refreshList()
    }
};