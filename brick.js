var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");
var ballRadius = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2
var rightBtnPressed = false;
var leftBtnPressed = false;
var x = canvas.width/2;
var y = canvas.height-30;
var dx = 2;
var dy = -2;

//Event listeners to watch for a keydown or keyup press
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//Handler for the key down press
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightBtnPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftBtnPressed = true;
    }
}

//Handler for the key up press
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightBtnPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftBtnPressed = false;
    }
}

function drawBall(){

    //start drawing a path
    ctx.beginPath();
    //draw line in shape of a circle
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    //colour it
    ctx.fillStyle = "#0095DD";
    //fills the drawn area with fillstyle
    ctx.fill();
    //stop drawing path
    ctx.closePath();
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

/*
    re-occuring function that is called every 10ms
    draws the ball and the paddle then checks for 
    movement updates/collisions
*/
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();

    //check if ball has collided with side walls
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    //check if ball has collided with top wall or bottom wall. 
    //display game over if it collides with bottom wall
    if(y + dy < ballRadius) {
        dy = -dy;
    }
    else if(y + dy > canvas.height-ballRadius){
        //check if ball centre is between paddle edges
        if(x> paddleX && x < paddleX + paddleWidth){
            dy = -dy
        }
        else{
            alert("GAME OVER");
            //reloads the browser window
            document.location.reload();
            //stops interval
            clearInterval(interval);
        }
    }

    //move paddle left and right with arrow presses
    if(rightBtnPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width){
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftBtnPressed) {
        paddleX -= 7;
        if (paddleX < 0){
            paddleX = 0;
        }
    }

    //update ball position
    x+=dx;
    y+=dy;
}

var interval = setInterval(draw, 10);