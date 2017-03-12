import React, {Component} from 'react';

var Slider = require('renderer/ui/component/base/Slider');
var ReactUtils = require('renderer/ui/ReactUtils');

class EndGameWindow extends Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {
            window: {
                display: 'flex', 
                alignItems: 'center',
                backgroundColor: '#883322',      
                width: '60vw',
                height: '60vh' 
            }
        };

        this.state = {
            visible: false,
            value: 0
        };
    }

    onChange(value) {
        this.setState({value: value});
    }

    render() {
        if (!this.state.visible) return null;
        return <div style={this.componentStyle.window}>
            asd
            <Slider></Slider>
        </div>;
    }
}

module.exports = EndGameWindow;
