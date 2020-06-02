(function($){
	$.fn.yayigj_mp_selmonth=function(options) {
		 var that=$(this),thatID = that.attr("id");  		
		 return this.each(function() { 
		 	var createCss=function(){
		 		var cssStr = '';
		 		cssStr+='.sEt_month .sEtMoTop{position:relative;height:50px;font-size:20px;}';
		 		cssStr+='.sEt_month .sEtMoTop .sEt_month_pre{position:absolute;left:30px;top:10px;width:20px;height:20px;}';
		 		cssStr+='.sEt_month .sEtMoTop .sEt_month_next{position:absolute;right:30px;top:10px;width:20px;height:20px;}';
		 		cssStr+='.sEt_month .sEtMoTop .top_txt{display:block;text-align:center;font-size:20px;line-height:50px;height:50px;}';
		 		cssStr+='.sEt_month ._month{width:25%; text-align:center;  float:left;height:60px;line-height:60px;box-sizing:border-box;border-right:solid 1px #ccc;border-top:solid 1px #ccc;}'
		 		cssStr+='.mpBg{position:fixed;left:0;top:0;width:100%;height:100%;background:#000;opacity:.3;z-index:10000;display:none}'
		 		var nod=$("<style type='text/css' id=''>"+cssStr+"</style>");
				$("head").append(nod);
		 	};
		 	var createUI=function(){
				var rect=that[0].getBoundingClientRect();
				//console.log('rect=',rect);
				var pre=$("<div class='sEt_month_pre' style='width:28px; height:20px; position:absolute; border:solid 0px #ccc;left:"+(rect.left-28)+"px;top:"+(rect.top+3)+"px'><<</div>");	
				var next=$("<div class='sEt_month_next' style='width:28px; height:20px; position:absolute; border:solid 0px #ccc;left:"+(rect.right)+"px;top:"+(rect.top+3)+"px''>>></div>");	
				var outerDiv=$("<div class='sEt_month' style='width:100%; height:232px;background:#fff;color: #A5A5A5; position:fixed; border:solid 1px #ccc;display:none;left:0;top:0;z-index:10001;'></div>");				
				var divTop = "<div class='sEtMoTop'><span class='sEt_month_pre'> < </span><span class='sEt_month_next'> > </span><span class='top_txt'>2</span></div>";
				var tmp=[];	
				var cn_month=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
				for(var i=0;i<12;i++){
					tmp.push("<div class='_month' style='' data-num='"+(i+1)+"'>"+cn_month[i]+"</div>");	
				}
				
				outerDiv.append(divTop);
				outerDiv.append(tmp.join(''));
				$("body").append(outerDiv);
				$("body").append("<div class='mpBg'></div>");
				//$("body").append(pre);
				//$("body").append(next);
			};
			var bind=function(){
				that.on("click",function(e){
					//$(".sEt_month").show().css({"left":that.offset().left,"top":that.offset().top+that.height()});	
					$(".sEt_month").show().css({"left":0,"top":0});
					$(".mpBg").show();e.preventDefault();
					$(".sEt_month .sEtMoTop .top_txt").text(new Date().getFullYear())
				});	
				$("._month").on('click',function(){
					 var _m=$(this).attr('data-num');
					 _m=_m<10?'0'+_m:_m;
					 $(".sEt_month .sEtMoTop .top_txt").text($(".sEt_month .sEtMoTop .top_txt").text().substring(0,4)+"-"+_m);
					 that.text($(".sEt_month .sEtMoTop .top_txt").text().substring(0,4)+'-'+_m);
					 $(".sEt_month").hide();$(".mpBg").hide();
					options.callback($(".sEt_month .sEtMoTop .top_txt").text().substring(0,4)+'-'+_m);
				});
				$(".sEt_month .sEtMoTop .sEt_month_pre").on("click",function(){
					var ndt=new Date($(".sEt_month .sEtMoTop .top_txt").text().replace(/-/g,'/')+'/01'+'/01');
					ndt.setMonth(ndt.getMonth());
					var _y=ndt.getFullYear(),_m=ndt.getMonth()<10?'0'+ndt.getMonth():ndt.getMonth();
					console.log(_y);
					//if(_m=="00"){
						//_m=12;
						_y--;
					//}
					$(".sEt_month .sEtMoTop .top_txt").text(_y);
					that.text(_y+'/'+_m)
					//options.callback(that.text(_y+'/'+_m));
				});
				$(".sEt_month .sEtMoTop .sEt_month_next").on("click",function(){
					var ndt=new Date($(".sEt_month .sEtMoTop .top_txt").text().replace(/-/g,'/')+'/01'+'/01');
					ndt.setMonth(ndt.getMonth()+2);
					var _y=ndt.getFullYear(),_m=ndt.getMonth()<10?'0'+ndt.getMonth():ndt.getMonth();
					//if(_m=="00"){
					//	_m=12;
						_y++;
					//}
					//console.log(_y);
					$(".sEt_month .sEtMoTop .top_txt").text(_y);
					that.text(_y+'/'+_m)
					//options.callback(that.text(_y+'/'+_m));
					//options.callback(that.text($(".sEt_month .sEtMoTop .top_txt").text(_y+"-"+_m)));
				});
				
			}	
			createCss();
			createUI();
			bind();
		 });
	}
})(window.jQuery);