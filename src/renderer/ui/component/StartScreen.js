import classnames from 'classnames';
import React from 'react';

var StyledText = require('renderer/ui/component/base/StyledText');
var SettingsMenu = require('renderer/ui/component/SettingsMenu');
var Button = require('renderer/ui/component/base/Button');
var Window = require('renderer/ui/component/base/Window');
var FlexBoxContainer = require('renderer/ui/component/base/FlexBoxContainer');
var EndGamePanel = require('renderer/ui/component/endGame/EndGamePanel');
var ReactUtils = require('renderer/ui/ReactUtils');

var componentStyle = {
    container: {     
        justifyContent: 'center'
    },
    titleText: {
        textAlign: 'center',
        letterSpacing: '1vmin',
        fontSize: '8vmin',
        color: 'white',
        textShadow: '1vmin 1vmin 1vmin rgba(0, 0, 0, 0.2)',
        whiteSpace: 'nowrap',
        fontFamily: 'Oswald-ExtraLight',
        WebkitTouchCallout: 'none',
        WebkitUserSelect: 'none',
        khtmlUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitUserDrag: 'none',
        userDrag: 'none',
        userSelect: 'none'
    }
};

var StartScreen = React.createClass({
    getInitialState() {
        return { assetsLoaded: false };
    },
    componentWillMount() {
        PubSub.subscribe( 'assetsLoaded', (msg, data) => {
            this.setState({assetsLoaded: true});
            this.render();
        });
    },
    render() {
        var startText = this.props.isBrowserMobile ? 'START DEMO' : 'START GAME';
        var startButtonText = this.state.assetsLoaded ? startText : 'LOADING...';

        return <FlexBoxContainer style={componentStyle.container}>
            <div style={componentStyle.titleText}>
                <span>{'WINGMOD'}</span>
                <span style={{color: 'red'}}>{'2'}</span>
            </div>
            <Button text={startButtonText} buttonEvent={'start'} />
            <SettingsMenu visible={this.state.assetsLoaded}/>
        </FlexBoxContainer>;
    }
});

module.exports = StartScreen;
