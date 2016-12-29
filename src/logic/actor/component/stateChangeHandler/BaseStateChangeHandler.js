// var BaseState = require("logic/actor/component/stateChangeHandler/state/BaseState");

function BaseStateChangeHandler(config){
    config = config || {};
    Object.assign(this, config);
    this.actor = config.actor;
    this.initialState = config.initialState;
    this.state = config.state || config.initialState;
}

BaseStateChangeHandler.prototype.onCollision = function(otherActor, relativeContactPoint){
    if(otherActor && this.state.hp != Infinity && otherActor.props.damage > 0){
        this.state.hp -= otherActor.props.damage;
        this.actor.onHit();
    }

    if (this.state.hp <= 0 || this.actor.props.removeOnHit){
        this.actor.deathMain(relativeContactPoint);
    }

    this.actor.notifyManagerOfStateChange(this.state);
};

module.exports = BaseStateChangeHandler;
