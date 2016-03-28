var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");

function ShieldMesh(config){
    BaseMesh.apply(this, arguments);

    config = config || {};
    config.geometry = new THREE.SphereGeometry( 5, 32, 32 );
    config.material = new THREE.MeshLambertMaterial({color: 0x005000});
    Object.assign(this, config);

    this.castShadow = false;
    this.receiveShadow = false;
}


ShieldMesh.extend(BaseMesh);

module.exports = ShieldMesh;
