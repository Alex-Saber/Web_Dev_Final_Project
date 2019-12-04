let currentPage = "#home-page";
let oldGame = document.createElement("script");
oldGame.type = "text/javascript";
oldGame.src = "";
let oldGameSrc = false;

let gameScripts = [
  ["#flappy-bird-page", "../bird.js"],
  ["#space-invaders-page", "../shooter.js"],
  ["#snake-page", "../snake.js"]
];

let gameScores = [
  ["Flappy Bird", "0", "#bird_score"],
  ["Snake", "0", "#snake_score"],
  ["Space Invaders", "0", "#invaders_score"]
];

//The scoreboard's data and table id and game name
let scoreboards = [
  ["#flappy-bird-scoreboard-table", [], "Flappy Bird"],
  ["snake-scoreboard-table", [], "Snake"],
  ["space-invaders-scoreboard-table", [], "Space Invaders"]
];

/* This function changes page display based on which menu
   item the user selects */
let toggleClasses = function(nextPage) {
  /*Toggle pages*/
  document.querySelector(currentPage).className = "container-fluid invisible";
  document.querySelector(nextPage).className = "container-fluid visible";
  /*Run corresponding game script if any and remove last game script if any*/
  var newGame = document.createElement("script");
  newGame.type = "text/javascript";
  newGame.src = "";
  let newGameSrc = false;
  let gameScriptsLength = gameScripts.length;
  for (let i = 0; i < gameScriptsLength; i += 1) {
    if (nextPage == gameScripts[i][0]) {
      newGame.src = gameScripts[i][1];
      newGameSrc = true;
    }
  }
  if (newGameSrc) {
    if (oldGameSrc) {
      document.body.removeChild(oldGame);
    }
    document.body.appendChild(newGame);
    oldGame = newGame;
    oldGameSrc = true;
  }
  /*Update current page value*/
  currentPage = nextPage;
  /*Reset form values*/
  $(".form-control").val("");
  document.querySelector(".form-control").className = "form-control";
};

/*get the highscores and rankings for every player from the particular game*/
let getScores = function(game) {
  console.log("third: " + new Date());
  //Search db for each user's high score for the game passed in
  let scores = [];
  let url = "http://localhost:3000/activities/" + game + "/";
  console.log(url);

  let fetch_obj = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };
  console.log("fourth");
  fetch(url, fetch_obj).then(function(response) {
    console.log(response.status);
    if (response.status === 200) {
      console.log("fifth");
      response.json().then(data => {
        console.log("sixth: scores fetched");
        console.log("data: ", data);
        scores = data;
        return scores;
      });
    } else if (response.status === 401) {
      console.log("scores not fetched");
      return scores;
    }
  });
};

/*load all the scoreboard's data*/
let populateScoreboardsInfo = function() {
  console.log("first");
  let len = scoreboards.length;
  for (let i = 0; i < len; ++i) {
    console.log("second: " + i + " game: " + scoreboards[i][2]);
    scoreboards[i][1] = getScores(scoreboards[i][2]);
    console.log("test: ", scoreboards[i][1]);
    $(scoreboards[i][0]).bootstrapTable({ data: scoreboards[i][1] });
  }
};

/*load the particular scoreboard's data*/
let populateThisScoreboardInfo = function(game) {
  let len = scoreboards.length;
  for (let i = 0; i < len; ++i) {
    if (scoreboards[i][2] == game) {
      scoreboards[i][1] = getScores(scoreboards[i][2]);
      $(scoreboards[i][0]).bootstrapTable({ data: scoreboards[i][1] });
    }
  }
};

/*clear the particular scoreboard's data*/
let unpopulateThisScoreboardInfo = function(game) {
  let len = scoreboards.length;
  for (let i = 0; i < len; ++i) {
    if (scoreboards[i][2] == game) {
      scoreboards[i][1] = [];
      $(scoreboards[i][0]).bootstrapTable("removeAll");
    }
  }
};

/*Update user activity and scores if new highscore, and update scoreboards
if new highscore make them go up in ranking*/
let updateUserActivityAndScores = function(activity) {
  //write activity to db
  let url = "http://localhost:3000/user/update/score";
  console.log(url);
  let request_body = activity;

  let fetch_obj = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(request_body)
  };

  fetch(url, fetch_obj).then(function(response) {
    console.log(response.status);
    if (response.status === 200) {
      console.log("Successfully updated DB");
    }
  });

  let url2 = "http://localhost:3000/update/scoreboards";

  fetch(url2, fetch_obj).then(function(response) {
    console.log(response.status);
  });

  //update activity table
  let userActivity = {
    Timestamp: activity.Timestamp,
    Game: activity.Game,
    Score: activity.Score
  };
  $("#user-activity-table").bootstrapTable("append", userActivity);
  //update highscores table
  let len = gameScores.length;
  for (let g = 0; g < len; ++g) {
    if (
      userActivity.Game == gameScores[g][0] &&
      gameScores[g][1] < userActivity.Score
    ) {
      gameScores[g][1] = userActivity.Score;
      document.querySelector(gameScores[g][2]).textContent = gameScores[g][1];
    }
  }
};

