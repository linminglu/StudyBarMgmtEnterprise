$("#per_grade").yayigj_downlist({    //职称列表
    _hiddenID:'clinicid2',
    _valtype:'text',
    _data:[
        {'key':'请选择职称'},
        {'key':'执业助理医师'},
        {'key':'执业医师'},
        {'key':'主治医师'},
        {'key':'主任医师'},
        {'key':'副主任医师'}
    ]	 
});

//个人信息获取
$.ajax({
	type:"GET",
	url:"/member/Perinfo",
	dataType:"json",
	beforeSend: function(){},
	success: function(json){
        console.log(json);
        if(json.list[0].picture!=null&&json.list[0].picture!=""){
           $("#Img1").attr("src",""+json.list[0].picture+"");
        }else{
            $("#Img1").attr("src","/static/account/img/login_pho.png");
        };
        $("#per_name").val(json.list[0].name);
        if(json.list[0].sex=="男"){
            $("#man").attr("checked",true);
        }else if(json.list[0].sex=="女"){
            $("#woman").attr("checked",true);
        };
        if(json.list[0].age==1||json.list[0].age==0){
            $("#per_age").val(" "); 
        }else{
            $("#per_age").val(json.list[0].age);
        }
        if(json.list[0].area!=""&&json.list[0].area!=null){
             var place=json.list[0].area;
            var placeArr=place.split(" ");
            // console.log(placeArr[0]);
            // console.log(placeArr[1]);
            $("#per_province").text(placeArr[0]);
            if(placeArr[0]!="省份"){
                $("#per_province_down_list p").each(function(){
                    if($(this).text()==""+placeArr[0]+""){
                        $(this).trigger("click");
                    }
                })
                $("#per_city").text(placeArr[1]);
            }else{
                $("#per_city").text("城市");
            }
        }
        if(json.list[0].grade!=""&&json.list[0].grade!=null){
            $("#per_grade").text(json.list[0].grade);
        }
        $("#per_work_year").val(json.list[0].workyear);
        if(json.list[0].confirmation==null||json.list[0].confirmation==""){
            $("#Img2").attr("src","/static/account/img/u1910.png");
        }else{
            $("#Img2").attr("src",""+json.list[0].confirmation+"");
        }

        var str="";
        if(json.list[0].expert!=""&&json.list[0].expert!=null){
            var expert=json.list[0].expert;
            var expertArr=expert.split("|");
            //console.log(expertArr);
            for(var i=0;i<expertArr.length;i++){
                str+='<span class="add_over">'+expertArr[i]+'<img src="/static/account/img/u1922.png" class="add_over_img"></span>';
            }
        }
        $("#con_maj").append(str);
    },
	error: function(json){
        //console.log(json);
    },
	complete: function(json){
        // console.log(json);
    }
})

//具体案例弹窗
$("#spe_case_btn").click(function(){
    $(".specific_case").show();
    $(".mask").show();
})

$("#close_del").click(function(){
    $(".specific_case").hide();
    $(".mask").hide();
}).mouseover(function(){
    $(this).attr("src","/static/account/img/close_2.png");
}).mouseout(function(){
    $(this).attr("src","/static/account/img/close.png");
})

/*添加项目弹窗滚动，下面窗口不滚动解决方法*/
$.fn.scrollUnique = function() {
    return $(this).each(function() {
        var eventType = 'mousewheel';
        // 火狐是DOMMouseScroll事件
        if (document.mozHidden !== undefined) {
            eventType = 'DOMMouseScroll';
        }
        $(this).on(eventType, function(event) {
            // 一些数据
            var scrollTop = this.scrollTop,
                scrollHeight = this.scrollHeight,
                height = this.clientHeight;

            var delta = (event.originalEvent.wheelDelta) ? event.originalEvent.wheelDelta : -(event.originalEvent.detail || 0);        

            if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
                // IE浏览器下滚动会跨越边界直接影响父级滚动，因此，临界时候手动边界滚动定位
                this.scrollTop = delta > 0? 0: scrollHeight;
                // 向上滚 || 向下滚
                event.preventDefault();
            }        
        });
    }); 
};

$(".item_list").scrollUnique();

