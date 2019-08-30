!(() => {
	// let canvas 	= document.getElementById("main_canvas");
	// let ctx 		= canvas.getContext('2d');
	// const w 		= window.innerWidth;
	// const h 		= window.innerHeight;
	const WWIDTH 	= window.innerWidth, 
				WHEIGHT = window.innerHeight;
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}			
	class Polygon{
		constructor(id, w, h, bgc, objs){
			this.canvas 	= document.getElementById(id);
			this.ctx 			= this.canvas.getContext('2d');
			this.w 				= this.canvas.width 	= w;
			this.h 				= this.canvas.height 	= h;
			this.bgc 			= "#333";
			this.objects 	= objs;
		}
		init(){
			this.canvas.style.backgroundColor = this.bgc;
			this.ctx.clearRect(0, 0, this.w, this.h);
		}
		loop(){
			let self = this;
			for (var i = 0; i <= this.objects.length-1; i++) {
				this.drawRect(
					this.objects[i].x,
					this.objects[i].y,
					this.objects[i].w,
					this.objects[i].h,
					this.objects[i].bgc,
				)
			}
			window.requestAnimationFrame(()=>{
				self.loop();
			});

		}
		drawRect(x, y, w, h, bgc="red"){
			this.ctx.fillStyle = bgc;
			this.ctx.fillRect(x, y, w, h);
		}
	}



	class Circle{
		constructor(ctx, dx, dy, dr, bgc){
			this.ctx 			= ctx;
			this.x 				= dx;
			this.y 				= dy;
			this.r 				= dr;
			this.bgc 			= bgc;
			this.step 		= 8;
			this.objects 	= [];
			console.log(this)
		}
		draw(x, y, r, bgc="red"){
			this.ctx.fillStyle = bgc;
			this.ctx.lineWidth = 5;
			this.ctx.beginPath();
			this.ctx.arc(x, y, r, 0, 2 * Math.PI);
			this.ctx.closePath();
			this.ctx.fill();
		}
		init(){
			this.draw(this.x, this.y, this.r, this.bgc);
		}
		loadCoordsObjects(arr){
			let tmp = [];
			for (var i = 0; i < arr.length; i++) {
				let j = arr[i];
				tmp.push([(j.y - this.r), (j.x + j.w + this.r), (j.y + j.h + this.r), (j.x - this.r)])
			}
			this.objects = tmp;
			console.log("objects loaded!");
		}
		loop(fx, fy){
			this.ctx.clearRect(0, 0, WWIDTH, WHEIGHT)
			this.draw(this.x, this.y, this.r, this.bgc);
			// console.log(this);


			let self = this;

			let dx = fx || this.step;
			let dy = fy || this.step;

			
			// console.log(dx, dy)
			for (var i = 0; i < this.objects.length; i++) {
				let j = this.objects[i];
				// up
				if(this.y > j[0] && this.y < j[0] + 8 && (this.x >= j[3] && this.x <= j[1])){
					dy = -dy;
					console.log("up")
				}

				// right
				if(this.x < j[1] && this.x > j[1] - 8 && (this.y > j[0] && this.y < j[2]) ){
					dx = -dx;
					console.log("l")
				}


				// bottom
				if(this.y <= j[2] && this.y > j[2] - 5 && (this.x >= j[3] && this.x <= j[1])){
					dy = -dy;
					console.log("bottom")
				}


				// left
				if(this.x > j[3] && this.x < j[3] + 8 && (this.y > j[0] && this.y < j[2]) ){
					dx = -dx;
					console.log("l")
				}
			}
			// Смотрим на стенки, отходя от них на радиус
			if(this.x < this.r){
				dx = this.step;
			}else if(this.x > WWIDTH - this.r){
				dx = -dx;
			}
			if(this.y < this.r){
				dy = this.step;
			}else if(this.y > WHEIGHT - this.r){
				dy = -dy;
			}

		
			this.x += dx;
			this.y += dy;

			window.requestAnimationFrame((fx, fy)=>{
				self.loop(dx, dy);
			});
		}
	}

	// start animate

	let polygon = new Polygon("main_canvas", WWIDTH, WHEIGHT,  "#333", [
		{
			x: 100,
			y: WHEIGHT - 500,
			w: 600,
			h: 100
		},
		{
			x: 750,
			y: WHEIGHT - 500,
			w: 400,
			h: 100
		},
		{
			x: WWIDTH - 500,
			y: WHEIGHT - 500,
			w: 100,
			h: 500
		},
		{
			x: WWIDTH - 1000,
			y: WHEIGHT - 500,
			w: 100,
			h: 500
		},
	])
	polygon.init();
	// polygon.drawRect(100, polygon.h - 100, 200, 100, "green");

	let circle = new Circle(polygon.ctx, WWIDTH - 100, WHEIGHT - 200, 50, "pink");
	circle.init();

	circle.loadCoordsObjects(polygon.objects);
	circle.loop();
	polygon.loop();




})();