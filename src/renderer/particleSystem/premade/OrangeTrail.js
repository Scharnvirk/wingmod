module.exports = function(config){
    for(let i = 0; i < 3; i++){
        var offsetPosition = Utils.rotationToVector(config.rotation, -i*0.6);
        config.particleManager.createParticle('particleAdd', {
            positionX: config.position[0],
            positionY: config.position[1],
            color: 'WHITE',
            scale: 1.5,
            alpha: 1,
            alphaMultiplier: 0.8,
            particleVelocity: 1,
            particleRotation: config.rotation,
            lifeTime: 1,
            spriteNumber: 2
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        color: 'ORANGE',
        scale: Utils.rand(5,11),
        alpha: 0.8,
        alphaMultiplier: 0.6,
        particleVelocity: 1,
        particleRotation: config.rotation,
        lifeTime: 1
    });
};
