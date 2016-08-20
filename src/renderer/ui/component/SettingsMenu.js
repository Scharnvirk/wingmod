import classnames from 'classnames';
import React from 'react';


var StyledText = require('renderer/ui/component/base/StyledText');
var ToggleButton = require('renderer/ui/component/base/ToggleButton');
var OptionButton = require('renderer/ui/component/base/OptionButton');

var SettingsMenu = React.createClass({
    getInitialState() {
        return { initialConfigs: {} };
    },
    componentWillMount() {
        PubSub.subscribe( 'setConfig', (message, data) => {
            this.setState({initialConfigs: data});
        });
    },
    render(){
        return <div style={{marginTop: '100px'}} className={'bottomCenter'}>

            <div style = {{width: '350px'}} className={'centerHorizontal'}>
                <div style = { {float:'left', marginTop: '6px'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <span className={'textDark'} >{'SHADOWS:'}</span>
                </StyledText> </div>
                <div style = { {float:'right'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <OptionButton buttonEvent={'shadowConfig'} options={['NONE', 'BASIC', 'SMOOTH']} value={this.state.initialConfigs.shadow}/>
                </StyledText>  </div>
            </div>

            <div style = {{width: '350px'}} className={'centerHorizontal'}>
                <div style = { {float:'left', marginTop: '12px'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <span className={'textDark'} >{'RESOLUTION:'}</span>
                </StyledText> </div>
                <div style = { {float:'right'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <OptionButton buttonEvent={'resolutionConfig'} options={['LOW', 'MEDIUM', 'HIGH', 'TOO HIGH']} value={this.state.initialConfigs.resolution}/>
                </StyledText>  </div>
            </div>

            <div style = {{width: '350px'}} className={'centerHorizontal'}>
                <div style = { {float:'left', marginTop: '12px'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <span className={'textDark'} >{'SOUND:'}</span>
                </StyledText> </div>
                <div style = { {float:'right'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <OptionButton buttonEvent={'soundConfig'} options={['OFF', 'SILENT', 'NORMAL', 'LOUD']} value={this.state.initialConfigs.soundVolume}/>
                </StyledText>  </div>
            </div>
        </div>;
    }
});

module.exports = SettingsMenu;
