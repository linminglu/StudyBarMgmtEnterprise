  	var pageApi=null;
	//默认查询条件
	var swhereObj={
		pagesize:10,
		page:1,
		totalcount:-1,
	};
	var College_revisit_comments = null;
$(function(){

   var classid = getUrlParam("classid");
   var play_num = getUrlParam("play_num");
   var comment = getUrlParam("comment");
   var num_type = getUrlParam("num_type");
   var establish = getUrlParam("establish");
   var big_type = getUrlParam("big_type");
   var up_url = getUrlParam("up_url");
   var up_peo = getUrlParam("up_peo");
   $('#play_num').text(play_num);
   $('#comment').text(comment);
   $('#num_type').text(num_type);
   $('#establish').text(establish);
   $('#type_big').html(big_type+'&nbsp;kb');
   $('#up_peo').text(up_peo);
   $('#radio_url').attr('src',up_url);

   function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r==null){
        return ""
      }
      return unescape(r[2]); //返回参数值
  }  
  //删除
  $(document).off('click','.delete').on('click','.delete',function(){
  	var commentid = $(this).parent().attr('data-id');
  	jQuery.showAsk('是否删除！','信息提醒',
                function(){
                    jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'}); 
                        $.ajax({
                          type:"post",
                          url:'/butlerp/college/weclassdetaildel',
                          dataType:"json",
                          data:{
									"commentid":commentid
								},
                          beforeSend:function(){  
                                  jQuery.loading('',-1);
                          },
                          complete: function(data){jQuery.loading_close(-1);},
                          success: function(json){
                                if(json.code==1){
                                  gotoPage(swhereObj)
                                }
                          }
                    })
        },
        function(){
            jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
        }
    )
  })
  //  回复  
  $(document).off('click','.reply').on('click','.reply',function(){
  	var commentid = $(this).parent().attr('data-id');
  	microreply(commentid)
  })
   //点击出现微课堂回复弹窗
	function microreply(commentid){
      College_revisit_comments =jQuery.yayigjCollege_revisit_comments({UrlParam:'&commentid='+commentid+'',title:'回访评论',_titleAlign:"center",callbackfunc:function(params){
      	gotoPage(swhereObj)
      }}); 
    }
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
			"classid":classid,
			totalcount:w_Obj.totalcount,
			page:w_Obj.page,
			per_page:w_Obj.pagesize
		}
		$.ajax({
			type:"post",
			url:"/butlerp/college/weclassdetaildata",
			dataType:"json",
			data:dataParameter,
		})
		.done(function(data){
			console.log(data);
			$("body").find(".loading").remove();
            getjson(data)
			 pageApi.ReSet(parseInt(data.totalcount),parseInt(data.pagesize));//重置记录数，页码及分页信息
			 if(parseInt(data.totalcount)>0){
			 	$("#pager_micro").show();
			 }else{
			 	$("#pager_micro").hide();
			 }
			// var html='';
			
		})
		.fail(function(){
			console.log("error");
		});
	}
	function getjson(json){
		var hot_see = '';
		var new_see = '';
		var hot_ = '<div class="hot_see">最热评论</div>';
		var new_ = '<div class="hot_see">最新评论</div>';
		$(json.list.hot).each(function(k,v){
			var commentinfo = v.commentinfo;
			var _commentinfo = replace_em(commentinfo);
			if (v.reply) {
				var reply_commentdate = v.reply[0].commentinfo;
				var _reply_commentdate = replace_em(reply_commentdate);
			}
			hot_see+='<div class="message">'+
			            '<div class="message_img"><img src="'+v.picture+'"></div>'+
			            '<div class="message_comment">'+
			                '<div class="message_title">'+
			                    '<div class="title_left">'+
			                       '<p>'+v.nickname+'</p>'+
			                       '<p>'+v.commentdate+'</p>'+
			                    '</div>'+
			                    '<div class="title_right" data-id="'+v.commentid+'">'+
			                       '<span class="zan">'+v.likenum+'<i></i></span>'
			                       if (v.datastatus ==0) {
			                            hot_see+=   '<span class="delete">删除</span>'
			                       }else{
			                       	    hot_see+=   '<span class="reply">回复</span><span class="delete">删除</span>'
			                       }
			        hot_see+=   '</div>'+
			                    '<div class="clear"></div>'+
			                '</div>'+
			                '<div class="comment_info">'+_commentinfo+'</div>'
			if (v.reply) {
				    	hot_see+='<div class="author">'+
			                        '<div class="title_left">'+
				                       '<p>作者回复</p>'+
				                       '<p>'+v.reply[0].commentdate+'</p>'+
				                    '</div>'+
				                    '<div class="title_right" data-id="'+v.reply[0].commentid+'" style="padding-right: 61px">'+
				                       '<span class="delete" style="width:100%;text-align:right;">删除回复</span>'+
				                    '</div>'+
				                    '<div class="clear"></div>'+
				                    '<div class="author_huifu">'+_reply_commentdate+'</div>'+
				                '</div>'
			        }
			hot_see+=   '   </div>'+  
			            '<div class="clear"></div>'+
			        '</div>'
		})
		$(json.list.news).each(function(k,v){
			var commentinfo = v.commentinfo;
			var _commentinfo = replace_em(commentinfo);
			if (v.reply) {
				var reply_commentdate = v.reply[0].commentinfo;
				var _reply_commentdate = replace_em(reply_commentdate);
			}
			new_see+='<div class="message">'+
			            '<div class="message_img"><img src="'+v.picture+'"></div>'+
			            '<div class="message_comment">'+
			                '<div class="message_title">'+
			                    '<div class="title_left">'+
			                       '<p>'+v.nickname+'</p>'+
			                       '<p>'+v.commentdate+'</p>'+
			                    '</div>'+
			                    '<div class="title_right" data-id="'+v.commentid+'">'+
			                       '<span class="zan">'+v.likenum+'<i></i></span>'
			                       if (v.datastatus ==0) {
			                            new_see+=   '<span class="delete">删除</span>'
			                       }else{
			                       	    new_see+=   '<span class="reply">回复</span><span class="delete">删除</span>'
			                       }
			            new_see+='</div>'+
			                    '<div class="clear"></div>'+
			                '</div>'+
			                '<div class="comment_info">'+_commentinfo+'</div>'
			if (v.reply) {
				    	new_see+='<div class="author">'+
			                        '<div class="title_left">'+
				                       '<p>作者回复</p>'+
				                       '<p>'+v.reply[0].commentdate+'</p>'+
				                    '</div>'+
				                    '<div class="title_right" data-id="'+v.reply[0].commentid+'">'+
				                       '<span class="delete">删除回复</span>'+
				                    '</div>'+
				                    '<div class="clear"></div>'+
				                    '<div class="author_huifu">'+_reply_commentdate+'</div>'+
				                '</div>'
			        }
			new_see+=   '   </div>'+  
			            '<div class="clear"></div>'+
			        '</div>'
		})
		$('#hot_see').html(hot_+hot_see);
		$('#new_see').html(new_+new_see);
	}

function replace_em(str){

	str = str.replace(/\</g,'&lt;');

	str = str.replace(/\>/g,'&gt;');

	str = str.replace(/\n/g,'<br/>');

	str = str.replace(/\[em_([0-9]*)\]/g,'<img src="/static/erp/college/img/arclist/$1.gif" border="0" />');

	return str;

}
	gotoPage(swhereObj)
})