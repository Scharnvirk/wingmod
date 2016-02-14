function ProjectileActor(){
    BaseActor.apply(this, arguments);
    this.colorR = Math.random();
    this.colorG = Math.random();
    this.colorB = Math.random();
    this.particleVelocity = 3.5;
}

ProjectileActor.extend(BaseActor);

ProjectileActor.prototype.customUpdate = function(){
    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 6,
        alpha: 1,
        alphaMultiplier: 0.6,
        particleVelocity: 2,
        particleAngle: this.angle,
        lifeTime: 10
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: this.colorR,
        colorG: this.colorG,
        colorB: this.colorB,
        scale: 20,
        alpha: 0.2,
        alphaMultiplier: 1,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 1
    });
};

ProjectileActor.prototype.onDeath = function(){
    for (let i = 0; i < 20; i++){
        this.particleManager.createParticle('smokePuffAlpha',{
            positionX: this.position[0] + Utils.rand(-5,5),
            positionY: this.position[1] + Utils.rand(-5,5),
            colorR: this.colorR*0.3+0.7,
            colorG: this.colorG*0.3+0.7,
            colorB: this.colorB*0.3+0.7,
            scale: Utils.rand(2,10),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0,3) / 10,
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
        scale: 120,
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
        scale: 30,
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
        scale: 40,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
    //this.particleManager.createParticle('particleAdd', this.position[0], this.position[1], this.colorR, this.colorG, this.colorB, 80, 0.3, 2, 0, 0);
    //this.particleManager.createParticle('particleAdd', this.position[0], this.position[1], this.colorR, this.colorG, this.colorB, 20, 1, 20, 0, 0);
};
