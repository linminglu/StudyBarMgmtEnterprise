jQuery.createAniCss();
$(document).ready(function(){
    $("body input,textarea").attr("disabled",true).css("border","none");
    $("#TabLi li").on("click",function(){
       var index=$(this).index();
       $("#SelecOl ol").css("display","none")
       $("#SelecOl ol").eq(index).css("display","block");
       $("#TabLi li[data-flag='1']").attr("data-flag","0");
       $(this).attr("data-flag","1");
    })
})

var id=localStorage.getItem("id");
jQuery.loading('加载中',1);
$.post("/butlerp/message/"+id+"/viewdetail",{},function(result){
    jQuery.loading_close();
    console.log(result);
    if(result.code==1){
        if(result.info){
            var citys=result.list.info[0].c_cities;
            var provinces=result.list.info[0].c_provinces;
            var roles=result.list.info[0].c_roles;
            var content=result.list.info[0].content;
            var alink=result.list.info[0].detail_url;
            var title=result.list.info[0].title;
            var except_day=result.list.info[0].except_already_day;//排除选择天数
            var except_sent=result.list.info[0].except_already_sent;//排除选择
            var Stime=result.list.info[0].c_created_begin;//门诊创建开始时间
            var Etime=result.list.info[0].c_created_end;//结束时间
            var msg_type=parseInt(result.list.info[0].msg_type);//文字和图文
            var alink=result.list.info[0].detail_url;
            var msg_type=result.list.info[0].msg_type;
            var push_date=result.list.info[0].push_date;
            var merchant_name=result.list.info[0].merchant_name; //渠道商
            var s_time=result.list.channels[0]["datebegin"];
            var e_time=result.list.channels[0]["dateend"];
            
            if(msg_type=="1"){
            //    $("#MsgType img").eq(1).attr("src","/static/erp/img/sex_radios2.png");
                $("input[name='mstype']").eq(0).prop("checked",true)
             }else if(msg_type=="2"){
                $("input[name='mstype']").eq(1).prop("checked",true)
            }else if(msg_type=="3"){
                $("input[name='mstype']").eq(2).prop("checked",true)
            }
            $("#Dealers").val(merchant_name);
            $("#title").val(title);
            $("#description").val(content);
            $("#hiddenHref").val(alink);
            $("#file_a").attr("href",alink);
            //门诊筛选创建时间
            $("#Stime").val(Stime);
            $("#Etime").val(Etime);
             //发送时间
            $("#SendTime").val(push_date)
            //门诊角色
            roles=roles.substring(1,roles.length-1);
            roles=roles.split(",");
            for(var i=0;i<roles.length;i++){
                $("#role input[value="+roles[i]+"]").prop("checked",true).attr("disabled",true);
            }
            //排除选择
            $("#InfoStime").val(s_time);
            $("#InfoEtime").val(e_time);
            $("#ExceptS").val(except_day);
            $("#ExceptE").val(except_sent);
            //管家号
            if(result.list.dentals){
                $.each(result.list.dentals,function(k,v){
                    var li="";
                        li='<div class="area_item">'+v.dental_id+'&nbsp;&nbsp;（'+v.dental_name+'）</div>';
                    $("#DentalID").append(li);
                });
                $("#DentalNum").html(result.list.dentals.length);
            } else {
                $("#DentalNum").html("0");
            }
           
            //地区
            if(provinces&&citys){
                 provinces=eval("("+provinces+")");
                 citys=eval("("+citys+")");
                 console.log(provinces);
                 if(provinces.length!=0){
                    for(var i=0;i<provinces.length;i++){
                        var span="";
                            span+='<span class="area_item">'+provinces[i]+'&nbsp;'+citys[i]+'</span>';
                        $("#area_result").append(span);
                    }
                    $("#AreaNum").html(provinces.length);
                 }
            }
           
            //渠道
            if(result.list.channels){
                $.each(result.list.channels,function(k,v){
                    //console.log("v=",v);
                    var terType=null,secType=null,mainimg="";
                    // mainimg="http://115.28.139.39/image/WADO.php?action=LoadImage&FileName="+v.mainimage;
                    mainimg+=v.mainimage;
                    switch(v.channelid){
                        case "1":
                        terType=1;
                        secType=1;
                        break;
                        case "2":
                        terType=1;
                        secType=2;
                        break;
                        case "3":
                        terType=1;
                        secType=3;
                        break;
                        case "7":
                        terType=2;
                        secType=2;
                        break;
                        case "8":
                        terType=3;
                        secType=1;
                        break;
                        case "9":
                        terType=3;
                        secType=2;
                        break;
                        case "10":
                        terType=2;
                        secType=1;
                        break;
                        case "11":
                        terType=3;
                        secType=3;
                        break;
                        case "12":
                        terType=2;
                        secType=3;
                        break;
                        case "13":
                        terType=1;
                        secType=4;
                        break;
                        case "14":
                        terType=4;
                        secType=1;
                        break;
                        case "15":
                        terType=4;
                        secType=2;
                        break;
                    }
                    // console.log(v.channelid)
                    TabContent(msg_type,terType,mainimg,v.d_channel_name);
                })
            }
        }
    }
})


//
function TabContent(flag,terminal,mainimg,name){
   // console.log(flag,terminal,section,mainimg);
   var channel="";
    if(mainimg==""){
        mainimg="/static/erp/img/profile/add_pic.png";
    }
    if(flag==0){
        $("#TabContent .select_types").eq(0).attr("data-s","1");
            channel+='<li style="margin:20px 0 0 0"><b>发送渠道：</b><input type="text" name="Terminal" value="'+name+'" class="input_select" readonly="true" disabled="disabled" style="border: none;"></li>';
    }else{
            channel+='<li style="margin:20px 0 0 0"><b>发送渠道：</b><input type="text" name="Terminal" value="'+name+'" class="input_select" readonly="true" disabled="disabled" style="border: none;"></li>';
            channel+='<div class="select_types" style="min-width:600px;margin:40px 0px;border-bottom:1px solid #e0e0e0;">';
            channel+='<li><b>海报图：</b><img src="'+mainimg+'" alt="" class="show_img">'; 
            channel+='</li></div>';
    }
    $("#ViewChannels").append(channel);
}