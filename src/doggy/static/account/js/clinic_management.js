
//获取连锁店的信息列表 2016-9-29 黄凯
//2016-11-23 罗杨
get_clinic_infolist();
function get_clinic_infolist(){
	$.ajax({
		type:"GET",
		url:"/clinic/clinicinfolist",
		dataType:"json", 
		beforeSend: function(json){ 
			jQuery.loading('加载中',1);
		},
		error: function(json){},
		success: function(json){
			if(json.code==2){
				$("#loading_info").hide();
				jQuery.showError('您没有权限查看数据!','信息反馈');
				jQuery.loading_close();
				reutrn;
			}
			if(json.code==1){
				var str="";
				$.each(json.list,function(k,v){
					str+='<li id='+v.clinicid+'>';
					if(v.credit==1){
						str+='<img src="/static/account/img/authenticated.png">';
					}
					str+='<div>';
					str+='<p class="clinic_name_wh">'+v.name+'</p>';
					str+='<p class="number">'+v.dentalid+'</p>';
					str+='<p class="name">'+v.contact+'</p>';
					str+='</div>';
					str+='</li>';
				})
				$("#clinic_son_list").html(str);
			}else{
				alert(json.info);
			}
		},
		complete: function(json){
			jQuery.loading_close();
		}
	});
}

