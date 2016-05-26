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
				c.isAdult();
				resolve(true)
			});

			isAdultPromise.then(function(result) {
			 	console.log("Count: " + c.wordCount);
			 	if(c.level == 0){
			 		res.json({
						isAdult: false
					});
			 	} else {
			 		var microsoftApi = 'https://api.projectoxford.ai/vision/v1.0/analyze?visualFeatures=Adult';
					var key = '79489219d20c4fd39fc50f0ba5e1572e'
					var imageUrl = "" //image url to send to microsoft

					if(c.absoluteLinks.length > 0) {
						console.log('1');
						imageUrl = c.absoluteLinks[Math.round((c.absoluteLinks.length - 1) / 2)];
					} else if(c.relativeLinks.length > 0) {
						console.log('2');
						imageUrl = url + c.relativeLinks[Math.round((c.relativeLinks.length - 1) / 2)];
					} else {
						console.log('3');
						res.json({
							isAdult: 'suspicious'
						});
					}
					console.log(imageUrl);
					var microsoftPromise = axios.post(microsoftApi,
						{
							'url': imageUrl
						},
						{
							headers: {
								'Ocp-Apim-Subscription-Key': key,
								'Content-Type': 'application/json',
							}
						}
					)
					microsoftPromise.then(function(response) {
						console.log(response.data);
						if(response.data.adult.adultScore > 0.5) {
							isAdult = true;
						} else {
							isAdult = false;
						}
						res.json({
							isAdult: isAdult,
							score: response.data.adult.adultScore
						});
					})
					microsoftPromise.catch(function(response) {
						console.log('error' + response.data);
						res.json({
							isAdult: 'error'
						});
					});
			 	}
			}, function(err) {
			 	console.log(err);
			});
		})
		.catch(function(response) {
			console.log('error: ' + response);
		});
});

module.exports = router;