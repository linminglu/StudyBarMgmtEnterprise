/*============================
2016.10-18 罗杨   员工列表获取
=========================*/
var headObj=$('#info_head'),_top=0;
$(document).ready(function(){
	_top=headObj.offset().top;
	//alert(_top);
	getStaffLists(null,null,null,null,null);//初始化获取员工列表
	getchainduty();//初始化获取筛选条件中的职位

	$("#pagerRow").yayigj_downlist({
		_callBack:changePage,
		 _hiddenID:'pageid',
		 _valtype:'text',
		_data:[{'key':'20','val':"20"},
				{'key':'50','val':"50"},
				{'key':'100','val':"100"}]				 
		},function(api){
			
		});	
	//表头固定	
	$(document).scroll(function(e){
       if($(document).scrollTop()>_top){		   		
			headObj.css('transform','translateY('+($(this).scrollTop()-_top)+'px)');	
		}else{
			headObj.css('transform','');
		}	
		});
	//切换每页显示条数
	function changePage(id){
		$("#pageCurr").val(1);
		search_con(0);
	}
});

//-------------------
//禁滚 zlb
//-------------------
function disableScroll(evt,obj){
	var scrollTop = obj.scrollTop,scrollHeight = obj.scrollHeight,height = obj.clientHeight;
	var delta = (evt.originalEvent.wheelDelta) ? evt.originalEvent.wheelDelta : -(evt.originalEvent.detail || 0);  
	if ((delta > 0 && scrollTop <= delta) || (delta < 0 && scrollHeight - height - scrollTop <= -1 * delta)) {
		obj.scrollTop = delta > 0? 0: scrollHeight;
		evt.preventDefault();
	}  
}

