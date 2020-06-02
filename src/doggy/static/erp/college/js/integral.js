	var College_add_integral = null;
	var College_import = null;
	var college = 'jfgl';

	var pageApi=null;
	//默认查询条件
	var swhereObj={
		pagesize:10,
		page:1,
		totalcount:-1,
		val:$("#search_val").val()
	};
	
$(function(){
		// 分页插件绑定
	$('#pager_integral').pagination({
		totalData:50,//总条数
		showData:20,//每页显示条数
		pageCount:20,//共多少页
		coping:true,
		count:2,
		jumpCallBack:jump,//跳转回调
		callback:function(index){
			swhereObj.page=index.getCurrent();//更改请求的当前页即可
			gotoPage(swhereObj);//点页码后的回调
		}
	},function(api){			
		pageApi=api;
	});
	
	function jump(params){
		swhereObj.pagesize=params;			//1-更改条件值
		swhereObj.page=1;	                //2-重新请求第一页数据
		gotoPage(swhereObj);				
		pageApi.reSetPageSize(params);		//3-调用api刷新页码信息
	}
	$("#scroll_div_1").scroll(function(event) {	
        var head = $("#thead_1");
        if( $(this).scrollTop() >= 30 ){
            head.css('transform','translateY('+($(this).scrollTop())+'px)');				
        }else{
            head.css('transform','translateY('+(0)+'px)' );
        }			
	});
//添加
	$('#add_integral').off('click').on('click',function(){
		add_integral()
	})
//修改  暂时屏蔽
	$(document).off('click','.modify').on('click','.modify',function(){
		//add_integral()
	})
//删除
	$(document).off('click','.delete').on('click','.delete',function(){
		var integralid = $(this).parent().parent().attr('data-id');
		console.log(integralid);
		jQuery.showAsk('是否删除！','信息提醒',
                function(){
                    jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'}); 
                        $.ajax({
                          type:"post",
                          url:'/butlerp/college/integraldel',
                          dataType:"json",
                          data:{
                              "integralid":integralid     //主键记录ID
                          },
                          beforeSend:function(){  
                                  jQuery.loading('',-1);
                          },
                          complete: function(data){jQuery.loading_close(-1);},
                          success: function(json){
                                if(json.code==1){
                                  gotoPage(swhereObj)
                                }
                          }
                    })
		    },
		    function(){
		            jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
		    }
        )
	})
//批量
	$('#import').off('click').on('click',function(){
		college_import(college)
	})

		//查询,默认加载一次
	$("#search_bun").off('click').on('click',function(){
		swhereObj.val=$("#search_val").val();
		//重置当前页
		swhereObj.page=1;
		pageApi.filling(1);
		gotoPage(swhereObj);
	}).trigger('click');


    //点击出现添加用户弹窗
	function add_integral(){
      College_add_integral =jQuery.yayigjCollege_add_integral({UrlParam:'',title:'添加积分记录',_titleAlign:"center",callbackfunc:function(params){
      	gotoPage(swhereObj)
      }}); 
    }
    //点击出现导入弹窗
	function college_import(college){
      College_import =jQuery.yayigjCollege_import({UrlParam:'&college='+escape(college)+'',title:'批量导入',_titleAlign:"center",callbackfunc:function(params){}}); 
    }

	function gotoPage(w_Obj){
		$("body").prepend("<div class='loading'></div>");
		var dataParameter = {
			condition:w_Obj.val,
			totalcount:w_Obj.totalcount,
			page:w_Obj.page,
			per_page:w_Obj.pagesize
		}
		$.ajax({
			type:"post",
			url:"/butlerp/college/integraldata",
			dataType:"json",
			data:dataParameter,
		})
		.done(function(data){
			console.log(data);
			$("body").find(".loading").remove();
			pageApi.ReSet(parseInt(data.totalcount),parseInt(data.pagesize));//重置记录数，页码及分页信息
			if(parseInt(data.totalcount)>0){
				$("#pager_integral").show();
			}
			var html='';
			html+='<thead id="thead_1"><tr>';
				html+='<th align="left" style="width:14%;">交易时间</th>';
				html+='<th align="left" style="width:11%;">手机号码</th>';
				html+='<th align="left" style="width:9%;">姓名</th>';
				html+='<th align="left" style="width:9%;">类型</th>';
				html+='<th align="left" style="width:9%;">课程类型</th>';
				html+='<th align="left" style="width:11%;">课程名称</th>';
				html+='<th align="left" style="width:10%;">推荐人</th>';
				html+='<th align="left" style="width:9%;">本次消费</th>';
				html+='<th align="left" style="width:8%;">本次积分</th>';
				html+='<th align="left" style="width:10%;">操作</th>';
			html+='</tr></tead><tbody>';
			if(data.list==null){
				html+='<tr class="no_data">';
					html+='<td colspan="12"></td>';
				html+='</tr></tbody>';
				$("#pager_integral").hide();//隐藏分页
			}else{
				$(data.list).each(function(index,el){
					
					html+='<tr data-id="'+el.integralid+'">';
						html+='<td align="left">'+el.consumedate+'</td>';
						html+='<td align="left" data-id="'+el.userid+'">'+el.mobile+'</td>';
						html+='<td align="left">'+el.name+'</td>';
						html+='<td align="left">'+el.integraltype+'</td>';
						html+='<td align="left">'+el.coursetype+'</td>';
						html+='<td align="left">'+el.coursename+'</td>';
						html+='<td align="left">'+el.referrermobile+'</td>';
						html+='<td align="left">'+el.consumefee+'</td>';
						html+='<td align="left">'+el.integral+'</td>';
						html+='<td align="left"><span class="delete">删除</span></td>';
						//html+='<td align="left"><span class="modify">修改</span><span class="delete">删除</span></td>';
					html+='</tr>';
				});
				html+='</tbody>';
			}
			$("#js_userlist_data").empty().prepend(html);
		})
		.fail(function(){
			console.log("error");
		});
	}
	//gotoPage(swhereObj)
});
