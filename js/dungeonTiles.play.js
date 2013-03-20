$(function(){
	$("input[name='start']").click(function () {
		var height = Number($("select[name='height']").val());
		var width = Number($("select[name='width']").val());
		var difficulty = $("input[name='difficulty']:checked").val();
		
		if(height < 21 || width < 21){
			difficulty = false;
		}
		
		$("#wrapper").remove("div");
		dungeonTiles.play(height, width, difficulty);
	});
	
	
});
