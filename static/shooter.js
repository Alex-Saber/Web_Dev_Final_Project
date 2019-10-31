var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');



var ship = new Image();
var ship_x = canvas.width/2;
var ship_y = canvas.height-100;
ship.src = "images/ship.gif";

var space= new Image();
space.src ="images/space.png";

var left =false;
var right =false;
var up=false;
var down=false;

var enemies_total=10;
var enemies_array=[];
var enemy_x=10;
var enemy_y=0;
var enemy_speed=3;
var enemy= new Image();
enemy.src="images/enemy1.png";


document.addEventListener('keydown', keyDown, false);
document.addEventListener('keyup', keyUp, false);

function keyDown(e) {
    if (e.keyCode == 39) right = true;
    else if (e.keyCode == 37) left = true;
    if (e.keyCode == 38) up = true;
    else if (e.keyCode == 40) down = true;
  }
function keyUp(e) {
    if (e.keyCode == 39) right = false;
    else if (e.keyCode == 37) left = false;
    if (e.keyCode == 38) up = false;
    else if (e.keyCode == 40) down = false;
}
  
function drawship()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(space,0,0);
    if (right) ship_x += 5;
    else if (left) ship_x -= 5;
    if (up) ship_y -= 5;
    else if (down) ship_y += 5;

    if (ship_x <= 0) ship_x = 0;

    if ((ship_x + ship.width) >= canvas.width) ship_x = canvas.width - ship.width;

    if (ship_y <= 0) ship_y = 0;

    if ((ship_y + ship.height) >= canvas.height) ship_y = canvas.height - ship.height;

    for( var i=0; i< enemies_total;i++)
    {
        enemies_array.push([enemy_x,enemy_y,enemy_speed]);
        enemy_x+= enemy.width+30;
        ctx.drawImage(enemy,enemies_array[i][0],enemies_array[i][1]);
    }
    ctx.drawImage(ship,ship_x,ship_y);
    requestAnimationFrame(drawship);
    console.log(ship_x);
    console.log(ship_y);
}


drawship();