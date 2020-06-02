jQuery.createAniCss();
var pageApi=null,popApi1;
var pageobj={
    pageSize:10,
    pageNo:1,
    totalcount:-1    
};
var id=getUrlParam("id");
$(function(){
    bind();
    datalist(pageobj);
})

function bind(){
    $("#SelcBtn").on("click",function(){
        pageApi.filling(1);
        datalist(pageobj);
    });
    $("#BeginDate").yayigj_date_Sel({
        varType:"val"
    });
    $("#EndDate").yayigj_date_Sel({
        varType:"val"
    });
    $("#sendState").yayigj_downlist({
        _data:[
            {key:"全部",val:""}
        ]
    })
    //加载页面获取当天日期
    $("#BeginDate").getCurrday();
    $("#EndDate").getCurrday();
    $("#TablelistPage").pagination({
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
    $("#BatchRemove").on("click",function(){
        removeAllClinic();
    });
    //添加门诊
    $("#clinciPop").yayigj_pop_window({
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
    $("#BatchAdd").on("click",function(){
        popApi1.showPopwnd();
        datalistClinic();
    })
}
//====================================
function datalist(pageobj){
    var parmas={
        "begintime":$("#BeginDate").val(),//开始时间
        "endtime":$("#EndDate").val(),//结束时间
        "condition":$("#condition").val(), //输入框条件 没有传空,
        "perpage":pageobj.pageSize,//每页数量  int
        "page":pageobj.pageNo, //页码  int
        "totalcount":pageobj.totalcount,//总数，第一次传-1 int
    };
    jQuery.loading();
    $.post("/butlerp/product/getclinicpro",parmas,function(json){
        jQuery.loading_close();
        if(json.code==1){
            pageApi.ReSet(parseInt(json.totalcount),parseInt(json.pagesize));
            comdata(json.list);
        }else{
            jQuery.postFail("fadeInup",json.info);
        }
    })
}
//  0表示临时保存;1表示待审核;2表示审核中;3表示审核失败  ;4表示审核成功;只有0和3两种状态，(未签约).5已签约
function comdata(data){
    var html='<thead id="thead_1"><tr><th style="text-align:left">签约时间</th><th>门诊名称</th><th>管家号</th><th>门诊星级</th><th>门诊地址</th><th>操作</th>/tr></thead><tbody>';
    if(!data){
        $("#TablelistPage").hide();
        html+='<tr class="no_data"><td colspan="6"></td></tr></tbody>';
    }else{
        $("#TablelistPage").show();
        $.each(data,function(k,v){
            html+='<tr>';
                html+='<td style="text-align:left">'+v.startdate+'</td><td>'+v.clinicname+'</td><td>'+v.dentalid+'</td><td>'+v.starrating+'</td><td><p>'+v.province+v.city+v.area+'</p><p>'+v.address+'</p></td><td><a href="/butlerp/product/clinicprodetail?signid='+v.signid+'&cid='+v.clinicid+'">查看</a></td>';
            html+='</tr>';
        });
    }
    html+="</tbody>";
    $("#TableList").html(html);
}
//移除单个诊所
function removeClinic(dentalid,clinicid,clinicname){
    jQuery.showDel('确定移除门诊?','删除提醒',
		function(){
            var parmas={
                "PackageInfoID":id,//包id
                "Clinicids": [
                    {
                    "clinicid": clinicid,//诊所id
                    "clinicname": clinicname,//诊所名称
                    "dentalid": dentalid//管家号
                    },
                ]
            }
            jQuery.loading();
            $.post("/butlerp/product/DelRelation",parmas,function(json){
                jQuery.loading_close();
                if(json.code==1){
                    datalist(pageobj);
                }else{
                    jQuery.postFail("fadeInup",json.info);
                }
            })
            jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
        },function(){
            jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
        })
}
//移除所有诊所
function removeAllClinic(){
    if($("#TableList").find("input[type='checkbox']:checked").length==0){
        jQuery.postFail("fadeInup","请选择诊所");
        return;
    }
    jQuery.showDel('确定移除所选门诊?','删除提醒',
		function(){
			var parmas={
                "PackageInfoID":id,//包id
            };
            var Clinicids=[];
            $("#TableList").find("input[type='checkbox']:checked").each(function(index,el){
                var obj={
                    dentalid:$(this).attr("data-denid"),
                    clinicname:$(this).attr("data-cname"),
                    clinicid:$(this).attr("data-cid"),
                };
                Clinicids.push(obj);
            });
            parmas.Clinicids=Clinicids;
            jQuery.loading();
            $.post("/butlerp/product/DelRelation",parmas,function(json){
                jQuery.loading_close();
                if(json.code==1){
                    datalist(pageobj);
                }else{
                    jQuery.postFail("fadeInup",json.info);
                }
            })
			jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
		},
		function(){
			jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
		});	
}
///
function datalistClinic(){
    var parmas={
        "condition":$("#conditionClinic").val(), //输入框条件 没有传空,
        "PackageInfoID":id, //包id
        // "per_page":pageobj.pageSize,//每页数量  int
        // "page":pageobj.pageNo, //页码  int
        // "totalcount":pageobj.totalcount,//总数，第一次传-1 int
    };
    jQuery.loading();
    $.post("/butlerp/product/CliAndProNoRelation",parmas,function(json){
        jQuery.loading_close();
        if(json.code==1){
          //  pageApi.ReSet(parseInt(json.totalcount),parseInt(json.pagesize));
            comdataClinic(json.list);
        }else{
            jQuery.postFail("fadeInup",json.info);
        }
    })
}

function comdataClinic(data){
    var html='<thead id="thead_1"><tr><th> </th><th>序号</th><th>管家号</th><th>门诊名称</th>/tr></thead><tbody>';
    if(!data){
       // $("#TablelistPage").hide();
        html+='<tr class="no_data"><td colspan="4"></td></tr></tbody>';
    }else{
       // $("#TablelistPage").show();
        $.each(data,function(k,v){
            k=(k+1)<10?"0"+(k+1):(k+1);
            html+='<tr>';
                html+='<td><input type="checkbox" data-denid="'+v.dentalid+'" data-cid="'+v.clinicid+'" data-cname="'+v.clinicname+'" /></td><td>'+k+'</td><td>'+v.dentalid+'</td><td>'+v.clinicname+'</td>';
            html+='</tr>';
        });
    }
    html+="</tbody>";
    $("#clinciTable").html(html);
}
function closeCofrmPop(){
    popApi1.closePopwnd(); 
}
///添加所选择的诊所
function addAllClinic(){
    if($("#clinciTable").find("input[type='checkbox']:checked").length==0){
        jQuery.postFail("fadeInup","未选择诊所");
        return;
    }
    var parmas={
                "PackageInfoID":id,//包id
            };
    var Clinicids=[];
    $("#clinciTable").find("input[type='checkbox']:checked").each(function(index,el){
        var obj={
            dentalid:$(this).attr("data-denid"),
            clinicname:$(this).attr("data-cname"),
            clinicid:$(this).attr("data-cid"),
        };
        Clinicids.push(obj);
    });
    parmas.Clinicids=Clinicids;
    jQuery.loading();
    $.post("/butlerp/product/AddRelation",parmas,function(json){
        jQuery.loading_close();
        if(json.code==1){
            datalistClinic();
            datalist(pageobj);
            jQuery.postOk("fadeInup","添加成功!");
        }else{
            jQuery.postFail("fadeInup",json.info);
        }
    })
}