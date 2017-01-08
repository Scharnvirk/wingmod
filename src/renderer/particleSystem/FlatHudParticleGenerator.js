function FlatHudParticleGenerator(config){
    THREE.Points.apply(this, arguments);

    config = config || {};
    config.maxParticles = config.maxParticles || 100;
    config.resolutionCoefficient = config.resolutionCoefficient || 1;

    config.positionHiddenFromView = 100000;

    Object.assign(this, config);

    if(!this.material) throw new Error('No material defined for ParticleGenerator!');

    this.usedPoints = new Float32Array( this.maxParticles );
    this.nextPointer = 0;

    this.geometry = this.createGeometry();
    this.tick = 0;
}

FlatHudParticleGenerator.extend(THREE.Points);

FlatHudParticleGenerator.prototype.createGeometry = function(){
    let geometry = new THREE.BufferGeometry();

    let vertices = new Float32Array( this.maxParticles * 3 );
    let color = new Float32Array( this.maxParticles * 4 );
    let configs = new Float32Array( this.maxParticles * 4 );

    for ( let i = 0; i < this.maxParticles; i++ )
    {
    	vertices[ i*3 + 0 ] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
    	vertices[ i*3 + 1 ] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
    	vertices[ i*3 + 2 ] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
        configs[ i*4 + 3 ] = 0;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ));
    geometry.addAttribute('color', new THREE.BufferAttribute( color, 4 ));
    geometry.addAttribute('configs', new THREE.BufferAttribute( configs, 4 ));

    this.positionHandle = geometry.attributes.position.array;
    this.colorHandle = geometry.attributes.color.array;
    this.configsHandle = geometry.attributes.configs.array;

    return geometry;
};

FlatHudParticleGenerator.prototype.create = function(config){
    this.initParticle(this.nextPointer, config);
    this.nextPointer ++;
    if (this.nextPointer > this.maxParticles){
        this.nextPointer = 0;
    }
};

FlatHudParticleGenerator.prototype.deactivate = function(particleId){
    this.positionHandle[particleId * 3] = this.positionHiddenFromView;
    this.positionHandle[particleId * 3 + 1] = this.positionHiddenFromView;
    this.positionHandle[particleId * 3 + 2] = this.positionHiddenFromView;
    this.configsHandle[particleId * 4 + 3] = 0;
};

FlatHudParticleGenerator.prototype.reset = function(){
    for (var i = 0, l = this.nextPointer; i < l; i++){
        this.deactivate(i);
    }
    this.nextPointer = 0;
};

FlatHudParticleGenerator.prototype.update = function(){
    this.tick += 1;

    this.material.uniforms.time.value = this.tick;
    this.material.uniforms.pixelRatio = Math.round(window.devicePixelRatio*10)/10 || 0.1;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.configs.needsUpdate = true;

    this.frameResolution = this.resolutionCoefficient * 1/(window.devicePixelRatio);
};

FlatHudParticleGenerator.prototype.initParticle = function(particleId, config){
    let particle3 = particleId * 3;
    let particle4 = particleId * 4;

    this.positionHandle[particle3 ] = config.positionX;
    this.positionHandle[particle3 + 1] = config.positionY;
    this.positionHandle[particle3 + 2] = config.positionZ;

    this.colorHandle[particle4 ] = config.colorR;
    this.colorHandle[particle4 + 1] = config.colorG;
    this.colorHandle[particle4 + 2] = config.colorB;
    this.colorHandle[particle4 + 3] = config.colorA;

    this.configsHandle[particle4 ] = config.scale * this.frameResolution;
    this.configsHandle[particle4 + 1] = config.offset;
    this.configsHandle[particle4 + 2] = config.spriteNumber || 0;
    this.configsHandle[particle4 + 3] = config.size;
};

FlatHudParticleGenerator.prototype.updateResolutionCoefficient = function(resolutionCoefficient){
    this.resolutionCoefficient = resolutionCoefficient;
};

module.exports = FlatHudParticleGenerator;
