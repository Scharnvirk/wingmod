var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function PlasmaProjectileActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 1.5,
        removeOnHit: true,
        timeout: 300,
        bodyConfig: {
            radius: 2,
            mass: 1,
            collisionType: 'playerProjectile',
            actor: this
        }
    });

    BaseActor.apply(this, arguments);
}

PlasmaProjectileActor.extend(BaseActor);

PlasmaProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = PlasmaProjectileActor;
