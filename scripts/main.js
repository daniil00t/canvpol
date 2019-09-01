!(() => {
	// Constants
	const WWIDTH 	= window.innerWidth, 
				WHEIGHT = window.innerHeight;
	// Constant functions
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}			


	// Polygon Class
		class Polygon{
			constructor(id, w, h, bgc, objs){
				this.canvas 	= document.getElementById(id);
				this.ctx 			= this.canvas.getContext('2d');
				this.w 				= this.canvas.width 	= w;
				this.h 				= this.canvas.height 	= h;
				this.bgc 			= "#333";
				this.heigthArea = 10;
				this.n 				=	0;
				this.player 	= {};
				this.objects 	= objs;
			}
			init(){
				this.canvas.style.backgroundColor = this.bgc;
				this.ctx.clearRect(0, 0, this.w, this.h);
			}
			getPlayerCoords(o){
				this.player = o;
				console.log(o)
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

				// render player
				this.drawRect(this.player.x, this.player.y, this.player.w, this.player.h, "yellow");

				// render objects
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

	// Circle Class
		class Circle{
			constructor(ctx, dx, dy, dr, bgc){
				this.ctx 				= ctx;
				this.x 					= dx;
				this.y 					= dy;
				this.r 					= dr;
				this.bgc 				= bgc;
				this.step 			= 6;
				this.gravity		= 0.5;
				this.objects 		= [];
				this.player = {};
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
				this.player = o;
				console.log(o)
			}
			loop(fx, fy, render){
				this.ctx.clearRect(0, 0, WWIDTH, WHEIGHT)


				let frender = true || render;
				frender ? this.draw(this.x, this.y, this.r, this.bgc) : console.log("circle dead");
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
					if(this.x < j[1] && this.x > j[1] - 5 && (this.y > j[0] && this.y < j[2]) ){
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
					// dx = -dx;
					console.log("Game over")
					frender = false
				}
				if(this.y < this.r){
					dy = Math.abs(dy);
					// dy += this.gravity;
				}else if(this.y > WHEIGHT - this.r){
					dy = -dy;
					// dy -= this.gravity;
				}

				if(this.x > (this.player.x - this.r) && (this.y >= this.player.y && this.y <= this.player.y + this.player.h)){
					dx = -dx;
				}

			
				this.x += dx;
				this.y += dy;
				if(frender){
					let MainRAF = window.requestAnimationFrame((fx, fy, frender)=>{
						self.loop(dx, dy);
					});	
				}else{
					this.ctx.clearRect(0, 0, WWIDTH, WHEIGHT)
				}

			}
		}

	// Player Class
		class Player{
			constructor(polygon, circle, x, y){
				this.ctx 			= polygon.ctx;
				this.polygon	= polygon;
				this.circle 	= circle;
				this.x 				= x;
				this.y 				= y;
				this.w 				= 20;
				this.h 				= 100;
				this.speed 		= 10;
				this.bgc 			= "yellow";
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
				this.polygon.getPlayerCoords({
					x: this.x,
					y: this.y,
					w: this.w,
					h: this.h
				})
				// this.ctx.clearRect(WWIDTH - 100, 0, WWIDTH, WHEIGHT)
				// this.ctx.fillStyle = this.bgc;
				// this.ctx.fillRect(x, y, w, h);
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
			w: 400,
			h: 30,
			bgc: "brown",
			o: "rect"
		},
		{
			x: 750,
			y: WHEIGHT - 500,
			w: 300,
			h: 30,
			bgc: "green",
			o: "rect"
		},
		{
			x: WWIDTH - 1000,
			y: WHEIGHT - 200,
			w: 40,
			h: 200,
			bgc: "blue",
			o: "rect"
		}

	]);




	polygon.addObject({
		x: 300,
		y: 300,
		r: 20,
		o: "tringle"
		// bgc: "#666"
	});
	
		
	polygon.init();

	// INIT

	let circle = new Circle(polygon.ctx, 400, 200, 20, "pink");
	circle.init();


	// load objects to main class for future rendered
	circle.loadCoordsObjects(polygon.objects);

	let player = new Player(polygon, circle, WWIDTH - 50, 100);
	player.init();

	circle.player = {
		x: player.x,
		y: player.y,
		w: player.w,
		h: player.h
	};
	polygon.player = {
		x: player.x,
		y: player.y,
		w: player.w,
		h: player.h
	};

	// render main function
	circle.loop();
	polygon.loop();

	



})();