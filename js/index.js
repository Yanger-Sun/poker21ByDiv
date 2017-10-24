/**
 * Created by Administrator on 2017/10/12.
 */

(function rotate(){
   var orientation=window.orientation;
   if(orientation==90||orientation==-90){
      document.body.style.display='none';
      alert("请使用竖屏访问！");
   }
   window.onorientationchange=function(){
      document.body.style.display="block";
      rotate();
   };
})()

var canvas = $(".canvas")[0];
var audio = $("#music")[0];
var canW = $(document).width() * 0.95;
var canH = $(document).height() * 0.9;
$(".canvas").attr("width",canW);
$(".canvas").attr("height",canH);

var ctxt = canvas.getContext("2d");

var zonesWidth = (canW/14) * 10.5;
var zonesHeight = canH/4;

var zoneLeft = canW/14;
var zoneTop = zonesHeight/4;

//
$(".ComputerScore").css("top",zoneTop + zonesHeight);
$(".PlayScore").css("top",zoneTop*2 + zonesHeight*2);

var PaiArr = []; //PaiArr = [{num:4,hs:"s"},{num:6,hs:"h"},...];
var hs = ['h','b','s','k'];//花色代表  红桃：h  梅花：b  方块：s  黑桃：k
var computerArr = [];//电脑的牌
var play2Arr = [];//玩家的牌
var computerFlag = true;//若为true，则表示电脑可以继续选牌；
var play2Flag = true;//若为true，则表示玩家可以被点击

//绘制区域的方法
function makeZones(x,y){
    ctxt.strokeStyle="#fff";
    ctxt.lineWidth="1";
    ctxt.strokeRect(x,y,zonesWidth + 0.5,zonesHeight + 0.5);
}

//绘制想对应区域的头像
function makeTx(imgId,x,y,w,h){
	var img=document.getElementById(imgId);
	ctxt.drawImage(img,x,y,w,h);
}

//获取数组中最大值
function sortNumber(a,b){
	return a - b
}



//随机生成扑克牌顺序
function makeRandomPai(){
	PaiArr = [];
    for(var i=0;i<52;i++){
        var PaiArrHas = false;//判断数组中有没有存在已有的牌
        var num = Math.ceil(Math.random()*13);//扑克牌对应的数字
        var nowHsNum = Math.floor(Math.random()*4);//扑克牌对应的花色下标
        var nowHs = hs[nowHsNum];//扑克牌对应的花色
        $(PaiArr).each(function(i,v){
            if(PaiArr[i].num == num && PaiArr[i].hs == nowHs){
                PaiArrHas = true // 数组中有没有存在已有的牌,已经存在则显示为true，而后判断;
            };
        })
        if(PaiArrHas){
            i = i-1; //如果为true,则表示该牌已存在，重新生成
        }else{
            var nowArr = {};
            nowArr.num = num;
            nowArr.hs = nowHs;
            PaiArr.push(nowArr);  //如果为false,则表示该牌已存在，重新生成
        }
    }
}

//绘制随机扑克牌至发牌区域
function drawPai(){
	$.each(PaiArr,function(i,v){
		var PaiBj = "images/" + v.hs + v.num + ".png";
		var paiX = zoneLeft * 4 + 0.5;
		var paiY = (zoneTop * 2 + zonesHeight) +0.5;
		drawPaiToView(PaiBj,paiX,paiY,i)
	})
}
function drawPaiToView(PaiBj,paiX,paiY){
		var img1 = new Image();
		img1.src = PaiBj;
		img1.onload=function(){
            ctxt.drawImage(img1,paiX,paiY,zonesWidth * 0.35,zonesHeight);
        }
}

