dungeonTiles.ui = {}; 

dungeonTiles.ui.drawMap = function (game) {
	var i, j, row, map = game.map;
	
	
	var container = $("<div>").attr("id", "container");
	$("body").append(container);
	container.css("width", map[0].length*65);
	
	var statusbar = $("<div>").attr("id", "statusbar").append($("<p>").attr("id", "statusbar-text").text("Find the treasure! Use arrow keys to move")).click(function () {
		$("#statusbar").hide();
	});
	$("body").append(statusbar);
	
	for (i = 0; i < map.length; i++) {
		row = $("<div>").addClass("row" + i);
		container.append(row);
		row.append($("<div>").addClass("layer").attr("id", "floor"+i ));
		row.append($("<div>").addClass("layer").attr("id", "upWalls"+i ));
		row.append($("<div>").addClass("layer").attr("id", "leftWalls"+i ));
		if (i === map.length -1) {
			row.append($("<div>").addClass("layer").attr("id", "downWalls"));
		}
		for (j=0; j < map[i].length; j++) {
			//lägg golv
			$("#floor"+i).append($("<div>").addClass("tileFloor").attr("id", "floor"+i+"x"+j).css("top", i*63+"px").css("left", j*64+"px"));

			// skapa väggen ovanför
			var upWall = $("<div>").attr("id", "up"+i+"x"+j).css("left", 64*j).css("top", (63*i)-13+"px");			
			if(map[i][j].getSide("UP") === "WALL") {
				upWall.addClass("wallHorizontal");
			} else if (map[i][j].getSide("UP") === "DOOR") {
				upWall.addClass("wallHorizontalDoor");
			} else if (map[i][j].getSide("UP") === "OPEN") {
				upWall.addClass("wallHorizontalNoWall");
			}
			$("#upWalls"+i).append(upWall);
			
			
			// skapa väggen t.v.
			leftWall = $("<div>").attr("id", "left"+i+"x"+j).css("left", 64*j+"px").css("top", (63*i)-13+"px");
			if (map[i][j].getSide("LEFT") === "WALL") {
				leftWall.addClass("wallVertical");
			} else if (map[i][j].getSide("LEFT") === "DOOR") {
				leftWall.addClass("wallVerticalDoor");
			} else if (map[i][j].getSide("LEFT") === "OPEN"){
				leftWall.addClass("wallVerticalNoWall");
			}
			$("#leftWalls"+i).append(leftWall);
			
			
			//om det är längst till höger, lägg till en wall till höger
			if(j === map[i].length-1) {
				$("#leftWalls"+i).append($("<div>").attr("id", "right"+i).addClass("wallVertical").css("left", (j+1)*64+"px").css("top", (63*i)-13+"px"));
			}
			// om det är botten-row, lägg till en wall längst nere
			if (i === map.length-1) {
				$("#downWalls").append($("<div>").attr("id", "bottomWall"+j).addClass("wallHorizontal").css("top", ((i+1)*63)-13).css("left", 64*j+"px" ));
			}	
		}	
	}
	
	container.append($("<div>").addClass("layer").attr("id", "characterLayer"));
	$("#characterLayer").append($("<div>").attr("id", "character").css("top", "10px").css("left", "30px"));
	
	container.append($("<div>").addClass("layer").attr("id", "treasureLayer"));
	$("#treasureLayer").append($("<div>").attr("class", "treasure").css("top", ((game.getTreasureRow()*63) + 18) + "px").css("left", ((game.getTreasureCol()*64) + 30) + "px").addClass("notDiscovered"));
		
	
}


