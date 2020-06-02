
//个人中心首页获取数据

var date=new Date();
var datetime = date.getFullYear()
                + "-"// "年"
                + ((date.getMonth() + 1) > 10 ? (date.getMonth() + 1) : "0"
                        + (date.getMonth() + 1))
                + "-"// "月"
                + (date.getDate() < 10 ? "0" + date.getDate() : date
                        .getDate())
                + " "
                + (date.getHours() < 10 ? "0" + date.getHours() : date
                        .getHours())
                + ":"
                + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                        .getMinutes())
                + ":"
                + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
                        .getSeconds());
//console.log(datetime);
//console.log(date.getHours());
$("#login_time").text(datetime);
$(".mes_con .p2").attr("id",date.getHours());
$.ajax({
	type:"GET",
	url:"Perinfo",
	dataType:"json",
	beforeSend: function(){},
	success: function(json){
        //console.log(json);
        if(json.list[0].picture!=null&&json.list[0].picture!=""){
            $("#men_index_pho img").attr("src",""+json.list[0].picture+"");
        }
        $("#accout_pho").text(json.list[0].mobile+"，");
        $("#mobile_sub").text(json.list[0].mobile);
        $("#old_phone").text(json.list[0].mobile);
        var moble_html=$("#mobile_sub").html();
        $("#mobile_sub").html("已绑定"+moble_html.substring(0,3)+"****"+moble_html.substring(7,11));
        $("#Img1").attr("src",""+json.list[0].picture+"");
        $("#per_name").val(json.list[0].name);
    },
	error: function(json){console.log(json);},
	complete: function(json){
        // console.log(json);
    }
})

//我的消息获取数据
$.ajax({
    type:"Post",
    url:"/member/mymsg",
    dataType:"json",
    data:{
        per_page:10,
        page:1
    },
    success:function(json){
        console.log(json);
        var str="";
        if(json.list!=null){
             $.each(json.list,function(k,v){
                 //console.log(k);
                 if(k<4){
                     str+='<li><a href="/member/mymsgindex">'+v.title+'</a></li>';
                 }
            })
        }else{
             str+='<li style="font-size:12px;color:#696969;">暂无消息</li>';
        }
        $("#permes_ul").html(str);
    }
})


//跳转
$("#mouse_wonder1").click(function(){
    window.location.href="member_per_info";
});
$("#mouse_wonder2").click(function(){
    window.location.href="change_per_phone";
});
$("#mouse_wonder3").click(function(){
    window.location.href="ChangePwdEnter";
});



/*判断当前时间早上中午晚上*/
var hour=$(".mes_con .p2").attr("id");
//console.log(hour);
if(hour<6){$("#hello_time").text("凌晨好！");}
else if(hour<9){$("#hello_time").text("早上好！");}
else if(hour<12){$("#hello_time").text("上午好！");}
else if(hour<14){$("#hello_time").text("中午好！");}
else if(hour<17){$("#hello_time").text("下午好！");}
else if(hour<19){$("#hello_time").text("傍晚好！");}
else if(hour<22){$("#hello_time").text("晚上好！");}
else{$("#hello_time").text("夜里好！");} 





/*绑定手机步骤*/
var timeV=null;
var get_num=document.getElementById("btn2");

function code_disab(){
    get_num.style.backgroundColor="#cdcdcd";
    get_num.setAttribute("disabled", true);  
}

function code_enabled(){
    get_num.style.backgroundColor="#00c5b5";
    get_num.removeAttribute("disabled");  
}

var get_num1=document.getElementById("btn1");
code_disab1();

function code_disab1(){
    var get_num1=$("#btn1");
    get_num1.css("backgroundColor","#cdcdcd");
    get_num1.attr("disabled", true);  
}
function code_enabled1(){
    var get_num1=$("#btn1");
    get_num1.css("backgroundColor","#00c5b5");
    get_num1.removeAttr("disabled");  
}
function check_mb(obj){
    var reg=/^1[3|4|5|7|8]\d{9}$/; 
    if(!reg.test($(obj).val())){ 
        code_disab1();
    }else{
       code_enabled1();
    } 
};
/*--------------
更改绑定手机 接口对接 黄凯 2016.9.20
---------------*/
function timeNew(){
    var wait=60;
    timeV=window.setInterval(function(){
        if (wait==0) {
            clearInterval(timeV);
            code_enabled();
            get_num.value="获取验证码"; 
         }else{
            code_disab();
            get_num.value=wait+"秒";
            wait--;
         }  
    },1000)
}


function timeNew1(){
    var wait=60;
    timeV=window.setInterval(function(){
        if (wait==0) {
            clearInterval(timeV);
            code_enabled1();
            get_num1.value="获取验证码"; 
         }else{
            code_disab1();
            get_num1.value=wait+"秒";
            wait--;
         }  
    },1000)
}
//原手机获取验证码
$("#btn2").click(function(){
	timeNew();
	$.ajax({
        type:"POST",
        url:"GetVirefyCode",
        dataType:"json", 
        data:{
            type:1,
            mobile:$("#old_phone").text()
        },       
        beforeSend: function(json){},
        error: function(json){},
        success: function(json){
           console.log(json);
           if(json.code==1){
			   //alert("您的验证码已发送，请耐心等待。");
			   //popdivAnim('bounceInDown','您的验证码已发送，请耐心等待。!'); //zlb 2016-09-22
           }else{
			   //alert(json.info);
			   //popdivAnim('bounceInDown',json.info); //zlb 2016-09-22    
			}			 
        },
        complete: function(json){}
	});
})
//检验原手机验证码是否正确
$("#next_step1").click(function(){
    if($("#code1").val()==""){
        $(".sub_tips").show();
        $("#code1").css("border-color","#f86d5a");
        return false;
    }
	$.ajax({
        type:"POST",
        url:"CheckVirefyCode",
        dataType:"json", 
        data:{
        	mobile:$("#old_phone").text(),
        	code:$("#code1").val()
        },       
        beforeSend: function(json){},
        error: function(json){},
        success: function(json){
        	console.log(json);
        	if (json.code==1){
        		$("#psw_box1").hide();
				$("#psw_box2").show();
        	}else{
        		//alert(json.data);
				//popdivAnim('bounceInDown',json.data); //zlb 2016-09-22
                $(".sub_tips").show();
                $(".sub_tips label").text(""+json.info+"");
                $("#code1").css("border-color","#f86d5a");
                /*setTimeout($(".error_p").hide(),3000);*/
        	}
        },
        complete: function(json){}
	});
});


