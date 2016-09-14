module.exports = function (paddleOne, paddleTwo) {

var buffer = 30;
console.log(paddleOne)
console.log(paddleTwo)
function BallObject () {
	var ball = this;
	ball.width = 800;
	ball.height = 600;
	ball.r=15;
	ball.x=ball.width/2;
	ball.y=ball.height/2;
	ball.vx=5;//function() {return 10*Math.random()*(2*Math.round(Math.random())-1)},//10*Math.random()*(2*Math.round(Math.random())-1) -1 or 1
	ball.vy =5;//function() {return 10*Math.random()*(2*Math.round(Math.random())-1)},//*(Math.ceil(2*Math.random())-1),
	ball.reset  = function() {
		ball.x = ball.width/2;
		ball.y = ball.height/2;
					//#1-10                    -1 or 1                   FPS calibration
		ball.vx =(9*Math.random()+1)*(2*Math.round(Math.random())-1)*(40/50);
		ball.vy =(9*Math.random()+1)*(2*Math.round(Math.random())-1)*(40/50);
		};
	ball.move = function() {
		if(ball.x < ball.width && ball.x > 0 ) {
			//ball in bounds!
			ball.x += ball.vx;
		}
		else {
			//ball hitting left or right wall -  score++
			(ball.x >= ball.width ) ? (paddleOne.incScore(),ball.reset()) : (paddleTwo.incScore(), ball.reset());		
			//(ball.x >= ball.width ) ? (ball.vx*=-1, ball.x+=ball.vx) : (ball.vx*=-1, ball.x+=ball.vx);						
		}
		//hitting top/bottom walls
		(ball.y + ball.r<ball.height  && ball.y-ball.r >0  ) ? ball.y +=ball.vy : (ball.vy *=-1,ball.y +=ball.vy);
			
		//check for possible collision left!
		if( (ball.x -ball.r > buffer-paddleOne.s_width && ball.x-ball.r < (buffer+paddleOne.s_width) ) || (ball.x +ball.r > buffer-paddleOne.s_width && ball.x+ball.r < (buffer+paddleOne.s_width)  )) {
			//how to catch when ball hits edge?
			if ( (   ball.y+ball.r > (paddleOne.posy - paddleOne.height/2 ) ) && (ball.y-ball.r < (paddleOne.posy + paddleOne.height/2) ) ) {
				ball.vx*=-1.3; 
				}
			}
		//possible collision right
		else if ((ball.x +ball.r > ball.width-buffer-paddleOne.s_width && ball.x+ball.r < (ball.width-buffer+paddleOne.s_width) ) || (ball.x - ball.r > ball.width-buffer-paddleOne.s_width && ball.x-ball.r < (ball.width-buffer+paddleOne.s_width) ) ) {
			if ( ball.y +ball.r>  (paddleTwo.posy - paddleTwo.height/2 ) && (ball.y-ball.r < (paddleTwo.posy + paddleTwo.height/2))) {
				ball.vx*=-1.3; 
			}
		}


	}


		
		









}

return new BallObject();

}