//职位高亮标识
var tags=0;
//新增的最低折扣输入
$("#minDiscount").on("input propertychange",function(){
	var txt=$(this).val();
	$("#minInput").prop("checked",true);
	if(txt){
		if(isNaN(txt)==false){
			if(txt<0||txt>100){
				$("#minDiscount").val(100);
			}
		}
	}else{
		$("#minInput").prop("checked",false);
		$("#minDiscount").attr("disabled",true).val("");
	}
	
});
$("#minInput").on("click",function(){
	isdisable();
})
function isdisable(){
	if($("#minInput").prop("checked")==true){
		$("#minDiscount").attr("disabled",false);
	}else{
		$("#minDiscount").attr("disabled",true).val("");
	}
}
//初始化
getClinicList();
jQuery.createAniCss();
//获取诊所列表
function getClinicList(){
	jQuery.loading('加载中',1);
	$.ajax({
		type:"get",
		url:'/clinic/getusergroupclinicinfo',
		dataType:"json",
		data:{data:true}
	})
	.done(function(data){
		jQuery.loading_close();
		if(data.code==2){
			jQuery.showError('您没有此功能操作权限!','信息反馈');
			$(".f_privileges_cont input[type='checkbox']").prop("disabled",true);
			reutrn;
		}
		if(data.code==1){
			var params=[];
			$(".f_privileges_cont input[type='checkbox']").prop("disabled",false);
			if(data.list.clinicinfo==null||data.list.clinicinfo==""){
				params.push({key:"暂无诊所",val:""});
			}else{
				var isChain="";
				if(data.list.chaininfo==""||data.list.chaininfo==null){
					isChain="0";
				}else{
					params.push({key:data.list.chaininfo[0].chainname,val:1});
					isChain="1";
				}
				$("#isChain").val(isChain);
				$(data.list.clinicinfo).each(function(index,el){				
					params.push({key:'&nbsp;&nbsp;&nbsp;'+el.clinicname,val:el.clinicid})
				});
				// function getDataList(id){
				// 	getJobList(id);	//每次切换获得职位列表
				// }
				var listApi;
				$("#clinicList").yayigj_downlist({
					_callBack:getDataList,
					_hiddenID:'clinicid',
					_data:params,
					_valtype:'text',
					},function(api){
						listApi=api;
					});
				var id=params[0].val;
				$("#clinicid").val(id);
				//把当前诊所的id存放到隐藏域中
				$("input[name=clinicList]").val($("#clinicid").val());
				var name=params[0].key;
				$("#clinicname").val(name);
				//职位列表
				getDataList(id);
			}
		}else{
			jQuery.showError(data.info,'信息反馈');
		}
	})
	.fail(function(){
		jQuery.postFail('fadeInUp','网络超时，请重试！');
	})
	.always(function(){
		jQuery.loading_close();
	});
}