dungeonTiles.ui.updatePlayerMap = function(game) {
	var i, j, row, map, upWall, leftWall;
	map = game.map;
	
	
	for (i=0; i <map.length; i++) {
		for (j=0; j < map[i].length; j++) {		
			// kolla om tile är oupptäckt
			if (!map[i][j].isAccessible()) {
				$("#floor"+i+"x"+j).addClass("notDiscovered");
				
				if(i > 0 && !map[i-1][j].isAccessible()) {
					$("#up"+i+"x"+j).addClass("notDiscovered");
				}  else if (i === 0) {
					$("#up0x"+j).addClass("notDiscovered");
				}
				
				if(j > 0 && !map[i][j-1].isAccessible()) {
					$("#left"+i+"x"+j).addClass("notDiscovered")
				}  else if (j === 0) {
					$("#left"+i+"x0").addClass("notDiscovered");
				}
				 
				
				// stänger av nedersta väggen om ej upptäckt
				if (i === map.length -1) {
					$("#bottomWall"+j).addClass("notDiscovered");
				}
					// stänger av högra väggen om ej upptäckt
				if (j === map[i].length -1) {
					$("#right"+i).addClass("notDiscovered");
				}
				
				if(i > 0 && map[i-1][j].isAccessible()) {
					$("#up"+i+"x"+j).removeClass("notDiscovered");
					console.log("UP: "+i+" "+j);
				}
				
				if(j > 0 && map[i][j - 1].isAccessible()) {
					$("#left"+i+"x"+j).removeClass("notDiscovered");
					console.log("LEFT: "+i+" "+j);
				}	
				
			} else {
				//$("#floor"+i+"x"+j).css("background-color", "#4f9fa0"); <-- remove for old floor
				$("#floor"+i+"x"+j).removeClass("notDiscovered");
				$("#up"+i+"x"+j).removeClass("notDiscovered");
				$("#left"+i+"x"+j).removeClass("notDiscovered");
				
				// visar nedersta väggen om upptäckt
				if (i === map.length -1) {
					$("#bottomWall"+j).removeClass("notDiscovered");
				}
					// visar högra väggen om upptäckt
				if (j === map[i].length -1) {
					$("#right"+i).removeClass("notDiscovered");
				}
				
			}
		}
	}
	
	$("#character").css("top", ((game.getPlayerRow()*63) + 10) + "px").css("left", ((game.getPlayerCol()*64)+30) + "px");
	
	if (map[game.getTreasureRow()][game.getTreasureCol()].isAccessible()) {
		$(".treasure").removeClass("notDiscovered");
	}
	
};

dungeonTiles.ui.setStatusBarText = function (message) {
	$("#statusbar-text").html(message);
}

dungeonTiles.ui.showWinMessage = function () {
	$("body").append($("<div>").attr("id", "winMessage").html("<p id=\"winText\">You found It!<br/>Congratulations!</p>")).click(function () {
		$("#winMessage").hide();
	})
}

dungeonTiles.ui.drawMapConsole = function (map) {
	var draw = [];
	var i, j;
	var counter = 0;
	
	for(i = 0; i < map.length; i++) {
			draw[counter] = "";
			draw[counter+1] = "";
			draw[counter+2] = "";
			draw[counter+3] = "";
			draw[counter+4] = "";
		for(j = 0; j < map[i].length; j++) {
			
			if(map[i][j].getSide(dungeonTiles.directions.UP) === "WALL") {
				draw[counter] += "-----";	
			} else if(map[i][j].getSide(dungeonTiles.directions.UP) === "OPEN") {
				draw[counter] += "-    ";	
			} else if(map[i][j].getSide(dungeonTiles.directions.UP) === "DOOR") {
				draw[counter] += "--D--";
			};

			// if(map[i][j].isAccessible()) {		
				if(map[i][j].getSide(dungeonTiles.directions.LEFT) === "WALL") {
					draw[counter+1] += "|    ";
					draw[counter+2] += "|    ";
					draw[counter+3] += "|    ";
				} else if(map[i][j].getSide(dungeonTiles.directions.LEFT) === "OPEN") {
					draw[counter+1] += "     ";
					draw[counter+2] += "-    ";
					draw[counter+3] += "     ";	
				} else if(map[i][j].getSide(dungeonTiles.directions.LEFT) === "DOOR") {
					draw[counter+1] += "|    ";
					draw[counter+2] += "D    ";
					draw[counter+3] += "|    ";
				};
			// } else {
				// draw[counter+1] += "*****";
				// draw[counter+2] += "*****";
				// draw[counter+3] += "*****";
			// }
					
			if(j == map[i].length-1){
				if(map[i][j].getSide(dungeonTiles.directions.RIGHT) === "WALL") {
					draw[counter] += "-";
					draw[counter+1] += "|";
					draw[counter+2] += "|";
					draw[counter+3] += "|";
					draw[counter+4] += "-";
				};
			};
			
			//Behöver bara kolla neråt på sista raden. UP på rad 2 är DOWN på rad 1. UP kollas alltid.
			if(i === map.length-1){
				if(map[i][j].getSide(dungeonTiles.directions.DOWN) === "WALL") {
					draw[counter+4] += "-----";	
				};
			};
		};
			counter += 4;
	};
	for(i = 0; i < draw.length; i++) {
		//document.write(draw[i] +"<br />");
		console.log(draw[i]);
	};
// 	
	// console.log(counter);
};

