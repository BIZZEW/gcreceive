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
            refundStatus: "",

            containerNo: "",

            nfcReading: "请在确保本设备支持且开启NFC功能的情况下将卡片置于设备读卡区域。",


            popupVisibleCon: false,
            ordername: null,
            cons: [{
                values: [
                    { name: "水分", },
                    { name: "杂质", },
                    { name: "含泥量高", },
                    { name: "其它", },
                ]
            }],

            // 图片上传
            picNum: 0,
            picPaths: [],

            // 上传相关标志
            sendCount: -1,
            sendFlag: 0,
            fd: new FormData(),
            prefix: "",
        },
        methods: {
            // 返回
            goback: function () {
                roads.closeWin();
            },
            onValuesChange(picker, values) {
            },
            //前往图片总览页
            goPicCollection: function () {
                $("#goPicCollection").addClass("unclickable");

                roads.openWin("util", "picCollection", "picCollection/picCollection.html", {
                    ownerTag: 0,
                    picPaths: this.picPaths,
                    amountLimit: 1,
                    module_id: this.module_id,
                    module_title: this.module_title,
                    // record_id: this.record_id,
                    win_id: vue.module_id
                });
            },
            clickable: function () {
                $("#goPicCollection").removeClass("unclickable");
            },
            //从图片收集页返回
            backfrCollection: function (jsonStr) {
                this.clickable();

                this.picPaths = jsonStr["picPaths"];
                this.picNum = jsonStr["picPaths"].length;
                vue.sendCount = -1;
                $(".itemPic").empty();
            },
            confirmChangeCon: function () {
                this.auditionComment = this.$refs.conPicker.getValues()[0].name;
                this.popupVisibleCon = false;
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
                            vue.refundStatus = parsedData.refundStatus;

                            vue.containerNo = parsedData.containerno;
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

                            vue.containerNo = parsedData.containerno;
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
                vue.uploadRecords('N');
            },
            // 退货
            refund: function () {
                // alert(this.sampleNo);
                UM.confirm({
                    title: "提示",
                    text: "确认退货？",
                    btnText: "确认",
                    btnText: ["取消", "确认"],
                    overlay: true,
                    duration: 2000,
                    cancle: function () {
                    },
                    ok: function () {
                        her.loadingSpring("请稍候..");
                        vue.uploadRecords('Y');
                    }
                });
            },
            uploadRecords: function (returnFlag) {
                if (vue.pkPoundbill == "") {
                    her.loadedSpring();
                    roads.alertAIO("请先获取磅单再提交或退货！");
                    return;
                }
                // // if ((vue.driver == "") || (vue.plateNum == "") || (vue.planOrder == "") || (vue.pk_user == "") || (vue.pk_meamapply == "")) {
                // //     her.loaded();
                // //     roads.toastAIO("请先完整填选所有的字段再提交！", 3000, 1);
                // // } 
                else if (!summer.netAvailable()) {
                    // 判断网络
                    her.loadedSpring();
                    roads.alertAIO("网络异常，请检查网络！");
                    return false;
                } else {
                    vue.fd.append("pk_poundbill", vue.pkPoundbill);
                    vue.fd.append("usercode", vue.usercode);
                    vue.fd.append("ysyj", vue.auditionComment);
                    vue.fd.append("gfjz", vue.supplierNetWeight);
                    vue.fd.append("nabatebright", vue.deduction);
                    vue.fd.append("containerno", vue.containerNo);
                    vue.fd.append("isReturnGoods", returnFlag);

                    vue.uploadKernal();
                }
            },
            uploadKernal: function () {
                vue.sendFlag = 1;
                vue.sendCount = 0;

                if (vue.picPaths && vue.picPaths.length && vue.picPaths.length > 0) {
                    $.each(vue.picPaths, function (i, obj) {
                        var img = new Image();
                        img.pid = i;
                        img.src = obj.path;
                        img.onload = loadImage(img);
                    })
                }
            },
            // uploadRecords: function (returnFlag) {
            //     if (vue.pkPoundbill == "") {
            //         her.loadedSpring();
            //         roads.alertAIO("请先获取磅单再提交或退货！");
            //         return;
            //     }
            //     // if ((vue.driver == "") || (vue.plateNum == "") || (vue.planOrder == "") || (vue.pk_user == "") || (vue.pk_meamapply == "")) {
            //     //     her.loaded();
            //     //     roads.toastAIO("请先完整填选所有的字段再提交！", 3000, 1);
            //     // } 
            //     else {
            //         var param = {
            //             "pk_poundbill": vue.pkPoundbill,
            //             "usercode": vue.usercode,
            //             "ysyj": vue.auditionComment,
            //             "gfjz": vue.supplierNetWeight,
            //             "nabatebright": vue.deduction,
            //             "containerno": vue.containerNo,
            //             "isReturnGoods": returnFlag,
            //         };

            //         var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:updatePoundbill><string>" + JSON.stringify(param) + "</string></ipur:updatePoundbill></soapenv:Body></soapenv:Envelope>";
            //         roads.oldSkoolAjax(vue.loginIP + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/updatePoundbill", soapXML, function (data) {
            //             var result = JSON.parse($(data).find("return").html());
            //             switch (parseInt(result.status)) {
            //                 case -1:
            //                     roads.alertAIO(result.message);
            //                     break;
            //                 case 0:
            //                     roads.alertAIO(result.message);
            //                     break;
            //                 case 1:
            //                     summer.closeWin();
            //                     roads.execScript("menu", "vue.formSubmitted", {
            //                         // "item_name": vue.item_name
            //                     });
            //                     break;
            //                 case 2:
            //                     roads.alertAIO(result.message);
            //                     break;
            //                 default:
            //                     break;
            //             }
            //         });
            //     }
            // },
        },
        watch: {
            sendCount: function (val) {
                if (val == vue.picNum && vue.sendFlag == 1) {
                    vue.sendFlag = 0;
                    var xhr = new XMLHttpRequest();
                    var t1; //用来作超时处理

                    xhr.onreadystatechange = function () {
                        if (xhr.readyState === 4) {
                            if (xhr.status == 200) {
                                try {
                                    if (t1) clearTimeout(t1);
                                    her.loadedSpring();
                                    // 图片上传后重置上传计数器，清空图片上传元素
                                    vue.sendCount = -1;
                                    $(".itemPic").empty();

                                    var responseText = xhr.responseText;
                                    var result = eval("(" + responseText + ")")

                                    if (result.status == 1 || result.status == '1') {
                                        summer.closeWin();
                                        roads.execScript("menu", "vue.formSubmitted", {});
                                    } else
                                        roads.alertAIO("报错信息：" + result.message);
                                } catch (e) {
                                    roads.alertAIO("异常信息：" + JSON.stringify(e));
                                }
                            }
                        }
                    }

                    xhr.open('POST', vue.loginIP + "/jysn/file_up/up", true);

                    t1 = setTimeout(function () {
                        if (xhr) xhr.abort();
                        her.loadedSpring();
                        // 图片上传后重置上传计数器，清空图片上传元素
                        vue.sendCount = -1;
                        $(".itemPic").empty();
                        roads.alertAIO('抱歉，请求超时！');
                    }, 5000);

                    xhr.send(vue.fd);
                }
            }
        },
        mounted: function () {
            // 加载数据...
            this.$nextTick(function () {
                //监听返回按钮
                document.addEventListener("backbutton", this.goback, false);
            })
        }
    })

    var winHeight = $(window).height();
    //获取当前页面高度
    $(window).resize(function () {
        var thisHeight = $(this).height();
        if (winHeight - thisHeight > 50) {
            //当软键盘弹出，在这里面操作
            vue.inputStatus = 1;
        } else {
            //当软键盘收起，在此处操作
            vue.inputStatus = 0;
        }
    });
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

function loadImage(img) {
    try {
        var timer = setInterval(function () {
            if (img.complete) {
                var canvas = document.createElement("canvas"), //创建canvas元素
                    width = img.naturalWidth / 5, //确保canvas的尺寸和图片一样
                    height = img.naturalHeight / 5;
                canvas.width = width;
                canvas.height = height;
                canvas.getContext("2d").drawImage(img, 0, 0, width, height);
                //将图片绘制到canvas中
                var dataURL = canvas.toDataURL('image/jpeg');

                //dataURL 转换为blob
                var arr = dataURL.split(','),
                    mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]),
                    n = bstr.length,
                    u8arr = new Uint8Array(n);

                while (n--) {
                    u8arr[n] = bstr.charCodeAt(n);
                }

                var blob = new Blob([u8arr], {
                    type: mime
                });
                //将生成的blob塞入表单数据
                vue.fd.append(vue.sendCount, blob, vue.sendCount + ".jpg");

                $(img).addClass("thumbnail");

                $(img).appendTo('.itemPic');

                vue.sendCount++;

                clearInterval(timer);
            }
        }, 50)
    } catch (e) {
        alert(e);
    }
};