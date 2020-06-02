
	//个人中心头像信息
	var perHeaInfo=localStorage.getItem("headInfo");
	//console.log(perHeaInfo);
	$("#thisModHea").attr("src",""+perHeaInfo+"");

	//左边诊所名字显示
	var getClinicName=localStorage.getItem("clinicname");
	//console.log(getClinicName);
	$("#clinic_name_left").text(getClinicName);
	$("#clinic_name_left").attr("title",""+getClinicName+"");

	//左边医生名字显示
	var getDocName=localStorage.getItem("chainusername");
	//console.log(getDocName);
	$("#doc_name_left").text(getDocName);


	//console.log(getClinicPho)
	//左边诊所头像
	var getClinicPho=localStorage.getItem("clinicphoto");
	//console.log(getClinicPho);
	$("#clinic_pho_left").attr("src",""+getClinicPho+"");
	$("#clinic_pho_left2").attr("src",""+getClinicPho+"");


	//头部下拉进入各模块权限控制 
	var getJurInfo=localStorage.getItem("asideJur");
	var getJurInfoArr=JSON.parse(getJurInfo);
	var jurIcon='<span style="position:absolute;left:0;top:0;display:none;" class="no_mission_m"><img src="/static/public/img/homeImg/no_mission_m.png"></span>';
	//console.log(getJurInfoArr);
	if(getJurInfoArr!=null&&getJurInfoArr!=undefined){
		if(getJurInfoArr[0]==0){	//电网无权限
		$(".clinic_select_hea ul li").eq(0).children("a").append(jurIcon).removeAttr("href");
		}
		if(getJurInfoArr[1]==0){	//财务无权限
			$(".clinic_select_hea ul li").eq(3).children("a").append(jurIcon).removeAttr("href");
		}
		if(getJurInfoArr[2]==0){	//系统无权限
			$(".clinic_select_hea ul li").eq(5).children("a").append(jurIcon).removeAttr("href");
		}
		if(getJurInfoArr[3]==0){	//市场无权限
			$(".clinic_select_hea ul li").eq(1).children("a").append(jurIcon).removeAttr("href");
		}
		if(getJurInfoArr[4]==0){	//运营无权限
			$(".clinic_select_hea ul li").eq(2).children("a").append(jurIcon).removeAttr("href");
		}
		if(getJurInfoArr[5]==0){	//库房无权限
			$(".clinic_select_hea ul li").eq(4).children("a").append(jurIcon).removeAttr("href");
		}
	}
	$(".clinic_select_hea ul li").mouseover(function(){
		$(this).find(".no_mission_m").show();
	}).mouseout(function(){
		$(this).find(".no_mission_m").hide();
	})


	//门诊管理切换
	$(".clinic_word").click(function(e){
		if($(".clinic_select_hea").is(":visible")) {
			$(".clinic_select_hea").hide();
			$(this).find("img").attr("src","/static/account/img/clinic_show_direct.png");
		}else{
			$(".clinic_select_hea").show();
			$(this).find("img").attr("src","/static/account/img/clinic_show_direct_t.png");
		}
		$(document).one("click",function(){
			$(".clinic_select_hea").hide();
			$(".clinic_word").find("img").attr("src","/static/account/img/clinic_show_direct.png");
		})
		e.stopPropagation();
	})

	$(".clinic_select_hea").on("click",function(e){
		e.stopPropagation();
	})
	//-----------------------------------------
	//左侧导航展开收缩
	//-----------------------------------------
	$(".r_left_head").click(function(){
		$(".main_left").hide();
		localStorage.setItem('left_close_open','close');//存储cookie
		
		$(".left_tit").hide();//zlb 11-26
		$("#clinic_left_nav dd a").hide(); 			
		$(".main_right").animate({marginLeft:"58px"},'fast',function(){
			$(".left_nav_hide").show();
		});
		if($(".pageTitle").hasClass("r_left_fixed")){
			$(".pageTitle").css({"right":"20px","left":"78px"});
		}
	});
	$(".default_clinic_pho").click(function(){
		$(".left_nav_hide").hide();	
		localStorage.setItem('left_close_open','open');//存储cookie
		
		$(".main_right").animate({marginLeft:"200px"},'fast',function(){
			$(".main_left").show();
			$("#clinic_left_nav dd a").show(); //zlb 2016-11-26
			$(".left_tit").show();
		});
		if($(".pageTitle").hasClass("r_left_fixed")){
			$(".pageTitle").css({"right":"20px","left":"220px"});
		}
	});
	//-----------------------------------------
	//个人信息下拉菜单
	//-----------------------------------------
	$(".li_default_pho img").click(function(e){
		if($(".per_pho_select").is(":visible")){
			$(".per_pho_select").hide();
		}else{
			$(".per_pho_select").show();
		}
		$(document).one("click",function(){
			$(".per_pho_select").hide();
		})
		e.stopPropagation();
	})
	$(".per_pho_select").on("click",function(e){
		e.stopPropagation();
	})
	

	//关联诊所显示隐藏
	$(".enter_rel_clinic").mouseover(function(){
		$(".rel_clinic").show();
	}).mouseout(function(){
		$(".rel_clinic").hide();
	})

	//消息提醒
	$(".enter_mes").mouseover(function(){
		$(this).find("img").attr("src","/static/account/img/enter_mes2.png");
		$(".system_mes").show();
	}).mouseout(function(){
		$(this).find("img").attr("src","/static/account/img/enter_mes1.png");
		$(".system_mes").hide();
	}).click(function(e){
		if($(".head_mes_tip").is(":hidden")){
			$(".head_mes_tip").show();
		}else{
			$(".head_mes_tip").hide();
		}
		$(document).one("click",function(){
			$(".head_mes_tip").hide();
		})
		e.stopPropagation();
	})
	$(".head_mes_tip").on("click",function(e){
		e.stopPropagation();
	})

