module.exports = function(config){
    for (let i = 0; i < 3; i++){
        config.particleManager.createParticle('smokePuffAlpha',{
            positionX: config.position[0] + Utils.rand(-2,2),
            positionY: config.position[1] + Utils.rand(-2,2),
            positionZ: config.positionZ + Utils.rand(-2,2),
            color: 'ORANGE',
            scale: Utils.rand(3,6),
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
        color: 'ORANGE',
        scale: 35,
        alpha: 1.4,
        alphaMultiplier: 0.4,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 4
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        color: 'WHITE',
        scale: 8,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 15
    });

    config.particleManager.createParticle('particleAdd', {
        positionX: config.position[0],
        positionY: config.position[1],
        color: 'ORANGE',
        scale: 10,
        alpha: 1,
        alphaMultiplier: 0.8,
        particleVelocity: 0,
        particleRotation: 0,
        lifeTime: 20
    });
};
