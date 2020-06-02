	var userid = getUrlParam("userid");
	console.log(userid);
   //获取url中的参数
  	//var pageApi=null;
	//默认查询条件
	// var swhereObj={
	// 	pagesize:10,
	// 	page:1,
	// 	totalcount:-1
	// };
$(function(){
	// 分页插件绑定
	// $('#pagerinfo').pagination({
	// 	totalData:50,//总条数
	// 	showData:20,//每页显示条数
	// 	pageCount:20,//共多少页
	// 	coping:true,
	// 	count:2,
	// 	jumpCallBack:jump,//跳转回调
	// 	callback:function(index){
	// 		swhereObj.page=index.getCurrent();//更改请求的当前页即可
	// 		gotoPage(swhereObj);//点页码后的回调
	// 	}
	// },function(api){			
	// 	pageApi=api;
	// });
	gotoPage()
})
  function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r==null){
        return ""
      }
      return unescape(r[2]); //返回参数值
  }

function gotoPage(){
		$("body").prepend("<div class='loading'></div>");
		//console.log(totalcount)
		var dataParameter = {
			"userid":userid
		}
		$.ajax({
			type:"post",
			url:"/butlerp/college/userdetaildata",
			dataType:"json",
			data:dataParameter,
		})
		.done(function(data){
			console.log(data);
			$("body").find(".loading").remove();
			// pageApi.ReSet(parseInt(data.totalcount),parseInt(data.pagesize));//重置记录数，页码及分页信息
			 // if(parseInt(data.totalcount)>0){
			 // 	$("#pager").show();
			 // }
			var Li='';
			console.log(data.list)
			if(data.list==null){
				Li+='<ul class="info_con"><li>';
					Li+='<div class="error"><img src="/static/finance/img/no-data.png"></div>';
				Li+='</li></ul>';
				//$("#pager").hide();//隐藏分页
			}else{
				$("#pager").show();
				$(data.list).each(function(k,v){
				   Li+='<ul class="info_con">'+
				           '<li><span class="sp1">创建时间：</span><span class="sp2">'+v.createtime+'</span></li>'+
				           '<li><span class="sp1">手机号码：</span><span class="sp2">'+v.mobile+'</span></li>'+
				           '<li><span class="sp1">姓名：</span><span class="sp2">'+v.doctorname+'</span></li>'+
				           '<li><span class="sp1">诊所：</span><span class="sp2">'+v.doctorname+'</span></li>'+
				           '<li><span class="sp1">当前积分：</span><span class="sp2">'+v.integral+'</span></li>'+
				           '<li><span class="sp1">累计消费金额：</span><span class="sp2">'+v.consumefee+'</span></li>'+
				           '<li class="recommend"><span class="sp1">他推荐的人：</span><span class="sp2">'
				    $(v.sender).each(function(k1,v1){
				    	Li+='<p>'+v1.receivermobile+'</p>'
				    })
				    Li+='</span></li>'+
				           '<li class="recommend"><span class="sp1">推荐他的人：</span><span class="sp2">'
				    $(v.receiver).each(function(k2,v2){
				    	Li+='<p>'+v2.receivermobile+'</p>'
				    })
                    Li+='</li></ul>'
				});
			}
			console.log(Li);
			$("#detail_con").empty().prepend(Li);
		})
		.fail(function(){
			console.log("error");
		});
	}

	// function jump(params){
	// 	swhereObj.pagesize=params;			//1-更改条件值
 //        swhereObj.page=1;
	// 	gotoPage(swhereObj);				//2-重新请求第一页数据
	// 	pageApi.reSetPageSize(params);		//3-调用api刷新页码信息
	// }	