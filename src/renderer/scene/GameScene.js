var ModelStore = require("renderer/modelRepo/ModelStore");

var RavierMesh = require("renderer/actor/component/mesh/RavierMesh");
var ShipMesh = require("renderer/actor/component/mesh/ShipMesh");

var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");

var MapBuilder = require("renderer/map/MapBuilder");

function GameScene(config) {
    Object.assign(this, config);
    this.lightCounter = 0;
    this.shadows = config.shadows;
    this.mapBuilder = new MapBuilder();
}

GameScene.prototype.makeWalls = function() {
    var walls = [];
    var wall;

    var material = ModelStore.get('wall').material;
    var wallGeometry = new THREE.BoxGeometry(Utils.rand(5,50),Utils.rand(5,50),Utils.rand(5,50)/10,1,1,1);

    for(var i = 0; i < 100; i++){
        wall = new THREE.Mesh(wallGeometry,material);
        wall.position.x = Utils.rand(-400,400);
        wall.position.y = Utils.rand(-200,200);
        wall.position.z = Utils.rand(0,2);
        wall.scale.x = 1;
        wall.scale.y = 1;
        wall.scale.z = 1;
        wall.rotateZ(Utils.degToRad(Utils.rand(0,360)));
        wall.rotateX(Utils.degToRad(Utils.rand(-5,5)));
        wall.rotateY(Utils.degToRad(Utils.rand(-5,5)));
        walls.push(wall);
    }

    var combine = new THREE.Geometry();

    walls.forEach((w) => {
        w.updateMatrix();
        combine.merge(w.geometry, w.matrix);
    });

    return new THREE.Mesh(combine, material);
};

GameScene.prototype.makeDoodads = function() {
    var combinedGeometry = new THREE.Geometry();
    var ravierMesh = new RavierMesh({actor: this, scaleX: 10, scaleY: 10, scaleZ: 10});
    var shipMesh = new ShipMesh({actor: this, scaleX: 10, scaleY: 10, scaleZ: 10});

    for(let i = 0; i < 5; i++){
        ravierMesh.position.x = Utils.rand(-400,400);
        ravierMesh.position.y = Utils.rand(-200,200);
        ravierMesh.position.z = Utils.rand(0,2);
        // ravierMesh.rotateZ(Utils.degToRad(Utils.rand(0,360)));
        // ravierMesh.rotateX(Utils.degToRad(Utils.rand(-5,5)));
        // ravierMesh.rotateY(Utils.degToRad(Utils.rand(-5,5)));
        ravierMesh.updateMatrix();
        combinedGeometry.merge(ravierMesh.geometry, ravierMesh.matrix, Utils.rand(0, 1));
    }

    var doneMesh = new BaseMesh({
        geometry: combinedGeometry,
        material: new THREE.MeshFaceMaterial([
            ModelStore.get('ravier').material,
            ModelStore.get('ship').material
        ])
    });

    doneMesh.position.z = Utils.rand(-5,5);
    return doneMesh;
};

GameScene.prototype.makeMapChunk = function(){
    var planeTex = new THREE.TextureLoader().load("/models/floor.png");
    planeTex.wrapS = planeTex.wrapT = THREE.RepeatWrapping;
    planeTex.repeat.set( 10, 10 );

    var material = new THREE.MeshPhongMaterial( { color: 0xdddddd, shininess: 10, shading: THREE.FlatShading, map: planeTex } );

    var mesh = new THREE.Mesh(
        new THREE.BoxGeometry(1,1,1),
        material//ModelStore.get('level').material
    );

    mesh.position.z = 20;
    mesh.scale.x = 10;
    mesh.scale.y = 10;
    mesh.scale.z = 10;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    // mesh.geometry.computeVertexNormals();
    // mesh.geometry.normalsNeedUpdate = true;

    this.scene.add(mesh);

    console.log('basicthreemesh', mesh, new THREE.BoxGeometry(1,1,1));

    var mesh2 = new THREE.Mesh(
        ModelStore.get('level').geometry,
        material//ModelStore.get('level').material
    );

    mesh2.position.z = 20;
    mesh2.scale.x = 10;
    mesh2.scale.y = 10;
    mesh2.scale.z = 10;
    mesh2.receiveShadow = true;
    mesh2.castShadow = true;

    mesh2.rotation.x = Math.PI;
    //
    // mesh2.geometry.computeVertexNormals();
    // mesh2.geometry.normalsNeedUpdate = true;
    //
    // setInterval(function(){
    //     mesh2.rotation.z += 0.01;
    //     mesh.rotation.z += 0.01;
    // }, 10);

    this.scene.add(mesh2);
    console.log('blenderMesh', mesh2, ModelStore.get('level').geometry);
    mesh2.geometry.faceVertexUvs = mesh.geometry.faceVertexUvs;
};

