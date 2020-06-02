//-------------------------------------
// 路由处理区 [zlb 2018/1/12]
//-------------------------------------
const Foo = { template: '<div>foo</div>' }
const routes = [
    { path: '/', name: 'index', component: allanchors_pcom },
    { path: '/allanchors', name: 'allanchors', component: allanchors_pcom },
    { path: '/classset', name: 'classset', component: classset_pcom },
    { path: '/code', name: 'code', component: code_pcom },
    { path: '/banner', name: 'banner', component: banner_pcom },
    { path: '/seriescourse', name: 'seriescourse', component: seriescourse_pcom },
    { path: '/singlecourse', name: 'singlecourse', component: singlecourse_pcom },
    { path: '/summary', name: 'summary', component: summary_pcom },
    { path: '/income', name: 'income', component: income_pcom },
    { path: '/expenditure', name: 'expenditure', component: expenditure_pcom },
    { path: '/courselist', name: 'courselist', component: courselist_pcom,meta:{keepAlive:true}},
    { path: '/accountlist', name: 'accountlist', component: accountlist_pcom },
    { path: '/edtsignlecourse', name: 'edtsignlecourse', component: signledetail_pcom },
    { path: '/edtseriescourse', name: 'edtseriescourse', component: seriesdetail_pcom },
    { path: '/operation', name: 'operation', component: operation_pcom },
    { path: '/approvalist', name: 'approvalist', component: approvalist_pcom,meta:{keepAlive:true} },
    { path: '/approvaldetail', name: 'approvaldetail', component: approval_detail_pcom },
    { path: '/boutiquecourse', name: 'boutiquecourse', component: boutiquecourse_pcom },
    { path: '/freecourse', name: 'freecourse', component: freecourse_pcom },
    { path: '/limitdiscount', name: 'limitdiscount', component: limitdiscount_pcom },
    { path: '/superanchor', name: 'superanchor', component: superanchor_pcom },
    { path: '/studybarstatistics', name: 'studybarstatistics', component: studybarstatistics_pcom },
    { path: '/onlineroomstatistic', name: 'onlineroomstatistic', component: onlineroomstatistic_pcom },
    { path: '/consultantsetting', name: 'consultantsetting', component: consultantsetting_pcom },
    { path: '/consultcourselist', name: 'consultcourselist', component: consultcourselist_pcom },
    { path: '/offlinedetail', name: 'offlinedetail', component: offlinedetail_pcom }
]
const router = new VueRouter({
    routes
})



