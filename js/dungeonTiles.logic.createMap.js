dungeonTiles.logic.createMap = function (maxRows, maxCols) {
	var i;
	var j;
	var entranceRow;
	var entranceCol;
	var WALL = "WALL";
	var OPEN = "OPEN";
	var DOOR = "DOOR";
	var map = [];
	/*
	 * Generates a tile for the map
	 */
	var createTile = function (up, right, down, left, entrance, row, col) {
		var accessed = false;
		var checked = false; 
		var treasure;
		var item;
		
		treasure = false;
		item = " ";
		
		/*
		 * A tile
		 */
		var Tile = function () {
			this.setChecked = function() {
				checked = true;
			};
			
			this.isChecked = function() {
				return checked;	
			};
			
			this.getRow = function() {
				return row;
			};
			
			this.getCol = function() {
				return col;
			};
			/*
			 * Returns the side in the direction provided
			 * Use dungeonTiles.directions.xxx for direction
			 */
			this.getSide = function (direction){
				return (direction === dungeonTiles.directions.UP) ? up : 
				(direction === dungeonTiles.directions.RIGHT) ? right : 
				(direction === dungeonTiles.directions.DOWN) ? down : 
				(direction === dungeonTiles.directions.LEFT) ? left : undefined;
			};
			
			/*
			 * Sets the side in the direction provided with the newSide provided
			 * Use dungeonTiles.directions.xxx for direction and WALL / OPEN / DOOR for the newSide
			 */
			this.setSide = function (direction, newSide) {
				if(direction === dungeonTiles.directions.UP) {
					up = newSide;
				} else if (direction === dungeonTiles.directions.DOWN) {
					down = newSide;
				} else if (direction === dungeonTiles.directions.LEFT) {
					left = newSide;
				} else if (direction === dungeonTiles.directions.RIGHT) {
					right = newSide;
				};
			};
			
			/*
			 * Sets the tile to have an entrance
			 */
			this.setEntrance = function (boolEntrance){
				entrance = boolEntrance;
			};
			
			/*
			 * Returns true if the tile is marked as entrance
			 */
			this.isEntrance = function () {
				return entrance;
			};
		
			/*
			 * Sets the tile accessibility to the provided boolean status.
			 */
			this.setAccessible = function (boolAccessed) {
				this.accessed = boolAccessed;
			};
			
			/*
			 * Returns true if the tile is accessed
			 */
			this.isAccessible = function () {
				return this.accessed;
			};
			
			/*
			 * sets a Tile to contain treasure
			 */
			this.setTreasure = function () {
				treasure = true;
				item = "T";
			};
			
			/*
			 * checks if tile contains treasure
			 */
			
			this.hasTreasure = function () {
				return treasure;
			}
			
			/*
			 * gets the Item the tile can contain 
			 */
			this.getItem = function () {
				return item;
			};
			
			/*
			 * sets the Item the tile can contain
			 */
			this.setItem = function (stringItem) {
				item = stringItem;
			}

		};
		return new Tile;	
	};
	
	/*
	 * Autogenerates tiles for every position in the map
	 */
	var generateTiles = (function () {
		for(i = 0; i < maxRows; i++) {
			map[i] = [];
			for(j = 0; j < maxCols; j++) {
				map[i][j] = createTile(WALL, WALL, WALL, WALL, false, i, j);
			};
		};	
	})();
	
	/*
	 * Autoremoves random walls within the board
	 * Does not affect the outer border
	 */
	var removeWalls = (function () {
		for(i = 0; i < maxRows; i++) {
			for(j = 0; j < maxCols; j++) {
				var aTile = map[i][j];
				
				// console.log(aTile);
				//om aTile inte ligger på översta/nollte raden
				if(i > 0) {
					//sätt UP-sidan till antingen OPEN eller WALL
					aTile.setSide(dungeonTiles.directions.UP, parseInt(Math.random()* 10 ,10) > 6 ? OPEN : WALL);
					//hämta ovanstående rum och sätt dess DOWN-sida till samma som aTiles UP-sida
					var tileAbove = map[i-1][j];
					tileAbove.setSide(dungeonTiles.directions.DOWN, aTile.getSide(dungeonTiles.directions.UP));
					// console.log(aTile.getSide(dungeonTiles.directions.UP));
				};
				//anledningen till att vi fick fel igårkväll var för att den gick utanför arrayen. Glömde sätta -1 på maxRows
				if(i < maxRows-1) {
					aTile.setSide(dungeonTiles.directions.DOWN, parseInt(Math.random()* 10 ,10) > 6 ? OPEN : WALL);
					var tileBelow = map[i+1][j];
					tileBelow.setSide(dungeonTiles.directions.UP, aTile.getSide(dungeonTiles.directions.DOWN));
					// console.log(aTile.getSide(dungeonTiles.directions.DOWN));
				};
				
				if(j > 0) {
					aTile.setSide(dungeonTiles.directions.LEFT, parseInt(Math.random()* 10 ,10) > 6 ? OPEN : WALL);
					var tileLeft = map[i][j-1];
					tileLeft.setSide(dungeonTiles.directions.RIGHT, aTile.getSide(dungeonTiles.directions.LEFT));
					// console.log(aTile.getSide(dungeonTiles.directions.LEFT));
				};
				//anledningen till att vi fick fel igårkväll var för att den gick utanför arrayen. Glömde sätta -1 på maxCols
				if(j < maxCols-1) {
					aTile.setSide(dungeonTiles.directions.RIGHT, parseInt(Math.random()* 10 ,10) > 6 ? OPEN : WALL);
					var tileRight = map[i][j+1];
					tileRight.setSide(dungeonTiles.directions.LEFT, aTile.getSide(dungeonTiles.directions.RIGHT));
					// console.log(aTile.getSide(dungeonTiles.directions.RIGHT));
				};
			};
		};
	})();
	
	
	/*
	 * Autogenerates a start position,
	 * sets the tile to have an entrance
	 */
	// var generateStart = (function () {
		// entranceRow = parseInt(Math.random()*map.length, 10);
		// entranceCol = parseInt(Math.random()*map.length, 10);
		// map[entranceRow][entranceCol].isEntrance(true);
	// })();
	
	/*
	 * Autogenerates a position for the treasure
	 */
	var generateTreasure = (function () {
		map[Math.floor(Math.random()*map.length)][Math.floor(Math.random()*map[0].length)].setTreasure();		
	})();


	return map;
};
