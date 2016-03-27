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
var divId = 0;


// The play function runs when the dom loads, and applies click events to all divs in the main section, including any div events that are generated after the dom loads.

function play() {
  $("main").on("click", "div", setListeners);
}

// The setListeners function is the function that play uses to set the listeners....

function setListeners() {
    var divClass = $(this).attr("class");
    var divWidth = $(this).attr("class").substr(1, 2);
    var divHeight = $(this).attr("class").substr(4);
    var divWidthPx = parseInt($(this).css("width").substr(0, $(this).css("width").length-2));
    var divHeightPx = parseInt($(this).css("height").substr(0, $(this).css("height").length-2));
    var divTop = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
    var divLeft = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
    if (direction === "horiz" && (divHeight <= 1 || divClass.indexOf("matchedDiv") !== -1)) {
      return;
    } else if (direction === "vert" && (divWidth <= 1 || divClass.indexOf("matchedDiv") !== -1)) {
      return;
    }
    splitBox(divWidth, divHeight, divWidthPx, divHeightPx, divTop, divLeft);
    checkForLoss();
    matchedCountdown();
    removeMatchedAtZero();
    checkMatches(divWidthPx, divHeightPx, divTop, divLeft, divClass);
    countUp();
    determineDirection();
    displayTurn();
    displayDirection();
  }

// The splitBox function splits any clicked box in half, replacing it with two boxes of half the size. The direction of the split is determined by the variable: direction. If the box is too small, it cannot be split. It positions the new boxes absolutely, based on the previous boxes position.

function splitBox(width, height, widthpx, heightpx, top, left) {
  if (direction === "horiz") {
    $(event.target).replaceWith("<div id='" + divId + "' class='b" + width + "x0" + height/2 + "' style='top: " + top + "px; left: " + left + "px'></div><div id='" + (divId + 1) + "' class='b" + width + "x0" + height/2 + "' style='top: " + (top + (heightpx/2 + 1)) + "px; left: " + left + "px'></div>");
    divId+=2;
  } else if (direction === "vert"){
    $(event.target).replaceWith("<div id='" + divId + "' class='b0" + width/2 + "x" + height + "' style='top: " + top + "px; left: " + left + "px'></div><div id='" + (divId + 1) + "' class='b0" + width/2 + "x" + height + "' style='top: " + top + "px; left: " + (left + (widthpx/2 + 1)) + "px'></div>");
    divId+=2;
  }
}

// The checkMatches function checks the boxes surrounding the clicked box to see if there is a group of 4 boxes of the same size and shape.

function checkMatches(width, height, top, left, classX) {
  if (direction === "horiz") {
    var newDivClass = classX.substr(0, 4) + "0" + classX.substr(4)/2;
    $("main div").each(function() {
      var divTop = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
      var divLeft = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
      var divClass = $(this).attr("class");
      var divId = $(this).attr("id");
      if (divTop === top && (divLeft === (left + width + 2)) && newDivClass === divClass) {
        $("main div").each(function() {
          var divTop2 = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
          var divLeft2 = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
          var divClass2 = $(this).attr("class");
          if (((divTop2 === (top + (height + 2)/2)) && (divLeft2 === (left + width + 2))) && newDivClass === divClass2) {
            setToMatched(this, divId, height);
          }
        });
      } else if ((divTop === top && (divLeft === (left - width - 2))) && newDivClass === divClass) {
        $("main div").each(function() {
          var divTop2 = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
          var divLeft2 = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
          var divClass2 = $(this).attr("class");
          if ((divTop2 === (top + (height + 2)/2)) && (divLeft2 === (left - width - 2)) && newDivClass === divClass2) {
            setToMatched(this, divId, height);
          }
        });
      }
    });
  } else if (direction === "vert") {
    var newDivClass = "b0" + classX.substr(1, 2)/2 + classX.substr(3);
    $("main div").each(function() {
      var divTop = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
      var divLeft = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
      var divClass = $(this).attr("class");
      var divId = $(this).attr("id");
      if (divTop === (top + height + 2) && (divLeft === left) && newDivClass === divClass) {
        $("main div").each(function() {
          var divTop2 = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
          var divLeft2 = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
          var divClass2 = $(this).attr("class");
          if (divTop2 === (top + height + 2) && (divLeft2 === (left + (width + 2)/2)) && newDivClass === divClass2) {
            setToMatched(this, divId, height);
          }
        });
      } else if (divTop === (top - height - 2) && (divLeft === left) && newDivClass === divClass) {
        $("main div").each(function() {
          var divTop2 = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
          var divLeft2 = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
          var divClass2 = $(this).attr("class");
          if (divTop2 === (top - height - 2) && (divLeft2 === (left + (width + 2)/2)) && newDivClass === divClass2) {
            setToMatched(this, divId, height);
          }
        });
      }
    });
  }
}

// The setToMatched function gives the matched boxes found in the checkMatches function the correct properties for matched boxes.

function setToMatched(element, id, height) {
  var div1 = $("#" + (divId - 2));
  var div2 = $("#" + (divId - 1));
  var div3 = $(element);
  var div4 = $("#" + id);

  div1.attr("class", div1.attr("class") + " matchedDiv");
  div2.attr("class", div2.attr("class") + " matchedDiv");
  div3.attr("class", div3.attr("class") + " matchedDiv");
  div4.attr("class", div4.attr("class") + " matchedDiv");

  div1.html(turn);
  div2.html(turn);
  div3.html(turn);
  div4.html(turn);

  div1.css("line-height", height/2 + "px");
  div2.css("line-height", height/2 + "px");
  div3.css("line-height", height/2 + "px");
  div4.css("line-height", height/2 + "px");
}

// The matchedCountdown function makes the html values in matched (greyed out) divs count down by 1 each turn

function matchedCountdown() {
  $(".matchedDiv").each(function() {
    var currentVal = $(this).html();
    $(this).html(currentVal - 1);
  });
}

// The matched removeMatchedAtZero function makes matched boxes whose html values reach zero dissappear

function removeMatchedAtZero() {
  $(".matchedDiv").each(function() {
    if ($(this).html() === "0") {
      $(this).remove();
    }
  });
}

function replaceMatched() {

}

// The checkForLoss function loops through all the divs in the play area and checks if there are any clickable ones. If not, it gives a Game Over message.

function checkForLoss() {
  var divs = [];
  if (direction === "vert") {
    $("main div").each(function() {
      if ($(this).attr("class").indexOf("matchedDiv") === -1) {
        divs.push($(this).attr("class").substr(4));
      }
    });
    if ((divs.indexOf("02") === -1 && divs.indexOf("04") === -1 && divs.indexOf("08") === -1 && divs.indexOf("16")) || divs.length === 0)  {
      $("main").html("<div class='b08x16 matchedDiv'>GAME OVER</div>");
    }
  } else if (direction === "horiz") {
    $("main div").each(function() {
      if ($(this).attr("class").indexOf("matchedDiv") === -1) {
        divs.push($(this).attr("class").substr(1,2));
      }
    });
    if ((divs.indexOf("02") === -1 && divs.indexOf("04") === -1 && divs.indexOf("08") === -1) || divs.length === 0) {
      $("main").html("<div class='b08x16 matchedDiv'>GAME OVER</div>");
    }
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