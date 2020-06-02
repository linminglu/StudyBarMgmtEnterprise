$.ajax({
    type:"POST",
    url:"index.php?m=SystemConfig&a=indexReturn",
    dataType:"json",
    data:{},
    beforeSend: function(){},
    success: function(json){
        console.log(json);
        var str="";
        $.each(json.data,function(k,v){
            str+='<li id="'+v.ClinicID+'">'+v.Name+'</li>';
        });
        $("#usecon_cli_name").html(str);
    },
    error: function(json){/*console.log(json);*/},
    complete: function(json){/*console.log(json);*/}
})

$(".login_way").click(function(){
    $(this).attr("data-sel","1");
    $(this).siblings(".login_way").attr("data-sel","0");
})

$(document).on("click","#usecon_cli_name li",function(){
    $(this).css("backgroundColor","#f7f9fa");
    $(this).siblings().css("backgroundColor","#fff");
})

$(".use_box_sel img").click(function(){
    //console.log(1);
    var picSrc=$(this).attr("src");
    if(picSrc=="/Account/public/img/checkbox.png"){
        $(this).attr("src","/Account/public/img/checked.png");
    }else{
        $(this).attr("src","/Account/public/img/checkbox.png");
    }
})
/*$("#sue_set_save").click(function(){
    console.log(1);
    $.ajax({
        type:"POST",
        url:"index.php?m=SystemConfig&a=edit",
        dataType:"json",
        data:{
            ClinicUniqueID:
            SysConfigIdentity:
            ConfigGroup:
            ConfigName:
            ConfigValue:
            ConfigComment:
        },
        beforeSend: function(){},
        success: function(json){
            console.log(json);
        },
        error: function(json){console.log(json);},
        complete: function(json){console.log(json);}
    })
})*/