//-------------------------------------
// 代码逻辑处理区[zlb 2018/1/12]
//-------------------------------------
var college_admin_com = new Vue({
    router,
    delimiters: ['<{', '}>'],
    el: "#college_admin",
    data: {
        msg: "hello world!!!",
        ismember: false,
        tabbarArr: [
            {
                'key': 'manager', 'name': '直播间管理', 'path': '', 'icon': '/static/erp/collegenew/img/bar_college_course_manage.png', child: [
                    {
                        'key': 'allanchor',
                        'name': '直播间列表',
                        'path': '/allanchors',
                        'actived': true
                    },
                    {
                        'key': 'courselist',
                        'name': '课程列表',
                        'path': '/courselist',
                        'actived': false
                    },
                    {
                        'key': 'commission',
                        'name': '分佣设置',
                        'path': '/classset',
                        'actived': false
                    },
                    {
                        'key': 'accountManager',
                        'name': '账号管理',
                        'path': '/accountlist',
                        'actived': false
                    },
                    {
                        'key': 'approvalist',
                        'name': '审批管理',
                        'path': '/approvalist',
                        'actived': false
                    },
                    {
                        'key': 'consultantsetting',
                        'name': '客服设置',
                        'path': '/consultantsetting',
                        'actived': false
                    }
                ]
            },
            {
                'key': 'home', 'name': '首页管理', 'path': '', 'icon': '/static/erp/collegenew/img/bar_college_course_play.png', child: [
                    {
                        'name': '首页轮播图',
                        'path': '/banner',
                        'actived': false
                    },
                    {
                        'name': '首页系列课',
                        'path': '/seriescourse',
                        'actived': false
                    },
                    {
                        'name': '首页单次课',
                        'path': '/singlecourse',
                        'actived': false
                    }, {
                        'name': '运营中心',
                        'path': '/operation',
                        'actived': false
                    }
                ]
            },
            {
                'key': 'statistics', 'name': '统计中心', 'path': '', 'icon': '/static/erp/collegenew/img/bar_college_statics.png', child: [
                    {
                        'name': '业绩综述',
                        'path': '/summary',
                        'actived': false
                    },
                    {
                        'name': '主播收入',
                        'path': '/income',
                        'actived': false
                    },
                    {
                        'name': '主播提现',
                        'path': '/expenditure',
                        'actived': false
                    },
                    {
                        'name': '学习吧数据统计',
                        'path': '/studybarstatistics',
                        'actived': false
                    }
                    // ,{
                    //     'name': '直播间数据统计',
                    //     'path': '/onlineroomstatistic',
                    //     'actived': false
                    // }
                ]
            }
        ]
    },
    computed: {
        userData() {
            var storage = window.localStorage;
            var json = storage.getItem("userData");
            var jsonObj = JSON.parse(json);
            if (!jsonObj) {
                jsonObj = {
                    "datastatus": "1",
                    "mobile": "",
                    "name": "admin",
                    "password": "",
                    "picture": "http://47.104.183.133/image/WADO.php?action=LoadImage\u0026FileName=219118531071971328.png",
                    "role": "1",
                    "roledesc": "超级管理员",
                    "userid": ""
                }

            }
            return jsonObj;
        }
    },
    methods: {
        loginOut() {
            $.ajax({
                data: {
                },
                dataType: 'json',
                type: 'post',
                url: '/butlerp/business/loginout',
                success: function (json) {
                    if (json.code == 1) {
                        location.reload();
                    } else {
                        errinfo(json.info)
                        alert(json.info);
                    }
                    localStorage.removeItem('activedPath')
                    localStorage.removeItem('historyPage')
                    localStorage.clear()
                },
                beforeSend: function () {
                    jQuery.loading();
                },
                complete: function (json) {
                    jQuery.loading_close();
                }
            });
        },
        clickItem(item) {
            var _that = this
            for (var i = 0; i < _that.tabbarArr.length; i++) {
                var tabar = _that.tabbarArr[i]
                for (var j = 0; j < tabar.child.length; j++) {
                    var item1 = tabar.child[j]
                    if (item.path == item1.path) {
                        Vue.set(item1, 'actived', true)
                    } else {
                        Vue.set(item1, 'actived', false)
                    }
                }
            }
            localStorage.setItem('activedPath', JSON.stringify(item))
            localStorage.removeItem('historyPage')
            _that.$router.push(item.path)
        }
        ,
        refreshTabbar(item) {
            var _that = this
            for (var i = 0; i < _that.tabbarArr.length; i++) {
                var tabar = _that.tabbarArr[i]
                for (var j = 0; j < tabar.child.length; j++) {
                    var item1 = tabar.child[j]
                    if (item.path == item1.path) {
                        Vue.set(item1, 'actived', true)
                    } else {
                        Vue.set(item1, 'actived', false)
                    }
                }
            }
            localStorage.setItem('activedPath', JSON.stringify(item))
        }
    },
    mounted() {
        var _that = this
        var cacheTabbar = localStorage.getItem('activedPath')
        var user = getUserData()
        if (user.role == 2) {
            var statisticsBar = this.tabbarArr[2]
            var index = this.tabbarArr.indexOf(statisticsBar);
            if (index > -1) {
                this.tabbarArr.splice(index, 1);
            }
        }

        if (cacheTabbar) {
            try {
                var item = JSON.parse(cacheTabbar)
                this.$nextTick(() => {
                    _that.refreshTabbar(item)
                })
            } catch (error) {

            }
        } else {

        }

    }
});


router.beforeEach((to, from, next) => {
    var tabbarArr = college_admin_com.tabbarArr
    var toPath = to.path
    var isTabbarItem = false
    console.log(toPath)
    for (var i = 0; i < tabbarArr.length; i++) {
        var tabar = tabbarArr[i]
        for (var j = 0; j < tabar.child.length; j++) {
            var item1 = tabar.child[j]
            if (item1.path == toPath) {
                isTabbarItem = true
                break
            }
        }
    }
    console.log(isTabbarItem)
    if (isTabbarItem) {
        for (var i = 0; i < tabbarArr.length; i++) {
            var tabar = tabbarArr[i]
            for (var j = 0; j < tabar.child.length; j++) {
                var item1 = tabar.child[j]
                if (item1.path == toPath) {
                    Vue.set(item1, 'actived', true)
                    localStorage.setItem('activedPath', JSON.stringify(item1))
                } else {
                    Vue.set(item1, 'actived', false)
                }
            }
        }

    }

    next()
})

function getUserData() {
    var storage = window.localStorage;
    var json = storage.getItem("userData");
    var jsonObj = JSON.parse(json);
    if (!jsonObj) {
        jsonObj = {
            "datastatus": "1",
            "mobile": "",
            "name": "admin",
            "password": "",
            "picture": "http://47.104.183.133/image/WADO.php?action=LoadImage\u0026FileName=219118531071971328.png",
            "role": "1",
            "roledesc": "超级管理员",
            "userid": ""
        }

    }
    return jsonObj;
}

