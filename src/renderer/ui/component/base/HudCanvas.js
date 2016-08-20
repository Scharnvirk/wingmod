import classnames from 'classnames';
import React from 'react';


class HudCanvas extends React.Component {

    constructor(properties) {
        super(properties);

        Object.assign(this, properties);

        var documentWidth = document.documentElement.clientWidth;
        var documentHeight = document.documentElement.clientHeight;

        this.width = this.width || documentWidth;
        this.height = this.height || documentHeight;
    }

    render() {
        return <canvas
            id = {'hudCanvas'}
            width = {this.width}
            height = {this.height}
            className = {classnames('class', ['hud'])}
        />;
    }
}

module.exports = HudCanvas;