//判断一方所得扑克牌的点数
function celeCount(play){
	var nowScore = 0;
	//通过判断索要计算的玩家的身份，初始化要牌之前玩家的分数，
	if(play == "computer"){
		var scoreString = $(".ComputerScore span").text();
		var nowPlayerArr = computerArr;
	}else if(play == "play2"){
		var scoreString = $(".PlayScore span").text();
		var nowPlayerArr = play2Arr;
	}
	var nowScoreArr = [0];//储存相对应的玩家牌点数
	$.each(nowPlayerArr,function(i,v){		
		 if(nowPlayerArr[i].num == 1){	//如果当前数为1时   [1,2,5...] [5,2,1,6...]
			var nowScore1 = 1; 
			var nowScore2 = 11;

			var newArr = [];	
			for(var m = 0;m < nowScoreArr.length;m++){
				if(nowScoreArr.length == 1){   //前几次没有 1 出现 ，后来出现 1 例如：出现牌数[9,3,1]先前点数出现[12] 加后来点数1时，只保留没有超过21的结果;
					if(nowScoreArr[m] + nowScore1 <= 21){
						newArr.push(nowScoreArr[m] + nowScore1);
					}
					if(nowScoreArr[m] + nowScore2 <= 21){
						newArr.push(nowScoreArr[m] + nowScore2);
					}
					
				}else{                        //已经出现过1，又出现 1 的情况下 例如：出现牌数[9,1,1]先前点数出现[10,20] 加后来点数1时，[11,21,21,41]；
					if(parseInt(nowScoreArr[m]) + parseInt(nowScore1) <= 21){
						newArr.push(nowScoreArr[m] + nowScore1);
					}else{
						nowScoreArr.splice(m,1);
						m = m - 1 ;	
					}
					if(parseInt(nowScoreArr[m]) + parseInt(nowScore2) <= 21){
						newArr.push(nowScoreArr[m] + nowScore2);
					}else{
						nowScoreArr.splice(m,1);
						m = m - 1 ;	
					}	
				}
			}	
			nowScoreArr =  $.unique(newArr).sort();
		}else{ 		//若当前循环的为除1以外的其他数字时
			var num;
			if(nowPlayerArr[i].num == 11 || nowPlayerArr[i].num == 12 || nowPlayerArr[i].num == 13){
				 num  = 10;       //若为11,12,13  则要加的值为10
			}else{				  //若为除1，11,12,13之外，则要加的值为其本身
				 num = nowPlayerArr[i].num;
			}
			for(var m = 0;m < nowScoreArr.length;m++){
				if(nowScoreArr.length == 1){	//先前为出现过1，例如：出现牌数[9,2]先前点数出现[9] 加后来点数2时，直接相加；
					if(play == "computer"){
					}
					nowScoreArr[m] = nowScoreArr[m] + num;
				}else{
					if(nowScoreArr[m] + num <= 21){ //先前出过A  例如：出现牌数[9,1,2]先前点数出现[10,21] 加后来点数2时，超过21的去掉；
						nowScoreArr[m] = nowScoreArr[m] + num;
					}else{
						nowScoreArr.splice(m,1);
						m = m - 1 ;	
					}
				}	
				
			}
		}
	})

	return nowScoreArr.sort(sortNumber);
}

//判断电脑是否可以继续拿牌
function judgeComputer(){
	var computerScore =  celeCount("computer");
	
	
		if(PaiArr[PaiArr.length-1].num == 13 || PaiArr[PaiArr.length-1].num == 12 || PaiArr[PaiArr.length-1].num == 11){
			var num = 10;
		}else{
			var num = PaiArr[PaiArr.length-1].num;
		}
		if(computerScore[0] + num <= 21){

			console.log("电脑要牌")

			var lastNewImgCom = PaiArr[PaiArr.length - 1];
			computerArr.push(lastNewImgCom);
			var comLength = computerArr.length;
			var PaiBjCom = "images/"+ computerArr[comLength-1].hs + computerArr[comLength-1].num +".png";
			var paiXCom = zoneLeft * 4 + 0.5;
			var paiYCom = zoneTop +0.5;
			drawPaiToView(PaiBjCom,paiXCom + zoneLeft/2 * computerArr.length,paiYCom);		
			PaiArr.splice(PaiArr.length-1,1);

			console.log(197,PaiArr[PaiArr.length-1]); //下一张牌的点数

			var comScore = celeCount("computer");
			if(comScore.length == 1){
				$(".ComputerScore span").text(comScore[0]);
			}else{
				comScore = comScore.join(",");
				$(".ComputerScore span").text(comScore);
			}

		}else{

			console.log("电脑不要牌")

			computerFlag = false;

			var comMax = computerScore.sort()[computerScore.length-1];
			$(".ComputerScore span").text(computerScore[computerScore.length-1]);

			if(!play2Flag){

				var computerScore = parseInt($(".ComputerScore span").text());
				var play2ScoreEnd = parseInt($(".PlayScore span").text());		


			 	if(computerScore > play2ScoreEnd){
					$(".title").show();
					$(".playWin").text("电脑获胜");
					$(".playTpeople").text("电脑:玩家 = " + computerScore + ":" + play2ScoreEnd);
				}else if(computerScore < play2ScoreEnd){
					$(".title").show();
					$(".playWin").text("玩家获胜");
					$(".playTpeople").text("电脑:玩家 = " + computerScore + ":" + play2ScoreEnd);
				}else if(computerScore == play2ScoreEnd){
					$(".title").show();
					$(".playWin").text("此局为平局");
					$(".playTpeople").text("电脑:玩家 = " + computerScore + ":" + play2ScoreEnd);
				}
		 
			}
		}
	


	if(!play2Flag && computerFlag){
		judgeComputer();
	}

}



