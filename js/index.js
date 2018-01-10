/**
 * Created by Administrator on 2017/10/12.
 */

var num = 0;
    var the_images = [
	"images/b1.png",
	"images/b2.png",
	"images/b3.png",
	"images/b4.png",
	"images/b5.png",
	"images/b6.png",
	"images/b7.png",
	"images/b8.png",
	"images/b9.png",
	"images/b10.png",
	"images/b11.png",
	"images/b12.png",
	"images/b13.png",
	"images/BigBoss.png",
	"images/Floor.jpg",
	"images/gameTitle.png",
	"images/icon.png",
	"images/smallBoss.png",
	"images/h1.png",
	"images/h2.png",
	"images/h3.png",
	"images/h4.png",
	"images/h5.png",
	"images/h6.png",
	"images/h7.png",
	"images/h8.png",
	"images/h9.png",
	"images/h10.png",
	"images/h11.png",
	"images/h12.png",
	"images/h13.png",
	"images/s1.png",
	"images/s2.png",
	"images/s3.png",
	"images/s4.png",
	"images/s5.png",
	"images/s6.png",
	"images/s7.png",
	"images/s8.png",
	"images/s9.png",
	"images/s10.png",
	"images/s11.png",
	"images/s12.png",
	"images/s13.png",
	"images/k1.png",
	"images/k2.png",
	"images/k3.png",
	"images/k4.png",
	"images/k5.png",
	"images/k6.png",
	"images/k7.png",
	"images/k8.png",
	"images/k9.png",
	"images/k10.png",
	"images/k11.png",
	"images/k12.png",
	"images/k13.png",
	];	

    jQuery.imgpreload(the_images,
    {
        each: function()
        {
		
            var status = $(this).data('loaded')?'success':'error';
			
            if (status == "success") {                
				++num;
			
				$("#lodingnum").html((num/the_images.length*100).toFixed(0)+"%");				               
            }
        },
        all: function()
        {
			$("#lodingnum").html("100%");
			document.getElementById('loading').style.display="none";
		document.addEventListener("WeixinJSBridgeReady", function () { 
					if(document.getElementById('loading').style.display=="none"){
        document.getElementById('audioPlay').play(); 
					}
				},false)	
		
			
		
			
        }
    });

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

