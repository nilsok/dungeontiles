
dungeonTiles.logic.createGame = function (mapHeight, mapWidth, boolEasy) {
	var i, j, map, foundTreasure, playerRow = 0, playerCol = 0, treasureRow, treasureCol, move, discover, player;
	
	foundTreasure = false;
	map = dungeonTiles.logic.createMap(mapHeight, mapWidth);
	player = initPlayer();


	if (boolEasy) {
		dungeonTiles.logic.johnny.makeDoors(map);
	} else { // hard!
		dungeonTiles.logic.nils.makeDoors(map);
	}
	
	// hitta skatten! // workaround, men vad tusan...
	for (i = 0; i < map.length; i++) {
		for (j = 0; j < map[i].length; j++) {
			if (map[i][j].hasTreasure()) {
				treasureRow = i;
				treasureCol = j;
				break;
			}
		}
	}

	initPlayer =  function() {

		var foundKeys = [];

		getKeys = function() {
			return foundKeys;
		};

		addKey = function (key) {
			foundKeys.push(key);
		};

		return {
			getKeys: getKeys,
			addKey: addKey
		}
	};


	key = function (color) {
		return {
			color: color
		}
	}


	// nollställ alla accessible
	for (i = 0; i < map.length; i++) {
		for (j = 0; j < map[i].length; j++) {
			map[i][j].setAccessible(false);
		}
	}

	
	move = function (direction) {
		if (direction === dungeonTiles.directions.UP && map[playerRow][playerCol].getSide(dungeonTiles.directions.UP) !== "WALL") {
			playerRow--;
		} else if (direction === dungeonTiles.directions.DOWN && map[playerRow][playerCol].getSide(dungeonTiles.directions.DOWN) !== "WALL") {
			playerRow++;
		} else if (direction === dungeonTiles.directions.RIGHT && map[playerRow][playerCol].getSide(dungeonTiles.directions.RIGHT) !== "WALL") {
			playerCol++;
		} else if (direction === dungeonTiles.directions.LEFT && map[playerRow][playerCol].getSide(dungeonTiles.directions.LEFT) !== "WALL") {
			playerCol--;
		}
		discover(playerRow, playerCol);
		foundTreasure = map[playerRow][playerCol].hasTreasure();
	};
	
	
	discover = function (row, col) {
		
		map[row][col].setAccessible(true);
		// Kollar UPPÅT		
		if (row > 0 && map[row][col].getSide(dungeonTiles.directions.UP) === "OPEN" && !map[row-1][col].isAccessible()) {
			discover(row-1, col);
		}
		
		// Kollar NEDÅT		
		if (row < map.length -1 && map[row][col].getSide(dungeonTiles.directions.DOWN) === "OPEN" && !map[row+1][col].isAccessible()) {
			discover(row+1, col);
		}
		
		// Kollar HÖGER		
		if (row < map[row].length -1 && map[row][col].getSide(dungeonTiles.directions.RIGHT) === "OPEN"  && !map[row][col+1].isAccessible()) {
			discover(row, col+1);
		}
		
		// Kollar VÄNSTER		
		if (row > 0  && map[row][col].getSide(dungeonTiles.directions.LEFT) === "OPEN" &&  !map[row][col-1].isAccessible()) {
			discover(row, col-1);
		}		
	};
	
	
	var generateStart = (function () {
		//slumpa startpos senare
		discover(playerRow, playerCol);
	})();

	
	return {
		map:map,
		move:move,
		getPlayerRow : function () {
			return playerRow;
		},
		getPlayerCol : function () {
			return playerCol;	
		},
		hasFoundTreasure : function () {
			return foundTreasure;
		},
		getTreasureRow : function () {
			return treasureRow;
		},
		getTreasureCol : function () {
			return treasureCol; 
		}
	}	
	
};
