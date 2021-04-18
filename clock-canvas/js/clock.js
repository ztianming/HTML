// JavaScript Document
// canvas ID，与HTML中对应
var CANVAS_ID = 'clock'
//canvas的宽度
var WINDOW_WIDTH=1024;
//canvas的高度
var WINDOW_HEIGHT=768;
//圆球半径
var RADIUS=8;
// 小球初始化颜色
var INITIAL_COLOR = "rgb(22,159,230)"
// 小球最大数量，此处可根据运行情况进行修改
var MAX_BALLS_NUMS = 300

//每个数字距离画布上部的距离
var MAGIN_TOP=60;
//每个数字距离画布左部的距离
var MAGIN_LEFT=30;


// 21 - 30行为倒计时功能代码
//指定结束时间
// 1.指定某个日期为结束时间
//var endTime = new Date(2016,5,30,18,00,00);

//2.指定当前时间leftTime之后为结束时间
var endTime = new Date();
// 单位是ms
var leftTime = 60*1000;
endTime.setTime(endTime.getTime()+ leftTime);

var interval=null;
var curShowTimeSeconds=0;
//添加弹跳小球数据
//小球的坐标
var balls=[];
//小球的颜色
var colors=["#33B5E5","#0099CC","#AA66CC","#9933CC","#99CC00",
             "#669900","#FFBB33","#FF8800","#FF4444","#CC0000"];


window.onload=function(){
	//WINDOW_WIDTH = document.body.clientWidth;
    //WINDOW_HEIGHT = document.body.clientHeight;
	//WINDOW_WIDTH=250;
	//WINDOW_HEIGHT=88;
    //设置margin-left和margin-top，以及RADIUS
    //10：时间数字占据整个屏幕的4/5，那么两边总共是1/5，一侧则是1/10
    MARGIN_LEFT = Math.round(WINDOW_WIDTH /10);
    //时间数字占据整个屏幕的4/5，即window_width*4/5，这是所有时间数字占据的屏幕总宽度
    //而最后一个数字的左边距为margin_left+93*(radius+1)，在加上它本身的15个(radius+1)，
    // 因此这个4/5的屏幕宽度总共放置了93+15=108个(radius+1)，
    // 计算出每个(radius+1)之后再减去1就是radius的值了
    RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108)-1;
    //margin_top跟上下文的坐标的计算没有关系，因此可以随便定义，此处定义为屏幕高度的1/5
    MARGIN_TOP = Math.round(WINDOW_HEIGHT /5);
    //1、获取myCanvas对象
	var canvas=document.getElementById(CANVAS_ID);
    //设置宽高
	canvas.width=WINDOW_WIDTH;
	canvas.height=WINDOW_HEIGHT;

	var context=canvas.getContext('2d');
    //2、绘制当前时间图形
	curShowTimeSeconds = getCurrentShowTimeSeconds();
	setInterval(
        function(){
            render( context );
            update();
        }
        ,
        50
    );
}

// 获取当前时间
function getCurrentShowTimeSeconds(){

    // 81-84行 倒计时功能代码
    
    //开始时间
	/*
    var startTime = new Date().getTime();
    var diffTime = parseInt((endTime-startTime)/1000,10);//得到两个时间差的秒数
    return diffTime>0?diffTime:0;
    */

    // 时钟效果
	var curTime=new Date();
	var ret = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();
    return ret;
}


function update(){
	var nextShowTimeSeconds = getCurrentShowTimeSeconds();
    // 计算下一时刻的时、分、秒
    var nextHours = parseInt( nextShowTimeSeconds / 3600);
    var nextMinutes = parseInt( (nextShowTimeSeconds - nextHours * 3600)/60 )
    var nextSeconds = nextShowTimeSeconds % 60
    // 计算当前时间的时、分、秒
    var curHours = parseInt( curShowTimeSeconds / 3600);
    var curMinutes = parseInt( (curShowTimeSeconds - curHours * 3600)/60 )
    var curSeconds = curShowTimeSeconds % 60

    // 发生变化
    if( nextSeconds != curSeconds ){

        // 小时 十位
		if( parseInt(curHours/10) != parseInt(nextHours/10) ){
            addBalls( MARGIN_LEFT + 0 , MARGIN_TOP , parseInt(curHours/10) );
        }
        // 小时 个位
        if( parseInt(curHours%10) != parseInt(nextHours%10) ){
            addBalls( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(curHours/10) );
        }

        // 分钟 十位
        if( parseInt(curMinutes/10) != parseInt(nextMinutes/10) ){
            addBalls( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes/10) );
        }
        // 分钟 个位
        if( parseInt(curMinutes%10) != parseInt(nextMinutes%10) ){
            addBalls( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(curMinutes%10) );
        }
        // 秒 十位
        if( parseInt(curSeconds/10) != parseInt(nextSeconds/10) ){
            addBalls( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(curSeconds/10) );
        }
        // 秒 个位
        if( parseInt(curSeconds%10) != parseInt(nextSeconds%10) ){
            addBalls( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(nextSeconds%10) );
        }
        curShowTimeSeconds = nextShowTimeSeconds;
    }
	updateBalls();
}