var pageNum=4,defaultTotalcount=-1;
function getStaffLists(name,letter,cids,duty,active,code){
	var pagesize=$("#pageid").val();
	var currentpage=$("#pageCurr").val();
	// 筛选的操作传code=1； 其他分页的则传code=0
	if(code==1){
		currentpage=1;
	}
	var pjson={
			info:{
				"name":name,
				"letter":letter,
				"cids":cids,
				"duty":duty,
				"active":active,
				"data":{
					"currentpage":currentpage,          //当前分页
					"pagesize":pagesize,                //每页显示条数
					"totalcount":-1 		//总条数：-1表示要获取总条数，1表示不要获取总条数
				}
			}
		};
	$.ajax({
		type:"POST",
		url:"/clinicmember/memberlist",
		dataType:"json",
		data:pjson,
		beforeSend: function(){
			jQuery.loading('加载中',1);
			$("#no_data").hide();
			$("#lists_info").html("");
		},
		success:function(json){	
			if(json.code==2){
				jQuery.loading_close();
				jQuery.showError('您没有权限查看数据!','信息反馈');
				reutrn;
			}
			if(json.code==0){
				 $("#lists_info").html('<tr class="no_data"><td colspan="11"><img src="/static/account/img/no-data.png" alt=""/></td></tr>');
				$(".Pager").hide();
			}
			else{
				//没有员工列表
				if(json.list.members==null){
					 $("#lists_info").html('<tr class="no_data"><td colspan="11"><img src="/static/account/img/no-data.png" alt=""/></td></tr>');
					 $(".Pager").hide();
				}else{
					$(".Pager").show();
					var span="";//只有一个诊所则是单店版，获取它的id和name，否则获取左边的连锁店的名字和固定id为1；
					var clinic="";
					if(json.list.clinics==null||json.list.clinics==""){
						span+="";
					}else{
						if(json.list.clinics.length==1){
						 //黄凯 2016-10-19
							$.each(json.list.clinics,function(k,v){
								span+='<li><span>'+v.cname+'</span><span class="add_clinic_id">'+v.clinicid+'</span>'+
									'<span></li>';
							})
						}else{
							span+='<li><span>'+$("#clinic_name_left").text()+'</span><span class="add_clinic_id">1</span>'+
								'<span></li>';
						}
						//放入选择所有员工的选择项中
						$.each(json.list.clinics,function(k,v){
							if(v.clinicid==cids){//当前选择的诊所
								clinic+="<span id="+v.clinicid+" data-f='1'>"+v.cname+"</span>";
							}else{
								clinic+="<span id="+v.clinicid+" data-f='0'>"+v.cname+"</span>";
							}
						})
					}
					$("#clinicSelc").html(clinic);
					$(".add_clinic_popup").html(span);
				}
				//获得所有员工的列表
				var num;//总条数
				if(json.list.members==null){
                    $("#lists_info").html('<tr class="no_data"><td colspan="11"><img src="/static/account/img/no-data.png" alt=""/></td></tr>');
					num=0;	
				}else{
					var str="";
					var aType=null;
						num=json.totalcount;
					var pageCurr=json.pageno;//当前第几页
					// 循环多个诊所的名字
					$.each(json.list.members,function(k,v){
						var cnameList=[],//诊所列表
							usernumList=[],//工号列表
							dutyList=[],//职位列表
							departList=[],//科室列表
							stopList=[],//在职状态列表
							stopStr="";
							usernumStr="",
							dutyStr="",
							departStr="",
							cnameStr='';

							cnameList=v.cnames.split(",");
							$.each(cnameList,function(key,value){
								cnameStr+='<p>'+value+'</p>';
							})
							usernumList=v.usernum.split(",");
							$.each(usernumList,function(key,value){
								usernumStr+='<p>'+isNbsp(value)+'</p>';
							})
							dutyList=v.duty.split(",");
							$.each(dutyList,function(key,value){
								dutyStr+='<p>'+isNbsp(value)+'</p>';
							})
							departList=v.department.split(",");
							$.each(departList,function(key,value){
								departStr+='<p>'+isNbsp(value)+'</p>';
							})
							stopList=v.stopped.split(",");
							$.each(stopList,function(key,value){
								if(value=="0"){value="在职"}
								else{value="离职"}
								stopStr+='<p>'+value+'</p>';
							})
						var red;
						if(v.active=="0"){active="未激活"; red='red'}
						else if(v.active=="1"){active="已激活"; red='';}
						var bg="";
						if(k%2==1){bg="bgfa"}
						else{bg=""}
						if(v.birthday=="0000-00-00"){v.birthday=""};
						var delet="<p class='staff_action' data-did="+v.doctorid+" data-cid="+v.cids+" data-type='1'>删除员工</p>";
						if(v.supperuser==1||(json.list.type==0&&v.duty=="管理员")){
							delet="";
						}
						// <p class='staff_action' data-did="+v.doctorid+" data-cid="+v.cids+" data-type='2'>员工离职</p>
						str+="<tr class="+bg+"><td class='name tl'><b class='checkboxbg'><input type='checkbox' id='chk_"+k+"'><label></label></b><label for='chk_"+k+"'><img class='sp_img' src='/static/account/img/default.png'>"+v.name+"</label></td>";
						str+="<td class='info_place' id="+v.cids+">"+cnameStr+"</td>";
						str+="<td class='info_id'>"+usernumStr+"</td>";
						str+="<td class='info_sex'>"+v.sex+"</td>";
						str+="<td class='info_birth'>"+v.birthday+"</td>";
						str+="<td class='info_pho'>"+v.mobile+"</td>";
						str+="<td class='info_id'>"+dutyStr+"</td>";
						str+="<td class='info_character'>"+departStr+"</td>";
						str+="<td class=''>"+stopStr+"</td>";
						str+="<td class='info_status "+red+"'>"+active+"</td>";
						str+="<td class='tr info_action' id="+v.cids+"><span class='user_setting_btn'>用户设置<img src='/static/account/img/user_action.png'></span>";
						str+="<div class='user_setting'><p class='info_edit' id="+v.doctorid+"><a href='/clinic/clinicusersetone?did="+v.doctorid+"&bindmobile="+v.umobile+"&cid="+v.cids+"'>编辑资料</a></p>";
						str+=delet+"</td></tr>";
						str+="</tr>"
					});
					$("#lists_info").html(str);	
				}
				defaultTotalcount=num;//存储总条数
				setPageList(num,pageNum);//出现pageNum个页码
			}
		},
		error:function(json){},
		complete:function(){
			jQuery.loading_close();
		},
	})
}
//初始化获得职位列表
function getchainduty(){
	$.ajax({
		type:"POST",
		url:"/clinicmember/getchainduty",
		dataType:"json",      
		beforeSend: function(json){},
		error: function(json){},
		success: function(json){
			//console.log(json);
			if(json.list==null||json.list==""){

			}else{
				$.each(json.list,function(k,v){
					var str="";
					if(k==0){
						str+="<span class='pl0'>"+v.duty+"</span>";
					}else{
						str+="<span>"+v.duty+"</span>";
					}
					$("#dutylist").append(str);
				})
			}
		},
		complete: function(json){}
	})
}

