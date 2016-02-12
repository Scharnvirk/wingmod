function ProjectileActor(){
    BaseActor.apply(this, arguments);
    this.colorR = Math.random();
    this.colorG = Math.random();
    this.colorB = Math.random();
    this.particleVelocity = 3.5;
}

ProjectileActor.extend(BaseActor);

ProjectileActor.prototype.customUpdate = function(){
    this.particleManager.createParticle('particleAdd', this.position[0], this.position[1], 1,1,1, 5, 0.7, 10, (Math.sin(this.angle) * -1) * this.particleVelocity, Math.cos(this.angle)*this.particleVelocity);
    this.particleManager.createParticle('particleAdd', this.position[0], this.position[1], this.colorR, this.colorG, this.colorB, 20, 0.1, 2, 0, 0);
};

ProjectileActor.prototype.onDeath = function(){
    for (let i = 0; i < 10; i++){
        this.particleManager.createParticle('smokePuffAlpha',this.position[0] + Utils.rand(-5,5), this.position[1] + Utils.rand(-5,5), this.colorR*0.3+0.7, this.colorG*0.3+0.7, this.colorB*0.3+0.7, Utils.rand(5,20), 0.2, 60, 0, 0);
    }
    this.particleManager.createParticle('particleAdd', this.position[0], this.position[1], this.colorR, this.colorG, this.colorB, 80, 0.3, 2, 0, 0);
    this.particleManager.createParticle('particleAdd', this.position[0], this.position[1], this.colorR, this.colorG, this.colorB, 20, 1, 20, 0, 0);
};
