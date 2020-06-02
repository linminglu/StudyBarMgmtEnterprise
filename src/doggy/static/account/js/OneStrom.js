// JavaScript Document
/*=======================================
2016.9-29 罗杨 单店版诊所信息
=========================================*/
//获取诊所信息
//先获取诊所列表，单店版只能获取到一个
		//获取诊所信息
var clinicid=$("#clinicid_hide").text();//隐藏的诊所id
jQuery.createAniCss();
$.ajax({
	type:"POST",
	url:"/clinic/singleclinicinfo",
	cache: false,
	dataType:"json",
	beforeSend:function(){
		 jQuery.loading('加载中',1);
	},
	success: function(result){
		// console.log(result);
		//result.code=2;
		// console.log(result.code);
		if(result.code==2){
			$("#loading_info").hide();
			jQuery.showError('您没有权限查看数据!','信息反馈');
			jQuery.loading_close();
			reutrn;
		}
		if(result.code==1){
			var logo=result.list[0].logo;//诊所logo
			var clinciNmae=result.list[0].name;//诊所名称
			var contact=result.list[0].contact;//诊所联系人
			var dentalid=result.list[0].dentalid;//管家号
			var phone=result.list[0].phone;//诊所电话
			var info=result.list[0].info;//诊所信息
			var province=result.list[0].clinicprovince;//省份
			var city=result.list[0].cliniccity;//城市
			var area=result.list[0].clinicarea;//地区
			var address=result.list[0].address;//详细地址
			clinicid = result.list[0].clinicid
			if(logo==""||logo==undefined){
				$("#logo").attr("src","/static/account/img/clinic_logo.png");
			}else{
				$("#logo").attr("src",logo);
			}
			$("#clinciNmae").val(clinciNmae);
			$("#contact").val(contact);
			$("#manage_num").val(dentalid);
			$("#phone").val(phone);
			$("#info").val(info);
			if(province==""){
				$("#province").text("省份");
			}else{
				$("#province").text(province);
			}
			$("#province_down_list p").each(function(){   //激活城市选择
                 if($(this).text()==""+province+""){
                     $(this).trigger("click");
                }
            })
			if(city==""){
				$("#city").text("城市");
			}else{
				$("#city").text(city);
			}
			$("#city_down_list p").each(function(){   //激活地区选择
                 if($(this).text()==""+city+""){
                     $(this).trigger("click");
                }
            })
			if(area==""){
				$("#area").text("地区");
			}else{
				$("#area").text(area);
			}
			$("#address").val(address);
			$("#clinicid_hide").text(result.list[0].clinicid);
			$("#save").attr("disabled",true).addClass("ac_btn_bf_disable");
		}
	},
	error:function(data){},
	complete:function(){
		jQuery.loading_close();
	}
})

var creditid="";
//获取资质认证
	$.ajax({
		type:"POST",
		url:"/clinic/cliniccreditinfo",
		dataType:"json",
		beforeSend:function(result){
			jQuery.loading('加载中',1);
		},
		success:function(result){
			//console.log(result);
			if(result==null){
				$("#clinic_s").children("input").attr("value","").children("img").attr("src","/static/account/img/per_mana_icon_3.png");	
			}else{
				if(result.list!=null){
					var status=result.list[0].datastatus;
					if(status==0||status==2){//正常
						$("#clinic_s input").removeAttr("disabled");
						$("#clinic_s input").removeAttr("style");
						var companyname=result.list[0].companyname;
						var idcardfile=result.list[0].idcardfile;
						var scanningfile=result.list[0].scanningfile;
						var licenseid=result.list[0].licenseid;
						var experience=result.list[0].experience;
						var chairnumber=result.list[0].chairnumber;
						var space=result.list[0].spaceroom;
						creditid=result.list[0].creditid;
						$("#clinic_name_one").val(companyname);//企业全称
						$("#img_credit").attr("src",idcardfile);//身份证扫描件
						$("#img_lince").attr("src",scanningfile);//营业执照扫描件
						$("#licenseid").val(licenseid);//营业执照注册号
						$("#experience").val(experience);//经营年限
						$("#chairnumber").val(chairnumber);//牙椅数量
						$("#space").val(space);//门店面积
					}else if(status==1){//通过了，无法修改
						$("#clinic_s input").removeAttr("disabled");
						$("#clinic_s input").removeAttr("style");
						var companyname=result.list[0].companyname;
						var idcardfile=result.list[0].idcardfile;
						var scanningfile=result.list[0].scanningfile;
						var licenseid=result.list[0].licenseid;
						var experience=result.list[0].experience;
						var chairnumber=result.list[0].chairnumber;
						var space=result.list[0].spaceroom;
						creditid=result.list[0].creditid;
						$("#clinic_name_one").val(companyname);//企业全称
						$("#img_credit").attr("src",idcardfile);//身份证扫描件
						$("#img_lince").attr("src",scanningfile);//营业执照扫描件
						$("#licenseid").val(licenseid);//营业执照注册号
						$("#experience").val(experience);//经营年限
						$("#chairnumber").val(chairnumber);//牙椅数量
						$("#space").val(space);//门店面积
						$("#clinic_s input").attr("disabled","true");
					}	
				}
			}
		},
		error:function(result){
			/*console.log(result);*/
		},
		complete:function(){
			jQuery.loading_close();
		}
	})

