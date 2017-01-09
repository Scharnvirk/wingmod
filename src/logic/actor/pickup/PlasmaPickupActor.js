var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function PlasmaPickupActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.PLASMAPICKUP);
    BaseActor.apply(this, arguments);
    if(this.parent){
        this.props.timeout = 9999999;
    }
}

PlasmaPickupActor.extend(BaseActor);

PlasmaPickupActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

PlasmaPickupActor.prototype.onDeath = function(){
    if (this.parent && this.parent.onPickupTaken) {
        this.parent.onPickupTaken();
    }
};


module.exports = PlasmaPickupActor;
