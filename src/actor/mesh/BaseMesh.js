class BaseMesh{
    constructor(actor){
        this.actor = actor;
        this.followActor = true;
        this.meshRotationVector = new THREE.Vector3(0,0,1);
        this.angleOffset = 0;
    }

    update(position, deltaAngle, positionZ){
        if(this.followActor && this.mesh){
            this.mesh.position.x = position[0];
            this.mesh.position.y = position[1];
            this.mesh.position.z = positionZ;
            this.mesh.rotation.z = Utils.degToRad(this.actor.angle + this.angleOffset);
        }
    }

    createMesh(){
        return null;
    }

    get(){
        return this.mesh;
    }
}
