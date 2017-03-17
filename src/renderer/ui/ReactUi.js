import classnames from 'classnames';
import React from 'react';
import ReactDOM from 'react-dom';

var InitialView = require('renderer/ui/component/InitialView');

function ReactUi(config){
    Utils.mixin(this, THREE.EventDispatcher);
    this.isBrowserMobile = config.isBrowserMobile;
    this.InitialView = <InitialView isBrowserMobile={this.isBrowserMobile}/>;
    this.render();
    EventEmitter.apply(this, arguments);
}

ReactUi.extend(EventEmitter);

ReactUi.prototype.render = function(){
    ReactDOM.render(
        this.InitialView,
        document.getElementById('react-content')
    );
};

ReactUi.prototype.changeMode = function(newMode, context){
    switch(newMode){
    case 'running':
        if (this.InitialView.props.mode === 'helpScreen' || this.isBrowserMobile){
            let gameViewport = document.getElementById('gameViewport');
            if(!gameViewport.classList.contains('noPointerEvents')){
                gameViewport.addClass('noPointerEvents');
            }

            this.InitialView = <InitialView mode={newMode} context={context} isBrowserMobile={this.isBrowserMobile}/>;
            this.render();
        }
        break;
    case 'gameOverScreen':
        this.InitialView = <InitialView mode={newMode} context={context} isBrowserMobile={this.isBrowserMobile}/>;
        this.render();
        break;
    case 'helpScreen':
        this.InitialView = <InitialView mode={newMode} context={context} isBrowserMobile={this.isBrowserMobile}/>;
        this.render();
        break;
    }

    return this.InitialView.props.mode;
};

module.exports = ReactUi;