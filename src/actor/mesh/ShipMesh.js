class ShipMesh extends BaseMesh{
    constructor(actor, radius, color){
        super(actor);
        this.radius = radius;
        this.color = color;
        this.angleOffset = 180;
        this.mesh = this.createMesh();
    }

    createMesh(){
        ModelStore.get('ship').material.color.setHex(Utils.makeRandomColor());
        var mesh = new THREE.Mesh(ModelStore.get('ship').geometry, ModelStore.get('ship').material);
        return mesh;
    }
}
