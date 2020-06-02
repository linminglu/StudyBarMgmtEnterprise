jQuery.createAniCss();
var id=getUrlParam("id");
var HoursArr=[],MinutesArr=[],listApi=null;
for(var i=0;i<60;i++){
    i=i<10?"0"+i:i;
    if(i<12){
        HoursArr.push({key:i,val:i});
    }
    MinutesArr.push({key:i,val:i});
}
$(function(){
    bind();
    if(id){
        //是修改页面
        window.document.title="修改产品";
        modifydata();                 
        $("#isModify").show();
        $("#proID").text(id);
        $("#isModifyTitle").text("修改产品");
    }
})
//================================================
function bind(){

    $("#proName").on("input",function(){
        inputTips("proName",20);
    });
    $(document).on("input propertychange","input[name='Oneprice']",function(){
        var totalPrice=0;
        $("input[name='Oneprice']").each(function(index,el){
            totalPrice+=parseInt($(el).val());
        });
        $("#TotalMoney").text(totalPrice+"元");
    });
}
function addProBtn(obj){
    var parmas={};
    var proPAid=$("#proPAid").val();
    var proName=$("#proName").val();
    // var proCus=$("#proCus").val();
    // var proBuy=$("#proBuy").val();
    // var s_img=$("#sImg").attr("src");
    var Stime= $("#Stime").val()+" "+$("#Hours").val()+":"+$("#Minutes").val();
    var Etime= $("#Etime").val()+" "+$("#Hours2").val()+":"+$("#Minutes2").val();
    // if(s_img=="/static/account/img/u1910.png"){
    //     s_img="";
    // };
    var combodata=[];
    var platform=$("input[name='release_platform']:checked").val();
    if(!platform){
        jQuery.postFail("fadeInup","请选择发布平台");
        return;
    }
    if(!proName){
        jQuery.postFail("fadeInup","请填写产品名称");
        return;
    }
    if(!proPAid){
        jQuery.postFail("fadeInup","请填写平安编号");
        return;
    }
    if($("#proA li").length==0){
        jQuery.postFail("fadeInup","请增加处置!");
        return;
    }
    if($("#proA li").length>0){
        var comboobj={};
        var comboobjPrice=0;
        var handledata=[];
        $("#proA li").each(function(index,el){
            comboobjPrice+=parseInt($(this).find("input[type='number']").val());
            var handelitem={
                "HandleName": $(this).children("input[name='name']").val(),//项目名称
                "Uom": "元",//处置项目单位
                "HandlePrice": $(this).children("input[type='number']").val(),//单价
                "NamePY": $(this).children("input[name='NamePY']").val(),//项目拼音
                "Displayorder": $(this).index()//当前层级
            }
            handledata.push(handelitem);
        })
        combodata.push(comboobj);
    }
 
    var _url="/butlerp/product/AddNewPro"; //新增产品包
    parmas={
        "PackageName": proName,//产品名称
        "Price": parseInt($("#TotalMoney").text()),         //价格
        "PaSerialNum":$("#proPAid").val(),              //平安项目编号
        "Platform": platform,                       //所属平台 100 平安 200 百度
        "handledata":handledata 
           
    };
    if(id){
        _url="/butlerp/product/UpdatePro"; //更新产品包
        parmas.PackageInfoID=id;//包id
    }
    $.ajax({
        type:"POST",
        url:_url,
        dataType:"json",
        data:parmas,
        beforeSend:function(){
            jQuery.loading();
            $(obj).attr("disabled",true);
        },
        complete:function(){
            jQuery.loading_close();
            $(obj).attr("disabled",false);
        },
        success:function(json){
            if(json.code==1){
                if(id){
                    jQuery.postOk("fadeInup","修改成功！");
                }else{
                    jQuery.postOk("fadeInup","添加成功！");
                }
                window.location.href="/butlerp/product/GetProList";
            }else{
                jQuery.postFail("fadeInup",json.info);
            }
        },
        error:function(){
            jQuery.loading_close();
            $(obj).attr("disabled",false);
            jQuery.postFail("fadeInup",json.info);
        }
    })
}
//添加处置
function addProCz(flag){
    var li="";
    if(flag==1){
        var i=$("#proA li").length+1;
        li='<li><span class="l_span l_name">处置'+i+'：</span><input type="text" name="name"><span class="ml20 mr15">项目拼音：</span><input type="text" name="NamePY" class="w60" /><span class="l_span l_span_s">价格</span><input name="Oneprice" type="number" min="1">元';
        li+='<i class="delb_ico" onclick="deletProCz(this,\''+flag+'\')"></i></li>';
        $("#proA").append(li);
    }else if(flag==2){
        var i=$("#proB li").length+1;
        li='<li><span class="l_span l_name">处置'+i+'：</span><input type="text" name="name"><span class="ml20 mr15">项目拼音：</span><input type="text" name="NamePY" class="w60" /><span class="l_span l_span_s">价格</span><input name="Oneprice" type="number" min="1">元';
        li+='<i class="delb_ico" onclick="deletProCz(this,\''+flag+'\')"></i></li>';
         $("#proB").append(li);
    }else{
        jQuery.postFail("fadeInup","点击错误！");
        return false;
    };
}
//删除处置
function deletProCz(obj,flag){
   // console.log("111");
    var parent=$(obj).parent().remove();
    if(flag==1){
        $("#proA").find(".l_name").each(function(index,el){
            $(el).text("处置"+(index+1)+"：");
        });
    }else if(flag==2){
         $("#proB").find(".l_name").each(function(index,el){
            $(el).text("处置"+(index+1)+"：");
        });
    }
}
function inputTips(id,maxlen){
    var len=$("#"+id).val().length;
    $("#"+id).siblings("b").text(len+"/"+maxlen);
}
//修改 传过来的数据
function modifydata(){
    jQuery.loading();
    $.post("/butlerp/product/ViewPro",{PackageInfoID:id},function(json){
        jQuery.loading_close();
            if(json.code==1){
                if(json.list){
                    var v=json.list[0];
                    var proName=v.packagename,
                        proPAid=v.paserialnum;
                        packageinfoid=v.packageinfoid,
                        platform=v.platform;
                        price=v.price;
                        $("#proName").val(proName);
                        $("#proPAid").val(proPAid);
                        //$("#proID").val(packageinfoid);
                        inputTips("proName",20);
                        $("#TotalMoney").html(price+"元");
                        //packageicon=packageicon==""?"/static/account/img/u1910.png":packageicon;
                        // $("#sImg").attr("src",packageicon);
                        if(platform==100){
                            $("#release_platform1").prop("checked",true);
                        }else if(platform==200){
                            $("#release_platform2").prop("checked",true);
                        }
                        if(v.handleinfo){
                            var li="";
                            $.each(v.handleinfo,function(key,val){
                                //$("#Ausenum").text(val.usednum);
                                // 项目拼音：<span>'+val.namepy+'</span>
                               // li+='<li><span class="l_span l_name">处置'+(key+1)+'：</span><span>'+val.handlename+'</span><span class="ml20 mr15"><span class="l_span l_span_s">价格</span><span>'+val.handleprice+'</span>元';
                               li+='<li><span class="l_span l_name">处置'+(key+1)+'：</span><input type="text" name="name" value="'+val.handlename+'"><span class="ml20 mr15">项目拼音：</span><input type="text" value="'+val.namepy+'" name="NamePY" class="w60" /><span class="l_span l_span_s">价格</span><input name="Oneprice" type="number" value="'+val.handleprice+'" min="1">元';
        li+='<i class="delb_ico" onclick="deletProCz(this,1)"></i></li>'; 
                            })
                            $("#proA").html(li);
                        }
                }
            }else{
                jQuery.postFail("fadeInup",json.info);
            }
        }
    )
}


