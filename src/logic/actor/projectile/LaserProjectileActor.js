var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function LaserProjectileActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 2,
        removeOnHit: true,
        timeout: 60,
        bodyConfig: {
            radius: 1,
            mass: 0.1,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            collisionType: 'playerProjectile',
            actor: this
        }
    });

    BaseActor.apply(this, arguments);
}

LaserProjectileActor.extend(BaseActor);

LaserProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

LaserProjectileActor.prototype.onDeath = function(){
    this.body.dead = true;
    this.manager.playSound({sounds: ['matterhit3'], actor: this});
};

module.exports = LaserProjectileActor;
