
var consultcourselist_pcom = {
    delimiters: ['<{', '}>'],
    template: "#consultcourselist_id",
    data: function () {
        var _that = this;
        return {
            consultid:"",
            condition:"",
            isallselected:false,
            searchcondition:"",//搜索课程条件
            curIndex:0, //选择单课程还是系列课
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
                    var activeIndex = _that.curIndex;
                    var isSeries = _that.curIndex == 1;
                    var param = {optype:"0",consultid:_that.consultid,signlelist:[],serieslist:[]}
                    //单课程
                    if (activeIndex == 0) {
                         for(var i = 0 ;i< _that.course_list.length;i++){
                            var course = _that.course_list[i]
                            if (course.isselected){
                                var item = {courseid:course.signleid,anchorid:course.anchorid}
                                if(course.lessontype == 0){
                                    item.coursetype = "0"
                                }else if (course.lessontype == 1){
                                    item.coursetype = "2"
                                }else{
                                    item.coursetype = "1"
                                }
                                param.signlelist.push(item)
                            }
                         
                         }
                    }else {
                    //系列课程
                    for(var i = 0 ;i< _that.course_list.length;i++){
                        var course = _that.course_list[i]
                        if (course.isselected){
                            var item = {courseid:course.seriesid,coursetype:1,anchorid:course.anchorid}
                            param.serieslist.push(item)
                        }
                     }
                    
                    }
                    $.ajax({
                        type: 'post',
                        dataType: 'json',
                        url: "/butlerp/business/addOrDelConsultCourse",
                        data: param,
                        success: function (json) {
                            if (json.code == 1) {
                                jQuery.postOk("", '添加成功');
                                _that.refreshList();
                            }else{
                                jQuery.postFail("", json.info);
                            }
            
                        }
                    });
                    _that.isallselected = false
                    _that.curIndex = 0
                    _that.selCourse = {}
                },
                onCancel: function () {
                    _that.isallselected = false
                    _that.searchcondition = ''
                    _that.curIndex = 0
                }
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
        //翻页参数(待审批)
        details: {
            totalPage: 10,  //总页数
            curPage: 1,     //当前页
            maxPageNum: 10, //每页最大值
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
        switchCourseType(index) {
            this.curIndex = index
            this.searchlist()
        },
        selectstatus(item) {
            this.condition.state = item.val;
        },
           //选中所有
        chooseall() {
            var _that = this;
            var state = $('#singlecourse_checkbox').is(':checked');
            for (var i in _that.course_list) {
                var course = _that.course_list[i];
                Vue.set(course,"isselected",state)
            }
        },
        //选中单个课程
        alocked(index) {
            var course = this.course_list[index];
            var isallselected = true
            for (let i = 0; i < this.course_list.length; i++) {
                var item = this.course_list[i];
                if (item === course) {
                    // Vue.set(item,"isselected",!item.isselected)
                } else {
                    Vue.set(item,"isselected",false)
                }
                if (item.isselected == false) {
                    isallselected = false
                }
            }
            this.isallselected = isallselected
            Vue.set(this.course_list, index, course);
        },
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
        goback() {
            this.$router.go(-1)
        },
         //刷新"选择课程列表"
        searchlist() {
        var _that = this
        var pageparam = _that.pageparam
        var isSeries = _that.curIndex == 1;
        var url = '';
        var param = { condition: _that.searchcondition }
        if (!isSeries) {
            url = "/butlerp/business/searchConsultSignle"
            param.page = pageparam.single.page;
            param.per_page = pageparam.single.pagesize;
        } else if (isSeries) {
            url = "/butlerp/business/searchConsultSeries"
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
                    _that.isallselected = false
                    for(let i = 0 ; i < list.length ;i++ ){
                        var item =  _that.course_list[i]
                        // item.isselected = false
                        Vue.set(item,'isselected',false)
                    }       
                    
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
        //选择课程
        addCourses(){
            this.curIndex = 0;
            this.searchlist();
            this.courseDialogParam.isActive = true;
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
        //刷新主页课程列表
        refreshList(selPage){
            var _that = this;
            if (selPage > 0) {
                _that.details.curPage = selPage
            }
            var page = _that.details.curPage;
            var per_page = _that.details.maxPageNum;
            var url = '/butlerp/business/getConsultCourseList'
            $.ajax({
                data: {
                    consultid:_that.consultid,
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
                $('#allanchorstollegehomepage').css('display', 'flex');
            } else {
                _that.data_list = [];
                //总页数
                _that.details.totalPage = 0;
                $('#allanchorstollegehomepage').css('display', 'none');
            }
        },
        searchData() {
            this.details.curPage = 1;
            this.refreshList()
        },
           //点击页数
        listenpage(index) {
            this.details.curPage = index;
            this.refreshList()
        },delAction(index){
            var _that = this
            var item = _that.data_list[index]
            _that.showAlert("是否删除该课程?", () => {
                var param = item
                var url='/butlerp/business/addOrDelConsultCourse'
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
        }
    },
    activated(){
        this.consultid = this.$route.query.consultid;
    },
    mounted() {
        this.consultid = this.$route.query.consultid;
        this.refreshList()
    }
};