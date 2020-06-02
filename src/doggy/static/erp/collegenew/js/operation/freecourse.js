var freecourse_pcom = {
    delimiters: ['<{', '}>'],
    template: "#freecourse_id",
    data: function () {
        var _that = this
        return {
            condition: {
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
            cancommit: false,
            typeList: [],//课程分类
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
            },
            singleparam: {
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
            },
            singleCondition: '',  //选择课程搜索条件
            isallselected: false,
            singleCourselist: [],
            addSingleCourse_list: [],
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
                onOk: function () {
                    //重置数据
                    _that.isallselected = false;
                    _that.addSingleCourse_list = [];

                    for (var i = 0; i < _that.singleCourselist.length; i++) {
                        var course = _that.singleCourselist[i];
                        if (course.isselected) {
                            _that.addSingleCourse_list.push(course);
                        }
                    }

                    var url = '/butlerp/business/addfreecourse';
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: url,
                        data: {
                            list: _that.addSingleCourse_list,
                        },
                        success: function (json) {
                            console.log(json);
                            if (json.code == 1) {
                                _that.refrehHomeList()
                            } else {
                                alert(json.info);
                            }

                        }
                    });
                },
                onCancel: function () {
                    _that.condition.content = '';
                    _that.isallselected = false;
                    _that.addSingleCourse_list = [];
                }
            },
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
        goback() {
            this.$router.go(-1)
        },
        submitData() {
            alert('submit')
        },

        selectstatus(item) {
            this.condition.state = item.val;
        },
        refrehHomeList() {
            var _that = this
            var page = this.homeparam.page;
            var per_page = this.homeparam.pagesize;
            var url = '/butlerp/business/freelist';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {
                    'condition': _that.condition.content,
                    'state': _that.condition.state,
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
        refreshSelCourseList() {
            var _that = this;
            var url = '/butlerp/business/popupsignle';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {
                    optype: 1,
                    coursetype: 0,
                    page: _that.singleparam.page,
                    per_page: _that.singleparam.pagesize,
                    condition: _that.singleCondition
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        var list = json.list;
                        if (list instanceof Array) {
                            for (var i = 0; i < list.length; i++) {
                                var course = list[i];
                                course.isselected = false;
                            }
                            _that.singleCourselist = list;
                            //总页数
                            _that.singleparam.total = json.totalcount;
                            $('#addsinglecoursepage').css('display', 'block');
                        } else {
                            _that.singleCourselist = [];
                            //总页数
                            _that.singleparam.total = 0;
                            $('#addsinglecoursepage').css('display', 'none');
                        }

                    } else {
                        alert(json.info);
                    }

                }
            });
        },
        showCourseDialog() {
            this.addsinglecourse.isActive = true
            this.refreshSelCourseList()
        },
        //选中所有
        chooseall() {
            var _that = this;
            var state = _that.isallselected;
            for (var i in _that.singleCourselist) {
                var course = _that.singleCourselist[i];
                course.isselected = state;
            }
        },
        //checkbox单个选中
        alocked(index) {
            var _that = this;
            var course = _that.singleCourselist[index];
            var isAllSelected = true;
            for (var i = 0; i < _that.singleCourselist.length; i++) {
                var course = _that.singleCourselist[i];
                if (course.isselected == false) {
                    isAllSelected = false;
                    break;
                }
            }
            _that.isallselected = isAllSelected;
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
        singlePageChange(page) {
            this.singleparam.page = page;
            this.refreshSelCourseList()
        },
        singlePagesizeChange(pagesize) {
            this.singleparam.page = 1;
            this.singleparam.pagesize = pagesize;
            this.refreshSelCourseList()
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
                    callback()
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
        edtCourse(index, type, status) {
            var _that = this;
            var signleid = _that.data_list[index].signleid;
            var displayorder = _that.data_list[index].displayorder;
            var istop = _that.data_list[index].istop;
            if (type == 2) {
                _that.showAlert('是否移除该课程？', () => {
                    _that.edrCourserequest(signleid, status);
                })
            } else {
                _that.edrCourserequest(signleid, status,displayorder,istop);
            }
        }, edrCourserequest(signleid, status,displayorder,istop) {
            var _that = this;
            $.ajax({
                data: {
                    signleid: signleid,
                    status: status,
                    displayorder:displayorder,
                    istop:istop,
                    condition: _that.condition.content,
                    state: _that.condition.state
                },
                dataType: 'json',
                type: 'post',
                url: "/butlerp/business/modfreecourse",
                success: function (json) {
                    if (json.code == 1) {
                        _that.refrehHomeList()
                    }else{
                        _that.showError("提示",json.info)
                    }

                }
            });
        }
    },
    mounted() {
        var _that = this
        this.requestCurseType(() => {
            _that.refrehHomeList()
        })

    }
};