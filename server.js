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

app.get('/api/data', function(req, res) {

	try {
		
		var data = JSON.parse(fs.readFileSync(__dirname + '/data/data.json'));

		res.json(data)

	} catch(e) {

		res.status(404).send({status: 'not found'})
		
	}

})

app.post('/api/save', function(req, res) {

	console.log('save', __dirname)

	fs.writeFileSync(__dirname + '/data/data.json', JSON.stringify(req.body));

	res.status(200).send({status: 'ok'})

})

app.use('/', function(req, res) { 

	res.sendFile(`${__dirname}/public/index.html`)

});


app.listen(port, function () {
  console.info('listening on %d', port);
});