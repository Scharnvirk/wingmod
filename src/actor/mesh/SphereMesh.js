class SphereMesh extends BaseMesh{
    constructor(actor, radius, color){
        super(actor);
        this.radius = radius;
        this.color = color;
        this.mesh = this.createMesh();
        //this.matchMeshAndActorAngles();
    }

    createMesh(){
        var radius = this.radius || 1;
        var segments = 8;
        var rings = 8;

        var sphereMaterial = new THREE.MeshLambertMaterial({
            color: this.color || 0xffffff
        });

        var mesh = new THREE.Mesh(
            new THREE.SphereGeometry(
                radius,
                segments,
                rings),
            sphereMaterial
        );

        return mesh;
    }
}
