var ReactUi = require('renderer/ui/ReactUi');
var PubSub = require('pubsub-js');
var Core = require('renderer/Core');

function Ui(config){
    Object.assign(this, config);
    this.reactUi = new ReactUi();

    this.configState = {};

    this.setupButtonListener();
}

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

Ui.prototype.startGame = function(){
    if(!this.gameCore){
        console.error("no GameCore set in UI!");
    }

    gameCore.init({
        shadows: !this.configState.shadows,
        lowRes: this.configState.lowRes,
        lowParticles: this.configState.lowParticles
    });
};

Ui.prototype.stopGame = function(info){
    var scoreText = 'BOTS DESTROYED: ' + info.enemiesKilled;
    this.reactUi.changeMode('gameOverScreen', {scoreText: scoreText});
};

Ui.prototype.onStartButtonClick = function(){
    this.startGame();
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

Ui.prototype.getOpinionOnResult = function(remainingMooks){
    if (remainingMooks === 100){
        return 'You didn\'t even try, did you?';
    } else if (remainingMooks > 90 && remainingMooks < 100){
        return 'You seem to have discovered shooting function.';
    } else if (remainingMooks > 80 && remainingMooks < 90){
        return 'Far, far away.';
    } else if (remainingMooks > 70 && remainingMooks < 80){
        return 'Come on. You can do better! I hope, for this is only a techtest and they still suck.';
    } else if (remainingMooks > 60 && remainingMooks < 70){
        return 'Try using your second weapon on them. Works much better.';
    } else if (remainingMooks > 50 && remainingMooks < 60){
        return 'You know you can shoot down these orange blobs with your primary weapon?';
    } else if (remainingMooks > 40 && remainingMooks < 50){
        return 'Only half more to go.';
    } else if (remainingMooks > 30 && remainingMooks < 40){
        return 'That is a formidable effort.';
    } else if (remainingMooks > 20 && remainingMooks < 30){
        return 'It should be getting easier by now.';
    } else if (remainingMooks > 10 && remainingMooks < 20){
        return 'So close.';
    } else if (remainingMooks > 0 && remainingMooks < 10){
        return 'Almost there. Got unlucky with a stray shot?';
    } else if (remainingMooks === 0){
        return 'You got them all! Grats!';
    } else {
        return '';
    }
};

module.exports = Ui;
