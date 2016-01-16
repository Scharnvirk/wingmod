'use strict';

function LogicBus(config) {
    config = config || {};
    Object.assign(this, config);
    if (!this.logicWorker) throw new Error('No logicWorker object specified for LogicBus!');
    if (!this.actorManager) throw new Error('No actorManager object specified for LogicBus!');

    this.logicWorker.onmessage = this.handleMessage.bind(this);
}

LogicBus.prototype.handleMessage = function (message) {
    switch (message.data.type) {
        case 'updateActors':
            this.actorManager.updateFromLogic(message.data);
            break;
        case 'attachCamera':
            this.actorManager.attachCamera(message.data.actorId);
            break;
    }
};

LogicBus.prototype.postMessage = function (type, message) {
    message.type = type;
    this.logicWorker.postMessage(message);
};
//# sourceMappingURL=LogicBus.js.map
