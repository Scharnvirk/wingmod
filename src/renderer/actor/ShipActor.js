function ShipActor(){
    BaseActor.apply(this, arguments);

    this.particleOptions = {
        position: new THREE.Vector3(),
        positionRandomness: 0.3,
        velocity: new THREE.Vector3(),
        velocityRandomness: 5,
        color: 0xffffff,
        colorRandomness: 0,
        turbulence: 0.5,
        lifetime: 3,
        size: 4,
        sizeRandomness: 1
    };

    this.particleOptions.position.z = this.positionZ;
}

ShipActor.extend(BaseActor);

ShipActor.prototype.createMesh = function(){
    return new RavierMesh({actor: this, scaleX: 6, scaleY: 6, scaleZ: 6});
};
//
// ShipActor.prototype.customUpdate = function(){
//     var naiveDistance = Math.abs(this.logicPosition[0] - this.logicPreviousPosition[0]) + Math.abs(this.logicPosition[1] - this.logicPreviousPosition[1]);
//
//     this.particleOptions.position.x = this.position[0];
//     this.particleOptions.position.y = this.position[1];
//
//     for (var x = 1; x < naiveDistance; x++) {
//           this.particleSystem.spawnParticle(this.particleOptions);
//           this.particleSystem.spawnParticle(this.particleOptions);
//           this.particleSystem.spawnParticle(this.particleOptions);
//           this.particleSystem.spawnParticle(this.particleOptions);
//     }
// };
