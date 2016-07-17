var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function PulseWaveProjectileActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 3,
        removeOnHit: true,
        timeout: 30,
        bodyConfig: {
            radius: 3,
            mass: 2,
            ccdSpeedThreshold: 1,
            ccdIterations: 2,
            collisionType: 'playerProjectile',
            actor: this
        }
    });

    BaseActor.apply(this, arguments);

    this.collisionFixesPosition = true;
}

PulseWaveProjectileActor.extend(BaseActor);

PulseWaveProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

PulseWaveProjectileActor.prototype.customUpdate = function(){
    this.damage *= 0.97;
    this.body.updateMassProperties();
};

PulseWaveProjectileActor.prototype.onDeath = function(){
    this.body.dead = true;
    this.manager.playSound({sounds: ['matterhit3'], actor: this});
};

module.exports = PulseWaveProjectileActor;
