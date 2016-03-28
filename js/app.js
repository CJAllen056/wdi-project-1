// Goes need to alternate between splitting vertically and horizontally.
// When a box is clicked, it needs to be replaced with two boxes of half the size. The direction of halving will alternate from turn to turn.
// The number of moves needs to count up
// When four or more boxes of the same size and shape line up in a grid of at least 2x2, they are taken out of play and given a timer. The timer counts down every time a move is made. When the timer on a box reaches zero the box dissapears and all boxes above fall into the space
// There is a score which goes up every time a box ticks down

// need a function that alternates between horizontal and vertical split
// need a function that counts up for every click on the screen
// need to detect when 4 boxes of the same shape are in the right configuration

//when a div is clicked, take the height and width of the div. divide it by two and replace it with a div that is half the size in the necessary direction

var split = split || {}

// Turn determines how many turns have passed since the beginning of the game
// Direction is used to determine which direction the boxes will split when clicked

split.turn = 0;
split.score = 0;
split.direction = "horiz";
split.divId = 0;

// The play function runs when the dom loads, and applies click events to all divs in the #playArea section, including any div events that are generated after the dom loads.

split.play = function() {
  $("#playArea").on("click", "div", split.setListeners);
  split.colourListeners();
}

// The setListeners function is the function that play uses to set the listeners....

split.setListeners = function() {
    var divClass = $(this).attr("class");
    var divWidth = $(this).attr("class").substr(1, 2);
    var divHeight = $(this).attr("class").substr(4);
    var divWidthPx = parseInt($(this).css("width").substr(0, $(this).css("width").length-2));
    var divHeightPx = parseInt($(this).css("height").substr(0, $(this).css("height").length-2));
    var divTop = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
    var divLeft = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
    if (split.direction === "horiz" && (divHeight <= 1 || divClass.indexOf("matchedDiv") !== -1)) {
      return;
    } else if (split.direction === "vert" && (divWidth <= 1 || divClass.indexOf("matchedDiv") !== -1)) {
      return;
    }
    split.splitBox(divWidth, divHeight, divWidthPx, divHeightPx, divTop, divLeft);
    split.playSounds();
    split.checkForLoss();
    split.matchedCountdown();
    split.replaceMatchedAtZero();
    split.checkMatches(divWidthPx, divHeightPx, divTop, divLeft, divClass);
    split.checkForLoss();
    split.countUp();
    split.determineDirection();
    split.displayTurn();
    split.displayDirection();
    split.displayScore();
  }

// The splitBox function splits any clicked box in half, replacing it with two boxes of half the size. The direction of the split is determined by the variable: direction. If the box is too small, it cannot be split. It positions the new boxes absolutely, based on the previous boxes position.

split.splitBox = function(width, height, widthpx, heightpx, top, left) {
  if (split.direction === "horiz") {
    $(event.target).replaceWith("<div id='" + split.divId + "' class='b" + width + "x0" + height/2 + "' style='top: " + top + "px; left: " + left + "px'></div><div id='" + (split.divId + 1) + "' class='b" + width + "x0" + height/2 + "' style='top: " + (top + (heightpx/2 + 1)) + "px; left: " + left + "px'></div>");
    split.divId+=2;
  } else if (split.direction === "vert"){
    $(event.target).replaceWith("<div id='" + split.divId + "' class='b0" + width/2 + "x" + height + "' style='top: " + top + "px; left: " + left + "px'></div><div id='" + (split.divId + 1) + "' class='b0" + width/2 + "x" + height + "' style='top: " + top + "px; left: " + (left + (widthpx/2 + 1)) + "px'></div>");
    split.divId+=2;
  }
}

// The checkMatches function checks the boxes surrounding the clicked box to see if there is a group of 4 boxes of the same size and shape.

split.checkMatches = function(width, height, top, left, classX) {
  if (split.direction === "horiz") {
    var newDivClass = classX.substr(0, 4) + "0" + classX.substr(4)/2;
    $("#playArea div").each(function() {
      var divTop = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
      var divLeft = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
      var divClass = $(this).attr("class");
      var thisDivId = $(this).attr("id");
      if (divTop === top && (divLeft === (left + width + 2)) && newDivClass === divClass) {
        $("#playArea div").each(function() {
          var divTop2 = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
          var divLeft2 = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
          var divClass2 = $(this).attr("class");
          if (((divTop2 === (top + (height + 2)/2)) && (divLeft2 === (left + width + 2))) && newDivClass === divClass2) {
            split.setToMatched(this, thisDivId, height);
          }
        });
      } else if ((divTop === top && (divLeft === (left - width - 2))) && newDivClass === divClass) {
        $("#playArea div").each(function() {
          var divTop2 = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
          var divLeft2 = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
          var divClass2 = $(this).attr("class");
          if ((divTop2 === (top + (height + 2)/2)) && (divLeft2 === (left - width - 2)) && newDivClass === divClass2) {
            split.setToMatched(this, thisDivId, height);
          }
        });
      }
    });
  } else if (split.direction === "vert") {
    var newDivClass = "b0" + classX.substr(1, 2)/2 + classX.substr(3);
    $("#playArea div").each(function() {
      var divTop = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
      var divLeft = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
      var divClass = $(this).attr("class");
      var thisDivId = $(this).attr("id");
      if (divTop === (top + height + 2) && (divLeft === left) && newDivClass === divClass) {
        $("#playArea div").each(function() {
          var divTop2 = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
          var divLeft2 = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
          var divClass2 = $(this).attr("class");
          if (divTop2 === (top + height + 2) && (divLeft2 === (left + (width + 2)/2)) && newDivClass === divClass2) {
            split.setToMatched(this, thisDivId, height * 2);
          }
        });
      } else if (divTop === (top - height - 2) && (divLeft === left) && newDivClass === divClass) {
        $("#playArea div").each(function() {
          var divTop2 = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
          var divLeft2 = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));
          var divClass2 = $(this).attr("class");
          if (divTop2 === (top - height - 2) && (divLeft2 === (left + (width + 2)/2)) && newDivClass === divClass2) {
            split.setToMatched(this, thisDivId, height * 2);
          }
        });
      }
    });
  }
}

