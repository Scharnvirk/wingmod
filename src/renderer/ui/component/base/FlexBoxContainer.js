import React, {Component} from 'react';

class FlexBoxContainer extends Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {
            container: {
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-around', 
                position: 'absolute', 
                width: '100%', 
                height:'100%', 
                alignItems: 'center'
            }
        };
    }

    render() {
        const style = Object.assign(this.componentStyle.container, this.props.style);
        console.log(style);
        return <div style={style}>
            {this.props.children}
        </div>;
    }
}

module.exports = FlexBoxContainer;
