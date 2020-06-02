var files = [];
var $fileToUpload = $('#fileToUpload');
var $fileList = $('#up_content_area1');
var $barList = null;
var index = 0;
//-----------------------------------------
//选择文件后生成列表式信息
//-----------------------------------------
function fileSelected(obj) {
	var fs= obj.files;
	//console.log(fs);
	//$("#top_pop_process").attr("max",fs.length);
	$("#fileToUpload").data('tmp',fs.length);
	$("#fileToUpload").data('ok','0');
	 //$("#top_pop_process").show();
	var html 	= '';	
	for(var i = 0; i < fs.length; i++) {
		var file = fs[i];
		files.push(file);
		var fileSize = 0;
		if (file.size > 1024 * 1024) {
			fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
		} else {
			fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
		}		
		(function(file,fileSize,i) {
            var reader = new FileReader();
			reader.onloadstart=function(e){
				//console.log('onloadstart');
			};
			reader.onprogress=function(e){
				//console.log(e.loaded);				
			};
			reader.onloadend = function(e){
				//console.log('i='+i);				
			};
            reader.onload = function(e){
			  	create_file(file.name,fileSize,file.type,e.target.result,i);				
            };			
            reader.readAsDataURL(file);
         })(file,fileSize,i);	 
	}
	$barList = $('.bar');	
}
//-----------------------------------------
//fname文件名称 fsize:大小 ftype:类型 url:图像数据 i:当前处理编号 
//-----------------------------------------
function create_file(fname,fsize,ftype,url,i){	
	//url:数据 800 图像宽度 1品质 0表示原始数据可直接显示到img上 fsize 大小 ftype类型 close_top_pop_process函数 i当前编号
	create_mall_img(url,800,1,0,fname,fsize,ftype,close_top_pop_process,i);
}
//-----------------------------------------
// 批量生成小图
//-----------------------------------------
function create_mall_img(blob,width,quality,type,fname,fsize,ftype,callback,index) {
	//var URL = window.URL || window.webkitURL;
	//var blob = URL.createObjectURL(file);	
	//blob=blob.substr(blob.indexOf(',')+1);
	//console.log('type='+ftype)
	var img = new Image();
	img.src = blob;			
	img.onload = function() {
		var w = this.width,h = this.height,scale = w / h;
		if(w>width){
			w = width || w;
		}
		h = w / scale;
		var canvas = document.createElement('canvas');
		ctx = canvas.getContext('2d');
		$(canvas).attr({
			width: w,
			height: h
		});
		ctx.drawImage(this, 0, 0, w, h);
/*		switch(ftype){
			'image/jpeg':
				break;
			'image/png':
				break;		
		}*/
		var base64=canvas.toDataURL(ftype,1);
		var proWidth=120*(w/h);		
		//console.log(base64);
		//if(type==1){
		//	base64=base64.substr(base64.indexOf(',')+1);	
		//	return base64;			 	
		//}else{
			//return false;
			html= '<div class="file-item well">'+
				  '	<div class="d_img">'+
				  ' 	<img data-isup="0" data-fname="'+fname+'" data-fsize="'+fsize+'"  src="'+base64+'" data-ftype="'+ftype+'"  height="120">'+
				  '	</div>'+
				  '	<div class="progress">'+
				  '	 	<div class="bar"><progress style="width:'+proWidth+'px" id="prog" value="0" max="'+fsize+'"></progress></div>'+
				  '	</div>' +
				  '	<div class="plistText">'+
				  '	 	<div class="span1" title="'+fname+'">'+ fname +'<span class="span2">&nbsp;('+ fsize +')</span></div>' +		
				  '	</div>'+
				  '	<div class="img_del">&#10005;</div>'+
				  '	<div class="img_ok" title="插入到编辑器中">&#8623;</div>'+
				  '</div>';	
			//console.log(html);	  	
			$("#up_content_area1").append(html);
			//$fileList.append(html);	
			callback(1);	
			//return base64;
		//}		
	}	
}

//-----------------------------------------
//	上传文件过程 	
//-----------------------------------------
function uploadFile(index,callback){
	var isup=$(".d_img").eq(index).find("img").data('isup');	
	if(isup!=0){
		callback(1);	//回调处理进度
		return false;	
	}
	var imagedata=$(".d_img").eq(index).find("img").attr("src");
	//console.log('imagedata='+index+'--'+imagedata.substr(imagedata.indexOf(',')+1));
	var url =app_path+'/index.php?m=Admin&a=saveup'; 
	var data = { 
	    p_pic_type:$(".d_img").eq(index).find("img").attr("data-ftype"),
		imagedata: imagedata.substr(imagedata.indexOf(',')+1) 
	};
	$.ajax({
		 	type:"POST",
			url:app_path+'/index.php?m=Admin&a=saveup',
			data: data,
			dataType:"JSON",
			beforeSend: function() {
				//$("#typetree").empty();
				//$("progress").eq(index).val(50);
				$(".d_img").eq(index).find("img").data('isup','1'); //已经上传标志
			},
			doProgress:function(e){
				console.log(e);
				//console.log('progress');
			},
			success: function(data,textStatus){
				//console.log("ok:");
				//console.log(data);
				//alert(data);
				//$("progress").eq(index).val(50);
				//var typeinfo=eval('('+$("#menu").data('json')+')');
				/*var json={'oldname':$(".d_img").eq(index).find("img").data('fname'),
						  'oldsize':$(".d_img").eq(index).find("img").data('fsize'),
						  'wadoname':data.info,
						  'truePath':data.filename,
						  'type':typeinfo.id,
						  'id':gen_wy_id()
						  }		*/				  
				//console.log(json);
			},
			error:function(XMLHttpRequest,textStatus, errorThrown){
				//alert('error='+data);	
				//console.log("error:");
				//console.log(data);			
				/*console.log(XMLHttpRequest);
				console.log(textStatus);
				console.log(errorThrown);*/
			},
			complete:function(XMLHttpRequest,textStatus){
				//console.log(XMLHttpRequest);
				//console.log(XMLHttpRequest.responseText);
				var jsonData=JSON.parse(XMLHttpRequest.responseText);
				console.log(jsonData);
				//$("progress").eq(index).val(100);
				if($(".d_img").eq(index).find("img").data('isup')==1){
					$(".d_img").eq(index).parent().find(".img_ok").show();
					$(".d_img").eq(index).attr('data-filepath',jsonData.info);
				}	
				callback(1);	//回调处理进度			
			}
		});
}

