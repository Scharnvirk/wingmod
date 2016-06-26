module.exports = function(config){
    for (let i = 0; i < 5; i++){
        config.particleManager.createParticle('smokePuffAlpha',{
            positionX: config.position[0] + Utils.rand(-2,2),
            positionY: config.position[1] + Utils.rand(-2,2),
            positionZ: config.positionZ + Utils.rand(-2,2),
            colorR: 1,
            colorG: 0.8,
            colorB: 0.73,
            scale: Utils.rand(1,3),
            alpha: 0.6,
            alphaMultiplier: 0.9,
            particleVelocity: Utils.rand(0,1) / 10,
            particleAngle: Utils.rand(0,360),
            speedZ: Utils.rand(-10, 10) / 100,
            lifeTime: 60
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 35,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 10
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 15
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 0.8,
        colorB: 0.73,
        scale: 10,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
};