//获取职位列表
function getDataList(id){
	var isChain=$("#isChain").val();
	if(isChain!="0"){
		if(id!=1){
			$(".r_title li").show();
			$(".r_title li").eq(2).css("visibility","hidden");
			$(".r_title li").eq(0).addClass("actTitle").siblings().removeClass("actTitle");
			$(".f_privileges_cont > div").eq(0).show().siblings().hide();
		}else{
			$(".r_title li").hide();
			$(".r_title li").eq(2).show().css("visibility","visible").addClass("actTitle");
			$(".f_privileges_cont > div").eq(2).show().siblings().hide();
		}
	}
	// $("select[name=clinicList]").change(function(){
		//每次切换诊所时，重置tags
		tags=0;
		//每次重新选择诊所时，改变隐藏域的值
		$("input[name=clinicList]").val($("#clinicid").val());
		$.ajax({
			type:"post",
			url:'/clinic/getusergroupinfo',
			dataType:"json",
			data:{
				info:{
					clinicid:$("input[name=clinicList]").val()
				}
			}
		})
		.done(function(data){		
			jQuery.loading('加载中',1);		
			if(data.code==1){
				var html="";
				if(data.list!=null){
					var len =data.list.length;
					$(data.list).each(function(index,el){
						if(index==0&&tags==0){
							tags=el.usergroupid;
						}
						html+='<div class="f_firstItem" uid='+el.usergroupid+'>';
							html+='<span i='+el.displayorder+'>'+el.usergroupname+'</span>';
							//控制按钮显示
							if(len == 1){//仅一条数据时，只显示删除按钮
								html+='<div class="clinci_operation"><i></i><i></i><i class="js_operation_del"></i></div>';
							}else{
								if(index==0){//第一条数据显示下移按钮
									html+='<div class="clinci_operation"><i></i><i class="js_operation_down"></i><i class="js_operation_del"></i></div>';
								}else if(index==len-1){//最后一条数据显示上移按钮
									html+='<div class="clinci_operation"><i class="js_operation_up"></i><i></i><i class="js_operation_del"></i></div>';
								}else{
									html+='<div class="clinci_operation"><i class="js_operation_up"></i><i class="js_operation_down"></i><i class="js_operation_del"></i></div>';
								}
							}
						html+='</div>';
					});
				}
				$("#clinic_lists").empty().append(html);
				$("div[uid="+tags+"]").addClass("actItem");
				var uname=$("div[uid="+tags+"]").find("span").text();
				$("input[name=uidType]").val(tags);
				getPrivilegesList(uname);
			}else{
				// jQuery.postFail('fadeInUp',data.info);
				jQuery.showError(data.info,'信息反馈');
			}
		})
		.fail(function(){
			jQuery.postFail('fadeInUp','网络超时，请重试！');
		})
		.always(function(){
			jQuery.loading_close();
		})
	// }).trigger("change");
}

//新增职位弹窗
$(".f_head i").click(function(){
	$(".mask").show();
	$("#job_new").show();
	$("body").css("overflow","hidden");
	//所属诊所
	  $("#places").html($("#clinicList").text());
	//员工角色列表
	$.ajax({
		type:"get",
		url:'/clinic/getrolelist',
		dataType:"json",
		data:{data:true}
	})
	.done(function(data){
		if(data.code==1){
			var html="";
			$(data.list).each(function(index,el){
				html+='<option value='+el.rttype+'>'+el.name+'</option>';
			});
			$("#role").empty().prepend(html);
		}else{
			jQuery.showError(data.info,'信息反馈');
		}
	})
	.fail(function(){
		jQuery.postFail('fadeInUp','网络超时，请重试！');
	});
	
	
	//权限复制
	$.ajax({
		type:"post",
		url:'/clinic/privilegerelatedlist',
		dataType:"json",
		data:{
			info:{
				clinicid:$("input[name=clinicList]").val()
			}
		}
	})
	.done(function(data){
		var html="";
		if(data.list==null){
			html+="<option>暂无权限复制</option>"
		}else{
			html+='<option value="0">请选择权限复制</option>';
			$(data.list).each(function(index,el){
				html+='<option value='+el.usergroupid+'>'+el.usergroupname+'</option>';
			});
		}
		$("#position_name").empty().prepend(html);
	})
	.fail(function(){
		jQuery.postFail('fadeInUp','网络超时，请重试！');
	});
});

//取消弹窗
$("#cancel,#close_per").click(function(){
	$("#job_new").hide().find("input[type='text']").val("");
	$(".mask").hide();
	$("body").css("overflow","auto");
	clearerr();
});
$("#UserGroupName").on("focus",function(){
	clearerr();
})
/*----------------------------
罗杨 2016-12-09
---------------------------*/
//清除错误信息
function clearerr(){
	$("#job_new").find("input[type='text']").val("");
	$("#UserGroupName").css("border","1px solid #e0e0e0");
	$("#job_err").css("visibility","hidden");
}
//出现错误信息
function showerr(info){
	$("#UserGroupName").css("border","1px solid #f85748");
	$("#job_err").html(info).css("visibility","visible");
}

