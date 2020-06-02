// JavaScript Document
$(document).ready(function(e) {
    if($.cookie("user")=="true"){
		$("#mobile").val($.cookie("mobile"))
	}
	$(".ch_box img").on("click",function(){
		if($(this).attr("src")=="/static/account/img/checked.png"){
			$(this).attr("src","/static/account/img/checkbox.png");
		}else{
			$(this).attr("src","/static/account/img/checked.png");	
		}
	})
	$("#forlabel").on("click",function(){
		if($(this).siblings("img").attr("src")=="/static/account/img/checked.png"){
			$(this).siblings("img").attr("src","/static/account/img/checkbox.png");
		}else{
			$(this).siblings("img").attr("src","/static/account/img/checked.png");	
		}	
	})
	/*关闭弹窗*/
	$(".close_pop_form").on("click",function(){
		$(this).parents("").hide();	
		window.parent.checked_out();//暂时给蚂蚁金服使用 11-4
	})
	/*鼠标进入输入框，错误提示消失*/
	$("#password,#mobile").on("focus",function(){
		$("#err_info").html("空").css("visibility","hidden");	
	})
	$("#sub").on("click",function(){
			var mobile=$("#mobile").val();
			var password=$("#password").val();
			var err_info=$("#err_info").text();    
			if(mobile==""){
				$("#err_info").html("<img src='/static/account/img/red_exclam.png'>手机号码不能为空").css("visibility","visible");
				return false;
			}if(!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))){
				$("#err_info").html("<img src='/static/account/img/red_exclam.png'>手机号码格式不正确").css("visibility","visible");
				return false;
			}if(password==""){
				$("#err_info").html("<img src='/static/account/img/red_exclam.png'>密码不能为空").css("visibility","visible");
				return false;
			}else{
				auto_login(mobile,password);
			}
			
	})
});
function auto_login(mobile,password){
		$("#err_info").css("visibility","hidden");
		   $.ajax({
				type:'POST',
				url:'Login',
				dataType:'json',
				data:{mobile:mobile,password:password},/*,url:$("#redirect_url").val()*/
				beforeSend:function(){
					$("#sub").val("正在登录");
				},
				success:function(data){
					if (data.code==0) {
						$("#err_info").html("<img src='/static/account/img/red_exclam.png'>"+data.info+"").css("visibility","visible");
						$("#sub").val("立即登录");
					}else if (data.code==1) {
						$("#err_info").text(data.info).css("visibility","hidden");
					/*	if($("#redirect_url").val() != ''){
							document.location=$("#redirect_url").val();
						}else{*/
							$(".form_pic").hide();
							window.parent.checked_out('true');//暂时给蚂蚁金服使用(登录成功) 11-4
					/*	}*/
					}
				},
				error:function(){},
				complete:function(){}
    		}) 	
}





























