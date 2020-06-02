(function($){
		//----------------------------------------------------
		$.callUpfileApi=function(obj,ops){
			var Ownerid=obj.attr('id'),
				  cssQz="yayigj_plus_upload_Crop",
				  Extname='',
				  trueFileName='';	
			//---------------------
			var createCss=function(){				
				var cssStr='',					 
					  okBtnBgColr='#47a6a0',
					  okBtnHvColr='#55c6bf',
					  obBtnAcColr='#328b83',
					  newLeft=($(window).width()-ops.picWidth)/2;					
				if(document.getElementById(cssQz)){		
				} else {	
				   var newTop=($(window).height()-ops.picHeight)/2+$(document).scrollTop(),
					     newLeft=($(window).width()-ops.picWidth)/2;					
					 cssStr+='.'+cssQz+'_css {display:table;table-layout:fixed;width:'+(ops.picWidth+50)+'px;height:600px;position:absolute;z-index:1000000;background-color:#fff;top:'+newTop+'px;left:'+newLeft+'px;border:solid 0px #ccc;box-shadow:0px 0px 20px #666;overflow:hidden;-webkit-user-select:none;border-radius:2px;overflow:auto}';
					 cssStr+='.'+cssQz+'_css ._title{width:100%x; height:44px;line-height:44px;background-color:#fff;text-align:center;color:#333;font-size:16px;}';	
					 cssStr+='.'+cssQz+'_css ._title_close{width:44px; height:44px; line-height:44px;position:absolute;right:0px;top:0px;cursor:pointer;}';	
					 cssStr+='.'+cssQz+'_css ._title_close:hover{background-color:#F86D5A;color:#fff}';
					 cssStr+='.'+cssQz+'_css ._title_close:active{background-color:#DF6251;color:#fff}';					 
					 cssStr+='.'+cssQz+'_css .ok_enter{position:absolute;right:10px;bottom:5px;border:none; background-color:'+okBtnBgColr+';width:100px; height:30px;color:#FFF;outline:none;cursor:pointer;border-radius:2px}';
					 cssStr+='.'+cssQz+'_css .ok_enter:hover{background-color:'+okBtnHvColr+'}.'+cssQz+'_css .ok_enter:active{background-color:'+obBtnAcColr+';}';					 
					 cssStr+='.'+cssQz+'_css ._img_obj{width:100%;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-o-box;display:box;'+
					 			   '-webkit-box-orient: horizontal;-moz-box-orient:horizontal;-o-box-orient:horizontal;-ms-flex-direction:row;box-orient:horizontal;'+
								   '-webkit-box-pack: center;-moz-box-pack:center;-ms-flex-pack:center;-o-box-pack:center;box-pack:center;'+
								   '-webkit-box-align: center;-moz-box-align:center;-ms-flex-align:center;-o-box-align:center;box-align:center;'+
								   'height:510px;position:releative;text-align:center;background-color:#666;overflow:auto;}';									   
					  cssStr+='.'+cssQz+'_css ._img_obj img{width:100%;}';
					 cssStr+='.'+cssQz+'_css ._fot_tool{width:100%;height:40px;line-height:48px;font-size:14px;position:absolute !important;background-color:#fff;bottom:0px; left:0px;}';	
					 cssStr+='.'+cssQz+'_css ._fot_tool em{display:inline-block;font-style:normal; color:#666;font-size:14px; margin:auto 10px auto 10px; cursor:pointer;border-riadius:2px;}';
					 cssStr+='.'+cssQz+'_css ._fot_tool em:hover{color:#000;background-color:#eee}.'+cssQz+'_css ._fot_tool em:active{color:#000; background-color:#ddd}';
					 cssStr+='.body_bg_div{width:100%;height:'+$(document).height()+'px;position:absolute;left:0px; top:0px;background-color:#000; opacity:0.3;z-index:999999}';							
					 var nod=$("<style type='text/css' id='"+cssQz+"'>"+cssStr+"</style>");
					 $("head").append(nod);
				}
			};	
			//---------------------
			var createUI=function(){
				var dialog=$("<div id='"+Ownerid+"_dlog' class='"+cssQz+"_css'></div>");		
				var table=$("<table></table>");		 
				var dialog_title=$("<div id='"+Ownerid+"_title' class='_title'></div>");	
				var close_btn=$("<div id='"+Ownerid+"_title_close' class='_title_close'>&#10005;</div>");	
						 dialog_title.append(close_btn).append("<span>上传图片</span>");
						 dialog.append(dialog_title);	 
				var img_obj=$("<div id='"+Ownerid+"_img_obj' class='_img_obj'></div>");						
						 img_obj.append("<img id='upload_imgobj'>");	
						 dialog.append(img_obj);	   
				var footer_operat=$("<div id='"+Ownerid+"_fot_tool' class='_fot_tool'></div>");					
							footer_operat.html('<span id="only_upload" style="display:none"></span>');
							if(!ops.isCrop){
									footer_operat.html('');
							}						
						 footer_operat.find("em").hide();
						 footer_operat.append("<button id='"+Ownerid+"ok_enter' class='ok_enter'>确定</button>");							
						 dialog.append(footer_operat);
						 footer_operat.on("click","em",function(){	
							  var bl=parseFloat($(this).attr('data-p'));
							  jcrop_api.setOptions({aspectRatio: bl});						 
							  jcrop_api.focus();
						 });
				var bg_Div=$("<div id='"+Ownerid+"_bg_div' class='body_bg_div'></div>");	 
	
			  $("body").append(bg_Div);	
			  $("body").append(dialog);	
			  dialog.css({"width":ops.picWidth+50});
			  
			  $("#"+Ownerid+"_title_close").click(function(){
				   $("#"+Ownerid+'_bg_div').remove();
				   $("#"+Ownerid+'_dlog').remove();				  
			  });	
			  $("#"+Ownerid+"ok_enter").click(function(){  //上传处理
			  	var imagedata;
				var base64=$("#upload_imgobj").attr("src");
					$(ops.imgPathPIC).attr("src",base64);
					imagedata=base64.substr(base64.indexOf(',') + 1);		
					var data = { 
						fileName:trueFileName,
						picdata:imagedata,
						type:"image/jpeg"
					};
					if(ops.uploadCallBack!=null){
						ops.uploadCallBack(data);   
				   }
					/**关闭上传面板**/
					$("#"+Ownerid+'_bg_div').remove();
					$("#"+Ownerid+'_dlog').remove();	
				  });
			}
			//---------------------
			var closePanel=function(){
				$("#"+Ownerid+"_title_close").trigger('click');	
			}
			//---------------------
			function  getObjectURL(file){
				if(file){
					var URL = window.URL || window.webkitURL;
					var blob=URL.createObjectURL(file);	
					return blob;	
				}else{
					return false;
				}
			}
			//---------------------
			function operat_img(obj){			
				if(typeof(obj)=='undefined'){
					$(this).attr('data-null','0'); 
					return;
				}	
				Extname=obj.type;  //文件类型
				trueFileName=obj.name;					
				var fsize=obj.size/(1024*1024);
				if(fsize>5){
					var pos=$("#"+Ownerid).parent().offset();
					$("#"+Ownerid).val('');
					return 'bigsize';
				}
				//------------
				var reader = new FileReader();
				var readerBase64 = new FileReader();
				reader.readAsArrayBuffer(obj);
				reader.onloadend = function(e){
					var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
					var header = "";
					for(var i = 0; i < arr.length; i++) {
						header += arr[i].toString(16);
					}	
					switch (header) {
						case "89504e47":
							Extname = "image/png";
							break;
						case "47494638":
							Extname = "image/gif";
							break;
						case "ffd8ffe0":
						case "ffd8ffe1":
						case "ffd8ffe2":
							Extname = "image/jpeg";
							break;
						default:
							Extname = "unknown"; 
							break;
					}					
					//--
					var objUrl=getObjectURL(obj);	
					if(objUrl){
						   var img = new Image(), canvas,ctx,dataURL = null;
						   img.src = objUrl;	
						   img.crossOrigin = "anonymous";	
						   img.onload = function() {
						   var thatMy = this,w = thatMy.width,h = thatMy.height;							   					  
						  var canvas = document.createElement('canvas');
						  var	 ctx = canvas.getContext('2d')
							 $(canvas).attr({
									width:w,
									height:h
								});	
							ctx.drawImage(thatMy, 0, 0, w, h);									
							// dataURL = canvas.toDataURL(Extname,1);
							dataURL = canvas.toDataURL('image/jpeg',1);
							$("#upload_imgobj").attr("src",dataURL);	
					   }// end img.onload 				
					} // end if(objUrl)	
					//--
					return 'ok';
				}
				//------------ 	
			}
			
			//---------------------
			var init=function(){		
				createCss();	
				//createUI();
			}
			//---------------------
			init();
			//---------------------
			var api={
				show:createUI,
				exit:closePanel,
				operatImg:operat_img,		
			}	
			return api;
		}
		//----------------------------------------------------
		$.fn.localUpfileNoGzip=function(options,callback){
			var defalutset={
				event:"change",	 
				picWidth:720,
				picHeight:450,
			};
			var ops=$.extend(true,{},defalutset, options);
			var that=$(this);
			var api=$.callUpfileApi(that,ops);
			
			that.on("click",function(){
				this.value='';
			});
			
			that.bind(ops.event,function(){
				api.show();
				var result=api.operatImg(this.files[0]);
			});
			
			this.each(function(){				
				if($.isFunction(callback)){
					callback.call(api);
				}
			});	
			return this;		
		}
	})(jQuery);