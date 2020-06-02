/*------------------------------------
年月日期选择控件
 zlb 2017-01-06
 使用说明,请使用ID进行绑定,不要使用class
*-------------------------------------*/
 ;(function($) {    
 	var defaults={
		_borderColor:'#00c5b5',//'#00c5b5',	#EEF9F3 #00C3B5  00C3B5
		_activeColor:'#00bcaa',
		_hoverColor:'#00d4c3',
		_tdclkColor:'#00bcaa',
		_ipthoverBgColor:'#F2FFFE',
		_okbtncolrs:{
			normal:{bgc:'#47a6a0',bdc:'#47a6a0',colc:'#fff'}, 
			hover:{bgc:'#55c6bf',bdc:'#55c6bf',colc:'#fff'},
			active:{bgc:'#328b8s',bdc:'#328b8s',colc:'#fff'},  
			disabled:{bgc:'#c7e4e2',bdc:'#c7e4e2',colc:'#fff'} 
		},
		_canbtncolrs:{
			normal:{bgc:'#fff7e0',bdc:'#f1cf66',colc:'#e8af00'}, 
			hover:{bgc:'#ffefe0',bdc:'#ea8800',colc:'#ea8800'},
			active:{bgc:'#ea8800',bdc:'#ea8800',colc:'#fff'},  
			disabled:{bgc:'#fffdf6',bdc:'#fbf1d1',colc:'#fbf1d9'} 
			},
		_valtype:'val',
		_minHeight:200,
		_hiddenID:'',
		_ico:"/static/public/img/sildeup.png", 
		_icobg:"/static/public/img/icons.png",
		_icos:"/static/public/img/selecticon.png",
		_icosActive:"/static/public/img/selecticon_active.png",
		_callBack:null,
		_isDefaultSel:true,
		_isLocation:true
	};
	
	var yearMonthSelObj=function(element,options){
		var opts=options,
			 that=$(element),
			 self=this,
			 cssSufix='yayigj_year_month_sel',
			 today_date=new Date(),
			 today_y=today_date.getFullYear(),
			 today_m=today_date.getMonth(),
			 today_d=today_date.getDate();	
		console.log('opts=',opts);	 
		//func
		this.disScroll=function(evt,obj){ 		
			var scrollTop = obj.scrollTop,scrollHeight = obj.scrollHeight,height = obj.clientHeight;
			var delta = (evt.originalEvent.wheelDelta) ? evt.originalEvent.wheelDelta : -(evt.originalEvent.detail || 0);  
			if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
				obj.scrollTop = delta > 0? 0: scrollHeight;
				evt.preventDefault();
			}   
		}		
		//-----------------------------------------
	    // genCss
		//-----------------------------------------
		this.createCss=function(){
			if(document.getElementById("yayigj_year_month_sel")){								
			} else {	
				var nod=document.createElement("style");	
				var strCss='',_w=that.width(),_h=that.height();	
				strCss+='.'+cssSufix+'{font-familay:微软雅黑;font-size:14px; width:344px;overflow:hidden}';			
				strCss+='.'+cssSufix+' .swap{width:110px; height:29px; float:left}.'+cssSufix+' .swap span{width:50px; height:29px;box-sizing:border-box; display:inline-block;text-align:center;line-height:29px;font-size:14px;cursor:pointer;border:solid 1px #e0e0e0;color:#a4a4a4;background-color:#fff;}';
				strCss+='.'+cssSufix+' .swap span:hover{color:#888;border-color:'+opts._borderColor+'}';
				strCss+='.'+cssSufix+' .swap .d{border-radius:3px  0px 0px 3px;border-right:none}';
				strCss+='.'+cssSufix+' .swap .m{border-radius:0px  3px 3px 0px;border-left:none}';
				strCss+='.'+cssSufix+' .act{background-color:'+opts._okbtncolrs.normal.bgc+' !important; border-color:'+opts._okbtncolrs.normal.bgc+' !important;color:#fff !important}';
				strCss+='.'+cssSufix+' .act:hover{background-color:'+opts._okbtncolrs.hover.bgc+' !important;border-color:'+opts._okbtncolrs.hover.bgc+' !important;}.'+cssSufix+' .act:active{background-color:'+opts._okbtncolrs.active.bgc+' !important;}';
				
				strCss+='.'+cssSufix+' .valarea{width:195px;height:27px; margin-left:10px; text-align:center;line-height:27px;color:#333; float:left;border:solid 1px #e0e0e0;border-radius:3px  0px 0px 3px;border-right:none}';
				strCss+='.'+cssSufix+' .rightDown{background-image:url('+opts._icos+');background-repeat:no-repeat; background-position:center center; width:27px;height:27px;line-height:27px; text-align:center;border-radius:0px  3px 3px 0px;border-left:none;border:solid 1px #e0e0e0;border-left:none; float:left;cursor:pointer}';
				strCss+='.'+cssSufix+' .rightDown:hover{background-image:url('+opts._icosActive+');}.'+cssSufix+' .acbgjt{background-image:url('+opts._icosActive+');}';
				strCss+='.valarea{cursor:pointer}';
				
				strCss+='.'+cssSufix+'_panel{width:500px;height:305px;box-shadow:0px 0px 5px #ccc;background-color:#fff;border:solid 1px #ccc;position:absolute;z-index:2000;box-sizing:border-box;padding:10px;moz-user-select: -moz-none;-moz-user-select: none;-o-user-select:none;-khtml-user-select:none;-webkit-user-select:none;-ms-user-select:none;user-select:none;}';
				strCss+='.'+cssSufix+'_panel .toprow{width:100%;height:25px; position: relative;}.'+cssSufix+'_panel .btn_bg{background-repeat: repeat-x;cursor:pointer;background-image:url('+opts._icobg+');display:inline-block}';
				strCss+='.'+cssSufix+'_panel .toprow .yL{width: 15px;height:15px;margin-right: 1px;background-position: 0px -580px;position:absolute;top:3px;z-index:10}';
				strCss+='.'+cssSufix+'_panel .toprow .yL:hover{background-position:-26px -580px; }';
				strCss+='.'+cssSufix+'_panel .toprow .mL{width: 15px; height:15px; margin-left:15px;  background-position: 0px -527px; position:absolute;top:3px;z-index:10;left:10px;}';
				strCss+='.'+cssSufix+'_panel .toprow .mL:hover{background-position: -26px -527px; }.'+cssSufix+'_panel .toprow .right_txt{display:inline-block; margin-right:0px;width:225px;text-align:center; font-size:15px; color:#A5A5A5;position:absolute;right:0px;top:2px;}';
				strCss+='.'+cssSufix+'_panel .toprow .left_txt{ display:inline-block; margin-left:0px; font-size:15px; color:#A5A5A5;width:225px;left:0px;top:2px;text-align:center;position:absolute;pointer-events}';
				strCss+='.'+cssSufix+'_panel .toprow .title_right{ position:absolute;right:0px;top:0px;}';
				strCss+='.'+cssSufix+'_panel .toprow .mR{width: 15px;height:15px;margin-right: 1px;background-position: 0px -553px;position:absolute;top:3px;z-index:10;right:20px}';
				strCss+='.'+cssSufix+'_panel .toprow .mR:hover{background-position: -26px -553px; }';
				strCss+='.'+cssSufix+'_panel .toprow .yR{width: 15px; height:15px; margin-left:15px;  background-position: 0px -606px;position:absolute;top:3px;z-index:10;right:0px}';
				strCss+='.'+cssSufix+'_panel .toprow .yR:hover{background-position: -26px -606px; }';
				strCss+='.'+cssSufix+'_panel .toprow .pos_tday{position: absolute;right:40px;top: 2px;z-index:11;font-style: normal;font-size: 14px;width:20px;height:20px;text-align:center;line-height:20px;cursor:pointer;border-radius:50%;color:#999}';
				strCss+='.'+cssSufix+'_panel .toprow .pos_tday:hover{background-color:#eee;color:#333}.'+cssSufix+'_panel .toprow .pos_tday:active{background-color:#ddd;color:#333}';
				strCss+='.'+cssSufix+'_panel .midlerow{width:100%;height:193px; box-sizing:border-box;background-color:#fff;font-size:14px; padding-top:20px; position:relative}';
				strCss+='.'+cssSufix+'_panel .ymsel_date_cn .zc:hover{background-color:#F5F5F5}.'+cssSufix+'_panel .ymsel_year_cn td:hover{background-color:#F5F5F5}';
				strCss+='.'+cssSufix+'_panel .midlerow .week_head th{border-top:solid 1px #e0e0e0;border-bottom:solid 1px #e0e0e0; color:#7B7B7B;font-weight:normal}';
				strCss+='.'+cssSufix+'_panel .midlerow .leftarea{width:47%; height:193px; position:absolute;left:0px;top:10px;}.'+cssSufix+'_panel .ymsel_date_cn td{text-align:center;}';
				strCss+='.'+cssSufix+'_panel .midlerow .rightarea{width:47%; height:193px; position:absolute;right:0px;top:10px;}.'+cssSufix+'_panel .ymsel_date_cn td{text-align:center}';
				strCss+='.'+cssSufix+'_panel .midlerow .clktd{background-color:'+opts._okbtncolrs.normal.bgc+' !important;color:#fff !important}';
				strCss+='.'+cssSufix+'_panel .midlerow .tdmsel{background-color:#ECF6F5;color:'+opts._okbtncolrs.hover.bgc+' !important;border-color:#fff}'; 
				strCss+='.'+cssSufix+'_panel .midlerow .invalid{color:#999}.'+cssSufix+'_panel .tday{color:#EDC65F; background-color:#FBF4DF; display:inline-block;width:80%}'; 
				
				strCss+='.'+cssSufix+'_panel .fotRow{position:absolute;left:0px;bottom:0px;border-top:solid 1px #F5F5F5;width:100%;height:60px;background-color:#fcfcfc;box-sizing:border-box; padding-left:10px;line-height:58px}';
				strCss+='.'+cssSufix+'_panel .fotRow .f_right{position:absolute;right:10px;top:0px}.'+cssSufix+'_panel .fotRow .f_right input[type="button"]{margin-left:10px; width:70px;border:solid 1px #ccc; background-color:#fff; height:27px;border-radius:2px;cursor:pointer}';
				strCss+='.'+cssSufix+'_panel .fotRow .f_right input[type="button"]{cursor:pointer;outline:none}.'+cssSufix+'_panel .btndefut{background-color:'+opts._okbtncolrs.normal.bgc+' !important;border-color:'+opts._okbtncolrs.normal.bdc+' !important;color:'+opts._okbtncolrs.normal.colc+';}';
				strCss+='.'+cssSufix+'_panel .btndefut:hover{background-color:'+opts._okbtncolrs.hover.bgc+' !important;border-color:'+opts._okbtncolrs.hover.bdc+' !important;color:'+opts._okbtncolrs.hover.colc+'}.'+cssSufix+'_panel .btndefut:active{background-color:'+opts._okbtncolrs.active.bgc+' !important;border-color:'+opts._okbtncolrs.active.bdc+' !important;color:'+opts._okbtncolrs.active.colc+'}';
				strCss+='.'+cssSufix+'_panel .btncancel{color:'+opts._canbtncolrs.normal.colc+';border-color:'+opts._canbtncolrs.normal.bdc+'   !important;background-color:'+opts._canbtncolrs.normal.bgc+'  !important}';
				strCss+='.'+cssSufix+'_panel .btncancel:hover{color:'+opts._canbtncolrs.hover.colc+'  !important;border-color:'+opts._canbtncolrs.hover.bdc+' !important;backgound-color:'+opts._canbtncolrs.hover.bgc+'  !important}.'+cssSufix+'_panel .btncancel:active{color:'+opts._canbtncolrs.active.colc+'  !important;border-color:'+opts._canbtncolrs.active.bdc+' !important;background-color:'+opts._canbtncolrs.active.bgc+'   !important}';
				strCss+='.'+cssSufix+'_panel .ymsel_date_cn em{font-style:normal;color:#FFF}.'+cssSufix+'_panel .ymsel_date_cn i{font-style:normal;color:#000;}';
				strCss+='.'+cssSufix+'_panel .fotRow .f_left{width:50%; float:left; margin-top:0px;}.'+cssSufix+'_panel .fotRow .f_left b{font-weight:normal;display:inline-block;height:25px;line-height:25px; color:#999}';
				strCss+='.'+cssSufix+'_panel .fotRow .f_left span{display:inline-block;width:100px;height:25px;text-align:center;line-height:25px;font-size:14px;background-color:#fff;border:solid 1px #ccc;border-radius:2px; margin-top:8px;}'; 
				strCss+='.'+cssSufix+'_panel .fotRow .f_left .firstdate{}.'+cssSufix+'_panel .fotRow .f_right .lastdate{}';
				strCss+='.'+cssSufix+'_panel .ymsel_year_cn  td{text-align:center;border:solid 1px #F1F1F1;width:25%;color:#7B7B7B}.'+cssSufix+'_panel .ymsel_year_cn table{ border-collapse:collapse; margin-top:20px;cursor:pointer}';
				strCss+='#'+that.attr('id')+'_datepanel td{border-top:solid 3px #fff !important;border-bottom:solid 3px #fff !important;color:#7B7B7B}';
				strCss+='#'+that.attr('id')+'_datepanel th{color:#A5A5A5;border-top:solid 1px #F2F2F2;border-bottom:solid 1px #F2F2F2;font-weight:normal; font-size:12px; height:30px;}';
				
				var nod=$("<style type='text/css' id='yayigj_year_month_sel'>"+strCss+"</style>");
				$("head").append(nod);
			}
		}	
		
		//func
		this.getMonths=function(){
				var monthPanel=$('<div class="ymsel_year_cn"><table border="0" cellpadding="0" cellspacing="0" width="100%"  height="150">'+
									'<tr><td>一月</td><td>二月</td><td>三月</td><td>四月</td></tr><tr><td>五月</td><td>六月</td><td>七月</td><td>八月</td></tr>'+
									'<tr><td>九月</td><td>十月</td><td>十一月</td><td>十二月</td></tr></table></div>');				
				return 	monthPanel;
		}
		//func
		this.format_Date=function(date){
			var y=date.getFullYear(),m=date.getMonth()+1,d=date.getDate();
			m=m<10?'0'+m:m;
			d=d<10?'0'+d:d;
			return y+'/'+m+'/'+d; 
		};		
		//func return month last day [zlb 2017/1/17]
		this.getMonthLastDay=function(y,m){
			var	 c_date=new Date(y,m,0)
			return self.format_Date	(c_date);
		}
		//----------------------------------	
		// current firstday and lastday [zlb 2017/1/17]
		//----------------------------------	
		this.todayDateInterval=function(){		
				var fDate=new Date(),eDate=new Date(fDate.getFullYear(),fDate.getMonth()+1,0),
				      Interval={
						  trueFDate:fDate,
						  trueEDate:eDate,
						  startDate:self.format_Date(fDate).substring(0,7)+'/01',
						  firstDate:self.format_Date(fDate),
					  	  lastDate:self.format_Date(eDate),
						  startY:fDate.getFullYear(),
						  startM:fDate.getMonth()+1,
						  lastY:eDate.getFullYear(),
						  lastM:eDate.getMonth()+1,
						  };
				 return Interval;
		}
	// self.todayDateInterval();
	
	  //----------------------------------	
	  //func [zlb 2017/1/17]	
	  //----------------------------------	
	   this.getPreMelement=function(y,m){
		 	 var tmpDate=new Date(y,--m,1);
			  tmpDate.setDate(tmpDate.getDate()-1);
			 return {preYear:tmpDate.getFullYear(),preMonth:tmpDate.getMonth()+1};
		}			 	
	  //----------------------------------	
	  //func [zlb 2017/1/17]	
	  //----------------------------------	
	   this.getNextMelement=function(y,m){
		 	 var tmpDate=new Date(y,--m,1);
			  tmpDate.setMonth(tmpDate.getMonth()+1);
			 return {preYear:tmpDate.getFullYear(),preMonth:tmpDate.getMonth()+1};
		}	    
	  //----------------------------------	
	  // func [zlb 2017/1/17]	
	  //----------------------------------		 
	  this.getTextDateInfo=function(id){
			var textInfo=$("#"+id+" .yayigj_year_month_sel .valarea").text().split('~');
			//console.log('textInfo=',textInfo);
			return {
				startparam:textInfo[0].replace('年','-').replace('月','').split('-'),
				endparam:textInfo[1].replace('年','-').replace('月','').split('-')
				}
	  }
	  //----------------------------------	
	  //func [zlb 2017/1/17]	
	  //----------------------------------	
	  this.setToday=function(){
		   //console.log(that.attr("id"));
		   var todayObj=self.todayDateInterval();
			$("#"+that.attr("id")+" .valarea").text(todayObj.startDate.replace(/\//g,'-')+'~'+todayObj.lastDate.replace(/\//g,'-'));
			//if(todayObj.startDate.substring(0,4)==todayObj.lastDate.substring(0,4) && todayObj.startDate.substr(5,2)==01){
			//	that.attr('data-curYear',(today_y-1));
			//}else{
				today_m==0?that.attr('data-curYear',today_y-1):that.attr('data-curYear',today_y);
			//}
			today_m==0?that.attr('data-curMonth',12):that.attr('data-curMonth',today_m);		
		};			
		
		//func
		this.strformat_Date=function(date){
			var strDates=date.split('/');
			var y=strDates[0],m=parseInt(strDates[1]),d=parseInt(strDates[2]);
			m=m<10?'0'+m:m;
			d=d<10?'0'+d:d;
			if(isNaN(m)){m='01';}
			if(isNaN(d)){d='01';}
			return y+'/'+m+'/'+d; 
		};	
		//func
		this.getMonthLast=function(y,m){
					 var date=new Date(y+'/'+parseInt(m)+'/01'),currentMonth=date.getMonth(),nextMonth=++currentMonth,
						   nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
					 return new Date(nextMonthFirstDay);
				};	
		
		//func
		this.getWeek=function(date){
			 var nD=new Date(date);
			 return nD.getDay()>0?nD.getDay():7;
		};	
		//func
		this.getDateArrs=function(cur_vals){
				cur_vals=cur_vals.replace(/\s/g,"");
				cur_vals=cur_vals.replace(/年/g,'-').replace(/月/g,'').split('~');
				var left_val=cur_vals[0].split('-'),right_val=cur_vals[1].split('-'),_sy=left_val[0],_sm=left_val[1],_ey=right_val[0],_em=right_val[1];
			var result={leftYM:left_val,rightVal:right_val,_sy:left_val[0],_sm:left_val[1],_ey:right_val[0],_em:right_val[1]};	
			return result;
		}
		//-----------------------------------------
		// gen dateDateList
		//-----------------------------------------
		this.getMDays=function(y,m){		
				var	dateContent=$('<table border="0" cellpadding="0" cellspacing="0" width="100%" height="190" class="ymsel_date_cn">'+
						'<thead class="week_head"><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead>'+
						'<tbody>'+
						'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
						'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
						'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
						'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
						'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+
						'	<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>'+								
						'</tbody>'+
					'</table>');				
				
				var GetDateStr=function(date,AddDayCount){		
					var dd = new Date(date); 	
					dd.setDate(dd.getDate()+AddDayCount);		
					return dd; 
				};
				var formatDate=function(date){return date.getFullYear()+'/'+date.getMonth()+'/'+date.getDate(); };							
				var GenDates=function(y,m){						
					var curYear=parseFloat(y),curMonth=parseFloat(m);					 					
					var FirstDate=curYear+'/'+parseInt(curMonth)+'/01',
						  f_date_obj=new Date(FirstDate),
						  e_date_obj=self.getMonthLast(curYear,curMonth),curWeek=self.getWeek(FirstDate),
						  t_obj=dateContent,today=new Date(),t_obj_body=t_obj.children("tbody"),	  
						  startDay=GetDateStr(FirstDate,-curWeek+1),posDate=new Date(that.text().replace('-','/')),
						  curDay=startDay;							  
					t_obj_body.find("td").each(function(k,v){	
						if(curDay<f_date_obj || curDay>=e_date_obj){		
							$(v).html("<span class='null'>&nbsp;</span>");
						}else{
								if(formatDate(curDay)==formatDate(today)){	
									$(v).html('<span class="tday">'+curDay.getDate()+'</span>');
								}else{
									$(v).addClass('zc');
									if(curDay>today){
										$(v).html(curDay.getDate());
									}else{										
										if(formatDate(posDate)==formatDate(curDay)){					
											$(v).html(curDay.getDate());							
										}else{
											$(v).html(curDay.getDate());
										}		
									}
								}
						}
						curDay.setDate(curDay.getDate()+1);
						});	
				};						
			GenDates(y,m);	
			//console.log();
			return dateContent;
		}	
		//-----------------------------------------
		// genDatePanel
		//-----------------------------------------
		this.createDatePanel=function(pobj,h_switch){		
				$("#"+that.attr("id")+"_datepanel").remove();
				$("#"+that.attr("id")+"_monthpanel").remove();	
				if(pobj.ty==pobj.my && pobj.mm==pobj.tm){
					 var  newInfoObj=self.getPreMelement(pobj.ty,pobj.tm);
					 pobj.ty=newInfoObj.preYear;
					 pobj.tm=newInfoObj.preMonth;
				}				
				var nextMonth=pobj.mm-pobj.tm>1 || pobj.mm-pobj.tm==0?pobj.tm+1:pobj.mm;
				var nextYear=pobj.my-pobj.ty>0&&pobj.tm!=12?pobj.ty:pobj.my;				
				if(nextMonth==13){
					nextMonth=1;
					nextYear=nextYear+1;	
				}					
				var datePanel=$("<div class='"+cssSufix+"_panel' id='"+that.attr("id")+"_datepanel'></div>"),
				topRow=$("<div class='toprow'><em class='pos_tday'>今</em><b class='yL btn_bg'></b><b class='mL btn_bg'></b><span class='left_txt'>"+pobj.ty+"年"+(parseInt(pobj.tm)<10?'0'+parseInt(pobj.tm):pobj.tm)+"月</span><div class='title_right'><span class='right_txt'>"+nextYear+"年"+(parseInt(nextMonth)<10?'0'+parseInt(nextMonth):nextMonth)+"月</span><b class='mR btn_bg'></b><b class='yR btn_bg'></b></div></div>"),
				midleRow=$("<div class='midlerow'><div class='leftarea' id='datep_"+pobj.ty+"_"+parseInt(pobj.tm)+"'>"+self.getMDays(pobj.ty,pobj.tm).prop('outerHTML')+"</div><div class='rightarea' id='datep_"+nextYear+"_"+parseInt(nextMonth)+"'>"+self.getMDays(nextYear,nextMonth).prop('outerHTML')+"</div></div>"),
				fotRow=$("<div class='fotRow'><div class='f_left'><span class='firstdate'>&nbsp;</span><b>~</b><span class='lastdate'>&nbsp;</span></div><div class='f_right'><input type='button' class='btndefut' value='确定' /><input type='button' class='btncancel' value='取消' /></div></div>"),
				offset=$("."+cssSufix+" .valarea").offset();
				
				paramobj={x:offset.left,y:offset.top};
				datePanel.css({"top":paramobj.y+40,"left":paramobj.x});
				datePanel.append(topRow);
				datePanel.append(midleRow);
				datePanel.append(fotRow);
				$("body").append(datePanel);	
				var cur_vals=$("#"+that.attr("id")+" .yayigj_year_month_sel .valarea").text().replace(/年/g,'/').replace(/月/g,'').split('~');				
				$("#"+that.attr("id")+"_datepanel .fotRow .firstdate").text(cur_vals[0].replace(/-/g,'-'));
				$("#"+that.attr("id")+"_datepanel .fotRow .lastdate").text(cur_vals[1].replace(/-/g,'-'));
				
				$("#"+that.attr("id")+"_datepanel .midlerow .tdmsel").removeClass('tdmsel');
				$("#"+that.attr("id")+"_datepanel .midlerow .clktd").removeClass('clktd');
				if(typeof(h_switch)!='undefined'){
					return;	
				}
				//	着色		
				/*if(typeof(that.attr('data-sday'))=='undefined' || that.attr('data-sday')=='' ){					
					return;	
				}	*/			
				var 	txtInfo=self.getTextDateInfo(that.attr("id")),
						_sY=parseInt(txtInfo.startparam[0]),_sM=parseInt(txtInfo.startparam[1]),_sD=parseInt(txtInfo.startparam[2]),
						_eY=parseInt(txtInfo.endparam[0]),_eM=parseInt(txtInfo.endparam[1]),_eD=parseInt(txtInfo.endparam[2]);
				
				if(_sM==_eM && _sY==_eY){
						var firstIndex=self.getWeek(_sY+'/'+_sM+'/01');
						firstIndex--;
						var si=firstIndex+_sD-1,ei=_eD-_sD+si+1;
						for(var i=si;i<ei;i++){
							$("#"+that.attr("id")+"_datepanel .midlerow .rightarea td").eq(i).addClass("tdmsel");
						}
						$("#"+that.attr("id")+"_datepanel .midlerow .rightarea td").eq(si).addClass('clktd');
						$("#"+that.attr("id")+"_datepanel .midlerow .rightarea td").eq(ei-1).addClass('clktd');
				}else{
					var firstIndex=self.getWeek(_sY+'/'+_sM+'/01');
					firstIndex--;
					var lastIndex=new Date(_sY,_sM,0).getDate();  					
					var si=firstIndex+_sD-1,ei=lastIndex-_sD+si+1;
					for(var i=si;i<ei;i++){
						$("#"+that.attr("id")+"_datepanel .midlerow .leftarea td").eq(i).addClass("tdmsel");
					}
					$("#"+that.attr("id")+"_datepanel .midlerow .leftarea td").eq(si).addClass('clktd');	
									
					var firstIndex=self.getWeek(_eY+'/'+_eM+'/01');
					firstIndex--;
					var si=firstIndex,ei=_eD+si;
					for(var i=si;i<ei;i++){
						$("#"+that.attr("id")+"_datepanel .midlerow .rightarea td").eq(i).addClass("tdmsel");
					}
					$("#"+that.attr("id")+"_datepanel .midlerow .rightarea td").eq(ei-1).addClass('clktd');
				}
				$("#"+that.attr("id")+"_datepanel .clktd").removeClass('tdmsel');	
		}
		//-----------------------------------------
		// genMonthPanel
		//-----------------------------------------
		this.createMonthPanel=function(pobj,h_switch){		
				$("#"+that.attr("id")+"_monthpanel").remove();
				$("#"+that.attr("id")+"_datepanel").remove();
				if(pobj.ty==pobj.my){
					 var  newInfoObj=self.getPreMelement(pobj.ty,pobj.tm);
					 pobj.ty=newInfoObj.preYear;
					 pobj.tm=newInfoObj.preMonth;
					 if(pobj.ty==pobj.my){
							pobj.ty=pobj.ty-1; 
					 }
				}
				var monthpanel=$("<div class='"+cssSufix+"_panel' id='"+that.attr("id")+"_monthpanel'></div>"),
				nextYear=pobj.ty==pobj.my?pobj.ty+1:pobj.my,
				topRow=$("<div class='toprow'><em class='pos_tday'>今</em><b class='yL btn_bg'></b><span class='left_txt'>"+pobj.ty+"年</span><div class='title_right'><span class='right_txt'>"+nextYear+"年</span><b class='yR btn_bg'></b></div></div>"),
				midleRow=$("<div class='midlerow'><div class='leftarea' id='mh_area_"+pobj.ty+"'>"+self.getMonths().prop('outerHTML')+"</div><div class='rightarea'  id='mh_area_"+nextYear+"'>"+self.getMonths().prop('outerHTML')+"</div></div>"),
				fotRow=$("<div class='fotRow'><div class='f_left'><span class='firstdate'>&nbsp;</span><b>~</b><span class='lastdate'>&nbsp;</span></div><div class='f_right'><input type='button' class='btndefut' value='确定' /><input type='button' class='btncancel' value='取消' /></div></div>"),
				offset=$("."+cssSufix+" .valarea").offset();				
				paramobj={x:offset.left,y:offset.top};
				monthpanel.css({"top":paramobj.y+40,"left":paramobj.x});
				monthpanel.append(topRow);
				monthpanel.append(midleRow);
				monthpanel.append(fotRow);
				$("body").append(monthpanel);			
				var cur_vals=self.getDateArrs($("#"+that.attr("id")+" .yayigj_year_month_sel .valarea").text());
				//cur_vals=$.trim(cur_vals);
				$("#"+that.attr("id")+"_monthpanel .fotRow .firstdate").text(cur_vals._sy+'-'+cur_vals._sm+'');
				$("#"+that.attr("id")+"_monthpanel .fotRow .lastdate").text(cur_vals._ey+'-'+cur_vals._em+'');				
				
				if(typeof(h_switch)!='undefined'){
					return;	
				}
				/*if(typeof(that.attr('data-sday'))=='undefined'  || that.attr('data-sday')==''){
					return;	
				}*/
				if(cur_vals._sy==cur_vals._ey){				 
					for(var i=	parseInt(cur_vals._sm)-1;i<cur_vals._em;i++){
						$("#"+that.attr("id")+"_monthpanel .midlerow .rightarea td").eq(i).addClass("tdmsel");
					}		
					$("#"+that.attr("id")+"_monthpanel .midlerow .rightarea td").eq(	parseInt(cur_vals._sm)-1).addClass('clktd');
					$("#"+that.attr("id")+"_monthpanel .midlerow .rightarea td").eq(cur_vals._em-1).addClass('clktd');			
				}else{
					for(var i=	parseInt(cur_vals._sm)-1;i<12;i++){
						$("#"+that.attr("id")+"_monthpanel .midlerow .leftarea td").eq(i).addClass("tdmsel");
					}	
					$("#"+that.attr("id")+"_monthpanel .midlerow .leftarea td").eq(	parseInt(cur_vals._sm)-1).addClass('clktd');
					for(var i=	0;i<cur_vals._em;i++){
						$("#"+that.attr("id")+"_monthpanel .midlerow .rightarea td").eq(i).addClass("tdmsel");
					}
					$("#"+that.attr("id")+"_monthpanel .midlerow .rightarea td").eq(cur_vals._em-1).addClass('clktd');		
				}
				$("#"+that.attr("id")+"_monthpanel .clktd").removeClass('tdmsel');
		}
		//-----------------------------------------
		// genUI
		//-----------------------------------------
		this.createUI=function(){
			var top_date_selObj=$("<div class='"+cssSufix+"'></div>"),
			swapObj=$("<div class='swap' onselectstart='return false'><span class='d act'>日</span><span class='m'>月</span></div>"),
			valareaObj=$("<div class='valarea'></div>"),
			rightDown=$("<div class='rightDown' onselectstart='return false'></div>");
			
			top_date_selObj.append(swapObj);
			top_date_selObj.append(valareaObj);
			top_date_selObj.append(rightDown);
			that.append(top_date_selObj);			

			//swapObj.on("click",".d,.m",function(){
			$("#"+that.attr("id")+"  .swap").on("click",".d,.m",function(){
				if($(this).attr("class")=='m'){
					$(this).addClass('act').siblings('.d').removeClass('act');
				}else{
					$(this).addClass('act').siblings('.m').removeClass('act');
				}
			});		
		};
		
		this.getSkinColor=function(){
			 var isExistsCss=function(cssName){
					var js= /js$/i.test(name);
					var es=document.getElementsByTagName(js?'script':'link');
					for(var i=0;i<es.length;i++) 
					if(es[i][js?'src':'href'].indexOf(name)!=-1)return true;
					return false;	
			}
			var thatApplyCss=isExistsCss('r_input');			
				if(thatApplyCss){
					var linkHref=document.styleSheets,cssFileObj=null,icount=linkHref.length;	
					var cssFileObj=[];									
					for(var i=0;i<icount;i++){
						try{
							if(linkHref[i].href.indexOf('r_input.css')>-1 && linkHref[i].href.indexOf('disabled')==-1){								
								cssFileObj.push(linkHref[i].cssRules[7].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[8].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[9].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[10].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								//okbtn
								cssFileObj.push(linkHref[i].cssRules[11].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[12].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[13].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[14].cssText.split('{')[1].replace(/}/g,'').split(';').sort());	
								cssFileObj.push(linkHref[i].cssRules[15].cssText.split('{')[1].split(';'));	
								opts._ipthoverBgColor=cssFileObj[8][0].replace('background-color: ','');
								
								opts._canbtncolrs.normal.bgc=cssFileObj[0][1].split(':')[1];
								opts._canbtncolrs.normal.bdc=cssFileObj[0][2].split(':')[1];
								opts._canbtncolrs.normal.colc=cssFileObj[0][3].split(':')[1];								
								opts._canbtncolrs.hover.bgc=cssFileObj[1][1].split(':')[1];
								opts._canbtncolrs.hover.bdc=cssFileObj[1][2].split(':')[1];
								opts._canbtncolrs.hover.colc=cssFileObj[1][3].split(':')[1];
								opts._canbtncolrs.active.bgc=cssFileObj[2][1].split(':')[1];
								opts._canbtncolrs.active.bdc=cssFileObj[2][2].split(':')[1];
								opts._canbtncolrs.active.colc=cssFileObj[2][3].split(':')[1];
								opts._canbtncolrs.disabled.bgc=cssFileObj[3][1].split(':')[1];
								opts._canbtncolrs.disabled.bdc=cssFileObj[3][2].split(':')[1];
								opts._canbtncolrs.disabled.colc=cssFileObj[3][3].split(':')[1];	
								//okbtn
								opts._okbtncolrs.normal.bgc=cssFileObj[4][1].split(':')[1];
								opts._okbtncolrs.normal.bdc=cssFileObj[4][2].split(':')[1];
								opts._okbtncolrs.normal.colc=cssFileObj[4][3].split(':')[1];								
								opts._okbtncolrs.hover.bgc=cssFileObj[5][1].split(':')[1];
								opts._okbtncolrs.hover.bdc=cssFileObj[5][2].split(':')[1];
								opts._okbtncolrs.hover.colc=cssFileObj[5][3].split(':')[1];
								opts._okbtncolrs.active.bgc=cssFileObj[6][1].split(':')[1];
								opts._okbtncolrs.active.bdc=cssFileObj[6][2].split(':')[1];
								opts._okbtncolrs.active.colc=cssFileObj[6][3].split(':')[1];
								opts._okbtncolrs.disabled.bgc=cssFileObj[7][1].split(':')[1];
								opts._okbtncolrs.disabled.bdc=cssFileObj[7][2].split(':')[1];
								opts._okbtncolrs.disabled.colc=cssFileObj[7][3].split(':')[1];										
								break;
							}
							
						}catch(e){}
					}
					//console.log('opts._okbtncolrs=',opts._okbtncolrs);
				}			
		};
		//-----------------------------------------
		// genPanelEvent
		//-----------------------------------------
		this.eventSet=function(){
			var genEvent=function(obj,cols,maxcount){
				var pPatid=obj.parents('.midlerow').parent().attr("id");
				//console.log('obj=',obj,obj.parents('.midlerow').parent().attr("id"));
				var isLR='',clkObj={tr:null,td:null,pos:null},tdindex=0,ptdindex=0;				
				if(obj.parents('.leftarea').size()>0){isLR='L';}
				if(obj.parents('.rightarea').size()>0){isLR='R';}
				preClkObj={},
				clkObj.pos=isLR;
				clkObj.tr=obj.parent().index();
				clkObj.td=obj.index();	
				tdindex=clkObj.tr*cols+clkObj.td;
				obj.addClass('clktd');
				
				if($("#"+pPatid+".tdmsel").size()>0){
					$("#"+pPatid+" .clktd").removeClass('clktd');					
					$("#"+pPatid+" .tdmsel").removeClass("tdmsel");						
				}else{
					if($("#"+pPatid+" .clktd").size()>2){
							$("#"+pPatid+" .clktd").removeClass('clktd');					
						    $("#"+pPatid+" .tdmsel").removeClass("tdmsel");
							obj.addClass('clktd');
							preClkObj={};
							that.attr('data-clkObj','');
							//return;
					}
			 
					if(typeof(that.attr('data-clkObj'))=='undefined' || that.attr('data-clkObj')==''){						
					}else{
						preClkObj=JSON.parse(that.attr('data-clkObj'));
						ptdindex=preClkObj.tr*cols+preClkObj.td;
						if(clkObj.pos!=preClkObj.pos){
							if(clkObj.pos=='L'){
								for(var i=tdindex;i<=maxcount;i++){
									$("#"+pPatid+" .midlerow .leftarea td:eq("+i+")").addClass('tdmsel');
								}
								for(var j=0;j<=ptdindex;j++){
									$("#"+pPatid+" .midlerow .rightarea td:eq("+j+")").addClass('tdmsel');
								}
							}else{
								for(var i=0;i<=tdindex;i++){
									$("#"+pPatid+" .midlerow .rightarea td:eq("+i+")").addClass('tdmsel');
								}
								for(var j=ptdindex;j<=maxcount;j++){
									$("#"+pPatid+" .midlerow .leftarea td:eq("+j+")").addClass('tdmsel');
								}
							}								
						}else{
							var minv=Math.min(ptdindex,tdindex),maxv=Math.max(ptdindex,tdindex);
							if(clkObj.pos=='L'){									
								for(var i=minv;i<=maxv;i++){
									$("#"+pPatid+" .midlerow .leftarea td:eq("+i+")").addClass('tdmsel');
								}
							}else{
								for(var i=minv;i<=maxv;i++){
									$("#"+pPatid+" .midlerow .rightarea td:eq("+i+")").addClass('tdmsel');
								}
							}
						}				
					}
				}				
				that.attr('data-clkObj',JSON.stringify(clkObj));
				obj.addClass('clktd');	
				//$('.clktd').removeClass('tdmsel');		
				$("#"+pPatid+" .midlerow td .null").parent().removeClass('tdmsel');
				
				var ymType=$("#"+that.attr("id")+" .yayigj_year_month_sel .swap .act").text(),
					  panelID=ymType=='月'?that.attr('id')+'_monthpanel':that.attr('id')+'_datepanel',
					  left_str_var=$("#"+panelID+" .toprow .left_txt").text().replace('年','/').replace('月','/'),
					  right_str_var=$("#"+panelID+" .toprow .title_right .right_txt").text().replace('年','/').replace('月','/');				
				var cnMonth=['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
			 
				var setToText=function(startStr,endStr){
						$("#"+panelID+" .firstdate").text(startStr.replace(/\//g,'-'));	
						$("#"+panelID+" .lastdate").text(endStr.replace(/\//g,'-'));
						that.attr('data-sDay',startStr.replace(/\//g,'-'));
						that.attr('data-eDay',endStr.replace(/\//g,'-'));
						$("#"+that.attr("id")+" .yayigj_year_month_sel .valarea").html(startStr.replace(/\//g,'-')+'&nbsp;~&nbsp;'+endStr.replace(/\//g,'-'));
						var tmpSd=startStr.split('-');
						that.attr('data-curyear',tmpSd[0]);that.attr('data-curmonth',tmpSd[1]);
						$("#"+panelID+"  .clktd").removeClass('tdmsel');		
				};
			 
				var setToMText=function(startStr,endStr){
						$("#"+panelID+" .firstdate").text(startStr.replace('/','-').replace('/01',''));	
						$("#"+panelID+" .lastdate").text(endStr.replace('/','-').replace('/01',''));
						$("#"+that.attr("id")+".yayigj_year_month_sel .valarea").html($(".firstdate").text().replace(/\//g,'-')+'&nbsp;&nbsp;~&nbsp;&nbsp;'+$(".lastdate").text().replace(/\//g,'-'));
						var tmpSd=startStr.split('/');
						that.attr('data-curyear',tmpSd[0]);that.attr('data-curmonth',tmpSd[1]);
						$("#"+panelID+" .clktd").removeClass('tdmsel');		
				};
				
				if(clkObj.pos!=preClkObj.pos && typeof(preClkObj.pos)!='undefined'){
					var firstObj=$("#"+panelID+" .midlerow .leftarea    .tdmsel:first");
					var lastObj=$("#"+panelID+" .midlerow .rightarea  .tdmsel:last");
					if(cols==7){
						var startStr=self.strformat_Date(left_str_var+firstObj.text());	
						var endStr=self.strformat_Date(right_str_var+lastObj.text()); 
						setToText(startStr,endStr);
						//opts._callBack(startStr,endStr,'month');
					}else{
						var startStr=self.strformat_Date(left_str_var+parseInt($.inArray(firstObj.text(),cnMonth)+1)+'/01');	
						var endStr=self.strformat_Date(right_str_var+parseInt($.inArray(lastObj.text(),cnMonth)+1)+'/01'); 	
						setToMText(startStr,endStr);	
					}
				}else{		
					if($("#"+panelID+" .midlerow .leftarea   .tdmsel").size()==0 && $("#"+panelID+" .midlerow .rightarea   .tdmsel").size()==0){ //只有点击一格时处理
							if($("#"+panelID+" .midlerow .leftarea   .clktd").size()>0){
								var leftClkTxt=$("#"+panelID+" .midlerow .leftarea   .clktd").text(),startStr='';
								if(cols==7){
									startStr=self.strformat_Date(left_str_var+leftClkTxt);									
								}else{
									startStr=self.strformat_Date(left_str_var+parseInt($.inArray(leftClkTxt,cnMonth)+1)+'/01');	
									startStr=startStr.replace('/','-').replace('/01','');				
								}
								setToText(startStr,startStr);
							}else{
								var clktds=$("#"+panelID+" .midlerow .rightarea  .clktd").size();
								var rightClkTxt=$("#"+panelID+" .midlerow .rightarea  .clktd").text(),startStr='';
								if(cols==7){
									if(clktds>1){
										startStr=right_str_var+$("#"+panelID+" .midlerow .rightarea  .clktd:eq(0)").text();
										var _endStr=right_str_var+$("#"+panelID+" .midlerow .rightarea  .clktd").last().text();
										setToText(startStr,_endStr);
									}else{
										startStr=self.strformat_Date(right_str_var+rightClkTxt);	
										setToText(startStr,startStr);
									}
								}else{  //年的
									if(clktds>1){
										var _frttxt=$("#"+panelID+" .midlerow .rightarea  .clktd:eq(0)").text();
										var _lsttxt=$("#"+panelID+" .midlerow .rightarea  .clktd").last().text();
										startStr=self.strformat_Date(right_str_var+parseInt($.inArray(_frttxt,cnMonth)+1)+'/01');
										var endStr=self.strformat_Date(right_str_var+parseInt($.inArray(_lsttxt,cnMonth)+1)+'/01');
										setToMText(startStr,endStr);										
									}else{
										startStr=self.strformat_Date(right_str_var+parseInt($.inArray(rightClkTxt,cnMonth)+1)+'/01');
										startStr=startStr.replace('/','-').replace('/01','');		
										setToMText(startStr,startStr);
									}									
								}									
							}
					}else{				
											
						if($("#"+panelID+" .midlerow .leftarea   .tdmsel").size()>0){						
							var firstObj=$("#"+panelID+" .midlerow .leftarea  .tdmsel:first");
							var lastObj=$("#"+panelID+" .midlerow .leftarea  .tdmsel:last");		
							if(cols==7){							
								var startStr=self.strformat_Date(left_str_var+firstObj.text());	
								var endStr=self.strformat_Date(left_str_var+lastObj.text()); 
								setToText(startStr,endStr);
								//opts._callBack(startStr,endStr,'month');	
							}else{
								var startStr=self.strformat_Date(left_str_var+parseInt($.inArray(firstObj.text(),cnMonth)+1)+'/01');	
								var endStr=self.strformat_Date(left_str_var+parseInt($.inArray(lastObj.text(),cnMonth)+1)+'/01'); 
								setToMText(startStr,endStr);	
								//opts._callBack(startStr,endStr,'year');							
							}		
						}else{
							var firstObj=$("#"+panelID+" .midlerow .rightarea  .tdmsel:first");
							var lastObj=$("#"+panelID+"  .midlerow  .rightarea  .tdmsel:last");
							if(cols==7){
								var startStr=self.strformat_Date(right_str_var+firstObj.text());	
								var endStr=self.strformat_Date(right_str_var+lastObj.text()); 	
								setToText(startStr,endStr);							
								//opts._callBack(startStr,endStr,'month');	
							}else{
								var startStr=self.strformat_Date(right_str_var+parseInt($.inArray(firstObj.text(),cnMonth)+1)+'/01');	
								var endStr=self.strformat_Date(right_str_var+parseInt($.inArray(lastObj.text(),cnMonth)+1)+'/01'); 
								setToMText(startStr,endStr);	
								//opts._callBack(startStr,endStr,'year');										
							}
						}
					}				 
				}
			}		
			//------------------------------	
			$(".ymsel_year_cn").on("click","td",function(e){
				genEvent($(this),4,12);
				});	

			$(".ymsel_date_cn").on("click","td",function(e){
				if($(this).find('.null').size()>0  || $(this).find('.invalid').size()>0){
					return;
				}
				genEvent($(this),7,42);
			}).on("mouseenter","td",function(){
				if($(this).find('.null').size()>0 || $(this).find('.invalid').size()>0){					
				}else{
					$(this).css("cursor","pointer");	
				}
				});	

			$(".toprow").on("click",".yL,.mL,.mR,.yR",function(e){
				var h_switch=1;
				that.attr('data-sday','');
				that.attr('data-clkObj','');			
				var clkCls=e.target.className.replace(' btn_bg',''),
				_y=parseInt(that.attr('data-curyear')),
				_m=parseInt(that.attr('data-curmonth')),
				ymType=$("#"+that.attr("id")+" .yayigj_year_month_sel .swap .act").text(),
				panelID=ymType=='月'?that.attr('id')+'_monthpanel':that.attr('id')+'_datepanel';	
								
				var setDataSave=function(_y,_y2,atM,adM){
					that.attr('data-YearStart',	_y+'年');
					that.attr('data-YearEnd',	_y2+'年');
					that.attr('data-MonthStart',	_y+'年'+atM+'月');
					that.attr('data-MonthEnd',	_y+'年'+adM+'月');
				};				
				var setYearData=function(_y,h_switch){
					var attrM=parseInt(that.attr('data-curmonth')),addM=attrM+1;
						  attrM=attrM<10?'0'+attrM:attrM;
						  addM=addM<10?'0'+addM:addM;
					if(ymType=='月'){
						$("#"+panelID+" .toprow .left_txt").text(_y+'年');
						$("#"+panelID+" .toprow .title_right .right_txt").text((_y+1)+'年');						
						that.attr('data-clkobj','');	
						that.attr('data-YearStart',	_y+'年');
						that.attr('data-YearEnd',	(_y+1)+'年');
						setDataSave(_y,(_y+1),attrM,addM);
						//$("#"+panelID+" .midlerow .tdmsel").removeClass('tdmsel');
						//$("#"+panelID+" .midlerow .clktd").removeClass('clktd');
					}else{
						$("#"+panelID+" .toprow .left_txt").text(_y+'年'+attrM+'月');
						$("#"+panelID+" .toprow .title_right  .right_txt").text((_y)+'年'+addM+'月');
						setDataSave(_y,_y,attrM,addM);	
						self.createDatePanel({ty:_y,tm:attrM,my:_y,mm:addM},h_switch);	
						self.eventSet();				
					}						
				};
				
				var setMonthData=function(_y,_m,_d,h_switch){
					that.attr('data-curyear',_y);	
					var attrM=_m,addM=attrM+1;					
					  attrM=attrM<10?'0'+parseInt(attrM):attrM;
					  addM=addM<10?'0'+parseInt(addM):addM;				
					if(ymType=='月'){
						$("#"+panelID+" .toprow .left_txt").text(_y+'年');
						$("#"+panelID+" .toprow .title_right .right_txt").text(_y+'年');						
					}else{
						$("#"+panelID+" .toprow .left_txt").text(_y+'年'+attrM+'月');
						if(addM==13){
							$("#"+panelID+" .toprow .title_right  .right_txt").text((_y+1)+'年01月');
							if(_d=='L'){
								self.createDatePanel({ty:_y,tm:12,my:_y+1,mm:'01'},h_switch);	
							}else{
								self.createDatePanel({ty:_y,tm:attrM,my:_y+1,mm:'01'},h_switch);	
							}
							self.eventSet();
						}else{
							$("#"+panelID+" .toprow .title_right  .right_txt").text(_y+'年'+addM+'月');	
							self.createDatePanel({ty:_y,tm:attrM,my:_y,mm:addM},h_switch);	
							self.eventSet();
						}						
					}	
				};
				
				switch(clkCls){
					case 'yL':							
						var obj_cls=$("#"+that.attr("id")+"  .yayigj_year_month_sel .swap .act").attr("class").replace(' act','');
						if(obj_cls=='d'){
							that.attr('data-curyear',(--_y));
							setYearData(_y,h_switch);		
						}else{
							that.attr('data-curyear',(--_y));
							setYearData(_y,h_switch);	
							var id=that.attr("id")+'_monthpanel';
							$("#"+id+" .midlerow .clktd").removeClass('clktd');
							$("#"+id+" .midlerow .tdmsel").removeClass('tdmsel');
						}
						break;
					case 'yR':	
						if(obj_cls=='d'){
							that.attr('data-curyear',(++_y));
							setYearData(_y,h_switch);	
						}else{
							that.attr('data-curyear',(++_y));
							setYearData(_y,h_switch);	
							var id=that.attr("id")+'_monthpanel';
							$("#"+id+" .midlerow .clktd").removeClass('clktd');
							$("#"+id+" .midlerow .tdmsel").removeClass('tdmsel');
						}
						break;			
					case 'mL':	
						if(_m==1){							
							setMonthData(--_y,12,'L');	
							that.attr('data-curmonth',12);							
						}else{
							that.attr('data-curmonth',(--_m));							
							setMonthData(_y,_m,'L',h_switch);
						}						
						break;
					case 'mR':	
						if(_m==12){											
							setMonthData(++_y,1,'R',h_switch);	
							that.attr('data-curmonth',1);							
						}else{
							that.attr('data-curmonth',(++_m));
							setMonthData(_y,_m,'R',h_switch);
						}		
						break;						
				}				
				});		
		}
		//-----------------------------------------
		// head event
		//-----------------------------------------
		this.swapYM=function(){				
			$("#"+that.attr("id")+" .yayigj_year_month_sel .valarea").hover(
				function(){
					$("#"+that.attr("id")+" .yayigj_year_month_sel .rightDown").addClass('acbgjt');					
					$("#"+that.attr("id")+" .valarea").css({"border-color":opts._okbtncolrs.normal.bgc,"background-color":opts._ipthoverBgColor});
					$("#"+that.attr("id")+" .rightDown").css({"border-color":opts._okbtncolrs.normal.bgc,"background-color":opts._ipthoverBgColor});
					},
				function(){
					if(	parseInt($(".yayigj_year_month_sel .valarea").attr('data-clk'))==1){
					}else{					
						$("#"+that.attr("id")+" .yayigj_year_month_sel .rightDown").removeClass('acbgjt');
						$("#"+that.attr("id")+" .valarea").css({"border-color":"#e0e0e0","background-color":"#fff"});	
						$("#"+that.attr("id")+" .rightDown").css({"border-color":"#e0e0e0","background-color":"#fff"});	
					}
					}
			);		
			//----------	
			$("#"+that.attr("id")+" .yayigj_year_month_sel").on("click",".valarea,.rightDown",function(e){	
				//console.log($(this).parent().parent().attr("id"),that.attr("id"));
				//return;	
				if(e.target.className=='valarea'){$("#"+that.attr("id")+" .yayigj_year_month_sel .valarea").attr('data-clk','1');};							
				var obj_cls=$("#"+that.attr("id")+" .yayigj_year_month_sel .swap .act").attr("class").replace(' act','');
				var 	todayObj=self.todayDateInterval()
						todayYear=todayObj.startY,
						todayMonth=todayObj.startM,
						predateObj=self.getPreMelement(todayYear,todayMonth);				
				var   mornYear=todayMonth==11?todayYear+1:todayYear,mornMonth=todayMonth==11?1:todayMonth+1;
				
				that.attr('data-clkobj','');						
				var textArrs=self.getTextDateInfo(that.attr("id"));	
				//console.log('textArrs=',textArrs);			
				/*var cur_vals=$(".yayigj_year_month_sel .valarea").text().split('~'),
				      start_parms=cur_vals[0].replace('年','-').replace('月','').split('-'),
					  end_parms=cur_vals[1].replace('年','-').replace('月','').split('-');*/
				todayYear=	parseInt(textArrs.startparam[0]);
				todayMonth=parseInt(textArrs.startparam[1]);
				todayDay=		parseInt(textArrs.startparam[2]);
				mornYear=		parseInt(textArrs.endparam[0]);
				mornMonth=	parseInt(textArrs.endparam[1]);
				mornDay=		parseInt(textArrs.endparam[2]);				
				switch(obj_cls){
					case "d":	
						self.createDatePanel({ty:todayYear,tm:todayMonth,td:todayDay,my:mornYear,mm:mornMonth,md:mornDay});
						break;
					case "m":	
						self.createMonthPanel({ty:todayYear,tm:todayMonth,td:todayDay,my:mornYear,mm:mornMonth,md:mornDay});
						$("#"+that.attr("id")+" .yayigj_year_month_sel_panel .toprow .mL").hide();
						$("#"+that.attr("id")+" .yayigj_year_month_sel_panel .toprow .title_right .mR").hide();	
						break;		
				}
				self.eventSet();
				$("#"+that.attr("id")+" .valarea").css("border-color",opts._borderColor);		 
				$("#"+that.attr("id")+" .rightDown").css("border-color",opts._borderColor);		 
			});			
			
			$(document).off("click",".toprow .pos_tday").on("click",".toprow .pos_tday",function(){
				//console.log('pos_tday');
				var obj_cls=$("#"+that.attr("id")+"  .yayigj_year_month_sel .swap .act").attr("class").replace(' act','');
				var 	todayObj=self.todayDateInterval(),todayYear=todayObj.startY,todayMonth=todayObj.startM;						
				var   mornYear=todayMonth==11?todayYear+1:todayYear,mornMonth=todayMonth==11?1:todayMonth+1;
				$(".midlerow .clktd").removeClass('clktd');		
				that.attr('data-sday','');	
				that.attr('data-clkObj','');		
				var panelID=obj_cls=='d'?that.attr('id')+'_datepanel':that.attr('id')+'_monthpanel';		
				if(obj_cls=='d'){
					self.setToday();	
					var _d=	new Date(todayObj.firstDate);
					_d.setMonth(_d.getMonth()-1);
					//console.log('newFDate=',_d.getFullYear(),_d.getMonth(),_d.getDate());
					//self.createDatePanel({ty:todayYear,tm:todayMonth,td:todayDay,my:mornYear,mm:mornMonth,md:mornDay});						
					self.createDatePanel({ty:_d.getFullYear(),tm:_d.getMonth()+1,td:_d.getDate(),my:mornYear,mm:mornMonth,md:mornDay});		
				}else{
					self.createMonthPanel({ty:todayYear,tm:todayMonth,td:todayDay,my:mornYear,mm:mornMonth,md:mornDay});
					//console.log('todayYear=',todayYear,'todayMonth=',todayMonth,'mornYear=',mornYear,'mornDay=',mornDay);
					if(todayYear==mornYear){
						$("#"+panelID+" .fotRow .firstdate").text(todayYear+'-01');
						$("#"+panelID+" .fotRow .lastdate").text(mornYear+'-12');	
						that.attr('data-curyear',todayYear);
						that.attr('data-curmonth','1');	
					}
					$("#"+that.attr("id")+"  .yayigj_year_month_sel .valarea").html(todayYear+'-01&nbsp;~&nbsp;'+mornYear+'-12');
					//$("#"+that.attr("id")+"  .yayigj_year_month_sel_panel .toprow .mL").hide();
					//$("#"+that.attr("id")+"  .yayigj_year_month_sel_panel .toprow .title_right .mR").hide();	
				}					
				self.eventSet();				
			});			
			$(document).off("click",'.btncancel').on("click",'.btncancel',function(){				
				//console.log($(this).parents('.yayigj_year_month_sel_panel').attr("id"));
				var topPat=$(this).parents('.yayigj_year_month_sel_panel').attr("id"),p_id=topPat.split('_')[0];
				//console.log('p_id=',p_id);
				//$("#"+p_id+" .yayigj_year_month_sel_panel").hide();					
				$("#"+topPat).hide();
				$("#"+p_id+" .yayigj_year_month_sel .valarea").attr('data-clk','');	
				$("#"+p_id+" .yayigj_year_month_sel .rightDown").removeClass('acbgjt');	
				//$(".valarea,.rightDown").css("border-color","#ccc");				
				$("#"+p_id+" .yayigj_year_month_sel .valarea").css({"border-color":"#e0e0e0","background-color":"#fff"});
				$("#"+p_id+" .yayigj_year_month_sel .rightDown").css({"border-color":"#e0e0e0","background-color":"#fff"});
				});
			//--------------	
			$(document).on("click",'#'+that.attr("id")+"_datepanel .btndefut",function(){	
				var topPat=$(this).parents('.yayigj_year_month_sel_panel').attr("id"),p_id=topPat.split('_')[0];
				$("#"+p_id+" .yayigj_year_month_sel .valarea").html($.trim($("#"+topPat+" .firstdate").text().replace(/\//g,'-'))+'&nbsp;~&nbsp;'+$("#"+topPat+" .lastdate").text().replace(/\//g,'-'));					
				var dd = new Date($("#"+topPat+" .lastdate").text().replace(/-/g,'/').replace(/\s/g,"")); 	
				dd.setDate(dd.getDate()+1);	
				opts._callBack($("#"+topPat+" .firstdate").text().replace(/-/g,'/').replace(/\s/g,""),self.format_Date(dd),'month');
				$("#"+topPat).hide();	
				$("#"+p_id+" .valarea,.rightDown").css({"border-color":"#e0e0e0","background-color":"#fff"});
				$("#"+p_id+" .yayigj_year_month_sel .valarea").attr('data-clk','');	
				$("#"+p_id+" .yayigj_year_month_sel .rightDown").removeClass('acbgjt');
			});
			$(document).on("click",'#'+that.attr("id")+"_monthpanel .btndefut",function(){	
				var topPat=$(this).parents('.yayigj_year_month_sel_panel').attr("id"),p_id=topPat.split('_')[0];
				$("#"+p_id+" .yayigj_year_month_sel .valarea").html($.trim($("#"+topPat+" .firstdate").text().replace(/\//g,'-').replace(/\s/g,""))+'&nbsp;~&nbsp;'+$("#"+topPat+"  .lastdate").text().replace(/\//g,'-').replace(/\s/g,""));
				var e_Dates=$("#"+topPat+" .lastdate").text().replace('年','/').replace('月','').split('-'),e_y=e_Dates[0],e_m=parseInt(e_Dates[1])+1,e_d='01';
					  e_m=e_m<10?'0'+e_m:e_m; e_y=e_m==13?++e_y:e_y;	  e_m=e_m==13?'01':e_m;	
				opts._callBack($("#"+topPat+" .firstdate").text().replace(/-/g,'/')+'/01',e_y+'/'+e_m+'/'+e_d,'year');
				$("#"+topPat).hide();	
				$("#"+p_id+" .valarea,.rightDown").css({"border-color":"#e0e0e0","background-color":"#fff"});
				$("#"+p_id+" .yayigj_year_month_sel .valarea").attr('data-clk','');	
				$("#"+p_id+" .yayigj_year_month_sel .rightDown").removeClass('acbgjt');
			});
			/*$(document).on("click",'.yayigj_year_month_sel_panel .btndefut',function(){	
				//console.log($(this).parents('.yayigj_year_month_sel_panel').attr("id"));
				var topPat=$(this).parents('.yayigj_year_month_sel_panel').attr("id"),p_id=topPat.split('_')[0];
						 
				var obj_cls=$("#"+p_id+" .yayigj_year_month_sel .swap .act").attr("class").replace(' act','');
				if(obj_cls=='d'){
					$("#"+p_id+" .yayigj_year_month_sel .valarea").html($.trim($("#"+topPat+" .firstdate").text().replace(/\//g,'-'))+'&nbsp;~&nbsp;'+$("#"+topPat+" .lastdate").text().replace(/\//g,'-'));					
					var dd = new Date($("#"+topPat+" .lastdate").text().replace(/-/g,'/').replace(/\s/g,"")); 	
					dd.setDate(dd.getDate()+1);	
					opts._callBack($("#"+topPat+" .firstdate").text().replace(/-/g,'/').replace(/\s/g,""),self.format_Date(dd),'month');
				}else{
					$("#"+p_id+" .yayigj_year_month_sel .valarea").html($.trim($("#"+topPat+" .firstdate").text().replace(/\//g,'-').replace(/\s/g,""))+'&nbsp;~&nbsp;'+$("#"+topPat+"  .lastdate").text().replace(/\//g,'-').replace(/\s/g,""));
					var e_Dates=$("#"+topPat+" .lastdate").text().replace('年','/').replace('月','').split('-'),e_y=e_Dates[0],e_m=parseInt(e_Dates[1])+1,e_d='01';
					      e_m=e_m<10?'0'+e_m:e_m; e_y=e_m==13?++e_y:e_y;	  e_m=e_m==13?'01':e_m;	
					opts._callBack($("#"+topPat+" .firstdate").text().replace(/-/g,'/')+'/01',e_y+'/'+e_m+'/'+e_d,'year');
				}
				//$("#"+topPat+" .yayigj_year_month_sel_panel").hide();	
				$("#"+topPat).hide();	
				//$(".valarea,.rightDown").css("border-color","#ccc");	
				$("#"+p_id+" .valarea,.rightDown").css({"border-color":"#e0e0e0","background-color":"#fff"});
				$("#"+p_id+" .yayigj_year_month_sel .valarea").attr('data-clk','');	
				$("#"+p_id+" .yayigj_year_month_sel .rightDown").removeClass('acbgjt');		
				});	*/
			//--------------	
			$("#"+that.attr("id")+" .yayigj_year_month_sel").on("click",".d,.m",function(e){
				that.attr('data-sday','');	
				var desc=e.target.className.replace(' act','');
				var today_ars=self.todayDateInterval();
				switch(desc){
					case "d":						
						$("#"+that.attr("id")+" .yayigj_year_month_sel .valarea").html(today_ars.firstDate.replace(/\//g,'-').substring(0,7)+'-01'+'&nbsp;~&nbsp'+today_ars.lastDate.replace(/\//g,'-'));
						var dd = new Date(today_ars.lastDate); 	
						var tmpY=today_ars.firstDate.substring(0,4);
						dd.setDate(dd.getDate()+1);	
						opts._callBack(today_ars.firstDate.substring(0,7)+'/01',self.format_Date(dd),'month');	
						if(tmpY==today_ars.lastDate.substring(0,4) && today_ars.firstDate.substring(5,7)=='01'){
							that.attr('data-curyear',parseInt(tmpY)-1);
							that.attr('data-curmonth','12');	
						}else{
							that.attr('data-curyear',tmpY);
							that.attr('data-curmonth',new Date(today_ars.firstDate).getMonth());	
							//console.log(new Date(today_ars.firstDate).getMonth());
						}					
						break;
					case "m":
						var _m=today_ars.trueFDate.getMonth()+1;
						var dd = new Date(today_ars.lastDate.substring(0,4)+'/12/31');
						var tmpY=today_ars.firstDate.substring(0,4);
						dd.setDate(dd.getDate()+1);	
						_m=_m<10?'0'+_m:_m;						
						$("#"+that.attr("id")+" .yayigj_year_month_sel .valarea").html(today_ars.firstDate.replace(/\//g,'-').substring(0,4)+'-01'+'&nbsp;&nbsp;~&nbsp;&nbsp;'+today_ars.lastDate.replace(/\//g,'-').substring(0,4)+'-12');						
						opts._callBack(today_ars.firstDate.substring(0,4)+'/01/01',self.format_Date(dd),'year');
						if(tmpY==today_ars.lastDate.substring(0,4)){
							that.attr('data-curyear',parseInt(tmpY)-1);
							that.attr('data-curmonth','1');	
						}else{
							that.attr('data-curyear',tmpY);
							that.attr('data-curmonth','1');	
						}
						break;		
				}
				$(".yayigj_year_month_sel_panel").hide();
				});
			}		
					
		//-----------------------------------------		
		// init
		//-----------------------------------------
		this.init=function(){
			this.getSkinColor();
			this.createCss();
			this.createUI();	
			this.swapYM();		
			this.setToday();	
		}		
		this.init();  
	}
	
	$.fn.yayigj_year_month_sel = function(parameter,callback) {
			if(typeof parameter=='function'){
				callback=parameter;
				parameter={};
			}else{
				parameter=parameter||{};
				callback=callback||function(){};
			}
			var options=$.extend({},defaults,parameter);
			return this.each(function(){
				var yearMonth_obj=new yearMonthSelObj(this,options);
				callback(yearMonth_obj);
			});
	};	
})(jQuery);   	