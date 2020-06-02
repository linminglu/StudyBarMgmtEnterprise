/*---------------------------------------
 本地上传前处理，再上传到服务器插件,主要是用来处理图片
 作者: 曾令兵
 时间:2016-07-04
*----------------------------------------*/
(function($){	
	//命令集合
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
			  e_x,e_y,e_x2,e_y2,e_w,e_h;
			
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
					var thatMy = this,w = thatMy.width,h = thatMy.height,scale = w / h;		
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
					 //nTop=(h-ww/ops.scaleRatio)/2;
					 setSelect = [nLeft,nTop,ww,hh];
					// console.log(h);
					 
					 canvas = document.createElement('canvas');
					 ctx = canvas.getContext('2d')
					 $(canvas).attr({
							width:w,
							height:h
						});	
					 ctx.drawImage(thatMy, 0, 0, w, h);	
					  try {
						dataURL = canvas.toDataURL(Extname,quality);
						$("#upload_imgobj").attr("src",dataURL);	
						$("#upload_imgobj").Jcrop({
									allowSelect:false,
									keySupport:true,
									drawBorders:true,
									fadeTime:400,
									minSize: minsize,			
									aspectRatio:ops.scaleRatio,		
									bgFade: true, 
									bgOpacity: 0.5, 
									setSelect:setSelect, 
									onChange: updateInfo,
									//onSelect: updateInfo,
									//onRelease: clearInfo
								}, function(){
									var bounds = this.getBounds();
									boundx = bounds[0];
									boundy = bounds[1];
									jcrop_api = this;
									//$upload_imgobj.appendTo(jcrop_api.ui.holder);
								});			
					  } catch (undefined){
						alert('图片文件处理错误!');
					  }
			   }// end img.onload 				
			} // end if(objUrl)
		}
		//-------------------------------------------------------
		//坐标赋值
		//-------------------------------------------------------
		function updateInfo(e) {
			//console.log(e);
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
				return false
			}
		}
		//-------------------------------------------------------	
		//创建ui层
		//-------------------------------------------------------	
		function createUI(){
  
					  		var imagedata;
							
							
							var base64 = $("#upload_imgobj").attr("src");
							imagedata=base64.substr(base64.indexOf(',') + 1);	
						
							
							var data = { 
									fileName:ops.imgfileName,//$(ops.imgPathID).val(),
									imgdata: imagedata,
									type:Extname
								};	
							
							/*$.ajax({
								   type: "POST",
								   url: ops.uploadPath,
								   data: data,
								   dataType:"JSON",
								   complete: function(data){
										//console.log(data);
								   },
								   beforeSend: function(){
										//ui_top_pop_process('正在获取数据,请稍候...');   
								   },
								   success: function(msg){
									  console.log(msg);
									   $(ops.imgPathID).val(msg);
								   }
							});*/
							$.post(ops.uploadPath,{
											   fileName:ops.imgfileName,//$(ops.imgPathID).val(),
											   imgdata: imagedata,
											   type:Extname
											},
									function(data,status){	
									//alert(data);									
									$(ops.imgPathID).val(data);
									$(ops.imgPathPIC).attr("src",data);
									
										//console.log(result);
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

			var clearBase64=base64.substr(base64.indexOf(',') + 1);		
			return clearBase64;
		}
		//-------------------------------------------------------	
		// 外部接口输出
		//-------------------------------------------------------
		var api={
				show:createUI,
				operatImg:operat_img
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
			scaleRatio:4/3,	//选框绽放比例
			imgPathID:'',		//上传成功后返回路径放到哪个控件
			imgPathPIC:'',		//上传成功后返回路径放图片
			uploadPath:''		//上传路径		
		} 
		var ops=$.extend(true,{},$.fn.localUploadYaYigj.defaultOptions, options);
		var that=$(this);
		var api;
		api=$.callUploadApi(that,ops);
		that.bind(ops.event,function(){
			api.show();
			//api.operatImg(this.files[0]);
			});
		this.each(function(){				
				if($.isFunction(callback)){
					callback.call(api);
				}
			});	
		return this;	
	}
})(jQuery);