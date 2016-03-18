var BaseActor = require("renderer/actor/BaseActor");

function PlasmaProjectileActor(config){
    BaseActor.apply(this, arguments);
    this.colorR = 0.3;
    this.colorG = 1;
    this.colorB = 0.5;
}

PlasmaProjectileActor.extend(BaseActor);

PlasmaProjectileActor.prototype.customUpdate = function(){

    // this.particleManager.createParticle('particleAddTrail', {
    //     type: 'lightGreenTrail',
    //     positionX: this.position[0],
    //     positionY: this.position[1]
    // });

    // this.particleManager.createParticle('particleAddTrail', {
    //     type: 'greenFlashBig',
    //     positionX: this.position[0],
    //     positionY: this.position[1]
    // });

    //var offsetPosition = Utils.angleToVector(this.angle, 1);
    //
    // this.particleManager.createParticle('particleAddTrail', {
    //     type: 'lightGreenTrail',
    //     positionX: this.position[0] + offsetPosition[0],
    //     positionY: this.position[1] + offsetPosition[1]
    // });
    //
    // offsetPosition = Utils.angleToVector(this.angle, 2);
    //
    // this.particleManager.createParticle('particleAddTrail', {
    //     type: 'lightGreenTrail',
    //     positionX: this.position[0] + offsetPosition[0],
    //     positionY: this.position[1] + offsetPosition[1]
    // });

    for(let i = 0; i < 3; i++){
        var offsetPosition = Utils.angleToVector(this.angle, -i*1.3);
        // this.particleManager.createParticle('particleAddTrail', {
        //     type: 'lightGreenTrail',
        //     positionX: this.position[0] + offsetPosition[0],
        //     positionY: this.position[1] + offsetPosition[1]
        // });
        this.particleManager.createParticle('particleAddTrail', {
            positionX: this.position[0] + offsetPosition[0],
            positionY: this.position[1] + offsetPosition[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 2.6-0.4*i,
            alpha: 1-0.19*i,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: this.angle,
            lifeTime: 1
        });
    }

    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR,
        colorG: this.colorG,
        colorB: this.colorB,
        scale: 8,
        alpha: 0.5,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleAngle: this.angle,
        lifeTime: 2
    });
};

PlasmaProjectileActor.prototype.onDeath = function(){
    for (let i = 0; i < 20; i++){
        this.particleManager.createParticle('smokePuffAlpha',{
            positionX: this.position[0] + Utils.rand(-3,3),
            positionY: this.position[1] + Utils.rand(-3,3),
            colorR: this.colorR*0.3+0.7,
            colorG: this.colorG*0.3+0.7,
            colorB: this.colorB*0.3+0.7,
            scale: Utils.rand(1,3),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0,1) / 10,
            particleAngle: Utils.rand(0,360),
            lifeTime: 60
        });
    }

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 40,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 10
    });

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 10,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 15
    });

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 15,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
};


PlasmaProjectileActor.prototype.onSpawn = function(){


    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 1
    });

    this.particleManager.createParticle('particleAddTrail', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 15,
        alpha: 0.4,
        alphaMultiplier: 0.7,
        particleVelocity: 2,
        particleAngle: this.angle,
        lifeTime: 10
    });
};

module.exports = PlasmaProjectileActor;
