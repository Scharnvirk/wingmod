#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var path	= require('path');


/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
        self.zcache['/styles.css'] = fs.readFileSync('./styles.css');

        self.zcache['/fonts/Oswald-Regular.ttf'] = fs.readFileSync('./fonts/Oswald-Regular.ttf');

		self.zcache['/lib/three73.js'] = fs.readFileSync('./lib/three73.js');
        self.zcache['/lib/react.js'] = fs.readFileSync('./lib/react.js');
        self.zcache['/lib/react-dom.js'] = fs.readFileSync('./lib/react-dom.js');
		self.zcache['/lib/stats.min.js'] = fs.readFileSync('./lib/stats.min.js');
        self.zcache['/lib/threex.rendererstats.js'] = fs.readFileSync('./lib/threex.rendererstats.js');
		self.zcache['/lib/threex.loop.js'] = fs.readFileSync('./lib/threex.loop.js');
		self.zcache['/lib/utils/polyfills.js'] = fs.readFileSync('./lib/utils/polyfills.js');
        self.zcache['/lib/p2.js'] = fs.readFileSync('./lib/p2.js');

        self.zcache['/gfx/particle.png'] = fs.readFileSync('./gfx/particle.png');
        self.zcache['/gfx/particleAdd.png'] = fs.readFileSync('./gfx/particleAdd.png');
        self.zcache['/gfx/particleSquareAdd.png'] = fs.readFileSync('./gfx/particleSquareAdd.png');
        self.zcache['/gfx/smokePuffAlpha.png'] = fs.readFileSync('./gfx/smokePuffAlpha.png');
        self.zcache['/models/ship.json'] = fs.readFileSync('./models/ship.json');
        self.zcache['/models/chunk.json'] = fs.readFileSync('./models/chunk.json');
        self.zcache['/models/ravier.json'] = fs.readFileSync('./models/ravier.json');
        self.zcache['/models/ravier.png'] = fs.readFileSync('./models/ravier.png');
        self.zcache['/models/ravier_bump.png'] = fs.readFileSync('./models/ravier_bump.png');
        self.zcache['/models/chunk.png'] = fs.readFileSync('./models/chunk.png');

        self.zcache['/models/levels/chunk_NbExSbWs.json'] = fs.readFileSync('./models/levels/chunk_NbExSbWs.json');
        self.zcache['/models/levels/chunk_NbExSbWs_hitmap.json'] = fs.readFileSync('./models/levels/chunk_NbExSbWs_hitmap.json');
        self.zcache['/models/levels/chunk_NxExSbWx.json'] = fs.readFileSync('./models/levels/chunk_NxExSbWx.json');
        self.zcache['/models/levels/chunk_NxExSbWx_hitmap.json'] = fs.readFileSync('./models/levels/chunk_NxExSbWx_hitmap.json');
        self.zcache['/models/levels/map_256_B.png'] = fs.readFileSync('./models/levels/map_256_B.png');
        self.zcache['/models/levels/map_256.png'] = fs.readFileSync('./models/levels/map_256.png');

        self.zcache['/dist/Init.js'] = fs.readFileSync('./dist/Init.js');
        self.zcache['/dist/LogicInit.js'] = fs.readFileSync('./dist/LogicInit.js');
    };

    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };

        self.routes['/styles.css'] = function(req, res) {
            res.setHeader('Content-Type', 'text/css');
            res.send(self.cache_get('/styles.css') );
        };

        self.routes['/fonts/Oswald-Regular.ttf'] = function(req, res) {res.send(self.cache_get('/fonts/Oswald-Regular.ttf') );};

		self.routes['/lib/three73.js'] = function(req, res) {res.send(self.cache_get('/lib/three73.js') );};
        self.routes['/lib/react.js'] = function(req, res) {res.send(self.cache_get('/lib/react.js') );};
        self.routes['/lib/react-dom.js'] = function(req, res) {res.send(self.cache_get('/lib/react-dom.js') );};
		self.routes['/lib/stats.min.js'] = function(req, res) {res.send(self.cache_get('/lib/stats.min.js') );};
        self.routes['/lib/threex.rendererstats.js'] = function(req, res) {res.send(self.cache_get('/lib/threex.rendererstats.js') );};
		self.routes['/lib/threex.loop.js'] = function(req, res) {res.send(self.cache_get('/lib/threex.loop.js') );};
		self.routes['/lib/utils/polyfills.js'] = function(req, res) {res.send(self.cache_get('/lib/utils/polyfills.js') );};
        self.routes['/lib/p2.js'] = function(req, res) {res.send(self.cache_get('/lib/p2.js') );};
        self.routes['/lib/GPUParticleSystem.js'] = function(req, res) {res.send(self.cache_get('/lib/GPUParticleSystem.js') );};

        self.routes['/gfx/particle.png'] = function(req, res) {res.send(self.cache_get('/gfx/particle.png') );};
        self.routes['/gfx/particleAdd.png'] = function(req, res) {res.send(self.cache_get('/gfx/particleAdd.png') );};
        self.routes['/gfx/particleSquareAdd.png'] = function(req, res) {res.send(self.cache_get('/gfx/particleSquareAdd.png') );};
        self.routes['/gfx/smokePuffAlpha.png'] = function(req, res) {res.send(self.cache_get('/gfx/smokePuffAlpha.png') );};
        self.routes['/models/ship.json'] = function(req, res) {res.send(self.cache_get('/models/ship.json') );};
        self.routes['/models/ravier.json'] = function(req, res) {res.send(self.cache_get('/models/ravier.json') );};
        self.routes['/models/ravier.png'] = function(req, res) {res.send(self.cache_get('/models/ravier.png') );};
        self.routes['/models/ravier_bump.png'] = function(req, res) {res.send(self.cache_get('/models/ravier_bump.png') );};
        self.routes['/models/chunk.json'] = function(req, res) {res.send(self.cache_get('/models/chunk.json') );};
        self.routes['/models/chunk.png'] = function(req, res) {res.send(self.cache_get('/models/chunk.png') );};

        self.routes['/models/levels/chunk_NbExSbWs.json'] = function(req, res) {res.send(self.cache_get('/models/levels/chunk_NbExSbWs.json') );};
        self.routes['/models/levels/chunk_NbExSbWs_hitmap.json'] = function(req, res) {res.send(self.cache_get('/models/levels/chunk_NbExSbWs_hitmap.json') );};
        self.routes['/models/levels/chunk_NxExSbWx.json'] = function(req, res) {res.send(self.cache_get('/models/levels/chunk_NxExSbWx.json') );};
        self.routes['/models/levels/chunk_NxExSbWx_hitmap.json'] = function(req, res) {res.send(self.cache_get('/models/levels/chunk_NxExSbWx_hitmap.json') );};
        self.routes['/models/levels/map_256.png'] = function(req, res) {res.send(self.cache_get('/models/levels/map_256.png') );};
        self.routes['/models/levels/map_256_B.png'] = function(req, res) {res.send(self.cache_get('/models/levels/map_256_B.png') );};

		self.routes['/dist/Init.js'] = function(req, res) {res.send(self.cache_get('/dist/Init.js') );};
        self.routes['/dist/LogicInit.js'] = function(req, res) {res.send(self.cache_get('/dist/LogicInit.js') );};
    };



    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express.createServer();

        //  Add handlers for the app (from the routes).
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();
