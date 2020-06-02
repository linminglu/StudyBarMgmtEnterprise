// JavaScript Document
/*====================================
2016.9.29 罗杨 编辑员工资料
=====================================*/
doctorID=getUrlParam("did");
clinicID=getUrlParam("cid");
bindmobile=getUrlParam("bindmobile");
//获取员工信息
getInfo();
jQuery.createAniCss();
//---------------------------------
// 保存修改
//---------------------------------
$("#add_staff_save").on("click",function(){
	var clinicListId=[];
	var clinicid=$(".worker_clinic");//工作诊所id
	var character=$(".worker_char");//工作职位
	var depart=$(".work_depart");//所属科室id
	var num=$(".worker_id");
	//var stop=$(".mb0");离职状态
	var numList=[];//验证工号

	var ckname={};//验证诊所内的名称
	var cidArr=[];//诊所id列表
	var name=$(".worker_name");
		if(name.val()==""){
			name.css("border","1px solid #f86d5a");
			$("#err_info2").html("姓名不能为空！").css("visibility","visible");
		}
		for(var i=0;i<clinicid.length;i++){
				clinicListId.push(clinicid.eq(i).attr("data-id"));
				if(clinicid.eq(i).attr("data-id")==""||clinicid.eq(i).text()=="未指定工作场所"){
					$(".err_clinic").eq(i).html("工作场所不能为空！").css("visibility","visible");
					$(".worker_clinic").eq(i).css("border","1px solid #f86d5a");
					return false;
				}if(character.eq(i).text()=="未指定职位"){
					$(".err_char").eq(i).html("员工职位不能为空！").css("visibility","visible");
					$(".worker_char").eq(i).css("border","1px solid #f86d5a");
					return false;
				}if(num.eq(i).val()==""){
					$(".err_id").eq(i).html("员工工号不能为空！").css("visibility","visible");
					num.eq(i).css("border","1px solid #f86d5a");
					return false;
				}else{
					if(isRepeat(clinicListId)==true){
						$(".err_clinic").eq(i).html("不能选择相同工作场所！").css("visibility","visible");
						clinicid.eq(i).css("border","1px solid #f86d5a");
						return false;
					}
				}
				var numparam={};
					numparam.usernum=num.eq(i).val();
					numparam.clinicid=clinicid.eq(i).attr("data-id");
					numparam.doctorid=doctorID;
					numList.push(numparam);
					// console.log(clinicid.eq(i).attr("data-id"));
				if(clinicid.eq(i).attr("data-id")!="1"){
					cidArr.push({clinicid:clinicid.eq(i).attr("data-id")});
				}
		}
		//console.log(cidArr.length);
		if(cidArr.length==0){
			checknum(numList);
		}else{
			
			ckname.info={
				name:name.val(),
				type:2,
				doctorid:doctorID,
				cids:cidArr,
			}
			$.ajax({
				type:"POST",
				url:"/clinicmember/checkdoctorname",
				dataType:"json",
				data:ckname,
				success:function(result){
					if(result.code==1){
						checknum(numList);
					}else{
						jQuery.showError(result.info,"信息反馈");
					}
				},
				error:function(result){
					jQuery.showError(result.info,'信息反馈');
				}
			})
		}
});
function checknum(numList,pjson1){
	var pjson1={};//验证工号
	pjson1.info=numList;
	$.ajax({
		type:"POST",
		url:"/clinicmember/checkusernum",
		dataType:"json",
		data:pjson1,
		beforeSend:function(data){},
		error:function(data){
			jQuery.postFail('fadeInUp',"网络错误!请重试");
		},
		success:function(data){
			if(data.code==0){					
				var indexerr=data.info.split(",")[0];
				var indexinfo=data.info.split(",")[1];
				$(".worker_clinic").eq(indexerr).siblings(".err_clinic").html(indexinfo).css("visibility","visible");
			}else{
				saveinfo();
			}
		},
		complete:function(){
			$("#add_staff_save").val("保存").removeAttr("disable");
		}
	})
}

