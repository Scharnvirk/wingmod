import classnames from 'classnames';
import React from 'react';

class OptionButton extends React.Component {
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
                backgroundRepeat: 'none',
                filter: 'drop-shadow(3px 3px 3px #000)',
                textAlign: 'center',
                verticalAlign: 'middle',
                lineHeight: '6vmin',
                fontSize: '3vmin',
                letterSpacing: '0.5vmin',
                fontFamily: 'Oswald-Regular'
            }
        };

        this.state = {
            selectedOption: -1
        };
    }

    render() {
        let options = this.props.options || [];
        let optionValue = this.state.selectedOption >= 0 ? this.state.selectedOption : this.props.value;

        let actionEvent = {
            actionEvent: this.props.actionEvent || 'noAction',
            state: optionValue
        };

        return <div
            onClick={()=>{
                let nextOptionValue = optionValue >= options.length - 1 ? 0 : optionValue + 1;
                this.setState({selectedOption: nextOptionValue});
                actionEvent.state = nextOptionValue;
                PubSub.publish('componentAction', actionEvent);
            }}
            className={classnames('buttonHover')}
            style={Object.assign(this.componentStyle.button, this.props.style)}
        >
            {options[optionValue]}
        </div>;
    }
};

module.exports = OptionButton;
