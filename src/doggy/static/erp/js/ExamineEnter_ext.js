jQuery.createAniCss();
var option=[
        {key:"不匹配",val:"0"},
        {key:"区级",val:"15"},
        {key:"市级",val:"20"},
        {key:"省级",val:"25"},
        {key:"国家级",val:"30"},
        {key:"国际级",val:"35"},
    ],
    option2=[
        {key:"不匹配",val:"0"},
        {key:"区级",val:"10"},
        {key:"市级",val:"15"},
        {key:"省级",val:"20"},
        {key:"国家级",val:"25"},
        {key:"国际级",val:"30"},
    ];
var listApi24=null,listApi25=null,listApi26=null;
$(function(){
    $(".err_ico").on("click",function(){
        if($(this).attr("data-flag")==1){
            $(this).siblings("input[type='text']").val("").hide();
            $(this).attr("data-flag","0");
        }else{
            $(this).siblings("input[type='text']").show();
            $(this).attr("data-flag","1");
        };
       // console.log("1")
        jyScoreFuc();
    });
    $(".pf_input input[type='text']").on({
        keypress:function(e){
            if(event.keyCode == "13")
            {
               if($(this).val()==""){
                   $(this).siblings(".err_ico").attr("data-flag","0");
                   $(this).hide();
                }
            }
        },
        blur:function(){
              if($(this).val()==""){
                   $(this).siblings(".err_ico").attr("data-flag","0");
                   $(this).hide();
                }
        }
    });
    //点击放大图片
    $(".view_img").on("click",function(){
        $("#centerDiv").remove();
        var src=$(this).siblings(".pf_info").text();
        var img="<img src='"+src+"' />";
        if(src==""){
            jQuery.loading_close();
            return;
        }else if(src.indexOf("http")==-1){
            jQuery.postFail("fadeInUp",'图片地址错误！！');
            jQuery.loading_close();
            return;
        }
        jQuery.loading();
        $(img).load(function(){
            $("body").append("<div id='centerDiv'>"+img+"<span id='close_ico' title='关闭' onclick='closeFuc()' /></span></div>");
            var l_h=$(window).height();
            if($("#centerDiv img").height()>$(window).height()){
                    $("#centerDiv img").css({width:'auto',height:$(window).height()+"px"});
                };
            $("#centerDiv").css("line-height",l_h+"px");
            jQuery.loading_close();
        })
    });
    $(".selc_span").on("click",function(){
        var flag=$(this).attr("data-flag");
        var score=$(this).attr("data-val");
        if(flag==1){
            $(this).attr("data-flag","0");
               
        }else{
            $(this).attr("data-flag","1");    
        };
        hjgetScore();//环境评分
    });
    $("#dcHonor").yayigj_downlist({
        _callBack:tabscore1,
        _data:option
    },function(api){
        listApi24=api
    });
    $("#clHonor").yayigj_downlist({
        _callBack:tabscore2,
        _data:option2
    },function(api){
        listApi25=api
    });
    $("#duHonor").yayigj_downlist({
        _callBack:tabscore3,
        _data:option
    },function(api){
        listApi26=api
    });
    var dcLV=$("#physicianhonorcertlevel").val();
    switch(dcLV){
        case "不匹配":
        dcLV=0;
        break;
        case "区级":
        dcLV=15;
        break;
        case "市级":
        dcLV=20;
        break;
        case "省级":
        dcLV=25;
        break;
        case "国家级":
        dcLV=30;
        break;
        case "国际级":
        dcLV=35;
        break;
    }
    listApi24.gotoval(dcLV);//医生荣誉证书级别
    var clinicLV=$("#clinichonorcertlevel").val();
    switch(clinicLV){
        case "不匹配":
        clinicLV=0;
        break;
        case "区级":
        clinicLV=10;
        break;
        case "市级":
        clinicLV=15;
        break;
        case "省级":
        clinicLV=20;
        break;
        case "国家级":
        clinicLV=25;
        break;
        case "国际级":
        clinicLV=30;
        break;
    }
    listApi25.gotoval(clinicLV);//诊所荣誉证书级别
    var dcduLV=$("#physiciandutylevel").val();
    switch(dcduLV){
        case "不匹配":
        dcduLV=0;
        break;
        case "区级":
        dcduLV=15;
        break;
        case "市级":
        dcduLV=20;
        break;
        case "省级":
        dcduLV=25;
        break;
        case "国家级":
        dcduLV=30;
        break;
        case "国际级":
        dcduLV=35;
        break;
    }
    listApi26.gotoval(dcduLV);//医生行业任职级别
    //年度体检次数
    $("#phyExa").yayigj_downlist({
        _valtype:"txt",
        _callBack:tabscore4,
        _data:[
            {key:"年度体检次数",val:"0"},
            {key:"1年2次",val:"4"},
            {key:"1年1次",val:"2"},
            {key:"无体检",val:"0"},
        ]
    });
    //门诊角色数
    $("#dutyNum").yayigj_downlist({
        _valtype:"txt",
        _callBack:tabscore5,
        _data:[
            {key:"门诊角色数",val:"0"},
            {key:"1个",val:"2"},
            {key:"2个",val:"4"},
            {key:"3个",val:"6"},
            {key:"4个",val:"8"},
            {key:"5个",val:"10"},
            {key:"5个以上",val:"10"},
        ]
    });
})
//================================
//审核结果提交
function postResult(){
    jyScoreFuc();//最后再一次计算分数
    var wsStr="";       //卫生  
    var bsStr="";       //  标识  
    var ljStr="";       //  垃圾处理  
    var ysStr=""        //隐私 
    var safeStr="";     //安全
    var staffStr="";    //员工
    var medqltyStr="";     //医疗质量
    var otherStr="";    //其他
    var infoid=getUrlParam("infoid");
    var userid=getUrlParam("userid");
    var dentalid=getUrlParam("dentalid");
    var dcHonor=$("#dcHonor").val();
    var clHonor=$("#clHonor").val();
    var duHonor=$("#duHonor").val();
    var ws=$(".hj .r_items").eq(0).find(".selc_span");
        ws.each(function(index,ele){
            if($(this).attr("data-flag")==1){
                wsStr+=index+",";
            }
        });
        wsStr=wsStr.substr(0,wsStr.length-1);
    var bs=$(".hj .r_items").eq(1).find(".selc_span");
        bs.each(function(index,ele){
            if($(this).attr("data-flag")==1){
                bsStr+=index+",";
            }
        });
        bsStr=bsStr.substr(0,bsStr.length-1);
    var lj=$(".hj .r_items").eq(2).find(".selc_span");
        lj.each(function(index,ele){
            if($(this).attr("data-flag")==1){
                ljStr+=index+",";
            }
        });
        ljStr=ljStr.substr(0,ljStr.length-1);
    var ys=$(".hj .r_items").eq(3).find(".selc_span");
        ys.each(function(index,ele){
            if($(this).attr("data-flag")==1){
                ysStr+=index+",";
            }
        });
        ysStr=ysStr.substr(0,ysStr.length-1);
    var safe=$(".hj .r_items").eq(4).find(".selc_span");
        safe.each(function(index,ele){
            if($(this).attr("data-flag")==1){
                safeStr+=index+",";
            }
        });
        safeStr=safeStr.substr(0,safeStr.length-1);
    var staff=$(".hj .r_items").eq(5).find(".selc_span");
        staff.each(function(index,ele){
            if($(this).attr("data-flag")==1){
                staffStr+=$(this).text()+",";
            }
        });
        staffStr=staffStr.substr(0,staffStr.length-1);
    var medqlty=$(".hj .r_items").eq(6).find(".selc_span");
        medqlty.each(function(index,ele){
            if($(this).attr("data-flag")==1){
                medqltyStr+=index+",";
            }
        });
        medqltyStr=medqltyStr.substr(0,medqltyStr.length-1);
    var other=$(".hj .r_items").eq(7).find(".selc_span");
        other.each(function(index,ele){
            if($(this).attr("data-flag")==1){
                otherStr+=index+",";
            }
        });
        otherStr=otherStr.substr(0,otherStr.length-1);
    // var remark=$("#Mark").val();
    var remark="";
        if(remark){
            remark=eval("("+remark+")");
        }else{
            remark=new Object();
        }
    if($("#dcHonor").val()=="不匹配"){
         remark["24"]="不匹配";
    }
    if($("#clHonor").val()=="不匹配"){
         remark["25"]="不匹配";
    }
    if($("#duHonor").val()=="不匹配"){
         remark["26"]="不匹配";
    }
    var errStr="";
    $(".err_ico[data-flag='1']").each(function(){
            var errp=$(this).attr("data-remark");
            var errReason=$(this).siblings("input[type='text']").val();
            // console.log("errReason=",errReason);
            if(errReason!=""||errReason!=undefined){
                 remark[errp]=errReason;
            }
    });
    // console.log("remark1=",remark);
    remark=JSON.stringify(remark);
    //  console.log("remark1=",typeof(remark));
    if(remark=="{}"){
        remark="";
    }
    // return;
    var parmas={
        "InfoID":infoid, //主键ID
        "userid":userid,//用户ID
        "dentalid":dentalid,//管家号
        "errsult":remark, //错误json字符串  错误报告
        "BasicScore":"",//基础评分
        "OperatingScore":parseInt($("#b1").text()), //经营评分
        "SocialScore":parseInt($("#b2").text()),// 社会影响力评分
        "EnvironmentalScore":parseInt($("#b3").text()), // 环境评分
        "StarRating":$("#StarLev").text(),//评测星级
        "RatingRemarks":$("#pfTextarea").val(),//评分说明
        "PhysicianHonorCertLevel":dcHonor, // 医生荣誉证书级别
        "ClinicHonorCertLevel":clHonor,//诊所荣誉证书级别 
        "PhysicianDutyLevel":duHonor,//医生行业任职级别
        "Hygiene":wsStr,// 卫生        
        "Identification":bsStr,//  标识        
        "GarbageDisposa":ljStr,//  垃圾处理  
        "Privacy":ysStr,//           隐私        
        "Safe":safeStr,//          安全        
        "Staff":staffStr,//          员工        
        "MedicalQuality":medqltyStr,//    医疗质量  
        "Other":otherStr// 其他 
    };
    jQuery.loading();
    $.post("/butlerp/clinic/examineresult",parmas,function(json){
        jQuery.loading_close();
        if(json.code==1){
            jQuery.postOk("fadeInup","审核完成!");
            window.location.reload();
        }else{
            jQuery.postFail("fadeInup",json.info);
        }
    })
}

