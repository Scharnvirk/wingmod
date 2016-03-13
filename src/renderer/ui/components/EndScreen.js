import classnames from 'classnames';

var StyledText = require('renderer/ui/components/base/StyledText');

class EndScreen extends React.Component {
    render() {
        return <div className={classnames('class', ['centerHorizontal', 'centerVertical'])}>
            <StyledText style={'titleText'}>
                {'GAME OVER'}
            </StyledText>
            <StyledText style={'smallText'}>
                {this.props.scoreText}
            </StyledText>
        </div>;
    }
}

module.exports = EndScreen;
