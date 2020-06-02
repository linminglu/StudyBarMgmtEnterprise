//获取科室列表信息 2016-10-8黄凯
$.ajax({
    type:"GET",
    url:"/clinic/clinicmanageshow",
    dataType:"json", 
    beforeSend: function(json){
        jQuery.loading('加载中',1);
    },
    error: function(json){
        //console.log(json);
    },
    success: function(json){
        if(json.code==2){
            $("#loading_info").hide();
            jQuery.showError('您没有权限查看数据!','信息反馈');
            jQuery.loading_close();
            reutrn;
        }
        //console.log(json.list.length);
        if(json.list.chaininfo!=null){
            for(i=0;i<json.list.chaininfo.length;i++){
                var str='<li>'+
                    '<span class="d_name">'+'<label class="dn_label">'+json.list.chaininfo[i].departmentname+'</label>'+
                    '<label class="label_none">'+json.list.chaininfo[i].departmentid+'</label>'+'</span>'+
                    '<span class="d_belong">'+'<label class="db_label">'+json.list.chaininfo[i].chainname+'</label>'+
                    '<label  class="label_none">1</label>'+'</span>'+
                    '<span class="d_person">'+json.list.chaininfo[i].memberno+'</span>'+
                    '<span class="d_handle">'+
                        '<label>部门设置<img src="/static/account/img/clinic_green_direct.png"></label>'+
                    '</span>'+
                    '<ol id="handle_ol" class="handle_ol">'+
                        '<p class="handle_item ed_dep">'+"编辑部门"+'</p>'+
                        '<p class="handle_item ed_staff">'+"编辑员工"+'</p>'+
                        '<p class="handle_item del_dep">'+"删除部门"+'</p>'+
                    '</ol>'+       
                '</li>';
                $("#depart_ul").append(str);
                $("#depart_ul li:odd").css("backgroundColor","#fafafa");
            }
        }
        if(json.list.clinicinfo!=null){
            for(i=0;i<json.list.clinicinfo.length;i++){
                var str='<li>'+
                    '<span class="d_name">'+'<label class="dn_label">'+json.list.clinicinfo[i].departmentname+'</label>'+
                    '<label class="label_none">'+json.list.clinicinfo[i].departmentid+'</label>'+'</span>'+
                    '<span class="d_belong">'+'<label class="db_label">'+json.list.clinicinfo[i].clinicname+'</label>'+
                    '<label  class="label_none">'+json.list.clinicinfo[i].clinicid+'</label>'+'</span>'+
                    '<span class="d_person">'+json.list.clinicinfo[i].memberno+'</span>'+
                    '<span class="d_handle">'+
                        '<label>部门设置<img src="/static/account/img/clinic_green_direct.png"></label>'+
                    '</span>'+
                    '<ol id="handle_ol" class="handle_ol">'+
                        '<p class="handle_item ed_dep">'+"编辑部门"+'</p>'+
                        '<p class="handle_item ed_staff">'+"编辑员工"+'</p>'+
                        '<p class="handle_item del_dep">'+"删除部门"+'</p>'+
                    '</ol>'+       
                '</li>';
                $("#depart_ul").append(str);
                $("#depart_ul li:odd").css("backgroundColor","#fafafa");
            }
        }
        if(json.list.clinicinfo==null&&json.list.chaininfo==null){
            var str='<div style="text-align:center;margin-top:40px;"><img src="/static/account/img/no-department.png" width=140;></div>';
            $("#depart_ul").append(str);
        }
    },
    complete: function(json){jQuery.loading_close();}
});


