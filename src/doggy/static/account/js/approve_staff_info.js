// JavaScript Document
/*====================
审批员工并配置资料 罗杨2016-10-25
=====================*/
doctorID=getUrlParam("doctorid");
clinicid=getUrlParam("clinicid");
$.ajax({
		type:"POST",
		url:"index.php?m=ClinicMember&a=get_personal_dealinfo",
		dataType:"json",
		data:{doctorid:doctorID,clinicid:clinicid},
		beforeSend: function(){},
		success: function(json){
			var name=json.name;
			var phone=json.mobile;
			var birthday=json.birthday;
			var sex=json.sex;
			var department_infolist=json.department_infolist;//科室列表
			var position_infolist=json.position_infolist;//职位列表
			var clinic=json.clinicname;//诊所名称
			var clinicid=json.clinicid;//诊所id
			var work_id=json.usernum;
			var worker_char=json.duty;//员工的职位
			var depart=json.departmentname;//员工的科室
			var depart_id=json.departmentid;//员工科室的id
			$(".worker_name").val(name);
			$(".worker_phone").val(phone);
			$(".worker_birthday").val(birthday);
			$(".sex").find("input[value="+sex+"]").attr("checked","true");
			$(".worker_id").val(work_id);
			$(".worker_clinic").append("<option value="+clinicid+">"+clinic+"</option>");
			if(department_infolist==null){
				var str="";
				str+="<option value=''>暂无科室</option>";
				$(".work_depart").append(str);
			}else{
				$.each(department_infolist,function(k,v){
					var str="";
					str+="<option value="+v.DepartmentID+">"+v.DepartmentName+"</option>";
					$(".work_depart").append(str);
				})
			}
			$(".work_depart option[value="+json.departmentid+"]").attr("selected","true");
			
			if(position_infolist==null){
				var str="";
					str+="<option value=''>暂无职位</option>";
					$(".worker_char").append(str);
			}else{
				$.each(position_infolist,function(k,v){
					var str="";
					str+="<option value='"+v.UserGroupName+"'>"+v.UserGroupName+"</option>";
					$(".worker_char").append(str);
				})
			}
			$(".worker_char option[value='"+worker_char+"']").attr("selected","true");
		},
		error: function(json){/*console.log(json);*/},
		complete: function(json){/*console.log(json);*/},
})
/*通过审批*/
$("#add_staff_save").click(function(){
	approve(2);		
})  
/*拒绝审批*/
$("#add_staff_refu").on("click",function(){
	approve(3);
})
function approve(dtype){
		var staff_list=new Array();
		var Iname=$(".worker_name");
		var phone=$(".worker_phone");
		var birth=$(".worker_birthday");
		var sex;
		var sex_1=$(".sex input[type='radio']:checked").val();//单店版获取性别方式
		var sex_2=$(".sex");//批量添加 获取性别方式
		var id=$(".worker_id");
		var clinic=$(".worker_clinic option:selected");
		var character=$(".worker_char option:selected");
		var depart=$(".work_depart option:selected");
		len=id.length;
		if(len==1){sex=sex_1;}
		else {sex=sex_2}
			if(phone.val()==""){
				alert("手机不能为空！请继续填写");	
				return false;
			}
			if(clinic.val()==""){
				alert("工作诊所未选择！请继续填写");	
				return false;
			}if(id==""){
				alert("工号不能为空！请继续填写");	
				return false;
			}
		$.ajax({
			traditional: true,
			type:"POST",
			url:"index.php?m=ClinicMember&a=save_employee_personalinfo",
			data:{type:dtype,doctorid:doctorID,name:Iname.val(),mobile:phone.val(),birthday:birth.val(),sex:sex,usenum:id.val(),clinicid:clinic.val(),duty:character.val(),departmentid:depart.val()},
			dataType:"json",
			beforeSend: function(){},
			success:function(json){
				console.log(json);
				if(json.code==1){
					alert(json.msg);
					if(chain==null){
						window.location="index.php?m=ChainStrom&a=staff_management";
					}else{
						window.location="index.php?m=OneStrom&a=staff_management";
					}
				}else{
					alert(json.msg);	
				}
			},
			error:function(json){/*console.log(json);*/},
			complete:function(json){/*console.log(json);*/}	
		})
	}

//获取url中的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}
$(".worker_birthday").calendar({     
    	callback: function () {  
      		$(".worker_birthday").removeClass('active');
    	}    
	});




















