//Spiders
"use strict";

function play(){
	console.log(indexOfLowest([3,6,7,76,34,32,2,24]));
	
//hide menu	
	var menuDiv = document.getElementById("menu")
	menuDiv.style.display = "none";
	var canvas = document.getElementById("game")
	canvas.style.display = "block";
	
	var gameSpeed = 12;
	var timeInterval = 50;
	var angleSpeed = 20;
//create objects
	var spiders = [{name: "one", color: "blue", x: 10, y: 10, angle: 90, angleChange: 0, speed: gameSpeed}];
						// {name: "two", color: "red", x: 490, y: 490, angle: 270, angleChange: 0, speed: 20},
						// {name: "three", color: "green", x: 490, y: 10, angle: 180, angleChange: 0, speed: 10},
						// {name: "four", color: "yellow", x: 10, y: 490, angle: 0, angleChange: 0, speed: 10}];
						
	var webs = [	{name: "one", x: [], y: []}];
						// {name: "two", x: [], y: []},
						// {name: "three", x: [], y: []},
						// {name: "four", x: [], y: []}];
	
	var areas = [ 	{id: [], name: "", x: [], y: [], inAreas: [], conAreas: [], conWall: false}];
	
	var freeArea = (canvas.height - 1) * (canvas.width - 1);

//add key handling
	document.addEventListener('keypress', function(event) {
	// alert(event.type +    ' key=' + event.key +    ' code=' + event.code);
		if (event.repeat == false){
			if (event.key == 'q')
				spiders[0].angleChange += -angleSpeed;
			if (event.key == 'w')	
				spiders[0].angleChange += angleSpeed;
			if (event.key == 'ArrowLeft')
				spiders[1].angleChange += -angleSpeed;
			if (event.key == 'ArrowRight')	
				spiders[1].angleChange += angleSpeed;
		}
    }, false);
	
	document.addEventListener('keyup', function(event) {
		if (event.key == 'q')
			spiders[0].angleChange -= -angleSpeed;
		if (event.key == 'w')	
			spiders[0].angleChange -= angleSpeed;
		if (event.key == 'ArrowLeft')
			spiders[1].angleChange -= -angleSpeed;
		if (event.key == 'ArrowRight')	
			spiders[1].angleChange -= angleSpeed;	
    }, false);			

	
//painting preparations
	canvas.width = 500;
	canvas.height = 500;
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 3;
	
	var RM = 500;
	var r = 0;
	
	
	setInterval(updateGame, timeInterval);
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
			checkWeb(spiders[i], webs[i], areas);
			checkArea(spiders[i], webs[i], areas);
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
				else
				//start at right wall
				if (web.x[0] == canvas.width - 1 && web.x[1] < canvas.width - 1)
					wallCollision("top", "right", spider, web, areas);
				else
				//start at bottom wall
				if (web.y[0] == canvas.height - 1 && web.y[1] < canvas.height - 1)
					wallCollision("top", "bottom", spider, web, areas);
				else
				//start at left wall
				if (web.x[0] == 1 && web.x[1] > 1)
					wallCollision("top", "left", spider, web, areas);
				else{
				//start at some area
					var al = areas.length;
					for (var a = 1; a < al; a++){
						var polygon = createArray(areas[a].x.length, 2);
						for (var p = 0; p < areas[a].x.length; p++){
							polygon[p][0] = areas[a].x[p];
							polygon[p][1] = areas[a].y[p];
						}
						if (inside(polygon, [web.x[0], web.y[0]]) && web.x.length > 1){
							console.log("wall hit from area " + areas[a].id);
							//are area wall connected?
							if (areas[a].conWall){
								console.log("which is wall connected");
								wallCollision("top", a, spider, web, areas);
							}
						}
					}
				}
				
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
				var area = {id: [], name: "", x: [], y: [], inAreas: [], conAreas: [], conWall: false};
				area.name = spider.name;
				
				//elongate web accordingly
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
								
							//from area	
							default:
								
								//web copies for comparison 
								var webCopy1 = Object.assign({},web);
								var webCopy2 = Object.assign({},web);
								
								//get start point (index on area)
								var dist = [];
								for (var i = 0; i < areas[start].x.length; i++){
									dist[i] = pointsDistance(areas[start].x[i], areas[start].y[i], web.x[0], web.y[0]);
								}
								var startIndex = indexOfLowest(dist);
								
								
								//area from top
								if (areas[start].y[0] < 1.1){
									//to top
									if (areas[start].y[areas[start].y.length - 1] < 1.1){
										//hit at area start side
										if((areas[start].x[0] < areas[start].x[areas[start].x.length - 1] 
										&& areas[start].x[0] > spider.x)
										||(areas[start].x[0] > areas[start].x[areas[start].x.length - 1] 
										&& areas[start].x[0] < spider.x)){
											for (var ai = 0; ai <= startIndex; ai++){
												web.x.push(areas[start].x[ai]);
												web.y.push(areas[start].y[ai]);
											}
										}
										//hit at area finish side
										else {
											for (var ai = areas[start].x.length - 1; ai >= startIndex; ai--){
												web.x.push(areas[start].x[ai]);
												web.y.push(areas[start].y[ai]);
											}
										}
									}
								}
								web.x.shift();
								web.y.shift();
								
								
								
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
				
				//create area
				for (var p = 0; p < web.x.length; p++){
					area.x.push(web.x[p]);
					area.y.push(web.y[p]);
				}						
				area.id.push(areas.length);
				area.conWall = true;
				
					//check areas connections
				for (var a = 1; a < areas.length; a++){
					if (areas[a].conWall){
						//connect conWall areas
						area.conAreas.push(areas[a].id);
						for (var ca = 0; ca < areas[a].conAreas.length - 1; ca++){
							if(!areas[areas[a].conAreas[ca]].conWall){
								//connect areas connected to conWall areas
								area.conAreas.push(areas[areas[a].conAreas[ca]]);
							}
						}
					}
				}
				//delete repeated connections
				area.conAreas = arrayDeleteRepeats(area.conAreas);
				//save connections to connected areas
				for (var a = 1; a < areas.length; a++){
					if (area.conAreas.indexOf(areas[a].id) != -1){
						//(slice to create new array instead of new reference to same array
						areas[a].conAreas = arrayReplaceValue(area.conAreas.slice(), areas[a].id, area.id);
						areas[a].conWall = true;
					}
				}
				
				areas.push(area);
				console.log("");
				console.log("new area: " + (area.id) + " conWall: " + area.conWall + " conAreas: " + area.conAreas);
			}

			
		function checkWeb(spider, web, areas){
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
					web.x[0] = web.x.pop();
					web.y[0] = web.y.pop();
					web.x[1] = web.x.pop();
					web.y[1] = web.y.pop();
					web.x.length = 2;
					web.y.length = 2;
				}
			}			
		}
	
		function checkArea(spider, web, areas){
			for (var a = 1; a < areas.length; a++){
				//save area as polygon
				var polygon = createArray(areas[a].x.length, 2);
				for (var p = 0; p < areas[a].x.length; p++){
					polygon[p][0] = areas[a].x[p];
					polygon[p][1] = areas[a].y[p];
				}
				//if head hits area
				if (inside(polygon, [spider.x, spider.y])){
					
					//start at top wall
					if (web.y[0] == 1 && web.y[1] > 1)
						console.log("area hit from top");
						// areaCollision(a, "top", spider, web, areas);
					
					//start at right wall
					if (web.x[0] == canvas.width - 1 && web.x[1] < canvas.width - 1)
						console.log("area hit from right");
						// areaCollision(a, "right", spider, web, areas);
					
					//start at bottom wall
					if (web.y[0] == canvas.height - 1 && web.y[1] < canvas.height - 1)
						console.log("area hit from bottom");
						// areaCollision(a, "bottom", spider, web, areas);
					
					//start at left wall
					if (web.x[0] == 1 && web.x[1] > 1)
						console.log("area hit from left");
						// areaCollision(a, "left", spider, web, areas);
					
					//start at some area
					for (var sa = 0; sa < areas.length; sa++){
						var polygon = createArray(areas[sa].x.length, 2);
						for (var p = 0; p < areas[sa].x.length; p++){
							polygon[p][0] = areas[sa].x[p];
							polygon[p][1] = areas[sa].y[p];
						}
						//yes
						if (inside(polygon, [web.x[0], web.y[0]]) && web.x.length > 1){
							console.log("area " + areas[a].id + " hit from area " + areas[sa].id);
							//are areas connected?
							if (areas[a].conAreas.indexOf(areas[sa].id) != -1 || a == sa){
								console.log("areas connected");
								areaCollision(a, sa, spider, web, areas);
							}
							
						}
						
						
						
					}

					
					//clear web
					web.x.length = 0;
					web.y.length = 0;
				}
				
			}
		}
		
			function areaCollision(end, start, spider, web, areas){
				
				
				
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
		// ctx.strokeStyle = spider.color;
		ctx.strokeStyle = 'red';
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


//point in polygon
function inside(vs, point) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

//create multidimensional array
function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}




//show menu
function menu(menuDiv, canvas){
	canvas.style.display = "none";
	menuDiv.style.display = "block";
}

Math.rad = function(deg){
	return deg * Math.PI / 180;
}

function pointsDistance(x1, y1, x2, y2){
	return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}


function arrayReplaceValue(array, oldValue, newValue){
	var localArray = array;
	localArray[array.indexOf(oldValue)] = newValue;
	return localArray;
}

function arrayDeleteRepeats(array){
	for (var i = 0; i < array.length - 1; i++)
		for (var j = i + 1; j < array.length; j++)
			if (array[j] == array[i]){
				array.splice(j, 1);
				j--;
			}
	return array;
}

function indexOfLowest(arr) {
	var value = Infinity;
	var indexOfLowest;
    for (var i = 0; i < arr.length; i++){
		if (arr[i] < value){
			value = arr[i];
			indexOfLowest = i;
		}
	}
	return indexOfLowest;
}
