   //图片上传预览    IE是用了滤镜。
   function previewImage(file) {
      var uid=''//$("#uid").val();
      var obj=$(file);
      var filename=obj.attr("data-id");
   	if(file.files && file.files[0]) {
   		var reader = new FileReader();
   		reader.onload = function(evt) {
   			var src = evt.target.result;
   			var html = '';
   			html += '<li>';
   			html += '<div class="image-box rel" style="background-image: url('+src+');"></div>';
   			html += '<a href="javascript:;" class="close-circle">×</a>';
   			html += '</li>';
   			//$('#preview ul li').remove();
   			//$('#preview ul').append(html);
 			//$(".close-circle").on("click", close);
            obj.next().attr("src",src);
            obj.parent().addClass("reloadpic")                    
            obj.nextAll("input").val('upload/'+uid+'/'+filename+'.jpg');
            obj.nextAll(".tips").removeClass("error").addClass("correct");
            upPhoto(obj.parent(),filename);
   		}
   		reader.readAsDataURL(file.files[0]);
   		
   	} else //兼容IE
   	{
   		console.log(2);
            var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
            file.select();
            var src = document.selection.createRange().text;
   			var html = "<div class='image-box rel' style='"+sFilter+src+"\"'><a href='javascript:'; class='close-circle'>×</a></div>";
   			//$('#preview div').remove();
   			//$('#preview').append(html);
   			//$(".close-circle").on("click", close);

            obj.next().attr("style",sFilter+src);
            obj.parent().addClass("reloadpic")                    
            obj.nextAll("input").val('upload/'+uid+'/'+filename+'.jpg');
            obj.nextAll(".tips").removeClass("error").addClass("correct");
            upPhoto(obj.parent(),filename);
   		}
   }
