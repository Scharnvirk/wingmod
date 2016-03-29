module.exports = function(config){
    config.particleManager.createParticle('smokePuffAlpha',{
        positionX: config.position[0] + Utils.rand(-2,2),
        positionY: config.position[1] + Utils.rand(-2,2),
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: Utils.rand(2,5),
        alpha: Utils.rand(0,3)/10 + 0.1,
        alphaMultiplier: 0.95,
        particleVelocity: Utils.rand(0,10) / 100,
        particleAngle: Utils.rand(0,360),
        speedZ: Utils.rand(0,10) / 100,
        lifeTime: 120
    });
};
