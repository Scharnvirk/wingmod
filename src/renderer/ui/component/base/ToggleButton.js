import classnames from 'classnames';
import React from 'react';

var ToggleButton = React.createClass({
    getInitialState(){
        return {
            active: false
        };
    },
    render() {
        let classes = this.state.active ?
            classnames('button', ['button', 'buttonText', 'textLight', 'verticalSpacing', 'Oswald', 'noSelect']) :
            classnames('button', ['button', 'buttonText', 'textDark', 'verticalSpacing', 'Oswald', 'noSelect']);

        let onOffText = this.state.active ? 'ON' : 'OFF';

        let actionEvent = {
            actionEvent: this.props.actionEvent || 'noAction',
            state: this.state.active
        };

        return <div
            onClick={()=>{
                this.setState({active: !this.state.active});
                actionEvent.state = !actionEvent.state;
                PubSub.publish('componentAction', actionEvent);
            }}
            className={classes}
        >
            {this.props.text + ' ' + onOffText}
        </div>;
    }
});

module.exports = ToggleButton;
