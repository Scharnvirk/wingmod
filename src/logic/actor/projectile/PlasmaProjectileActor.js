var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function PlasmaProjectileActor(config){
    config = config || [];

    Object.assign(this, config);

    this.hp = 1;
    this.damage = 0.5;
    this.removeOnHit = true;
    this.timeout = 300;

    this.bodyConfig = {
        radius: 2,
        mass: 1,
        collisionType: 'playerProjectile',
        actor: this
    };

    BaseActor.apply(this, arguments);
}

PlasmaProjectileActor.extend(BaseActor);

PlasmaProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = PlasmaProjectileActor;
