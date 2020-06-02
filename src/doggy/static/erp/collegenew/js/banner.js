//------------------------
// BANNER管理组件
//------------------------
jQuery.createAniCss();
//上传文件处理模板
var picupObj = new Picuploadclass({
    setWTagId: 'lowW',
    setHTagId: 'lowH',
    picPrivewId: 'pic',
    picUpLoadInfo: 'picupinfo',
    Extname: ''
});


var banner_pcom = {
    delimiters: ['<{', '}>'],
    template: "#banner_id",
    data: function () {
        var _that = this;
        return {
            msg1: '分拥比例管理',
            test: 'this is test',
            data_list: [],
            bannerID: '',
            bannerName: '',
            bannerPic: '',
            bannerLink: '',
            pictureExt: '',
            coursename: '',
            courseid: '',
            condition: "",//搜索条件
            allcourse_list: [],//所有课程
            currentCourse_list: [],//当前展示课程类列表
            selCourse: {
                seriesid: '',
                signleid: ''
            },
            course_list: [],
            curIndex: 0,
            //所有banner 翻页
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
            addSeriesCoursepageAttrs: {
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
            //添加banner
            addbanner: {
                isShow: true,
                isActive: false,
                showHeader: true,
                showFooter: true,
                showCancel: true,
                showOk: true,
                transition: 'fade',
                backdrop: false,
                title: '新建BANNER',
                okText: '确定',
                cancelText: '取消',
                width: 580,
                height: 350,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                okLoading: false,
                onOk: function (param) {
                    console.log('param= OkBtn', param);

                    if (_that.bannerName == "") {
                        alert("请输入Banner名称!");
                        _that.addbanner.isActive = true;
                        return;
                    }
                    if (_that.bannerPic == "") {
                        _that.addbanner.isActive = true;
                        alert("请上传banner图片!");
                        return;
                    }
                    $.ajax({
                        data: {
                            coursetype:_that.curIndex,
                            coursename: _that.coursename,
                            courseid: _that.courseid,
                            bannerid: _that.bannerID,
                            bannername: _that.bannerName,
                            url: _that.bannerPic,
                            detailurl: _that.bannerLink
                        },
                        url: '/butlerp/business/addormodbanner',
                        dataType: 'json',
                        type: 'post',
                        success: function (json) {
                            if (json.code == 1) {
                                _that.getpageinfo();
                            } else {
                                alert("失败");
                            }
                        }
                    });
                },
                onCancel: function (param) {
                    console.log('param canBtn=', param)
                }
            },
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
                title: '选择课程',
                okText: '确定',
                cancelText: '取消',
                width: 980,
                height: 540,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                okLoading: false,
                onOk: function (param) {

                    _that.addSingleCourse_list = [];
                    var selectCourse = _that.selCourse;
                   
                    if (selectCourse) {
                        _that.courseid = _that.curIndex == 0? selectCourse.signleid:selectCourse.seriesid;
                        _that.coursename = selectCourse.title;
                        $("#coursename").html(_that.coursename);
                    }

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
        switchCourseType(index) {
            this.curIndex = index
        },
        refreshCourseData(input_page) {
        var _that = this;
        if(input_page>0){
            if (_that.curIndex == 1) {
            _that.addSeriesCoursepageAttrs.curPage = input_page
        }else{
            _that.addcoursepageAttrs.curPage = input_page
        }
}


            var page = _that.addcoursepageAttrs.curPage;
            var per_page = _that.addcoursepageAttrs.maxPageNum;
            var url = '/butlerp/business/signlelist'
            if (_that.curIndex == 1) {
                page = _that.addSeriesCoursepageAttrs.curPage;
                per_page = _that.addSeriesCoursepageAttrs.maxPageNum;
                url = '/butlerp/business/serieslist'
            }else{
                
            }


            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {
                    isall: "2",
                    condition: _that.condition,
                    page: page,
                    per_page: per_page
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        var list = json.list;
                        var total = json.totalcount
                        if (list instanceof Array) {
                            for (var i = 0; i < list.length; i++) {
                                var course = list[i];
                                course.selected = false;
                                if (_that.curIndex == 1) {
                                    if (_that.selCourse.seriesid == course.seriesid) {
                                        course.selected = true;
                                    }
                                } else {
                                    if (_that.selCourse.signleid == course.signleid) {
                                        course.selected = true;
                                    }
                                }
                            }

                            _that.course_list = list;
                            //总页数
                            if (_that.curIndex == 0) {
                                _that.addcoursepageAttrs.totalPage = Math.ceil(total / _that.addcoursepageAttrs.maxPageNum);
                                $('#addsinglecoursepage').css('display', 'block');
                            } else {
                                _that.addSeriesCoursepageAttrs.totalPage = Math.ceil(total / _that.addSeriesCoursepageAttrs.maxPageNum);
                                $('#addseriescoursepage').css('display', 'block');
                            }

                        } else {
                            _that.course_list = [];
                            //总页数
                            if (_that.curIndex == 0) {
                                _that.addcoursepageAttrs.totalPage = 0;
                                $('#addsinglecoursepage').css('display', 'none');
                            } else {
                                _that.addSeriesCoursepageAttrs.totalPage = 0;
                                $('#addseriescoursepage').css('display', 'none');
                            }

                        }

                    } else {
                        alert(json.info);
                    }

                }
            });
        },
        getpageinfo() {
            var _that = this;
            var page = _that.details.curPage;
            var per_page = _that.details.maxPageNum;
            $.ajax({
                data: {
                    page: page,
                    per_page: per_page,
                    // totalcount: 0
                },
                dataType: 'json',
                type: 'post',
                url: '/butlerp/business/bannerlist',
                success: function (json) {
                    if (json.code == 1) {
                        // var tmp = json.list;
                        // if (!tmp) tmp = [];
                        // _that.data_list = tmp;
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
        changeimg: function () {
            var _that = this;
            // $("#progressid").html('图片上传...');
            var f = document.getElementById("file1").files[0];//获取文件
            if (f === undefined) {//未选择图片
            } else {
                // var src = window.URL.createObjectURL(f);
                // document.getElementById("imgid").src = src;
                //图片大小 16:9
                var isRightSize = validateImgSize('file1', (rightSize) => {
                    if (rightSize) {
                        $("#progressid").html('图片上传...');
                        _that.pictureExt = f.type;
                        _that.uploadbanner();
                    } else {
                        //清空表单
                        $('#file1').val("");
                    }
                });
            }
        },
        uploadbanner() {
            var _that = this;
            var x = new FormData();
            x.append("file", $("#file1")[0].files[0]);
            x.append('filetype', _that.pictureExt.slice(6));
            var percentage = null;
            var time = new Date().getTime();
            $.ajax({
                xhr: function xhr() {
                    //获取原生的xhr对象
                    var xhr = $.ajaxSettings.xhr();
                    if (xhr.upload) {
                        //添加 progress 事件监听
                        xhr.upload.addEventListener('progress', function (e) {
                            var nowDate = new Date().getTime();
                            //每一秒刷新一次状态
                            if (nowDate - time >= 1000) {
                                percentage = parseInt(e.loaded / e.total * 100);
                                $("#progressid").html('上传进度:' + percentage + '%');
                                if (percentage >= 99) {
                                    $("#progressid").html('服务端正在解析，请稍后...');
                                } else {
                                    time = nowDate;
                                }
                            } else {
                                return;
                            }
                        }, false);
                    }
                    return xhr;
                },
                processData: false,
                contentType: false,
                cache: false,
                data: x,
                url: '/butlerp/business/uploadpic',
                type: 'post',
                success: function (json) {
                    console.log(json);
                    if (json.code == 0) {
                        alert(json.info);
                    } else {
                        var tmp = json.list;
                        if (!tmp) {
                            $("#progressid").html('上传失败');
                        } else {
                            _that.bannerPic = json.list.url;
                            document.getElementById("imgid").src = json.list.url + "&Rows=80&Columns=120";
                            $("#progressid").html('上传成功');
                        }
                    }
                },
                error: function (json) {
                    $("#progressid").html('上传失败');
                }
            });
        },
        MoveBanner(index, control) {
            var _that = this;
            $.ajax({
                url: '/butlerp/business/movebanner',
                type: 'post',
                dataType: 'json',
                data: {
                    do: control,
                    bannerid: _that.data_list[index].bannerid,
                    displayorder: _that.data_list[index].displayorder
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        _that.getpageinfo();
                    } else {
                        alert(json.info);
                    }
                }
            });
        },
        bannersetting(index, datastatus) {
            var _that = this;
            if (datastatus == "0") {
                jQuery.showDel("确定删除该Banner?", '提示',
                    function () {
                        jQuery.loading();

                        $.ajax({
                            url: '/butlerp/business/bannersetting',
                            type: 'post',
                            dataType: 'json',
                            data: {
                                bannerid: _that.data_list[index].bannerid,
                                datastatus: datastatus
                            },
                            success: function (json) {
                                console.log(json);
                                if (json.code == 1) {
                                    if (index == 0) {
                                        _that.details.curPage--;
                                        if (_that.details.curPage < 1) {
                                            _that.details.curPage = 1;
                                        }
                                    }
                                    _that.getpageinfo();
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
                    url: '/butlerp/business/bannersetting',
                    type: 'post',
                    dataType: 'json',
                    data: {
                        bannerid: _that.data_list[index].bannerid,
                        datastatus: datastatus
                    },
                    success: function (json) {
                        console.log(json);
                        if (json.code == 1) {
                            if (index == 0) {
                                _that.details.curPage--;
                                if (_that.details.curPage < 1) {
                                    _that.details.curPage = 1;
                                }
                            }
                            _that.getpageinfo();
                        }
                    }
                });
            }
        },
        modbannerinfo(index) {
            var _that = this;
            var course = _that.data_list[index];
            _that.addbanner.title = "编辑BANNER";
            _that.bannerID = course.bannerid;
            _that.bannerPic = course.url;
            _that.bannerName = course.bannername;
            _that.bannerLink = course.detailurl;
            _that.courseid = course.courseid;
            _that.coursename = course.coursename;
            $("#coursename").html(_that.coursename);
            document.getElementById("imgid").src = _that.bannerPic;
            $("#progressid").html('');
            _that.addbanner.isActive = true;

        },
        addbannerinfo() {
            var _that = this;
            _that.addbanner.title = "新建BANNER";
            _that.bannerID = "";
            _that.bannerPic = "";
            _that.bannerName = "";
            _that.bannerLink = "";
            _that.pictureExt = "";
            _that.courseid = "";
            _that.coursename = "";
            document.getElementById("imgid").src = "";
            $("#progressid").html('');
            _that.addbanner.isActive = true;
        },
        //查询
        searchlist() {
            var _that = this;
            _that.addcoursepageAttrs.curPage = 1;
            _that.addSeriesCoursepageAttrs.curPage = 1;
            _that.selCourse = {
                seriesid: '',
                signleid: ''
            }
            _that.refreshCourseData();
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
        //点击页数(选择课程)
        addcourselistenpage(index) {
            var _that = this;
            if(_that.curIndex == 0){
                _that.addcoursepageAttrs.curPage = index;
            }else{
                _that.addSeriesCoursepageAttrs.curPage = index;
            }
            _that.refreshCourseData();
        },
        //checkbox单个选中
        alocked(index) {
            var _that = this;
            var chooseCourse = _that.course_list[index]
            var selCourseid =  _that.selCourse.signleid
            var chooseCourseid = chooseCourse.signleid
            if(_that.curIndex == 1){
                selCourseid = _that.selCourse.seriesid
                chooseCourseid = chooseCourse.seriesid
            }
            if(selCourseid == chooseCourseid){
                _that.selCourse = {
                    seriesid: '',
                    signleid: ''
                }
            }else{
                _that.selCourse = chooseCourse
            }
           
            _that.refreshCourseData()
        },
        //添加单课
        addsingle() {
            var _that = this;
            _that.courseid = "";
            _that.coursename = "";
            _that.condition = "";
            _that.addcoursepageAttrs.curPage = 1;
            _that.allcourse_list = [];
            _that.currentCourse_list = [];
            _that.isallselected = false;
            _that.addsinglecourse.isActive = true;
            $("#coursename").html(_that.coursename);
            _that.refreshCourseData()
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
                // $('#allanchorstollegehomepage').css('display', 'f');
            } else {
                _that.data_list = [];
                //总页数
                _that.details.totalPage = 0;
                // $('#allanchorstollegehomepage').css('display', 'none');
            }
        },
        //点击页数(home页)
        listenpage(index) {
            var _that = this;
            _that.details.curPage = index;
            _that.getpageinfo()
        },
        //所有课程
        getallcourse() {
            var _that = this;
            var url = '/butlerp/business/signlelist';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {
                    isall: "2",
                    condition: _that.condition,
                    page: '',
                    perpage: ''
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
    },
    watch:{
        curIndex(newValue) {
            var index = newValue
            if (index == 0) {
                $('#single_btn').addClass('switch_btn_sel')
                $('#series_btn').removeClass('switch_btn_sel')
            } else {
                $('#series_btn').addClass('switch_btn_sel')
                $('#single_btn').removeClass('switch_btn_sel')
            }
            this.refreshCourseData()
        }
    },
    created() {

        var _that = this;
        _that.getpageinfo();
    }
};

function validateImgSize(elementid, callback) {
    var docObj = document.getElementById(elementid);
    var files = document.getElementById(elementid).value;

    if (docObj.files && docObj.files[0]) {
        var img = new Image;
        img.onload = function () {
            var width = img.width;
            var height = img.height;
            var filesize = img
            // width * 9 != height * 16
            if (width!= height*3) {
                alert('宽:' + width + ' 高:' + height + " ,该图片尺寸不符合 3:1 ，请重新上传....");
                callback(false);
            } else {
                //后续操作  提交代码
                callback(true);
            }
        };
        img.onerror = function () {
            alert("error!");
            callback(false);
        };
        img.src = window.URL.createObjectURL(docObj.files[0]);
    }
}