dungeonTiles.ui.drawPlayerMapConsole = function (game) {
	var draw = [];
	var i, j;
	var counter = 0;
	var map = game.map;
	
	for(i = 0; i < map.length; i++) {
			draw[counter] = "";
			draw[counter+1] = "";
			draw[counter+2] = "";
			draw[counter+3] = "";
			draw[counter+4] = "";
		for(j = 0; j < map[i].length; j++) {
		if(map[i][j].isAccessible()){
			
			
			//Kolla upp
			if(map[i][j].getSide("UP") === "WALL") {
				draw[counter] += "----";
			} else if(map[i][j].getSide("UP") === "OPEN") {
				draw[counter] += "-   ";
			} else if(map[i][j].getSide("UP") === "DOOR") {
				draw[counter] += "--D-";
			};
			
			//Kolla vänster
			if(map[i][j].getSide("LEFT") === "WALL") {
				draw[counter+1] += "|   ";
				
				// Kollar om spelaren ska ritas ut
				if (i === game.getPlayerRow() && j === game.getPlayerCol()) {
					draw[counter+2] += "| X ";	
				} else {
					draw[counter+2] += "| " + map[i][j].getItem() + " ";
				}
				
				draw[counter+3] += "|   ";
			} else if(map[i][j].getSide("LEFT") === "OPEN") {
				draw[counter+1] += "    ";

				// Kollar om spelaren ska ritas ut				
				if (i === game.getPlayerRow() && j === game.getPlayerCol()) {
					draw[counter+2] += "  X ";	
				} else {
					draw[counter+2] += "  " + map[i][j].getItem() + " ";
				}
				
				draw[counter+3] += "    ";
			} else if(map[i][j].getSide("LEFT") === "DOOR") {
				draw[counter+1] += "|   ";
				
				// Kollar om spelaren ska ritas ut
				if (i === game.getPlayerRow() && j === game.getPlayerCol()) {
					draw[counter+2] += "D X ";	
				} else {
					draw[counter+2] += "D " + map[i][j].getItem() + " ";
				}
				
				draw[counter+3] += "|   ";
			};

			//Skriv ut väggen längst till höger
			if(j === map[i].length-1){
				draw[counter] += "|";
				draw[counter+1] += "|";
				draw[counter+2] += "|";
				draw[counter+3] += "|";
				//draw[counter+4] += "-";
			}
			
			//Kolla ner
			if(i === map.length-1) {
				draw[counter+4] += "----";
			};
		} else {
			
			// om rummet OVANFÖR är accessible:
			if (i > 0 && map[i -1][j].isAccessible()) {
				// skriv ut en vägg överst
				draw[counter] += (map[i][j].getSide("UP") === "WALL") ? "----" : "--D-"; 
				
			} else {
				if(i === 0){
					draw[counter] += "----";
				} else {
					draw[counter] += "****";
				}
			}
			
			
			// Om rummet till VÄNSTER är accessible:
			if (j > 0 && map[i][j -1].isAccessible()) {
				// Skriv ut en vägg
				draw[counter +1] += "|";
				draw[counter +2] += (map[i][j].getSide("LEFT") === "WALL") ? "|" : "D";
				draw[counter +3] += "|";
			} else {
				// annars, skriv ut stjärnor motsvarande en vägg
				if(j > 0){
					draw[counter +1] += "*";
					draw[counter +2] += "*";
					draw[counter +3] += "*";
				} else {
					draw[counter +1] += "|";
					draw[counter +2] += "|";
					draw[counter +3] += "|";
				};
			}
			
			// Skriv ut stjärnor, bredd på rummet -1
			draw[counter +1] += "***";
			draw[counter +2] += "***";
			draw[counter +3] += "***";
			
			if(i === map.length-1) {
				draw[counter+4] += "----";
			};
			
			if(j === map[i].length-1){
				draw[counter] += "-";
				draw[counter+1] += "|";
				draw[counter+2] += "|";
				draw[counter+3] += "|";
				draw[counter+4] += "-";
			}
		};	
		
		};
			counter += 4;
	};

	for(i = 0; i < draw.length; i++) {
		console.log(draw[i]);
	};
	
}
