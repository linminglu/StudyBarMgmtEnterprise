var approval_detail_pcom = {
    delimiters: ['<{', '}>'],
    template: "#approval_detail_id",
    data: function () {
        var _that = this;
        return {
            currentIndex:0, // 0 单课 1 系列课
            type: 0,
            course:{},
            alterobject:{},
            alterdata:'',
            operatedIndex: 0,  // 0 PPT 图片组 1 课程简介图片组
            signleid: '',
            seriesid: '',
            condition: "",
            allindex: -1,
            introActiveIndex: -1,
            page_title: '',
            anchorid: "",
            title: '',
            discount:'',
            banner: '',  //
            banner1: '',  // 讲师头像
            pptimgarr: [],
            detail: [],  //课程简介
            video: '',
            comment: '',
            fee: '',
            totalfee:'',
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
            coursetype: {
                showtype: '其他',
                tag: '0',
                attribute: {
                    width: '80px',
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
    },
    methods: {
        handleInput2(e) {
            // 通过正则过滤小数点后两位
            e.target.value = e.target.value.match(/^\d*(\.?\d{0,1})/g)[0]
        },
        swapItems(arr, index1, index2) {
            arr[index1] = arr.splice(index2, 1, arr[index1])[0];
            return arr;
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
        goBack() {
            this.$router.go(-1)
        },
        saveData() {
            var _that = this
            var item = _that.course
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
                complete: function(){jQuery.loading_close(-1);},
                success: function (json) {
                    if (json.code == 1) {
                        jQuery.postOk("", "提交成功");
                        _that.goBack()
                    } else {
                        jQuery.postFail("", json.info);
                    }
                }
            });
        },
        refuseAction() {
            var _that = this;
            var item = _that.course
            // this.activeItem = this.data_list[index]
            // this.askrefuse_modal.isActive = true
         
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
                        jQuery.postOk("", "提交成功");
                        _that.goBack()
                    }else{
                        setTimeout(() => {
                            _that.showError('提示',json.info)
                        }, 200); 
                    }
                }
            });


        },
        //系列课详情
        getSeriesDetail() {
            var _that = this;
            if (!_that.seriesid) {
                return
            }
            $.ajax({
                url: '/butlerp/business/seriesinfo',
                data: {
                    seriesid: _that.seriesid
                },
                dataType: 'json',
                type: 'post',
                success: function (json) {
                    if (json.code == 1) {
                        var tmp = json.list;
                        if (!tmp) tmp = [];
                        if (tmp.length == 0) {
                            jQuery.postFail("", "获取系列课程信息失败");
                            return;
                        }
                        var course = tmp[0];
                        _that.course = course;
                        if (course.alterdata&&course.alterdata.length>0){
                            _that.alterobject = JSON.parse(course.alterdata);
                        }
                        _that.title = course.title;
                        _that.applystatus=course.applystatus
                        _that.alterdata = course.alterdata;
                        _that.comment = course.comment;
                        _that.fee = course.fee;
                        _that.totalfee = course.totalfee;
                        _that.banner = course.banner;
                        _that.banner1 = course.banner1;
                        _that.seriesid = course.seriesid;
                        _that.discount = course.discount;
                        _that.detail = course.detail ? course.detail : [];
                    } else {
                        jQuery.postFail('', json.info);
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
                        _that.course = course;
                       
                        if (course.alterdata&&course.alterdata.length>0){
                            _that.alterobject = JSON.parse(course.alterdata);
                        }
                        _that.title = course.title;
                        _that.alterdata=course.alterdata;
                        _that.applystatus=course.applystatus
                        _that.comment = course.comment;
                        _that.fee = course.fee;
                        _that.begintime = course.begintime;
                        _that.autoendtime = course.autoendtime;
                        _that.banner = course.banner;
                        _that.banner1 = course.banner1;
                        _that.tag = course.tagid;
                        _that.signleid = course.signleid;
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

                        var tagitem = _that.getTarget(_that.alterobject.tag);
                        if (tagitem) {
                            _that.alterobject.showtype = tagitem.key;
                            _that.alterobject.tag = tagitem.val;
                        }

                        if (type == 0) {//幻灯片
                            if (_that.alterobject.ppt instanceof Array) {
                                _that.alterobject.pptimgarr = _that.alterobject.ppt;
                            }
                            if (ppt instanceof Array) {
                                _that.pptimgarr = ppt;
                            }
                        } else if (type == 1) {//视频                            
                            if (_that.alterobject.ppt instanceof Array) {
                                _that.alterobject.video = _that.alterobject.ppt[0].url;
                            }
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
        }
    },
    mounted() {
        var _that = this;
        var data = _that.$route.query
        var signleid = data.signleid
        var seriesid = data.seriesid
        var type = data.type
        var anchorid = data.anchorid
        _that.currentIndex = signleid&&signleid.length > 0 ? 0:1;
        if (signleid) {
            _that.signleid = signleid
            _that.requestCurseType(() => {
                _that.getSingleDetail()
            })
            if (type) {
                _that.type = type
            }
          
        }else{
            _that.seriesid = seriesid
            _that.getSeriesDetail()
        }
    }
};