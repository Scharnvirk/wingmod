'use strict';

function RenderBus(worker) {
    if (!worker) throw new Error('No worker object specified for Logic Render Bus');
    this.worker = worker;
    this.inputState = {};

    this.worker.onmessage = this.handleMessage.bind(this);
}

RenderBus.prototype.postMessage = function (type, message) {
    message.type = type;
    this.worker.postMessage(message);
};

RenderBus.prototype.handleMessage = function (message) {
    switch (message.data.type) {
        case 'inputState':
            this.inputState = message.data;
            break;
    }
};
//# sourceMappingURL=RenderBus.js.map
