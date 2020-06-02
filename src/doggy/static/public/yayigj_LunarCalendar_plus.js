//-------------------------------
// 农历插件(需要外部引用农历函数库)
// 2017/06/03 [zlb]
//-------------------------------
;(function($) {
	var defaults={
		_borderColor:'#e0e0e0',	
		_activeColor:'#47a6a0', //00AEA2
		_hoverColor:'#47a6a0', //00CAB6
		_hoverBgColor:'#F2FFFE',	
		_hiddenID:'',
		_ico:"/static/public/img/selecticon.png",
		_icoActive:"/static/public/img/selecticon_active.png",
		_callBack:null,
		_isDefaultSel:true,
		_isLocation:true,
		callbackDayClk:null,
		_isDisbBeforeDt:false,  //禁选当前日期以前的日期
		_isDayWekMode:0  //0表示天模式 1表示周模式
	};
	//-------------------------------------------------------
	var lunarCaleObj=function(element,options){
		var ops=options,
		that=$(element),
		thatApplyCss=false,
		cur_month=new Date().getMonth(),
		cur_year=new Date().getFullYear(),
		cur_day=new Date().getDate(),
		AddMonthCount=0,
		self=this;
		that.off('mouseleave').on("mouseleave",function(){
			if(ops._isShow){
			}else{
				that.hide();
			}
		});
		//--------------------------------------------------------
		this.getAstro=function(m,d){
			return "魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯".substr(m*2-(d<"102223444433".charAt(m-1)- -19)*2,2);	
		}
		//--------------------------------------------------------	
	   this.changeYm=function(add_dec){
		    add_dec==1?++AddMonthCount:--AddMonthCount;
			//console.log('AddMonthCount=',AddMonthCount);
			var now = new Date();
		    var nDt=new Date(now.getFullYear(),now.getMonth(),1);
		    nDt.setMonth(nDt.getMonth() + AddMonthCount);  
			cur_year=nDt.getFullYear();cur_month=nDt.getMonth();
   			this.GenDates(cur_year,cur_month);
	   }
	   this.gen_other_info=function(y,m,d){
			var astro=this.getAstro(m,d);
			var nl_info=yayigj_lunar(new Date(y,m,d));
			var otherinfo='('+astro+'座) '+nl_info.animal+'年'+nl_info.lMonth+'月'+nl_info.lDate; 
			 that.find('.titlearea').children('.oth').text(otherinfo);
	   }
	   this.set_title_event=function(owner,ad){
		    self.changeYm(ad);
			//owner.siblings('.a_d').text(self.date_format(new Date(cur_year,cur_month,cur_day),'z'));
			//self.gen_other_info(cur_year,cur_month,cur_day);			
	   }
	   //取本周第一天和最后一天
		this.getWeekStartAndEnd=function(pdate) {  
			var startStop = new Array();  
			var millisecond = 1000 * 60 * 60 * 24;  
			var currentDate = new Date(pdate);
			currentDate = new Date(currentDate.getTime() + (millisecond * 7*AddWeekCount));
			var week = currentDate.getDay();  
			var month = currentDate.getDate(); 
			var minusDay = week != 0 ? week - 1 : 6;  
			var currentWeekFirstDay = new Date(currentDate.getTime() - (millisecond * minusDay));  
			 var currentWeekLastDay = new Date(currentWeekFirstDay.getTime() + (millisecond * 6));
			startStop.push(self.date_format(currentWeekFirstDay,'z'));  
			startStop.push(self.date_format(currentWeekLastDay,'z'));   
			startStop.push(self.date_format(currentWeekFirstDay));  
			startStop.push(self.date_format(currentWeekLastDay));   
			return startStop;  
		}
		//--------------------------------------------------------
		this.createUI=function(){
			var astro=this.getAstro(new Date().getMonth(),new Date().getDate());
			var nl_info=yayigj_lunar(new Date());
			var otherinfo='('+astro+'座) '+nl_info.animal+'年'+nl_info.lMonth+'月'+nl_info.lDate;
			var frme=$('<div class="titlearea"><span class="pre"></span><span class="tdy">今</span><span class="nxt"></span><span class="a_d">'+this.date_format(new Date(),1)+'</span><span class="oth">'+otherinfo+'</span></div>'+
							    '<div class="content"></div>');
			var month_panel='<table id="tb_month_cale_plus" width="100%" height="100%" border="0" cellpadding="0" cellspacing="0">'+
                        '<thead><tr><th>一</th><th>二</th><th>三</th><th>四</th><th>五</th><th>六</th><th>日</th></tr></thead>'+
                         ' <tbody><tr><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td></tr>'+
                          ' <tr><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td></tr>'+
						   '<tr><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td></tr>'+
						   '<tr><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td></tr>'+
						   '<tr><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td></tr>'+
						   '<tr><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td><td><div class="d"></div><u></u></td></tr> </tbody>'+
                      '</table>';
			that.append(frme);
			
			that.find('.titlearea').children('.tdy').css("visibility","visible");	
			that.find('.content').append(month_panel);
			that.find('.titlearea').children('.pre').off("click").on("click",function(){
				that.find('.titlearea').children('.tdy').css("visibility","visible");
				self.set_title_event($(this),-1);
				});
			that.find('.titlearea').children('.nxt').off("click").on("click",function(){
				that.find('.titlearea').children('.tdy').css("visibility","visible");
				self.set_title_event($(this),1);			
				});	
			that.find('.titlearea').children('.tdy').off("click").on("click",function(){
				  $(this).css("visibility","hidden");
				  if(ops._isDayWekMode==0){ 
						  AddMonthCount=-1;
						  cur_day=new Date().getDate();
						  self.set_title_event($(this),1);					  
						  if(ops.callbackDayClk!=null){
							 var _tday=self.date_format(new Date()).split(' ')[0];
							ops.callbackDayClk(_tday);
						}						
				 }else{
					 try{
					 	that.find('.content').find("tr").removeClass('wekmde');						
						var pat=that.find(".content td[data-ymd='"+self.date_format(new Date()).split(' ')[0]+"'] .d").parent().parent().addClass('wekmde');					
						if(pat.length==0){
							var nDt=new Date();
							self.GenDates(nDt.getFullYear(),nDt.getMonth());	
							pat=that.find(".content td[data-ymd='"+self.date_format(new Date()).split(' ')[0]+"'] .d").parent().parent().addClass('wekmde');
						}
						var st=pat.find("td:eq(0)").attr('data-ymd');
						var et=pat.find("td").last().attr('data-ymd');
							
						if(ops.callbackWekClk!=null){
							ops.callbackWekClk([date_format(new Date(st),'z'),date_format(new Date(et),'z'),st,et]);
						}
					 }catch(e){
							console.log(e); 
					 }
				 }
				 that.find('.content .dsel').removeClass('dsel');
				});	
			//---------------------	
			that.find('.content').off("click",".d").on("click",".d",function(){	
			   var _nsel=$(this).parent().attr("class");
			   if(typeof(_nsel)!='undefined' && _nsel.indexOf('noclk')>-1){
					return;   
			   }
				var ymdStr=$(this).parent().attr('data-ymd');
				var ymdDt=new Date(ymdStr);
				var _pat=$(this).parent();
				that.find('.content .au').removeClass("au");
				that.find('.content .tdplus_td_is_today').next('u').addClass("au");
	
				$(this).next("u").addClass("au");
				self.gen_other_info(ymdDt.getFullYear(),ymdDt.getMonth(),ymdDt.getDate());
				that.find('.titlearea').children('.a_d').text(self.date_format(new Date($(this).parent().attr('data-ymd')),1));
				
				that.find('.content').find("tr").removeClass('wekmde');
				
				if(ops._isDayWekMode==0){  //天模式s					
					if(ops.callbackDayClk!=null){
						ops.callbackDayClk($(this).parent().attr('data-ymd'));
					}
				}else{
					var pat=$(this).parent().parent().addClass('wekmde');
					var st=pat.find("td:eq(0)").attr('data-ymd');
					var et=pat.find("td").last().attr('data-ymd');
					if(ops.callbackWekClk!=null){
						ops.callbackWekClk([self.date_format(new Date(st),'z'),self.date_format(new Date(et),'z'),st,et]);
					}
				}
				
				if(typeof($(this).parent().attr('class'))!='undefined'  && $(this).parent().attr('class')=='invalid'){
					self.GenDates(ymdDt.getFullYear(),ymdDt.getMonth());
					that.find('.content .dsel').removeClass('dsel');					
					window.setTimeout(function(){
					that.find('.content td[data-ymd="'+ymdStr+'"] .d').addClass('dsel');
					},200);
				}else{
					that.find('.content .dsel').removeClass('dsel');
					$(this).addClass('dsel');
				}
				
			});
		}	  
	   //--------------------------------------------------------	
	   this.date_format=function(dt,cn){
			var date = dt;
			var seperator1 = "/";
			var seperator2 = ":";
			var month = date.getMonth() + 1;
			var strDate = date.getDate();
			if (month >= 1 && month <= 9) {
				month = "0" + month;
			}
			if (strDate >= 0 && strDate <= 9) {
				strDate = "0" + strDate;
			}
			var _h=date.getHours(); _h=_h<10?'0'+_h:_h;
			var _m=date.getMinutes();_m=_m<10?'0'+_m:_m;
			var _s=date.getSeconds();_s=_s<10?'0'+_s:_s;
			var currentdate ='';
			if(typeof(cn)!='undefined'){
				currentdate = date.getFullYear() + '年' + month + '月' + strDate+ "日" ;	
			}else{
				 currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
						+ " " + _h + seperator2 + _m+ seperator2 + _s;
			}
			return currentdate;
		}
	   //--------------------------------------------------------
	   this.set_day_cnt=function(arr){
			that.find(".content td  u").hide();
			$.each(arr,function(k,v){		
				var p_obj=that.find(".content td[data-ymd='"+v.scheduledate.replace(/-/g,'/')+"'] .d");	
				try{
					if(p_obj.attr("class").indexOf('tdplus_td_is_today')>-1){
						p_obj.next("u").addClass('au');
					}else{
						p_obj.next("u").removeClass('au');
					}
				}catch(e){}
				p_obj.next("u").text(v.count).show();	
			});
	   }
	   //--------------------------------------------------------
	   this.set_dw_mode=function(md,dtpars){
		   ops._isDayWekMode=md;	
		   that.find('.content').find("tr").removeClass('wekmde');	   
		   switch(md){
			   case 0:			   		
			   		break;
			   case 1:
			   		if(typeof(dtpars)!='undefined'){ 
						that.find(".content td[data-ymd='"+dtpars+"'] .d").parent().parent().addClass('wekmde');
					}
			   		break;
		   }		   
	   }
	   //--------------------------------------------------------	
	   this.circlegoto=function(dt){
		   that.find(".content td[data-ymd='"+dt+"'] .dsel").removeClass('dsel');
		   that.find(".content td[data-ymd='"+dt+"'] .d").addClass('dsel');
	   }
	   //--------------------------------------------------------	
	   this.GenDates=function(yy,mm,dd){		 
	   		//console.log(cur_day); 
			cur_year=yy;
			cur_month=mm;
			typeof(dd)!='undefined'?cur_day=dd:'';
	   		$("#calend_panel .a_d").text(self.date_format(new Date(yy,mm,cur_day),'z'));
			self.gen_other_info(yy,mm,cur_day);		
	   		 var GetDateStr=function(date,AddDayCount){		
				var dd = new Date(date); 	
				dd.setDate(dd.getDate()+AddDayCount);		
				return dd; 
			};
			var getWeek=function(date){
					 var nD=new Date(date);
					 return nD.getDay()>0?nD.getDay():7;
			 };	
			var getMonthLast=function(y,m){
				 var date=new Date(y+'/'+parseInt(m+1)+'/01'),
				 currentMonth=date.getMonth(),
				 nextMonth=++currentMonth,
				 nextMonthFirstDay=new Date(date.getFullYear(),nextMonth,1);
				 return new Date(nextMonthFirstDay);
			};		
			that.find('.content').find(".invalid").removeClass('invalid');
			that.find('.content').find(".tdplus_td_is_today").removeClass('tdplus_td_is_today');
			
			var curYear=yy!=''?yy:parseInt(newDate().getFullYear());
			var curMonth=mm!==''?mm:parseInt(newDate().getMonth());
			var FirstDate=curYear+'/'+parseInt(curMonth+1)+'/01',
				  f_date_obj=new Date(FirstDate),
				  e_date_obj=getMonthLast(curYear,curMonth),
				  curWeek=getWeek(FirstDate),
				  t_obj=that.find('.content').children('table'),
				  t_obj_body=t_obj.children("tbody"),	  
				  startDay=GetDateStr(FirstDate,-curWeek+1),
				  posDate=new Date(),
				  curDay=startDay;		
				  //console.log(curDay.toLocaleString());
				
				t_obj_body.find("td").each(function(k,v){				
					if(curDay<f_date_obj || curDay>=e_date_obj){	
							var nl_info=yayigj_lunar(curDay),termFestival=nl_info.festival()[0];
							var LunarDay=nl_info.lDate;
							$(v).addClass('invalid');
							$(v).attr('data-ymd',self.date_format(curDay).split(' ')[0]);	
							$(v).children('.d').html("<em><span class='_day'>"+curDay.getDate()+"</span><br/><b>"+LunarDay+"</b></em>");
					}else{							
							var nl_info=yayigj_lunar(curDay),LunarDay=nl_info.lDate,fes=nl_info.festival();	
							if(nl_info.term){LunarDay='<span style="color:#83a3ed" title="'+nl_info.term+'">'+nl_info.term+'</span>';}
							if(fes && fes.length>0){LunarDay='<span style="color:#47a6a0"  title="'+$.trim(fes[0].desc)+'">'+$.trim(fes[0].desc)+'</span>';}
							
							if(LunarDay.trim()=='初一'){	LunarDay='<span class="_mth">'+nl_info.lMonth+'月</span>';	}	
							$(v).attr('data-ymd',self.date_format(curDay).split(' ')[0]);	
							var before_dt=self.date_format(curDay).split(' ')[0],after_dt=self.date_format(new Date()).split(' ')[0];	
							
							if(before_dt==after_dt){	
								//console.log('before_dt=',before_dt,'after_dt=',after_dt);									
								$(v).children('.d').addClass('tdplus_td_is_today');
								$(v).children('.d').html("<i tdhd'><span class='_day'>"+curDay.getDate()+"</span><br/><b>"+LunarDay+"</b></i>");
							}else{	
								 if(ops._isDisbBeforeDt==true && curDay<posDate){
									 $(v).addClass('invalid').addClass('noclk');
									 $(v).children('.d').html("<i class='tdhd'><span class='_day'>"+curDay.getDate()+"</span><br/><b>"+LunarDay+"</b></i>");
								 }else{
									if(ops._disbGtToday!=null &&  curDay>posDate || ops._disbLtToday!=null &&  curDay<posDate){
										$(v).children('.d').html("<span class='tdhd'><span class='_day'>"+curDay.getDate()+"</span><br/><b>"+LunarDay+"</b></span>");	
									}else{																
										$(v).children('.d').html("<i class='tdhd'><span class='_day'>"+curDay.getDate()+"</span><br/><b>"+LunarDay+"</b></i>");
									}
								 }												 	
							}
						$(v).children(".dsel").removeClass('dsel');
						if(curDay.getDate()==cur_day){
							$(v).children(".d").addClass('dsel');
						}
					}
					curDay.setDate(curDay.getDate()+1);
				});		
				var tmpDt=new Date(),endDay=new Date(tmpDt.getFullYear(),tmpDt.getMonth()+1,0);
				
				if(tmpDt.getFullYear()==yy && tmpDt.getMonth()==mm){
					var data={
						clinicuniqueid:typeof(defaultclinicid)=='undefined'?ops._defaultclinicid:defaultclinicid,
						begindate:self.date_format(tmpDt).split(' ')[0],
						enddate:self.date_format(endDay).split(' ')[0]+' 23:59:59'
            		};	                             
					if(typeof(ops._showSchCntsUrl)!="undefined"){
						 $.post(ops._showSchCntsUrl,data,function(json){
								try{
									self.set_day_cnt(json.list);								
								}catch(e){
									console.log(e);
								}
						 });
					}
				}
				
		};
		
	//--------------------------------------------------------
	this.createUI();	
	this.GenDates(cur_year,cur_month);	
	}
	//-----------------------------------------------------------
	var net_month_seled=function(element,options){
		var 	ops=options,
				that=$(element),
				thatApplyCss=false,
				cur_month=new Date().getMonth(),
				cur_year=new Date().getFullYear(),
				cur_day=new Date().getDate(),
				AddYearCount=0,
				self=this;
		that.off('mouseleave').on("mouseleave",function(){
			if(ops._isShow){
			}else{
				that.hide();
			}
		});
		/*that.off("click",".content i").on("click",".content i",function(){
			var num=$(this).parent().attr('id').split('_')[1];	
			that.find(".content .act").removeClass("act");
			$(this).addClass('act');
		});*/
		that.find('.titlearea').children('.pre').off("click").on("click",function(){
				that.find('.titlearea').children('.tdy').show();
				self.set_title_event($(this),-1);
		});
		that.find('.titlearea').children('.nxt').off("click").on("click",function(){
				that.find('.titlearea').children('.tdy').show();
				self.set_title_event($(this),1);			
		});	
		that.find('.titlearea').children('.tdy').off("click").on("click",function(){
			  $(this).hide();
			  AddYearCount=-1;
			  self.set_title_event($(this),1);
			 if(ops.callbackMonthClk!=null){
					ops.callbackMonthClk({'y':cur_year,'m':cur_month+1});
			 }
		});	
		that.on("click",".content  span i",function(){
				var clkMth=$(this).parent().attr("id").split('_')[1];
				cur_month=parseInt(clkMth)-1;
				self.showTxtinfo(0);
				that.find(".content span i").removeClass("act");
				$(this).addClass('act');
				if(ops.callbackMonthClk!=null){
					ops.callbackMonthClk({'y':cur_year,'m':cur_month+1});
				}
		});
		//--
		this.showTxtinfo=function(clsact){
			var nl_info=yayigj_lunar(new Date(cur_year,cur_month,1));
			var today=new Date();
			if(clsact==1){
				that.find(".content span i").removeClass("act");
			}
			if(cur_year==today.getFullYear() && cur_month==today.getMonth()){
				nl_info=yayigj_lunar(new Date(cur_year,cur_month,1));				
				that.find("#m_"+(cur_month+1)).children("i").addClass('cum');
				that.find(".titlearea .a_d").text(cur_year+'年'+(cur_month+1)+'月'+cur_day+'日');
				that.find(".titlearea .oth").text(nl_info.animal+'年'+nl_info.lMonth+'月'+nl_info.lDate);
			}else{
				that.find(".content  span i").removeClass("cum");
				if(cur_year==today.getFullYear()){					
					that.find("#m_"+(new Date().getMonth()+1)).children("i").addClass('cum');
				}
				that.find(".content span:eq(0)").children("i").addClass("act");
				clsact==1?that.find(".titlearea .a_d").text(cur_year+'年'+'1月1日'):that.find(".titlearea .a_d").text(cur_year+'年'+(cur_month+1)+'月1日');
				that.find(".titlearea .oth").text(nl_info.animal+'年'+nl_info.lMonth+'月'+nl_info.lDate);
			}
			if(clsact==2){
				that.find(".content span i").removeClass("act");
				that.find("#m_"+(cur_month+1)).children("i").addClass('act');
			}
		}
		//--
		this.set_title_event=function(obj,add_dec){
			add_dec==1?++AddYearCount:--AddYearCount;
			var now = new Date();
		    var nDt=new Date(now.getFullYear(),now.getMonth(),1);
		    nDt.setFullYear(nDt.getFullYear() + AddYearCount);  
			cur_year=nDt.getFullYear();
			cur_month=nDt.getMonth();	
			self.showTxtinfo(1);
		}		
		this.init=function(){
			that.find(".content").removeClass("cum");
			that.find("#m_"+(cur_month+1)).children("i").addClass('cum');
		}	
		this.setYM=function(yy,mm){
			AddYearCount=yy-cur_year;
			cur_year=yy;
			cur_month=mm;				
			self.showTxtinfo(2);
		}		
		this.init();			
	};
	//-------------------------------------------------------
	$.fn.yayigj_LunarCale= function(parameter,callback) {		
		if(typeof parameter=='function'){
				callback=parameter;
				parameter={};
			}else{
				parameter=parameter||{};
				callback=callback||function(){};
			}
			var options=$.extend({},defaults,parameter);
			return this.each(function(){
				var down_obj=new lunarCaleObj(this,options);
				callback(down_obj);
			});
	}
	//-------------------------------------------------------
	$.fn.yayigj_month_nt_seled= function(parameter,callback) {		
		if(typeof parameter=='function'){
				callback=parameter;
				parameter={};
			}else{
				parameter=parameter||{};
				callback=callback||function(){};
			}
			var options=$.extend({},defaults,parameter);
			return this.each(function(){
				var down_obj=new net_month_seled(this,options);
				callback(down_obj);
			});
	}
	//-------------------------------------------------------
})(jQuery);   