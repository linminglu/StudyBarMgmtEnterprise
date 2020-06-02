/*===========================
  滚动页内元素而禁止页面本身滚动插件
  216-09-18
  zlb 整理
 *===========================*/
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
/*===========================
  勾选数字插件1-9，如果超过9则提供手工录入
  216-09-18
  zlb 开发整理
 *===========================*/
(function($){	
	$.fn.zlbNumberSelectPlus=function(options,callback){
		$.fn.zlbNumberSelectPlus.defaultOptions={
			event:"click",	 		//控件的改变事件
			returnToId:null, 		//确定退出后选择的值设置到哪个控件上
			_width:500,
			_height:300,
			_btnbgcolor:"#1ab394"
		} 
		var ops=$.extend(true,{},$.fn.zlbNumberSelectPlus.defaultOptions, options);
		var that=$(this),Ownerid=that.attr('id');							//要求使用插件的控件必须提供id
		
		var NamePrefix="zlbNumberSelectPlus";  	//前缀
		var OverBgDiv=NamePrefix+'_bgDiv';							//覆盖背景名称
		var popWindow=NamePrefix+'_pop';							//弹窗名称
		var closeBtn=NamePrefix+'_close';									//弹窗关闭按钮
		var EnterBten=NamePrefix+'_ok';									//弹窗确定按钮
		
		//创建样式
		var  createCss=function(){				
				if(document.getElementById("zlbNumberSelectPlus")){				
				} else {				
					var nod=document.createElement("style");				
					var str=[];
					str.push('.zlbNumberSelectPlus_box{display: -webkit-box; display: box;-webkit-box-orient:vertical; box-orient:vertical; height: '+ops._height+'px}');
					str.push('.zlbNumberSelectPlus_top{width:100%; height:30px;}');
					str.push('.zlbNumberSelectPlus_middle{width:100%; -webkit-box-flex: 1;box-flex:1;box-sizing:border-box;padding:10px}');
					str.push('.zlbNumberSelectPlus_foot{width:100%;  height:30px }');
					str.push('.zlbNumberSelectPlus_chkNum{width:80px;float:left;height:30px;box-sizing:border-box;padding-right:10px}');
					str.push('.'+OverBgDiv+' {width:100%; left:0px;top:0px;height:'+$(document).height()+'px;z-index:1;position:absolute;background-color:rgba(0,0,0,0.1);-webkit-user-select:none}');
					str.push('.'+popWindow+'{width:'+ops._width+'px;height:'+ops._height+'px;left:'+($(window).width()-ops._width)/2+'px;top:'+($(document).height()-ops._height)/2+$(document).scrollTop()+'px;z-index:2;position:absolute;box-shadow:0px 0px 5px #bbb; background-color:#fff}');
					str.push('.'+closeBtn+'{width:20px; height:20px;border-radiaus:50%; position:absolute;right:2px; top:1px;cursor:pointer;-webkit-user-select:none;transition:all ease-out 0.05s; color:#666}');
					str.push('.'+closeBtn+':active{top:2px}');
					str.push('.'+closeBtn+':hover{color:#000}');
					str.push('.'+EnterBten+'{width:80px; height:25px;border-radiaus:5px;background-color:'+ops._btnbgcolor+';color:#fff;border:none; float:right; margin-right:10px;outline:none}');
					str.push('.'+EnterBten+':hover{background-color:#00714D;}');
					str.push('.'+EnterBten+':active{background-color:#000;}');
					nod.type="text/css";
					nod.id="zlbNumberSelectPlus";
					nod.innerHTML=str.join('');
					document.getElementsByTagName("head")[0].appendChild(nod);	
				} 				
			}
	    //创建1-30的复选框供选择	
	    var createChk=function(){
			var result=[];
			for(var i=1;i<=30;i++){
				result.push('<div class="zlbNumberSelectPlus_chkNum"><input class="chkNum" type="checkbox" data-val='+i+'>'+i+'</div>');	
			}	
			return result.join('');
		}
		//创建ui
		var createUI=function(){
			  var bg_Div=$("<div id='"+Ownerid+'_'+OverBgDiv+"' class='"+OverBgDiv+"'></div>");	
			  var pop_Div=$("<div id='"+Ownerid+'_'+popWindow+"' class='"+popWindow+"'></div>");	
			  var close_btn=$("<div id='"+Ownerid+'_'+closeBtn+"' class='"+closeBtn+"' onclick='closemy()'>&#10005;</div>");	
			  var content_area=$("<div class='zlbNumberSelectPlus_box'>"+
			                                      "<div class='zlbNumberSelectPlus_top'></div>"+
												  "<div class='zlbNumberSelectPlus_middle'>"+createChk()+"</div>"+
												  "<div class='zlbNumberSelectPlus_foot'><button class='"+EnterBten+"'  id='"+Ownerid+'_'+EnterBten+"'>确定</button></div>"+
											    "</div>");
			 pop_Div.append(close_btn);
			 pop_Div.append(content_area);
			 $("#"+OverBgDiv).remove();
			 $("#"+popWindow).remove();
			 $("body").append(bg_Div);	
			 $("body").append(pop_Div);
		}		
		//关闭弹窗
		var closeMy=function(){
			 $("#"+Ownerid+'_'+OverBgDiv).remove();
			 $("#"+Ownerid+'_'+popWindow).remove();
		}		
		//事件绑定关闭
		$(document).on("click","#"+Ownerid+'_'+closeBtn,function(){
			 closeMy();
			});				
	     //事件绑定确定
		$(document).on("click","#"+Ownerid+'_'+EnterBten,function(){
			  var my_select=[];
			 $(".chkNum").each(function(index, element) {               
					if($(element).prop("checked")==true){
						my_select.push($(this).attr("data-val"));
					}				
				});			
			 $("#"+ops.returnToId).text(my_select.join(','));
			 closeMy();
			});	
		//初始化
		var init=function(){
			createCss();
			createUI();	
		}			
		that.bind(ops.event,function(){
				init();		
			});		
	}
})(jQuery);

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
  调用方法jQuery.pop_info_loadng({
				width:'200px',
				height:'100px',
				}); 
 *------------------------------------------*/
 jQuery.extend({  
    //----------------------------------
    //直接弹出正在加载中div
	//----------------------------------
	pop_info_loading: function (options) { 
		var my_params={
			event:"click",
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
			$("#pop_info_loadng").show().animate({top:newTop+"0px"},500,'easeOutExpo');
			}	
			
		var  createCss=function(){
				if(document.getElementById("pop_info_loadng_css")){	
							
				} else {				
					var nod=document.createElement("style");				
					var str=[],newLeft=($(document).width()-450)/2;
					var newTop=($(document).height()-100)/2+$(document).scrollTop()-50;
					str.push('.pop_info_loadng_div_bg{display:none;background-color:rgba(0,0,0,0.2);width:100%; z-index:100;height:'+$(document).height()+'px;position:absolute;left:0px;top:30px;}');	
					str.push('.pop_info_loadng{display:none;color:'+ops._txtColor+';font-size:'+ops._txtFontSize+';text-align:center;width:450px; height:100px; line-height:100px; position:absolute;z-index:101;border-radius:10px; background-color:#fff;left:'+newLeft+'px;top:'+newTop+'px;}');
					nod.type="text/css";
					nod.id="pop_info_loadng_css";
					nod.innerHTML=str.join('');
					document.getElementsByTagName("head")[0].appendChild(nod);	
				} 				
			}			
		var clear_popinfo=function(){
			window.setTimeout(function(){
				$("#pop_info_loadng_div_bg").fadeOut(400,function(){
					$("#pop_info_loadng_div_bg").remove();
				    $("#pop_info_loadng").remove();
					});				
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
			$("#pop_info_loadng_div_bg").fadeOut(400,function(){
				$("#pop_info_loadng_div_bg").remove();
				$("#pop_info_loadng").remove();
				});			
	},
	//----------------------------------
	//模式弹出窗
	//----------------------------------
	pop_window_modal: function (options) { 
		var my_params={
			_txtColor:'#00c5b5',
			_txtFontSize:'16px',
			_activeColor:'#00bcaa',
			_hoverColor:'#00c5b5',
			_okEvent:null,
			_cancelEvent:null,
			_radius:'5px',
			_width:350,
			_height:200,
			_warnTxt:'您确认要执行此操作吗?'
			}
		var ops=$.extend(true,{},my_params, options);	
		var  createCss=function(){
				if(document.getElementById("pop_window_modal_2016")){								
				} else {				
					var nod=document.createElement("style");				
					var str=[],newLeft=($(document).width()-ops._width)/2;
					var newTop=($(document).height()-ops._height)/2+$(document).scrollTop()-50;
					str.push('.pop_window_modal_div_bg{display:none;background-color:rgba(0,0,0,0.2);width:100%; z-index:100;height:'+$(document).height()+'px;position:absolute;left:0px;top:30px;}');	
					str.push('.pop_window_modal{display:none;color:'+ops._txtColor+';font-size:'+ops._txtFontSize+';text-align:center;width:'+ops._width+'px; height:'+ops._height+'px; position:absolute;z-index:101;border-radius:'+ops._radius+'; background-color:#fff;left:'+newLeft+'px;top:'+newTop+'px;}');
					str.push('.pop_window_title{width:100%; height:25px; position:relative;-webkit-user-select:none}');
					str.push('.pop_window_title span{width:20px; height:20px; border-radius:50%;text-align:center;line-height:20px;border:solid 1px '+ops._txtColor+';position:absolute;right:2px;top:2px;}');
					str.push('.pop_window_title span:hover{background-color:'+ops._txtColor+';color:#fff;cursor:pointer}');
					str.push('.pop_window_title span:active{background-color:'+ops._activeColor+';color:#fff;}');
					str.push('.pop_window_foot{width:100%; height:40px; text-align:right; border-top:solid 1px #e0e0e0; background-color:#f0f0f0;border-bottom-left-radius:'+ops._radius+'; border-bottom-right-radius:'+ops._radius+'}');
					str.push('.pop_window_content{width:100%; height:'+(ops._height-25-40)+'px; line-height:'+(ops._height-25-40-30)+'px;}');
					str.push('.pop_window_foot button{width:100px; height:25px;border:solid 1px '+ops._txtColor+'; outline:none;margin:8px  6px ;border-radius:'+ops._radius+'}');
					str.push('#pop_window_okbtn{background-color:'+ops._txtColor+';color:#fff;}#pop_window_okbtn:hover{background-color:'+ops._hoverColor+'}');
					str.push('#pop_window_cancelbtn{color:'+ops._txtColor+';background-color:#fff;}#pop_window_cancelbtn:hover{background-color:'+ops._txtColor+';color:#fff}');
					str.push('#pop_window_okbtn:active,#pop_window_cancelbtn:active{background-color:'+ops._activeColor+';color:#fff; }');
					nod.type="text/css";
					nod.id="pop_window_modal_2016";
					nod.innerHTML=str.join('');
					document.getElementsByTagName("head")[0].appendChild(nod);	
				} 				
			}
		var createUI=function(){
			var middleTxt='<div class="pop_window_title"><span>&#10005;</span></div>';
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
			$("#pop_window_modal").show().animate({top:newTop+"0px"},500,'easeOutExpo');
			$("#pop_window_okbtn").on("click",ops._okEvent);
			$("#pop_window_cancelbtn").on("click",ops._cancelEvent);
			}	
			
					
		createCss();
		createUI();
	},
	//----------------------------------
	//模式弹出窗关闭
	//----------------------------------
	pop_window_modal_close: function (options) { 
		$("#pop_window_modal_div_bg").fadeOut(400,function(){
				$("#pop_window_modal_div_bg").remove();
				$("#pop_window_modal").remove();
				});	
	},
	
})

