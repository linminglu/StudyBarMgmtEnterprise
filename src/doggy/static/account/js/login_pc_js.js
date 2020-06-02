/*------------------------------
	登录js前端校验处理
	2018-08-31 [zlb]	
 *------------------------------*/
	var timeV=null;
	code_disab();
 $(document).ready(function(e) {
	sessionStorage.removeItem('clinicPosi');
    $(function(){ $('input, textarea').placeholder(); });
	$("#login_bind_phone").click(function(){
		$(".no_bind_phone1").hide();
		$(".no_bind_phone2").show();
	})
	//点击切换登陆框
	$("#mobile_login").on("click",function(){
		$(this).addClass("mobfcus").siblings("li").removeClass("stafcus");
		$("#form1 .login_form").eq(0).show().siblings(".login_form").hide();
	})
	$("#staff_login").on("click",function(){
		$(this).addClass("stafcus").siblings("li").removeClass("mobfcus");
		$("#form1 .login_form").eq(1).show().siblings(".login_form").hide();
	})
	//记住用户名
	if($.cookie("user")=="true"){
		$("#mobile").val($.cookie("mobile"))
	}
	//记住管家号和员工工号
	if($.cookie("user2")=="true"){
		$("#houseID").val($.cookie("houseID"))
	}if($.cookie("user")=="true"){
		$("#staffID").val($.cookie("staffID"))
	}
	$(".ch_box").on("click",function(){
		if($(this).children("img").attr("src")=="/static/account/img/checkbox.png"){
			$(this).children("img").attr("src","/static/account/img/checked.png");
		}else{
			$(this).children("img").attr("src","/static/account/img/checkbox.png")
		}
	})
	$("#forlabel").on("click",function(){
		if($(this).siblings("#is_remember").children("img").attr("src")=="/static/account/img/checkbox.png"){
			$(this).siblings("#is_remember").children("img").attr("src","/static/account/img/checked.png");
		}else{
			$(this).siblings("#is_remember").children("img").attr("src","/static/account/img/checkbox.png")
		}	
	})
	$("#forlabel2").on("click",function(){
		if($(this).siblings("#is_remember2").children("img").attr("src")=="/static/account/img/checkbox.png"){
			$(this).siblings("#is_remember2").children("img").attr("src","/static/account/img/checked.png");
		}else{
			$(this).siblings("#is_remember2").children("img").attr("src","/static/account/img/checkbox.png")
		}	
	})
	$("#reg_phonenum").focus(function(){
		$(".sub_tips_index").hide();
		$("#reg_phonenum").css("border-color","#00c5b5");
		$("#reg_phonenum").css("outline","none");
	})
	$("#reg_phonenum").blur(function(){
		$("#reg_phonenum").css("border-color","#e0e0e0");
	})

	$("#reg_phone").focus(function(){
		$(".sub_tips_index").hide();
		$("#reg_phone").css("border-color","#00c5b5");
		$("#reg_phone").css("outline","none");
	})
	$("#reg_phone").blur(function(){
		$("#reg_phone").css("border-color","#e0e0e0");
	});
	//获取验证码
	$("#reg_sendnum").click(function(){
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
			error: function(json){
				//console.log(json);
			},
			complete: function(json){
				//console.log(json);
			}
		});
	});
	//校验注册验证码
	$("#next_step1").click(function(){
		if($("#reg_phonenum").val()==""){
			$(".sub_tips_index").show();
			$(".sub_tips_index label").text("手机号不能为空");
			$("#reg_phonenum").css("border-color","#f86d5a");
			return false;
		}
		if($("#reg_phone").val()==""){
			$(".sub_tips_index").show();
			$(".sub_tips_index label").text("验证码不能为空");
			$("#reg_phone").css("border-color","#f86d5a");
			return false;
		}else{
			checkCode();
		}
	});

 }); 