//-----------------------------------------
//	关闭载入进度层并显示进度 	
//-----------------------------------------
function close_top_pop_process(index){
	var oks=parseInt($("#fileToUpload").data("ok"));
	var cout=parseInt($("#fileToUpload").data("tmp"));
	oks=oks+1;
	console.log(oks);
	//$("#top_pop_process").attr('value',oks);
	var pwidth=(oks/cout)*100;
	//$(".pro_bg").css({"background-size":pwidth+"% 100%"});
	$("#fileToUpload").data("ok",oks);	
	//console.log('oks='+oks);
	if(oks==cout){
		window.setTimeout(function(){
				// $("#top_pop_process").attr("value","0").hide();
				 $("#bg_over_div").hide();
		},2000);
	 	//$("#top_pop_process").animate({"top":"-40px"},500);
	}
}

//-----------------------------------------
//	所有选择文件下传完成回调处理 	
//-----------------------------------------
function up_finsish_process(index){
	var cout=parseInt($("#fileToUpload").data('ups'));
	var oks=parseInt($("#fileToUpload").data("upoks"));
		oks=oks+1;
	var pwidth=(oks/cout)*100;	
	$("#fileToUpload").data("upoks",oks);
	//$(".pro_bg").css({"background-size":pwidth+"% 100%"});
	if(oks==cout){
	 	//$("#top_pop_process").animate({"top":"-40px"},500);
		//$("#clear_pic_list").trigger('click');
	}
}

function getPicFolder(){
	$.ajax({
		 	type:"GET",
			url:app_path+'/index.php?m=Admin&a=ViewPicFolder',
			dataType:"JSON",
			success: function(data){
				console.log(data);
				var tmp=[];	
				tmp.push('<ul>');			
				$.each(data,function(k,v){
					tmp.push('<li class="folder_item" data-info="'+v+'"><img src="./public/img/folder1.png" height="20" />&nbsp;'+v+'</li>');
					});		
				tmp.push('</ul>');					
				$("#pic_list_right").append(tmp.join(''));
				},
			complete: function(data){				
				}
	});
}


//-----------------------------------------
//	事件处理
//-----------------------------------------
getPicFolder();
 
$(document).on('click','.folder_item',function(e){
	 $.ajax({
		 	type:"GET",
			url:app_path+'/index.php?m=Admin&a=ViewPicList&folder=upload/'+$(this).attr('data-info'),
			dataType:"JSON",
			success: function(data){
				var tmp=[];	
				$("#pic_list_left").empty();				
				$.each(data,function(k,v){
					tmp.push('<img class="img_dbclick" title="双击插入到编辑器！" src="'+v+'" height="80" />');
					});					
				$("#pic_list_left").append(tmp.join(''));
				},
			complete: function(data){				
				}
	});
}); 
 
$(document).on('click','.img_del',function(e){
		if(confirm('您确认要删除该文件么?')){
			var index=$(this).parent().index();
			//console.log(index);
			$('#up_content_area1').find(".well").eq(index).remove();	
			//console.log($('#up_content_area1').find(".well"));
			//console.log($('#up_content_area1').find(".well").eq(index));
		}
});
$(document).on('click','#select_web_pic',function() {
	$("#pic_more_up").show();
	$('.up_view_type').eq(1).attr('data-flag','1').siblings().attr('data-flag','0');
	$("#up_content_area1").hide();
	$("#up_content_area2").show();
});

$(document).on('click','.img_ok',function() {
	var data_filepath=$(this).siblings('.d_img').attr('data-filepath');
	editor.insertHtml('<img src="'+data_filepath+'">');
});

$(document).on('dblclick','.img_dbclick',function() {
	var data_filepath=$(this).attr('src');
	editor.insertHtml('<img src="'+data_filepath+'">');
});

$(document).on('click','#subBtn',function() {
   var icount=$("#up_content_area1 .well").size();
   $("#fileToUpload").data('ups',icount);
   $("#fileToUpload").data("upoks",'0');	
   //ui_top_pop_process('正在上传图片...');
   for(i=0;i<icount;i++){
		uploadFile(i,up_finsish_process);
		//uploadFile8(i);
	}
});

$(document).on('click','#clsBtn',function() {
	$("#up_content_area1").empty();
});

$(document).on('mousedown','#pic_up_title',function(e){
	   if(e.toElement.tagName=='DIV'){
		isMove = true;
		var obj=$(e.target).parent();
		X=e.clientX-obj.offset().left;
		Y=e.clientY-obj.offset().top;  
		$(document).bind("mousemove",function(e){
			event.preventDefault();
			if(!isMove) return;
			XMove = e.clientX - X;
			YMove = e.clientY - Y;                
			obj.css({"left":XMove,"top":YMove,"margin-top":0,"margin-left":0});
			return false;				
		}).bind("mouseup",function(e){
			 isMove = false;
			 $(document).unbind("mousemove");
		});	
	   }
});