var ReactUi = require('renderer/ui/ReactUi');
var PubSub = require('pubsub-js');
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
    console.log(PubSub);
    PubSub.subscribe( 'buttonClick', (msg, data) => {
        switch(data.buttonEvent){
            case 'start':
                this.onStartButtonClick();
                break;
            case 'stop':
                this.onStop();
                break;
            case 'noShadows':
                this.onNoShadowsConfig(data);
                break;
            case 'lowRes':
                this.onLowResConfig(data);
                break;
            case 'noSound':
                this.onNoSoundConfig(data);
                break;
        }
    } );
};

Ui.prototype.init = function(){
    if(!this.gameCore){
        console.error("no GameCore set in UI!");
    }

    this.gameCore.init();
};

Ui.prototype.setAssetsLoaded = function(state){
    this.assetsLoaded = state;
};

Ui.prototype.stopGame = function(info){
    var bigText = 'GAME OVER';
    var scoreText = 'BOTS DESTROYED: ' + info.enemiesKilled;
    this.reactUi.changeMode('gameOverScreen', {scoreText: scoreText, bigText: bigText});
};

Ui.prototype.stopGameFinished = function(){
    var bigText = 'SUCCESS!';
    var scoreText = 'Congratulations! You have done it!';
    this.reactUi.changeMode('gameOverScreen', {scoreText: scoreText, bigText: bigText});
};

Ui.prototype.onStartButtonClick = function(){
    if(this.assetsLoaded){
        this.emit({type: 'startGame'});
        this.reactUi.changeMode('running');
    }
};

Ui.prototype.onNoShadowsConfig = function(data){
    this.emit({type: 'coreConfig', option: data.buttonEvent, value: data.state});
};

Ui.prototype.onLowResConfig = function(data){
    this.emit({type: 'coreConfig', option: data.buttonEvent, value: data.state});
};

Ui.prototype.onNoSoundConfig = function(data){
    this.emit({type: 'coreConfig', option: data.buttonEvent, value: data.state});
};

module.exports = Ui;
