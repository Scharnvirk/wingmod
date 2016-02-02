class GameScene {
    constructor(config) {
        Object.assign(this, config);
        this.lightCounter = 0;
    }

    makeWalls () {
        var walls = [];
        var wall;

        var material = new THREE.MeshLambertMaterial({
            color: 0xffffff
        });

        var wallGeometry = new THREE.BoxGeometry(10,100,10);

        for(var i = 0; i < 100; i++){
            wall = new THREE.Mesh(wallGeometry,material);
            wall.position.x = Utils.rand(-300,300);
            wall.position.y = Utils.rand(-300,300);
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
        var planeTex = THREE.ImageUtils.loadTexture("/models/floor.png");
        planeTex.wrapS = planeTex.wrapT = THREE.RepeatWrapping;
        planeTex.repeat.set( 10, 10 );
        var geometry = new THREE.PlaneGeometry(1000, 1000, 2, 2);
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

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
        directionalLight.position.set( 2, 2, 10 );
        this.scene.add( directionalLight );

        this.pointLight = new THREE.PointLight( 0xffffff, 1 );
        this.pointLight.distance = 200;
        this.pointLight.castShadow = true;
        this.pointLight.shadowCameraNear = 1;
        this.pointLight.shadowCameraFar = 250;
        this.pointLight.shadowMapWidth = 2048;
        this.pointLight.shadowMapHeight = 2048;
        this.pointLight.shadowBias = 0;
        this.pointLight.shadowDarkness = 0.4;
        this.pointLight.position.set(0,0,50);
        this.scene.add( this.pointLight );

        var map = THREE.ImageUtils.loadTexture( "/assets/particleAdd.png" );
        this.particleMaterial = new THREE.SpriteMaterial( { map: map, color: 0xffffff, blending: THREE.AdditiveBlending} );
        this.spriteCount = 0;

        //for(let i = 0; i < 100; i++){

            this.particlesGeometry = new THREE.Geometry();
            for (let i = 0; i < 20000; i ++ ) {

					var vertex = new THREE.Vector3();
					vertex.x = Utils.rand(-300,300);
					vertex.y = Utils.rand(-300,300);
					vertex.z = Utils.rand(1,100);

					this.particlesGeometry.vertices.push( vertex );

				}

				material = new THREE.PointsMaterial( { size: 10, map: map, blending: THREE.AdditiveBlending, depthTest: false, transparent : true} );

				var particles = new THREE.Points( this.particlesGeometry, material );
				this.scene.add( particles );
            //
            //
            // var sprite = new THREE.Sprite( this.particleMaterial );
            // sprite.position.set(Utils.rand(-300,300),Utils.rand(-300,300),Utils.rand(10,100));
            // var scale = Utils.rand(1,10);
            // sprite.scale.x = scale;
            // sprite.scale.y = scale;
            // sprite.scale.z = scale;
            // this.scene.add( sprite );
        //}
    }

    update(){
        this.particlesGeometry.vertices.forEach(function(vertex){
            vertex.x += Utils.rand(-1,1);
            vertex.y += Utils.rand(-1,1);
        });
        this.particlesGeometry.verticesNeedUpdate = true;

        if(this.actor){
            this.pointLight.position.x = this.actor.position[0] + 20;
            this.pointLight.position.y = this.actor.position[1] + 20;
        }
    }

    enableShadows(state) {
        if(this.pointLight){
            this.pointLight.castShadow = state;
        }
    }
}
