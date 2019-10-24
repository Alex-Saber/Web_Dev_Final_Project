var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var bird = new Image();
bird.src = "images/bird.png";

var bg = new Image();
bg.src = "images/bg.png";

var fg = new Image();
fg.src = "images/fg.png";

var TopPipe = new Image();
TopPipe.src = "images/pipeNorth.png";

var BotPipe = new Image();
BotPipe.src = "images/pipeSouth.png";

var bird_x = 10;
var bird_y = 150;

function draw() {
  ctx.drawImage(bg, 0, 0);
  ctx.drawImage(TopPipe, 100, 0);
  ctx.drawImage(BotPipe, 100, 0 + TopPipe.height + 80);

  ctx.drawImage(fg, 0, canvas.height - fg.height);

  document.addEventListener(
    "keyup",
    function(event) {
      if (event.keyCode == 38) {
        console.log("bird_y", bird_y);
        bird_y--;
        console.log("after", bird_y);
      }
    },
    true
  );

  bird_y++;
  ctx.drawImage(bird, bird_x, bird_y);

  requestAnimationFrame(draw);
  gravity = 1;
}
draw();
