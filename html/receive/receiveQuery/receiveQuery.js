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
};

var vue = null;

function initPage() {
    vue = new Vue({
        el: '#index',
        data: {
            loginIP: summer.getStorage('loginIP'),

            // baseUrl: summer.getStorage('loginIP') + "/uapws/service/nc.itf.app.webservice.AppWebService/",
            // baseUrlSale: summer.getStorage('loginIP') + "/uapws/service/nc.itf.app.webservice.AppDeliveryQueryService/",
            // baseUrlSaleIdol: "http://192.168.13.248:8888/uapws/service/nc.itf.app.webservice.AppDeliveryQueryService/",
            //baseUrlSale : "http://172.16.14.232:80/uapws/service/nc.itf.app.webservice.AppDeliveryQueryService/",
            dept: summer.pageParam.dept,
            module_id: summer.pageParam.module_id,
            module_title: summer.pageParam.module_title,
            record_id: parseInt(summer.pageParam.record_id),
            popupVisible: false,
            tt: "3456",
            /*receiveQuery*/
            //起始日期
            beginDate: new Date().format("yyyy-MM-dd"),
            beignDatePickerValue: new Date(),
            //结束日期
            stopDate: new Date().format("yyyy-MM-dd"),
            stopDatePickerValue: new Date(),

            logList: [],
            // logList: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}],

            //分页使用
            isLoading: false,
            //条目高度值
            threshold: null,
            //当前请求数据页码
            currentPage: 0,
            //控制是否加载更多
            endFlag: false,
            //控制加载文字
            loadText: "正在加载更多",
            //控制旋转
            spinning: false,

            usercode: summer.getStorage('usrcode'),
        },
        methods: {
            onScroll: function (evt) {
                console.log("scrollingnew");
                var box = document.getElementsByClassName("ultra-list-item");
                vue.threshold = box[0].clientHeight;
                const el = evt.target;
                const height = el.scrollHeight - el.offsetHeight;
                const scroll = el.scrollTop;
                const distance = height - scroll;
                const needLoad = distance < vue.threshold;
                if (needLoad && !vue.isLoading && vue.endFlag)
                    vue.loadMore();
            },
            onValueChange: function (picker, value) { },
            // 打开日期picker 视图
            open: function (picker) {
                this.$refs[picker].open();
            },
            handleDateConfirm: function (tag, value) {
                //console.log(tag);
                tag == "begin" ? this.beginDate = value.format("yyyy-MM-dd") : this.stopDate = value.format("yyyy-MM-dd");
            },
            reset: function () {
                this.beginDate = new Date().format("yyyy-MM-dd");
                this.stopDate = new Date().format("yyyy-MM-dd");
                this.logList = [];
                this.currentPage = 0;
            },
            query: function () {
                if ((vue.beginDate == "") || (vue.stopDate == "")) {
                    her.loaded();
                    roads.toastAIO("请先完整填选所有的字段再提交！", 3000, 1);
                } else {
                    var param = {
                        "usercode": vue.usercode,
                        "begindate": vue.beginDate + " 00:00:00",
                        "enddate": vue.stopDate + " 23:59:59",
                        "currentPage": vue.currentPage
                    };

                    // alert(JSON.stringify(data));

                    var url = vue.loginIP + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/getpoundbillinfo";
                    var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:getpoundbillinfo><string>" + JSON.stringify(param) + "</string></ipur:getpoundbillinfo></soapenv:Body></soapenv:Envelope>";

                    roads.oldSkoolAjax(url, soapXML, function (data) {
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
                                vue.logList = parsedData;
                                vue.endFlag = result.endFlag;
                                break;
                            case 2:
                                roads.alertAIO(result.message);
                                break;
                            default:
                                break;
                        }
                    });
                }
                // this.logList = [{ pond_id: "1", plate_num: "11", solid_material_type: "物料品种3物料品种3alum物料品种3物料品种3alum物料品种3物料品种3alum" }, { pond_id: "2", plate_num: "22", solid_material_type: "222" }, { pond_id: "3", plate_num: "33", solid_material_type: "333" }, { pond_id: "4", plate_num: "44", solid_material_type: "444" }, { pond_id: "5", plate_num: "55", solid_material_type: "555" }];
                // this.currentPage = 0;
                // var param = {
                //     // "user": vue.usrcode,
                //     "startDate": vue.beginDate,
                //     "endDate": vue.stopDate,
                //     "currentPage": vue.currentPage
                // };
                // //alert(JSON.stringify(param));
                // var testSoapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:app='http://webservice.app.itf.nc/AppDeliveryQueryService'><soapenv:Header/><soapenv:Body><app:getDeliveryInfo><string>" + JSON.stringify(param) + "</string></app:getDeliveryInfo></soapenv:Body></soapenv:Envelope>";
                // var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:app='http://webservice.app.itf.nc/AppDeliveryQueryService'><soapenv:Header/><soapenv:Body><app:getDeliveryInfo><param>" + JSON.stringify(param) + "</param></app:getDeliveryInfo></soapenv:Body></soapenv:Envelope>";
                // roads.oldSkoolAjax(vue.baseUrlSale + "getDeliveryInfo", testSoapXML, function(data) {
                //     var result = JSON.parse($(data).find("return").html());
                //     //alert($(data).find("return").html());
                //     switch (result.status) {
                //         case -1:
                //             roads.alertAIO(7);
                //             vue.logList = [];
                //             break;
                //         case 0:
                //             roads.alertAIO(0);
                //             break;
                //         case 1:
                //             vue.endFlag = result.endFlag;
                //             vue.bulkMeasTmp = vue.bulkMeas;
                //             vue.logList = JSON.parse(result.data);
                //             vue.orderAmount = JSON.parse(result.countNum).billNum;
                //             if (vue.bulkMeas) {
                //                 //alert("inside here");
                //                 vue.ovnetWeight = (JSON.parse(result.countNum)).countWeight;
                //                 //alert(JSON.parse(result.countNum));
                //                 try {
                //                     vue.productLineList = JSON.parse(result.proline);
                //                 } catch (e) {
                //                     //alert(e);
                //                 }
                //                 //alert(vue.ovnetWeight);
                //             } else
                //                 vue.withholdAmount = JSON.parse(result.countNum).countHoldnum;
                //             break;
                //         default:
                //             break;
                //     }
                // });
            },
            goDetail: function (index) {
                var item = this.logList[index];
                var tmp = "receiveQueryDetail";
                console.log(vue.module_id + "/" + tmp + "/" + tmp + ".html");
                roads.openWin(this.dept, tmp, vue.module_id + "/" + tmp + "/" + tmp + ".html", {
                    "pondId": item.vbillcode,
                    // "driver": item.driver,
                    // "plateNum": item.vvehicle,
                    // "solidMaterialType": item.materialname,
                    // "grossWeight": item.ngross,
                    // "tareWeight": item.ntare,
                    // "neatWeight": item.nnet,
                    // "grossWeightTime": item.dgrosstime,
                    // "tareWeightTime": item.dtaretime,


                    "module_id": vue.module_id,
                    "dept": vue.dept,
                    "flag": 0,
                    "itemContent": JSON.stringify(item)
                });
            },
            // 返回
            goback: function () {
                //vue.bulkMeasTmp = 1;
                roads.closeWin();
            },
            loadMore: function () {
                if (!vue.spinning) {
                    vue.isLoading = true;
                    vue.spinning = true;
                    vue.loadText = "正在加载更多";
                    // var param = {
                    //     // "user": vue.usrcode,
                    //     "startDate": vue.beginDate,
                    //     "endDate": vue.stopDate,
                    //     "currentPage": (vue.currentPage + 1)
                    // };
                    var param = {
                        "usercode": vue.usercode,
                        "begindate": vue.beginDate + " 00:00:00",
                        "enddate": vue.stopDate + " 23:59:59",
                        "currentPage": (vue.currentPage + 1)
                    };
                    var url = vue.loginIP + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/getpoundbillinfo";
                    var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:getpoundbillinfo><string>" + JSON.stringify(param) + "</string></ipur:getpoundbillinfo></soapenv:Body></soapenv:Envelope>";
                    $.ajax({
                        url: url,
                        type: "POST",
                        dataType: "xml",
                        contentType: "text/xml; charset=utf-8",
                        data: soapXML,
                        async: true,
                        timeout: 5000,
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("User-Agent", "headertest");
                        },
                        success: function (data) {
                            var result = JSON.parse($(data).find("return").html());
                            switch (result.status) {
                                case -1:
                                    vue.loadText = "加载失败，点击重试";
                                    break;
                                case 1:
                                    //接收是否还可以加载更多的标识
                                    vue.endFlag = result.endFlag;
                                    //接收新的一页数据
                                    var moreList = JSON.parse(result.data);
                                    //插入数据
                                    for (var i = 0; i < moreList.length; i++)
                                        vue.logList.push(moreList[i]);
                                    //当前请求数据页码自增
                                    vue.currentPage++;
                                    //加载部件隐藏
                                    vue.isLoading = false;
                                    break;
                                default:
                                    break;
                            }
                        },
                        error: function (err) {
                            vue.loadText = "加载失败，点击重试";
                        },
                        complete: function (XMLHttpRequest, status) {
                            //停止旋转
                            vue.spinning = false;
                        }
                    });
                }
            }
        },
        watch: {},
        mounted: function () {
            // 加载数据...
            this.$nextTick(function () {
                //监听返回按钮
                document.addEventListener("backbutton", this.goback, false);

                var topBar = document.getElementsByClassName("um-header")[0];
                var queryKit = document.getElementsByClassName("query-kit")[0];
                var ultraScrollList = document.getElementsByClassName("ultra-scroll-list")[0];

                const windowHeight = document.body.clientHeight;
                const topBarHeight = 44;
                const queryKitHeight = 185;
                var tmpHeight = windowHeight - topBarHeight - queryKitHeight;
                ultraScrollList.style.height = tmpHeight + "px";
            })
        }
    });
};