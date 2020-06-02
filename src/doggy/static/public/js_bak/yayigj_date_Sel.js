//---------------------------------------------
//选择日期	 zlb 2016-11-14
//---------------------------------------------
$.fn.yayigj_date_Sel = function(options) {
	var my_params={
		event:"click",
		width:"280px",
		height:"240px",
		bdColor:'#00C3B5',
		disableColor:'#D1D1D1', 
		enabledColor:'#A3A3A3',
		callBackFunc:null,
		varType:'text'  //text|val
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
		curSelDate=myYear+'-'+myMonth+'-'+curDate,
		curYM=curYear+'年'+parseInt(curMonth+1)+'月',
		cssQz="yayigj_plus_date_sel",
		jqID=myid+"_plus_dateSel",
		oldbdColor=that.css("border-color"),
		oldbgColor=that.css("background-color");	

	 var getWeek=function(date){
			 var nD=new Date(date);
			 return nD.getDay()>0?nD.getDay():7;
	 };	 
    var GetDateStr=function(date,AddDayCount){		
		var dd = new Date(date); 	
		dd.setDate(dd.getDate()+AddDayCount);		
		return dd; 
	};
	var getMonthLast=function(y,m){
		 var date=new Date(y+'/'+parseInt(m+1)+'/01'),
		 currentMonth=date.getMonth(),
		 nextMonth=++currentMonth,
		 nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
		 return new Date(nextMonthFirstDay);
	};
	var GenDates=function(){	
		var FirstDate=curYear+'/'+parseInt(curMonth+1)+'/01',
			  f_date_obj=new Date(FirstDate),
			  e_date_obj=getMonthLast(curYear,curMonth),
			  curWeek=getWeek(FirstDate),
			  row=0,col=0,
			  t_obj=$("#"+that.attr('data-plusid')+" .date_cn"),
			  t_obj_body=t_obj.children("tbody");
		var  startDay=GetDateStr(FirstDate,-curWeek+1),
			   curDay=startDay;

		for(row=0;row<6;row++){				
			for(col=0;col<7;col++){	
				if(curDay<f_date_obj || curDay>=e_date_obj){								
					t_obj_body.children("tr:eq("+row+")").find("td:eq("+col+")").html("<em>"+curDay.getDate()+"</em>");
				}else{
					if(curDay.getDate()==today.getDate()){		
						t_obj_body.children("tr:eq("+row+")").find("td:eq("+col+")").html("<i class='plus_td_is_today'>"+curDay.getDate()+"</i>");
					}else{
						t_obj_body.children("tr:eq("+row+")").find("td:eq("+col+")").html("<i>"+curDay.getDate()+"</i>");
					}
				}			
				curDay.setDate(curDay.getDate()+1);
			}
		}				
	};
 	
	var setCurYM=function(y,m){
		if(typeof(y)=='undefined'){
			y=curYear;
		}
		if(typeof(m)=='undefined'){
			m=curMonth;
		}
		return curYM='<b class="i_year">'+y+'年</b><b class="i_month">'+parseInt(m+1)+'月</b>'; 
	}
	var pre_month=function(obj){
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
		GenDates();
	};	
	var next_month=function(obj){
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
		GenDates();
	};		
	 var createUI=function(){
		that.attr('data-plusid',jqID);
		var datePanel=$("<div class='"+cssQz+"_css' id='"+jqID+"'></div>"),
		 	   top_over_line=$("<div class='top_over_line'></div>"),
		monthPanel=$('<div class="monthPanel"><table border="0" cellpadding="0" cellspacing="0" width="100%">'+
									'<tr><td> 1月</td><td>2月</td><td>3月</td><td>4月</td></tr>'+
									'<tr><td> 5月</td><td>6月</td><td>7月</td><td>8月</td></tr>'+
									'<tr><td> 9月</td><td>10月</td><td>11月</td><td>12月</td></tr>'+									
									'</table></div>');
		dateTitle=$("<div class='title'>"+
		       			"<span class='pre dir'>&lt;</span>"+
		       			"<span class='title_txt'>"+setCurYM()+"</span>"+
		       			"<span class='next dir'>&gt;</span>"+
		       			"<span class='to_day'>今</span>"+
		       		"</div>");
	   	dateContent='<table border="0" cellpadding="0" cellspacing="0" width="100%" height="210" class="date_cn">'+
					'<thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead>'+
					'<tbody>'+
					'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
					'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
					'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
					'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
					'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
					'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+								
					'</tbody>'+
				'</table>';
		 datePanel.append(top_over_line);  						
		 datePanel.append(dateTitle);  
		 datePanel.append(dateContent);  
		 $("body").append(datePanel);
		 dateTitle.on("click",".pre",function(){
			 pre_month($(this));
			 });
		 dateTitle.on("click",".next",function(){
			 next_month($(this));
			 });	
		dateTitle.on("click",".i_year",function(){
			//
		});
		dateTitle.on("click",".i_month",function(){
			//
		});
		dateTitle.on("click",".to_day",function(){
			var this_today=new Date();
			curYear=this_today.getFullYear();
			curMonth=this_today.getMonth();
			that.attr('data-cy',curYear);
			that.attr('data-cm',curMonth);
			GenDates();
			//curYM=curYear+'年'+parseInt(curMonth+1)+'月';	
			$(this).siblings('.title_txt').html(setCurYM(curYear,curMonth));
			switch(ops.varType){
					case 'text':
						that.html(curYear+'-'+parseInt(curMonth+1)+'-'+curDate);	
						break;
					case 'val':
						that.val(curYear+'-'+parseInt(curMonth+1)+'-'+curDate);
						break;		
				}
			ops.callBackFunc(curYear+'-'+curMonth+'-'+curDate);		
			 });		  
	 };	 
	 var createCss=function(){
		if(document.getElementById(cssQz)){								
		} else {											
			var cssStr='',newLeft=that.offset().left,
			      newTop=that.offset().top+that.height()+0;
			cssStr+='.'+cssQz+'_css{width:'+ops.width+';height:'+ops.height+';top:'+newTop+'px;left:'+newLeft+
						'px;position:absolute;display:none;font-family:微软雅黑;-webkit-user-select:none;border:solid 1px '+ops.bdColor+';background-color:#fff}';
			cssStr+='.'+cssQz+'_css .title{height:30px; width:100%;line-height:30px;position:relative;text-align:center; background-color:#FFF}';	
			cssStr+='.'+cssQz+'_css .title .dir{color:#A5A5A5; cursor:pointer;position:absolute;transform: scale(1,1.2);font-size:18px}';
			cssStr+='.'+cssQz+'_css .title .dir:hover{color:#000}';
			cssStr+='.'+cssQz+'_css .title .dir:active{margin-top:1px; }';
			cssStr+='.'+cssQz+'_css .title .pre{left:10px;top:0px;}';
			cssStr+='.'+cssQz+'_css .title .next{right:10px;top:0px;}';
			cssStr+='.'+cssQz+'_css .title .pre:hover{left:10px;top:0px; backgroud-color:#eee; border-radius:50%}';
			cssStr+='.'+cssQz+'_css .title .next:hover{right:10px;top:0px; backgroud-color:#eee; border-radius:50%}';
			cssStr+='.'+cssQz+'_css .title span b{cursor:pointer;font-weight:normal}';
			cssStr+='.'+cssQz+'_css .title span b:hover{color:#000}';
			cssStr+='.'+cssQz+'_css .title .title_txt{color:#666}';		
			cssStr+='.'+cssQz+'_css .title .title_txt{color:#A5A5A5; font-size:15px;}';
			cssStr+='.'+cssQz+'_css .title .to_day{color:#666;position:absolute;right:60px;width:20px;height:20;line-height:20px;text-align:center; font-size:12px; top:5px;cursor:pointer}';
			cssStr+='.'+cssQz+'_css .title .to_day:hover{background-color:#eee;border-radius:50%}';
			cssStr+='.'+cssQz+'_css .title .to_day:active{background-color:#ddd;}';
			cssStr+='.'+cssQz+'_css .date_cn{border-collapse:collapse; margin-left:1px }';
			cssStr+='.'+cssQz+'_css .date_cn thead th{font-size:12px;color:#A5A5A5; font-weight:normal}';
			cssStr+='.'+cssQz+'_css .date_cn tbody td{text-align:center;vertical-align: middle; }';
			cssStr+='.'+cssQz+'_css .date_cn tbody td em{color:#D0D0D0;font-style:normal}';
			cssStr+='.'+cssQz+'_css .date_cn tbody td i{color:#7B7B7B;font-style:normal;width:90%;height:100%;float:left; line-height:29px;border:solid 1px #fff; cursor:pointer;}';
			cssStr+='.'+cssQz+'_css .date_cn tbody td i:hover{background-color:#EEF9F3;color:#00C1AD;font-style:normal;border:solid 1px #00C1AD}'; 
			cssStr+='.'+cssQz+'_css .date_cn tbody td i:active{background-color:#C4EAD5;}';
			cssStr+='.'+cssQz+'_css .top_over_line{width:'+that.width()+'px;height:3px;background-color:#fff;position:absolute;top:-2px;left:0px;z-index:3;font-size:1px}';
			cssStr+='.plus_td_is_today{color:#00C1AD !important}';
			cssStr+='.plus_td_is_down{background-color:#EEF9F3;border:solid 1px #00C1AD !important;}';			
		 	var nod=$("<style type='text/css' id='"+cssQz+"'>"+cssStr+"</style>");
			$("head").append(nod);
		 }
	 };

	 var init=function(){
		 	that.attr('data-cy',curYear);
			that.attr('data-cm',curMonth);
 			GenDates();				
			var pos=that.offset();			
			that.on(ops.event,function(){
				id=that.attr("id")+"_seled_plus_dateSel";				
				that.css({"border-color":ops.bdColor,"background-color":"#fff"});				
				$("#"+id).css({
					"left":pos.left,
					"top":pos.top+that.height()
					}).show();	
				});	

			$(document).on("click","#"+that.attr('data-plusid')+" tbody td i",function(){
					$(".plus_td_is_down").removeClass('plus_td_is_down');
					$(this).addClass('plus_td_is_down');		
					$("#"+that.attr('data-plusid')).hide();
					that.css({"border-color":oldbdColor,"background-color":oldbgColor});		
					ops.callBackFunc(curYear+'-'+curMonth+'-'+$(this).text());		
					switch(ops.varType){
						case 'text':
							that.html(curYear+'-'+parseInt(curMonth+1)+'-'+$(this).text());	
							break;
						case 'val':
							that.val(curYear+'-'+parseInt(curMonth+1)+'-'+$(this).text());
							break;		
					}
				});
				
				$("#"+that.attr('data-plusid')).mouseleave(function(){
					$(this).hide();
					that.css({"border-color":oldbdColor,"background-color":oldbgColor});				
				});				
		
		 };
	 return $(this).each(function() {
           createCss();
		   createUI();   
		   init(); 
    });	 
};