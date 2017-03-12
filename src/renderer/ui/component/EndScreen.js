import classnames from 'classnames';
import React from 'react';

var FlexBoxContainer = require('renderer/ui/component/base/FlexBoxContainer');
var EndGameWindow = require('renderer/ui/component/endGame/EndGameWindow');
var StyledText = require('renderer/ui/component/base/StyledText');

class EndScreen extends React.Component {
    render() {
        return <FlexBoxContainer>
            <div className={classnames('class', ['centerHorizontal'])}>
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
            <EndGameWindow enemyCausingDeathIndex={this.props.enemyCausingDeathIndex} killStats={this.props.killStats} />
        </FlexBoxContainer>;
    }
}

module.exports = EndScreen;
