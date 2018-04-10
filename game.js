"use strict";

var selected =  1;
window.onload = function(){
	document.getElementById("playbutton").addEventListener("click",initGame);
	console.log("loaded");
}
function initGame(){
	game = document.getElementById("game");
	con = getContext("2d");
	setInterval(update,1000/60);


	game.removeChild(document.getElementById("playbutton"));

	//initialize grid
	//put into local game array so it cant be fked by player
	var grid = document.createElement("div");
	grid.id = "grid";
	for(var i = 0; i<5; i++){
		for(var j = 0; j<5; j++){
			var square = document.createElement("div");
			square.className = "blank";
			square.id = String(i)+String(j);
			square.addEventListener("mouseover",sqMouseOver);
			square.addEventListener("click",sqClick);
			square.style.top = (60*i) + "px";
			square.style.left = (60*j) + "px";
			grid.append(square);
		}
	}
	game.append(grid);
	//initialize benches
	//need to maike an array of benches, each of which is an array of objects(or null)
	for(var i = 0; i < 4; i++){
		var bench = document.createElement("div");
		game.append(bench);
		bench.className = "bench";
		bench.style.bottom = (Math.floor(Math.sin(i*Math.PI/2))*200 + 300) + "px";
		bench.style.left = (Math.floor(Math.cos(i*Math.PI/2))*200 + 400) + "px"
		console.log(Math.floor(Math.sin(i*Math.PI/2)), Math.floor(Math.cos(i*Math.PI/2)));
		for(var j = 0; j < 3; j++){
			var slot = document.createElement("div");
			bench.append(slot);
			slot.className = "slot";
			slot.style.top = (33*j) + "%";
			slot.margin = "auto";		
		}
	}
	//initialize various buttons
	var woodButton = document.createElement("button");
	game.append(woodButton);
	woodButton.className = "gamebutton";
	woodButton.addEventListener("click",select);
	woodButton.value = 1;
	woodButton.style.bottom = "10px";
	woodButton.style.right = "10px";
	woodButton.innerHTML = "Wood";

	var stoneButton = document.createElement("button");
	game.append(stoneButton);
	stoneButton.className = "gamebutton";
	stoneButton.addEventListener("click",select);
	stoneButton.value = 2;
	stoneButton.style.bottom = "10px";
	stoneButton.style.right = "70px";
	stoneButton.innerHTML = "Stone";

	var metalButton = document.createElement("button");
	game.append(metalButton);
	metalButton.className = "gamebutton";
	metalButton.addEventListener("click",select);
	metalButton.value = 3;
	metalButton.style.bottom = "10px";
	metalButton.style.right = "130px";
	metalButton.innerHTML = "Metal";

	var pauseButton = document.createElement("button");
	game.append(pauseButton);
	pauseButton.className = "gamebutton";
	pauseButton.addEventListener("click",pause);
	pauseButton.style.bottom = "10px";
	pauseButton.style.left = "10px";
	pauseButton.innerHTML = "Pause";



}
function update(){
	con.fillStyle = "lightgrey";
	con.fillRect(0,0,c.width,c.height);
	


}
function loadScreen(){

}
function enemy(firedelay, positionx, positiony,state,d){
	if(state)

}
function sqMouseOver(){

}
function sqClick(){
	if(this.className === "blank"){
		if(selected == 1){
			this.className = "wood";
		}else if(selected == 2){
			this.className = "stone";
		}else{
			this.className = "metal";
		}
	}
}
function select(){
	selected=this.value;
}
function pause(){

}
