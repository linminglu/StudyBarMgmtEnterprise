//---------------------------------------------
// 选择日期	 曾令兵 2016-11-14
//---------------------------------------------
$.fn.yayigj_datetime = function(options) {
	var my_params={
		event:"click",
		width:"280px",
		height:"250px",
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
		_defaulttime:new Date().getHours()+':'+new Date().getMinutes()+':'+new Date().getSeconds(),
		_disbGtToday:null,  //禁用大于今天
		_disbLtToday:null,  //禁用小于今天
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
		jqID=myid+"_plus_datetime",
		oldbdColor=that.css("border-color"),
		oldbgColor=that.css("background-color"),
		cnMonth=new Array('一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'),
		isSelectMorS='m',tdClkDateTmVal='',
		close_panel_tm=null;
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
    var formatDate=function(date,mset){
		var _m=date.getMonth(),_d=date.getDate();
		_m=_m<10?'0'+_m:_m;
		_d=_d<10?'0'+_d:_d;
		if(typeof(mset)=='undefined'){
			return date.getFullYear()+'/'+_m+'/'+_d; 
		}else{
			_m=parseInt(_m)+1;
			if(_m>12){_m='01';}
			_m=_m<10?'0'+_m:_m;
			return date.getFullYear()+'/'+_m+'/'+_d; 
		}
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
				if(ops._disbGtToday!=null  || ops._disbLtToday!=null){
					//$(v).html("<em data-dt='"+formatDate(curDay,'a')+"'>&nbsp;</em>");
					$(v).html("<em class='null' data-dt='"+formatDate(curDay,'a')+"'>&nbsp;</em>");
				}else{
					$(v).html("<em  data-dt='"+formatDate(curDay,'a')+"'>"+curDay.getDate()+"</em>");
				}
			}else{
					if(formatDate(curDay)==formatDate(today)){	
						$(v).html("<i class='plus_td_is_today'  data-dt='"+formatDate(curDay,'a')+"'>"+curDay.getDate()+"</i>");
					}else{
						if(formatDate(posDate)==formatDate(curDay)){					
							$(v).html("<i class='plus_td_is_down'  data-dt='"+formatDate(curDay,'a')+"'>"+curDay.getDate()+"</i>");							
						}else{
							if(ops._disbGtToday!=null &&  curDay>today || ops._disbLtToday!=null &&  curDay<today){
								$(v).html("<span  data-dt='"+formatDate(curDay,'a')+"'>"+curDay.getDate()+"</span>");	
							}else{																
								$(v).html("<i  data-dt='"+formatDate(curDay,'a')+"'>"+curDay.getDate()+"</i>");
							}
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
		var	dateContent='<table border="0" cellpadding="0" cellspacing="0" width="100%" height="210" class="date_cn" style="border-bottom:solid 1px #e0e0e0">'+
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
		var datePanel=$("<div class='"+cssQz+"_css' id='"+jqID+"' style='height:285px'></div>"),
		dftimArs=ops._defaulttime.split(':'),_mintue=dftimArs[0]<10?'0'+dftimArs[0]:dftimArs[0],_seconds=dftimArs[1]<10?'0'+dftimArs[1]:dftimArs[1],
		top_over_line=$("<div class='top_over_line'></div>"),	
		main_area=$("<div class='mainArea'></div>");			
		dateContent=getDatePanel(),
		yearPanel=	getYearsData(myYear),		
		monthPanel=getMonthData(myMonth),								
		dateTitle=$("<div class='title'><span class='pre dir'></span><span class='title_txt'>"+setCurYM()+"</span><span class='next dir'></span><span class='to_day'>今</span></div>");				
		datePanelCloseBtn=$('<div class="enterbtn">确定</div>');
		datePanelCloseBtn.on("click",function(){		
			$("#"+that.attr('data-plusid')).hide();	
			if(ops.callBackFunc!=null && tdClkDateTmVal!=''){	
					ops.callBackFunc(tdClkDateTmVal,that.attr('id'));	 
				}
			});
		dateFootTime=$("<div class='date_time_css_zk'>"+
											"<span class='_timehint'>时间</span>"+
											"<span class='_timeval'><input type='text' readonly class='h before' value='"+_mintue+"'/><i>:</i><input type='text' readonly class='m before'  value='"+_seconds+"'/><i style='display:none' >:</i><input type='text' style='display:none' readonly class='s'  value='"+dftimArs[2]+"'/></span>"+
									 "</div>"); 		
		dateFootTime.find('.h').off("click").on("click",function(){
			$("#"+jqID+" #laydate_time").show();		
		});								 									   
		seledHour=$('<div class="laydate_time laydate_show" id="laydate_time">'+
								'<div class="laydte_hsmtex">小时<span onclick="$(\'#laydate_time\').hide()">×</span></div>'+
								'<div id="laydate_hmsno" class="laydate_hmsno">'+
									'<span class="sw">0</span><span class="sw">1</span><span class="sw">2</span><span class="sw">3</span><span class="sw">4</span>'+
									'<span class="sw">5</span><span class="sw">6</span><span class="sw">7</span><span>8</span><span>9</span>'+
									'<span>10</span><span>11</span><span>12</span><span>13</span><span>14</span>'+
									'<span>15</span><span>16</span><span>17</span><span>18</span><span>19</span>'+
									'<span>20</span><span  class="sw">21</span><span  class="sw">22</span><span  class="sw">23</span>'+
								'</div>'+
							  '</div>'); 
		 seledHour.find(".laydate_hmsno span").off("click").on("click",function(){
			 seledHour.hide();			
			 //var showVal=curYear+'-'+cNewMonth+'-'+cNewDate+' '+$("#"+jqID+" .date_time_css_zk ._timeval .h").val()+':'+$("#"+jqID+" .date_time_css_zk ._timeval .s").val();
			 var _val=parseInt($(this).text()),_new_val=_val;
			 if(_val<10){
				 _new_val='0'+_val;
			 }else{
				 _new_val=_val;				
			 }	
			 dateFootTime.find('.h').val(_new_val); 	
			 if(ops.varType=='text'){
				 if(that.text()!=''){
					 var tmpv= that.text().split(' '),tmptms=[];
					 if(typeof(tmpv[1])!='undefined'){
						 tmptms=tmpv[1].split(':');
						 that.text(tmpv[0]+' '+_val+':'+tmptms[1]);
					 }
				 }
			 }else{
				 if(that.val()!=''){
					 var tmpv= that.val().split(' '),tmptms=[];
					 if(typeof(tmpv[1])!='undefined'){
						 tmptms=tmpv[1].split(':');
						 that.val(tmpv[0]+' '+_val+':'+tmptms[1]);
					 }
				 }
			 }
			 });
		 seledMSecond=$('<div class="laydate_time laydate_time1 laydate_show" id="laydate_time1">'+
		 								'<div class="laydte_hsmtex"><em>分钟</em><span onclick="$(\'#laydate_time1\').hide()">×</span></div>'+
										'<div id="laydate_hmsno" class="laydate_hmsno">'+
											'<span class="cy">0</span><span>1</span><span>2</span><span>3</span><span>4</span><span class="cy">5</span><span>6</span><span>7</span><span>8</span><span>9</span>'+
											'<span class="cy">10</span><span>11</span><span>12</span><span>13</span><span>14</span><span class="cy">15</span><span>16</span><span>17</span><span>18</span><span>19</span>'+
											'<span class="cy">20</span><span>21</span><span>22</span><span>23</span><span>24</span><span class="cy">25</span><span>26</span><span>27</span><span>28</span><span>29</span>'+
											'<span class="cy">30</span><span>31</span><span>32</span><span>33</span><span>34</span><span class="cy">35</span><span>36</span><span>37</span><span>38</span><span>39</span>'+
											'<span class="cy">40</span><span>41</span><span>42</span><span>43</span><span>44</span><span class="cy">45</span><span>46</span><span>47</span><span>48</span><span>49</span>'+
											'<span class="cy">50</span><span>51</span><span>52</span><span>53</span><span>54</span><span class="cy">55</span><span>56</span><span>57</span><span>58</span><span>59</span>'+
										'</div>'+
									  '</div>');
		  seledMSecond.find(".laydate_hmsno span").off("click").on("click",function(){	
		  	   seledMSecond.hide();
			   var _val=parseInt($(this).text()),_new_val=_val;			   
			   if(_val<10){		
			   		_new_val='0'+_val;	
				}else{	
					_new_val=_val;
				}
				isSelectMorS=='m'?dateFootTime.find('.m').val(_new_val):dateFootTime.find('.s').val(_new_val);	
				 if(ops.varType=='text'){
				 if(that.text()!=''){
					 var tmpv= that.text().split(' '),tmptms=[];
					 if(typeof(tmpv[1])!='undefined'){
						 tmptms=tmpv[1].split(':');
						 that.text(tmpv[0]+' '+tmptms[0]+':'+_val);
					 }
				 }
			 }else{
				 if(that.val()!=''){
					 var tmpv= that.val().split(' '),tmptms=[];
					 if(typeof(tmpv[1])!='undefined'){
						 tmptms=tmpv[1].split(':');
						 that.val(tmpv[0]+' '+tmptms[0]+':'+_val);
					 }
				 }
			 }							 
		  });
		  dateFootTime.find('.m').off("click").on("click",function(){
			isSelectMorS='m';
			$("#"+jqID+" #laydate_time1").show();	
			seledMSecond.find('.laydte_hsmtex em').text('分钟');
		});		
		dateFootTime.find('.s').off("click").on("click",function(){
			seledMSecond.find('.laydte_hsmtex em').text('秒数');
			isSelectMorS='s';
			$("#"+jqID+" #laydate_time1").show();		
		});		
		 datePanel.append(top_over_line);   						
		 datePanel.append(dateTitle);  			
		 main_area.append(dateContent);			
		 main_area.append(monthPanel);			
		 main_area.append(yearPanel);			 				
		 datePanel.append(main_area);  	
		 datePanel.append(dateFootTime);		  
		 datePanel.append(seledHour);		
		 datePanel.append(seledMSecond);	
		 datePanel.append(datePanelCloseBtn);		
		 if($("#f_frame_cont").length>0){  //2017/06/14 zlb
		 	$("#"+jqID).remove();
			//console.log(jqID);
			$("#f_frame_cont").append(datePanel);
		 }else{
			$("body").append(datePanel);						
		 }
		//$("body").append(datePanel);		
		
		$(document).on("DOMMouseScroll mousewheel","#"+jqID,function(event){disScroll(event,this);});	
		that.on("DOMMouseScroll mousewheel",function(event){disScroll(event,this);});	
		
		$("#"+jqID+" .date_cn").mouseleave(function(e){
			if($("#"+jqID+" .date_cn").is(":hidden")){
				that.css("background-image","url("+ops.ico+")");
			}
			});
			
		$("#"+jqID+" .date_cn").on("click","td",function(e){	
					that.attr('data-focusType','d');
					var pub_exec_block=function(obj){	
						//console.log('obj=',obj)			
						$("#"+jqID+" .date_cn  .pos").removeClass('pos');
						$("#"+jqID+" .date_cn  .plus_td_is_down").removeClass('plus_td_is_down');
						obj.find("i").addClass('pos');		
						//$("#"+that.attr('data-plusid')).hide();		
						//$(window).unbind('mousewheel');			
						that.css({"border-color":oldbdColor,"background-color":oldbgColor});		
						
						var cNewDate=parseInt(obj.text())<10?'0'+obj.text():obj.text();
						var cNewMonth=(curMonth+1)<10?'0'+(curMonth+1):curMonth+1;
						var showVal=curYear+'-'+cNewMonth+'-'+cNewDate+' '+$("#"+jqID+" .date_time_css_zk ._timeval .h").val()+':'+$("#"+jqID+" .date_time_css_zk ._timeval .m").val();
						tdClkDateTmVal=showVal;
						if(ops.callBackFunc!=null){
							//ops.callBackFunc(curYear+'-'+curMonth+'-'+obj.text());		
							ops.callBackFunc(showVal,that.attr('id'));	
						}					
						
						switch(ops.varType){
							case 'text':
								//that.html(curYear+'-'+cNewMonth+'-'+cNewDate);	
								that.html(showVal);	
								break;
							case 'val':						
								//that.val(curYear+'-'+cNewMonth+'-'+cNewDate);
								that.val(showVal);
								break;		
						}	
					}					
					if(e.target.tagName=='EM' || e.target.tagName=='TD' || e.target.tagName=='SPAN' ){								
						switch(e.target.tagName){
							case 'EM':							
								var _cssnull=$(e.target).attr('class');
								if(_cssnull=='null'){return;}
								var ownerDt=$(e.target).attr('data-dt');
								var ownerDts=ownerDt.split('/'),_y=ownerDts[0],_m=parseInt(ownerDts[1])-1,_d=ownerDts[2];	
										
								that.attr('data-cy',_y);
								that.attr('data-cm',_m);
								$("#"+jqID+" .i_year").text(_y+'年');		
								$("#"+jqID+" .i_month").text(parseInt(_m+1)+'月');		
								GenDates();
								var _tmpCnMt=cnMonth[_m];		
								$("#"+jqID+" .monthPanel .ymSeled").removeClass('ymSeled');						
								$("#"+jqID+" .monthPanel td:contains('"+_tmpCnMt+"')").addClass('ymSeled');	
								var _clkObj=$("#"+jqID+" .date_cn i[data-dt='"+ownerDt+"']").parent();		
								pub_exec_block(_clkObj);				
								break;	
						}						
						return false;
					}	
					pub_exec_block($(this));
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
			//var showVal=curYear+'-'+cNewMonth+'-'+curDate;		
			var showVal=curYear+'-'+cNewMonth+'-'+curDate+' '+$("#"+jqID+" .date_time_css_zk ._timeval .h").val()+':'+$("#"+jqID+" .date_time_css_zk ._timeval .s").val();	
			switch(ops.varType){
					case 'text':
						//that.html(cur_Year+'-'+parseInt(cur_Month+1)+'-'+curDate);	
						that.html(showVal);	
						break;
					case 'val':
						//that.val(cur_Year+'-'+parseInt(cur_Month+1)+'-'+curDate);
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
		if(document.getElementById('date_time_css_zk')){			
		}else{
			var date_time_css_zk='.date_time_css_zk{width:96px;height:25px;text-align:center;left:3px;bottom:4px;position:absolute}'+
									  		   '.date_time_css_zk ._timehint{border:solid 1px #ccc; padding:2px 5px 2px 5px; font-size:12px;height:17px; float:left;border-right:none}'+
											   '.date_time_css_zk ._timeval{border:solid 1px #ccc;padding:0px;box-sizing:border-box;float:left; height:23px;overflow:hidden; padding-left:5px;padding-right:5px}'+
											   '.date_time_css_zk ._timeval input[type="text"]{width:22px;height:20px;cursor:pointer;border:none;outline:none; padding:0px !important;text-align:center; margin-top:1px;float:left;border-radius: 0px !important; line-height:20px !important}'+
											   '.date_time_css_zk ._timeval input[type="text"]:hover{border:none !important; background-color:#eee;}'+
   										       '.date_time_css_zk ._timeval input[type="text"]:focus{border:none !important; background-color:#ddd}'+
											   '.date_time_css_zk ._timeval i{float:left;font-style:normal; margin-top:-1px}'+
											   '.laydate_show{box-shadow: 2px 2px 5px rgba(0,0,0,.1);}'+
											  '.laydate_time{position: absolute; background-color:#fff; width:131px;height:127px; font-size:12px;border: 1px solid #ccc;left:3px;bottom:35px;display:none}'+
											  '.laydte_hsmtex{height: 20px;line-height: 20px;text-align: center;border-bottom: 1px solid #ccc;}'+
											  '.laydte_hsmtex span{ position: absolute;width: 20px;top: 0;right: 0px;cursor: pointer;}' +									
											  '.laydate_hmsno{padding: 5px 0 0 5px;}.laydate_hmsno .laydate_click{background-color: #009F95!important;    color: #fff!important;}'+
											  '.laydate_hmsno span{display: block;float: left;width: 24px;height: 19px;line-height: 19px;text-align: center;cursor: pointer;}'+
											  '.laydate_hmsno span:hover{background-color:#00C1B3;color:#fff}'+
											  '.laydate_hmsno span:active{background-color:#009F95;color:#fff}'+
											  '.laydate_time1{width: 246px!important;height: 155px!important;left:3px}'+
											  '.laydte_hsmtex em{font-style:normal}'+
											  '.laydate_hmsno .cy{background-color:#f5f5f5}.laydate_hmsno .sw{color:#999}.enterbtn:hover{background-color: #00C1B3; color:#fff;border-color:#00C1B3}'+
											  '.enterbtn{position:absolute;right:5px; bottom:6px;width:60px; height:21px;border:solid 1px #e0e0e0; font-size:12px; text-align:center;line-height:21px;cursor:pointer}'+
											  '.enterbtn:active{background-color: #009F95; color:#fff;border-color:#009F95}';
											  
			var nod=$("<style type='text/css' id='date_time_css_zk'>"+date_time_css_zk+"</style>");			
			$("head").append(nod);
		}
		
		if(document.getElementById(cssQz)){								
		} else {		
			var cssStr='',newLeft=that.offset().left,newWidth=that.innerWidth(),
			      newTop=that.offset().top+that.innerHeight()+0; 
			cssStr+='.'+cssQz+'_css{width:'+ops.width+';height:'+ops.height+';top:'+newTop+'px;left:'+newLeft+
						'px;position:absolute;display:none;font-family:微软雅黑;-webkit-user-select:none;border:solid 1px '+ops._activeColor+';background-color:#fff; z-index:10000000}';
			cssStr+='.'+cssQz+'_css .title{height:30px; width:100%;line-height:30px;position:relative;text-align:center; background-color:#FFF}';	
			cssStr+='.'+cssQz+'_css .title .dir{color:#A5A5A5; cursor:pointer;position:absolute;/*transform: scale(1,1.2);*/font-size:18px;width:15px;height:15px;top:7px;}';
			cssStr+='.'+cssQz+'_css .title .dir:hover{color:#000}.'+cssQz+'_css .i_month{width: 33px;display: inline-block;text-align: right;}';
			cssStr+='.'+cssQz+'_css .title .dir:active{margin-top:1px; }.'+cssQz+'_css .cEEE{color:#bbb}';
			cssStr+='.'+cssQz+'_css .title .pre{left:10px; background: url(/static/public/img/icons.png) no-repeat 0px -527px;}';
			cssStr+='.'+cssQz+'_css .title .pre:hover{left:10px;background: url(/static/public/img/icons.png) no-repeat -26px -527px;}';
			cssStr+='.'+cssQz+'_css .title .next{right:10px;background: url(/static/public/img/icons.png) no-repeat 0px -553px;}';			
			cssStr+='.'+cssQz+'_css .title .next:hover{right:10px;background: url(/static/public/img/icons.png) no-repeat -26px -553px;}';
			cssStr+='.'+cssQz+'_css .title span b{cursor:pointer;font-weight:normal}';
			cssStr+='.'+cssQz+'_css .title span b:hover{color:#00c5b5}.'+cssQz+'_css .mainArea{background-color:#fff;width:100%; height:220px;overflow:hidden;position: relative;}';
			cssStr+='.'+cssQz+'_css .title .title_txt{color:#666}.'+cssQz+'_css .title .title_txt{color:#A5A5A5; font-size:15px;}';	
			cssStr+='.'+cssQz+'_css .title .to_day{color:#666;position:absolute;right:60px;width:20px;height:20;line-height:20px;text-align:center; font-size:12px; top:5px;cursor:pointer}';
			cssStr+='.'+cssQz+'_css .title .to_day:hover{background-color:#00c5b5;border-radius:50%;color:#fff}.'+cssQz+'_css .title .to_day:active{background-color:#00bcaa;}';
			cssStr+='.'+cssQz+'_css .date_cn{border-collapse:collapse; margin-left:1px; position:absolute;left:0px;}';
			cssStr+='.'+cssQz+'_css .ymPanel{border-collapse:collapse; margin-left:2px; position:absolute;left:0px;width:98.5%;text-align:center; height:209px;box-sizing:border-box;display:none; background-color:#fff; font-size:14px}';
			cssStr+='.'+cssQz+'_css .ymPanel td{width:25%; height:33.33%}.'+cssQz+'_css .ymPanel td:hover{outline:solid 1px #00c5b5;color:#00c5b5;background-color:#EEF9F3;cursor:pointer}';
			cssStr+='.'+cssQz+'_css .ymSeled{background-color:#DEF8F6;border:solid 1px #00c5b5; color:#00c5b5}';
			cssStr+='.'+cssQz+'_css .date_cn thead th{font-size:12px;color:#A5A5A5; font-weight:normal;height:30px;border-top:solid 1px #F2F2F2;border-bottom:solid 1px #F2F2F2}';
			cssStr+='.'+cssQz+'_css .date_cn tbody td{text-align:center;vertical-align: middle; width:14.2%;height:15%}';
			cssStr+='.'+cssQz+'_css .date_cn tbody td .null{ cursor:default !important}.'+cssQz+'_css .date_cn tbody td .null:hover{border:none !important}';
			cssStr+='.'+cssQz+'_css .date_cn tbody td em,.'+cssQz+'_css .date_cn tbody td span{color:#D0D0D0;font-style:normal;font-size:14px;cursor:pointer;width:90%;height:100%;float:left; line-height:29px;border:solid 1px #fff; }';
			cssStr+='.'+cssQz+'_css .date_cn tbody td em:hover{background-color:#fff;color:#00C1AD;font-style:normal;border:solid 1px #00C1AD}.'+cssQz+'_css .date_cn tbody td span{cursor:default}'; 
			cssStr+='.'+cssQz+'_css .date_cn tbody td i{color:#7B7B7B;font-style:normal;width:90%;height:100%;float:left; line-height:29px;border:solid 1px #fff; cursor:pointer;font-size:14px}';
			cssStr+='.'+cssQz+'_css .date_cn tbody td i:hover{background-color:#fff;color:#00C1AD;font-style:normal;border:solid 1px #00C1AD}'; 
			cssStr+='.'+cssQz+'_css .date_cn tbody td i:active{background-color:'+ops._hoverColor+';color:#fff}';
			cssStr+='.'+cssQz+'_css .top_over_line{width:'+newWidth+'px;height:3px;background-color:#fff;position:absolute;top:-2px;left:0px;z-index:3;font-size:1px}';
			cssStr+='.plus_td_is_today{color:#eeac18 !important; background-color:#FBF4DF; border-radius:3px;border:solid 1px #FBF4DF}';
			cssStr+='.plus_td_is_down,.'+cssQz+'_css .pos{background-color:'+ops._clkBgColor+';border:solid 1px '+ops._clkBgColor+' !important;color:#fff  !important;border-radius:3px}';	
			cssStr+='.plus_td_is_down:hover,.'+cssQz+'_css .pos:hover{background-color:'+ops._clkBgColor+'  !important;}';
			//cssStr+='.'+cssQz+'_css .pos{background-color:#E5F9F7;border:solid 1px '+ops._hoverColor+' !important;color:'+ops._activeColor+'  !important}';	
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
								//okbtn
								cssFileObj.push(linkHref[i].cssRules[11].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								//cssFileObj.push(linkHref[i].cssRules[12].cssText.split('{')[1].replace(/}/g,'').split(';'));	
								//cssFileObj.push(linkHref[i].cssRules[13].cssText.split('{')[1].replace(/}/g,'').split(';'));	
								//cssFileObj.push(linkHref[i].cssRules[14].cssText.split('{')[1].replace(/}/g,'').split(';'));	
								ops._clkBgColor=cssFileObj[3][1].split(':')[1];			
								//opts._okbtncolrs.normal.bdc=cssFileObj[4][1].split(':')[1];
								//opts._okbtncolrs.normal.colc=cssFileObj[4][2].split(':')[1];	
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
 			GenDates();		
			$(document).click(function(e){
				if(e.target.closest('.yayigj_plus_date_sel_css')!=null || e.target.id==that.attr("id")){}else{
							$("#"+that.attr('data-plusid')).hide();	
								if(oldbdColor=="rgb(0, 0, 0)"){oldbdColor='#fff';};
								that.css({"border-color":oldbdColor,"background-color":oldbgColor});	
								that.css("background-image","url("+ops.ico+")");									
				}
				});
			/*document.documentElement.addEventListener('click', function(e) {	
				console.log(e.target);
				e.stopPropagation();	
				//return false;
				},false);		*/
			var pos=that.offset(),docHeight=$(document).height();	
			
			that.on(ops.event,function(){
			var _h=new Date().getHours(),_m=new Date().getMinutes();
			_h=_h<10?'0'+_h:_h;
			_m=_m<10?'0'+_m:_m;
			if(ops.varType=='text'){
				 if(that.text()!=''){
					 var tmpv= that.text().split(' '),tmptms=[];
					 if(typeof(tmpv[1])!='undefined'){
						 tmptms=tmpv[1].split(':');	
						 $("#"+jqID+"	 .date_time_css_zk .h").val(tmptms[0]);	
						 $("#"+jqID+"	 .date_time_css_zk .m").val(tmptms[1]);				 
					 }
				 }else{
					 $("#"+jqID+" .date_time_css_zk ._timeval .h").val(_h);
					 $("#"+jqID+" .date_time_css_zk ._timeval .m").val(_m);
				 }
			 }else{
				 if(that.val()!=''){
					 var tmpv= that.val().split(' '),tmptms=[];
					 if(typeof(tmpv[1])!='undefined'){
						 tmptms=tmpv[1].split(':');	
						 $("#"+jqID+"	 .date_time_css_zk .h").val(tmptms[0]);	
						 $("#"+jqID+"	 .date_time_css_zk .m").val(tmptms[1]);						
					 }
				 }else{
					 $("#"+jqID+" .date_time_css_zk ._timeval .h").val(_h);
					 $("#"+jqID+" .date_time_css_zk ._timeval .m").val(_m);
				 }
			 }
			 
				//$(window).bind('mousewheel',function(){return false;});
				//$(window).on("mousewheel DOMMouseScroll",function(){return false;});
				window.clearTimeout(close_panel_tm);
				pos=that.offset(),docHeight=$(document).height();
				if($("#f_frame_cont").length>0){ 
					pos.left-=$("#f_frame_cont").offset().left;
					pos.top-=$("#f_frame_cont").offset().top;
				}
				//console.log('pos=',pos);
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
				var id=that.attr("id")+"_seled_plus_datetime";	
				var topLineObj=$("#"+id+" .top_over_line");
				topLineObj.width(that.innerWidth());						
				that.css({"border-color":ops._activeColor,"background-color":"#fff"});									
				$("#"+id).css({
					"left":pos.left,
					"top":pos.top+that.innerHeight()
					}).show();						
				
				if(that.offset().top+parseInt(ops.height)>docHeight){
					if($("#f_frame_cont").length>0){ 
						$("#"+id).css("top",that.offset().top-$("#f_frame_cont").offset().top-parseInt(ops.height));
					}else{
						$("#"+id).css("top",that.offset().top-parseInt(ops.height));
					}
					topLineObj.css("top",ops.height);
				}else{
					topLineObj.css("top","-1px");
				}
				
				if(that.offset().left+that.width()+$("#"+id).width()>$(document).scrollLeft()+$(window).width()){
					//alert('outer-right');
					$("#"+id).css("left",pos.left+that.innerWidth()-$("#"+id).innerWidth());
					topLineObj.css({"right":"0px","left":'initial'});
				}else{
					topLineObj.css({"right":"initial","left":'0px'});	
				}
				}).css({"border-radius":"2px","cursor":"pointer","background-image":"url("+ops.ico+")",
						   "background-position":"95% 45%","background-repeat":"no-repeat","font-family":"微软雅黑"}).hover(
					function(){
						$(this).css("background-image","url("+ops.icoActive+")");						
						that.css({"border-color":ops._hoverColor,"background-color":ops._hoverBgColor});	
						},
					function(e){	
							//console.log('e',$(e.relatedTarget).parents('.date_cn'));
							try{									
								var tagClass=	e.relatedTarget.className;  
								if(tagClass=='top_over_line' || tagClass=='title' || $(e.relatedTarget).parents('.date_cn').length>0){
										if($("#"+that.attr("id")+"_seled_plus_dateSel").is(":hidden")){
											$(this).css("background-image","url("+ops.ico+")");
										}
								}else{										
										$(this).css("background-image","url("+ops.ico+")");
										that.css({"border-color":ops._borderColor});	
										$("#"+that.attr("id")+"_seled_plus_dateSel").hide();	
								}
								that.css({"background-color":"#fff"});	
								//top_over_line
								/*var tagName=e.relatedTarget.tagName;			   
								if($(e.target).attr("id")==that.attr('id')){	
									if(tagName=='BODY' || tagName=='HTML'){
										$(this).css("background-image","url("+ops.ico+")");
										$("#"+that.attr("id")+"_seled_plus_dateSel").hide();	
									}else{
										if($("#"+that.attr("id")+"_seled_plus_dateSel").is(":hidden")){
											$(this).css("background-image","url("+ops.ico+")");
										}
									}
								}else{
									$(this).css("background-image","url("+ops.ico+")");
									$("#"+that.attr("id")+"_seled_plus_dateSel").hide();	
								}*/
							}catch(e){
								
							}
						}
					);	
											
				$("#"+that.attr('data-plusid')).mouseleave(function(e){
					try{
						if(e.relatedTarget.id==that.attr('id')){							
						}else{
							close_panel_tm=window.setTimeout(function(){
								$("#"+that.attr('data-plusid')).hide();	
								if(oldbdColor=="rgb(0, 0, 0)"){oldbdColor='#fff';};
								that.css({"border-color":oldbdColor,"background-color":oldbgColor});	
								that.css("background-image","url("+ops.ico+")");									
							},600);
							//$(window).off('mousewheel');
							//$(window).off('DOMMouseScroll');				
						}						
					}catch(e){
						//	
					}
				}).mouseenter(function(){
					window.clearTimeout(close_panel_tm);
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