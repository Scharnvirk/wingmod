#!/bin/env node
//  OpenShift sample Node application

var Promise = require('promise');
var express = require('express');
var path	= require('path');
var fs     = require('fsp');


/**
 *  Define the sample application.
 */
var SampleApp = function() {
    var self = this;

    var resourcePaths = [
        'lib',
        'lib/utils',
        'models',
        'models/levels',
        'gfx',
        'dist',
        'sounds',
    ];

    self.setupVariables = function() {
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        }
    };

    self.readDirectory = function(path){
        return fs.readdirP(path).then(function(result){
            var fullPaths = [];
            result.forEach(function(item){
                fullPaths.push('/' + path + '/' + item);
            })
            return fullPaths;
        });
    }

    self.buildResourceList = function() {
        whenPathsLoaded = [];
        resourcePaths.forEach(function(path){
            whenPathsLoaded.push(self.readDirectory(path));
        });
        return Promise.all(whenPathsLoaded).then(function(result){
            var allItemsWithPaths = [];
            result.forEach(function(itemDirectory){
                allItemsWithPaths = allItemsWithPaths.concat(itemDirectory);
            })
            return allItemsWithPaths;
        })
    }

    self.buildVersionHtmlText = function() {
        var version = JSON.parse(fs.readFileSync('./version', 'utf-8'));
        var versionText = version.major + '.' + version.minor + '.' + version.patch + '.' + version.build;

        return "<script>Constants.VERSION = '" + versionText + "'</script>";
    };

    self.populateCache = function(paths) {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        var startingPath = '.';

        var index = fs.readFileSync('./index.html', 'utf-8');
        index += self.buildVersionHtmlText();

        paths.forEach(function(itemPath){
            var isFileDirectory = fs.statSync(startingPath + itemPath).isDirectory();
            if(!isFileDirectory){
                self.zcache[itemPath] = fs.readFileSync(startingPath + itemPath);
            }
        })
        self.zcache['index.html'] = index;
        self.zcache['/styles.css'] = fs.readFileSync('./styles.css');
        self.zcache['/fonts/Oswald-Regular.ttf'] = fs.readFileSync('./fonts/Oswald-Regular.ttf');
    };

    self.cache_get = function(key) { return self.zcache[key]; };

    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };

    self.setupTerminationHandlers = function(){
        process.on('exit', function() { self.terminator(); });
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };

    self.createRoutes = function(paths) {
        self.routes = { };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };

        self.routes['/styles.css'] = function(req, res) {
            res.setHeader('Content-Type', 'text/css');
            res.send(self.cache_get('/styles.css') );
        };
        paths.forEach(function(itemPath){
            self.routes[itemPath] = function(req, res) {res.send(self.cache_get(itemPath) );};
        });

        self.routes['/fonts/Oswald-Regular.ttf'] = function(req, res) {res.send(self.cache_get('/fonts/Oswald-Regular.ttf') );};
    };

    self.initializeServer = function() {
        self.app = express();
        for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }
    };

    self.initialize = function() {
        self.setupVariables();
        self.buildResourceList().then(function(paths){
            self.populateCache(paths);
            self.setupTerminationHandlers();
            self.createRoutes(paths);
            self.initializeServer();
            self.start();
        });
    };

    self.start = function() {
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                    Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};

var zapp = new SampleApp();
zapp.initialize();