/*增加右边字母列表随左边选项滚动 可以兼容ie8 罗杨2016-11-5*/
$(".item_list").bind("scroll",function(){
    $(".item_ul").each(function(index, element) {//获得每个ul的id和高度
    /*这里高度没有px*/
        var id=$(this).attr("id");
        var height=($(this).children("li").length-1)*40+31+39;
        $("#sel_letter li[data-letter='1']").children("a").each(function(i, e) {//获得右边每个项目的值和他对应id的ul的top，
            var letter=$(this).text();
            letter=letter.toLocaleLowerCase();
            var top=$("#"+letter).position().top;
            if(id==letter){
                if(top<31){
                    $(this).addClass("spe_class");
                    $(this).parent().siblings("li").children("a").removeClass("spe_class");
                }
            }
        });
        /*console.log(height);*/
    });
})

/*增加输入框查询 罗杨2016-11-5*/
$(".search img").bind("click",function(){
	var inp=$(this).siblings("input");
	if(inp.val()==""){
	}else{
		var vals=inp.toPinyin();
		vals=vals.substr(0,1).toLowerCase();
		window.location.href="#"+vals;//妈的，这样就可以触发a链接的锚点
		$("#sel_letter li[data-letter='1'] a[href='#"+vals+"']").click();
	}
	
})


/*添加项目弹窗*/
$("#sel_letter li[data-letter='1']").eq(0).children("a").addClass("spe_class");
$("#sel_letter li[data-letter='1']").click(function(){
	$(this).children("a").addClass("spe_class");
	$(this).siblings().children("a").removeClass("spe_class");
})


var bgaItem=[];
function get_add_over(){
    bgaItem=[];
    $(".add_over").each(function(){
        var bgaItemName=$(this).text();
        bgaItem.push(bgaItemName);
    })
    //console.log(bgaItem);
}

$(document).on("click","#add_maj",function(){
    $(".add_item_alert").show();
    $(".mask").show();
    var pAddItem=[];
    $(".item_ul").each(function(){
        $(this).find("span").each(function(){
            var pAddItemName=$(this).text();
            pAddItem.push(pAddItemName);
        })
    })
    get_add_over();
    //console.log(pAddItem);
    for(var i=0;i<pAddItem.length;i++){
        for(var j=0;j<bgaItem.length;j++){
            if(bgaItem[j]==pAddItem[i]){
               //console.log(pAddItem[i]);
               $(".item_ul").each(function(){
                    $(this).find("span").each(function(){
                       if($(this).text()==pAddItem[i]){
                            $(this).siblings("img").attr("src","/static/account/img/selected.png");
                       }
                    })
                })
            }
        }
    }
})

$("#add_close").click(function(){
	$(".add_item_alert").hide();
	$(".mask").hide();
})

$(".refuse").click(function(){
	$(".add_item_alert").hide();
	$(".mask").hide();
})


$(".item_ul img").click(function(){
    str=[];
    var url=$(this).attr("src");
	if(url=="/static/account/img/no_select.png"){
        getImgLen();
        //console.log(str.length);
        if(str.length<10){
            $(this).attr("src","/static/account/img/selected.png");
        }
	}else{
		$(this).attr("src","/static/account/img/no_select.png");
	}
})

var str=[];
function getImgLen(){
    $(".item_ul img").each(function(){
        var itemName=$(this).siblings("span").html();
        var url=$(this).attr("src");
        if(url=="/static/account/img/selected.png"){
            str.push(itemName);
        }
    });
}
$(".confim").click(function(){
     str=[];
     getImgLen();
    //console.log(str);
    $(".item_ul img").attr("src","/static/account/img/no_select.png");
    var strh_tml='';
    for(var i=0;i<str.length;i++){
        strh_tml+='<span class="add_over">'+str[i]+'<img src="/static/account/img/u1922.png" class="add_over_img"></span>';
    }
    $(".add_item_alert").hide();
    $(".mask").hide();
    $(".con_maj").html('<span class="add_maj" id="add_maj">+添加项目</span>'+strh_tml);
    str=[];
})

$(document).on("click",".add_over_img",function(){  
    $(this).parent().remove();
});

/*保存更改个人信息*/

// $("#upload1").localUploadYaYigj({
// 	imgPathID:'#TeacherPicture1',
// 	imgPathPIC:'#Img1',
// 	pic_ext:'#pic_ext',
// 	uploadPath:'/member/UploadImage'
// 	},function(){
// 	  up_api=this;
// });


