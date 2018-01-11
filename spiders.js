//Spiders
"use strict";

function play(){
//testing place
	
//initial data	
	{
		
	//hide menu	
		var menuDiv = document.getElementById("menu")
		menuDiv.style.display = "none";
		var canvas = document.getElementById("game")
		canvas.style.display = "block";

	//general values	
		canvas.width = 500;
		canvas.height = 500;
		var leftArea = (canvas.height - 1) * (canvas.width - 1);
		var ctx = canvas.getContext("2d");
		ctx.lineWidth = 3;
		var gameSpeed = 6;
		var timeInterval = 60;
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
		
		var areas = [ 	{id: [], color: "", x: [], y: [], inAreas: [], conAreas: [], neigAreas: [], conWall: false, size: 0, wallIndexes: []}];
	
	}

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
			if(checkWeb(spiders[i], webs[i], areas)){}
			else if (checkArea(spiders[i], webs[i], areas)){}
			else if (checkWalls(spiders[i], webs[i], areas)){}
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

			
		function checkWeb(spider, web, areas){
			var hit = false;
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
					
					hit = true;
				}
			}
			return hit;
		}
	
		function checkArea(spider, web, areas){
			var hit = false;
			for (var a = 1; a < areas.length; a++){

				//if head hits area
				if (inArea(areas[a], [spider.x, spider.y])){
					
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
						//yes
						if (inArea(areas[sa], [web.x[0], web.y[0]]) && web.x.length > 1){
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
					hit = true;
				}
			}
			return hit;
		}
		
		function checkWalls(spider, web, areas){
			var hit = false;
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
				hit = true;
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
				hit = true;
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
				hit = true;
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
				hit = true;
			}
		}
		
			function freeWeb(web, areas, hit){
				//head hits wall
				if (hit == "wall"){
					//start on frame?
					if (web.x[0] < 1.1 || web.y[0] < 1.1 || web.x[0] > canvas.width - 1.1 || web.y[0] > canvas.height - 1.1){
						console.log("start at frame");
						return false;
					}
					//start on wall connected area?
					for (var a = 0; a < areas.length; a++){
						if (areas[a].conWall){
							if (inArea(areas[a], [web.x[0], web.y[0]])){
								console.log("start at area");
								return false;
							}
						}
					}
				}
				return true;
			}
			
			function createArea(spider, web, areas, spiders){
				
				//cut start on area for aesthetics
				if (inSomeArea({x: web.x[0], y: web.y[0]}, areas)){
					web.shift();
					cinsole.log("web.shift();");
				}
				
				//create virtual complementary left/right webs (v - virtual)
				var vWeb1 = {x: [], y: [], inAreas: [], neigAreas: [], conWall: false, size: 0};
				var vWeb2 = {x: [], y: [], inAreas: [], neigAreas: [], conWall: false, size: 0};
				for (var i = 0; i < web.x.length; i++){
					vWeb1.x.push(web.x[i]);
					vWeb2.x.push(web.x[i]);
					vWeb1.y.push(web.y[i]);
					vWeb2.y.push(web.y[i]);
				}
				
				//start 2 virtual loops to check which area you will fill
				console.log("clockwise");
				vWeb1 = virtualLoop(true, spider, vWeb1, areas);
				console.log("");
				console.log("");
				console.log("counterclockwise");
				vWeb2 = virtualLoop(false, spider, vWeb2, areas);

				vWeb1 = addInAreas(vWeb1, areas);
				vWeb2 = addInAreas(vWeb2, areas);
				
				// console.log("cw:");
				// console.log(vWeb1);
				// console.log("ccw:");
				// console.log(vWeb2);
				
				web = compareVWebs(vWeb1, vWeb2, areas, spiders, spider);
				
				var area = {id: areas.length, color: spider.color, x: web.x, y: web.y, inAreas: web.inAreas, conAreas: [], neigAreas: web.neigAreas, conWall: web.conWall, size: web.size, wallIndexes: []};
				
				area = addWallIndexes(area);
				//area.neigAreas = checkNeigAreas(web, areas);
				
				console.log(area);
				areas.push(area);
				leftArea -= area.size;
				//console.log("leftArea" + leftArea);
			}
			
				function virtualLoop(clockwise, spider, vWeb, areas){
					//current position
					var vPos = {x: spider.x, y: spider.y};
					vWeb.x.push(vPos.x);
					vWeb.y.push(vPos.y);
					var vWT = {pos: {x: 0, y: 0}, touchedArea: 0, touchedIndex: 0};
					var vAS = {pos: {x: 0, y: 0}, touchedArea: 0, touchedIndex: 0};
					var i = 0;
					var touchedArea = 0;
					var touchedIndex = 0;
					
					//go tour till you reached web start (i for compiling)
					while(pointsDistance(vPos.x, vPos.y, vWeb.x[0], vWeb.y[0]) > spider.speed && i < 300){
						i++;
						console.log("");
						/*console.log(clockwise +" " + i);
						console.log("x: " + parseFloat(vPos.x).toFixed(2) +" y: "+ parseFloat(vPos.y).toFixed(2) +" w0x: "+ parseFloat(vWeb.x[0]).toFixed(2) +" w0y: "+ parseFloat(vWeb.y[0]).toFixed(2));

						console.log("dist " + parseFloat(pointsDistance(vPos.x, vPos.y, vWeb.x[0], vWeb.y[0])).toFixed(2));
						*/	
						console.log("area: " + touchedArea);
						console.log("index: " + touchedIndex);
						console.log("vPos: " + vPos.x, vPos.y);
						
						//at some area
						if (touchedArea != 0){
							
							//take a step on area
							var lSI /*lastStepIndex*/ = vWeb.x.length - 2;
							vAS = virtAreaStep(vPos, {x: vWeb.x[lSI], y: vWeb.y[lSI]}, vWeb, touchedArea, touchedIndex, areas, clockwise);
							//(vPos, lastVPos, vWeb, a, i, areas, clockwise)
							vPos = vAS.vPos;
							if (vAS.touchedArea != 0){
								vWeb.neigAreas.push(vAS.touchedArea);
								touchedArea = vAS.touchedArea;
								touchedIndex = vAS.touchedIndex;
								console.log("touchedArea: " + touchedArea);
							} else {
								touchedArea = vAS.touchedArea;
								touchedIndex = vAS.touchedIndex;
								console.log("touchedArea: " + touchedArea);
							}
							
							vWeb.x.push(vPos.x);
							vWeb.y.push(vPos.y);
// debugger;
						}
						//at some wall
						else{
							//at top wall
							if (vPos.y == 1){
								vWeb.conWall = true;
								if(clockwise){
									//search for area on top wall at right...
									vWT = virtWallTour(vPos, vWeb, areas, "top", "right");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0){
										vWeb.neigAreas.push(vWT.touchedArea);
										touchedArea = vWT.touchedArea;
										touchedIndex = vWT.touchedIndex;
									}
									
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								} else {
									//search for area on top wall at left
									vWT = virtWallTour(vPos, vWeb, areas, "top", "left");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0){
										vWeb.neigAreas.push(vWT.touchedArea);
										touchedArea = vWT.touchedArea;
										touchedIndex = vWT.touchedIndex;
									}
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								}
							}
							//at right wall
							if (vPos.x == canvas.width - 1){
								vWeb.conWall = true;
								if(clockwise){
									//search for area on right wall at bottom
									vWT = virtWallTour(vPos, vWeb, areas, "right", "bottom");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0){
										vWeb.neigAreas.push(vWT.touchedArea);
										touchedArea = vWT.touchedArea;
										touchedIndex = vWT.touchedIndex;
									}
									
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								} else {
									//search for area on right wall at top
									vWT = virtWallTour(vPos, vWeb, areas, "right", "top");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0){
										vWeb.neigAreas.push(vWT.touchedArea);
										touchedArea = vWT.touchedArea;
										touchedIndex = vWT.touchedIndex;
									}
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								}
							}
							//at bottom wall
							if (vPos.y == canvas.height - 1){
								vWeb.conWall = true;
								if(clockwise){
									//search for area on bottom wall at left
									vWT = virtWallTour(vPos, vWeb, areas, "bottom", "left");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0){
										vWeb.neigAreas.push(vWT.touchedArea);
										touchedArea = vWT.touchedArea;
										touchedIndex = vWT.touchedIndex;
									}
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								} else {
									//search for area on bottom wall at right
									vWT = virtWallTour(vPos, vWeb, areas, "bottom", "right");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0){
										vWeb.neigAreas.push(vWT.touchedArea);
										touchedArea = vWT.touchedArea;
										touchedIndex = vWT.touchedIndex;
									}
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								}
							}
							//at left wall
							if (vPos.x == 1){
								vWeb.conWall = true;
								if(clockwise){
									//search for area on left wall at top
									vWT = virtWallTour(vPos, vWeb, areas, "left", "top");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0){
										vWeb.neigAreas.push(vWT.touchedArea);
										touchedArea = vWT.touchedArea;
										touchedIndex = vWT.touchedIndex;
									}
									vWeb.x.push(vPos.x);
									vWeb.y.push(vPos.y);
								} else {
									//search for area on left wall at bottom
									vWT = virtWallTour(vPos, vWeb, areas, "left", "bottom");
									vPos = vWT.vPos;
									if (vWT.touchedArea != 0){
										vWeb.neigAreas.push(vWT.touchedArea);
										touchedArea = vWT.touchedArea;
										touchedIndex = vWT.touchedIndex;
									}
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

// debugger;						
						//search for area on wall at dir...
						for (var a = 1; a < areas.length; a++){
							var lwp /*last wall point*/ = areas[a].x.length - 2;
							var areaPoint = 0;
							var areaWallPoint = 0;
							
							for (var ai = 0; ai < lwp + 1; ai++){
								if (areas[a].wallIndexes.indexOf(ai) != -1){
									if (wallCoord == 'x'){
										areaPoint = areas[a].y[ai];
										areaWallPoint = areas[a].x[ai];
									} else {
										areaPoint = areas[a].x[ai];
										areaWallPoint = areas[a].y[ai];
									}
									
									if(wRvr * areaWallPoint < wRvr * wallLim && lRvr * vPosCoord < lRvr * areaPoint && lRvr * areaPoint < lRvr * limit){
										limit = areaPoint;
										areaToGo = a;
										indexToGo = ai;
									}
								}
							}
// debugger;							
						}
						//...save area point...
						if (areaToGo != 0){
							vPos.x = areas[areaToGo].x[indexToGo];
							vPos.y = areas[areaToGo].y[indexToGo];
							//console.log("a " + areaToGo + " i " + indexToGo);
//debugger;							
						}
						//..finish loop...		
						if ((wRvr * vWebWallCoord < wRvr * wallLim && lRvr * vPosCoord < lRvr * vWebCoord && lRvr * vWebCoord < lRvr * limit && lRvr * limit > lRvr * vPosCoord)){
							console.log('loop finished');
							vPos.x = vWeb.x[0];
							vPos.y = vWeb.y[0];
						//...or wall dir corner.
						} else if (areaToGo == 0) {
							console.log('corner');
							vPos.x = corner[0];
							vPos.y = corner[1];
						}
						return {vPos: vPos, touchedArea: areaToGo, touchedIndex: indexToGo};
						// return vPos;
					}
				
					function virtAreaStep(vPos, lastVPos, vWeb, a, i, areas, clockwise){
						var areaToGo = 0;

						//console.log(inArea(areas[a], lastVPos));
						
						//touched wall?
						if ((vPos.y < 1.001 || vPos.x > canvas.width -1.001 || vPos.y > canvas.height - 1.001 || vPos.x < 1.001) && inArea(areas[a], lastVPos)){
							console.log("touched wall");
						}
						else {
							areaToGo = a;
							var indexToGo = i;
							
							var axl = areas[a].x.length;
							//create vPositions for both sides
							var vPos1 = {x: areas[a].x[(i + 1)%axl]
										,y: areas[a].y[(i + 1)%axl]}
							var vPos2 = {x: areas[a].x[(i - 1 + axl)%axl]
										,y: areas[a].y[(i - 1 + axl)%axl]}
							
							console.log("vPos1: " + vPos1.x, vPos1.y + " vPos2: " + vPos2.x, vPos2.y);
							console.log("lastVPos: " + lastVPos.x, lastVPos.y);
							
							//not back
							if (closePoints(vPos1, lastVPos, 0.01))
								vPos = vPos2;
							else if (closePoints(vPos2, lastVPos, 0.01))
								vPos = vPos1;
							//free hand side
							else if (freeSide(vPos1, vPos, areas[a], clockwise) && i != axl - 2)
								vPos = vPos1;
							else if (freeSide(vPos2, vPos, areas[a], clockwise))
								vPos = vPos2;
							
							if (vPos == vPos1)
								indexToGo++;
							else
								indexToGo--;
//debugger;							
							//touched other area?
							for (var oa = 1; oa < areas.length; oa++){
								if (oa != a){
									for (var oap = 0; oap < areas[oa].x.length; oap++){
										if(vPos.x == areas[oa].x[oap] && vPos.y == areas[oa].y[oap]){
											areaToGo = oa;
											indexToGo = oap;
											console.log("areaToGo " + areaToGo + " indexToGo " + indexToGo);
										}
									}
								}
							}
						}
						return {vPos: vPos, touchedArea: areaToGo, touchedIndex: indexToGo};
					}
					
						function freeSide(pos, posBefore, area, clockwise){
							var sidePos = {x: 0, y:0};

							var angle = Math.atan2(pos.y - posBefore.y, pos.x - posBefore.x);
							if (clockwise)
								angle -= Math.PI/2;
							else
								angle += Math.PI/2;
							
							sidePos.x = pos.x + Math.cos(angle);
							sidePos.y = pos.y - Math.sin(angle);
//debugger;							
							if (inArea(area, sidePos))
								return false;
							else
								return true;
						}
					
				function addInAreas(vWeb, areas){
					
					//is area in this polygon?
					for (var a = 0; a < areas.length; a++){
						// area point is in polygon and area is not neighbor
						if (inArea(vWeb, [areas[a].x[0], areas[a].y[0]]) && vWeb.neigAreas.indexOf(a) == -1){
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
					vWeb1.size = area1;
					vWeb2.size = area2;
					
					//console.log("area1: " + area1 + " area2: " + area2);
					
					var spidersIn1 = spidersInArea(vWeb1, spiders, spider);
					var spidersIn2 = spidersInArea(vWeb2, spiders, spider);
					
					if (spidersIn1 < spidersIn2)
						return vWeb1;
					if (spidersIn1 > spidersIn2){
						//console.log('s1');
						return vWeb2;
					}
					
					if (area1 < area2){
						//console.log('a1');
						return vWeb1;
					}
					if (area1 > area2)
						return vWeb2;
				}
			
				function addWallIndexes(area){
					for (var i = 0; i < area.x.length - 1; i++)
						if (area.x[i] < 1.1 || area.y[i] < 1.1 || area.x[i] > canvas.width - 1.1 || area.y[i] > canvas.height - 1.1){
							area.wallIndexes.push(i);
					}
					return area;
				}
			
	function paintAreas(spiders, areas){
		ctx.strokeStyle = 'black';	
		for (var a = 0; a < areas.length; a++){
			//set color
			ctx.fillStyle = areas[a].color;

			//go through edge	
			ctx.beginPath();
			ctx.moveTo(areas[a].x[0], areas[a].y[0]);
			for (var ap = 1; ap < areas[a].x.length; ap++){
				ctx.lineTo(areas[a].x[ap], areas[a].y[ap]);
			}
			ctx.closePath();
			//make holes for inside areas
			for (var ia = 0; ia < areas[a].inAreas.length; ia++){
				var iaId = areas[a].inAreas[ia];
				ctx.moveTo(areas[iaId].x[0], areas[iaId].y[0]);
				for (var ap = 1; ap < areas[iaId].x.length; ap++){
					ctx.lineTo(areas[iaId].x[ap], areas[iaId].y[ap]);
				}
			}
			
			//paint
			ctx.mozFillRule = 'evenodd'; //for old firefox 1~30
			ctx.fill('evenodd');
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




function closePoints(p1, p2, limit){
	var dist = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

	if (dist < limit) 
		return true;
	else 
		return false;
}

//point in area
function inArea(area, point){
	var polygon = createPolygon({x: area.x, y: area.y});
	var onEdge = false;
	for (var ap = 0; ap < area.x.length; ap++){
		if (Math.abs(point.x - area.x[ap]) < 0.01 && Math.abs(point.y - area.y[ap]) < 0.01)
			onEdge = true;
	}
			
	return (inside (polygon, point) || onEdge); 
}

function inSomeArea(point, areas){
	var iSA = false;
	for (var a = 0; a < areas[a].x.length; a++){
		if (inArea(areas[a], point)){
			iSA = true;
		}
	}
	
	return iSA; 
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
	var spidersIn = 0;
	for (var s = 0; s < spiders.length; s++){
		if (s != spider.id && inArea(vWeb, [spiders[s].x, spiders[s].y]))
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

Math.deg = function(rad){
	return rad / Math.PI * 180;
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

