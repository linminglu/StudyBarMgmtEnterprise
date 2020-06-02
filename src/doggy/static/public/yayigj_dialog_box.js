 jQuery.extend({    
 	//----------------------------------
	//模式弹出窗 zlb
	//----------------------------------
	pop_window_modal_dialog: function (options,keyval) { 
		var my_params={			
			_borderColor:'#47a6a0',
			_btnbgcolor:'#47a6a0',			
			_activeColor:'#328b83',
			_hoverColor:'#55c6bf',
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
			_op:0.2,
			_idkey:''  //传递关键参数
			};
		var ops=$.extend(true,{},my_params, options);		
		var colorArr=[{
						_borderColor:'#F86D5A', //红色
			         	_btnbgcolor:'#F86D5A',			
			         	_activeColor:'#B91D06',
			        	_hoverColor:'#F73013'
			        },{
						_borderColor:'#00c5b5',  //正常色
						_btnbgcolor:'#00c5b5',			
						_activeColor:'#00bcaa',
						_hoverColor:'#00AEA2'
			      },{
					  	_borderColor:'#f1cf66',		//取消色
						_btnbgcolor:'#fff7e0',			
						_activeColor:'#F52D00',
						_hoverColor:'#ea8800',
						_txtColor:'#e8af00',
						_txtHvColor:'#ea8800',
						_txtAcColor:'#fff',
				  }				  
				  ];	
		var skinColor=jQuery.getPlusColors();
		try{
			if(typeof(skinColor)!='undefined' && skinColor.length>0){
				//console.log('skinColor=',skinColor);
					colorArr[2]._borderColor=skinColor[0][2].split(':')[1];
					colorArr[2]._btnbgcolor=	skinColor[0][1].split(':')[1];
					colorArr[2]._activeColor=	skinColor[2][1].split(':')[1];
					colorArr[2]._hoverColor=	skinColor[1][1].split(':')[1];	
					colorArr[2]._txtColor=		skinColor[0][3].split(':')[1];
					colorArr[2]._txtHvColor=	skinColor[1][3].split(':')[1];
					colorArr[2]._txtAcColor=	skinColor[2][3].split(':')[1];			
								
					colorArr[1]._borderColor=skinColor[4][2].split(':')[1];
					colorArr[1]._btnbgcolor=skinColor[4][1].split(':')[1];
					colorArr[1]._activeColor=skinColor[6][1].split(':')[1];
					colorArr[1]._hoverColor=skinColor[5][1].split(':')[1];
					
					colorArr[0]._borderColor=skinColor[4][2].split(':')[1];
					colorArr[0]._btnbgcolor=skinColor[4][1].split(':')[1];
					colorArr[0]._activeColor=skinColor[6][1].split(':')[1];
					colorArr[0]._hoverColor=skinColor[5][1].split(':')[1];
					
					ops._borderColor=colorArr[1]._borderColor;
					ops._btnbgcolor=colorArr[1]._btnbgcolor;			
					ops._activeColor=colorArr[1]._activeColor;
					ops._hoverColor=colorArr[1]._hoverColor;
			}
		}catch(e){
			
		}
		
		var icoSrc='wakeup.png';
		switch(ops._icotype){
			case 1:
				icoSrc="Error.png";
				break;
			case 2:
				icoSrc="Warning.png";
				break;	
			case 3:
				icoSrc="Quest.png";
				break;			
		}
		var  createCss=function(){
				if(ops._skintype>-1 && typeof(skinColor)!='undefined'){
					var colorObj=colorArr[ops._skintype];
					ops._borderColor=colorObj._borderColor;
					ops._btnbgcolor=colorObj._btnbgcolor;			
					ops._activeColor=colorObj._activeColor;
					ops._hoverColor=colorObj._hoverColor;
				}
				if(document.getElementById("pop_window_modal_2016")){								
				} else {				
					var nod=document.createElement("style");				
					var strCss='',newLeft=($(document).width()-ops._width)/2;+$(document).scrollLeft();
					var newTop=($(window).height()-ops._height)/2+$(document).scrollTop()-50;
					strCss+='.pop_window_modal_div_bg{display:none;background-color:#ccc;background-color:rgba(0,0,0,1);width:'+$(document).width()+'px; z-index:99999998;height:'+$(document).height()+'px;position:absolute;left:0px;top:0px;}';	
					strCss+='.pop_window_modal{box-shadow:0px 0px 10px #333;display:none;color:'+ops._txtColor+';font-size:'+ops._txtFontSize+';text-align:center;font-family:微软雅黑;width:'+ops._width+'px; position:absolute;z-index:99999999;border-radius:'+ops._radius+'; background-color:#fff;left:'+newLeft+'px;top:'+newTop+'px;}';
					strCss+='.pop_window_title{width:100%; height:44px; line-height:44px;position:relative;-webkit-user-select:none; border-bottom:solid 1px #F0F0F0; color:#000}';
					strCss+='.pop_window_title span{width:44px; height:44px; text-align:center;line-height:44px;border:solid 0px '+ops._txtColor+';position:absolute;right:0px;top:0px;}';
					strCss+='.pop_window_title span:hover{background-color:#F86D5A;color:#eee;cursor:pointer}';  
					strCss+='.pop_window_title span:active{background-color:#DF6251;color:#eee;}';
					strCss+='.pop_window_foot{width:100%; height:72px; text-align:center; border-top:solid 0px #e0e0e0; background-color:#FFF;border-bottom-left-radius:'+ops._radius+'; border-bottom-right-radius:'+ops._radius+'}';
					strCss+='.pop_window_content{width:'+ops._width+'px; height:'+(ops._height-25-40)+'px;display:table-cell;vertical-align:middle; text-align:left;position:relative; line-height:}';
					strCss+='.pop_window_content img{margin:auto auto auto 60px;}';
					strCss+='.pop_window_content .info_txt{ width:210px; height:90%; text-align:left; border:solid 0px; margin-left:0px;  background-color:#fff;font-size:14px;word-break: break-all;}';
					strCss+='.pop_window_foot button{cursor:pointer;width:100px; height:30px;border:solid 1px '+ops._borderColor+'; outline:none;margin:8px  6px ;border-radius:'+ops._radius+';font-family:微软雅黑; }';
					//strCss+='#pop_window_okbtn{background-color:'+ops._btnbgcolor+';color:#fff;}#pop_window_okbtn:hover{background-color:'+ops._hoverColor+'}';
					//strCss+='#pop_window_cancelbtn{color:'+ops._txtColor+';background-color:#fff;}#pop_window_cancelbtn:hover{background-color:'+ops._btnbgcolor+';color:#fff}';
					//strCss+='#pop_window_okbtn:active,#pop_window_cancelbtn:active{background-color:'+ops._activeColor+';color:#fff; }';
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


			var newTop=($(window).height()-ops._height)/2+$(document).scrollTop();
			var newLeft=($(window).width()-ops._width)/2+$(document).scrollLeft();
			pop_obj.css({"top":newTop,"left":newLeft});
			$("#pop_info_loadng_div_bg").remove();
			$("#pop_info_loadng").remove();

			//20170904 liqin 创建元素时再判断一次页面是否已存在；
			if($("#pop_window_modal").length>0){
				$("#pop_window_modal").remove();
				$("#pop_window_modal_div_bg").remove();
			}
			$('body').append(bg_obj);
			$('body').append(pop_obj);
			$("#pop_window_modal_div_bg").css("opacity",ops._op);
			$("#pop_window_okbtn").css({"background-color":ops._btnbgcolor,"color":"#fff","border":"solid 1px "+ops._borderColor}).hover(
				function(){$(this).css({"background-color":ops._hoverColor,"border-color":ops._hoverColor})},
				function(){$(this).css({"background-color":ops._btnbgcolor,"border-color":ops._btnbgcolor})}
			).mousedown(function(){$(this).css("background-color",ops._activeColor);}).mouseup(function(){$(this).css("background-color",ops._hoverColor);});
			
			$("#pop_window_cancelbtn").css({"background-color":"#fff7e0","color":"#333","border":"solid 1px #f1cf66"}).hover(
				function(){$(this).css({"background-color":"#ffefe0","color":"#333","border-color":'#ea8800'})},
				function(){$(this).css({"background-color":"#fff7e0","color":"#333","border-color":'#f1cf66'})}
			).mousedown(function(){
				$(this).css({"background-color":"#F52D00","color":"#fff","border":" solid 1px #F52D00"});})
				.mouseup(function(){$(this).css({"background-color":"#fff7e0","color":"#333","border":"solid 1px #f1cf66"});});

			$("#pop_window_modal_div_bg").show().css({"width":$(document).width(),"heigth":$(document).height(),"opacity":ops._op})/*.animate({top:"0px"},500)*/;
			$("#pop_window_modal").show();//.animate({top:newTop+"0px"},500,'easeOutExpo');
			$(window).bind('mousewheel',function(){				
				return false;			
			});
			$("#pop_window_okbtn").attr('data-keyval',keyval).on("click",ops._okEvent);
			$("#pop_window_cancelbtn").on("click",ops._cancelEvent);
			//if(jQuery.isIE()>8){
			//	$('#pop_window_modal').addClass(ops._popmothod+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){});
			//}
		};		
		createCss();
		createUI();
	},
	//----------------------------------
	//模式弹出窗关闭
	//----------------------------------
	pop_window_modal_dialog_close: function (options) { 
		/*if(jQuery.isIE()>8){
		$('#pop_window_modal').addClass(options._closemothod+' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend',function(){
				$("#pop_window_modal_div_bg").remove();
				$("#pop_window_modal").remove();
			});
		}else{*/
		$("#pop_window_modal_div_bg").fadeOut(50,function(){
			$("#pop_window_modal_div_bg").remove();
			$("#pop_window_modal").remove();
			});	
		//}
		$(window).unbind('mousewheel');
	},
	//----------------------------------
	// 提交成功
	//----------------------------------
	postOk:function(x,txt){
		var Txtinfo='';
		if(typeof(txt)!='undefined'){
			Txtinfo=txt;
		}
		if(Txtinfo==''){
			Txtinfo='提交成功';
		}
		var css='style="position:absolute;z-index:100000000;height:60px;top:200px;box-sizing:border-box;padding-left:65px; padding-right:40px; line-height:60px;border-radius:2px;'+
			' background-image:url(/static/public/img/ok.png);background-position:30px 20px; background-repeat:no-repeat; background-color:rgba(0,0,0,0.5); font-family:微软雅黑; color:#fff"';
		var info_pop_postok=$('<div '+css+' id="info_pop_postok">'+Txtinfo+'</div>');
		$("#info_pop_postok").remove();
		$('body').append(info_pop_postok);
		$("#info_pop_postok").click(function(){
			$('#info_pop_postok').fadeOut();
		});		 
		var _w_left=$(document).scrollLeft();	//20170401 liqin 左边定位加上了文档的滚动位置。
		$('#info_pop_postok').css({"left":(($(window).width()-$('#info_pop_postok').outerWidth())/2)+_w_left,"top":$(document).scrollTop()+300}).show();
		window.setTimeout(function(){
				$('#info_pop_postok').fadeOut();
			},1000);
		/*if(jQuery.isIE()<9){
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
		}*/
	},
	//----------------------------------
	// 提交失败
	//----------------------------------
	postFail:function(x,txt){
		var Txtinfo='';
		if(typeof(txt)!='undefined'){
			Txtinfo=txt;
		}
		if(Txtinfo==''){
			Txtinfo='提交失败';
		}

		jQuery.showError(Txtinfo,'信息反馈');
		return false;

		var css='style="position:absolute;z-index:100000000;height:60px;top:200px;box-sizing:border-box;padding-left:65px; padding-right:40px; line-height:60px;border-radius:2px;'+
			' background-image:url(/static/public/img/no.png);background-position:30px 20px; background-repeat:no-repeat; background-color:#f42c24; font-family:微软雅黑; color:#fff"';
		var info_pop_postFail=$('<div '+css+' id="info_pop_postFail">'+Txtinfo+'</div>');
		$("#info_pop_postFail").remove();
		$('body').append(info_pop_postFail);
		$("#info_pop_postFail").click(function(){
			$('#info_pop_postFail').fadeOut();
		});
	 
		$('#info_pop_postFail').css({"left":($(window).width()-$('#info_pop_postFail').outerWidth())/2,"top":$(document).scrollTop()+300}).show();
		window.setTimeout(function(){
				$('#info_pop_postFail').fadeOut();
			},1000);
		/*if(jQuery.isIE()<9){
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
		}		*/
	},
	//----------------------------------
	// 载入时动态gif呈现
	//----------------------------------
	loading:function(txt,isBg,zindex){
		var is_bg=-1;
		
		if(typeof(isBg)!='undefined'){
			is_bg=isBg;
		}
		if(isBg==0){
				is_bg=-1;
		}
		var Txtinfo='';
		if(typeof(txt)!='undefined'){
			Txtinfo=txt;
		}
		if(typeof(zindex)=='undefined'){
			zindex=88888888;	
		}
		var newTop=($(window).height()-33)/2+$(document).scrollTop()-50;
		//console.log('newTop=',newTop);
		//var css='style="position:absolute;z-index:'+zindex+';height:66px;line-height:66px;top:'+newTop+'px;width:66px;text-align:center;left:50%;margin-left:-33px;'+
		//	' font-family:微软雅黑; font-size:14px; color:#fff; background-image:url(/static/public/img/loading.gif);font-size:12px;color:#ccc"';
		
        var css='width: 72px; height: 72px; z-index:'+zindex+';position: absolute; top: '+newTop+'px; left: 50%; margin-left: -66px;';
		// var css='width: 72px; height: 72px; z-index:'+zindex+';position: absolute; background:url(/static/public/img/loadingnews.gif); top: '+newTop+'px; left: 50%; '+
		//               'margin-left: -36px;';
		//console.log('css=',css);			  
		//var info_pop_loading=$('<div  style="'+css+'" id="info_pop_loading"></div>');
		var info_pop_loading=('<div style="'+css+'" id="info_pop_loading" class="loader">'+
									'<div class="loading_new">'+
								    '<div class="dot"></div>'+
								    '<div class="dot"></div>'+
								    '<div class="dot"></div>'+
								    '<div class="dot"></div>'+
								    '<div class="dot"></div>'+
								  '</div>'+
								'</div>');
		$("#info_pop_loading").remove();
		$('body').append(info_pop_loading);

		if(is_bg>-1){
			jQuery.gen_bg_div(zindex-1,0);
		}
	},
	loading_sub:function(obj,isBg,zindex){
		var parentObj=-1;
		if(typeof(obj)!='undefined'){
			parentObj=obj;
		}
		var is_bg=-1;
		if(typeof(isBg)!='undefined'){
			is_bg=isBg;
		}
		if(typeof(zindex)=='undefined'){
			zindex=88888888;	
		}
        var css='width: 72px; height: 72px; z-index:'+zindex+';position: absolute; top: 50%; left: 50%; margin-left: -66px;margin-top:-40px';
		
		var info_pop_loading=('<div style="'+css+'" id="info_pop_loading" class="loader">'+
									'<div class="loading_new">'+
								    '<div class="dot"></div>'+
								    '<div class="dot"></div>'+
								    '<div class="dot"></div>'+
								    '<div class="dot"></div>'+
								    '<div class="dot"></div>'+
								  '</div>'+
								'</div>');
		$("#info_pop_loading").remove();
		$(parentObj).after(info_pop_loading);

		if(is_bg>-1){
			jQuery.gen_bg_div(zindex-1,0);
		}
	},
	loading_close:function(clsbg){
		$("#info_pop_loading").fadeOut(200,function(){
		$("#info_pop_loading").remove();
		if(typeof(clsbg)=='undefined' || clsbg==''){
			jQuery.gen_bg_div_close();
		}else{			
		}		
		});
	},
	//----------------------------------
	//创建背景层
	//----------------------------------
	gen_bg_div:function(zindex,opacity,noclkclose){
		var jquery_bg=$("<div id='jquery_bg_div' style='background-color:#000; opacity:"+opacity+"; width:100%; position:absolute;height:"+$(document).height()+"px; z-index:"+zindex+"; left:0px; top:0px;'></div>");
		jquery_bg.on("DOMMouseScroll mousewheel",function(){return false;});
		jquery_bg.on("click",function(){
			if(noclkclose){
			}else{
				$(this).remove();
			}
		});
		$("#jquery_bg_div").remove();
		$("body").append(jquery_bg);
	},
	gen_bg_div_close:function(){		
		$("#jquery_bg_div").remove();
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
		var css='style="position:fixed;z-index:1000;height:35px;top:0px;box-sizing:border-box; padding-left:40px;padding-right:40px; line-height:35px;min-width:340px; text-align:center; border-radius:2px;'+
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
	showError_tmbg:function(info,title,callback){
				jQuery.pop_window_modal_dialog({
					_popmothod:'fadeInUp', 
					_warnTxt:info,
					_icotype:1, 
					_title:title,	
					_op:0,		
					_skintype:0,
					_btnText:new Array("关闭"),
					_closemothod:'fadeOutUp', 
					_okEvent:function(e){
						//20170821 liqin 增加了点击“确定”后的回调函数
						if(typeof(callback)=='function'){
							callback();
						}					
						jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
						},
					_cancelEvent:function(e){					
						jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
						}						
					}); 
	},	
	showError:function(info,title,callback){
				jQuery.pop_window_modal_dialog({
					_popmothod:'fadeInUp', 
					_warnTxt:info,
					_icotype:1, 
					_title:title,			
					_skintype:0,
					_btnText:new Array("关闭"),
					_closemothod:'fadeOutUp', 
					_okEvent:function(e){
						//20170821 liqin 增加了点击“确定”后的回调函数
						if(typeof(callback)=='function'){
							callback();
						}					
						jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
						},
					_cancelEvent:function(e){					
						jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
						}						
					}); 
	},	
	showAsk:function(info,title,okEvent,cancelEvent){
				jQuery.pop_window_modal_dialog({
					_popmothod:'fadeInUp', 
					_warnTxt:info,
					_icotype:3, 
					_title:title,			
					_skintype:1,
					_btnText:new Array("确定","取消"),
					_closemothod:'fadeOutUp', 
					_okEvent:okEvent,
					_cancelEvent:cancelEvent	
					}); 
	},	
	showDel:function(info,title,okEvent,cancelEvent,op){
				jQuery.pop_window_modal_dialog({
					_popmothod:'fadeInUp', 
					_warnTxt:info,
					_icotype:2, 
					_title:title,			
					_skintype:0,
					_btnText:new Array("确定","取消"),
					_closemothod:'fadeOutUp', 
					_okEvent:okEvent,
					_cancelEvent:cancelEvent,
					_op:op
					}); 
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
		window.setTimeout(function(){
				$('#info_pop_div_close').fadeOut();
			},1000);
		/*if(jQuery.isIE()<9){
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
		}*/
 	},

	//----------------------------------
    	// 常用几种动画样式预备 zlb 2016-10-20
	//----------------------------------
	createAniCss:function(){
			var css_txt='@-webkit-keyframes circle_loading{0%{ transform:rotate(0deg); }100%{ transform:rotate(360deg); }}';
			css_txt+='.loader{text-align:center;margin-top:50px}.loading_new{position:relative;display:inline-block}.loading_new .dot{position:absolute;opacity:0;width:64px;height:64px;-webkit-transform:rotate(225deg);-moz-transform:rotate(225deg);-o-transform:rotate(225deg);-ms-transform:rotate(225deg);transform:rotate(225deg);-webkit-animation-name:loading;-moz-animation-name:loading;-ms-animation-name:loading;-o-animation-name:loading;animation-name:loading;-webkit-animation-iteration-count:infinite;-moz-animation-iteration-count:infinite;-ms-animation-iteration-count:infinite;-o-animation-iteration-count:infinite;animation-iteration-count:infinite;-o-animation-duration:5.28s;-moz-animation-duration:5.28s;-webkit-animation-duration:5.28s;animation-duration:5.28s}.loading_new .dot:after{content:"";position:absolute;width:6px;height:6px;border-radius:50%;background:#55c6bf}.loading_new .dot:nth-child(2){-webkit-animation-delay:.23s;-moz-animation-delay:.23s;-ms-animation-delay:.23s;-o-animation-delay:.23s;animation-delay:.23s}.loading_new .dot:nth-child(3){-webkit-animation-delay:.46s;-moz-animation-delay:.46s;-ms-animation-delay:.46s;-o-animation-delay:.46s;animation-delay:.46s}.loading_new .dot:nth-child(4){-webkit-animation-delay:.69s;-moz-animation-delay:.69s;-ms-animation-delay:.69s;-o-animation-delay:.69s;animation-delay:.69s}.loading_new .dot:nth-child(5){-webkit-animation-delay:.92s;-moz-animation-delay:.92s;-ms-animation-delay:.92s;-o-animation-delay:.92s;animation-delay:.92s}@-webkit-keyframes loading{0%{-webkit-transform:rotate(225deg);opacity:1;-webkit-animation-timing-function:ease-out}8%{-webkit-transform:rotate(345deg);-webkit-animation-timing-function:linear}30%{-webkit-transform:rotate(455deg);-webkit-animation-timing-function:ease-in-out}40%{-webkit-transform:rotate(690deg);-webkit-animation-timing-function:linear}60%{-webkit-transform:rotate(815deg);opacity:1;-webkit-animation-timing-function:ease-out}75%{-webkit-transform:rotate(965deg);-webkit-animation-timing-function:ease-out}76%{opacity:0}100%{opacity:0}}@-moz-keyframes loading{0%{-moz-transform:rotate(225deg);opacity:1;-moz-animation-timing-function:ease-out}8%{-moz-transform:rotate(345deg);-moz-animation-timing-function:linear}30%{-moz-transform:rotate(455deg);-moz-animation-timing-function:ease-in-out}40%{-moz-transform:rotate(690deg);-moz-animation-timing-function:linear}60%{-moz-transform:rotate(815deg);opacity:1;-moz-animation-timing-function:ease-out}75%{-moz-transform:rotate(965deg);-moz-animation-timing-function:ease-out}76%{opacity:0}100%{opacity:0}}@keyframes loading{0%{transform:rotate(225deg);opacity:1;animation-timing-function:ease-out}8%{transform:rotate(345deg);animation-timing-function:linear}30%{transform:rotate(455deg);animation-timing-function:ease-in-out}40%{transform:rotate(690deg);animation-timing-function:linear}60%{transform:rotate(815deg);opacity:1;animation-timing-function:ease-out}75%{transform:rotate(965deg);animation-timing-function:ease-out}76%{opacity:0}100%{opacity:0}}';
		/*var css_txt='.animated {-webkit-animation-duration: 1s;animation-duration: 0.6s;-webkit-animation-fill-mode: both;animation-fill-mode: both;z-index: 100;}'+
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
							'opacity:0;-webkit-transform:translate3d(0,-2000px,0);transform:translate3d(0,-2000px,0)}}';*/
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
	//----------------------------------
	// 取插件所需的色彩函数
	//----------------------------------
	getPlusColors:function(){
		 var isExistsCss=function(cssName){
					var js= /js$/i.test(name);
					var es=document.getElementsByTagName(js?'script':'link');
					for(var i=0;i<es.length;i++) 
					if(es[i][js?'src':'href'].indexOf(cssName)!=-1)return true;
					return false;	
			}
			var thatApplyCss=isExistsCss('r_input');			
				if(thatApplyCss){
					var linkHref=document.styleSheets,cssFileObj=null,icount=linkHref.length;	
					var cssFileObj=[];									
					for(var i=0;i<icount;i++){
						try{
							if(linkHref[i].href.indexOf('r_input.css')>-1 && linkHref[i].href.indexOf('disabled')==-1){			
								//canbtn
								cssFileObj.push(linkHref[i].cssRules[7].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[8].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[9].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[10].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								//okbtn
								cssFileObj.push(linkHref[i].cssRules[11].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[12].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[13].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[14].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								break;
							}														
						}catch(e){}
					}
					return cssFileObj;
					
				}
		},
 });