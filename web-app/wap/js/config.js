function getRootPath() {
	// 获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
	var curWwwPath = window.document.location.href;
	// 获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
	var pathName = window.document.location.pathname;
	if (pathName == '/') {
		return curWwwPath.substring(0, curWwwPath.length - 1);
	}
	var pos = curWwwPath.indexOf(pathName);
	// 获取主机地址，如： http://localhost:8083
	var localhostPaht = curWwwPath.substring(0, pos);
	// 获取带"/"的项目名，如：/uimcardprj
	var projectName = pathName
			.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPaht + projectName);
}

var config = {
    beginTime: undefined, //第一条数据的时间戳
    endTime: undefined, //最后一条数据的时间戳
    cpage: 1, //当前第几页，从1开始
    pagesize: 10, //默认分页大小
    server: location.protocol + '//' + location.host,
    server: getRootPath() + '/servlet/ACSClientHttp', //模拟接口用  
    localimage : getRootPath(),
    image:  'http://www.dingboyiliao.com/dingbo',//根据具体情况来定
    version:'v0.1'
};

config.api_url = config.server;//接口地址
config.gid = '77e4d92cfb81cc736863b6e2abec94f6f407ce78';//微信参数，后台获取
config.token = 'bd23bc4a59a6157bf03a7c62103264e5';//微信参数，后台获取

// 项目参数
config.baidu_ak = 'sUGDHo4dOfAZ6Lmy8EogHMly';

//接口定义

//提示信息
config.tips = {
	server: '服务器异常，请稍后再试～',
	timeout: '请求超时啦，请重试～',
	nodata: '暂无数据~',
	nomoredata: '没有更多数据啦~',
	loading: '加载中……',
	login: '登录跳转中...'
};
