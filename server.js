var express = require('express');
var dotenv = require('dotenv');
var bodyParser = require('body-parser')

var fs = require('fs');

dotenv.config();

var app = express();
var port = 3000;

app.use(bodyParser.json())

app.use(express.static('public'));

app.use('/scripts', express.static(`${__dirname}/node_modules/`));

app.get('/api/get-project', function(req, res) {

	try {
		
		var data = JSON.parse(fs.readFileSync(__dirname + '/data/' + req.query.name));

		res.json(data)

	} catch(e) {

		res.status(404).send({status: 'not found'})
		
	}

})

app.get('/api/projects', function(req, res){

	var results = [];

	fs.readdirSync(__dirname + '/data/').forEach(function(file) {

	  if (file !== '.gitkeep') {
	  	results.push(file)
	  }

	});

	res.status(200).send({results: results})

})

app.post('/api/projects', function(req, res){

	console.log('create', req.body);
	
	fs.writeFileSync(__dirname + '/data/' + req.body.name + '.json', JSON.stringify(req.body));

	res.status(200).send({status: 'ok'})

})


app.post('/api/save', function(req, res) {

	console.log('save', __dirname)

	fs.writeFileSync(__dirname + '/data/' + req.body.name + '.json', JSON.stringify(req.body));

	res.status(200).send({status: 'ok'})

})

app.use('/', function(req, res) { 

	res.sendFile(`${__dirname}/public/index.html`)

});


app.listen(port, function () {
  console.info('listening on %d', port);
});