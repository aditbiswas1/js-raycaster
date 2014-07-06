function Camera() {
  // Initial camera position
  this.x = 0
  this.y = 500

  // Camera angle
  this.angle = 0

  // Field of view, in degree.
  this.fov = 60

  // Max distance to draw
  this.maxDistance = 1500
}

Camera.prototype.project = function(map, canvas){
	var angle = this.angle - (this.fov / 2);

	var angleIncrement = this.fov / canvas.width;

	var distanceFromScreen = canvas.width / 2 / Math.tan(this.fov / 2);

	var context = canvas.getContext("2d");

	var xIncrementConst = 2;
	for (var x = 0; x < canvas.width; x+=xIncrementConst){
		var ray = this.castRay(angle, map) //distance from wall

		var distance = ray[0];
		color = ray[1];

		distance = distance * Math.cos((this.angle - angle) * DEG);

		var sliceHeight = map.wallHeight / distance * distanceFromScreen;

		var y = canvas.height / 2 - sliceHeight / 2;

		if (color == 1){
			context.fillStyle = '#f0f';	
		}
		else if ( color == 2){
			context.fillStyle = '#0ff';
		}
		
    	context.fillRect(x, y, xIncrementConst, sliceHeight);

    	context.fillStyle = '#000';
    	context.globalAlpha = distance / this.maxDistance;
    	context.fillRect(x, y, xIncrementConst, sliceHeight);
    	context.globalAlpha = 1;

    	/*  floor rendering */
    	context.fillStyle = '#00CC66';
    	var floor = canvas.height - y;
    	context.fillRect(x, y, xIncrementConst, floor);

    	/*ceiling rendering */
    	context.fillStyle = '#53A6CF';
    	var ceiling = y + sliceHeight;
    	context.fillRect(x, 0, xIncrementConst , ceiling);

		angle += angleIncrement;

	}
}

Camera.prototype.castRay = function(angle, map){
	var x = this.x;
	var y = this.y;

	var xIncrement = Math.cos(angle * DEG);
	var yIncrement = Math.sin(angle * DEG);

	for (var length = 0; length < this.maxDistance; length++){
		x += xIncrement;
		y += yIncrement;

		var hit = map.get(x, y)

		if(hit) return [length, hit] ;
	}
}

Camera.prototype.move = function(distance){
	this.x += Math.cos(this.angle * DEG) * distance;
	this.y += Math.sin(this.angle * DEG) * distance;
}