/*============================
点击档案袋 获取连锁版诊所信息 罗杨2016.9.29
==========================*/
$(document).on("click",".clinic_con ul li",function(){
	var clinicid=$(this).attr("id");
	var dentalid=$(this).find(".number").text();
	//console.log(dentalid);
	// $("#save").unbind("click");
	// $("#submit").unbind("click");
	$(".create_clinic_bg2").children("input").empty();//清空之前所有的信息
	$(".create_clinic_bg2,.clinic").show();
	//获取诊所信息
	$.ajax({
		type:"POST",
		url:"/clinic/singleclinicinfo",
		data:{clinicid:clinicid},
		dataType:"json",
		success: function(result){
		//	console.log(result);
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
				var remove_mobile=result.list[0].bindmobile;//绑定手机
				if(logo==""){
					$("#logo").attr("src","/static/account/img/clinic_logo.png");
				}else{
					$("#logo").attr("src",logo);
				}
				$("#clinciNmae").val(clinciNmae);
				$("#contact").val(contact);
				$("#manage_num").val(dentalid);
				$("#phone").val(phone);
				$("#info").val(info);
				if(province!=""&&province!="省份"){
					$("#province").text(province);
					$("#province_down_list p").each(function(){   //激活城市选择
						if($(this).text()==""+province+""){
							$(this).trigger("click");
						}
					})
					if(city!=""&&city!="城市"){
						$("#city").text(city);
						$("#city_down_list p").each(function(){   //激活地区选择
							if($(this).text()==""+city+""){
								$(this).trigger("click");
							}
						})
					}
					$("#area").text(area);
				}else{
					$("#province").text("省份");
					$("#city").text("城市");
					$("#area").text("地区");
				}
				$("#address").val(address);
				$("#remove_rel_phone").text(remove_mobile.substring(0,3)+"****"+remove_mobile.substring(7,11));
				$("#remove_rel_phone").attr("class",""+clinicid+"");
				$("#bindphoneAn").attr("class",""+remove_mobile+"");
			}
		},
		error:function(){}
	})
	var creditid="";
	//获取资质认证
	$.ajax({
		type:"POST",
		url:"/clinic/cliniccreditinfo",
		data:{clinicid:clinicid},
		dataType:"json",
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
						$("#clinic_name").val(companyname);//企业全称
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
						$("#clinic_name").val(companyname);//企业全称
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
		}
	})
	//保存诊所修改信息
	$("#save").unbind("click").click(function(){
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
					saveClinincInfo();
				}else{
					$(".create_clinic_bg2,.clinic").hide();
					jQuery.showError('您没有此功能操作权限!','信息反馈');
					return false;
				}
			},
			error: function(json){console.log(json);},
			complete: function(json){}
		})
		function saveClinincInfo(){
			var base64 = $("#logo").attr("src");//诊所logo
			var oneExt=$("#pic_logo").val();
			if(oneExt==""){
				logo=base64;
			}else{
				logo=base64.substr(base64.indexOf(',') + 1);
			}	
			//console.log(logo);	
			var clinciNmae=$("#clinciNmae").val();//诊所名称
			var contact=$("#contact").val();//诊所联系人
			var phone=$("#phone").val();//诊所电话
			var info=$("#info").val();//诊所信息
			var clinicprovince=$("#province").text();//省份
			var cliniccity=$("#city").text();//城市
			var area=$("#area").text();//地区
			var address=$("#address").val();//详细地址
			// var detailedAdd=$("#province").text()+" "
			// 		+$("#city").text()+" "
			// 		+$("#area").text()+" "+address;
			if(clinciNmae==""){
				$("#clinciNmae").focus().addClass("errborder").blur();
				$("#clinic_err").html("诊所名称不能为空").css("visibility","visible");
				return false;
			}
			else if(clinciNmae.length<2){
				$("#clinciNmae").focus().addClass("errborder").blur();
				$("#clinic_err").html("诊所名称不能小于两个2字符").css("visibility","visible");
				return false;
			}
			else if(contact==""){
				$("#contact").focus().addClass("errborder").blur();
				$("#contact_err").html("联系人不能为空").css("visibility","visible");
				return false;
			}
			else if(phone==""){
				$("#phone").focus().addClass("errborder").blur();
				$("#phone_err").html("电话号码不能为空").css("visibility","visible");
				return false;
			}
			else if(phone.length<7){
				$("#phone").focus().addClass("errborder").blur();
				$("#phone_err").html("电话号码长度不能小于7位").css("visibility","visible");
				return false;
			}
			$.ajax({
				type:"POST",
				url:"/clinic/savesingleclinicinfo",
				data:{
					clinicid:clinicid,
					name:clinciNmae,
					contact:contact,
					phone:phone,
					address:address,
					imgdata:logo,
					pic_ext:oneExt,
					info:info,
					clinicprovince:clinicprovince,
					clinicCity:cliniccity,
					clinicarea:area
				},
				dataType:"json",
				beforeSend:function(){
					$("#save").val("保存中...").attr("disabled",true);
				},
				success: function(result){
					//console.log(result)	;
					if(result.code==1){
						//jQuery.createAniCss();
						//jQuery.postOk('fadeInUp');
						$(".create_clinic_bg2,.clinic").hide();//关闭弹窗
						$(".create_clinic_bg2,.clinic").children("input[type=text]").val("");
						clearerrinfo();
						$(".clinic_f2").children("img").prop("src","/static/account/img/clinic_logo.png");
						$("#clinic_s").children("img").prop("src","/static/account/img/u1910.png");
						window.location.reload();//重新刷新页面
					}	
				},
				error: function(){},
				conmplete:function(){
					$("#save").val("保存").removeAttr("disabled");
				}
			})
		}
	});
	/*提交资质认证审核以及修改资质认证*/
	$("#submit").unbind("click").click(function(){
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
					saveCredInfo();
				}else{
					$(".create_clinic_bg2,.clinic").hide();
					jQuery.showError('您没有此功能操作权限!','信息反馈');
					return false;
				}
			},
			error: function(json){console.log(json);},
			complete: function(json){}
		})
		/*判断资质认证是否为空*/
		function saveCredInfo(){
			var companyname=$("#clinic_name").val();//企业全称
			var credfile = $("#img_credit").attr("src");//身份证扫描件 	
			var credExt=$("#pic_credit").val();
				if(credExt==""){
					credfile=credfile;
				}else{
					credfile=credfile.substr(credfile.indexOf(',') + 1);
				} 
			var scanning = $("#img_lince").attr("src");//营业执照扫描件	
			var scanningExt=$("#pic_lince").val();
					if(scanningExt==""){
					scanningfile=scanning;
				}else{
					scanningfile=scanning.substr(scanning.indexOf(',') + 1);
				}
			var licenseid=$("#licenseid").val();//营业执照注册号	
			var experience=$("#experience").val();//经营年限
			var chairnumber=$("#chairnumber").val();//牙椅数量
			var space=$("#space").val();//门店面积
			//console.log(scanning)
			if(!companyname){
				$("#clinic_name").focus().addClass("errborder").blur();
				$("#cname_err").html("工商注册名称不能为空").css("visibility","visible");
				return false;
			}else if(!licenseid){
				$("#licenseid").focus().addClass("errborder").blur();
				$("#cnum_err").html("营业执照注册号不能为空").css("visibility","visible");
				return false;
			}else if(scanning=="/static/account/img/u1910.png"||scanning==undefined||scanning==""){
				$("#licen_img_err").css("visibility","visible");
				return false;
			}else if(credfile=="/static/account/img/u1910.png"||credfile==undefined||credfile==""){
				$("#idcard_img_err").css("visibility","visible");
				return false;
			}else if(!experience){
				$("#experience").focus().addClass("errborder").blur();
				$("#year_err").html("经营年限不能为空").css("visibility","visible");
				return false;
			}else if(!chairnumber){
				$("#chairnumber").focus().addClass("errborder").blur();
				$("#num_err").html("牙椅数量不能为空").css("visibility","visible");
				return false;
			}else if(!space){
				$("#space").focus().addClass("errborder").blur();
				$("#area_err").html("门店面积不能为空").css("visibility","visible");
				return false;
			}	
			$.ajax({
				type:"POST",
				url:"/clinic/savecliniccredit",
				data:{
					clinicid:clinicid,
					companyname:companyname,
					idcardfileimg:credfile,
					pic_ext2:credExt,
					scanningfileimg:scanningfile,
					pic_ext:scanningExt,
					experience:experience,
					chairnumber:chairnumber,
					spaceroom:space,
					licenseid:licenseid,
					creditid:creditid
				},	
				dataType:"json",
				beforeSend:function(){
					$("#submit").val("正在提交中...").attr("disabled",true);
				},
				success: function(result){
					//console.log(result);
					if(result.code==1){
						$(".create_clinic_bg2,.clinic").hide();
						$(".create_clinic_bg2,.clinic").children("input[type=text]").val("");
						$(".clinic_f2").children("img").prop("src","/static/account/img/clinic_logo.png");
						$("#clinic_s").children("img").prop("src","/static/account/img/u1910.png");
						clearerrinfo();
						window.location.reload();
					}else if(result.code==0){
						alert(result.info);
					}
				},
				error: function(result){

				},
				complete:function(){
					$("#submit").val("提交审核").removeAttr("disabled");
				}
			})		
		}
	})
})
$(".clinic_box input[type='text']").on("focus",function(){
	clearerrinfo();
})
//错误提示消失事件
function clearerrinfo(){
	$(".clinic_box input[type='text']").removeClass("errborder");
	$(".clinic_box input[type='text']").siblings(".errinfo").css("visibility","hidden");
}
 /*========诊所管理========*/
