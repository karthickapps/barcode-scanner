var express = require('express');
var bodyParser = require('body-parser')

var app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

var scannerController = require("./server/scanner");

app.post("/barcode",function(req, res){
	req.connection.setTimeout(600000);

	scannerController.scan(req.body.scanId, function(result){
		res.status = 200;
		return res.json({error:null, message: result});
	});
});

app.listen("3000");

console.log("Server running in 3000");

process.on('uncaughtException', function(err){
	console.log("Exception", err);
});