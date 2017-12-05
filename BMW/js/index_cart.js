$(function(){
    var cartObj = {
        //表格头数据
        tableHead : [
            {
                name : "Category",
                key : "category__name"
            },
            {
                name : "Product",
                key : "name"
            },
            {
                name : "Critial Level",
                key : "c_level"
            },
            {
                name : "Unit Price",
                key : "price"
            },
            {
                name : "Quantity",
                key : "quantity"
            },
            {
                name : "Cost Type",
                key : "cost_type"
            },
            {
                name : "Cost",
                key : "Quantity"
            },
            {
                name : "MA-Cost",
                key : "Quantity"
            },
            {
                name : "Opt-Cost",
                key : "Quantity"
            }
        ],
        rightContentContainer : $('#rightContent'),
        /**
         * 添加表格dom
         * @param data：展示的购物车数据
         *        isGetDom：是否只是为了获取dom元素， 用户评估历史列表里面调用
         * */
        fillTableDom : function(data , isGetDom){
            if(!isGetDom) this.rightContentContainer.html('');

            var titleStr = '',//购物车标题组件
                contentStr = '', //table的dom
                cartTitle = data.name;
            data = data.items;

            $('#cartNumber').text(data.length); //更新左侧菜单购物车数目

            //购物车title
            titleStr = '<div class="cartTitle"> ' +
                '<span class="labels">Evaluation Name:</span>' +
                '<span>'+ cartTitle +'</span>' +
                // '<input class="form-control" id="cartTitle" type="text" /> ' +
                // '<span class="glyphicon glyphicon-floppy-saved"></span>' +
                '</div>';


            //下面组装table的数据
            contentStr = '<table class="table table-striped table-bordered table-hover contentTable cartTable"><tr>';

            for(var i = 0;i<this.tableHead.length;i++){
                contentStr += '<td>'+ this.tableHead[i].name +'</td>'
            }
            contentStr += '</tr>'

            for(var j = 0;j<data.length;j++){
                var str = '<tr>';
                for(var i = 0;i<this.tableHead.length;i++){
                    if(this.tableHead[i].key == 'autoAdd'){
                    }else if(this.tableHead[i].key == 'btnOperate'){
                    }else{
                        str += '<td>'+ (data[j][this.tableHead[i].key] || "")+'</td>';
                    }
                }
                str += '</tr>';
                contentStr += str;
            }

            contentStr += '</table>';
            if(isGetDom){
                return titleStr + contentStr;
            }

            // 确定按钮
            contentStr += '<button class="btn btn-default" id="saveEvaluation">Complete Evaluation</button>';
            var domStr = titleStr + contentStr;

            this.rightContentContainer.append(domStr);

            //本组件的事件
            $('#saveEvaluation').unbind().click(function(){
                var customModal = '';   // 弹出框dom
                customModal += '<div class="confirmCartTitle">' +
                    '<p>This Eva Name is:</p>' +
                    '<input class="form-control" value="'+ cartTitle +'" id="cartTitle" type="text" />' +
                    '<p>Do you confirm this name?</p>' +
                    '<button class="btn btn-primary titleSure">Confirm</button>' +
                    '</div>';

                window.commonFun.customModal(customModal, ["320px","170px"] , function(index){
                    $('#customModal .titleSure').click(function(){
                        var title = $('#cartTitle').val();
                        if(!title.trim()){
                            Msg.warning('The title can not be empty!');
                        }
                        $.ajax({
                            url:window.serveIp + '/evaluation/complete',
                            type:'POST',
                            data:{
                                title:title
                            },
                            success:function(res){
                                if(res.status == 0){
                                    Msg.error('Complete success');
                                }
                                else{
                                    Msg.error('Complete failure');
                                }
                            },
                            error:function(err){
                                console.log(err);
                                Msg.error('Complete failure');
                            }
                        });

                        layer.close(index);
                    });
                });
            })
        },
        //查询购物车数据
        query : function(){
            var self = cartObj;

            $.ajax({
                url : window.serveIp + '/evaluation/',
                type : 'GET',
                success : function(res){
                    if(res.status != 0){
                        Msg.error('Query failure');
                    }else{
                        var data = res.result;
                        self.fillTableDom(data);
                    }
                },
                error : function(err){
                    Msg.error('Query failure');
                    console.log(err);
                }
            });
        }
    };
    window.cartObj = cartObj;

    window.routers.route('#/my_cart',cartObj.query);
});