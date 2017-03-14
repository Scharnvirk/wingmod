import classnames from 'classnames';
import React from 'react';


var StyledText = require('renderer/ui/component/base/StyledText');
var SettingsMenu = require('renderer/ui/component/SettingsMenu');
var Button = require('renderer/ui/component/base/Button');
var Window = require('renderer/ui/component/base/Window');
var FlexBoxContainer = require('renderer/ui/component/base/FlexBoxContainer');
var EndGamePanel = require('renderer/ui/component/endGame/EndGamePanel');
var ReactUtils = require('renderer/ui/ReactUtils');


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
        var startButtonText = this.state.assetsLoaded ? 'START GAME' : 'LOADING...';

        return <div> 
            <div
                className = { classnames('class', ['bottomCenter', 'verticalSpacing']) }
                style = {{bottom: '40%'}}
            >
                <StyledText style={'titleText'}>
                    <span>{'WINGMOD'}</span>
                    <span style={{color: 'red'}}>{'2'}</span>
                </StyledText>
                <Button text={startButtonText} buttonEvent={'start'} />
                <SettingsMenu visible={this.state.assetsLoaded}/>
            </div>
        </div>;
    }
});

module.exports = StartScreen;
