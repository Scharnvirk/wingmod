global.Utils = require("shared/Utils");
global.Constants = require("shared/Constants");
global.EventEmitter = require("shared/EventEmitter");

var Core = require('renderer/Core');
var domready = require("domready");
var Ui = require("renderer/ui/Ui");
var gameCore;

function Init() {}

Init.prototype.start = function(){
    domready(function (){
        var ui = new Ui();

        var logicWorker = new Worker('dist/LogicInit.js');
        var loaderWorker = new Worker('dist/LoaderInit.js');

        var core = new Core({
            logicWorker: logicWorker,
            loaderWorker: loaderWorker,
            ui: ui,
        });

        ui.gameCore = core;

        global.uiDebugHandle = ui;
        global.gameCore = core;
    });
};

var init = new Init();
init.start();
