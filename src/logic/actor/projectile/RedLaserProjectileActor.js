var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function RedLaserProjectileActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 4,
        removeOnHit: true,
        timeout: 120,
        bodyConfig: {
            radius: 1,
            mass: 0.5,
            ccdSpeedThreshold: 1,
            ccdIterations: 4,
            collisionType: 'enemyProjectile',
            actor: this
        }
    });

    BaseActor.apply(this, arguments);
}

RedLaserProjectileActor.extend(BaseActor);

RedLaserProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = RedLaserProjectileActor;
