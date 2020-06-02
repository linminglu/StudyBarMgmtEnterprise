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
    // $("#BeginDate").getCurrday();
    valDays("BeginDate",-7);
    $("#EndDate").getCurrday();
    $("#sendState").yayigj_downlist({
        _data:[
            {key:"全部",val:""},
            {key:"正在核销",val:"0"},
            {key:"核销成功",val:"1"},
            {key:"核销失败",val:"2"},
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
    $("#PAlistPage").pagination({
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
        "begintime":$("#BeginDate").val(), //开始时间
        "endtime":$("#EndDate").val(),//结束时间
        "perpage":pageobj.pageSize,//每页数量  int
        "page":pageobj.pageNo, //页码  int
        "condition":$("#condition").val(),//输入框条件 没有传空
        "status":$("#sendState").attr("data-val"), // 状态 没有传空
        "totalcount":pageobj.totalcount,//总数，第一次传-1 int
    };
    jQuery.loading();
    $.post("/butlerp/product/consumedata",parmas,function(json){
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
    var html='<thead id="thead_1"><tr><th>门诊名称和ID</th><th>患者名字和ID</th><th>电话</th><th>平安码</th><th>平安码使用状态</th><th>错误信息</th><th>产品ID</th><th>平安服务包名称和ID</th><th>核销时间</th></tr></thead><tbody>';
    if(!data){
        $("#PAlistPage").hide();
        html+='<tr class="no_data"><td colspan="8"></td></tr></tbody>';
    }else{
        $("#PAlistPage").show();
        $.each(data,function(k,v){
    //         var action="";
    //     "packagecodeid": string,//主键ID
    //   "scheduleid"string,//预约ID
    //   "clinicid": string,//诊所ID  (显示)
    //   "clinicname":string//诊所名  (显示)
    //   "customerid": string//患者ID  (显示)
    //   "customername":string//患者名字 (显示)
    //   "customerphone":string//患者电话  (显示)
    //   "code":string//平安码  (显示)
    //   "status":string//平安码使用状态 0表示待处理 1表示验证ok, 100表示菲森内部错误  1000表示平安错误  (显示)
    //   "msg":string//错误信息  (显示)
    //   "packageinfoid":string//产品id  (显示)
    //   "serveid":string//平安服务包ID (显示)
    //   "servename":string//平安服务名 (显示)
    //   "updatetime":string//核销时间 (显示)
    //   "datastatus":int//状态
      switch(v.status){
          case "0":
            v.status="待处理";
          break;
          case "1":
            v.status="验证成功";
          break;
          case "100":
            v.status="菲森内部错误";
          break;
          case "1000":
            v.status="平安错误";
          break;
      };
            html+='<tr>';
                html+='<td><p>'+v.clinicname+'</p><p>'+v.clinicid+'</p></td><td><p>'+v.customername+'</p><p>'+v.customerid+'</p></td><td><p>'+v.customerphone+'</p></td>';
                html+='<td>'+v.code+'</td><td>'+v.status+'</td><td>'+v.msg+'</td>';
                html+='<td><p>'+v.packageinfoid+'</p></td><td><p>'+v.servename+'</p><p>'+v.serveid+'</p></td>';
                html+='<td>'+v.updatetime+'</td>';
            html+='</tr>';
        });
    }
    html+="</tbody>";
    $("#TableList").html(html);
}

