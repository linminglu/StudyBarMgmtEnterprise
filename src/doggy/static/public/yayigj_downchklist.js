/*------------------------------------
下拉复选列表插件
 zlb 2017-06-22
 使用说明,请使用ID进行绑定,不要使用class
*-------------------------------------*/
 ;(function($) {    
 	var defaults={
		_borderColor:'#e0e0e0',	
		_activeColor:'#47a6a0', //00AEA2
		_hoverColor:'#47a6a0', //00CAB6
		_hoverBgColor:'#F2FFFE',
		_valtype:'val',
		_minHeight:200,
		_hiddenID:'',
		_itemClass:'chk',
		_ico:"/static/public/img/selecticon.png",
		_icoActive:"/static/public/img/selecticon_active.png",
		_callBack:null,
		_isDefaultSel:true,
		_isLocation:true
	};
	var DownListObj=function(element,options){
		var opts=options,
		      that=$(element),
			  thatApplyCss=false,
			  close_panel_tm=null,
			  self=this;			
		this.disScroll=function(evt,obj){ 		
			var scrollTop = obj.scrollTop,scrollHeight = obj.scrollHeight,height = obj.clientHeight;
			var delta = (evt.originalEvent.wheelDelta) ? evt.originalEvent.wheelDelta : -(evt.originalEvent.detail || 0);  
			if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
				obj.scrollTop = delta > 0? 0: scrollHeight;
				evt.preventDefault();
			}   
		}
		this.isExistsCss=function(cssName){
				var js= /js$/i.test(name);
				var es=document.getElementsByTagName(js?'script':'link');
				for(var i=0;i<es.length;i++) 
				if(es[i][js?'src':'href'].indexOf(name)!=-1)return true;
				return false;	
		}
		this.createCss=function(){
				if(document.getElementById("yayigj_downlist_plus")){								
				} else {	
					var nod=document.createElement("style");	
					var strCss='',_w=that.width(),_h=that.height();
					strCss='.yayigj_plus_downlist{position:absolute;z-index:100000000; border:solid 1px '+opts._activeColor+';border-top:solid 0px #fff;background-color:#fff; max-height:'+
								opts._minHeight+'px; display:none;border-radius:0px 0px 2px 2px; overflow:auto;font-size:14px; font-family:微软雅黑;}';					
					strCss+='.top_ht_line{position:absolute;z-index:11; border-top:solid 1px '+opts._activeColor+';top:0px;left:0px; display:none;height:2px}';
					strCss+='.yayigj_plus_downlist p{line-height:24px; margin:0px; padding:2px 5px 2px 5px; box-sizing:border-box;cursor:pointer;white-space:nowrap; }';
					strCss+='.yayigj_plus_downlist p[data-flag="1"]{background-color:'+opts._hoverColor+'; color:#fff}';
					strCss+='.yayigj_plus_downlist p:hover{background-color:'+opts._activeColor+'; color:#fff;}';
					strCss+='.yayigj_plus_downlist p:active{background-color:'+opts._hoverColor+'; color:#fff}';
					strCss+='::-webkit-scrollbar{width:6px;height:6px;}';
					strCss+='::-webkit-scrollbar-thumb:horizontal:hover {background-color:#c5c5c5;transition: 0.5s all;}';
					strCss+='::-webkit-scrollbar-thumb:vertical:hover {background-color:#c5c5c5;transition: 0.5s all;}';
					strCss+='::-webkit-scrollbar-track-piece{background-color:#fafafa;-webkit-border-radius: 0px;}';
					strCss+='::-webkit-scrollbar-thumb:vertical{height:4px;background-color:#d9d9d9;-webkit-border-radius:0px;}';
					strCss+='::-webkit-scrollbar-thumb:horizontal{width:4px;background-color:#d9d9d9;-webkit-border-radius:0px;}';
					var nod=$("<style type='text/css' id='yayigj_downlist_plus'>"+strCss+"</style>");
					$("head").append(nod);
				}
		}	
		this.getMyID=function(){
			return that.attr('id');
		}
		this.createUI=function(){
				var 	myID=that.attr('id')+'_downchk_list',
						divList='',
						div_obj=$("<div id='"+myID+"' class='yayigj_plus_downlist' onselectstart='return false;'	></div>"),										
						div_ht_line=$("<div  class='top_ht_line'></div>"),	
						ntop=that.offset().top+that.innerHeight(),
						nWidth=that.innerWidth(),
						oldBdColor=that.css("border-color");
				$.each(opts._data,function(k,v){						
						divList+='<p class="pitem" value="'+v.val+'"><input  class="chk '+opts._itemClass+'" type="checkbox"/>'+v.key+'</p>';
				});
				div_obj.empty().append(divList);
				div_obj.append(div_ht_line);
				$("#"+myID).remove();
				that.parent().append(div_obj);				
				if($("#f_frame_cont").length>0){  //2017/06/14 zlb
					$("#f_frame_cont").append(div_obj);
				}else{
					$("body").append(div_obj);						
				}
				//$("body").append(div_obj);
				$("#"+myID).css({"left":that.offset().left+"px","top":+ntop+"px"});
				div_obj.on("mouseleave",function(e){ 					
						try{
							if(e.relatedTarget.id==that.attr('id')){}else{
								close_panel_tm=window.setTimeout(function(){
									$(this).hide(); 
									$("#"+myID+"_ico").attr("src",opts._ico); 
									that.css("border-color",oldBdColor);		
									that.css({"background-color":"#fff"});	
								},600);
							}
						}catch(e){							
						}							
				});	
				$(document).on("DOMMouseScroll mousewheel","#"+myID,function(event){self.disScroll(event,this);});	
				that.on("DOMMouseScroll mousewheel",function(event){self.disScroll(event,this);});			
		}		
		this.init = function(){
				var myID=that.attr('id')+'_downchk_list',oldBdColor=that.css("border-color"),bgRight=that.innerWidth()-12-8;						
				thatApplyCss=this.isExistsCss('r_input');
				if(thatApplyCss){
					var linkHref=document.styleSheets,cssFileObj=null,icount=linkHref.length;										
					for(var i=0;i<icount;i++){
						try{
							if(linkHref[i].href.indexOf('r_input.css')>-1){
								var cssFileObj=[];
								cssFileObj.push(linkHref[i].cssRules[0].cssText.split('{')[1].split(';'));	
								cssFileObj.push(linkHref[i].cssRules[1].cssText.split('{')[1].split(';'));	
								cssFileObj.push(linkHref[i].cssRules[2].cssText.split('{')[1].split(';'));	
								cssFileObj.push(linkHref[i].cssRules[15].cssText.split('{')[1].split(';'));																					
								opts._borderColor=cssFileObj[0][0].replace('border-color: ','');
								opts._hoverColor=cssFileObj[1][0].replace('border-color: ','');
								opts._activeColor=cssFileObj[2][0].replace('border-color: ','');
								opts._hoverBgColor=cssFileObj[3][0].replace('background-color: ','');
								break;
							}
						}catch(e){
						}
					}
				}			
					
				var t=window.setTimeout(function(){
					clearTimeout(t);
					bgRight=that.innerWidth()-12-8;
					that.css({"border-radius":"2px","background-image":"url("+opts._ico+")","background-position":bgRight+"px center","background-repeat":"no-repeat","font-family":"微软雅黑"});
					},100); //zlb 2016-12-17					
				
				that.on("click",function(){	
					window.clearTimeout(close_panel_tm);	
					$(this).css({"border-color":opts._activeColor});
					var isExceed=	$("#"+myID).width()<that.innerWidth()?false:true;													
					var new_left=that.offset().left,new_top=that.offset().top,pop_divH=$("#"+myID).innerHeight(),thatInW=that.innerWidth();
					
					var valText=opts._valtype=='val'?that.val():that.text();
					if(valText!=''){
						var _keys=[];
						if(opts._valtype=='val'){
							_keys=that.val().split(',');
						}else{
							_keys=that.text().split(',');
						}
						$("#"+myID+" p").each(function(index, element) {
                            if($.inArray($(this).text(),_keys)>-1){
								$(this).find(".chk").prop("checked",true);	
							}
                        });
                        console.log(valText)
					}	
					
					if($("#f_frame_cont").length>0){ 
						new_left-=$("#f_frame_cont").offset().left;
						new_top-=$("#f_frame_cont").offset().top;
					}
					var isUp=(new_top+pop_divH+that.innerHeight()-$(document).scrollTop())>$(window).height()-10?true:false;
					$("#"+myID+"_ico").attr("src",opts._icoActive); 	
		
					if(isUp){
						$("#"+myID).css({"left":new_left+"px","top":+new_top-pop_divH+3+"px","border-bottom":"none","border-radius":"2px 2px","border-top":"solid 1px "+opts._activeColor}).show();
						if(isExceed){$("#"+myID+" .top_ht_line").css({"top":that.offset().top+3,"position":"fixed"});}
					}else{
						$("#"+myID).css({"left":new_left+"px","top":+new_top+that.innerHeight()+"px"}).slideDown('fast').css({"border-bottom":"solid 1px "+opts._activeColor,"border-top":"none"});	
						if(isExceed){$("#"+myID+" .top_ht_line").css({"top":that.offset().top+3,"position":"fixed"});}						
					}
					if(!isExceed){
						 $("#"+myID+" p").css("padding-right","0px");	
						 $("#"+myID).width(that.innerWidth());
						 $("#"+myID+" .top_ht_line").hide();
					}else{	
					  $("#"+myID+" .top_ht_line").hide();
					   window.setTimeout(function(){	
							$("#"+myID+" p").css("padding-right","18px");
							var myW=$("#"+myID).innerWidth();	
							$("#"+myID+" .top_ht_line").css({"width":parseInt(myW-thatInW),"left":that.offset().left+that.innerWidth()+1,"position":"fixed"});
							if(isUp){
								$("#"+myID+" .top_ht_line").css({"top":that.offset().top-$(document).scrollTop()+3}).show();
							}else{
								$("#"+myID+" .top_ht_line").css({"top":that.offset().top-$(document).scrollTop()+that.innerHeight()}).show();
							}
					   },200);
					}				
					}).hover(
					function(){					
						$(this).css({"background-image":"url("+opts._icoActive+")","border-color":opts._hoverColor,"background-color":opts._hoverBgColor});
					},
					function(e){		
							try{																				
								if(e.relatedTarget.className=='pitem'){
								}else{
									$("#"+myID).hide();
									$(this).css({"background-image":"url("+opts._ico+")","border-color":opts._borderColor});
									$(this).css({"background-color":"#fff"});
								}								
							}catch(e){								
							}
						}
					);				
				this.createCss();
				this.createUI();
				that.css({"cursor":"pointer"});
				
				if(opts._isDefaultSel){
					opts._valtype=='val'?that.val($("#"+myID+" p:eq(0)").text()):that.text($("#"+myID+" p:eq(0)").text());	
					that.attr('data-val',$("#"+myID+" p:eq(0)").attr('value'));  
				}			
				
						
				
				$("#"+myID).on("click",".chk",function(){
					$(this).parent().trigger("click");
				});
				
				$("#"+myID).on("click","p",function(){
					/*$("#"+myID+" p[data-flag='1']").attr('data-flag','0');
					if(opts._isLocation){						
						$(this).attr('data-flag','1');
					}*/
					//$("#"+myID).hide();
					//console.log(myID);
					
					if($(this).find(".chk").prop("checked")==true){
						$(this).find(".chk").prop("checked",false);	
					}else{
						$(this).find(".chk").prop("checked",true);		
					}
					
					var results=[],vals=[];
				 	$("#"+myID+" p input[type='checkbox']").each(function(index, element) {
                        if($(this).prop("checked")==true){
							results.push($(this).parent().text());
							vals.push($(this).parent().attr('value'));
						}
                    });
					
					opts._valtype=='val'?that.val(results.join(',')):that.text(results.join(','));	
					opts._hiddenID!=''?$("#"+opts._hiddenID).val(vals.join(',')):'';		
					
					that.attr('data-val',vals.join(','));
					that.attr('data-key',results.join(','));
					that.css({"background-color":"#fff"});
					if(opts._callBack!=null){
						opts._callBack($(this).attr('value'),that.attr("id"));	
					}
					}).mouseleave(function(e){
						var mtoObj=e.relatedTarget.id;
						if(mtoObj==that.attr('id')){							
						}else{
							close_panel_tm=window.setTimeout(function(){
								$("#"+myID).hide(); 
								that.css("background-image","url("+opts._ico+")");
								that.css("border-color",opts._borderColor);		
								that.css({"background-color":"#fff"});
							},600);
						}
						//that.css("background-image","url("+opts._ico+")");						
						}).mouseenter(function(){
							window.clearTimeout(close_panel_tm);
							});	
		}		
			
		this.reFillData=function(data){
			var divList='',myID=that.attr('id')+'_downchk_list';
			$.each(data,function(k,v){
						divList+='<p class="pitem"  value="'+v.val+'"><input class="chk '+opts._itemClass+'" type="checkbox"/>'+v.key+'</p>';
				});
			$("#"+myID+" p").remove();
			$("#"+myID).append(divList);				
		}		
		
		this.gotoval=function(val){
			var myID=that.attr('id')+'_downchk_list';
			$("#"+myID+" p[data-flag='1']").attr('data-flag','0');
			var txt=$("#"+myID+" p[value='"+val+"']").attr('data-flag','1').text();
			if(opts._valtype=='val'){
				that.val(txt);
			}else{
				that.text(txt);
			}			
			that.attr('data-val',val);
			that.attr('data-key',txt);			
			if(typeof(that.val)=='function'){
				that.val(txt);
			}
		}
		this.init();
	}	
	$.fn.yayigj_downchklist = function(parameter,callback) {
			if(typeof parameter=='function'){
				callback=parameter;
				parameter={};
			}else{
				parameter=parameter||{};
				callback=callback||function(){};
			}
			var options=$.extend({},defaults,parameter);
			return this.each(function(){
				var down_obj=new DownListObj(this,options);
				callback(down_obj);
			});
	};
})(jQuery);   
