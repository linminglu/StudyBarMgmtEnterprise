/*------------------------------------
验证插件
 控件必须要有label for关联
 zlb 2017-02-23
 支持为空判断  yayigj_plus_valid
 1-为空判断,
 2-邮件判断,
 3-手机号判断,
 4-固话判断,
 5-身份证判断,
 6-日期验证,
 7-判断是否为英文字母,
 8-是否为整数,
 9-判断是否为双精度,
 10-判断是否字母数字组成,
 11-判断是否为中文
 12-判断为邮编
 13-不能大于某数
 14-价格判断
 15-网址
 16-QQ
*-------------------------------------*/
 ;(function($) {    
 		var defaults={
			_cssName:'ipt_valid',
			_validText:'',	//出错文本显示
			_validType:1,
			_selfid:'',
			_canBeNull:false,  //是否可以为空
			_event:null 
		};
		
		var validityObj=function(element,options){
			var opts=options,
				  that=$(element),
				  validID=that.attr('id');
				  labelfor=$('label[for='+validID+']'),
				  self=this;				
			if(labelfor.length<0){
					return;	
			}			
			this.callShow=function(newStr){
				var str=$("#"+validID).val().trim(),
				labelfor=$('label[for='+$("#"+validID).attr("id")+']');	
				labelfor.addClass(opts._cssName);
				labelfor.attr('data-vtext','    '+newStr);
				that.addClass('ipt_valid_red');
			}
			this.showinfo=function(newStr){	
				var result=0;
				var str=$("#"+validID).val().trim(),
				labelfor=$('label[for='+$("#"+validID).attr("id")+']');	
				var showPubInfo=function(){
						var txt_info=typeof(newStr)=='undefined' || newStr==''?opts._validText:newStr;
						labelfor.addClass(opts._cssName);
						//labelfor.attr('data-vtext','    '+opts._validText);
						labelfor.attr('data-vtext','    '+txt_info);
						that.addClass('ipt_valid_red');
						result=1;
				}
				var execResult=function(reg,str){
					if(reg.test(str)  ||  opts._canBeNull==true && str==''){}else{showPubInfo();}
				}
				switch(opts._validType){
					case 1:								
						var  reg=/^\s*$/g;
						if(reg.test(str)){showPubInfo();}
						break;
					case 2:
						execResult(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,str);
						break;
					case 3:
						execResult(  /^1[0-9]{10}$/,str);
						break;	
					case 4:
						execResult( /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/,str);
						break;		
					case 5:						
						execResult(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,str);
						break;	
					case 16:						
						execResult(/^[1-9][0-9]{4,9}$/,str);
						break;		
					case 15:					 
						//var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~\=]+)\.)+([A-Za-z0-9-~\/])+$/;
						var reg=/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
						if(reg.test(str)){}else{
							if(str!=''){showPubInfo();}
							}
						break;		
					case 14:
						var gen_comdify=function(n){
						　　var re=/\d{1,3}(?=(\d{3})+$)/g;
						　　var n1=n.replace(/^(\d+)((\.\d+)?)$/,function(s,s1,s2){return s1.replace(re,"$&,")+s2;});
						　　return n1;
						}
						var  reg= /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
						var  reg2= /^(([1-9][0-9]{0,2}(,\d{3})*)|0)(\.\d{1,2})?$/;
						try{
							str=str.split('.')[0].replace(/,/g,'');
						}catch(e){}
						if(reg.test(str)){							
							$("#"+validID).val(gen_comdify(parseFloat(str).toFixed(2)));
							if(reg2.test($("#"+validID).val())){}else{showPubInfo();}
						}else{
							if(opts._canBeNull==true && str==''){}else{
								showPubInfo();
							}
						}
						break;	
				}
				return result;
			}
			this.closeinfo=function(){
					labelfor=$('label[for='+$("#"+validID).attr("id")+']');
					labelfor.removeClass(opts._cssName);
					labelfor.attr('data-vtext','');
					that.removeClass('ipt_valid_red');
			}
		};
		$.fn.yayigj_plus_valid = function(parameter,callback) {
			if(typeof parameter=='function'){
				callback=parameter;
				parameter={};
			}else{
				parameter=parameter||{};
				callback=callback||function(){};
			}			
			var options=$.extend({},defaults,parameter);		
			var down_obj=new validityObj(this,options);			
			$(this).on("keydown",function(){
				var labelfor=$('label[for='+$(this).attr('id')+']');
				labelfor.removeClass(options._cssName);
				$(this).removeClass('ipt_valid_red');				
				});
			$(this).on("focus",function(){
				var labelfor=$('label[for='+$(this).attr('id')+']');
				labelfor.removeClass(options._cssName);	
				$(this).removeClass('ipt_valid_red');				
				});	
			if(options._event!=null){
				$(this).on(options._event,function(){
					var re=down_obj.showinfo();
					if(re==1){
						$(this).addClass('ipt_valid_red');
						$(this).attr('data-verror','1');
					}else{
						$(this).removeClass('ipt_valid_red');	
						$(this).attr('data-verror','0');	
					}
					});
			 }					
			return this.each(function(){				
				callback(down_obj);
			});
	};
 })(jQuery);   