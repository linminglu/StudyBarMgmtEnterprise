jQuery.createAniCss();
var pageApi=null,popApi1=null,popApi5=null;
var pageobj={
    pageSize:10,
    pageNo:1,
    totalcount:-1    
};
$(function(){
    bind();
    datalist(pageobj);
    $("#SelcBtn").on("click",function(){
        pageApi.filling(1);
        datalist(pageobj);
    })
    $("#PAlistPage").pagination({
		totalData:0,
		showData:0,
		pageCount:0,
		coping:true,
		count:2,
		jumpCallBack:jump,  			
		callback:function(index){
            pageobj.pageNo=index.getCurrent();  
            datalist(pageobj);   
        }
	},function(api){			
		pageApi=api;
	});
    function jump(params){			
		pageobj.pageSize=params;	
        pageobj.pageNo=1;		
		datalist(pageobj);						
		pageApi.reSetPageSize(params);		
	};
})

function bind(){
    $(document).on("click",".close_ico",function(){
         $(this).parent().remove();
    })
    $("#BeginDate").yayigj_date_Sel({
        varType:"val"
    });
    $("#EndDate").yayigj_date_Sel({
        varType:"val"
    });
    $("#scroll_div_1").scroll(function(event) {	
        var head = $("#thead_1");
        if( $(this).scrollTop() >= 30 ){
            head.css('transform','translateY('+($(this).scrollTop())+'px)');				
        }else{
            head.css('transform','translateY('+(0)+'px)' );
        }			
	});
    //加载页面获取当天日期
    // $("#BeginDate").getCurrday();
    // $("#EndDate").getCurrday();
    // valToday("BeginDate");
    valDays("BeginDate","-7");//一周前的
    valToday("EndDate");
    $("#Sign_s_t").yayigj_date_Sel({
        varType:"val",
        _disbLtToday:true
    });
    $("#Sign_e_t").yayigj_date_Sel({
        varType:"val",
        _disbLtToday:true
    });
    $("#re_Sign_s_t").yayigj_date_Sel({
        varType:"val",
        _disbLtToday:true
    });
    $("#re_Sign_e_t").yayigj_date_Sel({
        varType:"val",
        _disbLtToday:true
    });
    //弹窗绑定===========================================
    //签约弹窗
	$("#Sign").yayigj_pop_window({
		_coverOpacity:0.2,
		_isShow:false,
        _titleAlign: 'center',
        _fotBgnAlign:'center',
		_fotTopLine:'none',
		_close_callBackFunc:function(){
           
		},
		_zindex:14,					//层级
		_isAddCoverDiv:true	//是否自己生成背景遮挡层,zindex自动用_zindex-1,会随关闭按钮自动关闭
		},function(api){
			popApi1=api;
		});
     //重新签约
    $("#reSign").yayigj_pop_window({
		_coverOpacity:0.2,
        _titleAlign: 'center',
		_isShow:false,
        _fotBgnAlign:'center',
		_fotTopLine:'none',
		_close_callBackFunc:function(){
           
		},
		_zindex:14,					//层级
		_isAddCoverDiv:true	//是否自己生成背景遮挡层,zindex自动用_zindex-1,会随关闭按钮自动关闭
		},function(api){
			popApi2=api;
		});
    //取消签约
    $("#CancelSign").yayigj_pop_window({
		_coverOpacity:0.2,
		_isShow:false,
        _titleAlign: 'center',
        _fotBgnAlign:'center',
		_fotTopLine:'none',
		_close_callBackFunc:function(){
           
		},
		_zindex:14,					//层级
		_isAddCoverDiv:true	//是否自己生成背景遮挡层,zindex自动用_zindex-1,会随关闭按钮自动关闭
		},function(api){
			popApi4=api;
		});
        //批量导入
    $("#ImportExcel").yayigj_pop_window({
		_coverOpacity:0.2,
		_isShow:false,
        _titleAlign: 'center',
        _fotBgnAlign:'center',
		_fotTopLine:'none',
		_close_callBackFunc:function(){
           
		},
		_zindex:14,					//层级
		_isAddCoverDiv:true	//是否自己生成背景遮挡层,zindex自动用_zindex-1,会随关闭按钮自动关闭
		},function(api){
			popApi5=api;
		});
    $("#upload1").on("change",function(){
        if($(this).parents(".pics").find("img").length<9){
            uploadImg(this)
        }else{
            jQuery.postFail("fadeInup","最多上传9张图片!")
        }
    })
    $("#upload2").on("change",function(){
        if($(this).parents(".pics").find("img").length<9){
            uploadImg(this)
        }else{
            jQuery.postFail("fadeInup","最多上传9张图片!")
        }
    });
    $("#SignBtn").on("click",function(){
        var obj=$("input[name='h_pop']").val();
        signFuc(obj);
    });
}
//====================================
function datalist(pageobj){
    var s_time=$("#BeginDate").val();
    var e_time=$("#EndDate").val();
    var province=$("#province").val();
    var city=$("#city").val();
    s_time=new Date(s_time);
    e_time=new Date(e_time);
    if(s_time>e_time){
        jQuery.postFail("fadeInup","查询时间错误");
        return;
    };
    province=province=="省份"?"":province;
    city=city=="城市"?"":city;
    var parmas={
        "start_time":$("#BeginDate").val(), //开始时间
        "end_time":$("#EndDate").val(),//结束时间
        "per_page":pageobj.pageSize,//每页数量  int
        "page":pageobj.pageNo, //页码  int
        "province":province,//省份 没有传空
        "city":city, //市区 没有传空
        "condition":$("#condition").val(),//输入框条件 没有传空
        "status":$("#sendState").attr("data-val"), // 状态 没有传空
        "starlevel":$("#sendType").attr("data-val"),//诊所星级
        "totalcount":pageobj.totalcount,//总数，第一次传-1 int
    };
    
    $.ajax({
        type:"POST",
        url:"/butlerp/clinicaudit/clinics",
        data:parmas,
        dataType:"json",
        beforeSend:function(){
            jQuery.loading();
        },
        complete:function(json){
            jQuery.loading_close();
            if(json.status=="302"){
                var _url=JSON.parse(json.responseText);
                window.location.href=_url.info;
            }
        },
        success:function(json){
            if(json.code==1){
                pageApi.ReSet(parseInt(json.totalcount),parseInt(json.pagesize));
                comdata(json.list);
            }else{
                jQuery.postFail("fadeInup",json.info);
            }
        },
        error:function(json){
            jQuery.postFail("fadeInup",json.info);
        }
    })
}
//  0表示临时保存;1表示待审核;2表示审核中;3表示审核失败  ;4表示审核成功;只有0和3两种状态，(未签约).5已签约
function comdata(data){
    var html='<thead id="thead_1"><tr><th>门诊名称</th><th>管家号</th><th>机构地址</th><th>联系方式</th><th>申请时间</th><th>状态</th><th>基础评分</th><th>用户评分</th><th>诊所星级</th><th>操作</th></tr></thead><tbody>'
    if(!data){
        $("#PAlistPage").hide();
        html+='<tr class="no_data"><td colspan="10"></td></tr></tbody>';
    }else{
        $("#PAlistPage").show();
        $.each(data,function(k,v){
            var action="";
            var s1="<a href='/butlerp/clinicaudit/viewauditenter?InfoID="+v.infoid+"&UserID="+v.userid+"&DentalID="+v.dentalid+"&ClinicID="+v.clinicid+"' target='_blank'>查看</a>";
            var s2="<a href='/butlerp/clinicaudit/examineenter?infoid="+v.infoid+"&userid="+v.userid+"&dentalid="+v.dentalid+"'>审核资料</a>";
            var s3="<span onclick='signPop(\""+v.infoid+"\",\""+v.userid+"\",\""+v.dentalid+"\",\""+v.clinicname+"\",\""+v.clinicid+"\")'>签约</span>";
            var s4="<span onclick='resignPop(\""+v.infoid+"\",\""+v.userid+"\",\""+v.dentalid+"\",\""+v.clinicname+"\",\""+v.clinicid+"\")'>重新签约</span>";
            var s5="<span onclick='cancelsignPop(\""+v.infoid+"\",\""+v.userid+"\",\""+v.dentalid+"\",\""+v.clinicname+"\",\""+v.clinicid+"\")'>取消签约</span>";
            var s6="<a href='/butlerp/clinicaudit/examineenter?infoid="+v.infoid+"&userid="+v.userid+"&dentalid="+v.dentalid+"'>重审</a>";
            var s7="<a href='/butlerp/clinicaudit/finishpage?infoid="+v.infoid+"&s=1'>完善资料</a>";
            var s8="<span onclick='deleteC(\""+v.infoid+"\")'>删除</span>";
            var s9="<a href='/butlerp/clinicaudit/finishpage?infoid="+v.infoid+"&s=2'>修改资料</a>";
            if(v.checkstatus==1){
                action=s1+s9+s2;
                v.checkstatus="申请中";
            }
            else if(v.checkstatus==2){
                action=s1+s9+s2;
                v.checkstatus="申请中";
            }
            else if(v.checkstatus==3){
                action=s1+s9+s2;
                v.checkstatus="未通过";
            }
            else if(v.checkstatus==4){
                action=s3+s1+s9+s2;
                v.checkstatus="未签约";
            }
            else if(v.checkstatus==5){
                action=s4+s5+s1+s9+s2;
                v.checkstatus="已签约";
            }
            else if(v.checkstatus==0){
                action=s7+s8+s9+s2;
                v.checkstatus="待完善";
            }
            html+='<tr><td>'+v.clinicname+'</td><td>'+v.dentalid+'</td><td title="'+v.diqu+'">'+v.diqu+'</td><td>'+v.mobile+'</td><td>'+v.createtime+'</td><td>'+v.checkstatus+'</td><td>'+v.basicscore+'</td><td>'+v.userrating+'</td><td>'+v.starrating+'</td><td>'+action+'</td></tr>';
        });
    }
    html+="</tbody>";
    $("#PAlist").html(html);
}
//签约弹窗
function signPop(infoid,userid,dentalid,clinicname,clinicid){
    valToday("Sign_s_t");
   // valToday("Sign_e_t");
    valMonthday("Sign_e_t");
    popApi1.showPopwnd();
    $("input[name='InfoID']").val(infoid);
    $("input[name='UserID']").val(userid);
    $("input[name='DentalID']").val(dentalid);
    $("input[name='clinicname']").val(clinicname);
    $("input[name='ClinicID']").val(clinicid);
}
//关闭取消签约
function closesign(){
    popApi1.closePopwnd();
}
//重新签约弹窗
function resignPop(infoid,userid,dentalid,clinicname,clinicid){
    valToday("re_Sign_s_t");
    valMonthday("re_Sign_e_t");
    popApi2.showPopwnd();
    $("input[name='InfoID']").val(infoid);
    $("input[name='UserID']").val(userid);
    $("input[name='DentalID']").val(dentalid);
    $("input[name='clinicname']").val(clinicname);
    $("input[name='ClinicID']").val(clinicid);
}
function closeresign(){
       popApi2.closePopwnd();
}
//取消签约弹窗
function cancelsignPop(infoid,userid,dentalid,clinicname,clinicid){
    popApi4.showPopwnd();
    $("input[name='InfoID']").val(infoid);
    $("input[name='UserID']").val(userid);
    $("input[name='DentalID']").val(dentalid);
    $("input[name='ClinicID']").val(clinicid);
    $("input[name='clinicname']").val(clinicname);
    $("#CancelTxt").val("");
}
function closecancel(){
    popApi4.closePopwnd();
}

