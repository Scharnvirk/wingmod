import classnames from 'classnames';
import React from 'react';


class Viewport extends React.Component {
    render() {
        return <div id={'viewport'} className={classnames('class', ['fullScreen', 'allPointerEvents', 'noSelect']) } >
            {this.props.children}
        </div>;
    }
}

module.exports = Viewport;
