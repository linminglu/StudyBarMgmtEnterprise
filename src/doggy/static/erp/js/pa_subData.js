$(function() {
        // $("#USSERID").on("keyup",function(e){
        //     if(e.keyCode==13){
        //             clinicListNumber();//获取诊所管家号列表
        //     }
        // })
        $("#isAgree").on("click", function() {
            if (!$(this).prop("checked")) {
                $("#subt").attr("disabled", true);
            } else {
                $("#subt").attr("disabled", false);
            }
        });
        $("input[name='10'],input[name='11'],input[name='12'],input[name='13'],input[name='14'],input[name='24'],input[name='25'],input[name='26']").on("focus", function() {
                $(this).blur();
            })
            //保存
            // $("#save").on("click",function(){
            //     saveOrsubmit(1);
            // });
            //提交审核
        $("#subt").on("click", function() {
            saveOrsubmit(2);
        });
        getDownlist(); //获取固定的下拉列表
    })
    //提交审核
function saveOrsubmit() {
    if ($("#clinicList").val() == "") {
        $("#clinicList").focus();
        return;
    };
    var parmas = {};
    // if(s==1){
    //     _url="/paweb/saveapply";
    // }else{
    _url = "/butlerp/clinicaudit/commitapply";
    // if(isfillin()==false){
    //     return;   
    // };
    // };
    parmas = {
        "usermobile": $.trim($("#USSERID").val()),
        "address": $.trim($("#address").val()), //下列参数必须全部提交
        "area": $("#area").val(),
        "dentalid": $("#clinicList").val(), //该字段不能为空,为空就不让提交
        "clinicname": $("#clinicName").val(),
        "businessmonth": $("#BusinessMonth").attr("data-val"),
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
        "scheduleprocess": $("#ScheduleProcess").attr("data-val"),
        "clinicprincipal": $("#clinicprincipal").val(),
        "principalqq": $("#principalqq").val(),
        "principalwechat": $("#principalwechat").val(),
        "principalphone": $("#principalphone").val(),
        "principalidnum": $("#principalidnum").val(),
        "principalsex": $("#principalsex").val(),
        "principalpositon": $("#principalpositon").val(),
        "cliniccontacts": $("#cliniccontacts").val(),
        "healthpermit": $("#healthpermit").val(),
        "entrancephoto": $("#entrancephoto").val(),
        "receptionphotos": $("#receptionphotos").val(),
        "clinicroomphoto": $("#clinicroomphoto").val(),
        "radiologyroomphoto": $("#radiologyroomphoto").val(),
        "concerns": $("#concerns").val(),
        "clinicurl": $("#clinicurl").val(),
        "businessprincipal": $("#businessprincipal").val(),
        "licenseexpiry": $("#licenseexpiry").val(),
        "employeenum": $("#employeenum").val(),
        "cliniccomputers": $("#cliniccomputers").val(),
        "usedsoftware": $("#usedsoftware").val(),
        "clinicnetwork": $("#clinicnetwork").val(),
        "clinicdevicebrand": $("#clinicdevicebrand").val(),
        "clinicpracticedocter": $("#clinicpracticedocter").val(),
        "clinicassistantdocter": $("#clinicassistantdocter").val(),
        "clinicnurse": $("#clinicnurse").val(),
        "clinicfront": $("#clinicfront").val(),
        "isopenmedicare": $("#isopenmedicare").val(),
        "medicareplatform": $("#medicareplatform").val(),
        "clinicismain": $("#clinicismain").val(),
        "largeprojects": $("#largeprojects").val(),
        "onlinepurchase": $("#onlinepurchase").val(),
        "denturemaker": $("#denturemaker").val(),
        "suppliespartners": $("#suppliespartners").val(),
        "clinicdecoration": $("#clinicdecoration").val()
    };
    jQuery.loading();
    $.post(_url, parmas, function(json) {
        jQuery.loading_close();
        if (json.code == 1) {
            window.location.href = "/butlerp/clinicaudit/clinics"; //提交跳转提交成功提示页面

        } else {
            jQuery.postFail("fadeInUp", json.info);
        }
    })
}
//判断条件是否为空
function isfillin() {
    var USSERID = $("#USSERID");
    var InstitutionName = $("#InstitutionName"); //医疗机构名称
    var province = $("#province"); //
    var city = $("#city"); //
    var area = $("#area"); //
    var address = $("#address"); //
    var mobile = $("#Mobile"); //
    var LicenseID = $("#LicenseID"); //营业执照号码
    var LegalPersonPic = $("#LegalPersonPic"); //企业法人营业执照
    var MedicalLicenOriginal = $("#MedicalLicenOriginal"); //医疗机构执业许可证------正本扫描件
    var MedicalLicenDuplicate = $("#MedicalLicenDuplicate"); //-副本首页
    var MedicalLicenCheck = $("#MedicalLicenCheck"); //-最新年检页
    var PhysicianPracticeCert = $("#PhysicianPracticeCert"); //医师执业证书*
    var ChairNum = $("#ChairNum"); //牙椅数量
    var LicenseProperty = $("#LicenseProperty"); //执照性质*
    var HighestTitle = $("#HighestTitle"); //医生最高职称
    var PhysicianNum = $("#PhysicianNum"); //医生数量
    var ScheduleProcess = $("#ScheduleProcess"); //预约流程*
    var MonthPatientNum = $("#MonthPatientNum"); //月初诊患者数量*
    var BusinessMonth = $("#BusinessMonth"); //诊所经营月份*
    var ClinicArea = $("#ClinicArea"); //诊所面积*
    var ChainNum = $("#ChainNum"); //  连锁店数量*  


}

