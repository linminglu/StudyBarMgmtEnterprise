/*------------------------------------
下拉列表插件
 zlb 2016-12-01
 使用说明,请使用ID进行绑定,不要使用class
*-------------------------------------*/
 ;(function($) {    
 	var defaults={
		_borderColor:'#00c5b5',	
		_activeColor:'#00bcaa',
		_hoverColor:'#00AEA2',
		_valtype:'val',
		_minHeight:200,
		_hiddenID:'',
		_ico:"/static/public/img/f_down_disab.png",
		_icoActive:"/static/public/img/f_down_over.png",
	};
	var DownListObj=function(element,options){
		var opts=options,
		      that=$(element);			
		this.createCss=function(){
				if(document.getElementById("yayigj_downlist_plus")){								
				} else {	
					var nod=document.createElement("style");	
					var strCss='',_w=that.width(),_h=that.height();
					strCss='.yayigj_plus_downlist{position:absolute;z-index:10; border:solid 1px '+opts._borderColor+';border-top:solid 0px #fff;background-color:#fff; max-height:'+
								opts._minHeight+'px; display:none; overflow:auto;font-size:14px; font-family:微软雅黑}';
					strCss+='.top_ht_line{position:absolute;z-index:11; border-top:solid 2px #fff;top:-1px;left:0px;}';
					strCss+='.yayigj_plus_downlist p{line-height:20px; margin:0px; padding:2px 5px 2px 5px; box-sizing:border-box;cursor:pointer;white-space:nowrap; }';
					strCss+='.yayigj_plus_downlist p[data-flag="1"]{background-color:'+opts._borderColor+'; color:#fff}';
					strCss+='.yayigj_plus_downlist p:hover{background-color:'+opts._borderColor+'; color:#fff}';
					strCss+='.yayigj_plus_downlist p:active{background-color:'+opts._activeColor+'; color:#fff}';
					var nod=$("<style type='text/css' id='yayigj_downlist_plus'>"+strCss+"</style>");
					$("head").append(nod);
				}
		}		
		this.createUI=function(){
				var 	myID=that.attr('id')+'_down_list',
						divList='',
						div_obj=$("<div id='"+myID+"' class='yayigj_plus_downlist' onselectstart='return false;'	></div>"),										
						div_ht_line=$("<div  class='top_ht_line'></div>");				
						div_obj.append(div_ht_line),
						ntop=that.offset().top+that.height()+2,
						nWidth=that.width()+parseInt(that.css("padding-left"))+parseInt(that.css("padding-right"));				
				$.each(opts._data,function(k,v){
						$.each(v,function(kk,vv){val=vv;name=kk;});
						divList+='<p value="'+val+'">'+name+'</p>';
				});
				var ico_obj=$("<div><img id='"+myID+"_ico' src='"+opts._ico+"'/></div>");
					  ico_obj.css({"position":"absolute","left":that.width()+that.offset().left-15,"top":that.offset().top+1,"width":"20px","box-sizing":"border-box","padding-top":"7px","text-align":"center",
					  					  "background-color":"#FFF","height":that.outerHeight()-2+"px","vertical-align":"middle","display":"table-cell"});
				div_obj.empty().append(divList);
				$("#"+myID).remove();
				$("body").append(div_obj);		
				$("body").append(ico_obj);
				$("#"+myID).width(nWidth).css({"left":that.offset().left+"px","top":+ntop+"px"});
				ico_obj.on("click",function(){$("#"+myID).show();});
				div_obj.on("mouseleave",function(){ $(this).hide(); $("#"+myID+"_ico").attr("src",opts._ico); });
		}		
		this.init = function(){
				var myID=that.attr('id')+'_down_list';
				that.on("click",function(){
					$("#"+myID+"_ico").attr("src",opts._icoActive); $("#"+myID).show();
					});
				this.createCss();
				this.createUI();
				that.css({"cursor":"pointer"});
				opts._valtype=='val'?that.val($("#"+myID+" p:eq(0)").text()):that.text($("#"+myID+" p:eq(0)").text());	
				$("#"+myID).on("click","p",function(){
					$("#"+myID+" p[data-flag='1']").attr('data-flag','0');
					$(this).attr('data-flag','1');
					$("#"+myID).hide();
					opts._valtype=='val'?that.val($(this).text()):that.text($(this).text());	
					opts._hiddenID!=''?$("#"+opts._hiddenID).val($(this).attr('value')):'';			
					});
		}			
		this.reFillData=function(data){
			var divList='',myID=that.attr('id')+'_down_list';
			$.each(data,function(k,v){
						$.each(v,function(kk,vv){val=vv;name=kk;});
						divList+='<p value="'+val+'">'+name+'</p>';
				});
			$("#"+myID).empty().append(divList);
				
		}		
		this.gotoval=function(val){
			//console.log('val=',val,"p[data-flag='"+val+"']");
			var myID=that.attr('id')+'_down_list';
			$("#"+myID+" p[data-flag='1']").attr('data-flag','0');
			var txt=$("#"+myID+" p[value='"+val+"']").attr('data-flag','1').text();
			opts._valtype=='val'?that.val(txt):that.text($(this).text(txt));	
		}
		this.init();
	}	
	$.fn.yayigj_downlist = function(parameter,callback) {
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