function reset(){

	ctxt.clearRect(0,0,canW,canH);

	$(".ComputerScore span").text("");
	$(".PlayScore span").text("");

	PaiArr = []; //PaiArr = [{num:4,hs:"s"},{num:6,hs:"h"},...];
	hs = ['h','b','s','k'];//花色代表  红桃：h  梅花：b  方块：s  黑桃：k
	computerArr = [];//电脑的牌
	play2Arr = [];//玩家的牌
	computerFlag = true;//若为true，则表示电脑可以继续选牌；
	play2Flag = true;//若为true，则表示玩家可以被点击

	//绘制牌1的区域
	var x1 = zoneLeft * 3 + 0.5 ;
	var y1 = zoneTop + 0.5;
	var tx1Y = zoneTop + zonesHeight/3;
	makeZones(x1,y1);
	ctxt.clearRect(zoneLeft,tx1Y,zoneLeft,zoneLeft);
	makeTx("computer",zoneLeft,tx1Y,zoneLeft,zoneLeft);

	//绘制发牌的区域
	var xf = zoneLeft * 3 + 0.5;
	var yf = (canH - zonesHeight - zoneTop) + 0.5;
	var txfY = zoneTop * 2 + zonesHeight/3 * 4;
	makeZones(xf,yf);
	ctxt.clearRect(zoneLeft,txfY,zoneLeft,zoneLeft)
	makeTx("game",zoneLeft,txfY,zoneLeft,zoneLeft);

	//绘制牌2的区域
	var x2 = zoneLeft * 3 + 0.5;
	var y2 = (zoneTop * 2 + zonesHeight) +0.5;
	var tx2Y = zoneTop * 2.5 + zonesHeight/3 * 7;
	makeZones(x2,y2);
	ctxt.clearRect(zoneLeft,tx2Y,zoneLeft,zoneLeft)
	makeTx("user",zoneLeft,tx2Y,zoneLeft,zoneLeft);

	$(".FaPaiBtns").css("top", txfY + zoneTop * 1.5);
	$(".Play2Btns").css("top", tx2Y + zoneTop * 1.5);
	//随机生成扑克牌组
	makeRandomPai();
	//绘制生成的扑克牌至发牌区域
	/*$.each(PaiArr,function(i,v){*/
	var PaiBj = "images/pokerFan.jpg";
		var paiX = zoneLeft * 4 + 0.5;
		var paiY = (zoneTop * 2 + zonesHeight) +0.5;
	/*	drawPaiToView(PaiBj,paiX,paiY,i);	
	})*/
	drawPaiToView(PaiBj,paiX,paiY);	

}




reset()
//游戏开始的发牌
$(".FaBtn").on("click",function(){

	console.log("第一张牌的点数",PaiArr[PaiArr.length-1]);//下一张牌的点数

	$(".Play2Btns").show();//play2的游戏按钮显示
	$(this).hide();		   //隐藏发牌按钮

	var lastNewImgCom = PaiArr[PaiArr.length - 1];
	computerArr.push(lastNewImgCom);
	var comLength = computerArr.length;
	var PaiBjCom = "images/"+ computerArr[comLength-1].hs + computerArr[comLength-1].num +".png";
	var paiXCom = zoneLeft * 4 + 0.5;
	var paiYCom = zoneTop +0.5;
	drawPaiToView(PaiBjCom,paiXCom + zoneLeft/2 * computerArr.length,paiYCom);	
	var comScore = celeCount("computer");
	if(comScore.length == 1){
		$(".ComputerScore span").text(comScore[0]);
	}else{
		comScore = comScore.join(",");
		$(".ComputerScore span").text(comScore);
	}

	console.log("第二张牌的点数",PaiArr[PaiArr.length-2]);//下一张牌的点数

	var lastNewImgPlay = PaiArr[PaiArr.length - 2];
	play2Arr.push(lastNewImgPlay);
	var play2Length = play2Arr.length;
	var PaiBjPlay2 = "images/"+ play2Arr[play2Length-1].hs + play2Arr[play2Length-1].num +".png";
	var paiXPlay2 = zoneLeft * 4 + 0.5;
	var paiYPlay2 = (zoneTop * 3 + zonesHeight*2) +0.5;
	drawPaiToView(PaiBjPlay2,paiXPlay2 + zoneLeft/2 * play2Arr.length,paiYPlay2);	
	var play2Score = celeCount("play2");
	if(play2Score.length == 1){
		$(".PlayScore span").text(play2Score[0]);
	}else{
		play2Score = play2Score.join(",");
		$(".PlayScore span").text(play2Score);
	}

	PaiArr.splice(PaiArr.length-2,2);
	
	console.log(289,PaiArr[PaiArr.length-1]);//下一张牌的点数

	if(computerFlag){
			console.log(290,"进行判断电脑是否要牌");
			judgeComputer();
	}

})

