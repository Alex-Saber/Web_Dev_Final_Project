let currentPage = "#home-page";
let oldGame = document.createElement("script");
oldGame.type = "text/javascript";
oldGame.src = "";
let oldGameSrc = false;

let gameScripts = [
  ["#flappy-bird-page", "../bird.js"],
  ["#space-invaders-page", "../shooter.js"]
];

/* This function changes page display based on which menu
   item the user selects */
let toggleClasses = function(nextPage) {
  /*Toggle pages*/
  document.querySelector(currentPage).className = "container invisible";
  document.querySelector(nextPage).className = "container visible";
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
  currentPage = nextPage;
};

/* This function allows a user to login to their account*/
let signIn = function() {
  /*Auth*/

  /*Make Account Info Page visible*/
  document.querySelector("#account-info-nav").className =
    "btn btn-secondary btn-sm visible-button";
  document.querySelector("#login-nav").className =
    "btn btn-secondary btn-sm invisible";
  toggleClasses("#account-info-page");
};

/* logs the user out of the account*/
let signOut = function() {
  /*stuff*/

  /*Make Account Info Page invisible*/
  document.querySelector("#login-nav").className =
    "btn btn-secondary btn-sm visible-button";
  document.querySelector("#account-info-nav").className =
    "btn btn-secondary btn-sm invisible";
  toggleClasses("#home-page");
};

/* Checks if all required fields are filled for login*/
let checkLoginFields = function() {
  var username = $("#username1").val();
  var password = $("#password1").val();
  if (username && password) signIn();
};

/* create new user account*/
let createAccount = function() {};

/* checks if all required fields are filled for account creation*/
let checkAccountCreationFields = function() {
  var username = $("#username2").val();
  var password = $("#password2").val();
  var name = $("#name").val();
  var email = $("#email").val();
  if (username && password && name && email) createAccount();
};