/*首字母选择*/
$(".first_letter span").click(function(){
	var txt=$(this).text();
	$(".first_letter span[data-f='1']").attr("data-f","0");
	$(this).attr("data-f","1");
	$("#filter_code").show();
	$("#key_name").html(txt);
	$("#select_all").prop("checked",false);
	$("#lists_info .three_li input").prop("checked",false);
	search_con(1);	
}) 
/*工作诊所选择选择*/
$(document).on("click",".clinics_filter #clinicSelc span",function(){
	var txt=$(this).text();
	var clinicID=$(this).attr("id");
	$("#clinicSelc span[data-f='1']").attr("data-f","0");
	$(this).attr("data-f","1");
	$("#key_clinic").html(txt);	
	$("#filter_clinic").show();
	$("#select_all").prop("checked",false);
	$("#lists_info .three_li input").prop("checked",false);
	search_con(1);
})
/*职位选择*/
$(document).on("click",".jobs_filter span",function(){
	var txt=$(this).text();
	var clinicID=$(this).attr("id");
	$(".jobs_filter span[data-f='1']").attr("data-f","0");
	$(this).attr("data-f","1");
	$("#filter_duty").show();
	$("#key_duty").html(txt);	
	$("#select_all").prop("checked",false);
	$("#lists_info .three_li input").prop("checked",false);
	search_con(1);
})
/*状态选择*/
$(".status_filter span").click(function(){
	var txt=$(this).text();
	$(".status_filter span[data-f='1']").attr("data-f","0");
	$(this).attr("data-f","1");
	$("#filter_status").show();
	$("#key_status").html(txt);
	$("#select_all").prop("checked",false);
	$("#lists_info .three_li input").prop("checked",false);
	search_con(1);	
})

