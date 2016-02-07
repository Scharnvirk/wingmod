function ParticleGenerator(config){
    THREE.Points.apply(this, arguments);

    config = config || {};
    config.positionZ = config.positionZ || 10;
    config.maxParticleInstances = config.maxParticleInstances || 100;

    config.positionHiddenFromView = 1000000;

    Object.assign(this, config);

    this.usedPoints = [];
    this.freePoints = [];
    this.geometry = this.createGeometry();

    if(!this.material) throw new Error('No material defined for ParticleGenerator!');
}

ParticleGenerator.extend(THREE.Points);

ParticleGenerator.createGeometry = function(){
    let geometry = new THREE.Geometry();
    for (let i = 0; i < this.maxParticleInstances; i++){
        let vertex = new THREE.Vector3();
        vertex.x = this.positionHiddenFromView;
        vertex.y = this.positionHiddenFromView;
        vertex.z = this.positionZ;
        geometry.vertices.push( vertex );
        this.freePoints.push(i);
    }
    return geometry;
};

ParticleGenerator.getPoint = function(){
    var pointId = this.freePoints.length > 0 ? this.freePoints.shift() : this.usedPoints.shift();
    this.usedPoints.push(pointId); //tak, moze wyslac ten sam obiekt na koniec - to jest ok
};

ParticleGenerator.releasePoint = function(pointId){
    this.usedPoints.splice(this.usedPoints.indexOf(pointId), 1);
    this.freePoints.push(pointId);
};

/*
for(let t = 0; t < 50; t++){
    this.geometries[t] =  new THREE.Geometry();
    for (let i = 0; i < 1000; i ++ ) {

        var vertex = new THREE.Vector3();
        vertex.x = Utils.rand(-300,300)-50000;
        vertex.y = Utils.rand(-300,300)-50000;
        vertex.z = 0;

        this.geometries[t].vertices.push( vertex );

    }

    material = new THREE.PointsMaterial( {
        size: 20,
        map: map,
        blending: THREE.AdditiveBlending,
        depthTest: true,
        color: Utils.makeRandomColor(),
        transparent : true
    });

    var particles = new THREE.Points( this.geometries[t], material );
    this.scene.add( particles );
}*/
