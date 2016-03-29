var BaseBody = require("logic/actor/component/body/BaseBody");
var BaseActor = require("logic/actor/BaseActor");

function PlasmaProjectileActor(config){
    config = config || [];
    BaseActor.apply(this, arguments);
    Object.assign(this, config);

    this.hp = 1;
    this.DAMAGE = 0.5;
    this.removeOnHit = true;
    this.timeout = 120;
}

PlasmaProjectileActor.extend(BaseActor);

PlasmaProjectileActor.prototype.createBody = function(){
    return new BaseBody({
        shape: new p2.Circle({
            radius: 2,
            collisionGroup: Constants.COLLISION_GROUPS.SHIPPROJECTILE,
            collisionMask:
                Constants.COLLISION_GROUPS.ENEMY |
                Constants.COLLISION_GROUPS.ENEMYPROJECTILE |
                Constants.COLLISION_GROUPS.TERRAIN
        }),
        actor: this,
        mass: 1,
        ccdSpeedThreshold: -1,
        ccdIterations: 4
    });
};

PlasmaProjectileActor.prototype.onDeath = function(){
    this.body.dead = true;
};


module.exports = PlasmaProjectileActor;
