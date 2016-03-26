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
        console.log(lcolor);
        //var lcolor = 0xffffff;

        var directionalLight = new THREE.DirectionalLight( lcolor, Utils.rand(5, 8)/10 );
        directionalLight.position.set( 2, 2, 10 );
        this.scene.add( directionalLight );

        this.pointLight = new THREE.PointLight( lcolor, 2 );
        this.pointLight.distance = 200;
        this.pointLight.castShadow = this.shadows;
        this.pointLight.shadowCameraNear = 1;
        this.pointLight.shadowCameraFar = 200;
        this.pointLight.shadowMapWidth = 2048;
        this.pointLight.shadowMapHeight = 2048;
        this.pointLight.shadowBias = 0;
        this.pointLight.shadowDarkness = 0.4;
        this.pointLight.position.set(0,0,30);
        this.scene.add( this.pointLight );

     }

    update(){
        if(this.actor){
            let shipPosition = Utils.angleToVector(this.actor.angle, 15);
            this.pointLight.position.x = this.actor.position[0] + 20;//shipPosition[0];
            this.pointLight.position.y = this.actor.position[1] + 20;//shipPosition[1];
        }
    }
}

module.exports = GameScene;