$(".HitBtn").on("click",function(){
	if(play2Flag){
		var lastNewImgPlay = PaiArr[PaiArr.length - 1];
		play2Arr.push(lastNewImgPlay);
		var play2Length = play2Arr.length;
		var PaiBjPlay2 = "images/"+ play2Arr[play2Length-1].hs + play2Arr[play2Length-1].num +".png";
		var paiXPlay2 = zoneLeft * 4 + 0.5;
		var paiYPlay2 = (zoneTop * 3 + zonesHeight*2) +0.5;
		drawPaiToView(PaiBjPlay2,paiXPlay2 + zoneLeft/2 * play2Arr.length,paiYPlay2);

		PaiArr.splice(PaiArr.length-1,1);

			console.log(306,PaiArr[PaiArr.length-1]);
		if(computerFlag){
			console.log(290,"进行判断电脑是否要牌");
			judgeComputer();
		}

		var play2Score = celeCount("play2");
		$(".PlayScore span").text(play2Score);

		if(play2Score.length == 1 && play2Score[0] > 21){
			$(".title").show();
			$(".playWin").text("玩家的点数已爆");
			$(".playTpeople").text("玩家的点数为:" + play2Score);
			 audio.pause();
    		audio.currentTime = 0;
    		$(audio).attr("src","audio/loseMusic.mp3");
    		audio.play();
			return;
		}		
	}else{
		$(".title").show();
	}	
 
})

$(".Standtn").on("click",function(){
	play2Flag = false;
	var play2Score = celeCount("play2");
	$(".HitBtn").off("click",function(){
		return false;
	});	
	if(play2Score.length > 1){
	    $(".PlayScore span").text(play2Score[play2Score.length-1]);
	}else{
	    $(".PlayScore span").text(play2Score[0]);
	}
	if(computerFlag){
		judgeComputer();
	}else{

		var computerScore = parseInt($(".ComputerScore span").text());
		var play2ScoreEnd = parseInt($(".PlayScore span").text());		


	 	if(computerScore > play2ScoreEnd){
			$(".title").show();
			$(".playWin").text("电脑获胜");
			$(".playTpeople").text("电脑:玩家 = " + computerScore + ":" + play2ScoreEnd);
			 audio.pause();
    		audio.currentTime = 0;
    		$(audio).attr("src","audio/loseMusic.mp3");
    		audio.play();
		}else if(computerScore < play2ScoreEnd){
			$(".title").show();
			$(".playWin").text("玩家获胜");
			$(".playTpeople").text("电脑:玩家 = " + computerScore + ":" + play2ScoreEnd);
			 audio.pause();
    		audio.currentTime = 0;
    		$(audio).attr("src","audio/winMusic.mp3");
    		audio.play();
		}else if(computerScore == play2ScoreEnd){
			$(".title").show();
			$(".playWin").text("此局为平局");
			$(".playTpeople").text("电脑:玩家 = " + computerScore + ":" + play2ScoreEnd);
			 audio.pause();
    		audio.currentTime = 0;
    		$(audio).attr("src","audio/loseMusic.mp3");
    		audio.play();
		}
 
	}

})

$(".playTcomputer").on("click",function(){
	$(".title").hide();
	reset();
	$(".FaBtn").show();
	$(".Play2Btns").hide();
	 audio.pause();
    audio.currentTime = 0;
    $(audio).attr("src","audio/playMusic.mp3");
    audio.play();
})

$(".playPaused").on("click",function(){
	$(".title").hide();
})