/*获取诊所信息和收费类型*/
$.ajax({
    type:"GET",
    url:"index.php?m=Charge&a=indexAjax",
    dataType:"json",
    beforeSend: function(){},
    success: function(json){
        console.log(json);
        var cls="";//诊所列表 可能为1则是单店版
        var places="";
        $.each(json.data,function(k,v){
            //console.log(json.data);
            cls+="<li id='"+v.ClinicID+"' class='cls'>"+v.Name+"<img src='/Account/public/img/per_mana_icon_3.png' class='fold'>";
            cls+="<ul id='job_lists_"+k+"' class='charge_set_ul'>";
            console.log(v.info);
            if(v.info!=null&&v.info!=undefined){
                $.each(v.info,function(m,n){
                    cls+="<li data-order='"+n.DisplayOrder+"' id='"+n.ClinicUniqueID+"' class='"+n.DictionaryIdentity+"'>"+n.DictionaryName;
                    cls+="<img src='/Account/public/img/up.png' class='action_ico up' id=''>";
                    cls+="<img src='/Account/public/img/down.png' class='action_ico down' id=''>";
                    cls+="<img src='/Account/public/img/delete.png' class='action_ico delete' id=''>";
                    cls+="</li>";
                })
            }
            cls+="</ul>";
            cls+="</li>";
            places+="<option value='"+v.ClinicID+"'>"+v.Name+"</option>";
        })
        $("#create_cli_name").html(places);
        $("#clinci_lists").html(cls);

    },
    error: function(json){console.log(json);},
    complete: function(json){console.log(json);}
})


//新增收费类型
$(document).on("click","#edit",function(){
    $.ajax({
        type:"POST",
        url:"index.php?m=Charge&a=addOk",
        dataType:"json",
        data:{
            clinicID:$("#create_cli_name").val(),
            chargeName:$("#depart_name_add").val()
        },
        beforeSend: function(){},
        success: function(json){
            console.log(json);
            if(json.code==1){
                $(".set_fee_type").hide();
                $(".popup_bg").hide();
                window.location.reload();
            };
        },
        error: function(json){console.log(json);},
        complete: function(json){console.log(json);}
    })
})

//删除收费类型
$(document).on("click",".delete",function(){
    var ClinicUniqueID=$(this).parent().attr("id");
    //console.log(ClinicUniqueID);
    var DictionaryIdentity=$(this).parent().attr("class");
    //console.log(DictionaryIdentity);
    $.ajax({
        type:"POST",
        url:"index.php?m=Charge&a=delete",
        dataType:"json",
        data:{
            ClinicUniqueID:ClinicUniqueID,
            DictionaryIdentity:DictionaryIdentity,
        },
        beforeSend: function(){},
        success: function(json){
            console.log(json);
            if(json.code==1){
                alert("删除成功");
                window.location.reload();
            }
        },
        error: function(json){console.log(json);},
        complete: function(json){console.log(json);}
    })
}) 

//上移 下移
$(document).on("click",".action_ico ",function(){
    var ClinicUniqueID1=$(this).parent().attr("id");
    //console.log(ClinicUniqueID);
    var DictionaryIdentity1=$(this).parent().attr("class");
    //console.log(DictionaryIdentity);
    var DisplayOrder1=$(this).parent().attr("data-order");
    //console.log(DisplayOrder1);
    //console.log(info1);
    if($(this).hasClass("up")){
        console.log("上");
        var DisplayOrder2=DisplayOrder1-1;
        var ClinicUniqueID2=$(this).parent().siblings("li[data-order="+DisplayOrder2+"]").attr("id");
        var DictionaryIdentity2=$(this).parent().siblings("li[data-order="+DisplayOrder2+"]").attr("class");
        console.log(DisplayOrder2);
        console.log(DictionaryIdentity2);
    }else if($(this).hasClass("down")){
        console.log("下");
        var DisplayOrder2=DisplayOrder1*1+1;
        var ClinicUniqueID2=$(this).parent().siblings("li[data-order="+DisplayOrder2+"]").attr("id");
        var DictionaryIdentity2=$(this).parent().siblings("li[data-order="+DisplayOrder2+"]").attr("class");
        console.log(DisplayOrder2);
        console.log(DictionaryIdentity2);
    }
    var info1='{"ClinicUniqueID":"'+ClinicUniqueID1+'","DictionaryIdentity":"'+DictionaryIdentity1.replace(/[^0-9]+/g, '')+'","DisplayOrder":"'+DisplayOrder2+'"}';
    var info2='{"ClinicUniqueID":"'+ClinicUniqueID2+'","DictionaryIdentity":"'+DictionaryIdentity2.replace(/[^0-9]+/g, '')+'","DisplayOrder":"'+DisplayOrder1+'"}';
    var info1Array=[];
    info1Array.push(info1);
    var info2Array=[];
    info2Array.push(info2);
    $.ajax({
        type:"POST",
        url:"index.php?m=Charge&a=handle",
        dataType:"json",
        data:{
            info1:JSON.parse(info1),
            info2:JSON.parse(info2)
        },
        beforeSend: function(){},
        success: function(json){
            console.log(json);
            if(json.code==1){
            //     alert("操作成功");
            //     window.location.reload();
            }
        },
        error: function(json){console.log(json);},
        complete: function(json){console.log(json);}
    })
}) 


