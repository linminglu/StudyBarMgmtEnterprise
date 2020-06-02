$(function(){
	//获取消息列表
	var page=1;
	var per_page=10;
	getMesList(page,per_page);
	function getMesList(e,r){
		$.ajax({
			type:"Post",
			url:"/member/mymsg",
			dataType:"json",
			data:{
				per_page:r,
				page:e
			},
			success:function(json){
				console.log(json);
				console.log(r,e);
				var htm="";
				if(json.list!=null){
					$.each(json.list,function(k,v){
						if(v.push_date==""){
							var month="- -";
							var day="- -";
						}else{
							var datatime=new Date(v.push_date);
							var year=datatime.getFullYear();
							var month=((datatime.getMonth() + 1) > 10 ? (datatime.getMonth() + 1) : "0"+ (datatime.getMonth() + 1));
							var day=(datatime.getDate() < 10 ? "0" + datatime.getDate() : datatime.getDate());
						}
						if(!isNaN(year)){
							htm+='<li>'+year+'<span class="year_circle"></span></li>';
						}
						htm+='<li class="announce_list">'+v.title+'';
						htm+='<div class="time_circle"><span>'+month+'/'+day+'</span><span class="circle"></span></div>';
						htm+='<div class="announce_detail">';
						htm+='<div class="detail">';
						htm+='尊敬的用户:<br><br>';
						htm+='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
						htm+='您好！'+v.content+'！';
						if(v.detailurl!=""){
							htm+='<a href="'+v.detailurl+'" id="view_detail" target="_black">【查看详情】</a>';
						}
						htm+='<br><br>';
						htm+='</div>';
						htm+='<div class="by_order">';
						htm+='<p style="margin-right:40px;">牙医管家</p>';
						htm+='<p>'+v.push_date+'</p>';
						htm+='</div>';
						htm+='</div>';
						htm+='</li>';
					})
				}
				$("#mes_detail_view").html(htm);
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
			}
		})
	}

	//载入更多内容
	$(".more_con").click(function(){
		page++;
		console.log(page,per_page);
		getMesList(page,per_page);
	})
	//点击左边列表切换颜色和图标
	$(".announcement_left li").click(function(){
		var index=$(this).index();
		$(".main_right[data-con='1']").attr("data-con","0");
		if(index==0){
			$(this).children("img").attr("src","public/img/new_icon2.png");
			$(this).siblings("li").children("img").attr("src","public/img/act_icon1.png");
				
		}
		else if(index==1){
			$(this).children("img").attr("src","public/img/act_icon2.png");
			$(this).siblings("li").children("img").attr("src","public/img/new_icon1.png");
		}
		$(".main_right").eq(index).attr("data-con","1");	
		$("li[data-flag='1']").attr("data-flag","0");
		$(this).attr("data-flag","1");
	})
	
	$(".announce_detail a").click(function(){
		$(".main_right[data-con='1']").attr("data-con","0");
		$(".main_right").eq(2).attr("data-con","1");
	});
})
