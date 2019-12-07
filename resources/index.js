let currentPage = "#home-page";

let gameScores = [
  ["Flappy Bird", "0", "#bird_score"],
  ["Snake", "0", "#snake_score"],
  ["Space Invaders", "0", "#invaders_score"]
];

//The scoreboard's data and table id and game name
let scoreboards = [
  ["#flappy-bird-scoreboard-table", [], "Flappy Bird"],
  ["#snake-scoreboard-table", [], "Snake"],
  ["#space-invaders-scoreboard-table", [], "Space Invaders"]
];

/* This function changes page display based on which menu
   item the user selects */
let toggleClasses = function(nextPage) {
  /*Toggle pages*/
  document.querySelector(currentPage).className = "container-fluid invisible";
  document.querySelector(nextPage).className = "container-fluid visible";
  /*Update current page value*/
  currentPage = nextPage;
  /*Reset form values*/
  $(".form-control").val("");
  document.querySelector(".form-control").className = "form-control";
};

/*get the highscores and rankings for every player from the particular game*/
let getScores = function(game, i) {
  //Search db for each user's high score for the game passed in
  let scores = [];
  let url = "http://ata-atac-arcade.herokuapp.com/activities/" + game + "/";
  console.log(url);

  let fetch_obj = {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };
  fetch(url, fetch_obj).then(function(response) {
    console.log(response.status);
    if (response.status === 200) {
      response.json().then(data => {
        console.log("scores fetched");
        var index = 1;
        for (var score in data) {
          data[score].Status = index;
          ++index;
        }
        scoreboards[i][1] = data;
        $(scoreboards[i][0]).bootstrapTable({ data: scoreboards[i][1] });
        $(scoreboards[i][0]).bootstrapTable("load", scoreboards[i][1]);
      });
    } else if (response.status === 503) {
      console.log("scores not fetched");
    }
  });
};

/*load all the scoreboard's data*/
let populateScoreboardsInfo = function() {
  console.log("this game");
  let len = scoreboards.length;
  for (let i = 0; i < len; ++i) {
    getScores(scoreboards[i][2], i);
  }
};

/*load the particular scoreboard's data*/
let populateThisScoreboardInfo = function(game) {
  let len = scoreboards.length;
  for (let i = 0; i < len; ++i) {
    if (scoreboards[i][2] == game) {
      getScores(game, i);
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
  //write activity to user collection
  let url = "http://ata-atac-arcade.herokuapp.com/user/update/score";
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

  //write activity to activities collection
  let url2 = "http://ata-atac-arcade.herokuapp.com/update/scoreboards";

  fetch(url2, fetch_obj).then(function(response) {
    console.log(response.status);
  });

  //update activity table
  $("#user-activity-table").bootstrapTable("append", activity);
  //update highscores table
  let len = gameScores.length;
  for (let g = 0; g < len; ++g) {
    if (
      activity.Game == gameScores[g][0] &&
      gameScores[g][1] < activity.Score
    ) {
      gameScores[g][1] = activity.Score;
      document.querySelector(gameScores[g][2]).textContent = gameScores[g][1];
    }
  }
  //update scoreboard
  console.log("update scoreboard");
  unpopulateThisScoreboardInfo(activity.Game);
  populateThisScoreboardInfo(activity.Game);
};

/*Populate the Account Info page with the user's information*/
let populateAccountInfo = function(userInfo) {
  document.querySelector("#account-username").textContent += userInfo.username;
  document.querySelector("#account-name").textContent += userInfo.name;
  document.querySelector("#account-email").textContent += userInfo.email;
  $("#user-activity-table").bootstrapTable({ data: userInfo.user_activity });
  $("#user-activity-table").bootstrapTable("load", userInfo.user_activity);
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
  let url = "http://ata-atac-arcade.herokuapp.com/user/login";
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
        unpopulateAccountInfo();
        populateAccountInfo(data);
        makeAccountPageVisible();
      });
    } else if (response.status === 503) {
      // Account credentials are incorrect
      console.log("account credentials are incorrect");
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

  let url = "http://ata-atac-arcade.herokuapp.com/user/logout";
  console.log(url);
  let request_body = {};

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
  });
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
  let url = "http://ata-atac-arcade.herokuapp.com/user/create";
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
    // Fill account page with information from the post request.
    response.json().then(data => {

      if (data.Error === null) {
          unpopulateAccountInfo();
          populateAccountInfo(data);
          makeAccountPageVisible();
      }
    });
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
populateScoreboardsInfo();
