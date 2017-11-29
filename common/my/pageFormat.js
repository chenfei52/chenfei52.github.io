/**
 * Created by feichen on 2017/3/5.
 */
window.onload = function(){
        var pageFormate = {
            //页面阅读进度
            redProgress : function(){
                var container = document.createElement('div'),
                    body = document.getElementsByTagName('body')[0];

                container.id = 'pageProgress';
                container.innerHTML = '<span class="slider"></span>';
                body.appendChild(container);

                //监听鼠标滚动
                var max = document.body.scrollHeight - window.innerHeight,
                    slider = container.getElementsByClassName('slider')[0];

                window.onscroll = function(){
                    console.log(document.body.scrollTop);
                    var scroll = document.body.scrollTop;
                    slider.style.width = 100*scroll/max+'%';
                }
            },
            //文章加标题
            addTitle: function () {
                var container = document.getElementsByClassName('studyContent')[0],
                    titles = container.getElementsByClassName('title');
                for (var i = 0; i < titles.length; i++) {
                    var text = titles[i].innerHTML;
                    titles[i].innerHTML = i + 1 + '.' + titles[i].innerHTML
                }
            },
            //代码格式化
            codeFormate: function () {
                var codeDom = document.getElementsByTagName('code');
                var replaceData = [
                    {
                        "class": 'blue',
                        "data": [
                            ['var ', 'var', ' '],
                            ['for\\(', 'for', '('],
                            ['return ', 'return', ' '],
                            ['function', 'function', ''],
                            ['switch', 'switch', ''],
                            ['case', 'case', ''],
                            ['if\\(', 'if', '('],
                            ['else if', 'else if', ''],
                            ['else\\{', 'else', '{']
                        ]
                    },
                ];
                for (var i = 0; i < codeDom.length; i++) {
                    var str = codeDom[i].innerHTML;
                    replaceData.forEach(function (val, n) {
                        var data = replaceData[n];
                        data.data.forEach(function (val, m) {
                            var change = data.data[m],
                                reg = '/' + change[0] + '/g',
                                strs = '<span class="' + data.class + '">' + change[1] + '</span>' + change[2] || '';
                            str = str.replace(eval(reg), strs);
                        })
                    });

                    str = str.replace(/\/\/\s(.*?)\n/g, '<span class="note">// $1\n</span>');
                    // str = str.replace(/\'(.*?)\'/g,'<span class="note">$1\n</span>');
                    codeDom[i].innerHTML = str;
                }
            }
        };

        //执行函数
        for(var fun in pageFormate){
            pageFormate[fun]();
        }
    };