function isfillinFuc(id) {
    if (id && id != undefined && id != "") {
        if ($("#" + id).val() == "" || $("#" + id).val() == undefined || $("#" + id).val() == "城市" || $("#" + id).val() == "省份" || $("#" + id).val() == "地区") {
            $("#" + id).focus();
            setTimeout(function() {
                $("#" + id).addClass("err_input")
            }, 100);
            return false;
        }
    }
}

//获取诊所管家号列表
function clinicListNumber() {
    jQuery.loading();
    $.post("/butlerp/clinicaudit/getdental", { "usermobile": $("#USSERID").val() }, function(json) {
        jQuery.loading_close();
        if (json.code == 1) {
            var option1 = [];
            var f_name = "";
            if (json.list) {
                $.each(json.list, function(k, v) {
                    option1.push({ key: v.dentalid, val: v.clinicname });
                    if (k == 0) {
                        f_name = v.clinicname;
                    }
                });
            };
            $("#clinicList").yayigj_downlist({
                _callBack: getclinicname,
                _valtype: "val",
                _data: option1
            });
            $("#clinicName").val(f_name);
            //重新获取保存的资料
            // var data=json.list.info[0];

            //     var clinicid=data.dentalid;
            //     var clinicname=data.clinicname;
            //     var institutionname=data.institutionname;//医疗机构名称
            //     var province=data.province;
            //     var city=data.city;
            //     var area=data.area;
            //     var address=data.address;
            //     var mobile=data.mobile;
            //     var licenseid=data.licenseid;
            //     var legalpersonpic=data.legalpersonpic;
            //     var medicallicenoriginal=data.medicallicenoriginal;//医疗机构执业许可证*
            //     var medicallicenduplicate=data.medicallicenduplicate;// 副本首页
            //     var medicallicencheck=data.medicallicencheck;  //年检页
            //     var physicianpracticecert=data.physicianpracticecert; //医师执业证书
            //     var chairnum=data.chairnum;
            //     var licenseproperty=data.licenseproperty; //执照性质*
            //     var highesttitle=data.highesttitle;//医生最高职称
            //     var physiciannum=data.physiciannum;//医生数量
            //     var scheduleprocess=data.scheduleprocess;//预约流程
            //     var monthpatientnum=data.monthpatientnum;  //月初诊患者数量
            //     var businessmonth=data.businessmonth; //诊所经营月份
            //     var clinicarea=data.clinicarea;//诊所面积
            //     var chainnum=data.chainnum;//连锁店数量
            //     var physicianhonorcert=data.physicianhonorcert;//医生荣誉证书
            //     var clinichonorcert=data.clinichonorcert; //诊所荣誉证书
            //     var physicianduty=data.physicianduty; //医生行业任职
            //    // var remark=data.remark;  //错误原因
            //    // var username=data.username;

            //     $("#clinicList").val(clinicid);
            //     $("#clinicName").val(clinicname);
            //     $("#InstitutionName").val(institutionname);
            //     $("#province").val(province);
            //     $("#city").val(city);
            //     $("#area").val(area);
            //     $("#address").val(address);
            //     $("#Mobile").val(mobile);
            //     $("#LicenseID").val(licenseid);
            //     $("#LegalPersonPic").val(legalpersonpic);
            //     $("#MedicalLicenOriginal").val(medicallicenoriginal);
            //     $("#MedicalLicenDuplicate").val(medicallicenduplicate);
            //     $("#MedicalLicenCheck").val(medicallicencheck);
            //     $("#PhysicianPracticeCert").val(physicianpracticecert);
            //     listApi1.gotoval(chairnum);
            //     listApi2.gotoval(licenseproperty);
            //     listApi3.gotoval(highesttitle);
            //     listApi4.gotoval(physiciannum);
            //     listApi5.gotoval(scheduleprocess);
            //     listApi6.gotoval(monthpatientnum);
            //     listApi7.gotoval(businessmonth);
            //     listApi8.gotoval(clinicarea);
            //     listApi9.gotoval(chainnum);
            //      $("#PhysicianHonorCert").val(physicianhonorcert);
            //      $("#ClinicHonorCert").val(clinichonorcert);
            //      $("#PhysicianDuty").val(physicianduty);
            //  $("#username").text(username);
        } else {
            jQuery.postFail("fadeInUp", json.info);
        }
    })
}
//获取诊所名称
function getclinicname(e) {
    $("#clinicName").val("");
    setTimeout(function() {
        $("#clinicName").val(e);
    }, 200)
}