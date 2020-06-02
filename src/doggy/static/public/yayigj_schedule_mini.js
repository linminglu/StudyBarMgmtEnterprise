//--------------------------------------
// 预约控件 2017-05-22 曾令兵
// 用于新增,修改  sch_mini_api.addDataBlk({starttime:'19:30',endtime:'20:30',duration:'60','id':'72786485367017475','scheduledate':'2017-05-01'})
//--------------------------------------
;(function(){	
	//-------------------------------------
	// 功能api实现也提供给外部调用
	//-------------------------------------
	$.callFeaturesMiniApi=function(obj,ops){
		var Ownerid=obj.attr('id');	
		var bus_startTime=null;
		var bus_endTime=null;
		var sch_today=new Date();
		var sch_todays=sch_today.getFullYear()+'/'+(sch_today.getMonth()+1)+'/'+sch_today.getDate();
		var bus_st_ed_tm=getStartEndTm();  	
		var vert_scale=ops.time_scale==30?31:21; 
		var isMouseDown=false;
		var mvOrResize='mv';  	//[mv|rz]
		var drgMv=false;
		var resizeParam=null;
		var col_data_arr=new HashTable(); 
		var col_doctor_obj=	new HashTable();
		var ico_colors=ops.sch_ico_color();		
		var by=function(name){
				 return function(o, p){
				　var a, b;
				　if (typeof o === "object" && typeof p === "object" && o && p) {
						　 a = o[name]; b = p[name];
						　 if (a === b) {return 0; }
						　 if (typeof a === typeof b) {return a < b ? -1 : 1;}
						　 return typeof a < typeof b ? -1 : 1;
				　}else {throw ("error");}
				 }
			};
		//console.log('bus_st_ed_tm=',bus_st_ed_tm);		
		//------------------------
		// 初始化自动执行
		//------------------------
		function init(){
			bus_startTime=parseInt(ops.schule_hours.split('-')[0]);
			bus_endTime=parseInt(ops.schule_hours.split('-')[1]);	
			genTimeVline(ops.time_scale);		
		}
		//------------------------
		// 时间格式化
		//------------------------
		function date_format(dt){
				var date = dt;
				var seperator1 = "/";
				var seperator2 = ":";
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var _h=date.getHours(); _h=_h<10?'0'+_h:_h;
				var _m=date.getMinutes();_m=_m<10?'0'+_m:_m;
				var _s=date.getSeconds();_s=_s<10?'0'+_s:_s;
				var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
						+ " " + _h + seperator2 + _m+ seperator2 + _s;
				return currentdate
		}
		//-------------------------------------------------
		// 返回代表块数据信息[支外]
		//-------------------------------------------------
		function getAEblkInfo(){
			var infos=$("#"+Ownerid+" #min_aed_blk .stinfo").text().split(' ');
			var tm=infos[0].split('-');
			return {'startTm':tm[0],'endTm':tm[1].split('(')[0],'duration':$("#"+Ownerid+" #min_aed_blk").attr('data-durtion')};
		}
		//-------------------------------------------------
		// 加入修改代表块[支外] 参数: starttime  endtime  duration id
		//-------------------------------------------------
		function edtDataBlk(obj){				
			gen_dblock_by_doc(col_doctor_obj.getValue($("#"+Ownerid).attr('data-docid')),obj.id);
			var _h=obj.duration/ops.time_scale*vert_scale;			 
 	        var scaleToH=vert_scale;  	
			var pub_dt=obj.scheduledate;
			var startTms=new Date((pub_dt+' '+obj.starttime).replace(/-/g,"/")),
				  busStime=new Date((pub_dt+' '+obj.starttime).split(' ')[0].replace(/-/g,"/")+' '+bus_startTime+':00');
			var startRow=(startTms-busStime)/60000/parseInt(ops.time_scale)*scaleToH;		
			 
			var divObj=$("<div class='min_block min_aed_blk' id='min_aed_blk' data-id='min_aed_blk' data-durtion='"+
									obj.duration+"' style='height:"+_h+"px;top:"+startRow+"px'><div class='blk_text'><span class='stinfo'>"+
									obj.starttime+"-"+obj.endtime+"("+obj.duration+"m)</span></div></div>");
			$("#"+Ownerid+" .sch_mini_single .min_aed_blk").remove();
			$("#"+Ownerid+" .sch_mini_single").append(divObj);			
		}
		//-------------------------------------------------
		// 加入新增代表块[支外] 参数: starttime  endtime  duration
		//-------------------------------------------------
		function addDataBlk(obj){
			var _h=obj.duration/ops.time_scale*vert_scale;			 
 	        var scaleToH=vert_scale;  	
			var pub_dt=obj.scheduledate;
			var startTms=new Date((pub_dt+' '+obj.starttime).replace(/-/g,"/")),
				  busStime=new Date((pub_dt+' '+obj.starttime).split(' ')[0].replace(/-/g,"/")+' '+bus_startTime+':00');
			var startRow=(startTms-busStime)/60000/parseInt(ops.time_scale)*scaleToH;	
			var divObj=$("<div class='min_block min_aed_blk' id='min_aed_blk' data-id='min_aed_blk' data-durtion='"+
									obj.duration+"' style='height:"+(_h-2)+"px;top:"+startRow+"px'><div class='blk_text'><span class='stinfo'>"+
									obj.starttime+"-"+obj.endtime+"("+obj.duration+"m)</span></div></div>");
			$("#"+Ownerid+" .sch_mini_single .min_aed_blk").remove();
			$("#"+Ownerid+" .sch_mini_single").append(divObj);
		}
		//-------------------------------------------------
		//更新数据块上的时间显示
		//-------------------------------------------------
		function updateStInfo(el,str){
				$(el).find(".stinfo").text(str);
		}
		//-------------------------------------------------
		// 根据top算时间[zlb 2017/05/22]
		//-------------------------------------------------
		function calc_start_tm_bytop(top,duration){				
				var nDate=date_format(bus_st_ed_tm[0]);
				//console.log('nDate=',nDate);
				var cur_tm=new Date(nDate);		
				cur_tm.setMinutes(cur_tm.getMinutes() + top/vert_scale*ops.time_scale,cur_tm.getSeconds(), 0);
				
				if(typeof(duration)!='undefined'){
					var cur_etm=new Date(date_format(cur_tm));
					cur_etm.setMinutes(cur_etm.getMinutes() + parseInt(duration),cur_etm.getSeconds(), 0);
					return [cur_tm,date_format(cur_tm).split(' '),cur_etm,date_format(cur_etm).split(' '),duration];
				}else{
					return [cur_tm,date_format(cur_tm).split(' ')];
				}
		}
		//-------------------------------
		// 以医生为条件生成数据块[支外][ok:5-9]
		//-------------------------------
		function gen_dblock_by_doc(p,exclude_id){
			if(p==null){return;}
			$("#"+Ownerid+" .sch_mini_single .min_block").remove(); 
			for(var i=0,len=p.sh_data_ids.sort(by('row')).length;i<len;i++){	
				if(typeof(exclude_id)!='undefined' && exclude_id==p.sh_data_ids[i].id){ continue; }
				var p_obj=col_data_arr.getValue(p.sh_data_ids[i].id);
				var _colr_ico=ico_colors[p_obj.status];
				p_obj.nextdom=[];
				p_obj.predom=null;
				//p_obj.width=public_cnf.fit_col_w-1;
				var icos=[];
				
				if(p_obj.importance==null){  //排除日程
					if(parseInt(p_obj.visitstatus)==0){ 	icos.push('<img class="t_ico" src="'+ops.sch_ico_path+'/cu.png" />'); 	}
					if(p_obj.vipcardidentity!=''){ 	icos.push('<img class="t_ico" src="'+ops.sch_ico_path+'/vip.png" />'); 	}
					if(p_obj.items.indexOf('种植')>-1){icos.push('<img class="t_ico" src="'+ops.sch_ico_path+'/zhi.png" />'); }
					if(p_obj.items.indexOf('修复')>-1){icos.push('<img class="t_ico" src="'+ops.sch_ico_path+'/xiu.png" />'); }
					if(p_obj.items.indexOf('正畸')>-1){icos.push('<img class="t_ico" src="'+ops.sch_ico_path+'/ji.png" />'); }
				}				
				var strDataBlock=$('<div class="min_block"   data-id="'+p_obj.dataid+'" data-docid="'+p_obj.doctorid+'"  id="'+p_obj.id+'" style="background-color:'+_colr_ico.bcolr+';border-color:'+_colr_ico.bcolr+';left:1px;top:'+p_obj.top+'px;height:'+(p_obj.height-3)+'px">'+
											'<span class="status"></span>'+
												'<span class="blk_text"   style="background-color:'+_colr_ico.colr+'">'+
													'<i class="nm"><span>'+p_obj.custName+'</span>'+icos.join('')+'</i>'+
													'<i class="er">'+p_obj.items+'</i>'+
													'<i class="js"><b class="stinfo">'+p_obj.sshortTime+'-'+p_obj.eshortTime+' ('+p_obj.duration+'m)</b></i>'+
												'</span>'+
											'</div>');
		 		$("#"+Ownerid+" .sch_mini_single").append(strDataBlock);	
				genDataBlockPos(p_obj.doctorid,p_obj.id);
			}			
		}
		//----------------------------------------------
		 // 生成单个数据块位置及大小(生成数据时调用)
		 // dcoid 医生id dbojid div对象id
		 //----------------------------------------------	
		 function genDataBlockPos(dcoid,dbojid){		
			//--------------------
			var genSingleLink=function(arrs,len,_W){						//间接关系对象宽度计算	
					var rcns=0,_ids=[],_inArrs=[];
					var gen_spec_lw=function(arr){
						var _p=arr,_t=arr.nextdom.length;	 									
							while(_t>1){
									_t=_p.nextdom.length;	
									_p=_p.nextdom[0];							
									if(typeof(_p)!='undefined'){
										_inArrs.push({ "top":$("#"+_p.id)[0].offsetTop,"id":_p.id});												
									}else{_t=0;	}
								}
						};					
					for(var i=0,iLen=arrs.length;i<iLen;i++){
						gen_spec_lw(col_data_arr.getValue($("#"+arrs[i]).attr("data-id")));						
					}
					return _inArrs;
			};	
			//--------------------
			var my_relationids=getBlock_id_xy(dcoid,dbojid);  		//跟我有关系的邻居
			var iaLen=my_relationids.length,curObj=null,parentObj=null;	
			if(iaLen==0){return;}
			if(iaLen==1&&my_relationids[0]==dbojid){ return; }
			curObj=col_data_arr.getValue($("#"+dbojid).attr("data-id"));
			parentObj=col_data_arr.getValue($("#"+my_relationids[iaLen-2]).attr("data-id"));
			curObj.predom=parentObj;					//指针串数据	
			
			if(parentObj!=null){parentObj.nextdom.push(curObj);}		//指针串数据 将当前对象与你父对象串起来
			var 	where=curObj.predom,doms=0,p=curObj/*.predom*/,idnames=[],direct_ids=[];
			while(where!=null){					
					++doms;					
					where=p.predom;
					direct_ids.push(p.id);		
					idnames.push({"top":$("#"+p.id)[0].offsetTop,"id":p.id});	
					p=p.predom;						
			}			
			var arrLen=idnames.length,avWidth=ops.fit_col_w/arrLen;	 
		
			idnames.reverse();
			var indirects=genSingleLink(direct_ids,arrLen,$("#"+idnames[0].id).innerWidth());	//有间接关系的id列表		
			var alldoms=idnames.concat(indirects);
			arrLen=alldoms.length;
			avWidth=ops.fit_col_w/arrLen;	
			var newAlls=alldoms.sort(by("top"));
			for(var i=0;i<arrLen;i++){
				$("#"+newAlls[i].id).outerWidth(avWidth-1).css({"left":i*(avWidth)});  	//有直接关系的直接平均宽度				
			}	
			
		 }		
		//-------------------------------------------------
		// 查医生列中指定时间段内的数据块ID,按坐标版
		//-------------------------------------------------
		function getBlock_id_xy(doctorid,idName){
			var result=[];
			var cur_obj=$("#"+idName),
				  _ctop=cur_obj[0].offsetTop,
				  _cfot=_ctop+cur_obj.outerHeight(); 
			$("#"+Ownerid+" .sch_mini_single  .min_block").each(function(index, element)  {
				var _top=$(element)[0].offsetTop+1,
					  _fot=_top+$(element).height()-1;
				if((_top>=_ctop && _top<=_cfot) || (_fot>=_ctop && _fot<=_cfot)){
					result.push($(this).attr("id"));
				}else{
					if((_ctop>=_top && _ctop<=_fot) && (_cfot>=_top && _cfot<=_fot)){
						result.push($(this).attr("id"));	
					}
				}					
			});
			return result;  
		}
		//-----------------------------------------
		// 生成日程及预约数据表[17/05/23][支外]
		//-----------------------------------------
		function gen_docData_list(json_obj){	 
			col_doctor_obj.clear();
			col_data_arr.clear();
			//console.log('json_obj=',json_obj);
			var getRow=function(v_duration,v_starttime,v_scheduledate){
				var _mute=v_duration;
				var blockH=_mute/ops.time_scale*vert_scale;
				var scaleToH=ops.time_scale==15? vert_scale:vert_scale;  	
				var pub_dt=v_scheduledate.replace(/-/g,'/');
				var startTms=new Date(pub_dt+' '+ v_starttime),busStime=new Date(pub_dt+' '+bus_startTime+':00');
				var startRow=(startTms-busStime)/60000/parseInt(ops.time_scale)*scaleToH;	
				return startRow;					
			};
			//console.log(json_obj.list.schedule);
			var doctorid=null;

			var _uuid=uuid(8, 16);
			var schedules_ids=[],doctoragendas_ids=[],workshift=[];
			if(json_obj.list.schedule!=null && json_obj.list.schedule.length>0){
				$.each(json_obj.list.schedule,function(kk,vv){							
					schedules_ids.push({'row':getRow(vv.duration,vv.starttime,vv.scheduledate),'id':vv.scheduleidentity});
					addToDBlockTable(vv);		//将预约数据追加到表中
					doctorid=vv.doctorid;
				});
			}
			if(json_obj.list.doctoragenda!=null && json_obj.list.doctoragenda.length>0){					
				$.each(json_obj.list.doctoragenda,function(_k,_v){
					doctoragendas_ids.push({'row':getRow(_v.duration,_v.starttime,_v.agendadate),'id':_v.agendaidentity==""?_uuid:_v.agendaidentity});
					addToArgbkTable(_v,_uuid);	//将事事项数据追加到表中
					doctorid=_v.doctorid;
				});
			}
			var 	doctObj={};
					doctObj.dataCount=0;							//数据块数量
					doctObj.id="hcol_"+doctorid;			//对象ID编号
					doctObj.name='';						//医生姓名
					doctObj.doctorid=doctorid;				//医生编号
					doctObj.sh_data_ids=schedules_ids.concat(doctoragendas_ids); //医生下的所有数据块	
					doctObj.ag_data_ids=doctoragendas_ids;			//事项
					//doctObj.workshift=v.workshift;							//排班信息
			col_doctor_obj.add(doctorid,doctObj);	//插件内部维护的一个医生列表对象
			$("#"+Ownerid).attr('data-docid',doctorid);
			gen_dblock_by_doc(col_doctor_obj.getValue(doctorid));
			//console.log('col_doctor_obj=',col_doctor_obj.getKeys(),col_data_arr.getKeys(),col_doctor_obj.getValue('40873960929234944'));
		}	
		//--------------------------------
		// 生成uuid
		//--------------------------------	
		function uuid(len, radix) {
			var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
			var uuid = [], i;
			radix = radix || chars.length;		 
			if (len) {
			  for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
			} else {
			  var r;
			  uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
			  uuid[14] = '4';
			  for (i = 0; i < 36; i++) {
				if (!uuid[i]) {
				  r = 0 | Math.random()*16;
				  uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
				}
			  }
			}		 
			return uuid.join('');
		}
		//------------------------
		// 生成事项表[支外][ok:5-9]
		//------------------------
		function addToArgbkTable(v,uuid){
			 var _mute=/*(new Date(v.endtime.replace(/-/g,'/'))-new Date(v.starttime.replace(/-/g,'/')))/60000*/v.duration,_cha=_mute/15;	
			 var blockH=_mute/ops.time_scale*vert_scale;
			 var scaleToH=ops.time_scale==15? vert_scale:vert_scale;  	
			 var pub_dt=v.agendadate;		
			 var startTms=new Date((pub_dt+' '+v.starttime).replace(/-/g,"/")),busStime=new Date((pub_dt+' '+v.starttime).split(' ')[0].replace(/-/g,"/")+' '+bus_startTime+':00');
			 var startRow=(startTms-busStime)/60000/parseInt(ops.time_scale)*scaleToH;	
			 uuid=v.agendaidentity!=''?v.agendaidentity:uuid;
			 var 	dataObj={};
			 		dataObj.dataid=uuid;  							//数据ID		
					dataObj.id="mblock_"+dataObj.dataid;  					//对象ID				
					dataObj.startTime=v.agendadate+'  '+v.starttime;									//开始时间
					dataObj.endTime=v.agendadate+'  '+v.endtime;										//结束时间
					dataObj.duration=v.duration;										//时长
					dataObj.sshortTime=(v.agendadate+' '+v.starttime).substr(10,6);			//短时间模式(起)
					dataObj.eshortTime=(v.agendadate+' '+v.endtime).substr(10,6);				//短时间模式(终)
					dataObj.custName='事项 : '+v.agendaitem;
					dataObj.data_ws=1;														//横向宽度
					dataObj.data_cinx=$("#col_"+v.doctorid).index();		//列顺序
					dataObj.left=0;																//x坐标
					dataObj.top=startRow;				 									//y坐标
					//dataObj.width=public_cnf.fit_col_w-1;						//宽度
					dataObj.height=blockH;												//高度
			 		dataObj.doctorid=v.doctorid;										//医生编号
					dataObj.doctorName=v.agendadoct;							//医生姓名	
					dataObj.items=v.remark		;										//事项
					dataObj.status='matter';
					dataObj.importance=v.importance;							//重要性
					dataObj.remark=v.remark;											//备注
			col_data_arr.add(uuid,dataObj);					 			 			
		}
		//------------------------
		// 生成预约表[支外][ok:5-9]
		//------------------------
		function addToDBlockTable(v){
			 var _mute=/*(new Date(v.endtime.replace(/-/g,'/'))-new Date(v.starttime.replace(/-/g,'/')))/60000*/v.duration,_cha=_mute/15;	
			 var blockH=_mute/ops.time_scale*vert_scale;
			 var scaleToH=ops.time_scale==15? vert_scale:vert_scale;  		
			 var pub_dt=v.scheduledate;
			 var startTms=new Date((pub_dt+' '+v.starttime).replace(/-/g,"/")),busStime=new Date((pub_dt+' '+v.starttime).split(' ')[0].replace(/-/g,"/")+' '+bus_startTime+':00');
			 var startRow=(startTms-busStime)/60000/parseInt(ops.time_scale)*scaleToH;						 			 
			 var 	dataObj={};
			 		dataObj.dataid=v.scheduleidentity;  							//数据ID		
					dataObj.id="mblock_"+v.scheduleidentity;  					//对象ID				
					dataObj.startTime=v.scheduledate+' '+v.starttime;									//开始时间
					dataObj.endTime=v.scheduledate+' '+v.endtime;										//结束时间
					dataObj.duration=v.duration;										//时长
					dataObj.sshortTime=(v.scheduledate+' '+v.starttime).substr(10,6);			//短时间模式(起)
					dataObj.eshortTime=(v.scheduledate+' '+v.endtime).substr(10,6);				//短时间模式(终)
					dataObj.data_ws=1;														//横向宽度
					dataObj.data_cinx=$("#col_"+v.doctorid).index();		//列顺序
					dataObj.left=0;																//x坐标
					dataObj.top=startRow;				 									//y坐标
					dataObj.width=100;														//宽度
					dataObj.height=blockH;												//高度
					dataObj.custName=v.name;										//患者
					dataObj.doctorid=v.doctorid;										//医生编号
					dataObj.doctorName=v.doctorname;							//医生姓名
					dataObj.phone=v.phone;												//电话
					dataObj.sex=v.sex;															//性别
					dataObj.payment=v.payment;										//已收金额
					dataObj.debts=v.debts;												//欠费金额
					dataObj.items=v.items;													//治疗项目
					dataObj.status=v.status;												//预约状态：0预约，1确认，2过期，3到达，8流失 
					dataObj.viptype=v.viptype;
					dataObj.vipnumber=v.vipnumber;
					dataObj.vipcardidentity=v.vipcardidentity;
					dataObj.visitstatus=v.visitstatus;									//检查状态：0-初诊；1-复诊；3-新诊  初诊时显示初标记
					dataObj.importance=null;											//表示事项对象,用于跟预约对象区分开来
					dataObj.remark=v.remark;											//备注[用于区分事项和预约]
					dataObj.predom=null;													//前面节点	
					dataObj.nextdom=[];					 								//后面节点
			 col_data_arr.add(v.scheduleidentity,dataObj);				 
		}
		//------------------------
		// 今天的营业时间
		//------------------------	
		function getStartEndTm(st_et){			
			if(typeof(st_et)!='undefined' && st_et!=''){
				var _st=new Date(sch_todays+' '+parseInt(st_et.split('-')[0])+':00:00');
				var _et=new Date(sch_todays+' '+parseInt(st_et.split('-')[1])+':00:00');
			}else{
				var _st=new Date(sch_todays+' '+parseInt(ops.schule_hours.split('-')[0])+':00:00');
				var _et=new Date(sch_todays+' '+parseInt(ops.schule_hours.split('-')[1])+':00:00');
			}
			var _ca=(_et-_st)/60000;
			return [_st,_et,_ca];
		}	
		//------------------------
		// 生成纵向时间线[支外]
		//------------------------
		function genTimeVline(cur_scale){	
			var tmp=[];			
			for(var i=bus_startTime;i<=bus_endTime;i++){
				var numStr=i<10?'0'+i:i;
				tmp.push('<li class="vTime">'+numStr+'</li>');
			}
			$("#"+Ownerid+" .in_vkd").append(tmp.join(''));	
			var scaleToH=cur_scale==15? vert_scale*4:vert_scale*2; 
			$("#"+Ownerid+" .in_vkd li").height(scaleToH);				
			$("#"+Ownerid+" .sch_mini_single").height((bus_endTime+1-bus_startTime)*scaleToH);	
			$("#"+Ownerid+" .v_kd_mini").height((bus_endTime+1-bus_startTime)*scaleToH);				
		}
		
		//------------------------
		// 拖动处理区域
		//------------------------	
		function dragMobj(){
			this.el=null;
			this.oParent=null;
			this.disX=0;
			this.disY=0;
			this.isDown=false;  			//是否按下
			this.isMv=false;					//是否移动过
			this.directionV='d';			//默认向下方向[d下u上]
			this.directionH='r'; 			//默认向右方向[l左r右]
			this.downclkY=0;				//按下时的Y值
			this.downclkX=0;				//按下时的X值			
		}
		function dgMvDown(oEvent,jqObj){
			//console.log('jqObj=',jqObj);
			if(oEvent.buttons!=1){return;}
			isMouseDown=true;
			drgMv = new dragMobj();
			drgMv.isDown=true;
			drgMv.el=jqObj[0];			
			drgMv.id=jqObj.attr('id');
			drgMv.disX=oEvent.clientX-drgMv.el.offsetLeft;
			drgMv.disY=oEvent.clientY-drgMv.el.offsetTop;
			drgMv.downclkY=oEvent.clientY;
			drgMv.downclkX=oEvent.clientX;	
			drgMv.isMv=false;				
			drgMv.dataObj=col_data_arr.getValue(jqObj.attr("id").split('_')[1]);
			$(drgMv.el).css({"z-index":(ops.block_zindex+1)});	
		}
		function dgMvMove(oEvent){	
			if(oEvent.buttons!=1){return;}
			drgMv.isMv=true;
			if(drgMv.isDown==false){return;}
			var cur_obj_id=drgMv.id;
			var t=oEvent.clientY-drgMv.disY;						
			var row=parseInt(t/drgMv.vkd);	
			++row;
			var direct_x=Math.abs(oEvent.clientX-drgMv.downclkX);
			var direct_y=Math.abs(oEvent.clientY-drgMv.downclkY);
			var newDirect="d";
			var stm=null;
			oEvent.clientY<drgMv.downclkY?drgMv.directionV='u':drgMv.directionV='d';	
			newDirect=direct_y>direct_x?drgMv.directionV:drgMv.directionH;					
			switch(newDirect){
				case "d":		//往下走	
					l=0;	
					t=Math.round(t/vert_scale)*vert_scale;				
					drgMv.el.style.top=t+'px';	
					if(drgMv.id=='min_aed_blk'){
						stm=calc_start_tm_bytop(t,$(drgMv.el).attr('data-durtion'));
						tmpPub=stm[1][1].substring(0,5)+'-'+stm[3][1].substring(0,5)+' ('+$(drgMv.el).attr('data-durtion')+'m)';
					}else{
						stm=calc_start_tm_bytop(t,drgMv.dataObj.duration);	
						tmpPub=stm[1][1].substring(0,5)+'-'+stm[3][1].substring(0,5)+' ('+drgMv.dataObj.duration+'m)';
					}
					updateStInfo(drgMv.el,tmpPub);						   
					break;	
			     case "u":	//往上走	
					if(t<=0){									
						drgMv.el.style.top='0px';									
						return;
					}
				  t=Math.round(t/vert_scale)*vert_scale;						
				  drgMv.el.style.top=t+'px';		
			      if(drgMv.id=='min_aed_blk'){
						stm=calc_start_tm_bytop(t,$(drgMv.el).attr('data-durtion'));
						tmpPub=stm[1][1].substring(0,5)+'-'+stm[3][1].substring(0,5)+' ('+$(drgMv.el).attr('data-durtion')+'m)';
				  }else{
						stm=calc_start_tm_bytop(t,drgMv.dataObj.duration);	
						tmpPub=stm[1][1].substring(0,5)+'-'+stm[3][1].substring(0,5)+' ('+drgMv.dataObj.duration+'m)';
				  }		
				  updateStInfo(drgMv.el,tmpPub);			   
				  break;	
			}						
		}
		function dgMvUp(oEvent){
			isMouseDown=false;
			drgMv.isMv=false;
			if(drgMv.id!='min_aed_blk'){
				$(drgMv.el).css({"z-index":(ops.block_zindex)});	
			}
		}
		//------------------------
		// 改大小处理
		//------------------------	
		function resizeObject() {
			this.el        = null; 
			this.dir    = "";     
			this.grabx = null;     
			this.graby = null;
			this.width = null;
			this.height = null;
			this.left = null;
			this.top = null;
		}
		function getDirection(el,evt) {
			var xPos, yPos, offset, dir;
			dir = "";		
			xPos = evt.offsetX;
			yPos = evt.offsetY;		
			offset =8; 
			if (yPos<offset) dir += "n";
			else if (yPos > el.offsetHeight-offset) dir += "s";
			if (xPos<offset) dir += "w";
			else if (xPos > el.offsetWidth-offset) dir += "e";		
			return dir;
		}
		function doDown(robj,evt) {			
			var el =robj ;
			isMouseDown=true;
			if (el == null) {
				resizeParam = null;
				return;
			}			
			var _pData=col_data_arr.getValue($(el).attr('data-id'));
			dir = getDirection(el,evt);
			if (dir == "" && el.style.cursor =="") return;	
			resizeParam = new resizeObject();		
			//resizeParam.het=_pData.height;
			resizeParam.pdata=_pData;
			resizeParam.el = el;
			resizeParam.dir = dir;
			resizeParam.grabx = evt.clientX;
			resizeParam.graby = evt.clientY;
			resizeParam.width = el.offsetWidth;
			resizeParam.height = el.offsetHeight;
			resizeParam.left = el.offsetLeft;
			resizeParam.top = el.offsetTop;
			resizeParam.bottom = el.offsetTop+resizeParam.height;
			//resizeParam.duration=_pData.duration;
			evt.returnValue = false;
			evt.cancelBubble = true;	
		}
		function doMove(ev) {
			var objEvt=ev||event;
			var el, xPos, yPos, str, xMin, yMin;				
			xMin = 8; 
			yMin = 8; 
			if(objEvt.target.className=='blk_text'){
				el=objEvt.target.parentElement;					
			}else{
				el=objEvt.target;
			}
			try{
				if (typeof(el.className)!='undefined' && el.className == "min_block") {
					str = getDirection(el,objEvt);				
					if (str == "" || str=='w' || str=='e') str = "default";
					else str += "-resize";
					el.style.cursor = str;
				}
			}catch(e){console.log('err:'+e);	}
			var stm=null;	
			if(resizeParam != null) {				
				//var m_pos=ev.pageY-schedule_ptop;      //当前指针实际位置[pageY会受滚动影响]
				if (dir.indexOf("s") != -1){						
					var newH= Math.max(yMin, resizeParam.height + objEvt.clientY - resizeParam.graby);	
					var _int=Math.floor((resizeParam.el.offsetTop+newH)/vert_scale)+1;	
					resizeParam.el.style.height = (_int*vert_scale-resizeParam.el.offsetTop-2)+ "px";	
					stm=calc_start_tm_bytop(parseInt(resizeParam.el.offsetTop),(_int*vert_scale-resizeParam.el.offsetTop)/vert_scale*ops.time_scale);
					resizeParam.duration=(_int*vert_scale-resizeParam.el.offsetTop)/vert_scale*ops.time_scale;	
					$(resizeParam.el).attr('data-durtion',resizeParam.duration);								
				}	
								
				if (dir.indexOf("n") != -1) {
					var newTop=Math.min(resizeParam.top + objEvt.clientY - resizeParam.graby, resizeParam.top + resizeParam.height - yMin);
					var _int=Math.round(newTop/vert_scale);	
					var _ntop=_int*vert_scale;
					var _trueBotom=resizeParam.bottom;
					
					if(resizeParam.bottom%vert_scale!=0){
						if(	(resizeParam.bottom+1)%vert_scale%vert_scale==0){
							_trueBotom=resizeParam.bottom+1;
						}else{
							if(	(resizeParam.bottom-1)%vert_scale%vert_scale==0){	
							_trueBotom=resizeParam.bottom-1;
							}
						}
					}					
					var _het=resizeParam.bottom-_ntop;
					if(_het<vert_scale){
					}else{
						resizeParam.el.style.top=_ntop+'px';
						resizeParam.el.style.height = (_het-2) + "px";				
					}
					var n_het=_het%vert_scale==0?_het:(Math.floor(_het/vert_scale)+1)*ops.time_scale;
					stm=calc_start_tm_bytop(_ntop,(_trueBotom-_ntop)/vert_scale*ops.time_scale);	
					resizeParam.duration=(_trueBotom-_ntop)/vert_scale*ops.time_scale;	
					$(resizeParam.el).attr('data-durtion',resizeParam.duration);				
				} 
				tmpPub=stm[1][1].substring(0,5)+'-'+stm[3][1].substring(0,5)+' ('+stm[4]+'m)';				
				updateStInfo(resizeParam.el,tmpPub);						
				objEvt.returnValue = false;
				objEvt.cancelBubble = true;
				
				if($(resizeParam.el).attr('id')!='min_aed_blk'){
					resizeParam.pdata.duration=resizeParam.duration;
				}
			} 
		}
		function doUp(evt) {
			if(resizeParam==null){ return; }
			 if (resizeParam != null) {
				resizeParam = null;
			}
			isMouseDown=false;	
		}
		//------------------------
		// hash表对照像
		//------------------------
		function HashTable() {
			var size = 0;
			var entry = new Object();
			this.add = function (key, value) {
				if (!this.containsKey(key)) {size++;}
				entry[key] = value;
			};
			this.getValue = function (key) {return this.containsKey(key) ? entry[key] : null;};
			this.edit=function(key,value){entry[key] = value;};
			this.remove = function (key) {
				if (this.containsKey(key) && (delete entry[key])) {size--;}
			};
			this.containsKey = function (key) {	return (key in entry);};
			this.containsValue = function (value) {
				for (var prop in entry) {
					if (entry[prop] == value) {	return true;}
				}
				return false;
			};
			this.getValues = function () {
				var values = new Array();
				for (var prop in entry) {	values.push(entry[prop]);}
				return values;
			};
			this.getKeys = function () {
				var keys = new Array();
				for (var prop in entry) {	keys.push(prop);}
				return keys;
			};
			this.getSize = function () {	return size;};
			this.clear = function () {
				size = 0;
				entry = new Object();
			}
		}
		//------------------------
		$(document).on("mousedown",".min_block",function(ev){				
			var _el=ev.target.parentElement;
			if($(_el).attr('id')!='min_aed_blk'){ return false;}			
			if(mvOrResize=='mv'){	 
				dgMvDown(ev||event,$(this));						
			}else{ 
				doDown($(this)[0],ev||event);	 
			}
			document.onmousemove=function(ev){		
				if(mvOrResize=='mv'){	 dgMvMove(ev||event); 	}else{ 	doMove(ev||event); 	}
		   };				
		   document.onmouseup=function(ev){			
			   var objEvt=ev||event,el=objEvt.target;		   
			   //el.style.cursor = 'url("yuyue_ico/openhand.cur"),move';	
			   dgMvUp(ev||event);
			   doUp(objEvt);	
			   document.onmousemove=null;
			   document.onmouseup=null;
		  };
		  return false;
		});	
		
		$(document).on("mousemove",".blk_text",function(ev){
			var _el=ev.target.parentElement;
			if($(_el).attr('id')!='min_aed_blk'){ return false;}
			//return false;  //禁止修改		
			if(isMouseDown){return;}
			var el=ev.target;
			var offset=5;
			var bRect=$(el)[0].getBoundingClientRect();
			var cur_top=ev.clientY;
			
			if(cur_top>bRect.top && cur_top<=bRect.top+offset){
				el.style.cursor = 'n-resize';			
				mvOrResize='rz';
			}else{				
				if(cur_top>bRect.bottom-offset &&  cur_top<=bRect.bottom){
					el.style.cursor = 's-resize';	
					mvOrResize='rz';
				}else{
					el.style.cursor = 'url("/static/netconsult/img/yuyue_ico/openhand.cur"),move';					
					mvOrResize='mv';
				}
			}
		});
		//------------------------
		//  样式初始
		//------------------------
		function css_set(){				    
			var css=function(t,s){
			  s=document.createElement('style');
			  s.innerText=t;
			  document.head.appendChild(s);
			};		
			css('.min_block{position:absolute; z-index:'+ops.block_zindex+'; height:39px; width:100%; background-color:#ffbf00;top:0px; width:175px; left:225px; overflow:hidden; border:solid 1px #f00}'+
				'.min_paiban_fot,.min_paiban_top{background-color:#999; opacity:0.2; position:absolute; z-index:'+(ops.block_zindex-1)+'; width:100%; left:0px; top:0px; height:0px;}');		
		}
		//------------------------	
		init();			
		//对外接口 
		var api={
				genDocDataList:gen_docData_list,	//使用json生成数据块集
				addDataBlk:addDataBlk,					//追加一个代表操作块
				getAEblkInfo:getAEblkInfo,				//外部获取代表操作块信息
				edtDataBlk:edtDataBlk						//
		};	
		return api;
	}	
	$.fn.yayigj_schedule_mini=function(options,callback){
		var ops=$.extend(true,{},$.fn.yayigj_schedule_mini.defaultOptions, options);
		var that=$(this),api;		
		var api=$.callFeaturesMiniApi(that,ops);
		 return this.each(function(){				
				if($.isFunction(callback)){
					callback(api);
				}
		 });
	};
	
})(jQuery);