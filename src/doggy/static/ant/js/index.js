$(function(){
	/*banner*/
	$('#index-bxslider').bxSlider({
		auto: true,
		pagerCustom: '#bx-pager',
		nextSelector: '#slider-next',
  		prevSelector: '#slider-prev',
		nextText: '',
		prevText: '',
		speed: 600,
		pause: 4000,
		autoHover: true,
		autoControlsCombine: true
	});
	
	//滚动至下载区域时，头部菜单高亮
	$(window).scroll(function(){
		var st=$(window).scrollTop();
		if(st>=3891&&st<=4644){
			$(".topbarIn ul li.navitem>a").eq(1).addClass("navAct");
		}else{
			$(".topbarIn ul li.navitem>a").eq(1).removeClass("navAct");
		}	
	});
	
	$(".download ul li").eq(2).mouseover(function(){
		$(this).children("p").hide();
		$(this).children("div").stop(true,true).fadeIn(1000);
	});
	$(".download ul li").eq(2).mouseout(function(){
		$(this).children("p").show();
		$(this).children("div").stop(true,true).fadeOut(1000);	
	});
	$(".download ul li").eq(3).mouseover(function(){
		$(this).children("p").hide();
		$(this).children("div").stop(true,true).fadeIn(1000);	
	});
	$(".download ul li").eq(3).mouseout(function(){
		$(this).children("p").show();
		$(this).children("div").stop(true,true).fadeOut(1000);	
	});
	
	//安卓二维码
	/*var android = new QRCode(document.getElementById("android"), {
	    width : 126,//设置宽高
	    height : 126,
		colorDark:"#585f69",
		colorLight:"#fff"
	});
	android.makeCode(location.host+$("#android").attr('value'));*/
	//$(".case .caseP2").children().html($(".caseP2").children().html().trim());
	
	var url = "";
	if (/AppleWebKit.*Mobile/i.test(navigator.userAgent)|| (/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/.test(navigator.userAgent))) {
		url="/Mb/index";
	}
	
	if(url != ""){
		window.location = url;
	}
});