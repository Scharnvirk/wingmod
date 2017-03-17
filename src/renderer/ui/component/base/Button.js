import classnames from 'classnames';
import React from 'react';

class Button extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {
            button: {
                display: 'flex', 
                justifyContent: 'center',
                width: '30vmin',
                height: '6vmin',
                pointerEvents: 'all',
                animationDuration: '0.1s',
                animationFillMode: 'forwards',
                animationName: 'buttonHoverOut',
                backgroundImage: 'url("gfx/button_background.png")',
                backgroundSize: 'contain',
                filter: 'drop-shadow(3px 3px 3px #000)',
                textAlign: 'center',
                verticalAlign: 'middle',
                lineHeight: '6vmin',
                fontSize: '3vmin',
                letterSpacing: '0.5vmin',
                fontFamily: 'Oswald-Regular'
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
