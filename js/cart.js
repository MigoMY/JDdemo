/**
 * Created by dyf on 2017/5/23.
 */
window.onload = function () {
    shortcutDisplay();

    // 删除按钮点击
    deleteTap();
    
    // 残疾版check切换
    changeChecked();
}

/**
 * 1.垃圾桶打开盖子
 * 2.弹出alert窗口
 * */
function deleteTap() {
    // 1.拿到标签
    // 所有垃圾箱
    var rubbishBoxs = document.getElementsByClassName('goods_delete');
    // 弹出框遮盖,展示用
    var alertCover = document.getElementsByClassName('alert_cover')[0];
    // 弹窗,弹簧动画用
    var alert = alertCover.getElementsByClassName('alert')[0];
    var cancleBox = alert.getElementsByClassName('alert_bottom_left')[0];
    var sureBox = alert.getElementsByClassName('alert_bottom_right')[0];


    // 2.给每个垃圾箱添加tap事件
    var up; // 记录当前tap操作的马桶盖
    for (var i = 0; i < rubbishBoxs.length; i++){
        mjd.tap(rubbishBoxs[i], function (e) {
            // 1.拿到马桶盖
            up = e.target.parentNode.getElementsByClassName('up')[0];
            // 2.让马桶盖 过渡旋转
            // 2.1 设置过渡动画
            up.style.transition = 'all .2s ease';
            up.style.webkitTransition = 'all .2s ease';
            // 2.2 设置旋转点
            up.style.transformOrigin = 'left 3px';
            up.style.webkitTransformOrigin = 'left 3px';
            // 2.3 旋转角度
            up.style.transform = 'rotate(-30deg)';
            up.style.webkitTransform = 'rotate(-30deg)';

            // 3.展示弹窗
            alertCover.style.display = 'block';

            // 4.弹窗弹簧动画弹出
            alert.className = 'alert spring_jump';
        });
    }

    // 3.取消按钮tap
    mjd.tap(cancleBox, function (e) {
        // 弹窗遮盖和弹窗消失
        alertCover.style.display = 'none';
    });

    // 4.确定按钮的点击
    console.log(sureBox);
    mjd.tap(sureBox, function (e) {
        console.log(sureBox);
        // 弹窗遮盖和弹窗消失
        alertCover.style.display = 'none';
        // 删除垃圾桶所在的商品
        for (var box = up.parentNode; box.className != 'jd_cart_shop'; box = box.parentNode){
            console.log(box.className);
            if (box.className == 'cart_shop_goods'){
                // box他爹不要box这个孩子了
                box.parentNode.removeChild(box);
                break;
            }
        }
    });
}

//
function changeChecked() {
    // 1.先拿到checkBox们吧
    var checkBoxs = document.getElementsByClassName('checkbox');

    for (var i = 0; i < checkBoxs.length; i++){
        // (function (index) {
        //     var checkBox = checkBoxs[index];
        //     mjd.tap(checkBox, function (e) {
        //         // console.log(checkBox == e.target);
        //         if (checkBox.hasAttribute('checked')){
        //             checkBox.removeAttribute('checked');
        //         }else {
        //             // 注意
        //             checkBox.setAttribute('checked', '');
        //         }
        //     })
        // })(i);

        mjd.tap(checkBoxs[i], function (e) {
            // console.log(checkBox == e.target);
            var checkBox = e.target;
            if (checkBox.hasAttribute('checked')){
                checkBox.removeAttribute('checked');
            }else {
                // 注意
                checkBox.setAttribute('checked', '');
            }
        })
    }
}