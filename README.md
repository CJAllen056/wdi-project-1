# Split
## Introduction
Split is a clone of the game SPL-T developed by Simogo. It was programmed in Javascript as my first project during the Web Development Immersive programme at General Assembly London.

Split is a 1 player puzzle game, where the aim is to get as high score as possible.

## How to Play

The player clicks boxes to split them in two. Splits (turns) alternate between horizontal and vertical (the current direction is displayed on the scoreboard, indicated by an 'H' or 'V'). If a block is too small, it can't be split. For example, if the current split is vertical, a box has to be wide enough to be split.

When a split line creates a cross consisting of four equally sized blocks, the blocks become **point blocks** which can't be split.

When point blocks are created, they receive a number determined by the current amount of splits. For each split made, the number on existing point blocks will count down by one. When a point block reaches zero, it will dissappear.

#### Scoring system
* Each split made earns one point.
* Each countdown of a point block will earn one point.
* When a point block dissappears, points are earned based on the size of the block.

When no further splits can be made, it's game over.

## Technologies
* Javascript
* HTML and CSS
* Jquery

## Technical issues
* The game will very occasionally put the new block in the wrong place when a point block dissappears. This will require a hard reset.
* The game over screen sometimes flashes twice when there are no possible matches. It is only supposed to flash once, but fortunately this is only a cosmetic issue.
* Sometimes the game will be able to detect when there is a group of six similar boxes in a rectangle, when usually it can only detect four. Given more time I would ideally make it so the game could always detect any formation of similar boxes in a rectaangle, but at the moment this behaviour is not intentional.
* In the original game, when a point block dissappears it is not immediately replaced, and instead boxes drop down from above to fill the missing space. Any point boxes that drop down have their point score cut in half, meaning that they will be replaced sooner. This makes the game a lot more fun, with the potential for much higher scores, but unfortunately I was not able to program this in.

## Acknowledgements
* Simogo for developing the original game from which this game is cloned.
* The team at General Assembly for teaching me enough in two weeks to be able to develop this game.