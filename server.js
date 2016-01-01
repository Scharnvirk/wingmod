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
        };
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
		
		self.zcache['/lib/three.js'] = fs.readFileSync('./lib/three.js');
		self.zcache['/lib/stats.min.js'] = fs.readFileSync('./lib/stats.min.js');
		self.zcache['/lib/threex.loop.js'] = fs.readFileSync('./lib/threex.loop.js');
		self.zcache['/lib/utils/polyfills.js'] = fs.readFileSync('./lib/utils/polyfills.js');
		
		self.zcache['/dist/babelified/Controls.js'] = fs.readFileSync('./dist/babelified/Controls.js');
		self.zcache['/dist/babelified/Core.js'] = fs.readFileSync('./dist/babelified/Core.js');
		self.zcache['/dist/babelified/Init.js'] = fs.readFileSync('./dist/babelified/Init.js');
		self.zcache['/dist/babelified/GameLoop.js'] = fs.readFileSync('./dist/babelified/GameLoop.js');
		self.zcache['/dist/babelified/Utils.js'] = fs.readFileSync('./dist/babelified/Utils.js');
		self.zcache['/dist/babelified/Camera.js'] = fs.readFileSync('./dist/babelified/Camera.js');
		
		self.zcache['/dist/babelified/modelRepo/ModelLoader.js'] = fs.readFileSync('./dist/babelified/modelRepo/ModelLoader.js');
		self.zcache['/dist/babelified/modelRepo/ModelList.js'] = fs.readFileSync('./dist/babelified/modelRepo/ModelList.js');
		self.zcache['/dist/babelified/modelRepo/ModelStore.js'] = fs.readFileSync('./dist/babelified/modelRepo/ModelStore.js');
		
		self.zcache['/dist/babelified/scene/GameScene.js'] = fs.readFileSync('./dist/babelified/scene/GameScene.js');
		
		self.zcache['/dist/babelified/actor/BaseActor.js'] = fs.readFileSync('./dist/babelified/actor/BaseActor.js');
		self.zcache['/dist/babelified/actor/MapLightActor.js'] = fs.readFileSync('./dist/babelified/actor/MapLightActor.js');
		self.zcache['/dist/babelified/actor/PlayerActor.js'] = fs.readFileSync('./dist/babelified/actor/PlayerActor.js');
		self.zcache['/dist/babelified/actor/MookActor.js'] = fs.readFileSync('./dist/babelified/actor/MookActor.js');
		
		self.zcache['/dist/babelified/actor/mesh/BaseMesh.js'] = fs.readFileSync('./dist/babelified/actor/mesh/BaseMesh.js');
		self.zcache['/dist/babelified/actor/mesh/SphereMesh.js'] = fs.readFileSync('./dist/babelified/actor/mesh/SphereMesh.js');
		self.zcache['/dist/babelified/actor/mesh/ShipMesh.js'] = fs.readFileSync('./dist/babelified/actor/mesh/ShipMesh.js');
		
		self.zcache['/dist/babelified/actor/controls/OctaControls.js'] = fs.readFileSync('./dist/babelified/actor/controls/OctaControls.js');
		
		self.zcache['/dist/babelified/actor/manager/Manager.js'] = fs.readFileSync('./dist/babelified/actor/manager/Manager.js');
		self.zcache['/dist/babelified/actor/manager/MapLightManager.js'] = fs.readFileSync('./dist/babelified/actor/manager/MapLightManager.js');
		
		self.zcache['/dist/babelified/actor/physics/BasePhysics.js'] = fs.readFileSync('./dist/babelified/actor/physics/BasePhysics.js');
		
		self.zcache['/dist/babelified/actor/light/BaseLight.js'] = fs.readFileSync('./dist/babelified/actor/light/BaseLight.js');
		self.zcache['/dist/babelified/actor/light/PointLight.js'] = fs.readFileSync('./dist/babelified/actor/light/PointLight.js');
		self.zcache['/dist/babelified/actor/light/MapPointLight.js'] = fs.readFileSync('./dist/babelified/actor/light/MapPointLight.js');
		
		self.zcache['/dist/babelified/objectPool/BaseObjectPool.js'] = fs.readFileSync('./dist/babelified/objectPool/BaseObjectPool.js');
		self.zcache['/dist/babelified/objectPool/LightPool.js'] = fs.readFileSync('./dist/babelified/objectPool/LightPool.js');
		
		self.zcache['/models/ship.json'] = fs.readFileSync('./models/ship.json');
		
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
		
		self.routes['/lib/three.js'] = function(req, res) {res.send(self.cache_get('/lib/three.js') );};
		self.routes['/lib/stats.min.js'] = function(req, res) {res.send(self.cache_get('/lib/stats.min.js') );};
		self.routes['/lib/threex.loop.js'] = function(req, res) {res.send(self.cache_get('/lib/threex.loop.js') );};
		self.routes['/lib/utils/polyfills.js'] = function(req, res) {res.send(self.cache_get('/lib/utils/polyfills.js') );};
		
		self.routes['/dist/babelified/Controls.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/Controls.js') );};
		self.routes['/dist/babelified/Core.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/Core.js') );};
		self.routes['/dist/babelified/Init.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/Init.js') );};
		self.routes['/dist/babelified/GameLoop.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/GameLoop.js') );};
		self.routes['/dist/babelified/Utils.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/Utils.js') );};
		self.routes['/dist/babelified/Camera.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/Camera.js') );};
		
		self.routes['/dist/babelified/modelRepo/ModelLoader.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/modelRepo/ModelLoader.js') );};
		self.routes['/dist/babelified/modelRepo/ModelList.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/modelRepo/ModelList.js') );};
		self.routes['/dist/babelified/modelRepo/ModelStore.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/modelRepo/ModelStore.js') );};
		
		self.routes['/dist/babelified/scene/GameScene.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/scene/GameScene.js') );};
		
		self.routes['/dist/babelified/actor/BaseActor.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/BaseActor.js') );};
		self.routes['/dist/babelified/actor/MapLightActor.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/MapLightActor.js') );};
		self.routes['/dist/babelified/actor/PlayerActor.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/PlayerActor.js') );};
		self.routes['/dist/babelified/actor/MookActor.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/MookActor.js') );};
		
		self.routes['/dist/babelified/actor/mesh/BaseMesh.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/mesh/BaseMesh.js') );};
		self.routes['/dist/babelified/actor/mesh/SphereMesh.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/mesh/SphereMesh.js') );};
		self.routes['/dist/babelified/actor/mesh/ShipMesh.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/mesh/ShipMesh.js') );};
		
		self.routes['/dist/babelified/actor/controls/OctaControls.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/controls/OctaControls.js') );};
		
		self.routes['/dist/babelified/actor/manager/Manager.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/manager/Manager.js') );};
		self.routes['/dist/babelified/actor/manager/MapLightManager.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/manager/MapLightManager.js') );};
		
		self.routes['/dist/babelified/actor/physics/BasePhysics.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/physics/BasePhysics.js') );};
		
		self.routes['/dist/babelified/actor/light/BaseLight.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/light/BaseLight.js') );};
		self.routes['/dist/babelified/actor/light/PointLight.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/light/PointLight.js') );};
		self.routes['/dist/babelified/actor/light/MapPointLight.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/actor/light/MapPointLight.js') );};
		
		self.routes['/dist/babelified/objectPool/BaseObjectPool.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/objectPool/BaseObjectPool.js') );};
		self.routes['/dist/babelified/objectPool/LightPool.js'] = function(req, res) {res.send(self.cache_get('/dist/babelified/objectPool/LightPool.js') );};
		
		self.routes['/models/ship.json'] = function(req, res) {res.send(self.cache_get('/models/ship.json') );};
		
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

