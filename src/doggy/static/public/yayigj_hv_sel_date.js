//---------------------------------------------
$.fn.yayigj_hv_sel_date = function(options) {
	var my_params={
		event:"click",
		width:"145px",
		height:20,
		bdColor:'#00C3B5',
		disableColor:'#D1D1D1', 
		enabledColor:'#A3A3A3',
		callBackFunc:null,
		defaulttxt:''
		};
	var 	ops=$.extend(true,{},my_params, options),
		that=$(this),
		id=that.attr("id"),
		myid=id+"_set",
		today=new Date(),
		myYear=today.getFullYear(),
		myMonth=today.getMonth()+1,
		myDay=today.getDate(),
		curMonth=myMonth,
		curYear=myYear,
		sel_ym='',
		cssQz="yayigj_plus_date_hv",
		jqID=myid+"_plus_date_hv";
	
	var set_owner_date=function(_date){
		that.attr('data-clkdate',_date);
	}
			
	 var createUI=function(){
		var format_dateTxt=function(txt){
			var tmps=txt.indexOf('-')>-1?txt.split('-'):txt.split('/');
			var _y=tmps[0],_m=parseInt(tmps[1]),_d=parseInt(tmps[2]);
			_m=_m<10?'0'+_m:_m;
			_d=_d<10?'0'+_d:_d;
			return _y+'-'+_m+'-'+_d;
		};
		if(ops.defaulttxt==''){
			ops.defaulttxt=myYear+'-'+myMonth+'-'+myDay;	
		}
		that.attr('data-plusid',jqID);
		that.addClass(cssQz+"_css");
		var left_obj=$("<div class='leftbtn lr_btn'><img src='/static/public/img/dir_left.png'></div>"),
			  center_obj=$("<div class='cenbtn' id='"+jqID+"_title'>"+format_dateTxt(ops.defaulttxt)+"</div>"),
			  riht_obj=$("<div class='rightbtn lr_btn'><img src='/static/public/img/dir_right.png'></div>");
		$("#"+that.attr("id")).append(left_obj);	 
		$("#"+that.attr("id")).append(center_obj);	 
		$("#"+that.attr("id")).append(riht_obj);
		
		var get_arr_ymd=function(){
			var arV=$("#"+jqID+"_title").attr('data-clkdate');	
			arV=arV.split('/');			
			return {y:parseInt(arV[0]),m:parseInt(arV[1]),d:parseInt(arV[2])};
		}
		
		var getGoodFormat=function(localDate){
				var newDate=localDate,
					  newYear=newDate.getFullYear(),
					  newMonth=parseInt(newDate.getMonth()+1),newDate=newDate.getDate();
				      newMonth=newMonth<10?'0'+newMonth:newMonth;
					  newDate=newDate<10?'0'+newDate:newDate;
				 return newYear+'/'+	newMonth+'/'+ newDate;
		}
		
		left_obj.on("click",function(){
				var preDate=that.attr('data-clkdate');
				var localDate = new Date(preDate);					
   			    localDate.setDate(localDate.getDate()-1);
				var clkSelDt=getGoodFormat(localDate);
				set_owner_date(clkSelDt);	 	
				//that.find(".cenbtn").text(clkSelDt.replace('/','年').replace('/','月')+'日');			
				that.find(".cenbtn").text(clkSelDt.replace(/\//g,'-'));			
				if(ops.callBackFunc!=null){
					ops.callBackFunc(clkSelDt);
				}
			});
			
		riht_obj.on("click",function(){
				var preDate=that.attr('data-clkdate');
				var localDate = new Date(preDate);					
   			    localDate.setDate(localDate.getDate()+1);
				var clkSelDt=getGoodFormat(localDate);
				set_owner_date(clkSelDt);	 	
				//that.find(".cenbtn").text(clkSelDt.replace('/','年').replace('/','月')+'日');	
				that.find(".cenbtn").text(clkSelDt.replace(/\//g,'-'));				
				if(ops.callBackFunc!=null){
					ops.callBackFunc(clkSelDt);
				}
			});			
		 $("#"+jqID+"_title").yayigj_date_Sel({
			 callBackFunc:function(date){				 	
				 set_owner_date(date.replace(/-/g,'/'));	
				 ops.callBackFunc(date.replace(/-/g,'/'));
				 
				/* if($("#"+jqID+"_title_seled_plus_dateSel").is(":hidden")){
						that.find(".cenbtn").css({"border":"none","background-image":"none"});
				 }*/
				 //console.log($("#"+jqID+"_title_seled_plus_dateSel"));
				 window.setTimeout(function(){
					  that.find(".cenbtn").css({"border":"none","background-image":"none"});
				 },100);
				 }
			 });				
	 }		
	 
	 var createCss=function(){
		if(document.getElementById(cssQz)){								
		} else {											
			var 	cssStr='',
					newLeft=that.offset().left,
			      	newTop=8;
			cssStr+='.'+cssQz+'_css{font-family:微软雅黑;-webkit-user-select:none;background-color:#fff; position:relative}';
			cssStr+='.'+cssQz+'_css .lr_btn{height:'+ops.height+'px; width:20px;line-height:20px;position:absolute;text-align:center; background-color:#FFF;top:'+newTop+'px;cursor:pointer;color:#ccc;font-size:14px; z-index:100}';	
			cssStr+='.'+cssQz+'_css .lr_btn:hover{color:#000}';
			cssStr+='.'+cssQz+'_css .lr_btn:active{margin-top:1px}';
			cssStr+='.'+cssQz+'_css .cenbtn{width:100%;height:36px;line-height:36px;background-color:#fff;cursor:pointer;position:absolute;left:0px;top:0px;text-align:center;}';
			cssStr+='.'+cssQz+'_css .leftbtn{left:-22px;line-height:20px;box-sizing:border-box;}';	
			cssStr+='.'+cssQz+'_css .rightbtn{right:-23px;line-height:20px;box-sizing:border-box; }';	
			cssStr+='.'+cssQz+'_css .leftbtn:hover{background-color:#eee; border-radius:50%}';	
			cssStr+='.'+cssQz+'_css .rightbtn:hover{background-color:#eee; border-radius:50%}';			
			var nod=$("<style type='text/css' id='"+cssQz+"'>"+cssStr+"</style>");
			$("head").append(nod);
		}
	 }	 
	 var init=function(){		
	 	var tday=new Date();
			  tday=tday.getFullYear()+'/'+parseInt(tday.getMonth()+1)+'/'+tday.getDate();
		that.on("click",".cenbtn",function(){
			that.find(".cenbtn").css({"border":"solid 1px #00C3B5","background-image":"none"});
			});
		that.find(".cenbtn").on("mouseleave",function(e){
			//console.log(e);
			if(e.relatedTarget.className=='top_over_line' || e.relatedTarget.className=='title'){				
			}else{
				$(this).css({"border":"none","border-color":"#fff","background-image":"none"});
			}
		});	  
		 that.width(ops.width);
		 that.height(ops.height);
		 set_owner_date(tday);
		 that.find(".cenbtn").css({"border":"none","background-image":"none"});
		 }		 
	 return $(this).each(function() {
		 createCss();
		 createUI();	
 		 init(); 
    });	 	
}