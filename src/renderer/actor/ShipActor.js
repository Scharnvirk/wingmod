function ShipActor(){
    BaseActor.apply(this, arguments);
    this.count = 0;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMesh = function(){
    return new RavierMesh({actor: this, scaleX: 6, scaleY: 6, scaleZ: 6});
};

ShipActor.prototype.customUpdate = function(){

        this.particleManager.createParticle('smokePuffAlpha',{
            positionX: this.position[0] + Utils.rand(-5,5),
            positionY: this.position[1] + Utils.rand(-5,5),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(5,20),
            alpha: 0.6,
            alphaMultiplier: 0.96,
            particleVelocity: 0,
            particleAngle: 0,
            lifeTime: 120
        });
};
