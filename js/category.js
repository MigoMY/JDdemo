/**
 * Created by Administrator on 2017/5/23.
 */

window.onload = function () {
    // 搞mainH
    getMainH();

    // shortcut的展示
    shortcutDisplay();

    // 与左边列表的交互
    mainLeftInteraction();

    // 作业:右边随手势交互
}

window.onresize = function () {
    setTimeout(function () {
        getMainH();
    }, 100);
}

// 获取main高度
function getMainH() {
    // 1.拿到标签
    var mainbox = document.getElementsByClassName('jd_main')[0];
    var header = document.getElementsByClassName('jd_base_header')[0];
    // 2.拿到常量
    var headerH = header.offsetHeight;
    var screenH = window.screen.height;

    var mainH = screenH - headerH;

    // 3.赋值
    mainbox.style.height = mainH + 'px';
}

// 与左边列表的交互
/**
 * 一.跟随手势进行移动
 *
 * 二.tap事件
 * */
function mainLeftInteraction() {
   // 一.跟随手势进行移动
    // 1.拿到标签
    var mainLeftBox = document.getElementsByClassName('jd_main_left')[0];
    var ul_box = mainLeftBox.getElementsByTagName('ul')[0];

    // 2.拿到常量
    var ulH = ul_box.offsetHeight;
    var mainLeftH = mainLeftBox.offsetHeight;

    // topY值的变化的范围
    var topY = 0;
    var ul_topMaxY = 0;
    var ul_topMinY = mainLeftH - ulH; // 524 - 1104
    // 缓冲范围
    var bufferH = 138; // 46 * 3
    var ul_topBufferMaxY = ul_topMaxY + bufferH;
    var ul_topBufferMinY = ul_topMinY - bufferH;


    // 3.设置缓冲,移出缓冲 ,竖直方向位移
    // 3.1 设置缓冲
    function setTransition() {
        ul_box.style.transition = 'all .2s ease';
        ul_box.style.webkitTransition = 'all .2s ease';
    }

    // 3.2 移除过度
    function removeTransition() {
        ul_box.style.transition = 'none';
        ul_box.style.webkitTransition = 'none';
    }

    // 3.3 设置水平方向位移
    function changeTranslateY(y) {
        ul_box.style.transform = 'translateY(' + y + 'px)';
        ul_box.style.webkitTransform = 'translateY(' + y + 'px)';
    }

    // 4.跟随手势位移
    var startY,movingY,changedY;
    startY = 0;
    movingY = 0;
    changedY = 0;
    // 4.1 手势开始
    ul_box.addEventListener('touchstart', function (e) {
        // 拿到初始y值
        startY = e.touches[0].clientY;
    })
    // 4.2 开始滑动
    ul_box.addEventListener('touchmove', function (e) {
        e.preventDefault(); // 取消默认事件

        // 4.2.1 拿到竖直位移的改变
        movingY = e.touches[0].clientY;
        changedY = movingY - startY;

        // 跟随非过渡位移
        // 4.2.2 确定topY能位移的范围,若超过范围,让滑动手势的跟随位移失效
        var temp_topY = topY + changedY;
        console.log(temp_topY);
        if (temp_topY > ul_topBufferMinY && temp_topY < ul_topBufferMaxY){
            removeTransition();
            changeTranslateY(temp_topY);
        }
    })
    // 4.3 结束手势
    ul_box.addEventListener('touchend', function (e) {
        // 4.3.0 手势结束的时候,记录topY的改变
        // 注意:changedY 并未进行范围判断过滤,所以topY不必考虑太多
        topY = topY + changedY;
        // 4.3.1 判断topY是否在缓冲区域,如果在进行过渡的位置就找
        // console.log('touchend:', topY);
        if (topY > ul_topMaxY){ // 若比最大值大,回复成最大值,并进行过渡
            topY = ul_topMaxY;
            setTransition();
            changeTranslateY(topY);
        }else if(topY < ul_topMinY){ // 若比最小值小,回复成最小值,并进行过渡
            topY = ul_topMinY;
            setTransition();
            changeTranslateY(topY);
        }else {
            // 不需要过渡
            removeTransition();
        }

        // 4.3.2 数据还原
        startY = 0;
        movingY = 0;
        changedY = 0;
    })

    // 二.tap事件
    // 1.拿到li标签们
    var li_array = ul_box.getElementsByTagName('li');
    // 2.添加tap事件
    mjd.tap(ul_box, function (e) {
        // 2.1 若点击的是当前选中li,则直接返回
        // console.log(e.target, e.target.parentNode, e.target.parentNode.parentNode);
        var cur_li = e.target.parentNode;
        if (cur_li.className == 'current') {
            return;
        }else {
            // 2.2 取消之前的选中
            for (var i = 0; i < li_array.length; i++){
                li_array[i].className = '';

                // 记录元素下标
                li_array[i].index = i;
            }

            // 2.3 切换当前为选中
            cur_li.className = 'current';

            // 2.4 位移
            // 2.4.1 确定位移后的top
            topY = - cur_li.index * 46;
            // 2.4.2 过滤位移后的topY
            if (topY < ul_topMinY) topY = ul_topMinY;
            setTransition();
            changeTranslateY(topY);

            // 2.5 刷新右边内容(模拟)
            var rightbox = mainLeftBox.parentNode.getElementsByClassName('jd_main_right')[0];
            // console.log(mainLeftBox.parentNode.childNodes);
            rightbox.style.display = 'none';
            setTimeout(function () {
                rightbox.style.display = 'block';
            }, 200);
        };
    });
}