var cropApi=null;		
$("#upload2").localUploadYaYigj({
    picWidth:1024,
    //picHeight:768,
    imgPathID:'#TeacherPicture2',  //上传成功后返回路径放到哪个控件
    imgPathPIC:'#Img2',				//上传成功后预览图片控件
    pic_ext:'#pic_ext2',						
    uploadPath:'',
    isCrop:false  //是否支持裁剪
},function(){
    cropApi=this;
});

$("#upload1").localUploadYaYigj({
    //picWidth:1024,
    //picHeight:768,
    imgPathID:'#TeacherPicture1',  //上传成功后返回路径放到哪个控件
    imgPathPIC:'#Img1',				//上传成功后预览图片控件
    pic_ext:'#pic_ext',						
    uploadPath:'',
    isCrop:true  //是否支持裁剪
},function(){
    cropApi=this;
});
 
// $("#upload2").localUploadYaYigj({
// 	imgPathID:'#TeacherPicture2',
// 	imgPathPIC:'#Img2',
// 	pic_ext:'#pic_ext2',
// 	uploadPath:'/member/UploadImage'
// 	},function(){
// 	  up_api=this;
// }); 




var picture="";
$(document).on("click","#upload1ok_enter",function(){
    //console.log(1);
    var imgsrc=localStorage.getItem("imgsrc");
    var imgext=localStorage.getItem("imgExt");
    //console.log(imgsrc);
    //console.log(imgext);
     $.ajax({
            type:"POST",
            url:"/member/UploadImage",
            dataType:"json",
            data:{
                picdata:imgsrc,
                ext:imgext
            },
            beforeSend: function(){},
            success: function(json){
                //console.log(json);
                picture=json.info;
        },
            error: function(json){
                //console.log(json);
            },
            complete: function(json){
                //console.log(json);
        }
    })
})

var confirmation="";
$(document).on("click","#upload2ok_enter",function(){  
    //console.log(1);
    var imgsrc=localStorage.getItem("imgsrc");
    var imgext=localStorage.getItem("imgExt");
    //console.log(imgext);
     $.ajax({
            type:"POST",
            url:"/member/UploadImage",
            dataType:"json",
            data:{
                picdata:imgsrc,
                ext:imgext
            },
            beforeSend: function(){},
            success: function(json){
                //console.log(json);
                confirmation=json.info;
        },
            error: function(json){
                //console.log(json);
            },
            complete: function(json){
                //console.log(json);
        }
    })
})



function saveData(){			
	var base64 = $("#Img1").attr("src");
		  imagedata=base64.substr(base64.indexOf(',') + 1);	
	var base642 = $("#Img2").attr("src");
		  imagedata2=base642.substr(base642.indexOf(',') + 1);		
	var items=[];
	$(".add_over").each(function(index, element) {
		items.push($(this).text());
	});
    var area=[];
    area.push($("#per_province").text());
    area.push($("#per_city").text()); 
    if(picture==""){
        picture=$("#Img1").attr("src");
    }
    if(confirmation==""){
        confirmation=$("#Img2").attr("src");
    }
    //console.log(picture);
	var data={
		picture:picture,
		confirmation:confirmation,
		// pic_ext:$("#pic_ext").val(),
		// pic_ext2:$("#pic_ext2").val(),			  
		name:$("#per_name").val(),
		sex:$('input:radio[name="sex"]:checked').val(),
		age:$("#per_age").val(),
		// province:$("#per_province option:selected").text(),
		// city:$("#per_city option:selected").text(),
        area:area.join(" "),
		grade:$("#per_grade").text(),
		workyear:$("#per_work_year").val(),
		expert:items.join('|')
	};
    //console.log(data);
    jQuery.createAniCss();
	$.ajax({
			type: "POST",
			url: '/member/ChangePerinfo',
			data: data,
			dataType:"JSON",
		/*	 complete: function(data){
				console.log(data);
		   },*/
		   beforeSend: function(){
				//ui_top_pop_process('正在获取数据,请稍候...');   
		   },
		   error:function(data){
				//console.log(data);
		   },
		   success: function(data){
				//console.log(data);
				if(data.code==1){
                    localStorage.setItem("headInfo",$("#Img1").attr("src"));
					document.location='/member/GetPerinfo';
					jQuery.postOk('fadeInUp','保存成功');
				}else if(data.code==0){
                    //console.log(data.info);
                    jQuery.postFail('fadeInUp',''+data.info+'');
                }
			  // $(ops.imgPathID).val(msg);
		   }
		});
}