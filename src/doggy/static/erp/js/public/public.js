$(function(){
	//2017-1-16罗杨
	var s_tag=parseInt($("input[name='htag']").val());
	// console.log(s_tag)
	$(".leftNav div").eq(s_tag).addClass("act").siblings("div").removeClass("act");
	$(".leftNavSmall div").eq(s_tag).addClass("act").siblings("div").removeClass("act");
	//获取当天日期
	$.fn.getCurrday = function(days) {
		var d = new Date();
		//console.log("this=",this);
		if(this[0].nodeName.toLowerCase()=="input"||this[0].nodeName.toLowerCase()=="textarea"){
			this.val(new Date(d.getTime()).Format("yyyy-MM-dd"))
		}else{
			this.text(new Date(d.getTime()).Format("yyyy-MM-dd"))
			if (days != undefined) {
				var d2 = new Date(d.getTime() + 86400000 * days);
				this.text(new Date(d2).Format("yyyy-MM-dd"));
			}
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
	
	//在当前日期追加一天
	function addOneDay(data){
	   var s=data.split("-");
	   var newdt=new Date(Number(s[0]),Number(s[1])-1,Number(s[2])+1);
	   rsdate=newdt.getFullYear()+"-"+ (newdt.getMonth()+1)+"-"+newdt.getDate();
	   return rsdate;
	}
	function valDays(id,num){
		if(id!=undefined){
			var nday=new Date();
			var year=nday.getFullYear();
			var month=parseInt(nday.getMonth())+1;
			var day=nday.getDate()+parseInt(num);

			var MonDay=new Date(year,month-1,day);
				year=MonDay.getFullYear();
				month=parseInt(MonDay.getMonth())+1;
				day=MonDay.getDate();

				month=month<10?month="0"+month:month;
				days=day<10?day="0"+day:day;
				$("#"+id).val(year+"-"+month+"-"+days);
		}
	}
});
//获取url中的参数
	function getUrlParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
		var r = window.location.search.substr(1).match(reg);  //匹配目标参数
		if (r != null) return unescape(r[2]); return null; //返回参数值
	}
