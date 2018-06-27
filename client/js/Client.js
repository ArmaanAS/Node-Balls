var page = document.getElementById("page");
var ctx = page.getContext("2d");

ctx.font = '30px Arial';

var socket = io();
var connected = false;

var player = {
	uid : null,
	x : null,
	y : null,
	colour : null
}

socket.on(
	'disconnect',
	function(data) {
		console.log("You have been disconnected");
		ctx.clearRect(0, 0, page.width, page.height);
	}
);

socket.on(
	'join', 
	function(p) {
		console.log("You have joined the game.");			
		connected = true;
		
		player.uid = p.uid;
		player.x = p.x;
		player.y = p.y;
		player.colour = p.colour;
	}
);

drawPlayer = function(colour, x, y) {
	ctx.fillStyle = colour;
	
	ctx.beginPath();
	ctx.arc(x, y, 10, 0, 2 * Math.PI);
	ctx.fill();
}

socket.on('updatePlayers', function(data) {
	ctx.clearRect(0, 0, page.width, page.height);
	
	for(var i = 0; i < data.length; i++) {
		var a = data[i];
		
		// Draw yourself in realtime instead of server-time, less lagg
		if (a.uid == player.uid) {
			drawPlayer(player.colour, player.x, player.y);
			continue;
		}
		
		drawPlayer(a.colour, a.x, a.y);
	}
});

var lastMove = new Date().getTime();

document.onmousemove = function(e) {
	if (!connected) return;
	
	player.x = e.pageX - 8,
	player.y = e.pageY - 8;
	
	if (new Date().getTime() - lastMove < 33) return;
	
	lastMove = new Date().getTime();
	
	socket.emit(
		'updatePlayer', 
		{
			uid : player.uid,
			x : player.x,
			y : player.y,
		}
	)
}