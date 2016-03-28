class GameScene {
    constructor(config) {
        Object.assign(this, config);
        this.lightCounter = 0;
        this.shadows = config.shadows;
    }

    makeWalls () {
        var walls = [];
        var wall;

        var material = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });

        var wallGeometry = new THREE.BoxGeometry(5,50,5,1,1,1);

        for(var i = 0; i < 100; i++){
            wall = new THREE.Mesh(wallGeometry,material);
            wall.position.x = Utils.rand(-200,200);
            wall.position.y = Utils.rand(-200,200);
            wall.position.z = Utils.rand(0,2);
            wall.rotateZ(Utils.degToRad(Utils.rand(0,360)));
            walls.push(wall);
        }

        var combine = new THREE.Geometry();

        walls.forEach((w) => {
            w.updateMatrix();
            combine.merge(w.geometry, w.matrix);
        });

        return new THREE.Mesh(combine, material);
    }

    make() {

        var combine = new THREE.Geometry();
        var planeTex = new THREE.TextureLoader().load("/models/floor.png");
        planeTex.wrapS = planeTex.wrapT = THREE.RepeatWrapping;
        planeTex.repeat.set( 10, 10 );
        var geometry = new THREE.PlaneGeometry(800, 800, 2, 2);
        var material = new THREE.MeshPhongMaterial({ color: 0x888888, map: planeTex });
        var floor = new THREE.Mesh(geometry, material);

        floor.updateMatrix();
        combine.merge(floor.geometry, floor.matrix);

        var walls = this.makeWalls();
        combine.merge(walls.geometry, walls.matrix);
        var combinedObject = new THREE.Mesh(combine, material);
        combinedObject.receiveShadow = true;
        combinedObject.castShadow = true;
        combinedObject.matrixAutoUpdate = false;
        combinedObject.updateMatrix();

        this.scene.add(combinedObject);

        var lcolor = Utils.makeRandomColor(128, 256);

        this.directionalLight = new THREE.DirectionalLight( lcolor, 1 );
        this.directionalLight.position.set( 0, 0, 200 );
        this.directionalLight.distance = 1000;

        this.directionalLight.castShadow = this.shadows;
        this.directionalLight.shadowCameraNear = 1;
        this.directionalLight.shadowCameraFar = 400;
        this.directionalLight.shadowMapWidth = 2048;
        this.directionalLight.shadowMapHeight = 2048;
        this.directionalLight.shadowBias = 0;
        this.directionalLight.shadowDarkness = 0.4;

        this.scene.add( this.directionalLight );

        this.scene.fog = new THREE.Fog( 0x000000, 200, 500 );
     }

    update(){
        if(this.actor){
            this.directionalLight.position.x = this.actor.position[0] + 100;
            this.directionalLight.position.y = this.actor.position[1] + 100;
            this.directionalLight.target.position.x = this.actor.position[0];
            this.directionalLight.target.position.y = this.actor.position[1];
            this.directionalLight.target.updateMatrixWorld();
        }
    }
}

module.exports = GameScene;