function getPic(obj, otherparm) {
    // $(".pic_setsize").show();
    if (otherparm === undefined) {
        picupObj.operat_img(obj.files[0]);
    } else {
        if (document.getElementById('pic_upload_div')) {
            if ($("#pic_upload_div").attr('data-type') == 'editor') {
                $(".pic_setsize").hide();
                picupObj.operat_img(obj.files[0]);
            } else {
                $(".pic_setsize").show();
                picupObj.operat_img(obj.files[0], otherparm);
            }
        } else {
            picupObj.operat_img(obj.files[0], otherparm);
        }
    }
}

function SortLikeWin(v1, v2) {
    var a = v1.displayorder;
    var b = v2.displayorder;
    if (!a && !b) {
        a = v1.name
        b = v2.name
    } else {
        return 1
    }
    var reg = /[0-9]+/g;
    var lista = a.match(reg);
    var listb = b.match(reg);
    if (!lista || !listb) {
        return a.localeCompare(b);
    }
    for (var i = 0, minLen = Math.min(lista.length, listb.length); i < minLen; i++) {
        //数字所在位置序号
        var indexa = a.indexOf(lista[i]);
        var indexb = b.indexOf(listb[i]);
        //数字前面的前缀
        var prefixa = a.substring(0, indexa);
        var prefixb = a.substring(0, indexb);
        //数字的string
        var stra = lista[i];
        var strb = listb[i];
        //数字的值
        var numa = parseInt(stra);
        var numb = parseInt(strb);
        //如果数字的序号不等或前缀不等，属于前缀不同的情况，直接比较
        if (indexa != indexb || prefixa != prefixb) {
            return a.localeCompare(b);
        }
        else {
            //数字的string全等
            if (stra === strb) {
                //如果是最后一个数字，比较数字的后缀
                if (i == minLen - 1) {
                    return a.substring(indexa).localeCompare(b.substring(indexb));
                }
                //如果不是最后一个数字，则循环跳转到下一个数字，并去掉前面相同的部分
                else {
                    a = a.substring(indexa + stra.length);
                    b = b.substring(indexa + stra.length);
                }
            }
            //如果数字的string不全等，但值相等
            else if (numa == numb) {
                //直接比较数字前缀0的个数，多的更小
                return strb.lastIndexOf(numb + '') - stra.lastIndexOf(numa + '');
            }
            else {
                //如果数字不等，直接比较数字大小
                return numa - numb;
            }
        }
    }
}

function showToast(msg, duration) {
    duration = isNaN(duration) ? 3000 : duration;
    var m = document.createElement('div');
    m.innerHTML = msg;
    m.style.cssText = "width:60%; min-width:180px; background:#000; opacity:0.6; height:auto;min-height: 30px; color:#fff; line-height:30px; text-align:center; border-radius:4px; position:fixed; top:60%; left:20%; z-index:999999;";
    document.body.appendChild(m);
    setTimeout(function () {
        var d = 0.5;
        m.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';
        m.style.opacity = '0';
        setTimeout(function () { document.body.removeChild(m) }, d * 1000);
    }, duration);
}

function copyText(obj) {
    var Url2 = obj.html();
    var oInput = document.createElement('input');
    oInput.value = Url2;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display = 'none';
    alert('复制成功');
}

function uploadPicByDom(inputId, scaleRatio, process, complete) {    
    $(inputId).localUploadYaYigj = null;
    setTimeout(() => {
        
        $(inputId).localUploadYaYigj({
            imgPathID: inputId, //上传成功后返回路径放到哪个控件
            imgPathPIC: inputId, //上传成功后预览图片控件
            scaleRatio: scaleRatio,
            isCrop: true,//是否支持裁剪
            uploadPath: '',
            uploadCallBack: function (data) {
                //裁剪后完整的base64
                var imgBase64 = $(inputId).attr("src");
                var imgFile = base64ToBlob(imgBase64);
                var maxsize = 2 * 1000 * 1024;//2M 
                var filesize = imgFile.size;

                if (filesize == -1) {
                    jQuery.postFail("", "浏览器不支持大小检测,请确保图片Size < 2M");
                } else if (filesize > maxsize) {
                    jQuery.postFail("", "图片大小超过2M");
                    complete(false);
                    return;
                }
                var pictureExt = imgFile.type;
                if (pictureExt != "image/jpg"
                    && pictureExt != "image/jpeg"
                    && pictureExt != "image/png") {
                    bannerNotice = '图片类型错误:' + pictureExt
                    $(inputId).val("")
                    complete(false);
                    return;
                }

                var imgFile = base64ToBlob(imgBase64);
                var x = new FormData();
                x.append("file", base64ToBlob(imgBase64));
                x.append('filetype', imgFile.type.slice(6));
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
                                    process(percentage)
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
                        $(inputId).val("")
                        complete(json);
                    },
                    error: function (json) {
                        $(inputId).val("")
                        complete(json);
                    }
                });

            }
        }, function () {

        });
    }, 0);


}