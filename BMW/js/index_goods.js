//本文件主要是商品页的js交互代码
$(function(){
    var goodsObj = {
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
                name : "Desc",
                key : "desc"
            },
            {
                name : "Unit Price",
                key : "price"
            },
            {
                name : "Cost Type",
                key : "cost_type"
            },
            {
                name : "",
                key : "btnOperate"
            }
        ],
        labelCon : '', //保存当前选中的标签
        goodsConditions : {
            offset : 15,
            page : 1
        }, //保存当前的查询条件
        rightContentContainer : $('#rightContent'),
        //填充商品页dom
        fillGoodsDom : function(data,conditions){
            this.rightContentContainer.html('');

            //标签页Dom
            var labelData = JSON.parse(localStorage.getItem('labelData'));
            if(labelData){
                window.commonFun.fillLabelPageDom(labelData,this.labelCon);
            }else{
                reLogin();
            }

            var contentStr = ''; //table的dom

            //下面组装table的数据
            contentStr = '<table class="table table-striped table-bordered table-hover contentTable goodsTable"><tr>';

            for(var i = 0;i<this.tableHead.length;i++){
                contentStr += '<td>'+ this.tableHead[i].name +'</td>'
            }
            contentStr += '</tr>'
            for(var j = 0;j<data.length;j++){
                var str = '<tr>';
                for(var i = 0;i<this.tableHead.length;i++){
                    if(this.tableHead[i].key === 'autoAdd'){
                        str += '<td>'+ (j+1) +'</td>';
                    }else if(this.tableHead[i].key === 'btnOperate'){
                        str += '<td>' +
                            '<span class="addCart" title="Add to cart"><i class="glyphicon glyphicon-plus"></i></span>';
                        '</td>';
                    }else{
                        str += '<td>'+ (data[j][this.tableHead[i].key] || '') +'</td>';
                    }
                }
                str += '</tr>';
                contentStr += str;
            }
            contentStr += '</table>';

            //筛选条件
            var condition = window.commonFun.getConditionsStr(conditions, goodsObj.goodsConditions);

            this.rightContentContainer.append(condition);
            this.rightContentContainer.append(contentStr);


            //绑定元素的事件

            //添加到购物车
            $("#rightContent .addCart").click(function(){
                var index = $(this).parents('tr').index();
                console.log('当前点击的行数为：',index)
                window.commonFun.openGoodsDetail(data[index-1]);
            });

            //标签页点击事件
            $('.nav-tabs li').unbind().click(function(){
                $('.nav-tabs li.active').removeClass('active');
                $(this).addClass('active');
                var val = $(this).attr('valueS'),
                    param = '';
                goodsObj.goodsConditions = {
                    offset : 15,
                    page : 1
                };
                goodsObj.labelCon = val;
                goodsObj.query();
            });

            //筛选条件点击事件
            $('#goodsConditions .con').click(function(){
                $(this).parents('p').find('.con').removeClass('active');
                $(this).addClass('active');
                var val = $(this).attr('val');
                var key = $(this).parents('p').attr('val');
                goodsObj.goodsConditions[key] = val;    //保存当前的查询条件
                goodsObj.query();
            });


        },
        //查询本页数据
        // @param refresh 表示为路由切换时刷新页面
        query : function(refresh){
            var self = goodsObj,param = '';
            if(refresh){
                self.labelCon = '';
                goodsObj.goodsConditions = {
                    offset : 15,
                    page : 1
                };
            }
            self.labelCon = self.labelCon || 'Server';
            for(var key in goodsObj.goodsConditions){
                param += '&' + key + '=' + goodsObj.goodsConditions[key]
            }
            param = param.slice(1);

             $.ajax({
                 url : window.serveIp + '/product/' + self.labelCon + '?' + (param || ''),
                 type : 'GET',
                 success : function(res){
                     if(res.status != 0){
                         Msg.error('Query failure');
                     }else{
                         var data = res.result.data;
                         self.fillGoodsDom(data, res.result.filter);
                         //分页
                         window.commonFun.fillPageDom(res.pageinfo.total,function(page){
                             goodsObj.goodsConditions.page = page;
                             goodsObj.query();
                             console.log('点击的翻页数为：', page);
                         });
                     }
                 },
                 error : function(err){
                     Msg.error('Query failure');
                     console.log(err);
                 }
             })
        }
    };
    window.goodsObj = goodsObj;

    window.routers.route('#/new_eva',goodsObj.query);
});