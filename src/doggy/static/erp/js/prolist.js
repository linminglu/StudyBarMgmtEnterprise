jQuery.createAniCss();
var pageApi=null,popApi1;
var pageobj={
    pageSize:10,
    pageNo:1,
    totalcount:-1    
};
$(function(){
    bind();
    datalist(pageobj);
})

function bind(){
    $("#BeginDate").yayigj_date_Sel({
        varType:"val"
    });
    $("#EndDate").yayigj_date_Sel({
        varType:"val"
    });
    //加载页面获取当天日期
    $("#BeginDate").getCurrday();
    $("#EndDate").getCurrday();
    $("#sendState").yayigj_downlist({
        _data:[
            {key:"全部",val:""},
            {key:"上架",val:"0"},
            {key:"下架",val:"1"},
        ]
    });
    $("#scroll_div_1").scroll(function(event) {	
        var head = $("#thead_1");
        if( $(this).scrollTop() >= 30 ){
            head.css('transform','translateY('+($(this).scrollTop())+'px)');				
        }else{
            head.css('transform','translateY('+(0)+'px)' );
        }			
	});
    $("#SelcBtn").on("click",function(){
        pageApi.filling(1);
        datalist(pageobj);
    });
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
}
//====================================
function datalist(pageobj){
    var s_time=$("#BeginDate").val();
    var e_time=$("#EndDate").val();
    s_time=new Date(s_time);
    e_time=new Date(e_time);
    if(s_time>e_time){
        jQuery.postFail("fadeInup","查询时间错误");
        return;
    };
    var parmas={
        "start_time":$("#BeginDate").val(), //开始时间
        "end_time":$("#EndDate").val(),//结束时间
        "per_page":pageobj.pageSize,//每页数量  int
        "page":pageobj.pageNo, //页码  int
        "condition":$("#condition").val(),//输入框条件 没有传空
        "platform":$("#sendState").attr("data-val"), // 状态 没有传空
        "totalcount":pageobj.totalcount,//总数，第一次传-1 int
    };
    jQuery.loading();
    $.post("/butlerp/product/GetProList",parmas,function(json){
        jQuery.loading_close();
        if(json.code==1){
            pageApi.ReSet(parseInt(json.totalcount),parseInt(json.pagesize));
            comdata(json.list);
        }else{
            jQuery.postFail("fadeInup",json.info);
        }
    })
}
function comdata(data){
    var html='<thead id="thead_1"><tr><th>产品名称</th><th>产品编号</th><th>平安编号</th><th>产品服务项</th><th>价格</th><th>操作</th></tr></thead><tbody>';
    if(!data){
        $("#PAlistPage").hide();
        html+='<tr class="no_data"><td colspan="8"></td></tr></tbody>';
    }else{
        $("#PAlistPage").show();
        $.each(data,function(k,v){
            var action="";
            var s1="<p><a href='/butlerp/product/ViewPro?id="+v.packageinfoid+"' target='_blank'>查看</a></p>";
            var s2="<p><a href='/butlerp/product/AddNewProTpl?id="+v.packageinfoid+"' target='_blank'>修改</a></p>";
            var s3="<p><a href='/butlerp/product/CliManage?id="+v.packageinfoid+"' target='_blank'>导入门诊</a></p>";
            var s4="<p><a href='javascript:;' onclick='delet(\""+v.packageinfoid+"\")'>删除</a></p>";
            var comboinfo="";
            $.each(v.handleinfo,function(key,val){
                comboinfo+="<p>"+val.handlename+"</p>";
                // $.each(val.handleinfo,function(m,n){
                //     comboinfo+="<p>"+n.handlename+"</p>";
                // });
               // comboinfo+="";
            });
            // '+(v.datastatus==1?"上架":"下架")+'
            html+='<tr>';
                // html+='<td>'+v.packagename+'</td><td>'+v.packageinfoid+'</td><td>'+v.suitobject+'</td><td><img src="'+v.packageicon+'"/></td>';
                // html+='<td><p>'+v.begintime+'</p><p>'+v.endtime+'</p></td><td>'+comboinfo+'</td><td>  </td>';
                // html+='<td>'+s1+s2+s3+'</td>';
                html+='<td>'+v.packagename+'</td><td>'+v.packageinfoid+'</td><td>'+v.paserialnum+'</td>';
                html+='<td>'+comboinfo+'</td><td>'+v.price+'</td>';
                html+='<td>'+s1+s2+s3+s4+'</td>';
            html+='</tr>';
        });
    }
    html+="</tbody>";
    $("#TableList").html(html);
}
function delet(id){
    jQuery.showDel('您确定是否删除?','删除提醒',
		function(){
			var parmas={
                "PackageInfoID":id
            };
            jQuery.loading();
            $.post("/butlerp/product/DelPro",parmas,function(json){
                jQuery.loading_close();
                if(json.code==1){
                    jQuery.postOk("fadeInup","删除成功!");
                    datalist(pageobj);
                }else{
                    jQuery.postFail("fadeInup",json.info);
                }
            });
			jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
		},
		function(){
			jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
		});		
}
