module.exports = function(config){
    for (let i = 0; i < 3; i++){
        config.particleManager.createParticle('smokePuffAlpha',{
            positionX: config.position[0] + Utils.rand(-1, 1),
            positionY: config.position[1] + Utils.rand(-1, 1),
            positionZ: config.positionZ + Utils.rand(-1, 1),
            colorR: 0.8,
            colorG: 1,
            colorB: 0.85,
            scale: Utils.rand(4,8),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0,1) / 10,
            particleRotation: Utils.rand(0,360),
            speedZ: Utils.rand(-10, 10) / 100,
            lifeTime: 60
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 0.8,
        colorG: 1,
        colorB: 0.85,
        scale: 40,
        alpha: 1.5,
        alphaMultiplier: 0.4,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 5
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 10,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 15
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 0.8,
        colorG: 1,
        colorB: 0.85,
        scale: 15,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 20
    });
};