/*------------------------------
 登陆对接 2016.9.20 罗杨
  *------------------------------*/
  //验证码时间
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
function checkCode(){
	$.ajax({
		type:"POST",
		url:"/member/checkregcode",  //校验验证码
		dataType:"json",
		data:{
			mobile:$("#reg_phonenum").val(),
			code:$("#reg_phone").val()
		},
		beforeSend: function(){},
		success: function(json){
			if(json.code==0){
				$(".sub_tips_index").show();
				$(".sub_tips_index label").text(json.info);
			}else{
				$.ajax({    //绑定手机
					type:"POST",
					url:"/member/pcbindmobile", 
					dataType:"json",
					data:{
						mobile: $("#reg_phonenum").val(),
						password:$("#clinicPW").val(),
						PasswordComplexity: pwSafeNum,
						clinicid:$("#clinicid").val(),
						koalaid:$("#koalaid").val()
					},
					beforeSend: function(){},
					success: function(json){
						if(json.code==0){
							$(".sub_tips_index").show();
							$(".sub_tips_index label").text(json.info);
							$(".sub_tips_index").css("top","75px");
							$("#reg_phonenum").css("border-color","#f86d5a");
						}else{
						    $("#clinicPW").val("<bINDLogin>")
							 $("#clinic_btn").click()
						}
					},
					error: function(json){},
					complete: function(json){}
				})
			}
		},
		error: function(json){
			//console.log(json);
		},
		complete: function(json){
			//console.log(json);
		}
	})
}
$("#mobile,#password").on("focus keydown",function(){
	$("#error_w").hide();
	$("#error_tel").hide();
	$(this).css("border","1px solid #e0e0e0")
	$("#form1 .remb_user").css("margin-top","-24x");
})
  $(document).keydown(function(e){
        var key=e.keyCode;
        if (key==13) {
			if($(".login_form").eq(0).css("display")=="block"){
				$("#sumbit").click();
			}else{
				$("#clinic_btn").click();
			}
        }
  })
//手机号登录
  $("#sumbit").click(function(){
		if (chk_form()==false) {
			return false;
		}else{
			if(is_remember()=='Y'){
				var mobile=$("#mobile").val();
				var user;
				$.cookie("user","true",{expires:7});
				$.cookie("mobile",mobile,{expires:7});
				
			}else{
				$.cookie("mobile","false",{expires:-1});
			}
			login_sub();
		}
    })
