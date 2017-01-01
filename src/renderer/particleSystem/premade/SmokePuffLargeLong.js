module.exports = function(config){
    config.particleManager.createParticle('smokePuffAlpha',{
        positionX: config.position[0] + Utils.rand(-2,2),
        positionY: config.position[1] + Utils.rand(-2,2),
        colorR: 1,
        colorG: 1,
        colorB: 1,
        scale: Utils.rand(20, 50),
        alpha: Utils.rand(0, 3)/10 + 0.1,
        alphaMultiplier: 0.99,
        particleVelocity: Utils.rand(0,10) / 500,
        particleRotation: Utils.rand(0,360),
        speedZ: Utils.rand(0,5) / 500,
        lifeTime: Utils.rand(600,800)
    });
};
