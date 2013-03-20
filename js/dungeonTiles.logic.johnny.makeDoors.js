//EASY VERSION
dungeonTiles.logic.johnny = {};
dungeonTiles.logic.johnny.makeDoors = function(map) {
	var WALL = "WALL";
	var OPEN = "OPEN";
	var DOOR = "DOOR";
	var makeAllTilesAccessible = function () {
		// console.log("makeAllTilesAccessible is running");
		var k ;
		map[0][0].setAccessible(true);
		map[0][0].setChecked();
		
		for(i = 0; i < map.length; i++) {
			for(j = 0; j < map[i].length; j++) {
				var unaccessedNeighbours = [];
				
				//Gör nuvarande ruta tillgänglig
				//Kolla om det finns otillgängliga rutor omkring nuvarande ruta
				//Om otillgänglig, lägg till i unacessedNeighbours[]
				if(i > 0) {
					if((! map[i-1][j].isAccessible()) && (! map[i-1][j].isChecked()) && map[i][j].getSide(dungeonTiles.directions.UP) === WALL) {
						unaccessedNeighbours.push(map[i-1][j]);
						map[i-1][j].setChecked();
						// console.log(i +" "+j+" har en granne uppåt otillgänglig");				
					};
				};
				
				if(i < map.length-1) {
					if((! map[i+1][j].isAccessible()) && (! map[i+1][j].isChecked()) && map[i][j].getSide(dungeonTiles.directions.DOWN) === WALL) {
						unaccessedNeighbours.push(map[i+1][j]);
						map[i+1][j].setChecked();
						// console.log(i +" "+j+" har en granne neråt otillgänglig");				
					};
				};
				
				if(j > 0) {
					if((! map[i][j-1].isAccessible()) && (! map[i][j-1].isChecked()) && map[i][j].getSide(dungeonTiles.directions.LEFT) === WALL) {
						unaccessedNeighbours.push(map[i][j-1]);
						map[i][j-1].setChecked();
						// console.log(i +" "+j+" har en granne vänster otillgänglig");				
					};
				};
				
				if(j < map[i].length-1) {
					if((! map[i][j+1].isAccessible()) && (! map[i][j+1].isChecked()) && map[i][j].getSide(dungeonTiles.directions.RIGHT) === WALL) {
						unaccessedNeighbours.push(map[i][j+1]);
						map[i][j+1].setChecked();
						// console.log(i +" "+j+" har en granne höger otillgänglig");
					};
				};
		
				//medans unaccessedNeighbours.length > 0
				while(unaccessedNeighbours.length > 0) {
					// console.log(unaccessedNeighbours.length);
					//Slumpa fram en granne
					var aTile = unaccessedNeighbours[parseInt(Math.random()*unaccessedNeighbours.length, 10)];
					//Om framslumpad granne fortfarande är unaccessed
					if(! aTile.isAccessible()) {
						//Gör dörr från mig till granne
						//Gör dörr från granne till mig.
						if(i < aTile.getRow()) {
							//Granne under mig
							map[i][j].setSide(dungeonTiles.directions.DOWN, DOOR);
							aTile.setSide(dungeonTiles.directions.UP, DOOR);
							aTile.setAccessible(true);
						}; 
						if(i > aTile.getRow()){
							//Granne över mig
							map[i][j].setSide(dungeonTiles.directions.UP, DOOR);
							aTile.setSide(dungeonTiles.directions.DOWN, DOOR);
							aTile.setAccessible(true);
						};
						
						
						if(j < aTile.getCol()) {
							//Granne till höger							
							map[i][j].setSide(dungeonTiles.directions.RIGHT, DOOR);
							aTile.setSide(dungeonTiles.directions.LEFT, DOOR);
							aTile.setAccessible(true);
						};
						if(j > aTile.getCol()){
							//Granne till vänster
							map[i][j].setSide(dungeonTiles.directions.LEFT, DOOR);
							aTile.setSide(dungeonTiles.directions.RIGHT, DOOR);
							aTile.setAccessible(true);
						}; 
						
						//Ta bort granne från unaccessedNeighbours
						for(k = 0; k < unaccessedNeighbours.length; k++) { 
							if(unaccessedNeighbours[k].getRow() === aTile.getRow() && unaccessedNeighbours[k].getCol() === aTile.getCol()) {
								unaccessedNeighbours.splice(k, 1);
							};
						};
						//checkAccessibleTilesFromTile(granneRow, granneCol)
						checkAccessibleTilesFromTile(aTile.getRow(), aTile.getCol());
					} else {
					//annars om grannen är accessed
						//Ta bort granne från unaccessedNeighbours
						for(k = 0; k < unaccessedNeighbours.length; k++) { 
							if(unaccessedNeighbours[k].getRow() === aTile.getRow() && unaccessedNeighbours[k].getCol() === aTile.getCol()) {
								unaccessedNeighbours.splice(k, 1);
							};
						};
					};
				};
			};
		};
	};

	var checkAccessibleTilesFromTile = function(row, col) {
		this.calls++;
		// console.log(row + " "+ col)
		if(row > 0) {
			//Kolla om det finns wall upp
			if(map[row-1][col].getSide(dungeonTiles.directions.UP) !== WALL) {
				//om false - markera tilen ovanför som accessible
				map[row-1][col].setAccessible(true);
				//checkAccessibleTilesFromTile(tileAboveRow, tileAboveCol)
				if(this.calls < 200) {
					checkAccessibleTilesFromTile(row-1, col);
				};
			};
		};
		
		if(row < map.length-1) {
			
			if(map[row+1][col].getSide(dungeonTiles.directions.DOWN) !== WALL) {
				map[row+1][col].setAccessible(true);
				if(this.calls < 200) {
					checkAccessibleTilesFromTile(row+1, col);
				};
			};
		};
		
		if(col > 0) {
			if(map[row][col-1].getSide(dungeonTiles.directions.LEFT) !== WALL) {
				map[row][col-1].setAccessible(true);
				if(this.calls < 200) {
					checkAccessibleTilesFromTile(row, col-1);
				};
			};
		};
		
		if(col < map[row].length-1) {
			if(map[row][col+1].getSide(dungeonTiles.directions.RIGHT) !== WALL) {
				map[row][col+1].setAccessible(true);
				if(this.calls < 200) {
					checkAccessibleTilesFromTile(row, col+1);
				};
			};
		};
		this.calls--;
	};
	
	makeAllTilesAccessible();
	return map;
};