//新增职位
$("input[name=js_save]").click(function(){
	var _usergroupname = $.trim($("#UserGroupName").val());
	var id=$("#clinicid").val();
	if(_usergroupname==""||_usergroupname==null){
		//alert("请输入职位名称!");
		showerr("请输入职位名称");
		return false;
	}
	var _rttype = $("#role").val();
	var _position_name = $("#position_name").val();
	//console.log("_position_name:",_position_name);
	var obj={
		info:{
			usergroupname:_usergroupname,
			rttype:_rttype,
			clinicid:$("input[name=clinicList]").val(),//从隐藏域中取值
			usergroupid :_position_name
		}
	}
	$.ajax({
		type:"post",
		url:'/clinic/clinicprivilegeadd',
		dataType:"json",
		data:obj
	})
	.done(function(data){
		if(data.code==1){
			//关闭弹窗，刷新页面
			$("#job_new").hide().find("input[type='text']").val("");
			$(".mask").hide();
			$("body").css("overflow","auto");
			//重新获取职位列表
			getDataList(id);
		}else{
			if(data.info=="职位名称已经存在!"){
				showerr("职位名称已经存在");
			}else{
				// jQuery.postFail('fadeInUp',data.info);
				jQuery.showError(data.info,'信息反馈');
			}
		}
	})
	.fail(function(){
		jQuery.postFail('fadeInUp','网络超时，请重试！');
	});
});

//删除职位
$("body").on("click",".js_operation_del",function(event){
	var _usergroupid = $(this).parent().parent().attr("uid");
	var usergroupname=$(this).parent().siblings("span").text();
	var id=$("#clinicid").val();
	jQuery.pop_window_modal_dialog({
		_popmothod:'fadeInUp', 
		_warnTxt:'确定要删除么？',
		_icotype:3,  //1警告 2提醒 3询问
		_skintype:0,
		_borderColor:'#00c5b5',
		_btnbgcolor:'#00c5b5',			
		_activeColor:'#00bcaa',
		_hoverColor:'#00AEA2',
		
		_btnText:new Array("确定","取消"),
		_closemothod:'fadeOutUp', 
		_okEvent:function(){
			$.ajax({
				type:"post",
				url:'/clinic/clinicprivilegedelete',
				dataType:"json",
				data:{
					info:{
						clinicid:$("input[name=clinicList]").val(),
						usergroupid:_usergroupid,
						usergroupname:usergroupname
					} 
				}
			})
			.done(function(data){
				if(data.code==1){
					 jQuery.postOk('fadeInUp');
					 jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
					//重新获取职位列表
					getDataList(id);
				}
				else{
					jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
					errorinfo(data.info);
				}
			})
			.fail(function(){
				jQuery.postFail('fadeInUp','网络超时，请重试！');
			});
			event.stopPropagation();
		},
		_cancelEvent:function(){
			jQuery.pop_window_modal_dialog_close({_closemothod:'fadeOutUp'});
		}	
	});
});
function errorinfo(data){
	setTimeout(function() {
		jQuery.showError(data,'信息反馈');
	},500);
	
}
//排序职位
$("body").on("click",".js_operation_up,.js_operation_down",function(event){
	var _usergroupid = $(this).parent().parent().attr("uid");
	var _displayorder = $(this).parent().siblings("span").attr("i");
	var id=$("#clinicid").val();
	var _usergroupid_up = $(this).parent().parent().prev().attr("uid");
	var _displayorder_up = $(this).parent().parent().prev().find("span").attr("i");
	var _usergroupid_down = $(this).parent().parent().next().attr("uid");
	var _displayorder_down = $(this).parent().parent().next().find("span").attr("i");
	
	var obj={
			info1:{
				clinicid:$("input[name=clinicList]").val(),
			  	displayorder:_displayorder,
			  	usergroupid:_usergroupid
			},
			info2:{
				clinicid:$("input[name=clinicList]").val()
			}
		};
	if($(this).attr("class")=="js_operation_up"){
		obj.info2.displayorder = _displayorder_up;
		obj.info2.usergroupid = _usergroupid_up;
	}else{
		obj.info2.displayorder = _displayorder_down;
		obj.info2.usergroupid = _usergroupid_down;
	}
	$.ajax({
		type:"post",
		url:'/clinic/clinicprivilegemove',
		dataType:"json",
		data:obj
	})
	.done(function(data){
		if(data.code==1){
			//重新获取职位列表
			getDataList(id);
		}else{
			// jQuery.postFail('fadeInUp',data.info);
			jQuery.showError(data.info,'信息反馈');
		}
	})
	.fail(function(){
		jQuery.postFail('fadeInUp','网络超时，请重试！');
	});
	event.stopPropagation();
});

