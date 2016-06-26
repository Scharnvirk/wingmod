import classnames from 'classnames';
var PubSub = require('pubsub-js');

var OptionButton = React.createClass({
    getInitialState(){
        return {
            selectedOption: this.props.defaultValue
        };
    },
    render() {
        let classes = classnames('button', ['button', 'buttonText', 'textLight', 'verticalSpacing', 'Oswald', 'noSelect']);

        let options = this.props.options || [];

        let buttonEvent = {
            buttonEvent: this.props.buttonEvent || 'noAction',
            state: this.state.selectedOption
        };

        PubSub.publish('buttonClick', buttonEvent);

        return <div
            onClick={()=>{
                let nextOptionValue = this.state.selectedOption >= options.length - 1 ? 0 : this.state.selectedOption + 1;
                this.setState({selectedOption: nextOptionValue});
                buttonEvent.state = nextOptionValue;
                PubSub.publish('buttonClick', buttonEvent);

            }}
            className={classes}
        >
            {options[this.state.selectedOption]}
        </div>;
    }
});

module.exports = OptionButton;
