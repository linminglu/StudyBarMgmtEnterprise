
var consultantsetting_pcom = {
    delimiters: ['<{', '}>'],
    template: "#consultantsetting_id",
    data: function () {
        var _that = this;
        return {
            data_list:[],
            userdata:{},  //查询的客服
            condition:"",  //搜索手机号
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
            //翻页参数(待审批)
            details: {
                totalPage: 10,  //总页数
                curPage: 1,     //当前页
                maxPageNum: 10, //每页最大值
            },
             //添加客服弹框
             addConsultant_pcom: {
                isShow: true,
                isActive: false,   //弹窗显示
                showHeader: true,   //标题显示
                showFooter: true,   //底部显示
                showCancel: false,   //取消显示
                showOk: false,     //确定显示
                transition: 'fade',
                backdrop: false,
                title: '添加客服',
                okText: '确定',
                cancelText: '取消',
                width: 520,
                height: 250,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                okLoading: false,
                onOk: function (param) {
                    console.log('param= OkBtn', param)
                    $.ajax({
                        url: '/butlerp/business/addOrDelConsultant',
                        data: {
                            optype:"0",
                            consultid: _that.userdata.userid,
                            username: _that.userdata.name,
                            picture: _that.userdata.picture,
                            mobile: _that.userdata.mobile
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
                                jQuery.postOk("", '添加成功');
                                _that.refreshList();
                            }
                        },
                        error: function (json) {
                            jQuery.postFail("", json.info);
                        }
                    });
                },
                onCancel: function (param) {

                    console.log('param canBtn=', param)
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
        //刷新当前页
        refreshList(selPage) {
            var _that = this;
            if (selPage > 0) {
                _that.details.curPage = selPage
            }
            var page = _that.details.curPage;
            var per_page = _that.details.maxPageNum;
            var url = '/butlerp/business/getConsultantList'
            $.ajax({
                data: {
                    page: page,
                    per_page: per_page,
                    condition: _that.condition
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
                }

                $('#allanchorstollegehomepage').css('display', 'flex');
            } else {
                _that.data_list = [];
                //总页数
                _that.details.totalPage = 0;
                $('#allanchorstollegehomepage').css('display', 'none');
            }
        },


        searchData() {
            var _that = this
            if (_that.curIndex == 1) {
                _that.details2.curPage = 1;
            } else {
                _that.details.curPage = 1;
            }
            _that.refreshList()
        },
        //点击页数
        listenpage(index) {
            this.details.curPage = index;
            this.refreshList()
        },

        searchMobile(){
            var _that = this

            if (_that.userdata.mobile == "") {
                jQuery.postFail("", '手机号不能为空');
            } else {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/butlerp/business/searchUsers',
                    data: {
                        mobile: _that.userdata.mobile
                    },
                    beforeSend: function () {
                        jQuery.loading();
                    },
                    complete: function (data) {
                        jQuery.loading_close();
                    },
                    success: function (json) {
                        if (json.code == 1) {
                            var tmp = json.list;
                            if (!tmp) jQuery.postFail("", '手机号不存在');
                            else {
                                console.log(json);
                                _that.userdata.mobile = json.list[0].mobile;
                                // _that.userdata.userid = json.list[0].userid;
                                _that.userdata.name = json.list[0].name;
                                _that.userdata.picture = json.list[0].picture;
                                _that.userdata.isanchor = json.list[0].isanchor;
                                Vue.set( _that.userdata, 'userid', json.list[0].userid)
                                _that.addConsultant_pcom.showOk = true
                                _that.addConsultant_pcom.showCancel = true
                            }

                        } else {
                            jQuery.postFail("", json.info);
                        }
                    }
                });
            }
        },
        addConsultant(){
            this.userdata = {}
            this.addConsultant_pcom.showOk = false
            this.addConsultant_pcom.showCancel = false
            this.addConsultant_pcom.isActive = true
        },
        seedetail(index){
            var _that = this
            var item = _that.data_list[index]
            _that.$router.push({
                path: '/consultcourselist',
                query: {
                    consultid: item.consultid
                }
            });
        },
        delAction(index){
            var _that = this
            var item = _that.data_list[index]
            _that.showAlert("是否删除该客服(其关联课程也将被删除)?", () => {
                var param = item
                var url='/butlerp/business/addOrDelConsultant'
                param.optype = "1"
               
                $.ajax({
                    data: param,
                    url: url,
                    dataType: 'json',
                    type: 'post',
                    complete: function(json){jQuery.loading_close(-1);},
                    success: function (json) {
                        if (json.code == 1) {
                            jQuery.postOk("", "删除成功");
                            _that.refreshList()
                        } else {
                            jQuery.postFail("", json.info);
                        }
                    }
                });
            })
        },
        goback() {
            this.$router.go(-1)
        }
    },
    activated(){

    },
    mounted() {
       this.refreshList()
    }
};