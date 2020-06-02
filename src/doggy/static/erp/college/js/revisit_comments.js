var commentid = getUrlParam("commentid");
console.log(commentid);
$(function(){

	function getUrlParam(name) {
	      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	      if (r==null){
	        return ""
	      }
	      return unescape(r[2]); //返回参数值
	  }

	$('.emotion').qqFace({

		id : 'facebox', 

		assign:'saytext', 

		path:'/static/erp/college/img/arclist/'	//表情存放的路径

	});

	$(".sub_btn").click(function(){

		var str = $("#saytext").val();

		$("#show").html(replace_em(str));

	});

});

//查看结果

function replace_em(str){

	str = str.replace(/\</g,'&lt;');

	str = str.replace(/\>/g,'&gt;');

	str = str.replace(/\n/g,'<br/>');

	str = str.replace(/\[em_([0-9]*)\]/g,'<img src="/static/erp/college/img/arclist/$1.gif" border="0" />');

	return str;

}

$('#fillBtn_set').off('click').on('click',function(){
	var obj ={
		"commentid":commentid,
		"commentinfo":$('#saytext').val()
	}
	if ($('#saytext').val().length =='') {
		jQuery.postFail('fadeInUp','评论内容不能为空');
		return false;
	}
    $.ajax({
			type:"post",
			url:"/butlerp/college/weclassdetailcomment",
			dataType:"json",
			data:obj,
	})
	.done(function(data){
            NoticeFather(1);
		})
	.fail(function(){
			console.log("error");
		});
});

$('#cancelBtn_set').off('click').on('click',function(){
	NoticeFather(0);
})

function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r==null){
        return ""
      }
      return unescape(r[2]); //返回参数值
  }  

function NoticeFather(para,pobj){
    if(para==0){
        parent.College_revisit_comments.close_pop_wnd({"code":para,"info":pobj});
    }else{
        parent.College_revisit_comments.close_pop_wnd({"code":para,"info":pobj});
    }
}