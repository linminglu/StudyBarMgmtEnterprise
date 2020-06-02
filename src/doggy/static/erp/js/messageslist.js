/*======================================
2017-1-3罗杨   消息列表
==========================================*/
jQuery.createAniCss();
$(function() {
    $("#BeginDate").yayigj_date_Sel({ varType: 'val' });
    $("#EndDate").yayigj_date_Sel({ varType: 'val' });
    //加载页面获取当天日期
    $("#BeginDate").getCurrday();
    $("#EndDate").getCurrday();
    $("#scroll_div_1").scroll(function(event) {
        var head = $("#thead_1");
        if ($(this).scrollTop() >= 30) {
            head.css('transform', 'translateY(' + ($(this).scrollTop()) + 'px)');
        } else {
            head.css('transform', 'translateY(' + (0) + 'px)');
        }
    });
    $("#sendState").yayigj_downlist({
        _callBack: sendtype, //状态
        _data: [
            { 'key': '全部', val: "" },
            { 'key': '已发送', val: "2" },
            { 'key': '发送中', val: "1" },
            { 'key': '未发送', val: "0" },
        ]
    });
    $("#sendType").yayigj_downlist({ //类型
        _data: [
            { 'key': '全部', val: "" },
            { 'key': '文字消息', val: "0" },
            { 'key': '图文链接', val: "1" },
            {'key':'系列课程', val: "2"},
            {'key':'单课程', val: "3"}
        ]
    });
    $("#sendStage").yayigj_downlist({ //发送平台
        _data: [
            { 'key': '全部', val: "" },
            { 'key': 'PC端登陆海报', val: "1" },
            { 'key': 'PC端消息中心', val: "2" },
            { 'key': 'PC端弹窗', val: "3" },
            { 'key': 'PC端-服务器弹窗', val: "13" },
            { 'key': '手机APP消息中心', val: "7" },
            { 'key': '手机App首页广告', val: "12" },
            { 'key': '手机App登陆广告', val: "10" },
            { 'key': 'web端系统消息', val: "8" },
            { 'key': 'web端个人消息中心', val: "9" },
            { 'key': 'Web活动中心', val: "11" },
            { 'key': '官网登陆页海报', val: "15" },
            { 'key': '官网首页海报', val: "14" },
        ]
    });
    $("#pagerRow").yayigj_downlist({ //分页
        _callBack: changePageSize,
        _data: [
            { 'key': '20', val: "20" },
            { 'key': '50', val: "50" },
            { 'key': '100', val: "100" },
        ]
    });
    //初始化获取数据列表
    getParams(0);
    $(document).keydown(function(e) {
        var key = e.keyCode;
        if (key == 13) {
            getParams(1);
            $("#pageCurr").val(1);
        }
    })
});
/*===========================================================
函数
===========================================================*/
function sendtype(id) {
    // if (id == "1") {
    //     $("#BeginDate,#EndDate").removeAttr("disabled");
    //     // console.log("true");
    // } else {
    //     $("#BeginDate,#EndDate").attr("disabled", "disabled").val("");
    //     //console.log("false");
    // }
}

function changePageSize() {
    getParams(1);
    $("#pageCurr").val(1);
}

function getParams(code) {
    var start_time = $("#BeginDate").val();
    var end_time = $("#EndDate").val();
    var status = $("#sendState").attr("data-val");
    var type = $("#sendType").attr("data-val");
    var channel = $("#sendStage").attr("data-val");
    var condition = $("#condition").val();
    //  console.log(code);
    getMessageList(start_time, end_time, status, type, channel, condition, code);
}
//获取列表函数
function getMessageList(start_time, end_time, status, type, channel, condition, code) {
    var page = $("#pageCurr").val();
    if (code == 1) {
        page = 1;
    }
    var parmas = {
        start_time: start_time,
        end_time: end_time,
        status: status,
        type: type,
        channel: channel,
        condition: condition,
        per_page: $("#pagerRow").attr("data-val"),
        page: page
    }
    $.ajax({
        type: "POST",
        url: "/butlerp/message",
        datatype: "json",
        data: parmas,
        beforeSend: function() {
            jQuery.loading('加载中', 1);
        },
        complete: function() {
            jQuery.loading_close();
        },
        success: function(json) {
            //console.log(json);
            if (json.code == 1) {
                var list = "";
                if (json.list == null) {
                    list = '<tr><td colspan="10" align="center"><img src="/static/account/img/no-data.png" alt=""/></td></tr>';
                    $(".Pager").css("display", "none");
                } else {
                     $(".Pager").css("display","block");
                     $.each(json.list,function(k,v){
                        var Pstatus="已发送";
                        var action='<input type="button" value="查看" onclick="viewDetail(this)"/><input type="hidden" value='+v.notify_id+'>';
                        var chStr="";
                        var chArr=[];
                        var sendtype="文字消息";
                        if(v.sendstate=="0"){
                            Pstatus="未发送";
                            action+='<input type="button" value="修改" onclick="edition(this)"/><input type="button" value="发送" onclick="sendMessage(this)"/>';
                        }
                    	if (v.sendstate=="1"){
                    		Pstatus="发送中"
                    	}
                        if(v.msg_type==1){
                            sendtype="图文链接"
                        }else if(v.msg_type==2){
                            sendtype="系列课程"
                        }else if(v.msg_type==3){
                            sendtype="单课程"
                        }
                        chArr=v.channels.split(",");
                        $.each(chArr,function(key,value){
                            chStr+='<li>'+value+'</li>'
                        });

                        list+='<tr><td>'+v.notify_id+'</td>';
                        list+='<td>'+v.title+'</td>';
                        list+='<td>'+sendtype+'</td>';
                        list+='<td><p title="'+v.content+'">'+v.content+'</p><p>'+v.push_date+'</p></td>';
                        list+='<td>'+Pstatus+'</td>';
                        list+='<td>'+chStr+'</td>';
                        list+='<td>'+v.dental_num+'</td>';
                        list+='<td>'+v.device_num+'</td>';
                        list+='<td>'+v.read_num+'</td>';
                        list+='<td>'+v.click_num+'</td>';
                        list+='<td width="220">'+action+'</td></tr>';
                    })
                }
                setPageList(json.totalcount, 4)
                $("#MList").html(list);
            } else {
                jQuery.showError(json.info, '信息反馈');
            }
        },
        error: function() {

        }
    })
}

