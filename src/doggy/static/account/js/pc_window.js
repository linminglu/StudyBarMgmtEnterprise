function get_data_list(){
    $.ajax({
        type:"GET",
        url:"index.php?m=PcWindow&a=clinic_ajax",
        dataType:"json",       
        beforeSend: function(json){},
        error: function(json){
            console.log(1);
        },
        success: function(json){
            console.log(json);
            $("#pc_doc_name").text(json[0].info.clinicMessage.doctor_name);
            var user_picture=json[0].info.clinicMessage.user_picture;
            var sex=json[0].info.clinicMessage.sex;
            if(user_picture==""){
                if(sex=="女"){
                    $(".img img").attr("src","/Account/public/img/pc_woman.png");
                }else if(sex=="男"){
                    $(".img img").attr("src","/Account/public/img/pc_man.png");
                }
            }else{
                $(".img img").attr("src",user_picture);
            }
            $("#medal_picture img").attr("src",json[0].info.clinicMessage.medal_picture);
            $("#reserve_medal").text(json[0].info.clinicMessage.reserve_medal);
            $("#next_medal").text(json[0].info.clinicMessage.next_medal);
            $("#left_mission").text(json[0].info.clinicMessage.left_mission);
            $("#total_mission").text(json[0].info.clinicMessage.total_mission);
            $("#left_day").text(json[0].info.clinicMessage.left_day);
            $(".chance").text(json[0].info.clinicMessage.chance);

            /*升级进度条*/
            var totalWidth=$(".bas_r .p2").width();
            var total_mission_num=$(".total_misson").text();
            var left_mission_num=$(".left_misson").text();
            var proportion=(total_mission_num-left_mission_num)/total_mission_num;
            var finishWidth=totalWidth*proportion;
            $(".bas_r .p2 span").css("width",finishWidth+"px");

            // var str=[];
            // $.each(json[0].info.missionData,function(k,v){
            // })
            var missionData=json[0].info.missionData;
            console.log(missionData.length);
            var lotterRecord=json[0].info.lotterRecord;
            console.log(lotterRecord.length);
            for(var i=0;i<missionData.length;i++){
                var MissionPicture=missionData[i].MissionPicture;
                var finish_state=missionData[i].finish;
                var currentvalue1=missionData[i].currentvalue1;
                var expectvalue1=missionData[i].expectvalue1;
                var MissionName=missionData[i].MissionName;
                if(MissionName=="App人均在线时长"){
                    currentvalue1=(currentvalue1/3600).toFixed(2);
                    console.log(currentvalue1);
                    expectvalue1=(expectvalue1/3600).toFixed(2);
                    console.log(expectvalue1);
                }
                if(finish_state==1){
                    var finish_img="/Account/public/img/finished.png";
                    var finish_text="已完成";
                }else{
                    var finish_img="/Account/public/img/no_finish.png";
                    var finish_text="待完成";
                }
                var str='<li class="miss_rel_li">'+
                    '<div class="miss_desc">'+
                        '<img src="/Account/public/img/tips_angle.png">'+
                        '<p><span>任务描述:&nbsp;</span>'+missionData[i].MissionDescribe+'</p>'+
                    '</div>'+
                    '<ul class="flo_ul">'+
                        '<li class="li_first">'+
                            '<img src='+MissionPicture+' class="item_icon">'+
                            '<span>'+missionData[i].MissionName+'</span>'+
                        '</li>'+
                        '<li class="li_second">'+
                            '<span class="color_span">'+currentvalue1+'</span>'
                            +"/"+expectvalue1+
                        '</li>'+
                        '<li>每月任务</li>'+
                        '<li>'+
                            '<img src='+finish_img+' class="finish_state">'+
                            '<span>'+finish_text+'</span>'+
                        '</li>'+
                    '</ul>'+
                '</li>';
                $("#task_ul").append(str);
            };
            if(lotterRecord.length==0){
                var html='<li>无</li>';
                $("#lotterRecord").append(html);
            }else{
                for(var j=0;j<lotterRecord.length;j++){
                    var html='<li>'+
                                '<span>'+lotterRecord[j].Name+'</span>'+
                                '<span>'+lotterRecord[j].clinicname+'</span>'+
                                '<span>'+lotterRecord[j].Mobile+'</span>'+
                            '</li>';
                    $("#lotterRecord").append(html);
                }
            }
        },
        complete: function(json){}
    });

    if($(".chance").text()==0){
        $(".word_dec").css("backgroundColor","#ffeee9");
        $(".word_dec").removeAttr("id");
        $(".draw_chance").css("color","#696969");
        $(".draw_dec .p_num span").css("color","#ff6a3c");
        $(".word_dec .draw_chance span").css("color","#ff6a3c");
        $(".word_dec .draw_now").css("color","#ff6a3c");
    }

}

