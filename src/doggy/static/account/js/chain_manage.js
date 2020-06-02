//2017-1-18 罗杨
jQuery.createAniCss();
var listApi=null;
var pageApi=null;
var swhereObj={
    pageno:1,
    pagesize:10,
    totalcount:-1
}
$(document).ready(function(){
    getclinicinfolist();//获取诊所列表
    $("#chainInfo input,#chainInfo textarea").attr("disabled",true);
    $("#tabManage li").on("click",function(){
        var index=$(this).index();
        $("#tabManage li[data-flag='1']").attr("data-flag","0");
        $(this).attr("data-flag","1");
        $("#h_content .tab_selct").eq(index).show().siblings(".tab_selct").hide();
        if(index==0){
            get_clinic_infolist();
            $(".r input[type='button']").hide();
            $("#addclinic").show();
        }
        if(index==1){
             //初始化
           load_data();
           $(".r input[type='button']").hide();
        }
        if(index==2){
            getchaininfo();
            $(".r input[type='button']").hide();
            $("#edit").show();
        };
    })
    $("#addclinic").on("click",function(){
        addclinic();
    })
    //保存连锁信息
    $("#saveEdit").on("click",function(){
        savechaininfo();
    });
    //编辑连锁信息
    $("#edit").on("click",function(){
        $(".r input[type='button']").hide();
        $("#saveEdit,#cancelEdit").show();
        $("#chainInfo input,#chainInfo textarea").attr("disabled",false);
    });
    //取消编辑
    $("#cancelEdit").on("click",function(){
        getchaininfo();
        $("#chainInfo input,#chainInfo textarea").attr("disabled",true);
        $("#edit").show();
        $("#saveEdit,#cancelEdit").hide();
    });
    $('#myPage').pagination({
        totalData:50,//总条数
        showData:10,//每页显示条数
        pageCount:20,//共多少页
        coping:true,
        count:2,
        jumpCallBack:jump,//跳转回调
        callback:function(index){
            swhereObj.pageno=index.getCurrent();//更改请求的当前页即可
            staffList(swhereObj);//点页码后的回调
        }
    },function(api){			
        pageApi=api;
    });
    $("#SelectList").on("click",function(){
        load_data();
    })
})
// ======================================================
function areaclick(){
    $("#chainprovince,#chaincity,#chainarea").on("click",function(){
        return false;
    })
}

