jQuery.createAniCss();
//------------------------
// 上传点播视频组件
//------------------------
var uploadvodvideo_pcom = {
    delimiters: ['<{', '}>'],
    template: "#uploadvodvideo_id",
    props: {
        title: {
            type: String,
            default: function () {
                return ''
            }
        },
        videoid: {
            type: String,
            default: function () {
                return ''
            }
        }
    },
    data: function () {
        var _that = this;
        return {
            filename:"",
            uploadVideoid: "",
            playurl: "",
            timeout: '',
            partSize: '',
            parallel: '',
            retryCount: '',
            retryDuration: '',
            region: 'cn-shanghai',
            userId: '1303984639806000',
            file: null,
            authProgress: 0,
            uploadDisabled: true,
            resumeDisabled: true,
            pauseDisabled: true,
            isfinished: false,
            uploader: null,
            statusText: ''
        }
    },
    components: {

    },
    watch:{
        videoid(val){
            // this.uploadVideoid = val;
            // this.requestPlayUrl(val)
        }
    },
    methods: {
        cancelAction() {
            this.$emit("cancel",false);
            this.resetData();
        },
        confirmAction() {
            this.$emit("confirm",this.uploadVideoid);
            this.resetData();
        },
        resetData(){
            this.pauseUpload();
            this.uploader = null;
            this.uploadVideoid = "";
            this.playurl = "";
            this.file = null;
            this.authProgress = 0;
            this.uploadDisabled = true;
            this.resumeDisabled = true;
            this.pauseDisabled = true;
            this.isfinished = false;
            this.authProgress = 0;
            this.statusText="";
            $("#fileUpload")[0].value = "";
        },
        fileChange(e) {
            this.file = e.target.files[0]
            if (!this.file) {
                alert("请先选择需要上传的文件!")
                return
            }
            if (!this.title) {
                alert("请先填写上传的文件名!")
                return
            }
            self.isfinished = false;
            var Title = this.file.name
            var userData = '{"Vod":{}}'
            if (this.uploader) {
                this.uploader.stopUpload()
                this.authProgress = 0
                this.statusText = ""
            }
            this.uploader = this.createUploader()
            console.log(userData)
            this.uploader.addFile(this.file, null, null, null, userData)
            this.uploadDisabled = false
            this.pauseDisabled = true
            this.resumeDisabled = true
        },
        authUpload() {
            // 然后调用 startUpload 方法, 开始上传
            if (this.uploader !== null) {
                this.uploader.startUpload()
                this.uploadDisabled = true
                this.pauseDisabled = false
            }
        },
        // 暂停上传
        pauseUpload() {
            if (this.uploader !== null) {
                this.uploader.stopUpload()
                this.resumeDisabled = false
                this.pauseDisabled = true
            }
        },
        // 恢复上传
        resumeUpload() {
            if (this.uploader !== null) {
                this.uploader.startUpload()
                this.resumeDisabled = true
                this.pauseDisabled = false
            }
        },
        createUploader(type) {
            let self = this
            let uploader = new AliyunUpload.Vod({
                timeout: self.timeout || 60000,
                partSize: self.partSize || 1048576,
                parallel: self.parallel || 5,
                retryCount: self.retryCount || 3,
                retryDuration: self.retryDuration || 2,
                region: self.region,
                userId: self.userId,
                // 添加文件成功
                addFileSuccess: function (uploadInfo) {
                    self.uploadDisabled = false
                    self.resumeDisabled = false
                    self.statusText = '添加文件成功, 等待上传...'
                    console.log("addFileSuccess: " + uploadInfo.file.name)
                },
                // 开始上传
                onUploadstarted: function (uploadInfo) {
                    var param = { "title": self.title, "filename": self.file.name, "filesize": self.file.size };

                    // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
                    // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
                    // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
                    // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
                    // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
                    // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
                    if (!uploadInfo.videoId) {
                        $.post('/butlerp/business/getvideouploadinfo', param, function (res) {
                            var data = res.list;
                            let uploadAuth = data.uploadauth
                            let uploadAddress = data.uploadaddress
                            let videoId = data.videoid
                            self.uploadVideoid = videoId
                            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
                        })
                        self.statusText = '文件开始上传...'
                        console.log("onUploadStarted:" + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object)
                    } else {
                        // 如果videoId有值，根据videoId刷新上传凭证
                        // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
                        $.post('/butlerp/business/refreshvideouploadinfo', {"videoid":uploadInfo.videoId}, function (res) {
                            var data = res.list;
                            let uploadAuth = data.uploadauth
                            let uploadAddress = data.uploadaddress
                            let videoId = data.videoid
                            self.uploadVideoid = videoId
                            uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
                        })
                    }
                },
                // 文件上传成功
                onUploadSucceed: function (uploadInfo) {
                    console.log("onUploadSucceed: " + uploadInfo.file.name + ", endpoint:" + uploadInfo.endpoint + ", bucket:" + uploadInfo.bucket + ", object:" + uploadInfo.object)
                    self.statusText = '文件上传成功!'

                },
                // 文件上传失败
                onUploadFailed: function (uploadInfo, code, message) {
                    console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message)
                    self.statusText = '文件上传失败!'
                },
                // 取消文件上传
                onUploadCanceled: function (uploadInfo, code, message) {
                    console.log("Canceled file: " + uploadInfo.file.name + ", code: " + code + ", message:" + message)
                    self.statusText = '文件已暂停上传'
                },
                // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
                onUploadProgress: function (uploadInfo, totalSize, progress) {
                    console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(progress * 100) + "%")
                    let progressPercent = Math.ceil(progress * 100)
                    self.authProgress = progressPercent
                    self.statusText = '文件上传中...'
                },
                // 上传凭证超时
                onUploadTokenExpired: function (uploadInfo) {
                    // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
                    // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
                    // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
                    $.post('/butlerp/business/refreshvideouploadinfo', param, function (res) {
                        var data = res.list;
                        let uploadAuth = data.uploadauth
                        uploader.resumeUploadWithAuth(uploadAuth)
                        console.log('upload expired and resume upload with uploadauth ' + uploadAuth)
                    })
                    self.statusText = '文件超时...'
                },
                // 全部文件上传结束
                onUploadEnd: function (uploadInfo) {
                    console.log("onUploadEnd: uploaded all the files")
                    self.statusText = '文件上传完毕'
                    self.isfinished = true;
                    setTimeout(() => {
                        self.requestPlayUrl(self.uploadVideoid);
                    }, 3000);
                }
            })
            return uploader
        },
        refreshVideo(){
            this.requestPlayUrl(this.uploadVideoid,true);
        },
        requestPlayUrl(videoid,isToast) {
            var _that = this;
            if(!videoid){
                return
            }
            var param = { "videoid": videoid };
            $.ajax({
                data: param,
                url: '/butlerp/business/getvodplayurllist',
                dataType: 'json',
                type: 'post',
                success: function (json) {
                    if (json.code == 1) {
                        var playList = json.list;
                        if(playList&&playList.length>0){
                            var item = playList[playList.length - 1];
                            _that.playurl = item.playurl;
                        }else{
                            if(isToast){
                                jQuery.waring("视频转码中,请刷新...");
                            }
                        }                      
                    } else {
                        if(isToast){
                            jQuery.waring(json.info);
                        }
                    }
                }
            });
        }
    },
    mounted(){
        this.requestPlayUrl(this.videoid)
    },
    created() {
        
    }
};

