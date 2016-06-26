module.exports = function(config){
    for (let i = 0; i < 30; i++){
        config.particleManager.createParticle('particleAdd',{
            positionX: config.position[0],
            positionY: config.position[1],
            colorR: 0.8,
            colorG: 0.8,
            colorB: 1,
            scale: 0.75,
            alpha: 1,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(5, 8) / 10,
            particleAngle: Utils.rand(0,360),
            speedZ: Utils.rand(-50, 50) / 100,
            lifeTime: Utils.rand(10,20)
        });
    }

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 30,
        alpha: 1,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 10
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 0.8,
        colorG: 0.8,
        colorB: 1,
        scale: 2,
        alpha: 1,
        alphaMultiplier: 0.9,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 60
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: 5,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 15
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        colorR: 0.3,
        colorG: 0.3,
        colorB: 1,
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleAngle: 0,
        lifeTime: 20
    });
};