//全局变量 判断是否被改变
var saveStatus=0;
$("#clinic_f input[type='text']").on("input propertychange",function(){
	saveStatus=1;
	changeSave();
});
$("#clinic_s input[type='text']").on("input propertychange",function(){
	saveStatus=1;
	changeSave();
});
$("#clinic_f #province,#clinic_f #city,#clinic_f #area").on("click",function(){
	saveStatus=1;
	changeSave();
});
$("#clinic_f #info").on("input propertychange",function(){
	saveStatus=1;
	changeSave();
});
$("#upload1,#upload_credit,#upload_lince").click(function(){
	saveStatus=1;
	changeSave();
})
function changeSave(){
	if(saveStatus==1){
		$("#save").attr("disabled",false).removeClass("ac_btn_bf_disable");
	}else{
		$("#save").attr("disabled",true).addClass("ac_btn_bf_disable");
	}
}

/*保存诊所信息以及资质认证*/
$("#save").click(function(){
	$.ajax({
        type:"POST",
        url:"/member/precheck",
        dataType:"json",
        data:{
            id:60011
        },
        beforeSend: function(){},
        success: function(json){
            console.log(json);
            if(json.code==1){
               oneInfoSave();
            }else{
                jQuery.showError('您没有此功能操作权限!','信息反馈');
                return false;
            }
        },
        error: function(json){console.log(json);},
        complete: function(json){}
    })
	function oneInfoSave(){
		var s1=$("#clinic_f").css("display");
		var s2=$("#clinic_s").css("display");
		if(s1=="block"){
			/*判断诊所信息是否为空*/
			var clinicname=$("#clinciNmae").val();//诊所名称
			var contact=$("#contact").val();//诊所联系人
			var phone=$("#phone").val();//诊所联系电话
			var address=$("#address").val();//诊所地址
			
			var base64 = $("#logo").attr("src");
			imagedata=base64.substr(base64.indexOf(',') + 1);	//诊所logo
			var pic_logo=$("#pic_logo").val();
			
			var info=$("#info").val();//诊所介绍
			var province=$("#province").text();//诊所省份
			var city=$("#city").text();//诊所城市
			var area=$("#area").text();//诊所地区
			var detailedAdd=$("#province option:selected").text()+" "
			+$("#city option:selected").text()+" "
			+$("#area option:selected").text()+" "+address;
			if(clinicname==""){
				$("#clinciNmae").focus().addClass("errborder");
				$("#clinic_err").html("诊所名称不能为空").css("visibility","visible");
				return false;
			}else if(contact==""){
				$("#contact").focus().addClass("errborder");
				$("#contact_err").html("诊所联系人不能为空").css("visibility","visible");	
				return false;
			}else if(phone==""){
				$("#phone").focus().addClass("errborder");
				$("#phone_err").html("电话号码不能为空").css("visibility","visible");
			}else if(phone.length<7){
				$("#phone").focus().addClass("errborder");
				$("#phone_err").html("电话号码长度不能小于7位").css("visibility","visible");
				return false;
			}
			$.ajax({
				type:"POST",
				url:"/clinic/savesingleclinicinfo",
				data:{
					clinicid:clinicid,
					name:clinicname,
					contact:contact,
					phone:phone,
					address:address,
					imgdata:imagedata,
					pic_ext:pic_logo,
					info:info,
					clinicprovince:province,
					clinicCity:city,
					clinicarea:area
				},
				dataType:"json",
				beforeSend:function(){
					$("#save").val("正在保存中");
					saveStatus=0;
					changeSave();
				},
				success: function(result){
					localStorage.setItem("clinicname",$("#clinciNmae").val());
					localStorage.setItem("clinicphoto",$("#logo").attr("src"));
					$("#save_success_div").show();
					setTimeout(function(){$("#save_success_div").hide();},1000);
					window.location.reload();
					saveStatus=0;
					changeSave();
				},
				error: function(result){
					// console.log(result);
				},
				complete:function(){
					$("#save").val("保存");
					saveStatus=0;
					changeSave();
				}
			})	
		}else{
			/*判断资质认证是否为空*/
			var companyname=$("#clinic_name_one").val();//企业全称
			var idcardfile=$("#img_credit").attr("src");//身份证扫描件
				idcardfile=idcardfile.substr(idcardfile.indexOf(',') + 1);
			var pic_credit=$("#pic_credit").val();
					
			var scanningfile=$("#img_lince").attr("src");//营业执照扫描件
				scanningfile=scanningfile.substr(scanningfile.indexOf(',') + 1);
			var pic_lince=$("#pic_lince").val();	
			
			var licenseid=$("#licenseid").val();//营业执照注册号
			var experience=$("#experience").val();//经营年限
			var chairnumber=$("#chairnumber").val();//牙椅数量
			var space=$("#space").val();//门店面积
			//console.log(companyname);
			if(companyname==""){  
				$("#clinic_name_one").focus().addClass("errborder");
				$("#cname_err").html("企业名称不能为空").css("visibility","visible");
				return false;
			}else if(licenseid==""){
				$("#licenseid").focus().addClass("errborder");
				$("#cnum_err").html("营业执照注册号不能为空").css("visibility","visible");
				return false;
			}else if(scanningfile=="/static/account/img/u1910.png"||scanningfile==undefined||scanningfile==""){
				$("#licen_img_err").css("visibility","visible");
				return false;
			}else if(idcardfile=="/static/account/img/u1910.png"||idcardfile==undefined||idcardfile==""){
				$("#idcard_img_err").css("visibility","visible");
			}else if(experience==""){
				$("#experience").focus().addClass("errborder");
				$("#year_err").html("经营年限不能为空").css("visibility","visible");
				return false;
			}else if(chairnumber==""){
				$("#chairnumber").focus().addClass("errborder");
				$("#num_err").html("牙椅数量不能为空").css("visibility","visible");
				return false;
			}else if(space==""){
				$("#space").focus().addClass("errborder");
				$("#area_err").html("门店面积不能为空").css("visibility","visible");
				return false;
			}	
			$.ajax({
				type:"POST",
				url:"/clinic/savecliniccredit",
				data:{
					clinicid:clinicid,
					companyname:companyname,
					idcardfileimg:idcardfile,
					pic_ext2:pic_credit,
					licenseid:licenseid,
					experience:experience,
					chairnumber:chairnumber,
					spaceroom:space,
					scanningfileimg:scanningfile,
					pic_ext:pic_lince,
					creditid:creditid
				},	
				dataType:"json",
				beforeSend:function(){
					$("#save").val("正在保存中");
					saveStatus=0;
					changeSave();
				},
				success: function(result){
					if(result.code==1){
						$("#save_success_div").show();
						setTimeout(function(){$("#save_success_div").hide();},2000);
						saveStatus=0;
						changeSave();
					}else if(result.code==0){
						// alert(result.msg);
						jQuery.postFail('fadeInUp',result.info);
					}
				},
				error: function(result){
					jQuery.waring('网络错误！请重试');	
				},
				complete:function(){
					$("#save").val("保存");
					saveStatus=0;
					changeSave();
				}
			})		
		}
	}

})
/*短信验证 开通连锁*/
$(document).ready(function() {	  
        var btn_getCode=$("#getCode");//获取验证码按钮
        var txt_con=$("#contacs_user");//获取联系人
        var txt_tel=$("#user_tel");//获取手机号
        var txt_code=$("#tel_code");//获取验证码
        var btn_next=$("#next");//获取下一步
        var btn_cmp=$("#complete");//完成按钮
        var txt_comName=$("#company_name");//企业名称
        $("#user_tel,#tel_code,#company_name").on("keyup onclick onblur",function(){
          if (txt_tel.val()==""||txt_code.val()=="") {
              btn_cmp.css("backgroundColor","#ccc").attr("disabled","disabled");
          }else{
              btn_cmp.removeAttr("disabled");
              btn_cmp.removeAttr("style");
          }
          if(txt_comName.val()==""){
              btn_next.css("backgroundColor","#ccc").attr("disabled","disabled");
          }
          else{
              btn_next.removeAttr("disabled"); 
              btn_next.removeAttr("style");
          }
        }) 
		btn_getCode.css("color","#ccc").attr("disabled","true");//先将获取验证码按钮禁用，
     $("#user_tel").bind("onclick keyup onblur",function(){
            if (!(/^1[3|4|5|7|8]\d{9}$/.test($(this).val()))) {
             btn_getCode.css("color","#ccc").attr("disabled","true");
            }else{
              btn_getCode.css("color","#00c5b5").removeAttr("disabled"); 
            }
       })
       
});	
 /*倒计时*/
