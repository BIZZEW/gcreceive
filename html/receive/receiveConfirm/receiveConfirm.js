/*by zhuhy*/
summerready = function () {
    initPage();
}
//判断是否存在json的key
function objIsEmpty(obj) {
    if (obj != undefined && obj != null && obj != "") {
        return false;
    } else {
        return true;
    }
};
//判断是否为空
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "" || obj.trim() == "") {
        return true;
    } else {
        return false;
    }
}

var vue = null;

function initPage() {
    vue = new Vue({
        el: '#index',
        data: {
            loginIP: summer.getStorage('loginIP'),

            nfcStatus: 0,
            nfcShow: 0,
            inputStatus: 0,
            dept: summer.pageParam.dept,
            module_id: summer.pageParam.module_id,
            module_title: summer.pageParam.module_title,
            usercode: summer.getStorage('usrcode'),

            cardNum: "",
            plateNum: "",
            pkPoundbill: "",
            vbillcode: "",
            grossWeight: "",
            materialName: "",
            supplierName: "",
            transporterName: "",
            auditorName: "",
            auditionTime: "",
            auditionComment: "",
            deduction: "",
            supplierNetWeight: "",
            auditorCode: "",

            nfcReading: "请在确保本设备支持且开启NFC功能的情况下将卡片置于设备读卡区域。"
        },
        methods: {
            // 返回
            goback: function () {
                roads.closeWin();
            },
            // getPlateNum: function () {
            //     var param = {
            //         "cardNo": vue.cardNum
            //     }
            //     var url = vue.loginIP + "/uapws/service/nc.itf.web.service.ILEQueryWebSerivce/querySerivcegetCarNO";
            //     var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ileq='http://service.web.itf.nc/ILEQueryWebSerivce'><soapenv:Header/><soapenv:Body><ileq:querySerivce><typecode>LE07</typecode><json>" + JSON.stringify(param) + "</json></ileq:querySerivce></soapenv:Body></soapenv:Envelope>";
            //     roads.ajaxKernel(url, soapXML, 60000, "POST", function (data) {
            //         var result = JSON.parse($(data).find("return").html());
            //         if (result.success == "success") {
            //             vue.plateNum = (JSON.parse(result.detailMsg)).vehicle;
            //             if (!vue.plateNum)
            //                 roads.toastAIO("第一次入场，请输入车牌号。", 1500, 1);
            //         } else
            //             roads.toastAIO(result.message, 3000, 1);
            //     }, function (data) {
            //         roads.toastAIO("提交失败！", 3000, 1);
            //     });
            // },
            getPoundbyPlateNum: function () {
                var param = {
                    "carno": vue.plateNum,
                    "usercode": vue.usercode
                };
                // alert(JSON.stringify(param));
                var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:getPoundbillbyCarNo><string>" + JSON.stringify(param) + "</string></ipur:getPoundbillbyCarNo></soapenv:Body></soapenv:Envelope>";
                roads.oldSkoolAjax(vue.loginIP + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/getPoundbillbyCarNo", soapXML, function (data) {
                    var result = JSON.parse($(data).find("return").html());
                    switch (result.status) {
                        case -1:
                            roads.alertAIO(result.message);
                            break;
                        case 0:
                            roads.alertAIO(result.message);
                            break;
                        case 1:
                            var parsedData = JSON.parse(result.data);

                            vue.pkPoundbill = parsedData.pk_poundbill;
                            vue.vbillcode = parsedData.vbillcode;
                            vue.grossWeight = parsedData.ngross;
                            vue.materialName = parsedData.materialname;
                            vue.supplierName = parsedData.suppliername;
                            vue.transporterName = parsedData.trname;
                            vue.auditorName = parsedData.ysrname;
                            vue.auditionTime = parsedData.ysdate;
                            vue.auditionComment = parsedData.ysyj;
                            vue.deduction = parsedData.nabatebright;
                            vue.supplierNetWeight = parsedData.gfjz;
                            vue.auditor = parsedData.usercode;
                            break;
                        case 2:
                            roads.alertAIO(result.message);
                            break;
                        default:
                            break;
                    }
                });
            },
            getPoundbyCardNum: function () {
                var param = {
                    "cardid": vue.cardNum,
                    "usercode": vue.usercode
                };
                // alert(JSON.stringify(param));
                // alert(vue.loginIP);
                var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:getPoundbillbyCardId><string>" + JSON.stringify(param) + "</string></ipur:getPoundbillbyCardId></soapenv:Body></soapenv:Envelope>";
                roads.oldSkoolAjax(vue.loginIP + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/getPoundbillbyCardId", soapXML, function (data) {
                    var result = JSON.parse($(data).find("return").html());
                    // alert($(data).find("return").html());
                    switch (parseInt(result.status)) {
                        case -1:
                            roads.alertAIO(result.message);
                            break;
                        case 0:
                            roads.alertAIO(result.message);
                            break;
                        case 1:
                            var parsedData = JSON.parse(result.data);

                            // alert(result.data);

                            vue.plateNum = parsedData.vvehicle;
                            vue.pkPoundbill = parsedData.pk_poundbill;
                            vue.vbillcode = parsedData.vbillcode;
                            vue.grossWeight = parsedData.ngross;
                            vue.materialName = parsedData.materialname;
                            vue.supplierName = parsedData.suppliername;
                            vue.transporterName = parsedData.trname;
                            vue.auditorName = parsedData.ysrname;
                            vue.auditionTime = parsedData.ysdate;
                            vue.auditionComment = parsedData.ysyj;
                            vue.deduction = parsedData.nabatebright;
                            vue.supplierNetWeight = parsedData.gfjz;
                            vue.auditor = parsedData.usercode;
                            break;
                        case 2:
                            roads.alertAIO(result.message);
                            break;
                        default:
                            break;
                    }
                });
            },
            letsRead: function () {
                vue.initNFC();
                this.nfcShow = 1;
            },
            nfcConfirm: function () {
                this.nfcShow = 0;
                this.nfcReading = "请在确保本设备支持且开启NFC功能的情况下将卡片置于设备读卡区域。";
                if (vue.cardNum.trim())
                    vue.getPoundbyCardNum();
            },
            selectOrder: function () {
                var tmp = "procureQuery";
                roads.openWin(this.dept, tmp, vue.module_id + "/" + tmp + "/" + tmp + ".html", { plateNum: vue.plateNum });
            },
            backfrOrderSelection: function (params) {
                // alert("triggered!" + (params));
                this.planOrder = eval(params)["planOrder"];
                // this.supplier = eval(params)["supplier"];
                this.solidMaterialType = eval(params)["material"];
                this.pk_meamapply = eval(params)["pk_meamapply"];
            },
            initNFC: function () {
                if (!this.nfcStatus) {
                    //获取NFC权限
                    var params = ["android.permission.NFC"];
                    summer.getPermission(params, function (args) {
                        //开启NFC
                        summer.callService("SummerNFC.openNFC", //原生服务（类名+方法名）
                            {
                                "callback": "callbackNFC()",
                                "title": "请读卡"
                            }, false //异步（true 同步）
                        );
                        vue.nfcStatus = 1;
                    }, function (args) {
                        // roads.speech("notSupportNFC");
                        vue.nfcReading = "本设备不支持或未开启NFC读卡功能。";
                        // roads.toastAIO("本设备不支持或未开启NFC读卡功能。", 1500, 1);
                    })
                }
            },
            // 提交表单
            submitForm: function () {
                // alert(this.sampleNo);
                her.loadingSpring("请稍候..");
                vue.uploadRecords();
            },
            uploadRecords: function () {
                if (vue.pkPoundbill == "") {
                    her.loadedSpring();
                    roads.alertAIO("请先获取磅单再提交！");
                    return;
                }
                // if ((vue.driver == "") || (vue.plateNum == "") || (vue.planOrder == "") || (vue.pk_user == "") || (vue.pk_meamapply == "")) {
                //     her.loaded();
                //     roads.toastAIO("请先完整填选所有的字段再提交！", 3000, 1);
                // } 
                else {
                    var param = {
                        "pk_poundbill": vue.pkPoundbill,
                        "usercode": vue.usercode,
                        "ysyj": vue.auditionComment,
                        "gfjz": vue.supplierNetWeight,
                        "nabatebright": vue.deduction
                    };

                    var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:updatePoundbill><string>" + JSON.stringify(param) + "</string></ipur:updatePoundbill></soapenv:Body></soapenv:Envelope>";
                    roads.oldSkoolAjax(vue.loginIP + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/updatePoundbill", soapXML, function (data) {
                        var result = JSON.parse($(data).find("return").html());
                        switch (parseInt(result.status)) {
                            case -1:
                                roads.alertAIO(result.message);
                                break;
                            case 0:
                                roads.alertAIO(result.message);
                                break;
                            case 1:
                                summer.closeWin();
                                roads.execScript("menu", "vue.formSubmitted", {
                                    // "item_name": vue.item_name
                                });
                                break;
                            case 2:
                                roads.alertAIO(result.message);
                                break;
                            default:
                                break;
                        }
                    });
                }
            },
        },
        mounted: function () {
            // 加载数据...
            this.$nextTick(function () {
                //监听返回按钮
                document.addEventListener("backbutton", this.goback, false);
            })
        }
    })
}

function callbackNFC(nfcEvent) {
    vue.nfcStatus = 0;
    if (!isEmpty(nfcEvent.errormsg)) {
        var t = setTimeout(function () {
            if (vue.nfcShow == 1)
                vue.initNFC();
        }, 3000);
    } else {
        // roads.speech("cardRead");
        // roads.vibrator(500);
        vue.cardNum = nfcEvent.cardinfo;
        vue.nfcReading = "读取到卡号： " + nfcEvent.cardinfo;
    }
}