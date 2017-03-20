var BaseActor = require('renderer/actor/BaseActor');
var ParticleMixin = require('renderer/actor/mixin/ParticleMixin');

function PlasmaBlastMiniProjectileActor(){
    BaseActor.apply(this, arguments);
}

PlasmaBlastMiniProjectileActor.extend(BaseActor);
PlasmaBlastMiniProjectileActor.mixin(ParticleMixin);

PlasmaBlastMiniProjectileActor.prototype.customUpdate = function(){
    this.createPremade({premadeName: 'GreenTrail'});
};

PlasmaBlastMiniProjectileActor.prototype.onDeath = function(){
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({premadeName: 'GreenTrailLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};

PlasmaBlastMiniProjectileActor.prototype.onTimeout = function(){
    var offsetPosition = this.getOffsetPosition(-5);
    this.createPremade({premadeName: 'GreenTrailLarge', offsetPositionX: offsetPosition[0], offsetPositionY: offsetPosition[1]});
};


module.exports = PlasmaBlastMiniProjectileActor;
