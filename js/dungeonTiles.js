var dungeonTiles = {};

dungeonTiles.play = function (height, width, easy) {
	var game, totalSteps = 0, hasShownMessage = false;	

	game = dungeonTiles.logic.createGame(height, width, easy);
	dungeonTiles.ui.drawMap(game);
	dungeonTiles.ui.updatePlayerMap(game);
	
	window.top.document.onkeydown = function(evt) {
    	evt = evt || window.event;
    	var keyCode = evt.keyCode;
    	if (keyCode >= 37 && keyCode <= 40 ) {
    		if((game.getPlayerRow() < 4 && game.getPlayerCol() >= 0) || (game.getPlayerCol() < 4 && game.getPlayerRow() >= 0)){
        		return false;
        	}
    	}
	};
	
	$(document).keydown(function (e) {
	  var keyCode = e.keyCode || e.which,
	      arrow = {left: 37, up: 38, right: 39, down: 40 };
		  totalSteps++;
	  switch (keyCode) {
	    case arrow.left:
			game.move("LEFT");
				window.top.document.onkeydown(e);
	    break;
	    case arrow.up:
	      	game.move("UP");
				window.top.document.onkeydown(e);
	    break;
	    case arrow.right:
	      game.move("RIGHT");
				window.top.document.onkeydown(e);
	    break;
	    case arrow.down:
	      game.move("DOWN");
				window.top.document.onkeydown(e);
	    break;
	  }
	   dungeonTiles.ui.updatePlayerMap(game);
	   dungeonTiles.ui.setStatusBarText("Find the treasure! Use arrow keys to move. <br/> Total steps: "+totalSteps);
	   
	  if (game.hasFoundTreasure() && !hasShownMessage) {
				dungeonTiles.ui.showWinMessage();
				hasShownMessage = true;
			}
	});	
	return game;	
	
};



dungeonTiles.playInConsole = function () {
	var game, h, w, easy, nextMove;
	
	easy = true;
	h = Number(prompt("Enter height of game"));
	w = Number(prompt("Enter width of game"));
	easy = (prompt("enter e for easy game, d for difficult game") === "e") ? true : false; 
	
	game = dungeonTiles.logic.createGame(h, w, easy);
	
	
	while(!game.hasFoundTreasure() && nextMove !== "-1") {
		dungeonTiles.ui.drawPlayerMap(game);
		nextMove = prompt("Enter direction to move? U = Up, D = Down, L = Left, R = Right, -1 to quit");
		switch (nextMove) {
			case "U":
				game.move(dungeonTiles.directions.UP);
				break;
			case "D":
				game.move(dungeonTiles.directions.DOWN);
				break;
			case "R":
				game.move(dungeonTiles.directions.RIGHT);
				break;
			case "L":
				game.move(dungeonTiles.directions.LEFT);
				break;
		}
	};
	
	if (game.hasFoundTreasure()) {
		alert("YOU FIND TREASURE! CONGRATULATIONS!");
	} else {
		console.log("Thank you for playing");
	}
	
};
