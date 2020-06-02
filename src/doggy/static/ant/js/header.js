var url=window.location.href;
var obj=$(".topbarIn ul li.navitem>a");

obj.eq(2)[url.indexOf('News')>=0?'addClass':'removeClass']('navAct');
obj.eq(0)[url.indexOf('Project')>=0?'addClass':'removeClass']('navAct');
if(url.indexOf('Case')>=0){
	obj.eq(2).addClass("navAct");
}

/*$(window).scroll(function(){
	var st=$(window).scrollTop();
	if(st>=45){
		$(".topbar").css({opacity:"0.9"});
	}else{
		$(".topbar").css({opacity:"1"});
	}
});*/

//$(".topbar").css({"background-color":"rgba(255,255,255,0.9)","filter":"alpha(opacity=90)"});
if($(".top").size()>0){$(".top").toTop();}

//登录后头像点击弹出层
$("#myFace").mouseenter(function(){
	var coor=$(this).offset();
	var x_w=$("#per_pho_select").width();
	$("#per_pho_select").css({"top":coor.top+35,"left":coor.left-x_w+30}).show();
});

$("#per_pho_select").mouseleave(function(){
	$("#per_pho_select").fadeOut();
	});

//百度统计
var _hmt = _hmt || [];
(function() {
var hm = document.createElement("script");
hm.src = "//hm.baidu.com/hm.js?3fa86f7400a135441df091c0aa2156af";
var s = document.getElementsByTagName("script")[0];
s.parentNode.insertBefore(hm, s);
})();