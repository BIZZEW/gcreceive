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
			//1:中文；0:英文
			lang: 1,
		},
		methods: {
			//初始化页面
			fillPage: function () {
				var langTmp = summer.getStorage('lang');
				this.lang = isEmpty(langTmp) ? 1 : langTmp;
			},
			// 返回
			goback: function () {
				roads.closeWin();
			},
			langFunk: function (strTag) {
				var langCode = isEmpty(summer.getStorage('lang')) ? 1 : summer.getStorage('lang');
				return lang.getStr(langCode, strTag);
			},
			langChange: function (status) {
				if (status != vue.lang) {
					UM.confirm({
						title: vue.langFunk("confirmSwitch"),
						text: vue.langFunk("confirmSwitchText"),
						btnText: [vue.langFunk("cancelBtntext"), vue.langFunk("confirmBtntext")],
						overlay: true,
						duration: 2000,
						cancle: function () {
						},
						ok: function () {
							vue.lang = status;
							summer.setStorage('lang', vue.lang);
							roads.execScript("settings", "refresh", {
							});
							roads.execScript("menu", "refresh", {
							});
						}
					});
				}
			}
		},
		mounted: function () {
			// 加载数据...
			this.$nextTick(function () {
				document.addEventListener("backbutton", this.goback, false);

				vue.fillPage();
			})
		}
	})
}