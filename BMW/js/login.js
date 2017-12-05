$(function(){
//rember me
    var  remberMe = localStorage.getItem('remberMe') || false;
    if(remberMe){
        $('#remberMe').attr('checked','checked');
        var message = decodeURIComponent(getCookie('userMessage'));
        $('#username').val(message.split(',')[0]);
        $('#password').val(message.split(',')[1]);
    }

//异常退出登录提示
    if(location.href.indexOf('error=true')!=-1){
        if(!window.errortips){
            Msg.warning('Login exception');
        }
    }

// 监听回车事件
    $('.loginContainer input.password').on('keyup',function(event){
        if(event.which === 13){
            $('.login').trigger('click');
        }
    });

//登录
    $('.login').click(function(){
        var username = $('#username').val().trim(),
            password = $('#password').val();

        if(!username || !password){
            Msg.warning('The username or password is empty!');
            return false;
        }

        var param = {
            username: username,
            password: password
        };

        $.ajax({
            url:window.serveIp + '/account/login',
            type:'POST',
            data:param,
            success:function(res){
                if(res.status == 0){
                    //存入缓存
                    var userMessage = encodeURIComponent((username + ',' + password));
                    setCookie('userMessage', userMessage, 15);

                    //storage保存标签页数据
                    localStorage.setItem('labelData',JSON.stringify(res.result.labels || ['Server','Middleware','Storage','license']));
                    //保存用户名
                    localStorage.setItem('userName',username);

                    location.href = 'index.html#/new_eva';
                }
                else{
                    Msg.error('Login failure');
                }
            },
            error:function(err){
                console.log(err);
                Msg.error('Login failure');
            }
        })
    });
//记住我
    $('#remberMe').click(function(){
        console.log(this.checked);
        if(this.checked){
            remberMe = true;
            localStorage.setItem('remberMe',remberMe);
        }else{
            remberMe = false;
            localStorage.removeItem('remberMe');
        }
    });
});