$(function(){
	jQuery.createAniCss();
	var obj ={}

    //聚焦验证手机号
    jQuery("#add_tele").off("blur").on("blur", function(event) {
    	var from_tel = jQuery("#add_tele").val();
		var expr = /^1[3,5,7,8]\d{9}$/;
        if (!expr.test(from_tel) || from_tel.length == "") {
          $('#tele_error').html("你输入的手机号错误");   
          jQuery("#add_tele").css('border','1px solid red')
          return false;                         
        }
    })
    .on("focus",function(){
        $('#tele_error').html("");
        jQuery("#add_tele").css('border','')
    });
    //聚焦验证用户名
    jQuery("#add_user").off("blur").on("blur", function(event) {
    	var from_name = jQuery("#add_user").val();
        if (from_name.length == "") {
          $('#name_error').html("姓名不能为空");   
          jQuery("#add_user").css('border','1px solid red')
          return false;                         
        }
    })
    .on("focus",function(){
        $('#name_error').html("");
        jQuery("#add_user").css('border','')
    });

    //提交
	$('#fillBtn_set').off('click').on('click',function(){
		var from_tel = jQuery("#add_tele").val();
		var from_name = jQuery("#add_user").val();
		var expr = /^1[3,5,7,8]\d{9}$/;
        if (!expr.test(from_tel) || from_tel.length == "") {
          $('#tele_error').html("你输入的手机号错误");   
          jQuery("#add_tele").css('border','1px solid red')
          return false;                         
        }
        if (from_name.length == "") {
          $('#name_error').html("姓名不能为空");   
          jQuery("#add_user").css('border','1px solid red')
          return false;                         
        }
        obj={
        	"mobile":from_tel,            //手机号不能为空
            "name":from_name             //姓名
        }
        getsort(obj);
	})
    //取消
	$('#cancelBtn_set').on('click',function(){
		NoticeFather(0);
	})

function getsort(obj){
    $.ajax({
        type:"POST",
        url: '/butlerp/college/useradd',
        dataType:"json",
        data:obj,
        beforeSend: function(){
          jQuery.loading();
        },
        success: function(json){
          jQuery.loading_close();
          NoticeFather(1);
        },
        error:function(json){

            jQuery.postFail("fadeInUp",json.info);
        }
    });
};

function NoticeFather(para,pobj){
//console.log(College_add_user.close_pop_wnd)
    if(para==0){
        parent.College_add_user.close_pop_wnd({"code":para,"info":pobj});
    }else{
        parent.College_add_user.close_pop_wnd({"code":para,"info":pobj});
    }
}
})