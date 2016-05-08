global.Utils = require("shared/Utils");
global.Constants = require("shared/Constants");
global.EventEmitter = require("shared/EventEmitter");

if('function'===typeof importScripts){
    var LoaderCore = require('loader/Core');
    self.core = new LoaderCore(self);
}
