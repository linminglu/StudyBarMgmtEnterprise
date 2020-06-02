var getRemAcc=localStorage.getItem("remAcc");
var getRemPw=localStorage.getItem("remPw");
var getCheSta=localStorage.getItem("cheSta");
if(getRemAcc!=null&&getRemAcc!="null"){
    $("#user_input").val(""+getRemAcc+"");
}else{
     $("#user_input").val("");
}
if(getRemPw!=null&&getRemPw!="null"){
    $('#pw_input').val(""+getRemPw+"");
}else{
    $('#pw_input').val("");
}
if(getCheSta==1){
    $("#rem_pw").attr("checked",true);
}else{
    $("#rem_pw").attr("checked",false);
}
$("#login_button").click(function(){
    $.ajax({
        type:"POST",
        url:"/butlerp",
        dataType:"json",
        data:{
            username:$("#user_input").val(), 
	        password:$("#pw_input").val()
        },
        beforeSend: function(){
            $("#login_button").val("登录中...");
        },
        success: function(json){
            console.log(json);
            if(json.code==1){
                if($("#rem_pw").is(":checked")){
                    localStorage.setItem("remAcc",$("#user_input").val());
                    localStorage.setItem("remPw",$('#pw_input').val());
                    localStorage.setItem("cheSta",1);
                }else{
                    localStorage.setItem("remAcc",null);
                    localStorage.setItem("remPw",null);
                    localStorage.setItem("cheSta",0);
                }
               window.location.href="/butlerp/dashboard";
            }
        },
        error: function(json){},
        complete: function(json){
            $("#login_button").val("登录");
        }
    })
})