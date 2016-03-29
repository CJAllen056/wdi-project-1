////// Goes need to alternate between splitting vertically and horizontally.
////// When a box is clicked, it needs to be replaced with two boxes of half the size. The direction of halving will alternate from turn to turn.
////// The number of moves needs to count up
////// When four or more boxes of the same size and shape line up in a grid of at least 2x2, they are taken out of play and given a timer. The timer counts down every time a move is made. When the timer on a box reaches zero the box dissapears and all boxes above fall into the space
////// There is a score which goes up every time a box ticks down

////// need a function that alternates between horizontal and vertical split
////// need a function that counts up for every click on the screen
////// need to detect when 4 boxes of the same shape are in the right configuration

////// when a div is clicked, take the height and width of the div. divide it by two and replace it with a div that is half the size in the necessary direction


// The whole game is stored in the object: split.

var split = split || {}

// Turn determines how many turns have passed since the beginning of the game.
// Score determines the players score.
// Direction is used to determine which direction the boxes will split when clicked.
// DivId is used to give each new div that is created a unique id.

split.turn = 0;
split.score = 0;
split.direction = "horiz";
split.divId = 0;

// The play function runs when the dom loads, and is used to set the event listeners on all of the buttons in the game, which includes the divs in the play area, the colour pickers and the restart button on the game over screen.

split.play = function() {
  $("#playArea").on("click", "div", split.setListeners);
  $("#playArea").on("click", "#restart", split.restartGame);
  split.colourListeners();
}

// The setListeners function is what is used to control the gameplay. It is activated whenever one of the divs in the play area is clicked, taking a number of variables about the clicked div and then running functions to split the div, check for matches or a loss, and update the display. The function also contains an if statement to prevent players clicking on boxes which they should not be able to.

