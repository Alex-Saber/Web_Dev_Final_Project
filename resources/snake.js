let snake = function() {
  let playSnake = function() {
    var canvas = document.getElementById("snake-canvas");
    var ctx = canvas.getContext("2d");

    var block = 20; //one block of body is 20 px
    var snake = [];
    snake[0] = { x: 2 * block, y: 2 * block };
    snake[1] = { x: 1 * block, y: 2 * block };

    var food = new Image();
    food.src = "../images/pizza.png";
    var food_x = 120;
    var food_y = 120;

    var background = new Image();
    background.src = "../images/grass.png";

    var dead = false;
    var score = 0;
    var counter = 0;
    var delay = 5;
    var snake_score_update = false;
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
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(background, 0, 0);
      //ctx.fillStyle = "white";
      //ctx.fillRect(0, 0, canvas.width, canvas.height);
      if (dead == false) {
        for (var i = 0; i < snake.length; i++) {
          ctx.fillStyle = i == 0 ? "red" : "black";
          ctx.fillRect(snake[i].x, snake[i].y, block, block);
        }
        ctx.drawImage(food, food_x, food_y);
        //ctx.fillStyle = "blue";
        //ctx.fillRect(food_x, food_y, block, block);

        counter++;
        //movement logic
        //if (counter == delay) {
        var new_head_x = snake[0].x;
        var new_head_y = snake[0].y;
        if (direction == "L") {
          new_head_x -= 5;
        }
        if (direction == "R") {
          new_head_x += 5;
        }
        if (direction == "U") {
          new_head_y -= 5;
        }
        if (direction == "D") {
          new_head_y += 5;
        }
        //self collision logic
        for (var i = 1; i < snake.length; i++) {
          if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            dead = true;
            console.log("eat self");
          }
        }
        //counter = 0;
        // }

        snake.unshift({ x: new_head_x, y: new_head_y });

        //food logic
        if (
          (new_head_x >= food_x &&
            new_head_x <= food_x + block &&
            new_head_y >= food_y &&
            new_head_y <= food_y + block) ||
          (new_head_x + block >= food_x &&
            new_head_x + block <= food_x + block &&
            new_head_y + block >= food_y &&
            new_head_y + block <= food_y + block)
        ) {
          food_x = Math.floor(Math.random() * 25 + 2) * block;
          food_y = Math.floor(Math.random() * 25 + 2) * block;
          // food_x = new_head_x;
          // food_y = new_head_y;
          score += 1;
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
          "Press the Start button to try again",
          canvas.width / 2 - 100,
          canvas.height / 2 + 70
        );
        /*if (snake_score_update == false) {
                  let url = "http://localhost:3000/user/update/score";
                  let request_body = {
                    name: "Snake game",
                    score: score
                  };
                  let fetch_obj = {
                    method: "POST",
                    headers: {
                      Accept: "application/json",
                      "Content-Type": "application/json"
                    },
                    body: JSON.stringify(request_body)
                  };
                  fetch(url, fetch_obj).then(function(response) {
                    response.json().then(data => {
                      console.log(data);
                    });
                  });
                  snake_score_update = true;
                }*/
        if (snake_score_update == false) {
          let time = new Date();
          let activity = {
            Timestamp: time,
            Game: "Snake",
            Score: score
            //username: USERNAME
          };
          updateUserActivityAndScores(activity);
          snake_score_update = true;
        }
      }
      requestAnimationFrame(draw);
    }

    draw();
  };
  playSnake();
};
