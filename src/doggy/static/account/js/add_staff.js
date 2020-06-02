/*=========================
 2016.10.14  罗杨新增员工信息
=========================*/
jQuery.createAniCss();
/*初始化获取诊所列表*/
var ul_len=1;//默认有一个工作场所
getclinicinfolist(ul_len);
function getclinicinfolist(ul_len){
	
		type:"GET",
		url:"/clinic/getusergroupclinicinfo",
		dataType:"json",
		beforeSend: function(){
			jQuery.loading('加载中',1);
		},
		success:function(json){
			if(json.code==1){
				var clinicList=[];
				if(json.list.clinicinfo==null){
					clinicList.push({key:"暂无工作场所",val:""});
				}else{
					if(json.list.clinicinfo.length==1){
						$(".work_info_ul").eq(0).css("border-right","none");
					}
					clinicList.push({key:"未指定工作场所",val:""});
					if(json.list.chaininfo==""||json.list.chaininfo==null){
						$.each(json.list.clinicinfo,function(k,v){
							clinicList.push({key:v.clinicname,val:v.clinicid});
						})
					}else{
						clinicList.push({key:json.list.chaininfo[0].chainname,val:"1"});
						$.each(json.list.clinicinfo,function(k,v){
							clinicList.push({key:"&nbsp;&nbsp;&nbsp;&nbsp;"+v.clinicname,val:v.clinicid});
						})
					}
				}
				var listApi;
					//console.log(ul_len);
				$("#dept_"+ul_len).yayigj_downlist({
					_callBack:getDataList,
					_hiddenID:'clinicid_'+ul_len,
					_data:clinicList,
					_valtype:'text'
					},function(api){
						listApi=api;
					});
			}else{
				jQuery.showError(json.info,'信息反馈');
			}
		},
		error:function(json){
			jQuery.waring(json.info);	
		},
		complete:function(){
			jQuery.loading_close();
		}	
	})
}
//选择诊所，改变员工职位和所属科室
function getDataList(id,other){
	//console.log(other);	
	clearErro2();
	$("#"+other).siblings("input[name='clinic']").val();
	var index=$(this)[0]._hiddenID;
	index=index.substr(index.length-1,1);
	$("input[name='hideindex']").val(index);//保存当前下拉框的index
	var name=$(".worker_name").val();
	if(checkformat()==false||id==""){
		return false;
	}else if(name==""){
		$("#err_info2").html("姓名不能为空").css("visibility","visible");
		$(".worker_name").css("border","1px solid #f86d5a");
		return false;
	}else if(id==1){
		getinfolist();
	}else{
		checknamefirst();
	}
}
//获取相应诊所下的职位和部门
function getinfolist(){
	var index=$("input[name='hideindex']").val();
	//console.log(index);
	var id=$("#clinicid_"+index).val();
	var params={};
	params.info={
		clinicid:id
	}
	$.ajax({
			type:"POST",
			url:"/clinicmember/getclinicgroupandep",
			data:params,
			dataType:"json",
			beforeSend: function(){
				jQuery.loading('加载中',1);
			},
			success:function(json){ 
				if(json.code==1){
					clinicinfo(json,index);
				}else{
					$(".err_clinic").eq(index).html(json.info).css("visibility","visible");
					$(".worker_id").eq(index).val("");
					$(".worker_char").eq(index).html("<option>未指定职位</option>");
					$(".work_depart").eq(index).html("<option>未指定部门</option>");
				}
			},
			complete:function(){
				jQuery.loading_close();
			}
	 })
}
//初始化给第一个职位和部门下拉框绑定事件
$("#depart_1").yayigj_downlist({
			// _callBack:getDepartlist,
			_data:[{key:"未指定部门",val:""}],
			_valtype:'text'
			},function(api){
				listApi=api;
});
$("#office_1").yayigj_downlist({
			// _callBack:getDepartlist,
			_data:[{key:"未指定职位",val:""}],
			_valtype:'text'
			},function(api){
				listApi=api;
});
function clinicinfo(json){
		// 部门列表
		var index=$("input[name='hideindex']").val();
		//console.log(index);
		var option=[];
		if(json.list.departments==null){
			option.push({key:"未创建部门",val:""});	
		}else{
			$.each(json.list.departments,function(k,v){
				option.push({key:v.departmentname,val:v.departmentid});	
			})	
		} 
		var listApi;
		$("#depart_"+index).yayigj_downlist({
			// _callBack:getDepartlist,
			_data:option,
			_valtype:'text'
			},function(api){
				listApi=api;
		});

		// 职位列表
		var option_2=[];
		if(json.list.groups==null){
			option_2.push({key:"暂无职位",val:""});		
		}else{
			$.each(json.list.groups,function(k,v){
				option_2.push({key:v.usergroupname,val:v.usergroupname});	
			})	
		}
		$("#office_"+index).yayigj_downlist({
			// _callBack:getDutytlist,
			_data:option_2,
			_valtype:'text'
			},function(api){
				listApi=api;
			});
			//console.log(json.list.usernums[0].nextusernum);
		$("#employee_"+index).val(json.list.usernums[0].nextusernum);
	
}
//选择诊所而非连锁去判断姓名是否合法
function checknamefirst(){
	var index=$("input[name='hideindex']").val();
	var cArr=[];
	var name=$(".worker_name").val();
	var params={};
	cArr.push({clinicid:$("#clinicid_"+index).val()});
	params.info={
			cids:cArr,
			name:name,
			type:1
	};
	$.ajax({
			type:"POST",
			url:"/clinicmember/checkdoctorname",
			data:params,
			dataType:"json",
			beforeSend: function(){},
			success:function(json){ 
				if(json.code==1){
					getinfolist();
				}else{
					//console.log(index);
					$(".err_clinic").eq(index-1).html(json.info).css("visibility","visible");
					$(".worker_id").eq(index-1).val("");
					$(".worker_char").eq(index-1).html("<option>未指定职位</option>");
					$(".work_depart").eq(index-1).html("<option>未指定部门</option>");
				}
			},
			complete:function(){}
	})
}

