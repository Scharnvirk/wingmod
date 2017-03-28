module.exports = function(config){
    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0] + Utils.rand(-3,3)/5,
        positionY: config.position[1] + Utils.rand(-3,3)/5,
        positionZ: config.positionZ,
        color: 'BLUE',
        scale: Utils.rand(6,10),
        alpha: 0.15,
        alphaMultiplier: 0.85,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1,
    });

    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0] + Utils.rand(-3,3)/5,
        positionY: config.position[1] + Utils.rand(-3,3)/5,
        positionZ: config.positionZ,
        color: 'WHITE',
        scale: Utils.rand(2,3),
        alpha: 0.4,
        alphaMultiplier: 0.85,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1,
    });

    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        color: 'BLUE',
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 1
    });

    for (let i = 0; i < 10; i++){
        config.particleManager.createParticle('particleAdd',{
            positionX: config.position[0],
            positionY: config.position[1],
            color: 'BLUE',
            scale: 2,
            alpha: 0.7,
            alphaMultiplier: 0.94,
            particleVelocity: Utils.rand(1, 20) / 10,
            particleRotation: Utils.rand(0,360),
            speedZ: Utils.rand(1, 20) / 10,
            lifeTime: 1,
            spriteNumber: 2
        });
    }

};
