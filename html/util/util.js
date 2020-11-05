window.roads = (function (win, r) {
    // 是否Debug模式
    r.G_DEBUG_MODE = true;

    r.G_BASE_SALE_URL = "html/sale/";
    r.G_BASE_PROCURE_URL = "html/procure/";
    r.G_BASE_RECEIVE_URL = "html/receive/";
    r.G_BASE_LOGIN_URL = "html/login/";
    r.G_BASE_MENU_URL = "html/menu/";
    r.G_BASE_UTIL_URL = "html/util/";

    /*多语*/
    r.langFunk = function (strTag) {
        var langCode = isEmpty(summer.getStorage('lang')) ? 1 : summer.getStorage('lang');
        return lang.getStr(langCode, strTag);
    };

    /**
     * 跨页面传值
     * @param {String} winid
     * @param {String} func
     * @param {Object} params 传递的参数
     */
    r.execScript = function (winid, func, params) {
        var paramStr = typeof params == "String" ? params : JSON.stringify(params);
        summer.execScript({
            winId: winid,
            script: func + '(' + paramStr + ');'
        });
    };

    r.checkTimeout = function (functionName) {
        var url2 = summer.getStorage('loginIP') + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/isTimeout";
        var tmpLang = summer.getStorage('lang');
        var lang = isEmpty(tmpLang) ? "1" : tmpLang;
        var param = {
            "lang": lang,
            requestMethod: functionName,
            status: ""
        };
        var data = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:isTimeout><param>" + JSON.stringify(param) + "</param></ipur:isTimeout></soapenv:Body></soapenv:Envelope>";
        $.ajax({
            url: url2,
            type: "POST",
            dataType: "xml",
            contentType: "text/xml; charset=utf-8",
            data: data,
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function (ret) { },
            error: function (err) { },
            complete: function (XMLHttpRequest, status) { }
        });
    };

    r.ajaxKernel = function (url, data, successCallback, functionName) {
        $.ajax({
            url: url,
            type: "POST",
            dataType: "xml",
            contentType: "text/xml; charset=utf-8",
            data: data,
            timeout: 30000,
            async: true,
            beforeSend: function (xhr) {
                xhr.setRequestHeader("User-Agent", "headertest");
            },
            success: function (ret) {
                her.loadedSpring();
                summer.refreshHeaderLoadDone();
                summer.refreshFooterLoadDone();
                successCallback(ret);
            },
            error: function (err) {
                her.loadedSpring();
                summer.refreshHeaderLoadDone();
                summer.refreshFooterLoadDone();
                r.alertAIO(r.langFunk("netDisconnect"));
            },
            complete: function (XMLHttpRequest, status) {
                if (status == 'timeout') {
                    r.alertAIO(r.langFunk("timeout"));
                    //oldSkoolAjax.abort();
                    r.checkTimeout(functionName);
                }
            }
        });
    };

    r.checkLogin = function (url, data, successCallback) {
        //提取方法名
        var functionName = url.split('/').pop();
        //alert("在调用接口 " + functionName + " 之前先检查当前登录状态有效性；当前会话编码：" + summer.getStorage('sessionId'));
        //除去“登录”和“获取用户列表”外的方法都要判断登录状态有效性
        if (functionName != "login" && functionName != "userList") {
            var url2 = summer.getStorage('loginIP') + "/uapws/service/nc.itf.app.webservice.IPurchaseAppWebService/checkLoginStatus";
            var usrcode = summer.getStorage('usrcode');
            var sessionId = summer.getStorage('sessionId');
            var tmpLang = summer.getStorage('lang');
            var lang = isEmpty(tmpLang) ? "1" : tmpLang;
            var param = {
                "lang": lang,
                usercode: usrcode,
                sessionid: sessionId
            };
            // alert("checkLogin param: " + JSON.stringify(param));
            var data2 = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:ipur='http://webservice.app.itf.nc/IPurchaseAppWebService'><soapenv:Header/><soapenv:Body><ipur:checkLoginStatus><string>" + JSON.stringify(param) + "</string></ipur:checkLoginStatus></soapenv:Body></soapenv:Envelope>";
            $.ajax({
                url: url2,
                type: "POST",
                dataType: "xml",
                contentType: "text/xml; charset=utf-8",
                data: data2,
                async: true,
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("User-Agent", "headertest");
                },
                success: function (ret) {
                    var result = JSON.parse($(ret).find("return").html());
                    // alert("checkLogin result: " + (parseInt(result.status) > 0));
                    if (parseInt(result.status) > 0)
                        r.ajaxKernel(url, data, successCallback, functionName);
                    else {
                        her.loadedSpring();
                        summer.setStorage('loginStatus', 0);
                        summer.refreshHeaderLoadDone();
                        summer.refreshFooterLoadDone();
                        // summer.toast({
                        // 	"msg": "抱歉，登录失效"
                        // });
                        r.alertAIO(r.langFunk("invalidLogin"));
                        r.openWinSpecial("login", "login", "login.html", {});
                    }
                },
                error: function (err) {
                    her.loadedSpring();
                    summer.refreshHeaderLoadDone();
                    summer.refreshFooterLoadDone();
                    //alert("检查登录有效性失败");
                    r.alertAIO(r.langFunk("netDisconnect"));
                },
                complete: function (XMLHttpRequest, status) {
                    if (status == 'timeout') {
                        r.alertAIO(r.langFunk("timeout"));
                        //oldSkoolAjax.abort();
                        r.checkTimeout(functionName);
                    }
                }
            });
        } else
            r.ajaxKernel(url, data, successCallback, functionName);
    };

    /*土味AJAX*/
    r.oldSkoolAjax = function (url, data, successCallback) {
        her.loadingSpring(r.langFunk("loading"));
        // 判断网络
        if (!summer.netAvailable()) {
            // summer.refreshHeaderLoadDone();
            // summer.refreshFooterLoadDone();
            // summer.toast({
            // 	msg: "网络异常，请检查网络"
            // });
            r.alertAIO(r.langFunk("invalidLogin"));
            her.loadedSpring();
            return false;
        }

        //判断登录状态是否有效
        r.checkLogin(url, data, successCallback);
    };

    //打开窗口
    r.openWin = function (module, winid, win_url, pageParam) {
        var baseUrl = "";
        switch (module) {
            case "sale":
                baseUrl = r.G_BASE_SALE_URL;
                break;
            case "procure":
                baseUrl = r.G_BASE_PROCURE_URL;
                break;
            case "receive":
                baseUrl = r.G_BASE_RECEIVE_URL;
                break;
            case "login":
                baseUrl = r.G_BASE_LOGIN_URL;
                break;
            case "menu":
                baseUrl = r.G_BASE_MENU_URL;
                break;
            case "util":
                baseUrl = r.G_BASE_UTIL_URL;
                break;
        }
        summer.openWin({
            id: winid,
            url: baseUrl + win_url,
            pageParam: pageParam
        });
    };

    /* 图片路径存放数组 */
    r.g_path = "";
    // r.g_path4show = "";
    /*图片上限*/
    r.g_num = null;
    r.openCamera = function (photosPath, picNum) {
        r.g_path = photosPath;
        // r.g_path4show = photosPath4show;
        r.g_num = picNum;
        // 打开相机
        summer.openCamera({
            bindfield: "image",
            callback: function (args) {
                var path = args.imgPath;
                r.pushPic(path);
                // r.compressImg(path);
            },
            // cameraType: custom
        });
    };

    r.openPhotoAlbum = function (photosPath, picNum, sentPic) {
        r.g_path = photosPath;
        // r.g_path4show = photosPath4show;
        r.g_num = picNum;
        // 打开相册
        var count = r.g_num - parseInt(r.g_path.length) - sentPic;
        summer.openPhotoAlbum({
            bindfield: "image",
            maxCount: count,
            type: "multiple", //支持选多张图片
            callback: function (args) {
                var paths = args.imgPaths;
                for (var i = 0; i < paths.length; i++) {
                    r.pushPic(paths[i].imgPath);
                    // r.compressImg(paths[i].imgPath);
                }
            }
        });
    };

    // 插入图片
    r.pushPic = function (path) {
        if (r.g_path.length >= r.g_num) {
            return;
        }
        var id = String(r.g_path.length);
        var picObj = {
            "path": path,
            "jid": id
        };
        r.g_path.push(picObj);
    };

    r.openPhoto = function (photosPath, picNum) {
        r.g_path = photosPath;
        r.g_num = picNum;
        UM.actionsheet({
            title: '',
            items: ['拍照', '从相册中选择'],
            callbacks: [
                function () {
                    // 打开相机
                    summer.openCamera({
                        bindfield: "image",
                        callback: function (args) {
                            var path = args.imgPath;
                            r.compressImg(path);
                        },
                        // cameraType: custom
                    });
                },
                function () {
                    // 打开相册
                    var count = r.g_num - parseInt(r.g_path.length);
                    summer.openPhotoAlbum({
                        bindfield: "image",
                        maxCount: count,
                        type: "multiple", //支持选多张图片
                        callback: function (args) {
                            var paths = args.imgPaths;
                            for (var i = 0; i < paths.length; i++) {
                                r.compressImg(paths[i].imgPath);
                            }
                        }
                    });
                }
            ]

        });
    };

    // 压缩图片
    r.compressImg = function (path) {
        var pathArr = path.split('/');
        var newPath = pathArr[pathArr.length - 1];
        // 调用上传
        summer.compressImg({
            src: path,
            path: 'compressImg/camera' + newPath,
            quality: "1", // 质量压缩比例
            callback: function (arg) {
                if (r.g_path.length >= r.g_num) {
                    return;
                }
                var id = String(r.g_path.length);
                var picObj = {
                    "path": arg.savepath,
                    "jid": id
                };
                r.g_path.push(picObj);
            }
        });
    };

    // 预览图片
    r.goSwiperImg = function (imgArr) {
        // 预览轮播图
        var ev = event || window.event;
        var activeIndex = ev.target.dataset.index;
        var imgUrlArr = imgArr.map(function (e) {
            return e.path;
        });
        summer.openWin({
            id: 'PhotosSwiper',
            url: 'dynamic/html/photosSwiper.html',
            create: false,
            animation: {
                type: "fade",
                subType: "",
                duration: 300
            },
            pageParam: {
                activeIndex: activeIndex,
                imgArr: imgUrlArr,
                localPath: true
            }
        });
    };

    /* 删除单张图片 */
    r.closePic = function (obj) {
        var id = $(obj).siblings().find('img').attr("data-index");
        for (var i = 0; i < r.g_path.length; i++) {
            if (r.g_path[i].jid == id) {
                r.g_path.splice(i, 1);
                i--;
            }
        }
        $(obj).parent(".conBox").remove();
        r.g_path.forEach(function (e, i) {
            e.jid = String(i);
            $("#plus").siblings(".conBox").eq(i).find('img').attr("data-index", String(i));
        });
        $("#plus").removeClass("none");
    };

    //涉及到头像处理
    r.thumbOnload = function (ev) {
        var ev = ev || window.event;
        var oImg = ev.target;
        $(oImg).removeAttr('style');

        var w = oImg.naturalWidth;
        var h = oImg.naturalHeight;
        var parentW = $(oImg).parent().width();
        var parentH = $(oImg).parent().height();
        var move;
        if (w >= h) {
            $(oImg).css('height', parentH);
            var actuallyW = parseFloat($(oImg).css('width'));
            move = -(actuallyW - parentW) / 2 + "px";
            $(oImg).css("transform", "translate(" + move + ",0)");
        } else {
            $(oImg).css('width', parentW);
            var actuallyH = parseFloat($(oImg).css('height'));
            move = -(actuallyH - parentH) / 2 + "px";
            $(oImg).css("transform", "translate(0," + move + ")");
        }
        $(oImg).css("display", "block");
    };

    // 监听打开窗口
    r.openWinSpecial = function (module, winid, win_url, pageParam) {
        var baseUrl = "";
        switch (module) {
            case "sale":
                baseUrl = r.G_BASE_SALE_URL;
                break;
            case "procure":
                baseUrl = r.G_BASE_PROCURE_URL;
                break;
            case "receive":
                baseUrl = r.G_BASE_RECEIVE_URL;
                break;
            case "login":
                baseUrl = r.G_BASE_LOGIN_URL;
                break;
            case "menu":
                baseUrl = r.G_BASE_MENU_URL;
                break;
            case "util":
                baseUrl = r.G_BASE_UTIL_URL;
                break;
        }
        summer.openWin({
            id: winid,
            url: baseUrl + win_url,
            pageParam: pageParam,
            addBackListener: true,
            isKeep: false,
            animation: {
                type: "fade",
                duration: 100
            }
        });
    };

    r.initializeWin = function (winid, module, win_url, toId) {
        var baseUrl = "";
        switch (module) {
            case "sale":
                baseUrl = r.G_BASE_SALE_URL;
                break;
            case "procure":
                baseUrl = r.G_BASE_PROCURE_URL;
                break;
            case "receive":
                baseUrl = r.G_BASE_RECEIVE_URL;
                break;
            case "login":
                baseUrl = r.G_BASE_LOGIN_URL;
                break;
            case "menu":
                baseUrl = r.G_BASE_MENU_URL;
                break;
            case "util":
                baseUrl = r.G_BASE_UTIL_URL;
                break;
        }
        summer.initializeWin({
            id: winid,
            url: baseUrl + win_url,
            toId: toId
        });
    };

    // 关闭窗口
    r.closeWin = function () {
        summer.closeWin();
    };

    // 关闭窗口并执行
    r.closeWinExec = function (winid, func, params) {

        var paramStr = typeof params == "String" ? params : JSON.stringify(params);
        summer.execScript({
            winId: winid,
            script: func + '(' + params + ');'
        });
        summer.closeWin();
    };

    // 关闭窗口确认
    r.confirmClose = function () {
        // UM.confirm({
        // 	title: "确认要离开吗",
        // 	text: "数据没保存或提交,将不会保存",
        // 	btnText: [vue.langFunk("cancelBtntext"), vue.langFunk("confirmBtntext")],
        // 	overlay: true,
        // 	duration: 2000,
        // 	cancle: function () {
        // 	},
        // 	ok: function (data) {
        // 		summer.closeWin();
        // 	}
        // });

        UM.confirm({
            title: r.langFunk("confirmCloseTitle"),
            text: r.langFunk("confirmCloseText"),
            btnText: [r.langFunk("cancelBtntext"), r.langFunk("confirmBtntext")],
            overlay: true,
            duration: 2000,
            cancle: function () { },
            ok: function (data) {
                summer.closeWin();
            }
        });
    };

    // 关闭窗口确认
    r.closetoWinExec = function (winId, func, params) {
        if (params != "") {
            var paramStr = typeof params == "String" ? params : JSON.stringify(params);
            summer.execScript({
                winId: winId,
                script: func + '(' + paramStr + ');'
            });
            //alert(func + '(' + paramStr + ');');
        } else {
            summer.execScript({
                winId: winId,
                script: func + '();'
            });
        }
        summer.closeToWin({
            id: winId,
            animation: {
                type: "fade", //动画类型（详见动画类型常量）
                subType: "from_right", //动画子类型（详见动画子类型常量）
                duration: 300 //动画过渡时间，默认300毫秒
            }
        });
    };

    // 退出应用确认
    r.confirmExit = function () {
        UM.confirm({
            title: r.langFunk("confirmExitTitle"),
            text: r.langFunk("confirmExitText"),
            btnText: [r.langFunk("cancelBtntext"), r.langFunk("confirmBtntext")],
            overlay: true,
            duration: 2000,
            cancle: function () { },
            ok: function (data) {
                summer.setStorage('loginStatus', 0);
                var t = setTimeout(function () {
                    var params = ["android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE", "android.permission.READ_PHONE_STATE"];
                    summer.getPermission(params, function (args) {
                        clearTimeout(t);
                        summer.exitApp();
                    }, function (args) {
                        r.alertAIO(args + "");
                    });
                }, 2000);
            }
        });
    };

    // 关闭窗口确认并执行
    r.confirmClosenExec = function (winid, func, params) {
        var paramStr = typeof params == "String" ? params : JSON.stringify(params);
        UM.confirm({
            title: r.langFunk("confirmCloseTitle"),
            text: r.langFunk("confirmCloseText"),
            btnText: [r.langFunk("cancelBtntext"), r.langFunk("confirmBtntext")],
            overlay: true,
            duration: 2000,
            cancle: function () { },
            ok: function (data) {
                summer.execScript({
                    winId: winid,
                    script: func + '(' + params + ');'
                });
                summer.closeWin();
            }
        });
    };

    //alert集中整理
    r.alertAIO = function (content) {
        var text = null;
        if (typeof (content) == "string")
            text = content;
        else if (typeof (content) == "number") {
            switch (content) {
                case (0):
                    text = r.langFunk("alertAIO0");
                    break;
                case (1):
                    text = r.langFunk("alertAIO1");
                    break;
                case (2):
                    text = r.langFunk("alertAIO2");
                    break;
                case (3):
                    text = r.langFunk("alertAIO3");
                    break;
                case (4):
                    text = r.langFunk("alertAIO4");
                    break;
                case (5):
                    text = r.langFunk("alertAIO5");
                    break;
                case (6):
                    text = r.langFunk("alertAIO6");
                    break;
                case (7):
                    text = r.langFunk("alertAIO7");
                    break;
                case (8):
                    text = r.langFunk("alertAIO8");
                    break;
                default:
                    text = r.langFunk("alertAIO");
                    break;
            }
        } else {
            text = r.langFunk("alertAIOerror");
        }

        UM.alert({
            title: text,
            btnText: [r.langFunk("cancelBtntext"), r.langFunk("confirmBtntext")],
            overlay: true,
            ok: function () { }
        });
    };

    // 日志输出
    r.log = function (msg) {
        if (r.G_DEBUG_MODE) {
            console.log(msg);
        }
    };

    //震动
    r.vibrator = function (duration) {
        var params = ["android.permission.VIBRATE"];
        summer.getPermission(params, function (args) {
            navigator.vibrate(duration);
        }, function (args) {
            r.alertAIO(args + "");
        });
    };

    //语音
    r.speech2 = function (content) {
        var audioHost = document.getElementById('audioHost');
        var audioCode = document.getElementById('audioCode');
        audioHost.removeChild(audioCode);
        audioHost.innerHTML = '<audio id="audioCode"><source id="tts_source_id" src="http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&spd=6&pit=7&vol=13&text=' + content + '" type="audio/mpeg"><embed id="tts_embed_id" height="0" width="0" src=""></audio>';
        var audioCode = document.getElementById('audioCode');
        audioCode.play();
    };

    //本地语音
    r.speech3 = function (content) {
        var audioHost = document.getElementById('audioHost');
        var audioCode = document.getElementById('audioCode');
        var tmpLang = summer.getStorage('lang');
        var lang = isEmpty(tmpLang) ? "1" : tmpLang;
        audioHost.removeChild(audioCode);
        audioHost.innerHTML = '<audio id="audioCode"><source id="tts_source_id" src="../../../../audio/' + content + '-' + lang + '.mp3" type="audio/mpeg"><embed id="tts_embed_id" height="0" width="0" src=""></audio>';
        var audioCode = document.getElementById('audioCode');
        audioCode.play();
    };

    //本地语音
    r.speech = function (content) {
        var audioHost = document.getElementById('audioHost');
        var audioCode = document.getElementById('audioCode');
        var tmpLang = summer.getStorage('lang');
        var lang = isEmpty(tmpLang) ? "1" : tmpLang;
        audioHost.removeChild(audioCode);
        audioHost.innerHTML = '<audio id="audioCode"><source id="tts_source_id" src="../../../audio/' + content + '-' + lang + '.mp3" type="audio/mpeg"><embed id="tts_embed_id" height="0" width="0" src=""></audio>';
        var audioCode = document.getElementById('audioCode');
        audioCode.play();
    };

    return r;
})(window, window.roads || {})