var BaseBody = require('logic/actor/component/body/BaseBody');
var BaseActor = require('logic/actor/BaseActor');
var ActorConfig = require('shared/ActorConfig');

function RingProjectileActor(config){
    config = config || [];
    Object.assign(this, config);
    this.applyConfig(ActorConfig.RINGPROJECTILE);
    BaseActor.apply(this, arguments);
}

RingProjectileActor.extend(BaseActor);

RingProjectileActor.prototype.customUpdate = function(){
    this.setMass(this.getMass() * 0.96);
    this.props.damage *= 0.95;
};

module.exports = RingProjectileActor;
