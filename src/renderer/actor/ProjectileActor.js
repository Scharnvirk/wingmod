function ProjectileActor(){
    BaseActor.apply(this, arguments);
}

ProjectileActor.extend(BaseActor);

ProjectileActor.prototype.customUpdate = function(){
    this.particleManager.createParticle('particleAdd',[this.position[0], this.position[1], 1,1,1, 5, 0.5, 50]);
};

//
// ProjectileActor.prototype.createSprite = function(){
//     return new ProjectileSprite({actor: this});
// };
