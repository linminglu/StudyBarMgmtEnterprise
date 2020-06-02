$(function(){
	$(".headerUser").click(function(){
		$(".per_pho_select").toggle();
	});
	
	$(".ho2").click(function(){
		$(".head_mes_tip").toggle();
	});
	
	var menuTags=0;
	$(".headerMenu").click(function(){
		if(menuTags==0){
			$(".clinic_select").show();
			$(this).removeClass("headerMenuDown").addClass("headerMenuUp");
			menuTags=1;
		}else{
			$(this).removeClass("headerMenuUp").addClass("headerMenuDown");
			$(".clinic_select").hide();
			menuTags=0;
		}
	});
	
	var obj=[
		{
			"id":"r_test_project_1",//路由
			"title":"门诊业务",//模块名称
			"url":"url(/static/public/img/r_header/11.png) no-repeat",//弹窗背景图
			"urlsmall":"url(/static/public/img/r_header/1.png) no-repeat",//头部背景图
			"href":"../r_test_project_1/r_index.html"//跳转url
		},
		{
			"id":"r_test_project_2",
			"title":"电网中心",
			"url":"url(/static/public/img/r_header/22.png) no-repeat",
			"urlsmall":"url(/static/public/img/r_header/2.png) no-repeat",
			"href":"../r_test_project_2/r_index.html"
		},
		{
			"id":"r_test_project_3",
			"title":"市场营销",
			"url":"url(/static/public/img/r_header/33.png) no-repeat",
			"urlsmall":"url(/static/public/img/r_header/3.png) no-repeat",
			"href":"../r_test_project_3/r_index.html"
		},
		{
			"id":"r_test_project_4",
			"title":"运营中心",
			"url":"url(/static/public/img/r_header/55.png) no-repeat",
			"urlsmall":"url(/static/public/img/r_header/5.png) no-repeat",
			"href":"../r_test_project_4/r_index.html"
		},
		{
			"id":"r_test_project_5",
			"title":"财务统计",
			"url":"url(/static/public/img/r_header/44.png) no-repeat",
			"urlsmall":"url(/static/public/img/r_header/4.png) no-repeat",
			"href":"../r_test_project_5/r_index.html"
		},
		{
			"id":"r_test_project_6",
			"title":"库房管理",
			"url":"url(/static/public/img/r_header/66.png) no-repeat",
			"urlsmall":"url(/static/public/img/r_header/6.png) no-repeat",
			"href":"../r_test_project_6/r_index.html"
		},
		{
			"id":"r_test_project_7",
			"title":"系统管理",
			"url":"url(/static/public/img/r_header/77.png) no-repeat",
			"urlsmall":"url(/static/public/img/r_header/7.png) no-repeat",
			"href":"../r_test_project_7/r_index.html"
		},
		{
			"id":"r_test_project_8",
			"title":"返回首页",
			"url":"url(/static/public/img/r_header/88.png) no-repeat",
			"urlsmall":"url(/static/public/img/r_header/8.png) no-repeat",
			"href":"../r_test_project_8/r_index.html"
		}
	];
	
	var url=window.location.href;
	var html="";
	for(var item in obj){
		html+='<li onclick="javascript:window.location.href=\''+obj[item]["href"]+'\'" style="background:'+obj[item]["url"]+'">'+obj[item]["title"]+'</li>';
		if(url.indexOf("/"+obj[item]["id"]+"/")!=-1){
			$(".headerMenu").html(obj[item]["title"]).css("background",obj[item]["urlsmall"]);
		}
	}
	$(".clinic_select ul").empty().prepend(html);
	
	var financeObj=[
		{
			"id":"Employee_pe",
			"firstTitle":"员工绩效",
			"secondTitle":{
				"医生统计":"/views/r_test_project_1/r_index.html",
				"护士统计":"/views/r_test_project_1/r_index2.html",
				"助理统计":"###3",
				"咨询师统计":"###4",
				"电网统计":"###5"
			}
		},
		{
			"id":"Clinic_income",
			"firstTitle":"营业统计",
			"secondTitle":{
				"诊疗实收统计":"/views/r_test_project_1/r_index3.html",
				"预交款统计":"###2",
				"会员卡统计":"###3",
				"零售统计":"###4"
			}
		}
	];
	
	//创建菜单
	var leftHtml="";
	$.each(financeObj, function(index,el) {
		leftHtml+='<div class="left_nav_item">';
			leftHtml+='<span data-tags="0" class="'+el.id+'">'+el.firstTitle+'</span>';
			leftHtml+='<div class="left_nav_item_second">';
				$.each(el.secondTitle, function(indexs,els) {
					leftHtml+='<a href="'+els+'">'+indexs+'</a>';
				});
			leftHtml+='</div>';
		leftHtml+='</div>';

		$("#js_left_nav").empty().prepend().html(leftHtml);
	});
	//菜单点击特效
	$(".left_nav_item span").click(function(){
		var tags=$(this).attr("data-tags");
		$(".left_nav_item span[data-tags='1']").attr("data-tags","0");
		if(tags==0){
			$(this).siblings(".left_nav_item_second").slideDown();
			$(this).attr("data-tags","1");
		}else{
			$(this).siblings(".left_nav_item_second").slideUp();
			$(this).attr("data-tags","0");
		}
		$(this).parent().siblings().find(".left_nav_item_second").slideUp();
	});
	//根据路由判断当前菜单
	var _thisA = $(".left_nav_item_second a");
    for(var i = 0; i < _thisA.length; i++){
    	var _href = _thisA.eq(i).attr("href");
    	if(url.indexOf(_href)!=-1){
    		_thisA.eq(i).parent().show();//显示该父级
    		_thisA.eq(i).parent().siblings("span").attr("data-tags","1");//为该一级菜单添加标识
    		_thisA.eq(i).addClass("act");//高亮当前菜单
    	}
    }
    //创建收缩菜单
    var leftSmallHtml="";
    $.each(financeObj, function(index,el) {
    	leftSmallHtml+='<div class="left_nav_small_item '+el.id+'">';
    		leftSmallHtml+='<div class="left_nav_small_item_second">';
    			$.each(el.secondTitle, function(indexs,els) {
					leftSmallHtml+='<a href="'+els+'">'+indexs+'</a>';
				});
    		leftSmallHtml+='</div>';
    	leftSmallHtml+='</div>';
    });
    $("#js_left_nav_small").empty().prepend(leftSmallHtml);
    //根据路由判断当前菜单-收缩状态下
    var _thisASmall = $(".left_nav_small_item_second a");
    for(var j = 0; j < _thisASmall.length; j++){
    	var _href = _thisASmall.eq(j).attr("href");
    	if(url.indexOf(_href)!=-1){
			_thisASmall.eq(j).parent().parent().css("background","#eee");//高亮当前一级菜单
			_thisASmall.eq(j).addClass("act");//高亮当前菜单
    	}
    }
    //控制菜单显示切换
    $(".headerBtn").click(function(){
    	if($(".headerBtnWrap > div").hasClass("headerBtnShow")){
    		$(".headerBtn").addClass("headerBtnHide").removeClass("headerBtnShow");
    		$(".leftNav").hide();
    		$(".leftNavSmall").show();
    		localStorage.setItem("left_close_open",'close');//存储cookie
    	}else{
    		$(".headerBtn").addClass("headerBtnShow").removeClass("headerBtnHide");
    		$(".leftNavSmall").hide();
    		$(".leftNav").show();
    		localStorage.setItem("left_close_open",'open');//存储cookie
    	}
    });
    //伸缩记忆
    var open_close=localStorage.getItem('left_close_open');
    if(open_close=='close'){
    	$(".leftNav").hide();
    	$(".leftNavSmall").show();
    	$(".headerBtn").addClass("headerBtnHide").removeClass("headerBtnShow");
    }else{
	    $(".leftNav").show();
    	$(".leftNavSmall").hide();
    	$(".headerBtn").addClass("headerBtnShow").removeClass("headerBtnHide");
    }
});