var boutiquecourse_pcom = {
    delimiters: ['<{', '}>'],
    template: "#boutiquecourse_id",
    data: function () {
        var _that = this;
        return {
            condition: {
                showstatus: '全部', //展示用
                state: '-1', //提交数据用
                content: '',
                attribute: {
                    width: '80px',
                    height: '30px',
                    lineheight: '30px',
                    voffset: '0px',
                    isReadOnly: true
                },
                valueList:
                    [{ 'key': '全部', 'val': '-1' },
                    { 'key': '未开始', 'val': '0' },
                    { 'key': '进行中', 'val': '1' },
                    { 'key': '已结束', 'val': '2' }]
            },
            moduleStatus: 0,  // 0 下架 1 上架
            searchcondition: '',
            curIndex: 0,
            cancommit: false,
            typeList: [],
            data_list: [],
            course_list: [],
            //课程列表分页参数
            pageparam: {
                single: {
                    page: 1,
                    pagesize: 10,
                    total: 0,
                },
                series: {
                    page: 1,
                    pagesize: 10,
                    total: 0,
                },
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
            selCourse: {},  //选择的课程
            opIndex: '',
            //选课弹窗
            courseDialogParam: {
                isShow: true,
                isActive: false,
                showHeader: true,
                showFooter: true,
                showCancel: true,
                showOk: true,
                transition: 'fade',
                backdrop: false,
                title: '选择课程',
                okText: '确定',
                cancelText: '取消',
                width: 980,
                height: 540,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                okLoading: false,
                onOk: function () {
                    var activeIndex = _that.opIndex;
                    var item = _that.data_list[activeIndex];
                    var selcourse = _that.selCourse;
                    var extra = { coursestatus: selcourse.datastatus }
                    if (selcourse.signleid) {
                        extra.courseid = selcourse.signleid;
                        extra.coursetype = 0;
                    } else {
                        extra.courseid = selcourse.seriesid;
                        extra.coursetype = 1;
                    }
                    var copycourse = Object.assign(extra, selcourse);
                    copycourse.roomname = copycourse.anchorname;
                    copycourse.coursestate = ''
                    item = Object.assign(item, copycourse);
                    Vue.set(_that.data_list, activeIndex, item);
                    _that.opIndex = ''
                    _that.selCourse = {}
                },
                onCancel: function () {
                    _that.searchcondition = ''
                    _that.opIndex = ''
                    _that.selCourse = {}
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
    computed: {
        uploadTitle() {
            return this.moduleStatus == 0 ? '上架' : '下架';
        }
    },
    watch: {
        curIndex(newValue) {
            var index = newValue
            if (index == 0) {
                $('#single_btn').addClass('switch_btn_sel')
                $('#series_btn').removeClass('switch_btn_sel')
            } else {
                $('#series_btn').addClass('switch_btn_sel')
                $('#single_btn').removeClass('switch_btn_sel')
            }
            this.searchlist()
        }
    },
    methods: {
        //验证信息是否完整
        validateUploadData(showAlert) {
            var cancommit = true;
            var msg = '';
            if (this.moduleStatus == 1) {
                return true;
            }
            for (let i = 0; i < this.data_list.length; i++) {
                var item = this.data_list[i];
                if (!item.courseid) {
                    cancommit = false
                    msg = '请将三个课程全部添加完毕后，上架该模块！'
                    break;
                } else {
                    if (!item.showbanner) {
                        cancommit = false
                        msg = '请将三个课程封面全部添加完毕后，上架该模块！'
                        break;
                    }
                }
            }
            if (showAlert && msg) {
                this.showError('提示', msg);
            }
            return cancommit;
        },
        switchCourseType(index) {
            this.curIndex = index
            this.searchlist()
        },
        selectstatus(item) {
            this.condition.state = item.val;
        },
        alocked(index) {
            var course = this.course_list[index];
            for (let i = 0; i < this.course_list.length; i++) {
                var item = this.course_list[i];
                if (item === course) {

                } else {
                    item.selected = false;
                }
            }
            if (this.selCourse === course) {
                this.selCourse = {};
            } else {
                this.selCourse = course;
            }
            Vue.set(this.course_list, index, course);
        },
        goback() {
            this.$router.go(-1)
        },
        submitData() {
            var _that = this;
            if (!_that.validateUploadData(true)) {
                return
            }
            // 
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: '/butlerp/business/greatmod',
                data: {
                    list: _that.data_list,
                    state: _that.moduleStatus == 1 ? 0 : 1
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.refrehHomeList();
                    }
                }
            });
        },
        //首页数据
        refrehHomeList(callback) {
            var _that = this
            var url = '/butlerp/business/greatlist';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {

                },
                success: function (json) {
                    var list = json.list;
                    // var total = json.totalcount;
                    if (list instanceof Array && list.length > 0) {
                        var datastatus = list[0].datastatus
                        _that.moduleStatus = datastatus == 1 ? 1 : 0; //上架状态
                        _that.data_list = list;
                        //580.0 / 680.0 0.85294
                        _that.data_list[0].ratio = 0.85;
                        _that.data_list[1].ratio = 580.0 / 320.0;
                        _that.data_list[2].ratio = 580.0 / 320.0;
                    } else {
                        //580.0 / 680.0
                        _that.data_list = [{ 'greatid': '1', 'ratio': 0.85 }, { 'greatid': '2', 'ratio': 580.0 / 320.0 }, { 'greatid': '3', 'ratio': 580.0 / 320.0 }];
                    }
                    if(callback){
                        callback()
                    }
                }
            });
        },

        //刷新选择课程列表
        searchlist() {
            var _that = this
            var pageparam = _that.pageparam
            var isSeries = _that.curIndex == 1;
            var url = '/butlerp/business/popupsignle';
            var param = { optype: 3, condition: _that.searchcondition, coursetype: _that.curIndex }
            if (!isSeries) {
                param.page = pageparam.single.page;
                param.per_page = pageparam.single.pagesize;
            } else if (isSeries) {
                param.page = pageparam.series.page;
                param.per_page = pageparam.series.pagesize;
            }
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: param,
                success: function (json) {
                    var list = json.list;
                    var total = json.totalcount;
                    if (list instanceof Array && list.length > 0) {
                        _that.course_list = list;
                        if (isSeries) {
                            pageparam.series.total = total;
                        } else {
                            pageparam.single.total = total;
                        }
                    } else {
                        _that.course_list = [];
                        if (isSeries) {
                            pageparam.series.total = 0;
                        } else {
                            pageparam.single.total = 0;
                        }
                    }

                }
            });


        },
        //添加移除课程
        editeRow(type, index) {
            var _that = this
            if (this.moduleStatus == 1) {
                jQuery.postFail("fadeInUp", '请先下架该模块！')
                return;
            }
            var item = _that.data_list[index]
            if (type == 1) {
                _that.courseDialogParam.isActive = true
                _that.opIndex = index;
                _that.searchlist()
            } else if (type == 2) {
                item.courseid = '';
                item.coursetype = '';
                // item.showbanner = '';
                item.title = '';
                item.roomname = '';
                item.coursestate = '';
                item.datastatus = '';
                item.coursestate = '';                
                Vue.set(_that.data_list, index, item);
            }
        }
        ,
        singlePagechange(page) {
            this.pageparam.single.page = page;
            this.searchlist();
        },
        singlePagesizechange(pagesize) {
            this.pageparam.single.page = 1;
            this.pageparam.single.pagesize = pagesize;
            this.searchlist();
        },
        seriesPagechange(page) {
            this.pageparam.series.page = page;
            this.searchlist()
        },
        seriesPagesizechange(pagesize) {
            this.pageparam.series.page = 1;
            this.pageparam.series.pagesize = pagesize;
            this.searchlist()
        },
        chooseBanner(index) {
            var _that = this
            var item = this.data_list[index]
            var ratio = item.ratio;
            var id = '#course_file'+ index
    
            uploadPicByDom(id, ratio, function (percent) {
                console.log(percent)
            }, function (json) {
                if (json) {
                    item.showbanner = json.list.url;
                    Vue.set(_that.data_list, index, item);
                }
            })
        },
        //获取课程分类
        requestCurseType(callback) {
            var _that = this;
            $.ajax({
                data: {

                },
                dataType: 'json',
                type: 'post',
                url: "/butlerp/business/taglist",
                success: function (json) {
                    if (json.code == 1) {
                        if (json.list instanceof Array) {
                            for (let i = 0; i < json.list.length; i++) {
                                var item = json.list[i]
                                _that.typeList.push({ key: item.tagname, val: item.tagid })
                            }
                        }

                    }
                    if(callback){
                        callback() 
                    }
                }
            });
        },
        getShowTypeStr(tagid) {
            var tag = '';
            for (let i = 0; i < this.typeList.length; i++) {
                var item = this.typeList[i];
                if (item.val === tagid) {
                    tag = item.key;
                    return tag;
                }
            }
            return tag;
        },
        coursetype(type) {
            var ss = ''
            if (type == 0) {
                ss = '幻灯片'
            } else if (type == 1) {
                ss = '视频录播'
            } else if (type == 2) {
                ss = '视频直播'
            } else {
                ss = ''
            }
            return ss;
        },
    },
    mounted() {
        var _that = this
        this.requestCurseType()
        this.refrehHomeList(()=>{
            for(let i=0;i<3;i++){
                _that.chooseBanner(i)
            }
        })
    }
};