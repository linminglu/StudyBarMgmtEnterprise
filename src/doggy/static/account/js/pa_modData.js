$(function(){
    viewdata();//获取数据填充页面
    $("#saveAsubt").on("click",function(){
        resubdata();
    })
})
//获取数据
function viewdata(){
    jQuery.loading();
    $.post("/member/getapplyinfodata",{},function(json){
        jQuery.loading_close();
            if(json.code==1){
                var data=json.list[0];

                var clinicid=data.dentalid;
                var clinicname=data.clinicname;
                var institutionname=data.institutionname;//医疗机构名称
                var province=data.province;
                var city=data.city;
                var area=data.area;
                var address=data.address;
                var mobile=data.mobile;
                var licenseid=data.licenseid;
                var legalpersonpic=data.legalpersonpic;
                var medicallicenoriginal=data.medicallicenoriginal;//医疗机构执业许可证*
                var medicallicenduplicate=data.medicallicenduplicate;// 副本首页
                var medicallicencheck=data.medicallicencheck;  //年检页
                var physicianpracticecert=data.physicianpracticecert; //医师执业证书
                var chairnum=data.chairnum;
                var licenseproperty=data.licenseproperty; //执照性质*
                var highesttitle=data.highesttitle;//医生最高职称
                var physiciannum=data.physiciannum;//医生数量
                var scheduleprocess=data.scheduleprocess;//预约流程
                var monthpatientnum=data.monthpatientnum;  //月初诊患者数量
                var businessmonth=data.businessmonth; //诊所经营月份
                var clinicarea=data.clinicarea;//诊所面积
                var chainnum=data.chainnum;//连锁店数量
                var physicianhonorcert=data.physicianhonorcert;//医生荣誉证书
                var clinichonorcert=data.clinichonorcert; //诊所荣誉证书
                var physicianduty=data.physicianduty; //医生行业任职
                var remark=data.remark;  //错误原因
                var err_p="";
                var username=data.username;
                   
                $("#clinicList").val(clinicid);
                $("#clinicName").val(clinicname);
                $("#InstitutionName").val(institutionname);
                //定位到省份并且触发点击事件产生城市的下拉列表
                for(i=0;i<$("#province_down_list p").length;i++){
                    if($("#province_down_list p").eq(i).text()==province){
                        var province_code=$("#province_down_list p").eq(i).attr("value");
                        province_listApi.gotoval(province_code);
                        $("#province_down_list p").eq(i).click();
                    }
                }
                for(i=0;i<$("#city_down_list p").length;i++){
                    if($("#city_down_list p").eq(i).text()==city){
                        var city_code=$("#city_down_list p").eq(i).attr("value");
                        city_listApi.gotoval(city_code);
                        $("#city_down_list p").eq(i).click();
                    }
                }
                for(i=0;i<$("#area_down_list p").length;i++){
                    if($("#area_down_list p").eq(i).text()==area){
                        var area_code=$("#area_down_list p").eq(i).attr("value");
                        area_listApi.gotoval(area_code);
                    }
                }
                $("#address").val(address);
                $("#Mobile").val(mobile);
                $("#LicenseID").val(licenseid);
                $("#LegalPersonPic").val(legalpersonpic);
                $("#MedicalLicenOriginal").val(medicallicenoriginal);
                $("#MedicalLicenDuplicate").val(medicallicenduplicate);
                $("#MedicalLicenCheck").val(medicallicencheck);
                $("#PhysicianPracticeCert").val(physicianpracticecert);
                // $("#ChairNum").val(chairnum);
                // $("#LicenseProperty").val(licenseproperty);
                // $("#HighestTitle").val(highesttitle);
                // $("#PhysicianNum").val(physiciannum);
                // $("#MonthPatientNum").val(monthpatientnum);
                // $("#ScheduleProcess").val(scheduleprocess);
                // $("#BusinessMonth").val(businessmonth);
                // $("#ClinicArea").val(clinicarea);
                // $("#ChainNum").val(chainnum);
                $("#PhysicianHonorCert").val(physicianhonorcert);
                $("#ClinicHonorCert").val(clinichonorcert);
                $("#PhysicianDuty").val(physicianduty);
                $("#username").text(username);

                listApi1.gotoval(chairnum);
                listApi2.gotoval(licenseproperty);
                listApi3.gotoval(highesttitle);
                listApi4.gotoval(physiciannum);
                listApi5.gotoval(scheduleprocess);
                listApi6.gotoval(monthpatientnum);
                listApi7.gotoval(businessmonth);
                listApi8.gotoval(clinicarea);
                listApi9.gotoval(chainnum);

                $(".modify_cont input[type='text']").attr("disabled",true);
                $(".modify_cont input[type='file']").attr("disabled",true);
                if(remark){
                    var arr=[];
                    remark=JSON.parse(remark);
                    err_p+='<span class="l">失败原因：</span><div class="err_list">';
                    for(var i in remark){
                        arr.push(i);
                        $(".modify_cont input[name='"+i+"']").attr("disabled",false);
                        $("input[name='"+i+"']").addClass("err_input");
                        if((i>9&&i<15)||(i>23)){
                            $("input[name='"+i+"']").next("a").css("display","inline-block").children("input").attr("disabled",false);
                            $("input[name='"+i+"']").next("a").next(".v_img").css("display","inline-block").after("<span class='err_tips' title='"+remark[i]+"'>"+remark[i]+"</span>");
                        }
                        else if(i==4||i==5||i==6){
                            $("input[name='4'],input[name='5'],input[name='6']").attr("disabled",false).addClass("err_input");

                            $("input[name='6']").after("<span class='err_tips' title='"+remark[i]+"'>"+remark[i]+"</span>");
                        }
                        else{
                            $("input[name='"+i+"']").after("<span class='err_tips err_tips_l' title='"+remark[i]+"'>"+remark[i]+"</span>");
                        }
                    }
                    for(var i=0;i<arr.length;i++){
                        err_p+='<p>'+(i+1)+'.'+remark[arr[i]]+'</p>';
                    }
                    err_p+="</div>";
                }
                $("#errDiv").html(err_p);//失败原因
            }else{
                jQuery.postFail("fadeInUp",json.info);
            }
        })
}
function resubdata(){
    if($("#clinicList").val()==""){
        $("#clinicList").focus();
    }
    if($(".err_tips").length>0){
        jQuery.postFail("fadeInUp","请继续修改错误信息！");
        return;
    }
    var parmas={};
    $("input[type='text']").each(function(){
       // console.log($(this).attr("disabled"))
        if($(this).attr("disabled")==undefined){
            var id=$(this).attr("id");
            var val=$(this).val();
            id=id.toLowerCase();
            if($(this).attr("name")>14&&$(this).attr("name")<24){
                val=$(this).attr("data-val");
            }
            parmas[id]=val;
        }
    })
    
    jQuery.loading();
    $.post("/member/modifyapplyinfo",parmas,function(json){
        jQuery.loading_close();
        if(json.code==1){
                // window.location.href="/member/applytips_per";//提交跳转提交成功提示页面
           window.location.href="/member/applyprogress";
        }else{
            jQuery.postFail("fadeInUp",json.info);
        }
    })
}