//切换Tab
$(".r_title li").click(function(){
	var index=$(this).index();
	$(this).addClass("actTitle").siblings().removeClass("actTitle");
	$(".f_privileges_cont > div").eq(index).show().siblings().hide();
});
/*----------------------------------------
罗杨 2016-12-09  点击选择框
----------------------------------------- */
$(".f_privileges_cont input[type='checkbox']").on("click",function(){
	if($("input[name=uidType]").val()==0){
		jQuery.showError('请选择职位！','信息反馈');
		return false;
	}else{
		//checkbox点击全选
		if($(this).parents("li").length==0){
			var check=$(this).attr("checked");
				if(check=="checked"){
					$(this).parent(".ch_box").siblings("ul").find("input[type='checkbox']").attr("checked","checked");
				}else{
					$(this).parent(".ch_box").siblings("ul").find("input[type='checkbox']").attr("checked",false);
				}
		}else{
			var max=$(this).parents("ul").find("li").length;
			var len=$(this).parents("ul").find("input[type='checkbox']:checked").length;
			if($(this).parents("#web").length==0){
				//非web版全选子类，总的也要勾选，没全选去掉勾选
				if(max==len){
					$(this).parents("ul").siblings(".ch_box").find("input[type='checkbox']").attr("checked","checked");
				}
				if(max==(len+1)){
					$(this).parents("ul").siblings(".ch_box").find("input[type='checkbox']").attr("checked",false);
				}
			}else{
				//web版子类全选，总的也全选，但子类没全选，总的也要可以勾选
				if(max==len){
					$(this).parents("ul").siblings(".ch_box").find("input[type='checkbox']").attr("checked","checked");
				}
				if(len>0){
					$(this).parents("ul").siblings(".ch_box").find("input[type='checkbox']").attr("checked","checked");
				}
			}
				
		}
	}
})


//权限收缩
$("body").on("click",".sec_icon",function(){
	var _this=$(this);
	_this.siblings("ul").stop(true,true).slideToggle(function(){
		if(_this.hasClass("sec_icon_show")){
			_this.removeClass("sec_icon_show").addClass("sec_icon_hide");
		}else{
			_this.addClass("sec_icon_show").removeClass("sec_icon_hide");
		}
	});
});

