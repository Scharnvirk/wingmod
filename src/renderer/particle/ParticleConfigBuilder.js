function ParticleConfigBuilder(){
    this.particleMapConfig = {
        particleAdd: THREE.ImageUtils.loadTexture( "/gfx/particleAdd.png" )
    };

    this.particleMaterialConfig = {
        whiteAdd: new THREE.PointsMaterial( {
            size: 20,
            map: this.particleMapConfig.particleAdd,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            color: 0xffffff,
            transparent : true
        }),
        redAdd: new THREE.PointsMaterial( {
            size: 20,
            map: this.particleMapConfig.particleAdd,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            color: 0xff000000,
            transparent : true
        })
    };

    this.particleGeneratorConfig = [
        {
            material: this.particleMaterialConfig.whiteAdd,
            maxParticleInstances: 1000
        },
        {
            material: this.particleMaterialConfig.redAdd,
            maxParticleInstances: 1000
        },
    ];
}

ParticleConfigBuilder.prototype.getConfig = function(){
    return this.particleGeneratorConfig;
};