//最终确定签约
function signFuc(flag){
    var show_info='确定签约该诊所?';
    if(flag==2){
        show_info='确定取消该诊所的签约?';
    }
    jQuery.showDel(show_info,'提示',
		function(){  
            var s_t="";
            var e_t="";
            var SignDocuments="";
            if(flag==1){
                s_t=$("#Sign_s_t").val();
                e_t=$("#Sign_e_t").val();
                if($(".pics").find("img").length==0){
                    jQuery.postFail("fadeInup","请选择签约文件!");
                    return;
                }
            }
            if(flag==3){
                s_t=$("#re_Sign_s_t").val();
                e_t=$("#re_Sign_e_t").val();
                if($(".pics").find("img").length==0){
                    jQuery.postFail("fadeInup","请选择签约文件!");
                    return;
                }
            } 
            else if(flag==2){
                if($("#CancelTxt").val()==""){
                    jQuery.postFail("fadeInup","请填写取消原因!");
                    $("#CancelTxt").focus();
                    return;
                }
            }
            $(".pics").find("img").each(function(index,ele){
                var src=$(this).attr("src");
                SignDocuments+=src+"|";
            });
            if(new Date(s_t)>new Date(e_t)){
                jQuery.postFail("fadeInup","签约时间不正确!");
                return;
            }
            // SignDocuments=JSON.stringify(SignDocuments);
            SignDocuments=SignDocuments.substr(0,SignDocuments.length-1);
        //  console.log("SignDocuments=",SignDocuments);
        // console.log("11");
            var parmas={
                "InfoID":$("input[name='InfoID']").val(), //主键ID
                "UserID":$("input[name='UserID']").val(),//用户ID
                "DentalID":$("input[name='DentalID']").val(),//管家号
                "ClinicID":$("input[name='ClinicID']").val(),
                "Remark":$("#CancelTxt").val(), //取消原因
                "type":flag,//签约 1  取消签约 2  重新签约 3
                "ClinicName":$("input[name='clinicname']").val(), //诊所名称
                "StartDate":s_t,// 开始时间
                "EndDate":e_t, // 结束时间
                "SignDocuments":SignDocuments,//签约文件
            }
            jQuery.loading();
            $("#SignBtn").val("正在签约中").attr("disabled",true);
            $.post("/butlerp/clinicaudit/signup",parmas,function(json){
                $("#SignBtn").val("签约").attr("disabled",false);
                jQuery.loading_close();
                if(json.code==1){
                    $(".pics input[type='file']").val("");
                    $(".pics span").remove();
                 // $(".pics").empty();
                    closeresign();
                    closesign();
                    closecancel();
                    datalist(pageobj);
                }else{
                    jQuery.postFail("fadeInup",json.info);
                }
            });
            jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
        },function(){
            jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
        })
}

