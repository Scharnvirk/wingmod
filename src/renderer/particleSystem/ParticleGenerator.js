function ParticleGenerator(config){
    THREE.Points.apply(this, arguments);

    config = config || {};
    config.positionZ = config.positionZ || 10;
    config.maxParticles = config.maxParticles || 100;

    config.positionHiddenFromView = 100000;

    Object.assign(this, config);

    if(!this.material) throw new Error('No material defined for ParticleGenerator!');

    this.usedPoints = new Float32Array( this.maxParticles );
    this.nextPointer = 0;
    this.geometry = this.createGeometry();
}

ParticleGenerator.extend(THREE.Points);

ParticleGenerator.prototype.createGeometry = function(){
    let geometry = new THREE.BufferGeometry();

    let vertices = new Float32Array( this.maxParticles * 3 );
    let colors = new Float32Array( this.maxParticles * 3 );
    let speeds = new Float32Array( this.maxParticles * 2 );
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
    geometry.addAttribute('speed', new THREE.BufferAttribute( speeds, 2 ));
    geometry.lifeTime = lifeTime;

    return geometry;
};

ParticleGenerator.prototype.create = function(positionX, positionY, colorR, colorG, colorB, scale, alpha, lifeTime, speedX, speedY){
    var particleId = this.nextPointer;
    this.nextPointer ++;
    if (this.nextPointer > this.maxParticles){
        this.nextPointer = 0;
    }

    this.initParticle(particleId, positionX, positionY, colorR, colorG, colorB, scale, alpha, lifeTime, speedX, speedY);
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
    var lifeTime = this.geometry.lifeTime;
    if (lifeTime[particleId] === 0){
        this.deactivate(particleId);
        //lifeTime[particleId] = -1;
    } else {
        this.geometry.attributes.alpha.array[particleId] *= 0.9;
        this.geometry.attributes.position.array[particleId * 3] += this.geometry.attributes.speed.array[particleId * 2];
        this.geometry.attributes.position.array[particleId * 3 + 1] += this.geometry.attributes.speed.array[particleId * 2 + 1];
        lifeTime[particleId] -= 1;
    }


};

ParticleGenerator.prototype.initParticle = function(particleId, positionX, positionY, colorR, colorG, colorB, scale, alpha, lifeTime, speedX, speedY){
    let attributes = this.geometry.attributes;
    attributes.position.array[particleId * 3] = positionX;
    attributes.position.array[particleId * 3 + 1] = positionY;
    attributes.color.array[particleId * 3] = colorR;
    attributes.color.array[particleId * 3 + 1] = colorG;
    attributes.color.array[particleId * 3 + 2] = colorB;
    attributes.scale.array[particleId] = scale;
    attributes.alpha.array[particleId] = alpha;
    attributes.speed.array[particleId * 2] = speedX;
    attributes.speed.array[particleId * 2 + 1] = speedY;
    this.geometry.lifeTime[particleId] = lifeTime;
};
