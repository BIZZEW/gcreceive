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
    if (typeof obj == "undefined" || obj == null || obj == "") {
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
            //0:未登录；2:初始；1:已登录
            loginStatus: 2,
            sessionId: "",
            //1:中文；0:英文
            lang: 1,
            serverShow: false,
            turn: 0,
            serverShow2: false,
            turn2: 0,
            dept: "",
            ip: "",
            usrname: "",
            usrcode: "",
            usrtype: "",
            password: "",
            showPD: false,
            remeberPD: 0,
            //公司选择功能
            coWindowToggle: false,
            //存储的公司信息
            loginCompany: "",
            loginCode: "",
            loginIP: "",
            loginPk: "",

            //选中的公司信息
            // selectStatus: false,
            // selectedName: "",
            // selectedCode: "",
            // selectedIp: "",
            // selectedPk: "",

            //输入的搜索词
            coInput: "",
            // userList: [{ username: "5555" }, { username: "5555" }, { username: "5555" }, { username: "5555" }, { username: "5555" }, ],
            userList: [],
            coList: [],
            availableModules: "",
            // NCIP: ""
        },
        methods: {
            secretDoor: function (target) {
                this.turn++;
                if (this.turn == target) {
                    vue.serverShow = !vue.serverShow;
                }
                var intervalID = setInterval(function () {
                    clearInterval(intervalID);
                    vue.turn = 0;
                }, 3000);
            },
            secretDoor2: function (target) {
                this.turn2++;
                if (this.turn2 == target) {
                    vue.serverShow2 = !vue.serverShow2;
                }
                var intervalID2 = setInterval(function () {
                    clearInterval(intervalID2);
                    vue.turn2 = 0;
                }, 3000);
            },
            //初始化页面
            fillPage: function () {
                // var NCIPTmp = summer.getStorage('NCIP');
                // vue.NCIP = isEmpty(NCIPTmp) ? "http://10.20.20.12:90" : NCIPTmp;

                var langTmp = summer.getStorage('lang');
                vue.lang = isEmpty(langTmp) ? 1 : langTmp;

                var modulesTmp = summer.getStorage('availableModules');
                vue.availableModules = isEmpty(modulesTmp) ? "" : modulesTmp;

                var tmp = summer.getStorage('loginStatus');
                vue.loginStatus = isEmpty(tmp) ? 0 : tmp;

                setTimeout(function () {
                    if (vue.loginStatus == 1 || vue.loginStatus == "1")
                        vue.goMenu("sale");
                }, 1000);

                // 不用选公司
                // var loginCompanyStore = summer.getStorage('loginCompany');
                // var loginCodeStore = summer.getStorage('loginCode');
                var loginIPStore = summer.getStorage('loginIP');
                // var loginPkStore = summer.getStorage('loginPk');
                // if (!isEmpty(loginCompanyStore)) {
                //     this.loginCompany = loginCompanyStore;
                //     this.coInput = loginCompanyStore;
                // }
                // if (!isEmpty(loginCodeStore))
                //     this.loginCode = loginCodeStore;
                if (!isEmpty(loginIPStore))
                    this.loginIP = loginIPStore;
                // if (!isEmpty(loginPkStore))
                //     this.loginPk = loginPkStore;

                var remeberPD = summer.getStorage('remeberPD');
                var usrname = summer.getStorage('usrname');
                var usrcode = summer.getStorage('usrcode');
                var password = summer.getStorage('password');

                if (!isEmpty(remeberPD)) {
                    this.remeberPD = parseInt(remeberPD);
                    if (this.remeberPD) {
                        this.usrname = (!isEmpty(usrname)) ? usrname : "";
                        this.usrcode = (!isEmpty(usrcode)) ? usrcode : "";
                        this.password = (!isEmpty(password)) ? password : "";
                    }
                }
            },
            goMenu: function (tag) {
                roads.openWinSpecial("menu", "menu", "menu.html", {
                    "dept": tag,
                    "usrname": this.usrname,
                    "availableModules": this.availableModules
                });
            },
            userItemClick: function (index) {
                var item = this.userList[index];
                this.usrname = item.username;
                this.usrcode = item.usercode;
                this.usrtype = item.logo;
            },

            /* coInputGetFocus: function() {
                vue.selectStatus = true;
            },
            coItemClick: function(index) {
                var item = this.coList[index];
                vue.selectStatus = false;
                vue.coInput = item.def2;
                vue.selectedName = item.def2;
                vue.selectedCode = item.def1;
                vue.selectedIp = item.def3;
                vue.selectedPk = item.pk_org;
                vue.coList = [];
            },
            coWindowConfirm: function() {
                vue.coWindowToggle = false;
                vue.loginCompany = vue.selectedName;
                vue.loginCode = vue.selectedCode;
                vue.loginIP = vue.selectedIp;
                vue.loginPk = vue.selectedPk;

                summer.setStorage('loginCompany', vue.loginCompany);
                summer.setStorage('loginCode', vue.loginCode);
                summer.setStorage('loginIP', vue.loginIP);
                summer.setStorage('loginPk', vue.loginPk);
            },
            coWindowCancel: function() {
                vue.coWindowToggle = false;
                vue.coInput = vue.loginCompany;
                vue.selectedName = "";
                vue.selectedCode = "";
                vue.selectedIp = "";
                vue.selectedPk = "";
            },
            coInputReset: function() {
                vue.coList = [];
                vue.coInput = "";
                vue.selectedName = "";
                vue.selectedCode = "";
                vue.selectedIp = "";
                vue.selectedPk = "";
                vue.selectStatus = false;
            }, */

            // 提交表单
            login: function () {
                if (!isEmpty(this.usrname) && !isEmpty(this.password)) {
                    //记住密码逻辑
                    summer.setStorage('remeberPD', (this.remeberPD) ? "1" : "0");
                    summer.setStorage('usrname', this.usrname);
                    summer.setStorage('usrcode', this.usrcode);
                    summer.setStorage('password', this.password);
                    summer.setStorage('loginIP', vue.loginIP);

                    var tmpLang = summer.getStorage('lang');
                    var lang = isEmpty(tmpLang) ? "1" : tmpLang;
                    var param = {
                        "lang": lang,
                        "usercode": vue.usrcode,
                        "password": vue.password
                    };
                    // alert(JSON.stringify(param));
                    var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:login><string>" + JSON.stringify(param) + "</string></ipur:login></soapenv:Body></soapenv:Envelope>";
                    roads.oldSkoolAjax(vue.loginIP + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/login", soapXML, function (data) {
                        var result = JSON.parse($(data).find("return").html());
                        switch (result.status) {
                            case -1:
                                roads.alertAIO(result.message);
                                break;
                            case 0:
                                roads.alertAIO(0);
                                break;
                            case 1:
                                roads.vibrator(500);
                                UM.toast({
                                    "title": vue.langFunk("successToastTitle"),
                                    "text": vue.langFunk("loginSucceeded"),
                                    "duration": 1000
                                });
                                //记录登录状态
                                //alert(JSON.stringify(result.permission));
                                // summer.setStorage('availableModules', result.permission);
                                summer.setStorage('sessionId', result.sessionid);
                                summer.setStorage('loginStatus', result.status);
                                // vue.availableModules = result.permission;
                                vue.sessionId = result.sessionid;
                                vue.loginStatus = result.status;
                                break;
                            case 2:
                                roads.alertAIO(vue.langFunk("wrongNameorPwd"));
                                break;
                            default:
                                break;
                        }
                    });
                } else
                    roads.alertAIO(vue.langFunk("emptyNameorPwd"));
            },
            langFunk: function (strTag) {
                return lang.getStr(vue.lang, strTag);
            },
            getUserList: function () {
                // var test = {"message":"\u67e5\u8be2\u6210\u529f","flag":"100","status":"1","data":"[{ \"username\":\"pengming\",\"usercode\":\"pengming\"},{\"username\":\"\u6563\u88c5\u6d4b\u8bd5\u5ba2\u6237\",\"usercode\":\"25400224\"}]"};
                // var userlistraw = test.data;
                // vue.userList = eval(userlistraw);
                // break;


                if (vue.loginIP != "") {
                    var tmpLang = summer.getStorage('lang');
                    var lang = isEmpty(tmpLang) ? "1" : tmpLang;
                    var param = {
                        "lang": lang,
                        "flag": "0"
                    }
                    var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:userList/></soapenv:Body></soapenv:Envelope>";
                    //alert(val + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/userList");
                    roads.oldSkoolAjax(vue.loginIP + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/userList", soapXML, function (data) {
                        var result = JSON.parse($(data).find("return").html());
                        switch (parseInt(result.status)) {
                            case -1:
                                roads.alertAIO(vue.langFunk("noUsr"));
                                vue.userList = [];
                                break;
                            case 1:
                                var userlistraw = result.data;
                                vue.userList = eval(userlistraw);
                                break;
                            case 0:
                                roads.alertAIO(0);
                                vue.userList = [];
                                break;
                            default:
                                break;
                        }
                    });
                }
            }
        },
        watch: {
            // NCIP: function (val) {
            //     summer.setStorage("NCIP", val);
            // },
            // coInput: function(val) {
            //     if (vue.selectStatus) {
            //         var tmpLang = summer.getStorage('lang');
            //         var lang = isEmpty(tmpLang) ? "1" : tmpLang;
            //         var param = {
            //             "lang": lang,
            //             "orgname": val
            //         };
            //         var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:iap='http://service.sd.itf.nc/IAppSDService'><soapenv:Header/><soapenv:Body><iap:getCoList><orgCodeOrName>" + JSON.stringify(param) + "</orgCodeOrName></iap:getCoList></soapenv:Body></soapenv:Envelope>";
            //         $.ajax({
            //             url: vue.NCIP + "/uapws/service/nc.itf.sd.service.IAppSDService/getCoList",
            //             type: "POST",
            //             dataType: "xml",
            //             contentType: "text/xml; charset=utf-8",
            //             data: soapXML,
            //             async: true,
            //             timeout: 5000,
            //             beforeSend: function(xhr) {
            //                 xhr.setRequestHeader("User-Agent", "headertest");
            //             },
            //             success: function(data) {
            //                 var result = JSON.parse($(data).find("return").html());
            //                 switch (result.status) {
            //                     case -1:
            //                         vue.coList = [];
            //                         break;
            //                     case 1:
            //                         vue.coList = eval(result.data);
            //                         break;
            //                     default:
            //                         break;
            //                 }
            //             },
            //             error: function(err) {},
            //             complete: function(XMLHttpRequest, status) {}
            //         });

            //         var el = $('.coList .pulldown-toggle');
            //         if (!el.hasClass('open'))
            //             el.addClass('open');
            //     }
            // },
            lang: function (val) {
                summer.setStorage('lang', val);
            },
            loginStatus: function (val) {
                if (val == 1 || val == "1") {
                    vue.goMenu("sale");
                }
            },
            // loginIP: function (val) {
            //     if (val != "") {
            //         var tmpLang = summer.getStorage('lang');
            //         var lang = isEmpty(tmpLang) ? "1" : tmpLang;
            //         var param = {
            //             "lang": lang,
            //             "flag": "0"
            //         }
            //         var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:userList/></soapenv:Body></soapenv:Envelope>";
            //         //alert(val + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/userList");
            //         roads.oldSkoolAjax(val + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/userList", soapXML, function (data) {
            //             var result = JSON.parse($(data).find("return").html());
            //             switch (result.status) {
            //                 case -1:
            //                     roads.alertAIO(vue.langFunk("noUsr"));
            //                     vue.userList = [];
            //                     break;
            //                 case 1:
            //                     var userlistraw = result.data;
            //                     vue.userList = eval(userlistraw);
            //                     break;
            //                 case 0:
            //                     roads.alertAIO(0);
            //                     vue.userList = [];
            //                     break;
            //                 default:
            //                     break;
            //             }
            //         });
            //     }
            // }
        },
        mounted: function () {
            // 加载数据...
            this.$nextTick(function () {
                this.fillPage();
            })
        }
    })
}

// reference to last opened menu
var $lastOpened = false;

// simply close the last opened menu on document click
$(document).click(function () {
    if ($lastOpened) {
        $lastOpened.removeClass('open');
    }
});

// simple event delegation
$(document).on('click', '.pen-outer', function (event) {
    // jquery wrap the el
    var el = $('.pulldown-toggle');
    // prevent this from propagating up
    event.preventDefault();
    event.stopPropagation();
    // check for open state
    if (el.hasClass('open')) {
        el.removeClass('open');
    } else {
        vue.getUserList();
        if ($lastOpened) {
            $lastOpened.removeClass('open');
        }
        el.addClass('open');
        $lastOpened = el;
    }
});

function keyBack() {
    summer.exitApp();
};