"use strict";

var selected =  1;
var game;
var con;
var mouseX,mouseY;
var GRID;
var GUI;
var materialColors = ["blue","brown","orange","silver","red"];
var jake;
var enemies;
//change enemies data structure to be unordered so random elements can be
	//added and removed
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
	GUI.addElement(new button(game.width-60,game.height-60,50,50,"orange",
		"Wood",select,1));
	GUI.addElement(new button(game.width-120,game.height-60,50,50,"darkgrey",
		"Stone",select,2));
	GUI.addElement(new button(game.width-180,game.height-60,50,50,"#808080",
		"Metal",select,3));

	GRID = new grid(200,150,60,5,5,2,square);
	enemies = [];
	for(var i = 0; i<5;i++){
		jake = new enemy(100*i, 300,1,100,300,400,300);
		enemies.push(jake);
	}

	setInterval(update,1000/60);



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

 /*
	var pauseButton = document.createElement("button");
	game.append(pauseButton);
	pauseButton.className = "gamebutton";
	pauseButton.addEventListener("click",pause);
	pauseButton.style.bottom = "10px";
	pauseButton.style.left = "10px";
	pauseButton.innerHTML = "Pause";

	*/



}
function sketch(path){
	con.beginPath();
	con.moveTo(path.points[0].x,path.points[0].y);
	for(var i = 1; i<path.points.length; i++){
		con.lineTo(path.points[i].x,path.points[i].y);
	}
	con.closePath();
}
function update(){
	con.fillStyle = "lightgrey";
	con.fillRect(0,0,game.width,game.height);
	GUI.update();
	GRID.update();
	for(var i = 0; i<5;i++){
		enemies[i].update();
	}
	


}
function enemy(x,y,speed,dx,dy,tx,ty){
	this.r = 10;
	this.color = "pink";
	this.x = x;
	this.y = y;
	this.speed = speed/60;
	this.powerMax = 100;
	this.power = 0;
	this.bullets = [];
	//change bullets data structure to be unordered so random elements can be
	//added and removed
	this.dx = dx;
	this.dy = dy;
	this.update = function(){
		if(Math.abs(this.x-this.dx) < 5 && Math.abs(this.y-this.dy) < 5){
			if(this.power < this.powerMax ){
				this.power+=.33333;
			}else{
				console.log("FIRE");
				this.power = 0;
				this.fire(1,500,500);
			}
			if(this.bullets.length > 0){
				for(var i=0; i<this.bullets.length;i++){
					var b = this.bullets[i];
						if(b != null){
						b.x+=b.vel*Math.sign(b.tx-b.x)*1.5;
						b.y+=b.vel*Math.sign(b.ty-b.y)*1.5;
						con.fillStyle = "black";
						con.arc(b.x,b.y,2,0,2*Math.PI);
						con.fill();
						if(Math.abs(b.x-b.tx) < 1 && Math.abs(b.y-b.ty) < 1){
							/*
							change tx,ty -> dx,dy change collision detection
							add damage to block on fort
							*/
							console.log(GRID.translate(b.tx,b.ty));
							delete this.bullets[i];	
						}
					}
				}
			}
		}else{
			this.x+=speed*Math.sign(dx-x);
			this.y+=speed*Math.sign(dy-y);
		}
		var path= {points:[{x:this.x-this.r,y:this.y-this.r},{x:this.x+this.r,y:this.y},
		{x:this.x+this.r,y:this.y+this.r},{x:this.x-this.r,y:this.y+this.r}]};
		sketch(path);
		con.fillStyle = this.color;
		con.fill();


	}
	this.fire = function(vel,tx,ty){
		//even out bullet velocities into dy,dx, based off
		//total distance needed, so the bullet travels in a straightline
		var b = {x:this.x,y:this.y,tx:tx,ty:ty,vel:vel};
		this.bullets.push(b);
	}
	this.die = function(){}//do this


}
function mouseDown(){
	mouseDown = true;

}
function mouseUp(){
	if(mouseDown)
		console.log(mouseX,mouseY)
		GUI.isClicked(mouseX,mouseY);
		GRID.isClicked(mouseX,mouseY);
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
	this.update = function(){
		for(var i=0; i<this.len; i++){
			this.elements[i].update();
		}
	}
}
function square(args){
	this.x = args.x;
	this.y = args.y;
	this.width = args.width;
	this.material = args.mat;
	this.hp = this.material;
	this.color = materialColors[this.material];

	this.setMaterial = function(mat){
		this.material = mat;
		this.hp = this.material;
		this.color = materialColors[this.material];
	}
	this.damage = function(dam){
		this.hp-=dam;
		if(hp < 0){
			this.setMaterial(0);
		}
	}
	this.update = function(){
		con.fillStyle = this.color;
		con.fillRect(this.x,this.y,this.width,this.width);
	}
}
function grid(x,y,sqwidth,rows,cols,gap,func){
	this.x = x;
	this.y = y;
	this.width = sqwidth;
	this.gap = gap || 3;
	this.matrix = [];
	this.mid = [Math.floor(cols/2), Math.floor(rows/2)];
	this.path={
		points:[{x:x,y:y},
				{x:x+(sqwidth+this.gap)*rows,y:y},
				{x:x+(sqwidth+this.gap)*rows,y:y+(sqwidth+this.gap)*cols},
				{x:x,y:y+(sqwidth+this.gap)*cols}]
	};
	this.initGrid = function(){
		this.matrix = [];
		for(var i = 0; i<rows; i++){
				var row = [];
				for(var k = 0; k<cols; k++){
					var m = 0;
					var p = this.x+(i*(this.width+this.gap));
					var q = this.y+(k*(this.width+this.gap));
					if(k == this.mid[0] && i == this.mid[1]){
						m = 4;
					}
					var options ={x:p,y:q,width:sqwidth,mat:m};
					row.push(new func(options));
				}	
			this.matrix.push(row);
		}
	}
	this.initGrid();
	this.update = function(){
		for(var i = 0; i<rows; i++){
			for(var k = 0; k<cols; k++){
				var sq = this.matrix[i][k];
				sq.update();
			}	
	}

	}
	this.translate = function(mx,my){
		return [Math.floor((mx-this.x-this.gap)/this.width),Math.floor((my-this.y-this.gap)/this.width)];
	}
	this.isClicked = function(mx,my){
		sketch(this.path);
		if(con.isPointInPath(mx,my)){
			var i = this.translate(mx,my);
			var sq = this.matrix[i[0]][i[1]];
			if(sq.material == 0){
				sq.setMaterial(selected);
			}
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
	this.path = {
		points:[{x:this.x,y:this.y},{x:this.x+this.width,y:this.y},{x:this.x+this.width,y:this.y+this.height},{x:this.x,y:this.y+this.height}]
	};
	this.update = function(){
		con.fillStyle = color;
		con.fillRect(this.x,this.y,this.width,this.height);
		con.font = "12pt Arial";
		con.fillStyle = "black";
		con.fillText(text,x+5,y+(this.height/2));
	}
	this.isClicked = function(mouseX,mouseY){
		sketch(this.path);
		if(con.isPointInPath(mouseX,mouseY)){
			func(val);
		}

	}
}
