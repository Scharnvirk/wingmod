var ParticleMixin = {
    createPremade: function(config){
        config = config || {}; 
        config.position = [this._position[0] + (config.offsetPositionX || 0), this._position[1] + (config.offsetPositionY || 0)];
        config.rotation = this._rotation;
        this._particleManager.createPremade(config.premadeName, config);
    },

    createParticle: function(config){
        config = config || {};
        for(var i = 0, l = Utils.randArray(config.amount || 1); i < l; i++){
            this._particleManager.createParticle(config.particleClass || 'particleNumberAdd', {
                positionX: this._position[0] + (config.offsetPositionX || 0),
                positionY: this._position[1] + (config.offsetPositionY || 0),
                color: config.color,
                scale: Utils.randArray(config.scale || 1),
                alpha: Utils.randArray(config.alpha || 1),
                alphaMultiplier: Utils.randArray(config.alphaMultiplier || 1),
                particleVelocity: Utils.randArray(config.particleVelocity || 0),
                particleRotation: Utils.randArray(config.particleRotation ? (config.particleRotation || 0) : this._rotation),
                lifeTime: Utils.randArray(config.lifeTime || 100),
                spriteNumber: Utils.randArray(config.spriteNumber || 0),
                speedZ: Utils.randArray(config.speedZ || 0),
            });
        }
    }
};

module.exports = ParticleMixin;