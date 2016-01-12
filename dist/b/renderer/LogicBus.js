'use strict';

function LogicBus(config) {
    config = config || {};
    Object.assign(this, config);
    if (!this.logicWorker) throw new Error('No logicWorker object specified for LogicBus!');
    if (!this.actorManager) throw new Error('No actorManager object specified for LogicBus!');

    this.logicWorker.onmessage = this.updateFromLogic.bind(this);
}

LogicBus.prototype.updateFromLogic = function (message) {
    this.actorManager.updateFromLogic(message.data);
};
//# sourceMappingURL=LogicBus.js.map
