/*获取大纲一级和二级目录*/
getList();
function getList(){
		$.ajax({
		type:"GET",
		url:"index.php?m=EmrTemplate&a=medical_temp",
		dataType:"json",
		beforeSend: function(){},
		success: function(json){
		/*console.log(json);*/
		var temp_clinci="";
		$.each(json.info,function(k,v){
			/*四个小图标*/
			var up="<img class='temp_ico up' src='/Account/public/img/up2.png'>";
			var down="<img class='temp_ico down' src='/Account/public/img/down2.png'>";
			var add="<img class='temp_ico add' src='/Account/public/img/add_temp1.png'>";
			var delet="<img class='temp_ico delete' src='/Account/public/img/delete_big.png'>";
			var modify="<img class='temp_ico modify' src='/Account/public/img/modify1.png'>";
			

			temp_clinci+="<div class='temp_clinic' id="+v.ClinicID+">";
			temp_clinci+="<p class='hove' data-c='0'><img class='temp_ico2 fd' src='/Account/public/img/unflod_gray_2.png'>"+v.Name+add+modify+"</p>";
			temp_clinci+="<div class='add_depart'><input type='text' name='first' class='catalog' placeholder='请输入次级目录名称' maxlength='8'/><span class='create' data-par="+v.ClinicID+" data-c='1'  data-dir='1'>创建</span></div>";
			temp_clinci+="<div class='mod_depart'><input type='text' name='first' class='catalog' placeholder='请输入修改目录名称' maxlength='8'/><span class='create_a' data-par="+v.ClinicID+" data-c='1'  data-dir='1'>修改</span></div>";
			temp_clinci+="<ul class='temp_depart_ul'>";
			var first=v.firstClass;
				if(first==null){
					
				}else{
					$.each(first,function(key,value){
						temp_clinci+="<li class='temp_depart_list' id="+value.EMRTemplateIdentity+">";
						temp_clinci+="<p class='hove' data-c='1'><img class='temp_ico2 fd' src='/Account/public/img/unflod_gray_2.png'>"+value.NodeName+up+down+add+modify+delet+"</p>";
						temp_clinci+="<div class='add_depart'><input type='text' name='first' class='catalog' placeholder='请输入次级目录名称' maxlength='8'/><span class='create' data-par="+value.EMRTemplateIdentity+" data-c='2'  data-dir="+value.IsDir+">创建</span></div>";
						temp_clinci+="<ol class='temp_disease_list'>";
						temp_clinci+="</ol>";
						temp_clinci+="</li>";
					})
						
				}
			temp_clinci+="</ul>";
			temp_clinci+="</div>";
		})	
		$(".temp_l_clinics").html(temp_clinci);
	},
	error: function(){},
	complete: function(){},
	})
}
$(document).on("click",".temp_depart_list .hove",function(){
		var ParentIdentity=$(this).parent().attr("id");
		var ClinicUniqueID=$(this).parents(".temp_clinic").attr("id");
		var isdir;
		if($(this).attr("data-c")=="1"){
			isdir=1;
		}if($(this).attr("data-c")=="2"){
			isdir=0;
		}else if($(this).attr("data-c")=="3"){
			isdir=0;
		}
		getdea(ClinicUniqueID,ParentIdentity,isdir);
		
})

/*点击1级获得第2级的ajax函数*/
function getdea(ClinicUniqueID,ParentIdentity,isdir){
		$.ajax({
		type:"POST",
		url:"index.php?m=EmrTemplate&a=otherCate",
		data:{ClinicUniqueID:ClinicUniqueID,ParentIdentity:ParentIdentity,IsDir:isdir},
		dataType:"json",
		beforeSend: function(){},
		success: function(json){
			/*四个小图标*/
			var up="<img class='temp_ico up' src='/Account/public/img/up2.png'>";
			var down="<img class='temp_ico down' src='/Account/public/img/down2.png'>";
			var add="<img class='temp_ico add' src='/Account/public/img/add_temp1.png'>";
			var delet="<img class='temp_ico delete' src='/Account/public/img/delete_big.png'>";
			var modify="<img class='temp_ico modify' src='/Account/public/img/modify1.png'>";
		var temp_clinci="";
		if(json.msg==2){
			$.each(json.data,function(k,v){
				if(v==null){
					
				}else{
					temp_clinci+="<li class='temp_disease' id="+v.EMRTemplateIdentity+">";
					temp_clinci+="<p class='hove' data-c='2'><img class='temp_ico2 fd' src='/Account/public/img/unflod_gray_2.png'>"+v.NodeName+up+down+add+modify+delet+"</p>";
					temp_clinci+="<div class='add_depart'><input type=text name=first class='catalog' placeholder='请输入次级目录名称' maxlength='8'/><span class='create' data-par="+v.EMRTemplateIdentity+" data-c='3'  data-dir="+v.IsDir+">创建</span></div>";
					temp_clinci+="<ul class='disease_p_lists'>";
					temp_clinci+="</ul>";
					temp_clinci+="</li>";
						
				}
			temp_clinci+="</ul>";
			temp_clinci+="</div>";
			})	
			$("#"+ParentIdentity+"").children(".temp_disease_list").html(temp_clinci);
		}else{
			if(json.data==null){
				
			}else{
				$.each(json.data,function(i,j){
					temp_clinci+="<p class='temp_disease_p hove' data-c='3' id="+j.EMRTemplateIdentity+">"+j.NodeName+up+down+modify+delet+"</p>";
				})
			$("#"+ParentIdentity+"").children(".disease_p_lists").html(temp_clinci);
			}
			
		}
		
	},
	error: function(){},
	complete: function(){},
	})
}

