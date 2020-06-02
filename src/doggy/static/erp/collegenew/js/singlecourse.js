jQuery.createAniCss();
//------------------------
// 单次课组件
//------------------------
var singlecourse_pcom = {
    delimiters: ['<{', '}>'],
    template: "#singlecourse_id",
    data: function () {
        var _that = this;
        return {
            msg1: '分拥比例管理',
            test: 'this is test',
            isallselected: false,
            condition: "",//搜索条件
            //所有主播列表 翻页
            details: {
                totalPage: 10,  //总页数
                curPage: 1,     //当前页
                maxPageNum: 10, //每页最大值
            },
            //添加课程 page控件
            addcoursepageAttrs: {
                totalPage: 10,  //总页数
                curPage: 1,     //当前页
                maxPageNum: 10, //每页最大值
            },
            pageValueList:
                [{ 'key': '10', 'val': '1' },
                { 'key': '20', 'val': '2' },
                { 'key': '30', 'val': '5' },
                { 'key': '50', 'val': '10' }],
            sizepageparam: {
                width: '50px',
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
            allcourse_list: [],//所有课程
            currentCourse_list: [],//当前展示课程类列表
            addSingleCourse_list: [],//添加的单课程
            data_list: [],//home页显示列表
            //添加选择单课
            addsinglecourse: {
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
                onOk: function (param) {
                    _that.isallselected = false;
                    _that.addSingleCourse_list = [];
                    for (var i = 0; i < _that.allcourse_list.length; i++) {
                        var course = _that.allcourse_list[i];
                        if (course.isselected) {
                            _that.addSingleCourse_list.push(course);
                        }
                    }

                    var url = '/butlerp/business/signlehomeaddcourse';
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: url,
                        data: {
                            signlelist: _that.addSingleCourse_list,
                        },
                        success: function (json) {
                            console.log(json);
                            if (json.code == 1) {
                                _that.getpageinfo();
                            } else {
                                alert(json.info);
                            }

                        },
                        beforeSend: function () {
                            jQuery.loading();
                        },
                        complete: function (json) {
                            jQuery.loading_close();
                        }
                    });
                },
                onCancel: function (param) {

                }
            },
        }
    },
    components: {
        'addedtModal': vueModal_com,
        'yayigjDownlist': yayigjDownListCom
    },
    methods: {
        //所有课程
        getallcourse() {
            var _that = this;
            var url = '/butlerp/business/signlelist';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {
                    isall: "1",
                    condition: _that.condition
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        var list = json.list;
                        // _that.refreshData(json,false);
                        if (list instanceof Array) {
                            for (var i = 0; i < list.length; i++) {
                                var course = list[i];
                                course.isselected = false;
                            }
                            //.sort(_that.compare('displayorder'))
                            _that.allcourse_list = list;
                            //总页数
                            _that.addcoursepageAttrs.totalPage = Math.ceil(list.length / _that.addcoursepageAttrs.maxPageNum);
                            $('#addsinglecoursepage').css('display', 'block');
                        } else {
                            _that.allcourse_list = [];
                            //总页数
                            _that.addcoursepageAttrs.totalPage = 0;
                            $('#addsinglecoursepage').css('display', 'none');
                        }
                        _that.refreshAllcourse();
                    } else {
                        alert(json.info);
                    }

                },
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (json) {
                    jQuery.loading_close();
                }
            });

        },
        //单课列表
        getpageinfo(page) {
            var _that = this;
            if(page > 0){
                _that.details.curPage = page
            }
            var page = _that.details.curPage;
            var per_page = _that.details.maxPageNum;
            var url = '/butlerp/business/signlehomelist';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {
                    "page": page,
                    "per_page": per_page,
                },
                success: function (json) {
                    _that.refreshData(json);
                },
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (json) {
                    jQuery.loading_close();
                }
            });
        },

        //刷新当前页数据
        refreshData(json) {
            var list = json.list;
            var total = json.totalcount;
            var _that = this;

            if (list instanceof Array) {
                _that.data_list = list;
                //总页数
                _that.details.totalPage = Math.ceil(total / _that.details.maxPageNum);
                // $('#allanchorstollegehomepage').css('display', 'block');
            } else {
                _that.data_list = [];
                //总页数
                _that.details.totalPage = 0;
                // $('#allanchorstollegehomepage').css('display', 'none');
            }
        },
        //刷新所有课程列表
        refreshAllcourse() {
            var _that = this;
            var total = _that.allcourse_list.length;
            var page = _that.addcoursepageAttrs.curPage;
            var per_page = _that.addcoursepageAttrs.maxPageNum;
            var startIndex = (page - 1) * per_page;
            var endIndex = page * per_page;
            if (endIndex > total) {
                endIndex = total;
            }
            if (startIndex < 0) {
                _that.currentCourse_list = [];
            } else {
                _that.currentCourse_list = _that.allcourse_list.slice(startIndex, endIndex);
            }

        },
        //点击页数(home页)
        listenpage(index) {
            var _that = this;
            _that.details.curPage = index;
            _that.getpageinfo()
        },
        //点击页数(添加课程页)
        addcourselistenpage(index) {
            var _that = this;
            _that.addcoursepageAttrs.curPage = index;
            _that.refreshAllcourse();
        },
        //添加单课
        addsingle() {
            var _that = this;
            _that.condition = "";
            _that.addcoursepageAttrs.curPage = 1;
            _that.allcourse_list = [];
            _that.currentCourse_list = [];
            _that.isallselected = false;
            _that.addsinglecourse.isActive = true;
            _that.getallcourse();
        },

        //置顶
        movetoTop(index, istop) {
            var _that = this;
            if(istop === "1"){ //置顶
                $.ajax({
                    dataType: 'json',
                    type: 'post',
                    url: '/butlerp/business/signlehometop',
                    data: {
                        signlehomeid: _that.data_list[index].signlehomeid
                    },
                    success: function (json) {
                        if(json.code == 1){
                            _that.getpageinfo();
                        }else{
                            alert(json.info);
                        }
                    },
                    complete: function () {
                    }
                });
            }else{
                $.ajax({
                    dataType: 'json',
                    type: 'post',
                    url: '/butlerp/business/signlehomesetting',
                    data: {
                        signlehomeid: _that.data_list[index].signlehomeid,
                        istop:istop
                    },
                    success: function (json) {
                        if(json.code == 1){
                            _that.getpageinfo();
                        }else{
                            alert(json.info);
                        }
                    },
                    complete: function () {
                    }
                });
            }
        },

        //上移下移
        changeShowState(index, state) {
            var _that = this;
            var course = _that.data_list[index];
            $.ajax({
                dataType: 'json',
                type: 'post',
                url: '/butlerp/business/signlehomemove',
                data: {
                    do: state,
                    signlehomeid: course.signlehomeid,
                    displayorder: course.displayorder,
                    istop:course.istop
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.getpageinfo();
                    } else {
                        alert(json.info);
                    }
                    jQuery.loading_close();
                },

                complete: function (json) {
                    jQuery.loading_close();

                }
            });
        },
        //上架下架 (0删除,1 上架  2 下架)
        changeSaleState(index, state) {
            var _that = this;
            if (state == "0") {
                jQuery.showDel("确定删除该课程?", '提示',
                    function () {
                        jQuery.loading();
                        $.ajax({
                            dataType: 'json',
                            type: 'post',
                            url: '/butlerp/business/signlehomesetting',
                            data: {
                                signlehomeid: _that.data_list[index].signlehomeid,
                                datastatus: state,
                            },
                            success: function (json) {
                                jQuery.postOk("删除成功!");
                                if (json.code == 1){
                                    if(index == 0){
                                        _that.details.curPage --;
                                        if (_that.details.curPage < 1){
                                            _that.details.curPage = 1;
                                        }
                                    }
                                    _that.getpageinfo();    
                                }else{
                                    alert(json.info)
                                }
                            },
                            complete: function () {
                                jQuery.loading_close();
                            }
                        });
                        jQuery.pop_window_modal_dialog_close({ _closemothod: 'fadeOutUp' });
                    }, function () {
                        jQuery.pop_window_modal_dialog_close({ _closemothod: 'fadeOutUp' });
                    })
            } else {
                $.ajax({
                    dataType: 'json',
                    type: 'post',
                    url: '/butlerp/business/signlehomesetting',
                    data: {
                        signlehomeid: _that.data_list[index].signlehomeid,
                        datastatus: state,
                    },
                    success: function (json) {
                        _that.getpageinfo();
                    },
                    complete: function () {

                    }
                });

            }
        },
        //选中所有
        chooseall() {
            var _that = this;
            var state = $('#singlecourse_checkbox').is(':checked');
            for (var i in _that.allcourse_list) {
                var course = _that.allcourse_list[i];
                course.isselected = state;
            }
        },
        //checkbox单个选中
        alocked(index) {
            var _that = this;
            var course = _that.allcourse_list[index];
            var isAllSelected = true;
            for (var i = 0; i < _that.allcourse_list.length; i++) {
                var course = _that.allcourse_list[i];
                if (course.isselected == false) {
                    isAllSelected = false;
                    break;
                }
            }
            _that.isallselected = isAllSelected;
        },
        //查询
        searchlist() {
            var _that = this;
            _that.addcoursepageAttrs.curPage = 1;
            _that.allcourse_list = [];
            _that.currentCourse_list = [];
            _that.getallcourse();
        },
        //排序
        compare(property) {
            return function (a, b) {
                var value1 = parseInt(a[property]);
                var value2 = parseInt(b[property]);
                return value1 - value2;
            }
        }
    },
    created() {
        var _that = this
        _that.getpageinfo()
    }
};