var timeCount=null;
function timedd(){
    var btn_getCode=$("#getCode");//获取验证码按钮
	clearInterval(timeCount);
	btn_getCode.css("color","#ccc"); 
	var time=60;
	timeCount=setInterval(function(){
		time-=1;
		code_time=time+"秒";
		if (time==0) {  
		  clearInterval(timeCount);
		  btn_getCode.val("重新获取验证码").css("color","#00c5b5").removeAttr("disabled");
		  btn_getCode.attr("disabled");
		}else if (time>0){
		  btn_getCode.val(code_time).attr("disabled","true");
		}
	},1000)
}      
$("#getCode").unbind("click").click(function(){
	timedd();
/*	console.log($("#user_tel").val());*/
	$.ajax({
		type:"POST",
		url:"/member/sendregcode",
		data:{mobile:$("#user_tel").val()},
		dataType:"json",
		beforeSend: function(){
			
		},
		success: function(data){
			//console.log(data);
			if(data.code==1){
				jQuery.postOk('fadeInUp',data.info);
			}else{
				jQuery.postFail('fadeInUp',data.info);
			}
		},
		error: function(data){
			jQuery.postFail('fadeInUp',data.info);
		},
		complete: function(){},
	})	
})
/*开通完成*/
$("#complete").click(function(){
	//console.log($("#tel_code").val())
	$.ajax({
		type:"POST",
		url:"/clinic/addchain",
		data:{
			mobile:$("#user_tel").val(),
			chainname:$("#company_name").val(),
			vcode:$("#tel_code").val(),
			contact:$("#contacs_user").val()
		},
		dataType:"json",
		beforeSend: function(){},
		success: function(data){
			//console.log(data);
			if(data.code==0){
				//alert(data.msg);
				jQuery.postFail('fadeInUp',data.info);	
			}else{
				$.ajax({               //存储数据给后台
					type:"POST",
					url:"/clinicmanage/savechainsess",
					dataType:"json",
					data:{
						mchainid:data.list.chainid,
						mchainame:data.list.chainname,
						mtype:data.list.mtype==1?1:0
					},
					beforeSend: function(){
						 localStorage.setItem("clinicname",data.list.chainname);
					},
					success: function(json){
						//console.log(json);
						localStorage.setItem("chainusername",json.list.chainusername);
						window.location.href="/clinic/chainmanage";	
					},
					error: function(json){
						//console.log(json);
					},
					complete: function(json){
						//console.log(json);
					}
				})
			}
		},
		error: function(data){},
		complete: function(){},
	})	
})
//打开创建连锁第一步
$("#edit_chain").click(function(e){
	$("#open_chain_box").show();
	$(".popup_bg").show();
	$("body").css("overflow","hidden");
})
//第二步
$("#next").click(function(){
	$("#open_chain_box").hide();
	$("#open_chain_box2").show();
})
//返回第一步
$("#return").click(function(){
	$("#open_chain_box2").hide();
	$("#open_chain_box").show();
})
//关闭弹窗
$("#close_ale2,#close_ale").click(function(){
	$(this).parents(".ale_box").hide();
	$(".popup_bg").hide();
	$("body").css("overflow","auto");
})

