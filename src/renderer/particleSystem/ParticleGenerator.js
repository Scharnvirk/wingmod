function ParticleGenerator(config){
    THREE.Points.apply(this, arguments);

    config = config || {};
    config.positionZ = config.positionZ || 10;
    config.maxParticles = config.maxParticles || 100;
    config.resolutionCoefficient = config.resolutionCoefficient || 1;

    config.positionHiddenFromView = 100000;

    Object.assign(this, config);

    this.position.z = config.positionZ;

    if(!this.material) throw new Error('No material defined for ParticleGenerator!');

    this.usedPoints = new Float32Array( this.maxParticles );
    this.nextPointer = 0;

    this.geometry = this.createGeometry();
    this.tick = 0;
}

ParticleGenerator.extend(THREE.Points);

ParticleGenerator.prototype.createGeometry = function(){
    let geometry = new THREE.BufferGeometry();

    let vertices = new Float32Array( this.maxParticles * 3 );
    let colors = new Float32Array( this.maxParticles * 3 );
    let speeds = new Float32Array( this.maxParticles * 3 );
    let alphas = new Float32Array( this.maxParticles * 2 );
    let configs = new Float32Array( this.maxParticles * 4 );

    for ( let i = 0; i < this.maxParticles; i++ )
    {
    	vertices[ i*3 + 0 ] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
    	vertices[ i*3 + 1 ] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
    	vertices[ i*3 + 2 ] = 0;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ));
    geometry.addAttribute('color', new THREE.BufferAttribute( colors, 3 ));
    geometry.addAttribute('speed', new THREE.BufferAttribute( speeds, 3 ));
    geometry.addAttribute('alpha', new THREE.BufferAttribute( alphas, 2 ));
    geometry.addAttribute('configs', new THREE.BufferAttribute( configs, 4 ));

    this.positionHandle = geometry.attributes.position.array;
    this.alphaHandle = geometry.attributes.alpha.array;
    this.colorHandle = geometry.attributes.color.array;
    this.speedHandle = geometry.attributes.speed.array;
    this.configsHandle = geometry.attributes.configs.array;

    return geometry;
};

ParticleGenerator.prototype.create = function(config){
    this.initParticle(this.nextPointer, config);
    this.nextPointer ++;
    if (this.nextPointer > this.maxParticles){
        this.nextPointer = 0;
    }
};

ParticleGenerator.prototype.deactivate = function(particleId){
    this.positionHandle[particleId * 3] = this.positionHiddenFromView;
    this.positionHandle[particleId * 3 + 1] = this.positionHiddenFromView;
};

ParticleGenerator.prototype.update = function(){
    this.tick += 1;

    this.material.uniforms.time.value = this.tick;
    this.material.uniforms.pixelRatio = Math.round(window.devicePixelRatio*10)/10 || 0.1;

    // this.geometry.attributes.position.needsUpdate = true;
    // this.geometry.attributes.speed.needsUpdate = true;
    // this.geometry.attributes.alpha.needsUpdate = true;
    // this.geometry.attributes.color.needsUpdate = true;
    // this.geometry.attributes.configs.needsUpdate = true;

    this.frameResolution = this.resolutionCoefficient * 1/(window.devicePixelRatio);
};

ParticleGenerator.prototype.initParticle = function(particleId, config){
    // let particle3 = particleId * 3;
    // let offsetPosition = Utils.rotationToVector(config.particleRotation, config.particleVelocity);
    // this.positionHandle[particle3] = config.positionX;
    // this.positionHandle[particle3 + 1] = config.positionY;
    // this.positionHandle[particle3 + 2] = config.positionZ || 0;
    // this.colorHandle[particle3] = config.colorR;
    // this.colorHandle[particle3 + 1] = config.colorG;
    // this.colorHandle[particle3 + 2] = config.colorB;
    // this.alphaHandle[particleId * 2] = config.alpha;
    // this.alphaHandle[particleId * 2 + 1] = config.alphaMultiplier;
    // this.speedHandle[particle3] = offsetPosition[0];
    // this.speedHandle[particle3 + 1] = offsetPosition[1];
    // this.speedHandle[particle3 + 2] = config.speedZ || 0;
    // this.configsHandle[particleId * 4] = config.scale * this.frameResolution;
    // this.configsHandle[particleId * 4 + 1] = this.tick;
    // this.configsHandle[particleId * 4 + 2] = config.lifeTime;
    // this.configsHandle[particleId * 4 + 3] = config.spriteNumber || 0;
};

ParticleGenerator.prototype.updateResolutionCoefficient = function(resolutionCoefficient){
    this.resolutionCoefficient = resolutionCoefficient;
};

module.exports = ParticleGenerator;