// $("#dept_"+i+"_down_list").find("p[data-flag='1']").attr("value");

function saveinfo(){
	var param=[];
	$(".work_info_ul").each(function(index, element) {
		// console.log($("#depart_"+1+"_down_list").length)
		param.push({
			clinicid:$(".worker_clinic").eq(index).attr("data-id"),
			clinicname:$.trim($(".worker_clinic").eq(index).attr("data-name")),
			departmentid:$("#depart_"+(index+1)).attr("data-val"),
			duty:$(".worker_char").eq(index).text(),
			birthday:$(".worker_birthday").val(),
			doctorid:doctorID,
			mobile:$(".worker_phone").val(),
			name:$(".worker_name").val(),
			sex:($(".sex").find("input[type='radio']:checked").val()||null),
			usernum:$(".worker_id").eq(index).val(),
			stopped:$(".mb0").eq(index).find("input[type='radio']:checked").val(),
		});
	});
		var pjson2={};
		pjson2.info=param;
		$.ajax({
			type:"POST",
			url:"/clinic/clinicemployeesave",
			dataType:"json",
			data:pjson2,
			beforeSend: function(){
				$("#add_staff_save").val("保存中..").attr("disable",true).addClass("ac_btn_bf_disable");
			},
			success:function(json){
				
				if(json.code==1){
					document.location='/clinic/index';
				}else{
					// jQuery.postFail('fadeInUp',json.info);					
					jQuery.showError(json.info,"信息反馈");
				}
			},
			error:function(json){
				// jQuery.waring('网络错误！请重试');	
				jQuery.showError(json.info,"信息反馈");
			},
			complete:function(json){
				$("#add_staff_save").val("保存").attr("disable",false).removeClass("ac_btn_bf_disable");
			}	
		})
}

