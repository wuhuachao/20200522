let indexModule = (function () {
    let $baseBox = $('.baseBox'),
        $baseBoxText = $baseBox.find('span'),
        $baseBoxSingout = $baseBox.find('a'),
        $menuBox = $('.menuBox');
    //基于发布订阅管理我们获取到个人信息和权限信息后要处理的事情
    let $plan = $.Callbacks();
    //显示欢迎的基本信息和退出登录
    $plan.add((_, baseinfo) => {
        let Timer = new Date().getHours(),
            TimerStr = null;

		if(Timer>=5 && Timer<8){
            TimerStr = '早上好';
        }else if(Timer>=8 && Timer<12){
            // console.log('上午好');
            TimerStr = '上午好';
        }else if(Timer>=12 && Timer<14){
            TimerStr = '中午好';
        }else if(Timer>=14 && Timer<19){
            TimerStr = '下午好';
        }else if(Timer>=19 && Timer<=23){
            TimerStr = '晚上好';
        }else{
            TimerStr = '亲，现在是凌晨时间，注意休息哦！';
        }
        $baseBoxText.html(`${TimerStr}！${baseinfo.name||''}`);
        $baseBoxSingout.click(async ()=>{
            let result = await axios.get('/user/signout');
            if(result.code === 0){
                window.location.href = 'login.html';
                return;
            }
            alert('当前网络繁忙，请稍后再重试')
        })
    });
    //权限处理（控制左侧MENU的渲染）
    $plan.add(power=>{
        let str = ``;
        //如果包含了userhandle的权限，则显示
        if(power.includes('userhandle')){
            str+=`<div class="itemBox text="员工管理">
            <h3>
               <i class="iconfont icon-yuangong"></i>
               员工管理
            </h3>
            <nav class="item">
               <a href="">员工列表</a>
               <a href="">新增员工</a>
            </nav>
            </div>`;
        }
        if(power.includes('departhandle')){
            str += `<div class="itemBox" text="部门管理">
				<h3>
					<i class="iconfont icon-guanliyuan"></i>
					部门管理
				</h3>
				<nav class="item">
					<a href="">部门列表</a>
					<a href="">新增部门</a>
				</nav>
			</div>`;

        }
        if(power.includes('jobhandle')){
            str += `<div class="itemBox" text="职务管理">
            <h3>
                <i class="iconfont icon-zhiwuguanli"></i>
                职务管理
            </h3>
            <nav class="item">
                <a href="">职务列表</a>
                <a href="">新增职务</a>
            </nav>
        </div>`;
            
        }
        if(power.includes('customer')){
            str += `<div class="itemBox" text="客户管理">
				<h3>
					<i class="iconfont icon-kehuguanli"></i>
					客户管理
				</h3>
				<nav class="item">
					<a href="">我的客户</a>
					${power.includes('customerall')?`<a href="">全部客户</a>`:``}
					<a href="">新增客户</a>
				</nav>
			</div>`;
            
        }
        $menuBox.html(str);
        
        
    })
    return {
        async init() {
            //1.验证当前用户是否登录
            let result = await axios.get('/user/login');
            if (result.code != 0) {
                //未登录
                alert('亲，您还没有登录喔！');
                window.location.href = 'login.html';
                return;

            }
            //2.获取登录用户的权限信息和个人信息（AJAX并行）
            let [power, baseinfo] = await axios.all([
                axios.get('/user/power'),
                axios.get('/user/info')
            ]);
            power.code === 0 ? power = power.power : null;
            baseinfo.code === 0 ? baseinfo = baseinfo.data : null;
            //3.通知计划表执行任务
            $plan.fire(power, baseinfo);

        }
    }
})();
indexModule.init();

// 验证是否登录【和下面的请求是AJAX串行】
// 👇
// 获取权限信息【下面两个AJAX是并行的，相互间没有依赖】
// 👉
// 获取个人信息

// 用户一旦登录，获取登录用户的权限和个人信息，是不需要给服务器传递额外参数的，
// 浏览器会默认把connert.sid传递给服务器，服务器基于sid可以找到之前登录成功的时候存储的用户信息