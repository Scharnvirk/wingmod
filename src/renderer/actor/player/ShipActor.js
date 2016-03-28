var RavierMesh = require("renderer/actor/component/mesh/RavierMesh");
var BaseActor = require("renderer/actor/BaseActor");

function ShipActor(){
    BaseActor.apply(this, arguments);
    this.count = 0;
    this.speedZ = 0.04;

    //todo: generic config holder
    this.initialHp = 20;
    this.hp = 20;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMesh = function(){
    return new RavierMesh({actor: this, scaleX: 3, scaleY: 3, scaleZ: 3});
};

ShipActor.prototype.customUpdate = function(){
    this.doEngineGlow();
    this.positionZ += this.speedZ;
    this.doBob();
    this.handleDamage();
};

ShipActor.prototype.doBank = function(){
    this.mesh.rotation.x += Utils.degToRad((this.logicPreviousAngle - this.angle) * 50);
};

ShipActor.prototype.doBob = function(){
    if (this.positionZ > 10){
        this.speedZ -= 0.002;
    } else {
        this.speedZ += 0.002;
    }
};

ShipActor.prototype.doEngineGlow = function(){
    if(this.inputListener.inputState.w && !this.inputListener.inputState.s){
        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ + 1,
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(10,15),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -5,
            particleAngle: this.angle + Utils.degToRad(15),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ + 1,
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(10,15),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -5,
            particleAngle: this.angle - Utils.degToRad(15),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ + 1,
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(3,4),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -5,
            particleAngle: this.angle + Utils.degToRad(15),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ + 1,
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(3,4),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -5,
            particleAngle: this.angle - Utils.degToRad(15),
            lifeTime: 1
        });
    }

    if(this.inputListener.inputState.a && !this.inputListener.inputState.d){
        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ,
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(6,11),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -4,
            particleAngle: this.angle + Utils.degToRad(40),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ,
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2,3),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -4,
            particleAngle: this.angle + Utils.degToRad(40),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ,
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(6,11),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -6,
            particleAngle: this.angle + Utils.degToRad(170),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ,
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2,3),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -6,
            particleAngle: this.angle + Utils.degToRad(170),
            lifeTime: 1
        });
    }

    if(this.inputListener.inputState.d){
        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ,
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(6,11),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -4,
            particleAngle: this.angle - Utils.degToRad(40),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ,
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2,3),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -4,
            particleAngle: this.angle - Utils.degToRad(40),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ,
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(6,11),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -6,
            particleAngle: this.angle - Utils.degToRad(170),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ,
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2,3),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -6,
            particleAngle: this.angle - Utils.degToRad(170),
            lifeTime: 1
        });
    }

    if(this.inputListener.inputState.s){

        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ,
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(10,15),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -7,
            particleAngle: this.angle + Utils.degToRad(180),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAddTrail',{
            positionX: this.position[0],
            positionY: this.position[1],
            positionZ: this.positionZ,
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(3,4),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -7,
            particleAngle: this.angle + Utils.degToRad(180),
            lifeTime: 1
        });
    }
};

ShipActor.prototype.onDeath = function(){
    for (let i = 0; i < 100; i++){
        this.particleManager.createParticle('smokePuffAlpha',{
            positionX: this.position[0] + Utils.rand(-2,2),
            positionY: this.position[1] + Utils.rand(-2,2),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2,15),
            alpha: Utils.rand(0,3)/10 + 0.3,
            alphaMultiplier: 0.95,
            particleVelocity: Utils.rand(0,4) / 10,
            particleAngle: Utils.rand(0,360),
            lifeTime: 120
        });
    }

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 200,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 40,
        alpha: 1,
        alphaMultiplier: 0.95,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 80
    });

    this.particleManager.createParticle('mainExplosionAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 0.6,
        colorB: 0.2,
        scale: 60,
        alpha: 1,
        alphaMultiplier: 0.95,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 80
    });
};


ShipActor.prototype.handleDamage = function(){
    let damageRandomValue = Utils.rand(0, 100) - 100 * (this.hp / this.initialHp);
    if (damageRandomValue > 20){
        this.particleManager.createParticle('smokePuffAlpha',{
            positionX: this.position[0] + Utils.rand(-2,2),
            positionY: this.position[1] + Utils.rand(-2,2),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2,5),
            alpha: Utils.rand(0,3)/10 + 0.1,
            alphaMultiplier: 0.95,
            particleVelocity: Utils.rand(0,10) / 100,
            particleAngle: Utils.rand(0,360),
            speedZ: Utils.rand(0,10) / 100,
            lifeTime: 120
        });
    }

    if (damageRandomValue > 50 && Utils.rand(0,100) > 95){
        for (let i = 0; i < 15; i++){
            this.particleManager.createParticle('particleAddSplash',{
                positionX: this.position[0],
                positionY: this.position[1],
                colorR: 0.8,
                colorG: 0.8,
                colorB: 1,
                scale: 0.75,
                alpha: 1,
                alphaMultiplier: 0.90,
                particleVelocity: Utils.rand(5, 8) / 10,
                particleAngle: Utils.rand(0,360),
                speedZ: Utils.rand(-50, 50) / 100,
                lifeTime: Utils.rand(0,20)
            });
        }

        this.particleManager.createParticle('mainExplosionAdd', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 30,
            alpha: 1,
            alphaMultiplier: 0.2,
            particleVelocity: 0,
            particleAngle: 0,
            lifeTime: 10
        });

        this.particleManager.createParticle('particleAddSplash', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.8,
            colorG: 0.9,
            colorB: 1,
            scale: 2,
            alpha: 1,
            alphaMultiplier: 0.9,
            particleVelocity: 0,
            particleAngle: 0,
            lifeTime: 60
        });

        this.particleManager.createParticle('particleAddSplash', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 5,
            alpha: 1,
            alphaMultiplier: 0.8,
            particleVelocity: 0,
            particleAngle: 0,
            lifeTime: 15
        });

        this.particleManager.createParticle('mainExplosionAdd', {
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.3,
            colorG: 0.4,
            colorB: 1,
            scale: 8,
            alpha: 1,
            alphaMultiplier: 0.8,
            particleVelocity: 0,
            particleAngle: 0,
            lifeTime: 20
        });
    }
};

module.exports = ShipActor;
