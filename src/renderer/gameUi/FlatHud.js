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

    // this.weaponNames = {
    //     'lasgun': 'BURST LASER',
    //     'plasmagun': 'PLASMA CANNON',
    //     'pulsewavegun': 'PULSE WAVE GUN'
    // };

    this.switchers = this.createSwitchers();
    // this.weaponTextSprites = this.createWeaponTextSprites();
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
            // var offsetPosition = Utils.rotationToVector(switcher.rotation, 30);
            // var textSprite = this.weaponTextSprites[switcher.index];
            // textSprite.position.x = offsetPosition[0];
            // textSprite.position.y = positionY + offsetPosition[1];

            switcher.position = [0, positionY];
            switcher.update();
        });
    }

    this.sceneManager.render('FlatHudScene');
};

FlatHud.prototype.onPlayerActorAppeared = function(actor){
    this.actor = actor;
    // this.weaponTextSprites.forEach(textSprite => {
    //     this.sceneManager.get('FlatHudScene').threeScene.add(textSprite);
    // });
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

    // this.weaponTextSprites.forEach(textSprite => {
    //     textSprite.visible = this.hudActive;
    // });
};

FlatHud.prototype.onWeaponSwitched = function(event){
    var changeConfig = {
        weapon: event.data.weapon,
        index: event.index
    };

    if (this.actor && !this.actor.dead){
        this.actor.switchWeapon(changeConfig);
    }

    // this.drawWeaponName(event.index, event.data.weapon);

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

// FlatHud.prototype.createWeaponTextSprite = function(switcherConfig, switcherIndex){
//     var switcherTextSprite = new TextSprite({
//         visible: false,
//         fontSize: 40,
//         fontScale: 3,
//         height: 64,
//         widthMultiplier: 16
//     });
//     switcherTextSprite.drawMessage('');

//     return switcherTextSprite;
// };

// FlatHud.prototype.drawWeaponName = function(switcherIndex, weaponName){
//     this.weaponTextSprites[switcherIndex].drawMessage(this.weaponNames[weaponName]);
// };


module.exports = FlatHud;
