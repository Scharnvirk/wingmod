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

        self.zcache['./assets/particle.png'] = fs.readFileSync('./assets/particle.png');
        self.zcache['./assets/perlin-512.png'] = fs.readFileSync('./assets/perlin-512.png');

		self.zcache['/lib/three.js'] = fs.readFileSync('./lib/three.js');
		self.zcache['/lib/stats.min.js'] = fs.readFileSync('./lib/stats.min.js');
		self.zcache['/lib/threex.loop.js'] = fs.readFileSync('./lib/threex.loop.js');
		self.zcache['/lib/utils/polyfills.js'] = fs.readFileSync('./lib/utils/polyfills.js');
        self.zcache['/lib/p2.min.js'] = fs.readFileSync('./lib/p2.min.js');
        self.zcache['/lib/GPUParticleSystem.js'] = fs.readFileSync('./lib/GPUParticleSystem.js');

        self.zcache['/models/ship.json'] = fs.readFileSync('./models/ship.json');
        self.zcache['/models/ravier.json'] = fs.readFileSync('./models/ravier.json');

        self.zcache['/dist/logicInit.min.js'] = fs.readFileSync('./dist/logicInit.min.js');
        self.zcache['/dist/logic.min.js'] = fs.readFileSync('./dist/logic.min.js');
        self.zcache['/dist/renderer.min.js'] = fs.readFileSync('./dist/renderer.min.js');


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


        self.routes['/assets/particle.png'] = function(req, res) {res.send(self.cache_get('/assets/particle.png') );};
        self.routes['/assets/perlin-512.png'] = function(req, res) {res.send(self.cache_get('/assets/perlin-512.png') );};

		self.routes['/lib/three.js'] = function(req, res) {res.send(self.cache_get('/lib/three.js') );};
		self.routes['/lib/stats.min.js'] = function(req, res) {res.send(self.cache_get('/lib/stats.min.js') );};
		self.routes['/lib/threex.loop.js'] = function(req, res) {res.send(self.cache_get('/lib/threex.loop.js') );};
		self.routes['/lib/utils/polyfills.js'] = function(req, res) {res.send(self.cache_get('/lib/utils/polyfills.js') );};
        self.routes['/lib/p2.min.js'] = function(req, res) {res.send(self.cache_get('/lib/p2.min.js') );};
        self.routes['/lib/GPUParticleSystem.js'] = function(req, res) {res.send(self.cache_get('/lib/GPUParticleSystem.js') );};

        self.routes['/models/ship.json'] = function(req, res) {res.send(self.cache_get('/models/ship.json') );};
        self.routes['/models/ravier.json'] = function(req, res) {res.send(self.cache_get('/models/ravier.json') );};

		self.routes['/dist/logicInit.min.js'] = function(req, res) {res.send(self.cache_get('/dist/logicInit.min.js') );};
        self.routes['/dist/logic.min.js'] = function(req, res) {res.send(self.cache_get('/dist/logic.min.js') );};
        self.routes['/dist/renderer.min.js'] = function(req, res) {res.send(self.cache_get('/dist/renderer.min.js') );};
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