function uploadImg(obj,id){//传入图片路径，返回base64

        var parmas={};
        var base64="";
        var file=$(obj)[0].files[0];
        var reader = new FileReader(); 
        var readerbase64= new FileReader(); 
            // reader.readAsDataURL(file); 
        var type=file.type;   //获取图片格式
        if(type!="image/jpg"&&type!="image/png"&&type!="image/jpeg"){
            jQuery.postFail("fadeInup","请选择.png或者.jpg格式的图片");
            return;
        }
        reader.readAsArrayBuffer(file);
        reader.onloadend=function(e){
            var arr = (new Uint8Array(e.target.result)).subarray(0, 4);
            var header = "";
            for(var i = 0; i < arr.length; i++) {
                header += arr[i].toString(16);
            }	
            switch (header) {
                case "89504e47":
                    type = "image/png";
                    break;
                case "47494638":
                    type = "image/gif";
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                    type = "image/jpeg";
                    break;
                default:
                    type=file.type;
                    break;
            }
            parmas.ext=type;       //"jpeg/jpg/png三种格式"  
            readerbase64.readAsDataURL(file); 
        }
        readerbase64.onload=function(e){
            base64=e.target.result;
            base64=base64.substr(base64.indexOf(',') + 1);
                parmas.picdata=base64; 
            jQuery.loading();   
           // console.log("parmas",parmas);
            $.post("/paweb/uploadimage",parmas,function(json){
                jQuery.loading_close(); 
                $(obj).val("");
                if(json.code==1){
                //  $("#"+id).val(json.list.url);//成功或返回路径到input中
                    if(json.list.url!=""){
                        $(obj).parent().siblings("img").attr("src",json.list.url);
                    }
                    else{
                        jQuery.postFail("fadeInup","上传图片失败！请重新上传");
                    }
                }else{
                    jQuery.postFail("fadeInup",json.info)
                }
            })
        };
    }






