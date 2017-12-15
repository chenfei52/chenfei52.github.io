/*created by cf on 2017/1/5*/

var btn = document.getElementById('click');
var test;
btn.addEventListener("click", function () {
    myPopUp(params);
});

//参数示例
var params = {
    width: 600,
    height: 500,
    title: '标题一',
    content: '<div style="padding:15px;">just a test<button id="testclose">关闭</button></div>',
    //弹出框准备好后的回调函数 即可以开始操纵添加的元素
    loadedfun: function (obj) {
        console.log('pop-up preparing!');
        var close = document.getElementById('testclose');
        close.onclick = function(){
            obj.close();
        };
    },
    //弹出框关闭时的回调
    closefun: function () {
        console.log('pop-up closing!');
    },
};

//自定义弹出框函数
function myPopUp(params) {
    var shadowdiv = document.createElement('div'),
    //记录当前body可视区域的宽高
        maxWidth = window.innerWidth,
        maxHeight = window.innerHeight;

    //填充弹出框内容
    shadowdiv.className = 'cf_shadow';
    shadowdiv.innerHTML = '<div class="cf_popup"><div class="popupTitle"></div><div class="popupContent"></div></div>';
    shadowdiv.style.cssText = 'width:' + maxWidth + 'px;height:' + maxHeight + 'px;background:rgba(111, 111, 111, .65);';
    document.getElementsByTagName('body')[0].appendChild(shadowdiv);

    var popup = shadowdiv.getElementsByClassName('cf_popup')[0],
        dragArea = popup.getElementsByClassName('popupTitle')[0],
        popupContent = popup.getElementsByClassName('popupContent')[0];

    //根据参数设置弹出框样式内容
    dragArea.innerHTML = params.title + '<span class="closePopup">×</span>';
    popupContent.innerHTML = params.content;
    popup.style.cssText += 'width:' + params.width + 'px;height:' + params.height + 'px;';

    var closeBtn = dragArea.getElementsByClassName('closePopup')[0];
    closeBtn.addEventListener('click', function () {
        console.log(12);
        mypopup.close();
    });


    var dragging = false,   //记录是否在拖动中
        IX, IY;  //记录鼠标距离弹出框的位置
    dragArea.addEventListener('mousedown', function (e) {
        dragging = true;
        IX = e.pageX - popup.offsetLeft;
        IY = e.pageY - popup.offsetTop;

        this.setCapture && this.setCapture();    //开始获取鼠标信息
    });
    document.addEventListener('mousemove', function (e) {
        setpopup(e);
    }, false);
    window.addEventListener('mouseup', function (e) {
        dragging = false;
        dragArea.releaseCapture;   //停止获取鼠标信息
        document.removeEventListener('mousemove', function (e) {
            setpopup(e);
        }, false)
    });

    //设置弹出框的边距
    function setpopup(e) {
        if (dragging) {
            var e=e||window.event;//兼容IE
            var aa, bb;//弹出框的左右边距
            aa = e.pageX - IX;
            bb = e.pageY - IY;
            if (aa < 0)aa = 0;
            if (bb < 0)bb = 0;
            if (maxWidth < (aa + params.width))aa = maxWidth - params.width;
            if (maxHeight < (bb + params.height))bb = maxHeight - params.height;
            popup.style.cssText += 'margin-left:' + aa + 'px;margin-top:' + bb + 'px;';
        }
        return false;   //避免松开鼠标后依然监听鼠标信息
    };

    //窗口大小发生变化时
    window.onresize = function () {
        maxWidth = window.innerWidth;
        maxHeight = window.innerHeight;
        shadowdiv.style.cssText = 'width:' + maxWidth + 'px;height:' + maxHeight + 'px;background:rgba(111, 111, 111, .65);';
        popup.style.cssText += 'margin-left:auto;margin-top:auto;';
    };

    var mypopup = {
        close:function(){
            params.closefun&&params.closefun(); //执行回调
            shadowdiv.remove();
        }
    };
    params.loadedfun&&params.loadedfun(mypopup); //执行回调
}