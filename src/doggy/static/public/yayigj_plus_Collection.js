/*------------------------------------------
  1、$("div").scrollUnique();    						//当前层滚动阻止窗口滚动插件
  2、gen_bg_div();											//生成覆盖带透明背景层
  3、gen_bg_div_clos()									//关闭清除背景层
  4、setDivPopEffect()									//为div元素加滑入功能,div不能含flex方式布局
  5、setDivPopEffectClose()  						//为div元素加滑出功能
  6、isIE()															//判断IE版本号
  7、createAniCss() 										//使用本插件先执行建立样式函数
  8、popdivAnim()											//动画通知信息
  9、pop_info_loading()								//正在加载中动画效果
  10、pop_info_loading_close() 					//关闭上面效果
  11、pop_window_modal_dialog()  			//弹出模态对话框
  12、pop_window_modal_dialog_close() 	//弹出模态对话框关闭
/*------------------------------------------
  216-09-18
  zlb 整理 18682489289
 *------------------------------------------*/
$.fn.scrollUnique = function() {
    return $(this).each(function() {
        var eventType = 'mousewheel';
        if (document.mozHidden !== undefined) {
            eventType = 'DOMMouseScroll';
        }
        $(this).on(eventType, function(event) {
            var scrollTop = this.scrollTop,
                scrollHeight = this.scrollHeight,
                height = this.clientHeight;
            var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);        
            if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
                this.scrollTop = delta > 0? 0: scrollHeight;
                // 向上滚 || 向下滚
                event.preventDefault();
            }        
        });
    });	
};
/*------------------------------------------
  动画效果几种常用扩展
  zlb
  2016-09-26
 *------------------------------------------*/
 jQuery.extend( jQuery.easing, {  
    easeOutExpo: function (x, t, b, c, d) {   //快速下落
        return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;  
    },  
    easeOutBounce: function (x, t, b, c, d) {  //落地反弹
        if ((t/=d) < (1/2.75)) {  
            return c*(7.5625*t*t) + b;  
        } else if (t < (2/2.75)) {  
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;  
        } else if (t < (2.5/2.75)) {  
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;  
        } else {  
            return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;  
        }  
    },  
}); 

