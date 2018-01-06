"use strict";

// var myVar = setInterval(myTimer, 100);

// async function play(){
define (function play(require){
	
	var classifyPoint = require("robust-pnp");
	
//hide menu	
	var menuDiv = document.getElementById("menu")
	menuDiv.style.display = "none";
	var canvas = document.getElementById("game")
	canvas.style.display = "block";
	
	
//create objects
	var spiders = [{name: "one", color: "blue", x: 10, y: 10, angle: 90, angleChange: 0, speed: 15}];
						// {name: "two", color: "red", x: 490, y: 490, angle: 270, angleChange: 0, speed: 20},
						// {name: "three", color: "green", x: 490, y: 10, angle: 180, angleChange: 0, speed: 10},
						// {name: "four", color: "yellow", x: 10, y: 490, angle: 0, angleChange: 0, speed: 10}];
						
	var webs = [	{name: "one", x: [], y: []}];
						// {name: "two", x: [], y: []},
						// {name: "three", x: [], y: []},
						// {name: "four", x: [], y: []}];
	
	// var areas = [ 	{name: "one", x: [], y: [], count: [], startIndex: [], inAreas: [], conAreas: [], conWall: []}];
	var areas = [ 	{name: "one", x: [], y: [], id: [], startIndex: [], inAreas: [], conAreas: [], conWall: false}];
	// var areas = [ 	{name: "one", x: [], y: [], id: [], inAreas: [], conAreas: [], conWall: false}];
						// {name: "two", x: [], y: []},
						// {name: "three", x: [], y: []},
						// {name: "four", x: [], y: []}];

//add key handling
	document.addEventListener('keypress', function(event) {
	// alert(event.type +    ' key=' + event.key +    ' code=' + event.code);
		if (event.repeat == false){
			if (event.key == 'q')
				spiders[0].angleChange += -20;
			if (event.key == 'w')	
				spiders[0].angleChange += 20;
			if (event.key == 'ArrowLeft')
				spiders[1].angleChange += -20;
			if (event.key == 'ArrowRight')	
				spiders[1].angleChange += 20;
		}
    }, false);
	
	document.addEventListener('keyup', function(event) {
		if (event.key == 'q')
			spiders[0].angleChange -= -20;
		if (event.key == 'w')	
			spiders[0].angleChange -= 20;
		if (event.key == 'ArrowLeft')
			spiders[1].angleChange -= -20;
		if (event.key == 'ArrowRight')	
			spiders[1].angleChange -= 20;	
    }, false);			

	
//painting preparations
	canvas.width = 500;
	canvas.height = 500;
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 3;
	
	var RM = 500;
	var r = 0;
	
	
	setInterval(updateGame, 50);
	// while(r < RM) {
	function updateGame() {
//save actual position	
		if (r == 0)
			for (var i = 0; i < spiders.length; i++){
				webs[i].x.push(spiders[i].x);
				webs[i].y.push(spiders[i].y);
			}
			
//move and do mechanics (area create, web cut, direction change/correction)
		move();

//save new	position
		for (var i = 0; i < spiders.length; i++){
			webs[i].x.push(spiders[i].x);
			webs[i].y.push(spiders[i].y);
		}

//paint	
		ctx.clearRect(0, 0, canvas.width, canvas. height);
		paintAreas(spiders, areas);
		for (var i = 0; i < spiders.length; i++){
			paintWeb(spiders[i], webs[i]);
			paintArrowhead(spiders[i]);
		}
		// await sleep(100);
	}
	
	
	function move(){
		r = r + 1;
		for (var i = 0; i < spiders.length; i++){
			step(spiders[i]);
			
			checkWalls(spiders[i], webs[i], areas);
			checkWeb(spiders[i], webs[i], areas[i]);
		}
	}
	
		function step(spider){
			spider.angle += spider.angleChange;
			if (spider.angle < 0)
				spider.angle += 360;
			spider.angle = spider.angle%360;
			spider.x += Math.sin(Math.rad(spider.angle))*spider.speed;
			spider.y += -Math.cos(Math.rad(spider.angle))*spider.speed;
		}
		
		function checkWalls(spider, web, areas){
			
			var corrPos = false;
		//end at top wall (collide)
			if (spider.y < 1.01){
				//correct position
				spider.y = 1;
				if (!corrPos){
					if (0 <= spider.angle && spider.angle <= 90 && !(spider.x > canvas.width - 1.01)){
						spider.angle = 90;
						corrPos = true;
					}
					else if ((270 <= spider.angle || spider.angle == 0) && !(spider.x < 1.01)){
						spider.angle = 270;
						corrPos = true;
					}
				}
				
				//start at top wall
				if (web.y[0] == 1 && web.y[1] > 1)
					wallCollision("top", "top", spider, web, areas);
				
				//start at right wall
				if (web.x[0] == canvas.width - 1 && web.x[1] < canvas.width - 1)
					wallCollision("top", "right", spider, web, areas);
				
				//start at bottom wall
				if (web.y[0] == canvas.height - 1 && web.y[1] < canvas.height - 1)
					wallCollision("top", "bottom", spider, web, areas);
				
				//start at left wall
				if (web.x[0] == 1 && web.x[1] > 1)
					wallCollision("top", "left", spider, web, areas);
				
				//clear web
				web.x.length = 0;
				web.y.length = 0;
			}
			
		//end at right wall (collide)
			if (spider.x > canvas.width - 1.01){
				//correct position
				spider.x = canvas.width - 1;
				if (!corrPos){
					if (90 <= spider.angle && spider.angle <= 180 && !(spider.y > canvas.height - 1.01)){
						spider.angle = 180;
						corrPos = true;
					}
					else if (0 <= spider.angle && spider.angle <= 90) {
						spider.angle = 0;
						corrPos = true;
					}
				}

				
				//start at top wall
				if (web.y[0] == 1 && web.y[1] > 1)
					wallCollision("right", "top", spider, web, areas);
				
				//start at right wall
				if (web.x[0] == canvas.width - 1 && web.x[1] < canvas.width - 1)
					wallCollision("right", "right", spider, web, areas);
				
				//start at bottom wall
				if (web.y[0] == canvas.height - 1 && web.y[1] < canvas.height - 1)
					wallCollision("right", "bottom", spider, web, areas);
				
				//start from left
				if (web.x[0] == 1 && web.x[1] > 1)
					wallCollision("right", "left", spider, web, areas);
					
				//clear web
				web.x.length = 0;
				web.y.length = 0;
			}
			
		//end at bottom wall (collide)
			if (spider.y > canvas.height - 1.01){
				//correct position
				spider.y = canvas.height - 1;
				if (!corrPos){
					if (180 <= spider.angle && spider.angle <= 270 && !(spider.x < 1.01)){
						spider.angle = 270;
						corrPos = true;
					}
					else if (90 <= spider.angle && spider.angle <= 180){
						spider.angle = 90;
						corrPos = true;
					}
				}
				
				//start at top wall
				if (web.y[0] == 1 && web.y[1] > 1)
					wallCollision("bottom", "top", spider, web, areas);
				
				//start at right wall
				if (web.x[0] == canvas.width - 1 && web.x[1] < canvas.width - 1)
					wallCollision("bottom", "right", spider, web, areas);
				
				//start at bottom wall
				if (web.y[0] == canvas.height - 1 && web.y[1] < canvas.height - 1)
					wallCollision("bottom", "bottom", spider, web, areas);
				
				//start from left
				if (web.x[0] == 1 && web.x[1] > 1)
					wallCollision("bottom", "left", spider, web, areas);				
				
				//clear web
				web.x.length = 0;
				web.y.length = 0;
			}
			
		//end at left wall (collide)
			if (spider.x < 1.01){
				//correct position
				spider.x = 1;
				if (!corrPos){
					if (270 <= spider.angle && spider.angle <= 360 && !(spider.y < 1.01)){
						spider.angle = 0;
						corrPos = true;
					}
					else if (180 <= spider.angle && spider.angle <= 270){
						spider.angle = 180;
						corrPos = true;
					}
				}
				
				//start at top wall
				if (web.y[0] == 1 && web.y[1] > 1)
					wallCollision("left", "top", spider, web, areas);
				
				//start at right wall
				if (web.x[0] == canvas.width - 1 && web.x[1] < canvas.width - 1)
					wallCollision("left", "right", spider, web, areas);
				
				//start at bottom wall
				if (web.y[0] == canvas.height - 1 && web.y[1] < canvas.height - 1)
					wallCollision("left", "bottom", spider, web, areas);
				
				//start from left
				if (web.x[0] == 1 && web.x[1] > 1)
					wallCollision("left", "left", spider, web, areas);				
				
				//clear web
				web.x.length = 0;
				web.y.length = 0;
			}
		}
		
			function wallCollision(end, start, spider, web, areas){
				var area = {name: "", x: [], y: [], id: [], inAreas: [], conAreas: [], conWall: false};
				area.name = spider.name;
				
				switch (end){
					case "top":
						web.x.push(spider.x);
						web.y.push(1);
						
						switch (start){
							case "top":
								break;
							case "right":
								web.x.push(canvas.width - 1);
								web.y.push(1);	
								break;
							case "bottom":
								if (web.x[0] + spider.x > canvas.width) {
									web.x.push(canvas.width - 1);
									web.x.push(canvas.width - 1);					
								} else {
									web.x.push(1);
									web.x.push(1);
								}
								web.y.push(1);
								web.y.push(canvas.height - 1);
								break;
							case "left":
								web.x.push(1);
								web.y.push(1);	
								break;
						}
						break;	
						
					case "right":
						web.x.push(canvas.width - 1);
						web.y.push(spider.y);	
						
						switch (start){
							case "top":
								web.x.push(canvas.width - 1);
								web.y.push(1);
								break;
							case "right":
								break;
							case "bottom":
								web.x.push(canvas.width - 1);
								web.y.push(canvas.height - 1);
								break;
							case "left":
								if (web.y[0] + spider.y > canvas.height) {		
									web.y.push(canvas.height - 1);
									web.y.push(canvas.height - 1);
								}	else {
									web.y.push(1);
									web.y.push(1);
								}
								web.x.push(canvas.width - 1);	
								web.x.push(1);	
								break;
						}
						break;
						
					case "bottom":
						web.x.push(spider.x);
						web.y.push(canvas.height - 1);	
						
						switch (start){
							case "top":
								if (web.x[0] + spider.x > canvas.width) {
									web.x.push(canvas.width - 1);
									web.x.push(canvas.width - 1);					
								} else {
									web.x.push(1);
									web.x.push(1);
								}
								web.y.push(canvas.height - 1);
								web.y.push(1);
								break;
							case "right":
								web.x.push(canvas.width - 1);
								web.y.push(canvas.height - 1);
								break;
							case "bottom":
								break;
							case "left":
								web.x.push(1);
								web.y.push(canvas.height - 1);
								break;
						}
						break;
						
					case "left":
						web.x.push(1);
						web.y.push(spider.y);	
						
						switch (start){
							case "top":
								web.x.push(1);
								web.y.push(1);
								break;
							case "right":
								if (web.y[0] + spider.y > canvas.height) {		
									web.y.push(canvas.height - 1);
									web.y.push(canvas.height - 1);
								}	else {
									web.y.push(1);
									web.y.push(1);
								}
								web.x.push(1);
								web.x.push(canvas.width - 1);	
								break;
							case "bottom":
								web.x.push(1);
								web.y.push(canvas.height - 1);
								break;
							case "left":
								break;
						}
						break;
				}
				
				for (var p = 0; p < web.x.length; p++){
					area.x.push(web.x[p]);
					area.y.push(web.y[p]);
				}						
				area.id.push(areas.length);
				area.conWall = true;
				areas.push(area);
				
				console.log("area id: " + (area.id) + " area conWall: " + area.conWall);
			}
		
			// wallCollision("top", "right");
				// if (web.x[0] == canvas.width - 1){
					// var area = {name: "", x: [], y: [], id: [], inAreas: [], conAreas: [], conWall: false};
					// area.name = spider.name;
					// //save area
					// web.x.push(spider.x);
					// web.y.push(1);		
					// web.x.push(canvas.width - 1);
					// web.y.push(1);						
					// for (var p = 0; p < web.x.length; p++){
						// area.x.push(web.x[p]);
						// area.y.push(web.y[p]);
					// }
					// area.id.push(areas.length);
					// area.conWall = true;
					// areas.push(area);
				// }
		
						// //start from bottom
			// wallCollision("right", "bottom");
				// if (web.y[0] == canvas.height - 1){
					// var area = {name: "", x: [], y: [], id: [], inAreas: [], conAreas: [], conWall: false};
					// area.name = spider.name;
					// //save area
					// web.x.push(canvas.width - 1);
					// web.y.push(spider.y);
					// web.x.push(canvas.width - 1);
					// web.y.push(canvas.height - 1);				
					// for (var p = 0; p < web.x.length; p++){
						// area.x.push(web.x[p]);
						// area.y.push(web.y[p]);
					// }
					// area.id.push(areas.length);
					// area.conWall = true;
					// areas.push(area);
				// }	
		
		
		
		
		
		
		
		
		
		
	
		function checkWeb(spider, web, area){
			for (var w = 0; w < web.x.length; w++){
				if (Math.sqrt(Math.pow(spider.x - web.x[w], 2) + Math.pow(spider.y - web.y[w], 2)) < spider.speed/1.5 
				&& spider.x != 1 && spider.y != 1 && spider.x != canvas.width - 1 && spider.y != canvas.height - 1){
					// console.log('fil' + 'x: ' + spider.x + 'y: ' + spider.y);
			//save area
					var area = {name: "", x: [], y: [], id: [], inAreas: [], conAreas: [], conWall: false};
					area.name = spider.name;
					for (var p = w; p < web.x.length; p++){
						area.x.push(web.x[p]);
						area.y.push(web.y[p]);
					}
					area.id.push(areas.length);
					area.conWall = false;
					areas.push(area);
			//clear web
					web.x.length = 0;
					web.y.length = 0;
				}
			}			
		}
	
	
	function paintAreas(spiders, areas){
		ctx.strokeStyle = 'black';	
		// for (var si = 0; si < area.startIndex.length; si++){
				// ctx.beginPath();
			// ctx.moveTo(area.x[area.startIndex[si]], area.y[area.startIndex[si]]);
			// for (var p = area.startIndex[si] + 1; p < area.startIndex[si + 1]; p++){
				// ctx.lineTo(area.x[p], area.y[p]);
			// }
		for (var i = 0; i < areas.length; i++){
			//choose color
			for (var s = 0; s < spiders.length; s++){
				if (areas[i].name = spiders[s].name)
					ctx.fillStyle = spiders[s].color;
			}
				
			//go through edge	
			ctx.beginPath();
			ctx.moveTo(areas[i].x[0], areas[i].y[0]);
			for (var p = 1; p < areas[i].x.length; p++){
				ctx.lineTo(areas[i].x[p], areas[i].y[p]);
			}			
			ctx.closePath();
			
			//paint
			ctx.fill();
			ctx.stroke();	
		}			
	}
	
	function paintWeb(spider, web){
		ctx.strokeStyle = spider.color;
		ctx.beginPath();
		ctx.moveTo(web.x[0], web.y[0]);
		for (var w = 1; w < web.x.length; w++)
			ctx.lineTo(web.x[w], web.y[w]);
		ctx.stroke();	
	}
	
	function paintArrowhead(spider){
		ctx.fillStyle = 'black';
		ctx.beginPath();
		ctx.moveTo(	spider.x + Math.sin(Math.rad(spider.angle))*spider.speed, 
							spider.y - Math.cos(Math.rad(spider.angle))*spider.speed);
		ctx.lineTo(	spider.x + Math.sin(Math.rad(spider.angle + 160))	*10, 
						spider.y - Math.cos(Math.rad(spider.angle + 160))	*10);
		ctx.lineTo(	spider.x + Math.sin(Math.rad(spider.angle + 200))	*10, 
						spider.y - Math.cos(Math.rad(spider.angle + 200))	*10);						
		ctx.closePath();
		ctx.fill();			
	}
	
}
);




//show menu
function menu(menuDiv, canvas){
	canvas.style.display = "none";
	menuDiv.style.display = "block";
}

Math.rad = function(deg){
	return deg * Math.PI / 180;
}
