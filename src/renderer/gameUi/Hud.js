var WeaponSwitcher = require("renderer/gameUi/WeaponSwitcher");

function Hud(config){
    Object.assign(this, config);

    if(!this.actorManager) throw new Error('No actorManager defined for Hud!');
    if(!this.particleManager) throw new Error('No particleManager defined for Hud!');
    if(!this.sceneManager) throw new Error('No sceneManager defined for Hud!');

    this.switchers = [];

    this.defaultHpBarCount = 10;
    this.activationKey = 'shift';
    this.switchersConfig = [
        {
            positionOffset: [-10, 0],
            switchKey: 'mouseLeft'
        }, {
            positionOffset: [10, 0],
            switchKey: 'mouseRight'
        }
    ];

    this.switchers = this.makeSwitchers();
    EventEmitter.apply(this, arguments);
}

Hud.extend(EventEmitter);

Hud.prototype.makeSwitchers = function(){
    var switcherIndex = 0;
    var switchers = [];
    this.switchersConfig.forEach(switcherConfig => {
        switcherConfig.sceneManager = this.sceneManager;
        switcherConfig.activationKey = this.activationKey;
        switcherConfig.index = switcherIndex;

        var switcher = new WeaponSwitcher(switcherConfig);

        switcher.on('weaponSwitched', this.onWeaponSwitched.bind(this));

        switchers.push(switcher);
        switcherIndex ++;
    });
    return switchers;
};

Hud.prototype.update = function(){
    if(this.actor && !this.actor.dead){
        this.drawRadar();
        this.drawHealthBar(this.actor);
        this.switchers.forEach(switcher => {
            switcher.position = this.actor.position;
            switcher.angle = this.actor.angle;
            switcher.update();
        });
    }
};

Hud.prototype.onPlayerActorAppeared = function(actor){
    this.actor = actor;
};

Hud.prototype.onInput = function(inputState){
    this.switchers.forEach(switcher => {
        switcher.handleInput(inputState);
    });
};

Hud.prototype.onWeaponSwitched = function(event){
    var changeConfig = {
        weapon: event.data.weapon,
        index: event.index
    };

    if (this.actor && !this.actor.dead){
        this.actor.switchWeapon(changeConfig);
    }
    this.emit(
        {
            type: 'weaponSwitched',
            data: changeConfig
        }
    );
};


Hud.prototype.drawRadar = function(){
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

module.exports = Hud;
