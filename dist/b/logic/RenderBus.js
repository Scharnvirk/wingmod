'use strict';

function RenderBus(worker) {
    if (!worker) throw new Error('No worker object specified for Logic Render Bus');
    this.worker = worker;
}

RenderBus.prototype.postMessage = function (message) {
    this.worker.postMessage(message);
};
//# sourceMappingURL=RenderBus.js.map
