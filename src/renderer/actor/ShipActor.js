function ShipActor(){
    BaseActor.apply(this, arguments);
    this.count = 0;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMesh = function(){
    return new RavierMesh({actor: this, scaleX: 6, scaleY: 6, scaleZ: 6});
};

ShipActor.prototype.customUpdate = function(){
    this.doEngineGlow();
    //this.doBank();
};

ShipActor.prototype.doBank = function(){
    if(this.logicPreviousAngle < this.angle){
        this.mesh.rotation.x = Utils.degToRad(-15);
    }
    if(this.logicPreviousAngle > this.angle){
        this.mesh.rotation.x = Utils.degToRad(15);
    }
    if(this.logicPreviousAngle === this.angle){
        this.mesh.rotation.x = 0;
    }
};

ShipActor.prototype.doEngineGlow = function(){
    if(this.inputListener.inputState.w){
        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(20,30),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -10,
            particleAngle: this.angle + Utils.degToRad(15),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(20,30),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -10,
            particleAngle: this.angle - Utils.degToRad(15),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(5,8),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -10,
            particleAngle: this.angle + Utils.degToRad(15),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(5,8),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -10,
            particleAngle: this.angle - Utils.degToRad(15),
            lifeTime: 1
        });
    }

    if(this.inputListener.inputState.a){
        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(12,22),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -8,
            particleAngle: this.angle + Utils.degToRad(40),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(3,5),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -8,
            particleAngle: this.angle + Utils.degToRad(40),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(12,22),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -12,
            particleAngle: this.angle + Utils.degToRad(170),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(3,5),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -12,
            particleAngle: this.angle + Utils.degToRad(170),
            lifeTime: 1
        });
    }

    if(this.inputListener.inputState.d){
        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(12,22),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -8,
            particleAngle: this.angle - Utils.degToRad(40),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(3,5),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -8,
            particleAngle: this.angle - Utils.degToRad(40),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(12,22),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -12,
            particleAngle: this.angle - Utils.degToRad(170),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(3,5),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -12,
            particleAngle: this.angle - Utils.degToRad(170),
            lifeTime: 1
        });
    }

    if(this.inputListener.inputState.s){

        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 0.5,
            colorG: 0.6,
            colorB: 1,
            scale: Utils.rand(20,30),
            alpha: 0.4,
            alphaMultiplier: 1,
            particleVelocity: -14,
            particleAngle: this.angle + Utils.degToRad(180),
            lifeTime: 1
        });

        this.particleManager.createParticle('particleAdd',{
            positionX: this.position[0],
            positionY: this.position[1],
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(5,8),
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: -14,
            particleAngle: this.angle + Utils.degToRad(180),
            lifeTime: 1
        });
    }
};

ShipActor.prototype.onDeath = function(){
    for (let i = 0; i < 200; i++){
        this.particleManager.createParticle('smokePuffAlpha',{
            positionX: this.position[0] + Utils.rand(-2,2),
            positionY: this.position[1] + Utils.rand(-2,2),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2,15),
            alpha: Utils.rand(0,3)/10 + 0.3,
            alphaMultiplier: 0.97,
            particleVelocity: Utils.rand(0,4) / 10,
            particleAngle: Utils.rand(0,360),
            lifeTime: 180
        });
    }

    this.particleManager.createParticle('particleAdd', {
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
        lifeTime: 30
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 60,
        alpha: 1,
        alphaMultiplier: 0.96,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 120
    });

    this.particleManager.createParticle('particleAdd', {
        positionX: this.position[0],
        positionY: this.position[1],
        colorR: 1,
        colorG: 0.6,
        colorB: 0.2,
        scale: 80,
        alpha: 1,
        alphaMultiplier: 0.96,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 120
    });
};
