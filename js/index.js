/**
 * Created by Administrator on 2017/5/20.
 */

window.onload = function () {
    // 1首页头部透明度变化
    changeHeaderAlpha();

    // 2焦点图
    activeBanner();

    // 3秒杀倒计时
    seckillTimer();
}

window.onresize = function () {
    setTimeout(function () {
        window.location.reload();
    }, 200);
}

/**
 * alpha取值范围:[0,0.8];
 UI作用范围: body.scrollTop在[0, bannerH]之间
 scrollTop = bannerH一半,
 * */
function changeHeaderAlpha() {
    // 1.获取标签
    var topbar = document.getElementsByClassName('jd_topbar')[0];
    var banner = document.getElementsByClassName('jd_banner')[0];

    // 2.确定常量以及变量
    var bannerH = banner.offsetHeight;
    var alpha = 0;
    var alpha_max = 0.8;
    var scrollTop = 0;

    // 3.监听滚动
    window.onscroll = function () {
        // 3.1 拿到滚动的偏移量
        scrollTop = document.body.scrollTop;
        // console.log(scrollTop);

        // 3.2 根据scrollTop确定alpha的变化
        if(scrollTop < bannerH){
            alpha = alpha_max * (scrollTop/bannerH);
        }else {
            alpha = alpha_max;
        }

        // 3.3 为标签css改变赋值
        topbar.style.background = 'rgba(201, 21, 35, '+ alpha + ')';
    }

}

/**
 *
 * 自动无限轮播:
 1.定时器每x秒过渡滚动一次
 2.过渡结束后:
 [0, 9] -> [1,8]
 index范围判断,若滚动到边界则进行index转移以及非过渡位移
 切换白点

 手势滑动
 1.手势开始时停止计时器
 2.滑动手势期间:
 - 清除默认事件event.preventDefault
 - 非过渡滚动:切换x值=当前index值*bannerW+movedX
 3.手势结束
 - 根据movedX,确定index--/++or不动,并过渡翻页
 - 重启定时器
 - 数据重置(optional)
 * */

