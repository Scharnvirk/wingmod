import classnames from 'classnames';
import React from 'react';

// var PubSub = require('pubsub-js');

class Button extends React.Component {
    render() {
        let classes = classnames('button', ['button', 'buttonText', 'textLight', 'verticalSpacing', 'Oswald']);
        let buttonEvent = {buttonEvent: this.props.buttonEvent || 'noAction'};
        return <div
            onClick={()=>{
                PubSub.publish('buttonClick', buttonEvent);
            }}
            className={classes}
        >
            {this.props.text}
        </div>;
    }
}

module.exports = Button;
