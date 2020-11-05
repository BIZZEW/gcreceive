/* 注册全局组件（轮播图） */
Vue.component('mySwiper',{
    template:'<div class="cultural-swiper" @touchstart="holdDown" @touchmove="touchMove" @touchend="touchEnd" @click="closeSwiper"><div class="swiper-container"><div class="swiper-wrapper"><div v-for="(item,index) in swiperData" class="swiper-slide zidingyi-swiper" v-bind:key="index" v-bind:data-index="index"><div class="zidingyi-swiper-con"><img class="slide-img" v-bind:src="item" v-bind:data-index="index" @load="oPicLoad"/></div></div></div><div class="swiper-pagination"></div></div></div>',
    /* 父级数据流向子组件 */
    props: ['params','swiperData','localPath'],
    data: function () {
        return {
            // 定时器ID
            timeOutEvent: 0,
            scaleCount: 1
        };
    },
    beforeMount: function () {
        summer.showProgress();
    },
    mounted: function () {
        var photoBox = document.getElementsByClassName('zidingyi-swiper-con');
        for (var i = 0; i < photoBox.length; i++) {
            photoBox[i].style.height = this.params.height + 'px';
        }
        // 初始化Swiper
        this.ready();
    },
    methods: {
        ready: function () {
            var This = this;
            var mySwiper = new Swiper('.swiper-container', {
                //分页
                pagination: '.swiper-pagination',
                paginationClickable: true,
                // 初始页
                initialSlide: This.params.initialSlide
            });
        },
        oPicLoad: function (ev) {
            summer.hideProgress();
            var self = this;
            var oImg = ev.target;
            var hammertime = new Hammer(oImg);
            hammertime.get('pinch').set({ enable: true });
            hammertime.on('pinchout', function(ev) {
                if(self.scaleCount >= 2.5){
                    return;
                }
                self.scaleCount += 0.03;
                oImg.style.transform = "scale("+self.scaleCount+")";
            });
            hammertime.on('pinchin', function(ev) {
                if(self.scaleCount <= 0.6){
                    return;
                }
                self.scaleCount -= 0.03;
                oImg.style.transform = "scale("+self.scaleCount+")";
            });
        },
        /* 长按保存图片到本地相册 */
        holdDown: function () {
            var ev = event || window.event;
            var touches = ev.targetTouches;
            if (touches.length>1) {
                return;
            }
            var oImgPath = $(ev.currentTarget).find(".swiper-slide-active").find("img").attr("src");
            var This = this;
            function savePic() {
                if (This.localPath) {
                    summer.saveImageToAlbum({
                        "override": true, //覆盖图片，仅Android生效
                        "path": oImgPath, //源图片本地路径，如果是网络图片需要先调用download下载
                        "albumTitle": "MOLI", //相册名称
                        "callback": function (ret) {
                            if (ret.success) {
                                summer.toast({
                                    msg: "保存成功"
                                });
                            } else {
                                summer.toast({
                                    msg: "保存失败"
                                });
                            }
                        }
                    });
                } else {
                    // 不是本地路径，先下载图片到本地再保存到相册
                    var fileName = +new Date() + "pic" + ".jpg";
                    summer.download({
                        "url": oImgPath,
                        "locate": "download/image",
                        "filename": fileName,
                        "override": "true",
                        "callback": function (args) {
                            if (args.isfinish) {
                                summer.saveImageToAlbum({
                                    "override": true, //覆盖图片，仅Android生效
                                    "path": args.savePath, //源图片本地路径，如果是网络图片需要先调用download下载
                                    "albumTitle": "MOLI", //相册名称
                                    "callback": function (ret) {
                                        if (ret.success) {
                                            summer.toast({
                                                msg: "保存成功"
                                            });
                                        } else {
                                            summer.toast({
                                                msg: "保存失败"
                                            });
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            }
            This.timeOutEvent = setTimeout(function () {
                This.timeOutEvent = 0;
                UM.actionsheet({
                    title: '',
                    items: ['保存到相册'],
                    callbacks: [function () {
                        savePic();
                    }]
                });
            }, 1000);
        },
        touchMove: function () {
            clearTimeout(this.timeOutEvent);
            this.timeOutEvent = 0;
        },
        touchEnd: function () {
            clearTimeout(this.timeOutEvent);
            this.timeOutEvent = 0;
        },
        closeSwiper: function () {
            // 退出轮播图，开启悬浮球
           // this.openAssistiveTouch();
            clearTimeout(this.timeOutEvent);
            this.timeOutEvent = 0;
            summer.closeWin({
                animation: {
                    type: "fade", 
                    subType: "", 
                    duration: 300 
                }
            });
        },
        /* 开启悬浮球 */
        openAssistiveTouch: function () {
            summer.require("summer-plugin-assistivetouch.AssistiveTouch").open({
                id : "robot",
                url : "comps/robot/index.html",
                addBackListener : "true",
                create : "false",
                addKeyBoardListener : "addKey()",
                speechCallback : "succussCallback()",
                waveBgColor : "#f4f4f4",
                type : "waveSpeech",
                actionBar : {
                    title : "沫沫",
                    leftItem : {
                        image : "",
                        method : "openWaker()"
                    },
                    rightItems : [{
                        type : "image",
                        image : "comps/robot/img/speak.png",
                        method : "changeIcon()"
                    }]
                }
            }, function() {}, function() {});
        }
    }
});