//---------------------------------------------
// 选择日期(移动端)	 曾令兵 2016-11-14
//---------------------------------------------
$.fn.yayigj_date_Sel_mb = function(options) {
	var my_params={
		event:"click",
		width:"100%",
		height:"420px",
		bdColor:'#00C3B5',
		disableColor:'#D1D1D1', 
		enabledColor:'#A3A3A3',
		callBackFunc:null,
		ico:"/static/public/img/selecticon.png",
		icoActive:"/static/public/img/selecticon_active.png",
		varType:'text',  //text|val
		_borderColor:'#e0e0e0',	
		_activeColor:'#47a6a0', //00AEA2
		_hoverColor:'#47a6a0', //00CAB6
		_clkBgColor:'#00C3B5',
		_hoverBgColor:'#F2FFFE',
		_isShowDefault:null
	};
	var 	ops=$.extend(true,{},my_params, options),
		that=$(this),
		id=that.attr("id"),
		myid=id+"_seled",
		today=new Date(),
		myYear=(new Date()).getFullYear(),
		myMonth=(new Date()).getMonth(),
		curMonth=myMonth,
		curYear=myYear,
		curDate=today.getDate(),
		curSelDate=myYear+'/'+myMonth+'/'+curDate,
		curYM=curYear+'年'+parseInt(curMonth+1)+'月',
		cssQz="yayigj_plus_date_sel",
		jqID=myid+"_plus_dateSel",
		oldbdColor=that.css("border-color"),
		oldbgColor=that.css("background-color"),
		cnMonth=new Array('一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月');	
	//--------------------------	
	// return week?
	//--------------------------
	var getWeek=function(date){
		var nD=new Date(date);
		return nD.getDay()>0?nD.getDay():7;
	};	 
	//--------------------------	
	//  
	//------------------------- 
	 var isExistsCss=function(cssName){
		var js= /js$/i.test(name);
		var es=document.getElementsByTagName(js?'script':'link');
		for(var i=0;i<es.length;i++) 
		if(es[i][js?'src':'href'].indexOf(name)!=-1)return true;
		return false;	
	}
	//--------------------------	
	//  return calc date
	//-------------------------- 
    var GetDateStr=function(date,AddDayCount){		
		var dd = new Date(date); 	
		dd.setDate(dd.getDate()+AddDayCount);		
		return dd; 
	};	
	//--------------------------	
	//  format date
	//-------------------------- 
    var formatDate=function(date){			   
		return date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate(); 
	};	
	//--------------------------	
	// get month last date
	//--------------------------	
	var getMonthLast=function(y,m){
		var date=new Date(y+'/'+parseInt(m+1)+'/01'),
		currentMonth=date.getMonth(),
		nextMonth=++currentMonth,
		nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
		return new Date(nextMonthFirstDay);
	};	
	//--------------------------	
	// disable scorll
	//--------------------------	
	var disScroll=function(evt,obj){ 		
		var scrollTop = obj.scrollTop,scrollHeight = obj.scrollHeight,height = obj.clientHeight;
		var delta = (evt.originalEvent.wheelDelta) ? evt.originalEvent.wheelDelta : -(evt.originalEvent.detail || 0);  
		if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
			obj.scrollTop = delta > 0? 0: scrollHeight;
			evt.preventDefault();
		}   
	}
	//--------------------------	
	// 创建背景层
	//--------------------------	
	 var createBGdiv=function(){
			var bgDiv=$("<div id='"+jqID+"_bg_div' style='width:"+$(document).width()+"px;height: "+$(document).height()+"px;z-index:9999999;position:fixed;left:0px;top:0px; opacity:0.2; background-color:#000'></div>");
			$("#"+jqID+"_bg_div").remove();
			$("body").append(bgDiv);
	 }
	//--------------------------	
	// 生成日期内容 依赖当前年月值
	//--------------------------
	var GenDates=function(){			
		curYear=parseInt(that.attr('data-cy'));
		curMonth=parseInt(that.attr('data-cm'));
		var FirstDate=curYear+'/'+parseInt(curMonth+1)+'/01',
		f_date_obj=new Date(FirstDate),
		e_date_obj=getMonthLast(curYear,curMonth),
		curWeek=getWeek(FirstDate),
		t_obj=$("#"+that.attr('data-plusid')+" .date_cn"),
		t_obj_body=t_obj.children("tbody"),	  
		startDay=GetDateStr(FirstDate,-curWeek+1),
		posDate=new Date(that.text().replace('-','/')),
		curDay=startDay;	
		t_obj_body.find("td").each(function(k,v){			
			if(curDay<f_date_obj || curDay>=e_date_obj){		
				$(v).html("<em>"+curDay.getDate()+"</em>");
			}else{
				if(formatDate(curDay)==formatDate(today)){	
					$(v).html("<i class='plus_td_is_today'>"+curDay.getDate()+"</i>");
				}else{
					if(formatDate(posDate)==formatDate(curDay)){					
						$(v).html("<i class='plus_td_is_down'>"+curDay.getDate()+"</i>");							
					}else{
						$(v).html("<i>"+curDay.getDate()+"</i>");
					}				 	
				}
			}
			curDay.setDate(curDay.getDate()+1);
		});	
	};
 	//--------------------------	
	// set curYm
	//--------------------------
	var setCurYM=function(y,m){
		if(typeof(y)=='undefined'){
			y=curYear;
		}
		if(typeof(m)=='undefined'){
			m=curMonth;
		}
		return curYM='<b class="i_year">'+y+'年</b><b class="i_month">'+parseInt(m+1)+'月</b>'; 
	}	
	//--------------------------	
	// slide div date
	//--------------------------
	function cloneDatePanel(){
		$("#"+jqID+"_date_clone").remove();		
		var cloneDate=$("#"+jqID+" .date_cn").clone(false).attr("id",jqID+"_date_clone");	
		$("#"+jqID+" .mainArea") .append(cloneDate);
	}	
	//--------------------------	
	// slide div month
	//--------------------------
	function cloneMonthPanel(){
		$("#"+jqID+"_month_clone").remove();
		var cloneMonth=$("#"+jqID+" .monthPanel").clone(false).attr("id",jqID+"_month_clone").attr("class","ymPanel");			
		$("#"+jqID+" .mainArea") .append(cloneMonth);
	}	
	//--------------------------	
	// slide div year
	//--------------------------
	function cloneYearPanel(){
		$("#"+jqID+"_yearPanel_clone").remove();
		var cloneYear=$("#"+jqID+" .yearPanel").clone(false).attr("id",jqID+"_yearPanel_clone").attr("class","ymPanel");				
		$("#"+jqID+" .mainArea") .append(cloneYear);
	}
	//--------------------------	
	// pre
	//--------------------------
	var pre_month=function(obj){		
		var setTitleVal=function(){
			that.attr('data-cy',tmpYear);
			$("#"+jqID+" .i_year").text(tmpYear+'年');		
		};
		var setMontSel=function(){
			if(parseInt(that.attr('data-cy'))==myYear){
				var findTxt=cnMonth[myMonth];
				$("#"+jqID+" .monthPanel td:contains('"+findTxt+"')").addClass('ymSeled');				
			}	
		};
		switch(that.attr('data-focusType')){
			case 'y':				
				var tmpYear=parseInt(that.attr('data-cy'));
					  tmpYear-=10;	
				var yearObj=getYearsData(tmpYear);		
				setTitleVal();
				cloneYearPanel();
				$("#"+jqID+" .yearPanel").empty().html(yearObj.html());				
				$("#"+jqID+"_yearPanel_clone").css("left","0px").show().stop().animate({"left":"280px"},200,function(){
					$("#"+jqID+"_yearPanel_clone").remove();
					console.log('y-this=',$(this));
					});
				$("#"+jqID+" .yearPanel").css("left","-280px").show().stop().animate({left:0},200);
				break;
			case 'm':
				var tmpYear=parseInt(that.attr('data-cy'));
					  tmpYear-=1;	
				setTitleVal();  
				cloneMonthPanel();	
				$("#"+jqID+" .monthPanel .ymSeled").removeClass('ymSeled');	
				setMontSel();
				$("#"+jqID+"_month_clone").css("left","0px").show().stop().animate({"left":"280px"},200,function(){
					$("#"+jqID+"_month_clone").remove();
					console.log('m-this=',$(this));
					});
				$("#"+jqID+" .monthPanel").css("left","-280px").stop().animate({left:0},200);
				break;
			case 'd':
				curYear=that.attr('data-cy');
				curMonth=that.attr('data-cm');
				--curMonth;
				if(curMonth<0){
					--curYear;
					curMonth=11;	
				}
				obj.next(".title_txt").html(setCurYM(curYear,curMonth));
				that.attr('data-cy',curYear);
				that.attr('data-cm',curMonth);
				cloneDatePanel();					
				GenDates();		
				$("#"+jqID+" .date_cn .pos").removeClass('pos');
				$("#"+jqID+" .date_cn").css({"left":"-280px"}).show().stop().animate({left:0},200);
				$("#"+jqID+"_date_clone").css("left","0px").show().stop().animate({"left":"280px"},200,function(){	
					//console.log($("#"+jqID+"_month_clone"));
					$(this).remove();
					$("#"+jqID+"_month_clone").remove();
					});	
				break;
		}		
	};	
	//--------------------------	
	// next
	//--------------------------
	var next_month=function(obj){	
		var setTitleVal=function(){
			that.attr('data-cy',tmpYear);
			$("#"+jqID+" .i_year").text(tmpYear+'年');		
		};
		var setMontSel=function(){
			if(parseInt(that.attr('data-cy'))==myYear){
				var findTxt=cnMonth[myMonth];
				$("#"+jqID+" .monthPanel td:contains('"+findTxt+"')").addClass('ymSeled');				
			}	
		};
		switch(that.attr('data-focusType')){
			case 'y':				
				var tmpYear=parseInt(that.attr('data-cy'));
				tmpYear+=10;	
				var yearObj=getYearsData(tmpYear);	
				setTitleVal();		
				cloneYearPanel();
				$("#"+jqID+" .yearPanel").empty().html(yearObj.html());	
				$("#"+jqID+"_yearPanel_clone").css("left","0px").show().stop().animate({"left":"-280px"},200,function(){$(this).remove();});
				$("#"+jqID+" .yearPanel").css("left","280px").show().stop().animate({left:0},200);
				break;
			case 'm':
				var tmpYear=parseInt(that.attr('data-cy'));
				tmpYear+=1;	
				setTitleVal();
				cloneMonthPanel();				
				$("#"+jqID+" .monthPanel .ymSeled").removeClass('ymSeled');		
				setMontSel();
				$("#"+jqID+"_month_clone").css("left","0px").show().stop().animate({"left":"-280px"},200,function(){$(this).remove();});
				$("#"+jqID+" .monthPanel").css("left","280px").show().stop().animate({left:0},200);
				break;
			case 'd':
				curYear=that.attr('data-cy');
				curMonth=that.attr('data-cm');
				++curMonth;
				if(curMonth>=12){
					++curYear;
					curMonth=0;	
				}
				obj.prev(".title_txt").html(setCurYM(curYear,curMonth));
				that.attr('data-cy',curYear);
				that.attr('data-cm',curMonth);
				cloneDatePanel();				
				GenDates();
				$("#"+jqID+" .date_cn .pos").removeClass('pos');
				$("#"+jqID+" .date_cn").css({"left":"280px"}).show().stop().animate({left:0},200);
				$("#"+jqID+"_date_clone").css("left","0px").stop().animate({"left":"-280px"},200,function(){$(this).remove();});				
				break;
		}		
	};	
	//--------------------------	
	//date panel
	//--------------------------
	var getDatePanel=function(){
		var	dateContent='<table border="0" cellpadding="0" cellspacing="0" width="100%" height="260" class="date_cn">'+
		'<thead class="week_head"><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead>'+
		'<tbody>'+
		'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
		'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
		'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
		'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
		'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
		'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+								
		'</tbody>'+
		'</table>';
		return 	 dateContent;
	}
	//--------------------------
	//month content
	//--------------------------
	var getMonthData=function(curMonth){
		var monthPanel=$('<div class="monthPanel ymPanel"><table border="0" cellpadding="0" cellspacing="0" width="100%"  height="100%">'+
		'<tr><td>一月</td><td>二月</td><td>三月</td><td>四月</td></tr><tr><td>五月</td><td>六月</td><td>七月</td><td>八月</td></tr>'+
		'<tr><td>九月</td><td>十月</td><td>十一月</td><td>十二月</td></tr></table></div>');
		monthPanel.find("td").eq(curMonth).addClass('ymSeled');
		monthPanel.on("click","td",function(){			
			$("#"+jqID+" .monthPanel").hide();
			curMonth=$.inArray($(this).text(),cnMonth);
			that.attr('data-cm',curMonth);
			GenDates();
			$("#"+jqID+" .i_month").text((curMonth+1)+'月');			
			$("#"+jqID+" .date_cn").css("top","50px").show().stop().animate({top:1},200);			
			});
		return 	monthPanel;
	};
	//--------------------------
	//dynamic year array
	//--------------------------
	var getYearsData=function(curYear){		
		var yearPanel=$('<div class="yearPanel ymPanel"><table border="0" cellpadding="0" cellspacing="0" width="100%" height="100%">'+
		'<tr><td  class="cEEE"></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td></tr>'+
		'<tr><td></td><td></td><td></td><td  class="cEEE"></td></tr></table></div>'),yearArrs=[];	
		yearPanel.on("click","td",function(){			
			$("#"+jqID+" .yearPanel").hide();
			curYear=parseInt($(this).text());
			that.attr('data-cy',curYear);
			GenDates();
			$("#"+jqID+" .i_year").text(curYear+'年');			
			$("#"+jqID+" .date_cn").css("top","50px").show().stop().animate({top:1},200);
			});
		(function(curYear){				
			 var tmpYear=curYear.toString()[3],endNum=parseInt(tmpYear),oldYear=curYear,oldLen=0;			 
			 while(endNum>-2){
				yearArrs.push(curYear--)
				--endNum;
			 }
			 yearArrs.reverse();
			 oldLen=yearArrs.length;
			 for(var i=0;i<12-oldLen;i++){
				yearArrs.push(++oldYear);
			 }
		})(curYear);				
		yearPanel.find("td").each(function(k,v){
			yearArrs[k]==myYear?$(v).addClass('ymSeled'):'';
			$(v).text(yearArrs[k]);
			});		
		return 	yearPanel;					  
	};		
	 //-------------------------------------------		
	 // ui 
	 //-------------------------------------------
	 var createUI=function(){
		that.attr('data-plusid',jqID);		
		that.css("border-color","#fff");				
		var datePanel=$("<div class='"+cssQz+"_css' id='"+jqID+"'></div>"),
		top_over_line=$("<div class='top_over_line'></div>"),	
		main_area=$("<div class='mainArea'></div>");			
		dateContent=getDatePanel(),			
		yearPanel=	getYearsData(myYear),		
		monthPanel=getMonthData(myMonth),								
		dateTitle=$("<div class='title'><span class='pre dir'></span><span class='title_txt'>"+setCurYM()+"</span><span class='next dir'></span><span class='to_day'>今</span></div>");				
		datePanel.append(dateTitle);  			
		main_area.append(dateContent);			
		main_area.append(monthPanel);			
		main_area.append(yearPanel);						
		datePanel.append(main_area);  		  
		$("body").append(datePanel);		
		
		$(document).on("DOMMouseScroll mousewheel","#"+jqID,function(event){disScroll(event,this);});	
		that.on("DOMMouseScroll mousewheel",function(event){disScroll(event,this);});	
		
		$("#"+jqID+" .date_cn").on("click","td",function(e){	
			that.attr('data-focusType','d');
			if(e.target.tagName=='EM' || e.target.tagName=='TD'){						
				return false;
			}					
			$("#"+jqID+" .date_cn  .pos").removeClass('pos');
			$("#"+jqID+" .date_cn  .plus_td_is_down").removeClass('plus_td_is_down');
			$(this).find("i").addClass('pos');		
			$("#"+that.attr('data-plusid')).hide();	
			$("#"+jqID+"_bg_div").remove();
			$("html").css("overflow","auto");
			var cNewDate=parseInt($(this).text())<10?'0'+$(this).text():$(this).text();
			var cNewMonth=(curMonth+1)<10?'0'+(curMonth+1):curMonth+1;
			var showVal=curYear+'-'+cNewMonth+'-'+cNewDate;
			
			if(ops.callBackFunc!=null){
				ops.callBackFunc(showVal,that.attr('id'));	
			}				
			
			switch(ops.varType){
				case 'text':
					that.html(showVal);	
					break;
				case 'val':						
					that.val(showVal);
					break;		
			}		 
		});				 
		dateTitle.on("click",".pre",function(){
		 	pre_month($(this));
		 });
		dateTitle.on("click",".next",function(){
		 	next_month($(this));
		 });		 
		dateTitle.on("click",".i_year",function(){
			var 	cYear=$(this).text().replace("年",''),
					yearObj=getYearsData(cYear);
			$("#"+jqID+" .yearPanel").empty().html(yearObj.html());	
			$("#"+jqID+" .monthPanel").hide();		
			$("#"+jqID+" .date_cn").hide();
			yearPanel=$("#"+jqID+" .yearPanel").css("top","-50px").show().stop().animate({top:1},200);	
			that.attr('data-focusType','y');
		});		
		dateTitle.on("click",".i_month",function(){
			var cMonth=$(this).text().replace("月",'');
			$("#"+jqID+" .yearPanel").hide();
			$("#"+jqID+" .date_cn").hide();
			$("#"+jqID+" .monthPanel").css("top","-50px").show().stop().animate({top:1},200);
			that.attr('data-focusType','m');
		});	
		dateTitle.on("click",".to_day",function(){  
			that.attr('data-focusType','d');
			var this_today=new Date();
			cur_Year=this_today.getFullYear();
			cur_Month=this_today.getMonth();
			that.attr('data-cy',cur_Year);
			that.attr('data-cm',cur_Month);
			GenDates();
			$("#"+jqID+" .yearPanel").hide(50);
			$("#"+jqID+" .monthPanel").hide(50);
			$("#"+jqID+" .date_cn").css("top","-50px").show().stop().animate({top:1},200);
			$(this).siblings('.title_txt').html(setCurYM(cur_Year,cur_Month));	
			$("#"+jqID+" .plus_td_is_down")	.removeClass('plus_td_is_down');	
			$("#"+jqID+" .plus_td_is_today")	.addClass('plus_td_is_down');				
			var curDate=new Date().getDate(); 
			curDate=parseInt(curDate)<10?'0'+curDate:curDate;		
			var cNewMonth=(cur_Month+1)<10?'0'+(cur_Month+1):cur_Month+1;
			var showVal=curYear+'-'+cNewMonth+'-'+curDate;			
			switch(ops.varType){
				case 'text':
					that.html(showVal);	
					break;
				case 'val':
					that.val(showVal);
					break;		
				}
				if(ops.callBackFunc!=null){
					ops.callBackFunc(cur_Year+'-'+cNewMonth+'-'+curDate,that.attr('id'));		
				}
			});		  
	 };	 
	 //-------------------------------------------		
	 // css set
	 //-------------------------------------------
	var createCss=function(){
		if(document.getElementById(cssQz)){								
		} else {		
			var cssStr='',newLeft=that.offset().left,newWidth=that.innerWidth(),newTop=that.offset().top; 
			cssStr+='.'+cssQz+'_css{width:'+ops.width+';height:'+ops.height+';top:0px;left:'+newLeft+
			'px;position:fixed;display:none;font-family:微软雅黑;-webkit-user-select:none;border:solid 0px '+ops._activeColor+';background-color:#fff; z-index:10000000}';
			cssStr+='.'+cssQz+'_css .title{height:40px; width:100%;line-height:40px;position:relative;text-align:center; background-color:#FFF;-webkit-tap-highlight-color:rbg(0,0,0)}';	
			cssStr+='.'+cssQz+'_css .title .dir{color:#A5A5A5; cursor:pointer;position:absolute;font-size:18px;width:30px;height:30px;top:7px;}';
			cssStr+='.'+cssQz+'_css .title .dir:hover{color:#000}.'+cssQz+'_css .i_month{width: 33px;text-align: right;}';
			cssStr+='.'+cssQz+'_css .title .dir:active{margin-top:1px; }.'+cssQz+'_css .cEEE{color:#bbb}';
			cssStr+='.'+cssQz+'_css .title .pre{left:10px; background: url(/static/public/img/icons.png) no-repeat 7px -521px;}';
			cssStr+='.'+cssQz+'_css .title .pre:hover{left:10px;background: url(/static/public/img/icons.png) no-repeat -20px -521px;}';
			cssStr+='.'+cssQz+'_css .title .next{right:10px;background: url(/static/public/img/icons.png) no-repeat 7px -547px;}';			
			cssStr+='.'+cssQz+'_css .title .next:hover{right:10px;background: url(/static/public/img/icons.png) no-repeat -20px -547px;}';
			cssStr+='.'+cssQz+'_css .title span b{cursor:pointer;font-weight:normal}';
			cssStr+='.'+cssQz+'_css .title span b:hover{color:#00c5b5}.'+cssQz+'_css .mainArea{background-color:#fff;width:100%; height:390px;overflow:hidden;position: relative;}';
			cssStr+='.'+cssQz+'_css .title .title_txt{color:#666}.'+cssQz+'_css .title .title_txt{color:#A5A5A5; font-size:120%;}';	
			cssStr+='.'+cssQz+'_css .title .to_day{color:#666;position:absolute;right:60px;width:40px;height:40px;line-height:40px;text-align:center; font-size:100%; top:2px;cursor:pointer}';
			cssStr+='.'+cssQz+'_css .title .to_day:hover{background-color:#00c5b5;border-radius:50%;color:#fff}.'+cssQz+'_css .title .to_day:active{background-color:#00bcaa;}';
			cssStr+='.'+cssQz+'_css .date_cn{border-collapse:collapse; margin-left:1px; position:absolute;left:0px; height:390px}';
			cssStr+='.'+cssQz+'_css .ymPanel{border-collapse:collapse; margin-left:2px; position:absolute;left:0px;width:98.5%;text-align:center; height:209px;box-sizing:border-box;display:none; background-color:#fff; font-size:100%}';
			cssStr+='.'+cssQz+'_css .ymPanel td{width:25%; height:33.33%}.'+cssQz+'_css .ymPanel td:hover{outline:solid 1px #00c5b5;color:#00c5b5;background-color:#EEF9F3;cursor:pointer}';
			cssStr+='.'+cssQz+'_css .ymSeled{background-color:#DEF8F6;border:solid 1px #00c5b5; color:#00c5b5}';
			cssStr+='.'+cssQz+'_css .date_cn thead th{font-size:0.35rem;color:#A5A5A5; font-weight:normal;height:32px;border-top:solid 1px #F2F2F2;border-bottom:solid 1px #F2F2F2}';
			cssStr+='.'+cssQz+'_css .date_cn tbody td{text-align:center;vertical-align: middle; width:14.2%;height:15%}';
			cssStr+='.'+cssQz+'_css .date_cn tbody td em{color:#D0D0D0;font-style:normal;font-size:0.4rem}';
			cssStr+='.'+cssQz+'_css .date_cn tbody td i{color:#7B7B7B;font-style:normal;width:90%;height:28px;float:left; line-height:28px;border:solid 1px #fff; cursor:pointer;font-size:0.4rem}';
			cssStr+='.'+cssQz+'_css .date_cn tbody td i:hover{background-color:#fff;color:#00C1AD;font-style:normal;border:solid 1px #00C1AD}'; 
			cssStr+='.'+cssQz+'_css .date_cn tbody td i:active{background-color:'+ops._hoverColor+';color:#fff}';
			cssStr+='.'+cssQz+'_css .top_over_line{width:'+newWidth+'px;height:3px;background-color:#fff;position:absolute;top:-2px;left:0px;z-index:3;font-size:1px}';
			cssStr+='.plus_td_is_today{color:#eeac18 !important; background-color:#FBF4DF; border-radius:3px;border:solid 1px #FBF4DF}';
			cssStr+='.plus_td_is_down,.'+cssQz+'_css .pos{background-color:'+ops._clkBgColor+';border:solid 1px '+ops._clkBgColor+' !important;color:#fff  !important;border-radius:3px}';	
			cssStr+='.plus_td_is_down:hover,.'+cssQz+'_css .pos:hover{background-color:'+ops._clkBgColor+'  !important;}';
		 	var nod=$("<style type='text/css' id='"+cssQz+"'>"+cssStr+"</style>");
			$("head").append(nod);
		}
	};
	var  getSkinColor=function(){
		var thatApplyCss=isExistsCss('r_input');			
		if(thatApplyCss){
			var linkHref=document.styleSheets,cssFileObj=null,icount=linkHref.length;										
			for(var i=0;i<icount;i++){
				try{
					if(linkHref[i].href.indexOf('r_input.css')>-1){
						var cssFileObj=[];
						cssFileObj.push(linkHref[i].cssRules[0].cssText.split('{')[1].split(';').sort());	
						cssFileObj.push(linkHref[i].cssRules[1].cssText.split('{')[1].split(';').sort());	
						cssFileObj.push(linkHref[i].cssRules[2].cssText.split('{')[1].split(';').sort());	
						cssFileObj.push(linkHref[i].cssRules[15].cssText.split('{')[1].split(';'));	
						ops._borderColor=cssFileObj[0][0].replace('border-color: ','');
						ops._hoverColor=	cssFileObj[1][0].replace('border-color: ','');
						ops._activeColor=	cssFileObj[2][0].replace('border-color: ','');
						opts._hoverBgColor=cssFileObj[3][0].replace('background-color: ','');
						cssFileObj.push(linkHref[i].cssRules[11].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
						ops._clkBgColor=cssFileObj[3][1].split(':')[1];			
						break;
					}
				}catch(e){}
			}
		}			
	};
	
	var init=function(){
		that.attr('data-cy',curYear);
		that.attr('data-cm',curMonth);
		that.attr('data-focusType','d');
		if(ops._isShowDefault!=null){
			if(ops.varType=='text'){
				that.text(new Date().toLocaleString().split(' ')[0].replace(/\//g,'-'));
			}else{
				that.val(new Date().toLocaleString().split(' ')[0].replace(/\//g,'-'));
			}
		}
		GenDates();				
		var pos=that.offset(),docHeight=$(document).height();		
		that.on(ops.event,function(){	
			$("html").css("overflow","hidden");
			pos=that.offset(),docHeight=$(document).height();
			if(that.attr('data-focustype')=='d'){
				$("#"+jqID+" .pos").removeClass('pos');
				if(ops.varType=='text'){
					var _d=new Date($(that).text().replace('-','/')).getDate();
				}else{
					var _d=new Date($(that).val().replace('-','/')).getDate();
				}
				$("#"+jqID+" .date_cn i").filter(function(index) { 
					return $(this).text()==_d; 
				}).addClass('pos');
			}				
			$('.'+cssQz+'_css').hide();		
			docHeight=$(document).height()-50;	
			var id=that.attr("id")+"_seled_plus_dateSel";
			$("#"+id).css({
				"left":"0px",
				"top":"0px"
			}).show();	
			createBGdiv();
		});	
		
	};
	//-------------------------------------------		
	// 结尾操作
	//-------------------------------------------	 
	 return $(this).each(function() {
		getSkinColor();
		createCss();
		createUI();   
		init(); 
	});	 
};