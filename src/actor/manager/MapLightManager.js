class MapLightManager extends Manager{
    constructor(scene, camera){
        super(scene);
        this._camera = camera;
        this._cameraFrustum = new THREE.Frustum();
        this._frustumTestSphere = new THREE.Sphere();
    }

    updateCameraFrustum() {
        this._cameraFrustum.setFromMatrix( new THREE.Matrix4().multiplyMatrices( this._camera.projectionMatrix, this._camera.matrixWorldInverse ) );
    }

    update() {
        super.update();
        this.updateCameraFrustum();
        this._objectPool.forEach((lightActor) => {
            this._frustumTestSphere.center = lightActor.position;
            this._frustumTestSphere.radius = lightActor.diameter;
            var lightActorVisibleBefore = lightActor.visible;
            lightActor.visible = this._cameraFrustum.intersectsSphere(this._frustumTestSphere);

            if (lightActorVisibleBefore && !lightActor.visible){
               lightActor.setVisible(false);
               //console.log("removing light from scene (at "+lightActor.position.x+","+lightActor.position.y);
            }

            if (!lightActorVisibleBefore && lightActor.visible){
               lightActor.setVisible(true);
               //console.log("adding light to scene (at "+lightActor.position.x+","+lightActor.position.y);
            }
        });
    }
}
