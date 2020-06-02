
//全局变量 判断是否被改变
var saveStatus=0;
$("#clinic_f input[type='text']").on("input propertychange",function(){
	saveStatus=1;
	changeSave();
});
$("#clinic_s input[type='text']").on("input propertychange",function(){
	saveStatus=1;
	changeSave();
});
$("#clinic_f #province,#clinic_f #city,#clinic_f #area").on("click",function(){
	saveStatus=1;
	changeSave();
});
$("#clinic_f #info").on("input propertychange",function(){
	saveStatus=1;
	changeSave();
});
$("#upload1,#upload_credit,#upload_lince").click(function(){
	saveStatus=1;
	changeSave();
})
function changeSave(){
	if(saveStatus==1){
		$("#save").attr("disabled",false).removeClass("ac_btn_bf_disable");
	}else{
		$("#save").attr("disabled",true).addClass("ac_btn_bf_disable");
	}
}

$.ajax({                           
    type:"POST",
    url:"/clinic/loadchaininfo",    //获取连锁机构信息
    dataType:"json",
    data:{},
    beforeSend:function(){
        jQuery.loading('加载中',1);
    },
    error:function(){},
    success:function(json){
        //console.log(json);
        if(json.code==2){
            $("#loading_info").hide();
            jQuery.showError('您没有权限使用该功能!','信息反馈');
            jQuery.loading_close();
            reutrn;
        }
        if(json.list[0].logo!=""){
            $("#logo").attr("src",""+json.list[0].logo+"");
        }
        $("#clinciNmae").val(json.list[0].chainname);
        $("#contact").val(json.list[0].contact);
        $("#phone").val(json.list[0].mobile);
        if(json.list[0].province!=""&&json.list[0].province!="省份"){
            $("#province").text(json.list[0].province);
            $("#province_down_list p").each(function(){   //激活城市选择
                if($(this).text()==""+json.list[0].province+""){
                    $(this).trigger("click");
                }
            })
            if(json.list[0].city!=""&&json.list[0].city!="城市"){
                $("#city").text(json.list[0].city);
                $("#city_down_list p").each(function(){   //激活地区选择
                    if($(this).text()==""+json.list[0].city+""){
                        $(this).trigger("click");
                    }
                })
            }
            $("#area").text(json.list[0].area);
        }else{
             $("#province").text("省份");
             $("#city").text("城市");
             $("#area").text("地区");
        }
        $("#address").val(json.list[0].address);
        $("#info").val(json.list[0].info);
        $("#save").attr("disabled",true).addClass("ac_btn_bf_disable");
    },
    complete:function(){jQuery.loading_close();}
})



//保存连锁机构信息
$("#save").click(function(){
     $.ajax({
        type:"POST",
        url:"/member/precheck",
        dataType:"json",
        data:{
            id:60011
        },
        beforeSend: function(){},
        success: function(json){
            //console.log(json);
            if(json.code==1){
               chainInfoSave();
            }else{
                jQuery.showError('您没有此功能操作权限!','信息反馈');
                return false;
            }
        },
        error: function(json){
            //console.log(json);
        },
        complete: function(json){}
    })
    // console.log(2);
    function chainInfoSave(){
        if($("#clinciNmae").val()==''){
            $("#clinciNmae").css("border-color","#f86d5a");
            $("#clinic_err").css("visibility","visible");
            return false;
        }
        if($("#contact").val()==''){
            $("#contact").css("border-color","#f86d5a");
            $("#contact_err").css("visibility","visible");
            return false;
        }
        if($("#phone").val()==''){
            $("#phone").css("border-color","#f86d5a");
            $("#phone_err").css("visibility","visible");
            return false;
        }else if($("#phone").val().length<7){
            $("#phone").css("border-color","#f86d5a");
            $("#phone_err").html("诊所电话不能少于7位").css("visibility","visible");	
            return false;
        }else if(isNaN($("#phone").val())){
            $("#phone").css("border-color","#f86d5a");
            $("#phone_err").html("诊所电话请填写数字").css("visibility","visible");	
            return false;
        }
    
        var base64=$("#logo").attr("src");//诊所logo
        var oneExt=$("#pic_logo").val();
        if(oneExt==""){
            logo=base64;
        }else{
            logo=base64.substr(base64.indexOf(',') + 1);
        }
        //console.log($("#chain_contact_add").val());
        $.ajax({
            type:"POST",
            url:"/clinic/savechaininfo",
            dataType:"json", 
            data:{
                logoimg:logo,
                mobile:$("#phone").val(),
                contact:$("#contact").val(),
                chainname:$("#clinciNmae").val(),
                province:$("#province").text(),
                city:$("#city").text(),
                area:$("#area").text(),
                address:$("#address").val(),
                info:$("#info").val()
            },       
            beforeSend: function(json){},
            error: function(json){
                //console.log(json);
            },
            success: function(json){
                //console.log(json);
                if(json.code==1){
                    localStorage.setItem("clinicname",$("#clinciNmae").val());
                    localStorage.setItem("clinicphoto",$("#logo").attr("src"));
                    jQuery.postOk('fadeInUp','保存成功');
                    window.location.reload();
                }
            },
            complete: function(json){}
        });
    }
})


//清除错误信息
$("#clinciNmae").focus(function(){
    $("#clinic_err").css("visibility","hidden");
    $("#clinciNmae").css("border-color","#00c5b5");
    $("#clinciNmae").css("outline","none");
})
$("#clinciNmae").blur(function(){
    $("#clinciNmae").css("border-color","#e0e0e0");
})

$("#contact").focus(function(){
    $("#contact_err").css("visibility","hidden");
    $("#contact").css("border-color","#00c5b5");
    $("#contact").css("outline","none");
})
$("#contact").blur(function(){
    $("#contact").css("border-color","#e0e0e0");
})

$("#phone").focus(function(){
    $("#phone_err").css("visibility","hidden");
    $("#phone").css("border-color","#00c5b5");
    $("#phone").css("outline","none");
})
$("#phone").blur(function(){
    $("#phone").css("border-color","#e0e0e0");
})