var ul_len=0;
//初始化进入页面获得信息
function getInfo(){
	var pjson={};
	pjson.info={
		doctorid:doctorID,
		clinicid:clinicID,
		umobile:bindmobile
	}
	$.ajax({
		type:"POST",
		url:"/clinic/clinicemployeeinfo",
		dataType:"json",
		data:pjson,
		beforeSend: function(){
			 jQuery.loading('加载中',1);
		},
		success: function(result){
			if(result.list==null){

			}else{
				//登陆账号
				 $("#login_phone").val(bindmobile);
				$.each(result.list,function(k,v){
					ul_len+=1;
					//当前信息
					var name=v.basicinfo[0].name;
					var phone=v.basicinfo[0].mobile;
					if(phone==""||phone==null){
						phone=bindmobile;
					}
					var birthday=v.basicinfo[0].birthday;
					var sex=v.basicinfo[0].sex;
					//工作信息
					var department_infolist=v.alldepartment;//科室列表
					var position_infolist=v.allusergroupname;//职位列表
					var clinicname=v.name;//当前诊所名称
					var clinicid=v.clinicid;//当前诊所id
					var work_id=v.currentinfo[0].usernum;//当前编号
					var worker_char=v.currentinfo[0].duty;//当前职位
					var depart=v.currentinfo[0].departmentname;//当前科室名称
					var depart_id=v.currentinfo[0].departmentid;//当前科室id
					var stopped=v.currentinfo[0].stopped;
					var curissupper=v.currentinfo[0].curissupper;//是否可以被更改 1不能，0可以
					$(".worker_name").val(name);
					$(".worker_phone").val(phone);
					$(".worker_birthday").val(birthday);
					$(".sex").find("input[value="+sex+"]").attr("checked","true");

					//职位列表和当前的职位
					var strDuty=[];
					if(position_infolist==null){
						strDuty.push({key:"暂无职位",val:""});
					}
					else{
						strDuty.push({key:"未指定职位",val:""});
						$.each(position_infolist,function(key,value){
							strDuty.push({key:value.duty,val:value.duty});
						})
					}
					//科室列表和当前的科室
					var strDepart=[];
					
					if(department_infolist==null){
						strDepart.push({key:"未创建部门",val:""});
					}
					else{
						strDepart.push({key:"未指定部门",val:""});
						$.each(department_infolist,function(key,value){
							strDepart.push({key:value.departmentname,val:value.departmentid});
						})	
					}
					var clone_ul="";
					k=parseInt(k);
					if(curissupper==1){
						//职位不能修改，没有离职
							var work_info_ul="";
							work_info_ul+='<ul class="work_info_ul">';
								work_info_ul+='<img src="/static/account/img/close.png" class="close_ul">';
								work_info_ul+='<li><span>工作场所</span>';
								work_info_ul+='<input type="text" class="worker_clinic ronly" id="dept_'+(k+1)+'" readonly="">';
								work_info_ul+='<input type="hidden" name="clinic" id="clinicid_'+(k+1)+'">';
								work_info_ul+='<p class="errinfo err_clinic" id="err_clinic">请选择工作场所</p></li>';
								work_info_ul+='<li><span>员工编号</span>';
								work_info_ul+='<input type="text" class="worker_id"  name="worker_id" id="employee_'+(k+1)+'">';
								work_info_ul+='<p class="errinfo err_id" id="err_id"></p></li>';
								work_info_ul+='<li><span>员工职位</span>';
								// work_info_ul+='<input type="text" class="worker_char ronly" id="office_'+(k+1)+'" value="'+worker_char+'" readonly/>';
								work_info_ul+='<div class="worker_char ronly" id="office_'+(k+1)+'">'+worker_char+'</div>';
								work_info_ul+='<input type="hidden" name="char" id="char_'+(k+1)+'">';
								work_info_ul+='<p class="errinfo err_char" id="err_char"></p></li>';
								work_info_ul+='<li><span>所属部门</span>';
								work_info_ul+='<div class="work_depart" id="depart_'+(k+1)+'">'+strDepart+'</div>';
								work_info_ul+='<input type="hidden" name="deprt" id="deprt_'+(k+1)+'"></li>';
								work_info_ul+='<li class="mb0" id="jobStatus"><span>在职状态</span>';
								work_info_ul+='<span class="">';
								work_info_ul+='<input type="radio" name="status'+(k+1)+'" value="0" id="in'+(k+1)+'"><label for="in'+(k+1)+'"></label><label for="in'+(k+1)+'">&nbsp;&nbsp;在职</label></span>';
								work_info_ul+='</li></ul>';
						$("#ddInfo").append(work_info_ul); 
					}else{
						if(k!=0){clone_ul="clone_ul"}
						var work_info_ul="";
							work_info_ul+='<ul class="work_info_ul '+clone_ul+'">';
								work_info_ul+='<img src="/static/account/img/close.png" class="close_ul">';
								work_info_ul+='<li><span>工作场所</span>';
								work_info_ul+='<input type="text" class="worker_clinic ronly" id="dept_'+(k+1)+'" readonly="">';
								work_info_ul+='<input type="hidden" name="clinic" id="clinicid_'+(k+1)+'">';
								work_info_ul+='<p class="errinfo err_clinic" id="err_clinic">请选择工作场所</p></li>';
								work_info_ul+='<li><span>员工编号</span>';
								work_info_ul+='<input type="text" class="worker_id"  name="worker_id" id="employee_'+(k+1)+'">';
								work_info_ul+='<p class="errinfo err_id" id="err_id"></p></li>';
								work_info_ul+='<li><span>员工职位</span>';
								work_info_ul+='<div class="worker_char" id="office_'+(k+1)+'"></div>';
								work_info_ul+='<input type="hidden" name="char" id="char_'+(k+1)+'">';
								work_info_ul+='<p class="errinfo err_char" id="err_char"></p></li>';
								work_info_ul+='<li><span>所属部门</span>';
								work_info_ul+='<div class="work_depart" id="depart_'+(k+1)+'"></div>';
								work_info_ul+='<input type="hidden" name="deprt" id="deprt_'+(k+1)+'"></li>';
								work_info_ul+='<li class="mb0" id="jobStatus"><span>在职状态</span>';
								work_info_ul+='<span class="">';
								work_info_ul+='<input type="radio" name="status'+(k+1)+'" value="0" id="in'+(k+1)+'"><label for="in'+(k+1)+'"></label><label for="in'+(k+1)+'">&nbsp;&nbsp;在职</label></span>';
								work_info_ul+='<span class="mL50">';
								work_info_ul+='<input type="radio" name="status'+(k+1)+'" value="1" id="out'+(k+1)+'"><label for="out'+(k+1)+'"></label><label for="out'+(k+1)+'">&nbsp;&nbsp;离职<b class="tips">(离职员工不能登录系统)</b></label></span>';
								work_info_ul+='</li></ul>';
						$("#ddInfo").append(work_info_ul);
						var listApi;
						$("#office_"+(k+1)).yayigj_downlist({
							_hiddenID:'char_'+(k+1),
							_data:strDuty,
							_valtype:'text'
							},function(api){
								listApi=api;
						});
						listApi.gotoval(worker_char); //根据值定位
					}	
						var listApi2;		
						$("#depart_"+(k+1)).yayigj_downlist({
							_hiddenID:'deprt_'+(k+1),
							_data:strDepart,
							_valtype:'text'
							},function(api){
								listApi2=api;
						});
						listApi2.gotoval(depart_id); //根据值定位
						$(".mb0").eq(k).find("input[value='"+stopped+"']").attr("checked","checked");
						$("#employee_"+(k+1)).val(work_id);
						$("#depart_"+(k+1)).attr("data-val",depart_id);
						$("#dept_"+(k+1)).val(clinicname);
						$("#dept_"+(k+1)).attr("data-id",clinicid);
						$("#dept_"+(k+1)).attr("data-name",clinicname);//保存的时候统一获取data-name属性来获得诊所名称
				})//each结束
			}
		},
		error: function(json){},
		complete: function(json){
			jQuery.loading_close();
		},
	})
}
//添加多点执业
$("#add_selc").on("click",function(){
	var name=$(".worker_name");
	ul_len+=1;
	var clone='<ul class="work_info_ul clone_ul">';
			clone+='<img src="/static/account/img/close.png" class="close_ul">';
			clone+='<li><span>工作场所</span><div class="worker_clinic"   id="dept_'+ul_len+'"  value=""></div>';
			clone+='<input type="hidden" name="clinic" id="clinicid_'+ul_len+'">';
			clone+='<p class="errinfo err_clinic" id="err_clinic">请选择工作场所</p></li>';
			clone+='<li><span>员工编号</span><input type="text" id="employee_'+ul_len+'"   class="worker_id" name="worker_id" />';
			clone+='<p class="errinfo err_id" id="err_id"></p></li>';
			clone+='<li><span>员工职位</span>';
			clone+='<div class="worker_char" id="office_'+ul_len+'"></div>';
			clone+='<input type="hidden" name="char" id="char_'+ul_len+'">';
			clone+='<p class="errinfo err_char" id="err_char"></p></li>';
			clone+='<li><span>所属部门</span><div class="work_depart" id="depart_'+ul_len+'"></div>';
			clone+='<input type="hidden" name="deprt" id="deprt_'+ul_len+'"></li>';
			clone+='<li class="mb0" id="jobStatus"><span>在职状态</span>';
			clone+='<span class="">';
			clone+='<input type="radio" name="status'+ul_len+'" value="0" checked="checked" id="in'+ul_len+'"><label for="in'+ul_len+'"></label><label for="in'+ul_len+'">&nbsp;&nbsp;在职</label></span>';
			clone+='<span class="mL50">';
			clone+='<input type="radio" name="status'+ul_len+'" value="1" id="out'+ul_len+'"><label for="out'+ul_len+'"></label><label for="out'+ul_len+'">&nbsp;&nbsp;离职<b class="tips">(离职员工不能登录系统)</b></label></span>';
			clone+='</li>';
			clone+='</ul>';
			$(".add_selc").before(clone);
			//console.log(ul_len);
			var listApi;
				$("#office_"+ul_len).yayigj_downlist({
					_hiddenID:'char_'+ul_len,
					_data:[{key:"未指定职位",val:""}],
					_valtype:'text'
					},function(api){
						listApi=api;
				});
			var listApi2;		
				$("#depart_"+ul_len).yayigj_downlist({
					_hiddenID:'deprt_'+ul_len,
					_data:[{key:"未指定部门",val:""}],
					_valtype:'text'
					},function(api){
						listApi2=api;
				});
		var pjson={};
		pjson.info={
			doctorid:doctorID
		};
		$.ajax({
				type:"GET",
				url:"/clinic/getusergroupclinicinfo",
				dataType:"json",
				// data:pjson,
				beforeSend: function(){
					jQuery.loading('加载中',1);
				},
				success:function(json){
					if(json.code==1){
						clinicJson(json,ul_len)
					}
				},
				error:function(json){
					jQuery.waring(json.info);	
				},
				complete:function(json){
					jQuery.loading_close();
				}	
		})
		
})
//获得诊所列表
function clinicJson(json,ul_len){
		var param=[];
		param.push({key:"未指定工作场所",val:""});
		if(json.list.chaininfo==""||json.list.chaininfo==null){
			$.each(json.list.clinicinfo,function(k,v){
				param.push({key:v.clinicname,val:v.clinicid});
				$("#dept_"+ul_len).attr("data-id",v.clinicid);
				$("#dept_"+ul_len).attr("data-name",v.clinicname);
			})
		}else{
			param.push({key:json.list.chaininfo[0].chainname,val:"1"});
			$.each(json.list.clinicinfo,function(k,v){
				param.push({key:"&nbsp;&nbsp;&nbsp;&nbsp;"+v.clinicname,val:v.clinicid});
				$("#dept_"+ul_len).attr("data-id",v.clinicid);
				$("#dept_"+ul_len).attr("data-name",v.clinicname);
			})
		}

		var listApi;
		$("#dept_"+ul_len).yayigj_downlist({
			_callBack:changeClinic,
			_data:param,
			_valtype:'text'
			},function(api){
				listApi2=api;
			}
		);
}