function activeBanner() {
    // 一. 自动无限轮播
    // 1.拿到标签
    var banner = document.getElementsByClassName('jd_banner')[0];
    var ul_imgbox = banner.getElementsByTagName('ul')[0];
    var ol_pagebox = banner.getElementsByTagName('ol')[0];
    var pages = ol_pagebox.getElementsByTagName('li');
    var li_array = ul_imgbox.getElementsByTagName('li');

    // 2.获取常量和一些变量
    var bannerW = banner.offsetWidth;
    var timer;
    var duration = 1000; // 1000ms 也就是1s
    var index = 1; // 由于显示的是第二张所以从下标为1的开始
    var curX = 0;

    // 3.设置过渡/ 移出过渡/ 水平方向位移
    // 3.1 设置过渡
    function setTransition() {
        ul_imgbox.style.transition = 'all .2s ease';
        ul_imgbox.style.webkitTransition = 'all .2s ease';
    }

    // 3.2 移除过度
    function removeTransition() {
        ul_imgbox.style.transition = 'none';
        ul_imgbox.style.webkitTransition = 'none';
    }

    // 3.3 设置水平方向位移
    function changeTranslateX(x) {
        ul_imgbox.style.transform = 'translateX(' + x + 'px)';
        ul_imgbox.style.webkitTransform = 'translateX(' + x + 'px)';
    }

    // 4.用定时器实现自动滚动

    // 4.1 直接开始定时器滚动
    timer = setInterval(scrollImg, duration);
    function scrollImg() {
        // 索引+1
        // console.log(index);
        index ++;

        // 带过渡的移动
        curX = -index * bannerW;
        setTransition();
        changeTranslateX(curX);
    }
    // 4.2 狸猫换太子

    function keepIndexSafe() {
        // 4.2.1若滚动到边界则进行index转移
        if(index >= li_array.length - 1){
            index = 1;
        }else if (index <= 0){
            index = 8;
        }
        // 4.2.2非过渡位移
        curX = -index * bannerW;
        removeTransition();
        changeTranslateX(curX); // 尽量不要使用 计算来代替参数
        // 4.2.3执行currentPage变化
        currentPageChange();
    }
    ul_imgbox.addEventListener('transitionEnd', keepIndexSafe);
    ul_imgbox.addEventListener('webkitTransitionEnd', keepIndexSafe);

    // 执行currentPage变化
    function currentPageChange() {
        // 1.清除当前curpage
        for (var i = 0; i < pages.length; i++){
            pages[i].className = '';
        }
        // 2.给新的li赋值类名,来实现curPage
        // pages内部元素的下标范围[0,7];index取值范围 [1,8]
        var pageIndex = index - 1;
        // 2.1 optional
        if (pageIndex < 0) pageIndex = 0;
        if (pageIndex > 7) pageIndex = 7;

        pages[pageIndex].className = 'current';
    }

    // 二.手势滑动
    var startX,movingX,changedX;
    startX = 0;
    movingX = 0;
    changedX = 0;
    // 1.手势开始
    ul_imgbox.addEventListener('touchstart', function (e) {
        // 1.1 清除定时器
        clearInterval(timer);
        // 1.2 记录开始x
        startX = e.touches[0].clientX;
    })
    // 2.手势开始移动
    ul_imgbox.addEventListener('touchmove', function (e) {
        // 2.0 清除默认效果
        e.preventDefault();
        // 2.1 记录当前的movingX,并得到变化的changedX;
        movingX = e.touches[0].clientX;
        changedX = movingX - startX;

        // 2.2 让ul_imgbox跟随位移
        curX = -index * bannerW + changedX;
        removeTransition(); // 进行无过渡位移
        changeTranslateX(curX);

    })
    // 3.手势结束
    ul_imgbox.addEventListener('touchend', function (e) {
        // 3.1 根据changedX来判断,是否处于正好的显示一页,如果不是,就进行过渡动画
        if (changedX > bannerW * 0.49){
            index --;
        }else if(changedX < -0.49 * bannerW){
            index ++;
        }else{
        }
        curX = -index * bannerW;
        setTransition();
        changeTranslateX(curX);

        // 3.2 重启定时器
        timer = setInterval(scrollImg, duration);

        // 3.3 数据重置
        startX = 0;
        movingX = 0;
        changedX = 0;
    })
}

/**
 * 假设 每天3场抢购 0点场 8点场 16点场
 当前处于 1.x点场 2.离下一场还剩多少时间 3.每秒展示一次

 11: 39 : 53
 当前处于 8点场
 距离16点场,剩余的时间 4:20:07

 11:00:00,剩余时间 5:00:00
 11:01:00,剩余实际 4:59:00
 11:01:01,剩余实际 4:58:59
 * */
function seckillTimer() {
    // 1.获取标签
    var box = document.getElementsByClassName('seckill_header_left')[0];
    var nth_seckill = box.getElementsByTagName('em')[0];
    // 去某一部分做修改,下标为1,3,4,6,7
    var spans = box.getElementsByTagName('span');

    setInterval(function () {
        // 2.拿到当前时间
        var now = new Date();
        // console.log(now, Date.now());
        var nowH = now.getHours();
        var nowM = now.getMinutes();
        var nowS = now.getSeconds();
        // console.log('h:', nowH, 'm:', nowM, 's:', nowS);
        var nth = 0;
        var leftH = 0;
        var leftM = 0;
        var leftS = 0;

        if (nowH > 0 && nowH < 8){
            nth = 0;
        }else
        {
            // 处理0点到8点,其他的场次没隔n小数执行一次
            var n = 8; // 为了注释服务变量
            nth = Math.floor(nowH / n) * n;
        }

        // console.log();


        leftH = (nowM == 0 &&　nowS == 0) ? 8 - (nowH - nth): 7 - (nowH - nth);
        leftM = (nowS == 0) ? 60 - nowM: 59 - nowM;
        leftS = (nowS == 0) ? 0: 60 - nowS;

        // 3.展示
        nth_seckill.innerHTML = nth;
        spans[1].innerHTML = leftH;
        spans[3].innerHTML = Math.floor(leftM/10);
        spans[4].innerHTML = leftM % 10;
        spans[6].innerHTML = Math.floor(leftS/10);
        spans[7].innerHTML = leftS % 10;
    }, 1000);

 }
