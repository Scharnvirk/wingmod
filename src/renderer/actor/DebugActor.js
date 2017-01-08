var BaseActor = require('renderer/actor/BaseActor');

function DebugActor(){
    BaseActor.apply(this, arguments);
}

DebugActor.extend(BaseActor);

DebugActor.prototype.customUpdate = function(){
    this.createParticle({
        amount: 100,
        particleClass: 'particleNumberAdd',
        color: 'PURPLE',
        scale: 5,
        alpha: 1,
        alphaMultiplier: 0.75,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 5,
        spriteNumber: [0, 10],
        speedZ: 1,
    });
};

module.exports = DebugActor;
