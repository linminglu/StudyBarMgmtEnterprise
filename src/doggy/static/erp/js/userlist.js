$(function(){
	$("#BeginDate").yayigj_date_Sel();
	$("#EndDate").yayigj_date_Sel();
	
	//加载页面获取当天日期
	$("#BeginDate").getCurrday();
	$("#EndDate").getCurrday();

	$("#scroll_div_1").scroll(function(event) {	
        var head = $("#thead_1");
        if( $(this).scrollTop() >= 30 ){
            head.css('transform','translateY('+($(this).scrollTop())+'px)');				
        }else{
            head.css('transform','translateY('+(0)+'px)' );
        }			
	});

	var pageApi=null;
	//默认查询条件
	var swhereObj={
		pagesize:10,
		page:1
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
		swhereObj.page=1;
		gotoPage(swhereObj);				//2-重新请求第一页数据
		pageApi.reSetPageSize(params);		//3-调用api刷新页码信息
	}	

	function gotoPage(w_Obj){
		$("body").prepend("<div class='loading'></div>");
		var dataParameter = {
			start_time:w_Obj.beginDate,
			end_time:w_Obj.endDate,
			condition:w_Obj.condition,
			page:w_Obj.page,
			per_page:w_Obj.pagesize
		}
		$.ajax({
			type:"post",
			url:"/butlerp/users",
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
				html+='<th align="left">用户编号</th>';
				html+='<th align="center">头像</th>';
				html+='<th align="left">姓名</th>';
				html+='<th align="left">账号</th>';
				html+='<th align="center">性别</th>';
				html+='<th align="left">创建门诊</th>';
				html+='<th align="left">关联门诊</th>';
				html+='<th align="left">所在地</th>';
				html+='<th align="left">来源渠道</th>';
				html+='<th align="left">IP</th>';
				html+='<th align="left">注册时间</th>';
				html+='<th align="center">操作</th>';
			html+='</tr></tead><tbody>';
			if(data.list==null){
				html+='<tr class="no_data">';
					html+='<td colspan="12"></td>';
				html+='</tr></tbody>';
				$("#pager").hide();//隐藏分页
			}else{
				$(data.list).each(function(index,el){
					var source="";
					switch(el.source){
						case 0:
							source="未知来源";
							break;
						case 1:
							source="扫描登录";
							break;
						case 2:
							source="手机注册";
							break;
						case 3:
							source="KQ88";
							break;
						case 4:
							source="微信扫描";
							break;
						case 5:
							source="pc绑定";
							break;
						case 6:
							source="商学院后台增加";
							break;
						default:
							source="";
					}
					html+='<tr>';
						html+='<td align="left">'+el.user_no+'</td>';
						if(el.picture==""){
							html+='<td align="center"><img width="64" height="64" src="/static/erp/img/user-img-default.png" /></td>';
						}else{
							html+='<td align="center"><img width="64" height="64" src="'+el.picture+'" /></td>';
						}
						html+='<td align="left">'+el.name+'</td>';
						html+='<td align="left">'+el.mobile+'</td>';
						html+='<td align="center">'+el.sex+'</td>';
						html+='<td align="left">'+el.found_clinic.replace(/,/g,"<br>")+'</td>';
						html+='<td align="left">'+el.connected_clinic.replace(/,/g,"<br>")+'</td>';
						html+='<td align="left">'+el.area+'</td>';
						html+='<td align="left">'+source+'</td>';
						html+='<td align="left">'+el.ip_addr+'</td>';
						html+='<td align="left">'+el.regist_time+'</td>';
						html+='<td align="center"><a href="/butlerp/users/'+el.uid+'/info" target="_blank">查看详情</a></td>';
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
	$("input[name=userlist_btn]").click(function(){
		swhereObj.beginDate=$("#BeginDate").text();
		swhereObj.endDate=$("#EndDate").text();
		swhereObj.condition=$.trim($("input[name=condition]").val());
		//重置当前页
		swhereObj.page=1;
		pageApi.filling(1);
		gotoPage(swhereObj);
	}).trigger('click');
});