// 更新小球状态
function updateBalls(){
    for( var i = 0 ; i < balls.length ; i ++ ){
        balls[i].x += balls[i].vx;
        balls[i].y += balls[i].vy;
        balls[i].vy += balls[i].g;
        // 小球碰到 画布下边缘 反弹
        if( balls[i].y >= WINDOW_HEIGHT-RADIUS ){
            balls[i].y = WINDOW_HEIGHT-RADIUS;
            balls[i].vy = - balls[i].vy*0.75;
        }
    }
	var cnt = 0
    // 小球是否在画布中
    for( var i = 0 ; i < balls.length ; i ++ )
    {    if( balls[i].x + RADIUS > 0 && balls[i].x -RADIUS < WINDOW_WIDTH )
        {
            balls[cnt++] = balls[i]
        }
    }

    // 控制小球的数量
    while( balls.length >Math.min(MAX_BALLS_NUMS, cnt) ){
        // 弹出最后一个
        balls.pop();
    }
}

// 添加小球
function addBalls( x , y , num ){
    for( var i = 0  ; i < digit[num].length ; i ++ )
    {
        for( var j = 0  ; j < digit[num][i].length ; j ++ )
        {
            if( digit[num][i][j] == 1 )
            {
                // 小球属性
                var aBall = {
                    // 坐标
                    x:x+j*2*(RADIUS+1)+(RADIUS+1),
                    y:y+i*2*(RADIUS+1)+(RADIUS+1),
                    // 横向运动速度
                    vx:Math.pow( -1 , Math.ceil( Math.random()*1000 ) ) * 4,
                    // 纵向运动速度
                    vy:-5,
                    // 加速度
                    g:1.5+Math.random(),
                    // 颜色
                    color: colors[ Math.floor( Math.random()*colors.length ) ]
                }
                balls.push( aBall )
            }
        }
    }
}

// 绘制数字
function renderDigit(x,y,num,cxt){
    cxt.fillStyle = INITIAL_COLOR;
    for( var i = 0 ; i < digit[num].length ; i ++ ) {
        for (var j = 0; j < digit[num][i].length; j++) {
            if (digit[num][i][j] == 1) {
                cxt.beginPath();
                cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI)
                cxt.closePath()
                cxt.fill()
            }
        }
    }
}

// 绘制
function render(cxt){
	cxt.clearRect(0,0,WINDOW_WIDTH, WINDOW_HEIGHT);
	var hours=parseInt(curShowTimeSeconds/3600);
	var minutes=parseInt((curShowTimeSeconds-hours*3600)/60);
	var seconds=curShowTimeSeconds%60;
	// 小时
	renderDigit( MARGIN_LEFT , MARGIN_TOP , parseInt(hours/10) , cxt );
	// 15 = 2*7 + 1； 一个圆 直径是2倍 数字矩阵是7x10； 1是间距
    renderDigit( MARGIN_LEFT + 15*(RADIUS+1) , MARGIN_TOP , parseInt(hours%10) , cxt );
    // 冒号
	renderDigit( MARGIN_LEFT + 30*(RADIUS+1) , MARGIN_TOP , 10 , cxt )
    // 分钟
    // 39 = 30 + 4*2 + 1
    renderDigit( MARGIN_LEFT + 39*(RADIUS+1) , MARGIN_TOP , parseInt(minutes/10) , cxt);
	// 54 = 39 + 7*2
    renderDigit( MARGIN_LEFT + 54*(RADIUS+1) , MARGIN_TOP , parseInt(minutes%10) , cxt);
    // 冒号
    renderDigit( MARGIN_LEFT + 69*(RADIUS+1) , MARGIN_TOP , 10 , cxt);
    // 秒
    // 78 = 69 + 4*2+1
    renderDigit( MARGIN_LEFT + 78*(RADIUS+1) , MARGIN_TOP , parseInt(seconds/10) , cxt);
    renderDigit( MARGIN_LEFT + 93*(RADIUS+1) , MARGIN_TOP , parseInt(seconds%10) , cxt);
	for( var i = 0 ; i < balls.length ; i ++ ){
		cxt.fillStyle=balls[i].color;
        cxt.beginPath();
        cxt.arc( balls[i].x , balls[i].y , RADIUS , 0 , 2*Math.PI , true );
        cxt.closePath();
        cxt.fill();
    }
}



