(function($) {
	$.extend({
		//提示框
		//参数：提示内容、提示框标题、是否出现按钮组
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
			if(start>end){
				return false;
			}else{
				return true;
			}
		}

	})
	
	//下拉
	//页面引用 $("._select")._select('active');
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
		return this;
	};
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
	//显示当月的第一天 hs
	$.fn.getCurrFirstday = function(days) {
		var d = new Date();
		this.val(new Date(d.getTime()).Format("yyyy-MM")+"-01")
		if (days != undefined) {
			var d2 = new Date(d.getTime() + 86400000 * days);
			this.val(new Date(d2).Format("yyyy-MM-dd"));
		}
		return this;
	}
	$.fn.pasteEvents = function( delay ) {
	    if (delay == undefined) delay = 10;
	    return $(this).each(function() {
	        var $el = $(this);
	        $el.on("paste", function() {
	            $el.trigger("prepaste");
	            setTimeout(function() { $el.trigger("postpaste"); }, delay);
	        });
	    });
	};

	// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
		// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
		// 例子： 
		// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
		// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
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
		//输入判断 数字或金额
		$.fn.Verify = function(type) {
			var t = this.val();
			switch (type) {
				case "num":
					t = t.replace(/\D/g, '');
					//t=t.substring(0,5);
					break;
				case "money":
					//t = t.replace(/[^\d.\d\d]/g,'');
					t = t.replace(/[^\d.]/g,""); //清除"数字"和"."以外的字符
					t = t.replace(/^\./g,""); //验证第一个字符是数字
					t = t.replace(/\.{2,}/g,"."); //只保留第一个, 清除多余的
					t = t.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
					t = t.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3'); //只能输入两个小数
					break;
				case "numAndeng":
					t=t.replace(/[^\w\.\/]/g,'');
					break;
			}
			this.val(t);
			return this;
		};

		$.fn.tips = function(op){
			var obj={},time;
			var _this = this;
			obj.show= function(){
				if (! _this[0])
				{
					debugger;
					return;
				}
				var obj = ".tips"+_this[0].id;
				var str ='',zindex='9999999';
				$(obj).remove();
				if(typeof(op.zindex)!='undefined'){
					zindex=op.zindex
				}
				str += '<div class="tips'+_this[0].id+' '+op.cls+' _tips" style="z-index:'+zindex+';position: absolute;background:url(/static/public/img/waring.png) no-repeat center left; background-size:12px;padding-left:15px;font-size:12px">';
				str +='<p style="color:#f86d5a">'+op.content+'</p>';
				// str +='<em style="position: absolute;width: 5px; height: 5px; border: 1px solid #ff0000; background: #f9f9f9; transform: rotate(45deg); border-bottom: none; border-left: none;"></em>';//小三角
				str += '</div>';
				var scrolly=0;
				var scrollx=0
				if(typeof(op.partid)!='undefined'){
					$(op.partid).append(str);
					scrolly=$(op.partid).offset().top;
					scrollx=$(op.partid).offset().left;
				}else{
					$('body').append(str);
				}
				if( op.position == 'l'){
					$(obj).css({
						top: _this.offset().top+_this.outerHeight()/2-$(obj).outerHeight()/2+"px",
						left: _this.offset().left-6-$(obj).outerWidth()+"px"
					});
					$(obj).children('em').css({
						top: '50%',
						transform:"translateY(-50%) rotate(45deg)",
						right: '-4px'
					});
				}else if( op.position == 't'){
					$(obj).css({
						//left: _this.offset().left+_this.outerWidth()/2-$(obj).outerWidth()/2+"px",
						top: _this.offset().top-6-$(obj).outerHeight()+"px",
						left:_this.offset().left+"px"
					});
					$(obj).children('em').css({
						left: '50%',
						transform:"translateX(-50%) rotate(135deg)",
						bottom: '-4px'
					});
				}else if( op.position == 'r'){
					$(obj).css({
						top: _this.offset().top+_this.outerHeight()/2-$(obj).outerHeight()/2+"px",
						left: _this.offset().left+6+_this.outerWidth()+"px"
					});
					$(obj).children('em').css({
						top: '50%',
						transform:"translateY(-50%) rotate(-135deg)",
						left: '-4px'
					});
				}
				else if( op.position == 'b'){
					$(obj).css({
						//left: _this.offset().left+_this.outerWidth()/2-$(obj).outerWidth()/2+"px",
						//top: _this.offset().top+6+$(obj).outerHeight()+"px"
						top: _this.offset().top+_this.outerHeight()-scrolly+"px",
						left:_this.offset().left+10-scrollx+"px"
					});
					$(obj).children('em').css({
						left: '50%',
						transform:"translateX(-50%) rotate(-45deg)",
						top: '-4px'
					});
				}
				_this.click(function(){
					$(".tips"+_this[0].id).remove();
					_this.removeClass("error_input ipt_valid_red");
				})
				// time = setTimeout(function(){
				// 	clearTimeout(time);
				// 	$(".tips"+_this[0].id).remove();
				// },2000);	
			}
			return obj;
		}
})($);

/** 
 * 将数值四舍五入后格式化. 
 * 
 * @param num 数值(Number或者String) 
 * @param cent 要保留的小数位(Number) 
 * @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型); 
 * @return 格式的字符串,如'1,234,567.45' 
 * @type String 
 */
function formatNumber(num, cent, isThousand) {
	num != undefined || (num = '0.00');
	num = num.toString().replace(/\$|\,/g, '');
	// 检查传入数值为数值类型  
	if (isNaN(num))
		num = "0";
	// 获取符号(正/负数)  
	sign = (num == (num = Math.abs(num)));

	num = Math.floor(num * Math.pow(10, cent) + 0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入  
	cents = num % Math.pow(10, cent); // 求出小数位数值  
	num = Math.floor(num / Math.pow(10, cent)).toString(); // 求出整数位数值  
	cents = cents.toString(); // 把小数位转换成字符串,以便求小数位长度  

	// 补足小数位到指定的位数  
	while (cents.length < cent)
		cents = "0" + cents;

	if (isThousand) {
		// 对整数部分进行千分位格式化.  
		for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
			num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
	}

	if (cent > 0)
		return (((sign) ? '' : '-') + num + '.' + cents);
	else
		return (((sign) ? '' : '-') + num);
}

//日期加减
function addDate(date,days){ 
	var d=new Date(date); 
	d.setDate(d.getDate()+days); 
	var val = d.Format("yyyy-MM-dd");
	return val; 
}
//拆分url参数
//先重置QueryString.Initial，再使用QueryString.GetValue
QueryString = {
	data: {},
	Initial: function() {
		var aPairs, aTmp;
		var queryString = new String(window.location.search);
		queryString = queryString.substr(1, queryString.length); //remove   "?"     
		aPairs = queryString.split("&");
		for (var i = 0; i < aPairs.length; i++) {
			aTmp = aPairs[i].split("=");
			this.data[aTmp[0]] = aTmp[1];
		}
	},
	GetValue: function(key) {
		//console.log(this.data) 
		return this.data[key];
	}
}


//将json对象key值改为小写
//*Json对象
function lowerJSONKey(jsonObj){  
    for (var key in jsonObj){  
        jsonObj["\""+key.toLowerCase()+"\""] = jsonObj[key];  
        //delete(jsonObj[key]);  
    }  
    return jsonObj;  
}