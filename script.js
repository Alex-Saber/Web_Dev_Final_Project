var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var bird = new Image();
bird.src ="images/bird.png";

var bg = new Image();
bg.src ="images/bg.png";

var fg = new Image();
fg.src ="images/fg.png";

var pipeNorth= new Image();
pipeNorth.src ="images/pipeNorth.png";

var pipeSouth = new Image();
pipeSouth.src ="images/pipeSouth.png";

var bird_x =10;
var bird_y =150;



function draw()
{
    ctx.drawImage(bg,0,0);
    ctx.drawImage(pipeNorth,100,0);
    ctx.drawImage(pipeSouth,100,0+pipeNorth.height +75);

    ctx.drawImage(fg,0,canvas.height -fg.height);

    ctx.drawImage(bird,bird_x,bird_y);

    bird_y++;


    requestAnimationFrame(draw); 
}
draw();