/*点击增加多点执业*/
$("#add_selc").on("click",function(){
	ul_len+=1;
	var clone='<ul class="work_info_ul clone_ul">';
			clone+='<img src="/static/account/img/close.png" class="close_ul">';
			clone+='<li><span><img src="/static/account/img/imporant.png">工作场所</span><div class="worker_clinic"   id="dept_'+ul_len+'"  value=""></div>';
			clone+='<input type="hidden" name="clinic" id="clinicid_'+ul_len+'">';
			clone+='<p class="errinfo err_clinic" id="err_clinic">请选择工作场所</p></li>';
			clone+='<li><span><img src="/static/account/img/imporant.png">员工编号</span><input type="text" id="employee_'+ul_len+'"   class="worker_id" name="worker_id" />';
			clone+='<p class="errinfo err_id" id="err_id"></p></li>';
			clone+='<li><span><img src="/static/account/img/imporant.png">员工职位</span>';
			clone+='<div class="worker_char" id="office_'+ul_len+'">未指定职位</div>';
			clone+='<input type="hidden" name="char" id="char_'+ul_len+'">';
			clone+='<p class="errinfo err_char" id="err_char"></p></li>';
			clone+='<li><span>&nbsp;&nbsp;所属部门</span><div class="work_depart" id="depart_'+ul_len+'">未指定部门</div></li>';
			clone+='<input type="hidden" name="deprt" id="deprt_'+ul_len+'">';
			clone+='<li class="mb0" id="jobStatus"><span>&nbsp;&nbsp;在职状态</span>';
			clone+='<span class="">';
			clone+='<input type="radio" name="status'+ul_len+'" value="0" checked="checked" id="in'+ul_len+'"><label for="in'+ul_len+'"></label><label for="in'+ul_len+'">&nbsp;&nbsp;在职</label></span>';
			// clone+='<span class="mL50">';
			// clone+='<input type="radio" name="status'+iCount+'" value="1" id="out'+iCount+'"><label for="out'+iCount+'"></label><label for="out'+iCount+'">&nbsp;&nbsp;离职<b class="tips">(离职员工不能登录系统)</b></label></span>';
			clone+='</li>';
			clone+='</ul>';
			$(".add_selc").before(clone);
			getclinicinfolist((ul_len));	//获取诊所列表	
})
/*保存  新增员工信息*/
$("#add_staff_save").on("click",function(){
		var login_phone=$("#login_phone").val()//创建账号
		var phone=$(".worker_phone").val();//手机号
		var id=$(".worker_id");
		var clinicid=$(".worker_clinic");//工作诊所id
		var character=$(".worker_char");//工作职位text
		var depart=$(".work_depart");//所属科室id
		var stopped=$(".mb0");//在职状态
		if(checkformat()==false){//检测账号格式
			return;
		}else if(checkinfo()==false){//检测姓名和工作信息
			return;
		}
			var cArr=[];	
			for(var i=0;i<clinicid.length;i++){
				cArr.push($("input[name='clinic']").eq(i).val());
			}
			if(cArr.length==1&&cArr[0]=="1"){
				checknum();
			}else{
				checknamelast();//检测姓名
			}	
})
//最后保存的时候判断姓名是否合法
function checknamelast(){
	var len=$(".worker_clinic").length;
	var index=$("input[name='hideindex']").val();
	var name=$(".worker_name").val();
	var cArr=[];
	var params={};
	for(var i=1;i<(len+1);i++){
		var clinicid=$("#dept_"+i+"_down_list").find("p[data-flag='1']").attr("value");
		if(clinicid!=1){
			cArr.push({clinicid:clinicid});
		}
	}
	params.info={
		cids:cArr,
		name:name,
		type:1
	};
	$.ajax({
			type:"POST",
			url:"/clinicmember/checkdoctorname",
			data:params,
			dataType:"json",
			beforeSend: function(){},
			success:function(json){ 
				if(json.code==1){
					checknum();
				}else{
					$(".err_clinic").eq(index-1).html(json.info).css("visibility","visible");
					$(".worker_id").eq(index-1).val("");
					$(".worker_char").eq(index-1).html("<option>未指定职位</option>");
					$(".work_depart").eq(index-1).html("<option>未指定部门</option>");
				}
			},
			complete:function(){}
	})
}
//最后保存的时候在判断    工号是否合法
function checknum(){
	var id=$(".worker_id");
	var clinicid=$(".worker_clinic")
	var pjson={};
	var infoList=[];
	var returnInfo="";
	checkinfo();
	for(var i=0;i<id.length;i++){
			var infoObj={};
			infoObj.usernum=id.eq(i).val();
			infoObj.clinicid=$("input[name='clinic']").eq(i).val();
			infoObj.doctorid="";
			infoList.push(infoObj);
	}
	pjson.info=infoList;
		$.ajax({
			type:"POST",
			url:"/clinicmember/checkusernum",
			dataType:"json",
			data:pjson,
			beforeSend:function(data){
				// $("#loading_info").show();
			},
			error:function(data){
				// jQuery.postFail('fadeInUp',data.info);
				jQuery.showError(data.info,'信息反馈');
			},
			success:function(data){
				//console.log(data);
				if(data.code==1){
					saveinfo();
				}else{
					var indexerr=data.info.split(",")[0];
					var err=data.info.split(",")[1];
					$(".err_id").eq(indexerr).html(err).css("visibility","visible");
					return false;
				}
			},
			complete:function(data){
				$("#add_staff_save").val("保存").removeAttr("disabled").removeClass("ac_btn_bf_disable");;
			},
		})
}
//判断工作场所、员工编号、员工职位
function checkinfo(){
	var Iname=$(".worker_name");//姓名
	var clinicid=$(".worker_clinic");//工作场所id
	var character=$(".worker_char");//工作职位text
	var num=$(".worker_id");//员工编号
	var clinicListId=new Array();//判断诊所选择是否重复
	if(Iname.val()==""){
		Iname.css("border","1px solid #f86d5a");
		$("#err_info2").html("姓名不能为空").css("visibility","visible");
		return false;
	}
	for(var i=0;i<clinicid.length;i++){
			var cid=$("input[name='clinic']").eq(i).val();
			clinicListId.push(cid);
			if(cid==""){
				$(".err_clinic").eq(i).html("工作场所未选择！").css("visibility","visible");
				$(".worker_clinic").eq(i).css("border","1px solid #f86d5a");
				return false;
			}else if(num.eq(i).val()==""){
				$(".err_id").eq(i).html("员工编号不能为空！").css("visibility","visible");
				$(".worker_id").eq(i).css("border","1px solid #f86d5a");
				return false;
			}else if(character.eq(i).text()==""||character.eq(i).text()=="未指定职位"){
				$(".err_char").eq(i).html("员工职位不能为空！").css("visibility","visible");
				$(".worker_char").eq(i).css("border","1px solid #f86d5a");
				return false;
			}else if(isRepeat(clinicListId)==true){
				$(".err_clinic").eq(i).html("不能选择相同工作场所！").css("visibility","visible");
				clinicid.eq(i).css("border","1px solid #f86d5a");
				return false;
			}	
	}
}

