/*=========================================
2012-12-26罗杨
鉴于渠道以后会增加，而上传图片插件没有改变限制图片尺寸的功能，所以只能做成一个个
的单独控件，对于对应的渠道去对应的值。
==========================================*/ 
jQuery.createAniCss();
//消息推送
var flag=0,//切换文字和图文 0是文字，1是图文
cropApi1=null,	//图片上传
cropApi2=null,
listApi=null,
listApi2=null,
listApi3=null,
listApi4=null,
listApi5=null,
listApi6=null,
time_hour=[],//小时
time_min=[],//分钟
x_num=[],//序列号
Tabcontent=0,//发送渠道内容切换
terminal=1,//渠道终端
section=1,//渠道版块
Dentals=new Array(),//诊所管家号
DentalsObj={},
area_num=0,
pList=[],//省份
cList=[],//城市
areaObj={},
ret=[],
Channels={},//渠道的json
qudao = [{key:'APP',val:'2'}]
seriesid=null,
mstype=null;
for(var i=0;i<60;i++){
	var t=i<10?'0'+i:i;
	time_min.push({'key':t,'val':t})
}
for(var i=0;i<24;i++){
	var t=i<10?'0'+i:i;
	time_hour.push({'key':t,'val':t})
}
for(var i=1;i<21;i++){
	var t=i<10?'0'+i:i;
	x_num.push({'key':t,'val':t})
}
var url=document.location.href;
url=url.split("/");

