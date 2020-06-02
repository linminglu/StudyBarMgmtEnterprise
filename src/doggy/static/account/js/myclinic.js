/*===============================
    罗杨2016-21-28
==================================*/ 
//获取诊所列表
jQuery.createAniCss();
cliniclist();
function cliniclist(){
    $.ajax({
        type:"POST",
        url:"/member/mycliniclist",
        dataType:"json",
        beforeSend:function(){
             jQuery.loading('加载中',1);
             $("#Creat").html("");
             $("#Join").html("");
        },
        complete:function(){
             jQuery.loading_close();
        },
        success:function(json){
            var create=0;
            var join=0;
            var data=json.list;
            var li_no="";
            if(json.code==1){
               $.each(data,function(index,ele){
                   var li="";
                        li+='<div class="clinic">'
                            li+='<li class="item_info">'; 
                                if(ele.datastatus==1){
                                    if(ele.logo==""){
                                        li+='<img class="clogo" src="/static/account/img/multiple.png" alt="企业默认logo"  width="70" height="70">';
                                    }else{
                                        li+='<img class="clogo" src="'+ele.logo+'" alt="企业logo"  width="70" height="70">';
                                    }
                                        li+='<p class="cname">'+ele.chainname+'</p>';
                                }else{
                                    if(ele.picture==""){
                                        li+='<img class="clogo" src="/static/account/img/multiple.png" alt="企业默认logo"  width="70" height="70">';
                                    }else{
                                        li+='<img class="clogo" src="'+ele.picture+'" alt="企业logo"  width="70" height="70">';
                                    }
                                        li+='<p class="cname">'+ele.name+'</p>';
                                        li+='<p class="cnum">管家号：'+ele.dentalid+'</p>';
                                }  
                            li+='</li>';
                                if(ele.defaulttype==1){
                                    li+='<input type="button" value="当前显示" class="defalut_s">';
                                }else{
                                    li+='<input type="button" value="设置为默认显示" class="current_s"  onClick="setdefalut(this)" data-cid='+ele.clinicid+'>';
                            }
                       li+='</div>';
                     if(ele.mark==1){
                        create+=1;
                         $("#Creat").append(li);
                     }else{
                         join+=1;
                         $("#Join").append(li);
                     }
                     isLoadSuc();
               })   
              if(create==0){
                    li_no+='<li class="no_info">';
                    li_no+='<img src="/static/account/img/no_creat.png" alt="">';
                    li_no+='<p class="no_clinic">尚未创建诊所</p></li>' ;
                    $("#Creat").html(li_no);
                }
                if(join==0){
                    li_no+='<li class="no_info">';
                    li_no+='<img src="/static/account/img/no_creat.png" alt="">';
                    li_no+='<p class="no_clinic">尚未加入诊所</p></li>' ;
                    $("#Join").html(li_no);
                }
            }
        },
        error:function(){

        },
    })
}

function setdefalut(obj){
    var cid=$(obj).attr("data-cid");
    var parmas={};
    parmas={clinicid:cid};
    $.ajax({
        type:"POST",
        url:"/member/setdefaultclinic",
        dataType:"json",
        data:parmas,
        beforeSend:function(){
            jQuery.loading('加载中',1);
        },
        complete:function(){
            jQuery.loading_close();
        },
        success:function(json){
            if(json.code==1){
               cliniclist();
            }else{
                jQuery.showError(json.info,'信息反馈');
            }
        },
        error:function(json){
            jQuery.showError(json.info,'信息反馈');
        },
    })
}
function isLoadSuc(){
    $("#useNo .clogo").each(function(){
        var img = $(this);    
            img.error(function() { 
                $(this).attr("src","/static/account/img/multiple.png");
                //可以选择替换图片  
            });  
    });
}