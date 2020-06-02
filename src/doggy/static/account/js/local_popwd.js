/*---------------------------------------
 本地上传大文件到服务器上
 作者: 曾令兵
 时间:2016-07-26
*----------------------------------------*/
(function($){	
	$.fn.local_popwd=function(options,callback){
		$.fn.local_popwd.defaultOptions={
			event:"click",	 	//控件的改变事件
			src:''	,
			window_title:'',
			width:750,
			height:600,
			item_id:'',
		} 
		var ops=$.extend(true,{},$.fn.local_popwd.defaultOptions, options);
		var that=$(this),Ownerid=that.attr('id');
		if(typeof(Ownerid)=='undefined'){
				Ownerid=that.attr('class');				
		}
		
		//-------------------------------------------------------	
		//创建样式
		//-------------------------------------------------------	
		var  createCss=function(){
				if(document.getElementById(Ownerid+"popWindow")){				
				} else {				
					var nod=document.createElement("style");				
					var str=[];
					str.push('.close_btn:hover{background:#eee}.close_btn:active{background:#333;color:#fff}');
					str.push('.row_select {width:100%;  text-align:left; }');
					str.push('#fileName{ width:96%; text-align:left; margin-left:4%; height:25px; line-height:25px; color:#999; margin-top:20px;}');
					str.push('#fileSize{width:96%; text-align:left; margin-left:4%; height:25px; line-height:25px; color:#999}');
					str.push('#fileType{width:96%; text-align:left; margin-left:4%; height:25px; line-height:25px; color:#999}');
					str.push('#progressNumber{width:96%; text-align:left; margin-left:4%; height:25px; line-height:25px; color:#999}');					
					str.push('.a-upload_big {background-color:#FF0; padding: 4px 10px; height: 20px; line-height: 20px; position: relative; cursor: pointer; color: #888; background: #fafafa; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; display: inline-block; *display: inline; *zoom: 1}');
					str.push('.a-upload_big  input { position: absolute; font-size: 100px; right: 0; top: 0; opacity: 0; filter: alpha(opacity=0); cursor: pointer}');
					str.push('.a-upload_big:hover { color: #444; background: #eee; border-color: #ccc; text-decoration: none}');
					nod.type="text/css";
					nod.id=Ownerid+"popWindow";
					nod.innerHTML=str.join('');
					document.getElementsByTagName("head")[0].appendChild(nod);	
				} 				
			}
		
		//-------------------------------------------------------	
		//创建ui层
		//-------------------------------------------------------	
		function createUI(){
			var dialog=$("<div id='"+Ownerid+"_dlog'></div>");
				  dialog.css({
					  "width":ops.width,
					  "height":ops.height-55,
					  "position":"absolute",
					  "z-index":"10",
					  "background-color":"#fff",
					  "top":($(window).height()-ops.height)/2+$(document).scrollTop(),
					  "left":($(window).width()-ops.width)/2,
					  "border":"solid 1px #ccc",
					  "box-shadow":"2px 2px 5px #333",
					  "overflow":"hidden", "-webkit-user-select":"none"
					  });
				var dialog_title=$("<div id='"+Ownerid+"_title'></div>");	  
					  dialog_title.css({
	  				   "width":ops.width,
					   "height":"40px",
					   "line-height":"40px",
					   "position":"releative",
					   "background-color":"#ccc", "-webkit-user-select":"none"
						  });
				var close_btn=$("<div id='"+Ownerid+"_title_close' class='close_btn'></div>");	 
				      close_btn.css({
						  				   "width":"20px",
										   "height":"20px",
										   "line-height":"20px",
										   "border-radius":"50%",
										   "text-align":"center",
										   "position":"absolute",
										   "right":"5px","top":"2px","cursor":"pointer", "-webkit-user-select":"none"										
						  });		  
					 close_btn.html("&#10006");
					 dialog_title.append(close_btn).append("<span>&nbsp;"+ops.window_title+"</span>");
					 dialog.append(dialog_title);	 
			 	
				var img_obj=$("<div id='"+Ownerid+"_img_obj'></div>"),
				      upload_code_area=[];
					  upload_code_area.push('<div class="row_select">');
					  upload_code_area.push(' <iframe src="'+ops.src+'" id="'+Ownerid+'_ifrm"   width="100%" height="'+parseInt(ops.height-95)+'"  marginheight="0" marginwidth="0" frameborder="0"></iframe>');
					  upload_code_area.push('</div>');																
					  img_obj.css({
						  "width":"100%",
						  "height":ops.height-95,
						  "position":"releative",
						  "text-align":"center",										  
						  "background-color":"#FFF",
						  "overflow":"auto",	
						  "-webkit-user-select":"none"
						  });	
					   	  
					   img_obj.append(upload_code_area.join(''));	
					   dialog.append(img_obj);	   
				
				var bg_Div=$("<div id='"+Ownerid+"_bg_div' class='body_bg_div'></div>");				 
				  	  bg_Div.css({"height":$(document).height(),
					  					  "width":"100%",
										   "position":"absolute",
										   "left":"0px",
										   "top":"0px",
										  "background-color":"rgba(0,0,0,0.3)",
										  "z-index":"1", "-webkit-user-select":"none"
										  });			   

				 	  $("body").append(bg_Div);	
					  $("body").append(dialog);	
					  
					  $("#"+Ownerid+"_title_close").click(function(){
						   $("#"+Ownerid+'_bg_div').remove();
						   $("#"+Ownerid+'_dlog').remove();
						  });	  					    
		}
		
		
	  //-------------------------------------------------------	
		that.bind(ops.event,function(){	
				//console.log(that);
				//console.log(that.attr('data-id'));
				if(ops.src!=''){
					if(typeof(that.attr('data-id'))!='undefined'){					
						ops.src=ops.src+"&id="+that.attr('data-id');						
					}else{
						ops.src=ops.src+"&id="+ops.item_id;
					}
				}
				createUI();
		});		
		
		createCss();	
	} //end $.fn

})(jQuery);