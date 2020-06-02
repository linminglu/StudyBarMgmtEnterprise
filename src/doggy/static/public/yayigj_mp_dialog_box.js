 jQuery.extend({
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
		
		$('#info_pop_postok').css({"left":($(window).width()-$('#info_pop_postok').outerWidth())/2,"top":$(document).scrollTop()+100}).show();
		window.setTimeout(function(){
				$('#info_pop_postok').fadeOut();
			},1000);
	},
	 pop_m_wnd_dialog:function(options,keyval){
		var my_params={	
			_errorTxt:'信息错误!',
			_btnTxt:'关闭',
			_ico:'/static/public/img/m_error.png',
			_callback:null
		};
		var ops=$.extend(true,{},my_params,options);
		var createUI=function(){
				var _H=Math.max($(document).height(),$(window).height());
				var m_popwnd_bg=$("<div id='m_popwnd_bg' style='width:100%;height:"+_H+"px;left:0px; top:0px; background-color:rgba(0,0,0,0.5);z-index:1;position:absolute'></div>")
				var panel=$("<section id='m_popwnd_panel' style='width:80%;height:12rem;position:absolute;left:7%;z-index:2;top:50%;margin-top:-7rem; background-color:#fff;border-radius:0.2rem;border:solid 0px #ccc;'></section>");
				var ico=$("<div style='display:table-cell;width:8rem;vertical-align: middle;text-align:center'><img style='width:4rem' src='"+ops._ico+"'/>");
				var txt=$("<div style='display:table-cell;vertical-align: middle;font-size:130%; color:#333;box-sizing: border-box;padding-right: 20px;'>"+ops._errorTxt+"</div>");
				var middleArea=$("<div style='height:9rem;width:100%;display:table'></div>");				
				var btnArea=$("<div style='width:100%; position:absolute;left:0px;bottom:0px; height:3rem;line-height:3rem;text-align:center; color:#696969;font-size:110%;border-top:solid 1px #e0e0e0;font-size:130%'>"+ops._btnTxt+"</div>");
				m_popwnd_bg.on("touchstart",function(){
						return false;
					});
				btnArea.on("click",function(){
						$(this).css({"background-color":"#fff","color":"#333"});
						$("#m_popwnd_panel").remove();
						$("#m_popwnd_bg").remove();
						if(ops._callback!=null){
							ops._callback();	
						}
				});	
				/*btnArea.on("touchstart",function(){
						$(this).css({"background-color":"#47a6a0","color":"#fff"});
				});	
				
				btnArea.on("touchend",function(){
						$(this).css({"background-color":"#fff","color":"#333"});
						$("#m_popwnd_panel").remove();
						$("#m_popwnd_bg").remove();
				});	*/
				middleArea.append(ico);
				middleArea.append(txt);
				panel.append(middleArea);
				panel.append(btnArea);
				if($("#m_popwnd_panel").length>0){
					$("#m_popwnd_panel").show();
				}else{
					$("body").append(panel);
					$("body").append(m_popwnd_bg);
				}
		}
		createUI();
	 }
 });
