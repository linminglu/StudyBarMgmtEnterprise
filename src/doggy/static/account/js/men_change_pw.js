/*重新输入密码时清空错误提示*/
$("#old_pw,#new_pw,#r_confim").focus(function(){
    $("#pw_errInfo,#form_tip_pw,#form_tip_rpw").hide();
	$(this).css("border","1px solid #e0e0e0");
});
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
var pwsafenum=0;
$("#new_pw").bind('keyup onfocus onblur',function(){
    if($("#new_pw").val()==""){
        $("#password_range").hide();
        $(".password_newold2").css("margin-bottom","30px");
    }else{
        $("#password_range").show();
        $(".password_newold2").css("margin-bottom","2px");
    }
    var index=checkStrong($(this).val());
    /*    console.log(index);*/
    // if (index==0) {
    //     $("#password_range .range").attr("class","range");
    //     $("#range4").text("弱");
    //     pwsafenum=1;
    // }
    if (index==1) {
        $("#password_range .range").eq(index-1).addClass("range1").removeClass("range3 range2");
        $("#password_range .range").eq(index).removeClass("range2 range3 range1");
        $("#password_range .range").eq(index+1).removeClass("range3");
        $("#range4").text("弱");
        $("#range4").css("color","#ff4c4c");
        pwsafenum=1;
    }
    if (index==2) {
        $("#password_range .range").eq(index-1).addClass("range2").removeClass("range3 range1");
        $("#password_range .range").eq(index-2).addClass("range2").removeClass("range1 range3");
        $("#password_range .range").eq(index).removeClass("range3");
        $("#range4").text("中");
        $("#range4").css("color","#ffa30a");
        pwsafenum=2;
    }
    if (index==3) {
        $("#password_range .range").eq(index-1).addClass("range3");
        $("#password_range .range").eq(index-2).addClass("range3").removeClass("range2");
        $("#password_range .range").eq(index-3).addClass("range3").removeClass("range2");
        $("#range4").text("强");
        $("#range4").css("color","#4bc941");
        pwsafenum=3;
    }
})
/*更改登录密码*/
$("#setting_confim").click(function(){
	check_pw_rpw();	
    if (check_pw_rpw()==false) {		
		return false;
	}else{
        $.ajax({
            type:"POST",
            url:'/member/ChangePwd',
            dataType:'json',
            data:{
                oldpassword:$("#old_pw").val(),
                password:$("#new_pw").val(),
                password_confirm:$("#r_confim").val(),
                passwordcomplexity:pwsafenum
                },
            beforeSend:function(){
                	//$(this).attr("value","修改中...");			 //zlb 2016-09-23 加入状态控制
            },
            success:function(data){
                console.log(data);
            if (data.code==1) {
                // setTimeout(function(){
                //     //document.location='/logout';
                // },2000) 
                window.location.href='/login';
                }else if(data.code==0){
                    $("#pw_errInfo").html("<img src='/static/account/img/red_exclam.png'>"+data.info+"").show();
                    $("#old_pw").css("border","1px solid #f86d5a");
                    //$("#setting_confim").attr("disabled",false).text('确定');				
                }
            },
            error:function(data){},
            complete:function(data){},
        })
    }
    
})

// $("#r_confim").blur(function(){
//    check_pw_rpw();
// });
function check_pw_rpw () {
    if($("#old_pw").val()==''){
		$("#pw_errInfo").html("<img src='/static/account/img/red_exclam.png'>旧密码不能为空").show();
		$("#old_pw").css("border","1px solid #f86d5a");
		return false;  
	}if($("#new_pw").val()==''){
        $("#form_tip_pw").html("<img src='/static/account/img/red_exclam.png'>新密码不能为空").show();
		$("#new_pw").css("border","1px solid #f86d5a");
        return false;        
    }if($("#r_confim").val()==''){
        $("#form_tip_pw").html("<img src='/static/account/img/red_exclam.png'>确认密码不能为空").show();
		$("#r_confim").css("border","1px solid #f86d5a");
        $("#form_tip_pw").css("top","105px");
        return false;        
    }else{
        $("#form_tip_pw").hide();
		("#old_pw,#new_pw,#r_confim");
		if($("#r_confim").val().length<6||$("#new_pw").val().length>16){
			$("#form_tip_rpw").html("<img src='/static/account/img/red_exclam.png'>密码长度为6-16位").show();
			return false;
		}else if($("#r_confim").val()!=$("#new_pw").val()){
            $("#form_tip_rpw").html("<img src='/static/account/img/red_exclam.png'>两次密码不一致").show(); 
            return false;
        }else{
            $("#form_tip_rpw").hide();
			$("#pw_errInfo").hide();
            return true; 
        }
    }
   
    
}
