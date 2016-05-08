var WorkerBus = require("shared/WorkerBus");

function RenderBus(config){
    WorkerBus.apply(this, arguments);
}

RenderBus.extend(WorkerBus);

module.exports = WorkerBus;
