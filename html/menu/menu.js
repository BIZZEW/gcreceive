/*by zhuhy*/
summerready = function () {
	initPage();
};

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

var turn = 0;

var vue = null;

function initPage() {
	// 构造控件Vue实例
	vue = new Vue({
		el: '#index',
		data: {
			netStatus: 0,
			baseUrlLogin: summer.getStorage('loginIP') + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/",
			//属于哪个部门
			// dept: summer.pageParam.dept,
			dept: "receive",
            usrname: summer.getStorage('usrname'),
			availableModules: eval(summer.pageParam.availableModules),
			//dept : "sale",
			deptShowName: "",
			//可用的功能模块
			modules: [],
			timeOutEvent: 0,
			touchStatus: 0,
			pulldownToggle: false
		},
		methods: {
			//检查更新
			checkUpdate: function () {
				var t = setTimeout(function () {
					var versionInfo = summer.getAppVersion();
					var version = JSON.parse(versionInfo);
					//var productIP = "http://192.168.10.166:80";
					//var testIP = "http://172.16.14.212:8280";
					var NCIPTmp = summer.getStorage('NCIP');
					var NCIP = isEmpty(NCIPTmp) ? "http://192.168.10.166:80" : NCIPTmp;
					var tmpLang = summer.getStorage('lang');
					var lang = isEmpty(tmpLang) ? "1" : tmpLang;
					var param = {
						"lang": lang,
						"version": -999,
						"flag": 1//代表销售
					};
					var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:mob='http://webservice.dispatcher.pu.itf.nc/MobilePhoneUpdatesAutomatic'><soapenv:Header/><soapenv:Body><mob:getFilePath><param>" + JSON.stringify(param) + "</param></mob:getFilePath></soapenv:Body></soapenv:Envelope>";
					$.ajax({
						url: NCIP + "/uapws/service/nc.itf.pu.dispatcher.webservice.MobilePhoneUpdatesAutomatic",
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
									//roads.alertAIO();
									break;
								case 0:
									//roads.alertAIO("抱歉，操作异常！");
									//roads.alertAIO(result.message);
									break;
								case 1:
									var versionInfo = result.version_detail;
									if (parseInt(versionInfo.version) > version.versionCode) {
										UM.confirm({
											title: vue.langFunk("updateVersion") + versionInfo.version_name + "？",
											text: vue.langFunk("updateContent") + versionInfo.update_content,
											btnText: [vue.langFunk("cancelBtntext"), vue.langFunk("confirmBtntext")],
											overlay: true,
											duration: 2000,
											cancle: function () {
											},
											ok: function (data) {
												var params = ["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE", "android.permission.READ_PHONE_STATE"];
												summer.getPermission(params, function (args) {
													clearTimeout(t);
													summer.upgradeApp({
														url: versionInfo.update_path
													}, function () {
													}, function () {
													});
												}, function (args) {
													alert(args);
												});
											}
										});
									}
									break;
								case 2:
									//roads.alertAIO();
									break;
								default:
									break;
							}
						},
						error: function (err) {
						},
						complete: function (XMLHttpRequest, status) {
						}
					});
				}, 1000);
			},
			checkNet: function () {
				var soapXML = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:validate/></soapenv:Body></soapenv:Envelope>";
				roads.oldSkoolAjax(vue.baseUrlLogin + "validate", soapXML, function (data) {
					var result = JSON.parse($(data).find("return").html());
					if (parseInt(result.status)) {
						vue.netStatus = 1;
					}
				});
			},
			//初始化模块列表
			initModules: function () {
				//根据公司获取信息
				var allList = this.langFunk(this.dept).moduleList;
				// for (var i = 0; i < allList.length; i++) {
				// 	var moduleId = allList[i].module_id;
				// 	if (!vue.checkAvailability(moduleId))
				// 		allList.splice(i--, 1);
				// };

				this.modules = allList;
				this.deptShowName = this.langFunk(this.dept).showName;
			},
			// checkAvailability: function (moduleId) {
			// 	var flag = 0;
			// 	$.each(vue.availableModules, function (i, obj) {
			// 		flag += (moduleId == obj) ? 1 : 0;
			// 	});
			// 	return flag;
			// },
			//初始化轮播
			initSlider: function () {
				var imgPath = "https://raw.githubusercontent.com/BIZZEW/rnbupdate/master/banner/";
				var list = [{
					content: imgPath + "receive/bg1.jpg"
				}, {
					content: imgPath + "receive/bg2.jpg"
				}, {
					content: imgPath + "receive/bg3.jpg"
				}, {
					content: imgPath + "receive/bg4.jpg"
				}, {
					content: imgPath + "receive/bg5.jpg"
				}, {
					content: imgPath + "receive/bg6.jpg"
				}];
				var islider = new iSlider({
					type: 'pic',
					data: list,
					dom: document.getElementById("iSlider-wrapper"),
					isLooping: true,
					animateType: 'default',
					animateEasing: 'ease-in-out',
					isAutoplay: true,
					animateTime: 800
				});
			},
			tapHold: function (index) {
				// 这里编辑长按列表项逻辑
				this.touchStatus = 1;
			},
			moveTapHold: function (index) {
				this.touchStatus = 0;
			},
			cancelTapHold: function (index) {
				var item = this.modules[index];
				// 取消长按
				if (!this.netStatus) {
					roads.alertAIO(1);
				} else if (this.touchStatus) {
					roads.openWin(this.dept, item["module_id"] + "", item["module_id"] + "/" + item["module_id"] + ".html", {
						"dept": this.dept,
						"module_id": item["module_id"],
						"module_title": item["module_title"],
						"record_id": "-999"
					});
				}
				this.touchStatus = 0;
			},
			exitApp: function (param) {
				UM.confirm({
					title: vue.langFunk("confirmExitTitle"),
					text: vue.langFunk("confirmExitText"),
					btnText: [vue.langFunk("cancelBtntext"), vue.langFunk("confirmBtntext")],
					overlay: true,
					duration: 2000,
					cancle: function () {
					},
					ok: vue.okCallback
				});
			},
			okCallback: function () {
				summer.setStorage('loginStatus', 0);
				var t = setTimeout(function () {
					her.loadingSpring(vue.langFunk("loading"));
					roads.openWinSpecial("login", "login", "login.html", {});
				}, 2000);
			},
			goSettings: function () {
				roads.openWin("menu", "settings", "settings/settings.html", {
					"dept": vue.dept,
					"module_id": vue.module_id
				});
			},
			langFunk: function (strTag) {
				var langCode = isEmpty(summer.getStorage('lang')) ? 1 : summer.getStorage('lang');
				return lang.getStr(langCode, strTag);
			},
			backfrModule: function (param) {
				UM.toast({
					"title": vue.langFunk("opSucceeded"),
					"text": eval(param)["module_title"] + vue.langFunk("opSucceededText"),
					"duration": 3000
				});
			},
			formSubmitted: function (param) {
				roads.alertAIO("表单数据提交成功！");
			}
		},
		mounted: function () {
			// 加载数据...
			this.$nextTick(function () {
				this.checkNet();
				this.initSlider();
				this.initModules();
				// this.checkUpdate();
			})
		}
	});
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
$(document).on('click', '.pulldown-toggle', function (event) {
	// jquery wrap the el
	var el = $('.pulldown-toggle');
	// prevent this from propagating up
	event.preventDefault();
	event.stopPropagation();
	// check for open state
	if (el.hasClass('open')) {
		el.removeClass('open');
	} else {
		if ($lastOpened) {
			$lastOpened.removeClass('open');
		}
		el.addClass('open');
		$lastOpened = el;
	}
});

function refresh() {
	window.location.reload();
};

function keyBack() {
	turn++;
	if (turn == 2) {
		clearInterval(intervalID);
		summer.exitApp();
	} else {
		summer.toast({
			"msg": "再点击一次退出应用"
		});
	}
	var intervalID = setInterval(function () {
		clearInterval(intervalID);
		turn = 0;
	}, 3000);
};

function gainFocus() {
	setTimeout(function () {
		try {
			document.getElementById('invisibleInput').focus();
		} catch (e) {
		}
	}, 3000);
};