/*点击小叉条件消失*/
$(document).on("click",".filter_key img",function(){
	var index=$(".filter_key img").index(this);
	$(".filter_key").eq(index).children(".key_name").html("");
	var thisID=$(".filter_key").eq(index).attr("id");
	if(thisID=="filter_status"){
		$(".status_filter span[data-f='1']").attr("data-f","0");
		search_con(1);	
	}
	if(thisID=="filter_code"){
		$(".first_letter span[data-f='1']").attr("data-f","0");
		search_con(1);
	}
	if(thisID=="filter_clinic"){
		$("#clinicSelc span[data-f='1']").attr("data-f","0");
		search_con(1);	
	}
	if(thisID=="filter_duty"){
		$(".jobs_filter span[data-f='1']").attr("data-f","0");
		search_con(1);	
	}
	$("#select_all").prop("checked",false);
	$("#lists_info .three_li input").prop("checked",false);
	$(".filter_key").eq(index).hide();
})
/*点击查询*/
$("#select_staff").click(function(){
	var ser=$("#search_condition").val();
	search_con(1);
	$("#lists_info .three_li input").prop("checked",false);
})
$(document).keydown(function(e){
        var key=e.keyCode;
        if (key==13) {
			$("#select_staff").click();
        }
})
// 点击查询框中的清除小图标
$("#clearSelct").on("click",function(e){
	$("#search_condition").val("");
	$(this).css("visibility","hidden");
	search_con(1);
	e.stopPropagation();
})
// 光标放入搜索框中出现清除的小图标
$("#search_condition").on({
	focus:function(){
		$("#clearSelct").css("visibility","visible");
	},
	blur:function(){
	 	setTimeout(function() {
			 $("#clearSelct").css("visibility","hidden");
		 }, 500);	
	}
})
function search_con(code){
	var name=$("#search_condition").val();//员工名称或者手机号
	var txt=$("#key_name").text();//首字母
	var duty=$(".jobs_filter span[data-f='1']").text();//角色
	var clinic_list=$("#clinicSelc span[data-f='1']").attr("id");//诊所
	var status=parseInt($(".status_filter span[data-f='1']").attr("id"))+1;//状态
	if(isNaN(status)){
		status='';
	}
	//如果是筛选的动作要传code==1
	if(code==1){
		$("#pageCurr").val(1);
	}
	getStaffLists(name,txt,clinic_list,duty,status,code);
}

/*点击用户设置*/
$(document).on("click",".user_setting_btn",function(e){
	$(".user_setting").hide();
	var index=$(".user_setting_btn").index(this);
	hasper2(index);
})
$(".user_setting").on("click", function(e){
    e.stopPropagation();
});
//用户设置----权限判断
function hasper2(index){
	$.ajax({
		type:"POST",
		url:"/clinicmember/privilegememberset",
		dataType:"json",
		beforeSend:function(){},
		success:function(json){
			if(json.code==2){
				jQuery.showError("您没有使用该功能权限",'信息反馈');
			}else{
				if($(".user_setting").eq(index).css("display")=="none"){
				$(".user_setting").eq(index).show();
				if($(this).parent().parent().index()>6){
					if($("#lists_info tr").size()-1==$(this).parent().parent().index()){
						$(".user_setting").eq(index).css("top","-60px");
					}	
				}
				} else{
					$(".user_setting").eq(index).hide();		
				}
				$(document).one("click",function(){
					$(".user_setting").eq(index).hide();	
				})
				// e.stopPropagation();
			}
		},
		error:function(){},
		complete:function(){}
	})
}
$(document).on("click",".staff_action",function(){
	var type=$(this).attr("data-type");
	var clinicID=$(this).attr("data-cid");
	var doctorID=$(this).attr("data-did");
	var name=$(this).parents(".info_action").siblings(".name").children("label").text();
	if(type==1){
		jQuery.showDel('确定要删除该员工信息吗?','删除提醒',
			function(){
				exjob(doctorID,clinicID,type,name);
				$("body").css("overflow","scroll");	
				jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
			},function(){
				//代码
				jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
				}
			);
	}
})

/*员工离职交接和删除员工*/
function exjob(doctorID,clinicID,type,name){
	var pjson={};
	pjson.info={
		 clinicid:clinicID,     //诊所ID，多个诊所用逗号隔开
 	 	 doctorid:doctorID,     //医生ID
 		 type:type,	
		 name:name			//type = 1 => 删除员工 | type = 2 => 员工离职
	};
	$.ajax({
		type:"POST",
		url:"/clinic/clinicemployeeoperated",
		dataType:"json", 
		data:pjson,       
		beforeSend: function(){},
		error: function(){},
		success: function(json){
			if(json.code=1){
				getStaffLists();
			}else {
				jQuery.showError(json.info,'信息反馈');
			}
		},
		complete: function(json){}
	})
	
}
/*关闭弹窗和背景黑色的遮罩层*/
$(".close_alert").on("click",function(){
	$(".sta_man_bg").hide();
	$(".add_doctor_name").empty();
	$(this).parents(".export_staff_list").hide();
	clearErro();	
})

