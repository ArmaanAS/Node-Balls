var express = require('express');
var app = express();
var serv = require('http').Server(app);

var Entity = require('./server/Entity');
 
app.get('/',function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
});
app.use('/client', express.static(__dirname + '/client'));
 
serv.listen(80); // Listen for Port 2000 (localhost:2000)
console.log("Server started.");
 
var SOCKET_LIST = {};
 
var io = require('socket.io')(serv,{});
io.sockets.on(
	'connection', 
	function(socket) {
		socket.uid = Math.random();
		socket.x = 0;
		socket.y = 15;
		socket.colour = '#ff' + (Math.floor(Math.random() * 10000));
		SOCKET_LIST[socket.uid] = socket;
		console.log("Player connected!");
		
		socket.on(
			'disconnect', 
			function() {
				console.log("Player disconnected!");
				delete SOCKET_LIST[socket.uid];
			}
		);
		
		socket.emit(
			'join', 
			{				
				uid : socket.uid,
				x : socket.x,
				y : socket.y,
				colour : socket.colour
			}
		);
		
		socket.on(
			'updatePlayer',
			function(p) {
				var sock = SOCKET_LIST[p.uid];
				sock.x = p.x;
				sock.y = p.y;
				//updatePlayers();
			}
		);
	}
);

var entities = [];

for (var i = 0; i < 100; i++) {
	entities.push(
		new Entity(
			0, 
			0, 
			Math.random() * 10,//Math.floor(Math.random() * 10 + 1), 
			Math.random() * 10//Math.floor(Math.random() * 10 + 1)
		)
	);
}

updatePlayers = function() {
	var pack = [];
	
	for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        pack.push({
			uid : socket.uid,
            x : socket.x,
            y : socket.y,
			colour : socket.colour
        });
    }
	
	entities.forEach((i) => {
		pack.push({
			uid : i.uid,
            x : i.x,
            y : i.y,
            colour : i.colour
		});
	});
	
    for(var i in SOCKET_LIST){
        var socket = SOCKET_LIST[i];
        socket.emit('updatePlayers', pack);
    }
}

setInterval(function() {
	for (var i in entities) {
		ent = entities[i];

		ent.update();
	}
	
	updatePlayers();
}, 1000 / 30)