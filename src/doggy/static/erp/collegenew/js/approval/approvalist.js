var approvalist_pcom = {
    delimiters: ['<{', '}>'],
    template: "#approvalist_id",
    data: function () {
        var _that = this;
        return {
            activeItem: '',
            condition: '',
            refuse: '',  // 拒绝原因
            data_list: {},
            curIndex: 0, //0 单课 1 系列课
            auditStatus: { 'key': '待审核', 'val': '1' },
            typeList: [],
            auditeStateList: [
                { 'key': '待审核', 'val': '1' },
                { 'key': '审核失败', 'val': '3' }
            ],
            sizepageparam1: {
                width: '90px',
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
            //翻页参数(单课)
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
            },
           //翻页参数(线下课)
            details3: {
                totalPage: 10,  //总页数
                curPage: 1,     //当前页
                maxPageNum: 10, //每页最大值
            },
            askrefuse_modal: {
                isShow: true,
                isActive: false,   //弹窗显示
                showHeader: true,   //标题显示
                showFooter: true,   //底部显示
                showCancel: true,   //取消显示
                showOk: true,     //确定显示
                transition: 'fade',
                backdrop: false,
                title: '拒绝',
                okText: '确定',
                cancelText: '取消',
                width: 500,
                height: 230,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                okLoading: false,
                onOk: function (param) {
                    $.ajax({
                        url: '/butlerp/business/modapply',
                        dataType: 'json',
                        type: 'post',
                        data: {
                            applyid: _that.activeItem.applyid,
                            status: '2',
                            remark: _that.refuse
                        },
                        success: function (json) {
                            if (json.code == 1) {
                                _that.refreshList()
                                _that.activeItem = ''
                            }
                        }
                    });

                },
                onCancel: function (param) {
                    _that.activeItem = ''
                }
            },
            refuse_modal: {
                title: '拒绝原因',
                isShow: true,
                isActive: false,   //弹窗显示
                showHeader: true,   //标题显示
                showFooter: false,   //底部显示
                showCancel: false,   //取消显示
                showOk: false,     //确定显示
                width: 500,
                height: 230,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                onOk: function (param) {
                    _that.activeItem = ''
                },
                onCancel: function (param) {
                    _that.activeItem = ''
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
        curIndex(newValue) {
            // var index = newValue
            // if (index == 0) {
            //     $('#single_btn').addClass('switch_btn_sel')
            //     $('#series_btn').removeClass('switch_btn_sel')
            // } else {
            //     $('#series_btn').addClass('switch_btn_sel')
            //     $('#single_btn').removeClass('switch_btn_sel')
            // }
            this.refreshList()
        }
    },
    methods: {
        selectAuditstatus(item) {
            this.auditStatus = item
            this.refreshList(1)
        },
        copyPushurl() {
            copyText($('#push_url'))
        },
        showPushAlert(index) {
            var _that = this
            var item = _that.data_list[index]

            _that.showAlert("确认同意该审批吗?", () => {
                var  param = item
                var alterobject = {}
                if (item.alterdata&&item.alterdata.length > 0){
                    alterobject = JSON.parse(item.alterdata)
                    param = Object.assign(item,alterobject)
                }
                if (param.tag&&param.tag.length > 0){
                    param.tagid=param.tag
                }
                param.ismanageredite=0
                param.applystatus=2;
                param.alterdata=""
                if (alterobject.detail&&alterobject.detail.length == 0){
                    param.detail=""
                }
                if (item.seriesid&&item.seriesid.length > 0) {
                    url='/butlerp/business/modseries'
                }else{
                    url='/butlerp/business/addormodsignle'
                }
                $.ajax({
                    data: param,
                    url: url,
                    dataType: 'json',
                    type: 'post',
                    complete: function(json){jQuery.loading_close(-1);},
                    success: function (json) {
                        if (json.code == 1) {
                            jQuery.postOk("", "保存成功");
                            _that.refreshList()
                        } else {
                            jQuery.postFail("", json.info);
                        }
                    }
                });
            })
        },
        switchCourseType(index) {
            this.curIndex = index
            localStorage.setItem('approvalActiveIndex', index)
            // this.refreshList()
        },

        searchData() {
            var _that = this
            if (_that.curIndex == 1) {
                _that.details2.curPage = 1;
            }else if(_that.curIndex == 2){
                _that.details3.curPage = 1;
            } else {
                _that.details.curPage = 1;
            }
            _that.refreshList()
        },
        //点击页数
        listenpage(index) {
            var _that = this;
            if (_that.curIndex == 1) {
                _that.details2.curPage = index;
            }else if(_that.curIndex == 2){
                _that.details3.curPage = index;
            }else {
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
            }else if (_that.curIndex == 2){
                if (selPage > 0) {
                    _that.details3.curPage = selPage
                }
                page = _that.details3.curPage;
                per_page = _that.details3.maxPageNum;
                url = '/butlerp/business/allsignlelist'
            }

            var applystatus = _that.auditStatus.val
            $.ajax({
                data: {
                    page: page,
                    per_page: per_page,
                    condition: _that.condition,
                    applystatus: applystatus,
                    datastatus: -2,
                    lessontype:_that.curIndex == 2?"1":""
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
                _that.details.totalPage = totalPage;
                //总页数
                if (_that.curIndex == 1) {
                    totalPage = Math.ceil(total / _that.details2.maxPageNum)
                    _that.details2.totalPage = totalPage;
                }else if(_that.curIndex == 2){
                    totalPage = Math.ceil(total / _that.details3.maxPageNum)
                    _that.details3.totalPage = totalPage;
                }

                $('#allanchorstollegehomepage').css('display', 'flex');
            } else {
                _that.data_list = [];
                //总页数
                _that.details.totalPage = 0;
                $('#allanchorstollegehomepage').css('display', 'none');
            }
        },
        refuseAction(index) {
            var item = this.data_list[index]
            // this.activeItem = this.data_list[index]
            // this.askrefuse_modal.isActive = true
            var _that = this;
            var param = item;
            param.applystatus = 3;
            var url = '/butlerp/business/signlesetting'
            if (item.seriesid&&item.seriesid.length > 0) {
                url = '/butlerp/business/seriessetting'
            }

            $.ajax({
                url: url,
                dataType: 'json',
                type: 'post',
                data: param,
                complete: function(){jQuery.loading_close(-1);},
                success: function (json) {
                    if (json.code == 1) {
                        _that.refreshList()
                    }else{
                        setTimeout(() => {
                            _that.showError('提示',json.info)
                        }, 200); 
                    }
                }
            });
        }, pushtoDetail(index) {
            var _that = this
            var course = _that.data_list[index]
            if (course.signleid&&course.signleid.length>0) {
                _that.$router.push({
                    path: '/approvaldetail',
                    query: {
                        signleid: course.signleid,
                        type: course.type
                    }
                });
            } else {
                _that.$router.push({
                    path: '/approvaldetail',
                    query: {
                        seriesid: course.seriesid
                    }
                });
            }
        }


    },
    activated(){
        var _that = this
        var curIndex = localStorage.getItem('approvalActiveIndex')
        if (curIndex && curIndex != undefined && curIndex != null) {
            _that.curIndex = parseInt(curIndex)
        }
        _that.refreshList()
    },
    mounted() {
        var _that = this
        var curIndex = localStorage.getItem('approvalActiveIndex')
        if (curIndex && curIndex != undefined && curIndex != null) {
            _that.curIndex = parseInt(curIndex)
        }
        _that.refreshList()
    }
};