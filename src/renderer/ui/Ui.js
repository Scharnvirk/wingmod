var ReactUi = require('renderer/ui/ReactUi');

function Ui(config){
    this.isBrowserMobile = config.isBrowserMobile;

    this.reactUi = new ReactUi({isBrowserMobile: this.isBrowserMobile});
    this.gameCore = null;
    
    this.assetsLoaded = false;

    this.setupButtonListener();
    EventEmitter.apply(this, arguments);
}

Ui.extend(EventEmitter);

Ui.prototype.setupButtonListener = function(){
    PubSub.subscribe( 'componentAction', (msg, data) => {
        switch(data.actionEvent){
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
        case 'backgroundMode':
            this.onBackgroundModeConfig(data);
            break;
        case 'renderDistance':
            this.onRenderDistanceConfig(data);
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

Ui.prototype.stopGame = function(enemyCausingDeathIndex, killStats){
    const bigText = 'GAME OVER';
    const pcScoreText = 'Don\'t worry! Next time you will do better!';
    const mobileScoreText = 'You can try playing the game on the PC!';

    this.reactUi.changeMode('gameOverScreen', {
        scoreText: this.isBrowserMobile ? mobileScoreText : pcScoreText, 
        bigText: bigText,
        enemyCausingDeathIndex: enemyCausingDeathIndex,
        killStats: killStats
    });
};

Ui.prototype.stopGameFinished = function(enemyCausingDeathIndex, killStats){
    const bigText = 'SUCCESS!';
    const scoreText = 'Congratulations! Thanks for trying Wingmod2!';

    this.reactUi.changeMode('gameOverScreen', {
        scoreText: scoreText, 
        bigText: bigText,
        enemyCausingDeathIndex: enemyCausingDeathIndex,
        killStats: killStats
    });
};

Ui.prototype.onStartButtonClick = function(){
    if (this.assetsLoaded) {
        if (this.isBrowserMobile) {
            this.gotPointerLock();
        } else {
            this.reactUi.changeMode('helpScreen');
            this.emit({type: 'requestPointerLock'});
        }        
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

Ui.prototype.onBackgroundModeConfig = function(data){
    this.emit({type: 'backgroundModeConfig', option: data.buttonEvent, value: data.state});
};

Ui.prototype.onRenderDistanceConfig = function(data){
    this.emit({type: 'renderDistanceConfig', option: data.buttonEvent, value: data.state});
};

Ui.prototype.updateState = function(state){
    PubSub.publish('hudStateChange', state);
};
    

module.exports = Ui;
