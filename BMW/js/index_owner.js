/**
 * 本文件主要是owner product的js交互代码
 */
$(function(){
    var ownerObj = {
        //表格头数据
        tableHead : [
            {
                name : "Category",
                key : "name"
            },
            {
                name : "Product",
                key : "date"
            },
            {
                name : "Critial Level",
                key : "name"
            },
            {
                name : "Unit Price",
                key : "name"
            },
            {
                name : "Quantity",
                key : "Quantity"
            },
            {
                name : "Cost Type",
                key : "Cost"
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
        // 填充本页table
        fillTableDom : function(data){
            this.rightContentContainer.html('');
            var contentStr = ''; //table的dom

            //关于表格的操作
            contentStr += '<div class="tableOperate">' +
                // '<span class="glyphicon glyphicon-import" title="import"></span>' +
                '<span class="glyphicon glyphicon-download-alt" title="Export to excel"></span>' +
                '</div>';

            //table的数据
            contentStr += '<table class="table table-striped table-bordered table-hover contentTable finishedTable"><tr>';

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
                        str += '<td>'+ (data[j][this.tableHead[i].key] || "owner") + i +'</td>';
                    }
                }
                str += '</tr>';
                contentStr += str;
            }

            contentStr += '</table>';

            this.rightContentContainer.append(contentStr);
        },
        //查询本页数据
        query : function(){
            var self = ownerObj;

            $.ajax({
                url : window.serveIp + '/account/products',
                type : 'GET',
                success : function(res){
                    console.log(res);
                },
                error : function(err){
                    console.log(err);
                }
            });

            var data = [{},{},{},{},{},{},{},{},{}];

            self.fillTableDom(data);
            window.commonFun.fillPageDom(20,function(page){
                console.log('点击的翻页数为：',page)
            });
            window.commonFun.fillLabelPageDom();
        }
    };
    window.ownerObj = ownerObj;

    window.routers.route('#/product',ownerObj.query);
});