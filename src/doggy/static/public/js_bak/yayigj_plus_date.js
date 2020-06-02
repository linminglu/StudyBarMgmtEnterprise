/*------------------------------------------
  1、 选择年月								//选择年月插件
  2 、选择日期								//选择日期插件
  3 、横向增减日期
/*------------------------------------------*/
//---------------------------------------------
//横向增减日期 zlb 2016-11-15
//---------------------------------------------
$.fn.yayigj_plus_date_hv = function(options) {
	var my_params={
		event:"click",
		width:"100px",
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
		curMonth=myMonth,
		curYear=myYear,
		sel_ym='',
		cssQz="yayigj_plus_date_hv",
		jqID=myid+"_plus_date_hv";
		
	 var createUI=function(){		
		that.attr('data-plusid',jqID);
		that.addClass(cssQz+"_css");
		var left_obj=$("<div class='leftbtn lr_btn'><img src='/static/public/img/dir_left.png'></div>"),
			  center_obj=$("<div class='cenbtn' id='"+jqID+"_title'>"+ops.defaulttxt.replace('-','')+"</div>"),
			  riht_obj=$("<div class='rightbtn lr_btn'><img src='/static/public/img/dir_right.png'></div>");
		//center_obj.css({"width":"100%","height":"100%","background-color":"#eee","cursor":"pointer","position":"absolute"});	  
		$("#"+that.attr("id")).append(left_obj);	 
		$("#"+that.attr("id")).append(center_obj);	 
		$("#"+that.attr("id")).append(riht_obj);
		
		var get_arr_ym=function(){
			var arV=$("#"+jqID+"_title").text().replace('-','');	
			arV=arV.replace('月','');
			if(arV.indexOf('-')>-1){
				arV=arV.replace(/-/g,'');	
			}
			arV=arV.split('年');
			return {y:parseInt(arV[0]),m:parseInt(arV[1])};
		}
		left_obj.on("click",function(){
				var _year=get_arr_ym().y,_month=get_arr_ym().m;		
				var sel_ym='';		
				if(_month-1==0){
					$("#"+jqID+"_title").text((_year-1)+'年12月');	
					sel_ym=(_year-1)+'-'+12;
				}else{
					$("#"+jqID+"_title").text((_year)+'年'+(_month-1)+'月');	
					sel_ym=(_year)+'-'+(_month-1);
				}
				if(ops.callBackFunc!=null){
					//ops.callBackFunc($("#"+jqID+"_title").text());
					ops.callBackFunc(sel_ym);
				}
			});
		riht_obj.on("click",function(){
			var _year=get_arr_ym().y,_month=get_arr_ym().m;
			var sel_ym='';
				if(_month+1==13){
					$("#"+jqID+"_title").text((_year+1)+'年1月');
					sel_ym=(_year+1)+'-1';	
				}else{
					$("#"+jqID+"_title").text((_year)+'年'+(_month+1)+'月');	
					sel_ym=_year+'-'+(_month+1);
				}
				if(ops.callBackFunc!=null){
					//ops.callBackFunc($("#"+jqID+"_title").text());
					ops.callBackFunc(sel_ym);
				}
			});			
		 $("#"+jqID+"_title").yayigj_date_ymSel({callBackFunc:ops.callBackFunc});				
	 }		
	 
	 var createCss=function(){
		if(document.getElementById(cssQz)){								
		} else {											
			var 	cssStr='',
					newLeft=that.offset().left,
			      	newTop=5;
			cssStr+='.'+cssQz+'_css{font-family:微软雅黑;-webkit-user-select:none;background-color:#fff; position:relative}';
			cssStr+='.'+cssQz+'_css .lr_btn{height:'+ops.height+'px; width:20px;line-height:20px;position:absolute;text-align:center; background-color:#FFF;top:'+newTop+'px;cursor:pointer;color:#ccc;font-size:14px; z-index:100}';	
			cssStr+='.'+cssQz+'_css .lr_btn:hover{color:#000}';
			cssStr+='.'+cssQz+'_css .lr_btn:active{margin-top:1px}';
			cssStr+='.'+cssQz+'_css .cenbtn{width:100%;height:100%;background-color:#fff;cursor:pointer;position:absolute;left:0px;top:0px;line-height:30px; text-align:center}';
			cssStr+='.'+cssQz+'_css .leftbtn{left:-20px}';	
			cssStr+='.'+cssQz+'_css .rightbtn{right:-20px}';	
			cssStr+='.'+cssQz+'_css .leftbtn:hover{background-color:#eee; border-radius:50%}';	
			cssStr+='.'+cssQz+'_css .rightbtn:hover{background-color:#eee; border-radius:50%}';			
			var nod=$("<style type='text/css' id='"+cssQz+"'>"+cssStr+"</style>");
			$("head").append(nod);
		}
	 }	 
	 var init=function(){		
		 that.width(ops.width);
		 that.height(ops.height);
		 }		 
	 return $(this).each(function() {
		 createCss();
		 createUI();	
 		 init(); 
    });	 	 
		 
}

//----------------------------------------------
//选择年月	
$.fn.yayigj_date_ymSel = function(options) {
	var my_params={
			event:"click",
			width:"240px",
			height:"160px",
			callBackFunc:null,
			varType:'text'  //text|val
			};
	var 	ops=$.extend(true,{},my_params, options),
			that=$(this),
			id=that.attr("id"),
			myid=id+"_ym_seled",
			myYear=(new Date()).getFullYear(),
			myMonth=(new Date()).getMonth(),
			curMonth=myMonth,	
			cssQz="yayigj_plus_date_ym_sel",		
			curYear=myYear;

	var init=function(){	
		$("#"+that.attr('data-plusid')+"_table td:eq("+curMonth+")").addClass('td_is_sel_ed');		
		that.on(ops.event,function(){
			$("#"+myid).css({
				"top":that.offset().top+that.height()+3,
				"left":that.offset().left-parseInt(ops.width)/2,
			}).fadeIn();
			});			
		$("#"+that.attr('data-plusid')).on("click",".close",function(){
			$("#"+myid).fadeOut();
			});				
		$("#"+that.attr('data-plusid')).on("click",".pre",function(){
			--curYear;
			$("#"+myid+" .title_txt").text(curYear);
			});				
		$("#"+that.attr('data-plusid')).on("click",".next",function(){
			++curYear;
			$("#"+myid+" .title_txt").text(curYear);
			});				
		$("#"+that.attr('data-plusid')+"_table").on("click","td",function(){
			curMonth=parseInt($(this).text().replace('月',''));	
			curMonth=curMonth<10?'0'+curMonth:curMonth;		
			$(".td_is_sel_ed").removeClass('td_is_sel_ed');
			$(this).addClass('td_is_sel_ed');
			var myResult=curYear+'-'+curMonth;
			$("#"+myid).fadeOut();			
			if(ops.callBackFunc!=null){
				ops.callBackFunc(myResult);
			}			
			switch(ops.varType){
				case 'text':
					that.html(curYear+'年'+curMonth+'月');	
					break;
				case 'val':
					that.val(curYear+'年'+curMonth+'月');
					break;		
				}
			});					
		};			
	var createUI=function(){
		that.attr('data-plusid',myid);		
		var datePanelContent='<table bgcolor="#fff" cellspacing="0" border="0" cellpadding="0" id="'+myid+'_table" class="'+cssQz+'_table" width="100%" height="120"><tr><td>1月</td><td>2月</td><td>3月</td><td>4月</td></tr><tr><td>5月</td><td>6月</td><td>7月</td><td>8月</td></tr><tr><td>9月</td><td>10月</td><td>11月</td><td>12月</td></tr></table>';	
		var datePanel=$("<div id='"+myid+"' class='"+cssQz+"_css'><div class='title dir'><span class='pre dir'>  <img src='/static/public/img/dir_left.png'>  </span><span class='title_txt'>"+myYear+"</span><span class='next dir'>  <img src='/static/public/img/dir_right.png'>  </span><span class='close'><img src='/static/public/img/close_icon.png'></span></div>"+datePanelContent+"</div>");
		$("body").append(datePanel);
	};	
	var createCSS=function(){
		if(document.getElementById(cssQz)){								
		} else {											
			var cssStr='',newLeft=that.offset().left,
			      newTop=that.offset().top+that.height()+32;
			cssStr+='.'+cssQz+'_css{width:'+ops.width+';height:'+ops.height+';top:'+newTop+'px !important;left:'+newLeft+'px;position:absolute;display:none;font-family:微软雅黑;box-shadow:0px 0px 10px #666;-webkit-user-select:none;border:solid 1px #ddd;overflow:hidden; z-index:101}';
			cssStr+='.'+cssQz+'_css .title{height:40px; width:100%;line-height:40px;position:relative;text-align:center; background-color:#F6F6F6}';
			cssStr+='.'+cssQz+'_css .close{height:20px; width:20px;line-height:20px;position:absolute;text-align:center;right:5px; top:10px; font-family:Verdana; cursor:pointer; color:#ccc;}';
			cssStr+='.'+cssQz+'_css .close:hover{color:#000}';			
			cssStr+='.'+cssQz+'_css .close:active{margin-top:1px}';
			cssStr+='.'+cssQz+'_css .title .dir{color:#999; cursor:pointer;position:absolute}';
			cssStr+='.'+cssQz+'_css .title .dir:hover{color:#000}';
			cssStr+='.'+cssQz+'_css .title .dir:active{margin-top:1px; }';
			cssStr+='.'+cssQz+'_css .title .pre{left:55px;top:0px; }';
			cssStr+='.'+cssQz+'_css .title .next{right:55px;top:0px; }';
			cssStr+='.'+cssQz+'_css .title .title_txt{color:#666}';
			cssStr+='.'+cssQz+'_table{border-collapse:collapse; border:none}';
			cssStr+='.'+cssQz+'_table td{width:25%; height:33.33%; text-align:center;border-top:solid 1px #eee;border-right:solid 1px #eee; cursor:pointer; color:#b7b7b7; background-color:#fff}';
			cssStr+='.'+cssQz+'_table td:hover{background-color:#F2F5FC}';
			cssStr+='.'+cssQz+'_table td:active{background-color:#ddd}';
			cssStr+='.td_is_sel_ed{ background-color:#F2F5FC; color:#849FE7}';
			var nod=$("<style type='text/css' id='"+cssQz+"'>"+cssStr+"</style>");
			$("head").append(nod);
		} 					
	};		
    return $(this).each(function() {
           	createCSS();
	createUI();   
	init(); 
    });	
};