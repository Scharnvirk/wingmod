function ExplosionActor(){
    BaseActor.apply(this, arguments);
    this.colorR = Math.random();
    this.colorG = Math.random();
    this.colorB = Math.random();
}

ExplosionActor.extend(BaseActor);

ExplosionActor.prototype.customUpdate = function(){
    for (let i = 0; i < 10; i++){
        this.particleManager.createParticle('smokePuffAlpha',this.position[0] + Utils.rand(-5,5), this.position[1] + Utils.rand(-5,5), this.colorR*0.3+0.7, this.colorG*0.3+0.7, this.colorB*0.3+0.7, Utils.rand(5,20), 0.2, 60);
    }
    this.particleManager.createParticle('particleAdd', this.position[0], this.position[1], this.colorR, this.colorG, this.colorB, 80, 0.3, 2);
    this.particleManager.createParticle('particleAdd', this.position[0], this.position[1], this.colorR, this.colorG, this.colorB, 20, 1, 20);
};
