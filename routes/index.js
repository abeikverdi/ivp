var express = require('express');
var router = express.Router();
var request = require('request');
var axios = require('axios');
var cheerio = require('cheerio');
var content = require('../content')

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'IVP' });
});

router.post('/', function(req, res, next) {
	var url = req.body.url;
	axios.get(url)
		.then(function(response) {
			// imageProcessing();

			var c = new content();
			c.data = cheerio.load(response.data);
			var isAdult;
			var isAdultPromise = new Promise(function(resolve, reject) {
				isAdult = c.isAdult();
				resolve(true)
			});

			isAdultPromise.then(function(result) {
			 	console.log("Count: " + c.wordCount);
			 	console.log("relativeLinks: " + c.relativeLinks);
				console.log("absoluteLinks: " + c.absoluteLinks);
				// imageProcessing();
			}, function(err) {
			 	console.log(err);
			});

			res.json({
				data: response.data,
				isAdult: isAdult
			});
		})
		.catch(function(response) {
			console.log('error: ' + response);
		});
});

function imageProcessing() {
	var microsoftApi = 'https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Adult ';
	var key = '79489219d20c4fd39fc50f0ba5e1572e'

	axios.post(microsoftApi,
		{
			'url':'http://cdn.freepornpics.net/thumbs/group-4454.jpg'
		},
		{
			headers: {
				'Ocp-Apim-Subscription-Key': key,
				'Content-Type': 'application/json',
			}
		}
	)
	.then(function(response) {
			console.log(response.data);
		})
	.catch(function(response) {
		console.log('error' + response.data);
	})
}

function findStringInHTMLBody($, stringToFind) {
	var strBody = $('html > body').text();
	if(strBody.toLowerCase().indexOf(stringToFind.toLowerCase()) !== -1) {
		return true;
  	}
	return false;
}

module.exports = router;