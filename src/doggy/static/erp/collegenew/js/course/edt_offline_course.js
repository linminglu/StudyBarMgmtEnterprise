var offlinedetail_pcom = {
    delimiters: ['<{', '}>'],
    template: "#edt_offlinecourse_id",
    data: function () {
        var _that = this;
        return {
            type: 0,
            alterdata: '',
            operatedIndex: 0,  // 0 PPT 图片组 1 课程简介图片组
            signleid: '',
            condition: "",
            allindex: -1,
            introActiveIndex: -1,
            page_title: '',
            anchorid: "",
            title: '',
            banner: '',  //
            banner1: '',  // 讲师头像
            pptimgarr: [],
            detail: [],  //课程简介
            video: '',
            comment: '',
            fee: '',
            duration: 0,
            orifee: 0,
            tag: 0,
            begintime: '',
            autoendtime: '',
            bannerNotice: '',
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
                            mobile: _that.addManagerInfo.mobile
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
                                _that.addManagerRequest()
                            } else {
                                _that.resetAddAccountData();
                                jQuery.showError(json.info, '提示');
                            }
                        },
                        error: function (json) {
                            jQuery.showError(json.info, '提示');
                            _that.resetAddAccountData();

                        }
                    });

                },
                onCancel: function (param) {
                    _that.resetAddAccountData()
                    console.log('param canBtn=', param)
                }
            },
            typeList: [],
            isNoneAddress: false,
            province: "",  //省
            city: '',      //市
            district: "",  //区
            address: "",   //详细地址
            maxenroll: "",     //最大报名人数,空为不限制
            teachername: "",   //讲师姓名
            enrollendtime: "", //报名截止时间
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
            }
        }
    },
    components: {
        'selectCitys': selectCitysCom,
        'addedtModal': vueModal_com,
        'yayigjDownlist': yayigjDownListCom,
        'yayigjDatesel': vyayigjDateSelcom,
    },
    computed: {
        userData() {
            return getUserData()
        }
    },
    filters: {

    },
    watch: {
        // fee(newVal,oldVal){
        //      var reg = new RegExp('^([0-9]{1}\d*(\.|(\.\d{1,2}))?)?$')
        //     if(reg&&!reg.test(newVal)){
        //         this.$nextTick(()=>{
        //             this.fee = oldVal
        //         })
        //     }
        // }
        province(newVal, oldVal) {
            if (newVal && newVal.length > 0) {
                this.isNoneAddress = false;
            }
        },
        city(newVal, oldVal) {
            if (newVal && newVal.length > 0) {
                this.isNoneAddress = false;
            }
        },
        district(newVal, oldVal) {
            if (newVal && newVal.length > 0) {
                this.isNoneAddress = false;
            }
        },
        address(newVal, oldVal) {
            if (newVal && newVal.length > 0) {
                this.isNoneAddress = false;
            }
        },
    },
    methods: {
        changeProvince(value) {
            this.province = value;
        },
        changeCity(value) {
            this.city = value;
        },
        changeArea(value) {
            this.district = value;
        },
        restAddress() {
            var isSelect = this.isNoneAddress;
            if (isSelect) {
                this.province = "";
                this.city = "";
                this.district = "";
                this.address = "";
            }
        },
        handleInput2(e) {
            // 通过正则过滤小数点后两位
            e.target.value = e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]
        },
        refreshDetailData() {

        },
        changeimgindex(index, type) {
            var _that = this
            if (type == 1) {
                _that.introActiveIndex = index;
            } else {
                _that.allindex = index;
            }

        }, movePic(index) {
            var _that = this
            //左移
            if (index == 1) {
                if (_that.allindex == '-1') {
                    jQuery.postFail("fadeInUp", '请选择一项进行移动')
                    return false
                }
                if (_that.allindex == '0') {
                    jQuery.postFail("fadeInUp", '已经到第一项');
                } else {
                    _that.swapItems(_that.pptimgarr, _that.allindex, _that.allindex - 1)
                    _that.allindex -= 1
                }
            } else if (index == 2) {
                var lent = _that.pptimgarr.length
                if (_that.allindex == '-1') {
                    jQuery.postFail("fadeInUp", '请选择一项进行移动')
                    return false
                }
                if (_that.allindex == lent - 1) {
                    jQuery.postFail("fadeInUp", '已经是最后一项了');
                } else {
                    _that.swapItems(_that.pptimgarr, _that.allindex, _that.allindex + 1)
                    _that.allindex += 1
                }

            }
        },
        swapItems(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
        },
        removePic() {
            var _that = this
            if (_that.allindex == '-1') {
                jQuery.postFail("fadeInUp", '请选择一项进行操作')
                return false
            }
            _that.pptimgarr.splice(_that.allindex, 1);

            if (_that.pptimgarr.length == _that.allindex) {
                _that.allindex -= 1;
            }
        },
        getupimgclass: function (index, type) {
            var _that = this;
            if (type == 1) {
                if (_that.introActiveIndex == index) {
                    return 'active';
                } else {
                    return '';
                }
            } else {
                if (_that.allindex == index) {
                    return 'active';
                } else {
                    return '';
                }
            }
        },
        chooseImg: function () {
            var _that = this;
            _that.operatedIndex = 0;
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
                    document.getElementById("pptid_status").innerHTML += '<span id=pptstatus_' + i + ' style="margin-left:5px;'
                        + 'color: #ff2929;font-size: 13px;'
                        + 'letter-spacing: 1px;'
                        + 'padding: 3px;">上传第' + picNum + '张图片</span><br />';
                    var maxsize = 2000 * 1024;//2M 
                    var filesize = f.size;
                    if (filesize == -1) {
                        $("#pptstatus_" + i).text("浏览器不支持大小检测,请确保第" + picNum + "张图片大小 < 2M");
                    } else if (filesize > maxsize) {
                        $("#pptstatus_" + i).text("第" + picNum + "张图片大小超过2M");
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
                                    $("#pptstatus_" + index).text('第' + picNum + '张服务端正在解析，请稍后...');
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
                        jQuery.postFail("fadeInUp", json.info);
                    } else {
                        var tmp = json.list;
                        if (!tmp) {
                            $("#pptstatus_" + index).text('第' + picNum + '张上传失败');
                            $("#pptstatus_" + index).css('color', '#ff2929');
                        } else {
                            // _that.bannerPic = json.list.url;
                            // document.getElementById("signleimg_1").src = json.list.url;
                            var obj = {
                                url: json.list.url,
                                name: name
                            }
                            _that.pptimgarr.push(obj);
                            _that.pptimgarr.sort(SortLikeWin);
                            // var index1 = _that.pptimgarr.indexOf(obj)+1;
                            $("#pptstatus_" + index).text('第' + picNum + '张上传成功');
                            $("#pptstatus_" + index).css('color', '#0a9939');
                        }
                    }
                    //上传完清空
                    if (index == files.length - 1) {
                        $("#ppt_1")[0].value = ''
                    }
                },
                error: function (json) {
                    // var index1 = _that.pptimgarr.indexOf(obj)+1;
                    $("#pptstatus_" + index).text('第' + picNum + '张上传失败');
                    //上传完清空
                    if (index == files.length - 1) {
                        $("#ppt_1")[0].value = ''
                    }
                }
            });
        },
        chooseHeadicon() {
            var _that = this;
            uploadPicByDom('#signlefile_2', 1.0 / 1.0, function (percent) {
                console.log(percent)
            }, function (json) {
                if (json) {
                    var imgUrl = json.list.url;
                    if (imgUrl != null || imgUrl != undefined) {
                        _that.banner1 = imgUrl;
                    } else {
                        _that.banner1 = '';
                    }
                }
            })
        },
        chooseBanner() {
            var _that = this
            uploadPicByDom('#signlefile_1', 16.0 / 9.0, function (percent) {
                console.log(percent)
            }, function (json) {
                if (json) {
                    var imgUrl = json.list.url;
                    if (imgUrl != null || imgUrl != undefined) {
                        _that.banner = imgUrl;
                    } else {
                        _that.banner = '';
                    }
                }
            })
        },
        goBack() {
            this.$router.go(-1)
        },
        //图片裁剪
        chooseImgByCropyer(inputId, callback) {
            var _this = this;
            $(inputId).localUploadYaYigj({
                imgPathID: inputId, //上传成功后返回路径放到哪个控件
                imgPathPIC: inputId, //上传成功后预览图片控件
                scaleRatio: 16.0 / 9.0,
                isCrop: true,//是否支持裁剪
                uploadPath: '',
                uploadCallBack: function (data) {
                    _this.bannerNotice = ''
                    //裁剪后完整的base64
                    var imgBase64 = $(inputId).attr("src");
                    var imgFile = base64ToBlob(imgBase64);
                    var maxsize = 2 * 1000 * 1024;//2M 
                    var filesize = imgFile.size;

                    if (filesize == -1) {
                        jQuery.postFail("", "浏览器不支持大小检测,请确保图片Size < 2M");
                    } else if (filesize > maxsize) {
                        jQuery.postFail("", "图片大小超过2M");
                        callback(false);
                        return;
                    }
                    var pictureExt = imgFile.type;
                    if (pictureExt != "image/jpg"
                        && pictureExt != "image/jpeg"
                        && pictureExt != "image/png") {
                        bannerNotice = '图片类型错误:' + pictureExt
                        callback(false);
                        return;
                    }
                    callback(true);
                }
            }, function () {

            });

        },
        uploadImgByDoms(inputid, callback) {
            var _this = this;
            var x = new FormData();
            var imgBase64 = $(inputid).attr("src");
            var imgFile = base64ToBlob(imgBase64);
            x.append("file", base64ToBlob(imgBase64));
            x.append('filetype', imgFile.type.slice(6));
            var percentage = 0;
            var time = new Date().getTime();
            _this.bannerNotice = '正在上传...'
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
                                _this.bannerNotice = '上传进度:' + percentage + '%'

                                if (percentage >= 99) {
                                    _this.bannerNotice = '服务端正在解析，请稍后...'

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
                    callback(json);

                    if (json.code == 0) {
                        jQuery.postFail("fadeInUp", json.info);
                    } else {
                        var tmp = json.list;
                        if (!tmp) {
                            _this.bannerNotice = '上传失败'
                        } else {
                            _this.bannerNotice = '上传成功'
                        }
                    }
                },
                error: function (json) {
                    _this.bannerNotice = '上传失败'
                    callback(json);
                }
            });

        },
        videoUploadBanner: function () {
            var _this = this;
            _this.uploadImgByDoms("#signlefile_1", (json) => {
                var imgUrl = json.list.url;
                if (imgUrl != null || imgUrl != undefined) {
                    _this.banner = imgUrl;
                } else {
                    _this.banner = '';
                }
            });
        },
        saveData() {
            var _that = this;
            if ($.trim(_that.title) == "") {
                jQuery.postFail("", "课程名称不能为空");
                return;
            }
            if (_that.banner == "") {
                jQuery.postFail("", "课程封面不能为空");
                return;
            }

            var stdt = new Date(_that.begintime.replace("-", "/"));
            var etdt = new Date(_that.autoendtime.replace("-", "/"));
            var enrolltdt = new Date(_that.enrollendtime.replace("-", "/"));
            if (stdt > etdt) {
                jQuery.postFail('', "开始时间必须小于结束时间");
                return;
            }
            //coursetype,duration,enrollendtime,province,city,district,address,maxenroll,teachername
            var param = {
                signleid: _that.signleid,
                type: _that.type,
                title: _that.title,
                banner: _that.banner,
                banner1: _that.banner1,
                anchorid: _that.anchorid,
                comment: _that.comment,
                fee: _that.fee,
                orifee: _that.orifee,
                detail: _that.detail.length > 0 ? _that.detail : '',
                begintime: _that.begintime,
                autoendtime: _that.autoendtime,
                tagid: _that.coursetype.tag,
                alterdata: _that.alterdata,
                applystatus: _that.applystatus,
                ismanageredite: 1,
                lessontype: "1",
                duration: _that.duration,
                enrollendtime: _that.enrollendtime,
                province: _that.province,
                city: _that.city,
                district: _that.district,
                address: _that.address,
                maxenroll: _that.maxenroll,
                teachername: _that.teachername,
                videoid:"",
                istovod:"0"
            }

            if (_that.type == 0) {
                param.ppt = _that.pptimgarr
            } else if (_that.type == 1) {
                param.ppt = [{
                    url: _that.video
                }]
            }

            $.ajax({
                data: param,
                url: '/butlerp/business/addormodsignle',
                dataType: 'json',
                type: 'post',

                success: function (json) {
                    if (json.code == 1) {
                        jQuery.postOk("", "保存成功");
                        _that.goBack()
                    } else {
                        jQuery.postFail("", json.info);
                    }
                }
            });
        },
        //获取单课程详情
        getSingleDetail() {
            var _that = this;
            if (!_that.signleid) {
                return
            }
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
                        var course = tmp[0];
                        _that.title = course.title;
                        _that.alterdata = course.alterdata;
                        _that.applystatus = course.applystatus
                        _that.comment = course.comment;
                        _that.fee = course.fee;
                        _that.duration = course.duration;
                        _that.begintime = course.begintime;
                        _that.autoendtime = course.autoendtime;
                        _that.banner = course.banner;
                        _that.banner1 = course.banner1;
                        _that.tag = course.tagid;
                        _that.signleid = course.signleid;

                        _that.province = course.province;
                        _that.city = course.city;
                        _that.district = course.district;
                        _that.address = course.address;
                        _that.maxenroll = course.maxenroll;
                        _that.teachername = course.teachername;
                        _that.enrollendtime = course.enrollendtime;

                        if (_that.district == "" || _that.district == undefined) {
                            _that.isNoneAddress = true
                        }
                        var type = course.type;
                        var ppt = course.ppt;
                        var detail = course.detail;
                        if (detail && detail instanceof Array) {
                            _that.detail = detail;
                        }

                        var tagitem = _that.getTarget(course.tagid);
                        if (tagitem) {
                            _that.coursetype.showtype = tagitem.key;
                            _that.coursetype.tag = tagitem.val;
                        }

                        if (type == 0) {//幻灯片
                            if (ppt instanceof Array) {
                                _that.pptimgarr = ppt;
                            }
                        } else if (type == 1) {//视频                            
                            if (ppt instanceof Array) {
                                _that.video = ppt[0].url;
                            }
                        } else if (type == 2) {//直播视频
                        }
                    } else {
                        jQuery.postFail('', json.info);
                    }
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
        //--------------------上传视频文件----------------
        upvideo() {
            var _that = this;
            upvideopop = jQuery.yayigjupvideo({
                UrlParam: '', title: '视频上传', _titleAlign: "center", callbackfunc: function (params) {
                    if (params.code == '1') {
                        _that.video = params.info.url;
                        console.log(params.info)
                    }
                    console.log('上传成功')
                }
            });
        },
        DeleteVideo() {
            this.video = "";
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
                                _that.coursetype.valueList.push({ key: item.tagname, val: item.tagid })
                            }
                        }

                    }
                    if (callback) { callback() }
                }
            });
        },
        chooseCoursetype(item) {
            this.coursetype.tag = item.val;
        },
        chooseIntroImg() {
            var _that = this;
            _that.operatedIndex = 1;
            var files = document.getElementById("intro_img").files;
            var files_length = files.length
            if (files_length > 0) {
                document.getElementById("introid_status").innerHTML = "";
            }
            var curCount = _that.detail.length;
            var maxindex = files_length + curCount > 6 ? 6 - curCount : files_length;
            for (var i = 0; i < maxindex; i++) {
                var f = files[i];//获取文件
                if (f === undefined) {//未选择图片
                } else {
                    var picNum = i + 1;
                    document.getElementById("introid_status").innerHTML += '<span id=introstatus_' + i + ' style="margin-left:5px;'
                        + 'color: #ff2929;font-size: 13px;'
                        + 'letter-spacing: 1px;'
                        + 'padding: 3px;">上传第' + picNum + '张图片</span><br />';
                    var maxsize = 5000 * 1024;//5M 
                    var filesize = f.size;
                    if (filesize == -1) {
                        $("#introstatus_" + i).text("浏览器不支持大小检测,请确保第" + picNum + "张图片大小 < 2M");
                    } else if (filesize > maxsize) {
                        $("#introstatus_" + i).text("第" + picNum + "张图片大小超过2M");
                        continue;
                    }
                    _that.pictureExt = f.type;
                    if (_that.pictureExt != "image/jpg"
                        && _that.pictureExt != "image/jpeg"
                        && _that.pictureExt != "image/png") {
                        $("#pptstatus_" + i).text('第' + picNum + '张图片类型错误:' + _that.pictureExt);
                        continue;
                    }
                    _that.introUpload(i, f.name);
                }
            }

        },
        introUpload: function (index, name) {
            var _that = this;
            var x = new FormData();
            var picNum = index + 1;
            var files = $("#intro_img")[0].files
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
                                $("#introstatus_" + index).text('第' + picNum + '张上传进度:' + percentage + '%');
                                if (percentage >= 99) {
                                    $("#introstatus_" + index).text('第' + picNum + '张服务端正在解析，请稍后...');
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
                        jQuery.postFail("fadeInUp", json.info);
                    } else {
                        var tmp = json.list;
                        if (!tmp) {
                            $("#introstatus_" + index).text('第' + picNum + '张上传失败');
                            $("#introstatus_" + index).css('color', '#ff2929');
                        } else {

                            var obj = {
                                url: json.list.url,
                                name: name,
                                displayorder: _that.detail.length + 1
                            }
                            _that.detail.push(obj);

                            // var index1 = _that.pptimgarr.indexOf(obj)+1;
                            $("#introstatus_" + index).text('第' + picNum + '张上传成功');
                            $("#introstatus_" + index).css('color', '#0a9939');
                        }
                    }
                    //上传完清空
                    if (index == files.length - 1) {
                        $("#intro_img")[0].value = ''
                    }
                },
                error: function (json) {
                    // var index1 = _that.pptimgarr.indexOf(obj)+1;
                    $("#introstatus_" + index).text('第' + picNum + '张上传失败');
                    //上传完清空
                    if (index == files.length - 1) {
                        $("#intro_img")[0].value = ''
                    }
                }
            });
        },
        moveIntroPic(index) {
            var _that = this;
            var arr = this.detail;
            var activeIndex = _that.introActiveIndex;
            var beforeIndex = _that.introActiveIndex - 1;
            var nextIndex = _that.introActiveIndex + 1;
            if (activeIndex == -1) {
                jQuery.postFail("fadeInUp", '请选择一项进行移动')
                return false
            }
            //左移
            if (index == 0) {
                if (activeIndex == 0) {
                    jQuery.postFail("fadeInUp", '已经到第一项');
                } else {
                    var item1 = arr[beforeIndex];
                    var item2 = arr[activeIndex];
                    var tmp = item1.displayorder
                    item1.displayorder = item2.displayorder;
                    item2.displayorder = tmp;
                    Vue.set(_that.detail, activeIndex, item1);
                    Vue.set(_that.detail, beforeIndex, item2);
                    _that.introActiveIndex = beforeIndex;
                    _that.resetDisplayorder();
                }
            } else {
                if (activeIndex == arr.length - 1) {
                    jQuery.postFail("fadeInUp", '已经到最后一项');
                } else {
                    var item1 = arr[nextIndex];
                    var item2 = arr[activeIndex];
                    var tmp = item1.displayorder
                    item1.displayorder = item2.displayorder;
                    item2.displayorder = tmp;
                    Vue.set(_that.detail, activeIndex, item1);
                    Vue.set(_that.detail, nextIndex, item2);
                    _that.introActiveIndex = nextIndex;
                    _that.resetDisplayorder();
                }
            }

        },
        //重新计算顺序
        resetDisplayorder() {
            for (let i = 0; i < this.detail.length; i++) {
                var item = this.detail[i];
                item.displayorder = i + 1;
            }
        },
        removeIntroPic() {
            var _that = this
            if (_that.introActiveIndex == '-1') {
                jQuery.postFail("fadeInUp", '请选择一项进行操作')
                return false
            }
            _that.detail.splice(_that.introActiveIndex, 1);

            if (_that.detail.length == _that.introActiveIndex) {
                _that.introActiveIndex -= 1;
            }
            _that.resetDisplayorder();
        }
    },
    mounted() {
        var _that = this;
        var data = _that.$route.query
        var signleid = data.signleid
        var type = data.type
        var anchorid = data.anchorid

        if (signleid) {
            _that.signleid = signleid
            _that.requestCurseType(() => {
                _that.getSingleDetail()
            })
        }
        if (anchorid) {
            _that.anchorid = anchorid
        }
        if (type) {
            _that.type = type
        }
        //input 挂载切图功能
        _that.chooseHeadicon();
        _that.chooseBanner();
        //请求课程分类
        _that.requestCurseType();
    }
};