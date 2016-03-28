var ShipMesh = require("renderer/actor/component/mesh/ShipMesh");
var BaseActor = require("renderer/actor/BaseActor");

function MookActor(){
    BaseActor.apply(this, arguments);
    this.speedZ = Utils.rand(35,45)/1000;
    this.bobSpeed = Utils.rand(18,22)/10000;

    this.initialHp = 4;
    this.hp = 4;
}

MookActor.extend(BaseActor);

MookActor.prototype.createMesh = function(){
    return new ShipMesh({actor: this, scaleX: 1, scaleY: 1, scaleZ: 1});
};

MookActor.prototype.customUpdate = function(){
    this.positionZ += this.speedZ;
    this.doBob();
    this.handleDamage();
};

MookActor.prototype.doBob = function(){
    if (this.positionZ > 10){
        this.speedZ -= this.bobSpeed;
    } else {
        this.speedZ += this.bobSpeed;
    }
};

MookActor.prototype.onSpawn = function(){
    this.manager.newEnemy(this.actorId);
};

MookActor.prototype.onDeath = function(){
    this.manager.enemyDestroyed(this.actorId);

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

MookActor.prototype.handleDamage = function(){
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

module.exports = MookActor;
