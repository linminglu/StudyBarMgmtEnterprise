
$(function(){
    clinicListNumber();//获取诊所管家号列表
    $("#isAgree").on("click",function(){
        if(!$(this).prop("checked")){
            $("#subt").attr("disabled",true);
        }else{
            $("#subt").attr("disabled",false);
        }
    });
    $("input[name='10'],input[name='11'],input[name='12'],input[name='13'],input[name='14'],input[name='24'],input[name='25'],input[name='26']").on("focus",function(){
        $(this).blur();
    })
    //保存
    $("#save").on("click",function(){
        saveOrsubmit(1);
    });
    //提交审核
    $("#subt").on("click",function(){
        saveOrsubmit(2);
    });
    getDownlist();//获取固定的下拉列表
})
//保存和提交审核
function saveOrsubmit(s){
    if($("#clinicList").val()==""){
        $("#clinicList").focus();
         return;
    }
    var parmas={};
    if(s==1){
        _url="/paweb/saveapply";
    }else{
        _url="/paweb/commitapply";
        if(isfillin()==false){
            return;   
        };
    };
    parmas={
        "address": $.trim($("#address").val()),  //下列参数必须全部提交
        "area": $("#area").val(),
        "dentalid":$("#clinicList").val(),  //该字段不能为空,为空就不让提交
        "clinicname":$("#clinicName").val(),
        "businessmonth":$("#BusinessMonth").attr("data-val"),
        "chainnum": $("#ChainNum").attr("data-val"),
        "chairnum": $("#ChairNum").attr("data-val"),
        "city": $("#city").val(),
        "clinicarea": $("#ClinicArea").attr("data-val"),
        "clinichonorcert": $("#ClinicHonorCert").val(),
        "highesttitle": $("#HighestTitle").attr("data-val"),
        "institutionname": $.trim($("#InstitutionName").val()),
        "legalpersonpic": $("#LegalPersonPic").val(),
        "licenseid": $.trim($("#LicenseID").val()),
        "licenseproperty": $("#LicenseProperty").attr("data-val"),
        "medicallicencheck": $("#MedicalLicenCheck").val(),
        "medicallicenduplicate": $("#MedicalLicenDuplicate").val(),
        "medicallicenoriginal": $("#MedicalLicenOriginal").val(),
        "mobile": $.trim($("#Mobile").val()),
        "monthpatientnum": $("#MonthPatientNum").attr("data-val"),
        "physicianduty": $("#PhysicianDuty").val(),
        "physicianhonorcert": $("#PhysicianHonorCert").val(),
        "physiciannum": $("#PhysicianNum").attr("data-val"),
        "physicianpracticecert": $("#PhysicianPracticeCert").val(),
        "province": $("#province").val(),
        "scheduleprocess": $("#ScheduleProcess").attr("data-val")           
    };
    jQuery.loading();
    $.post(_url,parmas,function(json){
        jQuery.loading_close();
        if(json.code==1){
            if(s==1){
               jQuery.postOk("fadeInUp","保存成功！");
            }else{
                window.location.href="/member/applytips";//提交跳转提交成功提示页面
            };
           
        }else{
            jQuery.postFail("fadeInUp",json.info);
        }
    })
}
//判断条件是否为空
function isfillin(){
    var InstitutionName=$("#InstitutionName");//医疗机构名称
    var province=$("#province");              //
    var city=$("#city");                      //
    var area=$("#area");                       //
    var address=$("#address");                //
    var mobile=$("#Mobile");                    //
    var LicenseID=$("#LicenseID");              //营业执照号码
    var LegalPersonPic=$("#LegalPersonPic");     //企业法人营业执照
    var MedicalLicenOriginal=$("#MedicalLicenOriginal");  //医疗机构执业许可证------正本扫描件
    var MedicalLicenDuplicate=$("#MedicalLicenDuplicate");      //-副本首页
    var MedicalLicenCheck=$("#MedicalLicenCheck");   //-最新年检页
    var PhysicianPracticeCert=$("#PhysicianPracticeCert"); //医师执业证书*
    var ChairNum=$("#ChairNum");                    //牙椅数量
    var LicenseProperty=$("#LicenseProperty");     //执照性质*
    var HighestTitle=$("#HighestTitle");             //医生最高职称
    var PhysicianNum=$("#PhysicianNum");            //医生数量
    var ScheduleProcess=$("#ScheduleProcess");        //预约流程*
    var MonthPatientNum=$("#MonthPatientNum");        //月初诊患者数量*
    var BusinessMonth=$("#BusinessMonth");            //诊所经营月份*
    var ClinicArea=$("#ClinicArea");                    //诊所面积*
    var ChainNum=$("#ChainNum");                        //  连锁店数量*  
    if(!InstitutionName.val()){
        InstitutionName.focus().addClass("err_input");
        if(InstitutionName.siblings(".err_tips").length==0){
            InstitutionName.after("<span class='err_tips'>请填写医疗机构名称</span>");
        }
        return false;
    }
    else if(province.val()=="省份"){
        province.focus().addClass("err_input");
        if(province.siblings(".err_tips").length==0){
            area.after("<span class='err_tips'>请填写医疗机构地址</span>");
        }
        return false;
    }
    else if(city.val()=="城市"){
        city.focus().addClass("err_input");
        if(province.siblings(".err_tips").length==0){
            area.after("<span class='err_tips'>请填写医疗机构地址</span>");
        }
        return false;
    }
    else if(area.val()=="地区"){
        area.focus().addClass("err_input");
        if(province.siblings(".err_tips").length==0){
            area.after("<span class='err_tips'>请填写医疗机构地址</span>");
        }
        return false;
    }
    else if(!address.val()){
        address.focus().addClass("err_input");
        if(address.siblings(".err_tips").length==0){
            address.after("<span class='err_tips'>请填写医疗机构地址</span>");
        }
        return false;
    }
    else if(!mobile.val()||$.trim(mobile.val()).length<7){
        mobile.focus().addClass("err_input");
        if(mobile.siblings(".err_tips").length==0){
            mobile.after("<span class='err_tips'>请填写正确的电话号码</span>");
        }
        return false;
    }
    else if(!LicenseID.val()){
        LicenseID.focus().addClass("err_input");
        if(LicenseID.siblings(".err_tips").length==0){
            LicenseID.after("<span class='err_tips'>请填写营业执照号码</span>");
        }
        return false;
    }
    else if(!LegalPersonPic.val()){
        LegalPersonPic.focus().addClass("err_input");
        if(LegalPersonPic.siblings(".err_tips").length==0){
            LegalPersonPic.siblings(".v_img").after("<span class='err_tips'>请上传企业法人营业执照</span>");
        }
        return false;
    }
    else if(!MedicalLicenOriginal.val()){
        MedicalLicenOriginal.focus().addClass("err_input");
        if(MedicalLicenOriginal.siblings(".err_tips").length==0){
            MedicalLicenOriginal.siblings(".v_img").after("<span class='err_tips'>请上传医疗机构执业许可证正本扫描件</span>");
        }
        return false;
    }
    else if(!MedicalLicenDuplicate.val()){
        MedicalLicenDuplicate.focus().addClass("err_input");
        if(MedicalLicenDuplicate.siblings(".err_tips").length==0){
            MedicalLicenDuplicate.siblings(".v_img").after("<span class='err_tips'>请上传医疗机构执业许可证副本首页</span>");
        }
        return false;
    }
    else if(!MedicalLicenCheck.val()){
        MedicalLicenCheck.focus().addClass("err_input");
        if(MedicalLicenCheck.siblings(".err_tips").length==0){
            MedicalLicenCheck.siblings(".v_img").after("<span class='err_tips'>请上传医疗机构执业许可证最新年检页</span>");
        }
        return false;
    }
    else if(!PhysicianPracticeCert.val()){
        PhysicianPracticeCert.focus().addClass("err_input");
        if(PhysicianPracticeCert.siblings(".err_tips").length==0){
            PhysicianPracticeCert.siblings(".v_img").after("<span class='err_tips'>请上传医师执业证书</span>");
        }
        return false;
    }
    
    else if(ChairNum.val()=="请选择牙椅数量"||ChairNum.val()==0){
        ChairNum.focus().addClass("err_input");
        if(ChairNum.siblings(".err_tips").length==0){
            ChairNum.after("<span class='err_tips'>请选择牙椅数量</span>");
        }
        return false;
    }
    else if(LicenseProperty.val()=="请选择执照性质"){
        LicenseProperty.focus().addClass("err_input");
        if(LicenseProperty.siblings(".err_tips").length==0){
            LicenseProperty.after("<span class='err_tips'>请选择执照性质</span>");
        }
        return false;
    }
    else if(HighestTitle.val()=="请选择职称"){
        HighestTitle.focus().addClass("err_input");
        if(HighestTitle.siblings(".err_tips").length==0){
            HighestTitle.after("<span class='err_tips'>请选择职称</span>");
        }
        return false;
    }
    else if(PhysicianNum.val()=="请选择医生数量"){
        PhysicianNum.focus().addClass("err_input");
        if(PhysicianNum.siblings(".err_tips").length==0){
            PhysicianNum.after("<span class='err_tips'>请选择医生数量</span>");
        }
        return false;
    }
    else if(ScheduleProcess.val()=="请选择预约流程"){
        ScheduleProcess.focus().addClass("err_input");
        if(ScheduleProcess.siblings(".err_tips").length==0){
            ScheduleProcess.after("<span class='err_tips'>请选择预约流程</span>");
        }
        return false;
    }
    else if(MonthPatientNum.val()=="请选择月初诊患者数量"){
        MonthPatientNum.focus().addClass("err_input");
        if(MonthPatientNum.siblings(".err_tips").length==0){
            MonthPatientNum.after("<span class='err_tips'>请选择月初诊患者数量</span>");
        }
        return false;
    }
    else if(BusinessMonth.val()=="请选择诊所经营月份"){
        BusinessMonth.focus().addClass("err_input");
        if(BusinessMonth.siblings(".err_tips").length==0){
            BusinessMonth.after("<span class='err_tips'>请选择诊所经营月份</span>");
        }
        return false;
    }
    else if(ClinicArea.val()=="请选择诊所面积"){
        ClinicArea.focus().addClass("err_input");
        if(ClinicArea.siblings(".err_tips").length==0){
           ClinicArea.after("<span class='err_tips'>请选择诊所面积</span>");
        }
        return false;
    }
    else if(ChainNum.val()=="请选择连锁店数量"){
        ChainNum.focus().addClass("err_input");
        if(ChainNum.siblings(".err_tips").length==0){
           ChainNum.after("<span class='err_tips'>请选择连锁店数量</span>");
        }
        return false;
    }


}   
function isfillinFuc(id){
    if(id&&id!=undefined&&id!=""){
        if($("#"+id).val()==""||$("#"+id).val()==undefined||$("#"+id).val()=="城市"||$("#"+id).val()=="省份"||$("#"+id).val()=="地区"){
            $("#"+id).focus();
            setTimeout(function(){
                $("#"+id).addClass("err_input")
            },100);
            return false;
      } 
    }
}