//收费类型点击切换处置项目
$(document).on("click",".charge_set_ul li",function(event){
    event.stopPropagation();
    //console.log(1);
    $(this).addClass("charge_se_li").siblings().removeClass("charge_se_li");
    var charge_cli_id=$(this).parents(".cls").attr("id");
    //console.log(charge_cli_id);
    var charge_dic_iden=$(this).attr("class").replace(/[^0-9]/ig,"");
    //console.log(charge_dic_iden);
    var charge_item_name=$(this).text();
    //console.log(charge_item_name);
    $("#manage_type").val(charge_item_name);
    var ClinicUniqueID=$(this).attr("id");
    //console.log(ClinicUniqueID);

    //处置项目列表
    $.ajax({
        type:"POST",
        url:"index.php?m=Handleset&a=indexAjax",
        dataType:"json",
        data:{
            DictionaryIdentity:charge_dic_iden,
            clinicID:charge_cli_id
        },
        beforeSend: function(){},
        success: function(json){
            console.log(json);
            var str='<li class="set_li_bg">'+
                   '<ul class="set_prem_ul set_prem_ul1">'+
                   '<li>处置代码</li>'+
                   '<li>处置名称</li>'+
                   '<li>单元价</li>'+
                   '<li class="set_comp">单位</li>'+
                   '<li>按会员折扣</li>'+
                   '<li>费用类型</li>'+
                   '<li>计算方式</li>'+
                   '<li class="set_remarks">备注</li>'+
                   '<li>操作</li>'+
                   '</ul>'+
                   '</li>';
            if(json.data==null){
                str+='<li>暂无数据</li>'
                $("#charge_hand_item").html(str);
            }else{
                $.each(json.data,function(k,v){
                    str+='<li class="set_li_bg">';
                    str+='<ul  class="set_prem_ul set_prem_ul2">';
                    str+='<li>'+v.HandleCode+'</li>';
                    str+='<li>'+v.HandleName+'</li>';
                    str+='<li>'+v.HandlePrice+'</li>';
                    str+='<li class="set_comp">'+v.Uom+'</li>';
                    str+='<li><img src="/Account/public/img/set_sel_bor.png"></li>';
                    str+='<li>'+v.FeeType+'</li>';
                    if(v.BillType==0){
                        var BillTypeValue="按牙齿计算";
                    }else{
                        var BillTypeValue="按全牙计算";
                    }
                    str+='<li>'+BillTypeValue+'</li>';
                    str+='<li class="set_remarks">'+v.Remark+'</li>';
                    str+='<li id="'+v.HandleSetGUID+'"><span class="set_modify">修改</span><span class="set_remove">删除</span></li>';
                    str+='</ul>';
                    str+='</li>';
                })
                $("#charge_hand_item").html(str);
            }
        },
        error: function(json){console.log(json);},
        complete: function(json){console.log(json);}
    })

    //添加处置项目
    $("#add_manage_item").click(function(){
        $(".set_mana_item1").show();
        $(".popup_bg").show();
    })

    $("#set_create").click(function(){
        //console.log(1);
        if($('#fee_type option:selected').val()=="按牙齿数计算"){
            var BillType=0;
        }else if($('#fee_type option:selected').val()=="按全牙计算"){
            var BillType=1;
        }
        $.ajax({
            type:"POST",
            url:"index.php?m=Handleset&a=addOk",
            dataType:"json",
            data:{
                ClinicUniqueID:ClinicUniqueID,
                DictionaryIdentity:charge_dic_iden,
                HandleCode:$("#manage_num").val(),
                HandleName:$("#manage_name").val(),
                FeeType:$("#manage_type").val(),
                BillType:BillType,
                HandlePrice:$("#manage_way").val(),
                Uom:$("#specifications").val(),
                Remark:$("#set_rmark").val(),
                CalByVIP:0
            },
            beforeSend: function(){},
            success: function(json){
                console.log(json);
                if(json.code==1){
                    $(".set_mana_item1").hide();
                    $(".popup_bg").hide();
                    window.location.reload();
                }
            },
            error: function(json){console.log(json);},
            complete: function(json){console.log(json);}
        })
    }) 

    //删除处置项目
    $(document).on("click",".set_remove",function(){
        $("#delete_pop").show();
        $(".popup_bg").show();
        //console.log(1);
        $("#delete_staff_confim").click(function(){
            var HandleSetGUID=$(this).parent().attr("id");
            console.log(HandleSetGUID);
            $.ajax({
                type:"POST",
                url:"index.php?m=Handleset&a=delete",
                dataType:"json",
                data:{
                    HandleSetGUID:HandleSetGUID,
                    ClinicUniqueID:ClinicUniqueID
                },
                beforeSend: function(){},
                success: function(json){
                    console.log(json);
                    if(json.code==1){
                        $("#delete_pop").hide();
                        $(".popup_bg").hide();
                        window.location.reload();
                    };
                },
                error: function(json){console.log(json);},
                complete: function(json){console.log(json);}
            })
        })
    })

    //修改处置项目
    $(document).on("click",".set_modify",function(){
        $(".set_mana_item2").show();
        $(".popup_bg").show();
        var HandleSetGUID=$(this).parent().attr("id");
        console.log(HandleSetGUID);
        //获取原数据
        $.ajax({
            type:"POST",
            url:"index.php?m=Handleset&a=update",
            dataType:"json",
            data:{
                HandleSetGUID:HandleSetGUID,
                ClinicUniqueID:ClinicUniqueID
            },
            beforeSend: function(){},
            success: function(json){
                console.log(json);
                $("#manage_num1").val(json.data[0].HandleCode);
                $("#manage_name1").val(json.data[0].HandleName);
                $("#manage_type1").val(json.data[0].FeeType);
                $("#manage_way1").val(json.data[0].HandlePrice);
                $("#specifications1").val(json.data[0].Uom);
                $("#set_rmark1").val(json.data[0].Remark);
            },
            error: function(json){console.log(json);},
            complete: function(json){console.log(json);}
        })
        //保存修改
        $("#set_create1").click(function(){
            if($('#fee_type1 option:selected').val()=="按牙齿数计算"){
                var BillType=0;
            }else if($('#fee_type1 option:selected').val()=="按全牙计算"){
                var BillType=1;
            }
            $.ajax({
                type:"POST",
                url:"index.php?m=Handleset&a=updateOk",
                dataType:"json",
                data:{
                    ClinicUniqueID:ClinicUniqueID,
                    HandleSetGUID:HandleSetGUID,
                    HandleCode:$("#manage_num1").val(),
                    HandleName:$("#manage_name1").val(),
                    chargeType:$("#manage_type1").val(),
                    BillType:BillType,
                    HandlePrice:$("#manage_way1").val(),
                    Uom:$("#specifications1").val(),
                    Remark:$("#set_rmark1").val(),
                    /*CalByVIP:0*/
                },
                beforeSend: function(){},
                success: function(json){
                    console.log(json);
                    if(json.code==1){
                        $(".set_mana_item2").hide();
                        $(".popup_bg").hide();
                        window.location.reload();
                    };
                },
                error: function(json){console.log(json);},
                complete: function(json){console.log(json);}
            })
        })
    })

    //Excel导出
    $("#postbtn").on('click',function(){
        console.log(1);
        $("#myForm").attr("action","index.php?m=Handleset&a=exportExcel&ClinicUniqueID="+ClinicUniqueID+"&DictionaryIdentity="+charge_dic_iden+"");
        $("#myForm").submit();

    });

    //Excel批量导入
    $(".excel_import").on("click",function(){
        $(".popup_bg").show();
        $(".excel_import1").show();

        $("#file_input").on("change",function(){
            //console.log(1);
            var filePath=$(this).val();
            //console.log(filePath);
            $("#file_path").html(filePath);
        })

        $("#up_file").on("click",function(){
            console.log("上传");
            $("#excel_post_import").submit();
            $("#excel_post_import").attr("action","index.php?m=Handleset&a=import&ClinicUniqueID="+ClinicUniqueID+"&DictionaryIdentity="+charge_dic_iden+"&DictionaryName="+charge_item_name+"");
            // $.ajax({
            //     type:"POST",
            //     url:"index.php?m=Handleset&a=import",
            //     dataType:"json",
            //     data:{
            //         ClinicUniqueID:ClinicUniqueID,
            //         DictionaryIdentity:charge_dic_iden,
            //         DictionaryName:charge_item_name
            //     },
            //     beforeSend: function(){},
            //     success: function(json){
            //         console.log(json);
            //     },
            //     error: function(json){console.log(json);},
            //     complete: function(json){console.log(json);}
            // })
        })
    })

    //关闭弹窗
    $(".clinic_edit img").click(function(){
        $(".set_mana_item").hide();
        $(".excel_import1").hide();
        $(".popup_bg").hide();
    })
})


