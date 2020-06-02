//上传文件处理模板
jQuery.createAniCss();

var picupObj = new Picuploadclass({
    setWTagId: 'lowW',
    setHTagId: 'lowH',
    picPrivewId: 'pic',
    picUpLoadInfo: 'picupinfo',
    Extname: ''
});
var upvideopop = null;
var currentImgData = null;
//------------------------
// 所有主播组件
//------------------------
var allanchors_pcom = {
    delimiters: ['<{', '}>'],
    template: "#allanchors_id",
    data: function () {
        var _that = this;
        return {
            coursetype: {
                showtype: '其他',
                tag: '0',
                attribute: {
                    width: '90px',
                    height: '30px',
                    lineheight: '30px',
                    voffset: '0px',
                    isReadOnly: true
                },
                valueList: []
            },
            anchortype: { key: '全部', val: '' }, //直播间类型
            anchorcondition: "", //搜索条件
            anchorid: '', // 当前操作的主播id
            signleid: '', // 当前操作的单课程id
            seriesid: '', // 当前操作的系列课id
            anchorinfo: {},
            anchor_list: [],
            data_list: [],
            income_list: [],
            payout_list: [],
            anchor_signle_list: [],        //单课程列表
            anchor_series_list: [],        //系列课列表
            anchor_offline_list: [],        //线下课列表
            anchor_series_signle_list: [], //系列课详情 -- 单课程列表
            anchor_series_add_signle: [],  //系列课详情 -- 待选择添加到-系列课中的-课程列表
            reserveApi: {},
            stateList: [
                { 'key': '全部', 'val': '' },
                { 'key': '明星主播', 'val': '1' },
                { 'key': '普通主播', 'val': '0' }
            ],
            addanchorobj: {
                mobile: '',
                picture: '',
                name: '',
                userid: '',
                isanchor: 0
            },//添加主播对象
            swhereObj_allanchors: null,
            anchor: '主播1',
            // addanchorsphoto:'',
            allclassarr: [{ 'class': '课程1' }, { 'class': '课程2' }, { 'class': '课程3' }, { 'class': '课程4' }],
            anchorsarr: [{ 'key': '10', 'val': '1' }, { 'key': '20', 'val': '2' }, { 'key': '30', 'val': '5' }, { 'key': '50', 'val': '10' }], //下拉框列表
            allindex: -1,
            upallimgarr: [],

            pgetroportion: '',  //抽佣比例
            pgetroportionid: '',//抽佣比例ID
            details: {      //所有主播列表 翻页
                all: 1,
                cur: 1,
                anchorspage: 10,
                totalcount: 0
            },
            signdetails: {      //所有单课程 翻页
                all: 1,         //总页数
                cur: 1,          //当前是第几页
                anchorspage: 10, //每页数量
                totalcount: 0
            },
            signcondition: '',
            anchorcollegeindex: 0,//点击课程管理时，指定的主播索引
            seriesdetails: {      //系列课程 翻页
                all: 1,          //系列课总页数
                cur: 1,          //系列课当前第几页
                anchorspage: 10, //每页数量
                totalcount: 0    //记录总数
            },
            seriescondition: '',
            //线下课程
            offlinedetails: {      // 翻页
                all: 1,          //总页数
                cur: 1,          //当前第几页
                anchorspage: 10, //每页数量
                totalcount: 0    //记录总数
            },
            offlinecondition: '',
            //系列课详情--单课程列表 分页
            SerieSignleDetail: {
                all: 1,          //总页数
                cur: 1,          //第几页
                per_page: 10,    //每页数量
                totalcount: 0    //数量
            },
            SerieSignleConditon: '',
            SerieSignIndex: 0,   //系列课 索引
            SeriesDownorUp: 0,   //系列课上下架状态

            //系列课详情--添加单课程 分页
            SerieAddSignle: {
                all: 1,          //总页数
                cur: 1,          //第几页
                per_page: 10,    //每页数量
                totalcount: 0    //数量
            },
            SerieAddSignleConditon: '',
            SeriesAddSignleList: [], //选中的单课列表
            //新增系列课
            SeriesTitle: '',
            SeriesDiscount: 0,
            Series_Discount_Flag: false,  //是否显示提示信息
            SeriesComment: '',
            pictureExt: '',
            SeriesBanner: '',
            //新增单课程--幻灯片
            Signle_PPT_Title: '',
            Signle_PPT_Comment: '',
            Signle_PPT_Fee: 0,
            Signle_PPT_Flag: false,//是否显示提示信息
            Signle_PPT_DateTime: '',
            Signle_PPT_AutoEndtime: '',
            Signle_PPT_Banner: '',
            NewSignleID: '', //单课程ID  空表示新增， 不为空 表示修改单课程
            Signle_PPT_Code: '',
            Signle_PPT_Code_Num: 0,
            Signle_PPT_Code_Flag: false,
            //新增单课程--视频
            Signle_Video_Title: '',
            Signle_Video_Comment: '',
            Signle_Video_Fee: 0,
            Signle_Video_DateTime: '',
            Signle_Video_AutoEndTime: '',
            Signle_Video_Flag: '',
            //Signle_Video_List:[],
            Signle_Video_Url: 'http://dtcollege.oss-cn-qingdao.aliyuncs.com/19/33/42/38/104991587456520192.mp4',
            Signle_Video_Banner: '',
            pgetroportionarr: [{
                'key': '10%', 'val': '1'
            }, {
                'key': '20%', 'val': '2'
            }, {
                'key': '30%', 'val': '3'
            }, {
                'key': '40%', 'val': '4'
            }, {
                'key': '50%', 'val': '5'
            }
            ],
            anchorarr: [{
                'key': '主播1', 'val': '1'
            }, {
                'key': '主播2', 'val': '2'
            }, {
                'key': '主播3', 'val': '3'
            }, {
                'key': '主播4', 'val': '4'
            }, {
                'key': '主播5', 'val': '5'
            }, {
                'key': '主播6', 'val': '6'
            }, {
                'key': '主播7', 'val': '7'
            }
            ],
            anchortypeparam: {
                width: '90px',
                height: '30px',
                lineheight: '30px',
                voffset: '0px',
                isReadOnly: true
            },
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
            //系列课详情--添加单课程控件
            model_add_series_signle: {
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
                    console.log('param= OkBtn', param)
                    var num = _that.SeriesAddSignleList.length;
                    if (num > 0) {
                        var totalFee = 0.0;
                        var discountValue = _that.anchor_series_list[_that.SerieSignIndex].discount / 100.0;
                        for (var i = 0; i < num; i++) {
                            var SoldFee = parseFloat(_that.SeriesAddSignleList[i].fee) * discountValue;
                            _that.SeriesAddSignleList[i].soldfee = SoldFee;
                            totalFee += SoldFee;
                        }
                        //totalFee = totalFee * discountValue
                        $.ajax({
                            url: '/butlerp/business/seriesdetailaddsignle',
                            data: {
                                signlelist: _that.SeriesAddSignleList,
                                seriesid: _that.anchor_series_list[_that.SerieSignIndex].seriesid,
                                addfee: totalFee
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
                                    _that.initSeriesDetail();
                                }
                            },
                        });
                    }

                },
                onCancel: function (param) {
                    console.log('param canBtn=', param)
                    _that.SeriesAddSignleList = [];
                }
            },

            //添加主播弹框
            addanchors: {
                isShow: true,
                isActive: false,   //弹窗显示
                showHeader: true,   //标题显示
                showFooter: true,   //底部显示
                showCancel: false,   //取消显示
                showOk: false,     //确定显示
                transition: 'fade',
                backdrop: false,
                title: '新建直播间',
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
                    if (_that.addanchorobj.isanchor == 1) {
                        jQuery.postFail("", "用户已是主播");
                    } else {
                        $.ajax({
                            url: '/butlerp/business/setanchor',
                            data: {
                                userid: _that.addanchorobj.userid
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
                                    _that.initAnchors();
                                }
                            },
                            error: function (json) {
                                jQuery.postFail("", '添加失败');
                            }
                        });
                    }
                },
                onCancel: function (param) {

                    console.log('param canBtn=', param)
                }
            },
            // 单课程预览 二维码
            previewanchors: {
                isShow: true,
                isActive: false,   //弹窗显示
                showHeader: false,   //标题显示
                showFooter: true,   //底部显示
                showCancel: true,   //取消显示
                showOk: false,     //确定显示
                transition: 'fade',
                backdrop: false,
                title: '预览二维码',
                okText: '确定',
                cancelText: '关闭',
                width: 430,
                height: 300,
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
            },
            // 单课程选择添加课程类型
            chooseanchors: {
                isShow: true,
                isActive: false,   //弹窗显示
                showHeader: true,   //标题显示
                showFooter: true,   //底部显示
                showCancel: false,   //取消显示
                showOk: false,     //确定显示
                transition: 'fade',
                backdrop: false,
                title: '选择课程类型',
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
            },
            // 抽佣比例
            proportionanchors: {
                isShow: true,
                isActive: false,   //弹窗显示
                showHeader: true,   //标题显示
                showFooter: true,   //底部显示
                showCancel: true,   //取消显示
                showOk: true,     //确定显示
                transition: 'fade',
                backdrop: false,
                title: '平台抽取比例设置',
                okText: '确定',
                cancelText: '取消',
                width: 580,
                height: 230,
                z_index: 2,
                backdrop: false,
                backdropClosable: false,
                okLoading: false,
                onOk: function (param) {
                    console.log('param= OkBtn', param)
                    _that.anchorinfo.rate = _that.pgetroportion;
                    _that.anchorinfo.employrateid = _that.pgetroportionid;
                },
                onCancel: function (param) {
                    console.log('param canBtn=', param)
                }
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
        'yayigjDatesel': vyayigjDateSelcom,
    },
    filters: {
        getallactiveclass: function (item) {
            alert(item.class)
            if (item.active) {
                return 'active'
            } else {
                return ''
            }
        },
    },
    methods: {
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
                                _that.coursetype.valueList.push({ key: item.tagname, val: item.tagid })
                            }
                        }

                    }
                    if (callback) { callback() }
                }
            });
        },
        getTarget(tagid) {
            var arr = this.coursetype.valueList;
            for (let i = 0; i < arr.length; i++) {
                var item = arr[i];
                if (item.val == tagid) {
                    return item;
                }
            }
        },
        //删除主播
        delAnchor(index) {
            var _that = this;
            _that.showAlert("确认删除该主播吗?", () => {
                _that.allanchorsstop(0, index)
            })
        },
        copyPushurl() {
            copyText($('#push_url'))
        },
        showPushAlert(index) {
            var _that = this
            var course = _that.anchor_signle_list[index]
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
        //上传头像
        ChangePhoto: function () {
            var _that = this;
            $("#photostatus").html('图片上传...');
            var f = document.getElementById("photoid").files[0];//获取文件
            if (f === undefined) {//未选择图片
            } else {
                // var maxsize = 50 * 1024;//500KB 
                // var filesize = f.size;
                // if (filesize == -1) {
                //     jQuery.postFail("", "浏览器不支持大小检测,请确保图片Size < 50KB");
                // } else if (filesize > maxsize) {
                //     jQuery.postFail("", "图片大小超过50KB");
                //     $("#photostatus").html('');
                //     return;
                // }
                // var src = window.URL.createObjectURL(f);
                // document.getElementById("imgid").src = src;
                _that.pictureExt = f.type;
                if (_that.pictureExt != "image/jpg"
                    && _that.pictureExt != "image/jpeg"
                    && _that.pictureExt != "image/png") {
                    $("#photostatus").html('图片类型错误:' + _that.pictureExt);
                    return;
                }
                _that.uploadPhoto();
            }
        },
        uploadPhoto() {
            var _that = this;
            var x = new FormData();
            x.append("file", $("#photoid")[0].files[0]);
            x.append('filetype', _that.pictureExt.slice(6));
            var percentage = 0;
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
                                $("#photostatus").html('上传进度:' + percentage + '%');
                                if (percentage >= 99) {
                                    $("#photostatus").html('服务端正在解析，请稍后...');
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
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 0) {
                        jQuery.postFail("fadeInUp", json.info);
                    } else {
                        var tmp = json.list;
                        if (!tmp) {
                            $("#photostatus").html('上传失败');
                        } else {
                            _that.anchorinfo.picture = json.list.url;
                            $("#photostatus").html('上传成功');
                        }
                    }
                },
                error: function (json) {
                    $("#photostatus").html('上传失败');
                }
            });
        },

        //所有主播， 修改按钮
        seeallanchorstollege: function (index) {
            var _that = this
            _that.anchorinfo = {};
            _that.tabclasstype('allanchorstollege', index);
            var url = '/butlerp/business/anchorinfo';
            $.ajax({
                type: 'post',
                dataType: 'json',
                url: url,
                data: {
                    anchorid: _that.data_list[index].anchorid
                },
                beforeSend: function () {
                    jQuery.loading();
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.anchorinfo = json.list.info[0];   //主播基本信息
                        _that.getid('modificationratio').style.display = 'inline-block';
                    }
                },
                complete: function (json) {
                    jQuery.loading_close();
                }
            });


        },
        //第一次查询主播列表
        initAnchors: function () {
            var _that = this;
            _that.details.cur = 1;
            _that.details.totalcount = 0;
            _that.details.all = 1;
            _that.getallanchors();
        },
        //获取指定页数据
        pageAnchors: function (data) {
            var _that = this;
            if (data == 0 || data == undefined) {
                data = 1;
            }
            _that.details.cur = data;
            _that.getallanchors();
        },
        //查询主播列表
        getallanchors: function (callback) {
            var _that = this;
            var url = '/butlerp/business/anchorlist';
            $.ajax({
                type: 'post',
                url: url,
                data: {
                    condition: _that.anchorcondition,
                    issuper: _that.anchortype.val,
                    page: _that.details.cur,
                    per_page: _that.details.anchorspage,
                    totalcount: _that.details.totalcount
                },
                dataType: "json",
                // beforeSend: function () {
                //     jQuery.loading();
                // },
                // complete: function (data) {
                //     jQuery.loading_close();
                // },
                success: function (json) {
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];
                        _that.data_list = tmp;

                        if (json.totalcount % _that.details.anchorspage == 0) {
                            _that.details.all = json.totalcount / _that.details.anchorspage;
                        } else {
                            _that.details.all = parseInt(json.totalcount / _that.details.anchorspage) + 1;
                        }
                        _that.details.totalcount = json.totalcount;
                    }
                    // else {
                    //     jQuery.postFail("fadeInup", json.info);
                    // }
                    if (callback) {
                        callback()
                    }
                }
            });
        },
        //刷新当前页的数据
        refreshCurPage: function () {
            var _that = this;
            var netData = _that.anchor_list;
            var curPage = _that.details.cur;
            var pageSize = _that.details.anchorspage;
            var beginIndex = (curPage - 1) * pageSize;
            var endIndex = curPage * pageSize > maxIndex ? maxIndex : curPage * pageSize;
            var maxIndex = netData.length;
            if (maxIndex - beginIndex > 0) {
                _that.data_list = netData.slice(beginIndex, endIndex);
            } else {
                _that.data_list = [];
            }
        },
        requestBeforeStop(isanchor, index) {
            var _that = this
            $.ajax({
                type: 'post',
                url: '/butlerp/business/islive',
                data: {
                    anchorid: _that.data_list[index].anchorid
                },
                dataType: "json",
                success: function (json) {
                    if (json.code == 1) {
                        var num = json.list.num
                        if (num > 0) {
                            _that.showAlert('该直播间有正在直播的课程，请手动结束直播课程!', () => {
                                _that.allanchorsstop(isanchor, index);
                            })
                        } else {
                            _that.allanchorsstop(isanchor, index);
                        }

                    }
                }
            });

        },

        //所有主播停用
        allanchorsstop: function (isanchor, index) {
            var _that = this;
            var url = '/butlerp/business/anchorsetting';
            $.ajax({
                type: 'post',
                url: url,
                data: {
                    isanchor: isanchor,
                    anchorid: _that.data_list[index].anchorid
                },
                dataType: "json",
                success: function (json) {
                    console.log(json)
                    _that.getallanchors();
                }
            });
        },
        //查看详情切换
        seeanchorsttolloge: function (id) {
            var _that = this;
            //主播详情不再发送请求,只用点击【查看】的时候用数据即可
            if (id == "seeanchorstin") {
                _that.income_list = [];
                //发送收入数据请求
                $.ajax({
                    type: 'post',
                    data: {
                        anchorid: _that.anchorinfo.anchorid,
                        page: 1,
                        per_page: 10,
                        totalcount: -1
                    },
                    dataType: 'json',
                    url: '/butlerp/business/anchorincome',
                    beforeSend: function () {
                        jQuery.loading();
                    },
                    complete: function (data) {
                        jQuery.loading_close();
                    },
                    success: function (json) {
                        if (json.code == 1) {
                            var tmp = json.list;
                            if (!tmp) tmp = [];
                            _that.income_list = tmp;
                        }
                    }
                });

            } else if (id == "seeanchorstout") {
                _that.payout_list = [];
                //发送支出数据请求


                $.ajax({
                    type: 'post',
                    data: {
                        anchorid: _that.anchorinfo.anchorid,
                        page: 1,
                        per_page: 10,
                        totalcount: -1
                    },
                    dataType: 'json',
                    url: '/butlerp/business/anchorpayout',
                    beforeSend: function () {
                        jQuery.loading();
                    },
                    complete: function (data) {
                        jQuery.loading_close();
                    },
                    success: function (json) {
                        if (json.code == 1) {
                            var tmp = json.list;
                            if (!tmp) tmp = [];
                            _that.payout_list = tmp;
                        }
                    }
                });
            }
            $('#seeanchorstinfo1').removeClass('fc-1180b0')
            $('#seeanchorstin1').removeClass('fc-1180b0')
            $('#seeanchorstout1').removeClass('fc-1180b0')
            $('#' + id + '1').addClass('fc-1180b0')
            _that.getid('seeanchorstinfo').style.display = 'none'
            _that.getid('seeanchorstin').style.display = 'none'
            _that.getid('seeanchorstout').style.display = 'none'
            _that.getid(id).style.display = 'block'
        },
        //查看详情确定
        saveallanchors: function () {
            var _that = this;
            if (_that.anchorinfo.anchorid == "") {
                jQuery.postFail("", "主播ID不能为空");
                return;
            }

            // if (_that.anchorinfo.name == "") {
            //     jQuery.postFail("", "请输入主播名");
            //     return;
            // }

            var url = '/butlerp/business/modanchorinfo';
            $.ajax({
                type: 'post',
                url: url,
                data: {
                    anchorid: _that.anchorinfo.anchorid,
                    picture: _that.anchorinfo.picture,
                    employrateid: _that.anchorinfo.employrateid,
                    roomname: _that.anchorinfo.roomname,
                    username: _that.anchorinfo.username,
                    anchorintroduction: _that.anchorinfo.anchorintroduction
                },
                dataType: 'json',
                beforeSend: function () {
                    jQuery.loading();
                    $("#saveallanchors").html("保存中...");
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        jQuery.postOk("", "保存成功");
                        _that.data_list[_that.anchorcollegeindex].picture = _that.anchorinfo.picture;
                        _that.data_list[_that.anchorcollegeindex].name = _that.anchorinfo.name;
                        _that.data_list[_that.anchorcollegeindex].employrateid = _that.anchorinfo.employrateid;
                        _that.tabclasstype('allanchorstollegehome');
                        _that.getallanchors();
                        document.getElementsByClassName('router_area')[0].scrollTop = 0;
                    } else {
                        jQuery.postFail("", '保存失败');
                    }
                },
                error: function (json) { },
                complete: function (json) {
                    $("#saveallanchors").html("保存");
                    jQuery.loading_close();
                }
            });
        },
        //查看详情 回撤到所有主播
        cancelallanchors() {
            this.tabclasstype('allanchorstollegehome');
        },
        //添加主播弹框
        addanchorslist: function () {
            var _that = this
            _that.addanchorobj.mobile = ''
            _that.addanchorobj.name = ''
            _that.addanchorobj.picture = ''
            _that.addanchorobj.userid = ''
            _that.addanchorobj.isanchor = 0
            _that.addanchors.isActive = true
            _that.addanchors.showOk = false
            _that.addanchors.showCancel = false
            _that.getid('resurtsearch').style.display = 'none'
            _that.getid('popanchors_search').style.display = 'block'
        },
        //添加主播弹框查询
        searchanchorslist: function () {
            var _that = this

            if (_that.addanchorobj.mobile == "") {
                jQuery.postFail("", '手机号不能为空');
            } else {
                $.ajax({
                    type: 'post',
                    dataType: 'json',
                    url: '/butlerp/business/searchuser',
                    data: {
                        mobile: _that.addanchorobj.mobile
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
                                _that.addanchorobj.mobile = json.list[0].mobile;
                                _that.addanchorobj.userid = json.list[0].userid;
                                _that.addanchorobj.name = json.list[0].name;
                                _that.addanchorobj.picture = json.list[0].picture;
                                _that.addanchorobj.isanchor = json.list[0].isanchor;
                                _that.addanchors.showOk = true
                                _that.addanchors.showCancel = true
                                _that.getid('popanchors_search').style.display = 'none'
                                _that.getid('resurtsearch').style.display = 'block'
                                //_that.getid('popcancel').style.display = 'block'
                            }

                        } else {
                            jQuery.postFail("", '查询失败');
                        }
                    }
                });
            }
        },
        //添加主播，取消按钮
        cancelsearch: function () {
            var _that = this
            _that.addanchorobj.mobile = ''
            _that.addanchorobj.name = ''
            _that.addanchorobj.picture = ''
            _that.addanchorobj.userid = ''
            _that.addanchorobj.isanchor = 0
            _that.addanchors.showOk = false
            $('#popanchors_search').css('display', 'block')
            $('#popcancel').css('display', 'none')
            $('#resurtsearch').css('display', 'none')
        },
        //单课程 二维码弹窗
        signclasscode: function () {
            var _that = this
            _that.previewanchors.isActive = true
        },
        //单课程，选择添加系列课程弹窗
        addsignchooseclass: function () {
            var _that = this
            _that.chooseanchors.isActive = true
        },
        addOfflinechooseclass: function () {
            this.tabclasstype("add_signclassoffline");
        },
        // //查询某个主播所有的单课程
        // searchsignclass: function (type) {
        //     var _that = this;
        //     console.log(_that.signdetails);

        //     var anchorid = localStorage.getItem('op_anchorid');
        //     // if (_that.data_list.length > 0) {
        //     //     anchorid = _that.data_list[_that.anchorcollegeindex].anchorid
        //     // }

        //     $.ajax({
        //         data: {
        //             page: _that.signdetails.cur,
        //             per_page: _that.signdetails.anchorspage,
        //             totalcount: _that.signdetails.totalcount,
        //             anchorid: anchorid,
        //             condition: _that.signcondition
        //         },
        //         dataType: 'json',
        //         type: "post",
        //         url: "/butlerp/business/signlelist",
        //         beforeSend: function () {
        //             jQuery.loading();
        //         },
        //         complete: function (data) {
        //             jQuery.loading_close();
        //         },
        //         success: function (json) {
        //             if (json.code == 1) {
        //                 var tmp = json.list;
        //                 if (!tmp) tmp = [];
        //                 _that.anchor_signle_list = tmp;

        //                 if (json.totalcount % _that.signdetails.anchorspage == 0) {
        //                     _that.signdetails.all = json.totalcount / _that.signdetails.anchorspage;
        //                 } else {
        //                     _that.signdetails.all = parseInt(json.totalcount / _that.signdetails.anchorspage) + 1;
        //                 }
        //                 _that.signdetails.totalcount = json.totalcount;
        //             }
        //         }
        //     });
        // },
        //查询某个主播单课程列表
        searchsignclass: function () {
            var _that = this;
            console.log(_that.signdetails);

            var anchorid = localStorage.getItem('op_anchorid');
            // if (_that.data_list.length > 0) {
            //     anchorid = _that.data_list[_that.anchorcollegeindex].anchorid
            // }

            $.ajax({
                data: {
                    page: _that.signdetails.cur,
                    per_page: _that.signdetails.anchorspage,
                    totalcount: _that.signdetails.totalcount,
                    anchorid: anchorid,
                    condition: _that.signcondition,
                    lessontype:0
                },
                dataType: 'json',
                type: "post",
                url: "/butlerp/business/signlelist",
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];
                        _that.anchor_signle_list = tmp;

                        if (json.totalcount % _that.signdetails.anchorspage == 0) {
                            _that.signdetails.all = json.totalcount / _that.signdetails.anchorspage;
                        } else {
                            _that.signdetails.all = parseInt(json.totalcount / _that.signdetails.anchorspage) + 1;
                        }
                        _that.signdetails.totalcount = json.totalcount;
                    }
                }
            });
        },
        //查询某个主播线下课程列表
        searchofflineclass: function () {
            var _that = this;
            console.log(_that.signdetails);

            var anchorid = localStorage.getItem('op_anchorid');
            // if (_that.data_list.length > 0) {
            //     anchorid = _that.data_list[_that.anchorcollegeindex].anchorid
            // }

            $.ajax({
                data: {
                    page: _that.signdetails.cur,
                    per_page: _that.signdetails.anchorspage,
                    anchorid: anchorid,
                    condition: _that.signcondition,
                    lessontype: "1"
                },
                dataType: 'json',
                type: "post",
                url: "/butlerp/business/signlelist",
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];
                        _that.anchor_offline_list = tmp;

                        if (json.totalcount % _that.offlinedetails.anchorspage == 0) {
                            _that.offlinedetails.all = json.totalcount / _that.offlinedetails.anchorspage;
                        } else {
                            _that.offlinedetails.all = parseInt(json.totalcount / _that.offlinedetails.anchorspage) + 1;
                        }
                        _that.offlinedetails.totalcount = json.totalcount;
                    }
                }
            });
        },
        //切换每页数据量时，重新拉取数据
        signlechangepage: function () {
            var _that = this;
            _that.signdetails.totalcount = 0;
            _that.signdetails.cur = 1;
            _that.signdetails.all = 1;
            _that.searchsignclass();
        },
        //切换每页数据量时，重新拉取数据
        offlinechangepage: function () {
            this.offlinedetails.totalcount = 0;
            this.offlinedetails.cur = 1;
            this.offlinedetails.all = 1;
            this.searchofflineclass();
        },
        //点击查询按钮或者文本Enter查询
        clickanchorsignle: function (type) {
            var _that = this;
            _that.signdetails.totalcount = 0;
            _that.signdetails.cur = 1;
            _that.signdetails.all = 1;
            _that.signdetails.anchorspage = 10;
            if(type == 1){
                _that.searchofflineclass();
            }else{
                _that.searchsignclass();
            }
            
        },
        //主播单课程列表分页 
        anchorsignle: function (data) {
            var _that = this;
            if (data == 0 || data == undefined) {
                data = 1;
            }
            _that.signdetails.cur = data;
            _that.searchsignclass();
        },
        anchorofflinesignle: function (data) {
            var _that = this;
            if (data == 0 || data == undefined) {
                data = 1;
            }
            _that.offlinedetails.cur = data;
            _that.searchofflineclass();
        },
        //单课程查看
        signclasslook: function (index) {
            var _that = this;
            _that.signleid = _that.anchor_signle_list[index].signleid;
            $.ajax({
                url: '/butlerp/business/signledetail',
                data: {
                    signleid: _that.signleid
                },
                dataType: 'json',
                type: 'post',
                success: function (json) {
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];

                        if (tmp.length == 0) {
                            jQuery.postFail("", "获取单课程信息失败");
                            return;
                        }

                        var type = tmp[0].type;
                        if (type == 0) {//幻灯片
                            _that.chooseaddtype('add_signclass');
                            var ppt = tmp[0].ppt;
                            if (ppt instanceof Array) {
                                _that.upallimgarr = ppt;
                            }
                            _that.Signle_PPT_Title = tmp[0].title;
                            _that.Signle_PPT_Comment = tmp[0].comment;
                            _that.Signle_PPT_Fee = tmp[0].fee;
                            _that.Signle_PPT_DateTime = tmp[0].begintime;
                            _that.Signle_PPT_AutoEndtime = tmp[0].autoendtime;
                            _that.Signle_PPT_Banner = tmp[0].banner;
                            _that.NewSignleID = tmp[0].signleid;
                        } else if (type == 1) {//视频
                            _that.chooseaddtype('add_signclassvideo');
                            var ppt = tmp[0].ppt;
                            if (ppt instanceof Array) {
                                _that.Signle_Video_Url = ppt[0].url;
                                //_that.Signle_Video_List = ppt;
                            }
                            _that.Signle_Video_Title = tmp[0].title;
                            _that.Signle_Video_Comment = tmp[0].comment;
                            _that.Signle_Video_Fee = tmp[0].fee;
                            _that.Signle_Video_DateTime = tmp[0].begintime;
                            _that.Signle_Video_AutoEndTime = tmp[0].autoendtime;
                            _that.Signle_Video_Banner = tmp[0].banner;
                            _that.NewSignleID = tmp[0].signleid;
                        } else if (type == 2) {//直播视频
                            _that.chooseaddtype('add_signclassonlinevideo');
                            var ppt = tmp[0].ppt;
                            // if (ppt instanceof Array) {
                            //     _that.Signle_Video_Url = ppt[0].url;
                            //     //_that.Signle_Video_List = ppt;
                            // }
                            _that.Signle_Video_Title = tmp[0].title;
                            _that.Signle_Video_Comment = tmp[0].comment;
                            _that.Signle_Video_Fee = tmp[0].fee;
                            _that.Signle_Video_DateTime = tmp[0].begintime;
                            _that.Signle_Video_AutoEndTime = tmp[0].autoendtime;
                            _that.Signle_Video_Banner = tmp[0].banner;
                            _that.NewSignleID = tmp[0].signleid;

                        } else {
                            jQuery.postFail("", "课程类型错误");
                            return;
                        }
                    } else {
                        jQuery.postFail('', json.info);
                    }
                }
            });
        },
        signofflineclasslook: function (index) {
            var course = this.anchor_offline_list[index];
            this.signleid = course.signleid;
            this.pushToCourse(course);
        },
        changeOfflineDatastatus: function (index, datastatus) {
            //下架
            var _that = this;
            $.ajax({
                url: '/butlerp/business/signlesetting',
                dataType: 'json',
                type: 'post',
                data: {
                    signleid: _that.anchor_offline_list[index].signleid,
                    datastatus: datastatus,
                    applystatus: 0
                },
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.anchor_offline_list[index].datastatus = datastatus;
                        _that.anchor_offline_list[index].applystatus = 0;
                    }
                }
            });

        },
        //系列课查看
        seriesclasslook: function (index) {
            var _that = this;
            var item = this.anchor_series_list[index];
            var anchorid = localStorage.getItem('op_anchorid');
            if (_that.data_list.length > 0) {
                anchorid = _that.data_list[_that.anchorcollegeindex].anchorid;
            }
            var course = { seriesid: item.seriesid }
            if (anchorid) {
                course.anchorid = anchorid;
            }
            _that.pushToSeriesCourse(course);

        },
        //单课程上架
        upsignclass: function (index) {
            var _that = this;
            $.ajax({
                url: '/butlerp/business/signlesetting',
                dataType: 'json',
                type: 'post',
                data: {
                    signleid: _that.anchor_signle_list[index].signleid,
                    datastatus: 1,
                    applystatus: 0
                },
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.anchor_signle_list[index].datastatus = 1;
                        _that.anchor_signle_list[index].applystatus = 0;
                    }
                }
            });
        },
        //单课程下架
        downsignclass: function (index) {
            var _that = this;
            $.ajax({
                url: '/butlerp/business/signlesetting',
                dataType: 'json',
                type: 'post',
                data: {
                    signleid: _that.anchor_signle_list[index].signleid,
                    datastatus: 2,
                    applystatus: 0
                },
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {

                        _that.anchor_signle_list[index].datastatus = 2;
                    }
                }
            });
        },
        //禁用单课程
        fobidSignClass: function () {

        },
        //删除单课程
        deletesignclass: function (index) {
            var _that = this;
            $.ajax({
                url: '/butlerp/business/signlesetting',
                dataType: 'json',
                type: 'post',
                data: {
                    signleid: _that.anchor_signle_list[index].signleid,
                    datastatus: 0,
                    applystatus: 0
                },
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.signdetails.totalcount = 0;
                        _that.signdetails.cur = 1;
                        _that.signdetails.all = 1;
                        _that.signdetails.anchorspage = 10;
                        _that.searchsignclass();
                    } else {
                        jQuery.postFail("", json.info);
                    }
                }
            });
        },
        changeimgindex(index) {
            var _that = this
            // _that.upallimgarr.forEach(function(itema,index){
            //     if (item==itema) {
            //         _that.allindex=index
            //     }
            // })
            _that.allindex = index;
        },
        getupimgclass: function (index) {
            var _that = this;
            if (_that.allindex == index) {
                return 'active';
            } else {
                return '';
            }
        },
        //左移
        imgmoveleft: function () {
            var _that = this
            if (_that.allindex == '-1') {
                jQuery.postFail("fadeInUp", '请选择一项进行移动')
                return false
            }
            if (_that.allindex == '0') {
                jQuery.postFail("fadeInUp", '已经到第一项');
            } else {
                _that.swapItems(_that.upallimgarr, _that.allindex, _that.allindex - 1)
                _that.allindex -= 1
            }
        },
        //右移
        imgmoveright: function () {
            var _that = this
            var lent = _that.upallimgarr.length
            if (_that.allindex == '-1') {
                jQuery.postFail("fadeInUp", '请选择一项进行移动')
                return false
            }
            if (_that.allindex == lent - 1) {
                jQuery.postFail("fadeInUp", '已经是最后一项了');
            } else {
                _that.swapItems(_that.upallimgarr, _that.allindex, _that.allindex + 1)
                _that.allindex += 1
            }
        },
        //移除
        imgdelete: function () {
            var _that = this
            if (_that.allindex == '-1') {
                jQuery.postFail("fadeInUp", '请选择一项进行操作')
                return false
            }
            _that.upallimgarr.splice(_that.allindex, 1);

            if (_that.upallimgarr.length == _that.allindex) {
                _that.allindex -= 1;
            }
        },
        swapItems(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        },
        activeallclass: function (item) {
            if (item.active) {
                item.active = false
            } else {
                item.active = true
            }
            console.log(item.active)
        },
        //选择添加的单课程类型
        chooseaddtype: function (id) {
            var _that = this

            _that.chooseanchors.isActive = false
            _that.tabclasstype(id)
        },
        focusvideoprice: function () {
            var _that = this;
            _that.Signle_Video_Flag = false;
        },
        isprice: function (s) {
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            return reg.test(s);
        },
        blurvideoprice: function () {
            var _that = this;
            if (_that.Signle_Video_Fee == "") {
                _that.Signle_Video_Fee = 0;
                _that.Signle_Video_Flag = false;
            } else {
                if (_that.isprice(_that.Signle_Video_Fee) == true) {
                    _that.Signle_Video_Flag = false;
                } else {
                    _that.Signle_Video_Flag = true;
                }
            }
        },
        focuspptprice: function () {
            var _that = this;
            _that.Signle_PPT_Flag = false;
        },
        isprice: function (s) {
            var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
            return reg.test(s);
        },
        blurpptprice: function () {
            var _that = this;
            if (_that.Signle_PPT_Fee == "") {
                _that.Signle_PPT_Fee = 0;
                _that.Signle_PPT_Flag = false;
            } else {
                if (_that.isprice(_that.Signle_PPT_Fee) == true) {
                    _that.Signle_PPT_Flag = false;
                } else {
                    _that.Signle_PPT_Flag = true;
                }
            }
        },
        //-------------------主播系列课列表分页 ---------------------

        //点击查询按钮或者文本Enter查询
        clickanchorseries: function () {
            var _that = this;
            _that.seriesdetails.totalcount = 0;
            _that.seriesdetails.cur = 1;
            _that.seriesdetails.all = 1;
            _that.seriesdetails.anchorspage = 10;
            _that.searchSeriesList();
        },

        //下拉列表切换数量，重新拉取数据
        serieschangepage: function () {
            var _that = this;
            _that.seriesdetails.totalcount = 0;
            _that.seriesdetails.cur = 1;
            _that.seriesdetails.all = 1;
            _that.searchSeriesList();
        },
        //切换第几页
        anchorSeries: function (data) {
            var _that = this;
            if (data == 0 || data == undefined) {
                data = 1;
            }
            _that.seriesdetails.cur = data;
            _that.searchSeriesList();
        },
        //查询主播系列课列表
        searchSeriesList() {
            var _that = this;
            console.log(_that.seriesdetails);
            var anchorid = localStorage.getItem('op_anchorid');
            if (_that.data_list.length > 0) {
                anchorid = _that.data_list[_that.anchorcollegeindex].anchorid
            }

            $.ajax({
                data: {
                    page: _that.seriesdetails.cur,   //第几页
                    per_page: _that.seriesdetails.anchorspage,//每页数量
                    totalcount: _that.seriesdetails.totalcount,//总数量
                    anchorid: anchorid,
                    condition: _that.seriescondition
                },
                dataType: 'json',
                type: "post",
                url: "/butlerp/business/serieslist",
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];
                        _that.anchor_series_list = tmp;

                        if (json.totalcount % _that.seriesdetails.anchorspage == 0) {
                            _that.seriesdetails.all = json.totalcount / _that.seriesdetails.anchorspage;
                        } else {
                            _that.seriesdetails.all = parseInt(json.totalcount / _that.seriesdetails.anchorspage) + 1;
                        }
                        _that.seriesdetails.totalcount = json.totalcount;
                    }
                }
            });
        },
        upAllSignle: function () {
            jQuery.pop_window_modal_dialog_close({ _closemothod: 'fadeOutUp' });
            var _that = this;
            $.ajax({
                data: {
                    condition: 'up',
                    seriesid: _that.anchor_series_list[_that.SerieSignIndex].seriesid
                },
                dataType: 'json',
                url: '/butlerp/business/setallsignle',
                type: 'post',
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.initSeriesDetail();
                    } else {
                        jQuery.postFail('', jQuery.info);
                    }
                }
            });
        },
        downAllSignle: function () {
            jQuery.pop_window_modal_dialog_close({ _closemothod: 'fadeOutUp' });
            var _that = this;
            $.ajax({
                data: {
                    condition: 'down',
                    seriesid: _that.anchor_series_list[_that.SerieSignIndex].seriesid
                },
                dataType: 'json',
                url: '/butlerp/business/setallsignle',
                type: 'post',
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.initSeriesDetail();
                    } else {
                        jQuery.postFail('', jQuery.info);
                    }
                }
            });
        },
        NothingToDo: function () {
            jQuery.pop_window_modal_dialog_close({ _closemothod: 'fadeOutUp' });
        },
        //上、下架系列课中所有的单课
        SetAllSignle: function (param) {
            var _that = this;
            if (param == "up") {
                jQuery.showAsk('是否上架所有单课程?', '上架课程', _that.upAllSignle, _that.NothingToDo);
            } else if (param == "down") {
                jQuery.showAsk('是否下架所有单课程?', '下架课程', _that.downAllSignle, _that.NothingToDo);
            }
        },

        //系列课下架
        downseries: function () {
            var _that = this;
            $.ajax({
                data: {
                    datastatus: 2,
                    seriesid: _that.anchor_series_list[_that.SerieSignIndex].seriesid
                },
                dataType: 'json',
                url: '/butlerp/business/seriessetting',
                type: 'post',
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        //_that.anchor_series_list[index].datastatus = 2;
                        _that.SeriesDownorUp = 2;
                    }
                }
            });
        },
        //系列课上架
        upseries: function () {
            var _that = this;
            $.ajax({
                data: {
                    datastatus: 1,
                    seriesid: _that.anchor_series_list[_that.SerieSignIndex].seriesid
                },
                dataType: 'json',
                url: '/butlerp/business/seriessetting',
                type: 'post',
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        //_that.anchor_series_list[index].datastatus = 1;
                        _that.SeriesDownorUp = 1;
                    }
                }
            });
        },
        //系列课删除
        deleteallclass: function (index) {
            var _that = this;
            $.ajax({
                data: {
                    datastatus: 0,
                    applystatus: 0,
                    seriesid: _that.anchor_series_list[index].seriesid
                },
                dataType: 'json',
                url: '/butlerp/business/seriessetting',
                type: 'post',
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.seriesdetails.totalcount = 0;
                        _that.seriesdetails.cur = 1;
                        _that.seriesdetails.all = 1;
                        _that.searchSeriesList();
                    } else {
                        jQuery.postFail("", json.info);
                    }
                }
            });
        },
        focusseriesprice: function () {
            var _that = this;
            _that.Series_Discount_Flag = false;
        },

        isdiscount: function (s) {
            var reg = /(^100$|^(\d|[1-9]\d)$)/;
            return reg.test(s);
        },
        blurseriesprice: function () {
            var _that = this;
            if (_that.SeriesDiscount == "") {
                _that.SeriesDiscount = 0;
                _that.Series_Discount_Flag = false;
            } else {
                if (_that.isdiscount(_that.SeriesDiscount) == true) {
                    _that.Series_Discount_Flag = false;
                } else {
                    _that.Series_Discount_Flag = true;
                }
            }
        },
        //-------------------------系列课详情---单课程-------------------
        //删除 单课程
        deleteSeriesDetail: function (index) {
            var _that = this;
            $.ajax({
                data: {
                    childid: _that.anchor_series_signle_list[index].childid,
                    seriesid: _that.anchor_series_signle_list[index].seriesid
                },
                dataType: 'json',
                type: 'post',
                url: '/butlerp/business/seriesdetaildel',
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.initSeriesDetail();
                    } else {
                        jQuery.postFail("", '删除失败');
                    }
                }
            });
        },
        // 上下移动系列课-- 单课程
        MoveSeriesDetail: function (index, control) {
            var _that = this;
            $.ajax({
                url: '/butlerp/business/seriesdetailmove',
                type: 'post',
                dataType: 'json',
                data: {
                    do: control,
                    childid: _that.anchor_series_signle_list[index].childid,
                    displayorder: _that.anchor_series_signle_list[index].displayorder,
                    seriesid: _that.anchor_series_signle_list[index].seriesid
                },
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 1) {
                        _that.GetSeriesDetail();
                    } else {
                        jQuery.postFail("", json.info);
                    }
                }
            });
        },
        //系列课-单课程上架
        upsignclass_: function (index) {
            var _that = this;
            $.ajax({
                url: '/butlerp/business/signlesetting',
                dataType: 'json',
                type: 'post',
                data: {
                    signleid: _that.anchor_series_signle_list[index].signleid,
                    datastatus: 1,
                    applystatus: 0
                },
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.anchor_series_signle_list[index].datastatus = 1;
                        _that.anchor_series_signle_list[index].applystatus = 0;
                    }
                }
            });
        },
        //系列课-单课程下架
        downsignclass_: function (index) {
            var _that = this;
            $.ajax({
                url: '/butlerp/business/signlesetting',
                dataType: 'json',
                type: 'post',
                data: {
                    signleid: _that.anchor_series_signle_list[index].signleid,
                    datastatus: 2,
                    applystatus: 0
                },
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        _that.anchor_series_signle_list[index].datastatus = 2;
                        _that.anchor_series_signle_list[index].applystatus = 0;
                    } else {
                        jQuery.postFail("", json.info);
                    }
                }
            });
        },
        // 系列课详情 -- 切换页码
        ChangePageSeriesDetail: function (data) {
            var _that = this;
            if (data == 0 || data == undefined) {
                data = 1;
            }
            _that.SerieSignleDetail.cur = data;
            _that.GetSeriesDetail();
        },

        //系列课详情--初始化
        initSeriesDetail: function () {
            var _that = this;
            _that.SerieSignleDetail.cur = 1;
            _that.SerieSignleDetail.totalcount = 0;
            _that.SerieSignleDetail.all = 1;
            _that.anchor_series_signle_list = [];
            _that.GetSeriesDetail();
        },
        //获取系列课详情
        GetSeriesDetail: function () {
            var _that = this;
            $.ajax({
                data: {
                    seriesid: _that.anchor_series_list[_that.SerieSignIndex].seriesid,   //系列课ID
                    condition: _that.SerieSignleConditon,
                    page: _that.SerieSignleDetail.cur,
                    per_page: _that.SerieSignleDetail.per_page,
                    totalcount: _that.SerieSignleDetail.totalcount
                },
                url: '/butlerp/business/seriesdetail',
                type: 'post',
                dataType: 'json',
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];
                        _that.anchor_series_signle_list = tmp;

                        if (json.totalcount % _that.SerieSignleDetail.per_page == 0) {
                            _that.SerieSignleDetail.all = json.totalcount / _that.SerieSignleDetail.per_page;
                        } else {
                            _that.SerieSignleDetail.all = parseInt(json.totalcount / _that.SerieSignleDetail.per_page) + 1;
                        }
                        _that.SerieSignleDetail.totalcount = json.totalcount;
                    }
                }
            });
        },

        // 单课程选择框 内容初始化
        initSeriesAddSignle: function () {
            var _that = this;
            _that.SerieAddSignle.cur = 1;
            _that.SerieAddSignle.all = 1;
            _that.SerieAddSignle.totalcount = 0;
            _that.SeriesAddSignle();
        },
        //单课程选择框 切换页码
        ChangePageAddSignle: function (data) {
            var _that = this;
            if (data == 0 || data == undefined) {
                data = 1;
            }
            _that.SerieAddSignle.cur = data;
            _that.SeriesAddSignle();
        },
        AddSignleList: function () {
            var _that = this
            _that.model_add_series_signle.isActive = true;
            _that.SeriesAddSignleList = [];
            _that.initSeriesAddSignle();
        },
        FullChooseSignle: function () {
            var _that = this;

            if (document.getElementById("id_choose_signle").checked == true) {//全部选中
                for (var i = 0; i < _that.anchor_series_add_signle.length; i++) {
                    if (_that.anchor_series_add_signle[i].ischecked == 0) {
                        var v = {
                            "signleid": _that.anchor_series_add_signle[i].signleid,
                            "fee": _that.anchor_series_add_signle[i].fee
                        }
                        _that.SeriesAddSignleList.push(v);
                        _that.anchor_series_add_signle[i].ischecked = 1;
                    }
                }
            } else {//取消选中
                for (var i = 0; i < _that.anchor_series_add_signle.length; i++) {
                    if (_that.anchor_series_add_signle[i].ischecked == 1) {
                        var signleid = _that.anchor_series_add_signle[i].signleid;

                        for (var j = 0; j < _that.SeriesAddSignleList.length; j++) {
                            if (_that.SeriesAddSignleList[j].signleid == signleid) {
                                _that.SeriesAddSignleList.splice(j, 1);
                                break;
                            }
                        }
                        _that.anchor_series_add_signle[i].ischecked = 0;
                    }
                }
            }
        },
        ChooseSignle: function (index, control) {

            var _that = this;
            var signleid = _that.anchor_series_add_signle[index].signleid;

            if (control == "add") {
                var v = {
                    "signleid": signleid,
                    "fee": _that.anchor_series_add_signle[index].fee
                }
                _that.SeriesAddSignleList.push(v);
                _that.anchor_series_add_signle[index].ischecked = 1;
            } else {
                for (var i = 0; i < _that.SeriesAddSignleList.length; i++) {
                    if (_that.SeriesAddSignleList[i].signleid == signleid) {
                        _that.SeriesAddSignleList.splice(i, 1);
                        _that.anchor_series_add_signle[index].ischecked = 0;
                        break;
                    }
                }
            }
        },
        //系列课中添加单课程 -- 获取能够添加到--系列课中的单课列表
        SeriesAddSignle: function () {
            var _that = this;
            document.getElementById("id_choose_signle").checked = false;
            _that.anchor_series_add_signle = [];
            $.ajax({
                data: {
                    anchorid: _that.data_list[_that.anchorcollegeindex].anchorid,
                    seriesid: _that.anchor_series_list[_that.SerieSignIndex].seriesid,
                    page: _that.SerieAddSignle.cur,
                    per_page: _that.SerieAddSignle.per_page,
                    condition: _that.SerieAddSignleConditon
                },
                dataType: 'json',
                type: 'post',
                url: '/butlerp/business/seriesofsignlelist',
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];

                        for (var i = 0; i < tmp.length; i++) {
                            tmp[i].ischecked = 0;
                            for (var j = 0; j < _that.SeriesAddSignleList.length; j++) {
                                if (tmp[i].signleid == _that.SeriesAddSignleList[j].signleid) {
                                    tmp[i].ischecked = 1;
                                }
                            }
                        }
                        _that.anchor_series_add_signle = tmp;

                        if (json.totalcount % _that.SerieAddSignle.per_page == 0) {
                            _that.SerieAddSignle.all = json.totalcount / _that.SerieAddSignle.per_page;
                        } else {
                            _that.SerieAddSignle.all = parseInt(json.totalcount / _that.SerieAddSignle.per_page) + 1;
                        }
                        _that.SerieAddSignle.totalcount = json.totalcount;
                    }
                }
            });
        },
        //所有主播 内部切换  allanchorssignclass 
        tabclasstype: function (id, index) {
            var _that = this;
            if (id == 'add_signclass') {
                var anchorid = localStorage.getItem('op_anchorid');
                var course = { anchorid: anchorid, type: 0 }
                if (_that.signleid) {
                    course.signleid = _that.signleid
                }
                _that.pushToCourse(course)
                return;
            } else if (id == 'add_signclassvideo') {
                var anchorid = localStorage.getItem('op_anchorid');
                var course = { anchorid: anchorid, type: 1 }
                if (_that.signleid) {
                    course.signleid = _that.signleid
                }
                _that.pushToCourse(course)
                return;
            } else if (id == 'add_signclassonlinevideo') {
                var anchorid = localStorage.getItem('op_anchorid');
                var course = { anchorid: anchorid, type: 2 }
                if (_that.signleid) {
                    course.signleid = _that.signleid
                }
                _that.pushToCourse(course)
                return;
            } else if (id == 'add_signclassoffline') {
                var anchorid = localStorage.getItem('op_anchorid');
                var course = { anchorid: anchorid }
                if (_that.signleid) {
                    course.signleid = _that.signleid
                }
                //线上课程
                course.lessontype = "1";
                _that.pushToCourse(course)
                return;
            } else if (id == 'allanchorssignclass') {
                if (_that.data_list.length > 0&&index!=undefined) {
                    var anchorid = _that.data_list[index].anchorid;
                    localStorage.setItem('op_anchorid', anchorid);
                }
            } else if (id == 'add_allclass') {
                var anchorid = localStorage.getItem('op_anchorid');
                // if (this.data_list.length > 0) {
                //     anchorid = this.data_list[_that.anchorcollegeindex].anchorid;
                // }
                var course = { anchorid: anchorid }
                this.pushToSeriesCourse(course);
                return;
            } else if (id == 'allanchorstollegehome') {
                //回到主播列表
                localStorage.setItem('op_anchorid', "");

            }

            _that.getid('allanchorstollegehome').style.display = 'none'
            _that.getid('allanchorstollege').style.display = 'none'
            _that.getid('allanchorssignclass').style.display = 'none'
            _that.getid('allanchorsofflineclass').style.display = 'none'
            _that.getid('anchorssignclass').style.display = 'none'
            _that.getid('add_signclass').style.display = 'none'
            _that.getid('add_allclass').style.display = 'none'
            _that.getid('allanchorsallclass').style.display = 'none'
            _that.getid('add_signclassvideo').style.display = 'none'
            _that.getid('add_signclassonlinevideo').style.display = 'none'
            _that.getid(id).style.display = 'block'

            if (index !== undefined) {
                if (id == "allanchorsallclass") { //系列课详情--单课程列表
                    _that.SerieSignIndex = index;
                    _that.SeriesDownorUp = _that.anchor_series_list[index].datastatus;
                    _that.initSeriesDetail();
                    return;
                }
                _that.anchorcollegeindex = index;
                if (id == "allanchorssignclass") {//点击【课程管理】初始化分页参数
                    _that.signdetails.all = 1;
                    _that.signdetails.cur = 1;
                    _that.signdetails.anchorspage = 10;
                    _that.signdetails.totalcount = 0;
                    _that.searchsignclass();
                }
            } else {

                if (id == "allanchorssignclass") { // 单课程 与 系列课程 之间切换
                    _that.signdetails.all = 1;
                    _that.signdetails.cur = 1;
                    _that.signdetails.anchorspage = 10;
                    _that.signdetails.totalcount = 0;
                    _that.anchor_signle_list = [];
                    _that.searchsignclass();
                } else if (id == "anchorssignclass") {
                    _that.seriesdetails.all = 1;
                    _that.seriesdetails.cur = 1;
                    _that.seriesdetails.anchorspage = 10;
                    _that.seriesdetails.totalcount = 0;
                    _that.anchor_series_list = [];
                    _that.searchSeriesList();
                } else if (id == "allanchorsofflineclass") {
                    _that.offlinedetails.all = 1;
                    _that.offlinedetails.cur = 1;
                    _that.offlinedetails.anchorspage = 10;
                    _that.offlinedetails.totalcount = 0;
                    _that.anchor_offline_list = [];
                    _that.searchofflineclass();
                } else if (id == "add_allclass") {
                    _that.SeriesTitle = "";
                    _that.SeriesDiscount = 0;
                    _that.SeriesComment = "";
                    _that.SeriesBanner = "";
                    _that.Series_Discount_Flag = false;
                    document.getElementById("seriesprogressid").innerHTML = "";
                } else if (id == "add_signclass") {
                    //清理缓存
                    _that.Signle_PPT_DateTime = "";
                    _that.Signle_PPT_AutoEndtime = "";
                    _that.Signle_PPT_Title = "";
                    _that.Signle_PPT_Comment = "";
                    _that.Signle_PPT_Fee = 0;
                    _that.upallimgarr = [];
                    _that.NewSignleID = "";
                    _that.allindex = 0;
                    _that.Signle_PPT_Flag = false;
                    _that.Signle_PPT_Banner = "";
                    //document.getElementById("signleimg_1").src = "";
                    document.getElementById("signlestatus_1").innerHTML = "";
                    document.getElementById("pptid_status").innerHTML = "";

                } else if (id == "add_signclassvideo") {
                    //清理缓存
                    _that.Signle_Video_DateTime = "";
                    _that.Signle_Video_AutoEndTime = "";
                    _that.Signle_Video_Title = "";
                    _that.Signle_Video_Comment = "";
                    _that.Signle_Video_Fee = 0;
                    // _that.Signle_Video_List = [];
                    _that.Signle_Video_Flag = false;
                    _that.Signle_Video_Url = "";
                    _that.NewSignleID = "";
                    _that.allindex = 0;
                    _that.Signle_Video_Banner = "";
                    document.getElementById("signlestatus_2").innerHTML = "";
                    //document.getElementById("pptstatus_1").innerHTML = "";
                } else if (id == "add_signclassonlinevideo") {
                    //清理缓存
                    _that.Signle_Video_DateTime = "";
                    _that.Signle_Video_AutoEndTime = "";
                    _that.Signle_Video_Title = "";
                    _that.Signle_Video_Comment = "";
                    _that.Signle_Video_Fee = 0;
                    // _that.Signle_Video_List = [];
                    _that.Signle_Video_Flag = false;
                    _that.Signle_Video_Url = "";
                    _that.NewSignleID = "";
                    _that.allindex = 0;
                    _that.Signle_Video_Banner = "";
                    document.getElementById("signlestatus_3").innerHTML = "";
                    //document.getElementById("pptstatus_1").innerHTML = "";
                }
            }
            localStorage.setItem('historyPage', JSON.stringify({ id: id, index: index, anchorIndex: _that.anchorcollegeindex }))
        },
        pushToCourse(course) {
            var param = { anchorid: course.anchorid }
            if (course.type) {
                param.type = course.type;
            }
            if (course.signleid) {
                param.signleid = course.signleid;
            }
            if (course.lessontype == "1") {
                this.$router.push({
                    path: '/offlinedetail',
                    query: param
                });
            } else {
                this.$router.push({
                    path: '/edtsignlecourse',
                    query: param
                });
            }
        },
        pushToSeriesCourse(course) {
            var param = { anchorid: course.anchorid }
            if (course.seriesid) {
                param.seriesid = course.seriesid;
            }
            this.$router.push({
                path: '/edtseriescourse',
                query: param
            });
        },
        //抽佣比例设置弹窗
        modificationratio: function () {
            var _that = this
            _that.pgetroportionarr = [];
            var url = '/butlerp/business/employratelist';
            $.ajax({
                url: url,
                data: {
                    all: 1,
                    totalcount: 0
                },
                type: 'post',
                dataType: 'json',
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    var varlist = json.list;
                    if (!varlist) varlist = [];
                    for (var i = 0; i < varlist.length; i++) {
                        var item = {
                            "key": varlist[i].rate,
                            "val": varlist[i].employrateid
                        };
                        _that.pgetroportionarr.push(item);
                        if (_that.anchorinfo.employrateid == varlist[i].employrateid) {
                            _that.pgetroportion = _that.anchorinfo.rate;
                            _that.pgetroportionid = _that.anchorinfo.employrateid;
                        }
                    }
                }
            });
            _that.proportionanchors.isActive = true
        },
        getPic: function () {
            console.log('aaa')
        },
        setChdAdsSeledVal: function (v) {
            console.log(v)
            var _that = this;
            _that.pgetroportionid = v;
        },
        getpageinfo: function () {
            alert('所有主播首页：调接口')

        },

        anchorpage: function (data) {
            var _that = this
            var index = data;
            _that.details.cur = index;
            // _that.msg1='你点击了'+data+'页'
            _that.refreshCurPage();

        },
        //-------------------------------------------
        AddSeries: function () {
            var _that = this;
            if ($.trim(_that.SeriesTitle) == "") {
                jQuery.postFail("", "Title不能为空");
                return;
            }
            var src = _that.SeriesBanner;
            if (src == "") {
                jQuery.postFail("", "请选择图片");
                return;
            }
            if (_that.SeriesDiscount < 0 || _that.SeriesDiscount > 100) {
                jQuery.postFail("", "折扣范围[0,100]");
                return;
            }

            $.ajax({
                url: "/butlerp/business/addseries",
                data: {
                    title: _that.SeriesTitle,
                    banner: src,
                    discount: _that.SeriesDiscount,
                    anchorid: _that.data_list[_that.anchorcollegeindex].anchorid,
                    comment: _that.SeriesComment
                },
                dataType: "json",
                type: 'post',
                success: function (json) {
                    if (json.code == 1) {
                        _that.tabclasstype('anchorssignclass');
                        jQuery.postOk("", "保存成功");
                    } else {
                        jQuery.postFail("", json.info);
                    }
                }
            });
        },
        CancelSeries: function () {

        },

        //--------------------单课程 上传封面----------
        signleUploadBanner: function () {
            var _this = this;
            _this.uploadImgByDoms("#signlefile_1", "#signlestatus_1", (json) => {
                var imgUrl = json.list.url;
                if (imgUrl != null || imgUrl != undefined) {
                    _this.Signle_PPT_Banner = imgUrl;
                } else {
                    _this.Signle_PPT_Banner = '';
                }
            });
        },
        pptChangeImg: function () {
            var _that = this;
            var files = document.getElementById("ppt_1").files;
            var files_length = files.length
            if (files_length > 0) {
                document.getElementById("pptid_status").innerHTML = "";
            }

            for (var i = 0; i < files_length; i++) {
                var f = files[i];//获取文件
                if (f === undefined) {//未选择图片
                } else {
                    var picNum = i + 1;
                    document.getElementById("pptid_status").innerHTML += '<span id=pptstatus_' + i + ' style="position: absolute;'
                        + 'color: red;font-size: 13px;'
                        + 'letter-spacing: 1px;'
                        + 'font-weight: 900;'
                        + 'padding: 3px;">上传第' + picNum + '张图片上传</span><br />';
                    var maxsize = 2000 * 1024;//2M 
                    var filesize = f.size;
                    if (filesize == -1) {
                        $("#pptstatus_" + i).text("浏览器不支持大小检测,请确保第" + picNum + "张图片大小 <500KB ");
                    } else if (filesize > maxsize) {
                        $("#pptstatus_" + i).text("第" + picNum + "张图片大小超过500KB");
                        continue;
                    }
                    _that.pictureExt = f.type;
                    if (_that.pictureExt != "image/jpg"
                        && _that.pictureExt != "image/jpeg"
                        && _that.pictureExt != "image/png") {
                        $("#pptstatus_" + i).text('第' + picNum + '张图片类型错误:' + _that.pictureExt);
                        continue;
                    }
                    _that.pptUpload(i, f.name);
                }
            }

        },
        pptUpload: function (index, name) {
            var _that = this;
            var x = new FormData();
            var picNum = index + 1;
            var files = $("#ppt_1")[0].files
            x.append("file", files[index]);
            x.append('filetype', _that.pictureExt.slice(6));
            var percentage = 0;
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
                                $("#pptstatus_" + index).text('第' + picNum + '张上传进度:' + percentage + '%');
                                if (percentage >= 99) {
                                    $("#pptstatus_" + index).text('第' + picNum + '服务端正在解析，请稍后...');
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
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    console.log(json);
                    if (json.code == 0) {
                        jQuery.postFail("fadeInUp", json.info);
                    } else {
                        var tmp = json.list;
                        if (!tmp) {
                            $("#pptstatus_" + index).text('第' + picNum + '张上传失败');
                        } else {
                            // _that.bannerPic = json.list.url;
                            // document.getElementById("signleimg_1").src = json.list.url;
                            var obj = {
                                url: json.list.url,
                                name: name
                            }
                            _that.upallimgarr.push(obj);
                            _that.upallimgarr.sort(SortLikeWin);
                            // var index1 = _that.upallimgarr.indexOf(obj)+1;
                            $("#pptstatus_" + index).text('第' + picNum + '张上传成功');
                        }
                    }
                    //上传完清空
                    if (index == files.length - 1) {
                        $("#ppt_1")[0].value = ''
                    }
                },
                error: function (json) {
                    // var index1 = _that.upallimgarr.indexOf(obj)+1;
                    $("#pptstatus_" + index).text('第' + picNum + '张上传失败');
                    //上传完清空
                    if (index == files.length - 1) {
                        $("#ppt_1")[0].value = ''
                    }
                }
            });
        },
        //--------------------单课程上传视频-----------
        videoUploadBanner: function () {
            var _this = this;
            _this.uploadImgByDoms("#signlefile_2", "#signlestatus_2", (json) => {
                var imgUrl = json.list.url;
                if (imgUrl != null || imgUrl != undefined) {
                    _this.Signle_Video_Banner = imgUrl;
                } else {
                    _this.Signle_Video_Banner = '';
                }
            });
        },
        onlineVideoUploadBanner: function () {
            var _this = this;
            _this.uploadImgByDoms("#signlefile_3", "#signlestatus_3", (json) => {
                var imgUrl = json.list.url;
                if (imgUrl != null || imgUrl != undefined) {
                    _this.Signle_Video_Banner = imgUrl;
                } else {
                    _this.Signle_Video_Banner = '';
                }
            });
        },
        DeleteVideo: function () {
            this.Signle_Video_Url = "";
        },
        //--------------------系列课修改封面-----------
        uploadbanner() {
            var _this = this;
            _this.uploadImgByDoms("#seriesfileid", "#seriesprogressid", (json) => {
                var imgUrl = json.list.url;
                if (imgUrl != null || imgUrl != undefined) {
                    _this.SeriesBanner = imgUrl;
                } else {
                    _this.SeriesBanner = '';
                }
            });
        },
        //-----------------------------------------

        AddSignlePPT: function () {
            var _that = this;
            var bannerUrl = _that.Signle_PPT_Banner;

            if (bannerUrl == "") {
                jQuery.postFail("", "Banner图片不能为空");
                return;
            }
            if ($.trim(_that.Signle_PPT_Title) == "") {
                jQuery.postFail("", "Title不能为空");
                return;
            }
            if (_that.upallimgarr.length < 1) {
                jQuery.postFail("", "幻灯片未指定");
                return;
            }
            if (_that.Signle_PPT_DateTime == "") {
                jQuery.postFail("", "开始时间未指定");
                return;
            }
            if (_that.Signle_PPT_AutoEndtime == "") {
                jQuery.postFail("", "结束时间未指定");
                return;
            }
            if (_that.Signle_PPT_Flag == true) {
                jQuery.postFail("", "课程费用错误");
                return;
            }

            var stdt = new Date(_that.Signle_PPT_DateTime.replace("-", "/"));
            var etdt = new Date(_that.Signle_PPT_AutoEndtime.replace("-", "/"));
            if (stdt > etdt) {
                jQuery.postFail('', "开始时间必须小于结束时间");
                return;
            }

            $.ajax({
                data: {
                    signleid: _that.NewSignleID,
                    title: _that.Signle_PPT_Title,
                    banner: bannerUrl,
                    type: 0,
                    anchorid: _that.data_list[_that.anchorcollegeindex].anchorid,
                    comment: _that.Signle_PPT_Comment,
                    fee: _that.Signle_PPT_Fee,
                    begintime: _that.Signle_PPT_DateTime,
                    autoendtime: _that.Signle_PPT_AutoEndtime,
                    ppt: _that.upallimgarr
                },
                url: '/butlerp/business/addormodsignle',
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
                        jQuery.postOk("", "保存成功");
                        _that.tabclasstype('allanchorssignclass');
                    } else {
                        jQuery.postFail("", json.info);
                    }
                }
            });
        },
        AddSignleVideo: function (type) {
            var _that = this;
            if (_that.Signle_Video_Banner == "") {
                jQuery.postFail("", "Banner图片不能为空");
                return;
            }
            if ($.trim(_that.Signle_Video_Title) == "") {
                jQuery.postFail("", "Title不能为空");
                return;
            }
            if (_that.Signle_Video_Url == "" && type != 2) {
                jQuery.postFail("", "视频未指定");
                return;
            }
            if (_that.Signle_Video_DateTime == "") {
                jQuery.postFail("", "开始时间未指定");
                return;
            }
            if (_that.Signle_Video_AutoEndTime == "") {
                jQuery.postFail("", "课程结束时间未指定");
                return;
            }
            var stdt = new Date(_that.Signle_Video_DateTime.replace("-", "/"));
            var etdt = new Date(_that.Signle_Video_AutoEndTime.replace("-", "/"));
            if (stdt > etdt) {
                jQuery.postFail('', "开始时间必须小于结束时间");
                return;
            }
            var param = {
                signleid: _that.NewSignleID,
                title: _that.Signle_Video_Title,
                banner: _that.Signle_Video_Banner,
                anchorid: _that.data_list[_that.anchorcollegeindex].anchorid,
                comment: _that.Signle_Video_Comment,
                fee: _that.Signle_Video_Fee,
                begintime: _that.Signle_Video_DateTime,
                autoendtime: _that.Signle_Video_AutoEndTime
            }
            param.type = type
            param.ppt = [{
                url: _that.Signle_Video_Url
            }]

            $.ajax({
                data: param,
                url: '/butlerp/business/addormodsignle',
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
                        jQuery.postOk("", "保存成功");
                        _that.tabclasstype('allanchorssignclass');
                    } else {
                        jQuery.postFail("", json.info);
                    }
                }
            });
        },

        //--------------------上传视频文件----------------
        upvideo1: function () {
            var _that = this;
            upvideopop = jQuery.yayigjupvideo({
                UrlParam: '', title: '视频上传', _titleAlign: "center", callbackfunc: function (params) {
                    if (params.code == '1') {
                        _that.Signle_Video_Url = params.info.url;
                        console.log(params.info)
                    }
                    console.log('上传成功')
                }
            });
        },
        //-------------------------------------
        //上传图片 start
        upimg: function () {
            this.getid('pic_upload_div').style.display = 'block'
        },
        getPic: function (obj, otherparm) {
            obj = obj.target;
            if (otherparm === undefined) {
                picupObj.operat_img(obj.files[0]);
            } else {
                picupObj.operat_img(obj.files[0], otherparm);
            }
        },
        //-------------------------------------
        savePicToWeb: function () {
            var _that = this;
            var imgData = picupObj.getCanvasData();
            $.post('/admin/uploadimage', {
                'picdata': imgData,
                "ext": picupObj.getPicType()
            }, function (data) {
                _that.anchorinfo.picture = data.list.url;
            });
        },
        //上传图片 end
        //-------------------------------------
        getid: function (id) {
            return document.getElementById(id)
        },
        //图片裁剪
        chooseImgByCropyer(inputId, stateId, callback) {
            var _this = this;
            $(inputId).localUploadYaYigj({
                imgPathID: inputId, //上传成功后返回路径放到哪个控件
                imgPathPIC: inputId, //上传成功后预览图片控件
                scaleRatio: 16.0 / 9.0,
                isCrop: true,//是否支持裁剪
                uploadPath: '',
                /*data:{
                fileName:trueFileName,
                picdata:imagedata,
                type:Extname
                }*/
                uploadCallBack: function (data) {
                    //裁剪后完整的base64
                    var imgBase64 = $(inputId).attr("src");
                    var imgFile = base64ToBlob(imgBase64);
                    var maxsize = 2 * 1000 * 1024;//4M 
                    var filesize = imgFile.size;

                    if (filesize == -1) {
                        jQuery.postFail("", "浏览器不支持大小检测,请确保图片Size < 500KB");
                    } else if (filesize > maxsize) {
                        jQuery.postFail("", "图片大小超过500KB");
                        $(stateId).html('');
                        callback(false);
                        return;
                    }
                    _this.pictureExt = imgFile.type;
                    if (_this.pictureExt != "image/jpg"
                        && _this.pictureExt != "image/jpeg"
                        && _this.pictureExt != "image/png") {
                        $("#signlestatus_1").html('图片类型错误:' + _this.pictureExt);
                        callback(false);
                        return;
                    }
                    callback(true);
                }
            }, function () {

            });

        },
        uploadImgByDoms(inputid, stateElementid, callback) {
            var _this = this;
            var x = new FormData();
            var imgBase64 = $(inputid).attr("src");
            x.append("file", base64ToBlob(imgBase64));
            x.append('filetype', _this.pictureExt.slice(6));
            var percentage = 0;
            var time = new Date().getTime();
            $(stateElementid).html('正在上传...');
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
                                $(stateElementid).html('上传进度:' + percentage + '%');
                                if (percentage >= 99) {
                                    $(stateElementid).html('服务端正在解析，请稍后...');
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
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (data) {
                    jQuery.loading_close();
                },
                success: function (json) {
                    callback(json);
                    console.log(json);
                    if (json.code == 0) {
                        jQuery.postFail("fadeInUp", json.info);
                    } else {
                        var tmp = json.list;
                        if (!tmp) {
                            $(stateElementid).html('上传失败');
                        } else {
                            $(stateElementid).html('上传成功');
                        }
                    }
                },
                error: function (json) {
                    $(stateElementid).html('上传失败');
                    callback(json);
                }
            });

        }
    },
    created: function () {
        this.getallanchors();
        $.ajaxSetup({
            error: function (json) {
                // var html = json.responseText;
                // if (html.match("登录")) {
                //     window.location.href = "/butlerp";
                // }
            },
            beforeSend: function () {
                jQuery.loading('加载中', 1);
            },
            complete: function () {
                jQuery.loading_close();
            }
        });
    },
    desctroyed: function () {
        alert(111)
    },
    mounted: function () {
        var _this = this;
        //单课程
        /*	
        imgData:
        {
        fileName:trueFileName,
		picdata:imagedata,
        type:Extname
        }
        */
        //单课程封面(PPT)
        _this.chooseImgByCropyer("#signlefile_1", "signlestatus_1", (success) => {
            var _this = this;
            if (success) {
                //上传云端
                _this.signleUploadBanner();
            }
        });
        //单课程封面(视频)
        _this.chooseImgByCropyer("#signlefile_2", "signlestatus_2", (success) => {
            var _this = this;
            if (success) {
                //上传云端
                _this.videoUploadBanner();
            }
        });
        //单课程直播封面(视频)
        _this.chooseImgByCropyer("#signlefile_3", "signlestatus_3", (success) => {
            var _this = this;
            if (success) {
                //上传云端
                _this.onlineVideoUploadBanner();
            }
        });
        //系列课封面
        _this.chooseImgByCropyer("#seriesfileid", "seriesprogressid", (success) => {
            var _this = this;
            if (success) {
                //上传云端
                _this.uploadbanner();
            }
        });
        // window.addEventListener('beforeunload', e => {
        //     localStorage.removeItem('historyPage');
        // });
     
        _this.requestCurseType(() => {
            var historyPage = JSON.parse(localStorage.getItem('historyPage'));
            if (historyPage) {
                _this.getallanchors(() => {
                    // var anchorid = localStorage.getItem('op_anchorid');
                    //  _this.data_list[_this.anchorcollegeindex].anchorid;
                    // localStorage.setItem('op_anchorid', anchorid);
                    _this.tabclasstype(historyPage.id, historyPage.index);
                });
                _this.tabclasstype(historyPage.id, historyPage.index);
            }
        })
     


    }
};