$("input[name='mstype']").on("click",function(){
    var radio = document.getElementsByName("mstype")
    for (i=0;i <radio.length;i++){
        if(radio[i].checked){
            mstype=radio[i].value;
            console.log(mstype)
            if (mstype=="1"){
                $("#xlserver").hide()
                $("#dserver").hide()
            }else if (mstype=="2"){
                $("#xlserver").show()
                $("#dserver").hide()
            }else if (mstype=="3"){
                $("#xlserver").hide()
                $("#dserver").show()
            }
        }
    }
})
$(document).ready(function(){

    TabContent();
    //日历控件
     $("input[name='calendar']").each(function(index,ele){
         var date=new Date();
         var year=date.getFullYear();
         var month=date.getMonth()+1;
         var days=date.getDate();
         var hours=date.getHours();
         var minutes=date.getMinutes();
         if(index=='1'){
             days+=1;
         }
         $(this).val(year+"-"+month+"-"+days+" "+hours+":"+minutes);
         $(this).yayigj_datetime({varType:'val'});
     })
     //确定并发送
     $("#Save").on("click",function(){
       
         var n_url="/butlerp/message/doadd";//新建保存的路径
         if(url[url.length-1]=="edition"){
             n_url="/butlerp/message/"+id+"/doedit";//编辑更新消息的路径
         }
         sendform(n_url);
     })
     TabContent();
     //点击切换文字和图文
    // $("#MsgType .mstype").on("click",function(){
    //    // poptab();
    //     //  if(flag==0){
    //     //     flag=1;
    //     //         $("#Alink").html("链接：");
    //     //  }else{
    //     //     flag=0;
    //     //     $("#Alink").html("*链接：");
    //     //  }
         flag=1;
    //      $("#Alink").html("*链接：");
    //      $(this).find("img").attr("src","/static/erp/img/sex_radios2.png");
    //      $(this).siblings(".mstype").find("img").attr("src","/static/erp/img/sex_radios.png");
    // })
   
    $("#TabLi li").on("click",function(){
       var index=$(this).index();
       $("#SelecOl ol").css("display","none")
       $("#SelecOl ol").eq(index).css("display","block");
       $("#TabLi li[data-flag='1']").attr("data-flag","0");
       $(this).attr("data-flag","1");
    })
    // 消息剩余文字提示
    $("#title").on("input",function(){
        var that=$(this);
        tips(that,20);
    });
    $("#description").on("input",function(){
        var that=$(this);
        tips(that,50);
    });
    $("#IntroAct").on("input",function(){
        var that=$(this);
        tips(that,200);
    });
    //文件上传路径
    $("#hiddenHref").on("input",function(){
        var filePath=$(this).val();
        $("#file_a").attr("href",filePath);
    })
    //渠道选择 终端
    $("#Terminal").yayigj_downlist({
        _callBack:getDataList,
        _data:qudao,
        },function(api){
            listApi=api;
    });
    //渠道选择 版块
     $("#Section").yayigj_downlist({
            _callBack:getDataList2,
            _data:[{key:"登陆广告",val:"1"},{key:"消息中心",val:"2"},{key:"首页广告",val:"3"}],
            },function(api){
                listApi2=api;
                // {key:"消息中心","val":"2"},{"key":"弹窗提醒","val":"3"},
    });
    //确认添加渠道
    $("#AddChannel").on("click",function(){
        addchannel(this);
    });
    //门诊筛选--确认添加地区
    $("#Addarea").on("click",function(){
        area_select();
    });
   	//确认添加管家号
    $("#Addnum").on("click",function(){
        var id=$("#ButlerNo").val();
        if(id!=""){
            dentalid(id);
        }
        
    });
    //excel导入管家号
    $("#ExcelFile2").on("change",function(){
        //   $("#Addnum").click();
        excelp();
    });
    
    //时和分
    $("#Hours").yayigj_downlist({
            _data:time_hour,
            },function(api){
                listApi3=api;
    });
    $("#Minutes").yayigj_downlist({
            _data:time_min,
            },function(api){
                listApi4=api;
    });
    //排除选择
    $("#ExceptS").yayigj_downlist({
            _data:[{'key':"1",'val':"1"},
                    {'key':"2",'val':"2"},
                    {'key':"3",'val':"3"},
            ],
            },function(api){
                listApi5=api;
    });
    $("#ExceptE").yayigj_downlist({
            _data:[{'key':"1",'val':"1"},
                    {'key':"2",'val':"2"},
                    {'key':"3",'val':"3"},
            ],
            },function(api){
                listApi6=api;
    });
     //上传图片pc11--登陆页
    //  $("#up_load11").localUpfileNoGzip({
    //     imgPathID:'#TeacherPicture11',  //上传成功后返回路径放到哪个控件
    //     imgPathPIC:'#banner11',				//上传成功后预览图片控件
    //     pic_ext:'#pic_ext1',						
    //     uploadPath:'',
    //     isCrop:false,  //是否支持裁剪，
    //     // maxWidth:560,
    //     // maxHeight:445
    // },function(){
    //     cropApi1=this;
    // });
    $("#up_load11").localUpfileNoGzip({
        uploadCallBack:function(data){
           // console.log('data=',data);	
           uploadBackFuc(data);
        }
        },function(api){
            console.log(api);
        });
    //上传图片pc12--服务器弹窗
    // $("#up_load14").localUpfileNoGzip({
    //     imgPathID:'#TeacherPicture14',  //上传成功后返回路径放到哪个控件
    //     imgPathPIC:'#banner14',				//上传成功后预览图片控件
    //     pic_ext:'#pic_ext1',						
    //     uploadPath:'',
    //     isCrop:false,  //是否支持裁剪，
    //     maxWidth:260,
    //     maxHeight:240
    // },function(){
    //     cropApi2=this;
    // });
    $("#up_load14").localUpfileNoGzip({
        uploadCallBack:function(data){
           // console.log('data=',data);	
           uploadBackFuc(data);
        }
        },function(api){
            console.log(api);
        });
     //上传图片APP21--登陆广告
    // $("#up_load21").localUpfileNoGzip({
    //     imgPathID:'#TeacherPicture21',  //上传成功后返回路径放到哪个控件
    //     imgPathPIC:'#banner21',				//上传成功后预览图片控件
    //     pic_ext:'#pic_ext1',						
    //     uploadPath:'',
    //     isCrop:false,  //是否支持裁剪，
    //     maxWidth:640,
    //     maxHeight:916
    // },function(){
    //     cropApi3=this;
    // });
    $("#up_load21").localUpfileNoGzip({
        uploadCallBack:function(data){
           // console.log('data=',data);	
           uploadBackFuc(data);
        }
        },function(api){
            console.log(api);
        });
     //上传图片APP22--消息中心
    // $("#up_load22").localUpfileNoGzip({
    //     imgPathID:'#TeacherPicture22',  //上传成功后返回路径放到哪个控件
    //     imgPathPIC:'#banner22',				//上传成功后预览图片控件
    //     pic_ext:'#pic_ext1',						
    //     uploadPath:'',
    //     isCrop:false,  //是否支持裁剪，
    //     maxWidth:600,
    //     maxHeight:240
    // },function(){
    //     cropApi3=this;
    // });
    $("#up_load22").localUpfileNoGzip({
        uploadCallBack:function(data){
           // console.log('data=',data);	
           uploadBackFuc(data);
        }
        },function(api){
            console.log(api);
        });
     //上传图片APP23--首页广告
    // $("#up_load23").localUpfileNoGzip({
    //     imgPathID:'#TeacherPicture23',  //上传成功后返回路径放到哪个控件
    //     imgPathPIC:'#banner23',				//上传成功后预览图片控件
    //     pic_ext:'#pic_ext1',						
    //     uploadPath:'',
    //     isCrop:false,  //是否支持裁剪，
    //     maxWidth:640,
    //     maxHeight:90
    // },function(){
    //     cropApi4=this;
    // });
    $("#up_load23").localUpfileNoGzip({
        uploadCallBack:function(data){
           // console.log('data=',data);	
           uploadBackFuc(data);
        }
        },function(api){
            console.log(api);
        });
    $(".mstype").trigger("click");
    //获取经销商
   // merchant();
    // //修改后保存渠道
    // $("#SaveChannels").on("click")
})
/*=====================================================================
    函数
======================================================================*/
//课程选择 
function addseries(ttemp){
    var titlname
    if (ttemp=="1"){
        titlname="系列课程选择"
    }else if(ttemp == "2"){
        titlname="单课程选择"
    }
 
    popApi_course=jQuery.yayigjcourse_open({UrlParam:'type='+ttemp,title:titlname,callbackfunc:function(params){
           if(params.code==1){
               console.log(params.info)
               seriesid=params.info;
               $("#hiddenHref").val(seriesid)
           }
    }});
}

