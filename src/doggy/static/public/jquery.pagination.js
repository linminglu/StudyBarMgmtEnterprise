/**
 * pagination分页插件
 zlb 修改整理
 */
;(function($,window,document,undefined){
	//配置参数
	var defaults = {
		totalData:0,			//数据总条数
		showData:0,				//每页显示的条数
		pageCount:9,			//总页数,默认为9
		current:1,				//当前第几页
		prevCls:'prev',			//上一页class
		nextCls:'next',			//下一页class
		prevContent:'<',		//上一页内容
		nextContent:'>',		//下一页内容
		activeCls:'active',		//当前页选中状态
		coping:false,			//首页和尾页
		homePage:'',			//首页节点内容
		endPage:'',				//尾页节点内容
		count:3,				//当前页前后分页个数
		jump:false,				//跳转到指定页数
		jumpIptCls:'jump-ipt',	//文本框内容
		jumpBtnCls:'jump-btn',	//跳转按钮
		jumpBtn:'跳转',			//跳转按钮文本
		callback:function(){}	//回调
	};
	var that=$(this);
	var Pagination = function(element,options){
		//全局变量
		var opts = options,//配置
			current,//当前页
			$document = $(document),
			$obj = $(element);//容器

		/**
		 * 设置总页数
		 * @param int page 页码
		 * @return opts.pageCount 总页数配置
		 */
		this.setTotalPage = function(page){
			return opts.pageCount = page;
		};

		/*
		 * 重置分页生成 zlb
		 * @return int p 总页数
		 */
		this.ReSet=function(totalcount,pagesize){	
			opts.totalData=totalcount;
			opts.showData=pagesize;
			this.filling(1);
		};

		/*
		 * 样式集成 zlb 2016-11-29
		 * @return int p 总页数
		 */
		this.createCss=function(){
			if(document.getElementById("yayigj_pagination_css")){
			} else {	
				strCss='.plus_page_css{ font-family:微软雅黑;position: relative;text-align: center;zoom: 1;}';
				strCss+='.plus_page_css a{float: left;margin:0 5px;width: 28px;height: 28px;line-height: 28px;background: #fff;border: 1px solid #ebebeb;color: #bdbdbd;font-size: 14px;text-align:center;text-decoration:none}';
				strCss+='.plus_page_css a:hover{color:#fff;background: #00c5b5;border: 1px solid #00c5b5;}';
				strCss+='.plus_page_css .next,.plus_page_css .prev{font-size: 16px;font-weight: bold;}';
				strCss+='.plus_page_css .jump-btn{ padding:0px 5px 0px 5px}';
				strCss+='.plus_page_css .active{float: left;margin:0 5px;width: 28px;height: 28px;line-height: 28px;background: #00c5b5;color: #fff;font-size: 14px;border: 1px solid #00c5b5;text-align:center}';
				strCss+='.plus_page_css span{float: left;margin:0 5px;width: 28px;height: 28px;line-height: 28px;color: #bdbdbd;font-size: 14px;}';
				strCss+='.plus_page_css input{float: left;margin:0 5px;width: 28px;height: 28px;line-height: 28px;text-align: center;background: #fff;border: 1px solid #ebebeb;outline: none;color: #bdbdbd;font-size: 14px;}';
				var nod=$("<style type='text/css' id='yayigj_pagination_css'>"+strCss+"</style>");
				$("head").append(nod);	
			}
		};
		/**
		 * 获取总页数
		 * @return int p 总页数
		 */
		this.getTotalPage = function(){
			var p = opts.totalData || opts.showData ? Math.ceil(parseInt(opts.totalData) / opts.showData) : opts.pageCount;
			return p;
		};

		//获取当前页
		this.getCurrent = function(){
			return current;
		};
		/**
		 * 填充数据
		 * @param int index 页码
		 */
		this.filling = function(index){
			var html = '';
			current = index || opts.current;//当前页码
			var pageCount = this.getTotalPage();
			if(current > 1){//上一页
				html += '<a href="javascript:;" class="'+opts.prevCls+'">'+opts.prevContent+'</a>';
			}else{
				$obj.find('.'+opts.prevCls) && $obj.find('.'+opts.prevCls).remove();
			}
			if(current >= opts.count * 2 && current != 1 && pageCount != opts.count){
				var home = opts.coping && opts.homePage ? opts.homePage : '1';
				html += opts.coping ? '<a href="javascript:;" data-page="1">'+home+'</a><span>...</span>' : '';
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
				var end = opts.coping && opts.endPage ? opts.endPage : pageCount;
				html += opts.coping ? '<span>...</span><a href="javascript:;" data-page="'+pageCount+'">'+end+'</a>' : '';
			}
			if(current < pageCount){//下一页
				html += '<a href="javascript:;" class="'+opts.nextCls+'">'+opts.nextContent+'</a>'
			}else{
				$obj.find('.'+opts.nextCls) && $obj.find('.'+opts.nextCls).remove();
			}

			html += opts.jump ? '<input type="text" class="'+opts.jumpIptCls+'"><a href="javascript:;" class="'+opts.jumpBtnCls+'">'+opts.jumpBtn+'</a>' : '';

			$obj.empty().html(html);
		};
		//绑定事件
		this.eventBind = function(){
			var self = this;
			var pageCount = this.getTotalPage();//总页数
			$obj.off().on('click','a',function(){
				if($(this).hasClass(opts.nextCls)){
					var index = parseInt($obj.find('.'+opts.activeCls).text()) + 1;
				}else if($(this).hasClass(opts.prevCls)){
					var index = parseInt($obj.find('.'+opts.activeCls).text()) - 1;
				}else if($(this).hasClass(opts.jumpBtnCls)){
					if($obj.find('.'+opts.jumpIptCls).val() !== ''){
						var index = parseInt($obj.find('.'+opts.jumpIptCls).val());
					}else{
						return;
					}
				}else{
					var index = parseInt($(this).data('page'));
				}
				self.filling(index);
				typeof opts.callback === 'function' && opts.callback(self);
			});
			//输入跳转的页码
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
			this.createCss();
			$obj.addClass('plus_page_css');
			this.filling(opts.current);
			this.eventBind();
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