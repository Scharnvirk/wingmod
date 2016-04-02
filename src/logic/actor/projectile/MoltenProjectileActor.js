var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function MoltenProjectileActor(config){
    config = config || [];

    Object.assign(this, config);

    this.applyConfig({
        hp: 1,
        damage: 1,
        removeOnHit: true,
        timeout: 1000,
        bodyConfig: {
            radius: 1,
            mass: 1,
            collisionType: 'enemyProjectile',
            actor: this
        }
    });

    BaseActor.apply(this, arguments);
}

MoltenProjectileActor.extend(BaseActor);

MoltenProjectileActor.prototype.createBody = function(){
    return new BaseBody(this.bodyConfig);
};

module.exports = MoltenProjectileActor;