function get_signature(obj) {
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000;
    console.log('get_signature ...');
    console.log('expire:' + expire.toString());
    console.log('now:', + now.toString())
    if (expire < now + 3) {
        console.log(obj)
        host = obj['host']
        policyBase64 = obj['policy']
        accessid = obj['accessid']
        signature = obj['signature']
        expire = parseInt(obj['expire'])
        key = obj['dir']
        cloudname = obj['cloudname']
        return true;
    }
    return false;
};

function set_upload_param(up, obj) {

    var ret = get_signature(obj)
    if (ret == true) {
        new_multipart_params = {
            'key': key + obj.cloudname,
            'policy': policyBase64,
            'OSSAccessKeyId': accessid,
            'success_action_status': '200', //让服务端返回200,不然，默认会返回204
            'signature': signature,
        };
        up.setOption({
            'url': host,
            'multipart_params': new_multipart_params
        });

        console.log('reset uploader')
        //uploader.start();
    }
}





//图片限制比例 16:9
function validateImgSize(elementid, callback) {
    var docObj = document.getElementById(elementid);
    var files = document.getElementById(elementid).value;

    if (docObj.files && docObj.files[0]) {
        var img = new Image;
        img.onload = function () {
            var width = img.width;
            var height = img.height;
            var filesize = img
            if (width * 9 != height * 16) {
                alert('宽:' + width + ' 高:' + height + " ,该图片尺寸不符合 16:9 ，请重新上传....");
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

//imgData 转file对象
function base64ToBlob(urlData) {
    var arr = urlData.split(',');
    var mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
    // 去掉url的头，并转化为byte
    var bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    var ia = new Uint8Array(ab);

    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], {
        type: mime
    });
}


