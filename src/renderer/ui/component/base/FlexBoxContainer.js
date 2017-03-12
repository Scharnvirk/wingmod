import React, {Component} from 'react';

class FlexBoxContainer extends Component {
    constructor(props, context) {
        super(props, context);

        this.componentStyle = {
            container: {
                display: 'flex', 
                justifyContent: 'center', 
                position: 'absolute', 
                width: '100%', 
                height:'100%', 
                alignItems: 'center'
            }
        };
    }

    render() {
        return <div style={this.componentStyle.container}>
            {this.props.children}
        </div>;
    }
}

module.exports = FlexBoxContainer;