/*------------------------------------------
  扩展插件 zlb 2016-09-26
  调用方法jQuery.pop_info_loading({
				width:'200px',
				height:'100px',
				}); 
 *------------------------------------------*/
 jQuery.extend({    
  //----------------------------------
  // 生成覆盖背景层 zlb 2016-10-20
  //----------------------------------
	gen_bg_div:function(){
		var jquery_bg=$("<div id='jquery_bg_div' style='background-color:rgba(0,0,0,0.5); width:100%; position:absolute;height:"+$(document).height()+"px; z-index:1; left:0px; top:0px;'></div>");
		$("#jquery_bg_div").remove();
		$("body").append(jquery_bg);
	},
	gen_bg_div_clos:function(){		
		$("#jquery_bg_div").remove();
	},
 	//----------------------------------
    // 为div设置动画弹出效果zlb 2016-10-20
	//----------------------------------
	setDivPopEffect:function(ops){
		if(jQuery.isIE()<9){			
		}else{
			if($('#'+ops.id).is(":hidden")){
				$('#'+ops.id).show();
			}
			$('#'+ops.id).addClass(ops.openMothod+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
				$(this).removeClass(ops.openMothod+' animated');
				});
		}
	},	
	//----------------------------------
    // 为div设置动画弹出关闭效果zlb 2016-10-20
	//----------------------------------
	setDivPopEffectClose:function(ops){
		if(jQuery.isIE()<9){	
			$('#'+ops.id).hide();		
		}else{
			$('#'+ops.id).addClass(ops.closeMothod+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
				$(this).removeClass(ops.closeMothod+' animated');
				$('#'+ops.id).hide();	
				});
		}
	},	
	
 	//----------------------------------
    // 判断是否IE并返回版本号,非IE返回20 zlb 2016-10-20
	//----------------------------------
	isIE:function(){
		var browser=navigator.appName ,
			 b_version=navigator.appVersion ,
			 version=b_version.split(";"),
			 trim_Version=version[1].replace(/[ ]/g,""), 
			 result=20;
		if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE6.0"){ result=6;} 
		else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE7.0"){result=7;} 
		else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE8.0"){result=8;} 
		else if(browser=="Microsoft Internet Explorer" && trim_Version=="MSIE9.0"){result=9;} 
		return result;
	},
 	//----------------------------------
    // 常用几种动画样式预备 zlb 2016-10-20
	//----------------------------------
	createAniCss:function(){
		var css_txt='.animated {-webkit-animation-duration: 1s;animation-duration: 0.6s;-webkit-animation-fill-mode: both;animation-fill-mode: both;z-index: 100;}'+
							'.animated.infinite {-webkit-animation-iteration-count: infinite;animation-iteration-count: infinite;}'+
							'.animated.hinge {-webkit-animation-duration: 0.5s;animation-duration: 0.5s;}'+
							
							'@-webkit-keyframes bounceInDown {0% {opacity: 0;-webkit-transform: translateY(-100px);transform: translateY(-100px);}'+
							'60% {opacity: 1;-webkit-transform: translateY(30px);    transform: translateY(30px);}'+
							'80% {-webkit-transform: translateY(-10px);transform: translateY(-10px);}'+
							'100% {-webkit-transform: translateY(0);transform: translateY(0);}}'+
							'@keyframes bounceInDown {0% {opacity: 0;-webkit-transform: translateY(-100px);-ms-transform: translateY(-100px);transform: translateY(-1000px);}'+
							'60% {opacity: 1;-webkit-transform: translateY(30px);-ms-transform: translateY(30px);transform: translateY(30px);}'+
							'80% {-webkit-transform: translateY(-10px);-ms-transform: translateY(-10px);    transform: translateY(-10px);}'+
							'100% {-webkit-transform: translateY(0);-ms-transform: translateY(0);transform: translateY(0);}}'+
							'.bounceInDown {-webkit-animation-name: bounceInDown;animation-name: bounceInDown;}'+
							
							'@-webkit-keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}'+
							'@keyframes fadeInUp{0%{opacity:0;-webkit-transform:translate3d(0,100%,0);-ms-transform:translate3d(0,100%,0);transform:translate3d(0,100%,0)}100%{opacity:1;'+
							'-webkit-transform:none;-ms-transform:none;transform:none}}.fadeInUp{-webkit-animation-name:fadeInUp;animation-name:fadeInUp}'+
							
							'@-webkit-keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}100%{opacity:1;-webkit-transform:none;transform:none}}'+
							'@keyframes fadeInDown{0%{opacity:0;-webkit-transform:translate3d(0,-100%,0);-ms-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}100%{opacity:1;'+
							'-webkit-transform:none;-ms-transform:none;transform:none}}.fadeInDown{-webkit-animation-name:fadeInDown;animation-name:fadeInDown}'+
							
							'@-webkit-keyframes fadeOutDown{from {  opacity: 1;}to {  opacity: 0;  -webkit-transform: translate3d(0, 100%, 0);  transform: translate3d(0, 100%, 0);}}'+
							'@keyframes fadeOutDown {from {  opacity: 1;}to {  opacity: 0;  -webkit-transform: translate3d(0, 100%, 0);  transform: translate3d(0, 100%, 0);}}'+
							'.fadeOutDown {-webkit-animation-name: fadeOutDown;  animation-name: fadeOutDown;}'+
							
							'@-webkit-keyframes fadeOutUp{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}'+
							'@keyframes fadeOutUp{0%{opacity:1}100%{opacity:0;-webkit-transform:translate3d(0,-100%,0);transform:translate3d(0,-100%,0)}}'+
							'.fadeOutUp{-webkit-animation-name:fadeOutUp;animation-name:fadeOutUp}@-webkit-keyframes fadeOutUpBig{0%{opacity:1}100%'+
							'{opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}@keyframes fadeOutUpBig{0%{opacity:1}100%{'+
							'opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}';
			if(document.getElementById("createAniCss")){						
			} else {											
				var nod=$("<style type='text/css' id='createAniCss'>"+css_txt+"</style>");
				$("head").append(nod);
			} 					
	},
	
 	//----------------------------------
    // 动画信息通知 zlb 2016-10-19
	//----------------------------------
	popdivAnim:function(x,txt){		
		var css_txt='#info_pop_div_close{position:absolute; z-index:200; animation-duration: 0.8s;animation-delay: 0.1s; font-weight:bold; font-size:16px; width:450px; height:40px; '+
							'line-height:40px;left:50%;top:200px;margin-left:-225px;  background-color:#fff; border:solid 1px #00d4c3; border-radius:1px; border-radius:5px; text-align:center; color:#00d4c3; display:none}';
		if(document.getElementById("popdivAnim_css")){								
		} else {											
			var nod=$("<style type='text/css' id='popdivAnim_css'>"+css_txt+"</style>");
			$("head").append(nod);
		} 	
		var info_pop_div_close=$('<div id="info_pop_div_close"></div>');
		$("#info_pop_div_close").remove();
		$('body').append(info_pop_div_close);		
		$("#info_pop_div_close").click(function(){
			$('#info_pop_div_close').fadeOut();
			});			
		$('#info_pop_div_close').text(txt).css("top",$(document).scrollTop()+300).show();
		
		if(jQuery.isIE()<9){
			 window.setTimeout(function(){
						  $('#info_pop_div_close').fadeOut()
						  },1000);
		}else{
			$('#info_pop_div_close').removeClass().addClass(x+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
					$(this).removeClass();
					  window.setTimeout(function(){
						  $('#info_pop_div_close').fadeOut()
						  },1000);
				});
		}
 	},			
    //----------------------------------
    //直接弹出正在加载中div
	//----------------------------------
	pop_info_loading: function (options) { 
		var my_params={
			event:"click",
			_popmothod:'fadeInUp',
			_closemothod:'fadeOutUp',
			_txtColor:'#00c5b5',
			_txtFontSize:'16px',
			_isAutoClose:true,  //是否自动关闭
			_AutoCloseTime:2000,//多少毫秒后关闭
			_waringTxt:'正在加载,请稍候...'	
			}
		var ops=$.extend(true,{},my_params, options);	
		var createUI=function(){
			var pmd='<marquee scrollamount="2" behavior="alternate" direction="right" width="150">'+ops._waringTxt+'</marquee>';
			var bg_obj=$("<div id='pop_info_loadng_div_bg' class='pop_info_loadng_div_bg'></div>");
			var pop_obj=$("<div id='pop_info_loadng' class='pop_info_loadng'>"+pmd+"</div>");
			var newTop=($(document).height()-100)/2+$(document).scrollTop();
			$("#pop_info_loadng_div_bg").remove();
			$("#pop_info_loadng").remove();
			$('body').append(bg_obj);
			$('body').append(pop_obj);
			$("#pop_info_loadng_div_bg").show()/*.animate({top:"0px"},500)*/;
			$("#pop_info_loadng").show();//.animate({top:newTop+"0px"},500,'easeOutExpo');
			if(jQuery.isIE()>8){
				$('#pop_info_loadng').addClass(ops._popmothod+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){});
			}
			}	
			
		var  createCss=function(){
				if(document.getElementById("pop_info_loadng_css")){								
				} else {											
					var cssStr='',newLeft=($(document).width()-450)/2;
					var newTop=($(document).height()-100)/2+$(document).scrollTop()-50;
					cssStr+='.pop_info_loadng_div_bg{display:none;background-color:#eee;background-color:rgba(0,0,0,0.2);width:100%; z-index:100;height:'+$(document).height()+'px;position:absolute;left:0px;top:0px;}';	
					cssStr+='.pop_info_loadng{display:none;color:'+ops._txtColor+';font-size:'+ops._txtFontSize+';text-align:center;width:450px; height:100px; line-height:100px; position:absolute;z-index:101;border-radius:10px; background-color:#fff;left:'+newLeft+'px;top:'+newTop+'px;}';
					var nod=$("<style type='text/css' id='pop_info_loadng_css'>"+cssStr+"</style>");
					$("head").append(nod);
				} 				
			}			
		var clear_popinfo=function(){
			window.setTimeout(function(){	
				if(jQuery.isIE()<9){
						$("#pop_info_loadng_div_bg").fadeOut(400,function(){
						$("#pop_info_loadng_div_bg").remove();
						$("#pop_info_loadng").remove();
						});							
				}else{
				$('#pop_info_loadng').addClass(ops._closemothod+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
						$("#pop_info_loadng_div_bg").remove();
						$("#pop_info_loadng").remove();
					});					
				}				
				},ops._AutoCloseTime);	
		}		
		createCss();
		createUI();
		if(ops._isAutoClose){clear_popinfo();}		
	},	
	//----------------------------------	
	//关闭已经弹出的正在载入中的提醒
	//----------------------------------
	pop_info_loading_close: function (options) { 	
		if(jQuery.isIE()>8){
			$('#pop_info_loadng').addClass(options._closemothod+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
							$("#pop_info_loadng_div_bg").remove();
							$("#pop_info_loadng").remove();
						});	
		}else{
				$("#pop_info_loadng_div_bg").fadeOut(400,function(){
					$("#pop_info_loadng_div_bg").remove();
					$("#pop_info_loadng").remove();
					});			
		}
	},
	//----------------------------------
	//模式弹出窗
	//----------------------------------
	pop_window_modal_dialog: function (options) { 
		var my_params={
			_txtColor:'#00c5b5',
			_txtFontSize:'16px',
			_activeColor:'#00bcaa',
			_hoverColor:'#00c5b5',
			_okEvent:null,
			_cancelEvent:null,
			_radius:'5px',
			_width:350,
			_height:150,
			_popmothod:'bounceInDown',//bounceInDown，fadeInUp，	fadeInDown',
			_closemothod:'fadeOutUp',
			_warnTxt:'您确认要执行此操作吗?'
			}
		var ops=$.extend(true,{},my_params, options);	
		var  createCss=function(){
				if(document.getElementById("pop_window_modal_2016")){								
				} else {				
					var nod=document.createElement("style");				
					var strCss='',newLeft=($(document).width()-ops._width)/2;
					var newTop=($(document).height()-ops._height)/2+$(document).scrollTop()-50;
					strCss+='.pop_window_modal_div_bg{display:none;background-color:#ccc;background-color:rgba(0,0,0,0.2);width:100%; z-index:100;height:'+$(document).height()+'px;position:absolute;left:0px;top:0px;}';	
					strCss+='.pop_window_modal{display:none;color:'+ops._txtColor+';font-size:'+ops._txtFontSize+';text-align:center;width:'+ops._width+'px; height:'+ops._height+'px; position:absolute;z-index:101;border-radius:'+ops._radius+'; background-color:#fff;left:'+newLeft+'px;top:'+newTop+'px;}';
					strCss+='.pop_window_title{width:100%; height:25px; position:relative;-webkit-user-select:none}';
					strCss+='.pop_window_title span{width:20px; height:20px; border-radius:50%;text-align:center;line-height:20px;border:solid 0px '+ops._txtColor+';position:absolute;right:2px;top:2px;}';
					strCss+='.pop_window_title span:hover{background-color:'+ops._txtColor+';color:#fff;cursor:pointer}';
					strCss+='.pop_window_title span:active{background-color:'+ops._activeColor+';color:#fff;}';
					strCss+='.pop_window_foot{width:100%; height:40px; text-align:right; border-top:solid 1px #e0e0e0; background-color:#f0f0f0;border-bottom-left-radius:'+ops._radius+'; border-bottom-right-radius:'+ops._radius+'}';
					strCss+='.pop_window_content{width:100%; height:'+(ops._height-25-40)+'px; line-height:'+(ops._height-25-40-30)+'px;}';
					strCss+='.pop_window_foot button{width:100px; height:25px;border:solid 1px '+ops._txtColor+'; outline:none;margin:8px  6px ;border-radius:'+ops._radius+'}';
					strCss+='#pop_window_okbtn{background-color:'+ops._txtColor+';color:#fff;}#pop_window_okbtn:hover{background-color:'+ops._hoverColor+'}';
					strCss+='#pop_window_cancelbtn{color:'+ops._txtColor+';background-color:#fff;}#pop_window_cancelbtn:hover{background-color:'+ops._txtColor+';color:#fff}';
					strCss+='#pop_window_okbtn:active,#pop_window_cancelbtn:active{background-color:'+ops._activeColor+';color:#fff; }';
					var nod=$("<style type='text/css' id='pop_window_modal_2016'>"+strCss+"</style>");
					$("head").append(nod);
				} 				
			}
		var createUI=function(){
			var middleTxt='<div class="pop_window_title"><span onclick="javascript:jQuery.pop_window_modal_dialog_close({_closemothod:\''+ops._closemothod+'\'})">&#10005;</span></div>';
			      middleTxt+='<div class="pop_window_content"><p>'+ops._warnTxt+'</p></div>';
				  middleTxt+='<div class="pop_window_foot"><button id="pop_window_okbtn">确定</button><button id="pop_window_cancelbtn">取消</button></div>';
			var bg_obj=$("<div id='pop_window_modal_div_bg' class='pop_window_modal_div_bg'></div>");
			var pop_obj=$("<div id='pop_window_modal' class='pop_window_modal'>"+middleTxt+"</div>");
			var newTop=($(document).height()-ops._height)/2+$(document).scrollTop();
			$("#pop_info_loadng_div_bg").remove();
			$("#pop_info_loadng").remove();
			$('body').append(bg_obj);
			$('body').append(pop_obj);
			$("#pop_window_modal_div_bg").show()/*.animate({top:"0px"},500)*/;
			$("#pop_window_modal").show();//.animate({top:newTop+"0px"},500,'easeOutExpo');
			$("#pop_window_okbtn").on("click",ops._okEvent);
			$("#pop_window_cancelbtn").on("click",ops._cancelEvent);
			if(jQuery.isIE()>8){
				$('#pop_window_modal').addClass(ops._popmothod+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){});
			}
			}		
		createCss();
		createUI();
	},
	//----------------------------------
	//模式弹出窗关闭
	//----------------------------------
	pop_window_modal_dialog_close: function (options) { 
		if(jQuery.isIE()>8){
		$('#pop_window_modal').addClass(options._closemothod+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
					$("#pop_window_modal_div_bg").remove();
					$("#pop_window_modal").remove();
			});
		}else{
		$("#pop_window_modal_div_bg").fadeOut(200,function(){
				$("#pop_window_modal_div_bg").remove();
				$("#pop_window_modal").remove();
				});	
		}
	},
	
})

