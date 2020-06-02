var userid=localStorage.getItem("userId")
//console.log(userid);
$("#create_btn").click(function(){
    if($("#clinic_contacts").val()==""){
        $(".sub_tips2").show();
        $(".sub_tips2 label").text("管家号不能为空!");
        $(".sub_tips2").css("top","-215px")
        $("#clinic_contacts").css("border-color","#f86d5a");
        return false;
    }
    if($("#doctor_name").val()==""){
        $(".sub_tips2").show();
        $(".sub_tips2 label").text("用户名不能为空!");
        $(".sub_tips2").css("top","-126px")
        $("#doctor_name").css("border-color","#f86d5a");
        return false;
    }
    if($("#login_pw").val()==""){
        $(".sub_tips2").show();
        $(".sub_tips2 label").text("密码不能为空！请先去PC端牙医管家设置密码再重新关联");
        $(".sub_tips2").css("top","-42px")
         $("#login_pw").css("border-color","#f86d5a");
        return false;
    }
    $.ajax({
        type:"POST",
        url:"/member/bindclinic",
        dataType:"json",
        data:{
            //userid:userid,
            dentalid:$("#clinic_contacts").val(),
            doctorname:$("#doctor_name").val(),
            password:$("#login_pw").val()
        },
        beforeSend: function(){
            $("#create_btn").val("关联中,请稍后...");
            $("#create_btn").attr("disable",true);
        },
        success: function(json){
            console.log(json);
            if(json.code==1){
                if(json.list.samepassword==0){
                    window.location.href="/member/blindclinic";
                }else{
                    window.location.href="/index";
                }
            }else{
                $(".sub_tips2").show();
                $(".sub_tips2 label").text(json.info);
                $(".sub_tips2").css("top","-42px")
            }
            $("#create_btn").val("关联诊所");
            $("#create_btn").attr("disable",false);
        },
        error: function(json){console.log(json);},
        complete: function(json){
           //console.log(json);
        }
    })
})

$("#clinic_contacts").focus(function(){
     $(".sub_tips2").hide();
    $("#clinic_contacts").css("border-color","#00c5b5");
    $("#clinic_contacts").css("outline","none");
})
$("#clinic_contacts").blur(function(){
    $("#clinic_contacts").css("border-color","#e0e0e0");
})


$("#doctor_name").focus(function(){
    $(".sub_tips2").hide();
    $("#doctor_name").css("border-color","#00c5b5");
    $("#doctor_name").css("outline","none");
})
$("#doctor_name").blur(function(){
    $("#doctor_name").css("border-color","#e0e0e0");
})



$("#login_pw").focus(function(){
    $(".sub_tips2").hide();
    $("#login_pw").css("border-color","#00c5b5");
    $("#login_pw").css("outline","none");
})
$("#login_pw").blur(function(){
    $("#login_pw").css("border-color","#e0e0e0");
})