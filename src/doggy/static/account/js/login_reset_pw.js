/*判断密码强度*/ 
function checkStrong(sValue) {
    var modes = 0;
    //正则表达式验证符合要求的
    if (sValue.length < 1) return modes;
    if (/\d/.test(sValue)) modes++; //数字
    if (/[a-z]/.test(sValue)) modes++; //小写
    if (/[A-Z]/.test(sValue)) modes++; //大写  
    if (/\W/.test(sValue)) modes++; //特殊字符
   //逻辑处理
    switch (modes) {
        case 1:
            return 1;
            //break;
        case 2:
            return 2;
        case 3:
            return sValue.length < 6 ? 2 : 3
            //break;
    }
}
$("#login_set_pw").bind('keyup onfocus onblur',function(){
    if($("#login_set_pw").val()==""){
        $(".pw_safe").hide();
        $(".pw_tip").hide();
    }else{
        $(".pw_safe").show();
        $(".pw_tip").show();
    }
    var index=checkStrong($(this).val());
    //console.log(index);
    if (index==1) {
        $(".safe_rang").eq(index-1).attr("id","safe1");
        $(".safe_rang").eq(index).removeAttr("id");
        $(".safe_rang").eq(index+1).removeAttr("id");
        $("#pw_safe_rang").text("弱");
        $(".pw_tip").html("您的密码有风险，请使用数字、字母或标点符号的组合");
        $(".pw_tip").css("color","#ff4c4c");
        $("#pw_safe_rang").css("color","#ff4c4c");
    }
    if (index==2) {
        $(".safe_rang").eq(index-1).attr("id","safe2");
        $(".safe_rang").eq(index-2).attr("id","safe2");
        $(".safe_rang").eq(index).removeAttr("id");
        $("#pw_safe_rang").text("中");
        $(".pw_tip").html("您的密码安全度适中,可尝试加入大小写混合密码");
        $(".pw_tip").css("color","#ffac0a");
        $("#pw_safe_rang").css("color","#ffac0a");
    }
    if (index==3) {
        $(".safe_rang").eq(index-1).attr("id","safe3");
        $(".safe_rang").eq(index-2).attr("id","safe3");
        $(".safe_rang").eq(index-3).attr("id","safe3");
        $("#pw_safe_rang").text("强");
        $(".pw_tip").html("您的密码很安全,建议您定期更换密码以保证账号安全");
        $(".pw_tip").css("color","#4bc941");
        $("#pw_safe_rang").css("color","#4bc941");
        
    }
})

$("#create_btn").click(function(){
    //console.log(1);
    if($("#login_set_pw").val()==""){
        $(".sub_tips").show();
        $(".sub_tips label").html("设置密码不能为空");
        $(".sub_tips").css("top","-113px");
        $("#login_set_pw").css("border-color","#f86d5a");
        return false;
    }
    if($("#login_confim_pw").val()==""){
        $(".sub_tips").show();
        $(".sub_tips label").html("确认密码不能为空");
        $("#login_confim_pw").css("border-color","#f86d5a");
        return false;
    }
    if($("#login_set_pw").val().length<6||$("#login_set_pw").val().length>16){
        $(".sub_tips").show();
        $(".sub_tips label").html("密码长度为6-16位");
         $(".sub_tips").css("top","-162px");
        $("#login_set_pw").css("border-color","#f86d5a");
        return false;
    }
    if($("#login_confim_pw").val()!=$("#login_set_pw").val()){
        $(".sub_tips").show();
        $(".sub_tips label").html("两次输入的密码不一致,请重新输入");
        $("#login_confim_pw").css("border-color","#f86d5a");
        return false;
    }
    if($("#pw_safe_rang").text()=="弱"){
        var rangNum=1;
    }
    if($("#pw_safe_rang").text()=="中"){
        var rangNum=2;
    }
    if($("#pw_safe_rang").text()=="强"){
        var rangNum=3;
    }
    $.ajax({
        type:"POST",
        url:"/member/resetpsw",
        dataType:"json",
        data:{
            password:$("#login_set_pw").val(),      
            password_confirm:$("#login_confim_pw").val(),
            passwordcomplexity:rangNum
        },
        beforeSend: function(){},
        success: function(json){
            console.log(json);
            if(json.code==1){
                window.location.href="/login";
            }
        },
        error: function(json){console.log(json);},
        complete: function(json){
            //console.log(json);
        }
    })
})


$("#login_set_pw").focus(function(){
    $(".sub_tips").hide();
    $("#login_set_pw").css("border-color","#00c5b5");
    $("#login_set_pw").css("outline","none");
})
$("#login_set_pw").blur(function(){
    $("#login_set_pw").css("border-color","#e0e0e0");
})


$("#login_confim_pw").focus(function(){
    $(".sub_tips").hide();
    $("#login_confim_pw").css("border-color","#00c5b5");
    $("#login_confim_pw").css("outline","none");
})
$("#login_confim_pw").blur(function(){
    $("#login_confim_pw").css("border-color","#e0e0e0");
})