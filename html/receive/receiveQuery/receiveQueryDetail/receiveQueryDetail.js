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
            /*public??*/
            nfcStatus: 0,
            baseUrl: summer.getStorage('baseUrl'),
            inputStatus: 0,
            bandShow: false,
            turn: 0,
            dept: summer.pageParam.dept,
            module_id: summer.pageParam.module_id,
            module_title: summer.pageParam.module_title,
            content: summer.pageParam.itemContent,

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
        },
        methods: {
            fillPage0: function () {
                var parsedData = JSON.parse(vue.content);

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
                vue.refundStatus = parsedData.refundStatus;

                vue.containerNo = parsedData.containerno;
            },
            // 返回
            goback: function () {
                roads.closeWin();
            },
        },
        watch: {},
        mounted: function () {
            // 加载数据...
            this.$nextTick(function () {
                //监听返回按钮
                document.addEventListener("backbutton", this.goback, false);

                vue.fillPage0();
            })
        }
    });
};