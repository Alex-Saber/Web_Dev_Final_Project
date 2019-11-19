let playSnake = function() {
  var canvas = document.getElementById("snake-canvas");
  var ctx = canvas.getContext("2d");

  var block = 10; //one block of body is 20 px
  var snake = [];
  snake[0] = { x: 2 * block, y: 2 * block };
  snake[1] = { x: 1 * block, y: 2 * block };

  var food = new Image();
  food.src = "../images/pizza.png";
  var food_x = (60 / 2) * block;
  var food_y = (60 / 2) * block;

  var background = new Image();
  background.src = "../images/grass.png";

  var dead = false;
  var score = 0;
  var direction = "R";
  document.addEventListener("keydown", movement);
  function movement(e) {
    if (e.keyCode == 37 && direction != "R") {
      direction = "L";
    } else if (e.keyCode == 38 && direction != "D") {
      direction = "U";
    } else if (e.keyCode == 39 && direction != "L") {
      direction = "R";
    } else if (e.keyCode == 40 && direction != "U") {
      direction = "D";
    }
    if (e.keyCode == 13) {
      //location.reload();
      playSnake();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0);
    if (dead == false) {
      for (var i = 0; i < snake.length; i++) {
        ctx.fillStyle = i == 0 ? "red" : "black";
        ctx.fillRect(snake[i].x, snake[i].y, block, block);
      }
      ctx.drawImage(food, food_x, food_y);

      //movement logic
      var new_head_x = snake[0].x;
      var new_head_y = snake[0].y;
      if (direction == "L") {
        new_head_x -= block;
      }
      if (direction == "R") {
        new_head_x += block;
      }
      if (direction == "U") {
        new_head_y -= block;
      }
      if (direction == "D") {
        new_head_y += block;
      }
      //self collision logic
      for (var i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
          dead = true;
          console.log("eat self");
        }
      }

      snake.unshift({ x: new_head_x, y: new_head_y });

      //food logic
      if (new_head_x == food_x && new_head_y == food_y) {
        food_x = (Math.random() * 60 + 1) * block;
        food_y = (Math.random() * 60 + 1) * block;
        // food_x = new_head_x;
        // food_y = new_head_y;
        score += 1;
        console.log("Nom");
      } else {
        snake.pop();
      }

      //game over logic
      if (
        snake[0].x <= 0 ||
        snake[0].x >= canvas.width ||
        snake[0].y <= 0 ||
        snake[0].y >= canvas.height
      ) {
        dead = true;
      }
    } else {
      ctx.font = "bold 40px Arial";
      ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
      ctx.fillText("Score: ", canvas.width / 2 - 100, canvas.height / 2 + 40);
      ctx.fillText(score, canvas.width / 2 + 50, canvas.height / 2 + 40);
      ctx.font = "bold 20px Arial";
      ctx.fillText(
        "Press enter to try again",
        canvas.width / 2 - 100,
        canvas.height / 2 + 70
      );
    }
    requestAnimationFrame(draw);
  }
  draw();
};
playSnake();
