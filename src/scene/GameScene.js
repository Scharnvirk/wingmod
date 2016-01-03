class GameScene {
    constructor(core, scene) {
        this.core = core;
        this.scene = scene;
        //this.lightManager = new MapLightManager(this.scene, this.core.camera);
        this.lightCounter = 0;

        var radius = 5;
        var segments = 16;
        var rings = 16;

        this.sphereGeometry =  new THREE.SphereGeometry( 1, 32, 16, 0, Math.PI );
    }

    makeSphere (sphereMaterial, _radius) {
        return new THREE.Mesh(this.sphereGeometry, sphereMaterial );
    }

    makeWalls () {
        var walls = [];
        var wall;

        var material = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });

        var wallGeometry = new THREE.BoxGeometry(10,100,5,20,20);

        for(var i = 0; i < 100; i++){
            wall = new THREE.Mesh(wallGeometry,material);
            wall.position.x = Utils.rand(-300,300);
            wall.position.y = Utils.rand(-300,300);
            wall.position.z = 0;
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
        for (var j  = 0; j < 5; j++){
            var light = new MapLightActor();
            light.position.x = Math.random()*1000-500;
            light.position.y = Math.random()*1000-500;
            this.core.masterManager.get('light').add(light);
        }


        for (var i = 0; i < 2000; i++){
            var mook = new MookActor(new THREE.Vector2(Utils.rand(-100,100), Utils.rand(-100,100)));
            mook.angle = Utils.rand(0,360);
            this.core.masterManager.get('ship').add(mook);
        }

        // this.core.masterManager.get('ship').add(new MookActor(new THREE.Vector2(0,0)));
        // this.core.masterManager.get('ship').add(new MookActor(new THREE.Vector2(0,5)));
        // this.core.masterManager.get('ship').add(new MookActor(new THREE.Vector2(0,10)));
        // this.core.masterManager.get('ship').add(new MookActor(new THREE.Vector2(5,0)));
        // this.core.masterManager.get('ship').add(new MookActor(new THREE.Vector2(5,5)));
        // this.core.masterManager.get('ship').add(new MookActor(new THREE.Vector2(5,10)));
        // this.core.masterManager.get('ship').add(new MookActor(new THREE.Vector2(10,0)));
        // this.core.masterManager.get('ship').add(new MookActor(new THREE.Vector2(10,5)));
        // this.core.masterManager.get('ship').add(new MookActor(new THREE.Vector2(10,10)));

        var combine = new THREE.Geometry();
        var geometry = new THREE.PlaneGeometry( 1000, 1000, 200,200 );
        var material = new THREE.MeshLambertMaterial( { color: 0xffffff } );
        var floor = new THREE.Mesh( geometry, material );

       floor.updateMatrix();
       combine.merge(floor.geometry, floor.matrix);

       var walls = this.makeWalls();
       combine.merge(walls.geometry, walls.matrix);
       var combinedObject = new THREE.Mesh(combine, material);
       combinedObject.matrixAutoUpdate = false;
       combinedObject.updateMatrix();
      this.scene.add(combinedObject);

        var testLight = new THREE.PointLight( 0x550000, 1, 100 );
        testLight.position.set( 50, 50, 50 );
        this.scene.add( testLight );

        console.log(testLight);
    }

    update(delta){
    }
}
