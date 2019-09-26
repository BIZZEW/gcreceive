/*by zhuhy*/
summerready = function() {
	initPage();
}
var vue = null;

function initPage() {
	vue = new Vue({
		el : '#index',
		data : {
			ownerTag : summer.pageParam.ownerTag,
			picPaths : summer.pageParam.picPaths,
			amountLimit : summer.pageParam.amountLimit,
			module_id : summer.pageParam.module_id,
			module_title : summer.pageParam.module_title,
			record_id : parseInt(summer.pageParam.record_id),
			win_id : summer.pageParam.win_id
		},
		methods : {
			//添加图片修改数量
			addPic : function() {
				roads.openPhoto(this.picPaths, this.amountLimit);
				this.picPaths = roads.g_path;
			},
			picLoad : function(index) {
				roads.thumbOnload();
			},
			//已加载的图片点击预览
			picClick : function(index) {
				roads.goSwiperImg(this.picPaths);
			},
			picClose : function(index) {
				this.picPaths.splice(index, 1);
			},
			tapHold : function(index) {
			},
			moveTapHold : function(index) {
			},
			cancelTapHold : function(index) {
			},
			// 返回
			goback : function() {
				roads.confirmClose();
			},
			// 暂存表单
			saveForm : function() {
				var params = {
					"ownerTag" : this.ownerTag,
					"picPaths" : this.picPaths
				}
				roads.execScript(this.win_id, "vue.backfrCollection", params);
				summer.closeWin();
			}
		},
		mounted : function() {
		}
	});
}