
var phone=localStorage.getItem("phonum");
//console.log(phone);
//禁用按钮
function code_disab2(){
    $("#next_step2").css("backgroundColor","#cdcdcd");
    $("#next_step2").attr("disabled",true);
}
//启动按钮
function code_enabled2(){
     $("#next_step2").removeAttr("disabled");
     $("#next_step2").css("backgroundColor","#00c5b5");
}
//code_disab2();
//模拟选择框
$("#selte_agress").click(function(){
    var url=$(this).attr("src");
    if(url=="/static/account/img/checkbox.png"){
        $(this).attr("src","/static/account/img/checked.png");
        code_enabled2();
    }else{
        $(this).attr("src","/static/account/img/checkbox.png");
        code_disab2();
    }
})

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
$("#reg_set_pw").bind('keyup onfocus onblur',function(){
    if($("#reg_set_pw").val()==""){
        $(".pw_safe").hide();
        $(".pw_tip").hide();
        $(".set_pw").css("margin-bottom","30px");
    }else{
        $(".pw_safe").show();
        $(".pw_tip").show();
        $(".set_pw").css("margin-bottom","12px");
    }
    var index=checkStrong($(this).val());
    //console.log(index);
    if (index==1) {
        $(".safe_rang").eq(index-1).attr("id","safe1");
        $(".safe_rang").eq(index).removeAttr("id");
        $(".safe_rang").eq(index+1).removeAttr("id");
        $("#pw_safe_rang").text("弱");
        $("#pw_safe_rang").css("color","#ff4c4c");
        $(".pw_tip").css("color","#ff4c4c");
    }
    if (index==2) {
        $(".safe_rang").eq(index-1).attr("id","safe2");
        $(".safe_rang").eq(index-2).attr("id","safe2");
        $(".safe_rang").eq(index).removeAttr("id");
        $("#pw_safe_rang").text("中");
        $("#pw_safe_rang").css("color","#ffac0a");
        $(".pw_tip").html("您的密码安全度适中,可尝试加入大小写混合密码");
        $(".pw_tip").css("color","#ffac0a");
    }
    if (index==3) {
        $(".safe_rang").eq(index-1).attr("id","safe3");
        $(".safe_rang").eq(index-2).attr("id","safe3");
        $(".safe_rang").eq(index-3).attr("id","safe3");
        $("#pw_safe_rang").text("强");
        $("#pw_safe_rang").css("color","#4bc941");
        $(".pw_tip").html("您的密码很安全,建议您定期更换密码以保证账号安全");
        $(".pw_tip").css("color","#4bc941");
    }
})

//设置密码注册
$("#next_step2").click(function(){
    if($("#reg_set_pw").val()==""){
        $(".sub_tips").show();
        $(".sub_tips label").text("密码不能为空");
        $("#reg_set_pw").css("border-color","#f86d5a");
        return false;
    }
    if($("#reg_set_rpw").val()==""){
        $(".reg_pw_sub_tips").show();
        $(".reg_pw_sub_tips label").text("密码不能为空");
        $("#reg_set_rpw").css("border-color","#f86d5a");
        $(".user_agree").css("position","relative");
        $(".user_agree").css("bottom","3px");
        $(".user_agree").css("margin-bottom","18px!important");
        return false;
    }
    if($("#reg_set_pw").val().length<6||$("#reg_set_pw").val().length>16){
        $(".reg_pw_sub_tips").show();
        $(".reg_pw_sub_tips label").text("密码长度为6-16");
        $("#reg_set_pw").css("border-color","#f86d5a");
        $(".user_agree").css("position","relative");
        $(".user_agree").css("bottom","3px");
        $(".user_agree").css("margin-bottom","18px!important");
        return false;
    }
    if($("#reg_set_rpw").val().length<6||$("#reg_set_rpw").val().length>16){
        $(".reg_pw_sub_tips").show();
        $(".reg_pw_sub_tips label").text("密码长度为6-16");
        $("#reg_set_rpw").css("border-color","#f86d5a");
        $(".user_agree").css("position","relative");
        $(".user_agree").css("bottom","3px");
        $(".user_agree").css("margin-bottom","18px!important");
        return false;
    }
    if($("#reg_set_pw").val()!=$("#reg_set_rpw").val()){
        $(".reg_pw_sub_tips").show();
        $(".reg_pw_sub_tips label").text("两次输入的密码不一致,请重新输入");
        $("#reg_set_rpw").css("border-color","#f86d5a");
        $(".user_agree").css("position","relative");
        $(".user_agree").css("bottom","3px");
        $(".user_agree").css("margin-bottom","18px!important");
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
        url:"/member/register",
        dataType:"json",
        data:{
            mobile:phone,
            password:$("#reg_set_pw").val(),
            password_confirm:$("#reg_set_rpw").val(),
            passwordcomplexity:rangNum
        },
        beforeSend: function(){},
        success: function(json){
            console.log(json);
            if(json.code==1){
                localStorage.setItem("userId",json.list.userid);
                window.location.href="regclinicisel";
            }else{
                $(".reg_pw_sub_tips").show();
                $(".reg_pw_sub_tips label").text(""+json.info+"");
                $(".user_agree").css("position","relative");
                $(".user_agree").css("bottom","3px");
                $(".user_agree").css("margin-bottom","18px!important");
            }
        },
        error: function(json){console.log(json);},
        complete: function(json){
            // console.log(json);
        }
    })
})

$("#reg_set_pw").focus(function(){
    $(".sub_tips").hide();
    $("#reg_set_pw").css("border-color","#00c5b5");
    $("#reg_set_pw").css("outline","none");
})
$("#reg_set_pw").blur(function(){
    $("#reg_set_pw").css("border-color","#e0e0e0");
})


$("#reg_set_rpw").focus(function(){
     $(".reg_pw_sub_tips").hide();
    $("#reg_set_rpw").css("border-color","#00c5b5");
    $("#reg_set_rpw").css("outline","none")
})
$("#reg_set_rpw").blur(function(){
    $("#reg_set_rpw").css("border-color","#e0e0e0");
})
