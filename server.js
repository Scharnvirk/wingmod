#!/bin/env node

var Promise = require('promise');
var express = require('express');
var basicAuth = require('basic-auth');
var path	= require('path');
var fs     = require('fsp');
var crypto = require('crypto');

function Server(){
    this.PASSWD_CONFIG_PATH = './passwd.json';
    this.INDEX_PATH = './index.html';
    this.STYLE_PATH = './styles.css';

    this.USE_PASSWORD_AUTH = false;

    this.RESOURCE_DIRECTORIES_PATHS = [
        'lib',
        'lib/utils',
        'models',
        'models/levels',
        'gfx',
        'dist',
        'sounds',
        'fonts'
    ];

    var url = this.createUrl();
    this.ipAddress = url.ipAddress;
    this.port = url.port;

    this.passwdConfig = {};

    this.createPassConfig().
    then(this.createResourceList.bind(this)).
    then(function(paths){
            this.zCache = this.populateCache(paths);
            this.setupTerminationHandlers();
            this.routes = this.createRoutes(paths);
            this.setupRoutesWithAuth();
            this.start();
        }.bind(this)
    ).catch(function(error){
        console.log(error);
    });
}

Server.prototype.createPassConfig = function(){
    return fs.readFileP(this.PASSWD_CONFIG_PATH, 'utf-8').then(
        function(passwdConfigFile){
            this.passwdConfig = JSON.parse(passwdConfigFile);
            return;
        }
    ).catch(function(error){
        console.log("WARN: no passwd config file found!");
        this.passwdConfig = {};
    })
}

Server.prototype.createUrl = function(){
    var ipAddress = process.env.OPENSHIFT_NODEJS_IP;
    var port  = process.env.OPENSHIFT_NODEJS_PORT || 8080;

    if (typeof ipAddress === "undefined") {
        ipAddress = "127.0.0.1";
    }

    return {
        port: port,
        ipAddress: ipAddress
    }
}

Server.prototype.readDirectory = function(path){
    return fs.readdirP(path).then(function(result){
        var fullPaths = [];
        result.forEach(function(item){
            fullPaths.push('/' + path + '/' + item);
        })
        return fullPaths;
    }, function(error){
        console.log(error);
    });
}

Server.prototype.createResourceList = function(){
    var whenPathsLoaded = [];

    this.RESOURCE_DIRECTORIES_PATHS.forEach(
        function(path){
            whenPathsLoaded.push(this.readDirectory(path));
        }.bind(this),
        function(error){
            console.log(error)
        }
    );

    return Promise.all(whenPathsLoaded).then(
        function(result){
            var allItemsWithPaths = [];
            result.forEach(function(itemDirectory){
                allItemsWithPaths = allItemsWithPaths.concat(itemDirectory);
            })
            return allItemsWithPaths;
        }
    )
}

Server.prototype.populateCache = function(paths, zCache){
    if (typeof zCache === "undefined") {
        zCache = {};
    }

    var startingPath = '.';

    paths.forEach(function(itemPath){
        var isFileDirectory = fs.statSync(startingPath + itemPath).isDirectory();
        if(!isFileDirectory){
            zCache[itemPath] = fs.readFileSync(startingPath + itemPath);
        }
    })
    zCache['index.html'] = fs.readFileSync(this.INDEX_PATH, 'utf-8');
    zCache['/styles.css'] = fs.readFileSync(this.STYLE_PATH);

    return zCache;
}

Server.prototype.getFromCache = function(key) {
    if (!this.zCache) {
        console.error("no Zcache!");
    } else {
        return this.zCache[key];
    }
}

Server.prototype.terminate = function(signal) {
    if (typeof signal === "string") {
       console.log('%s: Received %s - terminating server app ...',
                   Date(Date.now()), signal);
       process.exit(1);
    }
    console.log('%s: Node server stopped.', Date(Date.now()) );
}

Server.prototype.setupTerminationHandlers = function() {
    process.on('exit', function() {
        this.terminate();
    }.bind(this));

    [
        'SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
        'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
    ].forEach(function(element, index, array) {
        process.on(element, function() {
            this.terminate(element);
        }.bind(this));
    }.bind(this));
}

Server.prototype.createRoutes = function(paths) {
    routes = {};

    routes['/'] = function(req, res) {
        res.setHeader('Content-Type', 'text/html');
        res.send(this.getFromCache('index.html') );
    }.bind(this);

    routes['/styles.css'] = function(req, res) {
        res.setHeader('Content-Type', 'text/css');
        res.send(this.getFromCache('/styles.css') );
    }.bind(this);

    paths.forEach(function(itemPath){
        routes[itemPath] = function(req, res) {
            res.send(this.getFromCache(itemPath) );
        }.bind(this);
    }.bind(this));

    routes['/fonts/Oswald-Regular.ttf'] = function(req, res) {
        res.send(this.getFromCache('/fonts/Oswald-Regular.ttf') );
    }.bind(this);

    return routes;
}

Server.prototype.auth = function(request, result, next) {
    function unauthorized(result) {
        result.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return result.sendStatus(401);
    };

    var user = basicAuth(request);

    if (!user || !user.name || !user.pass) {
        return unauthorized(result);
    };

    var userHash = crypto.createHash('sha256');
    var passHash = crypto.createHash('sha256');

    userHash.update(user.name);
    passHash.update(user.pass);

    var userHashValue = userHash.digest('hex');
    var passHashValue = passHash.digest('hex');

    Object.keys(this.passwdConfig).forEach(function(userKey){
        if (userHashValue === userKey && passHashValue === this.passwdConfig[userKey]) {
            return next();
        }
    });
    return unauthorized(result);
}

Server.prototype.routeWithoutAuth = function(request, result, next){
    return next();
}

Server.prototype.setupRoutesWithAuth = function(){
    this.app = express();

    var authFunction = this.USE_PASSWORD_AUTH ? this.auth : this.routeWithoutAuth;

    for (var route in this.routes) {
        this.app.get(route, authFunction, this.routes[route]);
    }
}

Server.prototype.start = function(){
    this.app.listen(
        this.port,
        this.ipAddress,
        function() {
            console.log(
                '%s: Node server started on %s:%d ...',
                Date( Date.now() ),
                this.ipAddress,
                this.port
            );
        }.bind(this)
    );
}

var server = new Server();
