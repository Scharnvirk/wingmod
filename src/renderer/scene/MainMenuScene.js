var BaseScene = require('renderer/scene/BaseScene');
var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var BaseSkinnedMesh = require('renderer/actor/component/mesh/BaseSkinnedMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var Camera = require('renderer/Camera');
var clock = require('renderer/Clock');

var cloner = require('cloner');

function MainMenuScene(config){
    this.cameraDefaultPositionY = -50;
    this.cameraDefaultPositionX = 10;
    this.cameraDefaultPositionZ = 15;

    this.cameraDefaultRotationX = 1.1;
    this.cameraDefaultRotationZ = 0.15;

    Object.assign(this, config);
    BaseScene.apply(this, arguments);
    this.timer = 0;
    this.lightChargeDelay = 20;
    this.lightChargeTime = 300;
    this.lightChargeSpeed = 0.003;
    this.lampChargeSpeed = 0.006;
    this.inputListener = config.inputListener;    
}

MainMenuScene.extend(BaseScene);

MainMenuScene.prototype.create = function(){
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
    this.directionalLight.position.set( 50, -50, 200 );
    this.directionalLight.distance = 1000;

    this.directionalLight.color = this.initialColor;

    this.directionalLight.castShadow = true;

    var shadowCamera = this.directionalLight.shadow.camera;

    shadowCamera.near = 1;
    shadowCamera.far = Constants.RENDER_DISTANCE;
    shadowCamera.left = Constants.RENDER_DISTANCE;
    shadowCamera.right = -Constants.RENDER_DISTANCE;
    shadowCamera.top = Constants.RENDER_DISTANCE;
    shadowCamera.bottom = -Constants.RENDER_DISTANCE;

    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.bias = -0.0075;

    this.threeScene.add( this.directionalLight );

    this.ambientLight = new THREE.AmbientLight( 0x505050, 1 );

    this.threeScene.add( this.ambientLight );

    this.createStartScene();
};


MainMenuScene.prototype.createCamera = function(){
    var camera = new Camera({inputListener: this.inputListener});
    camera.position.y = this.cameraDefaultPositionY;
    camera.position.z = this.cameraDefaultPositionZ;
    camera.position.x = this.cameraDefaultPositionX;

    camera.rotation.x = this.cameraDefaultRotationX;
    camera.rotation.z = this.cameraDefaultRotationZ;

    camera.setMovementZ(camera.position.z, 0);
    return camera;
}; 

MainMenuScene.prototype.resetCamera = function(){
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
};

MainMenuScene.prototype.createStartScene = function(){
    this.sceneMaterial = ModelStore.get('startmenu').material;  
    
    var mesh = new BaseMesh({
        geometry: ModelStore.get('startmenu').geometry,
        material: this.sceneMaterial
    }); 
    var scale = 0.5;
    mesh.scale.x = scale;
    mesh.scale.y = scale;
    mesh.scale.z = scale;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.rotation.x = Utils.degToRad(90);
    mesh.rotation.y = Utils.degToRad(-90);
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    this.threeScene.add(mesh);  

    var shipMesh = new BaseMesh({
        geometry: ModelStore.get('ravier').geometry,
        material: ModelStore.get('ravier').material
    });

    shipMesh.geometry.translate(0, -0.5, 0);

    scale = 4.5;
    shipMesh.scale.x = scale;
    shipMesh.scale.y = scale;
    shipMesh.scale.z = scale;
    shipMesh.castShadow = true;
    shipMesh.receiveShadow = true;
    shipMesh.rotation.z = Utils.degToRad(-120);

    shipMesh.position.z = 4;
    shipMesh.speedZ = 0.015;
    shipMesh.speedY = 0.0012;
    shipMesh.speedX = 0.001;

    this.shipMesh = shipMesh;
    this.sceneMesh = mesh;

    this.threeScene.add(shipMesh);

    this.directionalLight.intensity = 0;
    this.ambientLight.intensity = 0;
    this.sceneMaterial.emissiveIntensity = 0;
};


MainMenuScene.prototype.createStartScene2 = function(){

    var cloneGeometry = function(geometry) {

        // console.log('asd2', geometry.animations[0]);
        let clonedGeometry = geometry.clone();
        let bones = JSON.parse(JSON.stringify(geometry.bones));
        let skinWeights = JSON.parse(JSON.stringify(geometry.skinWeights));
        let skinIndices = JSON.parse(JSON.stringify(geometry.skinIndices));
        let animations = geometry.animations;

        animations.forEach(animation => {
            animation.uuid = Utils.generateUUID();
        });

        skinWeights = skinWeights.map(x => { return new THREE.Vector4().copy(x); });
        skinIndices = skinIndices.map(x => { return new THREE.Vector4().copy(x); });
        Object.assign(clonedGeometry, {bones, skinWeights, skinIndices, animations });
        return clonedGeometry;
    };


    var createBones = function(  jsonBones ) {
        /* adapted from the THREE.SkinnedMesh constructor */
        // create bone instances from json bone data
        const bones = jsonBones.map( gbone => {
            var bone = new THREE.Bone();
            bone.name = gbone.name;
            bone.position.fromArray( gbone.pos );
            bone.quaternion.fromArray( gbone.rotq );
            if ( gbone.scl !== undefined ) bone.scale.fromArray( gbone.scl );
            return bone;
        } );
        // add bone instances to the root object
        jsonBones.forEach( ( gbone, index ) => {
            if ( gbone.parent !== -1 && gbone.parent !== null && bones[ gbone.parent ] !== undefined ) {
                bones[ gbone.parent ].add( bones[ index ] );
            }
        });
        return bones;
    };

    var createSkinnedMesh = function( mesh, skeleton ) {
        // create SkinnedMesh from static mesh geometry and swap it in the scene graph
        const skinnedMesh = new THREE.SkinnedMesh( mesh.geometry, mesh.material );
        skinnedMesh.castShadow = true;
        skinnedMesh.receiveShadow = true;
        // bind to skeleton
        skinnedMesh.bind( skeleton, mesh.matrixWorld );
        // swap mesh for skinned mesh
        // mesh.parent.add( skinnedMesh );
        // mesh.parent.remove( mesh );
        return skinnedMesh;
    };

    var createBones2 = function (mesh, boneObjects) {
        var bones = [], bone, gbone;
        var i, il;

        if (boneObjects !== undefined ) {

            // first, create array of 'Bone' objects from geometry data
            for ( i = 0, il = boneObjects.length; i < il; i ++ ) {
                gbone = boneObjects[ i ];

                // create new 'Bone' object
                bone = new THREE.Bone();
                bones.push( bone );

                // apply values
                bone.name = gbone.name;
                bone.position.fromArray( gbone.pos );
                bone.quaternion.fromArray( gbone.rotq );
                if ( gbone.scl !== undefined ) bone.scale.fromArray( gbone.scl );
            }

            // second, create bone hierarchy
            for ( i = 0, il = boneObjects.length; i < il; i ++ ) {
                gbone = boneObjects[ i ];
                if ( ( gbone.parent !== - 1 ) && ( gbone.parent !== null ) && ( bones[ gbone.parent ] !== undefined ) ) {
                    // subsequent bones in the hierarchy
                    bones[ gbone.parent ].add( bones[ i ] );
                } else {
                    // topmost bone, immediate child of the skinned mesh
                    mesh.add( bones[ i ] );
                }
            }
        }

        // now the bones are part of the scene graph and children of the skinned mesh.
        // let's update the corresponding matrices

        mesh.updateMatrixWorld( true );
        return bones;
    };


    this.sceneMaterial = ModelStore.get('startmenu').material;  
    
    var mesh = new BaseMesh({
        geometry: ModelStore.get('startmenu').geometry,
        material: this.sceneMaterial
    }); 
    var scale = 0.5;
    mesh.scale.x = scale;
    mesh.scale.y = scale; 
    mesh.scale.z = scale;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.rotation.x = Utils.degToRad(90);
    mesh.rotation.y = Utils.degToRad(-90);
    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    const geometry = ModelStore.get('razorman').geometry;

    var shipMesh = new BaseSkinnedMesh({
        geometry: geometry,
        material: ModelStore.get('enemyModel').material
    });

    

    // var shipMesh2 = shipMesh.clone();
    
    // var geometry2 = cloneGeometry(geometry);
    // var geometry3 = cloneGeometry(geometry2);

    var geometry2 = geometry.clone();
    delete geometry2.bones; 

    var geometry3 = geometry.clone();
    delete geometry2.bones; 

    var shipMesh2 = new BaseSkinnedMesh({
        geometry: geometry2,
        material: ModelStore.get('enemyModel').material
    });

    const bones = createBones2( shipMesh2, geometry.bones );    
    const skeleton = new THREE.Skeleton(bones);

    var shipMesh3 = new BaseSkinnedMesh({
        geometry: geometry3,
        material: ModelStore.get('enemyModel').material
    });

    // shipMesh.bindMode = 'detached';
    // shipMesh2.bindMode = 'detached';
    // shipMesh3.bindMode = 'detached';


    // // shipMesh.bind( skeleton, shipMesh.matrixWorld );
    shipMesh2.bind( shipMesh.skeleton, shipMesh2.matrixWorld );
    shipMesh2.master = shipMesh; 

    // shipMesh.shareSkeleton(shipMesh2);
    shipMesh.shareSkeleton(shipMesh3);

    scale = 2;//4.5;
    shipMesh.scale.x = scale;
    shipMesh.scale.y = scale;
    shipMesh.scale.z = scale;
    shipMesh.castShadow = true;
    shipMesh.receiveShadow = true;
    shipMesh.rotation.z = Utils.degToRad(-120);

    shipMesh.position.z = 4;
    shipMesh.speedZ = 0.015;
    shipMesh.speedY = 0.0012;
    shipMesh.speedX = 0.001;

    scale = 3.5;
    shipMesh2.scale.x = scale;
    shipMesh2.scale.y = scale;
    shipMesh2.scale.z = scale;
    shipMesh2.castShadow = true;
    shipMesh2.receiveShadow = true;
    shipMesh2.rotation.z = Utils.degToRad(-120);

    shipMesh2.position.z = 0;
    shipMesh2.speedZ = 0.015;
    shipMesh2.speedY = 0.0012;
    shipMesh2.speedX = 0.001;


    scale = 2.5;
    shipMesh3.scale.x = scale;
    shipMesh3.scale.y = scale;
    shipMesh3.scale.z = scale;
    shipMesh3.castShadow = true;
    shipMesh3.receiveShadow = true;
    shipMesh3.rotation.z = Utils.degToRad(-120);

    shipMesh3.position.z = 1;
    shipMesh3.speedZ = 0.015;
    shipMesh3.speedY = 0.0012;
    shipMesh3.speedX = 0.001;


    this.shipMesh = shipMesh;
    this.sceneMesh = mesh;

    // this.threeScene.add(shipMesh);
    this.threeScene.add(shipMesh2);
    this.threeScene.add(shipMesh3);

    this.directionalLight.intensity = 0;
    this.ambientLight.intensity = 0;
    this.sceneMaterial.emissiveIntensity = 0;

    var isLoaded = false;
    var action = {}, mixer;
    var action2 = {}, mixer2;
    var action3 = {}, mixer3;
    var activeActionName = 'idle'; 

    var arrAnimations = [ 
        'idle',
        'walk',
        'run',
        'hello'
    ];
    var actualAnimation = 0;

    mixer = new THREE.AnimationMixer(shipMesh);    
    // mixer2 = new THREE.AnimationMixer(shipMesh2);    
    // mixer3 = new THREE.AnimationMixer(shipMesh3);    

    setInterval(function(){
        var delta = clock.getDelta();
        mixer.update(delta);
        // mixer2.update(delta);
        // mixer3.update(delta);
    }, 1);

    action.hello = mixer.clipAction(geometry.animations[ 2 ]);
    action.hello.setEffectiveWeight(1);
    action.hello.enabled = true;

    // action2.hello = mixer.clipAction(geometry2.animations[ 2 ]);
    // action2.hello.setEffectiveWeight(1);
    // action2.hello.enabled = true;

    // action3.hello = mixer.clipAction(geometry3.animations[ 2 ]);
    // action3.hello.setEffectiveWeight(1);
    // action3.hello.enabled = true;


    window.addEventListener('click', onDoubleClick, false);

    isLoaded = true;

    action.hello.play();
    // action2.hello.play();
    // action3.hello.play();

    window.a1 = action;
    // window.a2 = action2;
    // window.a3 = action3;

    window.g1 = geometry;
    window.g2 = geometry2;
    window.g3 = geometry3;
    

    var mylatesttap;
    function onDoubleClick () {
        var now = new Date().getTime();
        var timesince = now - mylatesttap;
        if ((timesince < 600) && (timesince > 0)) {
            if (actualAnimation == arrAnimations.length - 1) {
                actualAnimation = 0;
            } else {
                actualAnimation++;
            }
            fadeAction(arrAnimations[actualAnimation]);

        } else {
            // too much time to be a doubletap
        }

        mylatesttap = new Date().getTime();

    }


    function fadeAction (name) {
        var from = action[ activeActionName ].play();
        var to = action[ name ].play();

        from.enabled = true;
        to.enabled = true;

        if (to.loop === THREE.LoopOnce) {
            to.reset();
        }

        from.crossFadeTo(to, 0.3);
        activeActionName = name;
        console.log('fading...');
    }

    window.fadeAction = fadeAction;
};

MainMenuScene.prototype.customUpdate = function(){
    this.doBob();
    this.lightPowerUp();
    this.doFlicker();
    this.timer ++;

    this.handleMouseMovement();
};

MainMenuScene.prototype.handleMouseMovement = function() {
    this.camera.position.x = this.cameraDefaultPositionX + this.inputListener.inputState.mouseX * 0.001;
    this.camera.position.y = this.cameraDefaultPositionY - this.inputListener.inputState.mouseY * 0.001;

    this.camera.rotation.x = this.cameraDefaultRotationX - Utils.degToRad(this.inputListener.inputState.mouseY * 0.005);
    this.camera.rotation.z = this.cameraDefaultRotationZ - Utils.degToRad(this.inputListener.inputState.mouseX * 0.005);
};

MainMenuScene.prototype.doBob = function(){
    this.shipMesh.position.z += this.shipMesh.speedZ;
    if (this.shipMesh.position.z > 4){
        this.shipMesh.speedZ -= 0.0005;
    } else {
        this.shipMesh.speedZ += 0.0005;
    }

    this.shipMesh.rotation.y += this.shipMesh.speedY;
    if (this.shipMesh.rotation.y > 0){
        this.shipMesh.speedY -= 0.0001;
    } else {
        this.shipMesh.speedY += 0.0001;
    }

    this.shipMesh.rotation.x += this.shipMesh.speedX;
    if (this.shipMesh.rotation.x > 0){
        this.shipMesh.speedX -= 0.00008;
    } else {
        this.shipMesh.speedX += 0.00008;
    }

    this.shipMesh.rotation.z -= 0.003;
};

MainMenuScene.prototype.doFlicker = function(){
    let random = Utils.rand(0,1000);

    if (random > 980 && this.ambientLight.intensity > 0.95){
        this.directionalLight.intensity -= 0.1;
        this.ambientLight.intensity -= 0.1;
        this.sceneMaterial.emissiveIntensity -= 0.2;
    }
};

MainMenuScene.prototype.lightPowerUp = function(){
    let lightIntensity, lampIntensity;

    lightIntensity = (this.timer - this.lightChargeDelay) * (1/this.lightChargeTime);
    lampIntensity = (this.timer - this.lightChargeDelay) * (4/this.lightChargeTime);

    lightIntensity = Math.min(1, lightIntensity);
    lampIntensity = Math.min(1, lampIntensity);

    if (this.ambientLight.intensity < lightIntensity) {
        this.ambientLight.intensity += this.lightChargeSpeed;
        this.directionalLight.intensity += this.lightChargeSpeed;
    }

    if (this.sceneMaterial.emissiveIntensity < lampIntensity) {
        this.sceneMaterial.emissiveIntensity += this.lampChargeSpeed;
    }
};


module.exports = MainMenuScene;
