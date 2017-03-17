import classnames from 'classnames';
import React from 'react';

var StartScreen = require('renderer/ui/component/StartScreen');
var EndScreen = require('renderer/ui/component/EndScreen');
var StartHelp = require('renderer/ui/component/StartHelp');
var FullScreenEffect = require('renderer/ui/component/base/FullScreenEffect');
var Viewport = require('renderer/ui/component/base/Viewport');
var AmmoTileContainer = require('renderer/ui/component/hud/AmmoTileContainer');
var MessageContainer = require('renderer/ui/component/hud/MessageContainer');
var WeaponInfoContainer = require('renderer/ui/component/hud/WeaponInfoContainer');

var ReactUtils = require('renderer/ui/ReactUtils');

var InitialView = React.createClass({
    render(){
        let UIcontent = [];
        switch(this.props.mode || 'startScreen'){
        case 'startScreen':
            UIcontent.push(<StartScreen key={ReactUtils.generateKey()} isBrowserMobile={this.props.isBrowserMobile}/>);
            break;
        case 'helpScreen':
            UIcontent.push(<StartHelp key={ReactUtils.generateKey()}/>);
            break;
        case 'gameOverScreen':
            UIcontent.push(<
                EndScreen key={ReactUtils.generateKey()}
                scoreText={ReactUtils.multilinize(this.props.context.scoreText)}
                bigText={ReactUtils.multilinize(this.props.context.bigText)}
                enemyCausingDeathIndex={this.props.context.enemyCausingDeathIndex}
                killStats={this.props.context.killStats}
                />);
            break;
        }

        let blurState;
        switch(this.props.mode){
        case 'running':
            blurState = 'end';
            break;
        case 'gameOverScreen':
            blurState = 'start';
            break; 
        default:
            blurState = 'end';
        }

        return <div>
            <FullScreenEffect blur={blurState}>
                <Viewport>
                </Viewport>
            </FullScreenEffect>

            <AmmoTileContainer/>
            <MessageContainer/>
            {UIcontent}
        </div>;
    }
});

module.exports = InitialView;
