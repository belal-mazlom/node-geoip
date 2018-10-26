/**
 * Created by belalmazlom on 6/23/16.
 */

//////////////////////////////////////////////////////////////////////////////////////////////////
/// Main config for App //////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////

var options = {
    // Set to 'true' to enable the experimental Rates functionality.
    enableRates: false,

    // Set to 'true' to limit the app to only serve the API, the homepage, and the docs page.
    // Check 'routes.js' for what's enabled and what's not.
    apiOnlyMode: true,

    // Used in Jade templates to choose which version of the resources to serve.
    useUglifiedJS: true,
    useMinifiedCSS: true,

    // Set to true to enable Livereload.
    enableLivereload: false,

    // Set to true to enable the autocomplete functionality of the API
    // for non-MENA countries. Disabled by default to decrease the load
    // on the system.
    enableAutocompleteForNonMENA: false
};

//////////////////////////////////////////////////////////////////////////////////////////////////
/// Winston Logs /////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

var winston = require('winston');
winston.emitErrs = true;

var logger  = new winston.Logger({
    transports: [
        new winston.transports.File(
            {
                level: 'info',
                //Relative to '/app.js'?
                filename: 'logs/winston_logs/info.log',
                // handleExceptions: true,
                json: true,
                maxsize: 5242880,
                // maxFiles: 10,
                colorize: false
            }
        ),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exceptionHandlers: [
        new winston.transports.File({filename: 'logs/winston_logs/exceptions.log'})
    ],
    exitOnError: false
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message, {type: 'morgan'});
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////
/// MongoDB //////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

var dbConfig = {

    // // Structure: 'mongodb://host:port/db'
    'uri': 'mongodb://127.0.0.1:27017/cities',
    // Comment the 'options' object out to log in without authentication.
    'options': {
        'user': 'cities',
        'pass': '',
        'auth': {
            // This is the authentication DB, not the one you wish to operate on.
            'authdb': 'admin'
        }
    }
};



//////////////////////////////////////////////////////////////////////////////////////////////////
/// Redis ////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

var redis = require('redis');
var redisClient = redis.createClient(6379, '127.0.0.1');

redisClient.on('error', function(err) {
    logger.error(err, {type: 'error'});
});


// Set to 'null' for unlimited lifetime.
redisClient.expiryTime = 3600 * 3; // One Hour * no. of hours


//////////////////////////////////////////////////////////////////////////////////////////////////
/// IP Country DB ////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

var IPTable = 'geo_database/GeoLite2-City-22-06.mmdb';



module.exports = {
    logger: 		logger,
    dbConfig: 		dbConfig,
    redisClient: 	redisClient,
    options: 		options,
    IPTable: IPTable
};
