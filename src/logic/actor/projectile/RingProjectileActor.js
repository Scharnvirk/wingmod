var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function RingProjectileActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 6,
        removeOnHit: true,
        timeout: 120,
        bodyConfig: {
            radius: 3,
            mass: 20,
            ccdSpeedThreshold: 1,
            ccdIterations: 2,
            collisionType: 'enemyProjectile',
            actor: this
        }
    });

    BaseActor.apply(this, arguments);

    this.collisionFixesPosition = true;
}

RingProjectileActor.extend(BaseActor);

RingProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

RingProjectileActor.prototype.customUpdate = function(){
    this.body.mass *= 0.96;
    this.damage *= 0.95;
    this.body.updateMassProperties();
};

RingProjectileActor.prototype.onDeath = function(){
    this.body.dead = true;
    this.manager.playSound({sounds: ['matterhit3'], actor: this});
};

module.exports = RingProjectileActor;
