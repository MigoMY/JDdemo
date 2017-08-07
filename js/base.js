/**
 * Created by Administrator on 2017/5/20.
 */

window.mjd = {};

/**
 * 1.如果手指滑动了,就不是tap了
 * 2.如果 touchstart于touchend 两个事件间隔超过 duration, 认为不是tap, 而是LongPress
 * */
mjd.tap = function (obj, callback) {// obj是tap的对象, callback是tap的回调
    if (typeof(obj) != 'object'){
        console.log('error:typeof(obj) != object ');
        return;
    }

    var ismoving = false;
    var duration = 300; // 毫秒级别
    var startTime = Date.now();
    obj.addEventListener('touchstart', function (e) {
        startTime = Date.now();
    })
    obj.addEventListener('touchmove', function (e) {
        e.preventDefault();

        ismoving = true;
    })
    obj.addEventListener('touchend', function (e) {
        if (ismoving == false && (Date.now() - startTime < duration)){
            if (callback){ // 如果有回调就执行回调
                callback(e);
            }
        }
    })
}

// 快捷菜单的展示
function shortcutDisplay() {
    // 1.获取标签
    var headerBox = document.getElementsByClassName('jd_base_header')[0];
    var icon_short = headerBox.getElementsByClassName('icon_shortcut')[0];
    var short_tab = headerBox.getElementsByTagName('ul')[0];


    // 2.icon_short 点击事件
    mjd.tap(icon_short, function (e) {
        // 注意,必须在html中写有style才能获取
        var shortDisplay = short_tab.style.display;
        if (shortDisplay == 'none'){
            short_tab.style.display = 'table';
        }else if (shortDisplay == 'table'){
            short_tab.style.display = 'none';
        }
    })

}