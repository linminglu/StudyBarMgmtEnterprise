var seriesdetail_pcom = {
    delimiters: ['<{', '}>'],
    template: "#edt_seriescourse_id",
    data: function () {
        var _that = this;
        return {
            introActiveIndex: '',
            alterdata:'',
            anchorid: '',
            seriesid: '',
            title: '',
            banner: '',
            banner1: '',
            discount: '',
            comment: '',
            bannerNotice: '',
            fee: 0,
            totalfee: 0,
            detail: []
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
    watch: {
        // discount(newValue,oldValue){
        //     this.fee = this.totalfee *newValue/100;
        // }
        // ,
        // needfee(newValue,oldValue){

        //     this.discount = (this.fee  / newValue )*100;
        // }
    },
    filters: {

    },
    methods: {
        changePrice() {
            var _this = this
            if (!_this.fee || parseFloat(_this.fee) < 0) {
                _this.fee = 0
            }
            if (parseFloat(_this.fee) > parseFloat(_this.totalfee)) {
                _this.fee = _this.totalfee
            }
            _this.$nextTick(() => {
                _this.discount = (parseFloat(_this.fee) / parseFloat(_this.totalfee)) * 100;
            })
        },
        changeRate() {
            if (!this.discount || this.discount < 0) {
                this.discount = 0
            }
            if (parseFloat(this.discount) > 100) {
                this.discount = 100
            }
            this.$nextTick(() => {
                this.fee = parseFloat(this.totalfee) * parseFloat(this.discount) / 100;
            })
        },
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
                        _that.title = course.title;
                        _that.applystatus=course.applystatus
                        _that.alterdata = course.alterdata;
                        _that.comment = course.comment;
                        _that.fee = course.fee;
                        _that.totalfee = course.totalfee;
                        _that.banner = course.banner;
                        _that.banner1 = course.banner1;
                        _that.signleid = course.signleid;
                        _that.discount = course.discount;
                        _that.detail = course.detail ? course.detail : [];
                    } else {
                        jQuery.postFail('', json.info);
                    }
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
            var param = {
                anchorid: _that.anchorid,
                seriesid: _that.seriesid,
                title: _that.title,
                banner: _that.banner,
                banner1: _that.banner1,
                comment: _that.comment,
                discount: _that.discount,
                fee: _that.fee,
                detail: _that.detail.length>0?_that.detail:'',
                applystatus:_that.applystatus,
                alterdata:_that.alterdata,
                ismanageredite:1,
                feetype:'1',
                fixprice:_that.fee
            }
            var url = '/butlerp/business/addseries'
            if (_that.seriesid) {
                url = '/butlerp/business/modseries'
            }
            $.ajax({
                data: param,
                url: url,
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
        goBack() {
            this.$router.go(-1)
        },
        chooseHeadicon() {
            var _that = this;
            uploadPicByDom('#seriesfileid_2', 1.0 / 1.0, function (percent) {
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
            uploadPicByDom('#seriesfileid', 16.0 / 9.0, function (percent) {
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
        getupimgclass(index) {
            if (this.introActiveIndex == index) {
                return 'active';
            } else {
                return '';
            }
        },
        changeimgindex(index) {
            this.introActiveIndex = index;
        },
        chooseIntroImg() {
            var _that = this;
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

            if (this.introActiveIndex == '-1') {
                jQuery.postFail("fadeInUp", '请选择一项进行操作')
                return false
            }
            this.detail.splice(this.introActiveIndex, 1);

            if (this.detail.length == this.introActiveIndex) {
                this.introActiveIndex -= 1;
            }
            this.resetDisplayorder();
        }
    },
    mounted() {
        var _that = this;
        var data = _that.$route.query
        var seriesid = data.seriesid
        var anchorid = data.anchorid
        if (seriesid) {
            _that.seriesid = seriesid
            _that.getSeriesDetail()
        }
        if (anchorid) {
            _that.anchorid = anchorid
        }
        _that.chooseBanner();
        _that.chooseHeadicon();
    }
};