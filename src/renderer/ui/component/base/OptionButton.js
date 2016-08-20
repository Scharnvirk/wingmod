import classnames from 'classnames';
import React from 'react';

var PubSub = require('pubsub-js');

var OptionButton = React.createClass({
    getInitialState(){
        return {
            selectedOption: -1
        };
    },
    render() {
        let classes = classnames('button', ['button', 'buttonText', 'textLight', 'verticalSpacing', 'Oswald', 'noSelect']);
        let options = this.props.options || [];
        let optionValue = this.state.selectedOption >= 0 ? this.state.selectedOption : this.props.value;

        let buttonEvent = {
            buttonEvent: this.props.buttonEvent || 'noAction',
            state: optionValue
        };

        return <div
            onClick={()=>{
                let nextOptionValue = optionValue >= options.length - 1 ? 0 : optionValue + 1;
                this.setState({selectedOption: nextOptionValue});
                buttonEvent.state = nextOptionValue;
                PubSub.publish('buttonClick', buttonEvent);
            }}
            className={classes}
        >
            {options[optionValue]}
        </div>;
    }
});

module.exports = OptionButton;