/*点击左边切换*/
$("#clinic_list li").click(function(){
	$("#clinic_list li[data-f='1']").attr("data-f","0");
	$(this).attr("data-f","1");
	var index=$(this).index();
	if(index==0){
		$("#clinic_f2").show().siblings("div").hide();
		$(this).find("img").attr("src","/static/account/img/clinic_archives_1.png");
		$(this).siblings(".edit_assiue_ccofim").find("img").attr("src","/static/account/img/certification_2.png");
		$(this).siblings(".edit_remove_relative").find("img").attr("src","/static/account/img/remove_relative2.png");
	}else if(index==1){
		$("#clinic_s").show().siblings("div").hide();
		$(this).find("img").attr("src","/static/account/img/certification_1.png");
		$(this).siblings(".edit_clinic_info").find("img").attr("src","/static/account/img/clinic_archives_2.png");
		$(this).siblings(".edit_remove_relative").find("img").attr("src","/static/account/img/remove_relative2.png");
	}else if(index==2){
		$("#clinic_remove_relative").show().siblings("div").hide();
		$(this).find("img").attr("src","/static/account/img/remove_relative1.png");
		$(this).siblings(".edit_clinic_info").find("img").attr("src","/static/account/img/clinic_archives_2.png");
		$(this).siblings(".edit_assiue_ccofim").find("img").attr("src","/static/account/img/certification_2.png");
	}
})
/*右上角图标关闭弹窗*/
$(".clinic_edit img").click(function(){
	$(".create_clinic_bg1").hide();
	$(".create_clinic_bg2").hide();
	$(".clinic input[type='text']").val("");
	clearerrinfo();
	$(".clinic_f2").find("#logo").prop("src","/static/account/img/clinic_logo.png");
	$("#clinic_s").find("#img_credit,#img_lince").prop("src","/static/account/img/u1910.png");
})
//编辑诊所资料 取消按钮
$("#cancle,#cancle2").click(function(){
	$(".create_clinic_bg2").hide();
	$(".clinic input[type='text']").val("");
	clearerrinfo();
})
//关闭创建分诊所的背景和弹窗
$("#enter_cancle").click(function(){
	$(".create_clinic_bg1").hide();
	$(".clinic input[type='text']").val("");
	clearerrinfo();
})	
	