function valToday(id){
    if(id!=undefined){
        var nday=new Date();
        var year=nday.getFullYear();
        var month=parseInt(nday.getMonth())+1;
        var day=nday.getDate();
            month=month<10?month="0"+month:month;
            days=day<10?day="0"+day:day;
            $("#"+id).val(year+"-"+month+"-"+days);
    }
}
function valMonthday(id){
    if(id!=undefined){
        var nday=new Date();
        var year=nday.getFullYear();
        var month=parseInt(nday.getMonth())+1;
        var day=nday.getDate()+30;

        var MonDay=new Date(year,month-1,day);
            year=MonDay.getFullYear();
            month=parseInt(MonDay.getMonth())+1;
            day=MonDay.getDate()

            month=month<10?month="0"+month:month;
            days=day<10?day="0"+day:day;
            $("#"+id).val(year+"-"+month+"-"+days);
    }
}
function valDays(id,num){
    if(id!=undefined){
        var nday=new Date();
        var year=nday.getFullYear();
        var month=parseInt(nday.getMonth())+1;
        var day=nday.getDate()+parseInt(num);

        var MonDay=new Date(year,month-1,day);
            year=MonDay.getFullYear();
            month=parseInt(MonDay.getMonth())+1;
            day=MonDay.getDate();

            month=month<10?month="0"+month:month;
            days=day<10?day="0"+day:day;
            $("#"+id).val(year+"-"+month+"-"+days);
    }
}
//base64位转化
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
        //  console.log("arr=",arr)
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
        // console.log("type",type);
        readerbase64.readAsDataURL(file); 
    }
    readerbase64.onload=function(e){
        base64=e.target.result;
        //  console.log("base64",base64);
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
                    $(obj).parent().before("<span><b class='close_ico'></b><img src='"+json.list.url+"' ondblclick='openImg(\""+json.list.url+"\")' /></span>");
                    
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
function openImg(src){
    window.open(src);
}
//打开批量导入弹窗
function showExeclPop(){
    popApi5.showPopwnd();
}
function deleteC(infoid){
     jQuery.showDel("确定删除该诊所资料",'提示',
		function(){  
            var parmas={
               infoid:infoid
            }
            jQuery.loading();
            $.post("/butlerp/clinicaudit/delclinic",parmas,function(json){
                jQuery.loading_close();
                if(json.code==1){
                    jQuery.postOk("删除成功!");
                    datalist(pageobj);
                }else{
                    jQuery.postFail("fadeInup",json.info);
                }
            });
            jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
        },function(){
            jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
        })
}
function previewImage(file) {
    var uid=''
    var obj=$(file);
    var filename=obj.attr("data-id");
    var parmas={
         "picdata":"",      //base64的excel数据
          "ext":""          //后缀类型 xls 或 xlsx
    }
    if(file.files && file.files[0]) {
        var ext = file.files[0].name;
        var reader = new FileReader();
        reader.onload = function(evt) {
            src = evt.target.result;
                src=src.substr(src.indexOf(',') + 1);
            parmas.ext=ext.split(".")[1]
            parmas.picdata=src;
            $.post("/butlerp/clinicaudit/importclinic",parmas,function(json){
                if(json.code==1){
                    jQuery.postOk("上传成功!");
                    datalist(pageobj);
                }else{
                    jQuery.postFail("fadeInup",json.info);
                }
            });
        }
        reader.readAsDataURL(file.files[0]);
        $("#uploadExcel").val("");
    };
    
  
}
function closecancel5(){
    popApi5.closePopwnd();
}