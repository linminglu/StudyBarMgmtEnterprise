$(function(){
	var url=window.location.href;
    window.leftW=0;
	//点击用户弹窗控制
	var loginUserTags=0;
	$(".loginUser").click(function(){
		if(loginUserTags==0){
			$(".userWindow").stop(false,true).slideDown();
			$(this).find("i").removeClass("down").addClass("up");
			loginUserTags=1;
		}else{
			$(".userWindow").stop(false,true).slideUp();
			$(this).find("i").removeClass("up").addClass("down");
			loginUserTags=0;
		}
	});
	//根据路由判断当前菜单--展开状态
	var _thisA = $(".leftNav > div");
    for(var i = 0; i < _thisA.length; i++){
    	var _href = _thisA.eq(i).attr("data-url");
    	if(url.indexOf(_href)!=-1){
    		_thisA.eq(i).addClass("act");
    	}
    }
    //根据路由判断当前菜单--收缩状态
	var _thisB = $(".leftNavSmall > div");
    for(var i = 0; i < _thisB.length; i++){
    	var _href = _thisB.eq(i).attr("data-url");
    	if(url.indexOf(_href)!=-1){
    		_thisB.eq(i).addClass("act");
    	}
    }
	//菜单伸缩
	$(".leftTitle").click(function(){
		if($(this).find("i").hasClass("hide")){
			$(this).find("i").removeClass("hide").addClass("show");
			$(".leftNav").hide();
			$(".leftNavSmall").show();
			localStorage.setItem("left_close_open",'close');//存储cookie
			leftW=44;
		}else{
			$(this).find("i").removeClass("show").addClass("hide");
			$(".leftNav").show();
			$(".leftNavSmall").hide();
			localStorage.setItem("left_close_open",'open');//存储cookie
			leftW=200;
		}
	});
	//收缩菜单浮动特效
	$(".leftNavSmall > div").mousemove(function(){
		$(this).removeClass("act");
		$(this).find("p").show();
	});
	$(".leftNavSmall > div").mouseout(function(){
		var actUrl=$(this).attr("data-url");
		if(url.indexOf(actUrl)!=-1){
			$(this).addClass("act");
		}
		$(this).find("p").hide();
	});
	//伸缩记忆
    var open_close=localStorage.getItem('left_close_open');
    if(open_close=='close'){
    	$(".leftTitle i").removeClass("hide").addClass("show");
    	$(".leftNav").hide();
    	$(".leftNavSmall").show();
    }else{
    	$(".leftTitle i").removeClass("show").addClass("hide");
	    $(".leftNav").show();
    	$(".leftNavSmall").hide();
    }

	//退出登录 hk
	$("#logout").click(function(){
		$.ajax({
			type:"POST",
			url:"/butlerp/logout",
			dataType:"json",
			data:{
				username:$("#user_input").val(), 
				password:$("#pw_input").val()
			},
			beforeSend: function(){},
			success: function(json){
				console.log(json);
				window.location.href="/butlerp";
			},
			error: function(json){},
			complete: function(json){}
		})
	});
});
function valDays(id,num){
    if(id!=undefined){
        var nday=new Date();
        var year=nday.getFullYear();
        var month=parseInt(nday.getMonth())+1;
        var day=nday.getDate()+parseInt(num);

        var MonDay=new Date(year,month-1,day);
            year=MonDay.getFullYear();
            month=parseInt(MonDay.getMonth())+1;
            day=MonDay.getDate();

            month=month<10?month="0"+month:month;
            days=day<10?day="0"+day:day;
            $("#"+id).val(year+"-"+month+"-"+days);
    }
}