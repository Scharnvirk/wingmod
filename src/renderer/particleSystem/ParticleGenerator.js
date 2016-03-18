function ParticleGenerator(config){
    THREE.Points.apply(this, arguments);

    config = config || {};
    config.positionZ = config.positionZ || 10;
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

ParticleGenerator.extend(THREE.Points);

ParticleGenerator.prototype.createGeometry = function(){
    let geometry = new THREE.BufferGeometry();

    let vertices = new Float32Array( this.maxParticles * 3 );
    let types = new Float32Array( this.maxParticles * 1 );
    let colors = new Float32Array( this.maxParticles * 3 );
    let speeds = new Float32Array( this.maxParticles * 2 );
    let alphas = new Float32Array( this.maxParticles * 2 );
    let scales = new Float32Array( this.maxParticles * 1 );
    let startTimes = new Float32Array( this.maxParticles * 1 );
    let lifeTimes = new Float32Array( this.maxParticles * 1 );

    for ( let i = 0; i < this.maxParticles; i++ )
    {
    	vertices[ i*3 + 0 ] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
    	vertices[ i*3 + 1 ] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
    	vertices[ i*3 + 2 ] = this.positionZ;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ));
    geometry.addAttribute('color', new THREE.BufferAttribute( colors, 3 ));
    geometry.addAttribute('speed', new THREE.BufferAttribute( speeds, 2 ));
    geometry.addAttribute('alpha', new THREE.BufferAttribute( alphas, 2 ));
    geometry.addAttribute('scale', new THREE.BufferAttribute( scales, 1 ));
    geometry.addAttribute('startTime', new THREE.BufferAttribute( startTimes, 1 ));
    geometry.addAttribute('lifeTime', new THREE.BufferAttribute( lifeTimes, 1 ));

    this.positionHandle = geometry.attributes.position.array;
    this.alphaHandle = geometry.attributes.alpha.array;
    this.colorHandle = geometry.attributes.color.array;
    this.scaleHandle = geometry.attributes.scale.array;
    this.speedHandle = geometry.attributes.speed.array;
    this.startTimeHandle = geometry.attributes.startTime.array;
    this.lifeTimeHandle = geometry.attributes.lifeTime.array;

    return geometry;
};

ParticleGenerator.prototype.create = function(config){
    var particleId = this.nextPointer;
    this.nextPointer ++;
    if (this.nextPointer > this.maxParticles){
        this.nextPointer = 0;
    }

    this.initParticle(particleId, config);
};

ParticleGenerator.prototype.deactivate = function(particleId){
    this.positionHandle[particleId * 3] = this.positionHiddenFromView;
    this.positionHandle[particleId * 3 + 1] = this.positionHiddenFromView;
};

ParticleGenerator.prototype.update = function(){
    this.tick += 1;

    this.material.uniforms.time.value = this.tick;

    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.speed.needsUpdate = true;

    this.geometry.attributes.alpha.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.scale.needsUpdate = true;
    this.geometry.attributes.startTime.needsUpdate = true;
    this.geometry.attributes.lifeTime.needsUpdate = true;


};

ParticleGenerator.prototype.initParticle = function(particleId, config){
    var offsetPosition = Utils.angleToVector(config.particleAngle, config.particleVelocity);
    this.positionHandle[particleId * 3] = config.positionX;
    this.positionHandle[particleId * 3 + 1] = config.positionY;
    this.colorHandle[particleId * 3] = config.colorR;
    this.colorHandle[particleId * 3 + 1] = config.colorG;
    this.colorHandle[particleId * 3 + 2] = config.colorB;
    this.scaleHandle[particleId] = config.scale * this.resolutionCoefficient;
    this.alphaHandle[particleId * 2] = config.alpha;
    this.alphaHandle[particleId * 2 + 1] = config.alphaMultiplier;
    this.speedHandle[particleId * 2] = offsetPosition[0];
    this.speedHandle[particleId * 2 + 1] = offsetPosition[1];
    this.startTimeHandle[particleId] = this.tick;
    this.lifeTimeHandle[particleId] = config.lifeTime;
};

module.exports = ParticleGenerator;
