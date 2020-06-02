$(function(){
	/* 进入页面后安装默认的每页10条，加载所有的数据*/
	get_login_record();
	get_action_record();
	$(".announce_list").each(function(){
		$(this).click(function(){
			$(".announce_list[data-active='1']").attr("data-active","0");
			$(this).attr("data-active","1");
			if($(this).children(".announce_detail").css("display")=="block"){
				$(this).children(".announce_detail").hide();
			}else{
				$(this).children(".announce_detail").show();
			}
			if($(this).children(".triangle").css("display")=="block"){
				$(this).children(".triangle").hide();
			}else{
				$(this).children(".triangle").show();
			}
		})
	});
	//点击左边列表切换颜色和图标
	$(".announcement_left li").click(function(){
		var index=$(this).index();
		$(".h_main_right[data-con='1']").attr("data-con","0");
		if(index==0){
			$(this).children("img").attr("src","/static/account/img/his_icon2.png");
			$(this).siblings("li").children("img").attr("src","/static/account/img/opera_icon1.png");	
		}
		else if(index==1){
			$(this).children("img").attr("src","/static/account/img/opera_icon2.png");
			$(this).siblings("li").children("img").attr("src","/static/account/img/his_icon1.png");
		}
		$(".h_main_right").eq(index).attr("data-con","1");	
		$("li[data-flag='1']").attr("data-flag","0");
		$(this).attr("data-flag","1");
	})
	
	$(".announce_detail a").click(function(){
		$(".h_main_right[data-con='1']").attr("data-con","0");
		$(".h_main_right").eq(2).attr("data-con","1");
	});
	/*四个点击日历插件*/
	$("#timeLine1").calendar({     
		  callback: function () {  
			  $("#timeLine1").removeClass('active');
		  }    
	 }) ;
	 $("#timeLine2").calendar({     
		  callback: function () {  
			  $("#timeLine2").removeClass('active');
		  }    
	 })	;	
	  $("#timeLine3").calendar({     
	 	  callback: function () {  
			  $("#timeLine3").removeClass('active');
		  }    
	  }) ;
	  $("#timeLine4").calendar({     
	 	  callback: function () {  
	 		  $("#timeLine4").removeClass('active');
	 	  }    
	  });
//点击查询 登陆记录
	  var cur=0;
	  $("#login_record").click(function(){
		    cur=1;
	  		get_login_record(cur);
	  })
	  //点击每页数切换
	  $("#pageCount_h").change(function(){
		    cur=1;
	  		get_login_record(cur);
	  })
	  //点击当前页数切换、切换颜色
	  $(document).on("click","#pages span",function(){
		    cur=parseInt($(this).text());
			// console.log(cur); 
			$("#pages span[data-f='1']").attr("data-f","0");
			$(this).attr("data-f","1");
	  		get_login_record(cur);
	  })
	  $("#prev").click(function(){
		  	cur=parseInt($("#pages span[data-f='1']").text())-1;
			if(cur<1){
				cur=1
			}else{
				get_login_record(cur);
			}
		/*	console.log(cur);*/
	  })
	  $("#next").click(function(){
		    cur=parseInt($("#pages span[data-f='1']").text())+1;
			var len=$("#pages span").length;
			if(len<6){
				if(cur>len){
					cur=len;	
				}else{
					get_login_record(cur);	
				}
			}else{
				if(cur>parseInt($("#pages span").eq(len-1).text())){
					cur=parseInt($("#pages span").eq(len-1).text());
				}else{
					get_login_record(cur);	
				}	
				
			}
		/*	console.log(cur);*/
	  })
})
 function get_login_record(cur_page){
	 var timeLine1=$("#timeLine1").val();//开始时间
	 var timeLine2=$("#timeLine2").val();//结束时间
	 var ck=ckdate(timeLine1,timeLine2);
	 if(ck==false){
		return false;	 
	 }else{
		 var termType1=$("#termType1").val();//终端类型
		 termType1=sw(termType1);//将终端类型转化
		 var pageCount_h=$("#pageCount_h").val();//每页多少条
	 
		$.ajax({
			type:'POST',
			url:'GetLoginRecord',
			dataType:'json',
			data:{	start_time:timeLine1,
					end_time:timeLine2,
					terminal:termType1,
					per_page:pageCount_h,
					page:cur_page
				},
			beforeSend:function(){
				$(".loading").show();
				$("#hisRec tbody").html("");
				$(".minH").show();
				$("#pop_info1").hide();
				$(".his_s").hide();
				},
			complete:function(data){
				$(".loading").hide();
				$(".minH").hide();
			},
			success:function(result){
				//console.log(result);
				if (result.code=1) {
					var total=parseInt(result.totalcount);//数据总数量
					var per_page=$("#pageCount_h").val();//每页的数量
					var pages=parseInt(total/per_page)+1;//总共页数				
					var cur_page=parseInt(result.pageno);//当前第几页
					/*console.log(pages);*/
					$("#pageNum_h").text(pages);
					$("#pageCount_h").val(per_page);
					var per_lists=Math.min(per_page,total);
					/*组装页数，最多显示5页，多了就显示...*/
						var list=[];
						if (total<0||total==0) {
							$("#pop_info1").show();
							$("#hisRec tbody").html("");
						}else{
							$("#pop_info1").hide();
							$.each(result.list,function(k,v){
								list+="<tr>"+"<td>"+v.logindatetime+"</td>"+"<td>"+v.address+"</td>"+"<td>"+v.ipaddr+"</td>"+"<td>"+v.browser+"</td>"+
										"<td>"+v.loginmode+"</td>"+"<td>"+v.username+"</td>"+"<td>"+v.terminal+"</td>"+"</tr>";		
							})
							$("#hisRec tbody").html(list);
							/*页码分页 */
								var span="";
								if(pages<7){
									if(pages==0){
										$(".his_s").hide();	
									}
									else if(pages<6){
										$(".his_s").show();
										for(var i=1;i<pages+1;i++){
											if(i==cur_page){
												span+="<span data-f='1'>"+i+"</span>";
											}else{
												span+="<span data-f='0'>"+i+"</span>";	
											}
										}
										$("#pages").html(span);
									}
									else{
										$(".his_s").show();
										for(var i=1;i<7;i++){
											if(i==cur_page){
												span+="<span data-f='1'>"+i+"</span>";
											}else{
												span+="<span data-f='0'>"+i+"</span>";	
											}
										}
										$("#pages").html(span);
									}		
								}
								else{
									$(".his_s").show();
									/*var span_a="";*/
									if(cur_page<6){
										for (var i=1;i<6;i++) {
											if (i==cur_page) {
												span+="<span data-f='1'>"+i+"</span>";
											}else{
												span+="<span data-f='0'>"+i+"</span>";
											}
										}
										span+="<b class='span_a'>...</b>";
										span+="<span data-f='0'>"+pages+"</span>";
										$("#pages").html(span);
									}else{
										if(cur_page<pages){
											for (var i=cur_page-4;i<cur_page+1;i++) {
												if (i==cur_page) {
													span+="<span data-f='1'>"+i+"</span>";
												}else{
													span+="<span data-f='0'>"+i+"</span>";
												}
											}
										span+="<b class='span_a'>...</b>";
										span+="<span data-f='0'>"+pages+"</span>";
										$("#pages").html(span);	
										}
										if(cur_page==pages){
											span+="<span data-f='0'>"+1+"</span>";
											span+="<b class='span_a'>...</b>";
											for (var i=cur_page-4;i<cur_page+1;i++) {
												if (i==cur_page) {
													span+="<span data-f='1'>"+i+"</span>";
												}else{
													span+="<span data-f='0'>"+i+"</span>";
												}
											}
										}
										$("#pages").html(span);	
									}
								}
						}	
						
				}
				else{
				}
			},
			error:function(data){
				//console.log("error: "+data);
			}
		})	 
	 }
	
}	
/*点击查询操作记录*/
	 $("#action_record").click(function(){
		    cur=1;
	  		get_action_record(cur);
	  })
	  //点击每页数切换
	  $("#pageCount_a").change(function(){
		    cur=1;
	  		get_action_record(cur);
	  })
	  //点击当前页数切换、切换颜色
	  $(document).on("click","#pages_act span",function(){
		    cur=$(this).index()+1;
			//console.log(cur); 
			$("#pages_act span[data-f='1']").attr("data-f","0");
			$(this).attr("data-f","1");
	  		get_action_record(cur);
	   })
	  $("#prev_act").click(function(){
		  	cur=parseInt($("#pages_act span[data-f='1']").text())-1;
			if(cur<1){
				cur=1
			}else{
				get_action_record(cur);
			}
			//console.log(cur);
	  })
	  $("#next_act").click(function(){
		    cur=parseInt($("#pages_act span[data-f='1']").text())+1;
			var len=$("#pages_act span").length;
			if(len<6){
				if(cur>len){
					cur=len;	
				}else{
					get_action_record(cur);	
				}
			}else{
				if(cur>parseInt($("#pages_act span").eq(len-1).text())){
				   cur=parseInt($("#pages_act span").eq(len-1).text());
				}else{
					get_action_record(cur);	
				}	
			}
			//console.log(cur);
	  })
 function get_action_record(cur_page){
	 var timeLine3=$("#timeLine3").val();//开始时间
	 var timeLine4=$("#timeLine4").val();//结束时间
	 var termType2=$("#termType2").val();//终端类型
	  termType2=sw(termType2)//转化终端类型
	 var pageCount_h=$("#pageCount_a").val();//每页多少条
	 var ck=ckdate(timeLine3,timeLine4);/*判断结束时间比开始时间早*/
	 if(ck==false){
		return false;	 
	 }else{
		$.ajax({
			type:'POST',
			url:'GetActionRecord',
			dataType:'json',
			data:{	start_time:timeLine3,
					end_time:timeLine4,
					terminal:termType2,
					per_page:pageCount_h,
					page:cur_page
				},
			beforeSend:function(){
				$(".loading").show();
				$("#actRec tbody").html("");
				$(".minH").show();
				$("#pop_info2").hide();
				$(".act_s").hide();
				},
			complete:function(data){
				$(".loading").hide();
				$(".minH").hide();
			},
			success:function(result){
				if (result.code=1) {
					var total=parseInt(result.totalcount);//数据总数量
					var per_page=$("#pageCount_a").val();//每页的数量
					var pages=parseInt(total/per_page)+1;//总共页数				
					var cur_page=parseInt(result.pageno);//当前第几页
					$("#pageNum_a").text(pages);
					$("#pageCount_a").val(per_page);
					var per_lists=Math.min(per_page,total);
					/*组装页数，最多显示5页，多了就显示...*/
					var list=[];
					if (total<0||total==0) {
						$("#pop_info2").show();
						$("#actRec tbody").html("");
					}else{
						$("#pop_info2").hide();
						$.each(result.list,function(k,v){
							list+="<tr>"+
								"<td>"+v.OperateDatetime+"</td>"+"<td>"+v.address+"</td>"+
								"<td>"+v.ipaddr+"</td>"+"<td>"+v.action+"</td>"+"<td>"+v.operator+"</td>"+
								"<td>"+v.terminal+"</td>"+
								"</tr>"	
						})
						$("#actRec tbody").html(list);
						var span="";
					if(pages<7){
						if(pages==0){
							$(".act_s").hide();	
						}else if(pages<6){
							$(".act_s").show();
							for(var i=1;i<pages+1;i++){
								if(i==cur_page){
									span+="<span data-f='1'>"+i+"</span>";
								}else{
									span+="<span data-f='0'>"+i+"</span>";	
								}
							}
							$("#pages_act").html(span);
						}
						else{
							$(".act_s").show();
							for(var i=1;i<7;i++){
								if(i==cur_page){
									span+="<span data-f='1'>"+i+"</span>";
								}else{
									span+="<span data-f='0'>"+i+"</span>";	
								}
							}
							$("#pages_act").html(span);
						}		
					}else{  
						$(".act_s").show();
						if(cur_page<6){
							for (var i=1;i<6;i++) {
								if (i==cur_page) {
									span+="<span data-f='1'>"+i+"</span>";
								}else{
									span+="<span data-f='0'>"+i+"</span>";
								}
							}
							span+="<b class='span_a'>...</b>";
							span+="<span data-f='0'>"+pages+"</span>";
							$("#pages_act").html(span);
						}else{
							if(cur_page<pages){
								for (var i=cur_page-4;i<cur_page+1;i++) {
									if (i==cur_page) {
										span+="<span data-f='1'>"+i+"</span>";
									}else{
										span+="<span data-f='0'>"+i+"</span>";
									}
								}
							span+="<b class='span_a'>...</b>";
							span+="<span data-f='0'>"+pages+"</span>";
							$("#pages_act").html(span);	
							}
							if(cur_page==pages){
								span+="<span data-f='0'>"+1+"</span>";
								span+="<b class='span_a'>...</b>";
								for (var i=cur_page-4;i<cur_page+1;i++) {
									if (i==cur_page) {
										span+="<span data-f='1'>"+i+"</span>";
									}else{
										span+="<span data-f='0'>"+i+"</span>";
									}
								}
							}
							$("#pages_act").html(span);	
						}
					}
					}
					
				
						
				}
				else{

				}
			},
			error:function(data){
			}
		})	 
	 }
		
}	
//转化终端类型
function sw(termT){
	switch(termT){
		case "全部":
			termT='';
			break;
		case "网站":
			termT=1;
			break;
		case "手机":
			termT=2;
			break;
		case "PC客户端":
			termT=3;
			break;
	};
	return termT;
}
//载入的时候时间选项自动填充当天日期
var date=new Date();
var str=""+date.getFullYear()+"-";
str+=(date.getMonth()+1)+"-";
str+=date.getDate();
$("#timeLine1,#timeLine2,#timeLine3,#timeLine4").val(str);
/*判断时间先后*/
function ckdate(s,e){
	var start=new Date(s.replace("-","/").replace("-","/"));
	var end=new Date(e.replace("-","/").replace("-","/"));
	if(end<start){
		 alert('结束日期不能早于开始日期！');
		 return false;
	}
}

