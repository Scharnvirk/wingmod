import classnames from 'classnames';
var PubSub = require('pubsub-js');

class Button extends React.Component {
    render() {
        let classes = classnames('button', ['button', 'buttonText', 'Oswald']);
        return <div
            onClick={()=>{
                PubSub.publish('buttonClick', 'start');
            }}
            className={classes}
        >
            {this.props.text}
        </div>;
    }
}

module.exports = Button;
