  var _type='';
  var data1=null;
  var _data1 = [
            {key:"音频（仅支持MP3.WAV）",val:"0"},
            {key:"视频（仅支持MP4）",val:"1"},
        ];
  
  var t1 = window.setTimeout(prompt,500);
  var classid = getUrlParam("classid");
  var classtitle = getUrlParam("classtitle");
  var classtype = getUrlParam("classtype");
  console.log(classtitle)

//--------------
//
//var htmls=$(window.frames["v_upload_if"].document).find("body").text()
//var htmlobj=JSON.parse(htmls)
$(function(){


  $('#typeof').yayigj_downlist({
		_data:_data1
	},function(api){
       data1 = api;
  });
  setTimeout(function(){data1.gotoval(1);},510)
 


  $('#classtitle').val(classtitle);
  $('#typeof').val(classtype);


  $("#file").on("change",function(){
        excelp()
  }) 

  function excelp(){
    //var v = $("#micro_url").val();
    var timg =document.getElementById("file"); //不能使用jq对象，要使用dom

    var reader = new FileReader();
        reader.readAsDataURL(timg.files[0]);
    var timg =timg.files[0];
    _type =timg.type.substring(6,timg.type.length);
    $('#from_val').val(_type);
    }

  $('#fillBtn_set').off('click').on('click',function(){
    var htmls=$(window.frames["v_upload_if"].document).find("body").text();
    if (htmls.length>0) {
      var htmlobj=JSON.parse(htmls);
      var filesize = htmlobj.list.filesize;
      var url = htmlobj.list.url;
      //console.log(filesize)
      var obj = {
                "classid":classid,                             //空表示新增 、不为空表示修改
                "classtype":$('#typeof').val(),               //类型
                "classtitle":$('#classtitle').val(),          //标题
                "url":url,                                     //视频url
                "filesize":filesize
        }
        //console.log(obj)
      
      $.ajax({
          type:"post",
          url:"/butlerp/college/weclassmod",
          dataType:"json",
          data:obj,
          beforeSend:function(){  
                  jQuery.loading('',-1);
          },
          complete: function(data){jQuery.loading_close(-1);}
          ,
          success: function(json){
              NoticeFather(1);
          },
          error:function (json) {
                jQuery.postFail("fadeInUp",json.info);
          }
        })
      }
})

$('#cancelBtn_set').off('click').on('click',function(){
  
  NoticeFather(0);
})
//--------------------------

});
//--------------------------

// function eventBind(){
//   $("#v_upload").on("click",function(){
//     $("#")
//   });
// }
function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r==null){
        return "";
      }
      return unescape(r[2]); //返回参数值
  } 

function prompt(){
  var fram_length = $(window.frames["v_upload_if"].document).find("body").text().length;
  //console.log(fram_length);
  if (fram_length > 1) {
    window.clearTimeout(t1);//去掉定时器
    $('#v_up_div').hide();
    jQuery.postFail('fadeInUp','上传成功');
  }else{
    window.setTimeout(prompt,500);
  }
}

function UpLoadFile() {
        // FormData 对象
        var form = new FormData(document.forms.namedItem("uploadForm"));
        //form.append("name", "dd");                        // 可以增加表单数据
        // XMLHttpRequest 对象
        var xhr = new XMLHttpRequest();
        xhr.open("post", "/butlerp/college/uploadsource", true);
        // xhr.upload 这是html5新增的api,储存了上传过程中的信息
        xhr.upload.onprogress = function (ev) {
            var percent = 0;
            if (ev.lengthComputable) {
                percent = 100 * ev.loaded / ev.total + "%";
                console.log(percent);
                $('.up_viedo').attr('data-id',percent);
                //$("#myprogress").width(percent + "%");
            }
        };
        xhr.onload = function (oEvent) {
            if (xhr.status == 200) {
                //ListFile();
            }
        }
        xhr.send(form);
    }

    // function ListFile() {
    //     $.ajax({
    //         type: "GET",//使用get方法访问后台
    //         dataType: "json",//返回json格式的数据
    //         url: "/file",//要访问的后台地址
    //         cache: false,
    //         success: function (msg) {//msg为返回的数据，在这里做数据绑定
    //             // console.log(msg);
    //             $("#mytemplate").show();
    //             $.each(msg, function (i, n) {
    //                 var row = $("#mytemplate").clone();
    //                 row.addClass("myrow");
    //                 row.find("#NO").text(i);
    //                 row.find("#Name").html("<a href='/files/" + n.name + "'>" + n.name + "</a>");
    //                 row.find("#Size").text(n.size);
    //                 row.find("#Operation").html("<input class='mycheckbox'type='checkbox' value='" + i + "'>");
    //                 row.appendTo("#datas");//添加到模板的容器中
    //             });
    //             $("#mytemplate").hide();   //隐藏模板
    //         },
    //         error: function () {
    //             alert("连接服务器错误");
    //         }
    //     });
    // }

function NoticeFather(para,pobj){
    if(para==0){
        parent.College_add_micro.close_pop_wnd({"code":para,"info":pobj});
    }else{
        parent.College_add_micro.close_pop_wnd({"code":para,"info":pobj});
    }
}

