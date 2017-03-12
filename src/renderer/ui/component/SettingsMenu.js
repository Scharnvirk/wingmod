import classnames from 'classnames';
import React from 'react';


var StyledText = require('renderer/ui/component/base/StyledText');
var ToggleButton = require('renderer/ui/component/base/ToggleButton');
var OptionButton = require('renderer/ui/component/base/OptionButton');
var Slider = require('renderer/ui/component/base/Slider');

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
        const style = this.props.visible ? {
            animationName: 'settingsFadeIn',
            animationDuration: '1s',
            animationFillMode: 'forwards',
            opacity: 0
        } : {
            opacity: 0
        };

        return <div style={style} className={'bottomCenter'}>

            <div style = {{width: '350px'}} className={'centerHorizontal'}>
                <div style = { {float:'left', marginTop: '6px'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <span className={'textDark'} >{'SHADOWS:'}</span>
                </StyledText> </div>
                <div style = { {float:'right'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <OptionButton 
                        actionEvent={'shadowConfig'} 
                        options={['NONE', 'BASIC', 'SMOOTH']} 
                        value={this.state.initialConfigs.shadow}
                    />
                </StyledText>  </div>
            </div>

            <div style = {{width: '350px'}} className={'centerHorizontal'}>
                <div style = { {float:'left', marginTop: '12px'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <span className={'textDark'} >{'RESOLUTION:'}</span>
                </StyledText> </div>
                <div style = { {float:'right'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <OptionButton 
                        actionEvent={'resolutionConfig'} 
                        options={['LOW', 'MEDIUM', 'HIGH', 'TOO HIGH']} 
                        value={this.state.initialConfigs.resolution}
                    />
                </StyledText>  </div>
            </div>

            <div style = {{width: '350px'}} className={'centerHorizontal'}>
                <div style = { {float:'left', marginTop: '12px'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <span className={'textDark'} >{'DISTANCE:'}</span>
                </StyledText> </div>
                <div style = { {float:'right'} }> <StyledText style={classnames('class', ['verticalSpacing'])}>
                     <Slider
                        min={1} 
                        actionEvent={'renderDistance'} 
                        class={classnames('class', ['highlight'])} 
                        value={this.state.initialConfigs.renderDistance}
                    />
                </StyledText>  </div>
            </div>

            <div style = {{width: '350px'}} className={'centerHorizontal'}>
                <div style = { {float:'left', marginTop: '12px'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <span className={'textDark'} >{'SOUND:'}</span>
                </StyledText> </div>
                <div style = { {float:'right'} }> <StyledText style={classnames('class', ['verticalSpacing'])}>
                    <Slider 
                        actionEvent={'soundConfig'} 
                        class={classnames('class', ['highlight'])} 
                        value={this.state.initialConfigs.soundVolume}
                    />
                </StyledText>  </div>
            </div>

            <div style = {{width: '350px'}} className={'centerHorizontal'}>
                <div style = { {float:'left', marginTop: '12px'} }> <StyledText style={classnames('class', ['smallText', 'verticalSpacing'])}>
                    <span className={'textDark'} >{'BACKGROUND:'}</span>
                </StyledText> </div>
                <div style = { {float:'right'} }> <StyledText style={classnames('class', ['verticalSpacing'])}>
                    <OptionButton 
                        actionEvent={'backgroundMode'} 
                        options={['RANDOM', 'SPACE', 'RANCID', 'FOG', 'DOOM', 'SUNKEN']} 
                        value={this.state.initialConfigs.backgroundMode}
                    />
                </StyledText>  </div>
            </div>
        </div>;
    }
});

module.exports = SettingsMenu;
