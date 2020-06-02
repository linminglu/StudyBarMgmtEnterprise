var viewWidth=$(window).width();
$(".clinic_items").css("width",viewWidth+"px");
var tableMarLeft=(viewWidth-1000)/2;
var viewHeight=$(window).height();
var squarMarBot=(viewHeight-550)/4-16;

//个人信息下拉菜单
var userTags=0;
$(".r_index_user").click(function(e){
	if(userTags==0){
		$(".r_userInfo2").show();
		$(this).removeClass("r_index_userDown").addClass("r_index_userUp");
		userTags=1;
	}else{
		$(this).removeClass("r_index_userUp").addClass("r_index_userDown");
		$(".r_userInfo2").hide();
		userTags=0;
	}
	$(document).one("click",function(){
		$(".r_index_user").removeClass("r_index_userUp").addClass("r_index_userDown");
		$(".r_userInfo2").hide();
		userTags=0;
	});
	e.stopPropagation();
});
//消息提醒弹窗
$(".r_index_info").click(function(e){
	if($(".r_index_tips").hasClass("r_hide")){
		$(".r_index_tips").removeClass("r_hide").addClass("r_show");
	}else{
		$(".r_index_tips").removeClass("r_show").addClass("r_hide");
	}
	$(document).one("click",function(){
		$(".r_index_tips").removeClass("r_show").addClass("r_hide");
	});
	e.stopPropagation();
});
	
var str="";
var htm="";
var obj="";
var sta='<div class="no_mission"><img src="/static/public/img/homeImg/no_mission.png" /></div>';

//存储个人中心头像信息
localStorage.setItem("headInfo",$("#userface").attr("src"));

function addMission(e,k){
    if(e.list.rt_consult==0){  //电网权限
        $(".table_list").eq(k).find(".td2").find("a").attr("href","#");
        $(".table_list").eq(k).find(".td2").find(".tdimg").append(sta);
    }
    if(e.list.rt_market==0){   //市场权限
        $(".table_list").eq(k).find(".td3").find("a").attr("href","#");
        $(".table_list").eq(k).find(".td3").find(".tdimg").append(sta);
    }
    if(e.list.rt_report==0){    //运营权限
        $(".table_list").eq(k).find(".td4").find("a").attr("href","#");
        $(".table_list").eq(k).find(".td4").find(".tdimg").append(sta);
    }
    if(e.list.rt_finance==0){    //财务权限
        $(".table_list").eq(k).find(".td5").find("a").attr("href","#");
        $(".table_list").eq(k).find(".td5").find(".tdimg").append(sta);
    }
    if(e.list.rt_store==0){    //库房权限
        $(".table_list").eq(k).find(".td6").find("a").attr("href","#");
        $(".table_list").eq(k).find(".td6").find(".tdimg").append(sta);
    }
    if(e.list.rt_manage==0){   //系统权限
        $(".table_list").eq(k).find(".td7").find("a").attr("href","#");
        $(".table_list").eq(k).find(".td7").find(".tdimg").append(sta);
    }
}

function saveJurInfo(e){       //存储权限
    var JurisdictionArr=[];
    JurisdictionArr.push(e.list.rt_consult);
    JurisdictionArr.push(e.list.rt_finance);
    JurisdictionArr.push(e.list.rt_manage);
    JurisdictionArr.push(e.list.rt_market);
    JurisdictionArr.push(e.list.rt_report);
    JurisdictionArr.push(e.list.rt_store);
    //console.log(JurisdictionArr);
    var JurisdictionStr=JSON.stringify(JurisdictionArr);
    //console.log(JurisdictionStr);
    localStorage.setItem("asideJur",JurisdictionStr);
}

//电网,市场,运营,财务,库房,系统--顺序要对上
function saveJurInfo_f(e){
	var JurisdictionArr_f=[];
	JurisdictionArr_f.push(e.list.rt_consult);//电网
    JurisdictionArr_f.push(e.list.rt_market);//市场
    JurisdictionArr_f.push(e.list.rt_report);//运营
    JurisdictionArr_f.push(e.list.rt_finance);//财务
    JurisdictionArr_f.push(e.list.rt_store);//库房
    JurisdictionArr_f.push(e.list.rt_manage);//系统
    var JurisdictionStr_f=JSON.stringify(JurisdictionArr_f);
    localStorage.setItem("asideJur_f",JurisdictionStr_f);
}

