import classnames from 'classnames';
import React from 'react';

// var PubSub = require('pubsub-js');

class Button extends React.Component {
    render() {
        let classes = classnames('button', ['button', 'buttonText', 'verticalSpacing', 'Oswald']);
        let buttonEvent = {actionEvent: this.props.buttonEvent || 'noAction'};
        return <div
            onClick={()=>{
                PubSub.publish('componentAction', buttonEvent);
            }}
            className={classes}
        >
            {this.props.text}
        </div>;
    }
}

module.exports = Button;
