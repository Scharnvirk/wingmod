function ShipPlasmaProjectileActor(config){
    BaseActor.apply(this, arguments);
    this.colorR = 0.3;
    this.colorG = 1;
    this.colorB = 0.5;
}

ShipPlasmaProjectileActor.extend(BaseActor);

// ShipPlasmaProjectileActor.prototype.createSprite = function(){
//     return new ProjectileSprite({actor: this, scaleX: 2, scaleY: 2, scaleZ: 2});
// };


ShipPlasmaProjectileActor.prototype.customUpdate = function(){
    for(let i = 0; i < 5; i++){
        var offsetPosition = Utils.angleToVector(this.angle, -i*1.4);
        this.particleManager.createParticle('particleAdd', {
            positionX: this.position[0] + offsetPosition[0],
            positionY: this.position[1] + offsetPosition[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: 5-0.8*i,
            alpha: 1-0.19*i,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleAngle: this.angle,
            lifeTime: 1
        });
    }

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR,
        colorG: this.colorG,
        colorB: this.colorB,
        scale: 20,
        alpha: 0.5,
        alphaMultiplier: 0.4,
        particleVelocity: 1,
        particleAngle: this.angle,
        lifeTime: 2
    });
};

ShipPlasmaProjectileActor.prototype.onDeath = function(){
    for (let i = 0; i < 20; i++){
        this.particleManager.createParticle('smokePuffAlpha',{
            positionX: this.position[0] + Utils.rand(-3,3),
            positionY: this.position[1] + Utils.rand(-3,3),
            colorR: this.colorR*0.3+0.7,
            colorG: this.colorG*0.3+0.7,
            colorB: this.colorB*0.3+0.7,
            scale: Utils.rand(2,6),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0,2) / 10,
            particleAngle: Utils.rand(0,360),
            lifeTime: 60
        });
    }

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 80,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 10
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 20,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 15
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR*0.3+0.7,
        colorG: this.colorG*0.3+0.7,
        colorB: this.colorB*0.3+0.7,
        scale: 30,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
    //this.particleManager.createParticle('particleAdd', this.position[0], this.position[1], this.colorR, this.colorG, this.colorB, 80, 0.3, 2, 0, 0);
    //this.particleManager.createParticle('particleAdd', this.position[0], this.position[1], this.colorR, this.colorG, this.colorB, 20, 1, 20, 0, 0);
};
