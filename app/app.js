const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const port = 3000;
const helmet = require('helmet');
const fs = require('fs');



app.use(helmet());
app.use(helmet.noSniff());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
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


app.post('/user/create', (req, res) => {
    // console.log(req.body);

	MongoClient.connect("mongodb://localhost:27017/atac", function (err, db) {

        db.collection('users', function (err, collection) {

            collection.insert({req.b: })

        });

    });

    // return;
});

var MongoClient = require('mongodb').MongoClient;
app.post('/user/login', (err, res) => {

});
