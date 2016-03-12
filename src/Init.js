global.Utils = require("Utils");
global.Constants = require("Constants");

var domready = require("domready");
var Core = require("renderer/Core");
var LogicInit = require('LogicInit');
var gameCore;

function Init() {}

Init.prototype.start = function(){
    domready(function (){
        var logicWorker = new Worker('dist/LogicInit.js');
        var core = new Core(logicWorker);
        global.gameCore = core;
    });
};

var init = new Init();
init.start();
