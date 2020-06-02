var url=document.location.href;
url=url.split("/");

if(url[url.length-1]=="edition"){
    var id=url[url.length-2];
    editionfuc(id);
}


//编辑消息获取数据
function editionfuc(id){
     console.log(2222);
    document.title="编辑消息";
    $("#editA").html("编辑消息");
    $.post("/butlerp/message/"+id+"/viewdetail",{},function(result){
        jQuery.loading_close();
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
                var alink=result.list.info[0].detail_url;//链接
                var msg_type=result.list.info[0].msg_type;//消息类型
                var push_date=result.list.info[0].push_date;//发送时间
                var push_dateArr=new Array();
                var merchant_name=result.list.info[0].merchant_name; //渠道商
                var yxdateBegin=result.list.channels[0]["datebegin"];
                var yxdateEnd=result.list.channels[0]["dateend"];
                console.log("yxdateBegin=",yxdateBegin);
                $("#MsgType img").attr("src","/static/erp/img/sex_radios.png");
                flag=msg_type
                TabContent();
                if(msg_type){
                //     $("#MsgType img").eq(1).attr("src","/static/erp/img/sex_radios2.png");
                // }else{
                    $("#MsgType img").eq(0).attr("src","/static/erp/img/sex_radios2.png");
                }
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
                if(Stime){
                    $("#Stime").val(Stime);
                }
                if(Etime){
                    $("#Etime").val(Etime);
                }
                //发送时间
                if(push_date){
                    push_dateArr=push_date.split(" ");
                    $("#SendTime").val(push_dateArr[0]);
                    push_dateArr=push_dateArr[1].split(":");
                    $("#Hours").val(push_dateArr[0]);
                    $("#Minutes").val(push_dateArr[2]);
                }
                //门诊角色
                roles=roles.substring(1,roles.length-1);
                roles=roles.split(",");
                for(var i=0;i<roles.length;i++){
                    $("#role input[value="+roles[i]+"]").prop("checked",true);
                }
                //排除选择
                $("#InfoStime").val(yxdateBegin);
                $("#InfoEtime").val(yxdateEnd);
                $("#ExceptS").val(except_day);
                $("#ExceptE").val(except_sent);
                //管家号
                if(result.list.dentals){
                    $.each(result.list.dentals,function(k,v){
                        var li="";
                            li='<div class="area_item">'+v.dental_id+'&nbsp;&nbsp;（'+v.dental_name+'）<i onclick="delete_dental(this)" data-id='+v.dental_id+'></i></div>';
                        $("#DentalID").append(li);
                        Dentals.push(parseInt(v.dental_id));
                    });

                    $("#DentalNum").html(result.list.dentals.length);
                } else {
                    $("#DentalNum").html(0);
                }
                //地区
                if(provinces&&citys){
                    provinces=eval("("+provinces+")");
                    citys=eval("("+citys+")");
                  //  console.log(provinces);
                    if(provinces.length!=0){
                        for(var i=0;i<provinces.length;i++){
                            var span="";
                                span+='<span class="area_item">'+provinces[i]+'&nbsp;'+citys[i]+'<i onclick="delet_area(this)"></i></span>';
                            $("#area_result").append(span);
                            pList.push(provinces[i]);
                            cList.push(citys[i]);
                        }
                        $("#AreaNum").html(provinces.length);
                    }
                }
                //渠道
                if(result.list.channels){
                    $.each(result.list.channels,function(k,v){
                        var li='';
                        li+='<li><p>'+v.d_channel_name+'<input type="button" style="display:none;color:#00c5b5;" value="保存" onClick="addchannel(this)"/><input type="button" value="删除" class="f86d" onclick="delet_channel(this)">';
                        li+='<input type="button" value="修改" onclick="editinfo(this)" class="btn_modify">';
                        li+='<input type="hidden" value='+v.channelid+'></p></li>';
                        $("#ChannelList").append(li);
                        Channels[v.channelid]={
                            MainImage:v.nameimage,ExtraText:"",DateBegin:"",DateEnd:"",url:v.mainimage
                        }
                    });
                    $("#ChannelList li").eq(0).find("input[value='修改']").click();
                    console.log(Channels);
                }
                if(result.list.info[0].recieveuser == '1'){
                    $("#sendobj1").removeAttr('checked');
                    $("#sendobj2").attr('checked','checked');
                    $("#SelecOl").hide();
                    changeObj();
                }else{
                    $("#sendobj2").removeAttr('checked');
                    $("#sendobj1").attr('checked','checked');
                    $("#SelecOl").show();
                    changeObj();
                }
            }
        }else{
            jQuery.showError(json.info,'信息反馈');
        }
    })
}

