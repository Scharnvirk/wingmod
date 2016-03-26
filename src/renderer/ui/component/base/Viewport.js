import classnames from 'classnames';

class Viewport extends React.Component {
    render() {
        return <div id={'viewport'} className={classnames('class', ['fullScreen', 'allPointerEvents', 'noSelect']) } />;
    }
}

module.exports = Viewport;