/*----------------------
群发短信 2016-10-19 黄凯
----------------------*/
//全选
$("#select_all").click(function(){
	if($(this).is(":checked")){
		//console.log("全选");
		$("#lists_info .name input").prop("checked",true);
	}else{
		//console.log("取消全选");
		$("#lists_info .name input").prop("checked",false);
	}
})

//批量操作
$(".alert_operate").click(function(){
		var indexb=$(this).index();
		hasper(indexb);//判断是否有权限
})
function hasper(index){
	var url="";
	if(index==1){
		url="/clinicmember/privilegememberexport";
	}if(index==2){
		url="/clinicmember/privilegemassmessage";
	}
	if(index==3){
		url="/clinicmember/privilegeactivemessage";
	};
	$.ajax({
		type:"POST",
		url:url,
		dataType:"json",
		beforeSend:function(){},
		success:function(json){
			if(json.code==2){
				jQuery.showError("您无权使用该功能",'信息反馈');
			}else{
				selcitem();
				$(".export_staff_list2").eq(index-1).show().siblings(".export_staff_list2").hide();
				$(".sta_man_bg").show();
				$("body").css("overflow","hidden");
			}
		},
		error:function(){},
		complete:function(){}
	})
}
//点击切换已选择的员工和所有员工
$(".sta_cli_sp").unbind("click").click(function(){
	$(this).children("img").attr("src","/static/account/img/circle_sel.png");
	$(this).children("img").attr("id","circle_sel_png");
	$(this).parents(".total_span").siblings(".total_span").find(".sta_cli_sp").children("img").attr("src","/static/account/img/circle_nor.png");
	$(this).parents(".total_span").siblings(".total_span").find(".sta_cli_sp").children("img").removeAttr("id");
	var index=$(this).parents(".total_span").index();
	$(".staff_name2 ul").eq(index-1).show().siblings().hide();
	$(".staff_name3 ul").eq(index-1).show().siblings().hide();
	$(".staff_name1 ul").eq(index-1).show().siblings().hide();
	clearErro();
})
//群发消息对象
function selcitem(){
	$("#lists_info .name input:checked").each(function(){
		var name=$(this).parent(".checkboxbg").siblings("label").text();
		// console.log();
		var place=$(this).parents(".name").siblings(".info_place").attr("id");//改为获得id
		var accountStatus=$(this).parents(".name").siblings(".info_status").html();
		var doctorId=$(this).parents(".name").siblings(".info_action").find(".info_edit").attr("id");
		//console.log(accountStatus);
		var str="";
			str+='<li><span class="add_name">'+name+'</span>';
			str+='<span class="add_doctorId">'+doctorId+'</span>';
			str+='<span class="add_place">'+place+'</span>';
			str+='<span class="add_accountStatus">'+accountStatus+'</span>';
			str+='<span><img src="/static/account/img/close.png" class="add_close"></li>';
				$(".add_doctor_name3").append(str);//导出的项目
		if(accountStatus=="未激活"){
				$(".add_doctor_name2").append(str);	//发送激活短信，已经激活不需再发送
		}
		else if(accountStatus=="已激活"){
				$(".add_doctor_name1").append(str);	//群发短信的项目，未激活不能发送
		}
	})
}
//删除选中的项目
$(document).on("click",".add_close",function(){
	$(this).parents("li").remove();
})
//光标定位到发送短信的内容框中
$("#bulk_messaage").on("focus",function(){
		$(this).val("");
		$("#bulk_messaage").css("border","1px solid #f0f0f0");
		$("#import").css("visibility","hidden");
})
// 清除错误提醒信息
function clearErro(){
	$(".add_doctor_name").css("border","none");
	$(".errinfo").css("visibility","hidden");
	$("#bulk_messaage").val("");
}
//群发短信
$("#exp_staff_confim2").unbind('click').click(function(){
	//判断发送的类型
	var textValue=$(this).parent().siblings(".staff_list").find("#circle_sel_png").parent().siblings("span").text();
	var content=$("#bulk_messaage").val();
	var add_li_label=$(".add_doctor_name1 li");//已选择的项目
	//console.log(add_li_label);
	var clinicList=$(".add_clinic_id");//所有的诊所选择
	var pjson={};//发送的数据json
	pjson.info={};
	var cidsStr="";
	var didStr="";
	var cidsObj={};//用来去重的对象
	var cidsArry=[];
	//   console.log(textValue);
	if(content==""||content=="请输入短信内容"){
		$("#bulk_messaage").css("border","1px solid #f86d5a");
		$("#import").html("请输入短信内容！").css("visibility","visible");
		return false;
	}
	else{
		if(textValue=="已选择的收信人"||textValue=="已选择的员工"){
			if(add_li_label.length==0){
				$(".add_doctor_name1").css("border","1px solid #f86d5a");
				$("#sxr2").html("请选择收信人！").css("visibility","visible");
				return false;
			}else{
				var typeNum=1;
				for(var i=0;i<add_li_label.length;i++){
					var cid=add_li_label.eq(i).find(".add_place").text();
					var	did=add_li_label.eq(i).find(".add_doctorId").text();
					var status=add_li_label.eq(i).find(".add_accountStatus").text();
						cidsStr+=cid+",";
						didStr+="'"+did+"'"+",";
				}
				didStr=didStr.substring(0,didStr.length-1);
				pjson.info.dids=didStr;
				cidsArry=cidsStr.split(",");
				$.each(cidsArry,function(k,v){
					if(v==""||v==undefined){
						cidsArry.splice(k,1);
					}
				})
				$.unique(cidsArry);
				cidsStr="";
				$.each(cidsArry,function(k,v){
					cidsStr+="'"+v+"'"+",";
				})
				// console.log("cidsArry=",cidsStr);
			}
		}
		else if(textValue=="所有员工"){
			var typeNum=2;
			for(var i=0;i<clinicList.length;i++){
					var cid=clinicList.eq(i).text();
					if(!cidsObj[cid]){
						cidsStr+="'"+cid+"'"+",";
						cidsObj[cid]=1;
					}
			}
		}
		cidsStr=cidsStr.substring(0,cidsStr.length-1);
		pjson.info.cids=cidsStr;
		pjson.info.type=typeNum;
		pjson.info.content=content;
		$.ajax({
			type:"POST",
			url:"/clinicmember/sentmassmessage",
			dataType:"json",
			data:pjson,
			beforeSend: function(){
				// $("#exp_staff_confim2").val("发送中...").prop("disable","true").addClass("ac_btn_bf_disable");
			},
			success: function(json){
				if(json.code==1){
					close_alert();
					$("#lists_info .name input").prop("checked",false);
					$("#select_all").prop("checked",false);
					jQuery.postOk('fadeInUp','发送成功');
				}else{
					jQuery.showError(data.info,"信息反馈");
				}
			},
			error: function(json){},
			complete: function(json){}
		})
	}
})

