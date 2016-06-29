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


    self.buildVersionHtmlText = function() {
        var version = JSON.parse(fs.readFileSync('./version', 'utf-8'));
        var versionText = version.major + '.' + version.minor + '.' + version.patch + '.' + version.build;

        return "<script>Constants.VERSION = '" + versionText + "'</script>";
    };

    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        var index = fs.readFileSync('./index.html', 'utf-8');
        index += self.buildVersionHtmlText();

        //  Local cache for static content.
        self.zcache['index.html'] = index;


        self.zcache['/styles.css'] = fs.readFileSync('./styles.css');

        self.zcache['/fonts/Oswald-Regular.ttf'] = fs.readFileSync('./fonts/Oswald-Regular.ttf');

		self.zcache['/lib/three77.js'] = fs.readFileSync('./lib/three77.js');
        self.zcache['/lib/soundjs-0.6.2.min.js'] = fs.readFileSync('./lib/soundjs-0.6.2.min.js');
        self.zcache['/lib/react.js'] = fs.readFileSync('./lib/react.js');
        self.zcache['/lib/react-dom.js'] = fs.readFileSync('./lib/react-dom.js');
		self.zcache['/lib/stats.min.js'] = fs.readFileSync('./lib/stats.min.js');
        self.zcache['/lib/threex.rendererstats.js'] = fs.readFileSync('./lib/threex.rendererstats.js');
		self.zcache['/lib/threex.loop.js'] = fs.readFileSync('./lib/threex.loop.js');
		self.zcache['/lib/utils/polyfills.js'] = fs.readFileSync('./lib/utils/polyfills.js');
        self.zcache['/lib/p2.js'] = fs.readFileSync('./lib/p2.js');

        self.zcache['/gfx/particle.png'] = fs.readFileSync('./gfx/particle.png');
        self.zcache['/gfx/particleAdd.png'] = fs.readFileSync('./gfx/particleAdd.png');
        self.zcache['/gfx/shaderSpriteAdd.png'] = fs.readFileSync('./gfx/shaderSpriteAdd.png');
        self.zcache['/gfx/smokePuffAlpha.png'] = fs.readFileSync('./gfx/smokePuffAlpha.png');
        self.zcache['/models/ship.json'] = fs.readFileSync('./models/ship.json');
        self.zcache['/models/chunk.json'] = fs.readFileSync('./models/chunk.json');
        self.zcache['/models/ravier.json'] = fs.readFileSync('./models/ravier.json');
        self.zcache['/models/ravier.png'] = fs.readFileSync('./models/ravier.png');
        self.zcache['/models/ravier_B.png'] = fs.readFileSync('./models/ravier_B.png');
        self.zcache['/models/chunk.png'] = fs.readFileSync('./models/chunk.png');
        self.zcache['/models/drone.json'] = fs.readFileSync('./models/drone.json');
        self.zcache['/models/drone.png'] = fs.readFileSync('./models/drone.png');
        self.zcache['/models/drone_B.png'] = fs.readFileSync('./models/drone_B.png');
        self.zcache['/models/sniper.json'] = fs.readFileSync('./models/sniper.json');
        self.zcache['/models/sniper.png'] = fs.readFileSync('./models/sniper.png');
        self.zcache['/models/sniper_B.png'] = fs.readFileSync('./models/sniper_B.png');
        self.zcache['/models/orbot.json'] = fs.readFileSync('./models/orbot.json');
        self.zcache['/models/orbot.png'] = fs.readFileSync('./models/orbot.png');
        self.zcache['/models/orbot_B.png'] = fs.readFileSync('./models/orbot_B.png');
        self.zcache['/models/telering_B.png'] = fs.readFileSync('./models/telering_B.png');
        self.zcache['/models/telering_I.png'] = fs.readFileSync('./models/telering_I.png');
        self.zcache['/models/telering.png'] = fs.readFileSync('./models/telering.png');
        self.zcache['/models/telering_bottom.json'] = fs.readFileSync('./models/telering_bottom.json');
        self.zcache['/models/telering_top.json'] = fs.readFileSync('./models/telering_top.json');

        self.zcache['/models/levels/chunk_HangarStraight_SideSmall_1.json'] = fs.readFileSync('./models/levels/chunk_HangarStraight_SideSmall_1.json');
        self.zcache['/models/levels/chunk_HangarStraight_SideSmall_1_hitmap.json'] = fs.readFileSync('./models/levels/chunk_HangarStraight_SideSmall_1_hitmap.json');
        self.zcache['/models/levels/chunk_HangarCorner_1.json'] = fs.readFileSync('./models/levels/chunk_HangarCorner_1.json');
        self.zcache['/models/levels/chunk_HangarCorner_1_hitmap.json'] = fs.readFileSync('./models/levels/chunk_HangarCorner_1_hitmap.json');
        self.zcache['/models/levels/chunk_HangarEndcap_1.json'] = fs.readFileSync('./models/levels/chunk_HangarEndcap_1.json');
        self.zcache['/models/levels/chunk_HangarEndcap_1_hitmap.json'] = fs.readFileSync('./models/levels/chunk_HangarEndcap_1_hitmap.json');
        self.zcache['/models/levels/chunk_Hangar_SmallCross_1.json'] = fs.readFileSync('./models/levels/chunk_Hangar_SmallCross_1.json');
        self.zcache['/models/levels/chunk_Hangar_SmallCross_1_hitmap.json'] = fs.readFileSync('./models/levels/chunk_Hangar_SmallCross_1_hitmap.json');
        self.zcache['/models/levels/startmenu.json'] = fs.readFileSync('./models/levels/startmenu.json');
        self.zcache['/models/levels/map_256_B.png'] = fs.readFileSync('./models/levels/map_256_B.png');
        self.zcache['/models/levels/map_256_I.png'] = fs.readFileSync('./models/levels/map_256_I.png');
        self.zcache['/models/levels/map_256_S.png'] = fs.readFileSync('./models/levels/map_256_S.png');
        self.zcache['/models/levels/map_256.png'] = fs.readFileSync('./models/levels/map_256.png');

        self.zcache['/sounds/shortzap2.wav'] = fs.readFileSync('./sounds/shortzap2.wav');
        self.zcache['/sounds/blue_laser.wav'] = fs.readFileSync('./sounds/blue_laser.wav');
        self.zcache['/sounds/plasmashot.wav'] = fs.readFileSync('./sounds/plasmashot.wav');
        self.zcache['/sounds/plasmashot2.wav'] = fs.readFileSync('./sounds/plasmashot2.wav');
        self.zcache['/sounds/plasmashot3.wav'] = fs.readFileSync('./sounds/plasmashot3.wav');
        self.zcache['/sounds/plasma1.wav'] = fs.readFileSync('./sounds/plasma1.wav');
        self.zcache['/sounds/SoundsCrate-SciFi-Laser1.wav'] = fs.readFileSync('./sounds/SoundsCrate-SciFi-Laser1.wav');
        self.zcache['/sounds/SoundsCrate-SciFi-Laser1b.wav'] = fs.readFileSync('./sounds/SoundsCrate-SciFi-Laser1b.wav');
        self.zcache['/sounds/SoundsCrate-SciFi-Laser2.wav'] = fs.readFileSync('./sounds/SoundsCrate-SciFi-Laser2.wav');
        self.zcache['/sounds/matterhit3.wav'] = fs.readFileSync('./sounds/matterhit3.wav');
        self.zcache['/sounds/plasmahit.wav'] = fs.readFileSync('./sounds/plasmahit.wav');
        self.zcache['/sounds/molten.wav'] = fs.readFileSync('./sounds/molten.wav');
        self.zcache['/sounds/debris1.wav'] = fs.readFileSync('./sounds/debris1.wav');
        self.zcache['/sounds/debris2.wav'] = fs.readFileSync('./sounds/debris2.wav');
        self.zcache['/sounds/debris3.wav'] = fs.readFileSync('./sounds/debris3.wav');
        self.zcache['/sounds/debris4.wav'] = fs.readFileSync('./sounds/debris4.wav');
        self.zcache['/sounds/debris5.wav'] = fs.readFileSync('./sounds/debris5.wav');
        self.zcache['/sounds/debris6.wav'] = fs.readFileSync('./sounds/debris6.wav');
        self.zcache['/sounds/debris7.wav'] = fs.readFileSync('./sounds/debris7.wav');
        self.zcache['/sounds/debris8.wav'] = fs.readFileSync('./sounds/debris8.wav');
        self.zcache['/sounds/debris8.wav'] = fs.readFileSync('./sounds/debris8.wav');
        self.zcache['/sounds/drone1s1.wav'] = fs.readFileSync('./sounds/drone1s1.wav');
        self.zcache['/sounds/spiders1.wav'] = fs.readFileSync('./sounds/spiders1.wav');
        self.zcache['/sounds/itds3.wav'] = fs.readFileSync('./sounds/itds3.wav');
        self.zcache['/sounds/spawn.wav'] = fs.readFileSync('./sounds/spawn.wav');

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

		self.routes['/lib/three77.js'] = function(req, res) {res.send(self.cache_get('/lib/three77.js') );};
        self.routes['/lib/soundjs-0.6.2.min.js'] = function(req, res) {res.send(self.cache_get('/lib/soundjs-0.6.2.min.js') );};
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
        self.routes['/gfx/shaderSpriteAdd.png'] = function(req, res) {res.send(self.cache_get('/gfx/shaderSpriteAdd.png') );};
        self.routes['/gfx/smokePuffAlpha.png'] = function(req, res) {res.send(self.cache_get('/gfx/smokePuffAlpha.png') );};
        self.routes['/models/ship.json'] = function(req, res) {res.send(self.cache_get('/models/ship.json') );};
        self.routes['/models/ravier.json'] = function(req, res) {res.send(self.cache_get('/models/ravier.json') );};
        self.routes['/models/ravier.png'] = function(req, res) {res.send(self.cache_get('/models/ravier.png') );};
        self.routes['/models/ravier_B.png'] = function(req, res) {res.send(self.cache_get('/models/ravier_B.png') );};
        self.routes['/models/chunk.json'] = function(req, res) {res.send(self.cache_get('/models/chunk.json') );};
        self.routes['/models/chunk.png'] = function(req, res) {res.send(self.cache_get('/models/chunk.png') );};
        self.routes['/models/drone.json'] = function(req, res) {res.send(self.cache_get('/models/drone.json') );};
        self.routes['/models/drone.png'] = function(req, res) {res.send(self.cache_get('/models/drone.png') );};
        self.routes['/models/drone_B.png'] = function(req, res) {res.send(self.cache_get('/models/drone_B.png') );};
        self.routes['/models/sniper.json'] = function(req, res) {res.send(self.cache_get('/models/sniper.json') );};
        self.routes['/models/sniper.png'] = function(req, res) {res.send(self.cache_get('/models/sniper.png') );};
        self.routes['/models/sniper_B.png'] = function(req, res) {res.send(self.cache_get('/models/sniper_B.png') );};
        self.routes['/models/orbot.json'] = function(req, res) {res.send(self.cache_get('/models/orbot.json') );};
        self.routes['/models/orbot.png'] = function(req, res) {res.send(self.cache_get('/models/orbot.png') );};
        self.routes['/models/orbot_B.png'] = function(req, res) {res.send(self.cache_get('/models/orbot_B.png') );};
        self.routes['/models/telering_B.png'] = function(req, res) {res.send(self.cache_get('/models/telering_B.png') );};
        self.routes['/models/telering_I.png'] = function(req, res) {res.send(self.cache_get('/models/telering_I.png') );};
        self.routes['/models/telering.png'] = function(req, res) {res.send(self.cache_get('/models/telering.png') );};
        self.routes['/models/telering_bottom.json'] = function(req, res) {res.send(self.cache_get('/models/telering_bottom.json') );};
        self.routes['/models/telering_top.json'] = function(req, res) {res.send(self.cache_get('/models/telering_top.json') );};

        self.routes['/models/levels/chunk_HangarStraight_SideSmall_1.json'] = function(req, res) {res.send(self.cache_get('/models/levels/chunk_HangarStraight_SideSmall_1.json') );};
        self.routes['/models/levels/chunk_HangarStraight_SideSmall_1_hitmap.json'] = function(req, res) {res.send(self.cache_get('/models/levels/chunk_HangarStraight_SideSmall_1_hitmap.json') );};
        self.routes['/models/levels/chunk_HangarEndcap_1.json'] = function(req, res) {res.send(self.cache_get('/models/levels/chunk_HangarEndcap_1.json') );};
        self.routes['/models/levels/chunk_HangarEndcap_1_hitmap.json'] = function(req, res) {res.send(self.cache_get('/models/levels/chunk_HangarEndcap_1_hitmap.json') );};
        self.routes['/models/levels/chunk_HangarCorner_1.json'] = function(req, res) {res.send(self.cache_get('/models/levels/chunk_HangarCorner_1.json') );};
        self.routes['/models/levels/chunk_HangarCorner_1_hitmap.json'] = function(req, res) {res.send(self.cache_get('/models/levels/chunk_HangarCorner_1_hitmap.json') );};
        self.routes['/models/levels/chunk_Hangar_SmallCross_1.json'] = function(req, res) {res.send(self.cache_get('/models/levels/chunk_Hangar_SmallCross_1.json') );};
        self.routes['/models/levels/chunk_Hangar_SmallCross_1_hitmap.json'] = function(req, res) {res.send(self.cache_get('/models/levels/chunk_Hangar_SmallCross_1.json') );};
        self.routes['/models/levels/startmenu.json'] = function(req, res) {res.send(self.cache_get('/models/levels/startmenu.json') );};
        self.routes['/models/levels/map_256.png'] = function(req, res) {res.send(self.cache_get('/models/levels/map_256.png') );};
        self.routes['/models/levels/map_256_B.png'] = function(req, res) {res.send(self.cache_get('/models/levels/map_256_B.png') );};
        self.routes['/models/levels/map_256_I.png'] = function(req, res) {res.send(self.cache_get('/models/levels/map_256_I.png') );};
        self.routes['/models/levels/map_256_S.png'] = function(req, res) {res.send(self.cache_get('/models/levels/map_256_S.png') );};

        self.routes['/sounds/shortzap2.wav'] = function(req, res) {res.send(self.cache_get('/sounds/shortzap2.wav') );};
        self.routes['/sounds/blue_laser.wav'] = function(req, res) {res.send(self.cache_get('/sounds/blue_laser.wav') );};
        self.routes['/sounds/plasmashot.wav'] = function(req, res) {res.send(self.cache_get('/sounds/plasmashot.wav') );};
        self.routes['/sounds/plasmashot2.wav'] = function(req, res) {res.send(self.cache_get('/sounds/plasmashot2.wav') );};
        self.routes['/sounds/plasmashot3.wav'] = function(req, res) {res.send(self.cache_get('/sounds/plasmashot3.wav') );};
        self.routes['/sounds/plasma1.wav'] = function(req, res) {res.send(self.cache_get('/sounds/plasma1.wav') );};
        self.routes['/sounds/SoundsCrate-SciFi-Laser1.wav'] = function(req, res) {res.send(self.cache_get('/sounds/SoundsCrate-SciFi-Laser1.wav') );};
        self.routes['/sounds/SoundsCrate-SciFi-Laser1b.wav'] = function(req, res) {res.send(self.cache_get('/sounds/SoundsCrate-SciFi-Laser1b.wav') );};
        self.routes['/sounds/SoundsCrate-SciFi-Laser2.wav'] = function(req, res) {res.send(self.cache_get('/sounds/SoundsCrate-SciFi-Laser2.wav') );};
        self.routes['/sounds/matterhit3.wav'] = function(req, res) {res.send(self.cache_get('/sounds/matterhit3.wav') );};
        self.routes['/sounds/plasmahit.wav'] = function(req, res) {res.send(self.cache_get('/sounds/plasmahit.wav') );};
        self.routes['/sounds/molten.wav'] = function(req, res) {res.send(self.cache_get('/sounds/molten.wav') );};
        self.routes['/sounds/debris1.wav'] = function(req, res) {res.send(self.cache_get('/sounds/debris1.wav') );};
        self.routes['/sounds/debris2.wav'] = function(req, res) {res.send(self.cache_get('/sounds/debris2.wav') );};
        self.routes['/sounds/debris3.wav'] = function(req, res) {res.send(self.cache_get('/sounds/debris3.wav') );};
        self.routes['/sounds/debris4.wav'] = function(req, res) {res.send(self.cache_get('/sounds/debris4.wav') );};
        self.routes['/sounds/debris5.wav'] = function(req, res) {res.send(self.cache_get('/sounds/debris5.wav') );};
        self.routes['/sounds/debris6.wav'] = function(req, res) {res.send(self.cache_get('/sounds/debris6.wav') );};
        self.routes['/sounds/debris7.wav'] = function(req, res) {res.send(self.cache_get('/sounds/debris7.wav') );};
        self.routes['/sounds/debris8.wav'] = function(req, res) {res.send(self.cache_get('/sounds/debris8.wav') );};
        self.routes['/sounds/drone1s1.wav'] = function(req, res) {res.send(self.cache_get('/sounds/drone1s1.wav') );};
        self.routes['/sounds/spiders1.wav'] = function(req, res) {res.send(self.cache_get('/sounds/spiders1.wav') );};
        self.routes['/sounds/itds3.wav'] = function(req, res) {res.send(self.cache_get('/sounds/itds3.wav') );};
        self.routes['/sounds/spawn.wav'] = function(req, res) {res.send(self.cache_get('/sounds/spawn.wav') );};

		self.routes['/dist/Init.js'] = function(req, res) {res.send(self.cache_get('/dist/Init.js') );};
        self.routes['/dist/LogicInit.js'] = function(req, res) {res.send(self.cache_get('/dist/LogicInit.js') );};
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
        self.createRoutes();
        self.app = express();

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
