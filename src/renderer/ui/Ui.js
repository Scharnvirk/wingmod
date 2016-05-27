var ReactUi = require('renderer/ui/ReactUi');
var PubSub = require('pubsub-js');
var Core = require('renderer/Core');

function Ui(config){
    Object.assign(this, config);
    this.reactUi = new ReactUi();
    this.gameCore = null;

    this.configState = {};

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
            case 'lowResConfig':
                this.onLowResConfig(data);
                break;
            case 'lowParticlesConfig':
                this.onLowParticleConfig(data);
                break;
        }
    } );
};

Ui.prototype.init = function(){
    if(!this.gameCore){
        console.error("no GameCore set in UI!");
    }

    this.gameCore.init({
        shadows: !this.configState.shadows,
        lowRes: this.configState.lowRes,
        lowParticles: this.configState.lowParticles
    });
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
    this.emit({type: 'startGame'});
    this.reactUi.changeMode('running');
};

Ui.prototype.onShadowConfig = function(data){
    this.configState.shadows = data.state;
};

Ui.prototype.onLowResConfig = function(data){
    this.configState.lowRes = data.state;
};

Ui.prototype.onLowParticleConfig = function(data){
    this.configState.lowParticles = data.state;
};

module.exports = Ui;