//创建分诊所
$(".estblish_one").click(function(){
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
				$(".create_clinic_bg1").show();
				$.ajax({
					type:"POST",
					url:"/clinic/getlocation",    //通过IP获取当前客户地理位置
					dataType:"json",
					data:{},
					beforeSend:function(){},
					error:function(){},
					success:function(json){
						console.log(json);
						if(json.code==1){
							if(json.list.province==""){
								$("#per_province").text("省份");
								$("#per_city").text("城市");
								$("#s_county").text("地区");
							}else{
								$("#per_province").text(json.list.province);
							}
							$("#per_province_down_list p").each(function(){   //激活城市选择
								if($(this).text()==""+json.list.province+""){
									$(this).trigger("click");
								}
							})
							if(json.list.city==""){
								$("#per_province").text("省份");
								$("#per_city").text("城市");
								$("#s_county").text("地区");
							}else{
								$("#per_city").text(json.list.city);
							}
							$("#per_city_down_list p").each(function(){   //激活地区选择
								if($(this).text()==""+json.list.city+""){
									$(this).trigger("click");
									$("#s_county").text("地区");
								}
							})
						}
					},
					complete:function(){}
				})
			}else{
				jQuery.showError('您没有此功能操作权限!','信息反馈');
				return false;
			}
		},
		error: function(json){console.log(json);},
		complete: function(json){}
	})
})

$("#enter_determine_part2").click(function(){	
	if($("#enter_cli_name").val()==''){
		$("#enter_cli_name").focus().addClass("errborder").blur();
		$("#newclinic_err").html("诊所名称不能为空").css("visibility","visible");
		// window.location.href='#enter_cli_name';锚点定位跳到错误提示处
		return false;
	}
	if($("#enter_clinic_contact").val()==''){
		// $("#enter_clinic_contact").css("border","1px solid #f86d5a");
		$("#enter_clinic_contact").focus().addClass("errborder").blur();
		$("#newcontact_err").html("诊所联系人不能为空").css("visibility","visible");	
		return false;
	}
	if($("#enter_clinic_pho").val()==''){
		// $("#enter_clinic_pho").css("border","1px solid #f86d5a");
		$("#enter_clinic_pho").focus().addClass("errborder").blur();
		$("#newphone_err").html("诊所电话不能为空").css("visibility","visible");	
		return false;
	}else if($("#enter_clinic_pho").val().length<7){
		// $("#enter_clinic_pho").css("border","1px solid #f86d5a");
		$("#enter_clinic_pho").focus().addClass("errborder").blur();
		$("#newphone_err").html("诊所电话不能少于7位").css("visibility","visible");	
		return false;
	}else if(isNaN($("#enter_clinic_pho").val())){
		// $("#enter_clinic_pho").css("border","1px solid #f86d5a");
		$("#enter_clinic_pho").focus().addClass("errborder").blur();
		$("#newphone_err").html("诊所电话请填写数字").css("visibility","visible");	
		return false;
	}
	var detailedAdd=$("#per_province option:selected").text()+" "
	+$("#per_city option:selected").text()+" "
	+$("#s_county option:selected").text()+" "+$("#enter_contact_add").val();
	var base64=$("#Img").attr("src");//诊所logo
	var oneExt=$("#pic_ext").val();
	if(oneExt==""){
		logo=base64;
	}else{
		logo=base64.substr(base64.indexOf(',') + 1);
	}	
	var crea_logo=$("#Img").attr("src");
	crea_logo=crea_logo.substr(crea_logo.indexOf(',') + 1);	
	$.ajax({
		type:"POST",
		url:"/member/newclinic",
		dataType:"json", 
		data:{
			imgdata:logo,
			pic_ext:oneExt,
			phone:$("#enter_clinic_pho").val(),
			doctorname:$("#enter_clinic_contact").val(),
			clinicname:$("#enter_cli_name").val(),
			clinicprovince:$("#per_province").text(),
			cliniccity:$("#per_city").text(),
			clinicarea:$("#s_county").text(),
			address:$("#enter_contact_add").val(),
			info:$("#enter_clinic_intro").val()
		},       
		beforeSend: function(json){
			$("#enter_determine_part2").attr("disabled",true).val("创建中...");
		},
		error: function(json){
			//console.log(json);
		},
		success: function(json){
			//console.log(json);
			if(json.code==1){
				// jQuery.createAniCss();
				// jQuery.postOk('fadeInUp');
				$(".create_clinic_bg1").hide();
				$(".create_clinic_bg1").children("input[type=text]").val("");
				window.location.reload();
			}else{
				//alert(json.info);
				//popdivAnim('bounceInDown',json.info);
			}
		},
		complete: function(json){}
	});
})