//切换消息类型提示
function poptab(){
    $("#Tabpop,.pop_bg").show();
}
function closepop(){
    $("#Tabpop,.pop_bg").hide();
}
//渠道选择 终端
function getDataList(id){
    id=parseInt(id);
    //  console.log(typeof(id));
    // {'key':"PC端",'val':"1"}, 
    // {'key':"APP端",'val':"2"}
    // {'key':"Web端",'val':"3"},
    // {'key':"官网",'val':"4"}
        switch (id){
            case 1:
                option=[{"key":"登陆页海报","val":"1"},{"key":"服务器弹窗提醒","val":"4"}];
                break;
                // ,{key:"消息中心","val":"2"},{"key":"弹窗提醒","val":"3"}
            case 2:
                option=[{key:"登陆广告",val:"1"},{key:"消息中心",val:"2"},{key:"首页广告",val:"3"}];
            break;
            case 3:
                option=[{key:"系统消息",val:"1"},{key:"消息中心",val:"2"},{key:"活动中心",val:"3"}];
            break;
            case 4:
                option=[{key:"首页海报",val:"1"},{key:"登陆页海报",val:"2"}];
            break;
        };
        terminal=parseInt(id);
        $("input[name='HTerminal']").val(terminal);
        $("input[name='HSection']").val(1);
        $("#Section").yayigj_downlist({
            _callBack:getDataList2,
            _data:option,
            },function(api){
                listApi2=api;
        });
        TabContent();
}
//渠道选择 版块
function getDataList2(id){
    section=parseInt(id);
    $("input[name='HSection']").val(section);
    TabContent();
}
//切换渠道选择改变下面的内容
function TabContent(){
    var ter=$("input[name='HTerminal']").val();
    var sec=$("input[name='HSection']").val();
    $("#TabContent .select_types").hide();
    console.log("ter+sec=",ter+sec);
   // $("#Tabcontent .select_types .show_img").attr("src","/static/erp/img/profile/add_pic.png");
    if(flag==0){
        $("#TabContent .select_types").eq(0).attr("data-s","1");
        $("#App21").show();
        if(ter==1){
            $("#PVersion").css("display","block");
        }else{
            $("#PVersion").css("display","none");
        }
    }else{
        if(ter==1){
           if(sec==1){
                $("#PC"+ter+sec).show();
                $("#PBtips").html("560x445");
           }
           else if(sec==4){
                $("#PC"+ter+sec).show();
                $("#PBtips").html("260x240"); 
           }
       }
       if(ter==2){
            $("#App"+ter+sec).show();
       }
        if(ter==3){
           $("#Web"+ter+sec).attr("data-s","1");

       }
       if(ter==4){
           $("#OffWeb"+ter+sec).attr("data-s","1");
       }
    }
    //setID();
}
//只有显示出来的发送时间才会有id,其他的去掉id
function setID(){
    $(".select_types[data-s='0'] input[name='xnum']").attr("id","");
    // $(".select_types[data-s='0'] input[name='up_load']").attr("id","");
    // $(".select_types[data-s='0'] input[name='TeacherPicture']").attr("id","").val("");
    $(".select_types[data-s='0'] input[name='pic_ext']").attr("id","");
  //  $(".select_types[data-s='0'] .show_img").attr({"id":"","src":"/static/erp/img/profile/add_pic.png"});

    $(".select_types[data-s='1'] input[name='xnum']").attr("id","Xnum");
    // $(".select_types[data-s='1'] input[name='up_load']").attr("id","up_load1");
    // $(".select_types[data-s='1'] input[name='TeacherPicture']").attr("id","TeacherPicture1");
    $(".select_types[data-s='1'] input[name='pic_ext']").attr("id","pic_ext1");
    // $(".select_types[data-s='1'] .show_img").attr("id","banner1");
}
//确认添加渠道
function addchannel(obj){
    var cflag=0;
    if($(obj).attr("id")!="AddChannel"){
        $(obj).hide();
        $(obj).siblings("input[value='修改']").show();
        cflag=1;
    }
    var imgurl="";
    var Terminal=$("#Terminal").val();
    var Section=$("#Section").val();
    var terType=$("input[name='HTerminal']").val();//终端
    var secType=$("input[name='HSection']").val();//版块
    var sendtime=$("#Sendselec input[name='time']:checked").val();
    var date=$("#SendTime").val();
    var ahours=$("#Hours").val();
    var aminutes=$("#Minutes").val();
    var aversion=$(".select_types[data-s='1'] input[name='version']:checked").val();
    // var Xnum=$("#Xnum").attr("data-val");
    // var lourl=$("#TeacherPicture1").attr("data-url");
    var InfoEtime=$("#InfoEtime").val();
    var InfoStime=$("#InfoStime").val();
    
    var form_s_time=new Date(InfoStime);
    var form_e_time=new Date(InfoEtime);
    // console.log("form_s_time=",form_s_time,"form_e_time=",form_e_time);
    // console.log(form_e_time==form_s_time)
    if(form_e_time<form_s_time||InfoEtime==InfoStime){
        jQuery.postFail("fadeInUp","信息有效开始时间不能开始比结束时间晚或者在同一天");
        return;
    }
    var listnum=null;
    if(sendtime==0){
        sendtime="手动发送";
    }
    if(sendtime==1){
        sendtime=date+"&nbsp;"+ahours+":"+aminutes;
    }
    sendtime=isNull(sendtime,"手动发送");//如果是空或未定义，则赋值“手动发送”
    aversion=isNull(aversion,"");
    switch(aversion){
        case "0":
        aversion="";
        break;
        case "1":
        aversion="标准版";
        break;
        case "2":
        aversion="专业版";
        break;
    }
//    console.log("terType+secType=",terType+secType);
//     console.log("imgurl1=",imgurl);
    imgurl=$("#TeacherPicture"+String(terType)+String(secType)).val();
    imgurl=isNull(imgurl,"");
    //console.log("imgurl2=",imgurl);
    var lourl=$("#TeacherPicture"+terType+secType).attr("data-url");
    if(flag==1&&imgurl==""){
        jQuery.postFail("fadeInUp","图片上传未成功或者没有选择图片");
        return;
    }
    if(terType==1){
        if(secType==1){
            listnum="1";
        }else if(secType==2){
            listnum="2";
        }
        else if(secType==3){
            listnum="3";
        }
        else if(secType==4){
            listnum="13";
        }
    }
    else if(terType==2){
        if(secType==1){
            listnum="10";
        }else if(secType==2){
            listnum="7";
        }
        else if(secType==3){
            listnum="12";
        }
    }
    else if(terType==3){
        if(secType==1){
            listnum="8";
        }else if(secType==2){
            listnum="9";
        }
        else if(secType==3){
            listnum="11";
        }
    }
    else if(terType==4){
        if(secType==1){
            listnum="14";
        }else if(secType==2){
            listnum="15";
        }
    }
    $("input[name='HNum']").val(listnum);
   // console.log("listnum=",listnum);
    //console.log("Terminal=",Terminal);
     if(cflag==0){//新增的时候需要判断是否重复
         if(Channels[listnum]){
             console.log("Channels[listnum]=",Channels[listnum]);
         }else{
            var li='';
                li+='<li><p>'+Terminal+aversion+'-'+Section+'<input type="button" style="display:none;color:#00c5b5;" value="保存" onClick="addchannel(this)"/><input type="button" value="修改" onClick="editinfo(this)" class="btn_modify">';
                li+='<input type="button" value="删除" class="f86d" onClick="delet_channel(this)"><input type="hidden" value='+listnum+' /></p></li>';
                $("#ChannelList").append(li);
            Channels[listnum]={
                MainImage:imgurl,ExtraText:"",DateBegin:InfoStime,DateEnd:InfoEtime,url:lourl
            }
         }
     }else{//修改的时候直接改变属性值
         Channels[listnum]={
                MainImage:imgurl,ExtraText:"",DateBegin:InfoStime,DateEnd:InfoEtime,url:lourl
            }
     }
    console.log(Channels);
}