//最终的保存
function sendform(p_url){
    var title=$("#title").val();
    var content=$("#description").val();
    var alink=$("#hiddenHref").val();
    var pustType=$("#Sendselec input[name='time']:checked").val();
    var pustTime=null;
    if(pustType==1){
        pustTime=$("#SendTime").val()+' '+$("#Hours").val()+':'+$("#Minutes").val()+':00';
    }else{
        pustType="";
    }
    var PCVersion=$("#PcVersion,#PVersion").find("input[name='version']:checked").val();
    if(PCVersion==undefined||PCVersion==""||PCVersion==null){
        PCVersion=0;
    }
    var PCMerchantID=$("#Dealers").attr("data-val");
    // var Stime=$("#Stime").val()+' 00:00:00';
    // var Etime=$("#Etime").val()+' 00:00:00';
    var Stime="";
    var Etime="";
    var roles=[];
    $("#role").find("input[type='checkbox']").each(function(index,ele){
            if($(this).prop("checked")==true){
                roles.push($(this).val());
            }
    });
    var InfoEtime=$("#InfoEtime").val();
    var InfoStime=$("#InfoStime").val();//最终的排除时间
    var ExceptS=$("#ExceptS").attr("data-val");
    var ExceptE=$("#ExceptE").attr("data-val");
     //console.log(roles,pList,cList)
     if(title==""){
         $("#title").focus();
         return;
     }
     else if(content==""){
         $("#description").focus();
         return;
     }
     else if(flag==1&&alink==""){
         $("#hiddenHref").focus();
         return;
     }
     $.each(Channels,function(k,v){
         v.DateBegin=InfoStime;
         v.DateEnd=InfoEtime;
         delete v.url;
     });//现在的渠道时间是统一的，以后可能会更改的。
     var ChannelsStr=JSON.stringify(Channels)
     if(ChannelsStr=="{}"){
         jQuery.postFail("fadeInUp","未选择发送渠道！");
         return;
     }
    console.log(ChannelsStr);
    var mstype = $("input[name='mstype']:checked").val();
    // 发送对象类型
    var objtype = $('input[name="sendobj"]:checked').val();
    var parmas={};
        parmas={
            Title:title,
            Content:content,
            DetailUrl:alink,
            PushType:pustType,
            PushTiming:pustTime,
            PCMerchantID:"",
            MsgType:mstype,
            PCVersion:PCVersion,
            PCCreatedDateBegin:Stime,
            PCCreatedDateEnd:Etime,
            PCProvinces:JSON.stringify(pList),
            PCCities:JSON.stringify(cList),
            PCRoles:JSON.stringify(roles),
            ExceptAlreadyDay:0,
            ExceptAlreadySent:0,
            Dentals:JSON.stringify(Dentals),
            Channels:ChannelsStr,      
        };
    if(objtype=="sendobj1"){
            parmas.PCRoles = '[]';
            parmas.Dentals = '[]';
            parmas.RecieveUser= '2';
    }else{
        parmas.RecieveUser= '1';
    }
    $.ajax({
        type:"POST",
        url:p_url,
        dataType:"json",
        data:parmas,
        beforeSend:function(){
            jQuery.loading();
        },
        complete:function(){ 
            jQuery.loading_close();
        },
        success:function(json){
            //console.log(json);
            if(json.code==1){
                document.location="/butlerp/message";//跳转到消息列表页面
            }else{
                jQuery.showError(json.info,'信息反馈');
            }
        },
        error:function(){

        },
    })
}

//获取url中的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}