//抽奖操作
function lotter_operat(){
    var index=1,           //当前亮区位置
    prevIndex=10,          //前一位置
    Speed=300,           //初始速度
    Time,            //定义对象
    arr_length = 10; //GetSide(5,5),         //初始化数组
    EndIndex=1,           //决定在哪一格变慢
    cycle=0,           //转动圈数   
    EndCycle=3,           //计算圈数
    flag=false,           //结束转动标志
    random_num=1,      //中奖数
    quick=0;           //加速
    $("#draw_now").click(function(){
        $.ajax({
            type:"GET",
            url:"index.php?m=PcWindow&a=lottery_ajax",
            dataType:"json",     
            beforeSend: function(json){
                $(".word_dec").removeAttr("id");
            },
            error: function(json){
                /*console.log(1);*/
            },
            success: function(json){
                /*console.log(json);*/
                $(".word_dec").removeAttr("id");
                
                $(".draw_middle ul li").removeClass("random_current"); //取消选中
               //random_num = parseInt($("#txtnum").val());//
                var randon_item=[1,6];           
                var random_value = randon_item[Math.round(Math.random()*(randon_item.length-1))]; 
                //随机抽取一个值
                /*console.log(json[0].code);*/
                if(json[0].code==1){
                    var red_bag_mon=json[0].lottery_money;
                    var red_bag_mon_yuan=red_bag_mon/100;
                   /* console.log(red_bag_mon_yuan);*/
                    $(".money_num span").text(red_bag_mon_yuan);
                    var wx_code=json[0].data.records[0].url;
                    /*console.log(wx_code);*/
                    $(".total_b img").attr("src",wx_code);
                    random_num = random_value; //中奖红包位置
                }else if(json[0].code==2){
                    random_num=10;      //谢谢参与位置
                }
               index=1; //再来一次,从1开始
               cycle=0;
               flag=false;
               //EndIndex=Math.floor(Math.random()*12);
               if(random_num>5) {
              EndIndex = random_num - 5; //前5格开始变慢
               } else {
              EndIndex = random_num + 10 - 5; //前5格开始变慢
               }
               //EndCycle=Math.floor(Math.random()*3);
               Time = setInterval(Star,Speed);
                function Star(num){
                    //跑马灯变速
                    if(flag==false){
                      //走五格开始加速
                      if(quick==5){
                         clearInterval(Time);
                         Speed=50;
                         Time=setInterval(Star,Speed);
                      }
                      //跑N圈减速
                      if(cycle==EndCycle+1 && index-1==EndIndex){
                      clearInterval(Time);
                         Speed=300;
                         flag=true;         //触发结束
                         Time=setInterval(Star,Speed);
                      }
                    }
                   
                    if(index>arr_length){
                        index=1;
                        cycle++;
                    }
                   
                   //结束转动并选中号码
                   if(flag==true && index==parseInt(random_num)){ 
                      quick=0;
                      clearInterval(Time);
                      $(".word_dec").attr("id","draw_now");
                      $(".p_num span").text(json[0].chance);
                      $("#chance_num").text(json[0].chance);
                    /*console.log(json[0].chance);
                      console.log(random_num);*/
                      if(random_num==1||random_num==6){
                        $(".reb_bag_win").show();
                        $(".pc_clsoe").click(function(){
                            $(".reb_bag_win").hide();
                        })
                      };
                   }
                   $("#random_"+index).addClass('random_current'); //设置当前选中样式
                   if(index>1)
                       prevIndex=index-1;
                   else{
                       prevIndex=arr_length;
                   }
                   $("#random_"+prevIndex).removeClass('random_current'); //取消上次选择样式 
                   index++;
                   quick++;
                }
            },
            complete: function(json){}
        });
    }); 
}


  
//事件绑定
function event_bind(){

	/*社区跳转*/
	$("#my_communit").click(function(){
		window.open("index.php?m=MyCommunity","_blank");
	})

	/*首页商城切换*/
	$(".right_con").eq(0).show();
	$(".r_nav ul li").click(function(){
		$(".r_nav ul li[data-select='1']").attr("data-select","0");
		$(this).attr("data-select","1");
		var index=$(this).index();
		$(".right_con").eq(index).show().siblings(".right_con").hide();
		if(index==0){
			$(this).children(".word_img").attr("src","public/img/index1.png");
			$(this).siblings("li").children(".word_img").attr("src","public/img/shop_car2.png");
		}else{
			$(this).children(".word_img").attr("src","public/img/shop_car1.png");
			$(this).siblings("li").children(".word_img").attr("src","public/img/index2.png");
		}
	})

	/*门诊任务和我的任务切换*/
	$(".task_con").eq(0).show();
	$(".li_click").click(function(){
		var index=$(this).index();
		$(".li_click[data-type='1']").attr("data-type","0");
		$(this).attr("data-type","1");
		$(".task_con").eq(index).show().siblings(".task_con").hide();
	})

	/*升级提示*/
	$(".grow").mouseover(function(){
		$(".up_grade").show();
	}).mouseout(function(){
		$(".up_grade").hide();
	})

	/*抽奖弹窗*/
	$("#luck_draw").click(function(){
		$("#luck_draw_window").show().siblings(".luck_draw_window").hide();
	})
	$(".draw_close").click(function(){
		$("#luck_draw_window").hide();
		/*$(".luck_draw_window").hide(function(){
			(".draw_white").animate ({"right" : "0px"}, "slow")
		})*/
	})
/*	$("#butler").click(function(){
		$("#butler_r").show().siblings(".luck_draw_window").hide();
	})
	$("#close_butler").click(function(){
		$("#butler_r").hide();
	})
	$("#medals").click(function(){
		$("#medals_r").show().siblings(".luck_draw_window").hide();
	})
	$("#close_medals").click(function(){
		$("#medals_r").hide();
	})
	$("#money").click(function(){
		$("#money_r").show().siblings(".luck_draw_window").hide();
	})
	$("#close_money").click(function(){
		$("#money_r").hide();
	})
	$("#lv").click(function(){
		$("#lv_r").show().siblings(".luck_draw_window").hide();
	})
	$("#close_lv").click(function(){
		$("#lv_r").hide();
	})*/

	// 管家币收支查询
	/* $("#dateStart").calendar({
        callback:function(){
            $(this).removeClass("active");
        }
    })
    $("#dateEnd").calendar({
        callback:function(){
            $(this).removeClass("active");
        }
    })*/

}
// function close_box(){
//     	$(this).parents(".slider_box").hide();
//   }
