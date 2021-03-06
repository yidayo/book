function CatCan() {

	this.catRequestAnimationFrameId = 0;//动画回调函数的ID

	this.catStoreTx = [];
	this.catStoreTy = [];
	this.catStackTop = 0;

	this.catCtx = null;
	this.catTimes = 0;

	this.catFlagAxis = false;

	this.canvas = null;

	this.catTreePic = [];//pic
	this.catTreeImg = [];//img
	this.catTreeAni = [];//animation
	this.catTreePlay = [];//playList

};

CatCan.prototype.init = function(divId,animation) {

	var catCan = this;

	/*	
		待处理参数列表:
		1.json对象*
		2.tagName=="div",添加canvas的容器*
		3.null,continue
		4."axis",显示轴
		5."xy",点击显示坐标
		6.{w,h},实际显示的宽度高度,默认1000x1000
	*/

	//处理参数1
	if(!(animation&&animation.width&&animation.height&&animation.img&&animation.animation&&animation.playList)) {
		console.error("Function'init',parameter 2 is not a valid profile.");
		return;
	}

	//处理参数3-6
	var canvasWH = {w:animation.width,h:animation.height};//参数6默认值
	var catFlagXY = false;//参数5默认值
	for(var i=2;i<arguments.length;i++) {
		if(arguments[i]==null) continue;//参数3
		if(typeof arguments[i] === "string") {
			switch(arguments[i]) {
			case "axis"://参数4
				this.catFlagAxis = true;
				break;
			case "xy"://参数5
				catFlagXY = true;
			}
		} else if(typeof arguments[i].w === "number" && typeof arguments[i].h === "number") {
			canvasWH = arguments[i];//参数6
		}
	}

	//缩放倍率
	if(canvasWH.w/animation.width*animation.height<canvasWH.h) {//宽度限制比例
		this.catTimes = canvasWH.w/animation.width;
	} else {//高度限制比例
		this.catTimes = canvasWH.h/animation.height;
	}

	//处理参数2:创建canvas标签相关
	var div = document.getElementById(divId);
	if(div.tagName==="DIV") {
		div.innerHTML = '<canvas width="'+canvasWH.w+'" height="'+canvasWH.h+'"></canvas>';
		this.canvas = div.firstChild;
		//处理参数5:是否点击canvas标签时显示坐标点
		if(catFlagXY) {
			this.canvas.addEventListener("mousedown",function(e) {
				var eRect = div.firstChild.getBoundingClientRect();
				var x = e.clientX - eRect.left;
				var y = e.clientY - eRect.top;
				console.log(x,y);
			});
		}
	} else {
		console.error("Function'init',parameter 1 is not a valid profile.");
		return;
	}

	//处理参数1:创建图片,创建图层,创建动画,创建队列
	for(var i in animation.pic) {//创建图片
		var pic = new Image();
		pic.src = animation.pic[i];
		this.catTreePic[i] = pic;
	}
	this.catTreeImg = animation.img;//创建图层
	this.catTreeAni = animation.animation;//创建动画
	for(var i in this.catTreeAni) {
		var ani = this.catTreeAni[i];
		ani.data = [];//储存数据的数组
		var fS = ani[4],regexp = /[a-z]{2}[A-Z]{1}[a-z]{2}\(-?([\w.])*(,-?[\w.]*)*\);?/g;//fS:funString
		var iFA = fS.match(regexp);//iFA:initFunArray
		fS = fS.replace(regexp,"");
		for(var i in iFA) {
			var fN = iFA[i].substr(0,5);//fN:funName
			var ps = iFA[i].substr(5).match(/-?[\w.]+/g);//ps:parameters
			var re = this.tool[fN](i,ps);//把工具函数返回的信息和代表数字的flag存起来
			fS = re.fun+fS;
			ani.data[i] = re.data;
			ani.data[i].flag = re.flag;
		}
		ani.fun = new Function(fS);
	}
	this.catTreePlay = animation.playList;//创建

	//属性1-3:栈相关
	this.catStoreTx[0] = 0;
	this.catStoreTy[0] = 0;

	//属性4:画板对象
	this.catCtx = this.canvas.getContext("2d");

	console.log(this);
};

