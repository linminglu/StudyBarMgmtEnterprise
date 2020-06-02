var getRemAcc = localStorage.getItem("remAcc");
var getRemPw = localStorage.getItem("remPw");
var getCheSta = localStorage.getItem("cheSta");
var loginType = localStorage.getItem("loginType");

var wait = 60;
function time(dom) {
    if (wait == 0) {
        dom.removeAttribute("disabled");
        dom.innerHTML = "发送验证码";
        wait = 60;
    } else {
        dom.setAttribute("disabled", true);
        dom.innerHTML = wait + " s";
        wait--;
        setTimeout(function () { time(dom) }, 1000)
    }
}


if (getRemAcc != null && getRemAcc != "null") {
    $("#user_input").val("" + getRemAcc + "");
} else {
    $("#user_input").val("");
}
if (getRemPw != null && getRemPw != "null") {
    $('#pw_input').val("" + getRemPw + "");
} else {
    $('#pw_input').val("");
}
if (getCheSta == 1) {
    $("#rem_pw").attr("checked", true);
} else {
    $("#rem_pw").attr("checked", false);
}
function refreshLoginDom() {
    localStorage.removeItem('activedPath')
    localStorage.removeItem('courseActiveIndex')
    localStorage.removeItem('historyPage')
    if (loginType == 1) {
        $("#code_btn").addClass('code_btn_sel')
        $("#account_btn").removeClass('account_btn_sel')
        $("#phone_area").css("display", 'block')
        $("#account_area").css("display", 'none')

    } else {

        $("#code_btn").removeClass('code_btn_sel')
        $("#account_btn").addClass('account_btn_sel')
        $("#phone_area").css("display", 'none')
        $("#account_area").css("display", 'block')
    }
}

refreshLoginDom();
function saveUserData(data) {
    var storage = localStorage;
    if (data) {
        var d = JSON.stringify(data);
        storage.setItem("userData", d);
    }
    /**
     *   //将JSON字符串转换成为JSON对象输出
          var json=storage.getItem("userData");
          var jsonObj=JSON.parse(json);
     *  */
}

$("#login_button").click(function () {
    //账号登录
    if (loginType == 1) {
        //验证码登录
        $.ajax({
            type: "POST",
            url: "/learn/platform/codelogin",
            dataType: "json",
            data: {
                mobile: $("#phone_input").val(),
                code: $("#msgcode_input").val()
            },
            beforeSend: function () {
                $("#login_button").val("登录中...");
            },
            success: function (json) {
                console.log(json);
                if (json.code == 1) {
                    var localUserData = json.list;

                    saveUserData(localUserData)
                    window.location.href = "/learn/platform/index#/allanchors";
                } else {
                    alert(json.info);
                }
            },
            error: function (json) { },
            complete: function (json) {
                $("#login_button").val("登录");
            }
        });
    } else {
        $.ajax({
            type: "POST",
            url: "/learn/platform/userlogin",
            dataType: "json",
            data: {
                mobile: $("#user_input").val(),
                password: hex_md5($("#pw_input").val())
            },
            beforeSend: function () {
                $("#login_button").val("登录中...");
            },
            success: function (json) {
                console.log(json);
                if (json.code == 1) {
                    var localUserData = json.list;

                    saveUserData(localUserData)

                    localStorage.setItem("remAcc", $("#user_input").val());
                    localStorage.setItem("remPw", $('#pw_input').val());
                    window.location.href = "/learn/platform/index#/allanchors";
                } else {

                    alert(json.info);
                }
            },
            error: function (json) { },
            complete: function (json) {
                $("#login_button").val("登录");
            }
        });
    }
})

$("#send_btn").click(function () {
    event.preventDefault();
    time(this);

    $.ajax({
        type: "POST",
        url: "/learn/platform/sendcode",
        dataType: "json",
        data: {
            mobile: $("#phone_input").val()
        },
        beforeSend: function () {
            $("#send_btn").css("disable", true);
        },
        success: function (json) {
            console.log(json);
            if (json.code == 1) {

            } else {
                alert(json.info);
                wait = 0;
                time(wait);
            }
        },
        error: function (json) { },
        complete: function (json) {
            $("#login_button").val("登录");
        }
    });
})

$("#account_btn").click(function () {
    localStorage.setItem("loginType", 0);
    loginType = 0;
    refreshLoginDom();
})

$("#code_btn").click(function () {
    localStorage.setItem("loginType", 1);
    loginType = 1;
    refreshLoginDom();
})