//获取诊所管家号列表
function clinicListNumber(){
    jQuery.loading();
    $.post("/paweb/applypagedata",{},function(json){
        jQuery.loading_close();
        if(json.code==1){
            var option1=[];
            var f_name="";
            if(json.list.dentals){
                $.each(json.list.dentals,function(k,v){
                    option1.push({key:v.dentalid,val:v.clinicname});
                    if(k==0){
                        f_name=v.clinicname;
                    }
                });
            };
            $("#clinicList").yayigj_downlist({
                _callBack:getclinicname,
                _valtype:"val",
                _data:option1
            });
            $("#clinicName").val(f_name);
            //重新获取保存的资料
            var data=json.list.info[0];

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
               // var remark=data.remark;  //错误原因
               // var username=data.username;
                   
                $("#clinicList").val(clinicid);
                $("#clinicName").val(clinicname);
                $("#InstitutionName").val(institutionname);
                $("#province").val(province);
                $("#city").val(city);
                $("#area").val(area);
                $("#address").val(address);
                $("#Mobile").val(mobile);
                $("#LicenseID").val(licenseid);
                $("#LegalPersonPic").val(legalpersonpic);
                $("#MedicalLicenOriginal").val(medicallicenoriginal);
                $("#MedicalLicenDuplicate").val(medicallicenduplicate);
                $("#MedicalLicenCheck").val(medicallicencheck);
                $("#PhysicianPracticeCert").val(physicianpracticecert);
                listApi1.gotoval(chairnum);
                listApi2.gotoval(licenseproperty);
                listApi3.gotoval(highesttitle);
                listApi4.gotoval(physiciannum);
                listApi5.gotoval(scheduleprocess);
                listApi6.gotoval(monthpatientnum);
                listApi7.gotoval(businessmonth);
                listApi8.gotoval(clinicarea);
                listApi9.gotoval(chainnum);
                 $("#PhysicianHonorCert").val(physicianhonorcert);
                 $("#ClinicHonorCert").val(clinichonorcert);
                 $("#PhysicianDuty").val(physicianduty);
              //  $("#username").text(username);
        }else{
            jQuery.postFail("fadeInUp",json.info);
        }
    })
}
//获取诊所名称
function getclinicname(e){
    $("#clinicName").val("");
    setTimeout(function(){
            $("#clinicName").val(e);
    },200)
}