/*Populate the Account Info page with the user's information*/
let populateAccountInfo = function(userInfo) {
  document.querySelector("#account-username").textContent += userInfo.username;
  document.querySelector("#account-name").textContent += userInfo.name;
  document.querySelector("#account-email").textContent += userInfo.email;
  scores = [];
  for (var act in userInfo.user_activity) {
    scores.push(userInfo.user_activity[act]);
  }
  $("#user-activity-table").bootstrapTable({ data: userInfo.user_activity });
  $("#user-activity-table").bootstrapTable("load", scores);
  let length = userInfo.user_activity.length;
  let len = gameScores.length;
  for (let i = 0; i < length; ++i) {
    for (let g = 0; g < len; ++g) {
      if (
        userInfo.user_activity[i].Game == gameScores[g][0] &&
        gameScores[g][1] < userInfo.user_activity[i].Score
      )
        gameScores[g][1] = userInfo.user_activity[i].Score;
    }
  }
  for (let s = 0; s < len; ++s)
    document.querySelector(gameScores[s][2]).textContent = gameScores[s][1];
};

/*Remove user's info from the Account Info Page*/
let unpopulateAccountInfo = function() {
  document.querySelector("#account-username").textContent = "Username: ";
  document.querySelector("#account-name").textContent = "Name: ";
  document.querySelector("#account-email").textContent = "Email: ";
  let len = gameScores.length;
  $("#user-activity-table").bootstrapTable("removeAll");
  for (let s = 0; s < len; ++s) {
    gameScores[s][1] = "0";
    document.querySelector(gameScores[s][2]).textContent = gameScores[s][1];
  }
};

/*Make the Account Info page visible*/
let makeAccountPageVisible = function() {
  /*Make Account Info Page visible*/
  document.querySelector("#account-info-nav").className =
    "btn btn-secondary btn-sm visible-button";
  document.querySelector("#login-nav").className =
    "btn btn-secondary btn-sm invisible";
  toggleClasses("#account-info-page");
};

/* This function allows a user to login to their account*/
let signIn = function(username, password) {
  console.log("sign in");
  /*Auth*/
  // Send post request to server with username and password to handle database grabbing.
  // If the username or password is incorrect, display error message
  // Otherwise redirect to the account page.
  let url = "http://localhost:3000/user/login";
  console.log(url);
  let request_body = {
    username: username,
    password: password
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
    console.log(response.status);
    if (response.status === 200) {
      // Fill account page with information from the post request.
      response.json().then(data => {
        populateAccountInfo(data);
        makeAccountPageVisible();
      });
    } else if (response.status === 401) {
      // Account credentials are incorrect
    }
  });
};

/* logs the user out of the account*/
let signOut = function() {
  /*Make Account Info Page invisible*/
  document.querySelector("#login-nav").className =
    "btn btn-secondary btn-sm visible-button";
  document.querySelector("#account-info-nav").className =
    "btn btn-secondary btn-sm invisible";
  toggleClasses("#home-page");
  /*Remove user info from account info page*/
  unpopulateAccountInfo();
  console.log("sign out");
};

let checkFormInput = function(id) {
  var element = $(id).val();
  if (!element) {
    document.querySelector(id).className = "form-control invalid-input";
  } else {
    document.querySelector(id).className = "form-control";
  }
};

/* Checks if all required fields are filled for login*/
let checkLoginFields = function() {
  var username = $("#username1").val();
  var password = $("#password1").val();
  if (username && password) signIn(username, password);
  if (!username) {
    document.querySelector("#username1").className =
      "form-control invalid-input";
  } else {
    document.querySelector("#username1").className = "form-control";
  }
  if (!password) {
    document.querySelector("#password1").className =
      "form-control invalid-input";
  } else {
    document.querySelector("#password1").className = "form-control";
  }
};

/* create new user account*/
let createAccount = function(username, password, name, email) {
  let url = "http://localhost:3000/user/create";
  console.log(url);
  let request_body = {
    username: username,
    password: password,
    name: name,
    email: email
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
    console.log(response.status);
    if (response.status === 200) {
      // Fill account page with information from the post request.
      response.json().then(data => {
        populateAccountInfo(data);
        populateScoreboardsInfo();
        makeAccountPageVisible();
      });
    } else if (response.status === 401) {
      // Account credentials already exist
    }
  });
};

/* checks if all required fields are filled for account creation*/
let checkAccountCreationFields = function() {
  var username = $("#username2").val();
  var password = $("#password2").val();
  var name = $("#name").val();
  var email = $("#email").val();
  if (username && password && name && email)
    createAccount(username, password, name, email);
  if (!username) {
    document.querySelector("#username2").className =
      "form-control invalid-input";
  } else {
    document.querySelector("#username2").className = "form-control";
  }
  if (!password) {
    document.querySelector("#password2").className =
      "form-control invalid-input";
  } else {
    document.querySelector("#password2").className = "form-control";
  }
  if (!name) {
    document.querySelector("#name").className = "form-control invalid-input";
  } else {
    document.querySelector("#name").className = "form-control";
  }
  if (!email) {
    document.querySelector("#email").className = "form-control invalid-input";
  } else {
    document.querySelector("#email").className = "form-control";
  }
};

let arrowKeysHandler = function(e) {
  switch (e.keyCode) {
    case 38:
    case 40: //Arrow keys
      e.preventDefault();
      break; //Space
    default:
      break; //Don't block other keys
  }
};

/*Make the titles of the games on the hompage carousel visible links to the games*/
let carouselTitleColorChange = function() {
  $(".carousel-item").on("mouseover", function() {
    $(".carousel-img-title").css("color", "rgb(109, 182, 250)");
    $(".carousel-item").css("cursor", "pointer");
  });
  $(".carousel-item").on("mouseout", function() {
    $(".carousel-img-title").css("color", "rgb(61, 98, 219)");
    $(".carousel-item").css("cursor", "default");
  });
};

//**********************************  Run methods  ********************************************************
window.addEventListener("keydown", arrowKeysHandler, false);
let startGame = function(gameName) {};
