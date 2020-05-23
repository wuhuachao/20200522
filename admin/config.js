module.exports = {
	//=>WEB服务端口号
	PORT: 80,

	//=>CROS跨域相关信息
	CROS: {
		ALLOW_ORIGIN: 'https://wuhuachao.github.io/',//允许的这个客户端的地址
		ALLOW_METHODS: 'PUT,POST,GET,DELETE,OPTIONS,HEAD',
		HEADERS: 'Content-Type,Content-Length,Authorization, Accept,X-Requested-With',
		CREDENTIALS: true
	},

	//=>SESSION存储相关信息
	SESSION: {
		secret: 'ZFPX',
		saveUninitialized: false,
		resave: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24 * 30    //过期时间 （30天）
		}
	}
};