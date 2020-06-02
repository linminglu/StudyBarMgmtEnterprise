
//离职交接医生列表
$.ajax({
    type:"GET",
    url:"index.php?m=ClinicMember&a=handover_list",
    dataType:"json",
    beforeSend: function(){$("#turn_doc_list").html("正在加载中...").css("text-align","center")},
    success: function(json){
        //console.log(json);
        var str="";
        if(json[0].info.length>0){
            $.each(json[0].info,function(k,v){
                $.each(v.data,function(m,n){
                    str+='<ul class="appraval_content turn_content">';
                    str+='<li class="doc_pho">';
                    str+='<img src="'+n.Picture+'">';
                    str+='<span>'+n.Name+'</span>';
                    str+='<span class="turn_doc_id">'+n.DoctorID+'</span>';
                    str+='</li>';
                    str+='<li class="work_job_place"><span class="user_clinic_name">'+v.clinicname+'</span><span class="turn_cli_id">'+v.clinicid+'</span>'+'</li>';
                    str+='<li class="work_job_num">'+n.UserNum+'</li>';
                    str+='<li>'+n.duty+'</li>';
                    str+='<li>'+n.Sex+'</li>';
                    str+='<li>'+n.Birthday+'</li>';
                    str+='<li>'+n.Phone+'</li>';
                    str+='<!-- <li><p class="level_p"><i>LV.2</i></p><p>勋章:2</p></li> -->';
                    if(n.DataStatus=="4"){DataStatus="未交接"}
                    else if(n.DataStatus=="5"){DataStatus="已交接"}
                    str+='<li class="no_turn_on">'+DataStatus+'</li>';
                    if(n.DataStatus=="4"){
                        str+='<li class="operate_job">';
                        str+='<span class="turn_work">交接工作</span>';
                        str+='<span class="resume_it">取消离职</span>';
                        str+='</li>';
                    }
                    str+='</ul>';
                });
            })
        }else{
            str+='<div>暂无离职交接信息</div>'
        }
        $("#turn_doc_list").html(str);
    },
    error: function(json){console.log(json);},
    complete: function(json){console.log(json);}
})

//搜索查询离职医生列表
$("#select_staff").click(function(){
    $.ajax({
        type:"POST",
        url:"index.php?m=ClinicMember&a=handover_list",
        dataType:"json",
        data:{
            keyword:$("#search_condition").val()
        },
        beforeSend: function(){},
        success: function(json){
            console.log(json);
            var str="";
            $.each(json[0].info,function(k,v){
                $.each(v.data,function(m,n){
                    str+='<ul class="appraval_content turn_content">';
                    str+='<li class="doc_pho">';
                    str+='<img src="'+n.Picture+'">';
                    str+='<span>'+n.Name+'</span>';
                    str+='<span class="turn_doc_id">'+n.DoctorID+'</span>';
                    str+='</li>';
                    str+='<li class="work_job_place">'+v.clinicname+'<span class="turn_cli_id">'+v.clinicid+'</span></li>';
                    str+='<li class="work_job_num">'+n.UserNum+'</li>';
                    str+='<li>'+n.duty+'</li>';
                    str+='<li>'+n.Sex+'</li>';
                    str+='<li>'+n.Birthday+'</li>';
                    str+='<li>'+n.Phone+'</li>';
                    str+='<!-- <li><p class="level_p"><i>LV.2</i></p><p>勋章:2</p></li> -->';
                    if(n.DataStatus=="4"){DataStatus="未交接"}
                    else if(n.DataStatus=="5"){DataStatus="已交接"}
                    str+='<li class="no_turn_on">'+DataStatus+'</li>';
                    str+='<li class="operate_job">';
                    str+='<span class="turn_work">交接工作</span>';
                    str+='<span class="resume_it">取消离职</span>';
                    str+='</li>';
                    str+='</ul>';
                });
            })
            $("#turn_doc_list").html(str);
        },
        error: function(json){console.log(json);},
        complete: function(json){console.log(json);}
    })
})

