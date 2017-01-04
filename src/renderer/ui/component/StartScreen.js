import classnames from 'classnames';
import React from 'react';


var StyledText = require('renderer/ui/component/base/StyledText');
var SettingsMenu = require('renderer/ui/component/SettingsMenu');
var Button = require('renderer/ui/component/base/Button');
var ReactUtils = require('renderer/ui/ReactUtils');


var bottomText = ReactUtils.multilinize(
    'Wingmod 2 is a little experimental project aimed at learning'+
    '\nand experimenting with various web technologies.\n'+
    '\n'+
    'Please note that this project depends very heavily on WebGL, so it works best on a PC.\n'+
    'No mobile support is planned as keyboard and mouse are essential, but for debug you can try it.\n'+
    '\n'+
    'Some frameworks were surely and painfully harmed in the making of this... thing.\n'
);

var StartScreen = React.createClass({
    getInitialState() {
        return { assetsLoaded: false };
    },
    componentWillMount() {
        console.log('assetsLoadedPubsub', PubSub);
        PubSub.subscribe( 'assetsLoaded', (msg, data) => {
            this.setState({assetsLoaded: true});
        });
    },
    render() {
        var versionText = 'ver. ' + (Constants.VERSION || 'LOCAL BUILD');
        var startButtonText = this.state.assetsLoaded ? 'START GAME' : 'LOADING...';
        var startClass = this.state.assetsLoaded ? '' : 'textDark';

        return <div>
            <div
                className = { classnames('class', ['bottomCenter', 'verticalSpacing']) }
                style = {{bottom: '300px'}}
            >
                <StyledText style={'titleText'}>
                    <span>{'WINGMOD'}</span>
                    <span style={{color: 'red'}}>{'2'}</span>
                </StyledText>
                <Button text={startButtonText} buttonEvent={'start'} />
                <SettingsMenu/>
            </div>
            <StyledText style={classnames('class', ['smallText', 'topRightCorner' ])}>
                <span className={'textDark'} >{versionText}</span>
            </StyledText>
        </div>;
    }
});

module.exports = StartScreen;
