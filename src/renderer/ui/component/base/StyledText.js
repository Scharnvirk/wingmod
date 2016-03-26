import classnames from 'classnames';

class StyledText extends React.Component {
    render() {
        let classes = classnames('title', [this.props.style, 'Oswald', 'noSelect']);
        return <div className={classes}>
            {this.props.children}
        </div>;
    }
}

module.exports = StyledText;
