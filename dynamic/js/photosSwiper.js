var photosSwiper = new Vue({
    el: '#app',
    data: {
        activeIndex: 0,
        swiperData: [],
        localPath: false
    },
    mounted: function () {
        this.ready();
    },
    computed: {
        params: function () {
            return {
                initialSlide: this.activeIndex,
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
    },
    methods: {
        ready: function () {
            var self = this;
            summer.on('ready', function () {
                self.activeIndex = summer.pageParam.activeIndex;
                self.swiperData = summer.pageParam.imgArr;
                self.localPath = summer.pageParam.localPath;
            });
        }
    }
});