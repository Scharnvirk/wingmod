function ProjectileActor(){
    BaseActor.apply(this, arguments);
    this.colorR = Math.random();
    this.colorG = Math.random();
    this.colorB = Math.random();
}

ProjectileActor.extend(BaseActor);

ProjectileActor.prototype.customUpdate = function(){
    this.particleManager.createParticle('particleAdd',[this.position[0], this.position[1], 1,1,1, 5, 0.5, 50]);
    this.particleManager.createParticle('particleAdd',[this.position[0], this.position[1], this.colorR, this.colorG, this.colorB, 20, 0.1, 2]);
};

//
// ProjectileActor.prototype.createSprite = function(){
//     return new ProjectileSprite({actor: this});
// };
