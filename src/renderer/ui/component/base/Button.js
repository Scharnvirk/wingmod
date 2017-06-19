import classnames from 'classnames';
import React from 'react';

class Button extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {
            button: {
                display: 'flex', 
                justifyContent: 'center',
                width: '29.99vmin', //god why
                height: '6vmin',
                pointerEvents: 'all',
                animationDuration: '0.1s',
                animationFillMode: 'forwards',
                animationName: 'buttonHoverOut',
                backgroundImage: 'url("gfx/button_background.png")',
                backgroundSize: 'contain',
                backgroundRepeat: 'none',
                filter: 'drop-shadow(3px 3px 3px #000)',
                textAlign: 'center',
                verticalAlign: 'middle',
                lineHeight: '6vmin',
                fontSize: '3vmin',
                letterSpacing: '0.5vmin',
                fontFamily: 'Oswald-ExtraLight'
            }
        };
    }

    render() {
        let buttonEvent = {actionEvent: this.props.buttonEvent || 'noAction'};
        return <div
            onClick={()=>{
                PubSub.publish('componentAction', buttonEvent);
            }}
            className={classnames('buttonHover')}
            style={this.componentStyle.button}
        >
            {this.props.text}
        </div>;
    }
}

module.exports = Button;
