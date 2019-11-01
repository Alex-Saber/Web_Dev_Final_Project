let currentPage = "#home-page";

/*window.onload = function() {
  for (i = 0; i < pageList.length; ++i) {
    let displayType = "none";
    if (pageList[i] == "#home-page") {
      displayType = "block";
    }
    $(pageList[i]).css({
      display: displayType
    });

    console.log(currentPage);
  }
  toggle();
};

var toggle = function() {
  var pageList1 = [
    "#home-page",
    "#flappy-bird-page",
    "#tic-tac-toe-page",
    "#snake-page",
    "#space-invaders-page",
    "#login-page"
  ];

  var pageNavList1 = [
    "#home-nav",
    "#flappy-bird-nav",
    "#tic-tac-toe-nav",
    "#snake-nav",
    "#space-invaders-nav",
    "#login-nav"
  ];
  for (i = 0; i < pageList.length; ++i) {
    $(pageNavList1[i]).on("click", function() {
      console.log("in on click");
      $(currentPage).css({
        display: "none"
      });
      $(pageList1[i]).css({
        display: "block"
      });
      currentPage = pageList1[i];
      console.log(pageList1[i]);
      console.log(currentPage);
    });
  }
};
*/
window.onload = function() {
  /*var pageList = [
    "#home-page",
    "#flappy-bird-page",
    "#tic-tac-toe-page",
    "#snake-page",
    "#space-invaders-page",
    "#login-page"
  ];

  var pageNavList = [
    "#home-nav",
    "#flappy-bird-nav",
    "#tic-tac-toe-nav",
    "#snake-nav",
    "#space-invaders-nav",
    "#login-nav"
  ];
  for (i = 0; i < pageList.length; ++i) {
    $(pageNavList[i]).on("click", function() {
      document.querySelector(currentPage).className = "invisible";
      document.querySelector(pageList[i]).className = "visible";
      currentPage = pageList[i];
    });
  }*/
};

let toggleClasses = function(nextPage) {
  document.querySelector(currentPage).className = "container invisible";
  document.querySelector(nextPage).className = "container visible";
  currentPage = nextPage;
};
