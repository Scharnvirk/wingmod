function ParticleConfigBuilder(){
    this.particleMaterialConfig = {
        smokePuffAlpha: new THREE.ShaderMaterial( {
             uniforms:       { map: { type: "t", value: new THREE.TextureLoader().load( "/gfx/smokePuffAlpha.png" ) }},
             vertexShader:   ParticleShaders.vertexShader,
             fragmentShader: ParticleShaders.fragmentShader,
             transparent:    true
        }),
        particleAdd: new THREE.ShaderMaterial( {
             uniforms:       { map: { type: "t", value: new THREE.TextureLoader().load( "/gfx/particleAdd.png" ) }},
             vertexShader:   ParticleShaders.vertexShader,
             fragmentShader: ParticleShaders.fragmentShader,
             blending: THREE.AdditiveBlending,
             transparent: true
        })
    };

    this.particleGeneratorConfig = {
        smokePuffAlpha: {
            material: this.particleMaterialConfig.smokePuffAlpha,
            maxParticles: 5000,
            positionZ: 9
        },
        particleAdd: {
            material: this.particleMaterialConfig.particleAdd,
            maxParticles: 5000,
            positionZ: 9
        }
    };
}

ParticleConfigBuilder.prototype.getConfig = function(configName){
    return this.particleGeneratorConfig[configName];
};

ParticleConfigBuilder.prototype.getAllConfigs = function(){
    return this.particleGeneratorConfig;
};
