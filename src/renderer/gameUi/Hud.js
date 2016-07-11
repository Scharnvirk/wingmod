var BaseMesh = require("renderer/actor/component/mesh/BaseMesh");
var ModelStore = require("renderer/assetManagement/model/ModelStore");

function Hud(config){
    Object.assign(this, config);

    if(!this.actorManager) throw new Error('No actorManager defined for MainContainer!');
    if(!this.particleManager) throw new Error('No particleManager defined for MainContainer!');

    this.defaultHpBarCount = 10;

    this.activationKey = 'shift';

    this.itemRotation = 0;

    this.hudVisible = false;
}

Hud.prototype.update = function(){
    if(this.actor && !this.actor.dead){
        for (let enemyId in this.actorManager.enemies ){
            let enemyActor = this.actorManager.enemies[enemyId];
            let angle = Utils.angleBetweenPoints(enemyActor.position, this.actor.position);
            let offsetPosition = Utils.angleToVector(angle + Math.PI, 12);

            this.drawHealthBar(enemyActor);

            this.particleManager.createParticle('particleAddHUD', {
                positionX: this.actor.position[0] + offsetPosition[0],
                positionY: this.actor.position[1] + offsetPosition[1],
                positionZ: -Constants.DEFAULT_POSITION_Z,
                colorR: 1,
                colorG: 0,
                colorB: 0,
                scale: 0.75,
                alpha: 1,
                alphaMultiplier: 1,
                particleVelocity: 0,
                particleAngle: 0,
                lifeTime: 1
            });
        }
        this.drawHealthBar(this.actor);

        if (this.hudVisible && this.actor && !this.actor.dead){
            this.itemRotation += 1;
            if(!this.meshes){
                this.meshes = this.createMeshes();
            }

            this.meshes.forEach(mesh => {
                var offsetVector = Utils.rotateVector(mesh.positionOffset[0], mesh.positionOffset[1], this.actor.angle * -1);
                mesh.position.x = this.actor.position[0] + offsetVector[0];
                mesh.position.y = this.actor.position[1] + offsetVector[1];
                mesh.rotation.z = this.actor.angle + Utils.degToRad(this.itemRotation);
                mesh.visible = true;
            });
        } else if (this.meshes) {
            this.meshes.forEach(mesh => {
                mesh.visible = false;
            });

        }
    }
};

Hud.prototype.drawHealthBar = function(otherActor){
    var hpPercentage = otherActor.hp / otherActor.initialHp;
    var hpBarCount = otherActor.hpBarCount || this.defaultHpBarCount;
    for (let i = 0; i < hpBarCount; i++){
        let angle = (otherActor !== this.actor) ? Utils.angleBetweenPoints(otherActor.position, this.actor.position) : this.actor.angle;
        let offsetPosition = Utils.angleToVector(angle + Utils.degToRad(hpBarCount/2*3) - Utils.degToRad(i*3) + Math.PI, 8);
        this.particleManager.createParticle('particleAddHUD', {
            positionX: otherActor.position[0] + offsetPosition[0],
            positionY: otherActor.position[1] + offsetPosition[1],
            positionZ: otherActor !== this.actor ? -15 + hpBarCount : -Constants.DEFAULT_POSITION_Z,
            colorR: i >= hpPercentage * hpBarCount ? 1 : 0,
            colorG: i < hpPercentage * hpBarCount ? 1 : 0,
            colorB: 0,
            scale: 0.75,
            alpha: 1,
            alphaMultiplier: 1,
            particleVelocity: 0,
            particleAngle: angle,
            lifeTime: 1,
            spriteNumber: 3
        });
    }
};

Hud.prototype.drawCrosshairs = function(actor){
    this.particleManager.createPremade('CrosshairBlue', {
        position: actor.position,
        positionZ: actor.positionZ - Constants.DEFAULT_POSITION_Z,
        angle: actor.angle,
        angleOffset: 9,
        distance: 20
    });
    this.particleManager.createPremade('CrosshairBlue', {
        position: actor.position,
        positionZ: actor.positionZ - Constants.DEFAULT_POSITION_Z,
        angle: actor.angle,
        angleOffset: -9,
        distance: 20
    });
    this.particleManager.createPremade('CrosshairGreen', {
        position: actor.position,
        positionZ: actor.positionZ - Constants.DEFAULT_POSITION_Z,
        angle: actor.angle,
        angleOffset: 18,
        distance: 16
    });
    this.particleManager.createPremade('CrosshairGreen', {
        position: actor.position,
        positionZ: actor.positionZ - Constants.DEFAULT_POSITION_Z,
        angle: actor.angle,
        angleOffset: -18,
        distance: 16
    });
};

Hud.prototype.createMeshes = function(){
    var scale = 3;
    var meshes = [];

    meshes.push(new BaseMesh({
        geometry: ModelStore.get('pulsewavegun').geometry,
        material: ModelStore.get('hudMaterial').material,
        positionOffset: [-20, 0]
    }));

    meshes.push(new BaseMesh({
        geometry: ModelStore.get('plasmagun').geometry,
        material: ModelStore.get('hudMaterial').material,
        positionOffset: [-20, 15]
    }));

    meshes.push(new BaseMesh({
        geometry: ModelStore.get('lasgun').geometry,
        material: ModelStore.get('hudMaterial').material,
        positionOffset: [-20, 30]
    }));

    meshes.forEach(mesh => {
        mesh.scale.x = scale;
        mesh.scale.y = scale;
        mesh.scale.z = scale;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        this.sceneManager.getThreeScene().add(mesh);
    });

    return meshes;
};

Hud.prototype.onInput = function(input){
    this.hudVisible = input[this.activationKey];


};

module.exports = Hud;
