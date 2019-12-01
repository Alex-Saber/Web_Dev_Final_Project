const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const port = 3000;
const helmet = require('helmet');
const fs = require('fs');
var MongoClient = require('mongodb').MongoClient;

app.use(helmet());
app.use(helmet.noSniff());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/resources'));
app.use(express.static(__dirname + '/resources/html'));

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
	next();
});

//pre-flight requests
app.options('*', function(req, res) {
	res.send(200);
});

server.listen(port, (err) => {
	if (err) {
		throw err;
	}
	console.log('Node Server running on port: ' + port);
});

module.exports = server;

app.get('/', (err, res) => {

	res.render('index.html');
});

app.post('/user/login', (request, response) => {
	console.log('POST /');
	console.log(request.body);

	let username = request.body.username;
	let password = request.body.password;

    MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function (err, db) {

        db.db("atac").collection("users", function (err, collection) {

        	collection.findOne({"username": request.body.username}, function(err, result) {

        		console.log(result);

				response.send(result);

				db.close();
	    	});
		});
    });
});


app.post('/user/create', (request, response) => {
	console.log('POST /')
	console.log(request.body)

	let username = request.body.username;
	let password = request.body.password;
	let name = request.body.name;
	let email = request.body.email;

	let newDoc = {"username": username,
				  "password": password,
		          "name": name,
		          "email": email,
	              "user_activity": []};


    MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function (err, db) {

        db.db("atac").collection("users", function (err, collection) {

        	collection.insertOne(newDoc, function(err, result) {

        		console.log(result);

				response.send(newDoc);

				db.close();
	    	});
		});
    });
});

app.post('/user/update/score', (request, response) => {
	console.log('POST /');
	console.log(request.body);

	let username = request.body.username;
	let password = request.body.password;
	let name = request.body.name;
	let email = request.body.email;

	let newDoc = {"username": username,
				  "password": password,
		          "name": name,
		          "email": email,
	              "user_activity": []};


    MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function (err, db) {

        db.db("atac").collection("users", function (err, collection) {

        	collection.insertOne(newDoc, function(err, result) {

        		console.log(result);

				response.send(newDoc);

				db.close();
	    	});
		});
    });
});