function uploadBackFuc(parmas){
    var imgsrc=parmas.picdata,
        imgext=parmas.type;
    $.ajax({
        type:"POST",
        url:"/butlerp/uploadimage",
        dataType:"json",
        data:{
            picdata:imgsrc,
            ext:imgext
        },
        beforeSend: function(){
            jQuery.loading('加载中',1);
        },
        success: function(json){
            var terType=$("input[name='HTerminal']").val();//终端
            var secType=$("input[name='HSection']").val();//版块
            var url=json.list.url.replace(/\u0026/g,"&");
            $("#banner"+terType+secType).attr("src",url);
            $("#TeacherPicture"+terType+secType).val(json.list.id);
            $("#TeacherPicture"+terType+secType).attr("data-url",url);
        },
        error: function(json){jQuery.postFail("fadeInUp",json.info)},
        complete: function(json){
            jQuery.loading_close();
        }
    })
}



//导入excel管家号;    地区先不做 没有做地区重复排除
function excelp(){
    var v = $("#ExcelFile2").val();
    var timg =document.getElementById("ExcelFile2"); //不能使用jq对象，要使用dom
        var reader = new FileReader();
        reader.readAsDataURL(timg.files[0]);
        reader.onload = function(e){
            var imgData = e.target.result.split(',');
          //  console.log(e.target.result);
            var imgContent = imgData[1]
            $.ajax({
                type:"POST",
                url:"/butlerp/message/dentalexcel",
                dataType:"json",
                data:{
                    filedata:imgContent,
                    extname:"xls"
                },
                beforeSend: function(){
                    jQuery.loading('加载中',1);
                },
                complete: function(json){
                   jQuery.loading_close();
                },
                success: function(json){
                    if(json.code==1){
                      //  console.log(json.list);
                        $.each(json.list,function(k,v){
                    
                            Dentals.push(parseInt(v.id));
                            var li='';
                                li='<span class="area_item">'+v.id+'&nbsp;&nbsp;（'+v.name+'）<i onClick="delete_dental(this)" data-id='+v.id+'></i></span>';
                                $("#DentalID").append(li);
                        })
                      $("#DentalNum").text(Dentals.length);
                    }
                },
                error: function(json){
                   
                }
            })
    }
}
//门诊筛选地区 如上没有排除重复
function area_select(){
    var province=$("#province").text();
    var city=$("#city").text();
    var area_item='';
    for(var i=0;i<ret.length;i++){
        //console.log(ret[i]);
        if(ret[i]==province+city){
            return;
        }
    }
    if(province!="省份"||city!="城市"){
         area_item='<span class="area_item">'+province+'&nbsp;&nbsp;'+city+'<i onClick="delet_area(this)"></i></span>';
         $("#area_result").append(area_item);  
         area_num+=1;
         pList.push(province);
         cList.push(city);
         $("#AreaNum").text(area_num);
         areaObj=province+city;
         ret.push(areaObj)
    }
}
//输入管家号获得名字 如上没有排除重复
function dentalid(id){
    $.post("/butlerp/message/dentalname",{DentalID:id},function(result){
        if(result.code==1){
            if(result.list[0].name!=""){
                Dentals.push(parseInt(id));
                var li='';
                li='<div class="area_item">'+id+'&nbsp;&nbsp;（'+result.list[0].name+'）<i onClick="delete_dental(this)" data-id='+id+'></i></div>';
                $("#DentalID").append(li);
                $("#DentalNum").text(Dentals.length);
            }else{
                $("#ButlerNo").val("").focus();
            }
        }
    })
}

