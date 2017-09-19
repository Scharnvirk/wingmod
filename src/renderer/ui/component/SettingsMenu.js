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
                fontFamily: 'Oswald-ExtraLight',
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
                <span style={this.componentStyle.settingText} >{'DIFFICULTY:'}</span>
                <OptionButton 
                    actionEvent={'difficultyConfig'} 
                    options={['JUST 4 FUN', 'CHALLENGE', 'HARD', 'INSANE', 'LUDICROUS']} 
                    value={this.state.initialConfigs.difficulty}
                    style={this.componentStyle.buttonStyle}
                />
            </div>

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

            <div style = {this.componentStyle.settingItem}>
                <span style={this.componentStyle.settingText} >{'CONTROLS:'}</span>
                <OptionButton 
                    actionEvent={'backgroundMode'} 
                    options={['MOUSE', 'KEYBOARD A', 'KEYBOARD B']} 
                    value={this.state.initialConfigs.backgroundMode}
                    style={this.componentStyle.buttonStyle}
                />
            </div>

        </div>;
    }
}

module.exports = SettingsMenu;