//点击职位
$("body").on("click",".f_firstItem",function(){
	//点击职位时新增高亮，移除其他职位高亮
	$(this).addClass("actItem").siblings().removeClass("actItem");
	//保存到隐藏域中
	var _usergroupid = $(this).attr("uid");
	$("input[name=uidType]").val(_usergroupid);
	var username=$(this).find("span").text();
//	console.log("点击职位时："+$("input[name=clinicList]").val(),$("input[name=uidType]").val());
	getPrivilegesList(username);
});
/* --------------------------------
  2016-12-09 罗杨 
  如果是门诊内的管理员或者单店的管理员，右边全选并且不可编辑，多店 的管理员则不是
--------------------------------*/
//权限显示
function getPrivilegesList(username){
	//每次点击菜单时，重置复选框为空，权限伸缩图标为减号，权限显示为展开状态
	$(".perm_r input[type='checkbox']").prop("checked",false);
	$(".sec_icon").removeClass("sec_icon_hide").addClass("sec_icon_show");
	$(".f_privileges_cont").find("ul").show();
	var clinicid=$("input[name=clinicList]").val();
//	console.log(username);
	$.ajax({
		type:"post",
		url:'/clinic/clinicprivilegeget',
		dataType:"json",
		data:{
			info:{
		  		clinicid:$("input[name=clinicList]").val(),
		  		usergroupid:$("input[name=uidType]").val()
			} 
		}
	})
	.done(function(data){
		
		if(clinicid!=1&&username=="管理员"){
			$(".f_privileges_cont input[type=checkbox]").prop({"checked":true,"disabled":true});
			return;
		}else{
			$(".f_privileges_cont input[type=checkbox]").prop("disabled",false);
			$(data.list).each(function(index,el){
				var objWeb = el.userprivileges.split(";");
				for(var i=0;i<objWeb.length;i++){
					$("#PC input[value='"+objWeb[i]+"']").prop("checked",true);
				}
				
				var objApp = el.appprivileges.split(";");
				for(var i=0;i<objApp.length;i++){
					$("#Mobile input[value='"+objApp[i]+"']").prop("checked",true);
				}
				var objwy=el.webprivileges.split(";");
				for(var i=0;i<objwy.length;i++){
					$("#web input[value='"+objwy[i]+"']").prop("checked",true);
				}
			//	console.log(el.otherprivileges);
				if(el.otherprivileges){
					var discount=eval("("+el.otherprivileges+")");
					//console.log(discount);
					$("#minDiscount").val(discount.DiscoundLimit);
					isdisable()
				}
			});
			
			
			
			
			/*----------------------------
			罗杨 2016-12-9
			-------------------------------*/
			//根据子类已选择的个数是否等于子类的总个数，勾选分类名字
			$(".f_privileges_cont section > .ch_box > input[type='checkbox']").each(function(index,el){
					var max=$(this).parents(".ch_box").siblings("ul").children("li").length;
					var len=$(this).parents(".ch_box").siblings("ul").find("input[type='checkbox']:checked").length;
					//console.log(max)
					if(len==max){
						if(max!=0){
							$(this).prop("checked",true);
						}
					}
			})
		}
		
	})
	.fail(function(){
	//	console.log("error");
	});
}

//保存权限
$("#save_per").click(function(){
	if($("input[name=uidType]").val()==0){
		//alert("请选择职位！");
		jQuery.showError('请选择职位！','信息反馈');
		return false;
	}else{
		var obj = {
			info:{
				usergroupid:$("input[name=uidType]").val(),
		  		clinicid:$("input[name=clinicList]").val()
			}
		}
		var webArry = [] , wapArry = [] , web = "",wap = "",wyArry=[],wy="",discount=$("#minDiscount").val();
		$("#PC section").children("ul").find("input[type='checkbox']:checked").each(function(index, element) {
			webArry.push($(this).val());
			web = webArry.join(";");
	    });
		obj.info.userprivileges = web;
		$("#Mobile section").children("ul").find("input[type='checkbox']:checked").each(function(index, element) {
			wapArry.push($(this).val());
			wap = wapArry.join(";");
	    });
		obj.info.appprivileges = wap;
		$("#web section").find("input[type='checkbox']:checked").each(function(index, element) {
			wyArry.push($(this).val());
			wy = wyArry.join(";");
	    });
		obj.info.webprivileges = wy;
		obj.info.otherprivileges="{'DiscoundLimit':'"+discount+"'}";//2017-1-11罗杨 新增最低折扣
		// obj.info.otherprivileges=JSON.stringify({"DiscoundLimit":discount})
		$.ajax({
			type:"post",
			url:'/clinic/clinicprivilegesave',
			dataType:"json",
			data:obj
		})
		.done(function(data){
			if(data.code==1){
				jQuery.postOk('fadeInUp','保存成功');
				getPrivilegesList();
			}else{
				jQuery.showError(data.info,'信息反馈');
			}
		})
		.fail(function(){
			jQuery.postFail('fadeInUp','网络超时，请重试！');
		});
	}
});