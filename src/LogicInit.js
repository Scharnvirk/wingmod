global.Utils = require("Utils");
global.Constants = require("Constants");

if('function'===typeof importScripts){
    importScripts('../../lib/p2.js');
    importScripts('../../lib/threex.loop.js');
    var LogicCore = require('logic/Core');
    self.core = new LogicCore(self);
}
