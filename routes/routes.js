/**
 * Created by belalmazlom on 7/3/16.
 */


var express = require('express');
var router = express.Router();
var rekuire = require('rekuire');

var apiOnlyMode = rekuire('appConfig.js').options.apiOnlyMode;

module.exports = function(mongo, mongoose) {
    var api = require('./api');
    var docs = require('./docs');

    router.get('/', function (req, res, next) {
        res.render('index', {title: 'GeoIP by ShopGo'});
    });

    router.get('/api', api);
    router.get('/api/:collection', api);
    router.get('/docs', docs);

    return router;
};