/*新增下级目录的ajax函数*/
function add(parID,dtype,nodeName,clinicID,dir){
	$.ajax({
		type:"POST",
		dataType:"json",
		url:"index.php?m=EmrTemplate&a=addOK",
		data:{clinicID:clinicID,class:dtype,nodeName:nodeName,ParentIdentity:parID,IsDir:dir},
		beforeSend: function(){},
		success: function(json){
			alert(json.msg);
			if(json.code==1){
				getList();
			}else{
			}
		},
		error: function(){},
		compelte: function(){},
	})
}
/*点击小图标+出现创建的div*/
$(document).on("click",".add",function(event){
	event.stopPropagation();
	$(this).parent().siblings(".add_depart").show();	
})
/*点击创建的按钮*/
$(document).on("click",".create",function(event){
	event.stopPropagation();
/*	console.log($(this).siblings(".catalog").val());*/
	var clinciID=$(this).parents(".temp_clinic").attr("id");
	var dir=$(this).attr("data-dir");
	var parID=$(this).attr("data-par");
	var dtype=$(this).attr("data-c");
	var nodeName=$(this).siblings(".catalog").val();
	if(dtype==1){parID=0;}
	if(dtype==3){dir=0;}
	add(parID,dtype,nodeName,clinciID,dir);
	$(this).siblings(".catalog").val("").parent(".add_depart").hide();
})
<!--======================================-->
/*点击修改小图标出现创建的div*/
$(document).on("click",".modify",function(event){
	event.stopPropagation();
	$(this).parent().siblings(".mod_depart").show();
})
$(document).on("click",".create_a",function(event){
	alert(1);
	event.stopPropagation(); 
	var clinciID=$(this).parents(".temp_clinic").attr("id");
	var parID=$(this).attr("data-par");
	var dtype=$(this).attr("data-c");
	var nodeName=$(this).siblings(".catalog").val();
	if(dtype==1){parID=0;}
	if(dtype==3){dir=0;}
	edit(parID,nodeName,clinciID);
	$(this).siblings(".catalog").val("").parent(".mod_depart").hide();
})

/*点击口腔内科和里面的牙周炎出现和收缩列表*/
/*点击诊所伸展收缩*/
$(document).on("click",".temp_clinic .hove",function(event){
	event.stopPropagation();
	var dataC=$(this).attr("data-c");
	var sib;
	if(dataC==0){
		sib=$(this).siblings(".temp_depart_ul").css("display");
		$(this).siblings(".temp_depart_ul").slideToggle();
		if(sib=="block"){
			$(this).children(".temp_ico2").attr("src","/Account/public/img/unflod_gray_2.png").removeClass("fd2").addClass("fd");
		}else{
			$(this).children(".temp_ico2").attr("src","/Account/public/img/flod_gray_1.png").removeClass("fd").addClass("fd2");
		}
	}
	if(dataC==1){
		sib=$(this).siblings(".temp_disease_list").css("display");
		$(this).siblings(".temp_disease_list").slideToggle();
		if(sib=="block"){
			$(this).children(".temp_ico2").attr("src","/Account/public/img/unflod_gray_2.png").removeClass("fd2").addClass("fd");
		}else{
			$(this).children(".temp_ico2").attr("src","/Account/public/img/flod_gray_1.png").removeClass("fd").addClass("fd2");
		}
	}
	if(dataC==2){
		sib=$(this).siblings(".disease_p_lists").css("display");
		$(this).siblings(".disease_p_lists").slideToggle();
		if(sib=="block"){
			$(this).children(".temp_ico2").attr("src","/Account/public/img/unflod_gray_2.png").removeClass("fd2").addClass("fd");
		}else{
			$(this).children(".temp_ico2").attr("src","/Account/public/img/flod_gray_1.png").removeClass("fd").addClass("fd2");
		}
	}else if(dataC==3){
		return false;
	}
	console.log(sib);
})
$(document).on("click",".temp_depart_list .hove",function(){
	$(this).children(".temp_disease_list").slideToggle();
})
/*点击防止冒泡*/
$(document).on("click",".temp_clinic .temp_disease_p",function(event){
	event.stopPropagation();
})