//获取门诊交接人信息
$(document).on("click",".turn_work",function(){
    //console.log(1);
    var turn_cli_id=$(this).parents("li").siblings(".work_job_place").find(".turn_cli_id").text();
    console.log(turn_cli_id);
    var turn_doc_id=$(this).parents("li").siblings(".doc_pho").find(".turn_doc_id").text();
    console.log(turn_doc_id);
    var clinicname=$(this).parents("li").siblings(".work_job_place").find(".user_clinic_name").text();
    $.ajax({
        type:"POST",
        url:"index.php?m=ClinicMember&a=handover_users",
        dataType:"json",
        data:{
            userid:turn_doc_id,
            clinicid:turn_cli_id,
            clinicname:clinicname
        },
        beforeSend: function(){},
        success: function(json){
            console.log(json);
            $("#turn_cli_name_tit").text(json[0].info.clinicName);
            var str="";
            $.each(json[0].info.nameOrder,function(k,v){
                str+='<li>';
                str+='<i></i><span class="doc_name" id="'+v.DoctorID+'">'+v.Name+'</span>';
                str+='<span class="dep_name">'+v.DepartmentName+'</span>';
                str+='<img src="/Account/public/img/turn_sel_nor.png" class="turn_sel_img">';
                str+='</li>';
            })
            $("#name_order").html(str);
            var obj="";
            if(json[0].info.departmentInfo!=null){
                $.each(json[0].info.departmentInfo,function(k,v){
                    obj+='<li>';
                    obj+='<label class="dep_kind">'+v.DepartmentName+'('+v.count+')';
                    obj+='<img src="/Account/public/img/clinic_show_direct.png">';
                    obj+='</label>';
                    $.each(v.info,function(m,n){
                        obj+='<ul>';
                        obj+='<li>';
                        obj+='<i></i>';
                        obj+='<span class="doc_name" id="'+n.DoctorID+'">'+n.Name+'</span>';
                        obj+='<img src="/Account/public/img/turn_sel_nor.png" class="turn_sel_img">';
                        obj+='</li>';
                        obj+='</ul>';
                     })
                    obj+='</li>';
                })
            }
            $("#department_info").html(obj);

            //即时查询
            $('#turn_search_staff').bind('input propertychange',function(){
                console.log(11);
                $.ajax({
                    type:"POST",
                    url:"index.php?m=ClinicMember&a=handover_search",
                    dataType:"json",
                    data:{
                        name:$("#turn_search_staff").val(),
                        userid:turn_doc_id,
                        clinicid:turn_cli_id
                    },
                    beforeSend: function(){},
                    success: function(json){
                        console.log(json);
                        if(json[0].nameSearch==null){
                            //console.log(00);
                            var html='<li>没有匹配的员工</li>';
                            $("#department_info").html(html);
                            $("#name_order").html(html);
                        }else{
                            //console.log(11);
                            var html="";
                            $.each(json[0].nameSearch,function(k,v){
                                html+='<li>';
                                html+='<i></i><span class="doc_name">'+v.Name+'</span>';
                                html+='<span class="dep_name">'+v.DepartmentName+'</span>';
                                html+='<img src="/Account/public/img/turn_sel_nor.png" class="turn_sel_img">';
                                html+='</li>';
                            })
                            $("#name_order").html(html);
                        }
                    },
                    error: function(json){console.log(json);},
                    complete: function(json){console.log(json);}
                })
            });

            //选中交接医生
            $(document).on("click","#name_order li",function(){
                $(this).find("img").attr("src","/Account/public/img/turn_sel_yes.png");
                $(this).siblings().find("img").attr("src","/Account/public/img/turn_sel_nor.png");
                var doctorid2=$(this).find(".doc_name").attr("id");
                console.log(doctorid2);

                //保存交接信息
                $("#turn__han_con").click(function(){
                    $.ajax({
                        type:"POST",
                        url:"index.php?m=ClinicMember&a=handover_save",
                        dataType:"json",
                        data:{
                            doctorid1:turn_doc_id,//离职人doctorid
                            clinicid1:turn_cli_id,//离职人clinicid
                            doctorid2:doctorid2 //交接人doctorid
                        },
                        beforeSend: function(){},
                        success: function(json){
                            console.log(json);
                            if(json[0].code==1){
                                $(".staff_edit turn_edit").hide();
                                $(".sta_man_bg").hide();
                                window.location.reload();
                            };
                        },
                        error: function(json){console.log(json);},
                        complete: function(json){console.log(json);}
                    })
                })
            })
        },
        error: function(json){console.log(json);},
        complete: function(json){console.log(json);}
    })
})



//取消离职
$(document).on("click",".resume_it",function(){
    var turn_cli_id_can=$(this).parents("li").siblings(".work_job_place").find(".turn_cli_id").text();
    console.log(turn_cli_id_can);
    var turn_doc_id_can=$(this).parents("li").siblings(".doc_pho").find(".turn_doc_id").text();
    console.log(turn_doc_id_can);
    $(document).on("click","#cancel_leave",function(){
        console.log(1);
        $.ajax({
            type:"POST",
            url:"index.php?m=ClinicMember&a=handover_cancel",
            dataType:"json",
            data:{
                userid:turn_doc_id_can,
                clinicid:turn_cli_id_can
            },
            beforeSend: function(){},
            success: function(json){console.log(json);},
            error: function(json){console.log(json);},
            complete: function(json){console.log(json);}
        })
    })
})