function saveinfo(){
	var id=$(".worker_id");
	var login_phone=$("#login_phone").val()//创建账号
	var Iname=$(".worker_name").val();//姓名
	var phone=$(".worker_phone").val();//手机号
	var birth=$(".worker_birthday").val();//生日
	var sex=$(".sex input[type='radio']:checked").val();
	var clinicid=$(".worker_clinic");//工作诊所id
	var character=$(".worker_char");//工作职位text
	var depart=$(".work_depart");//所属科室id
	var stopped=$(".mb0");//在职状态
	var clinicList=new Array();//单店版和的连锁版都是需要诊所作为数组
	var clinicListId=new Array();//判断诊所选择是否重复
	var clinicInfo={};
	checkinfo();
	for(var i=0;i<clinicid.length;i++){
			var cid=$("input[name='clinic']").eq(i).val();
			var deprt=$(".work_depart").eq(i).attr("data-val");
			clinicListId.push(cid);
					clinicInfo={
						"clinicid":cid,
						"clinicname":$.trim(clinicid.eq(i).text()),
						"duty":character.eq(i).text(),
						"departmentid":deprt,
						"usernum":id.eq(i).val(),
						"stopped":stopped.eq(i).find("input[type='radio']:checked").val()
					}
					clinicList.push(clinicInfo);
	}
	var pjson2={
		"info":{
			"mobile":login_phone,
			"name":Iname,
			"cmobile":phone,
			"sex":sex,
			"birthday":birth,
			"clinicinfo":clinicList,
			}
		};
	$.ajax({
		type:"POST",
		url:"/clinicmember/savemembersingle",
		data:pjson2,
		dataType:"json",
		beforeSend: function(){
			jQuery.loading('加载中',1);
			$("#add_staff_save").val("保存中..").attr("disabled",true).addClass("ac_btn_bf_disable");
		},
		success:function(json){
		//	console.log(json);
			if(json.code=="1"){
				window.location.href="/clinic/index";
			}
			else{
				jQuery.postFail('fadeInUp',json.info);
			}
		},
		error:function(json){
			jQuery.waring('网络错误！请重试');	
		},
		complete:function(json){
			jQuery.loading_close();
			$("#add_staff_save").val("保存").removeAttr("disabled").removeClass("ac_btn_bf_disable");
		}	
	})
}
//点击关闭图标删除元素
$(document).on("click",".close_ul",function(){
	var index=$(this).index()+1;
	jQuery.pop_window_modal_dialog({
			_popmothod:'fadeInUp', 
			_warnTxt:'该诊所信息将被删除,是否确认删除?',
			_icotype:3,  //1警告 2提醒 3询问
			_title:'是否删除',	
			_skintype:0,	//0为删除色 1为正常色				
			_btnText:new Array("确定","取消"),
			_closemothod:'fadeOutUp', 
			_okEvent:function(e){	
				jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
				$(".work_info_ul").eq(index).remove();
				},
			_cancelEvent:function(e){
				jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
				}						
			},'232546465456'); 
});
//鼠标放进去或选择了错误提示消失
$(document).on("focus",".worker_name,.worker_phone",function(){
	clearErro1();
});
function clearErro2(){
	$(".worker_clinic,.worker_char").siblings(".errinfo").css("visibility","hidden");
	$(".worker_clinic,.worker_char").css("border","1px solid #e0e0e0");
}
function clearErro1(){
	$(".worker_phone,.worker_id").siblings(".errinfo").css("visibility","hidden");
	$(".worker_name").siblings(".err_info").css("visibility","hidden");
	$(".worker_name,.worker_phone,.worker_id").css("border","1px solid #e0e0e0");
}

