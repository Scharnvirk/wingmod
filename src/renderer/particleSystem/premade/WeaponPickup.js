module.exports = function(config){
    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        color: 'DEEPYELLOW',
        scale: Utils.rand(4,7),
        alpha: 0.4,
        alphaMultiplier: 0.6,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 1
    });

    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        color: 'DEEPRED',
        scale: Utils.rand(8,14),
        alpha: 0.6,
        alphaMultiplier: 0.6,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),        
        lifeTime: 1
    });

    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        color: 'DEEPRED',
        scale: 30,
        alpha: 0.8,
        alphaMultiplier: 0.2,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),        
        lifeTime: 1
    });

};