/*关联分诊所*/

var timeV=null;
code_disab();
//禁用按钮
function code_disab(){
    $("#relative_get_code").css("backgroundColor","#cdcdcd");
    $("#relative_get_code").attr("disabled",true);
}
//启动按钮
function code_enabled(){
     $("#relative_get_code").removeAttr("disabled");
     $("#relative_get_code").css("backgroundColor","#00c5b5");
}

//验证码倒计时
function timeNew(){
    var wait=60;
    timeV=window.setInterval(function(){
        if (wait==0) {
            clearInterval(timeV);
            code_enabled();
            $("#relative_get_code").val("获取验证码"); 
         }else{
            code_disab();
            $("#relative_get_code").val(""+wait+"秒");
            wait--;
         }  
    },1000)
}

//检验管家号是否为空
function check_mb(){
	if($("#manage_num_son").val()==""){
		code_disab();
		$(".relative_bind_phone").hide();
		clearInterval(timeV);
		$("#relative_get_code").val("获取验证码"); 
	}else{
		code_enabled();
	}
}

//关联分诊所获取验证码
$("#relative_get_code").click(function(){
	$.ajax({
		type:"POST",
		url:"/clinic/sendclinicvcode",
		dataType:"json",
		data:{dentalid:$("#manage_num_son").val()},
		beforeSend: function(){},
		success: function(json){
			//console.log(json);
			if(json.code==1){
				timeNew();
				$(".relative_bind_phone").show();
				$(".relative_bind_phone span").text(json.list.mobile);
				$(".relative_cli_content").attr("id",""+json.list.clinicid+"");
			}else{
				$(".check_num_no").show();
				$(".check_num_no label").text(json.info);
			}
		},
		error: function(json){},
		complete: function(json){
			//console.log(json);
		}
	})
})

//打开关联分诊所弹窗
$(".relative_clinic_son").click(function(){
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
				$(".create_clinic_bg3").show();
            }else{
                jQuery.showError('您没有此功能操作权限!','信息反馈');
                return false;
            }
        },
        error: function(json){console.log(json);},
        complete: function(json){}
    })
})

//关闭分诊所弹窗
$(".relative_cli_tit img").click(function(){
	$(".create_clinic_bg3").hide();
})


