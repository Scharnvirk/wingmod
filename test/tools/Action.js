function Action(actionFunction, config){
    config = config || {};
    actionFunction = actionFunction || function(){ console.warn("Oops? no actionFunction?"); };
    this.props = this._createProps(actionFunction, config);
    this.state = this._createState(config);
    this.config = config;
    Object.freeze(config);
}  

Action.prototype.run = function(currentFrameNumber) {
    if (this.state.waitLeft > 0){
        this.state.waitLeft --;
        return;
    }

    if (this.state.frequencyCounter > 1) {
        this.state.frequencyCounter --;
        return;
    }

    if (this.state.executionCounter >= this.props.executions) {
        return; 
    }

    this.state.frequencyCounter += this.props.frequency;
    this.state.executionCounter ++;

    this.props.actionFunction(currentFrameNumber);
};

Action.prototype.reset = function() {
    this.state = this._createState(this.config);
};

Action.prototype._createState = function(config) {
    const state = {
        waitLeft: config.initialWait,
        frequencyCounter: 0,
        executionCounter: 0
    };
    Object.preventExtensions(state);
    return state;
};

Action.prototype._createProps = function(actionFunction, config) {
    const props = {
        actionFunction: actionFunction,
        name: config.name || 'Unnamed action',
        frequency: config.frequency || 1,
        executions: typeof config.executions === 'undefined' ? 999999999 : config.executions,
        initialWait: config.initialWait || 0
    };

    Object.freeze(props);

    return props;
};

module.exports = Action;