//发送激活短信
$("#exp_staff_confim3").unbind('click').click(function(){
	var add_li_label=$(".add_doctor_name2 li");
	var clinicList=$(".add_clinic_id");
	var pjson={};//发送的数据json
	pjson.info={};
	var cidsStr="";
	var cidArry=[];
	var didStr="";
	var cidsObj={};//用来去重的对象
	//判断发送的类型
	var textValue=$(this).parent().siblings(".staff_list").find("#circle_sel_png").parent().siblings("span").text();123
	// console.log(textValue);
	if(textValue=="已选择的收信人"||textValue=="已选择的员工"){
		if(add_li_label.length==0){
			$("#sxr3").css("visibility","visible");
			$(".add_doctor_name2").css("border","1px solid #f86d5a");
			return false;
		}else{
			for(var i=0;i<add_li_label.length;i++){
			var cid=add_li_label.eq(i).find(".add_place").text();//诊所id可能为多个的如'138445585,349848129238,9485959'
					did=add_li_label.eq(i).find(".add_doctorId").text();
				var status=add_li_label.eq(i).find(".add_accountStatus").text();
					cidsStr+=cid+",";
					didStr+="'"+did+"'"+",";
			}
			cidArry=cidsStr.split(",");
			$.each(cidArry,function(index,element){
				if(element==""||element=="undefied"){
					cidArry.splice(index,1);
				}
			})
			cidsStr="";
			$.unique(cidArry);//诊所去重
			$.each(cidArry,function(index,element){
				cidsStr+="'"+element+"'"+","
			})
			// console.log("cidsStr",cidsStr);
			var typeNum=1;
			didStr=didStr.substring(0,didStr.length-1);
			pjson.info.dids=didStr;
		}
		
	}else if(textValue=="所有员工"){
		var typeNum=2;
			for(var i=0;i<clinicList.length;i++){
				var cid=clinicList.eq(i).text();
				if(!cidsObj[cid]){
					cidsStr+="'"+cid+"'"+",";
					cidsObj[cid]=1;
				}
			}
	}
	cidsStr=cidsStr.substring(0,cidsStr.length-1);
	pjson.info.cids=cidsStr;
	pjson.info.type=typeNum;
	// console.log(cidsStr);
	$.ajax({
		type:"POST",
		url:"/clinicmember/sentactivemessage",
		dataType:"json",
		data:pjson,
		beforeSend: function(){
			$("#exp_staff_confim3").val("发送中...").prop("disable",true).addClass("ac_btn_bf_disable").removeClass("ac_btn_bf");
		},
		success: function(json){
			// console.log(json);
			if(json.code==1){
				close_alert();
				$("#lists_info .name input").prop("checked",false);
				$("#select_all").prop("checked",false);
				jQuery.postOk('fadeInUp','发送成功');
			}else{
				jQuery.postFail('fadeInUp',json.info);
			}
		},
		error: function(json){},
		complete: function(json){
			$("#exp_staff_confim3").val("发送").removeClass("ac_btn_bf_disable").addClass("ac_btn_bf").removeAttr("disable");
			
		}
	})
})

