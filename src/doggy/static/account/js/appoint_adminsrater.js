/*------------------------------------
	指定管理员，单多店共享此文件
	zlb 2016-11-25
--------------------------------------*/
var firstParam='',
	  time=null;
	  
$(document).ready(function(e) {
   $("#nav_top_2 a").css("color","#00c5b5");
   $("#nav_top_2").css("border-bottom","solid 2px #00c5b5");
   getJson('/clinicmember/getclinicinfolist ',getClinicList);  //诊所列表 
   getJson('/clinicmember/administratorslist',getAdminList);  //诊所列表  
});

//--------------------------------------
$("#turn__han_con").on("click",function(){
	  	addToadmin();
 }); 
$("#select_staff").on("click",function(){
		searchinfo();
	});	

$(document).on("click","#depart_list label",function(){  // 科室折叠
 		if($(this).next("ul").is(':hidden') && $(this).next("ul").size()>0){
			$(this).next("ul").slideDown();
			$(this).children('img').attr("src",'/static/account/img/clinic_show_direct.png');
		}else{
			if($(this).next("ul").size()>0){
				$(this).next("ul").slideUp();
				$(this).children('img').attr("src",'/static/account/img/clinic_show_direct_t.png');
			}
		}
	});
	
$("#delete_staff_confim").click(function(){
	var params=$("#adminList").attr('data-param');
	$.ajax({
				type:"POST",
				url:'/clinicmember/deleteadmin',
				dataType: "json",
				data:JSON.parse(params),
				complete: function(){},	
				beforeSend:function(){},		
				success: function(json){
					if(json.code == 1){
						location.reload();
					}else{
						alert(json.info);	
						console.log(json);
					}
				},
				error: function(json){}
		   });	
});	


//--------------------------------------
//  扩展
//-------------------------------------- 
function trim(str){  
　　return str.replace(/(^\s*)|(\s*$)/g, "");
}
//--------------------------------------
// 查询
//--------------------------------------
function searchinfo(){
		var oldBrc=$("#search_condition").css("border-color");
		var condition='{"condition":"'+trim($("#search_condition").val())+'"}';
		if(trim($("#search_condition").val())==''){
		$("#search_condition").css("border-color","#f00");				
		time=window.setTimeout(function(){
			clearTimeout(time);
			$("#search_condition").css("border-color",oldBrc);
			},500);
		return false;	
		}
		$.ajax({
				type:"POST",
				url:'/clinicmember/administratorslist',
				dataType: "json",
				data:JSON.parse(condition),
				complete: function(){},	
				beforeSend:function(){},		
				success: function(json){
					if(json.code == 1){
					  //location.reload();
					  //console.log(json);
					  getAdminList(json);
					}else{
						alert('获取失败!');	
						console.log(json);
					}
				},
				error: function(json){}
		   });
}

//--------------------------------------
// 取管理者列表
//--------------------------------------
function getAdminList(json){
		var rows=[];
		$(".import_one").remove();
		if(typeof(json.list)!='undefined' || json.list!=null){
			$.each(json.list,function(k,v){
					var even='',delstr='';
					
					if((k+1)%2==0){
							even=' even';
					}
					var supper='超级管理员';
					if(parseInt(v.issupper)==0){
							supper='诊所管理员';
							delstr='<span>删除</span>';
					}
				 	rows.push('<div class="import_one turn_one '+even+'">');
                    rows.push('<ul class="appraval_content turn_content appoint_content">');
                    rows.push('  <li>');
                    rows.push('   <img src="/static/account/img/default.png" class="vm mt0">'+v.docname+'&nbsp;');
                    rows.push('  </li>');
                    rows.push('  <li>'+v.clinicname+'&nbsp;</li>');
                    rows.push('  <li>'+v.usernum+'&nbsp;</li>');
                    rows.push('  <li class="tc">'+supper+'&nbsp;</li>');
                    rows.push('  <li data-id="'+v.kuserid+'" data-clinicid="'+v.clinicid+'" class="resume_it">'+delstr+'</li>');
                    rows.push('</ul>');
                    rows.push('</div>');					
			});	
			$("#adminList").append(rows.join(''));
			$(".resume_it").click(function(){
					var uid=$(this).attr('data-id'),
					      cid=$(this).attr('data-clinicid'),
						  params='{"kuserid":"'+uid+'","clinicid":"'+cid+'"}';
					$("#adminList").attr('data-param',params);	  
					
					$("#delete_pop").show();
					$(".sta_man_bg").show();
				});
		}
}

