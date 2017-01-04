import classnames from 'classnames';
import React from 'react';
 
class Message extends React.Component {
    render() {
        let classes = classnames('title', [this.props.style, 'Oswald', 'noSelect']);
        return <div className={classes}>
            {<div>{this.props.children}</div>}            
        </div>;
    }
}

module.exports = Message;
