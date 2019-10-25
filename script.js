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

var GameOver = new Audio();
GameOver.src = "sound/OHH.mp3"
var bird_x = 10;
var bird_y = 150;
var score =0;

var pipe_array =[100000];
pipe_array[0] = {x : canvas.width, y: 0};


document.addEventListener("keyup", go_up);
function go_up(event) {
  if (event.keyCode == 38) {
    console.log("bird_y", bird_y);
    bird_y -= 50;
    console.log("after", bird_y);
  }
}

function draw() {
  ctx.drawImage(bg, 0, 0);
  ctx.drawImage(fg, 0, canvas.height - fg.height);
  bird_y += 1;
  ctx.drawImage(bird, bird_x, bird_y);

  for( var i=0; i<pipe_array.length;i++)
  {
    ctx.drawImage(TopPipe, pipe_array[i].x, pipe_array[i].y);
    ctx.drawImage(BotPipe, pipe_array[i].x, pipe_array[i].y + TopPipe.height + 80);

    pipe_array[i].x--;

    if(pipe_array[i].x ==50 )
    {
      pipe_array.push({x : canvas.width, y: 0});
    }

    if(pipe_array[i].x ==0 )
    {
      score++;
    }

    //Collision logic
      GameOver.play();
    

  }
  


  ctx.font = "30px Open Sans";
  ctx.fillText("Score :" +score,10,canvas.height-20);
  requestAnimationFrame(draw);
}
draw();
