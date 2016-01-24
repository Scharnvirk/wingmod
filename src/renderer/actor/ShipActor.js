function ShipActor(){
    BaseActor.apply(this, arguments);

    this.particleSystem = this.createParticleSystem();

    gameCore.actorManager.scene.add(this.particleSystem);

    this.particleOptions = {
        position: new THREE.Vector3(),
        positionRandomness: 0.3,
        velocity: new THREE.Vector3(),
        velocityRandomness: 5,
        color: 0xaa88ff,
        colorRandomness: 0,
        turbulence: 0.5,
        lifetime: 5,
        size: 5,
        sizeRandomness: 1
    };

    this.startTime = Date.now();

    this.particleOptions.position.z = this.positionZ;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMesh = function(){
    return new ShipMesh({actor: this, scaleX: 4, scaleY: 4, scaleZ: 4});
};

ShipActor.prototype.createParticleSystem = function(){
    return new THREE.GPUParticleSystem({
        maxParticles: 100000
    });
};

ShipActor.prototype.customUpdate = function(){
    this.particleOptions.position.x = this.position[0];
    this.particleOptions.position.y = this.position[1];

    // for (var x = 0; x < 100; x++) {
    //       this.particleSystem.spawnParticle(this.particleOptions);
    // }
    //
    // this.particleSystem.update((Date.now() - this.startTime) / 1000);
};