//导出员工列表
$("#exp_staff_confim").unbind('click').click(function(){
	var add_li_label=$(".add_doctor_name3 li");
	var clinic_list=$(".add_clinic_popup li");
	var clinicStr="";
	var clinicObj={};
	var clinicArr=[];
	var doctorStr="";
	var sendClinicID="";//发送的诊所id
	//判断发送的类型
	var textValue=$(this).parent().siblings(".staff_list").find("#circle_sel_png").parent().siblings("span").text();
	//console.log(textValue);
	if(textValue=="已选择的收信人"||textValue=="已选择的员工"){
		if(add_li_label.length==0){
			$("#sxr").css("visibility","visible");
			$(".add_doctor_name3").css("border","1px solid #f86d5a");
			return false;
		}
		//获取已选择的员工id
		for(var i=0;i<add_li_label.length;i++){
			var sendDoctorID=add_li_label.eq(i).find(".add_doctorId").text();//doctor的id
			sendClinicID=add_li_label.eq(i).find(".add_place").text();//doctor所在诊所的clinicid
			doctorStr+=sendDoctorID+",";
			clinicStr+=sendClinicID+",";
			clinicArr=clinicStr.split(",");
		}
			$.each(clinicArr,function(index,element){
			if(element==""||element=="undefied"){
					clinicArr.splice(index,1);
				}
			})
			clinicStr="";
			$.unique(clinicArr);//诊所去重
			$.each(clinicArr,function(index,element){
				clinicStr+="'"+element+"'"+",";
			})
			// console.log(clinicStr);
			// 	return false;
		doctorStr=doctorStr.substring(0,doctorStr.length-1);
		type=1;
		clinicStr=clinicStr.substring(0,clinicStr.length-1);
		window.location.href="/clinicmember/memberinfoexport?cids="+clinicStr+"&dids="+doctorStr+"&type="+type;
	}else if(textValue=="所有员工"){
		//获取所有员工所属诊所的id
		for(var i=0;i<clinic_list.length;i++){
			sendClinicID=clinic_list.eq(i).find(".add_clinic_id").text();//诊所的id
			if(!clinicObj[sendClinicID]){
				clinicStr+=sendClinicID+",";
				clinicObj[sendClinicID]=1;
			}
		}
		type=2;
		clinicStr=clinicStr.substring(0,clinicStr.length-1);
		window.location.href="/clinicmember/memberinfoexport?cids="+clinicStr+"&type="+type;
	}
	
	close_alert();
	$("#lists_info .name input").prop("checked",false);
	$("#select_all").prop("checked",false);
	jQuery.postOk('fadeInUp','导出成功');
})

