/*---------------------------------------
 本地上传前处理，再上传到服务器插件
 作者: 曾令兵
 时间:2016-07-04
*----------------------------------------*/
(function($){	
	$.callUploadApi=function(obj,ops){
		var Ownerid=obj.attr('id');
		var picW=ops.picWidth,
			  quality=ops.quality,
			  Extname,
			  pimage,
			  scal_bl=1,
			  minsize=[32,20],
			  nLeft=nTop=0,ww,hh,
			  setSelect,
			  e_x,e_y,e_x2,e_y2,e_w,e_h,cssQz="yayigj_plus_upload_Crop",
			  jcrop_api=null;						  
		//-------------------------------------------------------
		//处理文件
		//-------------------------------------------------------
		function operat_img(obj){			
			if(typeof(obj)=='undefined'){
				$(this).attr('data-null','0'); 
				return;
			}	
			Extname=obj.type;  //文件类型
			var objUrl=getObjectURL(obj);	
			if(objUrl){
				   var img = new Image(), canvas,ctx,dataURL = null;
				   img.src = objUrl;	
				   img.crossOrigin = "anonymous";	
				   img.onload = function() {
					var thatMy = this,w = thatMy.width,h = thatMy.height,scale = w / h,ww=0,hh=0;		
					 if(w>picW){	  
						w = picW;
					 }
					 scal_bl=scale;
					 h = w / scale;					 
					 $("#pic_w").val(w);
					 $("#pic_h").val(h);					
					 hh=h;
					 ww=hh*ops.scaleRatio;					
					 nLeft=(w-ww)/2;
					 nTop=(h-ww/ops.scaleRatio)/2;
					 setSelect = [nLeft,nTop,ww,hh];			 
					 canvas = document.createElement('canvas');
					 ctx = canvas.getContext('2d')
					 $(canvas).attr({
							width:w,
							height:h
						});	
					 ctx.drawImage(thatMy, 0, 0, w, h);	
					
						dataURL = canvas.toDataURL(Extname,quality);
						$("#upload_imgobj").attr("src",dataURL);	
						  try {
							  $("#upload_imgobj").Jcrop({
									allowSelect:false,
									keySupport:true,
									drawBorders:true,
									fadeTime:400,
									minSize: minsize,			
									aspectRatio:1,		
									bgFade: true, 
									bgOpacity: 0.5, 
									setSelect:setSelect, 
									onChange: updateInfo,
									//onSelect: updateInfo,
									//onRelease: clearInfo
								}, function(){
									//var bounds = this.getBounds();
									//boundx = bounds[0];
									//boundy = bounds[1];
									jcrop_api = this;
									//$upload_imgobj.appendTo(jcrop_api.ui.holder);
								});			
					  } catch (e){
						 // console.log('jscrop=',e);
						//alert('图片文件处理错误!');
					  }
			   }// end img.onload 				
			} // end if(objUrl)
		}
		//-------------------------------------------------------
		// 返回裁剪对象
		//-------------------------------------------------------
		function getJcrop_api(){
			return jcrop_api;	
		}
		//-------------------------------------------------------
		//坐标赋值
		//-------------------------------------------------------
		function updateInfo(e) {
			e_x=e.x; 
			e_y=e.y; 
			e_x2=e.x2;
			e_y2=e.y2;
			e_w=e.w;
			e_h=e.h;
		};	
		//-------------------------------------------------------
		//返回图像数据
		//-------------------------------------------------------
		function  getObjectURL(file){
			if(file){
				var URL = window.URL || window.webkitURL;
				var blob=URL.createObjectURL(file);	
				return blob;	
			}else{
				return false;
			}
		}
		//-------------------------------------------------------	
		//创建ui层
		//-------------------------------------------------------	
		function createUI(){
			var createCss=function(){
				var cssStr='',newTop=($(window).height()-600)/2+$(document).scrollTop(),newLeft=($(window).width()-750)/2;
				if(document.getElementById(cssQz)){								
				
				} else {	
					 cssStr+='.'+cssQz+'_css {width:750px;height:600px;position:absolute;z-index:10;background-color:#fff;top:'+newTop+'px;left:'+newLeft+'px;border:solid 0px #ccc;box-shadow:0px 0px 20px #666;overflow:hidden;-webkit-user-select:none;border-radius:2px}';
					 cssStr+='.'+cssQz+'_css ._title{width:750px; height:44px;line-height:44px;background-color:#fff;text-align:center;color:#333;font-size:16px;}';	
					 cssStr+='.'+cssQz+'_css ._title_close{width:30px; height:30px; line-height:30px;position:absolute;background-image:url('+ops.close_ico+');right:4px;top:7px;cursor:pointer;background-repeat:no-repeat;background-position:center center;}';	
					 cssStr+='.'+cssQz+'_css ._title_close:hover{background-image:url('+ops.close_icoover+')}';
					 cssStr+='.'+cssQz+'_css .ok_enter{position:absolute;right:10px;bottom:7px;border:none; background-color:#00c5b5;width:100px; height:30px;color:#FFF;outline:none;cursor:pointer;border-radius:2px}';
					 cssStr+='.'+cssQz+'_css .ok_enter:hover{background-color:#00bcaa}.'+cssQz+'_css .ok_enter:active{background-color:#00AEA2;}';
					 cssStr+='.'+cssQz+'_css ._img_obj{width:100%;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-o-box;display:box;'+
					 			   '-webkit-box-orient: horizontal;-moz-box-orient:horizontal;-o-box-orient:horizontal;-ms-flex-direction:row;box-orient:horizontal;'+
								   '-webkit-box-pack: center;-moz-box-pack:center;-ms-flex-pack:center;-o-box-pack:center;box-pack:center;'+
								   '-webkit-box-align: center;-moz-box-align:center;-ms-flex-align:center;-o-box-align:center;box-align:center;'+
								   'height:510px;position:releative;text-align:center;background-color:#666;overflow:auto;line-height:510px;}';	
					 cssStr+='.'+cssQz+'_css ._fot_tool{width:100%;height:40px;line-height:48px;font-size:14px;position:releative !important;background-color:#fff}';	
					 cssStr+='.'+cssQz+'_css ._fot_tool em{display:inline-block;font-style:normal; color:#666;font-size:14px; margin:auto 10px auto 10px; cursor:pointer;border-riadius:2px;}';
					 cssStr+='.'+cssQz+'_css ._fot_tool em:hover{color:#000;background-color:#eee}.'+cssQz+'_css ._fot_tool em:active{color:#000; background-color:#ddd}';
					 cssStr+='.'+cssQz+'_css .body_bg_div{width:100%;height:'+$(document).height()+'px;position:absolute;left:0px; top:0px;background-color:#000; opacity:0.3;z-index:1}';			
					 var nod=$("<style type='text/css' id='"+cssQz+"'>"+cssStr+"</style>");
					 $("head").append(nod);
				}
			};			
			createCss();				
			var dialog=$("<div id='"+Ownerid+"_dlog' class='"+cssQz+"_css'></div>");				 
			var dialog_title=$("<div id='"+Ownerid+"_title' class='_title'></div>");	
			var close_btn=$("<div id='"+Ownerid+"_title_close' class='_title_close'></div>");	
					 dialog_title.append(close_btn).append("<span>上传图片</span>");
					 dialog.append(dialog_title);	 
			var img_obj=$("<div id='"+Ownerid+"_img_obj' class='_img_obj'></div>");						
					 img_obj.append("<img id='upload_imgobj'>");	
					 dialog.append(img_obj);	   
			var footer_operat=$("<div id='"+Ownerid+"_fot_tool' class='_fot_tool'></div>");	
				    //   if(Ownerid=="upload1"){
				      	footer_operat.html('<span id="only_upload">&nbsp;&nbsp;<input checked="checked"  type="checkbox" id="isUserSeltion">只上传选区内容&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选框比例：</span><em data-p="1">1:1</em><em  data-p="2">2:1</em><em  data-p="1.33">4:3</em><em  data-p="1.77">16:9</em><em title="不锁定比例"  data-p="0">不锁定</em>');
				    //   }	
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
		  resizwPos();
		  $("#"+Ownerid+"ok_enter").click(function(){  //上传处理
				//window.location.reload();
				if(Ownerid=="upload2"){
					var jcropcss='<link href="/static/account/js/css/jquery.Jcrop.min.css" rel="stylesheet" type="text/css" id="jcrop_css">';
					$("head").append(jcropcss);
				}
				var imagedata;				  
				if($("#isUserSeltion").prop('checked')==true){  //只上传选区内图像
					imagedata=getSeltionImg();
					$(ops.imgPathPIC).attr("src",imagedata);
					imagedata=imagedata.substr(imagedata.indexOf(',') + 1);					
				}else{
					var base64=$("#upload_imgobj").attr("src");
					$(ops.imgPathPIC).attr("src",base64);
					imagedata=base64.substr(base64.indexOf(',') + 1);					
				}
				$(ops.pic_ext).val(Extname);
				$(ops.imgPathPIC).attr('data-type',1);
				localStorage.setItem("imgsrc",imagedata);   //存储图片信息 黄凯 个人中心调用
				localStorage.setItem("imgExt",Extname);
				var data = { 
						fileName:$(ops.imgPathID).val(),
						picdata:imagedata,
						type:Extname
					};
				/**关闭上传面板**/
				$("#"+Ownerid+'_bg_div').remove();
				$("#"+Ownerid+'_dlog').remove();					
			  });
		  $("#"+Ownerid+"_title_close").click(function(){
			   $("#"+Ownerid+'_bg_div').remove();
			   $("#"+Ownerid+'_dlog').remove();
			  });	
		}
		//-------------------------------------------------------	
		// 生成选区图像数据用于保存
		//-------------------------------------------------------
		function getSeltionImg(){
			var temp_ctx;
			var temp_canvas;
			temp_canvas = document.createElement('canvas');
			temp_ctx = temp_canvas.getContext('2d');
			temp_canvas.width = e_w;
			temp_canvas.height =e_h;	
			pimage=new Image();
			
			pimage.src=$("#upload_imgobj").attr("src");		
			temp_ctx.drawImage(pimage, e_x, e_y,e_w,e_h,0,0,e_w,e_h);				
			var base64 = temp_canvas.toDataURL(Extname,quality);	
			return base64;
			//var clearBase64=base64.substr(base64.indexOf(',') + 1);		
			//return clearBase64;
		}
		//-------------------------------------------------------	
		// 关联窗口大小重设
		//-------------------------------------------------------
		function resizwPos(){
			var id=Ownerid+"_dlog",
				  newTop=($(window).height()-600)/2+$(document).scrollTop(),
				  newLeft=($(window).width()-750)/2;
			$("#"+id).css({"left":newLeft,"top":newTop});  	  
		}
		//-------------------------------------------------------	
		// 外部接口输出
		//-------------------------------------------------------
		var api={
				show:createUI,
				operatImg:operat_img,
				resize:resizwPos				
				//JcropApi:getJcrop_api
			}	
		return api;
	}	
	//-------------------------------------------------------	
	//插件默认代码
	//-------------------------------------------------------	
	$.fn.localUploadYaYigj=function(options,callback){
		$.fn.localUploadYaYigj.defaultOptions={
			event:"change",	 //控件的改变事件
			picWidth:720,	//自动缩放宽度
			picHeight:450,	//自动缩放高度(默认取宽度)
			quality:0.85,		//生成后的图像品质
			scaleRatio:1,	//选框绽放比例
			imgPathID:'',		//上传成功后返回路径放到哪个控件
			imgPathPIC:'',		//上传成功后返回路径放图片
			uploadPath:'',		//上传路径		
			pic_ext:'',
			close_ico:'/static/public/img/close_icon.png',
			close_icoover:'/static/public/img/close_over.png',
		} 
		var ops=$.extend(true,{},$.fn.localUploadYaYigj.defaultOptions, options);
		var that=$(this);
		var api;
		api=$.callUploadApi(that,ops);
		
		$(window).resize(function(){
			api.resize();
			});
		
		that.on("click",function(){
			this.value='';
			});
		that.bind(ops.event,function(){
		
			api.show();
			//api.resizwPos();
			api.operatImg(this.files[0]);
			});
		this.each(function(){				
				if($.isFunction(callback)){
					callback.call(api);
				}
			});	
		return this;	
	}
})(jQuery);