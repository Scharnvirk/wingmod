function RavierMesh(config){
    BaseMesh.apply(this, arguments);
    //this.angleOffset = Math.PI;

    config = config || {};
    config.geometry = ModelStore.get('ravier').geometry;
    config.material = ModelStore.get('ravier').material;
    Object.assign(this, config);
}


RavierMesh.extend(BaseMesh);
