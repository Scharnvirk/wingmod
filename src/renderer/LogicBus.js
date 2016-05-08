var WorkerBus = require("shared/WorkerBus");

function LogicBus(config){
    WorkerBus.apply(this, arguments);
}

LogicBus.extend(WorkerBus);

module.exports = WorkerBus;