var audio = $("#music")[0];
var AI = true;
var PaiArr = []; //PaiArr = [{num:4,hs:"s"},{num:6,hs:"h"},...]
var hs = ['h','b','s','k'];//花色代表  红桃：h  梅花：b  方块：s  黑桃：k
//生成扑克牌顺序
function makePai(){
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
//绘制随机扑克牌
function Draw(PaiArr){
    $(".FaPai").html("");
    $(PaiArr).each(function (i,v) {
        $("<li>").attr({"data-num":v.num,"data-hs":v.hs}).prependTo($(".FaPai"));
        /*var pai = 'images/' + v.hs + v.num + '.png';
         $('<img>').attr("src",pai).prependTo($("#Table"))*/  //生成牌
    })
}

function method1(arr){  
            var arr1=[];    //定义一个临时数组  
            for(var i = 0; i < arr.length; i++){    //循环遍历当前数组  
                //判断当前数组下标为i的元素是否已经保存到临时数组  
                //如果已保存，则跳过，否则将此元素保存到临时数组中  
                if(arr1.indexOf(arr[i]) == -1){  
                    arr1.push(arr[i]);  
                }  
            }  
            return arr1.sort();  
}  

//计算玩家1或者电脑的得分
function celeplay1(a){
    if(a == "play1"){
        var score = $(".play1Zone .play1Score").text();
        var play1PaiLength = $(".play1 li").length;
        var nowPaiNum =  parseInt($(".play1 li").eq(play1PaiLength - 1).attr("data-num"));
    }else{
        var score = $(".play2Zone .play2Score").text();
        var play1PaiLength = $(".play2 li").length;
        var nowPaiNum =  parseInt($(".play2 li").eq(play1PaiLength - 1).attr("data-num"));
    }
    console.log(score)
    if(score.match(",")){
        score = score.split(",")
    }else{
        score = [parseInt(score)];
    }

    //for(var i = 0;i<play1PaiLength;i++){
        
        if(play1PaiLength == 1){
            if(nowPaiNum == 13 || nowPaiNum ==12 || nowPaiNum == 11){
                nowPaiNum = 10;
                score[0] = nowPaiNum;
            }else if(nowPaiNum == 1){
                score=[1,11]
            }else{
                score[0] = nowPaiNum;
            }
        }else{

                if((nowPaiNum == 13) || (nowPaiNum ==12) || (nowPaiNum == 11)){
                    nowPaiNum = 10;
                    for(var i = 0;i<score.length;i++){
                        score[i] = parseInt(score[i]) + nowPaiNum;
                        if(score[i] > 21 && score.length>1){
                            score.splice(i,1);
                            i=i-1;
                        }
                    }
                }else if(nowPaiNum == 1){
                    console.log(nowPaiNum,score);
                    var nowPaiNum1 = 1;
                    var nowPaiNum2 = 11;
                    var newarr = [];
                   for(var i = 0;i<score.length;i++){
                        var score1_1 = parseInt(score[i]) + nowPaiNum1;
                        var score1_2 = parseInt(score[i]) + nowPaiNum2;
                        if(score1_1 <= 21){
                            newarr.push(score1_1);
                        }
                        if(score1_2 <= 21){
                            newarr.push(score1_2);
                        }
                    }
                    method1(newarr);
                    score = newarr;

                }else{
                    console.log(nowPaiNum,score);
                    for(var i = 0;i<score.length;i++){
                        score[i] = parseInt(score[i]) + nowPaiNum;
                        if(score[i] > 21 && (score.length>1)){
                            score.splice(i,1);
                            i=i-1;
                        }
                    }
                    console.log("nowPaiNum",score);
                }


        }
      
    //}

    var score1 = "";
    if(score.length > 1){
        score1 = score.join(",");
    }else{
        score1 = score[0];
    }

    if(a == "play1"){
        $(".play1Zone .play1Score").text(score1);
    }else{
        $(".play2Zone .play2Score").text(score1);
    }

    
}

//计算玩家二的得分
function celeplay2(){
    var score2 = 0;
    var play2PaiLength = $(".play2 li").length;

    for(var i = 0;i<play2PaiLength;i++){
         var nowPaiNum =  parseInt($(".play2 li").eq(i).attr("data-num"));
         if((nowPaiNum == 13) || (nowPaiNum ==12) || (nowPaiNum == 11)){
            nowPaiNum = 10;
        }
        score2 = score2 + nowPaiNum;
    }

    $(".play2Zone .play2Score").text(score2);

}

//比较牌数大小
function compare(){
    var play1 = $("")

    var score1 = $(".play1Zone .play1Score").text();
    var score2 = $(".play2Zone .play2Score").text();

    if(score1 > 21){
        return 1;
    }else if(score2 > 21){
        return 2;
    }else{
        return 0;
    }

}

makePai()
Draw(PaiArr);


var flag1 = false; // 当前play1停止要牌
var flag2 = false; // 当前play2停止要牌
var play1 = true;  // 当前play1可以要牌
var play2 = true;  // 当前play2可以要牌

//点击发牌以后执行的内容
$(".FaPaiBtn").on("click",function(){
    var PaiNum = $(".FaPai li").length;
    
    var newPai1 = 'url(images/' + $(".FaPai li").eq(PaiNum-1).attr("data-hs") + $(".FaPai li").eq(PaiNum-1).attr("data-num") + '.png)';
    var newPai2 = 'url(images/' + $(".FaPai li").eq(PaiNum-2).attr("data-hs") + $(".FaPai li").eq(PaiNum-2).attr("data-num") + '.png)';
    
    var newhs1 =  $(".FaPai li").eq(PaiNum-1).attr("data-hs");
    var newnum1 =  $(".FaPai li").eq(PaiNum-1).attr("data-num");
    
    var newhs2 =  $(".FaPai li").eq(PaiNum-2).attr("data-hs");
    var newnum2 =  $(".FaPai li").eq(PaiNum-2).attr("data-num");
    
    var newPaiArr =  PaiArr.splice(0,2);
    Draw(PaiArr);
    
    if(AI){
        var newPai1 = 'url(images/pokerFan.jpg)';
        $('<li>').attr({"data-num":newnum1,"data-hs":newhs1}).css("backgroundImage",newPai1).appendTo($(".play1"));
    }else{
        $('<li>').attr({"data-num":newnum1,"data-hs":newhs1}).css("backgroundImage",newPai1).appendTo($(".play1"));
    }
    
    $('<li>').attr({"data-num":newnum2,"data-hs":newhs2}).css("backgroundImage",newPai2).appendTo($(".play2"));

    celeplay1("play1"); 
    celeplay1("play2"); 

    $(".FaPaiBtn").hide();

    if(!AI){
        $(".play1Score").show();
        $(".play1Btn").show();
        $(".play2Btn").show();
    }else{
        $(".play1Score").hide();
        $(".play1Btn").hide();
        $(".play2Btn").show();
        $(".play2Hit").removeClass("disabled");

            judgeComScore();
        
    }

})


//某一方选择要牌
$(".playHit").on("click",function(){
    var PaiNum = $(".FaPai li").length;

    var newhs =  $(".FaPai li").eq(PaiNum-1).attr("data-hs");
    var newnum =  $(".FaPai li").eq(PaiNum-1).attr("data-num");

    var newPai = 'url(images/' + $(".FaPai li").eq(PaiNum-1).attr("data-hs") + $(".FaPai li").eq(PaiNum-1).attr("data-num") + '.png)';


    if($(this).hasClass("disabled")){
        return;
    }else if($(this).hasClass("play1Hit")){
        if(!flag1){
            var play1left = $(".play1 li").length * 0.25; 
            $('<li>').attr({"data-num":newnum,"data-hs":newhs}).css({"backgroundImage":newPai,"left":play1left+"rem"}).appendTo($(".play1"));
           celeplay1("play1");
            if($(".play2Btn").css('display') != 'none'){
                $(this).addClass("disabled");
                $(".play2Hit").removeClass("disabled");
            }
            var newPaiArr =  PaiArr.splice(0,1);
            Draw(PaiArr);       
        }
    }else if($(this).hasClass("play2Hit")){
        if(!flag2){
            var play2left = $(".play2 li").length * 0.25; 
            $('<li>').attr({"data-num":newnum,"data-hs":newhs}).css({"backgroundImage":newPai,"left":play2left+"rem"}).appendTo($(".play2"));
            celeplay1("play2");      
            if($(".play1Btn").css('display') != 'none'){
                $(this).addClass("disabled");
                $(".play1Hit").removeClass("disabled");
            }     
        }
        var newPaiArr =  PaiArr.splice(0,1);
        Draw(PaiArr);
            
    }

  
 if(compare() == 1){
        $(".title").show();
         if(AI){
                     $(".again .playWin").text("电脑牌爆");
                }else{
                     $(".again .playWin").text("玩家一牌爆");
                }
        audio.pause();
    	audio.currentTime = 0;
    	$(audio).attr("src","audio/winMusic.mp3");
    	audio.play();
        $(".playBtn").hide();
        $(".play1Score").show();
        showPlay1()
    }else if(compare() == 2){
        $(".title").show();
        $(".play1Score").show();
        $(".again .playWin").text("玩家二牌爆");
        audio.pause();
    	audio.currentTime = 0;
    	$(audio).attr("src","audio/loseMusic.mp3");
    	audio.play();
        $(".playBtn").hide();
        showPlay1()
    }else if(AI && !flag1){
            judgeComScore();
        }
    if(!AI){
                $(".common.playTpeople").text("再来一局");
                $(".common.playTcomputer").text("电脑对战");
            }else{
                $(".common.playTpeople").text("双人对战");
                $(".common.playTcomputer").text("再来一局");
    }

})

//当某一方选择停止要牌
$(".playStand").on("click",function(){
    if($(this).hasClass("play1Stand")){
        flag1 = true;
        $(".playHit").off("click",false);
        $(".play1Btn").hide();
         if($(".play2Btn").css("display") != "none"){
            play2 = true;
            $(".play2Hit").removeClass("disabled"); 
        }
        var score = $(".play1Zone .play1Score").text();
        if(score.match(",")){
            score = score.split(",")
        }else{
            score = [parseInt(score)];
        }
        if(score.length > 1){
            $(".play1Zone .play1Score").text(score[score.length-1]);
        }else{
            $(".play1Zone .play1Score").text(score[0]);
        }
    }else if($(this).hasClass("play2Stand")){
        flag2 = true;
        $(".play2Btn").hide();
        if($(".play1Btn").css("display") != "none"){
            play1 = true;
            $(".play1Hit").removeClass("disabled");
        }

        var score = $(".play2Zone .play2Score").text();
        console.log(347,score);
        if(score.match(",")){
            score = score.split(",")
        }else{
            score = [parseInt(score)];
        }
        console.log(353,score);
        if(score.length > 1){
            $(".play2Zone .play2Score").text(score[score.length-1]);
        }else{
            $(".play2Zone .play2Score").text(score[0]);
        }

        if(AI && !flag1){
            judgeComScore();
        }
    }
if(flag1 && flag2){
        if(compare() == "0"){
            var score1 = parseInt($(".play1Zone .play1Score").text());
            var score2 = parseInt($(".play2Zone .play2Score").text());
            $(".title").show();
            $(".playBtn").hide();
            $(".play1Score").show();
            showPlay1();
            if(score1 > score2){
                console.log(score1,score2);
                if(AI){
                    $(".again .playWin").text("电脑胜利");
                    
                }else{
                    $(".again .playWin").text("玩家一胜利");

                }
				audio.pause();
    			audio.currentTime = 0;
    			$(audio).attr("src","audio/loseMusic.mp3");
    			audio.play();
                
                
                
            }else if(score1 < score2){
                //$(".title").show();
                $(".again .playWin").text("玩家二胜利");
                	audio.pause();
                	audio.currentTime = 0;
                    $(audio).attr("src","audio/winMusic.mp3");
                    audio.play();
                //$(".playBtn").hide();
            }else{
                //$(".title").show();
                $(".again .playWin").text("此局为平局");
                audio.pause();
                audio.currentTime = 0;
                $(audio).attr("src","audio/winMusic.mp3");
                audio.play();
               // $(".playBtn").hide();
            }

            if(!AI){
                $(".common.playTpeople").text("再来一局");
                $(".common.playTcomputer").text("电脑对战");
            }else{
                $(".common.playTpeople").text("双人对战");
                $(".common.playTcomputer").text("再来一局");
            }
        }
    }
})

//
$(".common").click(function(){
    $(".title").hide();
    $(".play1").html("");
    $(".play2").html("");
    $(".FaPai").html("");
    makePai();
    Draw(PaiArr);
    $(".FaPaiBtn").show();
    flag1 = false;
    flag2 = false; 
    play1 = true;
    play2 = true;
    AI = false; 
    $(".play1Score").text("");
    $(".play2Score").text("");
    $(".play1Hit").removeClass("disabled");
    $(".play2Hit").addClass("disabled");
    if($(this).hasClass("playPaused")){
        $("#Table").hide();
        $(".gameLoading").show();
        audio.pause();
    	audio.currentTime = 0;
    	$(audio).attr("src","audio/playMusic.mp3");
    	audio.play();
    }
    if($(this).hasClass("playTpeople")){
		audio.pause();
    	audio.currentTime = 0;
    	$(audio).attr("src","audio/playMusic.mp3");
    	audio.play();
    }
    if($(this).hasClass("playTcomputer")){
        AI = true; 
        audio.pause();
    	audio.currentTime = 0;
    	$(audio).attr("src","audio/playMusic.mp3");
    	audio.play();
    }
})

$(".gameBtnOfPeople").click(function(){
    $(".gameLoading").hide();
    $("#Table").show();
    AI = false;  
    $(".play1Score").show();
    $(".play1Score").show();
    $(".play1Name").text("玩家一");
    $(".play2Name").text("玩家二");
  
})
$(".gameBtnOfCom").click(function(){
    AI = true;
    $(".gameLoading").hide();
    $("#Table").show();
    $(".play1Score").hide();
    $(".play1Score").hide();
    $(".play1Name").text("电脑");
    $(".play2Name").text("玩家");
})

//判断电脑是否需要牌
function judgeComScore(){
    var ComputerScore = parseInt($(".play1Zone .play1Score").text());
    var PaiNum = $(".FaPai li").length;

    var nextNum = parseInt($(".FaPai li").eq(PaiNum-1).attr("data-num"));
    
    var newhs =  $(".FaPai li").eq(PaiNum-1).attr("data-hs");
    var newnum =  $(".FaPai li").eq(PaiNum-1).attr("data-num");

    var newPai = 'url(images/pokerFan.jpg)';

    if(ComputerScore + nextNum <= 21){
        var play1left = $(".play1 li").length * 0.25;
        $('<li>').attr({"data-num":newnum,"data-hs":newhs}).css({"backgroundImage":newPai,"left":play1left+"rem"}).appendTo($(".play1"));
   
        celeplay1("play1"); 
        var newPaiArr =  PaiArr.splice(0,1);
        Draw(PaiArr);
    }else{
        play1 = true;
        flag1 = true;
    }

    if(flag2 && !flag1){
        judgeComScore();
    }
}

//结果显示后，显示电脑方对应的牌数
function showPlay1(){
    $(".play1 li").each(function(i,v){

        var newhs =  $(".play1 li").eq(i).attr("data-hs");
        var newnum =  $(".play1 li").eq(i).attr("data-num");

        var newPai = 'url(images/' + $(".play1 li").eq(i).attr("data-hs") + $(".play1 li").eq(i).attr("data-num") + '.png)';

        $(v).css({"backgroundImage":newPai});


    })
}

$(".gameBtnOfRules").click(function(){
	$(".gameLoading").hide();
	$(".rules").show();
})

$(".rulesClose").click(function(){
	$(".gameLoading").show();
	$(".rules").hide();
})