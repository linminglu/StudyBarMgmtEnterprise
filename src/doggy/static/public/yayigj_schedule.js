(function() {
    $.callFeaturesApi = function(obj, ops) {
        var Ownerid = obj.attr("id");
        var public_cnf = ops.public_cnf;
        var bus_startTime = null;
        var bus_endTime = null;
        var vert_scale = ops.time_scale == 30 ? 40 : 21;
        var ico_colors = ops.sch_ico_color();
        var sch_today = new Date();
        var sch_todays = sch_today.getFullYear() + "/" + (sch_today.getMonth() + 1) + "/" + sch_today.getDate();
        var bus_st_ed_tm = getStartEndTm();
        var isMouseDown = false;
        var mvOrResize = "mv";
        var drgMv = false;
        var doc_pages = [];
        var doc_pIndex = 0;
        var timeline_tm = null;
        var schedule_htop = 0;
        var schedule_ptop = 0;
        var cur_view_to = 'd';
        var drgPos = {
            "left": 0,
            "top": 0,
            "newDirect": "d",
            "old_doc": "",
            "new_doc": ""
        };
        var col_over_id = "";
        var wcol_over_id = "";
        var w_col_width = 0;
        var wcol_week_obj = new HashTable();
        var col_doctor_obj = new HashTable();
        var col_data_arr = new HashTable();
        var wcol_data_arr = new HashTable();
        var mcol_data_arr = new HashTable();
        var outsideDay = sch_today;
        var outsideWeek = null;
        var resizeParam = null;
        var by = function(name) {
            return function(o, p) {
                var a, b;
                if (typeof o === "object" && typeof p === "object" && o && p) {
                    a = o[name];
                    b = p[name];
                    if (a === b) {
                        return 0
                    }
                    if (typeof a === typeof b) {
                        return a < b ? -1 : 1
                    }
                    return typeof a < typeof b ? -1 : 1
                } else {
                    throw ("error")
                }
            }
        };

        function date_format(dt) {
            var date = dt;
            var seperator1 = "/";
            var seperator2 = ":";
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate
            }
            var _h = date.getHours();
            _h = _h < 10 ? "0" + _h : _h;
            var _m = date.getMinutes();
            _m = _m < 10 ? "0" + _m : _m;
            var _s = date.getSeconds();
            _s = _s < 10 ? "0" + _s : _s;
            var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate + " " + _h + seperator2 + _m + seperator2 + _s;
            return currentdate
        }

        function getStartEndTm(st_et) {
            if (typeof(st_et) != "undefined" && st_et != "") {
                var _st = new Date(sch_todays + " " + parseInt(st_et.split("-")[0]) + ":00");
                var _et = new Date(sch_todays + " " + parseInt(st_et.split("-")[1]) + ":00")
            } else {
                var _st = new Date(sch_todays + " " + parseInt(ops.public_cnf.schule_hours.split("-")[0]) + ":00");
                var _et = new Date(sch_todays + " " + parseInt(ops.public_cnf.schule_hours.split("-")[1]) + ":00")
            }
            var _ca = (_et - _st) / 60000;
            return [_st, _et, _ca]
        }

        function setBussinesstime(st_et, cnfval) {
            var st = st_et.split("-")[0];
            var et = st_et.split("-")[1];
            bus_startTime = parseInt(st);
            bus_endTime = parseInt(et);
            if (typeof(cnfval) == "undefined") {} else {
                ops.time_scale = cnfval == 4 ? 15 : 30
            }
            vert_scale = ops.time_scale == 30 ? 40 : 21;
            $("#focus_add_day,#focus_add_wek").outerHeight(vert_scale - 1);
            bus_st_ed_tm = getStartEndTm(st_et);
            css_set();
            //setPanelSize();
            clearInterval(timeline_tm);
            timeline_tm = window.setInterval(function() {
                    //$("#wtime_line").hide();
                    var endTm = date_format(new Date()).split(" ")[0] + " " + bus_endTime + ":59:59";
                    endTm = new Date(endTm);
                    var curDt = new Date();
                    if (curDt > endTm) {
                        clearInterval(timeline_tm);
                        $("#wtime_line").hide()
                    }
                    setTimeLine()
                },
                30000)
        }

        function set_drag_size_gq(p, cur_obj, dw) {
            var divid = $(cur_obj).attr("id");
            var cur_time = new Date();
            var sch_time = new Date(p.scheduledate.replace(/-/g, "/") + "  " + p.sshortTime + ":00");
            if (sch_time < cur_time) {
                p.status = 2
            } else {
                if (p.status == 2) {
                    p.status = 0
                }
            }
            var _colr_ico = ico_colors[p.status];
            var p_id = dw == "wcol" ? "week_conc" : "schedule_panel";
            $("#" + p_id + " #" + divid).css({
                "background-color": _colr_ico.bcolr,
                "border-color": _colr_ico.bcolr
            });
            $("#" + p_id + " #" + divid + " .drag_status img").attr("src", _colr_ico.ico);
            $("#" + p_id + " #" + divid + " .block_text").css("background-color", _colr_ico.colr)
        }

        function dragMobj() {
            this.el = null;
            this.oParent = null;
            this.disX = 0;
            this.disY = 0;
            this.scale = ops.time_scale;
            this.vkd = vert_scale;
            this.hkd = 175;
            this.isDown = false;
            this.isMv = false;
            this.tm = null;
            this.directionV = "d";
            this.directionH = "r";
            this.downclkY = 0;
            this.downclkX = 0;
            this.rowIndex = 0;
            this.colIndex = 0
        }

        function dgMvDown(oEvent, jqObj) {
            if (oEvent.buttons != 1) {
                return
            }
            var _elBgc = jqObj.css("background-color").replace(/rgb\(/, "").replace(/\)/, "").split(",");
            var _elHsl = rgbToHsl(parseInt(_elBgc[0]), parseInt(_elBgc[1]), parseInt(_elBgc[2]));
            var _elDcolr = hslToRgb(_elHsl[0], _elHsl[1], 0.38);
            var elParent = jqObj.parent().attr("id").split("_")[0];
            var _pData = null;
            switch (elParent) {
                case "col":
                    _pData = col_data_arr.getValue(jqObj.attr("data-id"));
                    col_over_id = jqObj.parent().attr("id");
                    break;
                case "wcol":
                    _pData = wcol_data_arr.getValue(jqObj.attr("data-id"));
                    wcol_over_id = jqObj.parent().attr("id");
                    break
            }
            isMouseDown = true;
            drgMv = new dragMobj();
            drgMv.isDown = true;
            drgMv.elParent = elParent;
            drgMv.el = jqObj[0];
            drgMv.bgcolr = hslToRgb(_elHsl[0], _elHsl[1], _elHsl[2]);
            drgMv.dbgcolr = hslToRgb(_elHsl[0], _elHsl[1], 0.48);
            drgMv.downCol = jqObj.parent().attr("id");
            drgMv.downCtmp = "";
            drgMv.id = jqObj.attr("id");
            drgMv.dataid = jqObj.attr("id").split("_")[1];
            drgMv.doctorid = jqObj.parent().attr("id").split("_")[1];
            drgMv.hkd = public_cnf.fit_col_w;
            drgMv.oParent = $(this).parent()[0];
            drgMv.disX = oEvent.clientX - drgMv.el.offsetLeft;
            drgMv.disY = oEvent.clientY - drgMv.el.offsetTop;
            drgMv.downclkY = oEvent.clientY;
            drgMv.downclkX = oEvent.clientX;
            drgMv.isMv = false;
            drgMv.dataObj = _pData;
            drgMv.dwidth = jqObj.width();
            drgMv.tmInfo = jqObj.find(".stinfo").text();
            _pData.left = drgMv.el.offsetLeft;
            $(drgMv.el).css({
                "background-color": "rgb(" + drgMv.dbgcolr + ")",
                "z-index": (ops.public_cnf.block_zindex + 1),
                "border-color": "rgb(" + drgMv.dbgcolr + ")"
            });
            //console.log("drgMv.duration=", drgMv.dataObj.duration)
        }

        function dgMvMove(oEvent) {
            var _status = parseInt(drgMv.dataObj.status);
            if (_status == 3 || _status == 8) {
                switch (_status) {
                    case 3:
                        jQuery.postFail("fadeInUp", "已经安排检查,不能修改!");
                        break;
                    case 8:
                        jQuery.postFail("fadeInUp", "预约已经流失,不能修改!");
                        break
                }
                return
            }
            if (oEvent.buttons != 1) {
                return
            }
            drgMv.isMv = true;
            $("#block_hint").hide();
            if (drgMv.elParent == "col") {
                $(drgMv.el).width(public_cnf.fit_col_w - 2).css("left", "0px")
            }
            if (drgMv.elParent == "wcol") {
                $(drgMv.el).width(w_col_width).css("left", "0px")
            }
            if (drgMv.isDown == false) {
                return
            }
            var cur_obj_id = drgMv.id;
            var l = oEvent.clientX - drgMv.disX;
            var t = oEvent.clientY - drgMv.disY;
            var col = parseInt((l - public_cnf.leftPanelW) / drgMv.hkd);
            var row = parseInt(t / drgMv.vkd);
            var txt_sc = drgMv.tmInfo.split("(")[1].replace(/m/g, "").replace(/\(/g, "");
            var h_drag = function() {
                if (drgMv.elParent == "col") {
                    if ($("#" + col_over_id).attr("class").indexOf("col_lst") > -1 || col_over_id == "col_0") {
                        return
                    }
                    $(drgMv.el).appendTo($("#" + col_over_id));
                    drgMv.downCtmp = col_over_id
                }
                if (drgMv.elParent == "wcol") {
                    if ($("#" + wcol_over_id).attr("class").indexOf("col_lst wu1") > -1 || wcol_over_id == "wcol_1") {
                        return
                    }
                    $(drgMv.el).appendTo($("#" + wcol_over_id));
                    drgMv.downCtmp = wcol_over_id
                }
                l = 0;
                drgMv.el.style.left = l + "px";
                drgPos.left = l;
                t = Math.round(t / vert_scale) * vert_scale;
                drgMv.el.style.top = t + "px";
                drgPos.top = t;
                var stm = calc_start_tm_bytop(t, txt_sc);
                tmpPub = stm[1][1].substring(0, 5) + "-" + stm[3][1].substring(0, 5) + " (" + drgMv.dataObj.duration + "m)";
                updateStInfo(drgMv.el, tmpPub);
                drgMv.dataObj.eshortTime = stm[3][1].substring(0, 5);
                drgMv.dataObj.sshortTime = stm[1][1].substring(0, 5)
            };
            var v_drag = function() {
                t = Math.round(t / vert_scale) * vert_scale;
                var stm = calc_start_tm_bytop(t, txt_sc);
                tmpPub = stm[1][1].substring(0, 5) + "-" + stm[3][1].substring(0, 5) + " (" + drgMv.dataObj.duration + "m)";
                updateStInfo(drgMv.el, tmpPub);
                drgMv.dataObj.eshortTime = stm[3][1].substring(0, 5);
                drgMv.dataObj.sshortTime = stm[1][1].substring(0, 5);
                drgMv.el.style.top = t + "px";
                drgPos.left = l;
                drgPos.top = t;
                drgPos.new_doc = drgMv.doctorid;
                drgPos.old_doc = drgMv.doctorid
            };
            ++row;
            ++col;
            drgMv.rowIndex = row;
            drgMv.colIndex = col;
            var direct_y = Math.abs(oEvent.clientY - drgMv.downclkY);
            var direct_x = Math.abs(oEvent.clientX - drgMv.downclkX);
            var newDirect = "d";
            oEvent.clientY < drgMv.downclkY ? drgMv.directionV = "u" : drgMv.directionV = "d";
            oEvent.clientX < drgMv.downclkX ? drgMv.directionH = "l" : drgMv.directionH = "r";
            newDirect = direct_y > direct_x ? drgMv.directionV : drgMv.directionH;
            drgPos.newDirect = newDirect;
            switch (newDirect) {
                case "d":
                    var minLeft = parseInt(drgMv.el.style.left);
                    l = 0;
                    v_drag();
                    break;
                case "u":
                    var minLeft = parseInt(drgMv.el.style.left);
                    l = 0;
                    if (t <= 0) {
                        drgMv.el.style.top = "0px";
                        return
                    }
                    v_drag();
                    break;
                case "l":
                case "r":
                    if (oEvent.target.className != "block_text" && col_over_id != "col_0") {
                        h_drag()
                    }
                    break
            }
        }

        function dgMvUp(oEvent) {
            var true_fx = "";
            try {
                if (drgMv.downCol == col_over_id && drgPos.top == drgMv.dataObj.top) {
                    true_fx = "s"
                }
                if (drgMv.downCol == col_over_id && drgPos.top != drgMv.dataObj.top) {
                    true_fx = "v"
                }
                if (drgMv.downCol != col_over_id && drgPos.top == drgMv.dataObj.top) {
                    true_fx = "h"
                }
                if (drgMv.downCol != col_over_id && drgPos.top != drgMv.dataObj.top) {
                    true_fx = "x"
                }
            } catch (e) {
                //console.log("e=", e);
                return
            }
            var Vchange = function() {
                drgMv.dataObj.top = drgPos.top;
                drgMv.dataObj.left = drgMv.el.offsetLeft;
                if (drgMv.elParent == "col") {
                    var _pt = col_doctor_obj.getValue(drgMv.downCol.split("_")[1]);
                    update_doc_dlist_row(_pt.sh_data_ids, $(drgMv.el).attr("data-id"), drgPos.top);
                    gen_dblock_by_doc(_pt)
                }
                if (drgMv.elParent == "wcol") {
                    var _pt = wcol_week_obj.getValue($("#h" + drgMv.downCol).attr("data-val").replace(/\//g, "-"));
                    update_doc_dlist_row(_pt.sh_data_ids, $(drgMv.el).attr("data-id"), drgPos.top);
                    gen_dblock_by_week(_pt, drgMv.downCol.split("_")[1])
                }
                drgMv.dataObj.endTime = drgMv.dataObj.endTime.split(" ")[0] + " " + drgMv.dataObj.eshortTime;
                drgMv.dataObj.startTime = drgMv.dataObj.startTime.split(" ")[0] + " " + drgMv.dataObj.sshortTime
            };
            var callBack = function() {
                if (ops.callbackSingleEdt != null) {
                    ops.callbackSingleEdt({
                        "startTime": drgMv.dataObj.sshortTime,
                        "endTime": drgMv.dataObj.eshortTime,
                        "scheduledate": drgMv.dataObj.scheduledate,
                        "duration": drgMv.dataObj.duration,
                        "scheduleidentity": drgMv.dataObj.dataid,
                        "doctorid": drgMv.dataObj.doctorid,
                        "doctorName": drgMv.dataObj.doctorName,
                        "customerid": drgMv.dataObj.customerid
                    }, drgMv.dataObj)
                }
            };
            isMouseDown = false;
            if (drgMv.isMv == true) {
                var title = "确定要移动当前预约?";
                if (drgMv.dataObj.importance) {
                    title = "确定要移动当前事项?";
                }
                jQuery.showAsk(title, "确认",
                    function() {
                        if (true_fx == "s") {
                            $(drgMv.el).css({
                                "left": drgMv.dataObj.left,
                                "width": drgMv.dataObj.width
                            })
                        } else {
                            if (drgMv.elParent == "col") {
                                if (col_over_id == "col_0") {
                                    var nextDomID = $("#" + col_over_id).next("div").attr("id");
                                    col_over_id = nextDomID
                                }
                                if ($("#" + col_over_id).attr("class").indexOf("col_lst") > -1) {
                                    var preDomID = $("#" + col_over_id).prev("div").attr("id");
                                    col_over_id = preDomID
                                }
                                var old_doctorid = drgMv.downCol.split("_")[1];
                                var _pt = col_doctor_obj.getValue(old_doctorid);
                                sh_data_ids_del(_pt.sh_data_ids, $(drgMv.el).attr("data-id"));
                                gen_dblock_by_doc(_pt);
                                update_dayblk_cnt([old_doctorid]);
                                drgMv.dataObj.top = drgPos.top;
                                drgMv.dataObj.left = 0;
                                drgMv.dataObj.endTime = drgMv.dataObj.endTime.split(" ")[0] + " " + drgMv.dataObj.eshortTime;
                                drgMv.dataObj.startTime = drgMv.dataObj.startTime.split(" ")[0] + " " + drgMv.dataObj.sshortTime;
                                drgMv.dataObj.nextdom = [];
                                drgMv.dataObj.predom = null;
                                drgMv.downCol = col_over_id;
                                var doctorid = col_over_id.split("_")[1];

                                var _pnt = col_doctor_obj.getValue(doctorid);
                                drgMv.dataObj.doctorName = $("#hcol_" + doctorid + " span:eq(0)").text();
                                _pnt.sh_data_ids.push({
                                    "row": drgPos.top,
                                    "id": $(drgMv.el).attr("data-id")
                                });
                                drgMv.dataObj.doctorid = doctorid;
                                gen_dblock_by_doc(_pnt);
                                update_dayblk_cnt([doctorid]);
                                callBack()
                            }
                            if (drgMv.elParent == "wcol") {
                                var week_en = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
                                var old_date = drgMv.dataObj.scheduledate;
                                var weekNm = (new Date(old_date).getDay()) - 1;
                                weekNm == -1 ? weekNm = 6 : "";
                                var d_parent = week_en[weekNm];
                                update_wekblk_cnt(["wcol_" + d_parent]);
                                var _pt = wcol_week_obj.getValue(old_date.replace(/\//g, "-"));
                                if (wcol_over_id == "wcol_1") {
                                    var nextDomID = $("#" + wcol_over_id).next("div").attr("id");
                                    wcol_over_id = nextDomID
                                }
                                if ($("#" + wcol_over_id).attr("class").indexOf("col_lst wu1") > -1) {
                                    var preDomID = $("#" + wcol_over_id).prev("div").attr("id");
                                    wcol_over_id = preDomID
                                }
                                sh_data_ids_del(_pt.sh_data_ids, $(drgMv.el).attr("data-id"));
                                gen_dblock_by_week(_pt, d_parent);
                                drgMv.dataObj.startTime = $("#h" + wcol_over_id).attr("data-val") + " " + drgMv.dataObj.sshortTime.trim();
                                drgMv.dataObj.scheduledate = $("#h" + wcol_over_id).attr("data-val");
                                drgMv.downCol = wcol_over_id;
                                drgMv.dataObj.top = drgPos.top;
                                drgMv.dataObj.left = 0;
                                drgMv.dataObj.endTime = drgMv.dataObj.endTime.split(" ")[0] + " " + drgMv.dataObj.eshortTime;
                                drgMv.dataObj.startTime = drgMv.dataObj.startTime.split(" ")[0] + " " + drgMv.dataObj.sshortTime;
                                drgMv.dataObj.nextdom = [];
                                drgMv.dataObj.predom = null;

                                var fatherid = $("#h" + wcol_over_id).attr("data-val").replace(/\//g, "-");
                                var _pnt = wcol_week_obj.getValue(fatherid);
                                _pnt.sh_data_ids.push({
                                    "row": drgPos.top,
                                    "id": $(drgMv.el).attr("data-id")
                                });
                                gen_dblock_by_week(_pnt, wcol_over_id.split("_")[1]);
                                update_wekblk_cnt([wcol_over_id]);
                                callBack()
                            }
                        }
                        if (drgMv.dataObj.importance == null) {
                            set_drag_size_gq(drgMv.dataObj, drgMv.el, drgMv.elParent);
                        }

                        jQuery.pop_window_modal_dialog_close({
                            _closemothod: "fadeOutUp"
                        })
                    },
                    function() {
                        $(drgMv.el).find(".stinfo").text(drgMv.tmInfo);
                        var _tmpinfo = drgMv.tmInfo.split('-');
                        drgMv.dataObj.sshortTime = $.trim(_tmpinfo[0]);
                        drgMv.dataObj.eshortTime = $.trim(_tmpinfo[1]).split(' ')[0]; //2017/8/28 [zlb]
                        switch (drgPos.newDirect) {
                            case "d":
                            case "u":
                                $(drgMv.el).css({
                                    "top": drgMv.dataObj.top,
                                    "left": drgMv.dataObj.left
                                }).width(drgMv.dwidth);
                                $(drgMv.el).appendTo($("#" + drgMv.downCol));
                                break;
                            case "l":
                            case "r":
                                $(drgMv.el).appendTo($("#" + drgMv.downCol));
                                $(drgMv.el).css({
                                    "top": drgMv.dataObj.top,
                                    "left": drgMv.dataObj.left
                                }).width(drgMv.dwidth);
                                break
                        }
                        jQuery.pop_window_modal_dialog_close({
                            _closemothod: "fadeOutUp"
                        })
                    })
            }
            $(drgMv.el).css({
                "background-color": "rgb(" + drgMv.bgcolr + ")",
                "z-index": ops.public_cnf.block_zindex,
                "border-color": "rgb(" + drgMv.bgcolr + ")"
            });
            drgMv.isMv = false
        }

        function calc_start_tm_bytop(top, duration) {
            var nDate = date_format(bus_st_ed_tm[0]);
            var cur_tm = new Date(nDate);
            cur_tm.setMinutes(cur_tm.getMinutes() + top / vert_scale * ops.time_scale, cur_tm.getSeconds(), 0);
            if (typeof(duration) != "undefined") {
                var cur_etm = new Date(date_format(cur_tm));
                cur_etm.setMinutes(cur_etm.getMinutes() + parseInt(duration), cur_etm.getSeconds(), 0);
                return [cur_tm, date_format(cur_tm).split(" "), cur_etm, date_format(cur_etm).split(" "), duration]
            } else {
                return [cur_tm, date_format(cur_tm).split(" ")]
            }
        }

        function GenBlockOverColr(el) {
            var _elBgc = $(el).css("background-color").replace(/rgb\(/, "").replace(/\)/, "").split(",");
            var _elHsl = rgbToHsl(parseInt(_elBgc[0]), parseInt(_elBgc[1]), parseInt(_elBgc[2]));
            var _elDcolr = hslToRgb(_elHsl[0], _elHsl[1], 0.38);
            var bgcolr = hslToRgb(_elHsl[0], _elHsl[1], _elHsl[2]);
            var dbgcolr = hslToRgb(_elHsl[0], _elHsl[1], 0.48);
            return [dbgcolr.join(","), bgcolr.join(",")]
        }

        function removeByValue(arr, val) {
            arr.splice(i, $.inArray(val, arr))
        }

        function sh_data_ids_del(p, id) {
            for (var i = 0,
                    _len = p.length; i < _len; i++) {
                if (p[i].id == id) {
                    p.splice(i, 1);
                    break
                }
            }
        }

        function update_doc_dlist_row(p, id, top) {
            for (var i = 0,
                    _len = p.length; i < _len; i++) {
                if (p[i].id == id) {
                    p[i].row = top;
                    break
                }
            }
        }

        function getBlock_id_xy(doctorid, idName, dwType) {
            var result = [];
            var calc_pub = function(element) {
                var _top = $(element)[0].offsetTop + 1,
                    _fot = _top + $(element).height() - 1;
                if ((_top >= _ctop && _top <= _cfot) || (_fot >= _ctop && _fot <= _cfot)) {
                    result.push($(element).attr("id"))
                } else {
                    if ((_ctop >= _top && _ctop <= _fot) && (_cfot >= _top && _cfot <= _fot)) {
                        result.push($(element).attr("id"))
                    }
                }
            };
            try {
                switch (dwType) {
                    case "day":
                        var cur_obj = $("#col_" + doctorid + " #" + idName),
                            _ctop = cur_obj[0].offsetTop,
                            _cfot = _ctop + cur_obj.outerHeight();
                        $("#col_" + doctorid + " .block").each(function(index, element) {
                            calc_pub(element)
                        });
                        break;
                    case "week":
                        var cur_obj = $("#" + doctorid + " #" + idName),
                            _ctop = cur_obj[0].offsetTop,
                            _cfot = _ctop + cur_obj.outerHeight();
                        $("#" + doctorid + " .block").each(function(index, element) {
                            calc_pub(element)
                        });
                        break
                }
            } catch (e) {
                console.log(e)
            }
            return result
        }

        function rgbToHsl(r, g, b) {
            r /= 255,
                g /= 255,
                b /= 255;
            var max = Math.max(r, g, b),
                min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;
            if (max == min) {
                h = s = 0
            } else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break
                }
                h /= 6
            }
            return [h, s, l]
        }

        function hslToRgb(h, s, l) {
            var r, g, b;
            if (s == 0) {
                r = g = b = l
            } else {
                var hue2rgb = function hue2rgb(p, q, t) {
                    if (t < 0) {
                        t += 1
                    }
                    if (t > 1) {
                        t -= 1
                    }
                    if (t < 1 / 6) {
                        return p + (q - p) * 6 * t
                    }
                    if (t < 1 / 2) {
                        return q
                    }
                    if (t < 2 / 3) {
                        return p + (q - p) * (2 / 3 - t) * 6
                    }
                    return p
                };
                var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                var p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3)
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
        }

        function updPersonsByDoc(did) {
            var _pt = col_doctor_obj.getValue(did);
            var ps = _pt.sh_data_ids.length;
            if (ps > 0) {
                return ps
            }
        }

        function calc_fit_colw(param) {
            var _rghtW = 0;
            if (typeof(param) != 'undefined') {
                _rghtW = param - public_cnf.schule_scale_w * 2;
            } else {
                _rghtW = $("#" + Ownerid).width() - public_cnf.schule_scale_w * 2;
            }
            //var _rghtW = $("#" + Ownerid).width() - public_cnf.schule_scale_w * 2;
            //console.log('_rghtW=',_rghtW);
            var tmp = [],
                minv = 0,
                minColW = ops.public_cnf.minColW,
                maxColW = ops.public_cnf.maxColW;
            for (var i = minColW; i < maxColW; i++) {
                var parect = _rghtW / i;
                if (_rghtW % i == 0) {
                    tmp.push(0)
                } else {
                    tmp.push(parect.toString().split(".")[1].substring(0, 2) * 10)
                }
            }
            minv = Math.min.apply(null, tmp);
            var temp = [];
            for (var j = 0; j < tmp.length; j++) {
                if (minv == tmp[j]) {
                    temp.push(j)
                }
            }
            var index = temp.pop();
            public_cnf.fit_col_w = minColW + index;
            public_cnf.fit_col_count = parseInt(_rghtW / (minColW + index));
            public_cnf.fit_col_w = _rghtW / public_cnf.fit_col_count;
            public_cnf.fit_col_diff = _rghtW - public_cnf.fit_col_count * public_cnf.fit_col_w
        }

        function genTimeVline(cur_scale) {
            var tmp = [];
            for (var i = bus_startTime; i <= bus_endTime; i++) {
                var numStr = i < 10 ? "0" + i : i;
                tmp.push('<li class="vTime">' + numStr + "</li>")
            }
            $(".inner_v").empty().append(tmp.join(""));
            var scaleToH = cur_scale == 15 ? vert_scale * 4 : vert_scale * 2;
            $(".inner_v li").height(scaleToH);
            var end_height = (bus_endTime + 1 - bus_startTime) * scaleToH;
            $("#" + ops.sch_panel_id).height(end_height);
            $("#week_conc").height(end_height);
        }

        function gen_hint_div() {
            var hint_obj = $("<div id='block_hint'>" + "<div class='triangle'><img src='" + ops.sch_ico_path + "/tr_lf.png'/></div>" + "<div class='title' id='head_cz'>" + "<span class='ico edt' 		title='编辑'></span>" + "<span class='ico del' 		title='取消'></span>" + "<span class='ico sms' 		title='短信'></span>" + "<span class='ico view' 	title='详情'></span><span class='ico status' 	title='状态'></span>" + "</div>" + "<div class='cont'>" + "<div id='sch_panel'>" + "<div id='hz_name' class='row'>		<i class='h_t'>姓名：</i><i class='name h_c'></i></div>" + "<div id='hz_sex' class='row'>			<i class='h_t'>性别：</i><i class='sex h_c'></i></div>" + "<div id='hz_items' class='row'>		<i class='h_t'>项目：</i><i class='items h_c'></i></div>" + "<div id='hz_duration' class='row'>	<i class='h_t'>时长：</i><i class='duration h_c'></i></div>" + "<div id='hz_phone' class='row'>		<i class='h_t'>电话：</i><i class='phone h_c'></i></div>" + "<div id='hz_debts' class='row'>		<i class='h_t' style='color:#F00'>欠费：</i><i class='debts h_c' style='color:#F00'></i></div>" + "<div id='hz_payment' class='row'>	<i class='h_t'>已收：</i><i class='payment h_c'></i></div>" + "<div id='hz_remark' class='row'>		<i class='h_t'>备注：</i><i class='remark h_c'></i></div>" + "</div>" + "<div id='agenda_panel'>" + "<div id='hz_name' class='row' style='color:'></div>" + "<div id='hz_sex' class='row'>			<i class='h_t'>时间：</i><i class='dtime h_c'></i></div>" + "<div id='hz_remark' class='row'>		<i class='h_t'>备注：</i><i class='remark h_c'></i></div>" + "</div>" + "</div>" + "</div>");
            $("#block_hint").remove();
            $("#" + Ownerid).append(hint_obj)
        }

        function data_hint_view(p) {
            if (p.importance == null || typeof(p.importance) == 'undefined') {
                // $("#block_hint").attr("type", "data");
                $("#block_hint").height(260);
                $("#block_hint .cont").outerHeight(222);
                $("#agenda_panel").hide();
                $("#sch_panel").show();
                $("#block_hint #head_cz").show();
                $("#block_hint #head_cz .edt").attr("data-flag", "sch");
                $("#block_hint #head_cz .del").attr("data-flag", "sch");
                $("#block_hint .row .name").text(p.custName);
                $("#block_hint .row .sex").text(p.sex);
                $("#block_hint .row .items").text(p.items).attr("title", p.items);
                $("#block_hint .row .duration").text(p.duration + "分钟");
                $("#block_hint .row .phone").text(p.phone);
                $("#block_hint .row .debts").text(p.debts);
                $("#block_hint .row .payment").text(p.payment);
                $("#block_hint .row .vipnumber").text(p.vipnumber);
                $("#block_hint .row .remark").text(p.remark).attr("title", p.remark)
            } else {
                // $("#block_hint").attr("type", "log");
                $("#block_hint #head_cz").hide();
                $("#block_hint #head_cz .edt").attr("data-flag", "agenda");
                $("#block_hint #head_cz .del").attr("data-flag", "agenda");
                $("#block_hint").height(120);
                $("#block_hint .cont").outerHeight(119);
                $("#agenda_panel").show();
                $("#sch_panel").hide();
                $("#agenda_panel #hz_name").text(p.custName.split(":")[1].trim());
                $("#agenda_panel .row .dtime").text(p.sshortTime.trim() + "-" + p.eshortTime.trim());
                $("#agenda_panel .row .remark").text(p.remark).attr("title", p.remark).show()
            }
        }

        function gen_datalist_blocks(page) {
            var doc_len = col_doctor_obj.getSize();
            var cur_cols = public_cnf.fit_col_count;
            var tmpDoctHed = [],
                tmpDoctCol = [];
            var doctorids = doc_pages[page];
            var outer_factor = doc_len < cur_cols ? doc_len : cur_cols;
            if (doc_len < cur_cols) {
                //var _rghtW = $("#" + Ownerid).width() - public_cnf.schule_scale_w * 2;
                var _rghtW = $(window).width() - $("#" + Ownerid).offset().left - public_cnf.schule_scale_w * 2;
                public_cnf.fit_col_w = _rghtW / (doc_len)
            }
            for (var i = 0,
                    len = doc_len < cur_cols ? doctorids.length : doctorids.length; i < len; i++) {
                var pobj = col_doctor_obj.getValue(doctorids[i]);
                if (pobj != null) {
                    var Exclusion = "";
                    var _custs = updPersonsByDoc(pobj.doctorid);
                    if (_custs > 0) {
                        _custs = '<span class="sup">[' + _custs + "]</span>"
                    } else {
                        _custs = '<span class="sup" style="display:none"></span>'
                    }
                    var _s_pb_to = "",
                        _e_pb_fm = "";
                    if (pobj.workshift != null && pobj.workshift.length > 0) {
                        var _kdtoH = ops.time_scale == 15 ? vert_scale * 4 : vert_scale * 2;
                        var _allh = $("#schedule_panel .col_frt").innerHeight() - _kdtoH;
                        var _workStm = new Date(sch_todays + " " + pobj.workshift[0].workstarttime.replace(/-/g, ":")),
                            _workEtm = new Date(sch_todays + " " + pobj.workshift[0].workendtime.replace(/-/g, ":"));
                        var _sca = (_workStm - bus_st_ed_tm[0]) / 60000,
                            _eca = (bus_st_ed_tm[1] - _workEtm) / 60000;
                        _s_pb_to = _sca / ops.time_scale * vert_scale;
                        _e_pb_fm = _allh - _eca / ops.time_scale * vert_scale;
                        Exclusion = "<span> (" + pobj.workshift[0].workshiftname + ")</span>"
                    }
                    tmpDoctHed.push('<div class="col_h" id="hcol_' + pobj.doctorid + '"><span>' + pobj.name + "</span>" + Exclusion + "" + _custs + "</div>");
                    tmpDoctCol.push('<div class="col  zcol" data-inx="' + (i + 1) + '" id="col_' + pobj.doctorid + '" data-pbtop="' + _s_pb_to + '" data-pbfot="' + _e_pb_fm + '"></div>')
                }
            }
            if (doc_len == 0) {
                tmpDoctHed.push('<div class="col_h" id="hcol_0"  style="width:' + _rghtW + 'px"><span>暂无数据</span></div>');
                tmpDoctCol.push('<div class="col  zcol" data-inx="0" id="col_0" data-pbtop="0" data-pbfot="0" style="width:' + _rghtW + 'px"></div>');
                $("#" + ops.sch_head_id).css("width", "100%");
                $("#" + ops.sch_panel_id).css("background-color", "#F2FFFE")
            }
            $("#" + ops.sch_panel_id).css("width", outer_factor * public_cnf.fit_col_w + 100);
            $("#" + ops.sch_head_id).css("width", outer_factor * public_cnf.fit_col_w + 100);
            $("#" + ops.sch_head_id).empty().append('<div class="col_h frt" id="col_0_h"><img class="sch_plus_set" id="sch_plus_set" src="' + ops.sch_ico_path + '/set.png"/></div>').append(tmpDoctHed.join("")).append('<div class="col_h lst" id="col_' + cur_cols + '_h"><span class="l_pg lrp" id="sch_head_Lpg"></span><span class="r_pg lrp"  id="sch_head_Rpg"></span></div>');
            $("#" + ops.sch_panel_id).empty().append('<div class="col col_frt" id="col_0"><div class="inner_v"></div></div>').append(tmpDoctCol.join("")).append('<div class="col col_lst" id="col_' + cur_cols + '"><div class="inner_v inner_v_r"></div></div>').append("<div id='time_line' class='time_line'></div>");
            $("#" + ops.sch_head_id + " .col_h").width(public_cnf.fit_col_w - 1);
            $("#" + ops.sch_panel_id + " .col").width(public_cnf.fit_col_w - 1);
            genTimeVline(ops.time_scale);
            setTimeLine();
            if (doc_len == 0) {
                return
            }
            for (var i = 0,
                    len = doctorids.length; i < len; i++) {
                var p = col_doctor_obj.getValue(doctorids[i]);
                gen_dblock_by_doc(p)
            }
            $(".zcol").each(function(index, element) {
                var _top_to = parseInt($(this).attr("data-pbtop"));
                var _fot_fm = parseInt($(this).attr("data-pbfot"));
                if ($(this).attr("data-pbtop") != "") {
                    $(this).find(".pb_top").height(_top_to);
                    $(this).find(".pb_fot").css("top", _fot_fm).height($("#schedule_panel .col_frt").innerHeight() - _fot_fm)
                }
            });
            $("#schedule_head").show();
            $("#schedule_panel").show();
            if (doc_pIndex >= doc_pages.length - 1) {
                $("#sch_head_Rpg").addClass("lrpdp_right")
            }
            if (doc_pIndex <= 0) {
                $("#sch_head_Lpg").addClass("lrpdp_left")
            }
            if (doc_pages == 1) {
                $("#sch_head_Lpg").addClass("lrpdp_left");
                $("#sch_head_Rpg").addClass("lrpdp_right")
            }
        }

        function genInsetBlk(p_obj, dwType) {
            var cur_time = new Date();
            var sch_time = new Date(p_obj.scheduledate.replace(/-/g, "/") + "  " + p_obj.sshortTime + ":00");
            var _colr_ico = ico_colors[p_obj.status];
            p_obj.nextdom = [];
            p_obj.predom = null;
            p_obj.width = dwType == "day" ? public_cnf.fit_col_w : w_col_width;
            var icos = [],
                _dataType = "";
            if (p_obj.importance == null) {
                _dataType = "data-type='data'";
                if (parseInt(p_obj.visitstatus) == 0) {
                    icos.push('<img class="t_ico" src="' + ops.sch_ico_path + '/cu.png" />')
                }
                if (p_obj.vipcardidentity != "") {
                    if (p_obj.vipicon != "") {
                        icos.push('<img class="t_ico" src="/static/market/img/vip' + (parseInt(p_obj.vipicon) + 1) + '.png" />')
                    }
                }
                if (p_obj.treatment.indexOf("种植") > -1) {
                    icos.push('<img class="t_ico" src="' + ops.sch_ico_path + '/zhi.png" />')
                }
                if (p_obj.treatment.indexOf("修复") > -1) {
                    icos.push('<img class="t_ico" src="' + ops.sch_ico_path + '/xiu.png" />')
                }
                if (p_obj.treatment.indexOf("正畸") > -1) {
                    icos.push('<img class="t_ico" src="' + ops.sch_ico_path + '/ji.png" />')
                }
                if (p_obj.diseasehistory != "" || p_obj.allergichistory != '') {
                    icos.push('<img class="t_ico" src="' + ops.sch_ico_path + '/icon_history.png" />')
                }
                var net_wico = parseInt(p_obj.datasource) != 1 ? "" : '<img class="t_ico" src="' + ops.sch_ico_path + '/netw.png" />'
            } else {
                _dataType = "data-type='log'";
                var net_wico = ''
            }
            var blkHeight = p_obj.duration / ops.time_scale * vert_scale;
            var startTms = new Date(p_obj.scheduledate + " " + p_obj.startTime.split(" ")[1] + ":00"),
                busStime = new Date(p_obj.scheduledate + " " + bus_startTime + ":00"),
                scaleToH = ops.time_scale == 15 ? vert_scale : vert_scale;
            var blkTop = (startTms - busStime) / 60000 / parseInt(ops.time_scale) * scaleToH;
            var strDataBlock = $('<div class="block" ' + _dataType + '  data-id="' + p_obj.dataid + '" data-docid="' + p_obj.doctorid + '"  id="' + p_obj.id + '" style="background-color:' +
                _colr_ico.bcolr + ";border-color:" + _colr_ico.bcolr + ";left:1px;top:" + blkTop + "px;width:" + (p_obj.width) + "px;height:" +
                (blkHeight - 3) + 'px">' + '<span class="drag_status"><img src="' + _colr_ico.ico + '"/></span>' + '<span class="block_text"   style="background-color:' +
                _colr_ico.colr + '">' + '<i class="nm"><span>' + p_obj.custName + "</span>" + net_wico + icos.join("") + "</i>" + '<i class="er">' +
                p_obj.items + "</i>" + '<i class="js"><b class="stinfo">' + p_obj.sshortTime + "-" + p_obj.eshortTime + " (" + p_obj.duration + "m)</b></i>" + "</span>" + "</div>");
            return strDataBlock
        }

        function gen_dblock_by_doc(p) {
            if (p == null) {
                return
            }
            $("#col_" + p.doctorid + " .block").remove();
            for (var i = 0,
                    len = p.sh_data_ids.sort(by("row")).length; i < len; i++) {
                var p_obj = col_data_arr.getValue(p.sh_data_ids[i].id);
                $("#col_" + p_obj.doctorid).append(genInsetBlk(p_obj, "day"));
                $("#" + p_obj.id).outerWidth(public_cnf.fit_col_w - 4);
                genDataBlockPos(p_obj.doctorid, p_obj.id, "day")
            }
            var col_tmp_obj = $("#col_" + p.doctorid);
            if (col_tmp_obj.find(".pb_top").height() > 0 || col_tmp_obj.find(".pb_fot").height() > 0) {} else {
                $("#col_" + p.doctorid + "  .col_paiban").remove();
                $("#col_" + p.doctorid).append("<div class='pb_top col_paiban'></div><div class='pb_fot col_paiban'></div>")
            }
        }

        function gen_doctor_list(json_obj) {
            if (typeof(json_obj) != "undefined" || json_obj != null) {
                ops.sch_data_json = json_obj
            }
            if (ops.sch_data_json == null) {
                return
            }
            col_doctor_obj.clear();
            col_data_arr.clear();
            var getRow = function(v_duration, v_starttime, v_scheduledate) {
                var _mute = v_duration;
                var blockH = _mute / ops.time_scale * vert_scale;
                var scaleToH = ops.time_scale == 15 ? vert_scale : vert_scale;
                var pub_dt = v_scheduledate.replace(/-/g, "/");
                var startTms = new Date(pub_dt + " " + v_starttime),
                    busStime = new Date(pub_dt + " " + bus_startTime + ":00");
                var startRow = (startTms - busStime) / 60000 / parseInt(ops.time_scale) * scaleToH;
                return startRow
            };
            $.each(ops.sch_data_json.list,
                function(k, v) {
                    var _uuid = uuid(8, 16);
                    var schedules_ids = [],
                        doctoragendas_ids = [],
                        workshift = [];
                    if (v.schedule != null && v.schedule.length > 0) {
                        $.each(v.schedule,
                            function(kk, vv) {
                                schedules_ids.push({
                                    "row": getRow(vv.duration, vv.starttime, vv.scheduledate),
                                    "id": vv.scheduleidentity,
                                    "duration": parseInt(vv.duration)
                                });
                                addToDBlockTable(vv, "day")
                            })
                    }
                    if (v.doctoragenda != null && v.doctoragenda.length > 0) {
                        $.each(v.doctoragenda,
                            function(_k, _v) {
                                doctoragendas_ids.push({
                                    "row": getRow(_v.duration, _v.starttime, _v.agendadate),
                                    "id": _v.agendaidentity == "" ? _uuid : _v.agendaidentity,
                                    "duration": parseInt(_v.duration)
                                });
                                addToArgbkTable(_v, _uuid, "day")
                            })
                    }
                    var doctObj = {};
                    doctObj.dataCount = 0;
                    doctObj.id = "hcol_" + v.doctorid;
                    doctObj.name = v.name;
                    doctObj.doctorid = v.doctorid;
                    doctObj.sh_data_ids = schedules_ids.concat(doctoragendas_ids);
                    doctObj.ag_data_ids = doctoragendas_ids;
                    doctObj.workshift = v.workshift;
                    col_doctor_obj.add(v.doctorid, doctObj)
                })
        }

        function addToArgbkTable(v, uuid, dtype) {
            var _mute = v.duration,
                _cha = _mute / 15;
            var blockH = _mute / ops.time_scale * vert_scale;
            var scaleToH = ops.time_scale == 15 ? vert_scale : vert_scale;
            var pub_dt = v.agendadate;
            var startTms = new Date((pub_dt + " " + v.starttime).replace(/-/g, "/")),
                busStime = new Date((pub_dt + " " + v.starttime).split(" ")[0].replace(/-/g, "/") + " " + bus_startTime + ":00");
            var startRow = (startTms - busStime) / 60000 / parseInt(ops.time_scale) * scaleToH;
            uuid = v.agendaidentity != "" ? v.agendaidentity : uuid;
            var dataObj = {};
            dataObj.dataid = uuid;
            dataObj.clinicuniqueid = v.clinicuniqueid;
            dataObj.id = "block_" + dataObj.dataid;
            dataObj.startTime = v.agendadate + " " + v.starttime;
            dataObj.endTime = v.agendadate + " " + v.endtime;
            dataObj.duration = v.duration;
            dataObj.sshortTime = (v.agendadate + " " + v.starttime).substr(10, 6);
            dataObj.eshortTime = (v.agendadate + " " + v.endtime).substr(10, 6);
            dataObj.scheduledate = v.agendadate;
            dataObj.custName = "事项 : " + v.agendaitem;
            dataObj.datasource = "";
            dataObj.data_ws = 1;
            dataObj.data_cinx = $("#col_" + v.doctorid).index();
            dataObj.left = 0;
            dataObj.top = startRow;
            dataObj.customerid = "none";
            dataObj.width = public_cnf.fit_col_w - 1;
            dataObj.height = blockH;
            dataObj.doctorid = v.doctorid;
            dataObj.doctorName = v.agendadoct;
            dataObj.items = v.remark;
            dataObj.status = "matter";
            dataObj.importance = v.importance;
            dataObj.remark = v.remark;
            switch (dtype) {
                case "day":
                    col_data_arr.add(uuid, dataObj);
                    break;
                case "week":
                    wcol_data_arr.add(uuid, dataObj);
                    break;
                case "month":
                    mcol_data_arr.add(uuid, dataObj);
                    break
            }
        }

        function addToDBlockTable(v, dtype) {
            var _mute = v.duration,
                _cha = _mute / 15;
            var blockH = _mute / ops.time_scale * vert_scale;
            var scaleToH = ops.time_scale == 15 ? vert_scale : vert_scale;
            var pub_dt = v.scheduledate;
            var startTms = new Date((pub_dt + " " + v.starttime).replace(/-/g, "/")),
                busStime = new Date((pub_dt + " " + v.starttime).split(" ")[0].replace(/-/g, "/") + " " + bus_startTime + ":00");
            var startRow = (startTms - busStime) / 60000 / parseInt(ops.time_scale) * scaleToH;
            var dataObj = {};
            dataObj.dataid = v.scheduleidentity;
            dataObj.id = "block_" + v.scheduleidentity;
            dataObj.startTime = v.scheduledate + " " + v.starttime;
            dataObj.endTime = v.scheduledate + " " + v.endtime;
            dataObj.duration = v.duration;
            dataObj.sshortTime = (v.scheduledate + " " + v.starttime).substr(10, 6);
            dataObj.eshortTime = (v.scheduledate + " " + v.endtime).substr(10, 6);
            dataObj.scheduledate = v.scheduledate;
            dataObj.datasource = v.datasource;
            dataObj.allergichistory = v.allergichistory;
            dataObj.diseasehistory = v.diseasehistory;
            dataObj.consultidentity = v.consultidentity;
            dataObj.data_ws = 1;
            dataObj.data_cinx = $("#col_" + v.doctorid).index();
            dataObj.left = 0;
            dataObj.top = startRow;
            dataObj.width = public_cnf.fit_col_w - 1;
            dataObj.height = blockH;
            dataObj.custName = v.name;
            dataObj.customerid = v.customerid;
            dataObj.doctorid = v.doctorid;
            dataObj.doctorName = v.doctorname;
            dataObj.phone = v.phone;
            dataObj.sex = v.sex;
            dataObj.payment = v.payment;
            dataObj.treatment = v.treatment;
            dataObj.debts = v.debts;
            dataObj.vipicon = v.vipicon;
            dataObj.items = v.items;
            dataObj.status = v.status;
            dataObj.viptype = v.viptype;
            dataObj.vipnumber = v.vipnumber;
            dataObj.vipcardidentity = v.vipcardidentity;
            dataObj.visitstatus = v.visitstatus;
            dataObj.importance = null;
            dataObj.remark = v.remark;
            dataObj.predom = null;
            dataObj.nextdom = [];
            switch (dtype) {
                case "day":
                    col_data_arr.add(v.scheduleidentity, dataObj);
                    break;
                case "week":
                    wcol_data_arr.add(v.scheduleidentity, dataObj);
                    break;
                case "month":
                    mcol_data_arr.add(v.scheduleidentity, dataObj);
                    break
            }
        }

        function calc_doc_pages(fitcols) {
            doc_pages = [];
            var d_arrs = col_doctor_obj.getKeys();
            var d_len = d_arrs.length;
            if (d_len < fitcols) {
                doc_pages.push(d_arrs)
            } else {
                var iPages = Math.floor(d_len / fitcols);
                if (d_len % fitcols != 0) {
                    ++iPages
                }
            }
            for (var i = 0; i < iPages; i++) {
                var tmp = [];
                if (i == iPages - 1) {
                    var lastIndex = d_len - fitcols;
                    for (var n = lastIndex,
                            lst = n + fitcols; n < lst; n++) {
                        typeof(d_arrs[n]) != "undefined" ? tmp.push(d_arrs[n]): tmp.push("none")
                    }
                    doc_pages.push(tmp)
                } else {
                    for (var j = 0; j < fitcols; j++) {
                        var m = (i * fitcols) + j;
                        tmp.push(d_arrs[m])
                    }
                    doc_pages.push(tmp)
                }
            }
        }

        function setTimeLine() {
            var cur_time = new Date();
            var _h = cur_time.getHours(),
                _m = cur_time.getMinutes();
            var _starttime = cur_time.getFullYear() + "/" + (cur_time.getMonth() + 1) + "/" + cur_time.getDate() + " " + bus_startTime + ":00";
            var _endtime = cur_time.getFullYear() + "/" + (cur_time.getMonth() + 1) + "/" + cur_time.getDate() + " " + bus_endTime + ":00";
            var startTms = new Date(_starttime),
                endTms = new Date(_endtime);
            var cur_cha = (cur_time - startTms) / 60000;
            var _kdtoH = ops.time_scale == 15 ? vert_scale * 4 : vert_scale * 2;
            var _tlineTop = cur_cha / ops.time_scale * vert_scale;
            $("#time_line").css("top", _tlineTop);
            $("#wtime_line").css({
                "top": _tlineTop + 32,
                "z-index": 1
            });
            //$("#wtime_line").hide()
        }

        function initTable() {
            var tmpDoctHed = [],
                tmpDoctCol = [];
            var cur_cols = public_cnf.fit_col_count;
            doc_len = col_doctor_obj.getSize();
            calc_doc_pages(cur_cols)
        }

        function getObjRelationTop(p) {
            if (p.predom == null) {
                if (p.nextdom.length > 0) {
                    return p
                } else {
                    return null
                }
            } else {
                var t = p,
                    _p = null;
                while (t != null) {
                    t = t.predom;
                    t != null ? _p = t : ""
                }
                return typeof(_p) == "undefined" ? null : _p
            }
        }

        function getMyChilds(p) {
            var childs = [];
            var getMyChild = function(p) {
                if (p != null) {
                    var iLen = p.nextdom.length;
                    for (var i = 0; i < iLen; i++) {
                        var pt = p.nextdom[i];
                        childs.push(pt.dataid);
                        getMyChild(pt)
                    }
                }
            };
            getMyChild(p);
            return childs
        }

        function genDataBlockPos(dcoid, dbojid, dwType) {
            var genSingleLink = function(arrs, len) {
                var rcns = 0,
                    _ids = [],
                    _inArrs = [];
                var gen_spec_lw = function(arr) {
                    var _p = arr,
                        _t = arr.nextdom.length;
                    while (_t > 1) {
                        _t = _p.nextdom.length;
                        _p = _p.nextdom[0];
                        try {
                            if (typeof(_p) != "undefined") {
                                _inArrs.push({
                                    "top": $("#" + _p.id)[0].offsetTop,
                                    "id": _p.id,
                                    "duration": parseInt(_p.duration)
                                })
                            } else {
                                _t = 0
                            }
                        } catch (e) {
                            console.log(e)
                        }
                    }
                };
                for (var i = 0,
                        iLen = arrs.length; i < iLen; i++) {
                    if (dwType == "day") {
                        gen_spec_lw(col_data_arr.getValue($("#" + arrs[i]).attr("data-id")))
                    }
                    if (dwType == "week") {
                        gen_spec_lw(wcol_data_arr.getValue($("#" + arrs[i]).attr("data-id")))
                    }
                }
                return _inArrs
            };
            var my_relationids = dwType == "day" ? getBlock_id_xy(dcoid, dbojid, "day") : getBlock_id_xy(dcoid, dbojid, "week");
            var iaLen = my_relationids.length,
                curObj = null,
                parentObj = null;
            if (iaLen == 1 && my_relationids[0] == dbojid) {
                return
            }
            if (dwType == "day") {
                curObj = col_data_arr.getValue($("#" + dbojid).attr("data-id"));
                parentObj = col_data_arr.getValue($("#" + my_relationids[iaLen - 2]).attr("data-id"))
            }
            if (dwType == "week") {
                curObj = wcol_data_arr.getValue($("#" + dbojid).attr("data-id"));
                parentObj = wcol_data_arr.getValue($("#" + my_relationids[iaLen - 2]).attr("data-id"))
            }
            curObj.predom = parentObj;
            if (parentObj != null) {
                parentObj.nextdom.push(curObj)
            }
            var where = curObj.predom,
                doms = 0,
                p = curObj,
                idnames = [],
                direct_ids = [];
            while (where != null) {
                ++doms;
                where = p.predom;
                direct_ids.push(p.id);
                idnames.push({
                    "top": $("#" + p.id)[0].offsetTop,
                    "id": p.id,
                    "duration": parseInt(p.duration)
                });
                p = p.predom
            }
            var arrLen = idnames.length;
            idnames.reverse();
            if (idnames.length > 0) {
                var indirects = genSingleLink(direct_ids, arrLen);
                var alldoms = idnames.concat(indirects);
                arrLen = alldoms.length;
                var avWidth = dwType == "day" ? (public_cnf.fit_col_w - 4) / arrLen : (w_col_width + 3) / arrLen;
                var newAlls = alldoms.sort(by("row"));
                for (var i = 0; i < arrLen; i++) {
                    if (dwType == "day") {
                        var p = col_data_arr.getValue(newAlls[i].id.split("_")[1]);
                        p.width = avWidth - 1;
                        $("#schedule_panel #" + newAlls[i].id).outerWidth(avWidth - 1).css({
                            "left": i * (avWidth) + 1
                        })
                    }
                    if (dwType == "week") {
                        var p = wcol_data_arr.getValue(newAlls[i].id.split("_")[1]);
                        p.width = avWidth - 1;
                        $("#week_conc #" + newAlls[i].id).outerWidth(avWidth - 1).css({
                            "left": i * (avWidth) + 1
                        })
                    }
                }
                $("#" + newAlls[0].id).css({
                    "left": "1px"
                })
            }
        }

        function rowToStime(row) {
            var stmpDate = new Date().toLocaleString().split(" ")[0].replace(/-/g, "/");
            var _endtm = public_cnf.schule_hours.split("-")[0];
            var bTime = new Date(stmpDate + " " + _endtm + ":00");
            bTime.setMinutes(bTime.getMinutes() + row * ops.time_scale, bTime.getSeconds(), 0);
            return bTime.getHours() + ":" + bTime.getMinutes()
        }

        function getCalcTime(oldTime, ad) {
            var stmpDate = new Date().toLocaleString().split(" ")[0];
            var bTime = new Date(stmpDate + " " + oldTime);
            if (ad == 1) {
                bTime.setMinutes(bTime.getMinutes() + ops.time_scale, bTime.getSeconds(), 0)
            } else {
                bTime.setMinutes(bTime.getMinutes() - ops.time_scale, bTime.getSeconds(), 0)
            }
            return bTime.getHours() + ":" + bTime.getMinutes()
        }

        function updateStInfo(el, str) {
            $(el).find(".stinfo").text(str)
        }

        function format_time(tm) {
            var _tmp = tm.split(":");
            var _h = parseInt(_tmp[0]) < 10 ? "0" + parseInt(_tmp[0]) : _tmp[0];
            var _m = parseInt(_tmp[1]) < 10 ? "0" + parseInt(_tmp[1]) : _tmp[1];
            return _h + ":" + _m
        }

        function getBestPobj(arrs, cur_id) {
            var cur_top = $("#" + cur_id)[0].offsetTop,
                eqs = [],
                lts = [];
            for (var i = 0,
                    len = arrs.length; i < len; i++) {
                if ($("#" + arrs[i])[0].offsetTop <= cur_top) {
                    if ($("#" + arrs[i])[0].offsetTop == cur_top) {
                        eqs.push(arrs[i])
                    } else {
                        lts.push(arrs[i])
                    }
                }
            }
            if (eqs.length > 0) {
                return {
                    "id": eqs[eqs.length - 1],
                    "comp": "eq"
                }
            } else {
                return {
                    "id": lts[0],
                    "comp": "lt"
                }
            }
        }

        function HashTable() {
            var size = 0;
            var entry = new Object();
            this.add = function(key, value) {
                if (!this.containsKey(key)) {
                    size++
                }
                entry[key] = value
            };
            this.getValue = function(key) {
                return this.containsKey(key) ? entry[key] : null
            };
            this.edit = function(key, value) {
                entry[key] = value
            };
            this.remove = function(key) {
                if (this.containsKey(key) && (delete entry[key])) {
                    size--
                }
            };
            this.containsKey = function(key) {
                return (key in entry)
            };
            this.containsValue = function(value) {
                for (var prop in entry) {
                    if (entry[prop] == value) {
                        return true
                    }
                }
                return false
            };
            this.getValues = function() {
                var values = new Array();
                for (var prop in entry) {
                    values.push(entry[prop])
                }
                return values
            };
            this.getKeys = function() {
                var keys = new Array();
                for (var prop in entry) {
                    keys.push(prop)
                }
                return keys
            };
            this.getSize = function() {
                return size
            };
            this.clear = function() {
                size = 0;
                entry = new Object()
            }
        }

        function uuid(len, radix) {
            var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split("");
            var uuid = [],
                i;
            radix = radix || chars.length;
            if (len) {
                for (i = 0; i < len; i++) {
                    uuid[i] = chars[0 | Math.random() * radix]
                }
            } else {
                var r;
                uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
                uuid[14] = "4";
                for (i = 0; i < 36; i++) {
                    if (!uuid[i]) {
                        r = 0 | Math.random() * 16;
                        uuid[i] = chars[(i == 19) ? (r & 3) | 8 : r]
                    }
                }
            }
            return uuid.join("")
        }

        function resizeObject() {
            this.el = null;
            this.dir = "";
            this.grabx = null;
            this.graby = null;
            this.width = null;
            this.height = null;
            this.left = null;
            this.top = null
        }

        function getDirection(el, evt) {
            var xPos, yPos, offset, dir;
            dir = "";
            xPos = evt.offsetX;
            yPos = evt.offsetY;
            offset = 8;
            if (yPos < offset) {
                dir += "n"
            } else {
                if (yPos > el.offsetHeight - offset) {
                    dir += "s"
                }
            }
            if (xPos < offset) {
                dir += "w"
            } else {
                if (xPos > el.offsetWidth - offset) {
                    dir += "e"
                }
            }
            return dir
        }

        function doDown(robj, evt) {
            var el = robj;
            isMouseDown = true;
            if (el == null) {
                resizeParam = null;
                return
            }
            var elParent = $(el).parent().attr("id").split("_")[0];
            var id_qz = elParent.split("_")[0];
            var _pData = null;
            switch (id_qz) {
                case "col":
                    _pData = col_data_arr.getValue($(el).attr("data-id"));
                    break;
                case "wcol":
                    _pData = wcol_data_arr.getValue($(el).attr("data-id"));
                    break
            }
            dir = getDirection(el, evt);
            if (dir == "") {
                return
            }
            resizeParam = new resizeObject();
            resizeParam.pdata = _pData;
            resizeParam.el = el;
            resizeParam.idqz = id_qz;
            resizeParam.elParentid = $(el).attr("data-id");
            resizeParam.dir = dir;
            resizeParam.grabx = evt.clientX;
            resizeParam.graby = evt.clientY;
            resizeParam.width = el.offsetWidth;
            resizeParam.height = el.offsetHeight;
            resizeParam.left = el.offsetLeft;
            resizeParam.top = el.offsetTop;
            resizeParam.bottom = el.offsetTop + resizeParam.height;
            resizeParam.duration = _pData.duration;
            resizeParam.tminfo = $(el).find(".stinfo").text();
            evt.returnValue = false;
            evt.cancelBubble = true
        }

        function doMove(ev) {
            var _status = parseInt(resizeParam.pdata.status);
            if (_status == 3 || _status == 8) {
                switch (_status) {
                    case 3:
                        jQuery.postFail("fadeInUp", "已经安排检查,不能修改!");
                        break;
                    case 8:
                        jQuery.postFail("fadeInUp", "预约已经流失,不能修改!");
                        break
                }
                return
            }
            $("#block_hint").hide();
            var objEvt = ev || event;
            var el, xPos, yPos, str, xMin, yMin;
            xMin = 8;
            yMin = 8;
            if (resizeParam.idqz == "col") {
                el = $("#schedule_panel #block_" + resizeParam.elParentid)[0]
            } else {
                el = $("#week_conc #block_" + resizeParam.elParentid)[0]
            }
            try {
                if (typeof(el.className) != "undefined" && el.className == "block") {
                    str = resizeParam.dir;
                    if (str == "" || str == "w" || str == "e") {
                        str = "default"
                    } else {
                        str += "-resize"
                    }
                    el.style.cursor = str;
                    dir = resizeParam.dir
                }
            } catch (e) {
                console.log("err:" + e)
            }
            var stm = null;
            if (resizeParam != null) {
                var m_pos = ev.pageY - schedule_ptop;
                if (resizeParam.dir.indexOf("s") != -1) {
                    var newH = Math.max(yMin, resizeParam.height + objEvt.clientY - resizeParam.graby);
                    var _int = Math.floor((el.offsetTop + newH) / vert_scale) + 1;
                    el.style.height = (_int * vert_scale - el.offsetTop - 2) + "px";
                    stm = calc_start_tm_bytop(parseInt(el.offsetTop), (_int * vert_scale - el.offsetTop) / vert_scale * ops.time_scale);
                    resizeParam.duration = (_int * vert_scale - el.offsetTop) / vert_scale * ops.time_scale
                }
                if (resizeParam.dir.indexOf("n") != -1) {
                    var newTop = Math.min(resizeParam.top + objEvt.clientY - resizeParam.graby, resizeParam.top + resizeParam.height - yMin);
                    var _int = Math.floor(newTop / vert_scale);
                    var _ntop = _int * vert_scale;
                    var _trueBotom = resizeParam.bottom;
                    if (resizeParam.bottom % vert_scale != 0) {
                        if ((resizeParam.bottom + 1) % vert_scale % vert_scale == 0) {
                            _trueBotom = resizeParam.bottom + 1
                        } else {
                            if ((resizeParam.bottom - 1) % vert_scale % vert_scale == 0) {
                                _trueBotom = resizeParam.bottom - 1
                            }
                        }
                    }
                    var _het = resizeParam.bottom - _ntop;
                    if (_het < vert_scale) {} else {
                        el.style.top = _ntop + "px";
                        el.style.height = (_het - 1) + "px"
                    }
                    var n_het = _het % vert_scale == 0 ? _het : (Math.floor(_het / vert_scale) + 1) * ops.time_scale;
                    stm = calc_start_tm_bytop(_ntop, (_trueBotom - _ntop) / vert_scale * ops.time_scale);
                    resizeParam.duration = (_trueBotom - _ntop) / vert_scale * ops.time_scale
                }
                tmpPub = stm[1][1].substring(0, 5) + "-" + stm[3][1].substring(0, 5) + " (" + stm[4] + "m)";
                resizeParam.pdata.eshortTime = stm[3][1].substring(0, 5);
                resizeParam.pdata.sshortTime = stm[1][1].substring(0, 5);
                resizeParam.pdata.duration = resizeParam.duration;
                updateStInfo(el, tmpPub);
                objEvt.returnValue = false;
                objEvt.cancelBubble = true
            }
        }

        function doUp(evt) {
            if (resizeParam == null) {
                return
            }
            var _status = parseInt(resizeParam.pdata.status);
            if (_status == 3 || _status == 8) {
                if (resizeParam != null) {
                    resizeParam = null
                }
                isMouseDown = false;
                return
            }
            jQuery.showAsk("确定要改变当前预约?", "确认",
                function() {
                    var curElHt = $(resizeParam.el).height();
                    var _kd = curElHt % vert_scale == 0 ? curElHt / vert_scale : Math.floor(curElHt / vert_scale) + 1;
                    var _truelHt = _kd * vert_scale;
                    var _tmInfo = $(resizeParam.el).find(".stinfo").text();
                    resizeParam.height = _truelHt;
                    resizeParam.pdata.top = parseInt($(resizeParam.el).css("top"));
                    resizeParam.pdata.height = _truelHt;
                    resizeParam.pdata.endTime = resizeParam.pdata.endTime.split(" ")[0] + " " + resizeParam.pdata.eshortTime;
                    resizeParam.pdata.startTime = resizeParam.pdata.startTime.split(" ")[0] + " " + resizeParam.pdata.sshortTime;
                    resizeParam.pdata.duration = resizeParam.duration;
                    if (resizeParam.idqz == "col") {
                        var _pt = col_doctor_obj.getValue($("#schedule_panel #block_" + resizeParam.elParentid).attr("data-docid"));
                        gen_dblock_by_doc(_pt)
                    }
                    if (resizeParam.idqz == "wcol") {
                        var parent = $("#week_conc #block_" + resizeParam.elParentid).parent().attr("id");
                        var _pt = wcol_week_obj.getValue($("#h" + parent).attr("data-val").replace(/\//g, "-"));
                        gen_dblock_by_week(_pt, parent.split("_")[1])
                    }
                    if (ops.callbackSingleEdt != null) {
                        ops.callbackSingleEdt({
                            "startTime": resizeParam.pdata.sshortTime,
                            "endTime": resizeParam.pdata.eshortTime,
                            "scheduledate": resizeParam.pdata.scheduledate,
                            "duration": resizeParam.pdata.duration,
                            "scheduleidentity": resizeParam.pdata.dataid,
                            "doctorid": resizeParam.pdata.doctorid,
                            "customerid": resizeParam.pdata.customerid,
                            "doctorName": resizeParam.pdata.doctorName
                        }, resizeParam.pdata)
                    }
                    jQuery.pop_window_modal_dialog_close({
                        _closemothod: "fadeOutUp"
                    });
                    if (resizeParam.pdata.importance == null) {
                        set_drag_size_gq(resizeParam.pdata, resizeParam.el, resizeParam.idqz);
                    }
                    if (resizeParam != null) {
                        resizeParam = null
                    }
                    isMouseDown = false
                },
                function() {
                    jQuery.pop_window_modal_dialog_close({
                        _closemothod: "fadeOutUp"
                    });
                    $(resizeParam.el).find(".stinfo").text(resizeParam.tminfo);
                    $(resizeParam.el).css({
                        "top": resizeParam.pdata.top,
                        "height": resizeParam.pdata.height - 2
                    });
                    if (resizeParam != null) {
                        resizeParam = null
                    }
                    isMouseDown = false
                })
        }

        $("#" + Ownerid).on("mouseenter", ".block_text,.mblock,.drag_status",
            function(ev) {
                if (isMouseDown == true) {
                    return
                }
                $("#focus_add_day,#ocus_add_wek").hide();
                var objEvt = ev || event;
                var fromObjType = "zcol";
                var p = null;
                if (ev.target.className == "block_text" || ev.target.className == "drag_status") {
                    var el = objEvt.target.parentElement;
                    var pparent = $(el).parent().attr("class").trim();
                    var dataid = $(el).attr("data-id");
                    var colrs = GenBlockOverColr(el);
                    $(el).css({
                        "background-color": "rgb(" + colrs[0] + ")",
                        "border-color": "rgb(" + colrs[0] + ")"
                    }).attr("data-oldcor", colrs[1]);
                    if (pparent.indexOf("w_col") > -1) {
                        p = wcol_data_arr.getValue(dataid);
                        fromObjType = "w_col"
                    }
                    if (pparent.indexOf("zcol") > -1) {
                        p = col_data_arr.getValue(dataid);
                        fromObjType = "zcol"
                    }
                }
                if (ev.target.className == "mblock" || ev.target.className == "nm") {
                    var el = objEvt.target.className == "mblock" ? objEvt.target : objEvt.target.parentElement.parentElement;
                    var dataid = $(el).attr("data-id");
                    var colrs = GenBlockOverColr(el);
                    $(el).css({
                        "background-color": "rgb(" + colrs[0] + ")",
                        "border-color": "rgb(" + colrs[0] + ")"
                    }).attr("data-oldcor", colrs[1]);
                    p = mcol_data_arr.getValue(dataid);
                    fromObjType = "mblock"
                }
                var offset = $(el).offset();
                if (typeof(offset) == 'undefined') {
                    return;
                }
                //console.log('offset=',offset);
                if ($("#f_frame_cont").length > 0) {
                    offset.left = offset.left - public_cnf.attachedLeftW;
                    offset.top = offset.top - public_cnf.attachedTopH;
                }
                try {
                    $("#block_hint").attr("data-ftype", fromObjType);
                    $("#block_hint").attr("data-id", dataid);
                    $("#block_hint").attr("data-did", p.doctorid);
                    $("#block_hint").attr("data-phone", p.phone);
                    $("#block_hint").attr("data-custid", p.customerid);
                    $("#block_hint").attr("data-scheduledate", p.scheduledate)
                } catch (e) {}

                var _wh = $(window).height(),
                    _sctop = $(document).scrollTop(),
                    // wfot = _wh + _sctop;
                    wfot = _wh;
                var _okvp = wfot - (ev.clientY + _sctop);
                _okvp > 260 ? _okvp = 240 : "";

                if (offset.left + $(el).width() + public_cnf.attachedLeftW + $("#block_hint").width() > $(window).width()) {
                    $("#block_hint  .triangle").css("left", $("#block_hint").width()).find("img").attr("src", ops.sch_ico_path + "/tr_ri.png");
                    $("#block_hint").css({
                        "top": offset.top,
                        "left": offset.left - $("#block_hint").width() - 10
                    });
                    $("#block_hint .triangle").css({
                        "top": "10px"
                    });
                    // if (offset.top + $("#block_hint").height() + 10 > wfot) {
                    //     $("#block_hint").css({
                    //         "top": wfot - $("#block_hint").height()
                    //     });
                    //     $("#block_hint .triangle").css({
                    //         "top": $("#block_hint").height() - _okvp-5
                    //     })
                    // }
                    var _bk_hintH = $("#block_hint").height();
                    if ($(el).attr('data-type') == 'log') {
                        _bk_hintH = 120;
                    } else {
                        _bk_hintH = 260;
                    }
                    if (offset.top + public_cnf.attachedTopH + _bk_hintH + 10 > wfot) {
                        $("#block_hint").css({
                            "top": wfot - _bk_hintH - public_cnf.attachedTopH - 10
                        });
                        $("#block_hint .triangle").css({
                            "top": _bk_hintH - _okvp - 5
                        })
                    }
                    fromObjType != "mblock" ? $("#block_hint").show() : ""
                } else {
                    $("#block_hint  .triangle").css("left", "-7px").find("img").attr("src", ops.sch_ico_path + "/tr_lf.png");
                    $("#block_hint").css({
                        "top": offset.top,
                        "left": offset.left + $(el).width() + 10
                    });
                    $("#block_hint .triangle").css({
                        "top": "10px"
                    });

                    var _bk_hintH = $("#block_hint").height();
                    if ($(el).attr('data-type') == 'log') {
                        _bk_hintH = 120;
                    } else {
                        _bk_hintH = 260;
                    }
                    if (offset.top + public_cnf.attachedTopH + _bk_hintH + 10 > wfot) {
                        $("#block_hint").css({
                            "top": wfot - _bk_hintH - public_cnf.attachedTopH - 10
                        });
                        $("#block_hint .triangle").css({
                            "top": _bk_hintH - _okvp - 5
                        })
                    }
                    fromObjType != "mblock" ? $("#block_hint").show() : ""
                }
                data_hint_view(p)
            });

        $("#" + Ownerid).on("mousemove", ".block_text",
            function(ev) {
                if (isMouseDown) {
                    return
                }
                var el = ev.target;
                var offset = 5;
                var bRect = $(el)[0].getBoundingClientRect();
                var cur_top = ev.clientY;
                if (cur_top > bRect.top && cur_top <= bRect.top + offset) {
                    el.style.cursor = "n-resize";
                    mvOrResize = "rz"
                } else {
                    if (cur_top > bRect.bottom - offset && cur_top <= bRect.bottom) {
                        el.style.cursor = "s-resize";
                        mvOrResize = "rz"
                    } else {
                        el.style.cursor = 'url("' + ops.sch_ico_path + 'openhand.cur"),move';
                        mvOrResize = "mv"
                    }
                }
            });
        $("#" + Ownerid).on("mouseleave", ".mblock_text",
            function(ev) {
                var el = ev.target.parentElement;
                var bRect = $(el)[0].getBoundingClientRect();
                var colrs = $(el).attr("data-oldcor");
                $(el).css({
                    "background-color": "rgb(" + colrs + ")",
                    "border-color": "rgb(" + colrs + ")"
                });
                if (ev.clientX >= bRect.right - 1) {} else {
                    if ($("#block_hint").offset().left < ev.clientX) {
                        if (ev.clientY < bRect.top + 3 || ev.clientY > bRect.bottom - 3) {
                            $("#block_hint").hide()
                        }
                    } else {
                        $("#block_hint").hide()
                    }
                }
            });

        $("#" + Ownerid).on("mouseleave", ".drag_status", function(ev) {
            // console.log('ev=', ev.toElement)
            if (ev.toElement.className != 'block_text') {
                $("#block_hint").hide();
            }
        });

        $("#" + Ownerid).on("mouseleave", ".block_text",
            function(ev) {
                $("#focus_add_day,#ocus_add_wek").show();
                var el = ev.target.parentElement;
                var bRect = $(el)[0].getBoundingClientRect();
                var colrs = $(el).attr("data-oldcor");
                $(el).css({
                    "background-color": "rgb(" + colrs + ")",
                    "border-color": "rgb(" + colrs + ")"
                });
                if (ev.clientX >= bRect.right - 1) {} else {
                    if ($("#block_hint").offset().left < ev.clientX) {
                        if (ev.clientY < bRect.top + 3 || ev.clientY > bRect.bottom - 3) {
                            $("#block_hint").hide()
                        }
                    } else {
                        $("#block_hint").hide()
                    }
                }
            });

        $("#" + Ownerid).on("mouseleave", "#block_hint",
            function(ev) {
                $("#block_hint").hide()
            });
        $("#" + Ownerid).on("mousemove", ".zcol",
            function(ev) {
                var offset = $(this).offset();
                var of_x = 213,
                    of_y = 200,
                    cY = ev.clientY,
                    scrTop = $("#schRightScrollDiv").length > 0 ? $("#schRightScrollDiv").scrollTop() : $(document).scrollTop(),
                    _top = $("#schRightScrollDiv").length > 0 ? ev.clientY + scrTop - 180 : ev.clientY + scrTop - 200;
                var col_head_css = $("#schedule_head").css("position");
                if (col_head_css == 'fixed') {
                    var _newTop = (Math.floor(_top / vert_scale) + 2) * vert_scale + 1;
                    if (_newTop < 32) {
                        return
                    }
                    if (vert_scale == 40) {
                        $("#focus_add_day").css({
                            "top": (Math.floor(_top / vert_scale) + 1) * vert_scale + 1
                        })
                    } else {
                        $("#focus_add_day").css({
                            "top": (Math.floor(_top / vert_scale) + 2) * vert_scale + 1
                        })
                    }

                } else {
                    var _newTop = Math.floor(_top / vert_scale) * vert_scale + 30 + 2;
                    if (_newTop < 32) {
                        return
                    }
                    $("#focus_add_day").css({
                        "top": Math.floor(_top / vert_scale) * vert_scale + 30 + 2
                    })
                }
                $("#focus_add_day").css({
                    "left": offset.left - $("#" + Ownerid).offset().left + 1,
                    "width": ($(this).width() - 1) + "px"
                }).show()
            });

        $("#" + Ownerid).on("mousemove", ".w_colzc",
            function(ev) {
                var offset = $(this).offset();
                var of_x = 213,
                    of_y = 200,
                    cY = ev.clientY,
                    scrTop = $("#schRightScrollDiv").length > 0 ? $("#schRightScrollDiv").scrollTop() : $(document).scrollTop(),
                    _top = $("#schRightScrollDiv").length > 0 ? ev.clientY + scrTop - 180 : ev.clientY + scrTop - 200;
                // if (scrTop >= schedule_htop) {
                var col_head_css = $("#schedule_head").css("position");
                if (col_head_css == 'fixed') {
                    var _newTop = (Math.floor(_top / vert_scale) + 2) * vert_scale;
                    if (_newTop < 32) {
                        return
                    }
                    if (vert_scale == 40) {
                        $("#focus_add_wek").css({
                            "top": (Math.floor(_top / vert_scale) + 1) * vert_scale + 1
                        })
                    } else {
                        $("#focus_add_wek").css({
                            "top": (Math.floor(_top / vert_scale) + 2) * vert_scale + 1
                        })
                    }
                    // $("#focus_add_wek").css({
                    //     "top": (Math.floor(_top / vert_scale) + 2) * vert_scale
                    // })
                } else {
                    var _newTop = Math.floor(_top / vert_scale) * vert_scale + 30 + 2;
                    if (_newTop < 32) {
                        return
                    }
                    $("#focus_add_wek").css({
                        "top": Math.floor(_top / vert_scale) * vert_scale + 30 + 2
                    })
                }
                $("#focus_add_wek").css({
                    "left": offset.left - $("#" + Ownerid).offset().left + 1,
                    "width": ($(this).width() - 1) + "px"
                }).show()
            });

        $("#" + Ownerid).on("mouseenter", "#schedule_panel .col,#week_panel .w_col",
            function(ev) {
                var _class = $(this).attr("id").split("_")[0];
                var _tmp = $(this).attr("id").split("_")[1];
                if (isMouseDown) {
                    switch (_class) {
                        case "col":
                            col_over_id = $(this).attr("id");
                            break;
                        case "wcol":
                            if (_tmp == 1 || _tmp == 8) {} else {
                                wcol_over_id = $(this).attr("id")
                            }
                            break
                    }
                }
            });
        $("#" + Ownerid).off("mousedown", ".block").on("mousedown", ".block",
            function(ev) {
                if (ev.target.className == "drag_status") {
                    return
                }
                if (mvOrResize == "mv") {
                    dgMvDown(ev || event, $(this))
                } else {
                    doDown($(this)[0], ev || event)
                }
                document.onmousemove = function(ev) {
                    if (mvOrResize == "mv") {
                        dgMvMove(ev || event)
                    } else {
                        doMove(ev || event)
                    }
                };
                document.onmouseup = function(ev) {
                    var objEvt = ev || event,
                        el = objEvt.target;
                    dgMvUp(ev || event);
                    doUp(objEvt);
                    document.onmousemove = null;
                    document.onmouseup = null
                };
                return false
            });

        function set_scale(m) {
            ops.time_scale = m;
            css_set()
        }

        function css_set() {
            var css = function(t, s) {
                s = document.createElement("style");
                s.innerText = t;
                document.head.appendChild(s)
            };
            css(".col{ height:100%;box-sizing:border-box; background-image:url(" + ops.sch_ico_path + "kidu" + ops.time_scale + ".png)  !important; background-position:0px -1px; position:relative;  overflow:hidden; display:inline-block;width:175px;border-right:solid 1px #e0e0e0}" + ".w_col{ background-image:url(" + ops.sch_ico_path + "kidu" + ops.time_scale + ".png)  !important; background-position:0px -1px; position:relative;  overflow:hidden;}" + ".col_frt{width:50px !important; height:100%; background-color:#FCFFCA !important; background-image:url(" + ops.sch_ico_path + "/L_" + ops.time_scale + ".png)  !important; background-position:0px -1px; background-repeat:repeat-y; ; box-sizing:border-box;}" + ".col_lst{border-right:none; width:45px !important;background-image:url(" + ops.sch_ico_path + "/L_" + ops.time_scale + "r.png)  !important; background-position:center -1px; box-sizing:border-box; }" + ".block{position:absolute; z-index:" + ops.public_cnf.block_zindex + "; height:40px; width:100%; background-color:#ffbf00;top:0px; width:175px; left:225px; overflow:hidden; border:solid 1px #f00}" + ".col_paiban{background-color:#999; opacity:0.2; position:absolute; z-index:" + (ops.public_cnf.block_zindex - 1) + "; width:100%; left:0px; top:0px; height:0px;}")
        }

        function eventBind() {
            $("#tb_month tbody").off("dblclick", "td").on("dblclick", "td",
                function() {
                    if ($(this).find(".mblock").size() > 0) {
                        ops.callbackMonthClick($(this).attr("data-ymd"))
                    }
                });
            $("#week_head").off("click", "#sch_plus_set_w").on("click", "#sch_plus_set_w",
                function() {
                    ops.set_callback()
                });
            $("#week_conc").off("click", ".w_col .drag_status").on("click", ".w_col .drag_status", function() {
                var pid = $(this).parents(".block").attr("id").split("_")[1];
                var p = wcol_data_arr.getValue(pid);
                ops.callbackStatusEdt({
                        "scheduleidentity": p.dataid,
                        "status": p.status,
                        "customerid": p.customerid
                    }, p)
                    /* ops.callbackEdt({
                        "scheduleidentity":p.dataid,
                        "doctorid": p.doctorid,
                        "scheduledate": p.scheduledate
                    },
                    p);*/
            });
            $("#schedule_panel").off("click", ".zcol .drag_status").on("click", ".zcol .drag_status",
                function() {
                    var pid = $(this).parents(".block").attr("id").split("_")[1];
                    var p = col_data_arr.getValue(pid);
                    /*ops.callbackEdt({
                        "scheduleidentity":p.dataid,
                        "doctorid": p.doctorid,
                        "scheduledate": p.scheduledate
                    },
                    p);*/
                    ops.callbackStatusEdt({
                        "scheduleidentity": p.dataid,
                        "status": p.status,
                        "customerid": p.customerid
                    }, p)
                });

            $("#week_conc").off("click", ".w_colzc .drag_status").on("click", ".w_colzc .drag_status",
                function() {
                    var pid = $(this).parents(".block").attr("id").split("_")[1];
                    var p = wcol_data_arr.getValue(pid);
                    ops.callbackStatusEdt({
                        "scheduleidentity": p.dataid,
                        "status": p.status,
                        "customerid": p.customerid
                    })
                });
            $("#focus_add_wek").off("dblclick ").on("dblclick ",
                function() {
                    var offsetLeft = $(this)[0].offsetLeft - 51,
                        offsetTop = $(this)[0].offsetTop,
                        Lindex = Math.round(offsetLeft / ($(this).width() + 2)),
                        startDt = $("#h" + $("#week_conc .w_colzc:eq(" + Lindex + ")").attr("id")).attr("data-val");
                    var col_head_css = $("#schedule_head").css("position");
                    if (col_head_css == 'relative') {
                        offsetTop = $(this)[0].offsetTop - 30 - 2
                    }
                    var stm = calc_start_tm_bytop(offsetTop, ops.time_scale);
                    if (ops.callbackAddWek != null) {
                        ops.callbackAddWek({
                            "scheduledate": startDt,
                            "starttime": stm[1],
                            "duration": ops.time_scale
                        })
                    }
                });
            $("#focus_add_day").off("dblclick ").on("dblclick ",
                function() {
                    var offsetLeft = $(this)[0].offsetLeft - 51,
                        offsetTop = $(this)[0].offsetTop,
                        Lindex = Math.round(offsetLeft / ($(this).width() + 2)),
                        doctorid = $("#schedule_panel .zcol:eq(" + Lindex + ")").attr("id").split("_")[1];
                    //console.log('offsetLeft=',offsetLeft,'offsetTop=',offsetTop);
                    var col_head_css = $("#schedule_head").css("position");
                    if (col_head_css == 'relative') {
                        offsetTop = $(this)[0].offsetTop - 30 - 2
                    }
                    //if ($(document).scrollTop() >= schedule_htop) {} else {
                    // offsetTop = $(this)[0].offsetTop - 30 - 2
                    //}
                    //					console.log('offsetLeft=',offsetLeft,'offsetTop=',offsetTop);
                    var stm = calc_start_tm_bytop(offsetTop, ops.time_scale);
                    if (ops.callbackAddDay != null) {
                        ops.callbackAddDay({
                            "doctorid": doctorid,
                            "starttime": stm[1],
                            "duration": ops.time_scale
                        })
                    }
                });
            $("#head_cz").off("click", ".edt,.del,.sms,.view,.status").on("click", ".edt,.del,.sms,.view,.status",
                function(e) {
                    var type = $("#block_hint").attr("data-ftype"),
                        _pt = null,
                        _id = $("#block_hint").attr("data-id");
                    switch (type) {
                        case "zcol":
                            _pt = col_data_arr.getValue(_id);
                            break;
                        case "w_col":
                            _pt = wcol_data_arr.getValue(_id);
                            break
                    }
                    var btn = e.target.className.replace(/ico/g, "").trim();
                    switch (btn) {
                        case "edt":
                            ops.callbackEdt({
                                    "scheduleidentity": $("#block_hint").attr("data-id"),
                                    "doctorid": $("#block_hint").attr("data-did"),
                                    "scheduledate": $("#block_hint").attr("data-scheduledate")
                                },
                                _pt);
                            break;
                        case "del":
                            ops.callbackDel($("#block_hint").attr("data-id"), _pt);
                            break;
                        case "sms":
                            ops.callbackSms($("#block_hint").attr("data-custid") + "|" + $("#block_hint").attr("data-phone"), _pt);
                            break;
                        case "view":
                            ops.callbackInfo($("#block_hint").attr("data-custid"), _pt);
                            break;
                        case "status":
                            ops.callbackStatus($("#block_hint").attr("data-custid"), _pt);
                            break;
                    }
                });
            $("#schedule_head").off("click", ".l_pg");
            $("#schedule_head").on("click", ".l_pg",
                function() {
                    $("#block_hint").hide();
                    var cls = $(this).attr("class").split(" ");
                    if ($.inArray("lrpdp", cls) > -1) {
                        return
                    }
                    if (doc_pIndex == 0) {
                        $(this).addClass("lrpdp")
                    } else {
                        $("#schedule_head  .r_pg").removeClass("lrpdp");
                        gen_datalist_blocks(--doc_pIndex)
                    }
                });
            $("#schedule_head").off("click", ".r_pg");
            $("#schedule_head").on("click", ".r_pg",
                function() {
                    $("#block_hint").hide();
                    var cls = $(this).attr("class").split(" ");
                    if ($.inArray("lrpdp", cls) > -1) {
                        return
                    }
                    if (doc_pIndex >= doc_pages.length - 1) {
                        $(this).addClass("lrpdp_right")
                    } else {
                        gen_datalist_blocks(++doc_pIndex)
                    }
                });
            $("#schedule_head").off("click", "#sch_plus_set");
            $("#schedule_head").on("click", "#sch_plus_set",
                function() {
                    ops.set_callback()
                })
        }

        function swap_panel(index) {
            $("#block_hint").hide();
            switch (index) {
                case 0:
                    $("#day_panel").show();
                    $("#week_panel").hide();
                    $("#month_panel").hide();
                    cur_view_to = 'd';
                    break;
                case 1:
                    $("#day_panel").hide();
                    $("#week_panel").show();
                    $("#month_panel").hide();
                    cur_view_to = 'w';
                    genTimeVline(ops.time_scale);
                    $("#week_conc .w_col").css("height", $("#schedule_panel").height());
                    window.setTimeout(function() {
                        schViewResize();
                    }, 100);
                    break;
                case 2:
                    $("#day_panel").hide();
                    $("#week_panel").hide();
                    $("#month_panel").show();
                    cur_view_to = 'm';
                    break
            }
        }

        function callGenData(json_obj) {
            calc_fit_colw();
            gen_doctor_list(json_obj);
            initTable();
            eventBind();
            //alert(doc_pIndex)
            //gen_datalist_blocks(0)
            gen_datalist_blocks(doc_pIndex);
        }

        function setPanelSize() {
            var _rw = $("#right_content_panel").width();
            w_col_width = (_rw - 109) / 7 - 4;
            $("#focus_add_wek").width(w_col_width);
            $("#week_panel .w_col_h").width((_rw - 109) / 7);
            $("#week_panel .w_col").width((_rw - 109) / 7);
            $("#week_panel .block").width(w_col_width);
            $("#week_conc .w_col").css("height", $("#schedule_panel").height());
            $("#month_conc").css("height", "calc(100% - 30px)");
            $("#month_panel .m_col_h").width((_rw - 7) / 7);
            $("#week_panel .frt").empty().append('<img class="sch_plus_set" id="sch_plus_set_w" src="' + ops.sch_ico_path + '/set.png"/>')
        }

        function init_params() {
            setBussinesstime(ops.public_cnf.schule_hours);
            calc_fit_colw();
            gen_doctor_list();
            initTable();
            eventBind();
            gen_datalist_blocks(0);
            setPanelSize();
            gen_hint_div();
            schedule_htop = $("#" + ops.sch_head_id).offset().top;
            schedule_ptop = $("#" + ops.sch_panel_id).offset().top;
            clearInterval(timeline_tm);
            timeline_tm = window.setInterval(function() {
                    //$("#wtime_line").hide();
                    var endTm = date_format(new Date()).split(" ")[0] + " " + bus_endTime + ":59:59";
                    endTm = new Date(endTm);
                    var curDt = new Date();
                    if (curDt > endTm) {
                        clearInterval(timeline_tm);
                        $("#wtime_line").hide()
                    }
                    setTimeLine()
                },
                30000);
            weekInitHead();
            gen_table_month();
            $("#tb_month").on("click", "td",
                    function() {
                        $("#tb_month .sel").removeClass("sel");
                        $(this).addClass("sel")
                    })
                //------------------------
            if ($('#schRightScrollDiv').length > 0) {
                $('#schRightScrollDiv').on("scroll", function(e) {
                    $("#block_hint").hide();
                    // console.log('schedule_outer.scroll');					
                    var scroH = $(this).scrollTop(),
                        offset_Top = 86;

                    // console.log('scroH=', scroH, 'schedule_htop=', schedule_htop);
                    if (scroH > 0) {
                        $("#schedule_head").css({
                            "position": "fixed",
                            "top": "134px",
                            "z-index": "2"
                        }).addClass("head_fot_line");
                        $("#week_head").css({
                            "position": "fixed",
                            "top": "134px",
                            "z-index": "2"
                        })
                    } else {
                        if (scroH < schedule_htop) {
                            $("#schedule_head").css({
                                "position": "relative",
                                "top": "0px",
                                "z-index": "2"
                            }).removeClass("head_fot_line");
                            $("#week_head").css({
                                "position": "relative",
                                "top": "0px",
                                "z-index": "2"
                            })
                        }
                    }
                });
            } else {
                $(window).on("scroll", function(e) {
                    console.log('window.scroll');
                    var scroH = $(this).scrollTop();
                    if (scroH >= schedule_htop) {
                        $("#schedule_head").css({
                            "position": "fixed",
                            "top": "-1px",
                            "z-index": "2"
                        }).addClass("head_fot_line");
                        $("#week_head").css({
                            "position": "fixed",
                            "top": "-1px",
                            "z-index": "2"
                        })
                    } else {
                        if (scroH < schedule_htop) {
                            $("#schedule_head").css({
                                "position": "relative",
                                "z-index": "0"
                            }).removeClass("head_fot_line");
                            $("#week_head").css({
                                "position": "relative",
                                "z-index": "0"
                            })
                        }
                    }
                });
            } //------------------------
        }

        function update_dayblk_cnt(arr) {
            if (arr.length == 0) {
                $("#schedule_head .col_h").each(function(index, element) {
                    var id = $(this).attr("id").split("_")[1];
                    if ($(this).attr("id").indexOf("hcol") > -1) {
                        var cnt = $("#col_" + id).children(".block").size();
                        if (cnt == 0) {
                            cnt = "";
                            $(this).find(".sup").hide()
                        } else {
                            $(this).find(".sup").text('[' + cnt + ']').show()
                        }
                    }
                })
            } else {
                for (var i = 0, len = arr.length; i < len; i++) {
                    var cnt = $("#col_" + arr[i]).find(".block").size();
                    if (cnt > 0) {
                        $("#hcol_" + arr[i]).find(".sup").text('[' + cnt + ']').show()
                    } else {
                        $("#hcol_" + arr[i]).find(".sup").text("").hide()
                    }
                }
            }
        }

        function update_wekblk_cnt(arr) {
            if (arr.length == 0) {
                $("#week_head .w_col_h").each(function(index, element) {
                    var id = $(this).attr("id").split("_")[1];
                    if ($(this).attr("id").indexOf("hcol") > -1) {} else {
                        var cnt = $("#wcol_" + id).children(".block").size();
                        if (cnt == 0) {
                            cnt = "";
                            $(this).find(".cnt").hide()
                        } else {
                            $(this).find(".cnt").text('[' + cnt + ']').show()
                        }
                    }
                })
            } else {
                for (var i = 0,
                        len = arr.length; i < len; i++) {
                    var cnt = $("#" + arr[i]).find(".block").size();
                    cnt > 0 ? $("#h" + arr[i]).find(".cnt").text('[' + cnt + ']').show() : $("#h" + arr[i]).find(".cnt").text("").hide()
                }
            }
        }

        function weekInitHead(st) {
            //console.log('st=',st);
            var weeks = [];
            var nowYear = 0;
            var now = new Date();
            if (typeof(st) != "undefined") {
                weekStartDate = new Date(st.replace(/-/g, "/"));
                nowYear = weekStartDate.getFullYear();
                //console.log('weekStartDate=',weekStartDate.toLocaleString());
            } else {
                // var now = new Date();
                var nowDayOfWeek = now.getDay() - 1;
                nowDayOfWeek < 0 ? nowDayOfWeek = 0 : '';
                var nowDay = now.getDate();
                var nowMonth = now.getMonth();
                nowYear = now.getFullYear();
                weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
                // console.log('weekStartDate=', weekStartDate.toLocaleString(), 'nowDayOfWeek=', nowDayOfWeek);
            }
            weeks["Monday"] = date_format(weekStartDate).split(" ")[0].substring(5);
            weekStartDate.setDate(weekStartDate.getDate() + 1);
            weeks["Tuesday"] = date_format(weekStartDate).split(" ")[0].substring(5);
            weekStartDate.setDate(weekStartDate.getDate() + 1);
            weeks["Wednesday"] = date_format(weekStartDate).split(" ")[0].substring(5);
            weekStartDate.setDate(weekStartDate.getDate() + 1);
            weeks["Thursday"] = date_format(weekStartDate).split(" ")[0].substring(5);
            weekStartDate.setDate(weekStartDate.getDate() + 1);
            weeks["Friday"] = date_format(weekStartDate).split(" ")[0].substring(5);
            weekStartDate.setDate(weekStartDate.getDate() + 1);
            weeks["Saturday"] = date_format(weekStartDate).split(" ")[0].substring(5);
            weekStartDate.setDate(weekStartDate.getDate() + 1);
            weeks["Sunday"] = date_format(weekStartDate).split(" ")[0].substring(5);

            $(".w_col_h").each(function(index, element) {
                var id = $(this).attr("id").split("_")[1];
                var wtxt = eval("weeks['" + id + "']");
                if (typeof(wtxt) != "undefined") {
                    $(this).attr("data-val", nowYear + "/" + wtxt);
                    $(this).find(".d").text("(" + wtxt + ")")
                }
            });
            $("#week_head div").removeClass('red');
            var _tmpObj = $("#week_head div[data-val='" + date_format(now).split(' ')[0] + "']");
            _tmpObj.addClass('red');
            _tmpObj.find(".d").text("(今天)");
        }

        function genDataFromWeek(jsonobj, st) {
            weekInitHead(st);
            var week_en = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
            var _uuid = uuid(8, 16),
                tmpd = [];
            wcol_week_obj.clear();
            var getRow = function(v_duration, v_starttime, v_scheduledate) {
                var _mute = v_duration;
                var blockH = _mute / ops.time_scale * vert_scale;
                var scaleToH = ops.time_scale == 15 ? vert_scale : vert_scale;
                var pub_dt = v_scheduledate.replace(/-/g, "/");
                var startTms = new Date(pub_dt + " " + v_starttime),
                    busStime = new Date(pub_dt + " " + bus_startTime + ":00");
                var startRow = (startTms - busStime) / 60000 / parseInt(ops.time_scale) * scaleToH;
                return startRow
            };
            if (jsonobj.list == null) {
                return
            }
            wcol_data_arr.clear();
            $.each(jsonobj.list,
                function(k, v) {
                    var schedules_ids = [],
                        doctoragendas_ids = [],
                        workshift = [];
                    var weekNm = (new Date(v.date).getDay()) - 1;
                    weekNm == -1 ? weekNm = 6 : "";
                    var d_parent = "wcol_" + week_en[weekNm];
                    var hed_id = "hwcol_" + week_en[weekNm];
                    if (v.doctoragenda != null && v.doctoragenda.length > 0) {
                        $.each(v.doctoragenda,
                            function(kk, _v) {
                                addToArgbkTable(_v, _uuid, "week");
                                var id = _v.agendaidentity == "" ? _uuid : _v.agendaidentity;
                                doctoragendas_ids.push({
                                    "row": getRow(_v.duration, _v.starttime, _v.agendadate),
                                    "id": id,
                                    "duration": parseInt(_v.duration)
                                })
                            })
                    }
                    if (v.schedule != null && v.schedule.length > 0) {
                        $.each(v.schedule,
                            function(kk, vv) {
                                addToDBlockTable(vv, "week");
                                schedules_ids.push({
                                    "row": getRow(vv.duration, vv.starttime, vv.scheduledate),
                                    "id": vv.scheduleidentity,
                                    "duration": parseInt(vv.duration)
                                })
                            })
                    }
                    if (v.workshift != null) {}
                    var weekObj = {};
                    weekObj.date = v.date;
                    weekObj.weekNm = weekNm;
                    weekObj.dpid = d_parent;
                    weekObj.hed_id = hed_id;
                    weekObj.sh_data_ids = schedules_ids.concat(doctoragendas_ids);
                    tmpd.push(v.date);
                    wcol_week_obj.add(v.date, weekObj)
                });
            $(".w_col_h").each(function(index, element) {
                if ($(this).attr("class").indexOf("frt") > -1 || $(this).attr("class").indexOf("lst") > -1) {} else {
                    var tmpDate = $(this).attr("data-val").replace(/\//g, "-");
                    var weekNm = new Date(tmpDate).getDay();
                    if ($.inArray(tmpDate, tmpd) == -1) {
                        var weekObj = {};
                        weekObj.date = tmpDate;
                        weekObj.weekNm = weekNm;
                        weekObj.dpid = "wcol_" + week_en[weekNm];
                        weekObj.hed_id = "hwcol_" + week_en[weekNm];
                        weekObj.sh_data_ids = [];
                        wcol_week_obj.add(tmpDate, weekObj)
                    }
                }
            });
            $("#week_conc   .block").remove();
            for (var i = 0,
                    len = wcol_week_obj.getSize(); i < len; i++) {
                var p = wcol_week_obj.getValue(wcol_week_obj.getKeys()[i]);
                gen_dblock_by_week(p, week_en[i])
            }
            update_wekblk_cnt([])
        }

        function gen_dblock_by_week(arr, id) {
            if (arr == null) {
                return
            }
            if (arr.sh_data_ids.length == 1 && arr.sh_data_ids[0].id == id) {
                return
            }
            $("#wcol_" + id + " .block").remove();
            for (var i = 0,
                    len = arr.sh_data_ids.sort(by("row")).length; i < len; i++) {
                var p_obj = wcol_data_arr.getValue(arr.sh_data_ids[i].id);
                $("#" + arr.dpid).append(genInsetBlk(p_obj, "week"));
                genDataBlockPos(arr.dpid, p_obj.id, "week")
            }
            $("#wcol_" + id + "  .col_paiban").remove();
            $("#wcol_" + id).append("<div class='pb_top col_paiban'></div><div class='pb_fot col_paiban'></div>")
        }

        function gen_table_month(st) {
            var GetDateStr = function(date, AddDayCount) {
                var dd = new Date(date);
                dd.setDate(dd.getDate() + AddDayCount);
                return dd
            };
            var getWeek = function(date) {
                var nD = new Date(date);
                return nD.getDay() > 0 ? nD.getDay() : 7
            };
            var getMonthLast = function(y, m) {
                var date = new Date(y + "/" + parseInt(m + 1) + "/01"),
                    currentMonth = date.getMonth(),
                    nextMonth = ++currentMonth,
                    nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
                return new Date(nextMonthFirstDay)
            };
            var GenDates = function(yy, mm) {
                var curYear = yy != "" ? yy : parseInt(sch_today.getFullYear());
                var curMonth = mm !== "" ? mm : parseInt(sch_today.getMonth());

                var FirstDate = curYear + "/" + parseInt(curMonth + 1) + "/01",
                    f_date_obj = new Date(FirstDate),
                    e_date_obj = getMonthLast(curYear, curMonth),
                    curWeek = getWeek(FirstDate),
                    t_obj = $("#tb_month"),
                    t_obj_body = t_obj.children("tbody"),
                    startDay = GetDateStr(FirstDate, -curWeek + 1),
                    posDate = new Date(),
                    curDay = startDay,
                    // outHt = $("#schRightScrollDiv").height() - 96;
                    outHt = $(window).height() - $("#" + Ownerid).offset().top - 86
                    // alert('outHt=' + outHt)
                if (Math.abs(-curWeek + 1) >= 5) {
                    $("#tb_month_lst").show();
                    $("#tb_month tbody tr").height(outHt / 6);
                    $("#tb_month tbody td .q").height(outHt / 6)
                } else {
                    $("#tb_month_lst").hide();
                    $("#tb_month tbody tr").height(outHt / 5);
                    $("#tb_month tbody td .q").height(outHt / 5)
                }

                t_obj_body.find("td").each(function(k, v) {
                    $(v).removeClass('plus_td_is_today').removeClass('sel');
                    // console.log(curDay.toLocaleString());
                    curDay.getDate() == 1 && posDate.getMonth() != curDay.getMonth() ? $(v).addClass('sel') : '';
                    //var nl_info = yayigj_lunar(new Date(curDay.getFullYear(), curDay.getMonth() + 1, curDay.getDate()));
                    var nl_info = yayigj_lunar(curDay),
                        LunarDay = nl_info.lDate,
                        fes = nl_info.festival();
                    if (nl_info.term) { LunarDay = '<span style="color:#83a3ed" title="' + nl_info.term + '">' + nl_info.term + '</span>'; }
                    if (fes && fes.length > 0) { LunarDay = '<span style="color:#47a6a0"  title="' + $.trim(fes[0].desc) + '">' + $.trim(fes[0].desc) + '</span>'; }
                    if (curDay < f_date_obj || curDay >= e_date_obj) {
                        $(v).addClass("invalid");
                        $(v).children(".q").html("<em>" + curDay.getDate() + "<b>" + LunarDay + "</b></em>")
                    } else {
                        if (nl_info.lDate == "初一") {
                            nl_info.lDate = '<span class="_mth">' + nl_info.lMonth + "</span>"
                        }
                        $(v).attr("data-ymd", date_format(curDay).split(" ")[0]);
                        if (date_format(curDay).split(" ")[0] == date_format(new Date()).split(" ")[0]) {
                            $(v).addClass('plus_td_is_today');
                            $(v).children(".q").html("<i class='tdhd'><h6>" + curDay.getDate() + "</h6><b>" + LunarDay + "</b><u></u></i>")
                        } else {
                            if (date_format(posDate).split(" ")[0] == date_format(curDay).split(" ")[0]) {
                                $(v).children(".q").html("<i class='plus_td_is_down  tdhd'><h6>" + curDay.getDate() + "</h6><b>" + LunarDay + "</b><u></u></i>")
                            } else {
                                if (ops._disbGtToday != null && curDay > today || ops._disbLtToday != null && curDay < today) {
                                    $(v).children(".q").html("<span class='tdhd'><h6>" + curDay.getDate() + "</h6><b>" + LunarDay + "</b><u></u></span>")
                                } else {
                                    $(v).children(".q").html("<i class='tdhd'><h6>" + curDay.getDate() + "</h6><b>" + LunarDay + "</b><u></u></i>")
                                }
                            }
                        }
                    }
                    curDay.setDate(curDay.getDate() + 1)
                })
            };
            $("#tb_month .invalid").removeClass("invalid").children(".q").empty();
            if (typeof(st) == "undefined") {
                GenDates(new Date().getFullYear(), new Date().getMonth())
            } else {
                var nt = new Date(st);
                GenDates(nt.getFullYear(), nt.getMonth())
            }
        }

        function gen_dblock_by_month(jsonobj, st) {
            mcol_data_arr.clear();
            gen_table_month(st);
            if (jsonobj == null) {
                return
            }
            var _uuid = uuid(8, 16);
            $.each(jsonobj.list,
                function(k, v) {
                    var cnt_u_obj = $("#tb_month tbody td[data-ymd='" + v.date.replace(/-/g, "/") + "']  .q i u");
                    //console.log('v.count=',v.count);
                    v.count != "" ? cnt_u_obj.text('[' + v.count + ']').show() : cnt_u_obj.hide();
                    if (v.doctoragenda != null && v.doctoragenda.length > 0) {
                        $.each(v.doctoragenda,
                            function(kk, _v) {
                                addToArgbkTable(_v, _uuid, "month");
                                var id = _v.agendaidentity == "" ? _uuid : _v.agendaidentity
                            })
                    }
                    if (v.schedule != null && v.schedule.length > 0) {
                        $.each(v.schedule,
                            function(kk, vv) {
                                addToDBlockTable(vv, "month")
                            })
                    }
                });
            var mon_keys = mcol_data_arr.getKeys();
            for (var i = 0,
                    len = mcol_data_arr.getSize(); i < len; i++) {
                var p_obj = mcol_data_arr.getValue(mon_keys[i]);
                var _dt = p_obj.scheduledate.replace(/-/g, "/");
                var _colr_ico = ico_colors[p_obj.status];
                var dobj = $('<div class="mblock" data-id="' + p_obj.dataid + '" data-docid="' + p_obj.doctorid + '"  id="' + p_obj.id + '" style="background-color:' + _colr_ico.bcolr + ";border-color:" + _colr_ico.bcolr + ';left:1px;">' + '<span class="mstatus"></span>' + '<span class="mblock_text"><i class="nm"><span>' + p_obj.custName + ":" + p_obj.items + "</span></i></span>" + "</div>");
                $("#tb_month tbody td[data-ymd='" + _dt + "']").children(".q").append(dobj)
            }
            $("#tb_month .invalid .mblock").remove()
        }

        function showWekDataObj() {}

        function getSchInfoByID(id) {
            p = col_data_arr.getValue(id);
            if (p == null) {
                p = wcol_data_arr.getValue(id)
            }
            return p
        }

        function setOutsideDay(dt) {
            outsideDay = dt
        }

        function schChangeSet(period, scale) {
            var vkd = scale == 4 ? 15 : 30;
            setBussinesstime(period, scale);
            gen_datalist_blocks(0)
        }

        function schViewResize(param) {
            // console.log('param=', param);
            var _rw = $("#" + Ownerid).width(); //外部宽度
            var dataBlockUpdate = function(obj) {
                var _myOldW = obj.width(),
                    _myOldLeft = obj.offset().left,
                    _myOldPatW = obj.parent().width(),
                    _myOldPatLeft = obj.parent().offset().left,
                    _myIndex = Math.round((_myOldLeft - _myOldPatLeft) / _myOldW),
                    _hCount = Math.round(_myOldPatW / _myOldW),
                    _myNewW = (_rw - 109) / 7 / _hCount,
                    _diff = (_myNewW - _myOldW) / _hCount,
                    _myNewLeft = _myNewW * _myIndex;
                _myIndex == 0 ? _myNewLeft = 1 : '';
                // console.log('序号:', _myIndex, '均差:', _diff, '旧宽:', _myOldW, '新宽:', _myNewW, '数量:', _hCount, '左坐标:', _myNewLeft);
                obj.css({ "left": _myNewLeft }).outerWidth(_myNewW - 2);
            }
            var cal_day_view = function() {
                console.log('param=', param);
                calc_fit_colw(param);
                initTable();
                gen_datalist_blocks(0);
            };
            var cal_week_view = function() {
                $("#week_panel").css("visibility", "hidden");
                var _oldw = w_col_width; //旧周列宽					
                w_col_width = (_rw - 109) / 7 - 4;
                $("#focus_add_wek").width(w_col_width);
                $("#week_panel .w_col_h").width((_rw - 109) / 7);
                $("#week_panel .w_col").width((_rw - 109) / 7);
                $("#week_panel .block").each(function(index, element) {
                    dataBlockUpdate($(element));
                });
                //window.setTimeout(function(){
                $("#week_panel").css("visibility", "visible");
                //},500);
            };
            switch (cur_view_to) {
                case 'd':
                    //cal_week_view();	
                    cal_day_view();
                    break;
                case 'w':
                    cal_week_view();
                    //cal_day_view();	
                    break;
            }
            //处理天视图
            //calc_fit_colw();
        }

        var api = {
            initparams: init_params,
            genTable: initTable,
            genTVscale: genTimeVline,
            genDoctorList: gen_doctor_list,
            genScale: set_scale,
            setBusstime: setBussinesstime,
            callGenData: callGenData,
            swap_panel: swap_panel,
            getSchInfoByID: getSchInfoByID,
            weekInitHead: weekInitHead,
            genDataWeek: genDataFromWeek,
            genDataMonthk: gen_dblock_by_month,
            setScheCurDay: setOutsideDay,
            showWekDataObj: showWekDataObj,
            changeSet: schChangeSet,
            viewResize: schViewResize
        };
        return api
    };
    $.fn.yayigj_schedule = function(options, callback) {
        $.fn.yayigj_schedule.defaultOptions = {
            callbackAddDay: null,
            callbackAddWek: null
        };
        var ops = $.extend(true, {},
            $.fn.yayigj_schedule.defaultOptions, options);
        var that = $(this),
            api;
        var api = $.callFeaturesApi(that, ops);
        api.initparams();
        $(window).resize(function() {});
        return this.each(function() {
            if ($.isFunction(callback)) {
                callback(api)
            }
        })
    }
})(jQuery);