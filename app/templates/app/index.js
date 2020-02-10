'use strict';

// Define Global Keys
require('dotenv').config();
require('./global-keys');

// Dependencies
const express = require('express');
const kraken = require('kraken-js');
<% if (isCorsEnable) { %> 
const cors = require('cors');
<% } %>
<% if (isCustomizeResponseAppenderEnable) { %> 
const customResponseMethodAppender = require('customize-response-appender')({
    reponsesConfigFilePath: '/app/config/responses-config.js',
});
<% } %>
const app = express();

/*
 * Kraken-js Configurations
 */
const options = {
    onconfig: function (config, next) {
        next(null, config);
    }
};
app.use(kraken(options));

// <<<<<---------------MIDDLEWARES------------------------>>>>> 
// For custom configuration you just have to pass false as a prameter and update config file accordingly
<% if (isCorsEnable) { %> 
app.use(cors(require(`${global.paths.config}/cors-options`)()));
<% } %>

<% if (isCustomizeResponseAppenderEnable) { %> 
app.all('*', customResponseMethodAppender);
<% } %>
// <<<<<--------------------------------------->>>>> 


app.on('start', function () {
    global.kraken = app.kraken;
    global.log.info('Application ready to serve requests.');
    global.log.info('Environment: %s', app.kraken.get('env:env'));
});

module.exports = app;
