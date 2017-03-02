function ChunkMesh(config){
    config = config || {};

    config.geometry.dynamic = false;

    config.material.shading = THREE.FlatShading;   

    THREE.Mesh.apply(this, [config.geometry, config.material]);  

    this.receiveShadow = true;
    this.castShadow = true;
    this.matrixAutoUpdate = false;

    Object.assign(this, config);

    this.rotation.x = Utils.degToRad(90);
    this.updateMatrix();
}

ChunkMesh.extend(THREE.Mesh);

ChunkMesh.prototype.setPosition = function(position2d){
    if (!position2d || position2d.length !== 2) throw new Error('No or invalid position2d array specified for ChunkMesh.setPosition!');
    this.position.x = position2d[0] * Constants.CHUNK_SIZE;
    this.position.y = position2d[1] * Constants.CHUNK_SIZE;
    this.updateMatrix();
};

ChunkMesh.prototype.setRotation = function(rotation){
    if (typeof rotation === 'undefined') throw new Error('No rotation specified for ChunkMesh.setRotation!');
    this.rotation.y = Utils.degToRad(rotation);
    this.updateMatrix();
};


module.exports = ChunkMesh;
