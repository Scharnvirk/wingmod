import classnames from 'classnames';
import React from 'react';

var Window = require('renderer/ui/component/base/Window');
var FlexBoxContainer = require('renderer/ui/component/base/FlexBoxContainer');
var EndGamePanel = require('renderer/ui/component/endGame/EndGamePanel');
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
            </div>

            <Window title='RESULTS'>
                <EndGamePanel enemyCausingDeathIndex={this.props.enemyCausingDeathIndex} killStats={this.props.killStats} />
            </Window> 
        </FlexBoxContainer>;
    }
}

module.exports = EndScreen;
