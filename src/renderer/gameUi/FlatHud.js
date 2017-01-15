var WeaponSwitcher = require('renderer/gameUi/WeaponSwitcher');
// var TextSprite = require('renderer/gameUi/TextSprite');

function FlatHud(config){
    Object.assign(this, config);

    if(!this.sceneManager) throw new Error('No sceneManager defined for FlatHud!');
    if(!this.renderer) throw new Error('No renderer defined for FlatHud!');

    this.activationKey = 'shift';
    
    this.switchersConfig = [
        {
            rotation: Utils.degToRad(90),
            switchKey: 'mouseLeft'
        }, {
            rotation: Utils.degToRad(-90),
            switchKey: 'mouseRight'
        }
    ];

    this.switchers = this.createSwitchers();
    this.hudActive = false;

    EventEmitter.apply(this, arguments);
}

FlatHud.extend(EventEmitter);

FlatHud.prototype.update = function(){
    if(this.actor && !this.actor.dead && this.hudActive){
        var gameSceneCamera = this.sceneManager.get('GameScene').camera;
        var hudSceneCamera = this.sceneManager.get('FlatHudScene').camera;
        var actorPosition = Utils.gamePositionToScreenPosition(this.actor.getPosition(), this.renderer, gameSceneCamera);
        var coefficient = hudSceneCamera.viewWidth / document.documentElement.clientWidth / this.configManager.config.resolution;
        var positionY = -(actorPosition[1] * coefficient - hudSceneCamera.viewHeight / 2);

        this.switchers.forEach(switcher => {
            switcher.position = [0, positionY];
            switcher.update();
        });
    }

    this.sceneManager.render('FlatHudScene');
};

FlatHud.prototype.onPlayerActorAppeared = function(actor){
    this.actor = actor;
};

FlatHud.prototype.createSwitchers = function(){
    var switcherIndex = 0;
    var switchers = [];
    this.switchersConfig.forEach(switcherConfig => {
        var switcher = this.createSwitcher(switcherConfig, switcherIndex);
        switchers.push(switcher);
        switcherIndex ++;
    });
    return switchers;
};

FlatHud.prototype.createWeaponTextSprites = function(){
    var switcherIndex = 0;
    var weaponTextSprites = [];
    this.switchersConfig.forEach(switcherConfig => {
        var weaponTextSprite = this.createWeaponTextSprite(switcherConfig, switcherIndex);
        weaponTextSprites.push(weaponTextSprite);
        switcherIndex ++;
    });
    return weaponTextSprites;
};

FlatHud.prototype.onInput = function(inputState){
    this.hudActive = !!inputState[this.activationKey];
    this.switchers.forEach(switcher => {
        switcher.handleInput(inputState);
    });
};

FlatHud.prototype.onWeaponSwitched = function(event){
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

FlatHud.prototype.createSwitcher = function(switcherConfig, switcherIndex){
    switcherConfig.sceneManager = this.sceneManager;
    switcherConfig.activationKey = this.activationKey;
    switcherConfig.index = switcherIndex;

    var switcher = new WeaponSwitcher(switcherConfig);
    switcher.on('weaponSwitched', this.onWeaponSwitched.bind(this));

    return switcher;
};

module.exports = FlatHud;
