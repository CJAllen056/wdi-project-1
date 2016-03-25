// Goes need to alternate between splitting vertically and horizontally.
// When a box is clicked, it needs to be replaced with two boxes of half the size. The direction of halving will alternate from turn to turn.
// The number of moves needs to count up
// When four or more boxes of the same size and shape line up in a grid of at least 2x2, they are taken out of play and given a timer. The timer counts down every time a move is made. When the timer on a box reaches zero the box dissapears and all boxes above fall into the space
// There is a score which goes up every time a box ticks down

// need a function that alternates between horizontal and vertical split
// need a function that counts up for every click on the screen
// need to detect when 4 boxes of the same shape are in the right configuration

//when a div is clicked, take the height and width of the div. divide it by two and replace it with a div that is half the size in the necessary direction




$(play);

var turn = 0;
var direction = "horiz";

function play() {
  $("body").on("click", "div", function() {
    var divWidth = $(this).attr('class').substr(1, 2);
    var divHeight = $(this).attr('class').substr(4);
    splitBox(divWidth, divHeight);
    countUp();
    determineDirection();
  });
}

function splitBox(width, height) {
  if (direction === "horiz") {
    if (height <= 1) return;
    $(event.target).replaceWith("<div class='b" + width + "x0" + height/2 + "'></div><div class='b" + width + "x0" + height/2 + "'></div>");
  } else {
    if (width <= 1) return;
    $(event.target).replaceWith("<div class='b0" + width/2 + "x" + height + "'></div><div class='b0" + width/2 + "x" + height + "'></div>");
  }
}

function countUp() {
  turn++;
}

function determineDirection() {
  if (turn % 2 === 0) {
    direction = "horiz";
  } else {
    direction = "vert";
  }
}