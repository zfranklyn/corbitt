var express = require('express');
var router = express.Router();
var db = require('../db.js');
var misc = require('../misc.js').misc;

/* GET home page. */
router.get('/', function(req, res, next) {
	res.sendStatus(200);
});




router.post('/', function(req, res, next) {
	console.log("posted");
  res.send('respond with a resource');
});

module.exports = router;
