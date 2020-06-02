//通过IP获取当前客户地理位置
$.ajax({
    type:"POST",
    url:"/clinic/getlocation",    
    dataType:"json",
    data:{},
    beforeSend:function(){},
    error:function(){},
    success:function(json){
        console.log(json);
        $("#province").text(""+json.list.province+"");
        $("#province_down_list p").each(function(){   //激活地区选择
            if($(this).text()==""+json.list.province+""){
                $(this).trigger("click");
            }
        })
        $("#city").text(""+json.list.city+"");
        $("#city_down_list p").each(function(){   //激活地区选择
            if($(this).text()==""+json.list.city+""){
                $(this).trigger("click");
                $("#area").text("地区");
            }
        })
    },
    complete:function(){}
})


$("#create_btn").click(function(){
    if($("#clinic_contacts").val()==""){
        $(".sub_tips").show();
        $(".sub_tips label").text("请输入诊所联系人");
        $(".sub_tips").css("top","-300px");
        $("#clinic_contacts").css("border-color","#f86d5a");
        return false;
    }
    if($("#clinic_name").val()==""){
        $(".sub_tips").show();
        $(".sub_tips label").text("请输诊所名称");
        $(".sub_tips").css("top","-224px");
        $("#clinic_name").css("border-color","#f86d5a");
        return false;
    }
    if($("#clinic_phone").val()==""){
        $(".sub_tips").show();
        $(".sub_tips label").text("请输入诊所电话");
        $(".sub_tips").css("top","-146px");
        $("#clinic_phone").css("border-color","#f86d5a");
        return false;
    }
    if($("#per_province").val()==""||$("#per_province").val()=="省份"){
        $(".sub_tips").show();
        $(".sub_tips label").text("请选择省份");
         $(".sub_tips").css("top","-24px");
        $("#per_province").css("border-color","#f86d5a");
        return false;
    }
    if($("#per_city").val()==""||$("#per_city").val()=="城市"){
        $(".sub_tips").show();
        $(".sub_tips label").text("请选择城市");
         $(".sub_tips").css("top","-24px");
         $("#per_city").css("border-color","#f86d5a");
        return false;
    }
    if($("#s_county").val()==""||$("#s_county").val()=="地区"){
        $(".sub_tips").show();
        $(".sub_tips label").text("请选择地区");
         $(".sub_tips").css("top","-24px");
        $("#s_county").css("border-color","#f86d5a");
        return false;
    }
    if($("#clinic_address").val()==""){
        $(".sub_tips").show();
        $(".sub_tips label").text("请输入详细地址");
         $(".sub_tips").css("top","-24px");
        $("#clinic_address").css("border-color","#f86d5a");
        return false;
    }
    $.ajax({
        type:"POST",
        url:"/member/newclinic",
        dataType:"json",
        data:{
            clinicname:$("#clinic_name").val(),
            doctorname:$("#clinic_contacts").val(),
            phone:$("#clinic_phone").val(),
            clinicprovince:$("#per_province").text(),
            cliniccity:$("#per_city").text(),
            clinicarea:$("#s_county").text(),
            address:$("#clinic_address").val()
        },
        beforeSend:function(){},
        success: function(json){
            console.log(json);
            if(json.code==1){
                window.location.href="/index";
            }
        },
        error: function(json){console.log(json);},
        complete: function(json){
            //console.log(json);
        }
    })
    //window.location.href="/member/regsuccess";
})
$("#clinic_contacts").focus(function(){
    $(".sub_tips").hide();
    $("#clinic_contacts").css("border-color","#00c5b5");
    $("#clinic_contacts").css("outline","none");
})
$("#clinic_contacts").blur(function(){
    $("#clinic_contacts").css("border-color","#e0e0e0");
})


$("#clinic_name").focus(function(){
    $(".sub_tips").hide();
    $("#clinic_name").css("border-color","#00c5b5");
    $("#clinic_name").css("outline","none");
})
$("#clinic_name").blur(function(){
    $("#clinic_name").css("border-color","#e0e0e0");
})

$("#clinic_phone").focus(function(){
    $(".sub_tips").hide();
    $("#clinic_phone").css("border-color","#00c5b5");
    $("#clinic_phone").css("outline","none");
})
$("#clinic_phone").blur(function(){
    $("#clinic_phone").css("border-color","#e0e0e0");
})

$("#per_province").focus(function(){
    $(".sub_tips").hide();
    $("#per_province").css("border-color","#00c5b5");
    $("#per_province").css("outline","none");
})
$("#per_province").blur(function(){
    $("#per_province").css("border-color","#e0e0e0");
})

$("#per_city").focus(function(){
    $(".sub_tips").hide();
    $("#per_city").css("border-color","#00c5b5");
    $("#per_city").css("outline","none");
})
$("#per_city").blur(function(){
    $("#per_city").css("border-color","#e0e0e0");
})


$("#s_county").focus(function(){
    $(".sub_tips").hide();
    $("#s_county").css("border-color","#00c5b5");
    $("#s_county").css("outline","none");
})
$("#s_county").blur(function(){
    $("#s_county").css("border-color","#e0e0e0");
})

$("#clinic_address").focus(function(){
    $(".sub_tips").hide();
    $("#clinic_address").css("border-color","#00c5b5");
    $("#clinic_address").css("outline","none");
})
$("#clinic_address").blur(function(){
    $("#clinic_address").css("border-color","#e0e0e0");
})




