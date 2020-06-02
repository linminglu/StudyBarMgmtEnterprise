
	// var viewHeght=$(window).height()-50;
	// var viewHeghtEntrace=$(window).height()-70;
	// $(".main_con").css("min-height",viewHeght+"px");
	// $(".main_left").css("min-height",viewHeght+"px");
	// $(".main_right").css("min-height",viewHeght+"px");
	// $(".left_nav_hide").css("min-height",viewHeght+"px");
	// $(".entrance_main_con").css("min-height",viewHeghtEntrace+"px");

	/*服务入口*/

	//判断用户是否创建诊所
	if($("#enter_flag").text()==1){	//已创建诊所并创建了连锁
		$(".clinic_name_top_l").eq(0).show();
	    $("#clinic_manage_a").attr("href","index.php?m=ChainStrom&a=clinic_management");
	}else if($("#enter_flag").text()==3){//创建了诊所，未创建连锁 	
		$(".clinic_name_top_l").eq(0).show();
	    $("#clinic_manage_a").attr("href","index.php?m=OneStrom&a=staff_management");
	    //$("#enter_item_name").text("档案管理");
	}else{
		$(".clinic_name_top_l").eq(1).show();
	}

	//门诊tab切换
	$(".own_clinic span").click(function(){
		$(".own_clinic span[data-clinicColor='1']").attr("data-clinicColor","0");
		$(this).attr("data-clinicColor","1");
		var index=$(this).index();
		$(".entrance_main_con").eq(index).show().siblings(".entrance_main_con").hide();
	})

	//注册诊所
	$("#entrance_cre_clinic").click(function(){
		$(".create_clinic_bg1").show();
	})
	$("#enter_determine").click(function(){
		//enter_determine  服务入口页 
		if($("#enter_cli_name").val()==''){
			alert("诊所名称不能为空");
			//popdivAnim('bounceInDown','诊所名称不能为空');
			return false;
		}
		if($("#enter_clinic_contact").val()==''){
			alert("诊所联系人不能为空");
			//popdivAnim('bounceInDown','诊所联系人不能为空');
			return false;
		}
		if($("#enter_clinic_pho").val()==''){
			alert("诊所电话不能为空");
			//popdivAnim('bounceInDown','诊所联系人不能为空');
			return false;
		}
		var base64 = $("#Img").attr("src");
		//console.log(base64);
		var pic_ext=$("#pic_ext").val();
		if(pic_ext==""){
			imagedata=base64;	
		}else{
			imagedata=base64.substr(base64.indexOf(',') + 1);	
		}
		var detailedAdd=$("#per_province option:selected").text()+" "
		+$("#per_city option:selected").text()+" "
		+$("#s_county option:selected").text()+" "+$("#enter_contact_add").val();
		$.ajax({
	        type:"POST",
	        url:"index.php?m=Clinic&a=create_main_clinic",
	        dataType:"json", 
	        data:{
	        	//logo:$("#Img").attr("src"),//这个资料我们修改下  yzp
				imgdata: imagedata,
				pic_ext:pic_ext,
	        	phone:$("#enter_clinic_pho").val(),
	        	contact:$("#enter_clinic_contact").val(),
	        	clinicname:$("#enter_cli_name").val(),
	        	info:$("#enter_clinic_intro").val(),
	        	grade:"admin_two",
	        	Address:detailedAdd
	        },       
	        beforeSend: function(json){},
	        error: function(json){
	        	//console.log(json);
	        },
	        success: function(json){
	        	//console.log(json);
	           	if(json.code==1){
	           		$(".create_clinic_bg1").hide();
	           		$(".clinic_name_top_l").eq(0).show();
	           		$("#enter_clinic_crename").html($("#enter_cli_name").val());
	           		$("#entrance_cre_clinic").hide();
					$("#entrance_cre_clinic").children("input[type=text]").val("");
/*	           		$("#clinic_manage_a").attr("href","index.php?m=OneStrom&a=clinic_archives");*/
	           	}else{
	           		alert(json.info);
			   		//popdivAnim('bounceInDown',json.info);
				}
	        },
	        complete: function(json){}
    	});
	})
	

	/*============员工管理==========*/

	// var staff_man_bgheight=$(window).height();
	// $(".sta_man_bg").css("height",staff_man_bgheight+"px");

	$(".main_left dl dd").click(function(){
		$(".main_left dl dd[data-type='1']").attr("data-type","0");
		$(this).attr("data-type","1");
	})

	$(".nav ul li").click(function(){
		$(".nav ul li a[data-operate='1']").attr("data-operate","0");
		$(this).find("a").attr("data-operate","1");
	})

	$(".open_it").click(function(){
		if($(".open_condition").css("display")=="none"){
			$(".open_condition").slideDown();
			$(this).html("收起筛选<img src='/static/account/img/in_filter.png'>");
		}else if($(".open_condition").css("display")=="block"){
			$(".open_condition").slideUp();
			$(this).html("更多筛选<img src='/static/account/img/more_filter.png'>");
		}
	})	
	/*关闭弹窗和背景黑色的遮罩层*/
	$(".close_alert").on("click",function(){
		$(".sta_man_bg").hide();
		clearerrinfo();
		$(this).parents(".export_staff_list").hide();	
		$("body").css("overflow","scroll");
		$(".create_clinic_bg2,.clinic").children("input[type=text]").css("border","1px solid #f0f0f0");
	})
	/*首页*/
	$("#ul_list li").click(function(){
		clearerrinfo();
		$("li[data-s='1']").attr("data-s","0");
		$(this).attr("data-s","1"); 
    })
    $("#strom_user").click(function(){
		$("#user_lists").slideToggle("40px").css("display","block");
    })
    /*退出按钮*/
    $("#exit").click(function(event){
		$("#user_lists").slideUp("40px");
		event.stopPropagation();
    })

  

	/*审批员工*/
	// $(".exit_it").click(function(){
	// 	$("#resume_pop").css("display","none");
	// })

	/*取消离职*/
/*	$(document).on("click",".resume_it",function(){
		$(".sta_man_bg").show();
		$("#resume_pop").show();
		$(".resume").show();
	})
*/

	/*离职交接*/
/*	$(document).on("click",".turn_work",function(){
		$(".sta_man_bg").show();
		$(".staff_edit").show();
	})*/


	$(".system_tip img").click(function(){
		$(".sta_man_bg").hide();
		$(".resume").hide();
		$(".staff_edit").hide();
	})

	/*点击搜索框内的搜索图标*/
	$("#selc").click(function(){
		$("#staff,#depart").css("display","none");
		$("input[type=text],#close").css("display","inline-block");
		$("#selc").hide();	
	})
	$("#close").click(function(){
		$("#selc").show();
		$(this).css("display","none");
		$("input[type=text]").css("display","none");	
		$("#staff,#depart").css("display","inline-block");	
	})
	/*点击科室和所有人切换*/
	$("#staff").click(function(){
		$(this).css("border-bottom","2px solid #00bb9c");
		$("#depart").css("border","none");
		$("#depart_list").css("display","none");
		$("#staff_list").css("display","block");
	})
	$("#depart").click(function(){
		$(this).css("border-bottom","2px solid #00bb9c");
		$("#staff").css("border","none");
		$("#depart_list").css("display","block");
		$("#staff_list").css("display","none");	
	})
/**/
function clearerrinfo(){
	$(".clinic_box input[type='text']").css("border","1px solid #f0f0f0");
	$(".clinic_box input[type='text']").siblings(".errinfo").css("visibility","hidden");
}
