var infoid = getUrlParam("infoid"),
    s = getUrlParam("s"),
    _url = "";

$(function() {
        viewdata(); //获取数据填充页面
        $("#subt").on("click", function() {
            resubdata();
        })
    })
    //获取数据
function viewdata() {
    jQuery.loading();
    $.post("/butlerp/clinicaudit/finishpagedata", { infoid: infoid }, function(json) {
        if (s == 1) {
            document.title = "完善资料";
        } else {
            document.title = "修改资料";
        }
        jQuery.loading_close();
        if (json.code == 1) {
            if (!json.list.info) {
                jQuery.postFail("fadeInUp", "暂无数据");
                return;
            };
            var data = json.list.info[0];
            var clinicid = data.dentalid;
            var clinicname = data.clinicname;
            var institutionname = data.institutionname; //医疗机构名称
            var province = data.province;
            var city = data.city;
            var area = data.area;
            var address = data.address;
            var mobile = data.mobile;
            var licenseid = data.licenseid;
            var legalpersonpic = data.legalpersonpic;
            var medicallicenoriginal = data.medicallicenoriginal; //医疗机构执业许可证*
            var medicallicenduplicate = data.medicallicenduplicate; // 副本首页
            var medicallicencheck = data.medicallicencheck; //年检页
            var physicianpracticecert = data.physicianpracticecert; //医师执业证书
            var chairnum = data.chairnum;
            var licenseproperty = data.licenseproperty; //执照性质*
            var highesttitle = data.highesttitle; //医生最高职称
            var physiciannum = data.physiciannum; //医生数量
            var scheduleprocess = data.scheduleprocess; //预约流程
            var monthpatientnum = data.monthpatientnum; //月初诊患者数量
            var businessmonth = data.businessmonth; //诊所经营月份
            var clinicarea = data.clinicarea; //诊所面积
            var chainnum = data.chainnum; //连锁店数量
            var physicianhonorcert = data.physicianhonorcert; //医生荣誉证书
            var clinichonorcert = data.clinichonorcert; //诊所荣誉证书
            var physicianduty = data.physicianduty; //医生行业任职
            var remark = data.remark; //错误原因
            var err_p = "";
            var username = data.username;
            var usermobile = data.usermobile;

            var clinicprincipal = data.clinicprincipal;
            var principalqq = data.principalqq;
            var principalwechat = data.principalwechat;
            var principalphone = data.principalphone;
            var principalidnum = data.principalidnum;
            var principalsex = data.principalsex;
            var principalpositon = data.principalpositon;
            var cliniccontacts = data.cliniccontacts;
            var healthpermit = data.healthpermit;
            var entrancephoto = data.entrancephoto;
            var receptionphotos = data.receptionphotos;
            var clinicroomphoto = data.clinicroomphoto;
            var radiologyroomphoto = data.radiologyroomphoto;
            var concerns = data.concerns;
            var clinicurl = data.clinicurl;
            var businessprincipal = data.businessprincipal;
            var licenseexpiry = data.licenseexpiry;
            var employeenum = data.employeenum;
            var cliniccomputers = data.cliniccomputers;
            var usedsoftware = data.usedsoftware;
            var clinicnetwork = data.clinicnetwork;
            var clinicdevicebrand = data.clinicdevicebrand;
            var clinicpracticedocter = data.clinicpracticedocter;
            var clinicassistantdocter = data.clinicassistantdocter;
            var clinicnurse = data.clinicnurse;
            var clinicfront = data.clinicfront;
            var isopenmedicare = data.isopenmedicare;
            var medicareplatform = data.medicareplatform;
            var clinicismain = data.clinicismain;
            var largeprojects = data.largeprojects;
            var onlinepurchase = data.onlinepurchase;
            var denturemaker = data.denturemaker;
            var suppliespartners = data.suppliespartners;
            var clinicdecoration = data.clinicdecoration;

            $("#USSERID").val(usermobile);
            $("#clinicList").val(clinicid);
            $("#clinicName").val(clinicname);
            $("#InstitutionName").val(institutionname);
            //定位到省份并且触发点击事件产生城市的下拉列表
            for (i = 0; i < $("#province_down_list p").length; i++) {
                if ($("#province_down_list p").eq(i).text() == province) {
                    var province_code = $("#province_down_list p").eq(i).attr("value");
                    province_listApi.gotoval(province_code);
                    $("#province_down_list p").eq(i).click();
                }
            }
            for (i = 0; i < $("#city_down_list p").length; i++) {
                if ($("#city_down_list p").eq(i).text() == city) {
                    var city_code = $("#city_down_list p").eq(i).attr("value");
                    city_listApi.gotoval(city_code);
                    $("#city_down_list p").eq(i).click();
                }
            }
            for (i = 0; i < $("#area_down_list p").length; i++) {
                if ($("#area_down_list p").eq(i).text() == area) {
                    var area_code = $("#area_down_list p").eq(i).attr("value");
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

            $("#clinicprincipal").val(clinicprincipal);
            $("#principalqq").val(principalqq);
            $("#principalwechat").val(principalwechat);
            $("#principalphone").val(principalphone);
            $("#principalidnum").val(principalidnum);
            $("#principalsex").val(principalsex);
            $("#principalpositon").val(principalpositon);
            $("#cliniccontacts").val(cliniccontacts);
            $("#healthpermit").val(healthpermit);
            $("#entrancephoto").val(entrancephoto);
            $("#receptionphotos").val(receptionphotos);
            $("#clinicroomphoto").val(clinicroomphoto);
            $("#radiologyroomphoto").val(radiologyroomphoto);
            $("#concerns").val(concerns);
            $("#clinicurl").val(clinicurl);
            $("#businessprincipal").val(businessprincipal);
            $("#licenseexpiry").val(licenseexpiry);
            $("#employeenum").val(employeenum);
            $("#cliniccomputers").val(cliniccomputers);
            $("#usedsoftware").val(usedsoftware);
            $("#clinicnetwork").val(clinicnetwork);
            $("#clinicdevicebrand").val(clinicdevicebrand);
            $("#clinicpracticedocter").val(clinicpracticedocter);
            $("#clinicassistantdocter").val(clinicassistantdocter);
            $("#clinicnurse").val(clinicnurse);
            $("#clinicfront").val(clinicfront);
            $("#isopenmedicare").val(isopenmedicare);
            $("#medicareplatform").val(medicareplatform);
            $("#clinicismain").val(clinicismain);
            $("#largeprojects").val(largeprojects);
            $("#onlinepurchase").val(onlinepurchase);
            $("#denturemaker").val(denturemaker);
            $("#suppliespartners").val(suppliespartners);
            $("#clinicdecoration").val(clinicdecoration);

            listApi1.gotoval(chairnum);
            listApi2.gotoval(licenseproperty);
            listApi3.gotoval(highesttitle);
            listApi4.gotoval(physiciannum);
            listApi5.gotoval(scheduleprocess);
            listApi6.gotoval(monthpatientnum);
            listApi7.gotoval(businessmonth);
            listApi8.gotoval(clinicarea);
            listApi9.gotoval(chainnum);

            $(".modify_cont input[type='text']").attr("disabled", true);
            $(".modify_cont input[type='file']").attr("disabled", true);
            if (remark) {
                var arr = [];
                remark = JSON.parse(remark);
                err_p += '<span class="l">失败原因：</span><div class="err_list">';
                for (var i in remark) {
                    arr.push(i);
                    $(".modify_cont input[name='" + i + "']").attr("disabled", false);
                    $("input[name='" + i + "']").addClass("err_input");
                    if ((i > 9 && i < 15) || (i > 23)) {
                        $("input[name='" + i + "']").next("a").css("display", "inline-block").children("input").attr("disabled", false);
                        $("input[name='" + i + "']").next("a").next(".v_img").css("display", "inline-block").after("<span class='err_tips' title='" + remark[i] + "'>" + remark[i] + "</span>");
                    } else if (i == 4 || i == 5 || i == 6) {
                        $("input[name='4'],input[name='5'],input[name='6']").attr("disabled", false).addClass("err_input");

                        $("input[name='6']").after("<span class='err_tips' title='" + remark[i] + "'>" + remark[i] + "</span>");
                    } else {
                        $("input[name='" + i + "']").after("<span class='err_tips err_tips_l' title='" + remark[i] + "'>" + remark[i] + "</span>");
                    }
                }
                for (var i = 0; i < arr.length; i++) {
                    err_p += '<p>' + (i + 1) + '.' + remark[arr[i]] + '</p>';
                }
                err_p += "</div>";
            }
            $("#errDiv").html(err_p); //失败原因
        } else {
            jQuery.postFail("fadeInUp", json.info);
        }
    })
}

function resubdata() {
    if ($("#clinicList").val() == "") {
        $("#clinicList").focus();
    }
    var parmas = {
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
    if (s == 1) {
        _url = "/butlerp/clinicaudit/commitapply"; //完善提交资料
    } else {
        _url = "/butlerp/clinicaudit/modifyapply"; //修改资料
        parmas.infoid = infoid;
    }
    jQuery.loading();
    $("#subt").val("提交中").attr("disabled", true);

    $.post(_url, parmas, function(json) {
        jQuery.loading_close();
        $("#subt").val("提交审核").attr("disabled", false);
        if (json.code == 1) {
            window.location.href = "/butlerp/clinicaudit/clinics";
        } else {
            jQuery.postFail("fadeInUp", json.info);
        }
    })
}
//获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
}