global.Utils = require('shared/Utils');
global.Constants = require('shared/Constants');
global.EventEmitter = require('shared/EventEmitter');

if('function'===typeof importScripts){
    importScripts('../../lib/p2.js');
    importScripts('../../lib/threex.loop.js');
    var LogicCore = require('logic/Core');
    self.core = new LogicCore(self);
}