split.setListeners = function() {
  var divClass = $(this).attr("class");
  var divWidth = $(this).attr("class").substr(1, 2);
  var divHeight = $(this).attr("class").substr(4);

  if (split.direction === "horiz" && (divHeight <= 1 || divClass.indexOf("matchedDiv") !== -1)) {
    return;
  } else if (split.direction === "vert" && (divWidth <= 1 || divClass.indexOf("matchedDiv") !== -1)) {
    return;
  } else if ($("main").first() === $("#gameOver")) {
    return;
  }

  var divWidthPx = parseInt($(this).css("width").substr(0, $(this).css("width").length-2));
  var divHeightPx = parseInt($(this).css("height").substr(0, $(this).css("height").length-2));
  var divTop = parseInt($(this).css("top").substr(0, $(this).css("top").length-2));
  var divLeft = parseInt($(this).css("left").substr(0, $(this).css("left").length-2));

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

// The splitBox function splits any clicked box in half, replacing it with two boxes of half the size. The direction of the split is determined by the variable: direction. If the box is too small, the split is prevented by the play function (above). The position of the two new boxes is determined by the position of the original boxes, and all boxes created have absolute positioning within the play area.

split.splitBox = function(width, height, widthpx, heightpx, top, left) {
  if (split.direction === "horiz") {
    $(event.target).replaceWith("<div id='" + split.divId + "' class='b" + width + "x0" + height/2 + "' style='top: " + top + "px; left: " + left + "px'></div><div id='" + (split.divId + 1) + "' class='b" + width + "x0" + height/2 + "' style='top: " + (top + (heightpx/2 + 1)) + "px; left: " + left + "px'></div>");
    split.divId+=2;
  } else if (split.direction === "vert"){
    $(event.target).replaceWith("<div id='" + split.divId + "' class='b0" + width/2 + "x" + height + "' style='top: " + top + "px; left: " + left + "px'></div><div id='" + (split.divId + 1) + "' class='b0" + width/2 + "x" + height + "' style='top: " + top + "px; left: " + (left + (widthpx/2 + 1)) + "px'></div>");
    split.divId+=2;
  }
}

// Whenever a split is made, the checkMatches function checks the board to see if any matches have been made (a match is made when four equaly sized and shaped boxes are together in a box). It takes the size of the new divs created by the splitBox function and checks if there are any similar boxes in positions on the board which would create a rectangle, using the absolute positioning of the boxes created.

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

// Once a match has been detected by the checkMatches function, the setToMatched function will give the matched boxes the correct properties. This involves setting their class to "matchedDiv" (giving the box appropriate styling from the css), and giving the box a number based on the turn on which it was matched.

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

// The matchedCountdown counts down the numbers in the matched divs by one every turn, and increases the player score by one for every tick on these divs.

split.matchedCountdown = function() {
  $(".matchedDiv").each(function() {
    var currentVal = $(this).html();
    $(this).html(currentVal - 1);
    split.score++;
  });
}

// The replaceMatchedAtZero function checks the board every turn to see if any of the matched divs have ticked down to zero. Once a grid of four boxes reaches zero it will be replaced by a larger div which is the size of the whole grid of four. The function also adds to the player score when the boxes are replaced. The amount added depends on the size of the replaced boxes.

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

// The checkForLoss function looks at the board every turn to see if there are any available moves. If the boxes are all matched (matched boxes can't be clicked), or if the boxes are all too thin to be clicked, the screen will display a game over message.

split.checkForLoss = function() {
  var divs = [];
  var gameOver = "<div id='gameOver'><article><p>GAME OVER</p><p>SCORE : " + (split.score + 1) + "</p><p id='restart'>RESTART</p></article></div>";

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

// The restartGame function is the event listener on the restart button which is displayed on the game over screen. As well as resetting the game board, the function also sets the player score and turn count to zero, and sets the split direction to horizontal.

split.restartGame = function() {
  $("#gameOver").replaceWith("<div class='b08x16'></div>");
  split.direction = "horiz";
  split.turn = 0;
  split.score = 0;
}

// The displayTurn, displayDirection and displayScore functions are responsible for putting their respective variables onto the screen. They run after every click to ensure the correct values can be seen.

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

// The countUp function runs every turn to increase both the turn count and the player score by 1 (the player scores one point for every click made).

split.countUp = function() {
  split.turn++;
  split.score++;
}

// The determineDirection function alternates the direction of the split between horizontal and vertical every turn. On every even turn the split will be horizontal, and on every vertical turn the split will be vertical.

split.determineDirection = function() {
  if (split.turn % 2 === 0) {
    split.direction = "horiz";
  } else {
    split.direction = "vert";
  }
}

// The colourListeners turn sets up the buttons which change the colour of the game board.

split.colourListeners = function() {
  $("#white").on("click", function() {
    $("#playArea").css("background", "white");
    $("main").css("border-color", "white");
    $("#scoreboard").css("border-color", "white");
    $("#acknowledgement").css("border-color", "white");
  });
  $("#red").on("click", function() {
    $("#playArea").css("background", "red");
    $("main").css("border-color", "red");
    $("#scoreboard").css("border-color", "red");
    $("#acknowledgement").css("border-color", "red");
  });
  $("#blue").on("click", function() {
    $("#playArea").css("background", "blue");
    $("main").css("border-color", "blue");
    $("#scoreboard").css("border-color", "blue");
    $("#acknowledgement").css("border-color", "blue");
  });
  $("#green").on("click", function() {
    $("#playArea").css("background", "green");
    $("main").css("border-color", "green");
    $("#scoreboard").css("border-color", "green");
    $("#acknowledgement").css("border-color", "green");
  });
  $("#yellow").on("click", function() {
    $("#playArea").css("background", "yellow");
    $("main").css("border-color", "yellow");
    $("#scoreboard").css("border-color", "yellow");
    $("#acknowledgement").css("border-color", "yellow");
  });
  $("#purple").on("click", function() {
    $("#playArea").css("background", "purple");
    $("main").css("border-color", "purple");
    $("#scoreboard").css("border-color", "purple");
    $("#acknowledgement").css("border-color", "purple");
  });
  $("#orange").on("click", function() {
    $("#playArea").css("background", "orange");
    $("main").css("border-color", "orange");
    $("#scoreboard").css("border-color", "orange");
    $("#acknowledgement").css("border-color", "orange");
  });
}

// The playSounds function will play a sound whenever a split is made. The sound made is different for a vertical and horizontal split.

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