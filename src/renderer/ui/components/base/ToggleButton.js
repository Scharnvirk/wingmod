import classnames from 'classnames';
var PubSub = require('pubsub-js');

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

        let buttonEvent = {
            buttonEvent: this.props.buttonEvent || 'noAction',
            state: this.state.active
        };

        return <div
            onClick={()=>{
                this.setState({active: !this.state.active});
                buttonEvent.state = !buttonEvent.state;
                PubSub.publish('buttonClick', buttonEvent);
            }}
            className={classes}
        >
            {this.props.text + ' ' + onOffText}
        </div>;
    }
});

module.exports = ToggleButton;