//环境计算分数
function hjgetScore(){
    var hj=0;
    $(".hj .selc_span").each(function(index,ele){
        if($(this).attr("data-flag")==1){
            var score=parseInt($(this).attr("data-val"));
            if(isNaN(score)){
                score=0;
            };
            hj+=score;
        }
        $("#b3").text(hj+"分");
    });
    $(".jy .pf_info").each(function(index,ele){
        var txt=$(this).text();
    });
    starLvFuc();
}
//社会影响力计算分数
function getScoreHonor(){
    var honorScore=0;
    $(".pf_honor input[type='text']").each(function(){
        var score=$(this).attr("data-val");
        if(score==undefined||!score){
            score=0;
        }
        score=parseInt(score);
        //console.log("score=",$(this).attr("data-val"))
        if($(this).siblings(".pf_info").text()!=""){
            honorScore+=score;
        }
    });
    $("#b2").text(honorScore+"分");
    starLvFuc();
}
function tabscore1(e,id){
    getScoreHonor();
}
function tabscore2(e){
    getScoreHonor();
}
function tabscore3(e){
    getScoreHonor();
}
function tabscore4(e,id){
    if($("#"+id).attr("data-val")!=0){
        $("#"+id).attr("data-flag","1"); 
    }
    hjgetScore();
}
function tabscore5(e,id){
    if($("#"+id).attr("data-val")!=0){
        $("#"+id).attr("data-flag","1"); 
    }
    hjgetScore();
}
//关闭放大的图片
function closeImg(){
    $("#Bigimg").html("").hide();
}
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}
//经营评分
function jyScoreFuc(){
    // console.log("22")
    var jyScore=0;
    $(".jy .pf_info").each(function(index,ele){
        var txt=$(this).text();
        var iserr=$(this).siblings(".err_ico").attr("data-flag");
        if(iserr==1){
           iserr=false; 
        }else{
            iserr=true; 
        }
        if(index==0&&iserr){
            txt=parseInt(txt);
            if(txt==1||txt==2){
                jyScore+=1;
            }
            else if(txt==3||txt==4){
                jyScore+=2;
            }
            else if(txt==5||txt==6){
                jyScore+=3;
            }
            else if(txt==7||txt==8){
                jyScore+=4;
            }
            else if(txt==9||txt==10){
                jyScore+=5;
            }
            else if(txt==11||txt==12){
                jyScore+=6;
            }
            else if(txt==13||txt==14){
                jyScore+=7;
            }
            else if(txt==15||txt==16){
                jyScore+=8;
            }
            else if(txt==17||txt==18){
                jyScore+=9;
            }
            else if(txt==19){
                jyScore+=10;
            }else{
                jyScore+=10;
            }
            console.log("jyScore=",jyScore)
        }
        else if(index==1&&iserr){
            switch(txt){
                case "私人诊所":
                    jyScore+=2;
                break;
                case "门诊部":
                    jyScore+=4;
                break;
                case "口腔医院":
                    jyScore+=6;
                break;
                case "连锁门诊":
                    jyScore+=8;
                break;
                case "连锁医院":
                    jyScore+=10;
                break;
                default:
                    jyScore+=0;
            }
            console.log("jyScore=",jyScore)
        }
        else if(index==2&&iserr){
            switch(txt){
                case "助理医师":
                    jyScore+=2;
                break;
                case "执业医师":
                    jyScore+=4;
                break;
                case "主治医师":
                    jyScore+=6;
                break;
                case "副主任医师":
                    jyScore+=8;
                break;
                case "主任医师":
                    jyScore+=10;
                break;
                default:
                    jyScore+=0;
            }
            console.log("jyScore=",jyScore)
        }
        else if(index==3&&iserr){
            txt=parseInt(txt);
            console.log("txt=",txt);
            switch(txt){
                case 1:
                    jyScore+=2;
                break;
                case 2:
                    jyScore+=4;
                break;
                case 6:
                    jyScore+=6;
                break;
                case 11:
                    jyScore+=8;
                break;
                case 20:
                    jyScore+=10;
                break;
                default:
                    jyScore+=0;
            }
            console.log("jyScore=",jyScore)
        }
        else if(index==4&&iserr){
            switch(txt){
                case "没有预约":
                    jyScore+=4;
                break;
                case "部分预约":
                    jyScore+=5;
                break;
                case "全部预约":
                    jyScore+=10;
                break;
                default:
                    jyScore+=0;
            }
            console.log("jyScore=",jyScore)
        }
        else if(index==5&&iserr){
            var txt=parseInt(txt);
            switch(txt){
                case 1:
                    jyScore+=2;
                break;
                case 51:
                    jyScore+=4;
                break;
                case 101:
                    jyScore+=6;
                break;
                case 201:
                    jyScore+=8;
                break;
                default:
                    jyScore+=10;
            }
            console.log("jyScore=",jyScore)
        }
        else if(index==6&&iserr){
            txt=parseInt(txt);
            switch(txt){
                case "1":
                    jyScore+=1;
                break;
                case "2-6":
                    jyScore+=2;
                break;
                case "7-12":
                    jyScore+=4;
                break;
                case "13-24":
                    jyScore+=6;
                break;
                case "25-36":
                    jyScore+=8;
                break;
                default:
                    jyScore+=10;
            }
            console.log("jyScore=",jyScore)
        }
        else if(index==7&&iserr){
            txt=parseInt(txt);
            switch(txt){
                case 1:
                    jyScore+=2;
                break;
                case 31:
                    jyScore+=4;
                break;
                case 51:
                    jyScore+=6;
                break;
                case 101:
                    jyScore+=8;
                break;
                case 200:
                    jyScore+=10;
                break;
                default:
                    jyScore+=0;
            }
            console.log("jyScore=",jyScore)
        }
        else if(index==8&&iserr){
            switch(txt){
                case "1":
                    jyScore+=1;
                break;
                case "2-3":
                    jyScore+=2;
                break;
                case "4-5":
                    jyScore+=4;
                break;
                case "6-10":
                    jyScore+=6;
                break;
                case "15":
                    jyScore+=8;
                break;
                default:
                    jyScore+=10;
            }
            console.log("jyScore=",jyScore)
        }
        else if(index==9&&iserr){
            if(txt.indexOf("上")!=-1||parseInt(txt)>10){
                jyScore+=10;
            }else{
                txt=parseInt(txt);
                jyScore+=txt;
            }
        };
        $("#b1").text(jyScore+"分");
    })
    starLvFuc();
}
//星级计算
function starLvFuc(){
    var b1=parseInt($("#b1").text());
    var b2=parseInt($("#b2").text());
    var b3=parseInt($("#b3").text());
    var score=b1*0.6+b2*0.1+b3*0.3;
    var starLev="";
    if(Math.round(score)<30){
        starLev="一星级";
    }
    else if(Math.round(score)<60){
        starLev="二星级";
    }
    else if(Math.round(score)<80){
        starLev="三星级";
    }
    else if(Math.round(score)<90){
        starLev="四星级";
    }
    else{
        starLev="五星级";
    };
    $("#StarLev").text(starLev);
}
function closeFuc(){
    $("#centerDiv").remove();
    jQuery.loading_close();
}
function isEmptyObject(e) {  
    var t;  
    for (t in e){
        return false;  
    }    
    return true;  
}