 jQuery.extend({    
 	 //----------------------------------
	//模式弹出窗
	//----------------------------------
	pop_window_modal_dialog: function (options,keyval) { 
		var my_params={			
			_borderColor:'#00c5b5',
			_btnbgcolor:'#00c5b5',			
			_activeColor:'#00bcaa',
			_hoverColor:'#00AEA2',

			_title:'信息提示',
			_icotype:1, //1警告 2提醒 3询问
			_skintype:-1, //0为删除色,1为标准色
			_txtColor:'#333',
			_txtFontSize:'16px',
			_okEvent:null,
			_cancelEvent:null,
			_radius:'2px',
			_width:380,
			_height:168,
			_popmothod:'bounceInDown',//bounceInDown，fadeInUp，	fadeInDown',
			_closemothod:'fadeOutUp',
			_warnTxt:'您确认要执行此操作吗?',			
			_btnText:[],
			_idkey:''  //传递关键参数
			};
		var colorArr=[{
				_borderColor:'#F86D5A',
			         	_btnbgcolor:'#F86D5A',			
			         	_activeColor:'#B91D06',
			        	_hoverColor:'#F73013'
			        },
			       {
				_borderColor:'#00c5b5',
				_btnbgcolor:'#00c5b5',			
				_activeColor:'#00bcaa',
				_hoverColor:'#00AEA2'
			      }];	
		var ops=$.extend(true,{},my_params, options);	
		var icoSrc='wakeup.png';
		switch(ops._icotype){
			case 1:
				icoSrc="waring.png";
				break;
			case 2:
				icoSrc="wakeup.png";
				break;	
			case 3:
				icoSrc="request.png";
				break;			
		}
		var  createCss=function(){
				if(ops._skintype>-1){
					var colorObj=colorArr[ops._skintype];
					ops._borderColor=colorObj._borderColor;
					ops._btnbgcolor=colorObj._btnbgcolor;			
					ops._activeColor=colorObj._activeColor;
					ops._hoverColor=colorObj._hoverColor;
				}
				if(document.getElementById("pop_window_modal_2016")){								
				} else {				
					var nod=document.createElement("style");				
					var strCss='',newLeft=($(document).width()-ops._width)/2;
					var newTop=($(document).height()-ops._height)/2+$(document).scrollTop()-50;
					strCss+='.pop_window_modal_div_bg{display:none;background-color:#ccc;background-color:rgba(0,0,0,0.2);width:100%; z-index:100;height:'+$(document).height()+'px;position:absolute;left:0px;top:0px;}';	
					strCss+='.pop_window_modal{box-shadow:0px 0px 10px #333;display:none;color:'+ops._txtColor+';font-size:'+ops._txtFontSize+';text-align:center;font-family:微软雅黑;width:'+ops._width+'px; position:absolute;z-index:101;border-radius:'+ops._radius+'; background-color:#fff;left:'+newLeft+'px;top:'+newTop+'px;}';
					strCss+='.pop_window_title{width:100%; height:44px; line-height:44px;position:relative;-webkit-user-select:none; border-bottom:solid 1px #F0F0F0; color:#000}';
					strCss+='.pop_window_title span{width:20px; height:20px; border-radius:50%;text-align:center;line-height:20px;border:solid 0px '+ops._txtColor+';position:absolute;right:10px;top:10px;}';
					strCss+='.pop_window_title span:hover{background-color:'+ops._borderColor+';color:#fff;cursor:pointer}';
					strCss+='.pop_window_title span:active{background-color:'+ops._activeColor+';color:#fff;}';
					strCss+='.pop_window_foot{width:100%; height:72px; text-align:center; border-top:solid 0px #e0e0e0; background-color:#FFF;border-bottom-left-radius:'+ops._radius+'; border-bottom-right-radius:'+ops._radius+'}';
					strCss+='.pop_window_content{width:'+ops._width+'px; height:'+(ops._height-25-40)+'px;display:table-cell;vertical-align:middle; text-align:left;position:relative; line-height:}';
					strCss+='.pop_window_content img{margin:auto auto auto 60px;}';
					strCss+='.pop_window_content .info_txt{ width:210px; height:90%; text-align:left; border:solid 0px; margin-left:20px;  background-color:#fff}';
					strCss+='.pop_window_foot button{width:100px; height:30px;border:solid 1px '+ops._borderColor+'; outline:none;margin:8px  6px ;border-radius:'+ops._radius+';font-family:微软雅黑}';
					strCss+='#pop_window_okbtn{background-color:'+ops._btnbgcolor+';color:#fff;}#pop_window_okbtn:hover{background-color:'+ops._hoverColor+'}';
					strCss+='#pop_window_cancelbtn{color:'+ops._txtColor+';background-color:#fff;}#pop_window_cancelbtn:hover{background-color:'+ops._btnbgcolor+';color:#fff}';
					strCss+='#pop_window_okbtn:active,#pop_window_cancelbtn:active{background-color:'+ops._activeColor+';color:#fff; }';
					strCss+='.w180{width:180px !important}';
					var nod=$("<style type='text/css' id='pop_window_modal_2016'>"+strCss+"</style>");
					$("head").append(nod);
				} 				
			}
		var createUI=function(){
			var middleTxt='<div class="pop_window_title">'+ops._title+'<span  onclick="javascript:jQuery.pop_window_modal_dialog_close({_closemothod:\''+ops._closemothod+'\'})">&#10005;</span></div>';
			      middleTxt+='<div class="pop_window_content"><table border=0 cellpadding="5"><tr><td width="120"><img src="/static/public/ico/'+icoSrc+'"/></td><td width="210"><span class="info_txt">'+ops._warnTxt+'</span></td></tr></table></div>';				 
				if(ops._btnText.length>1){
					middleTxt+='<div class="pop_window_foot"><button id="pop_window_okbtn">'+ops._btnText[0]+'</button>';				
				 	middleTxt+='<button id="pop_window_cancelbtn">'+ops._btnText[1]+'</button></div>';
				}else{
					middleTxt+='<div class="pop_window_foot"><button id="pop_window_okbtn" class="w180">'+ops._btnText[0]+'</button></div>';
				}
			var bg_obj=$("<div id='pop_window_modal_div_bg' class='pop_window_modal_div_bg'></div>");
			var pop_obj=$("<div id='pop_window_modal' class='pop_window_modal'>"+middleTxt+"</div>");
			var newTop=($(document).height()-ops._height)/2+$(document).scrollTop();
			$("#pop_info_loadng_div_bg").remove();
			$("#pop_info_loadng").remove();
			$('body').append(bg_obj);
			$('body').append(pop_obj);
			$("#pop_window_modal_div_bg").show()/*.animate({top:"0px"},500)*/;
			$("#pop_window_modal").show();//.animate({top:newTop+"0px"},500,'easeOutExpo');
			$("#pop_window_okbtn").attr('data-keyval',keyval).on("click",ops._okEvent);
			$("#pop_window_cancelbtn").on("click",ops._cancelEvent);
			if(jQuery.isIE()>8){
				$('#pop_window_modal').addClass(ops._popmothod+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){});
			}
		};
		
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
	postOk:function(x,txt){
		var Txtinfo='';
		if(typeof(txt)!='undefined'){
			Txtinfo=txt;
		}
		if(Txtinfo==''){
			Txtinfo='提交成功';
		}
		var css='style="position:absolute;z-index:1000;height:60px;top:200px;box-sizing:border-box;padding-left:65px; padding-right:40px; line-height:60px;border-radius:2px;'+
			' background-image:url(/static/public/img/ok.png);background-position:30px 20px; background-repeat:no-repeat; background-color:rgba(0,0,0,0.5); font-family:微软雅黑; color:#fff"';
		var info_pop_postok=$('<div '+css+' id="info_pop_postok">'+Txtinfo+'</div>');
		$("#info_pop_postok").remove();
		$('body').append(info_pop_postok);
		$("#info_pop_postok").click(function(){
			$('#info_pop_postok').fadeOut();
		});		 
		
		$('#info_pop_postok').css({"left":($(window).width()-$('#info_pop_postok').outerWidth())/2,"top":$(document).scrollTop()+300}).show();
		if(jQuery.isIE()<9){
			window.setTimeout(function(){
				$('#info_pop_postok').fadeOut();
			},1000);
		}else{
			$('#info_pop_postok').removeClass().addClass(x+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
				$(this).removeClass();
				  window.setTimeout(function(){
				  $('#info_pop_postok').fadeOut();
				},1000);
			});
		}
	},

	//----------------------------------
	//顶部提示信息条
	//----------------------------------
	waring:function(txt){
		var Txtinfo='';
		if(typeof(txt)!='undefined'){
			Txtinfo=txt;
		}
		if(Txtinfo==''){
			Txtinfo='提交失败';
		}
		var css='style="position:absolute;z-index:1000;height:35px;top:0px;box-sizing:border-box; padding-left:40px;padding-right:40px; line-height:35px;min-width:340px; text-align:center; border-radius:2px;'+
			' background-color:#EAA000; font-family:微软雅黑; font-size:14px; color:#fff; display:none"';
		var info_pop_waring=$('<div '+css+' id="info_pop_waring">'+Txtinfo+'</div>');
		$("#info_pop_waring").remove();
		$('body').append(info_pop_waring);
		var newLeft=-$('#info_pop_waring').outerWidth()/2;
		$("#info_pop_waring").css({"left":"50%","margin-left":+newLeft+"px"}).show();
		$("#info_pop_waring").click(function(){
			$('#info_pop_waring').fadeOut();
		});
		var t=window.setTimeout(function(){
			clearTimeout(t);
			$("#info_pop_waring").fadeOut();
		},2000);

	},
	postFail:function(x,txt){
		var Txtinfo='';
		if(typeof(txt)!='undefined'){
			Txtinfo=txt;
		}
		if(Txtinfo==''){
			Txtinfo='提交失败';
		}
		var css='style="position:absolute;z-index:1000;height:60px;top:200px;box-sizing:border-box;padding-left:65px; padding-right:40px; line-height:60px;border-radius:2px;'+
			' background-image:url(/static/public/img/no.png);background-position:30px 20px; background-repeat:no-repeat; background-color:#f42c24; font-family:微软雅黑; color:#fff"';
		var info_pop_postFail=$('<div '+css+' id="info_pop_postFail">'+Txtinfo+'</div>');
		$("#info_pop_postFail").remove();
		$('body').append(info_pop_postFail);
		$("#info_pop_postFail").click(function(){
			$('#info_pop_postFail').fadeOut();
		});
	 
		$('#info_pop_postFail').css({"left":($(window).width()-$('#info_pop_postFail').outerWidth())/2,"top":$(document).scrollTop()+300}).show();
		if(jQuery.isIE()<9){
			window.setTimeout(function(){
				$('#info_pop_postFail').fadeOut();
			},1000);
		}else{
			$('#info_pop_postFail').removeClass().addClass(x+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
				$(this).removeClass();
				  window.setTimeout(function(){
				  $('#info_pop_postFail').fadeOut();
				},1000);
			});
		}		
	},
	//----------------------------------
	// 动画信息通知 zlb 2016-10-19
	//----------------------------------
	popdivAnim:function(x,txt){		
		var css_txt='#info_pop_div_close{position:absolute; z-index:200; animation-duration: 0.8s;animation-delay: 0.1s; font-weight:bold; font-size:16px; width:450px; height:40px; '+
			      'line-height:40px;left:50%;top:200px;margin-left:-225px;  background-color:#fff; border:solid 1px #00d4c3; border-radius:1px; border-radius:5px; text-align:center; '+
			      'color:#00d4c3; display:none}';
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
				$('#info_pop_div_close').fadeOut();
			},1000);
		}else{
			$('#info_pop_div_close').removeClass().addClass(x+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
				$(this).removeClass();
				  window.setTimeout(function(){
				  $('#info_pop_div_close').fadeOut();
				},1000);
			});
		}
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
	
 });