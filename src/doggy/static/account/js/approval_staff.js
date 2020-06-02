// JavaScript Document
/*审批员工列表*/
$.ajax({
	type:"GET",
	url:"index.php?m=ClinicMember&a=get_deal_employee_infolist",
	dataType:"json",
	beforeSend:function(){$("#info_s").html("正在加载中...").css("text-align","center");},
	success:function(json){
		/*console.log(json);*/
		if(json.code==0){
			$("#info_s").html("暂无数据").css("text-align","center");
		}else{
			var cls="";//一条数据
			var approveA="";//判断单店还是连锁
			$.each(json,function(k,v){
				if(chain==""){
					approveA="<a href='/Account/index.php?m=OneStrom&a=config_info&doctorid="+v.doctorid+"&clinicid="+v.clinicid+"'>同意并设置</a>";
				}else{
					approveA="<a href='/Account/index.php?m=ChainStrom&a=config_info&doctorid="+v.doctorid+"&clinicid="+v.clinicid+"'>同意并设置</a>";
				}
				cls+="<div class='approval_tit'>";
				cls+="<ul class='appraval_content'>";
				cls+="<li id="+v.clinicid+" class='approval_name'><img class='add_one head_photo' src='/Account/public/img/u5148.png'>"+v.doctorname+"</li>";
				cls+="<li class='approval_sex'>"+v.sex+"</li>";
				cls+="<li class='approval_birth'>"+v.birthday+"</li>";
				cls+="<li class='approval_pho'>"+v.mobile+"</li>";
				cls+="<li class='approval_clinic'>"+v.clinicname+"</li>";
				cls+="<li class='approval_date'>"+v.createdate+"</li>";
				cls+="<li class='approval_actioin' id="+v.mobile+">"+approveA+"<span class='resume_it' data-d="+v.doctorid+" data-c="+v.clinicid+">拒绝</span></li>";
				cls+="</ul>";
				cls+="</div>";
			/*$(".appraval_content").append(cls);	*/
			});
			$("#info_s").html(cls);
		}
	},
	error:function(data){/*console.log(data)*/},
	complete:function(data){/*console.log(data)*/},	
})	
/*点击拒绝出弹窗*/
$(document).on("click",".resume_it",function(){
	$("#delete_pop").show();	
	$(".sta_man_bg").show();
	var index=$(".staff_leave").index(this);
	var clinicID=$(this).attr("data-c");
	var doctorID=$(this).attr("data-d");
	$("#resume_confim").on("click",function(){
		$("#resume_confim").unbind("click");
		$("#resume_pop").hide();
		$(".sta_man_bg").hide();
		resume_staff(doctorID,clinicID);
	})
})
/*拒绝*/
function resume_staff(doctorID,clinicID){
	$.ajax({
		type:"POST",
		url:"index.php?m=ClinicMember&a=save_employee_personalinfo",
		dataType:"json", 
		data:{type:3,doctorid:doctorID,clinic_list:clinicID},       
		beforeSend: function(json){},
		error: function(json){
			console.log(json);
		},
		success: function(json){
			if(json.code==1){
				alert(json.msg);
/*				$("#resume_pop").hide();
				$(".sta_man_bg").hide();*/
				 location.reload();
			}else{
				alert(json.msg);
				$("#resume_pop").hide();	
				$(".sta_man_bg").hide();
			}
			/*window.location="index.php?m=ChainStrom&a=turnover_handover";*/
		},
		complete: function(json){}
	})
}
