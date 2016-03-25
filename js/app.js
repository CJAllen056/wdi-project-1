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

// Turn determines how many turns have passed since the beginning of the game
// Direction is used to determine which direction the boxes will split when clicked

var turn = 0;
var direction = "horiz";


// The play function runs when the dom loads, and applies click events to all divs in the main section, including any div events that are generated after the dom loads.

function play() {
  $("main").on("click", "div", function() {
    var divClass = $(this).attr('class');
    var divWidth = $(this).attr('class').substr(1, 2);
    var divHeight = $(this).attr('class').substr(4);
    var divWidthPx = parseInt($(this).css("width").substr(0, $(this).css("width").length-2));
    var divHeightPx = parseInt($(this).css("height").substr(0, $(this).css("height").length-2));
    var divTop = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
    var divLeft = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
    splitBox(divWidth, divHeight, divWidthPx, divHeightPx, divTop, divLeft);
    checkMatches(divWidthPx, divHeightPx, divTop, divLeft, divClass);
    countUp();
    determineDirection();
    displayTurn();
    displayDirection();
  });
}

// The splitBox function splits any clicked box in half, replacing it with two boxes of half the size. The direction of the split is determined by the variable: direction. If the box is too small, it cannot be split. It positions the new boxes absolutely, based on the previous boxes position.

function splitBox(width, height, widthpx, heightpx, top, left) {
  if (direction === "horiz") {
    if (height <= 1) {
      turn--;
      return;
    } else {
      $(event.target).replaceWith("<div class='b" + width + "x0" + height/2 + "' style='top: " + top + "px; left: " + left + "px'></div><div class='b" + width + "x0" + height/2 + "' style='top: " + (top + (heightpx/2 + 1)) + "px; left: " + left + "px'></div>");
    }
  } else if (direction === "vert"){
    if (width <= 1) {
      turn--;
      return;
    } else {
      $(event.target).replaceWith("<div class='b0" + width/2 + "x" + height + "' style='top: " + top + "px; left: " + left + "px'></div><div class='b0" + width/2 + "x" + height + "' style='top: " + top + "px; left: " + (left + (widthpx/2 + 1)) + "px'></div>");
    }
  }
}

function checkMatches(width, height, top, left, classX) {
  if (direction === "horiz") {
    var newDivClass = classX.substr(0, 4) + "0" + classX.substr(4)/2;
    $("main div").each(function() {
      var divTop = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
      var divLeft = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
      var divClass = $(this).attr('class');
      if (divTop === top && (divLeft === (left + width + 2)) && newDivClass === divClass) {
        $("main div").each(function() {
          var divTop2 = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
          var divLeft2 = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
          var divClass2 = $(this).attr('class');
          if (((divTop2 === ((top + height + 2)/2)) && (divLeft2 === (left + width + 2))) && newDivClass === divClass2) {
            console.log("it's working?");
          }
        });
      } else if ((divTop === top && (divLeft === (left - width - 2))) && newDivClass === divClass) {
        $("main div").each(function() {
          var divTop2 = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
          var divLeft2 = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
          var divClass2 = $(this).attr('class');
          if ((divTop2 === ((top + height + 2)/2)) && (divLeft2 === (left - width - 2)) && newDivClass === divClass2) {
            console.log("it's working?");
          }
        });
      }
    });
  }
}

// The displayTurn function pushes the turn count onto the scoreboard. The displayDirection function pushes the direction of the next split onto the scoreboard.

function displayTurn() {
  $("#turns").html(turn);
}

function displayDirection() {
  if (direction === "horiz") {
    $("#direction").html("Horizontal");
  } else {
    $("#direction").html("Vertical");
  }
}

// The countUp function counts what turn you are on, adding one to the counter for every click.

function countUp() {
  turn++;
}

// The determineDirection function switches between horizontal and vertical splits, alternating every turn.

function determineDirection() {
  if (turn % 2 === 0) {
    direction = "horiz";
  } else {
    direction = "vert";
  }
}