function login_sub(){
    $.ajax({
        type:'POST',
        url:'/pclogin',
        dataType:'json',
        data:{mobile:$("#mobile").val(),password:$("#password").val()},
        beforeSend:function(){
            $("#sumbit").val("正在登录");
        },
        success:function(data){
			//console.log(data);
            if (data.code==0) {
                $("#error_w").show();
				//$("#form1 .remb_user").css("margin-top","-15px");
                $("#err_info").text(data.info);
                $("#sumbit").val("登录");
				// $("#password").css("border-color","#f86d5a");
				// $("#mobile").css("border-color","#f86d5a");
            }else if(data.code==1) {
                $("#error_w").hide();
					window.location.href=data.list.ref;
            }
        },
        error:function(){},
        complete:function(){}
    }) 
}
 function chk_form(){
	var errs_m='';
	var mobile=$("#mobile").val();
	var password=$("#password").val();
    if(mobile==''){
    	$("#error_w").show();
    	errs_m="请输入手机号";
    	$("#err_info").text(errs_m);
		//$("#form1 p").css("top","-34px");
		$("#mobile").css("border-color","#f86d5a");
		return false;
    }
	if (!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))) {
    	$("#error_w").show();
    	errs_m="手机号不符合规范，请确认是否有误";
    	$("#err_info").text(errs_m);
		//$("#form1 p").css("top","-34px");
		$("#mobile").css("border-color","#f86d5a");
    	return false;
    }
    if(password==''){
    	$("#error_tel").show();
    	errs_m="请输入密码";
    	$("#err_tel_info").text(errs_m);
	//	$("#form1 p").css("top","45px");
		$("#password").css("border-color","#f86d5a");
		//$("#form1 .remb_user").css("margin-top","-15px");
		return false;
    }
 }
 //员工登录
 $("#clinic_btn").on("click",function(){ 
	//  console.log("2")
		if(ck_staff()==false){
			return false;
		}else{
			if(is_remember2()=='Y'){
				var houseID=$("#houseID").val();
				var staffID=$("#staffID").val();
				var user2;
				$.cookie("user2","true",{expires:7});
				$.cookie("houseID",houseID,{expires:7});
				$.cookie("staffID",staffID,{expires:7});
			}else{
				$.cookie("houseID",houseID,{expires:-1});
				$.cookie("staffID",staffID,{expires:-1});
			}
		}
		$.ajax({
			type:'POST',
			url:'/pclogin',
			dataType:'json',
			data:{
				dentalid:$("#houseID").val(),
				doctorname:$("#staffID").val(),
				password:$("#clinicPW").val(),
				logintype:'1'
			},
			beforeSend:function(){
				$("#clinic_btn").val("正在登录");
			},
			success:function(data){
				//console.log(data);
				if (data.code==0) {
					$("#err_info2").html(data.info).css("visibility","visible");
					$("#err_info2").css("top","164px");
					$("#clinic_btn").val("登录");
					$(".clinicPw").css("margin-bottom","25px");
					$("#err_info2").css("top","167px");
				}else if(data.code==1) {
						if(data.list.cliniccount>0){  
						window.location.href=data.list.ref;
						}  else {
							$(".mask").show();
						    $(".no_bind_phone1").show();
							$(".login_box").hide();
							$("#clinicid").val(data.list.clinicid)
							$("#koalaid").val(data.list.koalaid)
						}
					
				}
			},
			error:function(){},
			complete:function(){}
		})
})

$(".bind_tip_tit img").click(function(){
	$(".mask").hide();
	$(".no_bind_phone1").hide();
	$(".no_bind_phone2").hide();
})

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

$("#houseID,#staffID,#clinicPW").on("focus",function(){
	$(this).css("border-color","#e0e0e0");
	$("#err_info2").html("").css("visibility","hidden");
	$(".clinicPw").css("margin-bottom","20px");
})
  function ck_staff(){
	  var houseID=$("#houseID");
	  var staffID=$("#staffID");
	  var clinicPW=$("#clinicPW");
	  if(houseID.val()==""){
		  $("#err_info2").html("管家号不能为空！").css("visibility","visible");
		  houseID.css("border-color","#f86d5a");
		  $("#err_info2").css("top","44px");
		  return false;
	  }else if(staffID.val()==""){
		  $("#err_info2").html("员工号或姓名不能为空！").css("visibility","visible");
		  staffID.css("border-color","#f86d5a");
		  $("#err_info2").css("top","104px");
		   return false;
	  }else if(clinicPW.val()==""){
		  $("#err_info2").html("密码不能为空！如若您的牙医管家PC端密码为空请先去PC端设置密码").css("visibility","visible");
		  clinicPW.css("border-color","#f86d5a");
		  $("#err_info2").css("top","167px");
		  $(".clinicPw").css("margin-bottom","42px");
		   return false;
	  }else{
		   return true;
	  }
  }



 function is_remember(){
 	if ($("#is_remember").children("img").attr("src")=="/static/account/img/checked.png") {
 		return 'Y';
 	}else{
 		return 'N';
 	}
 }
  function is_remember2(){
 	if ($("#is_remember2").children("img").attr("src")=="/static/account/img/checked.png") {
 		return 'Y';
 	}else{
 		return 'N';
 	}
 }

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
var pwSafeNum=0;
$("#clinicPW").bind('keyup onfocus onblur',function(){
    var index=checkStrong($(this).val());
    //console.log(index);
    if (index==1) {
		pwSafeNum=1;
    }
    if (index==2) {
		pwSafeNum=2;
    }
    if (index==3) {
		pwSafeNum=3;
    }
})
