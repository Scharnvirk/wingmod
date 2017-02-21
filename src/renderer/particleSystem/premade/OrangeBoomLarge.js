module.exports = function(config){
    for (let i = 0; i < 20; i++){
        config.particleManager.createParticle('smokePuffAlpha',{
            positionX: config.position[0] + Utils.rand(-10,10),
            positionY: config.position[1] + Utils.rand(-10,10),
            color: 'WHITE',
            scale: Utils.rand(20, 50),
            alpha: Utils.rand(0.4, 0.9)/10 + 0.1,
            alphaMultiplier: 0.98,
            particleVelocity: Utils.rand(0,10) / 40,
            particleRotation: Utils.rand(0,360),
            speedZ: Utils.rand(0,5) / 500,
            lifeTime: Utils.rand(60, 120)
        });
    }

    for (let i = 0; i < 60; i++){
        config.particleManager.createParticle('particleAdd',{
            positionX: config.position[0],
            positionY: config.position[1],
            color: 'ORANGE',
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
        color: 'WHITE',
        scale: 250,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 20
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        color: 'WHITE',
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
        color: 'ORANGE',
        scale: 60,
        alpha: 1,
        alphaMultiplier: 0.95,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 80
    });
};
