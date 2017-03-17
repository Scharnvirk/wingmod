import classnames from 'classnames';
import React, {Component} from 'react';

var StyledText = require('renderer/ui/component/base/StyledText');
var ToggleButton = require('renderer/ui/component/base/ToggleButton');
var OptionButton = require('renderer/ui/component/base/OptionButton');
var Slider = require('renderer/ui/component/base/Slider');

class SettingsMenu extends Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {
            settingItem: {
                display: 'flex', 
                width: '50vmin',
                flexDirection: 'row',
                marginBottom: '1vh',
                justifyContent: 'flex-end'
            },
            settingText: {
                fontFamily: 'Oswald-Regular',
                color: '#666666',
                textAlign: 'center',
                letterSpacing: '0.35vmin',
                fontSize: '3vmin',
                lineHeight: '5vmin',
                textShadow: '0.5vmin 0.5vmin 0.5vmin rgba(0, 0, 0, 0.2)',
                whiteSpace: 'nowrap',
                marginRight: '1vmin'
            },
            buttonStyle: {
                width: '25vmin',
                height: '5vmin',
                lineHeight: '5vmin',
                fontSize: '3vmin',
                letterSpacing: '0.35vmin',
            }
        };

        this.state = {
            initialConfigs: {}
        };

        PubSub.subscribe( 'setConfig', (message, data) => {
            this.setState({initialConfigs: data});
        });
    }

    render(){
        const style = this.props.visible ? {
            animationName: 'settingsFadeIn',
            animationDuration: '1s',
            animationFillMode: 'forwards',
            opacity: 0,
            bottom: '10vh',
            position: 'fixed'
        } : {
            opacity: 0,
            bottom: '10vh',
            position: 'fixed'
        };

        return <div style={style}>

            <div style = {this.componentStyle.settingItem}>
                <span style={this.componentStyle.settingText} >{'SHADOWS:'}</span>
                <OptionButton 
                    actionEvent={'shadowConfig'} 
                    options={['NONE', 'BASIC', 'SMOOTH']} 
                    value={this.state.initialConfigs.shadow}
                    style={this.componentStyle.buttonStyle}
                />
            </div>

            <div style = {this.componentStyle.settingItem}>
                <span style={this.componentStyle.settingText} >{'RESOLUTION:'}</span>
                <OptionButton 
                    actionEvent={'resolutionConfig'} 
                    options={['LOW', 'MEDIUM', 'HIGH', 'TOO HIGH']} 
                    value={this.state.initialConfigs.resolution}
                    style={this.componentStyle.buttonStyle}
                />
            </div>

            <div style = {this.componentStyle.settingItem}>
                <span style={this.componentStyle.settingText} >{'DISTANCE:'}</span>
                <Slider
                    min={1} 
                    actionEvent={'renderDistance'} 
                    class={classnames('class', ['highlight'])} 
                    value={this.state.initialConfigs.renderDistance}
                />
            </div>

            <div style = {this.componentStyle.settingItem}>
                <span style={this.componentStyle.settingText} >{'SOUND:'}</span>
                <Slider 
                    actionEvent={'soundConfig'} 
                    class={classnames('class', ['highlight'])} 
                    value={this.state.initialConfigs.soundVolume}
                />
            </div>

            <div style = {this.componentStyle.settingItem}>
                <span style={this.componentStyle.settingText} >{'BACKGROUND:'}</span>
                <OptionButton 
                    actionEvent={'backgroundMode'} 
                    options={['RANDOM', 'SPACE', 'RANCID', 'FOG', 'DOOM', 'SUNKEN']} 
                    value={this.state.initialConfigs.backgroundMode}
                    style={this.componentStyle.buttonStyle}
                />
            </div>

        </div>;
    }
};

module.exports = SettingsMenu;

/**
 * 
 * 
            <div style = {this.componentStyle.settingItem} className={'centerHorizontal'}>
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

            <div style = {this.componentStyle.settingItem} className={'centerHorizontal'}>
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

            <div style = {this.componentStyle.settingItem} className={'centerHorizontal'}>
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

            <div style = {this.componentStyle.settingItem} className={'centerHorizontal'}>
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
 */