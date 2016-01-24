
var gameCore;

function Init() {}

Init.prototype.start = function(){

    var logicWorker = new Worker('dist/logicInit.min.js');
    var core = new Core(logicWorker);

    gameCore = core;

};
