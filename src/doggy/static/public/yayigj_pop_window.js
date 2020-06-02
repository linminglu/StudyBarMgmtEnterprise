 (function($,window,document,undefined){
	  $.fn.yayigj_pop_window = function(options,callback){						
			var my_params={
				event:"click",
				_width:0,
				_height:0,
				_titleAlign: 'left',
				_fotBgnAlign:'right',
				_fotTopLine:'solid 1px #e0e0e0',
				_closeIco:'',
				bdColor:'#00C3B5',
				_close_callBackFunc:null,
				_isShow:true, //初始情况下是否显示div
				_zindex:999,
				_coverOpacity:0,  //背景层透明度
				_isAddCoverDiv:false, //是否添加遮挡层
				_isAskClose:false //关闭前询问
				};
			
			var dec_out_lt={ofLeft:0,ofTop:0};
			var scr_if_top = 0;		
			if($("#f_frame_cont").length>0){ 
				dec_out_lt.ofLeft=$("#f_frame_cont").offset().left;
				dec_out_lt.ofTop=$("#f_frame_cont").offset().top;
			}
			
			var ops=$.extend(true,{},my_params, options),cssQz='yayigj_pop_window',self=$(this),coverDivId=self.attr('id')+'_cover';
			//$('#'+self.attr('id')).preventScroll();
			ops._width=self.width();
			ops._height=self.height();
			var createCss=function(){
				 if(document.getElementById(cssQz)){
				} else {
					var cssStr='',newLeft=($(window).width()-ops._width)/2-dec_out_lt.ofLeft,newTop=($(window).height()-ops._height)/2-dec_out_lt.ofTop+$(document).scrollTop();
					cssStr='.'+cssQz+'{box-shadow:0px 0px 20px #333;position:absolute;z-index:'+ops._zindex+';display:table;left:'+newLeft+'px;top:'+newTop+'px}';
					cssStr+='.'+cssQz+' .title{border-bottom:solid 1px #F0F0F0;height:44px; width:100%;box-sizing:border-box;padding-left:20px;line-height:44px;text-align:'+ops._titleAlign+';position:relative;font-size:16px}';
					cssStr+='.'+cssQz+' .title .closebtn{width:44px;height:44px;position:absolute;right:0px;top:0px;line-height:44px;text-align:center}';
					cssStr+='.'+cssQz+' .title .closebtn:hover{background-color:#F86D5A;cursor:pointer;color:#fff;}';
					cssStr+='.'+cssQz+' .title .closebtn:active{background-color:#DF6251;color:#fff;}';
					cssStr+='.'+cssQz+' .popFooter{position:absolute;width:100%; height:60px;line-height:60px; border-top:'+ops._fotTopLine+'; bottom:0px;left:0px;text-align:'+ops._fotBgnAlign+';box-sizing:border-box; padding-left:20px; padding-right:20px}';
					cssStr+='.unSelect{-webkit-user-select: none; -moz-user-select: none;    -khtml-user-select: none;  -ms-user-select: none; -o-user-select: none;user-select: none; cursor:default}';
					var nod=$("<style type='text/css' id='"+cssQz+"'>"+cssStr+"</style>");
					$("head").append(nod);
					}
			 }
			 var resize=function(){
					$(window).resize(function(){
						var	newLeft=($(window).width()-ops._width)/2,newTop=($(window).height()-ops._height)/2+$(document).scrollTop();
						self.css({"top":newTop,"left":newLeft});
					});
			 }
			 var createUI=function(){
				 	if(ops._isAddCoverDiv){
						var zIndex=parseInt(ops._zindex)-1;
						var coverDiv=$("<div id='"+coverDivId+"' style='width:"+$(document).width()+"px;height:"+$(document).height()+"px;z-index:"+zIndex+";background-color:#000;position:fixed;left:0px;top:0px;opacity:"+ops._coverOpacity+"'></div>");
						$("#"+coverDivId).remove();
						$("body").append(coverDiv);
						
					}
					if(typeof(self.find(".title").attr("id"))=='undefined'){
						self.find(".title").attr("id",self.attr("id")+"_wndTitle");
					}
					self.find(".title").addClass('unSelect').append('<span class="closebtn">&#10005;</span>');
					//disable_scroll();
					self.find('.closebtn').on("click",function(){
						if(ops._isAskClose==false){
							self.fadeOut(100);
							if(ops._isAddCoverDiv){
								$("#"+coverDivId).hide();
							}else{
								jQuery.gen_bg_div_close(); //照顾老代码
							}
						}
						enable_scroll();
						if(ops._close_callBackFunc!=null){
							ops._close_callBackFunc();
						}
						});						
			 }
			 /*var disable_Scroll=function(evt,obj){
					var scrollTop = obj.scrollTop,scrollHeight = obj.scrollHeight,height = obj.clientHeight;
					var delta = (evt.originalEvent.wheelDelta) ? evt.originalEvent.wheelDelta : -(evt.originalEvent.detail || 0);  
					if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
						obj.scrollTop = delta > 0? 0: scrollHeight;
						evt.preventDefault();
					}  
				}	*/
				
			 //------------------------
				var disable_scroll=function() {	
					$('html').css({"overflow":"hidden","padding-right":"12px"});	
					//$('body').css("padding-right","10px");		
					//scr_if_top = $(window).scrollTop();
					//$('body').css({"top":-scr_if_top+"px","position":"fixed","overflow":"initial"});
				}
				var enable_scroll=function() {
					$('html').css('overflow','').css("padding-right","");
					$('body').css('overflow','');
					//$('body').css("padding-right","initial");			
					//$('body').css({"position":"","top":""});
					//if(scr_if_top<=0){
					//	scr_if_top=Math.abs($("body").offset().top);
					//}
					//$(window).scrollTop(scr_if_top);			
				}
			//------------------------
							
			  var Dragging=function(){
				  	 try{
							  var t_dragObj=document.getElementById(self.attr("id")+"_wndTitle");
							  var t_pObj=document.getElementById(self.attr("id")+"_wndTitle").parentElement;
							  t_dragObj.onmousedown = function(ev){
								  if(ev.target.className=='closebtn'){
									  return;
								  }
				　　　　var oevent = ev || event;
				　　　　var distanceX = oevent.clientX - t_pObj.offsetLeft;
				　　　　var distanceY = oevent.clientY - t_pObj.offsetTop;
				　　　　document.onmousemove = function(ev){
				　　　　　　var oevent = ev || event;
				　　　　　　t_pObj.style.left = oevent.clientX - distanceX + 'px';
				　　　　　　t_pObj.style.top = oevent.clientY - distanceY + 'px'; 
				　　　　};
				　　　　document.onmouseup = function(){
				　　　　　　document.onmousemove = null;
				　　　　　　document.onmouseup = null;
				　　　　};
						}　
					 }catch(e){
					 }
              }            
 
			 var init=function(){
				 createCss();
				 createUI();
				 resize();
				 self.addClass(cssQz);
				 ops._isShow==true?self.show():self.hide();
				 ops._isShow==true?$("#"+coverDivId).show():$("#"+coverDivId).hide();
				 Dragging();
				 /*try{
					 $(document).on("DOMMouseScroll mousewheel","#"+coverDivId,function(event){
						  disable_Scroll(event,this);
					});	
				 }catch(e){}*/
				 }
			init();
			
			var wnd_Open_obj=function(element,options){
				this.closePopCover=function(){
					try{
						if(ops._isAddCoverDiv){
							$("#"+coverDivId).hide();
						}
					}catch(e){}
					}	
				var   newLeft=($(window).width()-self.width())/2-dec_out_lt.ofLeft,
					    newTop=($(window).height()-self.height())/2-dec_out_lt.ofTop+$(document).scrollTop();
				self.css({"top":newTop,"left":newLeft,"z-index":ops._zindex});
				
				this.showPopwnd=function(_title){
					try{						
						var newTop=($(window).height()-self.height())/2+$(document).scrollTop()-dec_out_lt.ofTop;
						var newLeft=($(window).width()-self.width())/2+$(document).scrollLeft()-dec_out_lt.ofLeft;
						//alert('newTop='+newTop+' newLeft='+newLeft+'-'+($(window).height()-self.height())/2+'-'+dec_out_lt.ofTop);
						self.show().css({"top":newTop,"left":newLeft,"z-index":ops._zindex});
						if(typeof(_title)!='undefined'){
							if(self.find(".title").children(".closebtn").prev().length>0){
									self.find(".title").children(".closebtn").prev().text(_title);
							}	
						}
						if(ops._isAddCoverDiv){
							$("#"+coverDivId).show().css({"width":$(document).width()+"px","height":$(document).height()+"px","z-index":ops._zindex-1});
						}
						disable_scroll();
					}catch(e){}
					}	
				this.closePopwnd=function(){
					try{
						self.hide();
						enable_scroll();
						$("#"+coverDivId).hide();
					}catch(e){}
					}	
			}
			
			callback=callback||function(){};
			return this.each(function(){
				try{
					var wndOpen_obj=new wnd_Open_obj(this,options);
					callback(wndOpen_obj);
				}catch(e){
				}
			});
		}
})(jQuery,window,document);
