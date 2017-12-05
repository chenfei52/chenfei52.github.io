/**
* 用于主体框架js 虽然很少  O(∩_∩)O哈哈~
*/

$(function(){
    //获取当前用户名字
    var userName = localStorage.getItem('userName');
    if(!userName)
        reLogin();
    $('#loginUserName').text(userName);
});