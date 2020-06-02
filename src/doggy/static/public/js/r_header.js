$(function(){
	//左侧弹窗
	var menuTags=0;
	$(".r_headerMenu").click(function(e){
		if(menuTags==0){
			$(".r_select").show();
			$(this).removeClass("r_headerMenuDown").addClass("r_headerMenuUp");
			menuTags=1;
		}else{
			$(this).removeClass("r_headerMenuUp").addClass("r_headerMenuDown");
			$(".r_select").hide();
			menuTags=0;
		}
		$(document).one("click",function(){
			$(".r_headerMenu").removeClass("r_headerMenuUp").addClass("r_headerMenuDown");
			$(".r_select").hide();
			menuTags=0;
		});
		e.stopPropagation();
	});
	//右侧弹窗
	var userTags=0;
	$(".r_user").click(function(e){
		if(userTags==0){
			$(".r_userInfo").show();
			$(this).removeClass("r_userDown").addClass("r_userUp");
			userTags=1;
		}else{
			$(this).removeClass("r_userUp").addClass("r_userDown");
			$(".r_userInfo").hide();
			userTags=0;
		}
		$(document).one("click",function(){
			$(".r_user").removeClass("r_userUp").addClass("r_userDown");
			$(".r_userInfo").hide();
			userTags=0;
		});
		e.stopPropagation();
	});
	
	var obj=[
		{
			"id":"netconsult",//路由
			"title":"电网中心",//模块名称
			"url":"url(/static/public/img/homeImg/powernet_m.png) center top no-repeat",//弹窗背景图
			"urlsmall":"url(/static/public/img/homeImg/powernetS.png) no-repeat",//头部背景图
			"href":"/netconsult/todayconsulthtml"//跳转ur
		},
		{
			"id":"market",//路由
			'other_id':'festival',
			'other_id2':'VWeb',
			"title":"市场营销",//模块名称
			"url":"url(/static/public/img/homeImg/market_m.png) center top no-repeat",//弹窗背景图
			"urlsmall":"url(/static/public/img/homeImg/marketS.png) no-repeat",//头部背景图
			"href":"/market/index"//跳转url
		},
		{
			"id":"report",//路由
			"title":"运营中心",//模块名称
			"url":"url(/static/public/img/homeImg/Operation_m.png) center top no-repeat",//弹窗背景图
			"urlsmall":"url(/static/public/img/homeImg/OperationS.png) no-repeat",//头部背景图
			"href":"/report/today"//跳转url
		},
		{
			"id":"finance",//路由
			"title":"财务管理",//模块名称
			"url":"url(/static/public/img/homeImg/finance_m.png) center top no-repeat",//弹窗背景图
			"urlsmall":"url(/static/public/img/homeImg/financeS.png) no-repeat",//头部背景图
			"href":"/finance/index"//跳转url
		},
		{
			"id":"store",//路由
			"title":"库房管理",//模块名称
			"url":"url(/static/public/img/homeImg/store_m.png) center top no-repeat",//弹窗背景图
			"urlsmall":"url(/static/public/img/homeImg/storeS.png) no-repeat",//头部背景图
			"href":"/store"//跳转url
		}/*,
		{
			"id":"clinic",//路由
			"title":"系统管理",//模块名称
			"url":"url(/static/public/img/homeImg/system_m.png) center top no-repeat",//弹窗背景图
			"urlsmall":"url(/static/public/img/homeImg/systemS.png) no-repeat",//头部背景图
			"href":"/clinic/index"//跳转url
		}*/,
		/*{
			"id":"VWeb",//路由  营销中有两种路由
			"title":"市场营销",//模块名称
			"url":"url(/static/public/img/homeImg/market_m.png) center top no-repeat",//弹窗背景图
			"urlsmall":"url(/static/public/img/homeImg/marketS.png) no-repeat",//头部背景图
			"href":"/market/index"//跳转url
		}*/
	];
	var url=window.location.href;
	var html="";
	var getJurInfo_f=localStorage.getItem("asideJur_f");
	var getJurInfoArr_f=JSON.parse(getJurInfo_f);
	
	//for(var item in obj){  //zlb 17/01/14
		for(var item=0;item<obj.length;item++){
		//权限判断
			try{	
					if(getJurInfoArr_f[item]==0){//无权限
						html+='<li style="background:'+obj[item]["url"]+'"><p>'+obj[item]["title"]+'</p><div class="noJur"></div></li>';
					}else{
						var _id=obj[item]["id"];
						var _id2=obj[item]["id"];
						
						if(obj[item]["other_id"]!=undefined){
							_id=obj[item]["other_id"];
						}
						if(obj[item]["other_id2"]!=undefined){
							_id2=obj[item]["other_id2"];

						}
						if(url.indexOf("/"+obj[item]["id"]+"/")!=-1 || url.indexOf("/"+_id+"/")!=-1 || url.indexOf("/"+_id2+"/")!=-1){
						$(".r_headerMenu").html(obj[item]["title"]).css("background",obj[item]["urlsmall"]);
							html+='<li onclick="javascript:window.location.href=\''+obj[item]["href"]+'\'" class="pointer" style="background:'+obj[item]["url"]+'"><p class="act">'+obj[item]["title"]+'</p></li>';
						}else{
							html+='<li onclick="javascript:window.location.href=\''+obj[item]["href"]+'\'" class="pointer" style="background:'+obj[item]["url"]+'"><p>'+obj[item]["title"]+'</p></li>';
						}
					}
					//console.log('html=',html);
			}catch(e){
				//console.log(e);	
			}
	}
	$(".r_select ul").empty().prepend(html);
	$(".r_select ul").append('<li onclick="javascript:window.location.href=\'/index\'" class="pointer" style="background:url(/static/public/img/homeImg/backhp.png) center top no-repeat">返回首页</li>');
	
	//右边
	
	//菜单点击特效
	$("body").on("click",".left_nav_item span",function(){
//	$(".left_nav_item span").click(function(){
		if($(this).attr("id")=="l_net_no_click"){
			$(".left_nav_item_second").slideUp();
			return;  //电网首页不可收缩
		}
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
	
	var title=document.title;
	var nav_title=$('#newFrmeContent .content.active .nav_name').text();//20170306  liqin 用于库房导航判断

	//根据路由判断当前菜单
	var _thisA = $(".left_nav_item_second a");
    for(var i = 0; i < _thisA.length; i++){
    	if(_thisA.eq(i).html()==title || nav_title==_thisA.eq(i).text()){
    		_thisA.eq(i).parent().show();//显示该父级
    		_thisA.eq(i).parent().siblings("span").attr("data-tags","1");//为该一级菜单添加标识
    		_thisA.eq(i).addClass("act");//高亮当前菜单
    	}
    }
	
	//根据路由判断当前菜单-收缩状态下
	//与常规（展开的）的菜单同步显示高亮状态 20170309 liqin
    var _thisASmall = $(".left_nav_small_item_second a");
    $("#js_left_nav .left_nav_item_second a").each(function(index,el){
    	if($(this).hasClass('act') || $(this).hasClass('active')){
    		_thisASmall.eq(index).parent().parent().css("background","#eee");//高亮当前一级菜单
    		_thisASmall.eq(index).addClass("act");//高亮当前菜单
    	}
    })

   //  for(var j = 0; j < _thisASmall.length; j++){
   //  	if(_thisASmall.eq(j).html()==title || nav_title==_thisASmall.eq(j).text()){
			// _thisASmall.eq(j).parent().parent().css("background","#eee");//高亮当前一级菜单
			// _thisASmall.eq(j).addClass("act");//高亮当前菜单
   //  	}
   //  }
	
	//控制菜单显示切换
	$("#left_nav_btn_hide").click(function(){
		$(".r_left_cont").animate({width:"56px"},'fast',function(){
			$(".leftNav").hide();
			$(".leftNavSmall").show();
		});
		localStorage.setItem("left_close_open",'close');//存储cookie
		
		try {
			pagerLocation();
		} catch (error) {
			// console.log(error.message);
		}
		
//		if($(this).parents('#newFrmeLeft').length>0){ //zlb 17/1/15
//			$(this).parents('#newFrmeLeft').width(56);	
//		}
		//20170117 qin 微信概述（图表）
		if(typeof(getAll)=='function'){
			getAll();
		}
	});
	$("#left_nav_btn_show").click(function(){
		$(".r_left_cont").animate({width:"200px"},'fast',function(){
			$(".leftNavSmall").hide();
			$(".leftNav").show();
		});
		localStorage.setItem("left_close_open",'open');//存储cookie
		
		try {
			pagerLocation();
		} catch (error) {
			// console.log(error.message);
		}
		
		
//		if($(this).parents('#newFrmeLeft').length>0){  //zlb 17/1/15
//			$(this).parents('#newFrmeLeft').width(200);	
//		}
		//20170117 qin 微信概述（图表）
		if(typeof(getAll)=='function'){
			getAll();
		}
	});
    //伸缩记忆
    var open_close=localStorage.getItem('left_close_open');
    if(open_close=='close'){
    	$(".leftNav").hide();
    	$(".leftNavSmall").show();
    }else{
    	$(".leftNavSmall").hide();
	    $(".leftNav").show();
    }
});