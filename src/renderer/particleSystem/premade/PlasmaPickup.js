module.exports = function(config){    
    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0] + Utils.rand(-3,3)/5,
        positionY: config.position[1] + Utils.rand(-3,3)/5,
        positionZ: config.positionZ,
        color: 'GREEN',
        scale: Utils.rand(6,10),
        alpha: 0.15,
        alphaMultiplier: 0.85,
        particleVelocity: config.distance,
        speedZ: 0.4,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 15
    });

    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0] + Utils.rand(-3,3)/5,
        positionY: config.position[1] + Utils.rand(-3,3)/5,
        positionZ: config.positionZ,
        color: 'WHITE',
        scale: Utils.rand(2,3),
        alpha: 0.4,
        alphaMultiplier: 0.85,
        particleVelocity: config.distance,
        speedZ: 0.4,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 15
    });

    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        color: 'GREEN',
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 1
    });

    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        color: 'GREEN',
        scale: 12,
        alpha: 1,
        alphaMultiplier: 0.4,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 1
    });
};
