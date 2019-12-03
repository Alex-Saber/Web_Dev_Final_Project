const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const helmet = require("helmet");
const fs = require("fs");
var MongoClient = require("mongodb").MongoClient;

let global_username = null;

app.use(helmet());
app.use(helmet.noSniff());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + "/resources"));
app.use(express.static(__dirname + "/resources/html"));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept"
  );
  next();
});

//pre-flight requests
app.options("*", function(req, res) {
  res.send(200);
});

app.listen(3000, err => {
  if (err) {
    throw err;
  }
  console.log("Node Server running on port: " + port);
});

app.get("/", (err, res) => {
  res.render("index.html");
});


app.post('/user/login', (request, response) => {
	console.log('POST /');
	console.log(request.body);

	let username = request.body.username;
	let password = request.body.password;

    MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function (err, db) {

        db.db("atac").collection("users", function (err, collection) {

        	collection.findOne({"username": request.body.username}, function(err, result) {

        	    if (result !== null && result.password === password) {
        	        global_username = username;
                    console.log(result);
                    response.send(result);
                }

                console.log(global_username);

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

        	    global_username = username;

        		console.log(result);

				response.send(newDoc);

				db.close();
	    	});
		});
    });
});

app.post("/user/update/score", (request, response) => {
    console.log("POST /");
    console.log(request.body);

    let user_activity = request.body.user_activity;

    console.log(user_activity);
    MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function(err, db) {

        db.db("atac").collection("users", function(err, collection) {
            collection.updateOne({"username": global_username}, {$addToSet: {"user_activity": user_activity}},

                function() {
                 response.send({"Success":"Updated user activity"});

                 db.close();
            });
        });
    });
});

app.post("/user", (request, response) => {
    console.log("POST /");
    console.log(request.body);

    let username = request.body.username;

    MongoClient.connect("mongodb://localhost:27017", {useUnifiedTopology: true}, function(err, db) {

        db.db("atac").collection("users", function(err, collection) {
            collection.findOne({"username": username},
                function(err, user_info) {
                 response.send(user_info);
                 db.close();
            });
        });
    });
});

