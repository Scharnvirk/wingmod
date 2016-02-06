function ProjectileActor(){
    BaseActor.apply(this, arguments);
}

ProjectileActor.extend(BaseActor);
//
// ProjectileActor.prototype.createSprite = function(){
//     return new ProjectileSprite({actor: this});
// };