GameScene.prototype.loadObjAndMtl = function(){
    // var mtlLoader = new THREE.MTLLoader();
	// mtlLoader.setBaseUrl( 'models/' );
	// mtlLoader.setPath( 'models/' );
	// mtlLoader.load( 'levelwalls.mtl', function( materials ) {
	// 	materials.preload();
	// 	var objLoader = new THREE.OBJLoader();
	// 	objLoader.setMaterials( materials );
	// 	objLoader.setPath( 'models/' );
	// 	objLoader.load( 'levelwalls.obj', function ( object ) {
	// 		this.scene.add( object );
	// 	}.bind(this), onProgress, onError );
	// }.bind(this));

    var loader = new THREE.OBJMTLLoader();
	loader.load( '/models/floor_grate.obj', '/models/floor_grate.mtl', function ( object ) {
        object.rotation.x = Utils.degToRad(90);
        object.castShadow = true;
        object.receiveShadow = true;
        object.position.z = 0.1;
        // object.scale.x = 0.25;
        // object.scale.y = 0.25;
        // object.scale.z = 0.25;
		this.scene.add( object );
        console.log(object);

	}.bind(this), function(){}, function(){} );
};

GameScene.prototype.make = function() {
    var combine = new THREE.Geometry();
    var planeTex = new THREE.TextureLoader().load("/models/floor.png");
    planeTex.wrapS = planeTex.wrapT = THREE.RepeatWrapping;
    planeTex.repeat.set( 10, 10 );
    var geometry = new THREE.PlaneGeometry(800, 400, 2, 2);
    var material = new THREE.MeshPhongMaterial({ color: 0x888888, map: planeTex });

    var floor = new THREE.Mesh(geometry, material);
    floor.updateMatrix();
    combine.merge(floor.geometry, floor.matrix);

    this.makeDoodads();
    var walls = this.makeWalls();
    //this.scene.add(walls);
    combine.merge(walls.geometry, walls.matrix);

    // for (let i = 0, length = 10; i < length; i++){
    //     var pointLight = new THREE.PointLight( Utils.makeRandomColor(), 1 );
    //     pointLight.distance = Utils.rand(20,100);
    //     pointLight.position.set( Utils.rand(-200,200), Utils.rand(-200,200), 10 );
    //
    //     this.scene.add(pointLight);
    // }

    // var pipesGeometry = ModelStore.get('testLevel').geometry;
    // var pipesMaterial = ModelStore.get('testLevel').material;
    // console.log(pipesGeometry, pipesMaterial);
    // var mesh = new THREE.Mesh(pipesGeometry, pipesMaterial);

    //
    // geometry.faces.forEach(function(face){
    //     if (face.materialIndex > 12){
    //         face.materialIndex = 1;
    //     } else {
    //         face.materialIndex = 0;
    //     }
    // });

    //var unifiedMaterial = Array(21).fill(materials[0]);
    //console.log(unifiedMaterial);

    var loader = new THREE.JSONLoader();
    loader.load( "models/levels/chunkThree.json", function( geometry, materials ) {
        geometry.sortFacesByMaterialIndex();
        //geometry.dynamic = false;
        for (var i = 0; i < 10; i++){
            var mesh = new THREE.Mesh( geometry, new THREE.MultiMaterial( materials ) );
            mesh.rotation.x = Utils.degToRad(90);
            mesh.position.z = -45;
            mesh.receiveShadow = true;
            mesh.castShadow = true;
            mesh.position.x = i*447;
            this.scene.add( mesh );
        }

    }.bind(this) );


    // mesh.receiveShadow = true;
    // mesh.castShadow = true;
    //
    // mesh.rotation.x = Utils.degToRad(90);
//    mesh.position.z = 16;

    // this.scene.add(mesh);
    //

    //
    //this.makeMapChunk();
    // mapChunk.rotation.x = Utils.degToRad(90);
    //

    //this.loadObjAndMtl();

    var combinedObject = new THREE.Mesh(combine, material);
    combinedObject.receiveShadow = true;
    combinedObject.castShadow = true;
    combinedObject.matrixAutoUpdate = false;
    combinedObject.updateMatrix();

    //this.scene.add(combinedObject);

    this.initialColor = {
        r: Utils.rand(100,100)/100,
        g: Utils.rand(100,100)/100,
        b: Utils.rand(100,100)/100
    };

    this.currentColor = {
        r: Utils.rand(100,100)/100,
        g: Utils.rand(100,100)/100,
        b: Utils.rand(100,100)/100
    };

    this.directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    this.directionalLight.position.set( 0, 0, 200 );
    this.directionalLight.distance = 1000;

    this.directionalLight.color = this.initialColor;

    this.directionalLight.castShadow = this.shadows;
    this.directionalLight.shadowCameraNear = 1;
    this.directionalLight.shadowCameraFar = 400;
    this.directionalLight.shadowMapWidth = 2048;
    this.directionalLight.shadowMapHeight = 2048;
    this.directionalLight.shadowBias = 0;
    this.directionalLight.shadowDarkness = 0.4;

    this.scene.add( this.directionalLight );

    this.scene.fog = new THREE.Fog( 0x000000, 200, 400 );
};

