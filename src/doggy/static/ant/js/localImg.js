
    $.fn.localImg = function(obj) {
    	localImg = this;
		var scal_bl=1;
		var stype='jpg,png';
		var sSize=0;
    	this.setObj = function(object){
    		obj = object;
    	};	
        this.on('change', function() {
            var file = this.files[0];
			if(typeof(file)=='undefined'){
				$(this).attr('data-null','0'); 
				return;
			}			
			var objUrl=getObjectURL(this.files[0]);
			if(objUrl){
			   var img = new Image(), canvas,ctx,dataURL = null;
			   img.src = objUrl;	
			   img.crossOrigin = "anonymous";					   
			   img.onload = function() {
				var that = this,w = that.width,h = that.height,scale = w / h;		
				 if(w>720){	  
					w = 720;
				 }
				 h = w / scale;
				 $("#pic_w").val(w);
				 $("#pic_h").val(h);
				 canvas = document.createElement('canvas');
				 ctx = canvas.getContext('2d')
				 $(canvas).attr({
						width:w,
						height:h
					});	
				 ctx.drawImage(that, 0, 0, w, h);					
				  try {
					dataURL = canvas.toDataURL('image/jpeg',0.85);
					$(".ui_button").css({"background-image":"url("+dataURL+")"});
					$("#xFile").attr('data-null','1');
					//console.log($(".ui_button").css("background-image"));
				  } catch (undefined){
					alert('上传图片文件错误!');
				  }
			   }			   
			}					
        });
		
		/**
         * 将字节转换成常规可读模式
         * @bytes 大小
         */
		function bytesToSize(bytes) {
			var sizes = ['Bytes', 'KB', 'MB'];
			if (bytes == 0) return 'n/a';
			var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
			return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
		};
		
		/*********************************
         * 生成更新信息显示
         * @param e为事件对象
         ********************************/
		function updateInfo(e) {
			$('#x1').val(e.x);
			$('#y1').val(e.y);
			$('#x2').val(e.x2);
			$('#y2').val(e.y2);
			$('#w').val(e.w);
			$('#h').val(e.h);
			genPreview();
		};			
		
		function setwz(){
			$("#preivewdiv").text('abc');
			$("#preivewdiv").css({"display":"block"});
		}
		
		function updatePreview(c){		
		if (parseInt(c.w) > 0) {
		  var rx = xsize / c.w;
		  var ry = ysize / c.h;		  
		  $pimg.css({
			width: Math.round(rx * boundx) + 'px',
			height: Math.round(ry * boundy) + 'px',
			marginLeft: '-' + Math.round(rx * c.x) + 'px',
			marginTop: '-' + Math.round(ry * c.y) + 'px'
		  });
		}
	  };
		
		function clearInfo() {
			$('.info #w').val('');
			$('.info #h').val('');
		};		

        /**
         * 生成base64
         * @param blob 通过file获得的二进制
         */
        function _create(blob,file) {
            var img = new Image();
            img.src = blob;			
            img.onload = function() {
                var that = this;
                var w = that.width,
                      h = that.height,
                      scale = w / h;
			     scal_bl=scale;				
				if(w>720){	  
                	w = obj.width || w;
				}
                h = w / scale;
                var canvas = document.getElementById('preview2');
                ctx = canvas.getContext('2d');
                $(canvas).attr({
                    width: w,
                    height: h
                });				
				var sResultFileSize = bytesToSize(file.size);						 
				 stype=file.type;
				 sSize=sResultFileSize;		
				 $("#file").attr('data-type',stype)	;
				 $("#extName").val(stype);	
				$("#preview").css({"width":w,"height":h});
                ctx.drawImage(that, 0, 0, w, h);
                var base64 = canvas.toDataURL(stype, obj.quality || 0.8);  
				pimage.src=base64;	
				//console.log(base64);  
				oImage = document.getElementById('preview');
				oImage.src =base64;		         
                var result = {
                    base64: base64,
                    clearBase64: base64.substr(base64.indexOf(',') + 1)
                };
				//------------------------------------------------
							
				//pimage.src=result.base64;	
				
				 //console.log(that);				 
				//$('#filesize').val(sResultFileSize);
				//$('#filetype').val(file.type);
				$('#filedim').val(oImage.naturalWidth + ' x ' + oImage.naturalHeight);					
				var nTop=0;
				var nLeft=0;
				var ww = w;
				var hh = w*3/4;
				if(hh>h){
					hh=h;
				}
				aspectRatio = 0;
				if(typeof(obj.aspectRatio)!='undefined'){
					if(obj.aspectRatio>0){
						hh = ww /aspectRatio;
					}
					else{
						nTop =0;
						nLeft =0;
						ww = w;
						hh = h;
					}
					aspectRatio = obj.aspectRatio;
				}
				$('#preview').attr('width',w);
				$('#preview').attr('height',h);
				var setSelect = [nLeft,nTop,ww,hh];				
				var minsize=[32,20];
				if($("#chkevent").prop('checked')==true){
					//console.log('this is there!');
					sfbl=aspectRatio;	
					minsize=[w,h];
				}
				if (typeof jcrop_api != 'undefined') {
               		jcrop_api.setImage(base64);						
               		jcrop_api.setOptions({
						allowSelect:false,
						drawBorders:true,
						keySupport:true,
						fadeTime:400,
						minSize: minsize,//[32, 20], //[ww, hh], 
						aspectRatio:scal_bl,//720/450,
						bgFade: true, 
						bgOpacity: 0.5, 
						onChange: updateInfo,
						onSelect: updateInfo,
						onRelease: clearInfo
					}, function(){
					var bounds = this.getBounds();
					boundx = bounds[0];
					boundy = bounds[1];
					jcrop_api = this;
					$preview.appendTo(jcrop_api.ui.holder);
					});
					jcrop_api.setSelect(setSelect);				
               		return;
                } 					
				$('#preview').Jcrop({
					allowSelect:false,
					keySupport:true,
					drawBorders:true,
					fadeTime:400,
					minSize: minsize,//[32, 20], //[ww, hh], 
					aspectRatio : scal_bl,//720/450,
					bgFade: true, 
					bgOpacity: 0.5, 
					setSelect:setSelect, 
					onChange: updateInfo,
					onSelect: updateInfo,
					onRelease: clearInfo
				}, function(){
					var bounds = this.getBounds();
					boundx = bounds[0];
					boundy = bounds[1];
					jcrop_api = this;
					$preview.appendTo(jcrop_api.ui.holder);
				});	 					 			
				//------------------------------------------------ 				
            };
        }
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