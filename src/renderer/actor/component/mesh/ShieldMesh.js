var BaseMesh = require('renderer/actor/component/mesh/BaseMesh');
var ModelStore = require('renderer/assetManagement/model/ModelStore');

function ShieldMesh(config){
    BaseMesh.apply(this, arguments);

    if (!this.camera) throw new Error('ShieldMesh requires a camera but none was given');
    Object.assign(this, config);

    this.hitPosition = new THREE.Vector3(0, 0, 0);
    this.intensity = 0;
    this.shieldSize = this.actor.props.shieldSize || 1.5;
    this.shieldColor = new THREE.Color(this.actor.props.shieldColor || 0x5599dd);
    this.disabled = true;

    let vertexShader = this._createVertexShader();
    let fragmentShader = this._createFragmentShader();
    let material = this._createMaterial(vertexShader, fragmentShader);
    
    this.geometry = ModelStore.get('shieldSphere').geometry;
    this.material = material;
    this.scale.set(0.01, 0.01, 0.01); 

    this.castShadow = false;
    this.receiveShadow = false;
}

ShieldMesh.extend(BaseMesh);

ShieldMesh.prototype.customUpdate = function(){
    this._updateIntensity();
    this._updateHitAngle();
};

ShieldMesh.prototype.setIntensity = function(intensity){ 
    this.intensity = parseInt(intensity) - 100;
    this._enable();
};

ShieldMesh.prototype._disable = function(){
    if (!this.disabled) {
        this.scale.set(0.01, 0.01, 0.01);
        this.disabled = true;
    }
};

ShieldMesh.prototype._enable = function(){
    if (this.disabled) {
        this.scale.set(this.shieldSize, this.shieldSize, this.shieldSize);
        this.disabled = false;
    }    
};

ShieldMesh.prototype._updateIntensity = function(){
    if (this.intensity > -100){
        this.intensity -= 10;
        this.material.uniforms['c'].value = (this.intensity + Utils.rand(-10, 10)) / 100;
        this.shieldColor.b = Utils.rand(150,255)/256;
        this.material.uniforms.glowColor.value = this.shieldColor;
    } else {
        this._disable();
    }
};

ShieldMesh.prototype._updateHitAngle = function(){
    let angleDifference, offsetPosition;
    let contactPoint = this.actor.getRelativeContactPoint();
    if (contactPoint) {        
        angleDifference = Utils.rotationBetweenPoints(contactPoint, this.actor.getPosition());
        offsetPosition = this.actor.getOffsetPosition(10, angleDifference);
        offsetPosition = Utils.rotationToVector(angleDifference - this.actor.getRotation(), 10);
        this.hitPosition.x = offsetPosition[0];
        this.hitPosition.y = offsetPosition[1];
        this.material.uniforms.viewVector.value = this.hitPosition;
    }
};

ShieldMesh.prototype._createMaterial = function(vertexShader, fragmentShader){
    return new THREE.ShaderMaterial({
        uniforms:{ 
            'c':   { type: 'f', value: 1 },
            'p':   { type: 'f', value: 1.4 },
            glowColor: { type: 'c', value: this.shieldColor },
            viewVector: { type: 'v3', value: this.camera.position }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        side: THREE.FrontSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });
};

ShieldMesh.prototype._createVertexShader = function(){
    return ' \
        uniform vec3 viewVector; \
        uniform float c; \
        uniform float p; \
        varying float intensity; \
        void main() \
        { \
            vec3 vNormal = normalize( normalMatrix * normal ); \
            vec3 vNormel = normalize( normalMatrix * viewVector ); \
            intensity = pow( c - dot(vNormal, vNormel), p ); \
            gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 ); \
        } \
    ';
};

ShieldMesh.prototype._createFragmentShader = function(){
    return ' \
        uniform vec3 glowColor; \
        varying float intensity; \
        void main() \
        { \
            vec3 glow = glowColor * intensity; \
            gl_FragColor = vec4( glow, 1.0 ); \
        } \
    ';
};

module.exports = ShieldMesh;
