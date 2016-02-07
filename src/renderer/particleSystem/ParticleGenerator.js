function ParticleGenerator(config){
    THREE.Points.apply(this, arguments);

    config = config || {};
    config.positionZ = config.positionZ || 10;
    config.maxParticles = config.maxParticles || 100;

    config.positionHiddenFromView = 500;

    Object.assign(this, config);

    if(!this.material) throw new Error('No material defined for ParticleGenerator!');

    this.usedPoints = new Float32Array( this.maxParticles );
    this.nextPointer = 0;
    //this.freePoints = Array.apply(null, {length: this.maxParticles}).map(Number.call, Number);
    this.geometry = this.createGeometry();
}

ParticleGenerator.extend(THREE.Points);

ParticleGenerator.prototype.createGeometry = function(){
    let geometry = new THREE.BufferGeometry();

    let vertices = new Float32Array( this.maxParticles * 3 );
    let colors = new Float32Array( this.maxParticles * 3 );
    let alphas = new Float32Array( this.maxParticles * 1 );
    let scales = new Float32Array( this.maxParticles * 1 );
    let lifeTime = new Float32Array( this.maxParticles * 1 );

    for ( let i = 0; i < this.maxParticles; i++ )
    {
    	vertices[ i*3 + 0 ] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
    	vertices[ i*3 + 1 ] = Utils.rand(-this.positionHiddenFromView, this.positionHiddenFromView);
    	vertices[ i*3 + 2 ] = this.positionZ;

        lifeTime[ i ] = -1;
    }

    geometry.addAttribute('position', new THREE.BufferAttribute( vertices, 3 ));
    geometry.addAttribute('alpha', new THREE.BufferAttribute( alphas, 1 ));
    geometry.addAttribute('color', new THREE.BufferAttribute( colors, 3 ));
    geometry.addAttribute('scale', new THREE.BufferAttribute( scales, 1 ));
    geometry.lifeTime = lifeTime;

    return geometry;
};

ParticleGenerator.prototype.create = function(initConfig){
    var particleId = this.nextPointer;
    this.nextPointer ++;
    if (this.nextPointer > this.maxParticles){
        this.nextPointer = 0;
    }

    this.initParticle(particleId, initConfig);
    // var particleId = this.freePoints.length > 0 ? this.freePoints.shift() : this.usedPoints.shift();
    // this.usedPoints.push(particleId); //tak, moze wyslac ten sam obiekt na koniec - to jest ok
    //this.initParticle(particleId, initConfig);
};

ParticleGenerator.prototype.release = function(particleId){
    this.usedPoints.splice(this.usedPoints.indexOf(particleId), 1);
    this.freePoints.push(particleId);
};

ParticleGenerator.prototype.deactivate = function(particleId){
    this.geometry.attributes.position.array[particleId * 3] = this.positionHiddenFromView;
    this.geometry.attributes.position.array[particleId * 3 + 1] = this.positionHiddenFromView;
};

ParticleGenerator.prototype.update = function(){
    for(let i = 0; i < this.maxParticles; i++){
        this.updateParticle(i);
    }
    this.geometry.attributes.alpha.needsUpdate = true;
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.color.needsUpdate = true;
    this.geometry.attributes.scale.needsUpdate = true;
};

ParticleGenerator.prototype.updateParticle = function(particleId){
    if (this.geometry.lifeTime[particleId] === 0){
        this.deactivate(particleId);
        this.geometry.lifeTime[particleId] = -1;
    } else {
        this.geometry.attributes.alpha.array[particleId] *= 0.95;
        this.geometry.lifeTime[particleId] -= 1;
    }


};

ParticleGenerator.prototype.initParticle = function(particleId, initConfig){
    let attributes = this.geometry.attributes;
    attributes.position.array[particleId * 3] = initConfig[0];
    attributes.position.array[particleId * 3 + 1] = initConfig[1];
    attributes.color.array[particleId * 3] = initConfig[2];
    attributes.color.array[particleId * 3 + 1] = initConfig[3];
    attributes.color.array[particleId * 3 + 2] = initConfig[4];
    attributes.scale.array[particleId] = initConfig[5];
    attributes.alpha.array[particleId] = initConfig[6];
    this.geometry.lifeTime[particleId] = initConfig[7];
};
