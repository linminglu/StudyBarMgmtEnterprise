
// if(window.localStorage){  
//    alert(1);
// }else{  
// alert(0);
// }  


var timeV=null;
//禁用按钮
function code_disab(){
    $("#reg_sendnum").css("backgroundColor","#cdcdcd");
    $("#reg_sendnum").attr("disabled",true);
}
//启动按钮
function code_enabled(){
     $("#reg_sendnum").removeAttr("disabled");
     $("#reg_sendnum").css("backgroundColor","#00c5b5");
}
code_disab();
//验证码倒计时
function timeNew(){
    var wait=60;
    timeV=window.setInterval(function(){
        if (wait==0) {
            clearInterval(timeV);
            code_enabled();
            $("#reg_sendnum").val("获取验证码"); 
         }else{
            code_disab();
            $("#reg_sendnum").val(""+wait+"秒");
            wait--;
         }  
    },1000)
}

//检验手机号是否合法
function check_mb(obj){
    //console.log($(obj).val());
    var reg=/^1[3|4|5|7|8]\d{9}$/; 
    if(!reg.test($(obj).val())){ 
        code_disab();
    }else{
       code_enabled();
    } 
};


//获取验证码
$("#reg_sendnum").click(function(){
    //判断用户是否注册
    $.ajax({
        type:"POST",
        url:"/member/checkuserexist",
        dataType:"json",
        data:{
            mobile:$("#reg_phonenum").val()
        },
        beforeSend: function(){},
        success: function(json){
            //console.log(json);
            if(json.code==1){ //未注册
                timeNew();
                $.ajax({
                    type:"POST",
                    url:"/member/sendregcode",
                    dataType:"json",
                    data:{
                        mobile:$("#reg_phonenum").val()
                    },
                    beforeSend: function(){},
                    success: function(json){
                        //console.log(json);
                    },
                    error: function(json){console.log(json);},
                    complete: function(json){
                        //console.log(json);
                    }
                })
            }else{
                //alert(json.info);
                $(".sub_tips_index1").show();
                $(".sub_tips_index1 label").text(json.info);
            }
        },
        error: function(json){console.log(json);},
        complete: function(json){
            //console.log(json);
        }
    })
})

$("#reg_phonenum").focus(function(){
    $(".sub_tips").hide();
    $("#reg_phonenum").css("border-color","#00c5b5");
    $("#reg_phonenum").css("outline","none");
})

$("#reg_phonenum").blur(function(){
    $("#reg_phonenum").css("border-color","#e0e0e0");
})

$("#reg_phone").focus(function(){
    $(".sub_tips").hide();
    $("#reg_phone").css("border-color","#00c5b5");
    $("#reg_phone").css("outline","none");
})
$("#reg_phone").blur(function(){
    $("#reg_phone").css("border-color","#e0e0e0");
})
//校验注册验证码
$("#next_step1").click(function(){
    if($("#reg_phonenum").val()==""){
        $(".sub_tips_index2").show();
        $(".sub_tips_index2 label").text("手机号不能为空");
        $("#reg_phonenum").css("border-color","#f86d5a");
        return false;
    }
    if($("#reg_phone").val()==""){
        $(".sub_tips_index1").show();
        $(".sub_tips_index1 label").text("验证码不能为空");
        $("#reg_phone").css("border-color","#f86d5a");
        return false;
    }
     $.ajax({
        type:"POST",
        url:"/member/checkregcode",
        dataType:"json",
        data:{
            mobile:$("#reg_phonenum").val(),
            code:$("#reg_phone").val()
        },
        beforeSend: function(){},
        success: function(json){
            console.log(json);
            if(json.code==1){
                window.location.href="/member/regsetpsw";
                localStorage.setItem("phonum",$("#reg_phonenum").val());
            }else{
                $(".sub_tips_index1").show();
                $(".sub_tips_index1 label").text(json.info);
            }
        },
        error: function(json){console.log(json);},
        complete: function(json){
            //console.log(json);
        }
    })
})