//取消关闭
$(".exp_staff_clsoe").click(function(){
	close_alert();
})
$(".close_alert").click(function(){
	close_alert();
})
	//关闭导出员工列表，发送短信等弹窗
function close_alert(){
	$(".export_staff_list").hide();
	$(".sta_man_bg").hide();
	$(".add_doctor_name").html("");
	$("body").css("overflow","auto");
	clearErro();
}

//页码显示count条目总数，displayNum页面中显示多少个页码
function setPageList(count,displayNum){
	var str='',_curr=1,_totalpage=0,_row=0;
	$(".pagerSP3").show();
	_row=$("#pageid").val();//每页条数
	_totalpage=Math.ceil(count/_row);
	displayNum=displayNum!=undefined?displayNum:4

	// if(_totalpage<=1){$(".Pager").hide();}
	// else{$(".Pager").show();}
	$(".pagerSP1").html("共"+count+"条/"+_totalpage+"页");
	var c_p=parseInt($("#pageCurr").val());//取页码起始值和结束值
	var prev= c_p-1>0?c_p-1:1;
	var next= c_p+1<=_totalpage?c_p+1:_totalpage;
	var pageNum=function(){
		 var r='';
		 var c_start = c_p - displayNum/2 ;
		 var c_end = c_p + displayNum/2;
		 if ( c_start < 1){
		 	c_start=1;c_end = displayNum+c_start;
		 }
		 if ( c_end > _totalpage ){
		 	c_start = _totalpage -displayNum;c_end=_totalpage;
		 }
		 if( _totalpage < displayNum+1 ){
		 	c_start = 1;c_end=_totalpage;
		 }

		for(var i=c_start;i<=c_end;i++){	
			if(c_p==i){
				r+='<a class="pagerAct" onclick="setpage('+i+','+_totalpage+')">'+i+'</a>'; 
			}else{
				r+='<a onclick="setpage('+i+','+_totalpage+')">'+i+'</a>'; 
			}
		 }		
		 return r;
	}
	var str='';
	str='<a onclick="setpage(1,'+_totalpage+')">&lt;&lt;</a><a onclick="setpage('+(prev)+','+_totalpage+')">&lt;</a>';
	str+=pageNum();
	str+='<a onclick="setpage('+(next)+','+_totalpage+')">&gt;</a><a onclick="setpage('+_totalpage+','+_totalpage+')">&gt;&gt;</a>';
	
	$(".pagerSP2").empty().html(str);
}
//分页点击事件
function setpage(num,_totalpage){
	num=num==0?1:num;
	num=num>_totalpage?_totalpage:num
	$("#pageCurr").val(num);
	search_con(0);
}

function isNbsp(el){
	if(el==""){
		el="&nbsp;"
	}
	return el;
}
