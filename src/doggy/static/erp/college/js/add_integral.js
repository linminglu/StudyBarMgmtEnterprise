var data1= null,data2=null;
var _data1 = [];
var _data2 = [];
$(function(){

    $("#transaction_data").yayigj_date_Sel();
    $("#transaction_data").getCurrday();

    $('#typeof').yayigj_downlist({
		_data:_data1
	},function(api){
       data1 = api;
  });

    $('#curriculum').yayigj_downlist({
		_data:_data2
	},function(api){
       data2 = api;
  });

  $('#fillBtn_set').off('click').on('click',function(){
       var _tel = $("#tele").val();
       var _name = $('#user_name').val();
       var coursename = $('#coursename').val();
       var consumefee = $('#consumefee').val();
       var integral = $('#integral').val();
        //匹配到一个非数字字符，则返回false 
        var expr = /^1[3,5,7,8]\d{9}$/;
        if (!expr.test(_tel) || _tel.length == "") {
              jQuery.postFail('fadeInUp','请输入正确的手机号');
          return false;                         
        }
        if (_name.length == "") {
          jQuery.postFail('fadeInUp','姓名不能为空');
          return false;
        }
        if (coursename.length == "") {
          jQuery.postFail('fadeInUp','课程名称不能为空');
          return false;
        }
        if (consumefee.length == "") {
          jQuery.postFail('fadeInUp','消费不能为空');
          return false;
        }
        if (integral.length == "") {
          jQuery.postFail('fadeInUp','积分不能为空');
          return false;
        }
    var obj={
          "consumedate":$('#transaction_data').val(),       //交易时间
          "mobile":_tel,                        //输入框查询条件
          "name":_name,                     //姓名
          "integraltype":$('#typeof').val(),                              //积分类型
          "coursetype":$('#curriculum').val(),          //课程类型
          "coursename":$('#coursename').val(),           //课程名称
          "consumefee":$('#consumefee').val(),             //本次消费
          "integral":$('#integral').val(),                //本次积分
          "referrermobile":$('#referrermobile').val(),              //推荐人手机号 
    }
    addajax(obj)
  })
  $('#cancelBtn_set').off('click').on('click',function(){
     NoticeFather(0)
  })
function addajax(obj){
  $("body").prepend("<div class='loading'></div>");
  $.ajax({
      type:"post",
      url:"/butlerp/college/integraladd",
      dataType:"json",
      data:obj,
      beforeSend:function(){  
              jQuery.loading('',-1);
      },
      complete: function(data){jQuery.loading_close(-1);}
      ,
      success: function(json){
          $("body").find(".loading").remove();
          jQuery.postFail('fadeInUp','添加成功');
          NoticeFather(1)
      },
      error:function (json) {
            jQuery.postFail("fadeInUp",json.info);
      }
    })
}

function seleteinfo(){
  $.ajax({
      type:"post",
      url:"/butlerp/college/integraltype",
      dataType:"json",
      beforeSend:function(){  
              jQuery.loading('',-1);
      },
      complete: function(data){jQuery.loading_close(-1);}
      ,
      success: function(json){
          if(json.code==1){
            var Json=json.list;
            $(Json.integraltype).each(function(k,v){
              _data1.push({'key':v.type,'val':v.displayorder});
            })
            $(Json.coursetype).each(function(k,v){
              _data2.push({'key':v.type,'val':v.displayorder});
            })
            data1.reFillData(_data1);
            data2.reFillData(_data2);
          }
          data1.gotoval(_data1[0].val);
          data2.gotoval(_data2[0].val);
      },
      error:function (json) {
            jQuery.postFail("fadeInUp",json.info);
      }
    })
}


function NoticeFather(para,pobj){
    if(para==0){
        parent.College_add_integral.close_pop_wnd({"code":para,"info":pobj});
    }else{
        parent.College_add_integral.close_pop_wnd({"code":para,"info":pobj});
    }
}
seleteinfo()
})