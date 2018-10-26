var express = require('express');
var router = express.Router();
var maxmind = require('maxmind');
var xml = require('xml');
var morgan = require('morgan');
var rekuire = require('rekuire');
var configs = rekuire('appConfig.js');
var IPTable = configs.IPTable;
var redisClient = configs.redisClient;
var logger = configs.logger;

module.exports = function (req, res) {
    var AramexCountry = rekuire('aramexCountry');

    var collection 	= req.params.collection;


    if (!collection) {
        res.json(api_info);
        return;
    }

    if(collection == 'lookup'){
        if (req.query.ip != undefined) {
            var format = 'json';

            if (req.query.format != undefined && req.query.format.toLowerCase() == "xml") {
                format = 'xml';
            }

            if (redisClient.connected) {
                var cache_key = 'api:lookup:' + req.query.ip + format;

                redisClient.get(cache_key, function (err, reply) {
                    if (err) return logger.error(err, {type: 'error'});

                    if (reply) {
                        if (format == 'xml') {
                            res.set('Content-Type', 'text/xml');
                        } else {
                            res.set('Content-Type', 'application/json');
                        }
                        res.send(reply);
                    } else {
                        getCountryByIP(req.query.ip, function (result, status) {
                            formatResult(res, result, status, format, cache_key, redisClient);
                        });
                    }
                });

                return;
            } else {
                getCountryByIP(req.query.ip, function (result, status) {
                    formatResult(res, result, status, format);
                });
                return;
            }
        }

        res.send('Missing params');
    }

    function getCountryByIP(ip, callback) {
        var orgLookup = maxmind.open(IPTable);
        var IPResult = orgLookup.get(ip);
        if (IPResult) {
            if (IPResult && IPResult.country && IPResult.country.iso_code) {
                var countryCode = IPResult.country.iso_code;
                AramexCountry.find({'countryCode': countryCode}, function (err, docs) {
                    if (docs && docs.length > 0) {
                        var result = {
                            'countryCode': docs[0].countryCode,
                            'en': docs[0].nameEn,
                            'ar': docs[0].nameAr
                        };
                        callback(result, 1);
                    }else{
                        callback('Not result found', 0);
                    }
                });
            }
        } else {
            callback('Can\'t find result', 0);
        }
    }

    function convertToXML(object) {
        var array = [];

        for (k in object) {
            var obj = {};
            obj[k] = object[k];
            array.push(obj);
        }

        return xml({
            result: array
        });
    }

    function formatResult(response, result, status, format, cache_key, redisClient) {
        //Result found
        if (status) {
            if (format == "json") {
                response.set('Content-Type', 'application/json');
                result = JSON.stringify(result);
            } else {
                response.set('Content-Type', 'text/xml');
                result = convertToXML(result);
            }

            if (cache_key) {
                redisClient.set(cache_key, result);
                if (redisClient.expiryTime) {
                    redisClient.expire(cache_key, redisClient.expiryTime);
                }
            }
        }

        response.send(result);
    }

    return router;
};