$(document).on("click",".temp_clinic .temp_ico ",function(event){
	event.stopPropagation();
	var dataC=$(this).parent(".hove").attr("data-c");
	var dtype;
	var thisClass=$(this).attr("class");
	if(thisClass=="temp_ico delete"){
		dtype=1;	
	}else if(thisClass=="temp_ico down"){
		dtype=3;	
	}else if(thisClass=="temp_ico up"){
		dtype=2;	
	}else if(thisClass=="temp_ico modify")
	{
		return false;
	}
	
	var clinciID=$(this).parents(".temp_clinic").attr("id");
	var erm;
	if(dataC==1){erm=$(this).parents(".temp_depart_list").attr("id");}
	if(dataC==2){erm=$(this).parents(".temp_disease").attr("id");}
	if(dataC==3){erm=$(this).parents(".temp_disease_p").attr("id");}
	console.log(erm);
	handle(erm,clinciID,dtype,dataC);
})
/*上移、下移、删除操作的ajax*/
function handle(EMRTemplateIdentity,ClinicUniqueID,dtype,dataC){
	$.ajax({
		type:"GET",
		url:"index.php?m=EmrTemplate&a=handle&EMRTemplateIdentity="+EMRTemplateIdentity+"&ClinicUniqueID="+ClinicUniqueID+"&type="+dtype+"&class="+dataC,
		dataType:"json",
		beforeSend: function(){},
		success: function(json){
			if(json.code==1){
				alert(json.msg);
			}else{
				alert(json.msg);
			}
		},
		error: function(){},
		compelte: function(){},
	})
}
function edit(EMRTemplateIdentity,ClinicUniqueID,dtype,dataC){
	$.ajax({
		type:"GET",
		url:"index.php?m=EmrTemplate&a=handle&EMRTemplateIdentity="+EMRTemplateIdentity+"&ClinicUniqueID="+ClinicUniqueID+"&type="+dtype+"&class="+dataC,
		dataType:"json",
		beforeSend: function(){},
		success: function(json){
			if(json.code==1){
				alert(json.msg);
			}else{
				alert(json.msg);
			}
		},
		error: function(){},
		compelte: function(){},
	})
}
$(document).ready(function(e) {
	$("#temp_tables input").prop("readonly",true);
	/*点击右边的选项切换下方的表格*/
	$("#temp_index li").click(function(){
		$("#temp_index li[data-flag='1']").attr("data-flag","0");
		$(this).attr("data-flag","1");	
		var index=$(this).index();
		$("#temp_tables section").eq(index).show().siblings("section").hide();
	})
	/*点击编辑出现保存和取消，并且下方的表格可以编辑*/
	$("#temp_edit").on("click",function(){
		$(this).hide();
		$("#temp_save,#temp_cancel").removeClass("dsn");
		$("#temp_tables input").prop("readonly",false);
	})
	/*点击保存出现编辑，并且下方的表格不可以编辑*/
	$("#temp_save").on("click",function(){
		$(this).addClass("dsn");
		$("#temp_cancel").addClass("dsn");
		$("#temp_edit").show();
		$("#temp_tables input").prop("readonly",true);
	})
	/*将获取到的input的value保存到数组中*/
	var valArr=new Array();
	$("#temp_tables input").each(function(index, element) {
        valArr.push($(this).val());
		console.log(valArr);
    });
	/*点击取消变回保存，并且下方的表格不可以编辑*/
	$("#temp_cancel").on("click",function(){
		for(var i=0;i<valArr.length;i++){
			$("#temp_tables input").eq(i).val(valArr[i]);
		}
		$(this).addClass("dsn");
		$("#temp_save").addClass("dsn");
		$("#temp_edit").show();
		$("#temp_tables input").prop("readonly",true);
	})
	$("#temp_tables span").on("click",function(){
		if($(this).siblings("label").children("input").prop("readonly")==true){
			alert("请先进行编辑再删除");
			return false;
		}else{
			console.log(1); 
		}	  
	})
	$("#temp_tables .delete").on("click",function(){
		if($(this).parent("li").siblings("li").find("input").prop("readonly")==true){
			alert("请先进行编辑再删除");
			return false;
		}else{
			$(this).parent(".li_title").siblings(".li_input").remove();
			console.log(2); 
		}	
	})
	$("#temp_tables .li_input input").on("click",function(){
		if($(this).prop("readonly")==true){
			alert("请先点击编辑按钮再操作");
			return false;
		}else{
			console.log(3); 
		}	
	})
	$("#temp_tables .li_input span").on("click",function(){
		if($(this).prop("readonly")==true){
			alert("请先点击编辑按钮再操作");
			return false;
		}else{
			$(this).parent("li").remove();
			console.log(4); 
		}	
	})
});























