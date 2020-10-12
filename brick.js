//canvas variables
var canvas = document.getElementById("gameCanvas");
var ctx = canvas.getContext("2d");

//ball variables
var ballRadius = 10;
var x = canvas.width / 2;
var y = canvas.height - 30;
var dx = 2;
var dy = -2;

//paddle variables
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2
var rightBtnPressed = false;
var leftBtnPressed = false;

//brick variables
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = {
            x: 0,
            y: 0,
            status: 1
        };
    }
}

//score variables
var score = 0;
var lives = 3;


//Event listeners to watch for a keydown or keyup press
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false)

//Handler for the key down press
function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightBtnPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftBtnPressed = true;
    }
}

//Handler for the key up press
function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightBtnPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftBtnPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function collisionDetection() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++
                    if (score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}

function drawBall() {

    //start drawing a path
    ctx.beginPath();
    //draw line in shape of a circle
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    //colour it
    ctx.fillStyle = "#0095DD";
    //fills the drawn area with fillstyle
    ctx.fill();
    //stop drawing path
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (var c = 0; c < brickColumnCount; c++) {
        for (var r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

/*
    re-occuring function that is called every 10ms
    draws the ball and the paddle then checks for 
    movement updates/collisions
*/
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();

    //check if ball has collided with side walls
    if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    //check if ball has collided with top wall or bottom wall. 
    //display game over if it collides with bottom wall
    if (y + dy < ballRadius) {
        dy = -dy;
    } else if (y + dy > canvas.height - ballRadius) {
        //check if ball centre is between paddle edges
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy
        } else {
            lives--;
            if (!lives) {
                alert("GAME OVER");
                //reloads the browser window
                document.location.reload();
            }
            else{
                x= canvas.width/2;
                y = canvas.height-30;
                dx = 2;
                dy = -2;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }

    //move paddle left and right with arrow presses
    if (rightBtnPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    } else if (leftBtnPressed) {
        paddleX -= 7;
        if (paddleX < 0) {
            paddleX = 0;
        }
    }

    //update ball position
    x += dx;
    y += dy;

    requestAnimationFrame(draw);
}

draw();