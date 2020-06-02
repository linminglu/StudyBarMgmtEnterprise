var College_add_micro = null;
$(function(){
	$("#js_userlist_data").off("click",'.QR_code').on("click",".QR_code",function(){
		var pos=$(this).offset();
		var H=$(window).height()-70;
		var classid = $(this).parent().parent().attr('data-id');
		$("#open_code").removeClass('codeup');
		if (H-450>pos.top) {
			$("#open_code").css({"left":pos.left-390,"top":pos.top+30}).show();
		}else{
			$("#open_code").css({"left":pos.left-390,"top":pos.top-350}).show();
			$("#open_code").addClass('codeup');
		}
		codeinfo(classid);
	})
	$("#scroll_div_1").scroll(function(event) {	
        var head = $("#thead_1");
        if( $(this).scrollTop() >= 30 ){
            head.css('transform','translateY('+($(this).scrollTop())+'px)');				
        }else{
            head.css('transform','translateY('+(0)+'px)' );
        }			
	});
    //添加
	$('#add_micro').off('click').on('click',function(){
		add_micro("","","");
	})
    //修改
	$(document).off('click','.modify').on('click','.modify',function(){
		var classid = $(this).parent().parent().attr('data-id');
		var classtitle = $(this).parent().parent().find('td:eq(1)').attr('data-val');
		var classtype = $(this).parent().parent().find('td:eq(2)').text();
		add_micro(classid,classtitle,classtype)
	});
	$('#cope_address').off('click').on('click',function(){
		jsCopy();
	})
	//查看
	$(document).off('click','.see').on('click','.see',function(){
		var classid = $(this).parent().parent().attr('data-id');
		var play_num = $(this).parent().parent().find('td:eq(3)').text();
		var comment = $(this).parent().parent().find('td:eq(4)').text();
		var num_type = $(this).parent().parent().find('td:eq(2)').text();
		var big_type = $(this).parent().parent().find('td:eq(2)').attr('data-id');
		var establish = $(this).parent().parent().find('td:eq(0)').text();
		var up_url = $(this).parent().parent().find('td:eq(0)').attr('data-id');
		var up_peo = $(this).parent().parent().attr('data-val');
		location.href="/butlerp/college/weclassdetailpage?classid="+escape(classid)+"&play_num="+escape(play_num)+"&comment="+escape(comment)+"&num_type="+escape(num_type)+"&establish="+escape(establish)+"&big_type="+escape(big_type)+"&up_url="+escape(up_url)+"&up_peo="+escape(up_peo); 
	})
    //删除，下架
    $(document).off('click','.delete,.shelf').on('click','.delete,.shelf,.up_shelf',function(){
    	var classid = $(this).parent().parent().attr('data-id');
    	switch($(this).attr("class")){
    		case "delete":
                jQuery.showAsk('是否删除！','信息提醒',
                function(){
                      jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'}); 
                      $.ajax({
                          type:"post",
                          url:'/butlerp/college/weclassdel',
                          dataType:"json",
                          data:{
                              "classid":classid      //课程ID
                          },
                          beforeSend:function(){  
                                  jQuery.loading('',-1);
                          },
                          complete: function(data){jQuery.loading_close(-1);},
                          success: function(json){
                                if(json.code==1){
                                  gotoPage(swhereObj);
                                }
                          }
			            })
			        },
			        function(){
			            jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
			        }
			    );
                break;
            case "shelf":
                jQuery.showAsk('是否下架！','信息提醒',
                function(){
                      jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'}); 
                      $.ajax({
                          type:"post",
                          url:'/butlerp/college/weclassopen',
                          dataType:"json",
                          data:{
                              "classid":classid,      //课程ID
                              "dispark":0
                          },
                          beforeSend:function(){  
                                  jQuery.loading('',-1);
                          },
                          complete: function(data){jQuery.loading_close(-1);},
                          success: function(json){
                                if(json.code==1){
                                  gotoPage(swhereObj);
                                }
                           }
			           })
			        },
			        function(){
			            jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
			        }
			    );
                break;
            case "up_shelf":
                jQuery.showAsk('是否上架！','信息提醒',
                function(){
                      jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'}); 
                      $.ajax({
                          type:"post",
                          url:'/butlerp/college/weclassopen',
                          dataType:"json",
                          data:{
                              "classid":classid,      //课程ID
                              "dispark":1
                          },
                          beforeSend:function(){  
                                  jQuery.loading('',-1);
                          },
                          complete: function(data){jQuery.loading_close(-1);},
                          success: function(json){
                                if(json.code==1){
                                  gotoPage(swhereObj);
                                }
                           }
			           })
			        },
			        function(){
			            jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
			        }
			    );
                break;
    	}
    })
	// $('#import').off('click').on('click',function(){
	// 	college_import()
	// })

function codeinfo(classid){
	$.ajax({
          type:"post",
          url:'/butlerp/college/qrcode',
          dataType:"json",
          data:{
              "classid":classid,      //课程ID
          },
          beforeSend:function(){  
                  jQuery.loading('',-1);
          },
          complete: function(data){jQuery.loading_close(-1);},
          success: function(json){
                if(json.code==1){
                  $('#see_addres').val(json.list.url);
                  $('#see_img').attr('src',json.list.url);
                }
           }
       })
}

//复制 
    function jsCopy(){ 
        var e=document.getElementById("see_addres");//对象是see_addres
        e.select(); //选择对象 
        document.execCommand("Copy"); //执行浏览器复制命令

       alert("已复制好，可贴粘。"); 
    }

    //点击出现添加微课堂弹窗
	function add_micro(classid,classtitle,classtype){
      College_add_micro =jQuery.yayigjCollege_add_micro({UrlParam:'&classid='+escape(classid)+'&classtitle='+escape(classtitle)+'&classtype='+escape(classtype)+'',title:'添加课程',_titleAlign:"center",callbackfunc:function(params){
      	gotoPage(swhereObj)
      }}); 
    }
    
    $('#cancelBtn_set').off('click').on('click',function(){
    	$('#open_code').hide();
    })

	var pageApi=null;
	//默认查询条件
	var swhereObj={
		pagesize:10,
		page:1,
		totalcount:-1,
		val:$("#search_val").val()
	};
	// 分页插件绑定
	$('#pager_micro').pagination({
		totalData:50,//总条数
		showData:20,//每页显示条数
		pageCount:20,//共多少页
		coping:true,
		count:2,
		jumpCallBack:jump,//跳转回调
		callback:function(index){
			swhereObj.page=index.getCurrent();//更改请求的当前页即可
			gotoPage(swhereObj);//点页码后的回调
		}
	},function(api){			
		pageApi=api;
	});
	
	function jump(params){
		swhereObj.pagesize=params;			//1-更改条件值
		gotoPage(swhereObj);				//2-重新请求第一页数据
		pageApi.reSetPageSize(params);		//3-调用api刷新页码信息
	}	

	function gotoPage(w_Obj){
		$("body").prepend("<div class='loading'></div>");
		var dataParameter = {
			condition:w_Obj.val,
			//totalcount:-1,
			totalcount:w_Obj.totalcount,
			page:w_Obj.page,
			per_page:w_Obj.pagesize
		}
		$.ajax({
			type:"post",
			url:"/butlerp/college/weclassdata",
			dataType:"json",
			data:dataParameter,
		})
		.done(function(data){
			console.log(data);
			$("body").find(".loading").remove();
			pageApi.ReSet(parseInt(data.totalcount),parseInt(data.pagesize));//重置记录数，页码及分页信息
			if(parseInt(data.totalcount)>0){
				$("#pager_micro").show();
			}
			var html='';
			html+='<thead id="thead_1"><tr>';
				html+='<th align="left" style="width:16%;">时间</th>';
				html+='<th align="left" style="width:11%;">标题</th>';
				html+='<th align="left" style="width:14%;">类型</th>';
				html+='<th align="left" style="width:10%;">播放数</th>';
				html+='<th align="left" style="width:10%;">评论数</th>';
				html+='<th align="left" style="width:10%;">状态</th>';
				html+='<th align="left">操作</th>';
			html+='</tr></tead><tbody>';
			if(data.list==null){
				html+='<tr class="no_data">';
					html+='<td colspan="12"></td>';
				html+='</tr></tbody>';
				$("#pager_micro").hide();//隐藏分页
			}else{
				$(data.list).each(function(index,el){
					html+='<tr data-id="'+el.classid+'" data-val="'+el.likenum+'">';
						html+='<td align="left" data-id="'+el.url+'">'+el.createdate+'</td>';
						html+='<td align="left" data-val="'+el.classtitle+'">'+el.classtitle+'</td>';
						html+='<td align="left" data-id="'+el.filesize+'">'+el.classtype+'</td>';
						html+='<td align="left">'+el.playnum+'</td>';
						html+='<td align="left">'+el.commentnum+'</td>';
					if (el.dispark==0) {
						html+='<td align="left">下架</td>';
					}else{
						html+='<td align="left">上架</td>';
					}
					if (el.dispark ==1) {
						html+='<td align="left"><span class="QR_code">&nbsp;</span><span class="see">查看</span><span class="modify">修改</span><span class="shelf">下架</span><span class="delete">删除</span></td>';
					}else{
						html+='<td align="left"><span class="QR_code">&nbsp;</span><span class="see">查看</span><span class="modify">修改</span><span class="up_shelf">上架</span><span class="delete">删除</span></td>';
					}
					html+='</tr>';
				});
				html+='</tbody>';
			}
			$("#js_userlist_data").empty().prepend(html);
		})
		.fail(function(){
			console.log("error");
		});
	}
	//查询,默认加载一次
	$("#search_bun").off('click').on('click',function(){
		swhereObj.val=$("#search_val").val();
		//重置当前页
		swhereObj.page=1;
		pageApi.filling(1);
		gotoPage(swhereObj);
	}).trigger('click');
	//gotoPage(swhereObj)
});