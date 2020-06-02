/**********************
 * create by cyj  2016/10/11
 ***********************/

 	/*左侧导航栏展开收缩*/
 	$(".nav_btn").click(function(){
		var src=$(this).attr("src");
		if(src=="/static/ant/img/up.png"){
			$(this).attr("src","/static/ant/img/down.png");
			$("#leftNav ul").fadeOut(300);
		}else{
			$(this).attr("src","/static/ant/img/up.png");
			$("#leftNav ul").fadeIn(300);
		}
	})

	//检测左侧item是否高亮
	function isCurr_left(id){
		$("#leftNav li[data-tag='0']").eq(id).attr("data-tag","1").siblings("data-tag","0");
	}

	//IE下支持placeholder
	$(function(){ $('input, textarea').placeholder(); });


	//登出按钮
	$("#admin").click(function(){
		$(".logout").toggle();
	})





