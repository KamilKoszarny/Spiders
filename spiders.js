//Spiders
"use strict";

function play(){

//hide menu	
	var menuDiv = document.getElementById("menu")
	menuDiv.style.display = "none";
	var canvas = document.getElementById("game")
	canvas.style.display = "block";

//general values	
	canvas.width = 500;
	canvas.height = 500;
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 3;
	var gameSpeed = 12;
	var timeInterval = 50;
	var angleSpeed = 20;
	
//create objects
	var spiders = [{id: 0, color: "blue", x: 10, y: 10, angle: 90, angleChange: 0, speed: gameSpeed}];
						// {color: "red", x: 490, y: 490, angle: 270, angleChange: 0, speed: 20},
						// {color: "green", x: 490, y: 10, angle: 180, angleChange: 0, speed: 10},
						// {color: "yellow", x: 10, y: 490, angle: 0, angleChange: 0, speed: 10}];
						
	var webs = [	{x: [], y: []}];
						// {x: [], y: []},
						// {x: [], y: []},
						// {x: [], y: []}];
	
	var areas = [ 	{id: [], color: "", x: [], y: [], inAreas: [], conAreas: [], neigAreas: [], conWall: false}];
	
	var leftArea = (canvas.height - 1) * (canvas.width - 1);

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
	
	
	//start game	
	setInterval(updateGame, timeInterval);
	// while(r < RM) {
	function updateGame() {
			
		//move and do mechanics (area create, web cut, direction change/correction)
		move();

		//save new	position
		for (var i = 0; i < spiders.length; i++){
			webs[i].x.push(spiders[i].x);
			webs[i].y.push(spiders[i].y);
		}

		//paint	game status
		ctx.clearRect(0, 0, canvas.width, canvas. height);
		paintAreas(spiders, areas);
		for (var i = 0; i < spiders.length; i++){
			paintWeb(spiders[i], webs[i]);
			paintArrowhead(spiders[i]);
		}
	}
	
	
	
	function move(){
		for (var i = 0; i < spiders.length; i++){
			//step forward
			step(spiders[i]);
			
			//check if you hit something
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
				
				if (web.x.length > 3 && !freeWeb(web, areas, "wall"))
					createArea(spider, web, areas, spiders);
			
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

				if (web.x.length > 3 && !freeWeb(web, areas, "wall"))
					createArea(spider, web, areas, spiders);
					
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
				
				if (web.x.length > 3 && !freeWeb(web, areas, "wall"))
					createArea(spider, web, areas, spiders);		
				
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
				
				if (web.x.length > 3 && !freeWeb(web, areas, "wall"))
					createArea(spider, web, areas, spiders);			
				
				//clear web
				web.x.length = 0;
				web.y.length = 0;
			}
		}
			
		function checkWeb(spider, web, areas){
			for (var w = 0; w < web.x.length; w++){
				if (Math.sqrt(Math.pow(spider.x - web.x[w], 2) + Math.pow(spider.y - web.y[w], 2)) < spider.speed/1.5 
				&& spider.x != 1 && spider.y != 1 && spider.x != canvas.width - 1 && spider.y != canvas.height - 1){
					// console.log('fill' + 'x: ' + spider.x + 'y: ' + spider.y);
			//save area
					var area = {color: "", x: [], y: [], id: [], inAreas: [], conAreas: [], neigAreas: [], conWall: false};
					area.color = spider.color;
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
				var polygon = createPolygon(areas[a]);

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
						var polygon = createPolygon(areas[sa]);
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
		
			function freeWeb(web, areas, hit){
				//head hits wall
				if (hit == "wall"){
					//start on frame?
					if (web.x[0] < 1.1 || web.y[0] < 1.1 || web.x[0] > canvas.width - 1.1 || web.y[0] > canvas.height - 1.1){
						// console.log("frame");
						return false;
					}
					//start on wall connected area?
					for (var a = 0; a < areas.length; a++){
						if (areas[a].conWall){
							var polygon = createPolygon(areas[a]);
							if (inside(polygon, [web.x[0], web.y[0]])){
								// console.log("area");
								return false;
							}
						}
					}
				}
				return true;
			}
			
			function createArea(spider, web, areas, spiders){
				
				//create virtual complementary left/right webs (v - virtual)
				var vWeb1 = {x: [], y: [], inAreas: [], neigAreas: []};
				var vWeb2 = {x: [], y: [], inAreas: [], neigAreas: []};
				for (var i = 0; i < web.x.length; i++){
					vWeb1.x.push(web.x[i]);
					vWeb2.x.push(web.x[i]);
					vWeb1.y.push(web.y[i]);
					vWeb2.y.push(web.y[i]);
				}
				
				//start 2 virtual loops to check which area you will fill
				vWeb1 = virtualLoop(true, spider, vWeb1, areas);
				vWeb2 = virtualLoop(false, spider, vWeb2, areas);

				console.log(vWeb1);
				console.log(vWeb2);
				
				vWeb1 = addInAreas(vWeb1, areas);
				vWeb2 = addInAreas(vWeb2, areas);
				
				web = compareVWebs(vWeb1, vWeb2, areas, spiders, spider);
				
				var area = {id: areas.length, color: spider.color, x: web.x, y: web.y, inAreas: web.inAreas, conAreas: [], neigAreas: [], conWall: false};
				
				area.neigAreas = checkNeigAreas(web, areas);
				
				areas.push(area);
			}
			
				function virtualLoop(clockwise, spider, vWeb, areas){
					//current position
					var vPos = {x: spider.x, y: spider.y};
					vWeb.x.push(vPos.x);
					vWeb.y.push(vPos.y);
					var vWT = {pos: {x: 0, y: 0}, touchedArea: 0};
					var vAT = {pos: {x: 0, y: 0}, touchedArea: 0};
					var i = 0;
					while(pointsDistance(vPos.x, vPos.y, vWeb.x[0], vWeb.y[0]) > spider.speed && i < 20){
						i++;
						/*console.log("");
						console.log(clockwise +" " + i);
						console.log("x: " + parseFloat(vPos.x).toFixed(2) +" y: "+ parseFloat(vPos.y).toFixed(2) +" w0x: "+ parseFloat(vWeb.x[0]).toFixed(2) +" w0y: "+ parseFloat(vWeb.y[0]).toFixed(2));

						console.log("dist " + parseFloat(pointsDistance(vPos.x, vPos.y, vWeb.x[0], vWeb.y[0])).toFixed(2));
						*/
						
						//at some area
						if (vWt.touchedArea != 0){
							// var areaToGo = 0;
							// var indexToGo = 0;
							
							// take a step on area
							// var lSI /*lastStepIndex*/ = vWeb.x.length - 2;
							// vAS = virtAreaStep(vPos, {vWeb.x[lSI], vWeb.y[lSI]}, vWeb, area, areas, clockwise);
							// vPos = vAS.vPos;
							// if (vAS.touchedArea != 0)
								// vWeb.neigAreas.push(vAS.touchedArea);
							
							// vWeb.x.push(vPos.x);
							// vWeb.y.push(vPos.y);
						}
						//at some wall
						else{
							//at top wall
							if (vPos.y == 1){
								if(clockwise){
									//search for area on top wall at right...
									vWT = virtWallTour(vPos, vWeb, areas, "top", "right");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0)
										vWeb.neigAreas.push(vWT.touchedArea);
									
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								} else {
									//search for area on top wall at left
									vWT = virtWallTour(vPos, vWeb, areas, "top", "left");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0)
										vWeb.neigAreas.push(vWT.touchedArea);
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								}
							}
							//at right wall
							if (vPos.x == canvas.width - 1){
								if(clockwise){
									//search for area on right wall at bottom
									vWT = virtWallTour(vPos, vWeb, areas, "right", "bottom");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0)
										vWeb.neigAreas.push(vWT.touchedArea);
									
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								} else {
									//search for area on right wall at top
									vWT = virtWallTour(vPos, vWeb, areas, "right", "top");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0)
										vWeb.neigAreas.push(vWT.touchedArea);
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								}
							}
							//at bottom wall
							if (vPos.y == canvas.height - 1){
								if(clockwise){
									//search for area on bottom wall at left
									vWT = virtWallTour(vPos, vWeb, areas, "bottom", "left");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0)
										vWeb.neigAreas.push(vWT.touchedArea);
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								} else {
									//search for area on bottom wall at right
									vWT = virtWallTour(vPos, vWeb, areas, "bottom", "right");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0)
										vWeb.neigAreas.push(vWT.touchedArea);
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								}
							}
							//at left wall
							if (vPos.x == 1){
								if(clockwise){
									//search for area on left wall at top
									vWT = virtWallTour(vPos, vWeb, areas, "left", "top");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0)
										vWeb.neigAreas.push(vWT.touchedArea);
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								} else {
									//search for area on left wall at bottom
									vWT = virtWallTour(vPos, vWeb, areas, "left", "bottom");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0)
										vWeb.neigAreas.push(vWT.touchedArea);
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								}
							}
						}
					}
					return vWeb;
				}
				
					function virtWallTour(vPos, vWeb, areas, wall, dir){
						var areaToGo = 0;
						var indexToGo = 0;
						var limit = 0;
						var wallCoord = '';
						var wallLim = 0;
						var corner = [0, 0];
						var	wRvr = 1; //1 || -1
						var	lRvr = 1; //1 || -1
						var vPosCoord = 0;
						var vWebCoord = 0;
						var vWebWallCoord = 0;
						
						//adapt to wall you are on
						if (wall == "top"){
							wallCoord = 'y';
							wallLim = 1.1;
							wRvr = 1;
							corner[1] = 1;
						} else if (wall == "right"){
							wallCoord = 'x';
							wallLim = canvas.width - 1.1;
							wRvr = -1;
							corner[0] = canvas.width - 1;
						} else if (wall == "bottom"){
							wallCoord = 'y';
							wallLim = canvas.height - 1.1;
							wRvr = -1;
							corner[1] = canvas.height - 1;
						} else if (wall == "left"){
							wallCoord = 'x';
							wallLim = 1.1;
							wRvr = 1;
							corner[0] = 1;
						}
						if (wallCoord == 'x'){
							vPosCoord = vPos.y;
							vWebCoord = vWeb.y[0];
							vWebWallCoord = vWeb.x[0];
						} else {
							vPosCoord = vPos.x;
							vWebCoord = vWeb.x[0];
							vWebWallCoord = vWeb.y[0];
						}						
						//adapt to direction of searching
						if (dir == "top"){
							limit = -Infinity;
							lRvr = -1;
							corner[1] = 1;
						} else if (dir == "right"){
							limit = Infinity;
							lRvr = 1;
							corner[0] = canvas.width - 1;
						} else if (dir == "bottom"){
							limit = Infinity;
							lRvr = 1;
							corner[1] = canvas.height - 1;
						} else if (dir == "left"){
							limit = -Infinity;
							lRvr = -1;
							corner[0] = 1;
						}

						
						//search for area on wall at dir...
						for (var a = 1; a < areas.length; a++){
							var axl = areas[a].x.length;
							var areaStart = 0;
							var areaEnd = 0;
							if (wallCoord == 'x'){
								areaStart = areas[a].x[0];
								areaEnd = areas[a].x[axl-1];
							} else {
								areaStart = areas[a].y[0];
								areaEnd = areas[a].y[axl-1];
							}
							
							if(wRvr * areaStart < wRvr * wallLim && lRvr * vPosCoord < lRvr * areaStart && lRvr * areaStart < lRvr * limit){
								limit = areaStart;
								areaToGo = a;
								indexToGo = 0;
							}
							if(wRvr * areaEnd < wRvr * wallLim && lRvr * vPosCoord < lRvr * areaEnd && lRvr * areaEnd < lRvr * limit){
								limit = areaEnd;
								areaToGo = a;
								indexToGo = axl-1;
							}
						}

						//...save area point...
						if (areaToGo != 0){
							vPos.x = areas[areaToGo].x[indexToGo];
							vPos.y = areas[areaToGo].y[indexToGo];
							console.log("a " + areaToGo + " i " + indexToGo);
							
						} else	
						//..finish loop...		
						if ((wRvr * vWebWallCoord < wRvr * wallLim && lRvr * vPosCoord < lRvr * vWebCoord && lRvr * vWebCoord < lRvr * limit && lRvr * limit > lRvr * vPosCoord)){
							console.log('loop finished');
							vPos.x = vWeb.x[0];
							vPos.y = vWeb.y[0];
						//...or wall dir corner.
						} else {
							console.log('corner');
							vPos.x = corner[0];
							vPos.y = corner[1];
						}
						return {vPos: vPos, touchedArea: areaToGo};
						// return vPos;
					}
				
					// function virtAreaStep(vPos, lastVPos, vWeb, area, areas, clockwise){
						// var areaToGo = 0;
						// var indexToGo = 0;
						
						
						
						// return {vPos: vPos, touchedArea: areaToGo};
					// }
					
				function addInAreas(vWeb, areas){
					//polygon from vWeb
					var polygon = createPolygon(vWeb);
					
					//is area in this polygon?
					for (var a = 0; a < areas.length; a++){
						// area point is in polygon and area is not neighbor
						if (inside(polygon, [areas[a].x[0],areas[a].y[0]]) && vWeb.neigAreas.indexOf(a) == -1){
							console.log("point inside area");
							vWeb.inAreas.push(a);
						}
					}
					return vWeb;
				}
			
				function compareVWebs(vWeb1, vWeb2, areas, spiders, spider){
					var area1 = polygonArea(vWeb1.x, vWeb1.y, vWeb1.x.length);
					var area2 = polygonArea(vWeb2.x, vWeb2.y, vWeb2.x.length);
					area1 -= areasInArea(vWeb1, areas);
					area2 -= areasInArea(vWeb2, areas);
					
					console.log("area1: " + area1 + " area2: " + area2);
					
					var spidersIn1 = spidersInArea(vWeb1, spiders, spider);
					var spidersIn2 = spidersInArea(vWeb2, spiders, spider);
					
					if (spidersIn1 < spidersIn2)
						return vWeb1;
					if (spidersIn1 > spidersIn2){
						console.log('s1');
						return vWeb2;
					}
					
					if (area1 < area2){
						console.log('a1');
						return vWeb1;
					}
					if (area1 > area2)
						return vWeb2;
				}
			
				function checkNeigAreas(web, areas){
					for (var a = 0; a < areas.length; a++){
						for (var wp = 0; wp < web.x.length; wp++){
							//if (areas[a].x
							
							
							
						}
					}
					
					
				}
			
	function paintAreas(spiders, areas){
		ctx.strokeStyle = 'black';	
		for (var i = 0; i < areas.length; i++){
			//choose color
			for (var s = 0; s < spiders.length; s++){
				if (areas[i].color = spiders[s].color)
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

//create polygon from {x:[] y:[]}
function createPolygon(pointsArr){
	var polygon = createArray(pointsArr.x.length, 2);
	for (var p = 0; p < pointsArr.x.length; p++){
		polygon[p][0] = pointsArr.x[p];
		polygon[p][1] = pointsArr.y[p];
	}
	return polygon;
}

//calculate polygon area
function polygonArea(X, Y, numPoints){    
	var area = 0;  // Accumulates area in the loop   
	var j = numPoints-1;  // The last vertex is the 'previous' one to the first

	for (var i = 0; i < numPoints; i++){ 
		area = area +  (X[j]+X[i]) * (Y[j]-Y[i]); 
		j = i;  //j is previous vertex to i
	}   
	return Math.abs(area/2); 
}

//determines polygon direction
function isClockwise(X, Y, numPoints){    
	var area = 0;  // Accumulates area in the loop   
	var j = numPoints-1;  // The last vertex is the 'previous' one to the first

	for (var i = 0; i < numPoints; i++){ 
		area = area +  (X[j]+X[i]) * (Y[j]-Y[i]); 
		j = i;  //j is previous vertex to i
	}   
	
	if (area >= 0)
		return true;
	else
		return false;
}

function areasInArea(vWeb, areas){
	var areaSum = 0;
	for (var ia = 0; ia < vWeb.inAreas.length; ia ++)
		areaSum += polygonArea(areas[vWeb.inAreas[ia]].x, areas[vWeb.inAreas[ia]].y);
	return areaSum;
}

function spidersInArea(vWeb, spiders, spider){
	var polygon = createPolygon(vWeb);
	var spidersIn = 0;
	for (var s = 0; s < spiders.length; s++){
		if (s != spider.id && inside(polygon, [spiders[s].x, spiders[s].y]))
			spidersIn++;
	}
	return spidersIn;
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

