/**
 * 本文件用来定义公用的变量 函数等等
 * 在定义变量时请注意不要重名
 */

// 服务器地址 本地开发时用 也可用于部署时目录变化
window.serveIp = 'http://192.168.0.112:8080';
// window.serveIp = '';


//cookie操作
function setCookie(key, value, time){
    var times = new Date();
    times.setDate(times.getDate() + time);
    var expires = "expires=" + times.toUTCString() + ';';
    document.cookie = key + '=' + value + ';' + expires
}
function getCookie(key){
    var obj = {},data = [];
    data = document.cookie.split(';');
    for(var i = 0;i<data.length;i++){
        var _data = data[i].split('=');
        obj[_data[0]] = _data[1];
    }
    return obj[key];
}
function deleteCookie(key,clear){
    //clear为真则清除所有的cookie
    if(clear){
        var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;){
                document.cookie = keys[i] + '= ;expires=' + new Date().toUTCString();
                console.log(keys[i]);
            }
        }
    }else{
        document.cookie = key + '= ;expires=' + new Date().toUTCString();
    }
}

//ajax成功后的回调 以及异常退出处理
//@param normal : 表示正常退出
function reLogin(normal){
    location.href = 'login.html'+ (normal ? '' : '?error=true');
}
$(document).ajaxSuccess(function(event, request, setting){
    console.log(request.status);
});
$(document ).ajaxError(function( event, request, settings ) {
    console.log(request.status);
    if (request.status == 403) {
        reLogin();
    }
});

 //路由
 function Router(){
     this.routes = {}
 }
 Router.prototype.route = function(url,callBack){
     this.routes[url.slice(1)] = callBack || function(){
         console.log('未定义路由回掉函数');
     };
 };
 Router.prototype.refresh = function(){
     var url = location.hash.slice(1);

     window.commonFun.toogleReplaceRight('', true);//防止rightcontent的覆盖层打开

     $('.leftMenuActive').removeClass('leftMenuActive');
     $('#leftMenu .' + url.slice(1)).addClass('leftMenuActive');
     
     //调用路由回掉函数
     var fun = this.routes[url] || function(){console.log('未定义路由回掉函数')};
     fun(true);
 }
 Router.prototype.init = function(){
     $(window).on('hashchange',this.refresh.bind(this));
 };

 window.routers = new Router();
 window.routers.init();


/**
 * 填充标签页dom
 */
function fillLabelPageDom(data,chooesd){
    var labelPage = '';

        labelPage += '<ul class="nav nav-tabs">';
        for(var i = 0;i<data.length;i++){
            labelPage += '<li role="presentation" valueS="'+ data[i] +'" class="'+ (data[i]==chooesd ? 'active' : '') +'"><a href="javascript:;">'+ data[i] +'</a></li>'
        }
        labelPage += '</ul>';
        
        $('#rightContent').prepend(labelPage);
}
/**
 * 添加分页组件
 * @param {number} total : 页数总数
 */
function fillPageDom(total,callback){
    if(total<2)return ;

    var pageDom = '<ul id="pageLimit"></ul>';
    $('#rightContent').append(pageDom);

    $('#pageLimit').bootstrapPaginator({
        currentPage: 1,//当前页面。
        totalPages: total,//一共多少页。
        size:"normal",//应该是页眉的大小。
        bootstrapMajorVersion: 3,//bootstrap的版本要求。
        alignment:"right",
        numberOfPages:5,//显示多少页码
       //  itemTexts: function (type, page, current) {//如下的代码是将页眉显示的中文显示我们自定义的中文。
       //     switch (type) {
       //     case "first": return "首页";
       //     case "prev": return "上一页";
       //     case "next": return "下一页";
       //     case "last": return "末页";
       //     case "page": return page;
       //     }
       // },
       onPageClicked: function (event, originalEvent, type, page){
           callback(page)
       }
   });
}
/**
 * 返回条件筛选字符串
 */
function getConditionsStr(data, choosedCondition){
    var str = '<div class="conditions" id="goodsConditions">';
    for(var i = 0;i<data.length;i++){
        var _data = data[i];
        str += '<p val="'+ _data.key +'"><span class="title">'+ _data.name + ':</span>';
        for(var j = 0;j<_data.values.length;j++){
            var __data = _data.values[j];
            str += '<span class="con '+ (choosedCondition[_data.key] == __data.key ? 'active' : '') +'" val="'+ __data.key +'">' + __data.value + '</span>'
        }
        str += '</p>';
    }
    str += '</div>';

    return str
}
/**
 * 打开商品详情页
 */
