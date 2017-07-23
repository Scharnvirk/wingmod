import classnames from 'classnames';
import React from 'react';

var StyledText = require('renderer/ui/component/base/StyledText');
var ReactUtils = require('renderer/ui/ReactUtils');

class StartHelp extends React.Component {
    render() {
        let acceptText = this.props.currentlyPaused ? 
                        ReactUtils.multilinize('GAME PAUSED!\n\nACCEPT POINTER LOCK TO CONTINUE!') :
                        'ACCEPT POINTER LOCK!';

        return <div style = {{bottom: '100px'}}>
            <div
                className={ classnames('class', ['centerHorizontal', 'topCenter', 'verticalSpacing']) }
            >
                <StyledText style={classnames('mediumText')}>
                    <span>{'CONTROLS:'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'WSAD: move the ship'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'Mouse left: fire primary weapon system'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'Mouse right: fire secondary weapon system'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'Q: change primary weapon, hold Q: drop primary weapon'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'E: change secondary weapon, hold E: drop secondary weapon'}</span>
                </StyledText>
            </div>

            <div
                className={ classnames('class', ['centerHorizontal', 'bottomCenter', 'verticalSpacing']) }
            >
                <StyledText style={classnames('mediumText', 'textBlink')}>
                    <span>{acceptText}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'CHROME: Just click.'}</span>
                </StyledText>
                <StyledText style={classnames('smallText', 'textDark')}>
                    <span>{'FIREFOX: Click and accept a popup dialog.'}</span>
                </StyledText>
            </div>

        </div>;
    }
}

module.exports = StartHelp;
