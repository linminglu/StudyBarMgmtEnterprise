
/*权限管理左边 列表点击诊所出现下滑职位列表*/
$(document).on("click","#clinci_lists .cls",function(){
            $(this).children("ul").slideToggle();
            $(this).siblings(".cls").children("ul").slideUp();
            var ul=$(this).children("ul");
            var li_len=ul.children();
            /*if(li_len==null){
                alert("暂无职位！请先增加职位");   
            }*/
})
$(document).on("click","#clinci_lists ul li",function(event){
            event.stopPropagation();
            var tag=event.target.className;
            var clcinicID=$(this).parents(".cls").attr("id");
            var thisName=$(this).text();
                tag=sw(tag);
           /* action_lists(tag,clcinicID,thisName);*/

})


function sw(type){
    switch(type){
        case "action_ico up":
        type=0; break;
        case "action_ico down":
        type=1; break;
        case "action_ico delete":
        type=2; break;
        case "":
        type=null; break;
    }   
    return type;
}
    
//点击加号出现 新增职位弹窗
$("#add_ico").click(function(){
    $(".popup_bg").show();
    $(".set_fee_type").show();
    // $.ajax({
    //     type:"GET",
    //     url:"index.php?m=Clinic&a=get_role_infolist",
    //     dataType:"json",
    //     beforeSend: function(){},
    //     error: function(result){},
    //     success: function(result){
    //     },
    //     complete: function(result){}
    // })
});


    
    
    
    