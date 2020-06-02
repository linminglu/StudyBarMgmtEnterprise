/*-------------------------------------------------------------------------------------------
  弹窗封装调用处理模块
  曾令兵
  2017-05-26
  声明:
  因软件式web要求复用性很高，在项目研发过程需要将经常被外部版块调用的小界面小功能
  做成可通用调用的。故此，小功能需要有较高的独立性(即css和js和html保持完整性)，外部
  以ifrmae方式进行类似软件式的调用，很多地方需要弹窗还需要带返回值，所以本js专门进行
  再次封装。
//------------------------------------------------------------------------------------------*/

/*-------------------------------------* 
  禁止上层滚动
/*-------------------------------------*/

jQuery.extend({ 
	/*---------------
	 通用处理区
	 psObj为参数对象结构为
	 {
		 url:'xxx/xx.html?id=xxx',
		 width:'500px',
		 height:'500px',
		 title:'设置',
		 callback:function(){},  //要回传处理的，可以传参数回去
		 uuid:'asfdsafdsa'		  //用于创建唯一id,可以精准移除
		 _isAddCoverDiv:true,  //是否有遮罩层
		_zindex:2, 
	 }
	---------------*/
	this_yayigj_gen_pwd:function(psObj){
		var scr_if_top = 0;		
		//------------------------
		var disable_scroll=function() {	
			$('html').css({"overflow":"hidden","padding-right":"12px"});	
			$('body').css('overflow','');		
		}
		var enable_scroll=function() {
			$('html').css('overflow','').css("padding-right","");
			$('body').css('overflow','');			
		}
		//------------------------
		/*var disable_scroll=function() {			
			scr_if_top = $(window).scrollTop();
			//console.log('scr_if_top=',scr_if_top);
			$('body').css({"top":-scr_if_top+"px","position":"fixed"});
		}
		var enable_scroll=function() {
			//console.log('scr_if_top2=',scr_if_top);
			$('body').css({"position":"","top":""});			
            $(window).scrollTop(scr_if_top);			
		}*/
		//------------------------
		var ops=psObj;
		ops._width=ops.width;
		ops._height=ops.height+44;
		ops._coverOpacity=0.2;
		var newLeft=($(window).width()-ops._width)/2,
			  newTop=($(window).height()-ops._height)/2+$(document).scrollTop(),
			  keys = [37, 38, 39, 40];
			  
		var coverDivId=psObj.divid+'_cover';
		if($("#"+psObj.divid).length>0){
			disable_scroll();
			//var	newLeft=($(window).width()-ops._width)/2,newTop=($(window).height()-ops._height)/2+$(document).scrollTop();
			$("#"+psObj.divid).css({"top":newTop,"left":newLeft,"z-index":ops._zindex}).hide();
		    $("#"+psObj.divid+'_wndTitle span:eq(0)').text(ops.title);
			$("#ifrm_"+psObj.divid).attr("src",ops.url);
			$("#"+coverDivId).show();
			//$("body,html").css({"overflow-y": "hidden"});			
		}else{
			var cssQz='yayigj_pop_window';						
			
			var createCss=function(){
				if(document.getElementById(cssQz)){
					// ==============严继杰修改   2017-05-26   设置弹窗居中   start  添加部分如下======
					var cssStr='';
					cssStr='#'+psObj.divid+'.'+cssQz+'{box-shadow:0px 0px 20px #333;position:absolute;z-index:'+ops._zindex+';display:table;left:'+newLeft+'px;top:'+newTop+'px;width:'+ops._width+'px;height:'+ops._height+'px}';
					cssStr+='.'+cssQz+' .title{border-bottom:solid 1px #F0F0F0;height:44px; width:100%;box-sizing:border-box;padding-left:20px;line-height:44px;text-align:'+ops._titleAlign+';position:relative;font-size:16px}';
					cssStr+='.'+cssQz+' .title .closebtn{width:44px;height:44px;position:absolute;right:0px;top:0px;line-height:44px;text-align:center}';
					cssStr+='.'+cssQz+' .title .closebtn:hover{background-color:#F86D5A;cursor:pointer;color:#fff;}';
					cssStr+='.'+cssQz+' .title .closebtn:active{background-color:#DF6251;color:#fff;}';
					cssStr+='.'+cssQz+' .popFooter{position:absolute;width:100%; height:60px;line-height:60px; border-top:'+ops._fotTopLine+'; bottom:0px;left:0px;text-align:'+ops._fotBgnAlign+';box-sizing:border-box; padding-left:20px; padding-right:20px}';
					cssStr+='.unSelect{-webkit-user-select: none; -moz-user-select: none;    -khtml-user-select: none;  -ms-user-select: none; -o-user-select: none;user-select: none; cursor:default}';
					var nod=$("<style type='text/css' id='"+cssQz+"'>"+cssStr+"</style>");
					$("head").append(nod);
					// ==============严继杰修改   2017-05-26   设置弹窗居中   end======
				}else{
					var cssStr='';
					cssStr='#'+psObj.divid+'.'+cssQz+'{box-shadow:0px 0px 20px #333;position:absolute;z-index:'+ops._zindex+';display:table;left:'+newLeft+'px;top:'+newTop+'px;width:'+ops._width+'px;height:'+ops._height+'px}';
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
			//---------------------------------
			var createUI=function(){
				if(ops._isAddCoverDiv){
					var zIndex=parseInt(ops._zindex)-1;
					var coverDiv=$("<div id='"+coverDivId+"' style='width:"+$(document).width()+"px;height:"+$(document).height()+"px;z-index:"+zIndex+";background-color:#000;position:fixed;left:0px;top:0px;opacity:"+ops._coverOpacity+"'></div>");
					$("#"+coverDivId).hide();
					$("body").append(coverDiv);
				}
				var contentDiv=$("<div id='"+psObj.divid+"' style='width:"+ops._width+"px; height:"+ops._height+"px; top:"+newTop+"px;background-color:#fff;z-index:"+ops._zindex+"' class='"+cssQz+"'>"+
													'<div class="title" id="'+psObj.divid+'_wndTitle"><span>'+ops.title+'</span><span class="closebtn"></span></div>'+
													'<div class="popConent"><iframe id="ifrm_'+psObj.divid+'" name="ifrm_'+psObj.divid+'" src="'+ops.url+'" width="100%" height="'+ops.height+'"  marginheight="0" marginwidth="0" frameborder="0"></iframe></div>'+						
												"</div>");				
				$("body").append(contentDiv);	
				$("#"+psObj.divid+" .title").addClass('unSelect').append('<span class="closebtn">&#10005;</span>');
				
				//$("body,html").css({"overflow-y": "hidden"});
				disable_scroll();
				
				var oFrm = document.getElementById("ifrm_"+psObj.divid);
				oFrm.onload = oFrm.onreadystatechange = function() {
					 if (this.readyState && this.readyState != 'complete') return;
					 else {
						// alert('载入完成');
						$("#"+psObj.divid).show();
					 }
				}
				
				var t_dragObj=document.getElementById(psObj.divid+"_wndTitle");
				var t_pObj=t_dragObj.parentElement;
				
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
			　　　	}
			　　　　	document.onmouseup = function(){
			　　　　　　document.onmousemove = null;
			　　　　　　document.onmouseup = null;
			　　　　	}
				}				
				$("#"+psObj.divid+" .closebtn").on("click",function(){		
					scr_if_top=0;			
					close_pop_wnd();					
				});							
			}	
			createCss();
			createUI();		
		} //end else	
		//---------------------------------
		var close_pop_wnd=function(para_obj){
				try{
					enable_scroll();
					$("#"+psObj.divid).hide();
					if(ops._isAddCoverDiv){
						$("#"+coverDivId).hide();
					}				
					if(ops._close_callBackFunc!=null){
						ops._close_callBackFunc(para_obj);
					}	
					console.log('scr_if_top_close=',scr_if_top);				
					//$("body,html").css({"overflow-y": "auto"});
					//$("#ifrm_"+psObj.divid).attr("src","");
				}catch(e){
					//console.log(e);	
				}
		}		
		var api={
			close_pop_wnd:close_pop_wnd	
		}
		return api;
	},
	/*---------------
	  预约设置 
	  调用:jQuery.yayigjWebSoft_schedule_set({UrlParam:'cid=38899882086785655&other=',title:'预约设置',callbackfunc:null});
	 ---------------*/
	 yayigjWebSoft_schedule_set:function(psobj){	
		 	 psobj.width=460;
			 psobj.height=575;
			 psobj._isAddCoverDiv=1;
			 psobj._coverOpacity=0.2;
			 psobj.divid='resever_setting_iframe';
			 psobj.url='/views/netconsult/public/resever_setting_iframe.html?'+psobj.UrlParam;		
			 psobj.	_close_callBackFunc=function(params){
				 psobj.callbackfunc(params);
			 };
			 return jQuery.this_yayigj_gen_pwd(psobj);
	 },
	/*---------------
	  通用设置 
	  调用:jQuery.yayigjShared_set({UrlParam:'cid=38899882086785655&other=',title:'预约设置',callbackfunc:null});
	 ---------------*/
	//商学院添加用户弹窗
	yayigjCollege_add_user:function(psobj){
		 psobj.width=580;
		 psobj.height=270;
		 psobj.divid='College_add_user';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/erp/college/account/add_user.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//商学院批量导入弹窗
	yayigjCollege_import:function(psobj){
		 psobj.width=580;
		 psobj.height=270;
		 psobj.divid='College_import';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/erp/college/account/import.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//商学院积分管理添加积分记录弹窗
	yayigjCollege_add_integral:function(psobj){
		 psobj.width=580;
		 psobj.height=660;
		 psobj.divid='College_add_integral';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/erp/college/integral/add_integral.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//商学院积分管理添加微课堂弹窗
	yayigjCollege_add_micro:function(psobj){
		 psobj.width=580;
		 psobj.height=270;
		 psobj.divid='College_add_micro';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/erp/college/micro/add_micro.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//商学院微课堂回访评论弹窗
	yayigjCollege_revisit_comments:function(psobj){
		 psobj.width=580;
		 psobj.height=320;
		 psobj.divid='College_revisit_comments';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/erp/college/micro/revisit_comments.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},

});