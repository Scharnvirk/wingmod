function RenderBus(config){
    if(!config.worker) throw new Error('No worker object specified for Logic Render Bus');
    this.worker = config.worker;
    this.core = config.core;
    this.inputState = {};

    this.worker.onmessage = this.handleMessage.bind(this);
}

RenderBus.prototype.postMessage = function(type, message){
    message.type = type;
    this.worker.postMessage(message);
};

RenderBus.prototype.handleMessage = function(message){
    switch(message.data.type){
        case 'inputState':
            this.inputState = message.data;
            break;
        case "pause":
            this.core.pause();
            break;
        case "start":
            this.core.start();
            break;
        case "aiImageDone":
            this.core.saveAiImage(message.data);
            break;
    }
};

module.exports = RenderBus;
