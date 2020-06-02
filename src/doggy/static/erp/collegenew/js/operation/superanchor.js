var superanchor_pcom = {
    delimiters: ['<{', '}>'],
    template: "#superanchor_id",
    data: function () {
        var _that = this;
        return {
            cancommit: false,
            condition: '',
            isallselected: false,
            searchcondition: '',  //新增的主播列表搜索条件
            data_list: [], //明星主播
            search_list: [],//待选主播列表
            choose_list: [], //勾选的主播
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
                    [{ 'key': '10', 'val': '1' },
                    { 'key': '20', 'val': '2' },
                    { 'key': '30', 'val': '5' },
                    { 'key': '50', 'val': '10' }]
            },
            //选择主播分页参数
            searchPageParam: {
                page: 1,
                pagesize: 10,
                total: 0,
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
            },
            anchorDialogParam: {
                isShow: true,
                isActive: false,
                showHeader: true,
                showFooter: true,
                showCancel: true,
                showOk: true,
                transition: 'fade',
                backdrop: false,
                title: '选择直播间',
                okText: '确定',
                cancelText: '取消',
                width: 980,
                height: 540,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                okLoading: false,
                onOk: function () {
                    var selArr = [];
                    for (let i = 0; i < _that.search_list.length; i++) {
                        var item = _that.search_list[i];
                        if (item.selected) {
                            selArr.push(item);
                        }
                    }
                    console.log(selArr)
                    var url = '/butlerp/business/addstar';
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: url,
                        data: {
                            list: selArr
                        },
                        success: function (json) {
                            if (json.code == 1) {
                                _that.refrehHomeList();
                            }
                            _that.resetSelData();
                        }
                    });

                },
                onCancel: function () {
                    _that.resetSelData();
                }
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

    },
    methods: {
        goback() {
            this.$router.go(-1)
        },
        chooseall() {
            for (let i = 0; i < this.search_list.length; i++) {
                var item = this.search_list[i];
                item.selected = this.isallselected;
                Vue.set(this.search_list, i, item);
            }
        },
        alocked(index) {
            var item = this.search_list[index];
            // item.selected = !item.selected;
            Vue.set(this.search_list, index, item);
            for (let i = 0; i < this.search_list.length; i++) {
                var item = this.search_list[i];
                if (!item.selected) {
                    this.isallselected = false;
                    break;
                }
            }
        },
        submitData() {
            alert('submit')
        },
        showCourseDialog() {
            this.anchorDialogParam.isActive = true;
            this.refreshSearchList();
        },
        refrehHomeList() {
            var _that = this
            var page = this.homeparam.page;
            var per_page = this.homeparam.pagesize;
            var url = '/butlerp/business/starlist';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {
                    condition: _that.condition,
                    "page": page,
                    "per_page": per_page,
                },
                success: function (json) {

                    var list = json.list;
                    var total = json.totalcount;


                    if (list instanceof Array) {
                        _that.data_list = list;
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
        refreshSearchList() {
            var _that = this
            var pageparam = _that.searchPageParam
            var url = '/butlerp/business/anchorlist';
            //  issuper: 0, 
            var param = { page: pageparam.page, per_page: pageparam.pagesize,isanchor:1 }
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: param,
                success: function (json) {
                    var list = json.list;
                    var total = json.totalcount;
                    if (list instanceof Array && list.length > 0) {
                        _that.search_list = list;
                        _that.searchPageParam.total = total;
                    } else {
                        _that.search_list = [];
                        _that.searchPageParam.total = 0;
                    }
                }
            });

        },
        pagechange1(page) {
            this.homeparam.page = page;
            this.refrehHomeList();
        },
        pagesizechange1(pagesize) {
            clearInterval
            this.homeparam.page = 1;
            this.homeparam.pagesize = pagesize;
            this.refrehHomeList();
        },
        pagechange2(page) {
            this.searchPageParam.page = page;
            this.refreshSearchList();
        },
        pagesizechange2(pagesize) {
            this.searchPageParam.page = 1;
            this.searchPageParam.pagesize = pagesize;
            this.refreshSearchList();
        },
        operateCourse(index, type, status) {
            var _that = this;
            if (type == 0) {
                this.sortItem(index, status);
            } else if (type == 1) {
                this.sortItem(index, status);
            } else if (type == 2) {
                this.edtItem(index, status);
            } else if (type == 3) {
                this.showAlert('是否移除该明星主播？', () => {
                    _that.edtItem(index, status);
                })

            }
        },
        //移动
        sortItem(index, status) {
            var _that = this
            var item = _that.data_list[index]
            var url = '/butlerp/business/starmove';
            //  issuper: 0, 
            var param = { state: status, starid: item.starid }
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: param,
                success: function (json) {
                    if (json.code == 1) {
                        _that.refrehHomeList();
                    }
                }
            });
        },
        edtItem(index, status) {
            var _that = this
            var item = _that.data_list[index]
            var url = '/butlerp/business/starhandle';
            //  issuper: 0, 
            var param = { state: status, starid: item.starid }
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: param,
                success: function (json) {
                    if (json.code == 1) {
                        _that.refrehHomeList();
                    }
                }
            });
        },
        resetSelData() {
            for (let i = 0; i < this.search_list.length; i++) {
                var item = this.search_list[i];
                item.selected = false;
                Vue.set(this.search_list, i, item);
            }
        }
    },
    mounted() {
        this.refrehHomeList()
    }
};