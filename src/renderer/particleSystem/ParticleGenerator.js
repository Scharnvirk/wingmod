function ParticleGenerator(config){
    THREE.Points.apply(this, arguments);

    config = config || {};
    config.positionZ = config.positionZ || 10;
    config.maxParticles = config.maxParticles || 100;
    config.resolutionCoefficient = config.resolutionCoefficient || 1;
    config.needsUpdate = config.needsUpdate || false;
    config.autoUpdate = config.autoUpdate || true;
 
    config.positionHiddenFromView = 100000;

    Object.assign(this, config);

    this.position.z = config.positionZ;

    if(!this.material) throw new Error('No material defined for ParticleGenerator!');

    this.usedPoints = new Float32Array( this.maxParticles );
    this.nextPointer = 0;

    this.geometry = this.createGeometry();
    this.tick = 0;

    this.particleColors = this.createColors();
}

ParticleGenerator.extend(THREE.Points);

ParticleGenerator.prototype.createColors = function(){ 
    return {
        //red + blue*512 + green*512*512
        GREEN: 120 + 256*512 + 200*262144,
        GREY: 120 + 120*512 + 120*262144,
        BLUE: 100 + 100*512 + 256*262144,
        ORANGE: 256 + 150*512 + 50*262144,
        YELLOW: 256 + 200*512 + 100*262144,
        RED: 256 + 200*512 + 200*262144,
        PURPLE: 100 + 0*512 + 256*262144,
        WHITE: 256 + 256*512 + 256*262144,
        DEEPRED: 256 + 0*512 + 0*262144,
        DEEPGREEN: 0 + 180*512 + 0*262144,
        DEEPBLUE: 0 + 100*512 + 256*262144,
        DEEPYELLOW: 255 + 200*512 + 0*262144
    };
};

ParticleGenerator.prototype.createGeometry = function(){
    let geometry = new THREE.BufferGeometry();

    let positions = new Float32Array( this.maxParticles * 3 );
    let speeds = new Float32Array( this.maxParticles * 4 );
    let configs = new Float32Array( this.maxParticles * 4 );

    for ( let i = 0; i < this.maxParticles; i++ )
    {
    	positions[ i*3 + 0 ] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
    	positions[ i*3 + 1 ] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
    	positions[ i*3 + 2 ] = 0;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute( positions, 3 ));
    geometry.addAttribute('speed', new THREE.BufferAttribute( speeds, 4 ));
    geometry.addAttribute('configs', new THREE.BufferAttribute( configs, 4 ));

    geometry.attributes.position.dynamic = true;
    geometry.attributes.speed.dynamic = true;
    geometry.attributes.configs.dynamic = true;

    this.positionHandle = geometry.attributes.position.array;
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

ParticleGenerator.prototype.reset = function(){
    for (var i = 0, l = this.nextPointer; i < l; i++){
        this.deactivate(i);
    }
    this.nextPointer = 0;
};

ParticleGenerator.prototype.deactivate = function(particleId){
    this.positionHandle[particleId * 3] = this.positionHiddenFromView;
    this.positionHandle[particleId * 3 + 1] = this.positionHiddenFromView;
};

ParticleGenerator.prototype.update = function(){
    this.tick += 1;

    this.material.uniforms.time.value = this.tick;
    this.material.uniforms.pixelRatio = Math.round(window.devicePixelRatio*10)/10 || 0.1;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.speed.needsUpdate = true;
    this.geometry.attributes.configs.needsUpdate = true;

    this.frameResolution = this.resolutionCoefficient * 1/(window.devicePixelRatio);
};

ParticleGenerator.prototype.initParticle = function(particleId, config){
    let particle4 = particleId * 4;
    let particle3 = particleId * 3;    
    let offsetPosition = Utils.rotationToVector(config.particleRotation, config.particleVelocity);
    this.positionHandle[particle3] = config.positionX;
    this.positionHandle[particle3 + 1] = config.positionY;
    this.positionHandle[particle3 + 2] = config.positionZ || 0;    

    this.speedHandle[particle4] = offsetPosition[0];
    this.speedHandle[particle4 + 1] = offsetPosition[1];
    this.speedHandle[particle4 + 2] = config.speedZ || 0;
    this.speedHandle[particle4 + 3] = (config.alpha || 0) + 1024 * (config.alphaMultiplier * 1000 || 0);

    this.configsHandle[particle4] = config.scale * this.frameResolution;
    this.configsHandle[particle4 + 1] = this.tick;
    this.configsHandle[particle4 + 2] = config.lifeTime + 1024*(config.spriteNumber || 0);// + 1048576 * 12; // this.particleColors[config.color || 0];
    this.configsHandle[particle4 + 3] = this.particleColors[config.color || 0];
};

ParticleGenerator.prototype.updateResolutionCoefficient = function(resolutionCoefficient){
    this.resolutionCoefficient = resolutionCoefficient;
};

module.exports = ParticleGenerator;
