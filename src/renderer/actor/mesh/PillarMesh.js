function PillarMesh(config){
    BaseMesh.apply(this, arguments);
    this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = new THREE.BoxGeometry(20,20,50,50);
    config.material = new THREE.MeshLambertMaterial({color: 0x505050});
    Object.assign(this, config);

    this.castShadow = true;
    this.receiveShadow = true;

}


PillarMesh.extend(BaseMesh);
