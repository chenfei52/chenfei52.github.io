$(function () {
    //图片立方体切换展示
    var photosShow = function(data,showType,num,time,delaytime){
        var showAreaDiv = $('.cf_showArea'),//容器Dom
        //加入必须的dom元素
            showContent =
                '<div class="cf_container">'+
                    '<div class="img">'+
                        '<img/>'+
                    '</div>'+
                    '<ul class="cf_index"></ul>'+
                '</div>'+

                '<div class="cf_left">'+
                    '<div class="cf_prev"></div>'+
                '</div>'+
                '<div class="cf_right">'+
                    '<div class="cf_next"></div>'+
                '</div>'+

                '<div class="shadow"></div>';
        showAreaDiv.html(showContent);

        var showMyPhotos = {
            showType:Number(showType)||1,//图片切换方式 1立方体 2百叶窗 3渐变
            imgNum: 0,//所输路径下的图片总数
            now: 1,//当前展示的图片index
            time: parseInt(time)||1000,//图片旋转时间(毫秒)
            delayTime: Number(delaytime)||(showType==2?100:200),//动画延迟时间(毫秒)
            num: parseInt(num)||6,//图片裁剪的数目
            width: showAreaDiv.width(),//容器宽
            height: showAreaDiv.height(),//容器高

            //默认展示图片
            imgArry: data || [
                "img/1 (1).jpg",
                "img/1 (2).jpg",
                "img/1 (3).jpg",
                "img/1 (4).jpg",
                "img/1 (5).jpg",
                "img/1 (6).jpg",
                "img/1 (7).jpg",
                "img/1 (8).jpg",
                "img/1 (9).jpg",
                "img/1 (10).jpg",
                "img/1 (11).jpg",
                "img/1 (12).jpg",
                "img/1 (13).jpg",
                "img/1 (14).jpg",
            ],

            //初始化
            init: function(){
                showMyPhotos.showType==1&&showAreaDiv.find('.img').css({
                    'transform-origin': '50% 50% -' + showMyPhotos.height / 2 + 'px',
                    '-webkit-transform-origin': '50% 50% -' + showMyPhotos.height / 2 + 'px',
                    '-moz-transform-origin': '50% 50% -' + showMyPhotos.height / 2 + 'px',
                    '-o-transform-origin': '50% 50% -' + showMyPhotos.height / 2 + 'px',
                }).end().find('.cf_container').css({
                    'perspective':'1000px',
                    '-webkit-perspective':'1000px',
                    '-moz-perspective':'1000px',
                });//立方体切换时改变旋转原点和视角间距

                showMyPhotos.changeImg();//加入图片
                showMyPhotos.imgLoad();//预加载图片
            },

            //切换图片 控制显示翻页按钮
            changeImg: function () {
                var _this = this;

                showAreaDiv.find('.cf_left').css('visibility',_this.now==1?'hidden':'visible');
                showAreaDiv.find('.cf_right').css('visibility',_this.now==_this.imgArry.length?'hidden':'visible');
                showAreaDiv.find('.cf_choosed').removeClass('cf_choosed');
                showAreaDiv.find('.cf_index').find('li').eq(_this.now-1).addClass('cf_choosed');

                showAreaDiv.find('.img').find('img').eq(0).attr('src', _this.imgArry[_this.now-1]);
            },

            //立方体模式下切换添加元素设置样式
            cubeAddElement: function (type) {
                var _this = this,
                    first = showAreaDiv.find('.img').eq(0).clone(),
                    second = $('<img src="'+_this.imgArry[_this.now-1]+'" />'),
                    shadowDiv = $('<div class="shadowDiv" style="position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;width:' + _this.height + 'px;height:' + _this.height + 'px;background-color:#222222;"></div>' +
                        '<div class="shadowDiv" style="position:absolute;top:0;left:0;right:0;bottom:0;margin:auto;width:' + _this.height + 'px;height:' + _this.height + 'px;background-color:#222222;"></div>');

                second.css({
                    'transform': 'translateZ(-' + _this.height / 2 + 'px) translateY(' + -_this.height / 2 * type + 'px) rotateX(' + 90 * type + 'deg)',
                    '-webkit-transform': 'translateZ(-' + _this.height / 2 + 'px) translateY(' + -_this.height / 2 * type + 'px) rotateX(' + 90 * type + 'deg)',
                    '-moz-transform': 'translateZ(-' + _this.height / 2 + 'px) translateY(' + -_this.height / 2 * type + 'px) rotateX(' + 90 * type + 'deg)',
                });
                showAreaDiv.find('.img').append(second).append(shadowDiv);


                //加入重复的容器
                var repeatDiv = showAreaDiv.find('.img').clone();
                for(var i=2;i<_this.num+1;i++){
                    showAreaDiv.find('.cf_container').append(repeatDiv.clone());
                }
                //为重复容器设置各自样式
                var repeatDivs = showAreaDiv.find('.img');
                for (var i = 0; i < (repeatDivs.length); i++) {
                    repeatDivs.eq(i).css({
                        'transition-delay': _this.delayTime * i + 'ms',
                        '-webkit-transition-delay': _this.delayTime * i + 'ms',
                        '-moz-transition-delay': _this.delayTime * i + 'ms',
                        'z-index':(100-Math.abs(i-Math.ceil(showMyPhotos.num/2))),
                    });
                    repeatDivs.eq(i).find('img').eq(0).css({'clip': 'rect(0 ' + _this.width * (i+1) / showMyPhotos.num + 'px ' + _this.height + 'px ' + _this.width * i / showMyPhotos.num + 'px)',})
                        .end().eq(1)
                        .css({'clip': 'rect(0 ' + _this.width * (i+1) / showMyPhotos.num + 'px ' + _this.height + 'px ' + _this.width * i / showMyPhotos.num + 'px)',});
                    repeatDivs.eq(i).find('.shadowDiv').eq(0).css({
                            'transform': 'translateZ(-' + _this.height / 2 + 'px) translateX(' + (i - showMyPhotos.num/2) * _this.width / showMyPhotos.num + 'px) rotateY(90deg)',
                            '-webkit-transform': 'translateZ(-' + _this.height / 2 + 'px) translateX(' + (i - showMyPhotos.num/2) * _this.width / showMyPhotos.num + 'px) rotateY(90deg)',
                            '-moz-transform': 'translateZ(-' + _this.height / 2 + 'px) translateX(' + (i - showMyPhotos.num/2) * _this.width / showMyPhotos.num + 'px) rotateY(90deg)',
                        })
                        .end().eq(1)
                        .css({
                            'transform': 'translateZ(-' + _this.height / 2 + 'px) translateX(' + (i+1 - showMyPhotos.num/2) * _this.width / showMyPhotos.num + 'px) rotateY(90deg)',
                            '-webkit-transform': 'translateZ(-' + _this.height / 2 + 'px) translateX(' + (i+1 - showMyPhotos.num/2) * _this.width / showMyPhotos.num + 'px) rotateY(90deg)',
                            '-moz-transform': 'translateZ(-' + _this.height / 2 + 'px) translateX(' + (i+1 - showMyPhotos.num/2) * _this.width / showMyPhotos.num + 'px) rotateY(90deg)',
                        });
                }
                //旋转
                setTimeout(function(){
                    showAreaDiv.find('.img').css({
                        'animation-timing-function': 'ease-in',
                        '-webkit-animation-timing-function': 'ease-in',
                        '-moz-animation-timing-function': 'ease-in',
                        'transition-duration': _this.time + 'ms',
                        '-webkit-transition-duration': _this.time + 'ms',
                        '-moz-transition-duration': _this.time + 'ms',
                        'transform': 'rotateX(' + -90 * type + 'deg)',
                        '-webkit-transform': 'rotateX(' + -90 * type + 'deg)',
                        '-moz-transform': 'rotateX(' + -90 * type + 'deg)',
                    });
                },100)

                setTimeout(function () {
                    _this.recoverContainer()
                }, (_this.time+100+showMyPhotos.num*_this.delayTime));
            },

            //百叶窗模式下切换添加元素设置样式
            blindsAddElement: function(type){
                showAreaDiv.find('.img').find('img').eq(0).css({
                    'transform':'translateZ(1px)',
                });
                var _this = this,
                    first = showAreaDiv.find('.img').find('img').eq(0).clone(),
                    second = $('<img src="'+_this.imgArry[_this.now-1]+'" />');

                showAreaDiv.find('.img').append(second);

                for(var i=2;i<_this.num+1;i++){
                    showAreaDiv.find('.img').append(first.clone()).append(second.clone());
                }

                var addStyle = function(obj,value){
                    for(var i=0;i<obj.length;i++){
                        obj.eq(i).css({
                            'clip':'rect(0 '+(i+1)*_this.width/_this.num+'px '+_this.height+'px '+i*_this.width/_this.num+'px)',
                            'transition-delay': _this.delayTime*i+'ms',
                            '-webkit-transition-delay': _this.delayTime*i+'ms',
                            '-moz-transition-delay': _this.delayTime*i+'ms',
                            'animation-timing-function': 'ease',
                            '-webkit-animation-timing-function': 'ease',
                            '-moz-animation-timing-function': 'ease',
                            'transform-origin': (i*_this.width/_this.num+_this.width/(_this.num*2))+'px 0',
                            '-webkit-transform-origin': (i*_this.width/_this.num+_this.width/(_this.num*2))+'px 0',
                            '-moz-transform-origin': (i*_this.width/_this.num+_this.width/(_this.num*2))+'px 0',
                        });
                    }
                }
                var imgDom1 = showAreaDiv.find('.img').find('img:odd'),//第二张
                    imgDom2 = showAreaDiv.find('.img').find('img:even');//第一张
                addStyle(imgDom2,-1);
                addStyle(imgDom1,1);
                imgDom1.css({
                    'transform':'rotateY(-180deg)',
                });
                setTimeout(function(){
                    imgDom1.css({
                        'transition-duration':_this.time+'ms',
                        '-webkit-transition-duration':_this.time+'ms',
                        '-moz-transition-duration':_this.time+'ms',
                        'transform':'rotateY(0deg)',
                        '-webkit-transform':'rotateY(0deg)',
                        '-moz-transform':'rotateY(0deg)',
                    });
                    imgDom2.css({
                        'transition-duration':_this.time+'ms',
                        '-webkit-transition-duration':_this.time+'ms',
                        '-moz-transition-duration':_this.time+'ms',
                        'transform':'rotateY(-180deg) translateZ(1px) ',
                        '-webkit-transform':'rotateY(-180deg) translateZ(1px)',
                        '-moz-transform':'rotateY(-180deg) translateZ(1px)',
                    })
                },100);

                setTimeout(function () {
                    _this.recoverContainer();
                }, (_this.time+100+showMyPhotos.num*_this.delayTime));
            },

            //渐入模式下切换添加元素设置样式
            shadeAddElement: function(){
                var _this = this,
                    first = showAreaDiv.find('.img').find('img').eq(0).clone(),
                    second = $('<img src="'+_this.imgArry[_this.now-1]+'" />');

                first.css({'z-index':'100'});
                showAreaDiv.find('.img').append(first.clone());
                showAreaDiv.find('.img').find('img').each(function(){
                    $(this).animate({
                        'opacity':'0'
                    },_this.time)
                });
                showAreaDiv.find('.img').append(second.clone());
                setTimeout(function () {
                    _this.recoverContainer();
                },(_this.time+100));
            },

            //动画完成后复原容器状态
            recoverContainer: function () {
                var _this = this;
                _this.changeImg();
                showMyPhotos.toggleDom();

                if(_this.showType==1){
                    //删除多余元素
                    showAreaDiv.find('.cf_index').nextAll().remove();
                    showAreaDiv.find('.img').find('img').eq(1).remove();
                    showAreaDiv.find('.cf_container').find('div.shadowDiv').remove();
                }
                if(_this.showType==2||_this.showType==3){
                    showAreaDiv.find('.img').find('img').eq(0).nextAll().remove();
                }

                showAreaDiv.find('.img').css({
                    'transition': '0s',//取消复原时的动画
                    '-webkit-transition': '0s',//取消复原时的动画
                    '-moz-transition': '0s',//取消复原时的动画
                    '-o-transition': '0s',//取消复原时的动画
                    'transform': 'rotateX(0deg)',
                    '-webkit-transform': 'rotateX(0deg)',
                    '-moz-transform': 'rotateX(0deg)',
                });
                showAreaDiv.find('.img').find('img').css({
                    'clip':'auto',
                    'opacity':'1',
                    'transition-duration':'0s',
                    '-webkit-transition':'0s',
                    '-moz-transition':'0s',
                    'transform': 'rotateY(0deg)',
                    '-webkit-transform': 'rotateY(0deg)',
                    '-moz-transform': 'rotateY(0deg)',
                });
            },

            //点击时隐藏按钮
            toggleDom: function () {
                showAreaDiv.find('.cf_left').toggleClass('cf_hide');
                showAreaDiv.find('.cf_right').toggleClass('cf_hide');
                showAreaDiv.find('.cf_index').toggleClass('cf_hide');
            },

            //预加载图片 添加索引节点 判断是否加载完成
            imgLoad: function (now,type) {
                var _this = this,
                    content = '';
                if(!now&&!type){
                    showAreaDiv.find('.cf_index').html('');

                    for(var i=0;i<_this.imgArry.length;i++){
                        var Img = new Image();
                        Img.src = _this.imgArry[i];

                        content+='<li></li>';
                    }

                    var contentDom = $(content);
                    contentDom.eq(0).addClass('cf_choosed');
                    showAreaDiv.find('.cf_index').append(contentDom);
                }else{
                    var Img = new Image();
                    Img.src = _this.imgArry[now-1];

                    //加载出错时
                    Img.onerror = function () {
                        _this.now--;
                        alert('Error loading image!')
                    };

                    //加载成功后
                    Img.onload = function () {
                        showMyPhotos.toggleDom();
                        switch(_this.showType){
                            case 1: showMyPhotos.cubeAddElement(type);break;
                            case 2: showMyPhotos.blindsAddElement(type);break;
                            case 3: showMyPhotos.shadeAddElement();break;
                        }
                    };
                }
            },
        };

        showMyPhotos.init();

        //上一张
        showAreaDiv.find('.cf_prev').unbind('click').on("click", function () {
            if (showMyPhotos.now == 1)return;
            showMyPhotos.now--;
            showMyPhotos.imgLoad(showMyPhotos.now,-1);
        });

        //下一张
        showAreaDiv.find('.cf_next').unbind('click').on("click", function () {
            if (showMyPhotos.now == showMyPhotos.imgArry.length)return;
            showMyPhotos.now++;
            showMyPhotos.imgLoad(showMyPhotos.now,1);
        });

        //点击跳转
        showAreaDiv.find('.cf_index').unbind('click').on('click','li',function(){
            var before = showAreaDiv.find('.cf_container').find('.cf_choosed').index()+1;
            showMyPhotos.now = $(this).index()+1;

            showAreaDiv.find('.cf_container').find('.cf_choosed').removeClass('.cf_choosed');
            $(this).addClass('.cf_choosed');

            if(before != showMyPhotos.now){
                var type = 0;
                if(before>showMyPhotos.now){
                    type = -1;
                }else{
                    type = 1;
                }
                showMyPhotos.imgLoad(showMyPhotos.now,type);
            }
        })
    };

    photosShow();

    $('#setting').click(function(){
        var time = $('#rotateTime').val();
        var delaytime = $('#delayTime').val();
        var num = $('#rotateNum').val();
        var showType = $('#showType').val();
        photosShow('',showType,num,time,delaytime);
    })
});