var express = require('express');
var dotenv = require('dotenv');
var bodyParser = require('body-parser')

var fs = require('fs');
var formidable = require('formidable');

dotenv.config();

var app = express();
var port = 3000;

app.use(bodyParser.json({limit: '50mb', extended: true}))

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

	console.log('Save ' + new Date() )

	fs.writeFileSync(__dirname + '/data/' + req.body.name + '.json', JSON.stringify(req.body));

	res.status(200).send({status: 'ok'})

})

app.post('/api/upload', function(req, res) {

	var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

		console.log("fields", fields);
		console.log("files", files);

	  var dir = __dirname + '/public/content/spaces/' + fields['spaceId']
      var link = '/content/spaces/' + fields['spaceId']+ '/' + files['image'].name;

      var oldpath = files['image'].path;
      var newpath = __dirname + '/public' + link;

      if (!fs.existsSync(dir)){
	     fs.mkdirSync(dir);
	   }

      fs.rename(oldpath, newpath, function (err) {
        if (err) throw err;
        res.json({source: link});
        res.end();
      });

  	});

})

app.use('/', function(req, res) { 

	res.sendFile(`${__dirname}/public/index.html`)

});


app.listen(port, function () {
  console.info('listening on %d', port);
});