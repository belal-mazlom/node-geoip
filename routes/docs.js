var express = require('express');
var router = express.Router();
var rekuire = require('rekuire');
var fs = require('fs');
var marked = require('marked');
var logger = rekuire('appConfig.js').logger;
var redisClient = rekuire('appConfig.js').redisClient;
var cache_key = 'documentation';


module.exports = function (req, res) {
    var getTheDocsAsMarkdown = function (callback) {
        fs.readFile('./views/docs.txt', 'utf8', function (err, data) {

            if (err) return logger.error(err, {type: 'error'});

            var markdown = marked(data);

            console.log(markdown);

            callback(markdown);

        });
    };

    if (redisClient.connected) {

        redisClient.get(cache_key, function (err, reply) {

            if (err) return logger.error(err, {type: 'error'});

            // console.log(reply);

            if (reply) {

                console.log('>>>>> CACHED');

                res.render('docs', {title: 'Cities | Documentation', md: reply});

            } else {

                console.log('<<<<< NOT CACHED');

                getTheDocsAsMarkdown(function (docs) {

                    redisClient.set(cache_key, docs);
                    if (redisClient.expiryTime) {
                        redisClient.expire(cache_key, redisClient.expiryTime);
                    }

                    res.render('docs', {title: 'Cities | Documentation', md: docs});
                });
            }

        });

    } else {

        console.log('xxxxx REDIS DISCONNECTED');

        getTheDocsAsMarkdown(function (docs) {
            res.render('docs', {title: 'Cities | Documentation', md: docs});
        });

    }
};
