(function($) {
	$.extend({
		//提示框
		msgpopup: function(msginfo,title,btnlist) {
			if(title==undefined || title==''){
				title='操作失败';
			}
			var str = '';
			str += '<div id="messageBox" class="popup ">';
			str += '	<h1 class="popupTitle"><span class="text">'+title+'</span>';
			str += '<div class="p_r"></div>';
			str += '</h1>';
			str += '	<div class="popupCont">';
			str += '		 <div class="t mt10">';
			str += '			 <p class="info">' + msginfo + '</p>';
			str += '		</div>';
			str += '	</div>';
			if(!btnlist){
				str += '	<div class="btnList">';
				str += '		<input type="button" class="_btn1 close" value="确定">';
				str += '	</div>';
			}

			str += '</div>';
			if ($(".shade").length < 1) {
				str += '<div class="shade"></div>';
			}
			$("body").append(str);
			$("#messageBox").css({
				top: ($(window).height() - $("#messageBox").outerHeight()) / 2 + "px",
				left: ($(window).width() - $("#messageBox").outerWidth()) / 2 + "px"
			});
			$(".main").addClass('no_select');
			$(".shade").fadeIn(100);
			$("#messageBox").fadeIn(100);
			$("#messageBox .close").click(function() {
				$.msgboxClose();
			});
		},
		msgboxClose: function() {
			$("#messageBox").fadeOut(100);
			$("#messageBox").remove();
			$(".shade").fadeOut(100);
			$(".main").removeClass('no_select');
		},
		dateCompare:function(startdate,enddate){
			var reg = new RegExp("-","g")
			var start =startdate.replace(reg,"");
			var end =enddate.replace(reg,"");

			if(start>end)
			{
				return false;
			}
			else
				return true;
			}
})
	//显示日期
	$.fn.getCurrday = function(days) {
		var d = new Date();
		this.val(new Date(d.getTime()).Format("yyyy-MM-dd"))
		if (days != undefined) {
			var d2 = new Date(d.getTime() + 86400000 * days);
			this.val(new Date(d2).Format("yyyy-MM-dd"));
		}
		return this;
	}
	Date.prototype.Format = function(fmt) { //author: meizz 
		var o = {
			"M+": this.getMonth() + 1, //月份 
			"d+": this.getDate(), //日 
			"h+": this.getHours(), //小时 
			"m+": this.getMinutes(), //分 
			"s+": this.getSeconds(), //秒 
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
			"S": this.getMilliseconds() //毫秒 
		};
		if(fmt=='' || fmt==undefined){
			fmt='';
		}else{
			if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
		return fmt;
	}

//下拉
	'use strict';
	$.fn._select = function(options, obj) {
		var _default = {
			'addClass': options
		};
		this.each(function(index, el) {
			var p = $(el).children('p');
			var ul = $(el).children('ul');
			/*var input = $(el).children('input');*/

			p.click(function(event) {
				/*if (p.outerWidth() < ul.outerWidth()) {
					p.css('width', ul.width() + "px");
				} else {
					ul.css('width', '100%');
				}*/
				ul.slideDown(100);
				$(el).append('<em></em>').addClass(_default.addClass);
			});
			$(el).on('click', 'li', function(event) {
				var li = $(this);
				var em = $(el).children('em');
				var input =li.parent().prev().prev();
				em.remove();
				ul.slideUp(100, function() {
					/*p.css('width', 'auto');
					ul.css('width', 'auto');*/
				});
				input.val(li.attr("value"));
				p.text(li.text());
				$(el).removeClass(_default.addClass);
				//触发input- focusout
				input.focusout();

			});
			$(el).on('click', 'em', function(event) {
				$(this).remove();
				ul.slideUp(100, function() {
					/*p.css('width', 'auto');
					ul.css('width', 'auto');*/
				});
				$(el).removeClass(_default.addClass);
			});
		});
		//修改img后警告图标位置
	   var imgTips =  $(".tips").prev("input[type='hidden']").next();
	   imgTips.css({
	    "top":"20px",
	    "left":"302px",
	   })

	   imgTips2=$(".tips").prev("input[id='shop_scene_pic_one']").next();
	   imgTips2.css({
	    "top":"127px",
	    "left":"-15px",
	   })
	   imgTips3=$(".tips").prev("input[id='shop_scene_pic_two']").next();
	   imgTips3.css({
	    "top":"127px",
	    "left":"-15px",
	   })
	   imgTips4=$(".tips").prev("input[id='business_license_auth_pic']").next();
	   imgTips4.css({
	    "top":"-100px",
	    "left":"-11px",
	   })
		return this;
	};

	//弹出框
	$.fn.popup = function(option) {
			var id = this.selector + "1";
			var _this = this;
			var clickEvent = 'click';
			(option.btnlist != undefined) || (option.btnlist = true);
			if (option.dblclick == true) {
				clickEvent = 'dblclick';
			}
			var style = '';
			if ($(id).length < 1) {
				var str = '';
				str += '<div id="' + id.substr(1, id.length) + '" style="' + style + '" class="popup ">';
				if (option.title != false) {
					str += '	<h1 class="popupTitle"><span class="text"></span>';
					str += '<div class="p_r">';
					if (option.max == true) {
						str += '<span class="max mr5"></span>';
					}
					str += '<span class="close1 close"></span></div>';
					str += '</h1>';
				}
				str += '	<div class="popupCont">';

				str += '	</div>';
				if (option.btnlist) {
					str += '	<div class="btnList">';
					str += '		<input type="button" class="_btn1 submit" value="确定">';
					str += '		<input type="button" class="_btn2 close" value="取消">';
					str += '	</div>';
				}
				str += '</div>';
				if ($(".shade").length < 1) {
					str += '<div class="shade"></div>';
				}
				$("body").append(str);
			}
			$(id + " .popupTitle .text").html(option.title || "&nbsp;");
			//console.log(_this.html());
			$(id + " .popupCont").append(_this.html());

			var popup = {
				id: id,
				reset: function() {
					$(id + " .popupCont").empty().append(_this.html());
				},
				close: function() {
					$(id).fadeOut(100);
					$(".shade").fadeOut(100);
					$(".main").removeClass('no_select');
				},
				title: function(str) {
					$(id + " .popupTitle .text").html(str);
				},
				resize:function(){
					$(id).css({
						top: ($(window).height() - $(id).outerHeight()) / 2 + "px",
						left: ($(window).width() - $(id).outerWidth()) / 2 + "px"
					});
				},
				showPopup:function(){
					showPopup;
				}
			}

			var clicking = false;
			var eX = 0,
				eY = 0;
			var i = 0;
			var openResult;
			//触发弹框事件
			var showPopup = function(event) {
				popup.btn = this;
				if (option.stopP == true) {
					event.stopPropagation();
				}
				$(id + " .popupCont").empty().append(_this.html());
				if (i == 0) {
					option.first == undefined || option.first();
					i++;
				}
				option.open == undefined || (openResult = option.open(this,event));
				if (option.open != undefined && openResult == 'exit') {
					return;
				}
				$(id).css({
					top: ($(window).height() - $(id).outerHeight()) / 2 + "px",
					left: ($(window).width() - $(id).outerWidth()) / 2 + "px"
				});
				$(".main").addClass('no_select');
				$(id).fadeIn(100);
				$(".shade").fadeIn(100);
			}
			if (option.delegate != undefined) {
				$(option.delegate).on(clickEvent, option.btn, showPopup);
			} else {
				$(option.btn).on(clickEvent, showPopup);
			}
			//提交事件
			$(id + " .submit").click(function(event) {
				option.submit();
			});
			//背影层事件
			$(id + " .close").click(function() {
				popup.close();
			});
			//弹框标题拖拽事件
			$(id + " .popupTitle .text").mousedown(function(event) {
				var popup = $(this).parent().parent();
				clicking = true;
				eX = event.pageX - popup.position().left;
				eY = event.pageY - popup.position().top;
			});
			$('body').mousemove(function(event) {
				if (clicking) {
					var resultX = event.pageX - eX;
					var resultY = event.pageY - eY;
					$(id).css({
						left: resultX,
						top: resultY
					});
				}
			});
			$('body').mouseup(function(event) {
				clicking = false;
			});

			return popup;
		}
})($);


function upPhoto(obj,filename,uid,input){
	var pic_data=$(obj).find("img").attr("src");

	$.post("/member/UploadAntImg",{
				   filename:filename,
				   picdata: pic_data.substr(pic_data.indexOf(',') + 1),
				   uid:uid
  				},
  		function(data){
   			//alert("Data: " + data + "\nStatus: " + status);
			//console.log(data);
			$(input).val(data["info"]);
			//console.log(result);
  		});
}


   //图片上传预览    IE是用了滤镜。
   function previewImage(file) {
      var uid=$("#uid").val();
      var obj=$(file);
      var filename=obj.attr("data-id");

   	if(file.files && file.files[0]) {
   		var fileExtension = file.files[0].name.substring(file.files[0].name.lastIndexOf('.') + 1);
   		console.log(fileExtension)
   		if(fileExtension!='jpg' && fileExtension!='JPG'){
   			obj.nextAll(".tips").addClass("error").removeClass("correct");
   			obj.nextAll(".tips").text("请上传jpg文件")
   			return false;
   		}
   		/*if(file.files[0].size>5242){//5242880
   			//$.msgpopup("图片过太")
   			$("#clist").show()
   			return false
   		}*/
   		var reader = new FileReader();
   		reader.onload = function(evt) {
   			var src = evt.target.result;

            obj.next().attr("src",src);
            obj.parent().addClass("reloadpic")
            //obj.nextAll("input").val('/'+uid+'/'+filename+'.jpg');
            if(filename!="business_license_auth_pic"){
            	obj.nextAll(".tips").removeClass("error").addClass("correct").addClass("s2");
            }
            
            upPhoto(obj.parent(),filename,uid,obj.nextAll("input"));
   		}
   		reader.readAsDataURL(file.files[0]);

   	} else //兼容IE
   	{
   		console.log(2);
            var sFilter='filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
            file.select();
            var src = document.selection.createRange().text;
   	

            obj.next().attr("style",sFilter+src);
            obj.next().attr("src",sFilter+src);
            obj.parent().addClass("reloadpic")
            //obj.nextAll("input").val('/'+uid+'/'+filename+'.jpg');
            if(filename!="business_license_auth_pic"){
            	obj.nextAll(".tips").removeClass("error").addClass("correct").addClass("s2");
            }
            //obj.nextAll(".tips").removeClass("error").addClass("correct");
            upPhoto(obj.parent(),filename,uid,obj.nextAll("input"));
   		}

   		if(obj.nextAll(".tips.correct")){
            var imgTips2=obj.nextAll(".tips.correct").prev("input[id='shop_scene_pic_one']").next()
            var imgTips3=obj.nextAll(".tips.correct").prev("input[id='shop_scene_pic_two']").next();
            imgTips2.css({
                "top":"127px",
                "left":"32px",
               })
            imgTips3.css({
                "top":"127px",
                "left":"32px",
               })
        }
   }


//获取诊所列表
function getclinclist(obj,clinicid){
    $.get("/member/GetClinicList",
  		function(data){
			var str='';
			$.each(data.list,function(index,el){
                str+='<span class="clinicitem" data-id="'+el.clinicid+'"><font>'+el.name+'</font><br>管家号：'+el.dentalid+'</span>'
			})
			$(obj).empty().append(str)
			if(clinicid!=undefined && clinicid!=''){
				$(".clinicitem[data-id="+clinicid+"]").addClass("active");
				$("#ClinicUniqueID").val(clinicid);
			}else{
				$(".clinicitem").eq(0).addClass("active");
   				$("#ClinicUniqueID").val($(".clinicitem").eq(0).attr("data-id"));
			}

  		});
}
