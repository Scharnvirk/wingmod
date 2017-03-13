var BaseScene = require('renderer/scene/BaseScene');
var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');
var Camera = require('renderer/Camera');

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
