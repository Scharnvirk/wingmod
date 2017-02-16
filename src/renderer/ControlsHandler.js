function ControlsHandler(config){
    if(!config.inputListener) throw new Error('No inputListener specified for the handler!');
    if(!config.logicBus) throw new Error('No logic bus specified for the handler!');

    Object.assign(this, config);

    this.inputListener = config.inputListener;
    this.logicBus = config.logicBus;
    this.oldInputState = {};
    this.inputState =  {};

    this.hudKeys = ['q', 'e', 'mouseLeft', 'mouseRight'];

    EventEmitter.apply(this, arguments);
}

ControlsHandler.extend(EventEmitter);

ControlsHandler.prototype.update = function(){
    Object.assign(this.oldInputState, this.inputState);
    Object.assign(this.inputState, this.inputListener.inputState);

    var changed = this.hasInputStateChanged();

    var hudKeys = this.getChangedHudKeys();
    if (hudKeys) {
        this.emit({type: 'hud', data: this.inputState});
    }

    if(changed) this.sendUpdate();
};

ControlsHandler.prototype.hasInputStateChanged = function(){
    var changed = false;
    for (let key in this.inputState){
        if(this.inputState[key] != this.oldInputState[key]){
            changed = true;
            break;
        }
    }
    return changed;
};

ControlsHandler.prototype.getChangedHudKeys = function(){
    var hudKeys = {};
    for (let key in this.hudKeys){
        let value = this.hudKeys[key];
        if(this.inputState[value] != this.oldInputState[value]){
            hudKeys[value] = this.inputState[value];
        }
    }
    return Object.keys(hudKeys).length > 0 ? hudKeys : null;
};

ControlsHandler.prototype.sendUpdate = function(){
    this.logicBus.postMessage('inputState', this.inputState);
};



module.exports = ControlsHandler;
