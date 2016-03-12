import classnames from 'classnames';

var ToggleButton = React.createClass({
    getInitialState(){
        return {
            active: false
        };
    },
    render() {
        let classes = classnames('button', ['button', 'buttonText', 'Oswald']);
        return <div
            onClick={()=>{
                PubSub.publish('buttonToggle', 'toggle');
            }}
            className={classes}
        >
            {this.props.text}
        </div>;
    }
});

module.exports = ToggleButton;