// The setToMatched function gives the matched boxes found in the checkMatches function the correct properties for matched boxes.

split.setToMatched = function(element, id, height) {
  var div1 = $("#" + (split.divId - 2));
  var div2 = $("#" + (split.divId - 1));
  var div3 = $(element);
  var div4 = $("#" + id);

  div1.attr("class", div1.attr("class") + " matchedDiv");
  div2.attr("class", div2.attr("class") + " matchedDiv");
  div3.attr("class", div3.attr("class") + " matchedDiv");
  div4.attr("class", div4.attr("class") + " matchedDiv");

  div1.html(split.turn);
  div2.html(split.turn);
  div3.html(split.turn);
  div4.html(split.turn);

  div1.css("line-height", height/2 + "px");
  div2.css("line-height", height/2 + "px");
  div3.css("line-height", height/2 + "px");
  div4.css("line-height", height/2 + "px");
}

// The matchedCountdown function makes the html values in matched (greyed out) divs count down by 1 each turn

split.matchedCountdown = function() {
  $(".matchedDiv").each(function() {
    var currentVal = $(this).html();
    $(this).html(currentVal - 1);
    split.score++;
  });
}

split.replaceMatchedAtZero = function() {
  $(".matchedDiv").each(function() {
    var done = false;

    var replacementWidth = parseInt($(this).attr("class").substr(1, 2)) * 2;
    var replacementHeight = parseInt($(this).attr("class").substr(4)) * 2;
    var replacementTop = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
    var replacementLeft = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));

    if ($(this).html() === "0") {
      $(".matchedDiv").each(function() {
        if ($(this).html() === "0") {
          $(this).fadeOut(80).fadeIn(80).fadeOut(80, function() {
            $(this).remove();
            if (done === false) {
              done = true;

              $("#playArea").append("<div class='b0" + replacementWidth + "x0" + replacementHeight + "' style='top: " + replacementTop + "px; left: " + replacementLeft + "px'></div>");
            }
          });
        }
      });
      split.score += (replacementHeight * replacementWidth)/4;
    }
  });
}

// The checkForLoss function loops through all the divs in the play area and checks if there are any clickable ones. If not, it gives a Game Over message.

split.checkForLoss = function() {
  var divs = [];
  var gameOver = "<div class='b08x16 matchedDiv' style='line-height: 638px; font-size: 40px'>GAME OVER</div>";

  if ($("#playArea").html() === gameOver) {
    return;
  } else if (split.direction === "vert") {
    $("#playArea div").each(function() {
      if ($(this).attr("class").indexOf("matchedDiv") === -1) {
        divs.push($(this).attr("class").substr(4));
      }
    });
    if ((divs.indexOf("02") === -1 && divs.indexOf("04") === -1 && divs.indexOf("08") === -1 && divs.indexOf("16")) || divs.length === 0)  {
      $("#playArea").fadeOut(1000);
      setTimeout(function() {
        $("#playArea").html(gameOver);
      }, 1000);
      $("#playArea").fadeIn(600);
    }
  } else if (split.direction === "horiz") {
    $("#playArea div").each(function() {
      if ($(this).attr("class").indexOf("matchedDiv") === -1) {
        divs.push($(this).attr("class").substr(1,2));
      }
    });
    if ((divs.indexOf("02") === -1 && divs.indexOf("04") === -1 && divs.indexOf("08") === -1) || divs.length === 0) {
      $("#playArea").fadeOut(1000);
      setTimeout(function() {
        $("#playArea").html(gameOver);
      }, 1000);
      $("#playArea").fadeIn(600);
    }
  }
}

// The displayTurn function pushes the turn count onto the scoreboard. The displayDirection function pushes the direction of the next split onto the scoreboard.

split.displayTurn = function() {
  $("#turns").html(split.turn);
}

split.displayDirection = function() {
  if (split.direction === "horiz") {
    $("#direction").html("H");
  } else {
    $("#direction").html("V");
  }
}

split.displayScore = function() {
  $("#score").html(split.score);
}

// The countUp function counts what turn you are on, adding one to the counter for every click.

split.countUp = function() {
  split.turn++;
  split.score++;
}

// The determineDirection function switches between horizontal and vertical splits, alternating every turn.

split.determineDirection = function() {
  if (split.turn % 2 === 0) {
    split.direction = "horiz";
  } else {
    split.direction = "vert";
  }
}

split.colourListeners = function() {
  $("#white").on("click", function() {
    ($("#playArea")).css("background", "white");
  });
  $("#red").on("click", function() {
    ($("#playArea")).css("background", "red");
  });
  $("#blue").on("click", function() {
    ($("#playArea")).css("background", "blue");
  });
  $("#green").on("click", function() {
    ($("#playArea")).css("background", "green");
  });
  $("#yellow").on("click", function() {
    ($("#playArea")).css("background", "yellow");
  });
  $("#purple").on("click", function() {
    ($("#playArea")).css("background", "purple");
  });
  $("#orange").on("click", function() {
    ($("#playArea")).css("background", "orange");
  });
}

split.playSounds = function() {
  var audio = $("audio")
  if (split.direction === "horiz") {
    audio.attr("src", "./sounds/sound1.mp3");
    audio[0].play();
  } else if (split.direction === "vert") {
    audio.attr("src", "./sounds/sound2.mp3")
    audio[0].play();
  }
}

$(split.play);