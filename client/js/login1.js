let loginModule = (function () {
    let $username = $('.userName'),
        $userPass = $('.userPass'),
        $submit = $('.submit');
        async function login(){
            let account = $username.val().trim(),
                password = $userPass.val().trim();
            //格式校验（非空格式）
            if (account === "" || password === "") {
                alert('亲，账号和密码不能为空！');
                return;
            }
            
            //给密码MD5加密
            password = md5(password);
            //发送POST请求，把获取的账号和密码传递给服务器
            let result = await axios.post('/user/login', {
                account,
                password

            }); 
                //result从服务器获取的响应主体信息
                if (parseInt(result.code) === 0) {
                    alert('登录成功，即将跳转到首页'); 
                    window.location.href = 'index.html';
                    return;
                }
                alert('您输入的账号密码不正确，请重新输入！');
        };
    
    function handle() {   
        $submit.click(login);
    }
    return {
        init() {
            handle();

        }
    }
})();
loginModule.init();