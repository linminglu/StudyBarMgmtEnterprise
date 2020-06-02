/******************************************
 * pagination分页插件  曾令兵 修改整理
 ******************************************/
;(function($,window,document,undefined){
	//配置参数
	var defaults = {
		_borderColor:'#00c5b5',	
		_activeColor:'#47a6a0',
		_hoverColor:'#55c6bf',
		totalData:0,			
		showData:0,			
		pageCount:9,			//总页数,默认为9
		current:1,				
		prevCls:'prev',			
		nextCls:'next',			
		prevContent:'<',		
		nextContent:'>',		
		activeCls:'active',		
		coping:false,			//首页和尾页
		homePage:'',			//首页节点内容
		endPage:'',				//尾页节点内容
		count:3,				//当前页前后分页个数
		jump:false,				//跳转到指定页数
		jumpIptCls:'jump-ipt',	//文本框内容
		jumpBtnCls:'jump-btn',	//跳转按钮
		jumpBtn:'跳转',			//跳转按钮文本
		nohiddenPN:true,		//永久显示上页，下页
		jumpIsLocation:true,  //页大小选择是否记住焦点
		callback:function(){}	//回调
	};
	var that=$(this),cachePageSizePath=window.location.pathname;	
	var Pagination = function(element,options){
		//全局变量
		var opts = options,
			current,
			$document = $(document),
			$obj = $(element);
			cachePageSizePath=$obj.attr("id")+cachePageSizePath.replace('.html','').replace(/\//g,'_');
	 		//console.log('cachePageSizePath=',cachePageSizePath);
		// 设置总页数
		this.setTotalPage = function(page){
			return opts.pageCount = page;
		};
		 //重置分页生成 zlb
		this.ReSet=function(totalcount,pagesize){	
			opts.totalData=parseInt(totalcount);
			opts.showData=parseInt(pagesize);
			console.log("$obj.attr('id')=",$obj.attr('id'))
			opts.pageCount=opts.totalData%pagesize==0?Math.floor(opts.totalData/pagesize):Math.floor(opts.totalData/pagesize)+1;
			$("#"+$obj.attr('id')+" .recnPage").html('共<i>'+opts.totalData+'</i>条/<i>'+opts.pageCount+'</i>页');		
			$("#"+$obj.attr('id')+"_pjump").text(pagesize);
			this.filling(current);
		};

		//返回页大小
		this.getPsize=function(){				
			return  parseInt($("#"+$obj.attr('id')+'_pjump').text());
		};
		// 重置页尺寸
		this.reSetPageSize=function(psize){
			opts.showData=psize;	
			opts.pageCount=opts.totalData%psize==0?Math.floor(opts.totalData/psize):Math.floor(opts.totalData/psize)+1;
			$("#"+$obj.attr('id')+" .recnPage").html('共<i>'+opts.totalData+'</i>条/<i>'+opts.pageCount+'</i>页');			
			this.filling(1);
		}		
		 //样式集成 zlb 2016-11-29
		this.createCss=function(){
			if(document.getElementById("yayigj_pagination_css")){
			} else {	
				strCss='.plus_page_css{ font-family:微软雅黑;position: relative;text-align: right;zoom: 1;}';
				strCss+='.plus_page_css a{float: left;margin:0 5px;width: 28px;height: 28px;line-height: 28px;background: #fff;border: 1px solid #ebebeb;color: #bdbdbd;font-size: 14px;text-align:center;text-decoration:none}';
				strCss+='.plus_page_css a:hover{color:#fff;background: '+opts._hoverColor+';border: 1px solid '+opts._hoverColor+';}.plus_page_css .a_c{text-align:center}';
				strCss+='.plus_page_css .next,.plus_page_css .prev{font-size: 16px;font-weight: bold;}';
				strCss+='.plus_page_css .next{background: url(/static/public/img/icons.png) no-repeat 7px -547px;}';
				strCss+='.plus_page_css .next:hover{background-image: url(/static/public/img/icons.png);background-position:-98px -547px;}';
				strCss+='.plus_page_css .prev{background: url(/static/public/img/icons.png) no-repeat 5px -522px;}';				
				strCss+='.plus_page_css .prev:hover{background-image: url(/static/public/img/icons.png);background-position:-100px -522px;}'; 
				strCss+='.plus_page_css .leftFixed,.plus_page_css .rightVar{font-size: 14px;float:none; display:inline-block; width:auto !important}.plus_page_css .leftFixed i{font-style:normal}';
				strCss+='.plus_page_css .jump-btn{ padding:0px 5px 0px 5px}.plus_page_css .recnPage,.plus_page_css .show,.plus_page_css .jump{display:inline-block;margin-right:5px;line-height:30px;height:30px; padding-top:0px;}';
				strCss+='.plus_page_css .recnPage{width:130px;}.plus_page_css .show{width:65px;}.plus_page_css .jump{width:75px;border-radius:2px;border:solid 1px #F2F2F2;box-sizing:border-box;padding-left:5px; text-align:left}';
				strCss+='.plus_page_css .active{float: left;margin:0 5px;width: 28px;height: 28px;line-height: 28px;background: '+opts._activeColor+';color: #fff;font-size: 14px;border: 1px solid '+opts._activeColor+';text-align:center}';
				strCss+='.plus_page_css span{float: left;margin:0 5px;width: 28px;height: 28px;line-height: 28px;color: #000;font-size: 14px;}';
				var nod=$("<style type='text/css' id='yayigj_pagination_css'>"+strCss+"</style>");
				$("head").append(nod);	
			}
		};
		this.getTotalPage = function(){
			var p = opts.totalData || opts.showData ? Math.ceil(parseInt(opts.totalData) / opts.showData) : opts.pageCount;
			return p;
		};

		//获取当前页
		this.getCurrent = function(){
			return current;
		};		
		//左侧固定部分
		this.createInFrme=function(){			
			var html='';
			html+='<span class="recnPage">共<i>'+opts.totalData+'</i>条/<i>'+opts.pageCount+'</i>页</span>';
			html+='<span class="show">每页显示</span>';
			html+='<span class="jump" id="'+$obj.attr('id')+'_pjump">'+opts.showData+'</span>';
			var leftFixed=$("<span	 class='leftFixed'>"+html+"</span>"),
			      rightVar=$("<span	 class='rightVar'></span>");
			$obj.empty().append(leftFixed);
			$obj.append(rightVar);
			
			var genCallFuc=function(){
				opts.jumpCallBack;
				};
				
			$("#"+$obj.attr('id')+"_pjump").yayigj_downlist({
				_callBack:opts.jumpCallBack,	
				_valtype:'text',		
				_isLocation:opts.jumpIsLocation,	
				_data:[
						   {'key':'10','val':"10"},
						   {'key':'20','val':"20"},
						   {'key':'50','val':"50"},
						   {'key':'100','val':"100"}
						 ]
				}); //zlb 2016-12-08
		}
		/************************************
		 * 填充数据
		 * @param int index 页码
		 *************************************/
		 this.filling = function(index){
			var html = '';
			current = index || opts.current;//当前页码
			var pageCount = this.getTotalPage();			
			html += '<a href="javascript:;" class="'+opts.prevCls+'">&nbsp;</a>';
			if(current >= opts.count * 2 && current != 1 && pageCount != opts.count){
				var home = opts.coping && opts.homePage ? opts.homePage : '1';
				html += opts.coping ? '<a href="javascript:;" data-page="1">'+home+'</a><span class="a_c">...</span>' : '';
			}
			var start = current - opts.count,
				end = current + opts.count;
			((start > 1 && current < opts.count) || current == 1) && end++;
			(current > pageCount - opts.count && current >= pageCount) && start++;
			for (;start <= end; start++) {
				if(start <= pageCount && start >= 1){
					if(start != current){
						html += '<a href="javascript:;" data-page="'+start+'">'+ start +'</a>';
					}else{
						html += '<span class="'+opts.activeCls+'">'+ start +'</span>';
					}
				}
			}
			if(current + opts.count < pageCount && current >= 1 && pageCount > opts.count){
				//var end = opts.coping && opts.endPage && pageCount<5? opts.endPage : pageCount;
				var end = opts.coping &&  pageCount<5? opts.endPage : pageCount;
				//html += opts.coping ? '<span class="a_c">...</span><a href="javascript:;" data-page="'+pageCount+'">'+end+'</a>' : '';
				html += opts.coping &&  pageCount>4? '<span class="a_c">...</span><a href="javascript:;" data-page="'+pageCount+'">'+end+'</a>' : '';
			}
			html += '<a href="javascript:;" class="'+opts.nextCls+'">&nbsp;</a>'
			html += opts.jump ? '<input type="text" class="'+opts.jumpIptCls+'"><a href="javascript:;" class="'+opts.jumpBtnCls+'">'+opts.jumpBtn+'</a>' : '';
			$("#"+$obj.attr('id')+" .rightVar").empty().html(html);
		};
		
		//绑定事件
		function gotoFunc(obj){
			var pageCount = this.getTotalPage();//总页数				
		}
		
		this.eventBind = function(){
			var self = this;
			var pageCount = this.getTotalPage();	//总页数	
			$obj.on('input propertychange','.'+opts.jumpIptCls,function(){
				var $this = $(this);
				var val = $this.val();
				var reg = /[^\d]/g;
	            if (reg.test(val)) {
	                $this.val(val.replace(reg, ''));
	            }
	            (parseInt(val) > pageCount) && $this.val(pageCount);
	            if(parseInt(val) === 0){//最小值为1
	            	$this.val(1);
	            }
			});
			//回车跳转指定页码
			$document.keydown(function(e){
				var self = this;
		        if(e.keyCode == 13 && $obj.find('.'+opts.jumpIptCls).val()){
		        	var index = parseInt($obj.find('.'+opts.jumpIptCls).val());
		            self.filling(index);
					typeof opts.callback === 'function' && opts.callback(self);
		        }
		    });
		};
		//初始化
		this.init = function(){
			var self=this;
			this.createCss();
			$obj.addClass('plus_page_css');
			$obj.attr("onselectstart","return false");
			this.createInFrme();
			this.filling(opts.current);
			
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
				for(var i=0;i<icount;i++){
					try{
						if(linkHref[i].href.indexOf('r_input.css')>-1){
							var cssFileObj=[];
							cssFileObj.push(linkHref[i].cssRules[3].cssText.split('{')[1].split(';').sort());	
							cssFileObj.push(linkHref[i].cssRules[4].cssText.split('{')[1].split(';').sort());	
							cssFileObj.push(linkHref[i].cssRules[5].cssText.split('{')[1].split(';').sort());	
							//console.log('css--FileObj=',cssFileObj);
							//document.write('<hr>'+cssFileObj);
							opts._borderColor=cssFileObj[0][0].replace('background-color: ','');
							opts._hoverColor=cssFileObj[1][0].replace('background-color: ','');
							opts._activeColor=cssFileObj[2][0].replace('background-color: ','');
							//alert(opts._borderColor+'-'+opts._hoverColor+'-'+opts._activeColor);						
							break;
						}
					}catch(e){}
				}
			}

			$(document).on("click","#"+$obj.attr("id")+"  a",function(){
				var pageCount = self.getTotalPage();//总页数					
				if($(this).hasClass(opts.nextCls)){
					var index = parseInt($obj.find('.'+opts.activeCls).text()) + 1;
					if(index>pageCount){return false;}
				}else if($(this).hasClass(opts.prevCls)){
					var index = parseInt($obj.find('.'+opts.activeCls).text()) - 1;
					if(index<1){return false;}
				}else if($(this).hasClass(opts.jumpBtnCls)){
					if($obj.find('.'+opts.jumpIptCls).val() !== ''){
						var index = parseInt($obj.find('.'+opts.jumpIptCls).val());
					}else{
						return;
					}
				}else{
					var index = parseInt($(this).data('page'));
				}
				if(index>pageCount){  
					index=pageCount;	
				}else{
					self.filling(index);
					typeof opts.callback === 'function' && opts.callback(self);
				}
				});
		};
		
		this.init();
	};
	$.fn.pagination = function(parameter,callback){
		if(typeof parameter == 'function'){//重载
			callback = parameter;
			parameter = {};
		}else{
			parameter = parameter || {};
			callback = callback || function(){};
		}
		var options = $.extend({},defaults,parameter);
		return this.each(function(){
			var pagination = new Pagination(this, options);
			callback(pagination);
		});
	};
})(jQuery,window,document);