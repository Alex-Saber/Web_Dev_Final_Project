let bird = function() {
  let gif = document.querySelector("#bird-gif");
  let bird_canvas = document.querySelector("#flappy-canvas");
  gif.className = "invisible";
  bird_canvas.className = "myCanvas";
  function playBird() {
    var canvas = document.getElementById("flappy-canvas");
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

    var jump_sound = new Audio();
    jump_sound.src = "../sound/sfx_wing.wav";

    var hit_sound = new Audio();
    hit_sound.src = "../sound/sfx_hit.wav";

    var die_sound = new Audio();
    die_sound.src = "../sound/sfx_die.wav";

    var score_sound = new Audio();
    score_sound.src = "../sound/sfx_point.wav";

    var cheer_sound = new Audio();
    cheer_sound.src = "../sound/OHH.mp3";

    var bird_x = 10;
    var bird_y = 150;
    var score = 0;

    var bird_score_update = false;

    var jump = false;
    var jump_frame = false;
    var pipe_array = [100000];
    pipe_array[0] = { x: canvas.width, y: 0 };

    document.addEventListener("keyup", go_up);

    function go_up(event) {
      if (event.keyCode === 38) {
        if (jump === false) {
          jump = true;
          jump_sound.play();
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
          bird_y -= 10;
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
          pipe_array[i].y + TopPipe.height + 5 * bird.height
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
          if (pause == false) {
            score_sound.play();
          }
          if (score % 10 == 0) {
            cheer_sound.play();
          }
        }
        sound_play = false;

        // //Collision logic
        if (
          bird_x + bird.width >= pipe_array[i].x &&
          bird_x <= pipe_array[i].x + TopPipe.width &&
          (bird_y < pipe_array[i].y + TopPipe.height ||
            bird_y + bird.height >
              pipe_array[i].y + TopPipe.height + 5 * bird.height)
        ) {
          // Pause the game
          pause = true;
          ctx.font = "bold 40px Arial";
          ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
          ctx.fillText(
            "Score: ",
            canvas.width / 2 - 100,
            canvas.height / 2 + 40
          );
          ctx.fillText(score, canvas.width / 2 + 50, canvas.height / 2 + 40);
          ctx.font = "bold 20px Arial";
          ctx.fillText(
            "Press the Start button ",
            canvas.width / 2 - 100,
            canvas.height / 2 + 70
          );
          ctx.fillText(
            "try again",
            canvas.width / 2 - 100,
            canvas.height / 2 + 90
          );
          let time = new Date();
          let activity = {
            Timestamp: time,
            Game: "Flappy Bird",
            Score: score
          };
          if (bird_score_update === false) {
            updateUserActivityAndScores(activity);
            bird_score_update = true;
            hit_sound.play();
          }
        }
        if (pause == true) {
          if (bird_y <= canvas.height) {
            die_sound.play();
          }
          bird_y += gravity;
          gravity += 0.1;
          if (bird_y >= canvas.height) {
            bird_y = 600;
          }
        }

        // GameOver.play();
      }

      // ctx.font = "30px Open Sans";
      //ctx.fillText("Score :" + score, 10, canvas.height - 20);
      requestAnimationFrame(draw);
    }

    draw();
  }

  playBird();
};
