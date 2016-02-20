function WallMesh(config){
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(800,2,50,50);
    config.material = new THREE.MeshLambertMaterial({color: 0x505050});
    Object.assign(this, config);

    this.receiveShadow = true;
}


WallMesh.extend(BaseMesh);