$("	#chain_ops").on("click",function(e){
	e.stopPropagation();	
})
 /*划过时候变化小图片*/
$("#close_ale2,#close_ale").mouseover(function(){
    $(this).attr("src","/static/account/img/close.png")
})
$("#close_ale2,#close_ale").mouseout(function(){
    $(this).attr("src","/static/account/img/close_2.png")
})
$("#return").mouseover(function(){
  $(this).attr("src","/static/account/img/back.png")
})
$("#return").mouseout(function(){
  $(this).attr("src","/static/account/img/back_2.png")
})
/*点击左边切换*/
$("#clinic_list li").click(function(){
	var index=$(this).index();
	saveStatus=0;//切换后保存的变为不可点击
	changeSave();
	$("#clinic_list li[data-f='1']").attr("data-f","0");
	$(this).attr("data-f","1");
	$("#clinic_box .clinci_inform").eq(index).show().siblings("clinci_inform").hide();
	if(index==0){
			$("#clinic_f").show().siblings("#clinic_s").hide();
			$(this).find("img").attr("src","/static/account/img/clinic_archives_1.png");
			$(this).siblings("li").find("img").attr("src","/static/account/img/certification_2.png");
	}
	else if(index==1){
		$("#clinic_s").show().siblings("#clinic_f").hide();
		$(this).find("img").attr("src","/static/account/img/certification_1.png");
		$(this).siblings("li").find("img").attr("src","/static/account/img/clinic_archives_2.png");
	}	
})
$(".clinic_box input[type='text']").on("focus",function(){
	clearerrinfo2();
})
//错误提示消失事件
function clearerrinfo2(){
	$(".clinic_box input[type='text']").removeClass("errborder");
	$(".clinic_box input[type='text']").siblings(".errinfo").css("visibility","hidden");
}