/*光标离开创建的input中出现提示信息，离开消失,正确则填充手机号码*/
$(".login_phone").on({
	blur:checkaddmobile,
	focus:function(){
		$("#err_info").html("").css("visibility","hidden");
		$(this).css("border","1px solid #e0e0e0");
	}
})
//检测账号格式
function checkformat(){
	var mobile=$("#login_phone").val();
	if(mobile==""){
		$("#err_info").html("手机号码不能为空！请重新输入").css("visibility","visible");
		$("#login_phone").css("border","1px solid #f86d5a");
		return false;
	}
	else if(!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))){
		$("#err_info").html("手机号码格式错误！请重新输入").css("visibility","visible");
		$("#login_phone").css("border","1px solid #f86d5a");
		return false;
	}
	return;
}
function checkaddmobile(){
	var mobile=$("#login_phone").val();
	var params={};
	if(checkformat()==false){
		return false;
	}else{
		params.info={
			mobile:mobile
		},
		$.ajax({
			type:"POST",
			url:"/clinicmember/checkchainmobile",
			dataType:"json",
			data:params,
			beforeSend:function(){},
			success:function(json){
				if(json.code==1){
					$(".worker_phone").val(mobile);
				}else{
					$("#err_info").html(json.info).css("visibility","visible");
				}
			},
			error:function(json){},
			complete:function(){},
		});
		
	}
}
//日历插件
$(".worker_birthday").yayigj_date_Sel({varType:'val'});
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






