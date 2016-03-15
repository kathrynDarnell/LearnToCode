/*eslint-env node*/

var express = require('express'),
	cfenv = require('cfenv'),
	app = express(),
	Cloudant = require('cloudant'),
	appEnv = cfenv.getAppEnv(),
	cloudant = Cloudant("https://78cfae91-2492-4226-98bc-a10cfd059aa0-bluemix:b413b028d3c69546d9e15a92ad2ecf8e72ad7127d85bff83d23ac3bb1d19c28b@78cfae91-2492-4226-98bc-a10cfd059aa0-bluemix.cloudant.com"),
	data = cloudant.use('chat'),
	feed = data.follow({since: "now", include_docs: true}),
	bodyParser = require("body-parser");
	
	
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var io = require('socket.io').listen(app.listen(appEnv.port, '0.0.0.0', function() {
  console.log("server starting on " + appEnv.url);
}));


io.sockets.on('connection', function (socket) {
    socket.emit('message', { message: 'You just joined the chat!' });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});


feed.on('change', function (change) {
	io.sockets.emit('message', {message: change.doc['user'] + ": " + change.doc['message']});

})
feed.follow();


app.post("/sendAndSave", function(req,res,next){
	var username = req.body.username;
	var message = req.body.message;
	var date = new Date();
	data.insert({ "user": username, "message": message, 'time': date});
});


app.get("/upToDateMessages", function(req,res,next){
	data.find({selector:
		{"time": {"$gt": null}},
		"sort": [{"time": "asc"}]
        }, function(er, result) {
			res.send(result);		
	});
	
});