//新增分店窗口
function addclinic(){
    $(".create_clinic_bg3").show();
}
// 判断权限
function savechaininfo(){
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
}
//保存连锁机构信息
function chainInfoSave(){
    if($("#chainNmae").val()==''){
        $("#chainNmae").css("border-color","#f86d5a");
        $("#clinic_err").css("visibility","visible");
        return false;
    }
    if($("#chaincontact").val()==''){
        $("#chaincontact").css("border-color","#f86d5a");
        $("#contact_err").css("visibility","visible");
        return false;
    }
    if($("#chainphone").val()==''){
        $("#chainphone").css("border-color","#f86d5a");
        $("#phone_err").css("visibility","visible");
        return false;
    }else if($("#chainphone").val().length<7){
        $("#chainphone").css("border-color","#f86d5a");
        $("#phone_err").html("诊所电话不能少于7位").css("visibility","visible");	
        return false;
    }else if(isNaN($("#chainphone").val())){
        $("#chainphone").css("border-color","#f86d5a");
        $("#phone_err").html("诊所电话请填写数字").css("visibility","visible");	
        return false;
    }
    var base64=$("#ImgChain").attr("src");//诊所logo
    var oneExt=$("#pic_ext_chain").val();
    if(oneExt==""){
        logo=base64;
    }else{
        logo=base64.substr(base64.indexOf(',') + 1);
    }
    $.ajax({
        type:"POST",
        url:"/clinic/savechaininfo",
        dataType:"json", 
        data:{
            logoimg:logo,
            mobile:$("#chainphone").val(),
            contact:$("#chaincontact").val(),
            chainname:$("#chainNmae").val(),
            province:$("#chainprovince").text(),
            city:$("#chaincity").text(),
            area:$("#chainarea").text(),
            address:$("#chainaddress").val(),
            info:$("#chaininfo").val()
        },       
        beforeSend: function(json){},
        error: function(json){
        },
        success: function(json){
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
//获取连锁信息
function getchaininfo(){
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
                $("#ImgChain").attr("src",""+json.list[0].logo+"");
            }
            $("#chainNmae").val(json.list[0].chainname);
            $("#chaincontact").val(json.list[0].contact);
            $("#chainphone").val(json.list[0].mobile);
            if(json.list[0].province!=""&&json.list[0].province!="省份"){
                $("#chainprovince").text(json.list[0].province);
                $("#chainprovince_down_list p").each(function(){   //激活城市选择
                    if($(this).text()==""+json.list[0].province+""){
                        $(this).trigger("click");
                    }
                })
                if(json.list[0].city!=""&&json.list[0].city!="城市"){
                    $("#chaincity").text(json.list[0].city);
                    $("#chaincity_down_list p").each(function(){   //激活地区选择
                        if($(this).text()==""+json.list[0].city+""){
                            $(this).trigger("click");
                        }
                    })
                }
                $("#chainarea").text(json.list[0].area);
            }else{
                $("#chainprovince").text("省份");
                $("#chaincity").text("城市");
                $("#chainarea").text("地区");
            }
            $("#chainaddress").val(json.list[0].address);
            $("#chaininfo").val(json.list[0].info);
            $("#chainsave").attr("disabled",true).addClass("ac_btn_bf_disable");
        },
        complete:function(){jQuery.loading_close();}
    })
}
/*初始化获取诊所列表*/
function getclinicinfolist(){
	$.ajax({
		type:"GET",
		url:"/clinic/getusergroupclinicinfo",
		dataType:"json",
		beforeSend: function(){
			jQuery.loading('加载中',1);
		},
		success:function(json){
			if(json.code==1){
				var clinicList=[];
				if(json.list.clinicinfo==null){
					clinicList.push({key:"暂无工作场所",val:""});
				}else{
					clinicList.push({key:"全部",val:"全部"});
						$.each(json.list.clinicinfo,function(k,v){
							clinicList.push({key:v.clinicname,val:v.clinicid});
						})
				}
				$("#ClincList").yayigj_downlist({
					_data:clinicList,
					},function(api){
						listApi=api;
					});
			}else{
				jQuery.showError(json.info,'信息反馈');
			}
		},
		error:function(json){
			jQuery.waring(json.info);	
		},
		complete:function(){
			jQuery.loading_close();
		}	
	})
}
//分页控件
function jump(params){
    swhereObj.pagesize=params;			//1-更改条件值
    swhereObj.pageno=1;
    staffList(swhereObj);				//2-重新请求第一页数据
    pageApi.reSetPageSize(params);		//3-调用api刷新页码信息
}
//初始化和重新加载
function load_data(){
    swhereObj.pageno=1;
    swhereObj.clinicid=$("#ClincList").attr("data-val");
    pageApi.filling(1);
    staffList(swhereObj);
}
//员工管理列表
function staffList(w_Obj){
    var parmas={
        clinicid:$("#ClincList").attr("data-val"),//诊所id
        per_page:w_Obj.pagesize,//每页数量
        page:w_Obj.pageno,//当前页
        totalcount:w_Obj.totalcount
    }
    $.ajax({                           
        type:"POST",
        url:"/clinicmember/linkemmanage",    //获取连锁机构信息
        dataType:"json",
        data:parmas,
        beforeSend:function(){
            jQuery.loading('加载中',1);
        },
        error:function(){},
        success:function(json){
         //  console.log(json);
           if(json.code==1){
               pageApi.ReSet(parseInt(json.totalcount),parseInt(json.pagesize));//重置记录数，页码及分页信息
               var str="";
               if(json.list){
                   $("#myPage").show();
                   $.each(json.list,function(k,v){
                       var s1='<img src="/static/account/img/sex_radios2.png" data-img="1" onclick="update(this,\''+v.chainuserguid+'\',\''+v.clinicuniqueid+'\',\''+v.doctorid+'\',\''+v.userid+'\',\''+v.chainid+'\')"/>';
                       var s2='<img src="/static/account/img/sex_radios.png" data-img="1" onclick="update(this,\''+v.chainuserguid+'\',\''+v.clinicuniqueid+'\',\''+v.doctorid+'\',\''+v.userid+'\',\''+v.chainid+'\')"/>';
                       var now_v="";
                        var v1='<input type="hidden" value="1">';
                        var v2='<input type="hidden" value="2">';    
                        var v0='<input type="hidden" value="0">';
                        //var s1='<input type="radio" name="tb'+(k+1)+' "checked="checked" onclick="update(this,\''+v.chainuserguid+'\',\''+v.clinicuniqueid+'\',\''+v.doctorid+'\',\''+v.userid+'\')" />';
                       // var s2='<input type="radio" name="tb'+(k+1)+'" onclick="update(this,\''+v.chainuserguid+'\',\''+v.clinicuniqueid+'\',\''+v.doctorid+'\',\''+v.userid+'\')"/>';
                        
                        str+='<tr><td>'+v.uname+'</td><td>'+v.clinicname+'</td><td>'+v.duty+'</td><td>'+(v.phone||v.mobile)+'</td>';
                        if(v.datastatus=="0"){
                            str+='<td>'+s2+v1+'</td><td>'+s2+v2+'</td><td>'+s2+v0+'</td>';
                        }else{
                            if(v.privileges=="1"){
                                str+='<td>'+s1+v1+'</td><td>'+s2+v2+'</td><td>'+s2+v0+'</td>'; 
                            }else if(v.privileges=="2"){
                                str+='<td>'+s2+v1+'</td><td>'+s1+v2+'</td><td>'+s2+v0+'</td>'; 
                            }else if(v.privileges=="0"){
                                str+='<td>'+s2+v1+'</td><td>'+s2+v2+'</td><td>'+s1+v0+'</td>'; 
                            }
                        };
                        if(v.privilegespat==1){
                            str+='<td>'+v0+'<img src="/static/account/img/checked.png" data-img="2" onclick="update(this,\''+v.chainuserguid+'\',\''+v.clinicuniqueid+'\',\''+v.doctorid+'\',\''+v.userid+'\',\''+v.chainid+'\')"></td>';
                        }else{
                            str+='<td>'+v0+'<img src="/static/account/img/checkbox.png" data-img="2" onclick="update(this,\''+v.chainuserguid+'\',\''+v.clinicuniqueid+'\',\''+v.doctorid+'\',\''+v.userid+'\',\''+v.chainid+'\')"></td>';
                        };
                        if(v.privilegesstat==1){
                            str+='<td>'+v0+'<img src="/static/account/img/checked.png" data-img="3" onclick="update(this,\''+v.chainuserguid+'\',\''+v.clinicuniqueid+'\',\''+v.doctorid+'\',\''+v.userid+'\',\''+v.chainid+'\')"></td>';
                        }else{
                            str+='<td>'+v0+'<img src="/static/account/img/checkbox.png" data-img="3" onclick="update(this,\''+v.chainuserguid+'\',\''+v.clinicuniqueid+'\',\''+v.doctorid+'\',\''+v.userid+'\',\''+v.chainid+'\')"></td>';
                        }
                        str+='</tr>';
                    });
                   
               }else{
                   $("#myPage").hide();
                   str+="<tr class='nodata'><td colspan='7'><img src='/static/market/img/member/nodata.png'></td></tr>";
               };
               $("#staffList").html(str);
           }
        },
        complete:function(){jQuery.loading_close();}
    })
}
// 点击更新权限
function update(obj,chainuserguid,clinicuniqueid,doctorid,userid,chainid){
    var type=$(obj).attr("data-img");
    var now_pr=$(obj).siblings("input[type='hidden']").val();
    console.log(now_pr)
    var parmas={
            type:type,
            chainuserguid:chainuserguid,//诊管理员标识所id
            chainid:chainid,
            clinicuniqueid:clinicuniqueid,//诊所id
            doctorid:doctorid,//医生id
            aduserid:userid,//用户id
            privileges:now_pr,//当前权限
    };
    $.ajax({ 
        type:"POST",
        url:"/clinicmember/upsertadmin",    //获取连锁机构信息
        dataType:"json",
        data:parmas,
        beforeSend:function(){jQuery.loading('加载中',1);},
        complete:function(){jQuery.loading_close();},
        success:function(json){
            if(json.code==1){
                staffList(swhereObj);
                // if($(obj).attr("data-img")==1){
                //     $(obj).attr("src","/static/account/img/sex_radios2.png").parents("tr").find("img[data-img='1']").attr("src","/static/account/img/sex_radios.png");
                // }else{
                //     $(obj).attr("src","/static/account/img/checked.png").parents("tr").find("img[data-img!='1']").attr("src","/static/account/img/checkbox.png");
                // }
                
            }else{
                jQuery.postFail("fadeInUp",json.info);
            }
        },
        error:function(){},
    })
}