//获取个人诊所信息
$.ajax({
	type:"POST",
	url:"/clinicmanage/entrance",
	dataType:"json",
	data:{},
	beforeSend: function(){},
	success: function(json){
//     	console.log(json);
        if(json.list.length==1){
            $(".enter_l").hide();
            $(".enter_r").hide();
            $("#page_sel_sp").hide();
        }
        $.each(json.list,function(k,v){
            str+='<ul>';
            if(v.logo==""||v.logo==undefined){
                str+='<img src="/static/public/img/default_clinic_pho.png" id="clinicLogo">';
            }else{
                str+='<img src="'+v.logo+'" id="clinicLogo">';
            }
            str+='<span id="clincname">'+v.chainname+'</span>';
            str+='</ul>';
            htm+='<span class="nor_sp"><label></label></span>';
            obj+='<div style="display:table; width:'+viewWidth+'px; height:100%;float:left;" class="table_list">';
            obj+='<div style="display:table-cell; vertical-align:middle">';
            obj+='<table border="0" width="1000" height="550" align="center"  valign="middle" id="maintable" style="margin-left:'+tableMarLeft+'px;padding-top:50px;">';
            obj+='<tbody>';
            obj+='<tr height="50%">';
            // obj+='<td class="td1"  id="download_click">';
            // obj+='<div class="tdimg"><div class="imgCell"><img src="/static/public/img/homeImg/Outpatient.png" /></div></div>';
            // obj+='<p>门诊业务</p>';
            // obj+='</td>';
            obj+='<td class="td2"><a href="/netconsult/todayconsulthtml">';
            obj+='<div class="tdimg"><div class="imgCell"><img src="/static/public/img/homeImg/powernet.png" /></div></div>';
            obj+='<p>电网中心</p>';
            obj+='</a></td>';
            obj+='<td class="td3"><a href="/market/index">';
            obj+='<div class="tdimg"><div class="imgCell"><img src="/static/public/img/homeImg/market.png" /></div></div>';
            obj+='<p>市场营销</p>';
            obj+='</a></td>';
            obj+='<td class="td4"><a href="/report/today">';
            obj+='<div class="tdimg"><div class="imgCell"><img src="/static/public/img/homeImg/Operation.png" /></div></div>';
            obj+='<p>运营中心</p>';
            obj+='</a></td>';
            obj+='</tr>';
            obj+='<tr  height="50%">';
            obj+='<td class="td5"><a href="/finance/index">';
            obj+='<div class="tdimg"><div class="imgCell"><img src="/static/public/img/homeImg/finance.png" /></div></div>';
            obj+='<p>财务管理</p>';
            obj+='</a></td>';
            obj+=' <td class="td6"><a href="/store">';
            obj+='<div class="tdimg"><div class="imgCell"><img src="/static/public/img/homeImg/store.png" /></div></div>';
            obj+='<p>库房管理</p>';
            obj+='</a></td>';
//          obj+='<td class="td7"><a href="/clinic/index" class="'+v.chainname+'">';
//          obj+='<div class="tdimg"><div class="imgCell"><img src="/static/public/img/homeImg/system.png" class="'+v.chainguid+'"/></div></div>';
//          obj+='<p class="'+v.datastatus+'">系统管理</p>';
//          obj+='</a></td>';
//          obj+='<td></td>';
            obj+='</tr>';
            obj+='</tbody>';
            obj+='</table>';
            obj+='</div>';
            obj+='</div>';
        })
        var thisClinicPosi=sessionStorage.getItem("clinicPosi");
        //console.log(thisClinicPosi);
        if(thisClinicPosi==null){
            thisClinicPosi=0;
        }
        $.ajax({       //存储数据给后台
            type:"POST",
            url:"/clinicmanage/savechainsess",
            dataType:"json",
            data:{
                mchainid:json.list[thisClinicPosi].chainguid,
                mchainame:json.list[thisClinicPosi].chainname,
                mtype:json.list[thisClinicPosi].datastatus==1?1:0
            },
            beforeSend: function(){},
            success: function(json){
                //console.log(json);
                saveJurInfo(json);
                saveJurInfo_f(json);
                localStorage.setItem("chainusername",json.list.chainusername); 
                addMission(json,0);
            },
            error: function(json){
               // console.log(json);
            },
            complete: function(json){
                //console.log(json);
            }
        })
        $("#clinic_info_head").html(str);
        $("#page_sel_sp").html(htm);
        $("#move_div").html(obj);

        $("#header .left ul").eq(thisClinicPosi).show().siblings("#header .left ul").hide();
        $("#header .left ul").eq(thisClinicPosi).find("#clincname").attr("class","enter_clinic_crename");
        $("#header .left ul").eq(thisClinicPosi).siblings("#header .left ul").find("#clincname").removeAttr("class");
        $("#header .left ul").eq(thisClinicPosi).find("#clinicLogo").attr("class","enter_clinic_photo");
        $("#header .left ul").eq(thisClinicPosi).siblings("#header .left ul").find("#clinicLogo").removeAttr("class");
        localStorage.setItem("clinicname",$(".enter_clinic_crename").text());
        localStorage.setItem("clinicphoto",$(".enter_clinic_photo").attr("src"));
        // getClinicName=localStorage.getItem("clinicname");
        // console.log(getClinicName);
        //获取选择部分总长度 定位
        var selSpWidth=($("#page_sel_sp").width()-4)/2;
        //console.log(selSpWidth);
        $("#page_sel_sp").css("margin-left",-selSpWidth+"px");
        $("#page_sel_sp").css("bottom",-squarMarBot+"px");
        $("#page_sel_sp span").eq(thisClinicPosi).addClass("sle_sp").removeClass("nor_sp");
        var defaultMove=-viewWidth*thisClinicPosi;
        $("#move_div").css("left",""+defaultMove+"px");
        
        var length=$("#move_div table").length;
        // console.log(length);
        var index=thisClinicPosi;

        /*点击颜色块切换*/
        $(document).on("click","#page_sel_sp .nor_sp",function(){
            var spNorIndex=$(this).index();   //点击未选中颜色位置
            var spSelIndex=$(this).siblings(".sle_sp").index();   //之前选中颜色的位置
             //console.log(spSelIndex);
            // console.log(spNorIndex);
            index=spNorIndex;    //idnex赋新值
            if(spNorIndex>spSelIndex){     //判断向左右移动  ->向右移动
                var differNum=spNorIndex-spSelIndex;
                var moveLength=viewWidth*differNum;
                // console.log(moveLength);
                $("#move_div").animate({left:"-="+moveLength+"px"});
            }else if(spSelIndex>spNorIndex){    //判断向左右移动   <- 向左移动
                var differNum=spSelIndex-spNorIndex;
                var moveLength=viewWidth*differNum;
                // console.log(moveLength);
                $("#move_div").animate({left:"+="+moveLength+"px"});
            }
            $.ajax({               //存储数据给后台
                type:"POST",
                url:"/clinicmanage/savechainsess",
                dataType:"json",
                data:{
                    mchainid:$("#move_div table").eq(index).find(".td7").find("img").attr("class"),
                    mchainame:$("#move_div table").eq(index).find(".td7").find("a").attr("class"),
                    mtype:$("#move_div table").eq(index).find(".td7").find("p").attr("class")==1?1:0
                },
                beforeSend: function(){},
                success: function(json){
                   // console.log(json);
                    localStorage.setItem("chainusername",json.list.chainusername);
                    addMission(json,index);
                    saveJurInfo(json);
                    saveJurInfo_f(json);
                },
                error: function(json){
                    //console.log(json);
                },
                complete: function(json){
                    //console.log(json);
                }
            })
            $(this).addClass("sle_sp").removeClass("nor_sp").siblings().removeClass("sle_sp").addClass("nor_sp");

            $("#header .left ul").eq(spNorIndex).show().siblings("#header .left ul").hide();
            $("#header .left ul").eq(spNorIndex).find("#clincname").attr("class","enter_clinic_crename");
            $("#header .left ul").eq(spNorIndex).siblings("#header .left ul").find("#clincname").removeAttr("class");
            $("#header .left ul").eq(spNorIndex).find("#clinicLogo").attr("class","enter_clinic_photo");
            $("#header .left ul").eq(spNorIndex).siblings("#header .left ul").find("#clinicLogo").removeAttr("class");
            localStorage.setItem("clinicname",$(".enter_clinic_crename").text());
            localStorage.setItem("clinicphoto",$(".enter_clinic_photo").attr("src"));
        })

        //向左移动
        $("#enter_left_btn").click(function(){
            if(index>0){
                index--;
                //console.log(index);
                $.ajax({       //存储数据给后台
                    type:"POST",
                    url:"/clinicmanage/savechainsess",
                    dataType:"json",
                    data:{
                        mchainid:$("#move_div table").eq(index).find(".td7").find("img").attr("class"),
                        mchainame:$("#move_div table").eq(index).find(".td7").find("a").attr("class"),
                        mtype:$("#move_div table").eq(index).find(".td7").find("p").attr("class")==1?1:0
                    },
                    beforeSend: function(){},
                    success: function(json){
                        //console.log(json);
                        localStorage.setItem("chainusername",json.list.chainusername);
                         addMission(json,index);
                         saveJurInfo(json);
                         saveJurInfo_f(json);
                    },
                    error: function(json){
                        //console.log(json);
                    },
                    complete: function(json){
                        //console.log(json);
                    }
                })
                $(".page_sel_sp span").eq(index).addClass("sle_sp").removeClass("nor_sp").siblings("span").removeClass("sle_sp").addClass("nor_sp");
                $("#header .left ul").eq(index).show().siblings("#header .left ul").hide();
                $("#header .left ul").eq(index).find("#clincname").attr("class","enter_clinic_crename");
                $("#header .left ul").eq(index).siblings("#header .left ul").find("#clincname").removeAttr("class");
                $("#header .left ul").eq(index).find("#clinicLogo").attr("class","enter_clinic_photo");
                $("#header .left ul").eq(index).siblings("#header .left ul").find("#clinicLogo").removeAttr("class");
                localStorage.setItem("clinicname",$(".enter_clinic_crename").text());
                localStorage.setItem("clinicphoto",$(".enter_clinic_photo").attr("src"));
                // getClinicName=localStorage.getItem("clinicname");
                // console.log(getClinicName);
                $("#move_div").animate({left:"+="+viewWidth+"px"});
            }
        })

        //向右移动
        $("#enter_right_btn").click(function(){
            //console.log(index);
            if(index<length-1){
                index++;
                // console.log(index);
                $.ajax({               //存储数据给后台
                    type:"POST",
                    url:"/clinicmanage/savechainsess",
                    dataType:"json",
                    data:{
                        mchainid:$("#move_div table").eq(index).find(".td7").find("img").attr("class"),
                        mchainame:$("#move_div table").eq(index).find(".td7").find("a").attr("class"),
                        mtype:$("#move_div table").eq(index).find(".td7").find("p").attr("class")==1?1:0
                    },
                    beforeSend: function(){},
                    success: function(json){
                        //console.log(json);
                        localStorage.setItem("chainusername",json.list.chainusername);
                        addMission(json,index);
                        saveJurInfo(json);
                        saveJurInfo_f(json);
                    },
                    error: function(json){
                        //console.log(json);
                    },
                    complete: function(json){
                        //console.log(json);
                    }
                })
                $(".page_sel_sp span").eq(index).addClass("sle_sp").removeClass("nor_sp").siblings("span").removeClass("sle_sp").addClass("nor_sp");
                $("#header .left ul").eq(index).show().siblings("#header .left ul").hide();
                $("#header .left ul").eq(index).find("#clincname").attr("class","enter_clinic_crename");
                $("#header .left ul").eq(index).siblings("#header .left ul").find("#clincname").removeAttr("class");
                $("#header .left ul").eq(index).find("#clinicLogo").attr("class","enter_clinic_photo");
                $("#header .left ul").eq(index).siblings("#header .left ul").find("#clinicLogo").removeAttr("class");
                localStorage.setItem("clinicname",$(".enter_clinic_crename").text());
                localStorage.setItem("clinicphoto",$(".enter_clinic_photo").attr("src"));
                // getClinicName=localStorage.getItem("clinicname");
                // console.log(getClinicName);
                $("#move_div").animate({left:"-="+viewWidth+"px"});
            }
        })

        //进入内页，获取当前诊所位置
        $(document).on("click","table a",function(){
            //console.log(1);
            sessionStorage.setItem("clinicPosi",index);
        })
    },
	error: function(json){
       // console.log(json);
    },
	complete: function(json){
        //console.log(json);
    }
});

$(".enter_l").mouseover(function(){
    $(this).find("img").attr("src","/static/account/img/enter_l_s.png");
}).mouseout(function(){
    $(this).find("img").attr("src","/static/account/img/enter_l.png");
})

$(".enter_r").mouseover(function(){
    $(this).find("img").attr("src","/static/account/img/enter_r_s.png");
}).mouseout(function(){
    $(this).find("img").attr("src","/static/account/img/enter_r.png");
})


$(document).on("click","#download_click",function(){
    $(".mask").show();
    $(".clinic_download").show();
})

$(".download_tit img").click(function(){
    $(".mask").hide();
    $(".clinic_download").hide();
})

$("#download_btn").click(function(){
    $(".mask").hide();
    $(".clinic_download").hide();
})