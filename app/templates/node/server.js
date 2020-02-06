'use strict';

const app = require('./index');
const http = require('http');

<% if (db == 'mongoose') { %>

    const mongoose = require('mongoose');
    const mongoString = require(`${global.paths.config}/database.json`).url;
    mongoose.Promise = require('bluebird');

    const mongoLogger = function (coll, method, query, doc) {
        global.log.debug(`${coll}.${method}(${JSON.stringify(query)}, ${JSON.stringify(doc)})`);
    };

    mongoose.set('debug', mongoLogger);

    mongoose.connect(mongoString, function (error) {
        if (error) {
            global.log.error(error);
        } else {
            global.log.info('Connected to MongoDB');
        }
    });

<% } %>

const server = http.Server(app);
server.listen(process.env.PORT);

server.on('listening', function () {
    global.log.info(`Server listening on http://localhost:${this.address().port}`);
});

