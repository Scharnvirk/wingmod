import React, {Component} from 'react';

var ReactSlider = require('react-slider');

class Slider extends Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {
            container: {
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '25vmin',
                height: '5vmin',
                pointerEvents: 'all',
                backgroundImage: 'url("gfx/button_background.png")',
                backgroundSize: 'contain',
                filter: 'drop-shadow(3px 3px 3px #000)'
            },

            sliderContainer: {
                width: '23.5vmin'
            }
        };

        this.state = {
            visible: true,
            value: this.props.value
        };
    }

    onChange(value) {
        this.setState({value: value});
        
        let actionEvent = {
            actionEvent: this.props.actionEvent || 'noAction',
            state: value
        };

        PubSub.publish('componentAction', actionEvent);
    }

    render() {
        let value = typeof this.state.value !== 'undefined' ? this.state.value : this.props.value;
        if (!this.state.visible) return null;
        return <div style={this.componentStyle.container} className={this.props.class}>
            <div style={this.componentStyle.sliderContainer}>
                <ReactSlider 
                    withBars
                    className={'horizontal-slider'}
                    minDistance={10}
                    value={value}
                    min={this.props.min || 0}
                    max={this.props.max || 9}
                    onChange={this.onChange.bind(this)}
                >
                    <div className="handle">{value}</div>
                </ReactSlider>
            </div>
        </div>;
    }
}

module.exports = Slider;