//发送按钮
function sendMessage(obj) {
    var dentalID = $(obj).siblings("input[type='hidden']").val();
    $.ajax({
        type: "POST",
        url: "/butlerp/message/" + dentalID + "/send",
        //url:"/butlerp/message/dentalname",
        datatype: "json",
        data: {},
        beforeSend: function() {
            jQuery.loading('加载中', 1);
        },
        complete: function() {
            jQuery.loading_close();
        },
        success: function(json) {
            if (json.code == 1) {
                getParams(0);
                jQuery.postOk("fadeInUp", "发送成功");
            }
        },
        error: function() {

        }
    })
}
//查看viewdetail
function viewDetail(obj) {
    var id = $(obj).siblings("input[type='hidden']").val();
    // $.get("/butlerp/message/"+id+"viewdetail",{},function(result){
    //     console.log(result)
    // })
    window.location = "/butlerp/message/" + id + "/viewdetail";
    // window.location="/views/erp/message/messagesview.html";
    localStorage.setItem("id", id);
}
//修改
function edition(obj) {
    var id = $(obj).siblings("input[type='hidden']").val();
    window.location = "/butlerp/message/" + id + "/edition";
}

//页码显示count条目总数，displayNum页面中显示多少个页码
function setPageList(count, displayNum) {
    var str = '',
        _curr = 1,
        _totalpage = 0,
        _row = 0;
    $(".pagerSP3").show();
    _row = $("#pagerRow").val(); //每页条数
    _totalpage = Math.ceil(count / _row);
    displayNum = displayNum != undefined ? displayNum : 4

    // if(_totalpage<=1){$(".Pager").hide();}
    // else{$(".Pager").show();}
    $(".pagerSP1").html("共" + count + "条/" + _totalpage + "页");
    var c_p = parseInt($("#pageCurr").val()); //取页码起始值和结束值
    var prev = c_p - 1 > 0 ? c_p - 1 : 1;
    var next = c_p + 1 <= _totalpage ? c_p + 1 : _totalpage;
    var pageNum = function() {
        var r = '';
        var c_start = c_p - displayNum / 2;
        var c_end = c_p + displayNum / 2;
        if (c_start < 1) {
            c_start = 1;
            c_end = displayNum + c_start;
        }
        if (c_end > _totalpage) {
            c_start = _totalpage - displayNum;
            c_end = _totalpage;
        }
        if (_totalpage < displayNum + 1) {
            c_start = 1;
            c_end = _totalpage;
        }

        for (var i = c_start; i <= c_end; i++) {
            if (c_p == i) {
                r += '<a class="pagerAct" onclick="setpage(' + i + ',' + _totalpage + ')">' + i + '</a>';
            } else {
                r += '<a onclick="setpage(' + i + ',' + _totalpage + ')">' + i + '</a>';
            }
        }
        return r;
    }
    var str = '';
    str = '<a onclick="setpage(1,' + _totalpage + ')">&lt;&lt;</a><a onclick="setpage(' + (prev) + ',' + _totalpage + ')">&lt;</a>';
    str += pageNum();
    str += '<a onclick="setpage(' + (next) + ',' + _totalpage + ')">&gt;</a><a onclick="setpage(' + _totalpage + ',' + _totalpage + ')">&gt;&gt;</a>';

    $(".pagerSP2").empty().html(str);
}
//分页点击事件
function setpage(num, _totalpage) {
    num = num == 0 ? 1 : num;
    num = num > _totalpage ? _totalpage : num
    $("#pageCurr").val(num);
    getParams(0);
}