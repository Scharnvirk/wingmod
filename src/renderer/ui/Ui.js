var ReactUi = require('renderer/ui/ReactUi');
var Core = require('renderer/Core');

function Ui(config){
    Object.assign(this, config);
    this.reactUi = new ReactUi();
    this.gameCore = null;

    this.assetsLoaded = false;

    this.setupButtonListener();
    EventEmitter.apply(this, arguments);
}

Ui.extend(EventEmitter);

Ui.prototype.setupButtonListener = function(){
    PubSub.subscribe( 'buttonClick', (msg, data) => {
        switch(data.buttonEvent){
        case 'start':
            this.onStartButtonClick();
            break;
        case 'stop':
            this.onStop();
            break;
        case 'shadowConfig':
            this.onShadowConfig(data);
            break;
        case 'resolutionConfig':
            this.onResolutionConfig(data);
            break;
        case 'soundConfig':
            this.onSoundConfig(data);
            break;
        }
    } );
};

Ui.prototype.init = function(){
    if(!this.gameCore){
        console.error('no GameCore set in UI!');
    }

    this.gameCore.init();
};

Ui.prototype.setAssetsLoaded = function(state){
    this.assetsLoaded = state;
};

Ui.prototype.stopGame = function(){
    var bigText = 'GAME OVER';
    var scoreText = 'Don\'t worry! Next time you will do better!';
    this.reactUi.changeMode('gameOverScreen', {scoreText: scoreText, bigText: bigText});
};

Ui.prototype.stopGameFinished = function(){
    var bigText = 'SUCCESS!';
    var scoreText = 'Congratulations! Thanks for trying Wingmod2!';
    this.reactUi.changeMode('gameOverScreen', {scoreText: scoreText, bigText: bigText});
};

Ui.prototype.onStartButtonClick = function(){
    if(this.assetsLoaded){
        this.reactUi.changeMode('helpScreen');
        this.emit({type: 'requestPointerLock'});
    }
};

Ui.prototype.gotPointerLock = function(){
    let newMode = this.reactUi.changeMode('running');
    if (newMode === 'running') {
        this.emit({type: 'startGame'});
    }
};

Ui.prototype.lostPointerLock = function(){
    this.reactUi.changeMode('helpScreen');
};

Ui.prototype.onShadowConfig = function(data){
    this.emit({type: 'shadowConfig', option: data.buttonEvent, value: data.state});
};

Ui.prototype.onResolutionConfig = function(data){
    this.emit({type: 'resolutionConfig', option: data.buttonEvent, value: data.state});
};

Ui.prototype.onSoundConfig = function(data){
    this.emit({type: 'soundConfig', option: data.buttonEvent, value: data.state});
};

Ui.prototype.updateState = function(state){
    PubSub.publish('hudStateChange', state);
};
    

module.exports = Ui;
