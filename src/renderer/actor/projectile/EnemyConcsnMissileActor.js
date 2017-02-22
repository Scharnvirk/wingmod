var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');
var MissileMesh = require('renderer/actor/component/mesh/MissileMesh');

function EnemyConcsnMissileActor(){
    BaseActor.apply(this, arguments);
}

EnemyConcsnMissileActor.extend(BaseActor);
EnemyConcsnMissileActor.mixin(ParticleMixin);

EnemyConcsnMissileActor.prototype.createMeshes = function(){
    return [new MissileMesh({actor: this, scaleX: 2, scaleY: 2, scaleZ: 2})]; 
};

EnemyConcsnMissileActor.prototype.customUpdate = function(){
    let offsetPosition = this.getOffsetPosition(-5);
    this.createParticle({
        particleClass: 'particleAdd',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'YELLOW',
        scale: 3,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 2,
        lifeTime: 20
    });

    this.createParticle({
        particleClass: 'smokePuffAlpha',
        offsetPositionX: offsetPosition[0],
        offsetPositionY: offsetPosition[1],
        color: 'WHITE',
        scale: Utils.rand(3,8),
        alpha: 0.4,
        alphaMultiplier: 0.95,
        particleVelocity: -2,
        lifeTime: 60
    });
};

EnemyConcsnMissileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-10);
    this.createPremade({premadeName: 'OrangeBoomLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
    this.requestUiFlash('white');
    this.requestShake();
};

EnemyConcsnMissileActor.prototype.onSpawn = function(){
    this.createParticle({
        particleClass: 'particleAdd',
        color: 'RED',
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        lifeTime: 1
    });

    this.createParticle({
        particleClass: 'particleAdd',
        color: 'RED',
        scale: 12,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        lifeTime: 3
    });
};

module.exports = EnemyConcsnMissileActor;
