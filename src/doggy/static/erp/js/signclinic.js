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
    // $("#BeginDate").yayigj_date_Sel({
    //     varType:"val"
    // });
    // $("#EndDate").yayigj_date_Sel({
    //     varType:"val"
    // });
    // //加载页面获取当天日期
    // $("#BeginDate").getCurrday();
    // $("#EndDate").getCurrday();

    $("#modifyPop").yayigj_pop_window({
		_coverOpacity:0.2,
        _titleAlign: 'center',
		_isShow:false,
        _fotBgnAlign:'center',
		_fotTopLine:'none',
		_close_callBackFunc:function(){
           
		},
		_zindex:14,					//层级
		_isAddCoverDiv:true	//是否自己生成背景遮挡层,zindex自动用_zindex-1,会随关闭按钮自动关闭
		},function(api){
			popApi1=api;
		});

    $("#sendState").yayigj_downlist({
        _data:[
            {key:"全部",val:""},
            {key:"验证失败",val:"0"},
            {key:"正常",val:"1"},
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
        // "start_time":$("#BeginDate").val(), //开始时间
        // "end_time":$("#EndDate").val(),//结束时间
        "per_page":pageobj.pageSize,//每页数量  int
        "page":pageobj.pageNo, //页码  int
        "condition":$("#condition").val(),//输入框条件 没有传空
        // "platform":$("#sendState").attr("data-val"), // 状态 没有传空
        "totalcount":pageobj.totalcount,//总数，第一次传-1 int
    };
    jQuery.loading();
    $.post("/butlerp/clinicaudit/signclinicdata",parmas,function(json){
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
    var html='<thead id="thead_1"><tr><th>门诊名称</th><th>管家号</th><th>平安检验ID</th><th>平安密钥</th><th>操作</th></tr></thead><tbody>';
    if(!data){
        $("#TablelistPage").hide();
        html+='<tr class="no_data"><td colspan="6"></td></tr></tbody>';
    }else{
        $("#TablelistPage").show();
        $.each(data,function(k,v){
            var action="";
            var s1="<p><a href='javascrip:;' onclick='showModify(\""+v.signid+"\",\""+v.partnerid+"\",\""+v.pakey+"\")'>修改</a></p>";
            html+='<tr>';
                html+='<td>'+v.clinicname+'</td><td>'+v.dentalid+'</td>';
                html+='<td>'+v.partnerid+'</td><td>'+v.pakey+'</td>';
                html+='<td>'+s1+'</td>';
            html+='</tr>';
        });
    }
    html+="</tbody>";
    $("#TableList").html(html);
}
function showModify(signid,id,key){
    popApi1.showPopwnd();
    $("#paID").val(id);
    $("#paKey").val(key);
    $("#SignID").val(signid);
}
function modify(){
    var signid=$("#SignID").val();
    if($.trim($("#paKey").val())==""){
        jQuery.postFail("fadeInup","请填写平安密钥");
        return;
    }
    if($.trim($("#paID").val())==""){
        jQuery.postFail("fadeInup","请填写平安ID");
        return;
    }
    jQuery.showDel('您确定是否修改?','修改提醒',
		function(){
			var parmas={
                "signid":signid,//签约id  
                "pakey":$("#paKey").val(), //平安key  
                "partnerid":$("#paID").val()//平安伙伴ID
            };
            jQuery.loading();
            $.post("/butlerp/clinicaudit/modifydata",parmas,function(json){
                jQuery.loading_close();
                if(json.code==1){
                    jQuery.postOk("fadeInup","修改成功!");
                    popApi1.closePopwnd();
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
function closeresign(){
    popApi1.closePopwnd();
}