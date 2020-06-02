	var College_add_user = null;
	var College_import = null;
	var college = 'yhgl';

$(function(){

	// $("#BeginDate").yayigj_date_Sel();
	// $("#EndDate").yayigj_date_Sel();
	
	//加载页面获取当天日期
	// $("#BeginDate").getCurrday();
	// $("#EndDate").getCurrday();

	$("#scroll_div_1").scroll(function(event) {	
        var head = $("#thead_1");
        if( $(this).scrollTop() >= 30 ){
            head.css('transform','translateY('+($(this).scrollTop())+'px)');				
        }else{
            head.css('transform','translateY('+(0)+'px)' );
        }			
	});
     //添加用户
	$('#add').off('click').on('click',function(){
		add_user()
	})
    //批量
	$('#import').off('click').on('click',function(){
		college_import(college)
	})
    //修改  暂时屏蔽此功能
	$(document).off('click','.modify').on('click','.modify',function(){
	//	add_user()
	})
    //查看   
	$(document).off('click','.see').on('click','.see',function(){
		var userid = $(this).parent().parent().find('td:eq(1)').attr('data-id');
		location.href="/butlerp/college/userdetailpage?userid="+userid; 
	})
    //删除   暂时屏蔽此功能
	$(document).off('click','.delete').on('click','.delete',function(){
		jQuery.showAsk('是否删除！','信息提醒',
                function(){
                    jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'}); 
                        $.ajax({
                          type:"post",
                          url:'/patient/visitarrive',
                          dataType:"json",
                          data:{
                              "userid":userid,      //用户ID
                              "customerid":customerid             //患者ID
                          },
                          beforeSend:function(){  
                                  jQuery.loading('',-1);
                          },
                          complete: function(data){jQuery.loading_close(-1);},
                          success: function(json){
                                if(json.code==1){
                                  
                                }
                          }
                    })
        },
        function(){
            jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
        }
        )
	})

    //点击出现添加用户弹窗
	function add_user(){
      College_add_user =jQuery.yayigjCollege_add_user({UrlParam:'',title:'添加用户',_titleAlign:"center",callbackfunc:function(para,params){
      	
      	$("#search_bun").click();
      	if (para.code) {
      		jQuery.postFail('fadeInUp','添加成功');
      	}
      }}); 
    
    }
    //点击出现导入弹窗
	function college_import(college){
      College_import =jQuery.yayigjCollege_import({UrlParam:'&college='+escape(college)+'',title:'批量导入',_titleAlign:"center",callbackfunc:function(params){}}); 
    }

	var pageApi=null;
	//默认查询条件
	var swhereObj={
		pagesize:10,
		page:1,
		totalcount:-1,
		val:$("#search_val").val()
	};
	// 分页插件绑定
	$('#pager').pagination({
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
		swhereObj.page=1;			        //2-重新请求第一页数据
		gotoPage(swhereObj);				//
		pageApi.reSetPageSize(params);		//3-调用api刷新页码信息
	}	

	function gotoPage(w_Obj){
		$("body").prepend("<div class='loading'></div>");
		//console.log(totalcount)
		var dataParameter = {
			condition:w_Obj.val,
			//totalcount:-1,
			totalcount:w_Obj.totalcount,
			page:w_Obj.page,
			per_page:w_Obj.pagesize
		}
		$.ajax({
			type:"post",
			url:"/butlerp/college/userdata",
			dataType:"json",
			data:dataParameter,
		})
		.done(function(data){
			console.log(data);
			$("body").find(".loading").remove();
			pageApi.ReSet(parseInt(data.totalcount),parseInt(data.pagesize));//重置记录数，页码及分页信息
			if(parseInt(data.totalcount)>0){
				$("#pager").show();
			}
			var html='';
			html+='<thead id="thead_1"><tr>';
				html+='<th align="left" style="width:25%;">手机号码</th>';
				html+='<th align="left" style="width:25%;">姓名</th>';
				//html+='<th align="left">门诊</th>';
				html+='<th align="left" style="width:25%;">当前积分</th>';
				html+='<th align="left" style="width:25%;">操作</th>';
			html+='</tr></tead><tbody>';
			if(data.list==null){
				html+='<tr class="no_data">';
					html+='<td colspan="12"></td>';
				html+='</tr></tbody>';
				$("#pager").hide();//隐藏分页
			}else{
				$(data.list).each(function(index,el){
					html+='<tr>';
						html+='<td align="left">'+el.mobile+'</td>';
						html+='<td align="left" data-id="'+el.userid+'">'+el.doctorname+'</td>';
						//html+='<td align="left"></td>';
						html+='<td align="left">'+el.integral+'</td>';
						html+='<td align="left"><span class="see">查看</span></td>';
						//html+='<td align="center"><span class="see">查看</span><span class="modify">修改</span><span class="delete">删除</span></td>';
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
	//查询,默认加载一次
	$("#search_bun").off('click').on('click',function(){
		 swhereObj.val=$("#search_val").val();
		// swhereObj.totalcount=$("#pager_pjump").text();
		// swhereObj.condition=$.trim($("input[name=condition]").val());
		//重置当前页
		swhereObj.page=1;
		pageApi.filling(1);
		gotoPage(swhereObj);
	}).trigger('click');
});