//关联分诊所确定
$("#relative_cli_confim").click(function(){
	if($("#manage_num_son").val()==""){
		$(".manage_num_no").show();
		$("#manage_num_son").css("border-color","#f86d5a");
		return false;
	}
	if($("#manage_num_code").val()==""){
		$(".check_num_no").show();
		$("#manage_num_code").css("border-color","#f86d5a");
		return false;
	}
	$.ajax({
		type:"POST",
		url:"/clinic/addchainclinic",
		dataType:"json",
		data:{
			clinicid:$(".relative_cli_content").attr("id"),
			vcode:$("#manage_num_code").val()
		},
		beforeSend: function(){},
		success: function(json){
			//console.log(json);
			if(json.code==1){
				$(".create_clinic_bg3").hide();
				window.location.reload();
			}else{
				$(".check_num_no").show();
				if(json.info=="clinicid不能为空"){
					$(".check_num_no label").text("请先获取验证码");
				}else{
					$(".check_num_no label").text(""+json.info+"");
				}
			}
		},
		error: function(json){},
		complete: function(json){
		//console.log(json);
		}
	})
})


//解除关联
$("#remove_rel_confim").click(function(){
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
                removeRelaInfo();
            }else{
				$(".create_clinic_bg2,.clinic").hide();
                jQuery.showError('您没有此功能操作权限!','信息反馈');
                return false;
            }
        },
        error: function(json){console.log(json);},
        complete: function(json){}
    })
	function removeRelaInfo(){
		if($("#remove_get_code").val()==""){
			$(".check_num_no2").show();
			$("#remove_get_code").css("border-color","#f86d5a");
			return false;
		}
		$.ajax({
			type:"POST",
			url:"/clinic/removechainclinic",
			dataType:"json",
			data:{
				clinicid:$("#remove_rel_phone").attr("class"),
				vcode:$("#remove_get_code").val()
			},
			beforeSend: function(){},
			success: function(json){
				//console.log(json);
				if(json.code==1){
					$(".create_clinic_bg2").hide();
					window.location.reload();
				}else{
					$(".check_num_no2").show();
					$(".check_num_no2 label").text(json.info);
				}
			},
			error: function(json){},
			complete: function(json){
				//console.log(json);
			}
		})
	}
})

//解除关联获取验证码
$("#remove_getcode_btn").click(function(){
	var wait=60;
	timeV=window.setInterval(function(){
		if (wait==0) {
			clearInterval(timeV);
			code_enabled2();
			$("#remove_getcode_btn").val("获取验证码"); 
		}else{
			code_disab2();
			$("#remove_getcode_btn").val(""+wait+"秒");
			wait--;
		}  
	},1000)

	//禁用按钮
	function code_disab2(){
		$("#remove_getcode_btn").css("backgroundColor","#cdcdcd");
		$("#remove_getcode_btn").attr("disabled",true);
	}
	//启动按钮
	function code_enabled2(){
		$("#remove_getcode_btn").removeAttr("disabled");
		$("#remove_getcode_btn").css("backgroundColor","#00c5b5");
	}

	$.ajax({
		type:"POST",
		url:"/member/sendregcode",
		dataType:"json",
		data:{mobile:$("#bindphoneAn").attr("class")},
		beforeSend: function(){},
		success: function(json){
			console.log(json);
		},
		error: function(json){},
		complete: function(json){
			//console.log(json);
		}
	})

})

//移除错误提示
$("#manage_num_son").focus(function(){
    $(".manage_num_no").hide();
    $("#manage_num_son").css("border-color","#00c5b5");
    $("#manage_num_son").css("outline","none");
})
$("#manage_num_son").blur(function(){
    $("#manage_num_son").css("border-color","#e0e0e0");
})

$("#manage_num_code").focus(function(){
    $(".check_num_no").hide();
    $("#manage_num_code").css("border-color","#00c5b5");
    $("#manage_num_code").css("outline","none");
})
$("#manage_num_code").blur(function(){
    $("#manage_num_code").css("border-color","#e0e0e0");
})

$("#remove_get_code").focus(function(){
    $(".check_num_no").hide();
    $("#remove_get_code").css("border-color","#00c5b5");
    $("#remove_get_code").css("outline","none");
})
$("#remove_get_code").blur(function(){
    $("#remove_get_code").css("border-color","#e0e0e0");
})