//选择诊所获得相应的职位和科室
function changeClinic(id,other){
	$("#"+other).attr("data-id",id);
	$("#"+other).attr("data-name",$("#"+other).text());
	 var mobile=$("#login_phone").val();
	//先判断账号是否为空，如果为空则不检测账号，否则要先检测账号是否合法，在获取诊所下的信息
	if(mobile==""||mobile==null||mobile==undefined||id==1){
		getinfo(id,other);
	}else{
		checkmobile(id,other);
	}
	$("#"+other).siblings(".errinfo").css("visibility","hidden");
	$("#"+other).css("border","1px solid #e0e0e0");
}
//检测手机号码是否被占用
function checkmobile(id,other){
	//console.log(other)
		var clinicID=id;
		var mobile=$("#login_phone").val();
		var num=other.substr(other.length-1,1);
		if(clinicID==""){
			return false;
		}
		var pjson={};
		pjson.info={
			clinicid:clinicID,
			mobile:mobile,
		}
		$.ajax({
			type:"POST",
			url:"/clinicmember/checkaddmobile",
			dataType:"json",
			data:pjson,
			beforeSend: function(){},
			success:function(json){
				//console.log(json);
				if(json.code==1){
					// getinfo(id,other);
					checkname(id,other);
				}else{
					//如果被占用下面的职位和部门信息被清空
					$(".worker_clinic").eq((num-1)).siblings(".err_clinic").html(json.info).css("visibility","visible");
					$(".worker_id").eq(num-1).val("");
					$(".worker_char").eq(num-1).html("未指定职位");
					$(".work_depart").eq(num-1).html("未指定部门");
				}
			},
			error:function(json){
				jQuery.waring('网络错误！请重试');	
			},
			complete:function(json){}	
		})
}
function getinfo(id,other){
	var clinicID=id;
	var mobile=$("#login_phone").val();
	$("#"+other).attr("data-id",clinicID);
	var num=other.substr(other.length-1,1);
	if(clinicID==""){
		return false;
	}
	var pjson2={};
	pjson2.info={
		clinicid:clinicID,
	}
	$.ajax({
		type:"POST",
		url:"/clinicmember/getclinicgroupandep",
		dataType:"json",
		data:pjson2,
		beforeSend: function(){
			jQuery.loading('加载中',1);
		},
		success:function(json){
			//console.log(json);
			if(json.code==1){
				//职位
				var str=[];
				if(json.list.groups==""||json.list.groups==null){
					str.push({key:"暂无职位",val:""});
				}else{
					$.each(json.list.groups,function(k,v){
						str.push({key:v.usergroupname,val:v.usergroupname})
					})
				}
				$("#office_"+num).yayigj_downlist({
					_data:str,
					_valtype:'text'
				},function(api){});
				
				//科室
				var str2=[];
				if(json.list.departments==""||json.list.departments==null){
						str2.push({key:"未创建部门",val:""});
				}else{
					$.each(json.list.departments,function(k,v){
						str2.push({key:v.departmentname,val:v.departmentid});
					})
				}
				$("#depart_"+num).yayigj_downlist({
					_data:str2,
					_valtype:'text'
					},function(api){});
				$("#employee_"+num).val(json.list.usernums[0].nextusernum);
			}else{
				// console.log(num);
				$(".err_clinic").eq((num-1)).html(json.info).css("visibility","visible");
				$(".worker_id").eq(num-1).val("");
				$(".worker_char").eq(num-1).html("未指定职位");
				$(".work_depart").eq(num-1).html("未指定部门");
			}
		},
		error:function(json){
			jQuery.waring(json.info);	
		},
		complete:function(json){
			jQuery.loading_close();
		}	
	})
}
//姓名
function checkname(id,other){
	var cidArr=[];
	cidArr.push({clinicid:id});
	var ckname={};
	ckname.info={
		name:$(".worker_name").val(),
		type:2,
		doctorid:doctorID,
		cids:cidArr,
	}
	$.ajax({
		type:"POST",
		url:"/clinicmember/checkdoctorname",
		dataType:"json",
		data:ckname,
		success:function(result){
			if(result.code==1){
				// checknum(numList);
				getinfo(id,other)
			}else{
				// jQuery.showError(result.info,"信息反馈");
				// console.log(other);
				$("#"+other).siblings(".err_clinic").html(result.info).css("visibility","visible");
			}
		},
		error:function(result){
			jQuery.showError(result.info,'信息反馈');
		}
	})
}
// 点击工作信息区删除多点执业信息
$(document).on("click",".close_ul",function(){
	var index=$(".close_ul").index(this);
		jQuery.showDel('诊所信息将被删除，确认是否删除?','删除提醒',
		function(){
			jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
			$("body").css("overflow","scroll");
			$(".work_info_ul").eq(index).remove();
			},
		function(){
			//代码
			jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
			});
		
})

//日历控件
$(".worker_birthday").each(function(index, element) {
    $(element).attr('id','bir_'+index);
	 $(element).yayigj_date_Sel({varType:'val'});
});
//鼠标聚焦进去错误提示消失
$(document).on("focus",".worker_char,.worker_id",function(){
	$(this).siblings(".errinfo").css("visibility","hidden");
	$(this).css("border","1px solid #e0e0e0");
})
$(".worker_name").on("focus",function(){
	$(this).siblings(".err_info").css("visibility","hidden");
	$(this).css("border","1px solid #e0e0e0");
})


//获取url中的参数
function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg);  //匹配目标参数
	if (r != null) return unescape(r[2]); return null; //返回参数值
}

//判断是否有重复元素
function isRepeat(arr) {
   var hash = {};
   for(var i in arr) {
       if(hash[arr[i]])
       {
           return true;
       }
       // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
       hash[arr[i]] = true;
    }
   return false;
}

