'use strict';

var gameCore;

function Init() {}

Init.prototype.start = function () {
    console.log('init start');
    var core = new Core();
    core.setRenderer();
    core.run();
    console.log('init end');

    gameCore = core;
};
//# sourceMappingURL=Init.js.map