$("#code1").focus(function(){
    $(".sub_tips").hide();
    $("#code1").css("border-color","#00c5b5");
    $("#code1").css("outline","none");
})

$("#code1").blur(function(){
    $("#code1").css("border-color","#e0e0e0");
})


//新手机获取验证码
$("#btn1").click(function(){
    if($("#phone_num").val()==$("#old_phone").text()){
        $("#form_tip_phone label").text("新手机号与原手机号相同!");
        $("#phone_num").css("border-color","#f86d5a")
        $("#form_tip_phone").show();
        return false;
    };
	timeNew1();
	$.ajax({
        type:"POST",
        url:"GetVirefyCode",
        dataType:"json", 
        data:{
            type:2,
            mobile:$("#phone_num").val()
        },       
        beforeSend: function(json){},
        error: function(json){},
        success: function(json){
           console.log(json);
           if(json.code==1){
			   //alert("您的验证码已发送，请耐心等待。");
		   	  //popdivAnim('bounceInDown',"您的验证码已发送，请耐心等待。"); //zlb 2016-09-22
           }else{
			   //popdivAnim('bounceInDown',json.info); //zlb 2016-09-22
			   //alert(json.info);			   
			   }
        },
        complete: function(json){}
	});
})

$("#phone_num").focus(function(){
    $("#form_tip_phone").hide();
    $("#phone_num").css("border-color","#00c5b5");
    $("#phone_num").css("outline","none");
})
$("#phone_num").blur(function(){
    $("#phone_num").css("border-color","#e0e0e0");
})


$("#code2").focus(function(){
    $("#form_tip_phone").hide();
    $("#code2").css("border-color","#00c5b5");
    $("#code2").css("outline","none");
})
$("#code2").blur(function(){
    $("#code2").css("border-color","#e0e0e0");
})

//新手机验证获取验证码是否正确
$("#next_step2").click(function(){
    if($("#phone_num").val()==""){
        $("#form_tip_phone label").text("手机号为空,请填写!");
        $("#phone_num").css("border-color","#f86d5a");
        $("#form_tip_phone").show();
        return false;
    };
    if($("#phone_num").val()==$("#old_phone").text()){
        $("#form_tip_phone label").text("新手机号与原手机号相同!");
        $("#phone_num").css("border-color","#f86d5a")
        $("#form_tip_phone").show();
        return false;
    };
    if($("#code2").val()==""){
        $("#form_tip_phone label").text("验证码不能为空!");
        $("#code2").css("border-color","#f86d5a")
        $("#form_tip_phone").css("top","90px");
        $("#form_tip_phone").show();
        return false;
    };
	$.ajax({
        type:"POST",
        url:"CheckNewMobileCode",
        dataType:"json", 
        data:{
            oldmobile:$("#old_phone").text(),
        	mobile:$("#phone_num").val(),
        	code:$("#code2").val()
        },       
        beforeSend: function(json){},
        error: function(json){},
        success: function(json){
        	console.log(json);
        	if (json.code==1){
                if(json.list==null){
                    $("#psw_box2").hide();
                    $("#psw_box3").show();
                }else{
                    $("#psw_box2").hide();
                    $("#psw_box4").show();
                    var clinicArr=[];
                    $.each(json.list,function(k,v){
                        if(k<6){
                            clinicArr.push(v.name);
                        }
                    })
                    //console.log(clinicArr.join("、"));
                    $("#hb_clinic_name").text(clinicArr.join("、"));
                    $("#more_clinic_cut").show();
                }
        	}else{
                $("#form_tip_phone label").text(""+json.info+"");
                $("#form_tip_phone").css("top","90px");
                $("#form_tip_phone").show();

        	}
        },
        complete: function(json){}
	});
})

$("#next_step3").click(function(){
    document.location='/login';
	$("#psw_box1").show();
	$("#psw_box3").hide();
})

$("#next_step4").click(function(){
    document.location='/login';
	$("#psw_box1").show();
	$("#psw_box4").hide();
})

// /*更改密保*/
// $("#pw_pro_confim").click(function(){
//     document.location='index.php?m=MemberCenter';
// })

// /*我的勋章弹窗*/
// $(".get_medel_now").click(function(){
// 	$(".re_medel_alerte").show();
// 	setTimeout('$(".re_medel_alerte").fadeOut()',1000);
// 	$(this).attr("data-bg","0");
// 	$(this).html("已领取").siblings(".rec_img").show();
// })
// $(".main_right_coupon .li_right .p3").click(function(){
// 	$(".popup").show();
// 	setTimeout('$(".popup").fadeOut()',1000);
// 	$(this).parents("li").hide();
// })
// $(".main_right_coupon .task_medel").eq(0).show();
// $(".medel_sp").click(function(){
// 	$(".medel_sp[data-medel='1']").attr("data-medel","0");
// 	$(this).attr("data-medel","1");
// 	var index=$(this).index();
// 	$(".main_right_coupon .task_medel").eq(index-1).show().siblings(".task_medel").hide();
// })


