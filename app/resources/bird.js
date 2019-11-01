var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var pause = false;
var bird = new Image();

var bg = new Image();
bg.src = "../images/bg.png";

var fg = new Image();
fg.src = "../images/fg.png";

var TopPipe = new Image();
TopPipe.src = "../images/pipeNorth.png";

var BotPipe = new Image();
BotPipe.src = "../images/pipeSouth.png";

//var GameOver = new Audio();
//GameOver.src = "../sound/OHH.mp3";
var bird_x = 10;
var bird_y = 150;
var score = 0;

var jump = false;
var jump_frame = false;
var pipe_array = [100000];
pipe_array[0] = { x: canvas.width, y: 0 };

document.addEventListener("keyup", go_up);
function go_up(event) {
  if (event.keyCode === 38) {
    if (jump === false) {
      jump = true;
    }
  }
}

let gravity = 0.5;

function draw() {
  ctx.drawImage(bg, 0, 0);
  ctx.drawImage(fg, 0, canvas.height - fg.height);

  if (pause == false) {
    gravity += 0.1;
    bird_y += gravity;

    if (jump && jump_frame <= 5) {
      gravity = 0;
      bird_y -= 15;
      jump_frame += 1;
    }
    if (jump_frame > 5) {
      jump_frame = 0;
      jump = false;
    }
  }
  if (pause == false) {
    bird.src = "../images/bird.png";
  } else {
    bird.src = "../images/ded_bird.png";
  }
  ctx.drawImage(bird, bird_x, bird_y);

  for (var i = 0; i < pipe_array.length; i++) {
    ctx.drawImage(TopPipe, pipe_array[i].x, pipe_array[i].y);

    ctx.drawImage(
      BotPipe,
      pipe_array[i].x,
      pipe_array[i].y + TopPipe.height + 80
    );

    if (pause == false) {
      pipe_array[i].x--;
    }
    if (pipe_array[i].x === 50) {
      pipe_array.push({
        x: canvas.width,
        y: Math.floor(Math.random() * TopPipe.height) - TopPipe.height
      });
    }

    if (pipe_array[i].x === 0) {
      score++;
    }

    // //Collision logic
    if (
      bird_x + bird.width >= pipe_array[i].x &&
      bird_x <= pipe_array[i].x + TopPipe.width &&
      (bird_y <= pipe_array[i].y + TopPipe.height ||
        bird_y + bird.height >= pipe_array[i].y + 80)
    ) {
      // Pause the game
      pause = true;
      document.addEventListener("keyup", restart);
      function restart(event) {
        if (event.keyCode === 88) {
          location.reload();
        }
      }
      if (pause == true) {
        bird_y += gravity;
        gravity += 0.1;
        if (bird_y >= canvas.height) {
          bird_y = canvas.height + 50;
        }
      }
    }

    // GameOver.play();
  }

  ctx.font = "30px Open Sans";
  ctx.fillText("Score :" + score, 10, canvas.height - 20);
  requestAnimationFrame(draw);
}
draw();
