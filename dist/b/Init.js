'use strict';

var gameCore;

function Init() {}

Init.prototype.start = function () {

    var logicWorker = new Worker('dist/b/logic/Init.js');
    var core = new Core(logicWorker);

    gameCore = core;
};
//# sourceMappingURL=Init.js.map
