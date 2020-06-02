var courselist_pcom = {
    delimiters: ['<{', '}>'],
    template: "#courselist_id",
    data: function () {
        var _that = this;
        return {
            anchorcondition: "",
            data_list: {},
            curIndex: 0, //0 单课 1 系列课 2.线下课程
            condition: {
                startDate: '',
                endDate: '',
                status: { 'key': '全部', 'val': '-2' },
                auditStatus: { 'key': '全部', 'val': '-2' },
                type: { 'key': '全部', 'val': '' },
                searchkey: ''
            },
            typeList: [],
            auditeStateList: [
                { 'key': '全部', 'val': '-2' },
                { 'key': '待审核', 'val': '1' },
                { 'key': '审核通过', 'val': '2' },
                { 'key': '审核失败', 'val': '3' },
            ],
            stateList: [
                { 'key': '全部', 'val': '-2' },
                { 'key': '已隐藏', 'val': '-1' },
                { 'key': '已上架', 'val': '1' },
                { 'key': '未上架', 'val': '2' },
                { 'key': '已锁定', 'val': '-4' },
            ],
            sizepageparam1: {
                width: '95px',
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
            },
             //翻页参数(线下课程)
             details3: {
                totalPage: 10,  //总页数
                curPage: 1,     //当前页
                maxPageNum: 10, //每页最大值
            },
            // 推流页面
            pushurl_modal: {
                isShow: true,
                isActive: false,   //弹窗显示
                showHeader: true,   //标题显示
                showFooter: false,   //底部显示
                showCancel: false,   //取消显示
                showOk: false,     //确定显示
                transition: 'fade',
                backdrop: false,
                title: '推流地址',
                okText: '确定',
                cancelText: '取消',
                width: 500,
                height: 230,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                okLoading: false,
                onOk: function (param) {
                    console.log('param= OkBtn', param)
                },
                onCancel: function (param) {
                    console.log('param canBtn=', param)
                }
            }
            ,
            pushurl: ''
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
            var index = newValue
            // if (index == 0) {
            //     $('#single_btn').addClass('switch_btn_sel')
            //     $('#series_btn').removeClass('switch_btn_sel')
            // } else {
            //     $('#series_btn').addClass('switch_btn_sel')
            //     $('#single_btn').removeClass('switch_btn_sel')
            // }else {
            //     offlineCourse_btn
            // }
            this.refreshList()
        }
    },
    methods: {
        copyPushurl() {
            copyText($('#push_url'))
        },
        pushToStatMain(index){
            var item =  this.data_list[index]
            this.$router.push({
                path: '/onlineroomstatistic',
                query: {
                    signleid: item.signleid
                }
            });
        },
        showPushAlert(index) {
            var _that = this
            var course = _that.data_list[index]
            //  
            $.ajax({
                url: '/butlerp/business/getpushurl',
                dataType: 'json',
                type: 'post',
                data: {
                    signleid: course.signleid,
                    istovod:course.istovod
                },
                success: function (json) {
                    if (json.code == 1) {
                        var url = json.list.url
                        _that.pushurl = url
                        _that.pushurl_modal.isActive = true
                    }
                }
            });
        },
        switchCourseType(index) {
            this.curIndex = index
            localStorage.setItem('courseActiveIndex', index)
        },
        selectstatus(item) {
            this.condition.status = item
        },
        selectAuditstatus(item) {
            this.condition.auditStatus = item
        },
        selectCoursetype(item) {
            this.condition.type = item
        },
        changeCourseStatus(status, index,auditstatues) {
            this.changeSaleState(index, status,auditstatues)
        },
        changeCourseAuditStatus(auditstatues, index,status,alterdata) {
            this.changeSaleState(index, status,auditstatues,alterdata)
        },
        //获取课程分类
        requestCurseType() {
            var _that = this;
            $.ajax({
                data: {

                },
                dataType: 'json',
                type: 'post',
                url: "/butlerp/business/taglist",
                success: function (json) {
                    if (json.code == 1) {
                        _that.typeList = []
                        if (json.list instanceof Array) {
                            for (let i = 0; i < json.list.length; i++) {
                                var item = json.list[i]
                                _that.typeList.push({ key: item.tagname, val: item.tagid })
                            }
                            _that.typeList.unshift({key:'全部',val:''})
                        }

                    }
                }
            });
        },
        searchData() {
            var _that = this
            if (_that.curIndex == 1) {
                _that.details2.curPage = 1;
            } else if (_that.curIndex == 2){
                _that.details3.curPage = 1;
            }else {
                _that.details.curPage = 1;
            }
            _that.refreshList()
        },
        //点击页数
        listenpage(index) {
            var _that = this;
            if (_that.curIndex == 1) {
                _that.details2.curPage = index;
            } else if (_that.curIndex == 2){
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
            var startDate = _that.condition.startDate + ' 00:00:00'
            var endDate = _that.condition.endDate + ' 23:59:59'
            if (!_that.condition.startDate) {
                startDate = ''
            }
            if (!_that.condition.endDate) {
                endDate = ''
            }
            var condition = _that.condition.searchkey
            var status = _that.condition.status.val
            var applystatus=_that.condition.auditStatus.val
            var tag = _that.condition.type.val
            $.ajax({
                data: {
                    page: page,
                    per_page: per_page,
                    role: -1,
                    begintime: startDate,
                    endtime: endDate,
                    condition: condition,
                    datastatus: status,
                    applystatus:applystatus,
                    tag: tag,
                    lessontype:_that.curIndex == 2?"1":"0"
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
                for (var i = 0; i < list.length; i++) {
                    var item = list[i]
                    item.showstatusarr = [
                        { 'key': '已隐藏', 'val': '-1' },
                        { 'key': '已上架', 'val': '1' },
                        { 'key': '未上架', 'val': '2' },
                        { 'key': '已锁定', 'val': '-4' },
                    ]
                    item.showAuditstatusarr = [
                        { 'key': '审核通过', 'val': '2' },
                        { 'key': '审核失败', 'val': '3' },
                    ]
                    item.color = '#333333'
                    item.auditcolor = '#333333'
                    var status=parseInt(item.datastatus)
                    var auditstatus=parseInt(item.applystatus)
                    item.status=status
                    item.auditstatus=auditstatus
                    switch (status) {
                        case -1:
                            item.selectstatus = '已隐藏'
                            item.color = '#ff4949'
                            break;
                        case 0:
                            item.selectstatus = '已删除'
                            break;
                        case 1:
                            item.selectstatus = '已上架'
                            break;
                        case 2:
                            item.color = '#ff4949'
                            item.selectstatus = '未上架'
                            break;
                        case -4:
                            item.color = '#ff4949'
                            item.selectstatus = '已锁定'
                            break;
                    }
                    switch (auditstatus) {
                        case 1:
                              item.auditcolor = '#ff4949'
                              item.selectAuditstatus = '待审核'
                              break
                        case 2:
                            item.selectAuditstatus = '审核通过'
                            break;
                        case 3:
                                item.auditcolor = '#ff4949'
                                item.selectAuditstatus = '审核失败'
                            break;
                    }
                }
                _that.data_list = list;
                var totalPage = Math.ceil(total / _that.details.maxPageNum)
                _that.details.totalPage = totalPage;
                //总页数
                if (_that.curIndex == 1) {
                    totalPage = Math.ceil(total / _that.details2.maxPageNum)
                    _that.details2.totalPage = totalPage;
                }else if (_that.curIndex == 2){
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
        changeSaleState(index, status,auditStatus,alterdata) {
            var _that = this
            var courseid = _that.data_list[index].seriesid ? _that.data_list[index].seriesid : _that.data_list[index].signleid
            if (status == 0) {
                _that.showAlert("确认删除该课程吗?", () => {
                    _that.requestEdtInfo(courseid, status,auditStatus,_that.data_list[index],alterdata)
                })
            } else {
                _that.requestEdtInfo(courseid, status,auditStatus,_that.data_list[index],alterdata)
            }
        },
        isEmpty(obj){
            if(typeof obj == "undefined" || obj == null || obj == ""){
                return true;
            }else{
                return false;
            }
        },
        requestEdtInfo(courseid, status,applystatus,row,alterdata) {
            var _that = this;
            var param = { 'signleid': courseid, 'datastatus': status,'applystatus':applystatus,'alterdata':alterdata}
            var url = '/butlerp/business/signlesetting'
            if (_that.curIndex == 1) {
                param = { 'seriesid': courseid, 'datastatus': status,'applystatus':applystatus,'alterdata':alterdata}
                url = '/butlerp/business/seriessetting'
            }
              
            if(applystatus==2&&!_that.isEmpty(alterdata)){//审批主播后台的修改信息
                var alterobject = JSON.parse(alterdata)
                var param = Object.assign(row,alterobject)
                param.tagid=param.tag
                param.ismanageredite=0
                param.applystatus=2;
                param.alterdata=""
                if (alterobject.detail&&alterobject.detail.length == 0){
                    param.detail=""
                }
                if (_that.curIndex == 1) {
                    url='/butlerp/business/modseries'
                }else{
                    url='/butlerp/business/addormodsignle'
                }
                $.ajax({
                    data: param,
                    url: url,
                    dataType: 'json',
                    type: 'post',
                    success: function (json) {
                        if (json.code == 1) {
                            jQuery.postOk("", "保存成功");
                            _that.refreshList()
                        } else {
                            jQuery.postFail("", json.info);
                        }
                    }
                });
            }else{           
                $.ajax({
                    url: url,
                    dataType: 'json',
                    type: 'post',
                    data: param,
                    complete: function(json){jQuery.loading_close(-1);},
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
        }
        },
        edtCourse(index) {
            var _that = this
            var course = _that.data_list[index]
            if (_that.curIndex == 0) {
                _that.$router.push({
                    path: '/edtsignlecourse',
                    query: {
                        signleid: course.signleid,
                        type: course.type
                    }
                });
            } else if(_that.curIndex == 1){
                _that.$router.push({
                    path: '/edtseriescourse',
                    query: {
                        seriesid: course.seriesid
                    }
                });
            }else{
                this.$router.push({
                    path: '/offlinedetail',
                    query: {
                        signleid: course.signleid
                    }
                });

            }

        }
    },
    activated(){
        var _that = this
        var curIndex = localStorage.getItem('courseActiveIndex')
        if (curIndex && curIndex != undefined && curIndex != null) {
            _that.curIndex = parseInt(curIndex)
        }
        _that.requestCurseType()
        _that.refreshList()
    },
    mounted() {
        var _that = this
        var curIndex = localStorage.getItem('courseActiveIndex')
        if (curIndex && curIndex != undefined && curIndex != null) {
            _that.curIndex = parseInt(curIndex)
        }
        _that.requestCurseType()
        _that.refreshList()
    }
};