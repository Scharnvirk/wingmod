import classnames from 'classnames';
import React from 'react';


var StyledText = require('renderer/ui/component/base/StyledText');

class EndScreen extends React.Component {
    render() {
        return <div className={classnames('class', ['centerHorizontal', 'centerVertical'])}>
            <StyledText style={'titleText'}>
                {this.props.bigText}
            </StyledText>
            <StyledText style={'smallText'}>
                {this.props.scoreText}
            </StyledText>
            <StyledText style={'smallText'}>
                {'Press F5 to restart'}
            </StyledText>
        </div>;
    }
}

module.exports = EndScreen;
