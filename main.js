!(() => {
	// Constants
	const WWIDTH 	= window.innerWidth, 
				WHEIGHT = window.innerHeight;
	// Constant functions
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
			this.heigthArea = 10;
			this.n 				=	0;
			this.objects 	= objs;
		}
		init(){
			this.canvas.style.backgroundColor = this.bgc;
			this.ctx.clearRect(0, 0, this.w, this.h);
		}
		addObject(obj){
			this.objects.push(obj)
		}
		drawRect(x, y, w, h, bgc="red"){
			this.ctx.fillStyle = bgc;
			this.ctx.fillRect(x, y, w, h);
		}
		drawTringle(x, y, r, bgc="green"){
			this.ctx.fillStyle = bgc;
			this.ctx.beginPath();
			// top
			this.ctx.moveTo(x, y - r);
			// right
			this.ctx.lineTo(x  + (r * Math.pow(3, 0.5)) / 2, y  - r+ 1.5 * r);
			// left
			this.ctx.lineTo(x + ((r * Math.pow(3, 0.5)) / 2) - r * Math.pow(3, 0.5) ,y  - r+ 1.5 * r);
			this.ctx.closePath();
			this.ctx.fill();
		}
		loop(){
			let self = this;
			for (var i = 0; i < this.objects.length; i++) {
				let j = this.objects[i];
				if(j.o == "rect"){
					this.drawRect(
					j.x,
					j.y,
					j.w,
					j.h,
					j.bgc
				)
				}else if (j.o == "tringle"){
					this.drawTringle(
						j.x,
						j.y,
						j.r
					)
				}
				
			}
			window.requestAnimationFrame(()=>{
				self.loop();
			});
		}
	}


	class Circle{
		constructor(ctx, dx, dy, dr, bgc){
			this.ctx 				= ctx;
			this.x 					= dx;
			this.y 					= dy;
			this.r 					= dr;
			this.bgc 				= bgc;
			this.step 			= 12;
			this.gravity		= 0.5;
			this.objects 		= [];
			this.playerConf = {};
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
				if(j.o == "rect"){
					tmp.push([(j.y - this.r), (j.x + j.w + this.r), (j.y + j.h + this.r), (j.x - this.r)])
				}
			}
			this.objects = tmp;
			console.log("objects loaded!");
		}
		getPlayerCoords(o){
			this.playerConf = o;
			console.log(o)
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
				dx = Math.abs(dx);
			}else if(this.x > WWIDTH - this.r){
				dx = -dx;
			}
			if(this.y < this.r){
				dy = Math.abs(dy);
				// dy += this.gravity;
			}else if(this.y > WHEIGHT - this.r){
				dy = -dy;
				// dy -= this.gravity;
			}

		
			this.x += dx;
			this.y += dy;

			window.requestAnimationFrame((fx, fy)=>{
				self.loop(dx, dy);
			});
		}
	}

		class Player{
			constructor(ctx, circle, x, y){
				this.ctx 		= ctx;
				this.circle = circle;
				this.x 			= x;
				this.y 			= y;
				this.w 			= 50;
				this.h 			= 200;
				this.speed 	= 10;
				this.bgc 		= "yellow";
			}
			init(){
				let self = this;
				document.onkeypress = (e) => {
					self.contolKeyBoard(e);
				}
				this.draw(this.x, this.y, this.w, this.h)
			}
			draw(x, y, w, h){
				this.circle.getPlayerCoords({
					x: this.x,
					y: this.y,
					w: this.w,
					h: this.h
				})
				this.ctx.clearRect(WWIDTH - 100, 0, WWIDTH, WHEIGHT)
				this.ctx.fillStyle = this.bgc;
				this.ctx.fillRect(x, y, w, h);
				// console.log("draw")
			}
			contolKeyBoard(e){
				switch(e.key){
					case "s":
					case "down":
						if(this.y + this.h < WHEIGHT){
							this.y += this.speed;
							this.draw(this.x, this.y, this.w, this.h);
						}
						break;
					case "w":
					case "up":
						if(this.y > 0){
							this.y -= this.speed;
							this.draw(this.x, this.y, this.w, this.h);
						};break;
					default:
						console.log("Что-то пошло не так");
				}
			}
		}

	// start animate
	let polygon = new Polygon("main_canvas", WWIDTH, WHEIGHT,  "#333", [
		{
			x: 100,
			y: WHEIGHT - 500,
			w: 600,
			h: 100,
			bgc: "brown",
			o: "rect"
		},
		{
			x: 750,
			y: WHEIGHT - 500,
			w: 400,
			h: 100,
			bgc: "green",
			o: "rect"
		},
		{
			x: WWIDTH - 500,
			y: WHEIGHT - 500,
			w: 100,
			h: 500,
			bgc: "blue",
			o: "rect"
		},
		{
			x: WWIDTH - 1000,
			y: WHEIGHT - 500,
			w: 100,
			h: 500,
			o: "rect"
		}

	]);

	polygon.addObject({
		x: 0,
		y: 0,
		w: polygon.w,
		h: polygon.heigthArea,
		o: "rect"
		// bgc: "#666"
	});
	polygon.addObject({
		x: polygon.w - polygon.heigthArea,
		y: 0,
		w: polygon.heigthArea,
		h: polygon.h,
		o: "rect"
		// bgc: "#666"
	});
	polygon.addObject({
		x: 0,
		y: polygon.h - polygon.heigthArea,
		w: polygon.w,
		h: polygon.heightArea,
		bgc: "blue",
		o: "rect"
	});
	polygon.addObject({
		x: 0,
		y: 0,
		w: polygon.heigthArea,
		h: polygon.h,
		o: "rect"
		// bgc: "#666"
	});


	polygon.addObject({
		x: 300,
		y: 300,
		r: 50,
		o: "tringle"
		// bgc: "#666"
	});
	
		
	polygon.init();
	// polygon.drawRect(100, polygon.h - 100, 200, 100, "green");

	// INIT
	let circle = new Circle(polygon.ctx, 400, 200, 50, "pink");
	circle.init();


	// load objects to main class for future rendered
	circle.loadCoordsObjects(polygon.objects);

	// render main function
	circle.loop();
	polygon.loop();


	let player = new Player(polygon.ctx, circle, WWIDTH - 100, 100);
	player.init();
	circle.playerConf = {
		x: player.x,
		y: player.y,
		w: player.w,
		h: player.h
	};

})();