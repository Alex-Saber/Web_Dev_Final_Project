require("dotenv").config();
var mongoose = require("mongoose");
mongoose.connect("mongodb://@ds135233.mlab.com:35233/heroku_0pbn2hkz");
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

app.listen(process.env.PORT || 3000, err => {
  if (err) {
    throw err;
  }
  console.log("Node Server running on port: " + port);
});

app.get("/", (err, res) => {
  res.render("index.html");
});

app.post("/user/login", (request, response) => {
  console.log("POST /");
  console.log(request.body);

  let username = request.body.username;
  let password = request.body.password;

  MongoClient.connect(
    "mongodb://@ds135233.mlab.com:35233/heroku_0pbn2hkz",
    { useUnifiedTopology: true },
    function(err, db) {
      db.db("atac").collection("users", function(err, collection) {
        collection.findOne({ username: request.body.username }, function(
          err,
          result
        ) {
          if (result !== null && result.password === password) {
            global_username = username;
            console.log(result);
            response.send(result);
          }

          console.log(global_username);

          db.close();
        });
      });
    }
  );
});

app.post("/user/logout", (request, response) => {
  console.log("POST /");
  console.log(request.body);
  global_username = null;
  response.send({ Status: "Success" });
});

app.post("/user/create", (request, response) => {
  console.log("POST /");
  console.log(request.body);

  let username = request.body.username;
  let password = request.body.password;
  let name = request.body.name;
  let email = request.body.email;

  let newDoc = {
    username: username,
    password: password,
    name: name,
    email: email,
    user_activity: []
  };

  MongoClient.connect(
    "mongodb://@ds135233.mlab.com:35233/heroku_0pbn2hkz",
    { useUnifiedTopology: true },
    function(err, db) {
      db.db("atac").collection("users", function(err, collection) {
        collection.insertOne(newDoc, function(err, result) {
          global_username = username;

          console.log(result);

          response.send(newDoc);

          db.close();
        });
      });
    }
  );
});

app.post("/user/update/score", (request, response) => {
  console.log("POST /");
  console.log(request.body);

  let user_activity = request.body;

  console.log(user_activity);
  MongoClient.connect(
    "mongodb://@ds135233.mlab.com:35233/heroku_0pbn2hkz",
    { useUnifiedTopology: true },
    function(err, db) {
      db.db("atac").collection("users", function(err, collection) {
        collection.updateOne(
          { username: global_username },
          { $addToSet: { user_activity: user_activity } },

          function() {
            response.send({ Success: "Updated user activity" });

            db.close();
          }
        );
      });
    }
  );
});

app.post("/update/scoreboards", (request, response) => {
  console.log("POST /");
  console.log(request.body);

  let user_activity = request.body;

  if (global_username !== null) {
    user_activity.Username = global_username;
  } else {
    user_activity.Username = "Anonymous";
  }

  console.log(user_activity);
  MongoClient.connect(
    "mongodb://@ds135233.mlab.com:35233/heroku_0pbn2hkz",
    { useUnifiedTopology: true },
    function(err, db) {
      db.db("atac").collection("activities", function(err, collection) {
        collection.insertOne(user_activity, function() {
          response.send({ Success: "Updated user activities" });
          db.close();
        });
      });
    }
  );
});

app.post("/user", (request, response) => {
  console.log("POST /");
  console.log(request.body);

  let username = request.body.username;

  MongoClient.connect(
    "mongodb://@ds135233.mlab.com:35233/heroku_0pbn2hkz",
    { useUnifiedTopology: true },
    function(err, db) {
      db.db("atac").collection("users", function(err, collection) {
        collection.findOne({ username: username }, function(err, user_info) {
          response.send(user_info);
          db.close();
        });
      });
    }
  );
});

app.get("/activities/:game", (request, response) => {
  console.log("GET /");

  MongoClient.connect(
    "mongodb://@ds135233.mlab.com:35233/heroku_0pbn2hkz",
    { useUnifiedTopology: true },
    function(err, db) {
      /*db.db("atac").collection("activities", function(err, collection) {
        if (err) response.send(err);
        collection
          .aggregate([
            { $match: { Game: request.params.game } },
            { $group: { Username: "$name", Score: { $max: "$amount" } } }
          ])
          .toArray(function(err, data) {
            console.log(data);
            response.json(data);
            db.close();
          });
        .then(data => {
            response.json(data);
          });
      });*/
      db.db("atac").collection("activities", function(err, collection) {
        collection
          .find({ Game: request.params.game })
          .sort({ Score: -1 })
          .toArray(function(err, data) {
            console.log(data);
            response.send(data);
            db.close();
          });
      });

      //db.close();
    }
  );
});

app.listen(port);
("module.exports = app;");
