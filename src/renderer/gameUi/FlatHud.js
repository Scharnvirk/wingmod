var WeaponSwitcher = require('renderer/gameUi/WeaponSwitcher');

function FlatHud(config){
    Object.assign(this, config);

    if(!this.sceneManager) throw new Error('No sceneManager defined for FlatHud!');
    if(!this.renderer) throw new Error('No renderer defined for FlatHud!');

    this.switchersConfig = [
        {
            index: 0,
            rotationOffset: 90,
            switchNextKey: 'mouseLeft',
            switchPrevKey: 'mouseRight',
            activationKey: 'e',
            weapons: ['redlasgun', 'lasgun', 'pulsewavegun']
        }, {
            index: 1,
            rotationOffset: -90,
            switchNextKey: 'mouseLeft',
            switchPrevKey: 'mouseRight',
            activationKey: 'q',
            weapons: ['plasmagun', 'missilelauncher', 'plasmablast', 'homingmissilelauncher'], 
            invertDirection: true
        }
    ];

    this.switchers = this._createSwitchers();
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
            switcher.update([0, positionY]);
        });
    }

    this.sceneManager.render('FlatHudScene');
};

FlatHud.prototype.onPlayerActorAppeared = function(actor){
    this.actor = actor;  
};

FlatHud.prototype.selectInitialWeapons = function() {
    this.switchers.forEach(switcher => switcher.notifyOfCurrentSelection());
};

FlatHud.prototype.onInput = function(inputState){
    this.switchers.forEach(switcher => {
        switcher.handleInput(inputState);
        this.hudActive = this.hudActive || !!inputState[switcher.props.activationKey];
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

FlatHud.prototype._createWeaponTextSprites = function(){
    var switcherIndex = 0;
    var weaponTextSprites = [];
    this.switchersConfig.forEach(switcherConfig => {
        var weaponTextSprite = this._createWeaponTextSprite(switcherConfig, switcherIndex);
        weaponTextSprites.push(weaponTextSprite);
        switcherIndex ++;
    });
    return weaponTextSprites;
};

FlatHud.prototype._createSwitchers = function() {
    var switcherIndex = 0;
    var switchers = [];
    this.switchersConfig.forEach(switcherConfig => {
        var switcher = this._createSwitcher(switcherConfig, switcherIndex);
        switchers.push(switcher);
        switcherIndex ++;
    });
    return switchers;
};

FlatHud.prototype._createSwitcher = function(switcherConfig, switcherIndex) {
    switcherConfig.scene = this.sceneManager.get('FlatHudScene');
    switcherConfig.index = switcherIndex;

    var switcher = new WeaponSwitcher(switcherConfig);
    switcher.on('weaponSwitched', this.onWeaponSwitched.bind(this));

    return switcher;
};


module.exports = FlatHud;
