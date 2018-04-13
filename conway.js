"use strict";
var board;
var rows = 5;
var box={cells:[],x:0,y:0,width:600,r:rows};
var ctx;
var s = 5;
var mouseX= 0,mouseY=0;
var mDown=false;
var update;
var play = false;
/*
fix graphics to be generalized
add clickable start
let values wrap, add some iffys


*/

window.onload = function(){
	board = document.getElementById("game");
	board.addEventListener("mousedown",mouseDown);
	board.addEventListener("mouseup",mouseUp);
	board.addEventListener("mousemove",mousePos);
	document.getElementById("play").addEventListener("mousedown",play);
	board.width = 600;
	board.height = 600;
	ctx=board.getContext("2d");
	for(var i = 0; i<rows; i++){
		var row = [];
			for(var k = 0; k<rows;k++){
			row.push(new cell(i,k,box.width/box.r,false));
		}
		box.cells.push(row);
	}
	tick();	
}
function sketch(x,y,w,alive){
	ctx.fillStyle = "black";
	if(alive){
		ctx.fillStyle = "white";
	}
	ctx.fillRect(x*w,y*w,w-2,w-2);
	ctx.strokeStyle = "white";
	ctx.rect(x,y,w,w);
	ctx.stroke();
}
function cell (x,y,w,a){
	this.x = x;
	this.y = y;
	this.w = w;
	this.alive = a;
	//this.path = [{x:(x*hw)-hw,y:(y*hw)-hw},{x:(x*hw)+hw,y:(y*hw)-hw},{x:(x*hw)+hw,y:(y*hw)+hw},{x:(x*hw)-hw,y:(y*hw)+hw}];
	this.n = function(){
		this.draw();
		var s = 0;
		for(var i = 0; i<2*Math.PI; i+=Math.PI/4){
			var x = this.x+Math.ceil(Math.cos(i));
			var y = this.y+Math.ceil(Math.sin(i));
			if(x > -1 && x < rows && y > -1 && y < rows){
				var sq = box.cells[x][y];//its mad here
				if(sq.alive){
					s++;
				}
			}
		}
		if(s<2 || s> 3)
			this.alive = false;
		if(s == 3)
			this.alive = true;
	}
	this.draw = function(){
		sketch(this.x,this.y,this.w,this.alive);
	}
}
function tick(){
	for(var i = 0; i<rows; i++){
		for(var k = 0; k<rows; k++){
			box.cells[i][k].n();
		}
	}

}
function mouseDown(){
	mDown = true;
}
function mouseUp(){
	if(mDown){
		var x = Math.floor((mouseX)/(box.width/rows));
		var y = Math.floor((mouseY)/(box.width/rows));
		if(x > -1 && x < rows && y > -1 && y < rows){
			var b = box.cells[x][y];
			b.alive = !b.alive;
			b.draw();
		}
	}
	mDown = false;
}
function mousePos(e){
	mouseX = e.pageX - board.offsetLeft;
	mouseY = e.pageY - board.offsetTop;
}
function play(){
	if(play == false)
		update = setInterval(tick,1000/10);
	else
		pause();
}
function pause(){
	clearInterval(update);
}