//删除已选择地区
function delet_area(obj){
    $(obj).parent(".area_item").remove();
    area_num-=1;
     $("#AreaNum").text(area_num);
}
//删除已添加渠道
function delet_channel(obj){
    $(obj).parents("li").remove();
    delete Channels[$(obj).siblings("input[type='hidden']").val()];
    console.log(Channels)
}
//删除管家号
function delete_dental(obj){
    $(obj).parents(".area_item").remove();
    Dentals.splice($.inArray($(obj).attr("data-id"),Dentals),1);
    $("#DentalNum").text(Dentals.length);
}
//获取经销商
function merchant(){
    $.post("/butlerp/message/getmerchant",{},function(result){
        var merli=[{"key":"不过滤渠道商","val":"0"}];
        if(result.list){
             $.each(result.list,function(k,v){
                merli.push({'key':v.merchantname,'val':v.promotecode});
            })
        }else{
                merli.push({'key':"全部渠道商",'val':""});
        }
        $("#Dealers").yayigj_downlist({
            _data:merli
        })
    });
}
//修改渠道信息
function editinfo (obj){
    var terType=null;
    var secType=null;
    var cnum=$(obj).siblings("input[type='hidden']").val();
    $("#ChannelList input[value='保存']").hide();
    $("#ChannelList input[value='修改']").show();
    $(obj).hide();
    var terType=null;
    $(obj).siblings("input[value='保存']").show();
    var src=Channels[cnum].MainImage;
    var lourl=Channels[cnum].url;
    // console.log(lourl);
    switch(cnum){
        case "1":
            terType="1";
            secType="1";
        break;
        case "2":
            terType="1";
            secType="2";
        break;
        case "3":
            terType="1";
            secType="3";
        break;
        case "7":
            terType="2";
            secType="2";
        break;
        case "8":
            terType="3";
            secType="1";
        break;
        case "9":
            terType="3";
            secType="2";
        break;
        case "10":
            terType="2";
            secType="1";
        break;
        case "11":
            terType="3";
            secType="3";
        break;
        case "12":
            terType="2";
            secType="3";
        break;
        case "13":
            terType="1";
            secType="4";
        break;
        case "14":
            terType="4";
            secType="1";
        break;
        case "15":
            terType="4";
            secType="2";
        break;
    }
     
    // console.log("src=",src);
     console.log("22terType+secType=",terType+secType);
    $("input[name='HTerminal']").val(terType);
    $("input[name='HSection']").val(secType);
    getDataList(terType);
    getDataList2(secType);
    listApi.gotoval(''+terType+''); //根据值定位
    listApi2.gotoval(''+secType+''); //根据值定位
    //TabContent();
    $("#TeacherPicture"+terType+secType).val(src);//传到后台的是没有前缀的 id
    if(lourl){
        $("#banner"+terType+secType).attr("src",lourl); //展示的是完整的url
    }
}
//输入框提示剩余文字
function tips(that,total){
    var num=that.val().length;
    var snum=total-num;
    that.siblings(".tips").text(snum+"/"+total);
}

function isNull(data,info){ 
return (data == "" || data == undefined || data == null) ? info : data; 
}

getDataList('2')
// 切换发送对象
function changeObj(){
    var obj = $('input[name="sendobj"]:checked').val();
    if(obj=="sendobj1"){
        $("#SelecOl").hide();
        if(qudao.length>1){
            qudao.splice(0,1);
        }
        getDataList('2')
        $("#Terminal").yayigj_downlist({
            _callBack:getDataList,
            _data:qudao,
            },function(api){
                listApi=api;
        });
    }else{
        $("#SelecOl").show();
        qudao.unshift({'key':"PC端",'val':"1"});
        getDataList('1')
        $("#Terminal").yayigj_downlist({
            _callBack:getDataList,
            _data:qudao,
            },function(api){
                listApi=api;
        });
    }
}







