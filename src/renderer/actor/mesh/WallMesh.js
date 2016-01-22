function WallMesh(config){
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(400,2,50);
    config.material = new THREE.MeshLambertMaterial({color: 0xffffff});
    Object.assign(this, config);

}


WallMesh.extend(BaseMesh);
