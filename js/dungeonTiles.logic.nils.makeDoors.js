// MEDDELANDE TILL JOHNNY NILSSON, HÄGERSTENSÅSEN: 
		// Jag bytte namn på accessible-gettern & settern till setAccessible() & isAccessible, Om du vill pröva och skulle få fel på det. 

//HARD Version
dungeonTiles.logic.nils = {};
dungeonTiles.logic.nils.makeDoors = function (map) {
	
	/**
	 * Starts at top/left (position[0][0]) and finds all tiles that are accessible from that tile
	 * 
	 */
	var findAccessibleTiles = function (map) {
		var tilesToCheck, i, j, currenTileToCheck, isTileChecked;		

		
		// sätter alla tiles till inacessible
		for (i = 0; i <map.length; i++) {
			for (j = 0; j < map[i].length; j++) {
				map[i][j].setAccessible(false);
			}
		}
		
		
		
		// skapar en array som håller reda på vilka tiles som har kontrollerats.
		isTileChecked = [];
		for (i = 0; i < map.length; i++) {
			isTileChecked[i] = [];
			for (j = 0; j < map[i].length; j++) {
				isTileChecked[i][j] = false;
			}
		}
		
		// sätter vänster-översta tilen till accessible
		map[0][0].setAccessible(true);
		
		tilesToCheck = [];
		tilesToCheck.push(map[0][0]);
		
		// medan det finns fler tiles att kolla (== det kan finnas fler tiles som är accesible)
		for (i = 0; i < tilesToCheck.length; i++) {
				
			currentTileToCheck = tilesToCheck[i];
				
			// Kollar UPPÅT
			if (currentTileToCheck.getRow() > 0) {
				if (currentTileToCheck.getSide(dungeonTiles.directions.UP) == "DOOR" ||
						currentTileToCheck.getSide(dungeonTiles.directions.UP) == "OPEN") {
							map[currentTileToCheck.getRow() -1][currentTileToCheck.getCol()].setAccessible(true);
							
							// Förhindrar att tiles som man redan har kollat vilka tiles som är tillgängliga från kollas igen. 
							if (!isTileChecked[currentTileToCheck.getRow() -1][currentTileToCheck.getCol()]) {
								tilesToCheck.push(map[currentTileToCheck.getRow()-1][currentTileToCheck.getCol()]);
							}
							
							
					}
				}
				
				// Kollar HÖGER
				if (currentTileToCheck.getCol() < map[0].length -1) {
					if (currentTileToCheck.getSide(dungeonTiles.directions.RIGHT) === "DOOR" ||
						currentTileToCheck.getSide(dungeonTiles.directions.RIGHT) === "OPEN") {
							map[currentTileToCheck.getRow()][currentTileToCheck.getCol() +1].setAccessible(true);
							
							// Förhindrar att tiles som man redan har kollat vilka tiles som är tillgängliga från kollas igen. 
							if (!isTileChecked[currentTileToCheck.getRow()][currentTileToCheck.getCol() +1]) {
								tilesToCheck.push(map[currentTileToCheck.getRow()][currentTileToCheck.getCol()+1]);
							}
					}
				}
				
				// Kollar NEDÅT
				if (currentTileToCheck.getRow() < map.length +1) {
					if (currentTileToCheck.getSide(dungeonTiles.directions.DOWN) === "DOOR" ||
						currentTileToCheck.getSide(dungeonTiles.directions.DOWN) === "OPEN") {
							map[currentTileToCheck.getRow()+1][currentTileToCheck.getCol()].setAccessible(true);
							
							// Förhindrar att tiles som man redan har kollat vilka tiles som är tillgängliga från kollas igen. 
							if (!isTileChecked[currentTileToCheck.getRow()+1][currentTileToCheck.getCol()]) {
								tilesToCheck.push(map[currentTileToCheck.getRow() +1][currentTileToCheck.getCol()]);
							}
					}
				}
				
				// Kollar VÄNSTER
				if (currentTileToCheck.getCol() > 0) {
					if (currentTileToCheck.getSide(dungeonTiles.directions.LEFT) === "DOOR" ||
						currentTileToCheck.getSide(dungeonTiles.directions.LEFT) === "OPEN") {
							map[currentTileToCheck.getRow()][currentTileToCheck.getCol()-1].setAccessible(true);
							
							// Förhindrar att tiles som man redan har kollat vilka tiles som är tillgängliga från kollas igen. 
							if (!isTileChecked[currentTileToCheck.getRow()][currentTileToCheck.getCol()-1]) {
								tilesToCheck.push(map[currentTileToCheck.getRow()][currentTileToCheck.getCol()-1]);
							}
					}
				}

				isTileChecked[currentTileToCheck.getRow()][currentTileToCheck.getCol()] = true;
				
			};
		
		// TODO - Debug print
		// console.log("FINISED findAccessibleTiles()");
	};
	
	/**
	 * Creates a door to an accessible tile at the first non-accessible tile from top/left that has an adjacent accessible tile  
	 */
	var makeNewDoor = function (map) {
		var i, j, doorCandidates, theDoorTile, possibleDirections, theChosenDirection;
				
		ihaveMadeADoor = false;
		
		doorCandidates = [];
		
		// samla alla kandidater för en dörr i en array
		for (i = 0; i < map.length; i++) {
			for (j = 0; j < map[i].length; j++) {
				if (!map[i][j].isAccessible() &&
					((i < map.length -1 && map[i+1][j].isAccessible()) ||
					 (i > 0 && map[i -1][j].isAccessible()) ||
					 (j < map[i].length -1 && map[i][j +1].isAccessible()) ||
					 (j > 0 && map[i][j -1].isAccessible()))) {
						doorCandidates.push(map[i][j]);
					}
				}
			}
		
		
		// slumpa fram en av dörrarna
		theDoorTile = doorCandidates[Math.floor(Math.random()*doorCandidates.length)];
		
		possibleDirections = [];
		
		// Ta reda på åt vilka håll man kan göra en dörr till en accessible-tile
		// Och samla dem i en array
		if (theDoorTile.getRow() < map.length -1 && map[theDoorTile.getRow()+1][theDoorTile.getCol()].isAccessible()) {
			possibleDirections.push(dungeonTiles.directions.DOWN);
		}
		if (theDoorTile.getRow() > 0 && map[theDoorTile.getRow() -1][theDoorTile.getCol()].isAccessible()) {
			possibleDirections.push(dungeonTiles.directions.UP);
		}
		if (theDoorTile.getCol() < map[0].length -1 && map[theDoorTile.getRow()][theDoorTile.getCol() +1].isAccessible()) {
			possibleDirections.push(dungeonTiles.directions.RIGHT);
		}
		if (theDoorTile.getCol() > 0 && map[theDoorTile.getRow()][theDoorTile.getCol() -1].isAccessible()) {
			possibleDirections.push(dungeonTiles.directions.LEFT);
		}
				
		// slumpa fram en av de möjliga riktningarna
		theChosenDirection = possibleDirections[Math.floor(Math.random()*possibleDirections.length)];
		
		// gör dörren
		theDoorTile.setSide(theChosenDirection, "DOOR");
		
		// gör en dörr på tilen mittemot.
		if (theChosenDirection === dungeonTiles.directions.UP) {
			map[theDoorTile.getRow()-1][theDoorTile.getCol()].setSide(dungeonTiles.directions.DOWN, "DOOR");
		} else 	if (theChosenDirection === dungeonTiles.directions.DOWN) {
			map[theDoorTile.getRow()+1][theDoorTile.getCol()].setSide(dungeonTiles.directions.UP, "DOOR");
		} else if (theChosenDirection === dungeonTiles.directions.RIGHT) {
			map[theDoorTile.getRow()][theDoorTile.getCol()+1].setSide(dungeonTiles.directions.LEFT, "DOOR");
		}else if (theChosenDirection === dungeonTiles.directions.LEFT) {
			map[theDoorTile.getRow()][theDoorTile.getCol()-1].setSide(dungeonTiles.directions.RIGHT, "DOOR");
		}

		// TODO - debug print
		// console.log("FINSIHED makeANewDoor()");
		
	};
	
	/**
	 * checks if the given map contains tiles that are not accessible
	 * 
	 */
	var containsInacessibleTiles = function (map) {
		var i, j;
		
		for (i = 0; i < map.length; i++) {
			for (j = 0; j < map[i].length; j++) {
				if (!map[i][j].isAccessible()) {
					return true;
				}
			}
		}
		return false;
	}
	
	
	/**
	 * the "main-loop"
	 */
	findAccessibleTiles(map);
	while (containsInacessibleTiles(map)) {
		makeNewDoor(map);
		findAccessibleTiles(map);
		
	}
	return map;	
};




