/*-------------------------------------------------------------------------------------------
  弹窗封装调用处理模块
  曾令兵
  2017-05-26
  声明:
  因软件式web要求复用性很高，在项目研发过程需要将经常被外部版块调用的小界面小功能
  做成可通用调用的。故此，小功能需要有较高的独立性(即css和js和html保持完整性)，外部
  以ifrmae方式进行类似软件式的调用，很多地方需要弹窗还需要带返回值，所以本js专门进行
  再次封装。
//------------------------------------------------------------------------------------------*/

/*-------------------------------------* 
  禁止上层滚动
/*-------------------------------------*/

jQuery.extend({ 
	/*---------------
	 通用处理区
	 psObj为参数对象结构为
	 {
		 url:'xxx/xx.html?id=xxx',
		 width:'500px',
		 height:'500px',
		 title:'设置',
		 callback:function(){},  //要回传处理的，可以传参数回去
		 uuid:'asfdsafdsa'		  //用于创建唯一id,可以精准移除
		 _isAddCoverDiv:true,  //是否有遮罩层
		_zindex:2, 
	 }
	---------------*/
	this_yayigj_gen_pwd:function(psObj){
		var scr_if_top = 0;		
		//------------------------
		var disable_scroll=function() {	
			$('html').css({"overflow":"hidden","padding-right":"12px"});	
			$('body').css('overflow','');		
		}
		var enable_scroll=function() {
			$('html').css('overflow','').css("padding-right","");
			$('body').css('overflow','');			
		}
		//------------------------
		/*var disable_scroll=function() {			
			scr_if_top = $(window).scrollTop();
			//console.log('scr_if_top=',scr_if_top);
			$('body').css({"top":-scr_if_top+"px","position":"fixed"});
		}
		var enable_scroll=function() {
			//console.log('scr_if_top2=',scr_if_top);
			$('body').css({"position":"","top":""});			
            $(window).scrollTop(scr_if_top);			
		}*/
		//------------------------
		var ops=psObj;
		ops._width=ops.width;
		ops._height=ops.height+44;
		ops._coverOpacity=0.2;
		var newLeft=($(window).width()-ops._width)/2,
			  newTop=($(window).height()-ops._height)/2+$(document).scrollTop(),
			  keys = [37, 38, 39, 40];
			  
		var coverDivId=psObj.divid+'_cover';
		if($("#"+psObj.divid).length>0){
			disable_scroll();
			//var	newLeft=($(window).width()-ops._width)/2,newTop=($(window).height()-ops._height)/2+$(document).scrollTop();
			$("#"+psObj.divid).css({"top":newTop,"left":newLeft,"z-index":ops._zindex}).hide();
		    $("#"+psObj.divid+'_wndTitle span:eq(0)').text(ops.title);
			$("#ifrm_"+psObj.divid).attr("src",ops.url);
			$("#"+coverDivId).show();
			//$("body,html").css({"overflow-y": "hidden"});			
		}else{
			var cssQz='yayigj_pop_window';						
			
			var createCss=function(){
				if(document.getElementById(cssQz)){
					// ==============严继杰修改   2017-05-26   设置弹窗居中   start  添加部分如下======
					var cssStr='';
					cssStr='#'+psObj.divid+'.'+cssQz+'{box-shadow:0px 0px 20px #333;position:absolute;z-index:'+ops._zindex+';display:table;left:'+newLeft+'px;top:'+newTop+'px;width:'+ops._width+'px;height:'+ops._height+'px}';
					cssStr+='.'+cssQz+' .title{border-bottom:solid 1px #F0F0F0;height:44px; width:100%;box-sizing:border-box;padding-left:20px;line-height:44px;text-align:'+ops._titleAlign+';position:relative;font-size:16px}';
					cssStr+='.'+cssQz+' .title .closebtn{width:44px;height:44px;position:absolute;right:0px;top:0px;line-height:44px;text-align:center}';
					cssStr+='.'+cssQz+' .title .closebtn:hover{background-color:#F86D5A;cursor:pointer;color:#fff;}';
					cssStr+='.'+cssQz+' .title .closebtn:active{background-color:#DF6251;color:#fff;}';
					cssStr+='.'+cssQz+' .popFooter{position:absolute;width:100%; height:60px;line-height:60px; border-top:'+ops._fotTopLine+'; bottom:0px;left:0px;text-align:'+ops._fotBgnAlign+';box-sizing:border-box; padding-left:20px; padding-right:20px}';
					cssStr+='.unSelect{-webkit-user-select: none; -moz-user-select: none;    -khtml-user-select: none;  -ms-user-select: none; -o-user-select: none;user-select: none; cursor:default}';
					var nod=$("<style type='text/css' id='"+cssQz+"'>"+cssStr+"</style>");
					$("head").append(nod);
					// ==============严继杰修改   2017-05-26   设置弹窗居中   end======
				}else{
					var cssStr='';
					cssStr='#'+psObj.divid+'.'+cssQz+'{box-shadow:0px 0px 20px #333;position:absolute;z-index:'+ops._zindex+';display:table;left:'+newLeft+'px;top:'+newTop+'px;width:'+ops._width+'px;height:'+ops._height+'px}';
					cssStr+='.'+cssQz+' .title{border-bottom:solid 1px #F0F0F0;height:44px; width:100%;box-sizing:border-box;padding-left:20px;line-height:44px;text-align:'+ops._titleAlign+';position:relative;font-size:16px}';
					cssStr+='.'+cssQz+' .title .closebtn{width:44px;height:44px;position:absolute;right:0px;top:0px;line-height:44px;text-align:center}';
					cssStr+='.'+cssQz+' .title .closebtn:hover{background-color:#F86D5A;cursor:pointer;color:#fff;}';
					cssStr+='.'+cssQz+' .title .closebtn:active{background-color:#DF6251;color:#fff;}';
					cssStr+='.'+cssQz+' .popFooter{position:absolute;width:100%; height:60px;line-height:60px; border-top:'+ops._fotTopLine+'; bottom:0px;left:0px;text-align:'+ops._fotBgnAlign+';box-sizing:border-box; padding-left:20px; padding-right:20px}';
					cssStr+='.unSelect{-webkit-user-select: none; -moz-user-select: none;    -khtml-user-select: none;  -ms-user-select: none; -o-user-select: none;user-select: none; cursor:default}';
					var nod=$("<style type='text/css' id='"+cssQz+"'>"+cssStr+"</style>");
					$("head").append(nod);
				}
			}
			//---------------------------------
			var createUI=function(){
				if(ops._isAddCoverDiv){
					var zIndex=parseInt(ops._zindex)-1;
					var coverDiv=$("<div id='"+coverDivId+"' style='width:"+$(document).width()+"px;height:"+$(document).height()+"px;z-index:"+zIndex+";background-color:#000;position:fixed;left:0px;top:0px;opacity:"+ops._coverOpacity+"'></div>");
					$("#"+coverDivId).hide();
					$("body").append(coverDiv);
				}
				var contentDiv=$("<div id='"+psObj.divid+"' style='width:"+ops._width+"px; height:"+ops._height+"px; top:"+newTop+"px;background-color:#fff;z-index:"+ops._zindex+"' class='"+cssQz+"'>"+
													'<div class="title" id="'+psObj.divid+'_wndTitle"><span>'+ops.title+'</span><span class="closebtn"></span></div>'+
													'<div class="popConent"><iframe id="ifrm_'+psObj.divid+'" name="ifrm_'+psObj.divid+'" src="'+ops.url+'" width="100%" height="'+ops.height+'"  marginheight="0" marginwidth="0" frameborder="0"></iframe></div>'+						
												"</div>");				
				$("body").append(contentDiv);	
				$("#"+psObj.divid+" .title").addClass('unSelect').append('<span class="closebtn">&#10005;</span>');
				
				//$("body,html").css({"overflow-y": "hidden"});
				disable_scroll();
				
				var oFrm = document.getElementById("ifrm_"+psObj.divid);
				oFrm.onload = oFrm.onreadystatechange = function() {
					 if (this.readyState && this.readyState != 'complete') return;
					 else {
						// alert('载入完成');
						$("#"+psObj.divid).show();
					 }
				}
				
				var t_dragObj=document.getElementById(psObj.divid+"_wndTitle");
				var t_pObj=t_dragObj.parentElement;
				
				t_dragObj.onmousedown = function(ev){
					if(ev.target.className=='closebtn'){
						  return;
					}
					var oevent = ev || event;
					var distanceX = oevent.clientX - t_pObj.offsetLeft;
					var distanceY = oevent.clientY - t_pObj.offsetTop;
					document.onmousemove = function(ev){
			　　　　　　var oevent = ev || event;
			　　　　　　t_pObj.style.left = oevent.clientX - distanceX + 'px';
			　　　　　　t_pObj.style.top = oevent.clientY - distanceY + 'px'; 
			　　　	}
			　　　　	document.onmouseup = function(){
			　　　　　　document.onmousemove = null;
			　　　　　　document.onmouseup = null;
			　　　　	}
				}				
				$("#"+psObj.divid+" .closebtn").on("click",function(){		
					scr_if_top=0;			
					close_pop_wnd();					
				});							
			}	
			createCss();
			createUI();		
		} //end else	
		//---------------------------------
		var close_pop_wnd=function(para_obj){
				try{
					enable_scroll();
					$("#"+psObj.divid).hide();
					if(ops._isAddCoverDiv){
						$("#"+coverDivId).hide();
					}				
					if(ops._close_callBackFunc!=null){
						ops._close_callBackFunc(para_obj);
					}	
					console.log('scr_if_top_close=',scr_if_top);				
					//$("body,html").css({"overflow-y": "auto"});
					//$("#ifrm_"+psObj.divid).attr("src","");
				}catch(e){
					//console.log(e);	
				}
		}		
		var api={
			close_pop_wnd:close_pop_wnd	
		}
		return api;
	},
	/*---------------
	  预约设置 
	  调用:jQuery.yayigjWebSoft_schedule_set({UrlParam:'cid=38899882086785655&other=',title:'预约设置',callbackfunc:null});
	 ---------------*/
	 yayigjWebSoft_schedule_set:function(psobj){	
		 	 psobj.width=460;
			 psobj.height=575;
			 psobj._isAddCoverDiv=1;
			 psobj._coverOpacity=0.2;
			 psobj.divid='resever_setting_iframe';
			 psobj.url='/views/netconsult/public/resever_setting_iframe.html?'+psobj.UrlParam;		
			 psobj.	_close_callBackFunc=function(params){
				 psobj.callbackfunc(params);
			 };
			 return jQuery.this_yayigj_gen_pwd(psobj);
	 },
	/*---------------
	  通用设置 
	  调用:jQuery.yayigjShared_set({UrlParam:'cid=38899882086785655&other=',title:'预约设置',callbackfunc:null});
	 ---------------*/
	 //患者来源设置
	yayigjShared_set:function(psobj){
		 psobj.width=440;
		 psobj.height=395;
		 psobj.divid='shared_set_iframe';
		 psobj._zindex='2000';
		 psobj.url='/views/pubpopwd/set/setComeform.html?'+psobj.UrlParam;		
		 psobj.	_close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	 //预约项目设置
	yayigjSchItem_set:function(psobj){
		 psobj.width=440;
		 psobj.height=395;
		 psobj.divid='shared_set_iframe';
		 psobj._zindex='2005';
		 psobj.url='/views/netconsult/public/resever_items_iframe.html?'+psobj.UrlParam;		
		 psobj.	_close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	// ======挂号分诊 弹窗设置  2017-6-8 严继杰=====
	yayigjTriage_patient:function(psobj){
		 psobj.width=860;
		 psobj.height=613;
		 psobj.divid='Triage_patient';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/patient/inc_patient_triage.html?'+psobj.UrlParam;		
		 psobj.	_close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	yayigjTriage_set:function(psobj){
		 psobj.width=550;
		 psobj.height=350;
		 psobj.divid='yayigjTriage_set';
		 psobj._zindex='2000';
		 psobj.url='/views/pubpopwd/patient/inc_register.html?'+psobj.UrlParam;		
		 psobj.	_close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	yayigjTriage_register:function(psobj){
		 psobj.width=450;
		 psobj.height=370;
		 
		 psobj.divid='yayigjTriage_register';
		 psobj._zindex='2000';
		 psobj.url='/views/pubpopwd/patient/inc_set.html?'+psobj.UrlParam;		
		 psobj.	_close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	yayigjDoctor_sort:function(psobj){
		 psobj.width=550;
		 psobj.height=420;
		 psobj.divid='yayigjDoctor_sort';
		 psobj._zindex='2000';
		 
		 psobj.url='/views/pubpopwd/patient/inc_sort.html?'+psobj.UrlParam;		
		 psobj._close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	// ======挂号分诊 弹窗设置  2017-6-8 严继杰     END=====
	//   患者管理 > 咨询沟通 > 新增咨询弹窗
	yayigjAdd_consulting:function(psobj){
		 psobj.width=800;
		 psobj.height=555;
		 psobj.divid='Add_consulting';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/patient/personCenter/inc_consulting/inc_addconsulting.html?'+psobj.UrlParam;		
		 psobj.	_close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//   患者管理 > 咨询沟通 > 患者沟通类型弹窗
	yayigjAdd_settype:function(psobj){
		 psobj.width=400;
		 psobj.height=373;
		 psobj.divid='Add_settype';
		 psobj._zindex='2000';
		 psobj.url='/views/patient/personCenter/inc_consulting/inc_settype.html?'+psobj.UrlParam;		
		 psobj.	_close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
		//  ======会员信息弹窗   2017-6-10 严继杰=====
	//   积分赠送
	yayigjVip_give:function(psobj){
		 psobj.width=640;
		 
		 psobj.height=400;
		 psobj.divid='Vip_give';
		 psobj._zindex='2000';
		 psobj.url='/views/patient/personCenter/incpage/inc_give.html?'+psobj.UrlParam;		
		 psobj.	_close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//   会员升级
	yayigjVip_upgrade:function(psobj){
		 psobj.width=380;
		 psobj.height=486;
		 psobj.divid='Vip_upgrade';
		 psobj._zindex='2000';
		 psobj.url='/views/patient/personCenter/incpage/inc_upgrade.html?'+psobj.UrlParam;		
		 psobj.	_close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//   会员退费
	yayigjVip_refund:function(psobj){
		 psobj.width=640;
		 psobj.height=450;
		 psobj.divid='vip_refund';
		 psobj._zindex='2000';
		 psobj.url='/views/patient/personCenter/incpage/inc_refund.html?'+psobj.UrlParam;		
		 psobj.	_close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//   卡权益说明
	yayigjVip_explain:function(psobj){
		 psobj.width=490;
		 psobj.height=557;
		 psobj.divid='vip_explain';
		 psobj._zindex='2000';
		 psobj.url='/views/patient/personCenter/incpage/inc_explain.html?'+psobj.UrlParam;		
		 psobj.	_close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//患者管理相关弹窗
	//   新建分组
	yayigjGroup_add:function(psobj){
		 psobj.width=410;
		 psobj.height=183;
		 psobj.divid='Group_add';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/patient/patient_addGroup.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//   患者编辑
	yayigjEdit_patient:function(psobj){
		 psobj.width=850;
		 psobj.height=530;
		 psobj.divid='Edit_patient';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/patient/editPatient.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//   患者新建
	yayigjAdd_patient:function(psobj){
		 psobj.width=850;
		 psobj.height=530;
		 psobj.divid='Add_patient';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/patient/addPatient.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//   患者分组管理
	yayigjGroup_patient:function(psobj){
		 psobj.width=980;
		 psobj.height=506;
		 psobj.divid='Group_patient';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/patient/patientPop_group.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//   患者亲友编辑
	yayigjRel_Man:function(psobj){
		 psobj.width=576;
		 psobj.height=420;
		 psobj.divid='Rel_Man';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/patient/relationAdd.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//   患者亲友类型编辑
	yayigjRelType_Man:function(psobj){
		 psobj.width=550;
		 psobj.height=373;
		 psobj.divid='RelType_Man';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/patient/relationType.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//   病历号设置
	yayigjmednum_patient:function(psobj){
		 psobj.width=576;
		 psobj.height=420;
		 psobj.divid='mednum_patient';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/patient/patientPop_mednum.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//   患者印象设置
	yayigjImprss:function(psobj){
		 psobj.width=360;
		 psobj.height=385;
		 psobj.divid='Imprss';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/patient/patientPop_imprss.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//   患者来源设置
	yayigjPatientCome:function(psobj){
		 psobj.width=360;
		 psobj.height=385;
		 psobj.divid='PatientCome';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/patient/patientPop_come.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//   患者显示字段设置
	yayigjFields:function(psobj){
		 psobj.width=576;
		 psobj.height=376;
		 psobj.divid='Pop_fields';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/patient/patientPop_fields.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//   处置记录－处置列表
	yayigjhandling_list:function(psobj){
		 psobj.width=880;
		 psobj.height=522;
		 psobj.divid='handlingList';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/disposal/handlingList.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	}, 
	//患者管理相关弹窗============end
	//会员充值 luoyang
	yayigjVip_recharge:function(psobj){
		 psobj.width=638;
		 psobj.height=456;
		 psobj.divid='vip_recharge';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/patient/personCenter/incpage/inc_vip_recharge.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},//会员开卡 luoyang
	yayigjVip_open:function(psobj){
		 psobj.width=380;
		 psobj.height=538;
		 psobj.divid='vip_open';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/patient/personCenter/incpage/inc_vip_open.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},

	//课程选择 LiChenXi
    yayigjcourse_open: function (psobj) {
        psobj.width = 980;
        psobj.height = 500;
        psobj.divid = 'course_open';
        psobj._zindex = '2000';
        psobj._isAddCoverDiv = 1;
        psobj.url = '/views/erp/message/inc_message.html?' + psobj.UrlParam;
        psobj._close_callBackFunc = function (params) {
            psobj.callbackfunc(params);
        };
        return jQuery.this_yayigj_gen_pwd(psobj);
    },
	//积分记录
	yayigjVip_integrals:function(psobj){
		 psobj.width=1016;
		 psobj.height=448;
		 psobj.divid='vip_integrals';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/patient/personCenter/incpage/inc_integral_report.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//交易记录
	yayigjVip_transaction:function(psobj){
		 psobj.width=1016;
		 psobj.height=448;
		 psobj.divid='vip_transaction';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/patient/personCenter/incpage/inc_transaction_report.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//绑定患者
	yayigjVip_bindpatient:function(psobj){
		 psobj.width=924;
		 psobj.height=500;
		 psobj.divid='vip_bindpatient';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/patient/personCenter/incpage/inc_bind_patient.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//处置组合----选择处置
	yayigjhandle_selc:function(psobj){
		 psobj.width=936;
		 psobj.height=536;
		 psobj.divid='handle_selc';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/systemSet/public/inc_disposalComb.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//牙位
	yayigjTeeth:function(psobj){
		 psobj.width=700;
		 psobj.height=500;
		 psobj.divid='vip_bindpatient';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/set/teethPos.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//回访弹窗
	yayigjback_visit:function(psobj){
		 psobj.width=1030;
		 psobj.height=587;
		 psobj.divid='back_visit';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/patient/public/inc_add_back_visit.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//发送短信弹窗
	yayigjSend_sms:function(psobj){
		 psobj.width=1007;
		 psobj.height=475;
		 psobj.divid='send_sms';
		 psobj._zindex='2000';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/netconsult/public/smsEditModule_iframe.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//小的新增回访计划弹窗
	yayigjbv_plan:function(psobj){
		 psobj.width=630;
		 psobj.height=400;
		 psobj.divid='bv_plan';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/patient/public/add_visit_plan.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//复诊预约弹窗
	yayigjrefer_schedule:function(psobj){
		 psobj.width=892;
		 psobj.height=568;
		 psobj.divid='refer_schedule';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/patient/public/refer_schedule.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//小的预约弹窗
	yayigjsch_min:function(psobj){
		 psobj.width=576;
		 psobj.height=410;
		 psobj.divid='sch_min';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/set/schMin.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//商学院添加用户弹窗
	yayigjCollege_add_user:function(psobj){
		 psobj.width=580;
		 psobj.height=270;
		 psobj.divid='College_add_user';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/erp/college/account/add_user.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//商学院批量导入弹窗
	yayigjCollege_import:function(psobj){
		 psobj.width=580;
		 psobj.height=270;
		 psobj.divid='College_import';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/erp/college/account/import.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//商学院积分管理添加积分记录弹窗
	yayigjCollege_add_integral:function(psobj){
		 psobj.width=580;
		 psobj.height=660;
		 psobj.divid='College_add_integral';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/erp/college/integral/add_integral.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//商学院积分管理添加微课堂弹窗
	yayigjCollege_add_micro:function(psobj){
		 psobj.width=580;
		 psobj.height=270;
		 psobj.divid='College_add_micro';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/erp/college/micro/add_micro.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//商学院微课堂回访评论弹窗
	yayigjCollege_revisit_comments:function(psobj){
		 psobj.width=580;
		 psobj.height=320;
		 psobj.divid='College_revisit_comments';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/erp/college/micro/revisit_comments.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//新增预约（复诊预约）弹窗
	yayigjBv_refer:function(psobj){
		 psobj.width=890;
		 psobj.height=580;
		 psobj.divid='Bv_refer';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/netconsult/public/refer_schedule.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//回访弹窗
	yayigjBv_visit:function(psobj){
		 psobj.width=1030;
		 psobj.height=588;
		 psobj.divid='Bv_visit';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/netconsult/backvisit/add_back_visit_inc.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//电网切换预约状态弹窗
	yayigjtab_sch_state_net:function(psobj){
		 psobj.width=570;
		 psobj.height=261;
		 psobj.divid='tab_sch_state_net';
		 psobj._zindex='1009';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/set/tabSchState_net.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//预约-----流失原因设置
	yayigjLostSet:function(psobj){
		 psobj.width=440;
		 psobj.height=345;
		 psobj.divid='LostSet';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/pubpopwd/schedule/lostset.html?'+psobj.UrlParam;		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
	//商学院-视频上传弹框
	yayigjupvideo:function(psobj){
		 psobj.width=440;
		 psobj.height=345;
		 psobj.divid='yjgjupvideo';
		 psobj._zindex='2001';
		 psobj._isAddCoverDiv=1;
		 psobj.url='/views/erp/collegenew/inc/inc_upvideo.html';		
		 psobj. _close_callBackFunc=function(params){
			 psobj.callbackfunc(params);
		 };
		 return jQuery.this_yayigj_gen_pwd(psobj);
	},
});