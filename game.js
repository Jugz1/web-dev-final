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
var bullets = [];
var gamepath;
var budget = {data:[100,50,20]};
var playing = false;
var playButton;
var gameUpdate;
//change enemies data structure to be unordered so random elements can be
	//added and removed
window.onload = function(){
	console.log("loaded");
	initGame();
}
function initGame(){
	playButton = document.getElementById("play");
	playButton.addEventListener("mousedown",play);
	game = document.getElementById("game");
	game.addEventListener("mousedown",mouseDown);
	game.addEventListener("mouseup",mouseUp);
	game.addEventListener("mousemove",mousePos);
	con = game.getContext("2d");
	game.width = 700;
	game.height = 700;
	gamepath = {points:[{x:0,y:0},{x:game.width,y:0},{x:game.width,y:game.height},{x:0,y:game.height}]};

	GUI = new gui();
	GUI.addElement(new button(game.width-60,game.height-60,50,50,"orange",
		"Wood",select,1));
	GUI.addElement(new button(game.width-120,game.height-60,50,50,"darkgrey",
		"Stone",select,2));
	GUI.addElement(new button(game.width-180,game.height-60,50,50,"#808080",
		"Metal",select,3));
	GUI.addElement(new label(40,20,60,40,budget,0,"black",materialColors[1]));
	GUI.addElement(new label(110,20,60,40,budget,1,"black",materialColors[2]));
	GUI.addElement(new label(180,20,60,40,budget,2,"black",materialColors[3]));


	GRID = new grid(200,150,60,5,5,2,square);
	enemies = [];
	for(var i = 0; i<5;i++){
		var p = GRID.randomValidP();
		jake = new enemy(p[0], p[1], .7,400,300,400,300);
		enemies.push(jake);
	}
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
	updateBullets();
	for(var i = 0; i<5;i++){
		enemies[i].update();
	}
	for(var i = 0; i<3; i++){
		budget.data[i] += (.05/(i+2));
	}
	
}
function updateBullets(){
	//change bullets data structure to be unordered so random elements can be
	//added and removed
	if(bullets.length > 0){
		for(var i=0; i<bullets.length;i++){
			var b = bullets[i];
			if(b != null){
				b.x+=b.vel*b.dx*1.5;
				b.y+=b.vel*b.dy*1.5;
				con.beginPath();
				con.fillStyle = "black";
				con.arc(b.x,b.y,5,0,2*Math.PI);
				con.fill();
				sketch(gamepath);
				if(!con.isPointInPath(b.x, b.y)){
					delete bullets[i];	
				}
				sketch(GRID.path);
				if(con.isPointInPath(b.x,b.y)){
					var co = GRID.translate(b.x,b.y);
					if(co[0]>-1 && co[1]>-1 && co[0] < GRID.rows && co[1] < GRID.cols){
						var gridsq = GRID.matrix[co[0]][co[1]];
						if (gridsq.material != 0){
							if(gridsq.material==4){
								console.log("YOU LOSE");
								delete bullets[i];
							}else{
								gridsq.damage(1);
								delete bullets[i];
							}
						}
					}
				}
			}
		}
	}
}
function enemy(x,y,speed,dx,dy,tx,ty){
	this.r = 10;
	this.color = "green";
	this.x = x;
	this.y = y;
	this.speed = speed/60;
	this.powerMax = 100;
	this.power = 0;
	this.dx = dx;
	this.dy = dy;
	this.update = function(){
		if(Math.abs(this.x-this.dx) < 220 && Math.abs(this.y-this.dy) < 220){
			if(this.power < this.powerMax ){
				this.power+=.33333;
			}else{
				console.log("FIRE");
				this.power = 0;
				this.fire(2,400,300);
			}
		}else{
			this.x+=speed*Math.sign(dx-x);
			this.y+=speed*Math.sign(dy-y);
		}
		con.beginPath();
		var path= {points:[{x:this.x-this.r,y:this.y-this.r},{x:this.x+this.r,y:this.y-this.r},
		{x:this.x+this.r,y:this.y+this.r},{x:this.x-this.r,y:this.y+this.r}]};
		con.fillStyle = this.color;
		sketch(path);
		con.fill();
	}
	this.fire = function(vel,tx,ty){
		//even out bullet velocities into dy,dx, based off
		//total distance needed, so the bullet travels in a straightline
		var dx = 0;
		var dy = ty-this.y;
		var b = {x:this.x,y:this.y,dx:0,dy:0,vel:vel};
		bullets.push(b);
	}
	this.die = function(){
		delete this;
	}//do this


}
function mouseDown(){
	mouseDown = true;
}
function mouseUp(){
	if(mouseDown){
		console.log(mouseX,mouseY)
		GUI.isClicked(mouseX,mouseY);
		GRID.isClicked(mouseX,mouseY);
	}
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
			if(this.elements[i].isClicked){
				this.elements[i].isClicked(mx,my);
			}
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
		if(budget.data[mat-1] >= 10){
			budget.data[mat-1] -= 10;
			this.material = mat;
			this.hp = this.material;
			this.color = materialColors[this.material];
		}else{
			console.log("you dont have enough budget for that!")
		}
	}
	this.damage = function(dam){
		this.hp-=dam;
		if(this.hp < 0){
			this.material = 0;
			this.hp = 0;
			this.color = materialColors[this.material];
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
	this.rows = rows;
	this.cols = cols;
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
	this.randomValidP = function(){
		var x=this.x+(this.width/2);
		var y=this.y+(this.width/2);
		sketch(this.path);
		while(con.isPointInPath(x,y)){
			x = Math.random()*800;
			y = Math.random()*600;
		}
		console.log(x,y);
		return [x,y];
	}
}
function play(){
	if(playing == false){
		gameUpdate = setInterval(update,1000/60);
		playing = true;
		playButton.innerHTML = "Pause";
	}else
		pause();
}
function pause(){
	clearInterval(gameUpdate);
	playing=false;
	playButton.innerHTML = "Play";
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
function label(x,y,width,height,valObj,valKey,tcolor,bgcolor){
	this.x = x;
	this.y = y;
	this.height = height/2;
	this.width = width/2;
	this.tc = tcolor;
	this.bc = bgcolor;
	this.valObj = valObj;
	this.valKey = valKey;
	this.path = {
		points:[
		{x:x-this.width,y:y-this.height},
		{x:x+this.width,y:y-this.height},
		{x:x+this.width,y:y+this.height},
		{x:x-this.width,y:y+this.height}]
	};
	this.update = function(){
		var value = this.valObj.data[this.valKey];
		con.fillStyle = this.bc;
		sketch(this.path);
		con.fill();
		con.font = "12pt Arial";
		con.fillStyle = this.tc;
		con.fillText(String(Math.floor(value)),x-10,y+(this.height/2));
	}
}

