   var college = getUrlParam("college");
   console.log(college)
      if (college == 'yhgl') {
        $('#import').attr('href','http://dtcollege.oss-cn-qingdao.aliyuncs.com/%E6%A8%A1%E6%9D%BF/CollegeUser.xlsx');
        }else{
            $('#import').attr('href','http://dtcollege.oss-cn-qingdao.aliyuncs.com/%E6%A8%A1%E6%9D%BF/CollegeUser.xlsx');
        }

$(function(){
	$("#uploadExcel").on("change",function(){
        if (college == 'yhgl') {
            //$('#import').attr('src','http://dtcollege.oss-cn-qingdao.aliyuncs.com/%E6%A8%A1%E6%9D%BF/CollegeUser.xlsx');
            excelyhgl();
        }else if (college == 'jfgl') {
            exceljfgl();
        }
    });

$('#replace').off('click').on('click',function(){
    $("#uploadExcel").click();
})


function excelyhgl(){
    var v = $("#uploadExcel").val();
    var timg =document.getElementById("uploadExcel"); //不能使用jq对象，要使用dom

        var reader = new FileReader();
        reader.readAsDataURL(timg.files[0]);
        var timg_name =timg.files[0].name;
        reader.onload = function(e){
            var imgData = e.target.result.split(',');
          //  console.log(e.target.result);
            var imgContent = imgData[1]
            $.ajax({
                type:"POST",
                url:"/butlerp/college/userimport",
                dataType:"json",
                data:{
                    picdata:imgContent,
                    ext:"xls"
                },
                beforeSend: function(){
                    jQuery.loading('加载中',1);
                },
                complete: function(json){
                   jQuery.loading_close();
                },
                success: function(json){
                    $('#file_name').text(timg_name).css('vertical-align','0');
                    $('.labelfor').hide();
                    $('#replace').show();
                    jQuery.postFail('fadeInUp','导入成功');
                    //NoticeFather(1);
                    // if(json.code==1){
                    //   //  console.log(json.list);
                    //     $.each(json.list,function(k,v){
                    
                            
                    //     })
                    // }
                },
                error: function(json){
                   
                }
            })
    }
}

function exceljfgl(){
    var v = $("#uploadExcel").val();
    var timg =document.getElementById("uploadExcel"); //不能使用jq对象，要使用dom
        var reader = new FileReader();
        reader.readAsDataURL(timg.files[0]);
        var timg_name =timg.files[0].name;
        reader.onload = function(e){
            var imgData = e.target.result.split(',');
          //  console.log(e.target.result);
            var imgContent = imgData[1]
            $.ajax({
                type:"POST",
                url:"/butlerp/college/integralimport",
                dataType:"json",
                data:{
                    picdata:imgContent,
                    ext:"xls"
                },
                beforeSend: function(){
                    jQuery.loading('加载中',1);
                },
                complete: function(json){
                   jQuery.loading_close();
                },
                success: function(json){
                    $('#file_name').text(timg_name);
                    jQuery.postFail('fadeInUp','导入成功');
                    //NoticeFather(1);
                    // if(json.code==1){
                    //   //  console.log(json.list);
                    //     $.each(json.list,function(k,v){
                    
                    //         Dentals.push(parseInt(v.id));
                    //         var li='';
                    //             li='<span class="area_item">'+v.id+'&nbsp;&nbsp;（'+v.name+'）<i onClick="delete_dental(this)" data-id='+v.id+'></i></span>';
                    //             $("#DentalID").append(li);
                    //     })
                    //   $("#DentalNum").text(Dentals.length);
                    // }
                },
                error: function(json){
                   
                }
            })
    }
}


function NoticeFather(para,pobj){
    if(para==0){
        parent.yayigjCollege_import.close_pop_wnd({"code":para,"info":pobj});
    }else{
        parent.yayigjCollege_import.close_pop_wnd({"code":para,"info":pobj});
    }
}

$('#fillBtn_set').off('click').on('click',function(){
    NoticeFather(1)
})

$('#cancelBtn_set').off('click').on('click',function(){
    NoticeFather(0)
})

})
   function getUrlParam(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.search.substr(1).match(reg);  //匹配目标参数
      if (r==null){
        return ""
      }
      return unescape(r[2]); //返回参数值
  } 