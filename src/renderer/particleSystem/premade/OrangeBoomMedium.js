module.exports = function(config){
    for (let i = 0; i < 100; i++){
        config.particleManager.createParticle('smokePuffAlpha',{
            positionX: config.position[0] + Utils.rand(-2,2),
            positionY: config.position[1] + Utils.rand(-2,2),
            colorR: 1,
            colorG: 1,
            colorB: 1,
            scale: Utils.rand(2,15),
            alpha: Utils.rand(0,3)/10 + 0.3,
            alphaMultiplier: 0.95,
            particleVelocity: Utils.rand(0,4) / 10,
            particleRotation: Utils.rand(0,360),
            lifeTime: 120
        });
    }

    for (let i = 0; i < 40; i++){
        config.particleManager.createParticle('particleAdd',{
            positionX: config.position[0],
            positionY: config.position[1],
            colorR: 1,
            colorG: 0.8,
            colorB: 0.5,
            scale: 1.2,
            alpha: 1,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(1, 20) / 10,
            particleRotation: Utils.rand(0,360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10,50)
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 220,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 20
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 50,
        alpha: 1,
        alphaMultiplier: 0.95,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 80
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 0.6,
        colorB: 0.2,
        scale: 60,
        alpha: 1,
        alphaMultiplier: 0.95,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 80
    });
};
