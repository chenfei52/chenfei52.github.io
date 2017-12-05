$(function(){
    var finishObj = {
        //已完成购物车信息
        tableHead : [
            {
                name : "No",
                key : "autoAdd"
            },
            {
                name : "Evaluation Name",
                key : "name"
            },
            {
                name : "Submit Date",
                key : "date"
            },
            {
                name : "one time",
                key : "name"
            },
            {
                name : "MA/Oer.",
                key : "name"
            },
            {
                name : "operate",
                key : "btnOperate"
            }
        ],
        rightContentContainer : $('#rightContent'),

        /**
         * 组装finished evaluation页面的DOM
         * @param {arry} data ：展示数据
         */
        fillFinishChartDom : function(data){
            this.rightContentContainer.html('');
            var contentStr = '', //table的dom
                tabData = this.tableHead;

            //下面组装table的数据
            contentStr = '<table class="table table-striped table-bordered table-hover contentTable finishedTable"><tr>';

            for(var i = 0;i<tabData.length;i++){
                contentStr += '<td>'+ tabData[i].name +'</td>'
            }
            contentStr += '</tr>'

            for(var j = 0;j<data.length;j++){
                var str = '<tr>';
                for(var i = 0;i<tabData.length;i++){
                    if(tabData[i].key == 'autoAdd'){
                        str += '<td>'+ (j+1) +'</td>';
                    }else if(tabData[i].key == 'btnOperate'){
                        str += '<td>' +
                            // '<span class="copy" title="copy to new"><i class="glyphicon glyphicon-copy"></i></span>' +
                            '<span class="delete" title="delete"><i class="glyphicon glyphicon-trash"></i></span>' +
                            '</td>';
                    }else{
                        var className = '';
                        if(tabData[i].name === 'Evaluation Name'){
                            className = 'cartTitle_c';
                        }
                        str += '<td class="'+ className +'">'+ (data[j][tabData[i].key] || "测试数据") +'</td>';
                    }
                }
                str += '</tr>';
                contentStr += str;
            }

            contentStr += '</table>';

            this.rightContentContainer.append(contentStr);

            //事件
            //点击用户评估历史name弹出详情
            $('.finishedTable .cartTitle_c').unbind().click(function(){
                $.ajax({
                    url : window.serveIp + '/evaluation/detail/<id>',
                    type : 'GET',
                    success : function(res){
                        console.log(res);
                    },
                    error : function(err){
                        console.log(err);
                    }
                });

                var index = $(this).parents('tr').index(),
                    data = [{},{},{},{},{},{},{},{},{}],
                    dom = window.cartObj.fillTableDom(data, true);
                dom = '<div id="toogleRightContent">' +
                    '<span><-返回</span>' +
                    '</div>' + dom;

                window.commonFun.toogleReplaceRight(dom);

                $('#toogleRightContent span').click(function(){
                    window.commonFun.toogleReplaceRight('', true);
                });
                console.log('当前点击的行数为:','index');
            });

            //点击删除删除评估历史
            $('.finishedTable .delete').unbind().click(function(){
                var index = $(this).parents('tr').index();
                window.commonFun.selfConfirm('You sure delete this?',function(){
                    console.log('要删除的行数为:',index);

                    $.ajax({
                        url : window.serveIp + '/evaluation/<id>',
                        type : 'DELETE',
                        success : function(res){
                            console.log(res);
                        },
                        error : function(err){
                            console.log(err);
                        }
                    });
                })
            });
        },

        //获取本页数据
        query : function (){
            var self = finishObj;

            $.ajax({
                url : window.serveIp + '/evaluation/all',
                type : 'GET',
                success : function(res){
                    console.log(res);
                },
                error : function(err){
                    console.log(err);
                }
            });

            var data = [{},{},{},{},{},{},{},{},{}];
            self.fillFinishChartDom(data);
            //分页
            window.commonFun.fillPageDom(20,function(page){
                console.log('点击的翻页数为：',page)
            });
        }
    };
    window.finishObj = finishObj;

    window.routers.route('#/finish_eva',finishObj.query);
});