CatCan.prototype.playAnimation = function(listNo) {
	
	if(this.catRequestAnimationFrameId!=0) {//如果有动画在运行,取消该动画
		cancelAnimationFrame(this.catRequestAnimationFrameId);
	}

	var catCan = this;
	var ctx = this.catCtx;
	function loop() {
		var top = catCan.catStackTop;
		for(var i=0;i<top;i++) {
			ctx.restore();
			catCan.catStackTop--;
		}
		ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
		ctx.save();
		for(var i in catCan.catTreePlay[listNo]) {
			draw(catCan.catTreePlay[listNo][i]);
		}
		ctx.restore();
		requestAnimationFrame(loop);
	};
	function draw(aniNo) {
		var catAni = catCan.catTreeAni[aniNo];
		if(catAni.fun()) catAni.fun();//运行函数
		for(var i=0;i<catAni[0];i++) {//向上的核心部分
			catCan.catStackTop--;
			ctx.restore();
		}
		var tx = catAni[6];
		var ty = catAni[7];

		ctx.save();//以下几行是入栈操作
		catCan.catStoreTx[catCan.catStackTop] = catAni[6]||0;
		catCan.catStoreTy[catCan.catStackTop] = catAni[7]||0;

		ctx.translate(tx*catCan.catTimes,ty*catCan.catTimes);//移动轴
		ctx.rotate(catAni[5]);//旋转坐标系
		ctx.scale(catAni[8],catAni[9]);//缩放
		ctx.globalAlpha = catAni[10];//透明度
		ctx.globalCompositeOperation = catAni[11]||"source-over";//绘画方式
		var imgNo = catAni[1];

		var dx = catAni[2] - catCan.catStoreTx[catCan.catStackTop];
		var dy = catAni[3] - catCan.catStoreTy[catCan.catStackTop];
		catCan.catStackTop++;

		var catImg = catCan.catTreeImg[imgNo];
		var img = catCan.catTreePic[catImg[0]];

		ctx.drawImage(img,catImg[1],catImg[2],catImg[3],catImg[4],dx*catCan.catTimes,dy*catCan.catTimes,catImg[3]*catCan.catTimes,catImg[4]*catCan.catTimes);//画图
		if(catCan.catFlagAxis) {//标出轴的位置
			ctx.fillStyle = "rgb(200,0,0)";//调试用红点(表示坐标轴)
			ctx.fillRect(0,0,5,5);//调试用红点
		}
	};

	this.catRequestAnimationFrameId = requestAnimationFrame(loop);
};

CatCan.prototype.addListener = function(listener,fun) {//响应器

	var catCan = this;

	if(typeof listener==="string") {//处理listener
		listener = document.getElementById(listener);
		if(listener===null) {//如果id找不到
			console.error("Function'addListener',parameter 1 is not a right parameter.");
			return;
		}
	}

	function getData(moveFlag,e) {
		var eRect = catCan.canvas.getBoundingClientRect();
		var x = e.clientX - eRect.left;//相对于canvas左上角的坐标
		var y = e.clientY - eRect.top;
		var event;//触发的动作:drag,move,up,in,out
		switch(moveFlag) {
			case 0:
				if(e.buttons) event="drag";
				else event="move";
				break;
			case 1:
				event="down";
				break;
			case 2:
				event="up";
				break;
			case 3:
				event="in";
				break;
			case 4:
				event="out";
		}
		return {x:x,y:y,event:event};
	};

	listener.addEventListener("mousemove",function(e) {
		fun(getData(0,e));
	},false);
	listener.addEventListener("mousedown",function(e) {
		fun(getData(1,e));
	},false);
	listener.addEventListener("mouseup",function(e) {
		fun(getData(2,e));
	},false);
	listener.addEventListener("mouseenter",function(e) {
		fun(getData(3,e));
	},false);
	listener.addEventListener("mouseleave",function(e) {
		fun(getData(4,e));
	},false);
};

