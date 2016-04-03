global.Utils = require("shared/Utils");
global.Constants = require("shared/Constants");
global.EventEmitter = require("shared/EventEmitter");

var domready = require("domready");
var Ui = require("renderer/ui/Ui");
var gameCore;

function Init() {}

Init.prototype.start = function(){
    domready(function (){
        var ui = new Ui();
        global.uiDebugHandle = ui;
    });
};

var init = new Init();
init.start();
