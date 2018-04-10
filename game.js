"use strict";

var selected =  1;
var game;
var con;
var mouseX,mouseY;
var grid;
var GUI;
window.onload = function(){
	console.log("loaded");
	initGame();
}
function initGame(){
	game = document.getElementById("game");
	game.addEventListener("mousedown",mouseDown);
	game.addEventListener("mouseup",mouseUp);
	game.addEventListener("mousemove",mousePos);
	con = game.getContext("2d");
	game.width = 700;
	game.height = 700;
	GUI = new gui();



	//initialize grid
	//put into local game array so it cant be fked by player
	con.fillStyle = "blue";
	for(var i = 0; i<5; i++){
		var row;
		for(var j = 0; j<5; j++){
			//grid[i][j]=;
			con.fillRect(200+(i*60.5),150+(j*60.5),59,59);

		}
	}
		//setInterval(update,1000/60);
	/*
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
	}*/
	//initialize various buttons
	var woodButton = new button(game.width-60,game.height-60,50,50,"orange",
		"Wood",select,1);
	woodButton.update();
	GUI.addElement(woodButton);

	var stoneButton = new button(game.width-120,game.height-60,50,50,"darkgrey",
		"Stone",select,2);
	stoneButton.update();
	GUI.addElement(stoneButton);

	var metalButton = new button(game.width-180,game.height-60,50,50,"#808080",
		"Metal",select,3);
	metalButton.update();
	GUI.addElement(metalButton);
 /*
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

	*/



}
function update(){
	con.fillStyle = "lightgrey";
	con.fillRect(0,0,game.width,game.height);
	


}
function render(obj){

}
function loadScreen(){

}
function enemy(firedelay, positionx, positiony,state,d){

}
function mouseDown(){
	mouseDown = true;

}
function mouseUp(){
	if(mouseDown)
		console.log(mouseX,mouseY)
		GUI.isClicked(mouseX,mouseY);
	mouseDown = false;

}
function mousePos(e){
	mouseX = e.pageX - game.offsetLeft;
	mouseY = e.pageY - game.offsetTop;

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
function select(val){
	console.log(val + "set as material");
	selected=val;
}
function gui(){
	this.elements = [];
	this.len = 0;
	this.addElement = function(element){
		this.elements.push(element);
		this.len+=1;
	}
	this.isClicked = function(mx,my){
		for(var i=0; i<this.len; i++){
			this.elements[i].isClicked(mx,my);
		}
	}



}
function pause(){

}
function button(x,y,width,height,color,text,func,val){
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.val = val || null;
	this.update = function(){
		con.fillStyle = color;
		con.fillRect(this.x,this.y,this.width,this.height);
		con.font = "12pt Arial";
		con.fillStyle = "black";
		con.fillText(text,x+5,y+(this.height/2));
	}
	this.isClicked = function(mouseX,mouseY){
		con.beginPath();
		con.moveTo(x,y);
		con.lineTo(x+width,y);
		con.lineTo(x+width,y+height);
		con.lineTo(x,y+width);
		con.closePath();
		if(con.isPointInPath(mouseX,mouseY)){
			func(val);
		}

	}
}