function openGoodsDetail(data){
    var choosProductId = data.property && data.property[0].id,
        choosedPrice = data.property && data.property[0].price;
    function getClassify(){
        var str = '';
        for(var i = 0;i<data.property.length;i++){
            str += '<span class="con '+ (data.property[i].id === choosProductId ? 'active' : '') +'" val="'+ data.property[i].id +'" price="'+ data.property[i].price +'" >'+ data.property[i].name +'</span>';
        }
        return str;
    }
    var dom_operate =
                '<div>' +
                    '<span class="ellipsis"><b>name:</b> &nbsp;&nbsp;'+ data.name +'</span><br>' +
                    '<div class="conditions">' +
                        '<p><span class="title">Classification:</span>'+ getClassify() +'</p>' +
                    '</div>' +
                    '<span><b>Price:</b> &nbsp;&nbsp;<span id="choosedPrice">'+ choosedPrice +'</span></span><br>' +
                '</div>' +
                '<div class="addToCartCon"> ' +
                    '<div> ' +
                        '<span style="margin-right:5px;">Number:</span>' +
                        '<span class="glyphicon glyphicon-minus reduce"></span> ' +
                        '<input value="1" type="text" id="goodsNumbers" class="form-control"> ' +
                        '<span class="glyphicon glyphicon-plus add"></span> ' +
                    '</div> ' +
                '<button class="btn btn-primary sureAdd">Add to Cart</button> ' +
                '</div>';

    $('#goossDetail').html(dom_operate);

    layer.open({
        title:'Goods Detail',
        type: 1,
        // title:false,
        area:['450px','350px'],
        content:$('#goossDetail')
    });

    //事件->数字加减
    $('#goossDetail .addToCartCon .reduce').unbind().click(function(){
        var num = Number($('#goodsNumbers').val());
        if(!isNaN(num)){
            if(num === 1)return false;
            num -= 1;
            $('#goodsNumbers').val(num)
        }else{
            Msg.error('It\'s not a number');
        }
    });
    $('#goossDetail .addToCartCon .add').unbind().click(function(){
        var num = Number($('#goodsNumbers').val());
        if(!isNaN(num)){
            num += 1;
            $('#goodsNumbers').val(num)
        }else{
            Msg.error('It\s not a number');
        }
    });

    //选择分类 更新价格
    $('#goossDetail .conditions .con').unbind().click(function(){
        $('#goossDetail .conditions .con').removeClass('active');
        $(this).addClass('active');
        choosProductId = $(this).attr('val');
        choosedPrice = $(this).attr('price');

        $('#choosedPrice').text(choosedPrice);
    });

    //点击确定
    $('#goossDetail .sureAdd').unbind().click(function(){
        var num = Number($('#goodsNumbers').val());
        if(isNaN(num)){
            Msg.error('It\'s not a number');
        }

        $.ajax({
            url:window.serveIp + '/evaluation/to_cart',
            type:'POST',
            data:{
                sku_id : choosProductId,
                amount : num
            },
            success:function(res){
                if(res.status == 0){
                    Msg.success('Successful addition');
                }
                else{
                    Msg.error('Add failure');
                }
                console.log(res);
            },
            error:function(err){
                console.log(err);
                Msg.error('Failed');
            }
        });
    });
}



//封装layer的confirm
function selfConfirm(msg,callBack){
    layer.confirm(msg || '', {icon: 3, title:'Prompt'}, function(index){
        if(!callBack)callBack = function(){
            console.log('未定义confirm的回掉函数');
        };
        callBack();
        layer.close(index);
    });
};

// 弹出自定义弹出框
function customModal(dom , size , callBack){
    $('#customModal').html(dom);
    var index = layer.open({
        // title:'',
        type: 1,
        title:false,
        area:size,
        content:$('#customModal')
    });
    callBack(index);
}

/**
 *  覆盖右侧内容区域代替弹出框打开某些页面 这样也可兼容手机端
 *  本函数则负责切换两者之间的显示
 **/
function toogleReplaceRight(dom, hide){
    if(hide){
        $('#rightContent_next').html('')
            .css("display","none");
        $('#rightContent').css("display","block");
    }else{
        $('#rightContent_next').html(dom)
            .css("display","block");
        $('#rightContent').css("display","none");
    }
}


window.commonFun = {
    fillLabelPageDom : fillLabelPageDom ,
    fillPageDom : fillPageDom ,
    getConditionsStr : getConditionsStr ,
    openGoodsDetail : openGoodsDetail ,
    customModal : customModal ,
    selfConfirm : selfConfirm ,
    toogleReplaceRight : toogleReplaceRight
};


//下面通过封装layer弹出层来实现公用的弹出层方法
//加载遮罩层
window.Loading = {
    show : function(){
        window.loading_index = layer.load(1,{
            shade : [0.65, '#000']
        });
    },
    hide : function(){
        layer.close(window.loading_index);
    }
};
//提示框
window.Msg = {
    error : function(msg){
        layer.msg(msg, {icon: 2});
    },
    success : function(msg){
        layer.msg(msg, {icon: 1});
    },
    warning : function(msg){
        layer.msg(msg, {icon: 7});
    },
    sure : function(msg){
        layer.msg(msg, {icon: 3});
    }
};

window.onload = function(){
    if(location.href.indexOf('login') === -1){
        window.routers.refresh();
    }
};