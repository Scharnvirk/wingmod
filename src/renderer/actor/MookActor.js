function MookActor(){
    BaseActor.apply(this, arguments);

    this.particleOptions = {
        position: new THREE.Vector3(),
        positionRandomness: 0.3,
        velocity: new THREE.Vector3(),
        velocityRandomness: 3,
        color: 0xff0000,
        colorRandomness: 0,
        turbulence: 0.2,
        lifetime: 2,
        size: 2,
        sizeRandomness: 1
    };

    this.particleOptions.position.z = this.positionZ;
}

MookActor.extend(BaseActor);

MookActor.prototype.createMesh = function(){
    return new ShipMesh({actor: this});
};

MookActor.prototype.customUpdate = function(){
    var naiveDistance = Math.abs(this.logicPosition[0] - this.logicPreviousPosition[0]) + Math.abs(this.logicPosition[1] - this.logicPreviousPosition[1]);

    this.particleOptions.position.x = this.position[0];
    this.particleOptions.position.y = this.position[1];

    for (var x = 1; x < naiveDistance/2; x++) {
          this.particleSystem.spawnParticle(this.particleOptions);
          this.particleSystem.spawnParticle(this.particleOptions);
    }
};
