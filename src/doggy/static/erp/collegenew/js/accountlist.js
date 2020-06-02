var accountlist_pcom = {
    delimiters: ['<{', '}>'],
    template: "#accountlist_id",
    data: function () {
        var _that = this;
        return {
            condition: "",
            data_list: {},
            //所有banner 翻页
            details: {
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
            //添加主播弹框
            addManagers: {
                isShow: true,
                isActive: false,   //弹窗显示
                showHeader: true,   //标题显示
                showFooter: true,   //底部显示
                showCancel: false,   //取消显示
                showOk: false,     //确定显示
                transition: 'fade',
                backdrop: false,
                title: '添加管理员',
                okText: '确定',
                cancelText: '取消',
                width: 520,
                height: 250,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                okLoading: false,
                onOk: function (param) {
                    $.ajax({
                        url: '/butlerp/business/checkmember',
                        data: {
                            mobile: _that.addManagerInfo.mobile                        },
                        dataType: 'json',
                        type: 'post',
                        beforeSend: function () {
                            jQuery.loading();
                        },
                        complete: function (data) {
                            jQuery.loading_close();
                        },
                        success: function (json) {
                            if (json.code == 1) {
                               _that.addManagerRequest()
                            }else{
                                _that.resetAddAccountData();
                                jQuery.showError(json.info,'提示');
                            }
                        },
                        error: function (json) {
                            jQuery.showError(json.info,'提示');
                            _that.resetAddAccountData();
      
                        }
                    });
                  
                },
                onCancel: function (param) {
                   _that.resetAddAccountData()
                    console.log('param canBtn=', param)
                }
            },
            addManagerInfo: {
                mobile: '',
                picture: '',
                name: '',
                userid: '',
                isanchor: 0
            }
        }
    },
    components: {
        'addedtModal': vueModal_com,
        'yayigjDownlist': yayigjDownListCom,
        'yayigjDatesel': vyayigjDateSelcom,
    },
    computed:{
      userData(){
        return getUserData()
      }  
    },
    filters: {

    },
    methods: {
        //点击页数
        listenpage(index) {
            var _that = this;
            _that.details.curPage = index;
            _that.refreshList()
        },
        //刷新当前页
        refreshList(selPage) {
            var _that = this;
            if(selPage > 0 ){
                _that.details.curPage = selPage
            }
            var page = _that.details.curPage;
            var per_page = _that.details.maxPageNum;
            $.ajax({
                data: {
                    page: page,
                    per_page: per_page,
                    role: -1
                },
                dataType: 'json',
                type: 'post',
                url: '/butlerp/business/getmemberlist',
                success: function (json) {
                    if (json.code == 1) {
                        _that.refreshData(json);
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
        //刷新当前页数据
        refreshData(json) {
            var list = json.list;
            var total = json.totalcount;
            var _that = this;

            if (list instanceof Array) {
                _that.data_list = list;
                //总页数
                _that.details.totalPage = Math.ceil(total / _that.details.maxPageNum);
                $('#allanchorstollegehomepage').css('display', 'flex');
            } else {
                _that.data_list = [];
                //总页数
                _that.details.totalPage = 0;
                $('#allanchorstollegehomepage').css('display', 'none');
            }
        },
        addManager() {
            var _that = this;
            _that.addManagers.isActive = true;
        }
        ,
        //编辑管理员状态
        edtAccount(index, state) {
            var _that = this
            var item = _that.data_list[index]
            if (state == 2) {
                _that.showAlert("确认删除该管理员吗?", () => {
                    _that.requestEdtInfo(item.userid, state);
                })
            } else {
                _that.requestEdtInfo(item.userid, state);
            }
        },
        requestEdtInfo(userid, state) {
            var _that = this;
            $.ajax({
                data: {
                    userid: userid,
                    datastatus: state
                },
                dataType: 'json',
                type: 'post',
                url: '/butlerp/business/settingsmember',
                success: function (json) {
                    if (json.code != 1) {
                        alert(json.info);
                    }
                    _that.refreshList();
                },
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (json) {
                    jQuery.loading_close();
                }
            });
        },
        //弹窗
        showAlert(title, callback) {
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
        },
        //添加主播弹框
        showAddManager: function () {
            var _that = this
            _that.addManagerInfo = { mobile: '', name: '', userid: '', isanchor: 0 }
            _that.addManagers.showOk = false
            _that.addManagers.showCancel = false
            $('.resurtsearch').css('display', 'none');
            $('.popanchors_search').css('display', 'block');
        },
        //添加主播弹框查询
        searUserPhone: function () {
            var _that = this
            if (_that.addManagerInfo.mobile == "") {
                jQuery.postFail("", '手机号不能为空');
            } else {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/butlerp/business/searchuser',
                    data: {
                        mobile: _that.addManagerInfo.mobile
                    },
                    beforeSend: function () {
                        jQuery.loading();
                    },
                    complete: function (data) {
                        jQuery.loading_close();
                    },
                    success: function (json) {
                        if (json.code == 1) {
                            var data = json.list;
                            if (data) {
                                _that.addManagerInfo = data[0]
                                _that.addManagers.showOk = true
                                _that.addManagers.showCancel = true
                                $('#popanchors_search').css('display', 'none')
                                $('#resurtsearch').css('display', 'block')
                            } else {
                                jQuery.postFail("", '手机号不存在');
                            }
                        } 
                    }
                });
            }
        },
        resetAddAccountData(){
            var _that = this
            _that.addManagerInfo = { mobile: '', name: '', userid: '', isanchor: 0 }
            _that.addManagers.showOk = false
            _that.addManagers.showCancel = false
            $('#popanchors_search').css('display', 'block')
            $('#popcancel').css('display', 'none')
            $('#resurtsearch').css('display', 'none')
        },
        addManagerRequest(){
            var _that = this
            $.ajax({
                url: '/butlerp/business/addmember',
                data: {
                    userid: _that.addManagerInfo.userid,
                    role:'2'
                },
                dataType: 'json',
                type: 'post',
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.refreshList()
                    }else{
                        jQuery.showError(json.info,'提示');
                    }
                    _that.resetAddAccountData()
                },
                error: function (json) {
                    jQuery.showError(json.info,'提示');
                    _that.resetAddAccountData()
                }
            });
        }
    },
    mounted() {
        var _this = this;
        _this.refreshList();
    }
};