//点击科室设置出现操作列表
$(document).on("click",".d_handle label",function(e){
    var $this=$(this);
     $.ajax({
        type:"POST",
        url:"/member/precheck",
        dataType:"json",
        data:{
            id:60007
        },
        beforeSend: function(){},
        success: function(json){
            //console.log(json);
            if(json.code==1){
                 if($this.parents("li").find(".handle_ol").is(":visible")){
                    $this.parents("li").find(".handle_ol").hide();
                    $this.find("img").attr("src","/static/account/img/clinic_green_direct.png");
                }else{
                    $this.parents("li").find(".handle_ol").show();
                    $this.parents("li").siblings("li").find(".handle_ol").hide();
                    $this.parents("li").siblings("li").find(".d_handle").children("img").attr("src","/static/account/img/clinic_green_direct.png")
                    $this.find("img").attr("src","/static/account/img/clinic_green_direct_t.png");
                }
                $(document).one("click",function(){
                    $(".handle_ol").hide();
                    $(".d_handle img").attr("src","/static/account/img/clinic_green_direct.png");
                })
                e.stopPropagation();
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
})
$(".handle_ol").on("click",function(e){
    e.stopPropagation();
})

//获取连锁店的信息列表 2016-10-8黄凯
var provinceArr=[{'key':'未指定工作场所'}];
$.ajax({
    type:"GET",
    url:"/clinic/getusergroupclinicinfo",
    dataType:"json", 
    beforeSend: function(json){},
    error: function(json){
      /*  console.log(json);*/
    },
    success: function(json){
       //console.log(json);
        if(json.code==1){
            if(json.list.chaininfo!=null){
                for(i=0;i<json.list.chaininfo.length;i++){
                    provinceArr.push({'key':''+json.list.chaininfo[i].chainname+'','val':'1'});
                    //var str='<option value="1">'+json.list.chaininfo[i].chainname+'</option>';
                    //$("#create_cli_name").append(str);
                }
            }
            if(json.list.clinicinfo!=null){
                for(i=0;i<json.list.clinicinfo.length;i++){
                    provinceArr.push({'key':''+json.list.clinicinfo[i].clinicname+'','val':''+json.list.clinicinfo[i].clinicid+''});
                    //var str='<option value='+json.list.clinicinfo[i].clinicid+'>&nbsp;&nbsp;&nbsp;&nbsp;'+json.list.clinicinfo[i].clinicname+'</option>';
                    //$("#create_cli_name").append(str);
                }
            }
            $("#create_cli_name").yayigj_downlist({  //工作场所
                _hiddenID:'clinicid2',
                _valtype:'text',
                _data:provinceArr
            });
        }else{
            //alert(json.info);
            //popdivAnim('bounceInDown',json.info);
        }
    },
    complete: function(json){}
});


//创建科室弹窗
$("#create_apart").click(function(){
    $.ajax({
        type:"POST",
        url:"/member/precheck",
        dataType:"json",
        data:{
            id:60007
        },
        beforeSend: function(){},
        success: function(json){
            //console.log(json);
            if(json.code==1){
                $(".popup_bg").show();
                $(".departs_create").show();
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
})

//获得焦点移除提示状态
$("#depart_name_add").focus(function(){
    $("#form_tip_depname").hide();
    $("#depart_name_add").css("border-color","#00c5b5");
    $("#depart_name_add").css("outline","none");
})
$("#depart_name_add").blur(function(){
    $("#depart_name_add").css("border-color","#e0e0e0");
})


$("#create_cli_name").click(function(){
    $("#form_tip_cliplace").hide();
    $("#create_cli_name").css("border-color","#00c5b5");
    $("#create_cli_name").css("outline","none");
})
// $("#create_cli_name").blur(function(){
//     $("#create_cli_name").css("border-color","#e0e0e0");
// })

$("#new_dep_name").focus(function(){
    $("#form_tip_depname2").hide();
    $("#form_tip_cliplace2").hide();
    $("#new_dep_name").css("border-color","#00c5b5");
    $("#new_dep_name").css("outline","none");
})
$("#new_dep_name").blur(function(){
    $("#new_dep_name").css("border-color","#e0e0e0");
})

//新增部门 2016-10-8 黄凯
$("#edit").click(function(){
    if($("#depart_name_add").val()==""){
        $("#form_tip_depname").show();
        $("#depart_name_add").css("border-color","#f86d5a");
        return false;
    }
    if($("#create_cli_name").text()=="未指定工作场所"){
        $("#form_tip_cliplace").show();
        $("#create_cli_name").css("border-color","#f86d5a");
        return false;
    }
    var selectedName=$("#depart_name_add").val();
    var workplace=$("#create_cli_name").text();
    //console.log(selectedName);
    var selectedNameId="";
    $("#create_cli_name_down_list p").each(function(){
        if($(this).text()==workplace){
            selectedNameId=$(this).attr("value");
        }
    })
    //var index=$("#create_cli_name option:selected").index();
    /*var selectedNameId=$("#create_cli_name option").eq(index+1).text();*/
	//var selectedNameId=$("#create_cli_name option:selected").val();
    var info='{"clinicid":"'+selectedNameId+'","departmentname":"'+selectedName+'"}';
    $.ajax({
        type:"POST",
        url:"/clinic/clinicmanageadd",
        dataType:"json", 
        data:{
            info:JSON.parse(info)
        },       
        beforeSend: function(json){
            
        },
        error: function(json){
            //console.log(json);
        },
        success: function(json){
            //console.log(json);
            if(json.code==1){
                $(".popup_bg").hide();
                $(".departs_create").hide();
                window.location.reload();
            }else{
                $("#form_tip_cliplace").show();
                $("#form_tip_cliplace").html('<img src="/static/account/img/red_exclam.png">'+json.info+'');
                return false;
            }
        },
        complete: function(json){}
    });
})


//编辑部门弹窗
$(document).on("click",".ed_dep",function(){
    $(".popup_bg").show();
    $(".departs_edit").show();
    var old_dep_name=$(this).parents("li").find(".dn_label").text();
    var old_cli_name=$(this).parents("li").find(".db_label").text();
    $("#new_dep_name").val(old_dep_name);
    $("#new_dep_name").focus();
    $("#edit_cli_dep").val(old_cli_name);

    var departmentid=$(this).parents("li").find(".d_name").children(".label_none").text();
    var clinicid=$(this).parents("li").find(".d_belong").children(".label_none").text();
    // console.log(departmentid);
    // console.log(clinicid);
    //编辑部门
    $("#edit_dep_new").click(function(){
        if($("#new_dep_name").val()==old_dep_name){
            $(".popup_bg").hide();
            $(".departs_edit ").hide();
            jQuery.postOk('fadeInUp','保存成功'); 
            window.location.reload();
            return false;
        }
        if($("#new_dep_name").val()==""){
            $("#form_tip_depname2").show();
            $("#new_dep_name").css("border-color","#f86d5a");
            return false;
        }
        var departmentname=$("#new_dep_name").val();
        var info='{"departmentid":"'+departmentid+'","departmentname":"'+departmentname+'","clinicid":"'+clinicid+'"}';
        // console.log(departmentname);
        $.ajax({
            type:"POST",
            url:"/clinic/clinicmanageedit",
            dataType:"json", 
            data:{
                info:JSON.parse(info)
            },       
            beforeSend: function(json){},
            error: function(json){
               //console.log(json);
            },
            success: function(json){
                //console.log(json);
                if(json.code==1){
                    $(".popup_bg").hide();
                    $(".departs_edit ").hide();
                    jQuery.postOk('fadeInUp','保存成功'); 
                    window.location.reload();
                }else{
                     $("#form_tip_cliplace2").show();
                      $("#form_tip_cliplace2").html('<img src="/static/account/img/red_exclam.png">'+json.info+'');
                     return false;
                    //alert(json.info);
                    //popdivAnim('bounceInDown',json.info);
                }
            },
            complete: function(json){}
        });
    })
})

//编辑员工弹窗
$(document).on("click",".ed_staff",function(){
    $(".popup_bg").show();
    $(".staff_edit").show();
    var old_dep_name=$(this).parents("li").find(".dn_label").text();
    var old_cli_name=$(this).parents("li").find(".db_label").text();
    var departmentid=$(this).parents("li").find(".d_name").children(".label_none").text();
    var clinicid=$(this).parents("li").find(".d_belong").children(".label_none").text();
    //console.log(departmentid);
    //console.log(clinicid);
    //console.log(old_dep_name);

    $("#edit_dep_staff").text("("+old_cli_name+")");
    var info='{"departmentid":"'+departmentid+'","clinicid":"'+clinicid+'"}';
    //获取员工信息
    function getStaffInfo(){
        $.ajax({
            type:"POST",
            url:"/clinic/clinicmanageshowemployee",
            dataType:"json", 
            data:{
                info:JSON.parse(info)
            },       
            beforeSend: function(json){},
            error: function(json){
                //console.log(json);
            },
            success: function(json){
                //console.log(json);
                var htm="";
                if(json.list.clinicemployees!=null){
                    //console.log(1);
                    $.each(json.list.clinicemployees,function(k,v){    //按照部门返回员工
                        if(v.currentemployees==null){
                            var length=0;
                        }else{
                            var length=v.currentemployees.length;
                        }
                        //console.log(length);
                        htm+='<li>';
                        htm+='<label class="dep_kind"><label class="len_depart_name">'+v.departmentname+'</label>('+length+')';
                        htm+='<img src="/static/account/img/clinic_show_direct.png">';
                        htm+='</label>';
                        if(v.currentemployees!=null){
                            $.each(v.currentemployees,function(m,n){
                                htm+='<ul>';
                                htm+='<li>';
                                htm+='<ul style="display:none;" class="dis_ul">';
                                htm+='<li>';
                                htm+='<b></b>';
                                htm+='<span class="doc_name" id="'+n.doctorid+'">'+n.name+'</span>';
                                if(n.duty!=undefined){
                                    htm+='<span class="job_name">'+n.duty+'</span>';
                                }
                                htm+='<i></i></li>'
                                htm+='</ul>';
                                htm+='<i></i><span class="doc_name">'+n.name+'</span>';
                                htm+='</li>';
                                htm+='</ul>';
                            })
                        }
                        htm+='</li>';
                        
                    })
                }
                $("#all_by_dept").html(htm);
                $("#all_by_dept li").each(function(){
                    // console.log(0);
                    // console.log($(this).find(".len_depart_name").text());
                    if($(this).find(".len_depart_name").text()==old_dep_name){
                        //console.log(11);
                        $(this).find("ul li").css("backgroundColor","#EDF0F2");
                    }
                })
                var obj="";
                if(json.list.total!=null){
                    $.each(json.list.total,function(k,v){   //所有员工按字母排序
                        obj+='<li>';
                        obj+='<ul style="display:none;" class="dis_ul">';
                        obj+='<li>';
                        obj+='<b></b>';
                        obj+='<span class="doc_name" id="'+v.doctorid+'">'+v.name+'</span>';
                        obj+='<span class="job_name">'+v.duty+'</span>';
                        obj+='<i></i></li>'
                        obj+='</ul>';
                        obj+='<i></i>';
                        obj+='<span class="doc_name">'+v.name+'</span>';
                        if(v.departmentname==null){
                            obj+='<span class="dep_name"></span></li>';
                        }else{
                            obj+='<span class="dep_name">'+v.departmentname+'</span></li>';
                        }
                    })
                }
                $("#all_by_name").html(obj);
                $("#all_by_name li").each(function(){
                    if($(this).find(".dep_name").text()==old_dep_name){
                        //console.log(11);
                        $(this).css("backgroundColor","#EDF0F2");
                    }
                })

                var str="";
                if(json.list.current!=null){
                    var pre_staff_num=json.list.current.length;
                    //console.log(pre_staff_num);
                    if(pre_staff_num>0){
                        $.each(json.list.current,function(k,v){    //当前部门员工
                            str+='<li>';
                            str+='<b></b>';
                            str+='<span class="doc_name" id="'+v.doctorid+'">'+v.name+'</span>';
                            str+='<span class="job_name">'+v.duty+'</span>';
                            str+='<i></i></li>';
                        })
                    }else{
                        str+='<li>当前科室暂无员工</li>'
                    }
                }else{
                    var pre_staff_num=0;
                }
                $("#list_num").text(pre_staff_num);
                $("#pres_dep_staffs").html(str);
            },
            complete: function(json){}
        });
    }
    //获取员工信息，当前部门员工信息不刷新
    function getStaffInfoBut(){
        $.ajax({
            type:"POST",
            url:"/clinic/clinicmanageshowemployee",
            dataType:"json", 
            data:{
                info:JSON.parse(info)
            },       
            beforeSend: function(json){},
            error: function(json){
                //console.log(json);
            },
            success: function(json){
                //console.log(json);
                var htm="";
                if(json.list.clinicemployees!=null){
                    //console.log(1);
                    $.each(json.list.clinicemployees,function(k,v){    //按照部门返回员工
                        if(v.currentemployees==null){
                            var length=0;
                        }else{
                            var length=v.currentemployees.length;
                        }
                        //console.log(length);
                        htm+='<li>';
                        htm+='<label class="dep_kind"><label class="len_depart_name">'+v.departmentname+'</label>('+length+')';
                        htm+='<img src="/static/account/img/clinic_show_direct.png">';
                        htm+='</label>';
                        if(v.currentemployees!=null){
                            $.each(v.currentemployees,function(m,n){
                                htm+='<ul>';
                                htm+='<li>';
                                htm+='<ul style="display:none;" class="dis_ul">';
                                htm+='<li>';
                                htm+='<b></b>';
                                htm+='<span class="doc_name" id="'+n.doctorid+'">'+n.name+'</span>';
                                if(n.duty!=undefined){
                                    htm+='<span class="job_name">'+n.duty+'</span>';
                                }
                                htm+='<i></i></li>'
                                htm+='</ul>';
                                htm+='<i></i><span class="doc_name">'+n.name+'</span>';
                                htm+='</li>';
                                htm+='</ul>';
                            })
                        }
                        htm+='</li>';
                        
                    })
                }
                $("#all_by_dept").html(htm);
                $("#all_by_dept li").each(function(){
                    // console.log(0);
                    // console.log($(this).find(".len_depart_name").text());
                    if($(this).find(".len_depart_name").text()==old_dep_name){
                        //console.log(11);
                        $(this).find("ul li").css("backgroundColor","#EDF0F2");
                    }
                })
                var obj="";
                if(json.list.total!=null){
                    $.each(json.list.total,function(k,v){   //所有员工按字母排序
                        obj+='<li>';
                        obj+='<ul style="display:none;" class="dis_ul">';
                        obj+='<li>';
                        obj+='<b></b>';
                        obj+='<span class="doc_name" id="'+v.doctorid+'">'+v.name+'</span>';
                        obj+='<span class="job_name">'+v.duty+'</span>';
                        obj+='<i></i></li>'
                        obj+='</ul>';
                        obj+='<i></i>';
                        obj+='<span class="doc_name">'+v.name+'</span>';
                        if(v.departmentname==null){
                            obj+='<span class="dep_name"></span></li>';
                        }else{
                            obj+='<span class="dep_name">'+v.departmentname+'</span></li>';
                        }
                    })
                }
                $("#all_by_name").html(obj);
                $("#all_by_name li").each(function(){
                    if($(this).find(".dep_name").text()==old_dep_name){
                        //console.log(11);
                        $(this).css("backgroundColor","#EDF0F2");
                    }
                })
            },
            complete: function(json){}
        });
    }
    getStaffInfo();
    //员工部门转移
    $(document).on("click","#all_by_name li",function(){

        var nowStaffArr=[];
        $("#pres_dep_staffs li").each(function(){
            var oneStaNam=$(this).find(".doc_name").text();
            //console.log(oneStaNam);
            nowStaffArr.push(oneStaNam);
        })
        //console.log(nowStaffArr);

        var this_dep_name=$(this).children(".dep_name").text();
        var this_doc_name=$(this).children(".doc_name").text();
        //console.log(this_doc_name);
        var arrReturn=$.inArray(""+this_doc_name+"",nowStaffArr);
        //console.log(arrReturn);
        if(this_dep_name!=old_dep_name&&arrReturn<0){
            //console.log("此员工不是当前科室员工");
            var clone_staff=$(this).find(".dis_ul li").clone();
            $("#pres_dep_staffs").append(clone_staff);
        };
    })

    $(document).on("click","#all_by_dept li ul li",function(){

        var nowStaffArr2=[];
        $("#pres_dep_staffs li").each(function(){
            var oneStaNam2=$(this).find(".doc_name").text();
            //console.log(oneStaNam2);
            nowStaffArr2.push(oneStaNam2);
        })
        //console.log(nowStaffArr2);

        var this_dep_name2=$(this).parent().siblings(".dep_kind").find(".len_depart_name").text();
        var this_doc_name2=$(this).children(".doc_name").text();
        //console.log(this_doc_name2);
        var arrReturn2=$.inArray(""+this_doc_name2+"",nowStaffArr2);
        //console.log(arrReturn2);
        if(this_dep_name2!=old_dep_name&&arrReturn2<0){
            //console.log("此员工不是当前科室员工");
            var clone_staff2=$(this).find(".dis_ul li").clone();
            $("#pres_dep_staffs").append(clone_staff2);
        };
    })

    //移除当前员工
    $(document).on("click",".r_box li i",function(){
        $(this).parent().remove();
    })

    //编辑员工确定
    $("#edit_staff_confim").click(function(){
        var doctoridArray=[];
        $(".doc_name").each(function(){
            if($(this).parents("ol").attr("id")=="pres_dep_staffs"){
                var doctorid=$(this).attr("id");
                doctoridArray.push(doctorid);
            }
        })
        //console.log(doctoridArray);
        var info='{"clinicid":"'+clinicid+'","departmentid":"'+departmentid+'","doctorid":"'+doctoridArray.join(",")+'"}';
        $.ajax({
            type:"POST",
            url:"/clinic/clinicmanageeditemployee",
            dataType:"json", 
            data:{
                info:JSON.parse(info)
            },       
            beforeSend: function(json){},
            error: function(json){
               //console.log(json);
            },
            success: function(json){
                //console.log(json);
                $(".popup_bg").show();
                $(".staff_edit").show();
                window.location.reload();
            },
            complete: function(json){}
        })
    })

    $("#close").click(function(){
         $("#edit_staff_search").val("");
         getStaffInfoBut();
        // //$(this).css("display","none");
        // $("input[type=text]").css("display","none");	
        // $("#staff,#depart").css("display","inline-block");	
    })
    //搜索员工即时查询
    $('#edit_staff_search').bind('input propertychange',function(){
        //console.log("我在搜索");
        if($("#edit_staff_search").val()==""){
          getStaffInfoBut();
          return false;
        }
        var info='{"clinicid":"'+clinicid+'","keywords":"'+$("#edit_staff_search").val()+'"}';
        $.ajax({
            type:"POST",
            url:"/clinic/searchmmployee",
            dataType:"json", 
            data:{
                info:JSON.parse(info)
            },       
            beforeSend: function(json){},
            error: function(json){
                //console.log(json);
            },
            success: function(json){
                //console.log(json);
                if(json.code==0){
                    var lab='<li>没有匹配的员工</li>';
                    $("#all_by_name").html(lab);
                }else{
                    var lab="";
                    if(json.list!=null){
                          $.each(json.list,function(k,v){
                                lab+='<li><i></i>';
                                lab+='<ul style="display:none;" class="dis_ul">';
                                lab+='<li>';
                                lab+='<b></b>';
                                lab+='<span class="doc_name" id="'+v.doctorid+'">'+v.name+'</span>';
                                lab+='<span class="job_name">'+v.duty+'</span>';
                                lab+='<i></i></li>'
                                lab+='</ul>';
                                lab+='<span class="doc_name">'+v.name+'</span>';
                                lab+='<span class="dep_name">'+v.departmentname+'</span></li>';
                          })
                    }
                    $("#all_by_name").html(lab);
                    $("#all_by_dept").html(lab);
                    $("#all_by_name li").each(function(){
                        if($(this).find(".dep_name").text()==old_dep_name){
                            //console.log(11);
                            $(this).css("backgroundColor","#EDF0F2");
                        }
                    })
                }
            },
            complete: function(json){}
        })
     })
})

//部门展开收起
$(document).on("click",".dep_kind",function(){
    if($(this).siblings("ul").is(":hidden")){
        $(this).siblings("ul").show();
        $(this).find("img").attr("src","/static/account/img/clinic_show_direct_t.png");
    }else{
        $(this).siblings("ul").hide();
        $(this).find("img").attr("src","/static/account/img/clinic_show_direct.png");
    }
})

//删除部门弹窗
$(document).on("click",".del_dep",function(){
    $(".popup_bg").show();
    $("#depart_remove").show();
    var departmentid=$(this).parents("li").find(".d_name").children(".label_none").text();
    var clinicid=$(this).parents("li").find(".d_belong").children(".label_none").text();
    //console.log(departmentid);
    //console.log(clinicid);
    var info='{"clinicid":"'+clinicid+'","departmentid":"'+departmentid+'"}';
    //删除部门
    $("#remove_sure2").click(function(){
        $.ajax({
            type:"POST",
            url:"/clinic/clinicmanagedelete",
            dataType:"json", 
            data:{
                info:JSON.parse(info)
            },       
            beforeSend: function(json){},
            error: function(json){
                //console.log(json);
            },
            success: function(json){
                //console.log(json);
                $(".popup_bg").hide();
                $("#depart_remove").hide();
                window.location.reload();
            },
            complete: function(json){}
        });
    })
})
//关闭编辑科室成员的事件
function closeStaff(){
    $(".popup_bg").hide();
    $(".staff_edit").hide();
    $("#edit_staff_confim").unbind("click");
    $("#edit_staff_search").val("");
    $("#close").css("display","none");
    $("#selc").css("display","block");
    $("#edit_staff_search").css("display","none");	
    $("#staff,#depart").css("display","inline-block");	
    //$("#staff,#depart").css("display","block");
    //getStaffInfo();
    //$("#close").trigger("click");
    //window.location.reload();
}
//关闭编辑科室的事件
function closeDeparts(){
    $("#new_dep_name").attr("value","");
    $("#edit_cli_dep").attr("value","");
    $(".popup_bg").hide();
    $(".departs_edit").hide();
    $(".departs_create").hide();
    $("#edit_dep_new").unbind("click");
    $("#form_tip_depname").hide();
    $("#depart_name_add").css("border-color","#e0e0e0");
    $("#depart_name_add").css("outline","none");
    //window.location.reload();
}
//关闭删除科室的事件
function closeRemove(){
    $(".popup_bg").hide();
    $("#depart_remove").hide();
    $("#remove_sure2").unbind("click");
}

//奇数行背景色 兼容IE8
$(".depart_ul li:odd").css("backgroundColor","#fafafa");

//点击搜索框内的搜索图标
$("#selc").click(function(){
    $("#staff,#depart").css("display","none");
    $("input[type=text],#close").css("display","inline-block");	
})

//点击科室和所有人切换
$("#staff").click(function(){
    $(this).css("border-bottom","2px solid #00bb9c");
    $("#depart").css("border","none");
    $("#depart_list").css("display","none");
    $("#staff_list").css("display","block");
})
$("#depart").click(function(){
    $(this).css("border-bottom","2px solid #00bb9c");
    $("#staff").css("border","none");
    $("#depart_list").css("display","block");
    $("#staff_list").css("display","none");	
})	
