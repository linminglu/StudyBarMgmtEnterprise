// JavaScript Doc
$(document).ready(function(e) {
   $(document).on("click","#clinic_ls .equi_ls p",function(){
	   var dis=$(this).siblings("ol").css("display");
	   	console.log(dis);
		if(dis=="block"){
			$(this).children("img").attr("src","../public/img/clinic_show_direct_t.png");
		}else{
			$(this).children("img").attr("src","../public/img/per_mana_icon_3.png");
		}
		$(this).siblings("ol").slideToggle();
	})
});