GameScene.prototype.update = function(){
    if(this.actor){
        this.directionalLight.position.x = this.actor.position[0] + 100;
        this.directionalLight.position.y = this.actor.position[1] + 100;
        this.directionalLight.target.position.x = this.actor.position[0];
        this.directionalLight.target.position.y = this.actor.position[1];
        this.directionalLight.target.updateMatrixWorld();
    }
    this.handleFlash();

    this.directionalLight.color = this.currentColor;
};

GameScene.prototype.flashRed = function(){
    this.currentColor = {
        r: this.initialColor.r + 2,
        g: this.initialColor.g,
        b: this.initialColor.b
    };
};

GameScene.prototype.flashWhite = function(){
    this.currentColor = {
        r: this.initialColor.r + 1,
        g: this.initialColor.g + 1,
        b: this.initialColor.b + 1
    };
};

GameScene.prototype.handleFlash = function(){
    if (this.currentColor.r > this.initialColor.r) this.currentColor.r -= 0.3;
    if (this.currentColor.g > this.initialColor.g) this.currentColor.g -= 0.3;
    if (this.currentColor.b > this.initialColor.b) this.currentColor.b -= 0.3;

    if (this.currentColor.r < this.initialColor.r) this.currentColor.r = this.initialColor.r;
    if (this.currentColor.g < this.initialColor.g) this.currentColor.g = this.initialColor.g;
    if (this.currentColor.b < this.initialColor.b) this.currentColor.b = this.initialColor.b;
};

GameScene.prototype.doUiFlash = function(type){
    switch(type) {
        case 'red':
            this.flashRed();
            break;
        default:
            this.flashWhite();
    }
};

GameScene.prototype.createMapBodies = function(bodies){
    this.mapBuilder.bodies = bodies;
    this.scene.add( this.mapBuilder.createMapMesh() );
};

module.exports = GameScene;
