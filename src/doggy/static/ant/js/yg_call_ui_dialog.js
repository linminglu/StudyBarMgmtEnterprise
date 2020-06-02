/*----------------------------------
	模式对话框 函数式调用
*-----------------------------------*/
(function($){

	$.callDialogApi=function(obj,ops){
		var Ownerid=obj.attr('id');

		var close_my_divs=function(){
			document.removeEventListener('touchmove',preventDefault,false);
			$('#'+obj.attr('id')+'_dlog').remove();
			$('#'+obj.attr('id')+'_bg_div').remove();
		}
		var titleText='';
		function preventDefault(e){
			e.preventDefault();
		}

		//------------------------------
		//创建ui
		//------------------------------
		function createUI(){
			var dialog=$("<div id='"+Ownerid+"_dlog'></div>");
				  dialog.css({
					  "width":ops.myWidth,
					  "height":ops.myHeight,
					  "position":"absolute",
					  "z-index":"10",
					  "text-align":"center",
					  "border-radius":"5px",
					  "background-color":"#fff",
					  "top":($(window).height()-200)/2+($(document).scrollTop()),
					  "left":($(window).width()-ops.myWidth)/2
					  });
			var diglog_text=$("<div id='"+Ownerid+"_text'>"+ops.digText+"</div>");
				  diglog_text.css({
					  "width":"100%",
					  "height":ops.myHeight-60,
					  "line-height":(ops.myHeight-60)+"px",
					  "border-bottom":"solid 0px #ccc",
					  "text-align":"center",
					  "font-size":"110%"
					  });
			var css_text='height:'+ops.btnHeight+'px;line-height:'+ops.btnHeight+'px;cursor:pointer;text-align:center;-webkit-user-select:none;border-radius:5px;border:solid 1px #0CC7B8';
			var diglog_leftBtn=$("<div id='"+Ownerid+"_leftBtn' style='display:inline-block;width:"+ops.btnWidth+"px;margin-right:20px;"+css_text+"'>"+ops.buttons.no_btn_title+"</div>");
			var diglog_rightBtn=$("<div id='"+Ownerid+"_rightBtn' style='display:inline-block;width:"+ops.btnWidth+"px;margin-left:20px;background-color:#0CC7B8;color:#FFF;"+css_text+"'>"+ops.buttons.ok_btn_title+"</div>");
			diglog_leftBtn.click(ops.buttons.no_btn_event);
			diglog_rightBtn.click(ops.buttons.ok_btn_event);
			diglog_leftBtn.mouseover(function(){
				$(this).css({"background-color":"#0CC7B8","color":"#FFF"});
				}).mouseout(function(){
					$(this).css({"background-color":"#fff","color":"#000"})
					});
			diglog_rightBtn.mouseover(function(){
				$(this).css({"background-color":"#0CC7B8"});
				});
			dialog.append(diglog_text);
			dialog.append(diglog_leftBtn);
			dialog.append(diglog_rightBtn);
			$('#'+Ownerid+'_dlog').remove();
			$("body").append(dialog);
		}

		//------------------------------
		//创建背景覆盖层
		//------------------------------
		function create_body_bg_div(){
			var bg_Div=$("<div id='"+Ownerid+"_bg_div' class='body_bg_div'></div>");
				  bg_Div.css({"height":$(document).height(),"left":"0px","top":"0px","position":"absolute","z-index":"1","width":"100%","background-color":"#000","background-color":"rgba(0,0,0,0.4)","filter":"alpha(opacity=40)"});
			$('#'+Ownerid+'_bg_div').remove();
			$("body").append(bg_Div);
		}
		//------------------------------
		//初始化操作
		//------------------------------
		var init=function(paramobj){
			//console.log(paramobj);
			createUI();
			create_body_bg_div();
			//document.addEventListener('touchmove',preventDefault,false);
			if(paramobj!=''){
				$("#"+Ownerid+"_text").text(paramobj.content);
				ops.buttons.no_btn_title=paramobj.leftBtnTitle;
				ops.buttons.ok_btn_title=paramobj.rightBtnTitle;
				//$("#"+Ownerid+"_leftBtn").text(paramobj.leftBtnTitle);
				//$("#"+Ownerid+"_rightBtn").text(paramobj.rightBtnTitle);
			}
		}


		var api={
				close:close_my_divs,
				show:init,
			}
		return api;
	}

	$.fn.uiDialog=function(options,callback){
		//外部配置
		$.fn.uiDialog.defaultOptions={
			event:"click",
			myWidth:500,
			myHeight:210,
			btnHeight:30,
			btnWidth:110,
			no_btn_title:'是',
			ok_btn_title:'否',
			digText:'确定删除吗?',
			buttons:{
				"否":null,
				"是":null,
				}
			}
		var ops=$.extend(true,{},$.fn.uiDialog.defaultOptions, options);	//外部配置映身到变量
		//全局变量区
		var that=$(this);
		var api;
		this.each(function(){
			api=$.callDialogApi(that,ops);
			if($.isFunction(callback)){
				callback.call(api);
			}
		});
		return this;
	} //end $.fn

})(jQuery);

