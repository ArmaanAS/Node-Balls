module.exports = function(x, y, vx, vy) { // Entity Function
	this.uid = Math.random();
	this.x = x + 10;
	this.y = y + 10;
	this.vx = vx;
	this.vy = vy;
	this.colour = '#' + (Math.floor(Math.random() * 100000) + 99999);
	
	this.tick = new Date().getTime();
	
	this.update = function() { // Update entity method()
		this.tick = new Date().getTime();
		
		if (this.x >= 490 || this.x < 10) {
			this.vx *= -1;
		}
		if (this.y >= 490 || this.y < 10) {
			this.vy *= -1;
		}
		
		this.x += this.vx;
		this.y += this.vy;
	}
}