CatCan.prototype.tool = {
	/*
		函数工具集
		f:function 表示函数为该动画的第几个预处理函数
		ps:parameters 参数集
		return {
			"data": data,//运算得出的数组集合
			"flag": 0,//数组集合的角标
			"fun": fun//待执行的函数体字符串
		}
	*/
	//trEll: translateEllipse(按椭圆方式移动轴)
	trEll: function(f,ps) {
		/*
			参数:
			1.x半轴
			2.y半轴
			3.速度
			4.中心横坐标(可选)
			5.中心纵坐标(可选)
		*/
		if(ps.length!=3&&ps.length<5) {
			console.error("Function 'trEll' missing argument.");
			return;
		}
		
		ps = ps.map(Number);//字符串数组转数字数组
		var x=ps[3]||0,y=ps[4]||0;
		var step = (ps[0]>ps[1])?1/ps[0]:1/ps[1],points=[],fun="";//f:fun
		for(var i=0;i<2*Math.PI;i+=step) {
			var point={
				x:x+ps[0]*Math.cos(i),
				y:y+ps[1]*Math.sin(i)
			};
			points.push(point);
		}
		var fun = "var df=this.data["+f+"];this[6]=df[df.flag].x;this[7]=df[df.flag].y;df.flag+="+ps[2]+";if(df.flag<0)df.flag+=df.length;if(df.flag>=df.length)df.flag-=df.length;";
		return {
			data: points,
			flag: 0,
			fun: fun
		};
	},
	//drEll:translateEllipse(按椭圆方式绘图)
	drEll: function(f,ps) {
		/*
			参数:
			1.x半轴
			2.y半轴
			3.速度
			4.中心横坐标(可选)
			5.中心纵坐标(可选)
		*/
		if(ps.length!=3&&ps.length<5) {
			console.error("Function 'trEll' missing argument.");
			return;
		}

		ps = ps.map(Number);//字符串数组转数字数组
		var x=ps[3]||0,y=ps[4]||0;
		var step = (ps[0]>ps[1])?1/ps[0]:1/ps[1],points=[],fun="";//f:fun
		for(var i=0;i<2*Math.PI;i+=step) {
			var point={
				x:x+ps[0]*Math.cos(i),
				y:y+ps[1]*Math.sin(i)
			};
			points.push(point);
		}
		var fun = "var df=this.data["+f+"];this[2]=df[df.flag].x;this[3]=df[df.flag].y;df.flag+="+ps[2]+";if(df.flag<0)df.flag+=df.length;if(df.flag>=df.length)df.flag-=df.length;";
		return {
			data: points,
			flag: 0,
			fun: fun
		};
	},
	//anClo:angleClock(按照钟摆的方式旋转轴)
	anClo: function(f,ps) {
		/*
			参数:
			1.摆动最大值
			2.速度
			3.初始值(可选)
		*/
		ps = ps.map(Number);
		var d = Math.PI/180;//d:degree;
		var dn=d*ps[1],ds=[];//dn:degree/n;ds:[degree/n]s
		var i0 = ps[2]||0;
		for(var i=i0*d;i<(i0+ps[0]-1)*d;i+=dn) {
			ds.push(i);
		}
		for(var i=(i0+ps[0]-1)*d;i>i0*d;i-=dn) {
			ds.push(i);
		}
		var fun = "var df=this.data["+f+"];this[5]=df[df.flag];df.flag++;if(df.flag>=df.length)df.flag-=df.length;";
		return {
			data: ds,
			flag: 0,
			fun: fun
		};
	}
};