//--------------------------------------
//取诊所列表
//--------------------------------------
function getClinicList(json){	 
	var tmp=[];		
	$.each(json.list,function(k,v){
		if(k==0){
				firstParam='{"clinicid":"'+v.clinicid+'"}';
		}
		tmp.push('<option value="'+v.clinicid+'">'+v.name+'</option>');
		});
	//console.log('firstParam=',firstParam);	
	getJson('/clinicmember/getclinicemployeelist',genDoctorList,firstParam);	
	$("#clincis").empty().append(tmp.join(''));	
	$("#clincis").on("change",function(k,v){
			whereObj='{"clinicid":"'+$(this).val()+'"}';
			getJson('/clinicmember/getclinicemployeelist',genDoctorList,whereObj);
		});
}

//--------------------------------------
//诊所列表改变关联到医生
//--------------------------------------
function genDoctorList(json){
	
	$("#staff_list ul").empty();		
	var tmp=[];
	try{	
			//--------------
			$.each(json.list.total,function(k,v){
				tmp.push('<li data-flag="0" data-id="'+v.doctorid+'" data-tel="'+v.mobile+'"><i></i><span class="doc_name">'+v.name+'</span><span class="dep_name" id="'+v.departmentid+'">'+v.departmentname+'</span></li>');
				});	
			$("#staff_list ul").append(tmp.join(''));	
			$("#staff_list ul").on("click","li",function(){		
					$("#staff_list ul li[data-flag='1']").removeClass('box_seled').attr('data-flag','0');
					$(this).attr('data-flag','1').addClass('box_seled');
				});		
		}catch(e){
			console.log('error=',e);
		}
		//--------------
		
		try{
			//console.log(json.list.clinicemployees);
			$("#depart_list ol").empty();	
			$.each(json.list.clinicemployees,function(k,v){
					var dept=[];
					dept.push("<li>");
					dept.push('<label class="dep_kind" data-id="'+v.departmentid+'">'+v.departmentname);
					dept.push('<img src="/static/account/img/clinic_show_direct.png">');
					dept.push('</label>');
					if(v.currentemployees!=null){
						dept.push("<ul>");
						$.each(v.currentemployees,function(k,v){
								dept.push('<li class="dept_em" data-id="'+v.doctorid+'" data-tel="'+v.mobile+'"><i></i><span class="doc_name">'+v.name+'</span></li>');
							});						
						dept.push("</ul>");						
					}
					dept.push('</li>');
					$("#depart_list ol").append(dept.join(''));				
			});
			
			$(".dept_em").on("click",function(){						
					$(".dept_em[data-flag='1']").removeClass('box_seled').attr('data-flag','0');
					$(this).attr('data-flag','1').addClass('box_seled');
				});	
			//--------------					
		}catch(e){
			console.log('error=',e);
		}
}
//--------------------------------------
// 取json通用函数 zlb 2016-11-25
//--------------------------------------
function getJson(url,callbackFunc,sWhere){	
	var info='{}';
	 if(typeof(sWhere)!='undefined'){
		 info=sWhere;
	 }
	$.ajax({
			type:"POST",
			url:url,
			dataType: "json",
			data:JSON.parse(info),
			complete: function(){},	
			beforeSend:function(){},		
			success: function(json){
				if(json.code == 1){
				   callbackFunc(json); 
				}else{
					alert(json.info);	
					//console.log(json);
				}
			},
			error: function(json){}
		})
}
//--------------------------------------
// 添加指定管理员
//--------------------------------------
function addToadmin(){
       var selObj="";
		   if($("#staff_list").is(':hidden')){
			   selObj=$("#depart_list .box_seled");		
		   }else{
			   selObj=$("#staff_list .box_seled");  
		   }
		   var clinicid=$("#clincis").val(),
				 tel=$(selObj).attr('data-tel'),
				 doctorid=$(selObj).attr('data-id');
			if(typeof(tel)=='undefined' || typeof(doctorid)=='undefined'){
				var oldBrc=$("#admin_box").css("border-color");
				$("#admin_box").css("border-color","#f00");				
				time=window.setTimeout(function(){
					clearTimeout(time);
					$("#admin_box").css("border-color",oldBrc);
					},500);
				 return false;
				}	 
				
			var params='{	"clinicid":"'+clinicid+'","kuserid":"'+doctorid+'","mobile":"'+tel+'"}';
			//console.log('params=',params);
		   
		   $.ajax({
				type:"POST",
				url:'/clinicmember/addadmin',
				dataType: "json",
				data:JSON.parse(params),
				complete: function(){},	
				beforeSend:function(){},		
				success: function(json){
					if(json.code == 1){
					  location.reload();
					   //console.log(json);
					}else{
						alert(json.info);	
					}
				},
				error: function(json){}
		   });
}

// 点击查询框中的清除小图标
$("#clearSelct").on("click",function(){
	$("#search_condition").val("");
	$(this).css("visibility","hidden");
	getJson('/clinicmember/administratorslist',getAdminList);
})
// 鼠标放入搜索框中出现清除的小图标
$("#search_condition").on("focus",function(){
	$("#clearSelct").css("visibility","visible");
})