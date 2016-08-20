module.exports = function(config){
    config.particleManager.createParticle('particleAdd',{
        positionX: config.position[0],
        positionY: config.position[1],
        positionZ: config.positionZ,
        colorR: 0.2,
        colorG: 0.4,
        colorB: 1,
        scale: 2,
        alpha: 1,
        alphaMultiplier: 1,
        particleVelocity: config.distance,
        particleRotation: config.rotation + Utils.degToRad(config.rotationOffset),
        lifeTime: 1,
        spriteNumber: 1
    });
};
