$(function(){
	$("#pwform input[type='password']").on("focus",function(){
       $(this).removeClass("erractive").siblings(".errTip").css("visibility","hidden");
    })
});
function check(){
    var id=$("#userid").text();
    var name=$("#username").text();
    var pw=$("#pw").val();
    var rpw=$("#rpw").val();
    if(pw.length<6){
        $("#pwerr").html("密码长度不能小于6位").css("visibility","visible");
        $("#pw").addClass("erractive");
        return false;
    }else if(rpw.length<6){
        $("#rpwerr").html("密码长度不能小于6位").css("visibility","visible");
         $("#rpw").addClass("erractive");
        return false;
    }else if(rpw!=pw){
        $("#rpwerr").html("两次密码不一致！请重新输入").css("visibility","visible");
         $("#rpw").addClass("erractive");
        return false;
    }else{
        $.ajax({
            type:"POST",
            url:"/butlerp/account/switchpass",
            dataType:"json",
            data:{
                password:$("#pw").val(),
	            passagain:$("#rpw").val()
            },
            beforSend:function(){},
            complete:function(){},
            success:function(json){
               // console.log(json);
                if(json.code==1){
                    localStorage.setItem("remAcc",null);
                    localStorage.setItem("remPw",null);
                    localStorage.setItem("cheSta",0);
                    $.ajax({
                        type:"POST",
                        url:"/butlerp/logout",
                        dataType:"json",
                        data:{
                            username:$("#user_input").val(), 
                            password:$("#pw_input").val()
                        },
                        beforeSend: function(){},
                        success: function(json){
                           // console.log(json);
                            window.location.href="/butlerp";
                        },
                        error: function(json){},
                        complete: function(json){}
                    })
                }
            },
            error:function(json){

            },
        })
    }
}

function back(){
    window.history.go(-1);
}